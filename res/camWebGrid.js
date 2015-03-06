
/*
-> sourceURL
        required
        URL where we get our primary image from


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

		
		var newTab = "";

		/* if sourceLinkToFullURL is set, then we want to add a link to the image when pressed */
		if ( typeof sourceLinkToFullURLBehavior === 'undefined' ) {
			newTab = "";
		} else {
			if ( typeof sourceLinkToFullURLBehavior[i] === 'undefined' ) {
				newTab = "";
			} else {
				if ( sourceLinkToFullURLBehavior[i] == "newTab" ) {

					newTab = "target=\"_blank\"";	

				} else if ( sourceLinkToFullURLBehavior[i] == "newWindow" ) {	
					newTab="onclick=\"window.open('"+decodeURIComponent(sourceURL[i])+"', 'newwindow', 'width=300, height=250'); return false;\"";		
				}
			}
		}	

		/* if sourceLinkToFullURL is set, then we want to add a link to the image when pressed */
		if ( typeof sourceLinkToFullURL === 'undefined' ) {
			imageLink = "<img id=\"cameraImage"+i+"\" src=\""+decodeURIComponent(sourceURL[i])+"\" >";
		} else {
			if ( typeof sourceLinkToFullURL[i] === 'undefined' ) {
				imageLink = "<img id=\"cameraImage"+i+"\" src=\""+decodeURIComponent(sourceURL[i])+"\" >";
			} else {
				imageLink = "<a href=\""+sourceLinkToFullURL[i]+"\" "+newTab+" ><img id=\"cameraImage"+i+"\" src=\""+decodeURIComponent(sourceURL[i])+"\"  ></a>";				
			}
		}		
		
		var overlay = "";

		/* If we have an overlay set, put it at the top of the image */
		if ( typeof sourceOverlayTextTop !== 'undefined' ) {
			if ( typeof sourceOverlayTextTop[i] !== 'undefined' ) overlay = "<span class=\"imageOverlay\">"+sourceOverlayTextTop[i]+"</span>";
		}

		/* create camera block */
		$("#wrapper").append("<div class=\"gridBox\"><span id=\"stale"+i+"\" class=\"stale\">X</span>"+imageLink+"<span class=\"imageTimer\"><span id=\"timer"+i+"\"></span></span>"+overlay+"<div>");



		/* create entry for camera seconds */
		cameraSeconds[i]=0;

		/* get the seconds from JSON and update the ui */
		if ( typeof sourceMetaJSON !== 'undefined' ) {
			if ( typeof sourceMetaJSON[i] !== 'undefined' ) {
				console.log("json on index: "+i);
				getMetaJSON( sourceMetaJSON[i], i );
				console.log(cameraSeconds[i]);

			}

		}
		

	}
	$(".gridBox").css( "width", (100/sourceURL.length*.9)+"%" );
	/* start timer */
	timerTick();

}

/* updates the UI for json cameras. Also returns age in seconds */

function getMetaJSON ( url, index ) {
	
	$.getJSON(url,
		function (data) {
			
			cameraSeconds[index] = data.ageSeconds;
				
			if ( $("#cameraImage"+index).attr("src") != data.fileURL )		
				$("#cameraImage"+index).attr("src",data.fileURL);


		} 
	);
	
}

/* update the image at the given index */
function updateCameraImg( index ) {

	
	/* if sourceMetaJSON is set for this index, get data through AJAX */
	if ( typeof sourceMetaJSON !== 'undefined' ) {

		if ( typeof sourceMetaJSON[index] !== 'undefined' ) {

			getMetaJSON( sourceMetaJSON[index], index );

		} else {
			/* this is for urls using latest.jpg */
			$("#cameraImage"+index).attr("src",$("#cameraImage"+index).attr("src")+"?"+ new Date().getTime());

			/* cannot go stale without json, so just reset the timer to 0 */
			cameraSeconds[index] = 0;
		}

	} else {
		/* this is for urls using latest.jpg */
		$("#cameraImage"+index).attr("src",$("#cameraImage"+index).attr("src")+"?"+ new Date().getTime());

		/* cannot go stale without json, so just reset the timer to 0 */
		cameraSeconds[index] = 0;
	}

}

/* if an image is stale */
function stale( index ){

	console.log("stale at index: "+index);
	$("#stale"+index).html("Stale: Updated "+ secToTime(cameraSeconds[index]) +" ago X");
	$("#stale"+index).show();
	
}

/* main timer */
function timerTick(){


	/* iterate through camera seconds and increment the second count */
	for (var i = 0 ; i < cameraSeconds.length ; i++ ) {

		cameraSeconds[i]++;
		
		if ( sourceRefreshSeconds[i] - cameraSeconds[i] >= 0 ) {

			$("#timer"+i).html("Update in " + secToTime( sourceRefreshSeconds[i] - cameraSeconds[i] ) );

		} 

		/* if the second count equals sourceRefreshSeconds, update the image */
		if ( cameraSeconds[i] >= sourceRefreshSeconds[i] && cameraSeconds[i] % 10 == 0 ) {
			
			updateCameraImg(i);
		}


		/* check if we should query for metaData 
		if ( typeof sourceMetaRefreshSeconds !== 'undefined' ) {

			if ( typeof sourceMetaRefreshSeconds[i] !== 'undefined' ) {

				if (  ) {

				}

			}

		}
*/

		/* check if stale */
		$("#stale"+i).hide();
		if ( typeof sourceStaleSeconds !== 'undefined' ) {

			if ( typeof sourceStaleSeconds[i] !== 'undefined' ) {

				if ( cameraSeconds[i] >= sourceStaleSeconds[i] ) {

					stale(i);

				}

			} else if ( cameraSeconds[i] >= ( sourceRefreshSeconds[i] * 2 + 5 ) ) {

				stale(i);

			}

		} else if ( cameraSeconds[i] >= ( sourceRefreshSeconds[i] * 2 + 5 ) ) {

			stale(i);

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

	

	/* retrieve all the parameters we can, otherwise leave them undefined */
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

	/* create the grid */
	createCamBlocks(sourceURL,sourceRefreshSeconds);
	

});
