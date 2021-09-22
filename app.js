'use strict'

const express = require('express')
const path = require('path')
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
  sendEmail(provider_email, html) {
    console.log(provider_email)
    console.log(html)
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
      this.sendEmail(provider.email, html)
      c++
    }
    return c
  }
}

class ClientDataSaver {
  constructor(form_data) {
    this.form_data = form_data
  }
  saveRecord(rec) {
    console.log(JSON.stringify(rec))
  }
  doSave() {
    // UTC, must convert to Memphis timezone when sending out.
    let now = new Date()
    for (let provider of this.form_data.providers) {
      let zip = 'Not provided' 
      if (this.form_data.client_data.zip_code) {
        zip = this.form_data.client_data.zip_code
      }
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

module.exports = app
