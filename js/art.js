function renderImages(images) {
  var imageHtml = "";
  images.forEach(function(image, i, arr) {
    imageHtml +=
      '<div class="col-xs-12 image-card">' +
        '<div class="card-container">' +
          '<div class="img-container col-md-9" data-description="' + image.filename + '">' +
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

function findKeywords(keywords, imageData) {
  // Return any images that match any of the keywords in any of their properties.
  // http://stackoverflow.com/questions/8517089/js-search-in-object-values
  var results = [];

  imageData.forEach(function(image, i) {
    imageLoop:
    for (var key in image) {
      for (var j = 0; j < keywords.length; j++) {
        if (image[key].toLowerCase().indexOf(keywords[j]) !== -1) {
          results.push(image);
          break imageLoop;
        }
      }
    }
  });
  
  // Remove duplicates from the results.
  results = results.filter(function(elem, index, self) {
    return index == self.indexOf(elem);
  });

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
    } else {
      $(this).attr('src', 'down-arrow.png');
      $(this).removeClass('up-arrow')
    }

    $('#filters-fieldset').slideToggle(400);
  });

  // Watch the filter form button.
  $('#filter-form').submit(function(e) {
    e.preventDefault();

    var inputs = $(this).serializeArray(); // Get the inputs from the UI.
    var keywords = [];
    
    // Sanitize the inputs.
    inputs.forEach(function(input, i) {
      if (input.name === "contains") {
        input = input.value;
      } else {
        input = input.name;
      }
      input = input.trim().toLowerCase().split(/[^a-zA-Z0-9']+/ig).filter(function(el, i, self) { return (el.length !== 0) && (i === self.indexOf(el)); }); // Sanitize contains.
      keywords = keywords.concat(input);
    });
    
    // Remove any duplicates.
    keywords = keywords.filter(function(input, i, arr) {
      return arr.indexOf(input) == i;
    });

    var results = findKeywords(keywords, imageData);

    if (results.length !== 0) {
      $('#js-render-images').empty().append(renderImages(results));
    } else {
      $('#js-render-images').empty().append(renderImages(imageData));
    }
  });
});