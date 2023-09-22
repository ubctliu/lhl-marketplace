// Client facing scripts here
const escape = (str) => {
  return $('<div>').text(str).html();
};

const createListingElement = (listing, articleClassName) => {
  const $listing = `<article class=${articleClassName}>
        <header>
        <img src=${listing.image_url}></img>
        <span class="fa-solid fa-star" listing-id=${listing.id}></span>
          <h3>${listing.title} - $${listing.price}</h3>
        </header>
          <p class="listing-description">${escape(listing.description)}</p>
        <footer> 
        <div class="icons">
        </div>
        </footer>
      </article>`;
  return $listing;
};

const renderElement = (listings, callback, container, articleClassName) => {
  for (const listing of listings) {
    const $listing = callback(listing, articleClassName);
    $(container).prepend($listing);
  }
};

$(document).ready(() => {
  // hide drop-down menu on load
  $("#dropdown-menu-content").hide();

  $.get("/listings")
    .done(listings => {
      renderElement(listings, createListingElement, '.listings', 'listing');
    });

  $.get("/listings/refeature");

  $.get("/listings/featured")
    .done(listings => {
      renderElement(listings, createListingElement, '.featured-listings', 'featured-listing');
    });
    

  // reveal drop-down menu on click
  $("#dropdown-menu-icon").click((event) => {
    $("#dropdown-menu-content").toggle();
  });

  $(".listings").on("click", ".fa-solid.fa-star", function() {
    $(this).toggleClass('yellow-star');
    const listingId = Number($(this).attr("listing-id"));
    $.post("/users/favorites", { listingId });
  });

  $(".favorited-listings").on("click", ".fa-solid.fa-star", function() {
    $(this).toggleClass('yellow-star');
    const listingId = Number($(this).attr("listing-id"));
    $.post("/users/favorites", { listingId });
    location.reload();
  });


  $(".featured-listings").on("click", ".fa-solid.fa-star", function() {
    $(this).toggleClass('white-star');
    const listingId = Number($(this).attr("listing-id"));
    $.post("/users/favorites", { listingId });
  });


  $(document).click((event) => {

    // click occurred outside the dropdown menu and button to close the dropdown menu
    if (!$(event.target).closest("#dropdown-menu-content").length && !$(event.target).is("#dropdown-menu-icon")) {
      $("#dropdown-menu-content").hide();
    }

  });
});