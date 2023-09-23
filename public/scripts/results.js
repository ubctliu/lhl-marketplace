const displayResults = (results) => {
  const $searchRes = `<article class="search-results">
  <header>
  <img src=${results.image_url}></img>
  <span class="fa-solid fa-star" listing-id=${results.id}></span>
    <h3>${results.title} - $${results.price}</h3>
  </header>
    <p class="listing-description">${escape(results.description)}</p>
  <footer>
  <div class="icons">
  </div>
  </footer>
</article>`;
  return $searchRes;
};

const renderRes = (results) => {
  for (const result of results) {
    const $res = displayResults(result);
    $(".result-listings").prepend($res);
  }
};

$(document).ready(() => {
  const queryTerm = $('.result-listings').data('query-term');

  $.get(`/api/results/${queryTerm}`)
    .done((results) => {
      renderRes(results);
    });
});
