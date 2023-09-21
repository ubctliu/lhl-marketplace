// Client facing scripts here

const createChatRecordElement = (listing) => {
  const $chatRecord = `<article class="chat-record">
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
  return $chatRecord;
};

const renderFavoritedListings = (listings) => {
  for (const listing of listings) {
    const $listing = createChatRecordElement(listing);
    $(".chat-records").prepend($listing);
  }
};

$(document).ready(() => {
});
