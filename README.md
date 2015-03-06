# camWebGrid

core functionality:

display single image or multiple images in a grid

scale image(s) so they fit nicely in browser visible window

Use CSS to control margins, colors, etc. No hard coding style information! Document CSS file so somebody can easily edit it

stand alone page. No PHP.

All parameters of the page can be set via URL or in the javascript file. URL parameters override those set in javascript.

parameters as array

-> sourceThumbnailURL
required
URL where we get our primary image from

-> sourceFullURL
can be null or undefined
if present, this is the URL where we can get a native resolution image from

-> sourceMetaJSON
can be null or undefined.

if not present, then we just load the image at the specified interval. It never goes stale, etc.

if it is present, then we get the last updated time, etc from this. This should be like the cam server data. Presumably you already have a page for this sort of this.

-> sourceMetaRefreshSeconds
can be null or undefined.

If present, then query meta at this rate. If not present, query at 10 second rate.

-> sourceLinkToFullURL
can be null or undefined
if present, then clicking on the image goes to this URL

-> sourceLinkToFullURLBehavior
can be null or undefined
can be "newTab"
can be "newWindow"
can be "this"

newTab would cause clicking on image to open a new tab and go to sourceLinkToFullURL
newWindow would cause clicking on image to open a new window and go to sourceLinkToFullURL      
anything else would go to sourceLinkToFullURL in current window

-> sourceRefreshSeconds
required
interval at which to load new image

-> sourceStaleSeconds
can be null or undefined
If not specified then default to sourceRefreshSeconds*2+5

-> sourceOverlayTextTop
can be null or undefined
If it is specified, then we overlay this text across the top of the image.



functionality

when in image is stale, use CSS to overlay a span. Default span should be something like red x icon. CSS only here.

when an image is current, use CSS to overlay a span.

Somehow I would like to be able embed date until next update in the current image overlay span. And date since last update in the stale image. This should be formatted in the clean readable age. So 10 seconds would be 10 seconds. 485730 seconds would be 5 days, 3 hours, 19 minutes, 4 seconds or whatever.



When implementing this, do your very best commenting. Keep things modular and in libraries. Using jquery etc is fine. Have them use local copies. This may be running on non-internet connected devices. Use GIT. Call this camWebGrid and make it a public project. Start from the ground up with this being a 1 to n image display. Don't start with it only being 1 image. Start with it being about to hand 1 or n image in a grid.


The general concept is that we need a good display for showing one or more local camera(s) and/or cam.aprsworld.com camera. Something that will look sharp and work one big full screen, normal web browser, phone, etc. And can be customized with just javascript and CSS.
