// Client facing scripts here
$(() => {
  $('#fetch-listings').on('click', () => {
    $.ajax({
      method: 'GET',
      url: '/api/listings'
    })
      .done((response) => {
        const $listingsList = $('#listings');
        $listingsList.empty();
        
        console.log(response.listings);
        return response.listings;
      });
  });
});
