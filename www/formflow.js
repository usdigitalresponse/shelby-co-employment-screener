$(document).ready(function() {
  (new SelectionHandler().handle());
});

class SelectionHandler {
  constructor() {
    this.providers = {
      two_unique : {
        name : "2Unique Community Salvation Foundation",
        website : "https://www.2unique-csf.org ",
        phone_number : "...phone number to come...",
        email : "Thisis2unique@gmail.com"
      },
      fresh_start : {
        name : "A Fresh Start to a New Beginning",
        website : "https://afreshstarttoanewbeginning.org",
        phone_number : "...phone number to come...",
        email : "someone@afreshstarttoanewbeginning.org"
      },
      deaf_connect : {
        name : "DeafConnect of the Mid-South, Inc.",
        website : "https://www.deafconnect.org",
        phone_number : "...phone number to come...",
        email : "natasha@deafconnect.org"
      },
      goodwill_excel : {
        name : "Goodwill Excel Center Midsouth Inc.",
        website : "https://www.goodwillmemphis.org/theexcelcenter",
        phone_number : "...phone number to come...",
        email : "cmolinski@goodwillmemphis.org"
      },
      kingdom_community : {
        name : "Kingdom Community Builders",
        website : "https://www.facebook.com/KingdomCommunityBuilders",
        phone_number : "...phone number to come...",
        email : "someone@kingdomcommunitybuilders.org"
        
      },
      priority_teachers : {
        name : "Priority Teachers University",
        website : "https://www.priorityteachersuniversity.com",
        phone_number : "...phone number to come...",
        email : "someone@priorityteachersuniversity.com"
      }     
    }
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
      /*
      "Job training": ["2Unique Community Salvation Foundation ", "A Fresh Start to a New Beginning", "Greater Whitehaven Economic Redevelopment Corporation", "Heights Community Development Corp", "HopeWorks", "HopeWorks", "Let's Innovate Through Education (LITE Memphis)", "Persevere", "Priority Teachers University", "Shelby County Office of Reentry", "Tech901", "The Collective Blueprint"],
      "Job placement": ["2Unique Community Salvation Foundation ", "A Fresh Start to a New Beginning", "Goodwill Excel Center Midsouth Inc.", "Greater Whitehaven Economic Redevelopment Corporation", "HopeWorks", "HopeWorks", "Persevere", "Priority Teachers University", "The Collective Blueprint", "World Relief Memphis"],
      "Literacy (reading and/or writing)": ["Goodwill Excel Center Midsouth Inc.", "Kingdom Community Builders", "Priority Teachers University", "World Relief Memphis"],
      "Employability/job readiness skills (e.g., making a resume)": ["2Unique Community Salvation Foundation ", "A Fresh Start to a New Beginning", "DeafConnect of the Mid-South, Inc.", "Goodwill Excel Center Midsouth Inc.", "Greater Whitehaven Economic Redevelopment Corporation", "Heights Community Development Corp", "HopeWorks", "Persevere", "Power Center CDC", "Priority Teachers University", "Shelby County Office of Reentry", "Tech901", "The Collective Blueprint", "World Relief Memphis"],
      "Access to technology": ["A Fresh Start to a New Beginning", "Goodwill Excel Center Midsouth Inc."],
      "Supportive services (e.g., housing)": ["2Unique Community Salvation Foundation ", "A Fresh Start to a New Beginning", "DeafConnect of the Mid-South, Inc.", "Goodwill Excel Center Midsouth Inc.", "Heights Community Development Corp", "M I C A H  - Memphis Interfaith Coalition for Action and Hope", "Persevere", "Power Center CDC", "RIVERVIEW-KANSAS COMMUNITY DEVELOPMENT CORPORATION", "Shelby County Division of Community Services", "Shelby County Office of Reentry", "The Collective Blueprint", "World Relief Memphis"],
      "Networking": ["2Unique Community Salvation Foundation ", "Heights Community Development Corp", "Leadership Memphis", "M I C A H  - Memphis Interfaith Coalition for Action and Hope"],
      "Financial counseling": ["2Unique Community Salvation Foundation ", "A Fresh Start to a New Beginning", "Greater Memphis Financial Empowerment Center & Bank on Memphis Coalition", "Greater Whitehaven Economic Redevelopment Corporation", "HopeWorks", "M I C A H  - Memphis Interfaith Coalition for Action and Hope", "Persevere", "Power Center CDC", "Priority Teachers University", "Refuge Memphis", "RISE Foundation, Inc."],
      "Education - high school": ["Goodwill Excel Center Midsouth Inc.", "Let's Innovate Through Education (LITE Memphis)", "M I C A H  - Memphis Interfaith Coalition for Action and Hope"],
      "Education - GED": ["A Fresh Start to a New Beginning", "HopeWorks", "HopeWorks", "Priority Teachers University"],
      "Education - college": [],
      "Mentorship": ["2Unique Community Salvation Foundation ", "Greater Whitehaven Economic Redevelopment Corporation", "Heights Community Development Corp", "Refuge Memphis", "RISE Foundation, Inc."],
      "Certifications": ["Goodwill Excel Center Midsouth Inc.", "Greater Whitehaven Economic Redevelopment Corporation", "Persevere", "Shelby County Office of Reentry", "The Collective Blueprint"]
*/
    }
  }
  handle() {
    let providerEl = $(".providers");
    providerEl.hide();
    let services = this.services;
    $('input:radio[name=services]').change(function() {
      providerEl.empty();
      providerEl.append("<br/>");
      for (const provider of services[this.value].providers) {
        providerEl.append("<strong>" + provider.name + "</strong><br/>");
        providerEl.append("<i>" + provider.phone_number + "</i><br/>");
        providerEl.append("<a href=\"mailto:" + provider.email + "\">" +
                provider.email + "</a><br/>");
        providerEl.append("<a href=\"" + provider.website + "\">" +
                provider.website + "</a><br/><br/>");
      }
      providerEl.show();
    });
  }
}
