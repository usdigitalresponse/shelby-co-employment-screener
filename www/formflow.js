$(document).ready(function() {
  let selection_handler = new SelectionHandler();
  for (let i = 0; i < 5; i++) {
    $('#next' + i).click(function() {
      selection_handler.handle();
    });
  }
  let question_form_ids = ['zip_code', 'race'];
  for (let id of question_form_ids) {
    $("#" + id).submit(function(event) {
      switch (id) {
        case 'zip_code':
          selection_handler.client_data.zip_code = $("input").first().val();
          break;
        case 'race':
          selection_handler.client_data.race = 
                $('input[name=' + id + ']:checked', '#' + id).val();
          break; 
      }
      selection_handler.handle();
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
  }
  load(name) {
    switch (name) {
      case 'q2' :
        this.append_radios('race', this.race_types);
        break;
      case 'summary' :
        let el = $(".summary_div");
        el.empty();
        el.append('<p>Zip code: ' + this.client_data.zip_code + '</p>');
        el.append('<p>Race: ' + this.client_data.race + '</p>');
        break;
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
        '" /> ' + val + '</label><br/>');
    }
    el.append('<input type="submit" value="Next">');
  }
}
