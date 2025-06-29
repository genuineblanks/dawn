// Section Scroll JS - Enhanced with back button detection

$(document).ready(function() {
  const $sections = $('section');
  let inScroll = false;
  const durationOneScroll = 600;
  let currentSection = 0;
  let isBackButtonNavigation = false;

  // Detect back button navigation
  window.addEventListener('pageshow', function(event) {
    if (event.persisted) {
      isBackButtonNavigation = true;
      // Disable wheel hijacking for 2 seconds after back navigation
      setTimeout(() => {
        isBackButtonNavigation = false;
      }, 2000);
    }
  });

  const arrSections = $sections.map(function() {
    return $(this).offset().top;
  }).get();

  $(document).on('wheel', function(event) {
    // Skip wheel hijacking if back button was used
    if (isBackButtonNavigation || inScroll) return;
    
    inScroll = true;

    // move down
    if (event.originalEvent.deltaY > 0) {
      currentSection = currentSection >= arrSections.length - 1
        ? arrSections.length - 1
        : currentSection + 1;
    } else {
      // move up
      currentSection = currentSection === 0 ? 0 : currentSection - 1;
    }

    $('html, body').animate({
      scrollTop: arrSections[currentSection]
    }, {
      duration: durationOneScroll,
      complete: function() {
        inScroll = false;
      }
    });
  });

  var btn = $('#button');
  btn.on('click', function(e) {
    e.preventDefault();
    $('html, body').animate({scrollTop: 0}, 300);
    currentSection = 0;
  });
});

$(document).ready(function(){
  $(".changeSection").click(function(){
    var parentSectionClass = $(this).closest("section").attr("class");
    // Check if the parent section's class contains 'hidden'
    if (parentSectionClass && parentSectionClass.includes('luxury-collection')) {
       $('.high-end-collection').show();
       $('.luxury-collection').hide();
    } else if(parentSectionClass && parentSectionClass.includes('high-end-collection')){
      $('.high-end-collection').hide();
       $('.luxury-collection').show();
    }
  });  
});
//document.querySelectorAll('video').forEach((video) => video.play());

 $(document).ready(function(){
   $(".click-to-scroll a").on('click', function(event) {
     if (this.hash !== "") {
      event.preventDefault();
      var hash = this.hash;
       $('html, body').animate({
         scrollTop: $(hash).offset().top
       }, 800, function(){
         window.location.hash = hash;
       });
     }
   });
});
