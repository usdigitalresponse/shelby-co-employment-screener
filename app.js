'use strict'

const express = require('express')
const path = require('path')
const db = require('./firestore')
const stringify = require('csv-stringify/lib/sync')
const {google} = require('googleapis');

const gmail = google.gmail('v1');

const app = express()

app.use(express.static(path.join(__dirname, 'www')))

const bodyParser = require('body-parser')
app.use(express.urlencoded({ extended: true }))

// These cause a warning when the server starts up, but seem to work fine (for now).
// "body-parser deprecated undefined extended: provide extended option app.js:..."
app.use(bodyParser.json())
app.use(bodyParser.urlencoded())

const PORT = process.env.PORT || 8080

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'www/index.html'))
})

function isProduction(req) {
  return req.get('host').includes('shelby-co-emp-screener-prod');
}

app.post('/sendemails', (req, res) => {
  try {
    let c = new ProviderEmailer(req.body).sendEmails()
    new ClientDataSaver(req.body).doSave()
    let ret;
    if (isProduction(req)) {
      ret = '[Not implemented yet.]'
    } else {
      ret = '[Emails not sent. You are using a non-production site: ' + req.get("host") + ']'    
    }
    res.send('<i>' + ret + '</i><br/><span>' + c + ' emails.' + '</span>');
  } catch (e) {
    res.send(JSON.stringify(e))
  }
})

app.get('/dboverview', (req, res) => {
  try {
    new ClientDataSaver(req.body).overview(function resolve(data) {
      res.send(data);
    });
  } catch (e) {
    res.send(JSON.stringify(e))
  }
})

app.get('/testemail', (req, res) => {
  try {
    new Emailer().sendEmail('chris.keith@gmail.com', 'chris.keith@gmail.com',
                            'workforce.midsouth@gmail.com', 'test body');
    res.send('new Emailer(); done');
  } catch (e) {
    res.send(JSON.stringify(e))
  }
})

app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`)
})

app.get('/listBuckets', function(req, res) {
  if (isProduction(req)) {
    res.send('Not available.')
  } else {
    listBuckets(function(data) {
      res.send(data);
    })
  }
})

const listBuckets = async function(resolve) {
  let ret = 'Buckets:<br/>';
  try {
    const {Storage} = require('@google-cloud/storage');
    const storage = new Storage();
    const results = await storage.getBuckets();
    const [buckets] = results;
    buckets.forEach(bucket => {
      ret += bucket.name
      ret += '<br/>';
    });
} catch (err) {
    ret = 'ERROR:' + err;
  }
  resolve(ret);
}

class Emailer {
  constructor() {
    this.setupCredentials();
  }
  async setupCredentials() {
    const auth = new google.auth.GoogleAuth({
      scopes: [
        'https://mail.google.com/',
        'https://www.googleapis.com/auth/gmail.modify',
        'https://www.googleapis.com/auth/gmail.compose',
        'https://www.googleapis.com/auth/gmail.send',
      ],
    });
    const authClient = await auth.getClient();
    google.options({auth: authClient});
  }
  async sendEmail(to, from, userId, html) {
    const messageParts = [
      'From: ' + from,
      'To: ' + to,
      'Content-Type: text/html; charset=utf-8',
      'MIME-Version: 1.0',
      `Subject: I would like to enroll in your employment assistance services`,
      '',
      html,
    ];
    const message = messageParts.join('\n');
  
    // The body needs to be base64url encoded.
    const encodedMessage = Buffer.from(message)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  
    const res = await gmail.users.messages.send({
      userId: userId,
      requestBody: {
        raw: encodedMessage,
      },
    });
    return res;
  }
}
let emailer = new Emailer();

class ProviderEmailer {
  constructor(form_data) {
    this.form_data = form_data
  }
  build_client_html(client_data, client_id_data) {
    let html = '<ul><li>Name: ' + client_id_data.name
    let ph = '<i>Not provided</i>'
    if (client_id_data.phone) {
      ph = client_id_data.phone
    }
    html += '<li>Phone: ' + ph
    let zip = '<i>Not provided</i>'
    if (client_data.zip_code) {
      zip = client_data.zip_code
    }
    html += '<li>Zip code: ' + zip + '</li>'
    html += '<li>Race: ' + client_data.race + '</li>'
    html += '<li>Age: ' + client_data.age_range + '</li>'
    html += '<li>Education: ' + client_data.education_level + '</li>'
    html += '<li>Employment status: ' + client_data.work_status + '</li>'
    html += '<li>Disabled status: ' + client_data.disabilities + '</li>'
    html += '<li>Criminal history: ' + client_data.criminal_history + '</li>'
    html += '<li>Legal resident: ' + client_data.legal_resident + '</li>'
    html += '<li>English language: ' + client_data.english_lang + '</li>'
    html += '</ul>'
    return html
  }
  sendEmails() {
    let html = '<p>I would like to enroll in your employment assistance services ' +
              '(e.g., job training, job readiness skills). ' + 
              'Please contact me so I can find out how to enroll.</p>' +
              '<p>Here is my contact and personal information:</p>' +
              this.build_client_html(this.form_data.client_data,
                                    this.form_data.client_id_data) +
              '<p>Thank you.</p>' +
              '<br/><p><i>Email generated by</i></p>'
    let c = 0
    for (let provider of this.form_data.providers) {
//      emailer.sendEmail(provider.email, this.form_data.client_id_data.email, 'workforce.midsouth@gmail.com', html)
      c++
    }
    return c
  }
}

class ClientDataSaver {
  constructor(form_data) {
    this.form_data = form_data
  }
  async saveRecord(rec) {
    const book = await db.create(rec)
    console.log('Saved: ' + JSON.stringify(book))
  }
  async overview(resolve) {
    const snapshot = await db.getSnapshot() 
    let s = 'Total records: ' + snapshot.size + '<br/><br/>' +
        'timestamp,provider,zip code,race,age range,education level,employment status,disabilities,criminal history,legal resident,english lang,id<br/>'
    snapshot.forEach(function toCSV(doc) {
      let rec = doc.data()
      let ts
      if (rec.timestamp) {
        ts = new Date(rec.timestamp).toDateString()
      } else {
        ts = 'unknown timestamp'
      }
      let arr = [
        ts,
        rec.provider,
        rec.zip_code,
        rec.race,
        rec.age_range,
        rec.education_level,
        rec.employment_status,
        rec.disabilities,
        rec.criminal_history,
        rec.legal_resident,
        rec.english_lang,
        doc.id
      ]
      s += stringify([arr]).replace('\n', '') + '<br/>'
    })
    resolve(s)
  }
  doSave() {
    let now = new Date().getTime()
    for (let provider of this.form_data.providers) {
      let zip = 'Not provided' 
      if (this.form_data.client_data.zip_code) {
        zip = this.form_data.client_data.zip_code
      }
      if (!provider.name) {
        console.log('No provider name: ' + JSON.stringify(provider))
      } else {
        let record = {
          'timestamp' : now,
          'provider' : provider.name,
          'zip_code' : zip,
          'race' :  this.form_data.client_data.race,
          'age_range' : this.form_data.client_data.age_range,
          'education_level' : this.form_data.client_data.education_level,
          'employment_status' : this.form_data.client_data.work_status,
          'disabilities' : this.form_data.client_data.disabilities,
          'criminal_history' : this.form_data.client_data.criminal_history,
          'legal_resident' : this.form_data.client_data.legal_resident,
          'english_lang' : this.form_data.client_data.english_lang
        }
        this.saveRecord(record)
      }
    }
  }
}

module.exports = app
