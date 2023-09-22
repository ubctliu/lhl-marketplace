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
const createUserListingElement = (listing) => {
  const $listing = `<article class="listing">
        <header>
        <img src=${listing.image_url}></img>
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

const renderUserListings = (listings) => {
  for (const listing of listings) {
    const $listing = createUserListingElement(listing);
    $(".mylistings").prepend($listing);
  }
};

$(document).ready(() => {
  // hide drop-down menu on load
  $("#dropdown-menu-content").hide();

  // render normal listings
  $.get(`/api/users/userlistings`)
  .done(listings => {
    //console.log(listings);
    renderUserListings(listings);
  });
  
  $.get("/listings")
    .done(listings => {
      renderElement(listings, createListingElement, '.listings', 'listing');
    });

  // remove old featured listings and list new ones
  $.get("/listings/refeature");

  // render featured listings
  $.get("/listings/featured")
    .done(listings => {
      renderElement(listings, createListingElement, '.featured-listings', 'featured-listing');
    });
  
  // signout button event handler for dropdown menu
  $('#signout-link').click((event) => {
    event.preventDefault();

    $.post('/users/signout', () => {
      console.log("Signed out successfully.");
      window.location.href = '/';
    })
      .fail((err) => {
        console.log(err);
      });
  });

  // reveal drop-down menu on click
  $("#dropdown-menu-icon").click((event) => {
    $("#dropdown-menu-content").toggle();
  });

  // favorite star logic handlers
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
  $(".listings").on("click", "img", function() {
    const listingId = $(this).closest(".listing").find(".fa-solid.fa-star").attr("listing-id");
    window.location.href = `/listings/${listingId}`;
  });

  $(document).click((event) => {

    // click occurred outside the dropdown menu and button to close the dropdown menu
    if (!$(event.target).closest("#dropdown-menu-content").length && !$(event.target).is("#dropdown-menu-icon")) {
      $("#dropdown-menu-content").hide();
    }

  });
  $(".featured-listings").on("click", "img", function() {
    const listingId = $(this).closest(".featured-listing").find(".fa-solid.fa-star").attr("listing-id");
    window.location.href = `/listings/${listingId}`;
  });
});