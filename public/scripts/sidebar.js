$(document).ready(() => {
  console.log('window width: ', $(window).width())
  if ($(window).width() > 1750) {
  var $sidebar   = $("div.accordian, .checkout"),
        $window    = $(window),
        offset     = $sidebar.offset(),
        topPadding = 50;

        $window.scroll(function() {

          if ($window.scrollTop() > (offset.top-195)) {
              $sidebar.stop().animate({
                  marginTop: $window.scrollTop() - (offset.top-195) + topPadding
              });
          } else if($window.scrollTop() < offset.top) {
            $sidebar.stop().animate({
              marginTop: 82
            });
          } else {
              $sidebar.stop().animate({
                  marginTop: "1 rem"
              });
          }
        });
      }
})
