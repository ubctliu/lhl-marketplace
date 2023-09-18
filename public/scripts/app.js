// Client facing scripts here

$(document).ready(() => {
  
  // hide drop-down menu on load
  $("#dropdown-menu-content").hide();

  // reveal drop-down menu on click
  $("#dropdown-menu-icon").click((event) => {
    $("#dropdown-menu-content").toggle();
  });

  $(document).click((event) => {

    // Click occurred outside the dropdown menu and button
    if (!$(event.target).closest("#dropdown-menu-content").length && !$(event.target).is("#dropdown-menu-icon")) {
      $("#dropdown-menu-content").hide();
    }

  });
});