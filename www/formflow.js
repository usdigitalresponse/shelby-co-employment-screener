$(document).ready(function() {
  let selection_handler = new SelectionHandler();
  for (let i = 0; i < 5; i++) {
    $('#next' + i).click(function() {
      selection_handler.handle();
    });
  }
  let question_form_ids = ['zip_code', 'race', 'gender'];
  for (let id of question_form_ids) {
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
    this.content_classes = [ 'intro', 'q1', 'q2', 'q3', 'summary', 'matches' ];
    this.client_data = {
      zip_code : null,
      race : null,
      gender : null,
      age_range : null,
      education_level : null,
      work_status : null,
      disability : null,
      evicted : null,
      criminal_history : null,
      legal_resident : null // == 'prefer not to say'
    } 
    this.race_types = [
      "White", "African American", "Hispanic or Latino",
      "American Indian or Alaskan Native", "Chinese", "Vietnamese", 
      "Filipino", "Korean", "Asian Indian", "Japanese", "Other Asian", 
      "Some other race"
    ]    
    this.gender_types = [
      "Male", "Female", "Non-binary"
    ]    
    this.age_brackets = [
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
    this.provider_data2 =  {
      "Shelby County Office of Reentry": {
        "email": "Harold.Collins@shelbycountytn.gov",
        "url": "https://reentry.shelbycountytn.gov/",
        "services": [
          "Job training",
          "Employability/job readiness skills (e.g., making a resume)",
          "Supportive services (e.g., housing)",
          "Certifications"
        ]
      },
      "Shelby County Division of Community Services": {
        "email": "janet.lo@shelbycountytn.gov",
        "url": "https://shelbycountytn.gov/16/Community-Services",
        "services": [
          "Supportive services (e.g., housing)",
          "Total services indicated"
        ]
      },
      "Tech901": {
        "email": "robert@tech901.org",
        "url": "tech901.org",
        "services": [
          "Job training",
          "Employability/job readiness skills (e.g., making a resume)"
        ]
      },
      "The Collective Blueprint": {
        "email": "Sarah@changeiscollective.org",
        "url": "www.thecollectiveblueprint.org",
        "services": [
          "Job training",
          "Job placement",
          "Employability/job readiness skills (e.g., making a resume)",
          "Supportive services (e.g., housing)",
          "Certifications"
        ]
      },
      "Greater Memphis Financial Empowerment Center & Bank on Memphis Coalition": {
        "email": "mpolatty@shelbycountytrustee.com",
        "url": "www.gmfec.org ; www.bankonmemphis.org",
        "services": [
          "Financial counseling",
          "Total services indicated"
        ]
      },
      "Goodwill Excel Center Midsouth Inc.": {
        "email": "cmolinski@goodwillmemphis.org",
        "url": "https://www.goodwillmemphis.org/theexcelcenter",
        "services": [
          "Job placement",
          "Literacy (reading and/or writing)",
          "Employability/job readiness skills (e.g., making a resume)",
          "Access to technology",
          "Supportive services (e.g., housing)",
          "Education - high school",
          "Certifications"
        ]
      },
      "DeafConnect of the Mid-South, Inc.": {
        "email": "natasha@deafconnect.org",
        "url": "www.deafconnect.org",
        "services": [
          "Employability/job readiness skills (e.g., making a resume)",
          "Supportive services (e.g., housing)"
        ]
      },
      "HopeWorks": {
        "email": "rwade@whyhopeworks.org",
        "url": "www.whyhopeworks.org",
        "services": [
          "Job training",
          "Job placement",
          "Education - GED",
          "Job training",
          "Job placement",
          "Employability/job readiness skills (e.g., making a resume)",
          "Financial counseling",
          "Education - GED"
        ]
      },
      "2Unique Community Salvation Foundation ": {
        "email": "Thisis2unique@gmail.com",
        "url": "www.2unique-csf.org ",
        "services": [
          "Job training",
          "Job placement",
          "Employability/job readiness skills (e.g., making a resume)",
          "Supportive services (e.g., housing)",
          "Networking",
          "Financial counseling",
          "Mentorship"
        ]
      },
      "M I C A H  - Memphis Interfaith Coalition for Action and Hope": {
        "email": "curtis@micahmemphis.org",
        "url": "https://www.micahmemphis.org/",
        "services": [
          "Supportive services (e.g., housing)",
          "Networking",
          "Financial counseling",
          "Education - high school"
        ]
      },
      "Kingdom Community Builders": {
        "email": "dongilbert876@gmail.com",
        "url": "https://www.facebook.com/KingdomCommunityBuilders",
        "services": [
          "Literacy (reading and/or writing)",
          "Total services indicated"
        ]
      },
      "World Relief Memphis": {
        "email": "dprovidence@wr.org",
        "url": "https://worldreliefmemphis.org/",
        "services": [
          "Job placement",
          "Literacy (reading and/or writing)",
          "Employability/job readiness skills (e.g., making a resume)",
          "Supportive services (e.g., housing)"
        ]
      },
      "Priority Teachers University": {
        "email": "Tinieka41@gmail.com",
        "url": "www.priorityteachersuniversity.com",
        "services": [
          "Job training",
          "Job placement",
          "Literacy (reading and/or writing)",
          "Employability/job readiness skills (e.g., making a resume)",
          "Financial counseling",
          "Education - GED"
        ]
      },
      "RIVERVIEW-KANSAS COMMUNITY DEVELOPMENT CORPORATION": {
        "email": "riverviewkansascdc@gmail.com",
        "url": "Melrose Place Apts",
        "services": [
          "Supportive services (e.g., housing)",
          "Total services indicated"
        ]
      },
      "RISE Foundation, Inc.": {
        "email": "kimberly@risememphis.org",
        "url": "www.risememphis.org",
        "services": [
          "Financial counseling",
          "Mentorship"
        ]
      },
      "A Fresh Start to a New Beginning": {
        "email": "greennadja@yahoo.com",
        "url": "afreshstarttoanewbeginning.org",
        "services": [
          "Job training",
          "Job placement",
          "Employability/job readiness skills (e.g., making a resume)",
          "Access to technology",
          "Supportive services (e.g., housing)",
          "Financial counseling",
          "Education - GED"
        ]
      },
      "BLDG Memphis": {
        "email": "courtney@bldgmemphis.org",
        "url": "https://www.bldgmemphis.org/",
        "services": []
      },
      "Greater Whitehaven Economic Redevelopment Corporation": {
        "email": "mharris@gwercmemphis.org",
        "url": "Www.gwercmemphis.org",
        "services": [
          "Job training",
          "Job placement",
          "Employability/job readiness skills (e.g., making a resume)",
          "Financial counseling",
          "Mentorship",
          "Certifications"
        ]
      },
      "Persevere": {
        "email": "sbooks@perseverenow.org",
        "url": "www.perseverenow.org",
        "services": [
          "Job training",
          "Job placement",
          "Employability/job readiness skills (e.g., making a resume)",
          "Supportive services (e.g., housing)",
          "Financial counseling",
          "Certifications"
        ]
      },
      "Leadership Memphis": {
        "email": "ahill@leadershipmemphis.org",
        "url": "Www.leadershipmemphis.org; www.volunteermemphis.org",
        "services": [
          "Networking",
          "Total services indicated"
        ]
      },
      "Refuge Memphis": {
        "email": "niki.schoggen@refuge-memphis.org",
        "url": "www.refuge-memphis.org",
        "services": [
          "Financial counseling",
          "Mentorship"
        ]
      },
      "Let's Innovate Through Education (LITE Memphis)": {
        "email": "lakethia@litememphis.org",
        "url": "www.litememphis.org",
        "services": [
          "Job training",
          "Education - high school"
        ]
      },
      "Power Center CDC": {
        "email": "Brodywamble@gmail.com",
        "url": "www.Powercenter.org",
        "services": [
          "Employability/job readiness skills (e.g., making a resume)",
          "Supportive services (e.g., housing)",
          "Financial counseling"
        ]
      },
      "Alzheimer's and Dementia Services of Memphis": {
        "email": "bquran@adsmemphis.org",
        "url": "adsmemphis.org",
        "services": []
      },
      "Heights Community Development Corp": {
        "email": "christina@heightscdc.org",
        "url": "Heightscdc.org",
        "services": [
          "Job training",
          "Employability/job readiness skills (e.g., making a resume)",
          "Supportive services (e.g., housing)",
          "Networking",
          "Mentorship"
        ]
      },
      "": {
        "email": "",
        "url": "",
        "services": []
      }
    }
    this.providers = {
      two_unique : {
        name : "2Unique Community Salvation Foundation",
        website : "https://www.2unique-csf.org ",
        phone_number : "901-489-2386",
        email : "Thisis2unique@gmail.com",
        location : "Hickory Ridge Mall, C. D. Corporation 3743 S. Hickory Ridge Mall, Suite 494 Memphis, TN 38115",
        gmap_link : "https://goo.gl/maps/GkfpfKmG2hNR4dTEA"
      },
      deaf_connect : {
        name : "DeafConnect of the Mid-South, Inc.",
        website : "https://www.deafconnect.org",
        phone_number : "901-278-9307",
        email : "natasha@deafconnect.org",
        location : "6045 Shelby Oaks Dr., Memphis, TN 38134",
        gmap_link : "https://goo.gl/maps/6n2XZUChBm7sWwDG6"
      },
      goodwill_excel : {
        name : "Goodwill Excel Center Midsouth Inc.",
        website : "https://www.goodwillmemphis.org/theexcelcenter",
        phone_number : "901-323-6221",
        email : "cmolinski@goodwillmemphis.org",
        location : "6895 Stage Road, Memphis, TN 38133",
        gmap_link : "https://goo.gl/maps/mknsLfa5qPEQYdoH9"
      },
      fresh_start : {
        name : "A Fresh Start to a New Beginning",
        website : "https://afreshstarttoanewbeginning.org",
        phone_number : "901-690-0327",
        email : "afreshstarttoanewbeginning@yahoo.com",
        location : "",
        gmap_link : ""
      },
      kingdom_community : {
        name : "Kingdom Community Builders",
        website : "https://www.facebook.com/KingdomCommunityBuilders",
        phone_number : "",
        email : "dongilbert876@gmail.com",
        location : "",
        gmap_link : ""
      },
      priority_teachers : {
        name : "Priority Teachers University",
        website : "https://www.priorityteachersuniversity.com",
        phone_number : "901-209-2342",
        email : "priorityteachersuniversity@gmail.com",
        location : "2124 Democrat Rd, Memphis, TN 38132",
        gmap_link : "https://goo.gl/maps/ktcDgiC629pJKdKH9"
      }     
    },
    this.services = {
      job_training : {
        name : "Job training",
        providers : [
          this.providers.two_unique,
          this.providers.fresh_start
        ]
      },
      job_placement : {
        name : "Job Placement",
        providers : [
          this.providers.fresh_start
        ]
      },
      literacy : {
        name : "Literacy (reading and/or writing)",
        providers : [
          this.providers.goodwill_excel,
          this.providers.kingdom_community,
          this.providers.priority_teachers
        ]
      }
    }
  }
  load(name) {
    switch (name) {
      case 'q2' :
        this.append_radios('race', this.race_types);
        break;
      case 'q3' :
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
  load_provider(el, provider) {
    el.append('<br/><b><i>' + provider.name + '</i></b>');
    if (provider.phone_number) {
      let pn = '1' + provider.phone_number.replaceAll('-', '');
      el.append('<br/><b>Phone Number</b>: <a href="tel:' + pn + '">' + provider.phone_number + '</a>');
    }
    if (provider.email) {
      el.append('<br/><b>Email</b>: ' + this.make_link('mailto', provider.email));
    }
    if (provider.website) {
      el.append('<br/><b>Website</b>: ' + this.make_link('', provider.website));
    }
    if (provider.location) { // TODO: figure out whether add a _blank to open a new tab.
      el.append('<br/><p><b>Location</b>: <a href="' + provider.gmap_link + '">' +
                provider.location + '</a></p>');
    }
}
  show_matches() {
    let el = $(".matches_div");
    el.empty();
    this.load_provider(el, this.providers.two_unique);
    this.load_provider(el, this.providers.goodwill_excel);
    this.load_provider(el, this.providers.priority_teachers);
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
