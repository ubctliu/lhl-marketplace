// Client facing scripts here
const escape = (str) => {
  return $('<div>').text(str).html();
};

const createListingElement = (listing) => {
  const $listing = `<article class="listing">
        <header>
        <img src=${listing.image_url}></img>
          <h3>${listing.title}</h3>
          <span class="seller-name">${listing.first_name} ${listing.last_name}</span>
        </header>
          <p class="listing-description">${escape(listing.description)}</p>
        <footer> 
        <div class="icons">
        </div>
        </footer>
      </article>`;
  return $listing;
};


const createFeaturedListingElement = (listing) => {
  const $listing = `<article class="featured-listing">
        <header>
        <img src=${listing.image_url}></img>
          <h3>${listing.title}</h3>
          <span class="seller-name">${listing.first_name} ${listing.last_name}</span>
        </header>
          <p class="listing-description">${escape(listing.description)}</p>
        <footer> 
        <div class="icons">
        </div>
        </footer>
      </article>`;
  return $listing;
};

const renderListings = (listings) => {
  for (const listing of listings) {
    const $listing = createListingElement(listing);
    $(".listings").prepend($listing);
  }
};


const renderFeaturedListings = (listings) => {
  for (const listing of listings) {
    const $listing = createFeaturedListingElement(listing);
    $(".featured-listings").prepend($listing);
  }
};

$(document).ready(() => {
  // hide drop-down menu on load
  $("#dropdown-menu-content").hide();

  $.get("/listings")
    .done(listings => {
      renderListings(listings);
    });

  $.get("/listings/featured")
    .done(listings => {
      renderFeaturedListings(listings);
    });
    
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