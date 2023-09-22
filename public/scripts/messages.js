// Client facing scripts here

const createChatTitle = (listing) => {
  const $chatTitle = `<span class="chat-conversation-title"><b>${listing.title} - $${listing.price}</b>
<img src=${listing.image_url}></img></span>`;
  return $chatTitle;
};

const createChatRecordElement = (listing, userId) => {
  let $chatRecord = "";
  if (listing.sender_id === userId) {
    $chatRecord = `<article class="user-chat-record">
        <header>
        </header>
          <span>${listing.message}</span>
        <footer> 
        <div class="icons">
        </div>
        </footer>
      </article>`;
  } else {
    $chatRecord = `<article class="other-chat-record">
        <header>
        </header>
          <span>${listing.message}</span>
        <footer> 
        <div class="icons">
        </div>
        </footer>
      </article>`;
  }
  return $chatRecord;
};

const renderChatRecords = (records) => {
  const userId = records[0].sender_id;
  for (const record of records) {
    const $record = createChatRecordElement(record, userId);
    $(".chat-records").prepend($record);
  }
  const $chatTitle = createChatTitle(records[0]);
  $(".chat-title").prepend($chatTitle);
};

$(document).ready(() => {
  // $.get('/api/messages/chat-history')
  //   .done((history) => {
  //     console.log(history[0].sender_id, history[0].receiver_id);
  //     $.get(`/api/messages/chat-history/${ history[0].sender_id }/${ history[0].receiver_id }`)
  //       .done((totalHistory) => {
  //         renderChatRecords(totalHistory);
  //       });
  //   });

  $.get('/api/messages/chat-history')
    .done((history) => {
      renderChatRecords(history);
    });
});
