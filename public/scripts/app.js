$(() => {
  // Creates and appends item elements to the items-container, given an array of items
  const renderItems = (items) => {
    $(".items-container").empty();
    for (const item of items) {
      $(".items-container").append(`
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
            <i class="fas fa-star"></i>
          </div>
        </div>
      `)
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
    const data = { item_id: event.target.title };

    $.ajax({
      type: "POST",
      url: "/api/favourites",
      data: data
    })
    .done(confirmed => {
      $(".fa-star").addClass("yellow");
    })
  });

});

