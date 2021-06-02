

//Click targeted auto scrolls for sidebar and landing page (main picture) scroll down

$('document').ready(() => {
  $('.container-scroll').on('click', function() {
    console.log('TARGETED')
    var position = $(".Appetizers").offset().top - 225;
    $("HTML, BODY").animate({
        scrollTop: position
    }, 1000);
  });

  $("#app").click(function () {
  $('.Appetizers')[0].scrollIntoView({block: 'center'});
});
$("#main").click(function () {
  $('.Mains')[0].scrollIntoView({block: 'center'});
});
$("#desserts").click(function () {
  $('.Desserts')[0].scrollIntoView({block: 'center'});
});
$("#drinks").click(function () {
  $('.Drinks')[0].scrollIntoView({block: 'center'});
});
$("#white").click(function () {
  $('.Whites')[0].scrollIntoView({block: 'center'});
});
$("#red").click(function () {
  $('.Reds')[0].scrollIntoView({block: 'center'});
});
$("#beer").click(function () {
  $('.Beers')[0].scrollIntoView({block: 'center'});
});
$("#cocktails").click(function () {
  $('.Cocktails')[0].scrollIntoView({block: 'center'});
});

$(".fa-search").click(function (data) {
  let searchParam = $('input.search').val();
  console.log(searchParam);
  $.ajax({
    url: `/api/menu/name/${searchParam}`,
    method: 'GET'
  }).then((result)=> {
    console.log(result);
    $(`#menu${result.menu_item[0].id}`)[0].scrollIntoView({block: 'center'});
  })

  })
})
