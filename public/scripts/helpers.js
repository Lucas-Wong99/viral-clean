const addEventListenerToFavouriteButtons = () => {

  // When a favourite button is clicked, 
  $('.favourite-button').on('click', (event) => {
    
    // If an item is already favourited, remove it from favourites
    if ($(event.target).hasClass('yellow')) {
      const item_id = event.target.getAttribute("data-id");
      const data = { item_id };
      $.ajax({
        type: "POST",
        url: `/api/favourites/${item_id}`,
        data: data
      })
      .done(result => {
        $(event.target).removeClass("yellow");
        $(`#favourites-container > *[data-id="${result.item_id}"]`).remove();
      });

    // If an item is not favourited, add it to favourites
    } else {
      const data = { item_id: event.target.getAttribute("data-id") };
      $.ajax({
        type: "POST",
        url: "/api/favourites",
        data: data
      })
      .done(confirmed => {
        $(event.target).addClass("yellow");
      });
    }
  });
}

const addEventListenerToDeleteButtons = () => {

  // When a delete button is clicked
  $('.delete-button').on('click', (event) => {

    // Get an id of the item to be deleted
    const item_id = event.target.getAttribute("data-id");
    const data = { item_id };

    // Make an ajax request to the delete route
    $.ajax({
      type: "POST",
      url: `/api/items/${item_id}/delete`,
      data: data
    })

    // On done, remove the deleted item from the main container
    .done(result => {
      $(`.items-container > *[data-id="${result.id}"]`).remove();
    });
  });
};

const addEventListenerToSellButtons = () => {

  // When a sell button is clicked
  $('.sell-button').on('click', (event) => {

    // Get an id of the item to be marked as sold
    const item_id = event.target.getAttribute("data-id");
    const data = { item_id };

    // Make an ajax request to the sell route
    $.ajax({
      type: "POST",
      url: `/api/items/${item_id}/sell`,
      data: data
    })

    // On done, remove the buttons from item's footer and put word 'SOLD' instead
    .done(result => {
      $(`.items-container > *[data-id="${result.id}"] > .own-item-footer > *`).remove();
      $(`.items-container > *[data-id="${result.id}"] > .own-item-footer`).append("<h2 class='item-sold'>SOLD</h2>");
    });
  });
}


const addEventListenerToSearchFormSubmit = () => {
  
  // When the main search form is submitted
  $("#search-form").submit(function(event){
    event.preventDefault();
    
    // Serialize its data and make a request to the filter route
    const data = $(this).serialize();
    $.ajax({
      type: "GET",
      url: "/api/items/filter",
      data: data
    })

    // On done, empty the main items container and append the results to it
    .done(items => {
      $("body > .items-container").empty();
      $("body > .items-container").append(items);
      
      // Add button event listeners for the appended items
      addEventListenerToFavouriteButtons();
      addEventListenerToSellButtons();
      addEventListenerToDeleteButtons();
    })
  });
};

const addEventListenerToSearchFormOnChange = () => {

  // When the order by select element is changed
  $(".search-form-order").on('change', function(event){
    event.preventDefault();
    
    // Serialize the data and make a request to the filter route
    const data = $('#search-form').serialize();
    $.ajax({
      type: "GET",
      url: "/api/items/filter",
      data: data
    })
    
    // On done, empty the main items container and append the results to it
    .done(items => {
      $("body > .items-container").empty();
      $(".items-container").append(items);

      // Add button event listeners for the appended items
      addEventListenerToFavouriteButtons();
      addEventListenerToSellButtons();
      addEventListenerToDeleteButtons();
    })
  });
};

const addEventListenerToFullItemDeleteButton = () => {

  // 
  $('.full-item-buttons > .delete-button').on('click', (event) => {
    const item_id = event.target.getAttribute("data-id");
      const data = { item_id };
      $.ajax({
        type: "POST",
        url: `/api/items/${item_id}/delete`,
        data: data
      })
      .done(result => {
        window.location.href = "/api/items";
      });
    });
};


const addEventListenerToFullItemSellButton = () => {
  $('.full-item-buttons > .sell-button').on('click', (event) => {
    const item_id = event.target.getAttribute("data-id");
    const data = { item_id };
      $.ajax({
        type: "POST",
        url: `/api/items/${item_id}/sell`,
        data: data
      })
      .done(result => {
        window.location.href = "/api/items";
      });
    });
};

const addEventListenerToSubmitMessage = () => {
  //
  $(".message-seller-form").on('submit', function(event) {
    event.preventDefault();
    const item_id = event.target.getAttribute("item-id");

      //Submits an AJAX post request and passes a data to the server route
      $.ajax({
        type: "POST",
        url: `/api/items/${item_id}/messages`,
        data: {
          message: $('#message-to-seller').val(),
          item_id: item_id,
          receiver_id: event.target.getAttribute("receiver-id")}
      })
      //On done, clears the input and redirects the user to /api/messages
      .done(result => {
        $('#message-to-seller').val('');
        window.location.href = "/api/messages";
      });
    });
}

const addEventListenerToThreadMessageFormSubmit = () => {
  //When a user submits a message to this form
  $("#thread-message-form").on('submit', function(event) {
    event.preventDefault();

    const item_id = $("#thread-message-form-item-id").val();
    const data = $(this).serialize();
    
    //An ajax request to id/messages
    $.ajax({
      type: "POST",
      url: `/api/items/${item_id}/messages`,
      data: data
    })
    //On done, prepends the message returned to the message container and clears the input
    .done(result => {
      $('#new-message').val('');
      $('.only-messages-container').prepend(result);
    })
  });
}

