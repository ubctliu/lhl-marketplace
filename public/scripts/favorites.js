// Client facing scripts here

const createFavoritedElement = (listing) => {
  const $favoritedListing = `<article class="favorited-listing">
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
  return $favoritedListing;
};

const renderFavoritedListings = (listings) => {
  for (const listing of listings) {
    const $listing = createFavoritedElement(listing);
    $(".favorited-listings").prepend($listing);
  }
};

$(document).ready(() => {
  $.get('/api/users/favorites')
    .done((favorites) => {
      renderFavoritedListings(favorites);
    });
});
