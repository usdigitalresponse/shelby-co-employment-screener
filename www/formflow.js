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
    this.content_classes = [ 'q1', 'q2', 'q3', 'matches' ];
    this.question_form_ids = [ 'client_needs', 'client_education_level', 'client_age_ranges' ];
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
      criminal_justice_status : null,
      legal_resident : null // == 'prefer not to say'?
    } 
    this.client_needs = [
      "I need a job", "I need more education"
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
    this.yes_no_prefernot = [
      "Yes",
      "No",
      "Prefer not to say"
    ]
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
        "website": "www.gmfec.org ; www.bankonmemphis.org",
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
          "Job training",
          "Job placement",
          "Employability/job readiness skills (e.g., making a resume)",
          "Financial counseling",
          "Education - GED"
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
        "website": "Melrose Place Apts",
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
        "website": "Www.leadershipmemphis.org; www.volunteermemphis.org",
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
        "website": "www.Powercenter.org",
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
    this.provider_manual_data = {
      "Shelby County Office of Reentry": {
        "phone_number": "",
        "location": "",
        "gmap_link": ""
      },
      "Shelby County Division of Community Services": {
        "phone_number": "",
        "location": "",
        "gmap_link": ""
      },
      "Tech901": {
        "phone_number": "",
        "location": "",
        "gmap_link": ""
      },
      "The Collective Blueprint": {
        "phone_number": "",
        "location": "",
        "gmap_link": ""
      },
      "Greater Memphis Financial Empowerment Center & Bank on Memphis Coalition": {
        "phone_number": "",
        "location": "",
        "gmap_link": ""
      },
      "Goodwill Excel Center Midsouth Inc.": {
        "phone_number" : "901-323-6221",
        "location" : "6895 Stage Road, Memphis, TN 38133",
        "gmap_link" : "https://goo.gl/maps/mknsLfa5qPEQYdoH9",
        "client_characteristics" : [
          "Shelby County"
        ]
      },
      "DeafConnect of the Mid-South, Inc.": {
        "phone_number" : "901-278-9307",
        "location" : "6045 Shelby Oaks Dr., Memphis, TN 38134",
        "gmap_link" : "https://goo.gl/maps/6n2XZUChBm7sWwDG6",
        "client_characteristics" : [
          "D/deaf",
          "Hard of hearing"
        ]
      },
      "HopeWorks": {
        "phone_number": "",
        "location": "",
        "gmap_link": ""
      },
      "2Unique Community Salvation Foundation ": {
        "phone_number" : "901-489-2386",
        "location" : "Hickory Ridge Mall, C. D. Corporation 3743 S. Hickory Ridge Mall, Suite 494 Memphis, TN 38115",
        "gmap_link" : "https://goo.gl/maps/GkfpfKmG2hNR4dTEA",
        "client_characteristics" : [
          "Youth",
          "Non-college",
          "High school dropouts"
        ]
      },
      "M I C A H  - Memphis Interfaith Coalition for Action and Hope": {
        "phone_number": "",
        "location": "",
        "gmap_link": ""
      },
      "Kingdom Community Builders": {
        "phone_number": "",
        "location": "",
        "gmap_link": ""
      },
      "World Relief Memphis": {
        "phone_number": "",
        "location": "",
        "gmap_link": ""
      },
      "Priority Teachers University": {
        "phone_number" : "901-209-2342",
        "location" : "2124 Democrat Rd, Memphis, TN 38132",
        "gmap_link" : "https://goo.gl/maps/ktcDgiC629pJKdKH9",
        "email": "priorityteachersuniversity@gmail.com",
      },
      "RIVERVIEW-KANSAS COMMUNITY DEVELOPMENT CORPORATION": {
        "phone_number": "",
        "location": "",
        "gmap_link": ""
      },
      "RISE Foundation, Inc.": {
        "phone_number": "",
        "location": "",
        "gmap_link": ""
      },
      "A Fresh Start to a New Beginning": {
        "phone_number" : "901-690-0327",
        "location" : "",
        "gmap_link" : "",
        "email": "afreshstarttoanewbeginning@yahoo.com",
      },
      "BLDG Memphis": {
        "phone_number": "",
        "location": "",
        "gmap_link": ""
      },
      "Greater Whitehaven Economic Redevelopment Corporation": {
        "phone_number": "",
        "location": "",
        "gmap_link": ""
      },
      "Persevere": {
        "phone_number": "",
        "location": "",
        "gmap_link": ""
      },
      "Leadership Memphis": {
        "phone_number": "",
        "location": "",
        "gmap_link": ""
      },
      "Refuge Memphis": {
        "phone_number": "",
        "location": "",
        "gmap_link": ""
      },
      "Let's Innovate Through Education (LITE Memphis)": {
        "phone_number": "",
        "location": "",
        "gmap_link": ""
      },
      "Power Center CDC": {
        "phone_number": "",
        "location": "",
        "gmap_link": ""
      },
      "Alzheimer's and Dementia Services of Memphis": {
        "phone_number": "",
        "location": "",
        "gmap_link": ""
      },
      "Heights Community Development Corp": {
        "phone_number": "",
        "location": "",
        "gmap_link": ""
      }
    }
  }
  load(name) {
    switch (name) {
      case 'q1' :
        this.append_radios('client_needs', this.client_needs);
        break;
      case 'q2' :
        this.append_radios('client_age_ranges', this.client_age_ranges);
        break;
      case 'q3' :
        this.append_radios('client_education_level', this.education_levels);
        break;
      case 'q5' :
        this.append_radios('race', this.race_types);
        break;
      case 'q6' :
        this.append_radios('gender', this.gender_types);
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
  load_provider(el, provider_name) {
    let provider = this.provider_data[provider_name];
    let provider_manual_data = this.provider_manual_data[provider_name];
    el.append('<br/><b><i>' + provider_name + '</i></b>');
    if (provider_manual_data["phone_number"]) {
      let pn = '1' + provider_manual_data["phone_number"].replaceAll('-', '');
      el.append('<br/><b>Phone Number</b>: <a href="tel:' + pn + '">' + provider_manual_data["phone_number"] + '</a>');
    }
    if (provider_manual_data["email"]) {
      el.append('<br/><b>Email</b>: ' + this.make_link('mailto', provider_manual_data["email"]));
    } else {
      if (provider["email"]) {
        el.append('<br/><b>Email</b>: ' + this.make_link('mailto', provider["email"]));
      }
    }
    if (provider["website"]) {
      el.append('<br/><b>Website</b>: ' + this.make_link('', provider["website"]));
    }
    if (provider_manual_data["location"]) { // TODO: figure out whether add a _blank to open a new tab.
      el.append('<br/><p><b>Location</b>: <a href="' + provider_manual_data["gmap_link"] + '">' +
      provider_manual_data["location"] + '</a></p>');
    }
}
  show_matches() {
    let el = $(".matches_div");
    el.empty();
    this.load_provider(el, "2Unique Community Salvation Foundation ");
    this.load_provider(el, "Goodwill Excel Center Midsouth Inc.");
    this.load_provider(el, "Priority Teachers University");
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
        '" /> ' + val + '</label><br/>');
    }
    el.append('<input type="submit" value="Next">');
  }
}
