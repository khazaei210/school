function ajaxLoad(){
  // BLOCK THE PAGE WHILE AJAX FETCHES THE DATA
  show();

  // INIT AJAX
  var xhr = new XMLHttpRequest();
  xhr.open('GET', "ajax-page.php", true);
  xhr.onload = function(){
    // DO SOMETHING WITH THE RESPONSE
    console.log(this.response);

    // UNBLOCK THE PAGE WHEN AJAX COMPLETE
    hide();
  };

  // GO AJAX!
  xhr.send();
}