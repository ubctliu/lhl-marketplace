// Fetch user's listings from the server
const fetchUserListings = (userId) => {
    fetch(`/api/user/${userId}/listings`)
      .then(response => response.json())
      .then(data => {
        // Assuming the data is an array of listing objects
        const listings = data.listings;
  
        // Get the listings container
        const listingsContainer = document.querySelector('.listing-list');
  
        // Clear any existing listings
        listingsContainer.innerHTML = '';
  
        // Render up to 4 listings
        listings.slice(0, 4).forEach(listing => {
          const li = document.createElement('li');
          li.classList.add('listing-item');
  
          const img = document.createElement('img');
          img.src = listing.image_url;
          img.alt = listing.title;
          img.classList.add('listing-image');
  
          const title = document.createElement('h2');
          title.textContent = listing.title;
  
          const description = document.createElement('p');
          description.textContent = listing.description;
  
          li.appendChild(img);
          li.appendChild(title);
          li.appendChild(description);
  
          listingsContainer.appendChild(li);
        });
      })
      .catch(error => {
        console.error('Error fetching user listings:', error);
      });
  };
  
  
  fetchUserListings(1);
  
const listingsContainer = document.querySelector('.listing-list');
