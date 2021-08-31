$(document).ready(function() {
  let selection_handler = new SelectionHandler();
  for (let i = 0; i < 5; i++) {
    $('#next' + i).click(function() {
      selection_handler.handle();
    });
  }
  for (let id of selection_handler.question_form_ids) {
    $("#" + id).submit(function(event) {
      let alert_message = 'Please chose one item.';
      let val;
      switch (id) {
        case 'zip_code':
          if (document.getElementById('no_zip').checked) {
            alert_message = '';
          } else {
            let zip = $("input").first().val();
            if (zip) {
              if (selection_handler.check_zip_code(zip)) {
                selection_handler.client_data.zip_code = zip;
                alert_message = '';
              } else {
                alert_message = 'Please specify a zip code within Shelby county.'
              }
            }
          }
          break;
        case 'client_needs':
          val = $('input[name=' + id + ']:checked', '#' + id).parent().text();
          if (val) {
            // Hack: remove extra spaces added to make radio button display look better. See append_radios().
            selection_handler.client_data.client_needs = val.substring(2);
            alert_message = '';
          }
          break; 
        case 'client_age':
          val = $('input[name=' + id + ']:checked', '#' + id).parent().text();
          if (val) {
            selection_handler.client_data.age_range = val.substring(2);
            alert_message = '';
          }
          break; 
        case 'client_education':
          val = $('input[name=' + id + ']:checked', '#' + id).parent().text();
          if (val) {
            selection_handler.client_data.age_range = val.substring(2);
            alert_message = '';
          }
          break;    
        case 'criminal_history':
          val = $('input[name=' + id + ']:checked', '#' + id).parent().text();
          if (val) {
            selection_handler.client_data.criminal_history = val.substring(2);
            alert_message = '';
          }
          break;    
        case 'race':
          val = $('input[name=' + id + ']:checked', '#' + id).parent().text();
          if (val) {
            selection_handler.client_data.race = val.substring(2);
            alert_message = '';
          }
          break;
        case 'gender':
          val = $('input[name=' + id + ']:checked', '#' + id).parent().text();
          if (val) {
            selection_handler.client_data.gender = val.substring(2);
            alert_message = '';
          }
          break; 
        case 'legal_resident':
          val = $('input[name=' + id + ']:checked', '#' + id).parent().text();
          if (val) {
            selection_handler.client_data.legal_resident = val.substring(2);
            alert_message = '';
          }
          break;
        case 'disabilities':
          val = $('input[name=' + id + ']:checked', '#' + id).parent().text();
          if (val) {
            selection_handler.client_data.disabilities = val.substring(2);
            alert_message = '';
          }
          break; 
        case 'english_lang':
          val = $('input[name=' + id + ']:checked', '#' + id).parent().text();
          if (val) {
            selection_handler.client_data.english_lang = val.substring(2);
            alert_message = '';
          }
          break; 
          case 'work_status':
          val = $('input[name=' + id + ']:checked', '#' + id).parent().text();
          if (val) {
            selection_handler.client_data.work_status = val.substring(2);
            alert_message = '';
          }
          break; 
        }
      if (alert_message) {
        alert(alert_message);
      } else {
        selection_handler.handle();
      }
      event.preventDefault();
    });
  }
  selection_handler.handle();
});

class SelectionHandler {
  constructor() {
    this.demo_new_features = window.location.href.includes('-demo-new-features');
    this.current_content_index = -1;
    this.content_classes = [ 'intro', 'q_client_needs', 'q_zip_code', 'q_client_age', 'q_client_education',
                             'q_race', 'q_work_status', 'q_english_lang',
                             'q_disabilities',  'q_legal_resident',
                             'q_criminal_history', 'matches' ];
    this.question_form_ids = [ 'client_needs', 'client_education',
                               'client_age', 'criminal_history',
                               'zip_code', 'race',
                               'gender', 'legal_resident', 'disabilities', 'work_status',
                               'english_lang' ];
    this.client_data = {
      needs : null,
      zip_code : null,
      race : null,
      gender : null,
      age_range : null,
      education_level : null,
      work_status : null,
      disabilities : null,
      evicted : null,
      criminal_history : null,
      legal_resident : null,
      english_lang : null
    } 
    this.client_needs = [
      "I need help finding a job",
      "I want more skill training to find a better job",
      "I want to go back to school to get my diploma or GED",
      "I want to get an Associate or Bachelor's degree"
    ]    
    this.race_types = [
      "African American", "White", "Hispanic or Latino",
      "American Indian or Alaskan Native", "Chinese", "Vietnamese", 
      "Filipino", "Korean", "Asian Indian", "Japanese", "Other Asian", 
      "Some other race"
    ]    
    this.gender_types = [
      "Male", "Female", "Non-binary"
    ] 
    this.client_age_ranges = [
      "Younger than 18", "18-30", "Older than 30"
    ]
    this.education_levels = [
      "No high school diploma or equivalent (for example: no GED)",
      "High school graduate, diploma or equivalent (for example: GED)",
      "Some college credit or trade/technical/vocational training",
      "Associate degree",
      "Bachelor’s degree",
      "Advanced degree (above Bachelor's)",
    ]    
    this.work_status = [
      "Unemployed",
      "Part-time (less than 32  hours at one or two jobs)",
      "Full-time(32+ hours at one job)",
      "Student",
      "Other"
    ]
    this.client_criminal_history = [
      "Yes",
      "No",
      "Prefer not to say"
    ]
    this.legal_resident = [
      "Yes",
      "No",
      "Prefer not to say"
    ]
    this.english_lang = [
      "Yes",
      "No"
    ]
    this.disabilities = [
      "D/deaf",
      "Hard of hearing",
      "My disability is not listed",
      "I prefer not to say",
      "I do not have a disability"
    ]
    // Data extracted from a Google sheet.
    // See Google Scripts in utilities/ directory.
    // There have been, however, manual corrections and additions.
    this.provider_data = {
      "Shelby County Office of Reentry": {
        "website": "https://reentry.shelbycountytn.gov/contact",
        "services": [
          "Job training",
          "Employability/job readiness skills (e.g., making a resume)",
          "Supportive services (e.g., housing)",
          "Certifications"
        ],
        "client_qualifications": "Person that are criminal justice involved/formerly incarcerated",
        "phone_number": "",
        "location": "",
        "gmap_link": "",
        "email" : '',
        "client_characteristics" : {
          "criminal_history" : [ "Yes", "Prefer not to say" ]
        }
      },
      "Shelby County Division of Community Services": {
        "website": "https://shelbycountytn.gov/16/Community-Services",
        "services": [
          "Supportive services (e.g., housing)"
        ],
        "client_qualifications": "",
        "phone_number": "901-222-3990",
        "location": "160 N. Main St., 2nd Floor, Memphis, TN 38103",
        "gmap_link": "https://goo.gl/maps/SqaAW6BpG7QfSKEA9",
        "email" : "CommunityServicesInfo@shelbycountytn.gov"

      },
      "Tech901": {
        "website": "https://tech901.org",
        "services": [
          "Job training",
          "Employability/job readiness skills (e.g., making a resume)"
        ],
        "client_qualifications": "Adults in the Memphis area",
        "phone_number": "901-881-2677",
        "location": "1350 Concourse Ave. Suite 375, Memphis, TN  38104",
        "gmap_link": "https://goo.gl/maps/BQD4MD8iPXkVA2ws9",
        "email" : "",
        "client_characteristics" : {
          "age_range" : [ "18-30", "Older than 30" ]
        }

      },
      "The Collective Blueprint": {
        "website": "https://changeiscollective.org/contact-us",
        "services": [
          "Job training",
          "Job placement",
          "Employability/job readiness skills (e.g., making a resume)",
          "Supportive services (e.g., housing)",
          "Certifications"
        ],
        "client_qualifications": "18-30 year olds who are / have been out of school and work ",
        "phone_number": "",
        "location": "",
        "gmap_link": "",
        "email" : "apply@thememphiscollective.org",
        "client_characteristics" : {
          "age_range" : [ "18-30" ] ,
          "work_status" : [ "Unemployed" ]
        }
      },
      "Greater Memphis Financial Empowerment Center & Bank on Memphis Coalition": {
        "website": "http://www.gmfec.org/contact.html", // ; https://www.bankonmemphis.org",
        "services": [
          "Financial counseling"
        ],
        "client_qualifications": "18+ Shelby County Residents",
        "phone_number": "901-390-4200",
        "location": "1355 Lynnfield Rd, Bldg B, Ste 101, Memphis TN",
        "gmap_link": "https://goo.gl/maps/97gjxQYXmWvpGnE37",
        "client_characteristics" : {
          "age_range" : [ "18-30", "Older than 30" ]
        }

      },
      "Goodwill Excel Center Midsouth Inc.": {
        "website": "https://www.goodwillmemphis.org/theexcelcenter",
        "services": [
          "Job placement",
          "Literacy (reading and/or writing)",
          "Employability/job readiness skills (e.g., making a resume)",
          "Access to technology",
          "Supportive services (e.g., housing)",
          "Education - high school",
          "Certifications"
        ],
        "client_qualifications": "Shelby County",
        "phone_number" : "901-323-6221",
        "email" : "info@excelcentermemphis.org",
        "location" : "6895 Stage Road, Memphis, TN 38133",
        "gmap_link" : "https://goo.gl/maps/mknsLfa5qPEQYdoH9"

      },
      "DeafConnect of the Mid-South, Inc.": {
        "website": "http://www.deafconnectmidsouth.org/",
        "services": [
          "Employability/job readiness skills (e.g., making a resume)",
          "Supportive services (e.g., housing)"
        ],
        "client_qualifications": "D/deaf and Hard of Hearing community",
        "phone_number" : "901-278-9307",
        "location" : "6045 Shelby Oaks Dr., Memphis, TN 38134",
        "gmap_link" : "https://goo.gl/maps/6n2XZUChBm7sWwDG6",
        "email" : "Scheduling@DeafConnect.org",
        "client_characteristics" : {
          "disabilities" : ["D/deaf", "Hard of hearing" ]
        }
      },
      "HopeWorks": {
        "website": "https://www.whyhopeworks.org/contact/",
        "services": [
          "Job training",
          "Job placement",
          "Education - GED",
          "Employability/job readiness skills (e.g., making a resume)",
          "Financial counseling",
        ],
        "client_qualifications": "Generational Poverty, Incarceration, High School Drop Outs",
        "phone_number": "901-272-3700",
        "location": "3334 Summer Ave., Memphis, TN 38122",
        "gmap_link": "https://goo.gl/maps/TTUpwBfe2BFApKCFA",
        "email" : "",
        "client_characteristics" : {
          "criminal_history" : [ "Yes", "Prefer not to say" ]
        }
      },
      "2Unique Community Salvation Foundation ": {
        "website": "https://www.2unique-csf.org",
        "services": [
          "Job training",
          "Job placement",
          "Employability/job readiness skills (e.g., making a resume)",
          "Supportive services (e.g., housing)",
          "Networking",
          "Financial counseling",
          "Mentorship"
        ],
        "client_qualifications": "Youth, non-college, hs dropouts ",
        "phone_number" : "901-489-2386",
        "location" : "Hickory Ridge Mall, C. D. Corporation 3743 S. Hickory Ridge Mall, Suite 494 Memphis, TN 38115",
        "gmap_link" : "https://goo.gl/maps/GkfpfKmG2hNR4dTEA",
        "email" : "",
        "client_characteristics" : {
          "age_range" : [ "Younger than 18" ],
          "education_level" : [ "No high school diploma or equivalent (for example: no GED)" ]
        }
      },
      "M I C A H  - Memphis Interfaith Coalition for Action and Hope": {
        "website": "https://www.micahmemphis.org/",
        "services": [
          "Supportive services (e.g., housing)",
          "Networking",
          "Financial counseling",
          "Education - high school"
        ],
        "client_qualifications": "Our current platform concentrates on three pillar issues, economic equity, education equity, and race & class equity in the justice system. The purpose of MICAH is not to replace each congregation or community organization's efforts, but instead to amplify the voice and the impact by working together interdependently. ",
        "phone_number": "",
        "location": "",
        "gmap_link": "",
        "email" : "info@micahmemphis.org"
      },
      "Kingdom Community Builders": {
        "website": "https://www.facebook.com/KingdomCommunityBuilders",
        "services": [
          "Literacy (reading and/or writing)"
        ],
        "client_qualifications": "We serve a particular African-American community in Memphis",
        "phone_number": "",
        "location": "",
        "gmap_link": "",
        "email": "dongilbert876@gmail.com",
        "client_characteristics" : {
          "race_types" : [ "African American" ],
        }
      },
      "World Relief Memphis": {
        "website": "https://worldreliefmemphis.org/",
        "services": [
          "Job placement",
          "Literacy (reading and/or writing)",
          "Employability/job readiness skills (e.g., making a resume)",
          "Supportive services (e.g., housing)"
        ],
        "client_qualifications": "World Relief Memphis (WRM) serves Refugees and other Office of Refugee Resettlement (ORR) eligible immigrants. (Refugees, Asylees, Cuban/Haitian Entrants, Victims of Human Trafficking, Special Immigrant Visas, Amerasians) ",
        "phone_number": "901-341-0220",
        "location": "5340 Quince Rd, Suite A, Memphis, TN 38119",
        "gmap_link": "https://goo.gl/maps/1ZwTYKFw6pPdPvQS6",
        "email" : "",
        "client_characteristics" : {
          "legal_resident" : [ "No" ],
        },
              // client_characteristics are exclusive.
              // E.g., age_range === Younger than 18 AND education_level === whatever will filter down providers.
              // inclusive_characteristics are, well, inclusive.
              // E.g., if client has english_lang === No, this provider will be included
              // regardless of other client_characteristics.
        "inclusive_characteristics" : {
          "english_lang" : [ "No"]
        }
      },
      "Priority Teachers University": {
        "website": "http://www.priorityteachersuniversity.com/Contact.html",
        "services": [
          "Job training",
          "Job placement",
          "Literacy (reading and/or writing)",
          "Employability/job readiness skills (e.g., making a resume)",
          "Financial counseling",
          "Education - GED"
        ],
        "client_qualifications": "",
        "phone_number" : "901-209-2342",
        "location" : "2124 Democrat Rd, Memphis, TN 38132",
        "gmap_link" : "https://goo.gl/maps/ktcDgiC629pJKdKH9",
        "email": "priorityteachersuniversity@gmail.com",
      },
      "RIVERVIEW-KANSAS COMMUNITY DEVELOPMENT CORPORATION": {
        "website": "https://www.memphishcd.org/chdo/riverview/index.html",
        "services": [
          "Supportive services (e.g., housing)",
          "Total services indicated"
        ],
        "client_qualifications": "",
        "phone_number": "901-314-7866",
        "location": "1374 Elvis Presley Blvd., Ste 104, Memphis, TN 38116",
        "gmap_link": "https://goo.gl/maps/LthKF5u9R6fZefKx8",
        "email" : "riverviewkansas@cavtel.net"
      },
      "RISE Foundation, Inc.": {
        "website": "http://risememphis.org/contact/",
        "services": [
          "Financial counseling",
          "Mentorship"
        ],
        "client_qualifications": "under-served community in 38126 ranging from 5th grade to senior citizens ",
        "phone_number": "901-507-6644",
        "location": "1355 Lynnfield Rd, Building B, Suite 101, Memphis, Tennessee 38119",
        "gmap_link": "https://goo.gl/maps/V1HQbnSMvDxuX32y8",
        "email" : "",
        "client_characteristics" : {
          "zip_code" : [ "38126" ]
        }
      },
      "A Fresh Start to a New Beginning": {
        "website": "https://afreshstarttoanewbeginning.org/?page_id=424",
        "services": [
          "Job training",
          "Job placement",
          "Employability/job readiness skills (e.g., making a resume)",
          "Access to technology",
          "Supportive services (e.g., housing)",
          "Financial counseling",
          "Education - GED"
        ],
        "client_qualifications": "Formerly incarcerated adults",
        "phone_number" : "901-690-0327",
        "location" : "",
        "gmap_link" : "",
        "email": "afreshstarttoanewbeginning@yahoo.com",
        "client_characteristics" : {
          "criminal_history" : [ "Yes", "Prefer not to say" ]
        }
      },
      "BLDG Memphis": {
        "website": "https://www.bldgmemphis.org/",
        "services": [],
        "client_qualifications": "N/A ",
        "phone_number": "901-725-0460",
        "location": "1680 Jackson Avenue, Memphis, Tennessee 38107",
        "gmap_link": "https://goo.gl/maps/c2iVqP7pBXv6Z57r6",
        "email" : ""
      },
      "Greater Whitehaven Economic Redevelopment Corporation": {
        "website": "https://www.gwercmemphis.org",
        "services": [
          "Job training",
          "Job placement",
          "Employability/job readiness skills (e.g., making a resume)",
          "Financial counseling",
          "Mentorship",
          "Certifications"
        ],
        "client_qualifications": "Residents and stakeholders in 38116 and 38109",
        "phone_number": "901-605-8213",
        "location": "4466 Elvis Presley Boulevard Suite 216, Memphis, TN",
        "gmap_link": "https://goo.gl/maps/ms4R9j5ZicjL1UXS7",
        "email" : "info@gwercmemphis.org",
        "client_characteristics" : {
          "zip_code" : [ "38116", "38109" ]
        }
      },
      "Persevere": {
        "website": "https://www.perseverenow.org",
        "services": [
          "Job training",
          "Job placement",
          "Employability/job readiness skills (e.g., making a resume)",
          "Supportive services (e.g., housing)",
          "Financial counseling",
          "Certifications"
        ],
        "client_qualifications": "",
        "phone_number": "877-260-7299",
        "location": "",
        "gmap_link": "",
        "email" : "info@perseverenow.org"
      },
      "Leadership Memphis": {
        "website": "https://leadershipmemphis.org/contact-us/", //; https://www.volunteermemphis.org",
        "services": [
          "Networking"
        ],
        "client_qualifications": "Na",
        "phone_number": "901-278-0016",
        "location": "240 Madison Ave Suite 601, Memphis TN 38103",
        "gmap_link": "https://goo.gl/maps/arKxLr7xC8DoVSv58",
        "email" : "info@leadershipmemphis.org"
      },
      "Refuge Memphis": {
        "website": "https://refuge-memphis.org/contact/",
        "services": [
          "Financial counseling",
          "Mentorship"
        ],
        "client_qualifications": "",
        "phone_number": "901-410-8724",
        "location": "3171 Signal Street, Memphis, TN 38127, US",
        "gmap_link": "https://goo.gl/maps/ApBpdhUxtpDHxkXe6",
        "email" : ""
      },
      "Let's Innovate Through Education (LITE Memphis)": {
        "website": "https://litememphis.org/contact-us",
        "services": [
          "Job training",
          "Education - high school"
        ],
        "client_qualifications": "African American and Latinx High School Students",
        "phone_number": "901-634-0001",
        "location": "88 Union Ave 6th Floor, Memphis, TN 38103",
        "gmap_link": "https://goo.gl/maps/gnpWyySQ5ABVKkv26",
        "email" : "",
        "client_characteristics" : {
          "race" : [ "African American", "Hispanic or Latino" ],
          "education_level" : [ "No high school diploma or equivalent (for example: no GED)" ]
        }
      },
      "Power Center CDC": {
        "website": "http://powercentercdc.org/contact/",
        "services": [
          "Employability/job readiness skills (e.g., making a resume)",
          "Supportive services (e.g., housing)",
          "Financial counseling"
        ],
        "client_qualifications": "Hickory Hill",
        "phone_number": "",
        "location": "",
        "gmap_link": "",
        "email" : "",
        "client_characteristics" : {
          "zip_code" : [ "38141", "38115" ] // Hickory Hill
        }
      },
      "Alzheimer's and Dementia Services of Memphis": {
        "website": "https://www.adsmemphis.org/contact/",
        "services": [],
        "client_qualifications": "People with Dementia and Alzheimer's",
        "phone_number": "901-372-4585",
        "location": "4585 Raleigh LaGrange Rd., Memphis, TN 38128",
        "gmap_link": "https://goo.gl/maps/kFHEG5Jsb1x69smo9",
        "email" : "info@adsmemphis.org",
        "client_characteristics" : {
          "disabilities" : [ "Dementia", "Alzheimer's" ]
        }
      },
      "Heights Community Development Corp": {
        "website": "https://heightscdc.org",
        "services": [
          "Job training",
          "Employability/job readiness skills (e.g., making a resume)",
          "Supportive services (e.g., housing)",
          "Networking",
          "Mentorship"
        ],
        "client_qualifications": "",
        "phone_number": "901-730-6902",
        "location": "",
        "gmap_link": "",
        "email" : "info@heightscdc.org"
      },
    }
    this.services_by_needs = {
      "I need help finding a job" : [
        'Job training',
        'Job placement',
        'Employability/job readiness skills (e.g., making a resume)',
        'Certifications',
      ],
      "I want more skill training to find a better job" : [
        'Literacy (reading and/or writing)',
        'Certifications',
      ],
      "I want to go back to school to get my diploma or GED" : [
        'Education - GED',
        'Literacy (reading and/or writing)',
        'Education - high school',
      ],
       // No nonprofits currently offer help with Associate or Bachelor's.
      "I want to get an Associate or Bachelor's degree" : [
        'Literacy (reading and/or writing)',
        'Certifications'
      ]
    }
    this.dump_counts(); // get provider statistics.
  }
  check_zip_code(zip_code) {
    return [
      "38002",
      "38014",
      "38016",
      "38017",
      "38018",
      "38027",
      "38028",
      "38029",
      "38053",
      "38054",
      "38083",
      "38088",
      "38101",
      "38103",
      "38104",
      "38105",
      "38106",
      "38107",
      "38108",
      "38109",
      "38111",
      "38112",
      "38113",
      "38114",
      "38115",
      "38116",
      "38117",
      "38118",
      "38119",
      "38120",
      "38122",
      "38124",
      "38125",
      "38126",
      "38127",
      "38128",
      "38130",
      "38131",
      "38132",
      "38133",
      "38134",
      "38135",
      "38137",
      "38138",
      "38139",
      "38141",
      "38157",
      "38167",
      "38168",
      "38173",
      "38174",
      "38175",
      "38177",
      "38181",
      "38182",
      "38183",
      "38184",
      "38186",
      "38187",
      "38190"].includes(zip_code);
  }
  dump_counts() {
    let contact_counts = { 'phone_number' : 0, 'location' : 0, 'email' : 0 };
    let no_email_providers = [];
    let manual_data = this.provider_data;
    Object.keys(manual_data).forEach(function (key) { 
      var value = manual_data[key];
      for (let k of ['phone_number', 'location', 'email']) {
        if (value[k]) {
          contact_counts[k] = contact_counts[k] + 1;
        }
      }
      if (!manual_data[key]['email']) {
        no_email_providers.push(key);
      }
    })
    let str = 'Total providers: ' + Object.keys(manual_data).length + ', ';
    Object.keys(contact_counts).forEach(function (key) { 
      str += key + ': ' + contact_counts[key] + ', ';
    })
    console.log(str);
    for (let p of no_email_providers) {
      console.log(p);
    }
  }
  load(name) {
    if (!(['summary', 'matches'].includes(name))) {
      this.add_question_count(name + '_count');
    }
    switch (name) {
      case 'intro' :
        this.add_211()
        break;
      case 'q_client_needs' :
        this.append_radios('client_needs', this.client_needs);
        break;
      case 'q_client_age' :
        this.append_radios('client_age', this.client_age_ranges);
        break;
      case 'q_client_education' :
        this.append_radios('client_education', this.education_levels);
        break;
      case 'q_race' :
        this.append_radios('race', this.race_types);
        break;
      case 'q_gender' :
        this.append_radios('gender', this.gender_types);
        break;
      case 'q_criminal_history' :
        this.append_radios('criminal_history', this.client_criminal_history);
        break;
      case 'q_legal_resident' :
        this.append_radios('legal_resident', this.legal_resident);
        break;
      case 'q_disabilities' :
        this.append_radios('disabilities', this.disabilities);
        break;
      case 'q_english_lang' :
        this.append_radios('english_lang', this.english_lang);
        break;
      case 'q_work_status' :
        this.append_radios('work_status', this.work_status);
        break;
      case 'summary' :
        let el = $(".summary_div");
        el.empty();
        el.append('<p><b>Zip code</b>: ' + this.client_data.zip_code + '</p>');
        el.append('<p><b>Race</b>: ' + this.client_data.race + '</p>');
        el.append('<p><b>Gender</b>: ' + this.client_data.gender + '</p>');
        break;
      case 'matches' :
        this.show_matches();
        break;
      } 
  }
  add_211() {
    if (this.demo_new_features) {
      let href_211 = $(".href_211");
      href_211.empty();
      href_211.append(
        '<br/><a href="tel:211">📞To talk to someone for help, tap here.</a><br/>'
      );
    }
  }
  make_link(tag, url) {
    let ret = '<a href="';
    if (tag) {
      ret += tag + ':';
    }
    ret += (url + '" target="_blank">' + url + '</a>');
    return ret;
  }
  get_services(provider_name) {
    let ret = []
    for (let service of this.services_by_needs[this.client_data.client_needs]) {
      for (let org_service of this.provider_data[provider_name].services) {
        if (service === org_service) {
          ret.push(service);
        }
      }
    }
    return ret;
  }
  append_services(provider_name) {
    let s = "<h5><i>Services</i></h5><ul>";
    for (let service of this.get_services(provider_name).sort()) {
      s += "<li>" + service + "</li>";
    }
    s += "</ul>"
    return s;
  }
  email_to_user() {
    let s = '';
    for (let provider_name of this.get_matches()) {
      let provider = this.provider_data[provider_name];
      s += '-'.repeat(60) + '\r\n';
      s += provider_name + '\r\n';
      s += '-'.repeat(60) + '\r\n';
      s += 'Services:\r\n';
      for (let service of this.get_services(provider_name).sort()) {
        s += ' '.repeat(5) + service + "\r\n";
      }
      let provider_manual_data = this.provider_data[provider_name];
      s += "Contact Information:\r\n";
      if (provider_manual_data["phone_number"]) {
        s += ' '.repeat(5) + provider_manual_data["phone_number"] + '\r\n';
      }
      if (provider_manual_data["email"]) {
        s += ' '.repeat(5) + provider_manual_data["email"] + '\r\n';
      }
      if (provider["website"]) {
        s += ' '.repeat(5) + provider["website"] + '\r\n';
      }
      if (provider_manual_data["location"]) {
        s += ' '.repeat(5) + provider_manual_data["location"] + '\r\n';
      }
      s += '\r\n';
    }
    return '<div class="usa-prose"><p><i>To email this information to yourself, click on ' +
            '<a href="mailto:?subject=' +
            encodeURIComponent('Organizations with employment services') +
            '&body=' + encodeURIComponent(s) +
            '" target="_blank">this link</a> ' +
            ' and enter your email address in the "To:" line.</i></p></div>';
  }
  make_mail_url(provider_name, base_url) {
    let services = this.get_services(provider_name);
    let plural = '';
    if (services.length > 1) {
      plural = 's';
    }
    let body = 'I would like to find out how to sign up' +
               ' for the following program' + plural + ':\r\n\r\n';
    for (let service of services) {
      body += ' '.repeat(5) + service + '\r\n';
    }
    body += '\r\nThank you!\r\n'
    return '<a href="mailto:' + base_url + '?subject=' +
            encodeURIComponent('How do I sign up for your program' + plural + '?') +
            '&body=' + encodeURIComponent(body) +
            '" target="_blank">' + base_url + '</a>';
  }
  load_provider(el, provider_name) {
    let provider = this.provider_data[provider_name];
    let provider_manual_data = this.provider_data[provider_name];
    let s ='<hr align="left" style="height:2px;border:none;color:#518846;background-color:#518846;max-width:68ex;"/>'
    s += '<h4><b><i>' + provider_name + '</i></b></h4>';
    s += this.append_services(provider_name);
    s += "<h5><i>Contact Information</i></h5><ul>";
    if (provider_manual_data["phone_number"]) {
      s += '<li><b>Phone Number</b>: ';
      let pn = '1' + provider_manual_data["phone_number"].replaceAll('-', '');
      s += '<a href="tel:' + pn + '">' + provider_manual_data["phone_number"] +
           '</a></li>';
    }
    if (provider_manual_data["email"]) {
      // NOTE: This won't work in Google Chrome if the user has more than one profile.
      s += '<li><b>Email</b>: ' + this.make_mail_url(provider_name,
                                    provider_manual_data["email"]) + '</li>';
    }
    if (provider["website"]) {
      s += '<li><b>Website</b>: ';
      s += this.make_link('', provider["website"]) + '</li>';
    }
    if (provider_manual_data["location"]) {
      s += '<li><b>Location</b>: ';
      s += '<a href="' + provider_manual_data["gmap_link"] + '">' +
                provider_manual_data["location"] + '</a></li>';
    }
    s += "</ul></div>";
    el.append(s);
  }
  filter_orgs(orgs) {
    let orgs_to_be_deleted = {};
    for (let org_name of Object.keys(orgs)) {
      let org = this.provider_data[org_name];
      let org_client_quals = org["client_characteristics"];
      if (org_client_quals) {
        for (let qual_name of Object.keys(org_client_quals)) {
          let quals = org_client_quals[qual_name];
          let client_quals = this.client_data[qual_name];
          if (client_quals) {
            if (!quals.includes(client_quals)) {
              orgs_to_be_deleted[org_name] = org_name;
            }
          } else {
            orgs_to_be_deleted[org_name] = org_name;
          }
        }
      }
    }
    for (let o of Object.keys(orgs_to_be_deleted)) {
      delete orgs[o];
    }
  }
  add_language_orgs(orgs) {
    if (this.client_data.english_lang === "No") {
      for (let org_name of Object.keys(this.provider_data)) {
        let provider_characteristics = this.provider_data[org_name].inclusive_characteristics;
        if (provider_characteristics &&
            provider_characteristics['english_lang'] &&
            provider_characteristics['english_lang'].includes("No")) {
              orgs[org_name] = org_name;
        }
      }
    }
  }
  get_matches() {
    let orgs = {};
    for (let service of this.services_by_needs[this.client_data.client_needs]) {
      for (let org of Object.keys(this.provider_data)) {
        for (let org_service of this.provider_data[org].services) {
          if (service === org_service) {
            orgs[org] = org;
          }
        }
      }
    }
    this.filter_orgs(orgs);
    this.add_language_orgs(orgs);
    return Object.keys(orgs).sort();
  }
  show_matches() {
    let title = $("#matches_title");
    title.empty();
    let matches = this.get_matches();
    title.append(matches.length + " matches");
    let email_self = $("#email_self");
    email_self.empty();
    email_self.append(this.email_to_user());
    let el = $(".matches_div");
    el.empty();
    for (let m of matches) {
      this.load_provider(el, m);
    }
  }
  handle() {
    let targetElem = $(".target");
    targetElem.empty();
    if (this.current_content_index > -1) {
      let prev_elem = $('.' + this.content_classes[this.current_content_index]);
      prev_elem.hide();
    }
    let current_content = this.content_classes[++this.current_content_index];
    let next_elem = $('.' + current_content);
    this.load(this.content_classes[this.current_content_index], next_elem);
    targetElem.append(next_elem);
    next_elem.show();
  }
  add_question_count(div_id) {
    let str = '<p>' + 'Question ' + this.current_content_index +
            ' of ' + (this.content_classes.length - 2) + '</p>';
    let el = $("#" + div_id);
    el.empty();
    el.append(str);
  }
  append_radios(id, vals) {
    let el = $("#" + id);
    el.empty();
    let s = '';
    for (let i = 0; i < vals.length; i++) {
      let val = vals[i];
      let re = /\W/g;
      let the_name = val.replace(re, '_').substring(0, 20).toLowerCase();
      s += '<label style="font-weight:normal"><input type="radio" name="' + id + 
        '" value="' + the_name + 
        '" /><span>&nbsp;&nbsp;</span>' + val + '</label><br/>';
    }
    s += '<p> </p><p style="color: #518846;"><input type="submit" value="Next"></p>';
    el.append(s);
  }
}
