(function($) {
  "use strict"; // Start of use strict

  // Preloader 

  $('body').jpreLoader({
    splashID: "#jSplash",
    autoClose: true,
  }, function() {	//callback function
    checkDevice();
    invertNavbar();
    toSwipe();
    $('#footer')
    .animate({"bottom":0}, 500);
    $('#header')
    .animate({"top":0}, 800, function() {
        $('#wrapper').fadeIn(1000);
    });
  });

  $(window).on('resize', function(){
    checkDevice();
  });

  function checkDevice(){
    var win = $(window); //this = window
    if (win.width() <= 992){
      $('#services').addClass('invert-menu');
    }
    else {
      $('#services').removeClass('invert-menu');
    }
  }

  function invertNavbar(){
    if ($('.swiper-slide-active').hasClass('invert-menu')){
      $('nav, footer, #navbar-toggler, .breadcrumb, .swipe').addClass('inverted');
    }
    else{
        $('nav, footer, #navbar-toggler, .breadcrumb, .swipe').removeClass('inverted');
    }
  }

  function toSwipe(){
    if ($('.swiper-slide-active').hasClass('to-swipe')){
      $('.swipe').addClass('show');
    }
    else{
      $('.swipe').removeClass('show');
    }
  }

  // Navigation

  var navigation = new Swiper('#content', {
    speed: 1000,
    direction: 'vertical',
    mousewheel: true,
    forceToAxis: true,
    hashNavigation:true
  });
  navigation.on('slideChangeTransitionStart', function () {
    $('nav li').removeClass('active');
    $('nav li').eq(navigation.realIndex).addClass('active');
    invertNavbar();
    toSwipe();
    breadCrumb();
  });
  navigation.on('slideChangeTransitionEnd', function () {
    var acs = document.querySelectorAll('.swiper-slide-active:not(.ignore-slide)')[0];
    var hasVerticalScrollbar = acs.scrollHeight > acs.clientHeight;
    //console.log(hasVerticalScrollbar);
            
    if (hasVerticalScrollbar) {
        var scrollHeight = acs.scrollHeight;
        var slideSize = acs.swiperSlideSize;
        var scrollDifferenceTop = scrollHeight - slideSize;

        acs.addEventListener('wheel', findScrollDirectionOtherBrowsers);

        function findScrollDirectionOtherBrowsers(event) {
            var scrollDifference = scrollHeight - slideSize - acs.scrollTop;

            // Scroll wheel browser compatibility
            var delta = event.wheelDelta || -1 * event.deltaY;
            
            // Enable scrolling if at edges
            var spos = delta < 0 ? 0 : scrollDifferenceTop;
            
            if (!(scrollDifference == spos))
                navigation.mousewheel.disable();
            else
                navigation.mousewheel.enable();
        }
    }
  });
  function breadCrumb(){
    $('.breadcrumb').text($('.swiper-slide-active:not(".ignore-slide")').attr('data-breadcrumb'));
  }


  // Responsive Nav

  $('#navbar-toggler').click(function() {
    $(this).toggleClass('open');
    $('.mobile-navbar').toggleClass('show');
  });

  $('nav li a, .mobile-navbar a').on( "click", function(event){
    event.preventDefault();
    navigation.slideTo($(this).attr('data-slide'));
    $('.mobile-navbar').removeClass('show');
    $('#navbar-toggler').removeClass('open');
  });

  // Info Section

  var info = new Swiper('#info .swiper-container', {
    effect: 'fade'
  });
  $('#info a').on( "click", function(event){
    event.preventDefault();
    info.slideTo($(this).attr('data-slide'));
  });

  // Services 

  var services = new Swiper('#services-mobile .swiper-container', {
    effect: 'fade'
  });


  // Work Section

  var works = new Swiper('#works .swiper-container', {
    spaceBetween: 10,
    freeMode: true,
    slidesPerView: 'auto',
    grabCursor: true,
    navigation: {
      nextEl: '.move-right',
      prevEl: '.move-left',
    }
  });
  $('#works .swiper-wrapper').mousemove(function(event){
    if (event.pageX <= $(window).width()/3){
        works.translateTo(works.width, 5000);
    }
    else if (event.pageX >= ($(window).width()/3)*2){
        works.translateTo(-works.width, 5000);
    }
    else{
        works.translateTo(works.getTranslate(), 0);
    }
  });

  //Clients Section

  var clients = new Swiper('#clients .swiper-container', {
    slidesPerView: 3,
    slidesPerGroup: 3,
    loop: true,
    autoplay: {
        delay: 2500,
        disableOnInteraction: true,
    },
    breakpoints: {
        767: {
            slidesPerView: 3,
            slidesPerGroup: 3
        },
        992: {
            slidesPerView: 6,
            slidesPerGroup: 3
        }
    }
  });

})(jQuery); // End of use strict