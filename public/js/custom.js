$(function() {
  $('.collapsed-menu-icon').on('click', function(e) {
    $('.sidebar, .desc-text').toggleClass('mobile-hidden');
    $(this).toggleClass('glyphicon-minus');
  });
});

