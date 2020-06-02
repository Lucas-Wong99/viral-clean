const addEventListenerToFavouriteButtons = () => {
  $('.favourite-button').on('click', (event) => {
    console.log(event);
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
    } else {
      const data = { item_id: event.target.getAttribute("data-id") };
      $.ajax({
        type: "POST",
        url: "/api/favourites",
        data: data
      })
      .done(confirmed => {
        $(event.target).addClass("yellow");
      })
    }
  });
}

const addEventListenerToDeleteButtons = () => {
  $('.delete-button').on('click', (event) => {
    const item_id = event.target.getAttribute("data-id");
        const data = { item_id };
        $.ajax({
          type: "POST",
          url: `/api/items/${item_id}/delete`,
          data: data
        })
        .done(result => {
          console.log(result);
          $(`.items-container > *[data-id="${result.id}"]`).remove();
        });
  });
};

const addEventListenerToSellButtons = () => {
  $('.sell-button').on('click', (event) => {
  const item_id = event.target.getAttribute("data-id");
    const data = { item_id };
    $.ajax({
      type: "POST",
      url: `/api/items/${item_id}/sell`,
      data: data
    })
    .done(result => {
      console.log(result);
      //$(`.items-container > *[data-id="${result.id}"] > .item-header > .item-price`).text('SOLD');
      $(`.items-container > *[data-id="${result.id}"] > .own-item-footer > *`).remove();
      $(`.items-container > *[data-id="${result.id}"] > .own-item-footer`).append("<h2 class='item-sold'>SOLD</h2>");
    });
  });
}


const addEventListenerToSearchFormSubmit = () => {
  $("#search-form").submit(function(event){
    event.preventDefault();
    const data = $(this).serialize();
    $.ajax({
      type: "GET",
      url: "/api/items/filter",
      data: data
    })
      .done(items => {
        $("body > .items-container").empty();
        $("body > .items-container").append(items);
        addEventListenerToFavouriteButtons();
        addEventListenerToSellButtons();
        addEventListenerToDeleteButtons();
      })
  });
};

const addEventListenerToSearchFormOnChange = () => {
  $(".search-form-order").on('change', function(event){
    event.preventDefault();
    const data = $('#search-form').serialize();
    $.ajax({
      type: "GET",
      url: "/api/items/filter",
      data: data
    })
      .done(items => {
        $("body > .items-container").empty();
        $(".items-container").append(items);
        addEventListenerToFavouriteButtons();
        addEventListenerToSellButtons();
        addEventListenerToDeleteButtons();
      })
  });

};
