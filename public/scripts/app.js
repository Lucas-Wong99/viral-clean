$(() => {
  // Creates and appends item elements to the items-container, given an array of items
  const renderItems = (items) => {
    $(".items-container").empty();
    for (const item of items) {
      let str = `
        <div class='item-container'>
          <div class='item-header'>
            <span>$${item.price / 100}</span>
            <span>3 days ago</span>
          </div>
          <div class='item-main'>
            <img src="${item.image_url}">
            <a href="/api/items/${item.id}"><h3>${item.name}</h3></a>
          </div>
          <div class='item-footer'>
            <a class="favourite-button">`;

            if (item.user_id === null) {
            str += `<i class="fas fa-star" data-id="${item.id}"></i>`;
            } else {
              str += `<i class="fas fa-star yellow" data-id="${item.id}"></i>`;
            }
            str += `</a>
            </div>
            </div>`;
      $(".items-container").append(str);
    }
  };

  $("#search-form").submit(function(event){
    event.preventDefault();
    const data = $(this).serialize();
    $.ajax({
      type: "GET",
      url: "/api/items/filter",
      data: data
    })
      .done(items => {
        renderItems(items);
      })
  });

  $(".search-form-order").on('change', function(event){
    event.preventDefault();
    const data = $('#search-form').serialize();
    $.ajax({
      type: "GET",
      url: "/api/items/filter",
      data: data
    })
      .done(items => {
        renderItems(items);
      })
  });

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
          $(`#all-items-container > *[data-id="${result.id}"]`).remove();
        });
  });

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
          $(`.items-container > *[data-id="${result.id}"] > .item-header > .item-price`).text('SOLD');
        });
  });
});

