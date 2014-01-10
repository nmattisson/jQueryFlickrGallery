# jQuery Justified Gallery and Flickr Plugins
These are two jQuery plugins that I created to display my flickr photos on my personal webpage. The package consists of a flickr plugin, and a justified gallery plugin, but could be extended with more presentation and or source/plugins. This duo differ from all the other solutions I found out there by being more hacker-friendly, allowing easier customisation and extension.
This is not a turn-key option, but by using these plugins you can more easily mix photos from different sources and format them as you see fit. To get photos from elsewhere than Flickr, all you need to do is add your own API plugin and put the photos in a javascript object with a similar structure to the one used by Flickr, then pass the object to the gallery plugin.
The design tries to separate the view-generating code and the API code so that you can make the changes you want without getting under the hood of the plugins and making subsequent updates an integration nightmare.Reach out on Twitter if you have any questions or comments. I hope you find it useful!

## Usage
See the provided working example, or look at the more complete code on my [personal webpage](http://nmattisson.com/).
In short, you place a div in your html with a good name (here it's called 'flickr') and load the flickr plugin with your username, api key and user id. The flickr plugin will return either a list of sets, or the photos in a set, depending on whether photoset_id is empty or not.
When a response is received displayPhotos() is called and this is where you would put your code to create your webpage, or, optionally, pass the results to the justified gallery plugin that will build a gallery from a set for you. In the example, the list of photosets gets generated without using the gallery plugin and set contents with it.

```javascript
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
    if (response.photosets !== undefined) {
        // List of photosets
        $(that).append(createPhotosetElement(photoset, width));
        });
    } else if (response.photoset.photo !== undefined) {
        // Specific photoset, call the gallery plugin
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
    $('.flickr').flickr({
        photoset_id: photoset_id,
        username: [Flickr username],
        api_key: [Flickr api_key],
        user_id: [Flickr user id]
    });
    });
```

## License

The MIT License (MIT)

Copyright (c) 2013 Nils Mattisson

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.


