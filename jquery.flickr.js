/*! jQuery Flickr - 2013-12-27
* http://github.com/nmattisson
* Copyright (c) 2013 Nils Mattisson - MIT License */

(function($) {
    function composeRequestURL(options) {
        console.log("Compose URL with options:");
        console.log(options);

        var _url;
        if (options.user_id == null || options.api_key == null) {
            throw 'You must provide an api_key and a user_id.';
        } else if (options.photoset_id == '') {
            _url = 'https://secure.flickr.com/services/rest/?method=flickr.photosets.getList';
            _url += ("&api_key=" + options['api_key']);
            _url += ("&user_id=" + options['user_id']);
            _url += '&format=json&jsoncallback=?';
        } else {
            _url = 'https://secure.flickr.com/services/rest/?method=flickr.photosets.getPhotos';
            _url += ("&photoset_id=" + options['photoset_id']);
            _url += ("&api_key=" + options['api_key']);
            _url += ("&user_id=" + options['user_id']);
            _url += '&format=json&jsoncallback=?';
        }
        
        return _url;
    }
    
    $.fn.getPhotoURL =  function (photo, min_size) {
        // TODO: Should check to see if the following exist.
        // * Before May 25th 2010 large photos only exist for very large original images.
        // † Medium 800 photos only exist after March 1st 2012.
        
        var size_suffix;
        switch (true) {
            case (min_size <= 100):
                size_suffix = '_t';
                break;
            case (min_size > 100 && min_size <= 240):
                size_suffix = '_m';
                break;
            case (min_size > 240 && min_size <= 320):
                size_suffix = '_n';
                break;
            case (min_size > 320 && min_size <= 500):
                size_suffix = ''; // Documentation says '-' which made Nils :-/
                break;
            case (min_size > 500 && min_size <= 640):
                size_suffix = '_z';
                break;
            case (min_size > 640 && min_size <= 800):
                size_suffix = '_c';
                break;
            default: // 1024 is the largest pre-rendered size available.
                size_suffix = '_b';
                break;
        }
        
        // If url is passed, just replace size_suffix
        if (typeof photo == 'string') {
            if (photo.charAt(photo.length-6) == '_') {
                return photo.replace(photo.slice(-6, -4), size_suffix)
            } else {
                // TODO: This is untested and quite ugly. Intended to add the suffix when there isn't one.
                return photo.substr(0, photo.length-4) + size_suffix + photo.substr(photo.length-4);
            }
        } else  {
            // If photoset is passed, build url for primary photo
            photo.primary !== undefined ? photo_id = photo.primary : photo_id = photo.id;
            return photoURL =   'http://farm' + photo.farm +
                                '.static.flickr.com/' +
                                photo.server + '/' +
                                photo_id + '_' +
                                photo.secret +
                                size_suffix + '.jpg';
        }
    }

    $.fn.getFlickrURL = function(photo) {
        // Takes a photo, photoset object or a raw image URL and returns the Flickr URL.
        
        var photo_id;
        // If url is passed, parse photo_id
        if (typeof photo == 'string') {
            var filename = photo.substring(photo.lastIndexOf("/") + 1, photo.lastIndexOf("."));
            photo_id = filename.substring(0, filename.indexOf("_"));
        } else {
            // If photoset is passed, build url for primary photo.
            photo.primary !== undefined ? photo_id = photo.primary : photo_id = photo.id;
        }
        return flickrURL = 'http://www.flickr.com/photos/' + $.fn.flickr.settings['username'] + '/' + photo_id;
    }
    
    $.fn.flickr = function(options) {
        var that = this;
        $.fn.flickr.settings = options;
        var url = composeRequestURL(options);
        //console.log("Starting AJAX call with URL. %s", url);

        $.getJSON(url, function( response ) {
            //console.log('Succesful API call. Response:');
            //console.log(response);
            that.trigger('didLoadFlickr', response);
        });

        this.trigger('willLoadFlickr', options);
        return this;
    };
    
    $.fn.flickr.settings = {
        user_id: null,
        api_key: null,
        photoset_id: null,
        username: null
    };

}(jQuery));