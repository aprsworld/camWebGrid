
/*
-> sourceURL
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

var sourceURL;
var sourceFullURL;
var sourceMetaJSON;
var sourceMetaRefreshSeconds;
var sourceLinkToFullURL;
var sourceLinkToFullURLBehavior;
var sourceRefreshSeconds;
var sourceStaleSeconds;
var sourceOverlayTextTop;
var urlParamObjs;
var cameraSeconds=[];

/* This function takes the sourceURL array and creates a grid based on it */
function createCamBlocks( sourceURL, sourceRefreshSeconds ) {

	timers=[];

	/* iterate through urls */
	for ( var i = 0 ; i < sourceURL.length ; i++ ) {


		var imageLink = "";

		/* if sourceLinkToFullURL is set, then we want to add a link to the image when pressed */
		if ( typeof sourceLinkToFullURL === 'undefined' ) {
			imageLink = "<img id=\"cameraImage"+i+"\" src=\""+decodeURIComponent(sourceURL[i])+"\" >";
		} else {
			if ( typeof sourceLinkToFullURL[i] === 'undefined' ) {

				imageLink = "<img id=\"cameraImage"+i+"\" src=\""+decodeURIComponent(sourceURL[i])+"\" >";
			} else {
				imageLink = "<a href=\""+sourceLinkToFullURL[i]+"\" ><img id=\"cameraImage"+i+"\" src=\""+decodeURIComponent(sourceURL[i])+"\" ></a>";				
			}
		}		

		var overlay = "";

		if ( typeof sourceOverlayTextTop !== 'undefined' ) {
			if ( typeof sourceOverlayTextTop[i] !== 'undefined' ) overlay = "<span class=\"imageOverlay\">"+sourceOverlayTextTop[i]+"</span>";
		}

		/* create camera block */
		$("#wrapper").append("<div class=\"gridBox\">"+imageLink+"<span class=\"imageTimer\">Updated <span id=\"timer"+i+"\"></span> ago.</span>"+overlay+"<div>");



		/* create entry for camera seconds */
		cameraSeconds[i]=0;
		

	}
	$(".gridBox").css( "width", (100/sourceURL.length*.9)+"%" );
	/* start timer */
	timerTick();

}



/* update the image at the given index */
function updateCameraImg( index ) {

	//console.log("update camera at index: "+index);

	/* this is for urls using latest.jpg */
	$("#cameraImage"+index).attr("src",$("#cameraImage"+index).attr("src")+"?"+ new Date().getTime());

}

function timerTick(){


	/* iterate through camera seconds and increment the second count */
	for (var i = 0 ; i < cameraSeconds.length ; i++ ) {

		cameraSeconds[i]++;
		$("#timer"+i).html(secToTime(cameraSeconds[i]));

		/* if the second count equals sourceRefreshSeconds, update the image and reset second count */
		
		if ( cameraSeconds[i] >= sourceRefreshSeconds[i] ) {
			cameraSeconds[i] = 0;
			updateCameraImg(i);
		}
	}

	/* call function again in 1 second */
	setTimeout( timerTick, 1000 );

}

$( document ).ready(function(){
	
	console.log("ready");

	/* retrieve the parameters in the url and stores them into an object */
	urlParamObjs = $.parseParams(window.location);

	console.log(urlParamObjs);

	/* Check for all required parameters */
	if ( urlParamObjs.hasOwnProperty("sourceURL") && urlParamObjs.hasOwnProperty("sourceRefreshSeconds") ) {

		sourceURL = urlParamObjs.sourceURL;
		sourceRefreshSeconds = urlParamObjs.sourceRefreshSeconds;

	} else {

		console.log("cannot continue, missing sourceURL or sourceRefreshSeconds");
		$("#wrapper").append("<h1>Error: Missing one or more required parameters: sourceURL or sourceRefreshSeconds</h1><br>");
		return;

	}

	/* make sure the two required parameters are the same length */
	if ( sourceURL.length != sourceRefreshSeconds.length ) {

		console.log("cannot continue, sourceURL array is not the same size as sourceRefreshSeconds array");
		$("#wrapper").append("<h1>Error: sourceURL array size is not equal to sourceRefreshSeconds array</h1><br>");
		return;

	}

	

	if ( urlParamObjs.hasOwnProperty("sourceFullURL") ) {

		sourceFullURL = urlParamObjs.sourceFullURL;

	}

	if ( urlParamObjs.hasOwnProperty("sourceMetaJSON") ) {

		sourceMetaJSON = urlParamObjs.sourceMetaJSON;

	}
	
	if ( urlParamObjs.hasOwnProperty("sourceMetaRefreshSeconds") ) {

		sourceMetaRefreshSeconds = urlParamObjs.sourceMetaRefreshSeconds;

	}

	if ( urlParamObjs.hasOwnProperty("sourceLinkToFullURL") ) {

		sourceLinkToFullURL = urlParamObjs.sourceLinkToFullURL;

	}

	if ( urlParamObjs.hasOwnProperty("sourceLinkToFullURLBehavior") ) {

		sourceLinkToFullURLBehavior = urlParamObjs.sourceLinkToFullURLBehavior;

	}

	if ( urlParamObjs.hasOwnProperty("sourceStaleSeconds") ) {

		sourceStaleSeconds = urlParamObjs.sourceStaleSeconds;

	}

	if ( urlParamObjs.hasOwnProperty("sourceOverlayTextTop") ) {

		sourceOverlayTextTop = urlParamObjs.sourceOverlayTextTop;

	}


	createCamBlocks(sourceURL,sourceRefreshSeconds);
	

});
