/*! jQuery Gallery - 2013-12-27
* http://github.com/nmattisson
* Copyright (c) 2013 Nils Mattisson - MIT License */

(function($){
    
    function displayRow (row, rowLength, settings) {
        //console.log('Displaying row with width: %s', rowLength);
        
        var scaleFactor = settings.rowLength/rowLength;
        var totalWidth = 0;
        //console.log(scaleFactor);
        //console.log(settings.container);
        
        settings.container.append(
            $('<div>')
            .addClass('photo-row')
            .css('margin-bottom', settings.margin+'px')
            //.css('width', settings.rowLength+'px')
            //.attr('width', settings.rowLength)
            //.attr('height', settings.rowHeight)
        )
        
        $.each(row, function(i, image) {
            $(image).width(Math.round($(image).width()*scaleFactor));
            $(image).height(Math.round($(image).height()*scaleFactor));
            var margin = settings.margin;
            // Cut a few pixels from the last image in the row to make up for the rounding errors
            // and set the margin to zero.
            if (i == row.length-1) {
                $(image).width(settings.rowLength - totalWidth);
                margin = 0;
            }
            
            totalWidth += $(image).width();
            totalWidth += margin;
            
            // If image got stretched (at last row), load bigger thumbnail
            if ($(image).width() > image.width) {
                var maxDimension = Math.max($(image).width(), $(image).height());
                var largerThumbnail = new Image();
                $(largerThumbnail).width($(image).width());
                $(largerThumbnail).height($(image).height());
                // TODO: Remove Flickr plugin dependency.
                largerThumbnail.src = $.fn.getPhotoURL(image.src, maxDimension);
                image = largerThumbnail;
            }

            settings.container.find('.photo-row:last-child')
                // Set row height to shortest image
                .css('height', Math.min($(image).height(), $(this).height())+'px')
                .append(
                    $('<div>')
                    .addClass('photo')
                    .css('height', $(image).height()+'px')
                    .css('width', $(image).width()+'px')
                    .css('margin-right', margin+'px')
                    .css('display', 'inline-block')
                    .append(
                        $('<a>')
                        // TODO: Remove Flickr plugin dependency.
                        .attr('href', $.fn.getFlickrURL(image.src))
                        .append(image)
                    )
                )
            //$('.flickr .photo-row:last-child img:last-child')
        })
    }
    
    $.fn.gallery = function(options, photos) {
        var that = this;
        var settings = $.extend($.fn.gallery.defaults, options);
        settings.container = this;
        
        // loop over images.
            // Resize to fit height
            // Add new width to row.
            // If row > width
            // Scale up previous images to fit width.
            // Display row
            // put image on next row.
            // else put image in this row.
        
        var photosLeft = photos.length;
        var currentRow = [];
        var totalWidth = 0;
        
        $.each(photos, function(i, photo) {
            var img = new Image();
            
            $(img).on('load', function() {
                // Set img style tag to new width and height
                var width = Math.round(this.width / this.height * settings.rowHeight);
                $(this).height(settings.rowHeight);
                $(this).width(width);
                
                //console.log('Adding image with width %d', width);
                //console.log('To row of length %d', currentWidth);
                
                // If adding image to row would go over limit, display current row and start new.
                if (totalWidth + width > settings.rowLength) {
                    displayRow(currentRow, totalWidth, settings);
                    totalWidth = width + settings.margin;
                    currentRow = [this];
                } else {
                    totalWidth += width + settings.margin;
                    currentRow.push(this);
                }
                
                // Decrease photos counter and if this is the last photo, display row.
                photosLeft--;
                if (photosLeft == 0) {
                    displayRow(currentRow, totalWidth, settings)
                }
            }).attr({
                src: $.fn.getPhotoURL(photo, 2*settings.rowHeight)
            }).error(function(){
                //TODO: Maybe add some fancy error if image doesn't load.
            });
        });
    }

    $.fn.gallery.defaults = {
        rowLength: 640,
        rowHeight: 120,
        margin: 1,
        container: null
    }
    
})(jQuery);
