// Client facing scripts here

$(document).ready(() => {
  // hide drop-down menu on load
  $("#dropdown-menu-content").hide();

  // reveal drop-down menu on click
  $("#dropdown-menu-icon").click((event) => {
    $("#dropdown-menu-content").toggle();
  });

  // on clicking logo, return to the main page
  $("#logo").click((event) => {
    window.location.href = "/";
  });
  
  $("#sign-in").click((event) => {
    window.location.href = "users/signin";
  });


  $(document).click((event) => {

    // click occurred outside the dropdown menu and button to close the dropdown menu
    if (!$(event.target).closest("#dropdown-menu-content").length && !$(event.target).is("#dropdown-menu-icon")) {
      $("#dropdown-menu-content").hide();
    }

  });
});