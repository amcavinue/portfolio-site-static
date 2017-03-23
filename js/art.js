$(function() {
  // Toggle the filters form.
  $('#toggle-arrow').on('click', function() {
      if (!$(this).hasClass('up-arrow')) {
          $(this).attr('src', 'up-arrow.png');
          $(this).addClass('up-arrow');
          
      } else  {
          $(this).attr('src', 'down-arrow.png');
          $(this).removeClass('up-arrow')
      }
      
      $('#filters-fieldset').slideToggle(400);
  });
});