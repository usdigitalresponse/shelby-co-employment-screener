$(document).ready(function() {
  let selectionHandler = new SelectionHandler();
  selectionHandler.handle();
  for (i = 0; i < 5; i++) {
    $('#next' + i).click(function() {
      selectionHandler.handle();
    });
  }
});

class SelectionHandler {
  constructor() {
    this.current_content_index = -1;
    this.content_classes = [ 'intro', 'q1', 'q2', 'q3', 'summary', 'matches' ];
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
    targetElem.append(next_elem);
    targetElem.show();
    next_elem.show();
  }
}
