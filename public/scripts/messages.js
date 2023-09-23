// Client facing scripts here
const seenChatIds = new Set();
let currentUserId = 0;

const createChatTitle = (listing) => {
  const $chatTitle = `<span class="chat-conversation-title"><b>${listing.title} - $${listing.price}</b>
<img src=${listing.image_url}></img></span>`;
  return $chatTitle;
};


const createChatSidebarUser = (listing) => {
  const $chatItem = `<li class="chat-item" data-user-id="${listing.sender_id}" data-seller-id="${listing.receiver_id}" data-listing-id="${listing.id}">
  <span>${listing.first_name} ${listing.last_name} - ${ listing.title }</span>
  </li>`;
  return $chatItem;
};

const createChatRecordElement = (listing, userId) => {
  let $chatRecord = '';
  if (userId === listing.sender_id) {
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

const renderChatRecords = (records, listingId) => {
  $('.chat-records').empty();
  $('.chat-title').empty();

  const userId = currentUserId;
  const currentListingId = listingId;
  
  for (const record of records) {
    // if the chat is the same, attach all of the current chat records
    if (currentListingId === record.id) {
      const $record = createChatRecordElement(record, currentUserId);
      $('.chat-records').prepend($record);
    }

    if (!seenChatIds.has(record.id)) {
      const $chatItem = createChatSidebarUser(record);
      $('.chat-list').prepend($chatItem);
    }
    seenChatIds.add(record.id);
  }

  const $chatTitle = createChatTitle(records[0]);
  $('.chat-title').prepend($chatTitle);
};

const renderEmptyChat = (listing) => {
  $('.chat-records').empty();
  $('.chat-title').empty();
  const $chatTitle = createChatTitle(listing);
  if (!seenChatIds.has(listing.id)) {
    const $chatItem = createChatSidebarUser(listing);
    $('.chat-list').prepend($chatItem);
  }
  seenChatIds.add(listing.id);
  $('.chat-title').prepend($chatTitle);
};

$(document).ready(() => {
  // declare templateVars default values
  const templateVars = {
    userId: 0,
    sellerId: 0,
    listingId: 0,
    message: '',
  };

  // call api to get current logged-in user
  $.get('/api/users/getuserid')
    .done((data) => {
      currentUserId = data.userId;
    });

  const chatHistoryExists = $('#listing-data-carrier').data('chat-history');
  // if chat history doesn't exist already, render an empty chat box
  if (!chatHistoryExists) {
    const listing = {
      id: $('#listing-data-carrier').data('listing-id'),
      sender_id: $('#listing-data-carrier').data('user-id'),
      receiver_id: $('#listing-data-carrier').data('seller-id'),
      title: $('#listing-data-carrier').data('title'),
      description: $('#listing-data-carrier').data('description'),
      price: $('#listing-data-carrier').data('price'),
      category: $('#listing-data-carrier').data('category'),
      stock: $('#listing-data-carrier').data('stock'),
      is_featured: $('#listing-data-carrier').data('is-featured'),
      image_url: $('#listing-data-carrier').data('image-url'),
      is_deleted: $('#listing-data-carrier').data('is-deleted'),
      first_name: $('#listing-data-carrier').data('first-name'),
      last_name: $('#listing-data-carrier').data('last-name')
    };
    renderEmptyChat(listing);
  }

  // call api to render latest chat
  $.get('/api/messages/chat-history')
    .done((history) => {
      const latestChat = history[0];
      if (latestChat.sender_id !== currentUserId) {
        templateVars.userId = latestChat.receiver_id;
        templateVars.sellerId = latestChat.sender_id;
        templateVars.listingId = latestChat.listing_id;
      } else {
        templateVars.userId = currentUserId;
        templateVars.sellerId = latestChat.receiver_id;
        templateVars.listingId = latestChat.listing_id;
      }
      renderChatRecords(history, latestChat.listing_id);
    });
    
  // attach a click event listener to each chat-item in the sidebar
  $('.chat-list').on('click', '.chat-item', function() {
    const listingId = $(this).data('listing-id');
    const userId = $(this).data('user-id');
    const sellerId = $(this).data('seller-id');
    templateVars.message = $('.message-input').val();
    templateVars.userId = userId;
    templateVars.sellerId = sellerId;
    templateVars.listingId = listingId;

    // fetch the chat history for the selected chat
    $.get(`/api/messages/chat-history/${userId}/${sellerId}/${listingId}`)
      .done((chatHistory) => {
        if (typeof chatHistory === 'object' && !Array.isArray(chatHistory)) {
          const listing = {
            id: $('#listing-data-carrier').data('listing-id'),
            user_id: $('#listing-data-carrier').data('user-id'),
            title: $('#listing-data-carrier').data('title'),
            description: $('#listing-data-carrier').data('description'),
            price: $('#listing-data-carrier').data('price'),
            category: $('#listing-data-carrier').data('category'),
            stock: $('#listing-data-carrier').data('stock'),
            is_featured: $('#listing-data-carrier').data('is-featured'),
            image_url: $('#listing-data-carrier').data('image-url'),
            is_deleted: $('#listing-data-carrier').data('is-deleted'),
            first_name: $('#listing-data-carrier').data('first-name'),
            last_name: $('#listing-data-carrier').data('last-name')
          };
          renderEmptyChat(listing);
        } else {
          renderChatRecords(chatHistory, listingId);
        }
      })
      .fail((err) => {
        console.error(err);
      });
  });


  // post a new message upon pressing enter on the textbox
  $('.message-input').keydown(function(event) {
    // if space is pressed
    if (event.keyCode === 13) {
      event.preventDefault();
      templateVars.message = $('.message-input').val();
      // message must be at least 1 character
      if (templateVars.message.length <= 0) {
        return;
      }
      $.ajax({
        type: 'POST',
        url: '/messages/sendmessage',
        data: templateVars,
        success: function(response) {
          // reload after posting
          location.reload();
        },
        error: function(err) {
          console.error(err);
        }
      });
    }
  });
  
  // post a new message upon clicking the plane icon
  $('.fa-solid.fa-paper-plane').click((event) => {
    templateVars.message = $('.message-input').val();
    // message must be at least 1 character
    if (templateVars.message.length <= 0) {
      return;
    }
    $.ajax({
      type: 'POST',
      url: '/messages/sendmessage',
      data: templateVars,
      success: function(response) {
        // reload after posting
        location.reload();
      },
      error: function(err) {
        console.error(err);
      }
    });
  });

});
