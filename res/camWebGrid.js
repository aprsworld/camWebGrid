
/*
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

*/

var sourceThumbnailURL;
var sourceFullURL;
var sourceMetaJSON;
var sourceMetaRefreshSeconds;
var sourceLinkToFullURL;
var sourceLinkToFullURLBehavior;
var sourceRefreshSeconds;
var sourceStaleSeconds;
var sourceOverlayTextTop;
var urlParamObjs;

/* This function takes the sourceThumbnailURL array and creates a grid based on it */
function createCamBlocks( sourceThumbnailURL ) {

	for ( var i = 0 ; i < sourceThumbnailURL.length ; i++ ) {

		$("wrapper").append(sourceThumbnailURL[i]+"<br>");

	}

}


$( document ).ready(function(){
	
	console.log("ready");

	urlParamObjs = $.parseParams(window.location);

	console.log(urlParamObjs);

	if ( urlParamObjs.hasOwnProperty("sourdceThumbnailURL") ) {
		console.log("ok");
	}

});
