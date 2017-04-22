function renderImages(images) {
  var imageHtml = "";
  images.forEach(function(image, i, arr) {
    imageHtml += 
        '<div class="col-xs-12 image-card">' +
          '<div class="card-container">' +
            '<div class="img-container" data-description="' + image.filename + '">' +
              '<span class="img-helper"></span>' +
              '<img src="' + image.src + '">' +
            '</div>' +
            '<h4>' + image.name + '</h4>' +
            (image.media ? '<span>' + image.media + '</span>' : '') +
            (image.media && image.year ? ', ' : '') +
            (image.year ? '<span>' + image.year + '</span>' : '') +
          '</div>' +
        '</div>';
  });
  return imageHtml;
}

function findKeywords(contains, tags, imageData) {
    debugger;
    // Remove any duplicate tags from contains.
    contains = contains.filter(function(val) {
        return tags.indexOf(val) == -1;
    });
    
    // Return any images that match any of the keywords in any of their properties.
    // http://stackoverflow.com/questions/8517089/js-search-in-object-values
    var results = [];
    
    // Look in each image object.
    for(var i = 0; i < imageData.length; i++) {
        // Look in every property of that image.
        imageLoop:
        for(var key in imageData[i]) {
            // For each property, look for all the keywords.
            for (var j = 0; j < contains.length; j++) {
                // If the keyword is in the property add the index to the results
                // and go to the next image.
                if(String(imageData[i][key]).toLowerCase().indexOf(contains[j]) !== -1) {
                    results.push(imageData[i]._id);
                    break imageLoop;
                }
            }
        }
    }
    
    return results;
}

$(function() {
  var imageData;
  
  // Load the images.
  $.getJSON("art-data.json", function(json) {
    imageData = json;
    $('#js-render-images').append(renderImages(json));
  });
  
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
  
  // Watch the filter form button.
  $('#filter-form').submit(function(e) {
     e.preventDefault();
     
     debugger;
     // Get the tag inputs from the UI.
     var inputs = $( this ).serializeArray(); 
     var contains = (inputs[0]['name'] === 'contains') ? inputs[0]['value'] : null;  // If the first object is the 'contains' input (it should be), return the value of the input.
     contains = contains.trim().toLowerCase().split(/[^a-zA-Z0-9']+/ig).filter(function(el, i, self) { return (el.length !== 0) && (i === self.indexOf(el)); }); // Sanitize contains.
     inputs.splice(0, 1);
     
     // Extract just the tag names from the form inputs.
     var formTags = [];
     inputs.forEach(function(input, i) {
       formTags.push(input['name']);
     });
     
     var results = findKeywords(contains, formTags, imageData);
     
     // Remove duplicates from the results.
     results = results.filter(function(elem, index, self) {
         return index == self.indexOf(elem);
     });
     
     // Replace image _ids with image objects.
     var resultImages = [];
     results.forEach(function(item, index) {
          var image = imageData.find(function(image) {
              return image._id === item;
          });
          
          if (image) {
              resultImages.push(image);
          }
     });
     
     /*if (results.length !== 0) {
         renderSelectCards(resultImages);
     } else {
         renderCards(imageData);
     }*/
  });
});