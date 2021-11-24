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
 
app.post('/sendemails', (req, res) => {
    try {
//      let c = new ProviderEmailer(req.body).sendEmails()
      new ClientDataSaver(req.body).doSave()
      let ret;
      res.send('<i>' + ret + '</i><br/><span>' + c + ' emails.' + '</span>');
    } catch (e) {
      res.send(JSON.stringify(e))
    }
  }
)
 
app.get('/dbquery', (req, res) => {
  try {
    new ClientDataSaver(req.body).overview(function resolve(data) {
      res.send(data);
    }, req);
  } catch (e) {
    res.send(JSON.stringify(e))
  }
})
 
app.get('/dbdelete', (req, res) => {
  res.send('Disabled')
/*
    try {
      let cds = new ClientDataSaver(req.body)
      cds.delete(req.query, function resolve(data) {
        res.send(data)
      });
    } catch (e) {
      res.send(JSON.stringify(e))
    }
  }
*/
})

app.get('/dbclear', (req, res) => {
    res.send('Disabled')
/*
    try {
      let cds = new ClientDataSaver(req.body)
      cds.clear(function resolve(data) {
        res.send(data)
      });
    } catch (e) {
      res.send(JSON.stringify(e))
    }
*/
})

 app.get('/testemail', (req, res) => {
  res.send('Disabled')
/*
    try {
      let em = new Emailer();
      em.setupCredentials(function resolve(retVal) {
        console.log(retVal);
      })
      em.sendEmail('workforce.midsouth@gmail.com',
                              'workforce.midsouth@gmail.com',
                              'workforce.midsouth@gmail.com',
                              'test body',
                              function resolve(retVal) {
                                res.send(retVal.message);
                              });
    } catch (e) {
      res.send(JSON.stringify(e))
    }
  }
*/
})
 
app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`)
})
 
app.get('/listBuckets', function(req, res) {
  res.send('Not available.')
/*
  listBuckets(function(data) {
      res.send(data);
    }, req)
  }
*/
})
 
const listBuckets = async function(resolve, req) {
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
  async setupCredentials(resolve) {
    try {
      const auth = new google.auth.GoogleAuth({
        scopes: [
          'https://mail.google.com/',
          'https://www.googleapis.com/auth/gmail.addons.current.action.compose',
          'https://www.googleapis.com/auth/gmail.compose',
          'https://www.googleapis.com/auth/gmail.modify',
          'https://www.googleapis.com/auth/gmail.send',
       ],
      });
      const authClient = await auth.getClient().catch(
        function resolveX(err) {
          resolve(err)
        });
      google.options({auth: authClient});
    } catch(caughtErr) {
      resolve(caughtErr);
    }
    resolve('setupCredentials(): succeeded')
  }
  async sendEmail(to, from, userId, html, resolve) {
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
 
    var resx = await gmail.users.messages.send({
      userId: userId,
      requestBody: {
        raw: encodedMessage,
      },
    }).catch(err => resx = err);
    resolve(resx);
  }
}
 
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
//      let emailer = new Emailer();
//      ... fill this in if permission error is ever fixed.
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
  checkDate(monthYear) {
    let re = /\d\d\d\d-\d\d/
    if (!monthYear.match(re)) {
      return false
    }
    let substrs = monthYear.split('-')
    let monthInt = parseInt(substrs[1])
    return ((monthInt > 0) && (monthInt < 13))  
  }
  async overview(resolve, http_req) {
    let req_query = http_req.query
    let snapshot
    if (req_query && req_query['month']) {
      if (!this.checkDate(req_query['month'])) {
        resolve(req_query['month'] + ': must be in YYYY-MM format. Months are 01 to 12.')
        return
      }
      snapshot = await db.getSnapshotForMonth(req_query['month'])
    } else {
      snapshot = await db.getSnapshot()
    }
    let s = ''
    let c = 0
    snapshot.forEach(function toCSV(doc) {
      let rec = doc.data()
      let ts
      if (rec.timestamp) {
        ts = new Date(rec.timestamp).toDateString()
        if (ts !== 'Invalid Date') {
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
          c += 1
        }
      }
    })
    let host = http_req.get('host').toLowerCase()
    let title = '<span>Total records:</span> ' + c + '<br/>[' + host + ']<br/></br>'
    title += 'timestamp,provider,zip code,race,age range,education level,employment status,disabilities,' +
        'criminal history,legal resident,english lang,id<br/>'
    resolve(title + s)
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
  async delete(req_query, resolve) {
    if (req_query['id']) {
      await db.deleteRec(req_query['id'])
      const snapshot = await db.getSnapshot()
      resolve('<span>Total records:</span> ' + snapshot.size + '<br/><br/>')
    } else {
      resolve('Missing id')
    }
  }
  async clear(resolve) {
    let snapshot = await db.getSnapshot()
    let ids = []
    snapshot.forEach(function delete_it(doc) {
      ids.push(doc.data().id)
    })
    for (let id of ids) {
      await db.deleteRec(id)
    }
    resolve('All data (' + ids.length + ' records) deleted from database.')
  }
}
 
module.exports = app