function createPhotosetElement(photoset, width) {
    return $('<div>')
        .addClass('set')
        .attr('id', photoset.id)

        .append(
            $('<div>')
            .addClass('photo')
            .append(
                $('<img>')
                .attr('src', $('.flickr').getPhotoURL(photoset, width))
            )
            .append(
                    $('<div>')
                    .addClass('caption')
                    .text(photoset.title._content)
                )
            );
}

function displayPhotos(event, response) {
    var that = this;
    var width = $(this).width();
    
    // If the response from the plugin is a list of photosets it will be created according to 
    // createPhotosetElement above. If it is the photos of a set, it will be sent to the gallery plugin.
    // To create your own imlpementation, either modify the createPhotoset function above or write another 
    // plugin for display.
    // The reason it's built this way is to keep the jQuery plugins separate from the display code.
    // See one way of using these plugins on nmattisson.com
    if (response.photosets !== undefined) {
        // This Regex will show all sets starting with four digits.
        var regexp = /^\d{4}/;
        // Arrays are reversed because the Flickr API returns the photos that way.
        $.each(response.photosets.photoset.reverse(), function(i, photoset) {
            if (regexp.test(photoset.title._content)) $(that).append(createPhotosetElement(photoset, width));
        });
    } else if (response.photoset.photo !== undefined) {
        // 
        $('.flickr').gallery({
            rowLength: width,
            rowHeight: width/4
        }, response.photoset.photo.reverse());
    }
}


$(document).ready(function() {
    // To show a specific photoset, set it's ID:
    // var photoset_id = [get your photoset ID, perhaps through a URL Parameter]
    var photoset_id = '';
    
    // Display photos after flickr loaded
    $('.flickr').on('didLoadFlickr', displayPhotos);
    // Reload page on resize (useful if you want the page to respond to user interaction)
    // $(window).on('resize',function(){ location.reload();});
    $('.flickr').flickr({
        photoset_id: photoset_id,
        username: [Flickr username],
        api_key: [Flickr api_key],
        user_id: [Flickr user id]
    });
});