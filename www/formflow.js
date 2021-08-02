$(document).ready(function() {
  let selection_handler = new SelectionHandler();
  for (let i = 0; i < 5; i++) {
    $('#next' + i).click(function() {
      selection_handler.handle();
    });
  }
  for (let id of selection_handler.question_form_ids) {
    $("#" + id).submit(function(event) {
      let do_continue = false;
      let val;
      switch (id) {
        case 'zip_code':
          val = $("input").first().val();
          if (val) {
            selection_handler.client_data.zip_code = $("input").first().val();
            do_continue = true;
          }
          break;
        case 'client_needs':
          val = $('input[name=' + id + ']:checked', '#' + id).parent().text();
          if (val) {
            selection_handler.client_data.client_needs = val;
            do_continue = true;
          }
          break; 
        case 'client_age_ranges':
          val = $('input[name=' + id + ']:checked', '#' + id).parent().text();
          if (val) {
            selection_handler.client_data.age_range = val;
            do_continue = true;
          }
          break; 
        case 'client_education_level':
          val = $('input[name=' + id + ']:checked', '#' + id).parent().text();
          if (val) {
            selection_handler.client_data.age_range = val;
            do_continue = true;
          }
          break;    
        case 'client_criminal_history':
          val = $('input[name=' + id + ']:checked', '#' + id).parent().text();
          if (val) {
            selection_handler.client_data.criminal_history = val;
            do_continue = true;
          }
          break;    
        case 'race':
          val = $('input[name=' + id + ']:checked', '#' + id).parent().text();
          if (val) {
            selection_handler.client_data.race = val;
            do_continue = true;
          }
          break; 
        case 'gender':
          val = $('input[name=' + id + ']:checked', '#' + id).parent().text();
          if (val) {
            selection_handler.client_data.gender = val;
            do_continue = true;
          }
          break; 
      }
      if (do_continue) {
        selection_handler.handle();
      }
      event.preventDefault();
    });
  }
  selection_handler.handle();
});

class SelectionHandler {
  constructor() {
    this.current_content_index = -1;
    this.content_classes = [ 'q_needs', 'q_zip_code', 'q_age', 'q_education',
                             'q_race', 'q_criminal_history',
                             'matches' ];
    this.question_form_ids = [ 'client_needs', 'client_education_level',
                               'client_age_ranges', 'client_criminal_history',
                               'zip_code', 'race',
                               'gender' ];
    this.client_data = {
      needs : null,
      zip_code : null,
      race : null,
      gender : null,
      age_range : null,
      education_level : null,
      work_status : null,
      disability : null,
      evicted : null,
      criminal_history : null,
      legal_resident : null // === 'prefer not to say'?
    } 
    this.client_needs = [
      "I need help finding a job",
      "I want more skill training to find a better job",
      "I want to get my degree (for example, GED or associate)"
    ]    
    this.race_types = [
      "White", "African American", "Hispanic or Latino",
      "American Indian or Alaskan Native", "Chinese", "Vietnamese", 
      "Filipino", "Korean", "Asian Indian", "Japanese", "Other Asian", 
      "Some other race"
    ]    
    this.gender_types = [
      "Male", "Female", "Non-binary"
    ] 
    this.client_age_ranges = [
      "0-18", "19-24", "25-34", "35-44", "45-54", "55-64", "65+"
    ]
    this.education_levels = [
      "No schooling completed",
      "Nursery school to 8th grade",
      "Some high school, no diploma",
      "High school graduate, diploma or the equivalent (for example: GED)",
      "Some college credit, no degree, Trade/technical/vocational training",
      "Associate degree",
      "Bachelor’s degree",
      "Master’s degree",
      "Professional degree",
      "Doctorate degree"
    ]    
    this.work_statuses = [
      "Unemployed",
      "Part-time",
      "Full-time",
      "Student",
      "Other"
    ]
    this.client_criminal_history = [
      "Yes",
      "No",
      "Prefer not to say"
    ]
    // Data extracted from a Google sheet. See Google Scripts in utilities/ directory.
    this.provider_data = {
      "Shelby County Office of Reentry": {
        "email": "Harold.Collins@shelbycountytn.gov",
        "website": "https://reentry.shelbycountytn.gov/",
        "services": [
          "Job training",
          "Employability/job readiness skills (e.g., making a resume)",
          "Supportive services (e.g., housing)",
          "Certifications"
        ],
        "client_qualifications": "Person that are criminal justice involved/formerly incarcerated"
      },
      "Shelby County Division of Community Services": {
        "email": "janet.lo@shelbycountytn.gov",
        "website": "https://shelbycountytn.gov/16/Community-Services",
        "services": [
          "Supportive services (e.g., housing)",
          "Total services indicated"
        ],
        "client_qualifications": ""
      },
      "Tech901": {
        "email": "robert@tech901.org",
        "website": "tech901.org",
        "services": [
          "Job training",
          "Employability/job readiness skills (e.g., making a resume)"
        ],
        "client_qualifications": "Adults in the Memphis area"
      },
      "The Collective Blueprint": {
        "email": "Sarah@changeiscollective.org",
        "website": "www.thecollectiveblueprint.org",
        "services": [
          "Job training",
          "Job placement",
          "Employability/job readiness skills (e.g., making a resume)",
          "Supportive services (e.g., housing)",
          "Certifications"
        ],
        "client_qualifications": "18-30 year olds who are / have been out of school and work "
      },
      "Greater Memphis Financial Empowerment Center & Bank on Memphis Coalition": {
        "email": "mpolatty@shelbycountytrustee.com",
        "website": "www.gmfec.org", // ; www.bankonmemphis.org",
        "services": [
          "Financial counseling",
          "Total services indicated"
        ],
        "client_qualifications": "18+ Shelby County Residents"
      },
      "Goodwill Excel Center Midsouth Inc.": {
        "email": "cmolinski@goodwillmemphis.org",
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
        "client_qualifications": "Shelby County"
      },
      "DeafConnect of the Mid-South, Inc.": {
        "email": "natasha@deafconnect.org",
        "website": "www.deafconnect.org",
        "services": [
          "Employability/job readiness skills (e.g., making a resume)",
          "Supportive services (e.g., housing)"
        ],
        "client_qualifications": "D/deaf and Hard of Hearing community"
      },
      "HopeWorks": {
        "email": "rwade@whyhopeworks.org",
        "website": "www.whyhopeworks.org",
        "services": [
          "Job training",
          "Job placement",
          "Education - GED",
          "Employability/job readiness skills (e.g., making a resume)",
          "Financial counseling",
        ],
        "client_qualifications": "Generational Poverty, Incarceration, High School Drop Outs"
      },
      "2Unique Community Salvation Foundation ": {
        "email": "Thisis2unique@gmail.com",
        "website": "www.2unique-csf.org ",
        "services": [
          "Job training",
          "Job placement",
          "Employability/job readiness skills (e.g., making a resume)",
          "Supportive services (e.g., housing)",
          "Networking",
          "Financial counseling",
          "Mentorship"
        ],
        "client_qualifications": "Youth, non-college, hs dropouts "
      },
      "M I C A H  - Memphis Interfaith Coalition for Action and Hope": {
          "email": "curtis@micahmemphis.org",
        "website": "https://www.micahmemphis.org/",
        "services": [
          "Supportive services (e.g., housing)",
          "Networking",
          "Financial counseling",
          "Education - high school"
        ],
        "client_qualifications": "Our current platform concentrates on three pillar issues, economic equity, education equity, and race & class equity in the justice system. The purpose of MICAH is not to replace each congregation or community organization's efforts, but instead to amplify the voice and the impact by working together interdependently. "
      },
      "Kingdom Community Builders": {
        "email": "dongilbert876@gmail.com",
        "website": "https://www.facebook.com/KingdomCommunityBuilders",
        "services": [
          "Literacy (reading and/or writing)",
          "Total services indicated"
        ],
        "client_qualifications": "We serve a particular African-American community in Memphis"
      },
      "World Relief Memphis": {
        "email": "dprovidence@wr.org",
        "website": "https://worldreliefmemphis.org/",
        "services": [
          "Job placement",
          "Literacy (reading and/or writing)",
          "Employability/job readiness skills (e.g., making a resume)",
          "Supportive services (e.g., housing)"
        ],
        "client_qualifications": "World Relief Memphis (WRM) serves Refugees and other Office of Refugee Resettlement (ORR) eligible immigrants. (Refugees, Asylees, Cuban/Haitian Entrants, Victims of Human Trafficking, Special Immigrant Visas, Amerasians) "
      },
      "Priority Teachers University": {
        "email": "Tinieka41@gmail.com",
        "website": "www.priorityteachersuniversity.com",
        "services": [
          "Job training",
          "Job placement",
          "Literacy (reading and/or writing)",
          "Employability/job readiness skills (e.g., making a resume)",
          "Financial counseling",
          "Education - GED"
        ],
        "client_qualifications": ""
      },
      "RIVERVIEW-KANSAS COMMUNITY DEVELOPMENT CORPORATION": {
        "email": "riverviewkansascdc@gmail.com",
        "website": "https://www.memphishcd.org/chdo/riverview/index.html",
        "services": [
          "Supportive services (e.g., housing)",
          "Total services indicated"
        ],
        "client_qualifications": ""
      },
      "RISE Foundation, Inc.": {
        "email": "kimberly@risememphis.org",
        "website": "www.risememphis.org",
        "services": [
          "Financial counseling",
          "Mentorship"
        ],
        "client_qualifications": "under-served community in 38126 ranging from 5th grade to senior citizens "
      },
      "A Fresh Start to a New Beginning": {
        "email": "greennadja@yahoo.com",
        "website": "afreshstarttoanewbeginning.org",
        "services": [
          "Job training",
          "Job placement",
          "Employability/job readiness skills (e.g., making a resume)",
          "Access to technology",
          "Supportive services (e.g., housing)",
          "Financial counseling",
          "Education - GED"
        ],
        "client_qualifications": "Formerly incarcerated adults"
      },
      "BLDG Memphis": {
        "email": "courtney@bldgmemphis.org",
        "website": "https://www.bldgmemphis.org/",
        "services": [],
        "client_qualifications": "N/A "
      },
      "Greater Whitehaven Economic Redevelopment Corporation": {
        "email": "mharris@gwercmemphis.org",
        "website": "Www.gwercmemphis.org",
        "services": [
          "Job training",
          "Job placement",
          "Employability/job readiness skills (e.g., making a resume)",
          "Financial counseling",
          "Mentorship",
          "Certifications"
        ],
        "client_qualifications": "Residents and stakeholders in 38116 and 38109"
      },
      "Persevere": {
        "email": "sbooks@perseverenow.org",
        "website": "www.perseverenow.org",
        "services": [
          "Job training",
          "Job placement",
          "Employability/job readiness skills (e.g., making a resume)",
          "Supportive services (e.g., housing)",
          "Financial counseling",
          "Certifications"
        ],
        "client_qualifications": ""
      },
      "Leadership Memphis": {
        "email": "ahill@leadershipmemphis.org",
        "website": "Www.leadershipmemphis.org", //; www.volunteermemphis.org",
        "services": [
          "Networking",
          "Total services indicated"
        ],
        "client_qualifications": "Na"
      },
      "Refuge Memphis": {
        "email": "niki.schoggen@refuge-memphis.org",
        "website": "www.refuge-memphis.org",
        "services": [
          "Financial counseling",
          "Mentorship"
        ],
        "client_qualifications": ""
      },
      "Let's Innovate Through Education (LITE Memphis)": {
        "email": "lakethia@litememphis.org",
        "website": "www.litememphis.org",
        "services": [
          "Job training",
          "Education - high school"
        ],
        "client_qualifications": "African American and Latinx High School Students"
      },
      "Power Center CDC": {
        "email": "Brodywamble@gmail.com",
        "website": "http://powercentercdc.org/",
        "services": [
          "Employability/job readiness skills (e.g., making a resume)",
          "Supportive services (e.g., housing)",
          "Financial counseling"
        ],
        "client_qualifications": "Hickory Hill"
      },
      "Alzheimer's and Dementia Services of Memphis": {
        "email": "bquran@adsmemphis.org",
        "website": "adsmemphis.org",
        "services": [],
        "client_qualifications": "People with Dementia and Alzheimer's"
      },
      "Heights Community Development Corp": {
        "email": "christina@heightscdc.org",
        "website": "Heightscdc.org",
        "services": [
          "Job training",
          "Employability/job readiness skills (e.g., making a resume)",
          "Supportive services (e.g., housing)",
          "Networking",
          "Mentorship"
        ],
        "client_qualifications": ""
      },
    }
    // Data found manually. Can 'override' data in this.provider_data .
    // '!' means don't show data from this.provider_data .
    this.provider_manual_data = {
      "Shelby County Office of Reentry": {
        "phone_number": "",
        "location": "",
        "gmap_link": "",
        "email" : '!',
        "client_characteristics" : {
          "criminal_history" : [ "Yes", "Prefer not to say" ]
        }
      },
      "Shelby County Division of Community Services": {
        "phone_number": "901-222-3990",
        "location": "160 N. Main St., 2nd Floor, Memphis, TN 38103",
        "gmap_link": "https://goo.gl/maps/SqaAW6BpG7QfSKEA9",
        "email" : "CommunityServicesInfo@shelbycountytn.gov"
      },
      "Tech901": {
        "phone_number": "901-881-2677",
        "location": "1350 Concourse Ave. Suite 375, Memphis, TN  38104",
        "gmap_link": "https://goo.gl/maps/BQD4MD8iPXkVA2ws9",
        "email" : "!",
        "client_characteristics" : {
          "age_range" : "18+"
        }
      },
      "The Collective Blueprint": {
        "phone_number": "",
        "location": "",
        "gmap_link": "",
        "email" : "apply@thememphiscollective.org",
        "client_characteristics" : {
          "age_range" : "18-30",
          "work_status" : "Unemployed"
        }
      },
      "Greater Memphis Financial Empowerment Center & Bank on Memphis Coalition": {
        "phone_number": "901-390-4200",
        "location": "1355 Lynnfield Rd, Bldg B, Ste 101, Memphis TN",
        "gmap_link": "https://goo.gl/maps/97gjxQYXmWvpGnE37",
        "client_characteristics" : {
          "age_range" : "18+"
        }
      },
      "Goodwill Excel Center Midsouth Inc.": {
        "phone_number" : "901-323-6221",
        "location" : "6895 Stage Road, Memphis, TN 38133",
        "gmap_link" : "https://goo.gl/maps/mknsLfa5qPEQYdoH9"
      },
      "DeafConnect of the Mid-South, Inc.": {
        "phone_number" : "901-278-9307",
        "location" : "6045 Shelby Oaks Dr., Memphis, TN 38134",
        "gmap_link" : "https://goo.gl/maps/6n2XZUChBm7sWwDG6",
        "client_characteristics" : {
          "disability" : ["D/deaf", "Hard of hearing" ]
        }
      },
      "HopeWorks": {
        "phone_number": "901-272-3700",
        "location": "3334 Summer Ave., Memphis, TN 38122",
        "gmap_link": "https://goo.gl/maps/TTUpwBfe2BFApKCFA",
        "client_characteristics" : {
          "criminal_history" : [ "Yes", "Prefer not to say" ]
        }
      },
      "2Unique Community Salvation Foundation ": {
        "phone_number" : "901-489-2386",
        "location" : "Hickory Ridge Mall, C. D. Corporation 3743 S. Hickory Ridge Mall, Suite 494 Memphis, TN 38115",
        "gmap_link" : "https://goo.gl/maps/GkfpfKmG2hNR4dTEA",
        "client_characteristics" : {
          "age_range" : "0-18",
          "education_level" : "Some high school, no diploma"
        }
      },
      "M I C A H  - Memphis Interfaith Coalition for Action and Hope": {
        "phone_number": "",
        "location": "",
        "gmap_link": "",
        "email" : "info@micahmemphis.org"
      },
      "Kingdom Community Builders": {
        "phone_number": "",
        "location": "",
        "gmap_link": ""
      },
      "World Relief Memphis": {
        "phone_number": "901-341-0220",
        "location": "5340 Quince Rd, Suite A, Memphis, TN 38119",
        "gmap_link": "https://goo.gl/maps/1ZwTYKFw6pPdPvQS6",
        "client_characteristics" : {
          "legal_resident" : "No"
        }
      },
      "Priority Teachers University": {
        "phone_number" : "901-209-2342",
        "location" : "2124 Democrat Rd, Memphis, TN 38132",
        "gmap_link" : "https://goo.gl/maps/ktcDgiC629pJKdKH9",
        "email": "priorityteachersuniversity@gmail.com",
      },
      "RIVERVIEW-KANSAS COMMUNITY DEVELOPMENT CORPORATION": {
        "phone_number": "901-314-7866",
        "location": "1374 Elvis Presley Blvd., Ste 104, Memphis, TN 38116",
        "gmap_link": "https://goo.gl/maps/LthKF5u9R6fZefKx8",
        "email" : "riverviewkansas@cavtel.net"
      },
      "RISE Foundation, Inc.": {
        "phone_number": "901-507-6644",
        "location": "1355 Lynnfield Rd, Building B, Suite 101, Memphis, Tennessee 38119",
        "gmap_link": "https://goo.gl/maps/V1HQbnSMvDxuX32y8",
        "client_characteristics" : {
          "zip_code" : [ "38126" ]
        }
      },
      "A Fresh Start to a New Beginning": {
        "phone_number" : "901-690-0327",
        "location" : "",
        "gmap_link" : "",
        "email": "afreshstarttoanewbeginning@yahoo.com",
        "client_characteristics" : {
          "criminal_history" : [ "Yes", "Prefer not to say" ]
        }
      },
      "BLDG Memphis": {
        "phone_number": "901-725-0460",
        "location": "1680 Jackson Avenue, Memphis, Tennessee 38107",
        "gmap_link": "https://goo.gl/maps/c2iVqP7pBXv6Z57r6"
      },
      "Greater Whitehaven Economic Redevelopment Corporation": {
        "phone_number": "901-605-8213",
        "location": "4466 Elvis Presley Boulevard Suite 216, Memphis, TN",
        "gmap_link": "https://goo.gl/maps/ms4R9j5ZicjL1UXS7",
        "email" : "info@gwercmemphis.org",
        "client_characteristics" : {
          "zip_code" : [ "38116", "38109" ]
        }
      },
      "Persevere": {
        "phone_number": "877-260-7299",
        "location": "",
        "gmap_link": "",
        "email" : "info@perseverenow.org"
      },
      "Leadership Memphis": {
        "phone_number": "901-278-0016",
        "location": "240 Madison Ave Suite 601, Memphis TN 38103",
        "gmap_link": "https://goo.gl/maps/arKxLr7xC8DoVSv58",
        "email" : "info@leadershipmemphis.org"
      },
      "Refuge Memphis": {
        "phone_number": "901-410-8724",
        "location": "3171 Signal Street, Memphis, TN 38127, US",
        "gmap_link": "https://goo.gl/maps/ApBpdhUxtpDHxkXe6",
        "email" : "!"
      },
      "Let's Innovate Through Education (LITE Memphis)": {
        "phone_number": "901-634-0001",
        "location": "88 Union Ave 6th Floor, Memphis, TN 38103",
        "gmap_link": "https://goo.gl/maps/gnpWyySQ5ABVKkv26",
        "email" : "!",
        "client_characteristics" : {
          "race" : [ "African American", "Hispanic or Latino" ],
          "education_level" : "some high school"
        }
      },
      "Power Center CDC": {
        "phone_number": "",
        "location": "",
        "gmap_link": "",
        "email" : "!",
        "client_characteristics" : {
          "zip_code" : [ "38141", "38115" ] // Hickory Hill
        }
      },
      "Alzheimer's and Dementia Services of Memphis": {
        "phone_number": "901-372-4585",
        "location": "4585 Raleigh LaGrange Rd., Memphis, TN 38128",
        "gmap_link": "https://goo.gl/maps/kFHEG5Jsb1x69smo9",
        "email" : "info@adsmemphis.org",
        "client_characteristics" : {
          "disability" : [ "Dementia", "Alzheimer's" ]
        }
      },
      "Heights Community Development Corp": {
        "phone_number": "901-730-6902",
        "location": "",
        "gmap_link": "",
        "email" : "info@heightscdc.org"
      }
    }
    this.services_by_needs = {
      "I need help finding a job" : [
        'Job training',
        'Job placement',
        'Employability/job readiness skills (e.g., making a resume)',
        'Certifications',
      ],
      "I want more skill training to find a better job" : [
        'Certifications',
      ],
      "I want to get my degree (for example, GED or associate)" : [
        'Education - GED',
        'Literacy (reading and/or writing)',
        'Education - high school',
      ]
    }
  }
  load(name) {
    switch (name) {
      case 'q_needs' :
        this.append_radios('client_needs', this.client_needs);
        break;
      case 'q_age' :
        this.append_radios('client_age_ranges', this.client_age_ranges);
        break;
      case 'q_education' :
        this.append_radios('client_education_level', this.education_levels);
        break;
      case 'q_race' :
        this.append_radios('race', this.race_types);
        break;
      case 'q_gender' :
        this.append_radios('gender', this.gender_types);
        break;
      case 'q_criminal_history' :
        this.append_radios('client_criminal_history', this.client_criminal_history);
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
  make_link(tag, url) {
    let ret = '<a href="';
    if (tag) {
      ret += tag + ':';
    }
    ret += (url + '">' + url + '</a>');
    return ret;
  }
  append_services(provider_name) {
    let s = "<ul>";
    for (let service of this.services_by_needs[this.client_data.client_needs]) {
      for (let org_service of this.provider_data[provider_name].services) {
        if (service === org_service) {
          s += "<li>" + service + "</li>";
        }
      }
    }
    s += "</ul>"
    return s;
  }
  load_provider(el, provider_name) {
    let provider = this.provider_data[provider_name];
    let provider_manual_data = this.provider_manual_data[provider_name];
    let s = '<h5><b><i>' + provider_name + '</i></b></h5>';
    s += this.append_services(provider_name);
    s += "<div style=\"margin-left: 40px;\">";
    let entry_was_added = false;
    if (provider_manual_data["phone_number"]) {
      s += '<b>Phone Number</b>: ';
      let pn = '1' + provider_manual_data["phone_number"].replaceAll('-', '');
      s += '<a href="tel:' + pn + '">' + provider_manual_data["phone_number"] + '</a>';
      entry_was_added = true;
    }
    let em = "";
    if (provider_manual_data["email"] && (provider_manual_data["email"] !== '!')) {
      em = this.make_link('mailto', provider_manual_data["email"]);
    } else {
      if (provider["email"] && (provider_manual_data["email"] !== '!')) {
        em = this.make_link('mailto', provider["email"]);
      }
    }
    if (em) {
      if (entry_was_added) {
        s += '<br/>';
      }
      s += '<b>Email</b>: ' + em;
      entry_was_added = true;
    }
    if (provider["website"]) {
      if (entry_was_added) {
        s += '<br/>';
      }
      s += '<b>Website</b>: ';
      s += this.make_link('', provider["website"]);
      entry_was_added = true;
    }
    if (provider_manual_data["location"]) {
      if (entry_was_added) {
        s += '<br/>';
      }
      s += '<b>Location</b>: ';
      s += '<a href="' + provider_manual_data["gmap_link"] + '">' +
                provider_manual_data["location"] + '</a>';
      entry_was_added = true;
    }
    s += "<br/></div>";
    el.append(s);
  }
  filter_orgs(orgs) {
    let orgs_to_be_deleted = {};
    for (let org_name of Object.keys(orgs)) {
      let org = this.provider_manual_data[org_name];
      let client_quals = org["client_characteristics"];
      if (client_quals) {
        for (let qual_name of Object.keys(client_quals)) {
          let quals = client_quals[qual_name];
          let client_characteristic = this.client_data[qual_name];
          if (client_characteristic) {
            // TODO : age_range and education_level (others?) need special code
            // to handle multiple values (e.g., age > 18)
            if (!quals.includes(client_characteristic)) {
              orgs_to_be_deleted[org_name] = org_name;
            }
          }
        }
      }
    }
    for (let o of Object.keys(orgs_to_be_deleted)) {
      delete orgs[o];
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
    return Object.keys(orgs);
  }
  show_matches() {
    let el = $(".matches_div");
    el.empty();
    for (let m of this.get_matches()) {
      this.load_provider(el, m);
    }
  }
  handle() {
    let targetElem = $(".target");
    targetElem.hide();
    targetElem.empty();
    if (this.current_content_index > -1) {
      let prev_elem = $('.' + this.content_classes[this.current_content_index]);
      prev_elem.hide();
    }
    let current_content = this.content_classes[++this.current_content_index];
    let next_elem = $('.' + current_content);
    this.load(this.content_classes[this.current_content_index], next_elem);
    targetElem.append(next_elem);
    targetElem.show();
    next_elem.show();
  }
  append_radios(id, vals) {
    let el = $("#" + id);
    el.empty();
    for (let i = 0; i < vals.length; i++) {
      let val = vals[i];
      let re = /\W/g;
      let the_name = val.replace(re, '_').substring(0, 20).toLowerCase();
      el.append('<label><input type="radio" name="' + id + 
        '" value="' + the_name + 
        '" />' + val + '</label><br/>');
    }
    el.append('<input type="submit" value="Next">');
  }
}
