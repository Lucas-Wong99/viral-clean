$(() => {
  $("#search-form").submit(function(event){
    event.preventDefault();

    const data = $(this).serialize();
    console.log(data);
    $.ajax({
      type: "GET",
      url: "/api/items/filter",
      data: data
    })
      .done(items => {
        $(".items-container").empty();
        for (const item of items) {
          $(".items-container").append(`
            <div class='item-container'>
              <div class='item-header'>
                <span>$ ${item.price / 100}</span>
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
        console.log(items);
      })
  });  
  
});

