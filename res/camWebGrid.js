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
var sourceEXIF;
var sourceEXIFLabel;

var fullscreen=false;

var urlParamObjs;

var cameraSeconds=[];

function exifTest(index){

	EXIF.getData(document.getElementById("cameraImage"+index),function(){alert(EXIF.pretty(this))});

}


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
			imageLink = "<img class=\"cameraImage\" id=\"cameraImage"+i+"\" src=\""+decodeURIComponent(sourceURL[i])+"\" >";
		} else {
			if ( typeof sourceLinkToFullURL[i] === 'undefined' ) {
				imageLink = "<img class=\"cameraImage\" id=\"cameraImage"+i+"\" src=\""+decodeURIComponent(sourceURL[i])+"\" >";
			} else {
				imageLink = "<a href=\""+sourceLinkToFullURL[i]+"\" "+newTab+" ><img class=\"cameraImage\" id=\"cameraImage"+i+"\" src=\""+decodeURIComponent(sourceURL[i])+"\"  ></a>";				
			}
		}		
		
		var overlay = "";

		/* If we have an overlay set, put it at the top of the image */
		if ( typeof sourceOverlayTextTop !== 'undefined' ) {
			if ( typeof sourceOverlayTextTop[i] !== 'undefined' ) overlay = "<span class=\"imageOverlay\">"+sourceOverlayTextTop[i]+"</span>";
		}

		var EXIFOverlay = "";

		/* If we have an overlay set, put it at the top of the image */
		if ( typeof sourceEXIF !== 'undefined' ) {
			if ( typeof sourceEXIF[i] !== 'undefined' ) {
				
				if ( typeof sourceEXIFLabel[i] == 'undefined' ) sourceEXIFLabel[i] = sourceEXIF[i];
				EXIFOverlay = "<span id=\"exif"+i+"\" class=\"imageOverlay\">Loading "+sourceEXIFLabel[i]+"</span>";
				$("#cameraImage"+i).load(function(){ console.log("loaded image: "+this.id); updateEXIF(this.id.substr(-1)); });
			}
		}

		/* create camera block */
		$("#innerWrapper").append("<div class=\"gridBox\" id=\"gridBox"+i+"\"><span id=\"stale"+i+"\" class=\"stale\">Stale</span>"+imageLink+"<span class=\"imageTimer\"><span id=\"timer"+i+"\"></span></span>"+overlay+EXIFOverlay+"<div id=\"expButt"+i+"\" class=\"expandButton\" onclick=\"expand(this)\" unselectable=\"on\"><img src=\"res/images/fullscreen.png\"></div></div>");



		/* create entry for camera seconds */
		cameraSeconds[i]=0;

		/* get the seconds from JSON and update the ui */
		if ( typeof sourceMetaJSON !== 'undefined' ) {
			if ( typeof sourceMetaJSON[i] !== 'undefined' ) {
				getMetaJSON( sourceMetaJSON[i], i );
			}

		}

		$("#cameraImage"+i).load(function(){ console.log("loaded image: "+this.id); updateEXIF(this.id.substr(-1)); });
		
		/* Now that the image exisits, we can set the load function */
		if ( typeof sourceEXIF !== 'undefined' ) {
			console.log(typeof sourceEXIF[i] !== 'undefined');
			if ( typeof sourceEXIF[i] !== 'undefined' ) {
				console.log("starting exif "+i); 
				$("#cameraImage"+i).load(function(){ console.log("loaded image: "+this.id); updateEXIF(this.id.substr(-1)); });
			}
		}

	}
	resize();
	//$(".gridBox").css( "width", "48%" );
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
			var urlImg = stripParam($("#cameraImage"+index).attr("src"))+"?"+ new Date().getTime();
			$("#cameraImage"+index).attr("src",urlImg);
			
			

			/* cannot go stale without json, so just reset the timer to 0 */
			cameraSeconds[index] = 0;
		}

	} else {
		/* this is for urls using latest.jpg */
		var urlImg = stripParam($("#cameraImage"+index).attr("src"))+"?"+ new Date().getTime();
		$("#cameraImage"+index).attr("src",urlImg);

		/* cannot go stale without json, so just reset the timer to 0 */
		cameraSeconds[index] = 0;
	}

	/* check if sourceEXIF is set for this index */
	if ( typeof sourceEXIF !== 'undefined' ) {

		if ( typeof sourceEXIF[index] !== 'undefined' ) {
			//updateEXIF(index);
			//$("#cameraImage"+index).load(function(){ console.log( "loaded image: " + this.id ); updateEXIF( this.id.substr(11) ); });

		}
	}

}



/* update exif data */
function updateEXIF(index){
	if ( typeof sourceEXIF !== 'undefined' ) {

		if ( typeof sourceEXIF[index] !== 'undefined' ) {
			console.log("update exif: "+index);

			/* get picture element to update */
			var elem = document.getElementById("cameraImage"+index);

			/* clear the exifdata. if you don't do this it won't actually update the exif data. that was a joy to figure out. */
			elem.exifdata=null;

	

			/* This function shouldn't be called until the image is loaded, but incase timing is thrown off or something weird happens, we'll check anyway */	
			if ( elem.complete ) {
				/* get new exif data */
				EXIF.getData(elem,function(){
					/* image's exif data is updated at this point, now find the specific tag */
					var tagValue=EXIF.getTag(elem,sourceEXIF[index])

					/* make sure the tagValue is defined */
					if ( typeof tagValue !== 'undefined' ) {
						if ( typeof tagValue == 'string' ) {
						/* if string, we can just plop the value onto the page */

							$("#exif"+index).html(sourceEXIFLabel[index]+": "+tagValue);

						} else {
						/* If not a string, then it's an object or array.  */
					
							/* convert the ascii array into a string. */

					

							$("#exif"+index).html(sourceEXIFLabel[index]+": "+asciiToString(tagValue));

					
						}

					} else {
						/* if undefined, display no data available */
						$("#exif"+index).html(sourceEXIFLabel[index]+": No Data Available");
						//updateEXIF(index);
					}
				}); 

		
			}
		}
	}
}

/* exif.js will return ascii as an array instead of a string. There maybe a better way to do this, but this wroks for now */
function asciiToString( value ){

	var valueSTR = "";
	/* we start at 5 because the first five are ASCII */
	for (var i = 5 ; i < value.length ; i++){
		if (value[i]!=0)
			valueSTR += String.fromCharCode(value[i]);
		//console.log("#: "+ value[i] +" char: "+String.fromCharCode(value[i]));
	}

	return valueSTR

}

/* get the url without parameters */
function stripParam(url){

	return url.split("?")[0];

}

/* if an image is stale */
function stale( index ){

	$("#timer"+index).html("Stale: Updated "+ secToTime(cameraSeconds[index]) +" ago");
	$("#stale"+index).show();
	
}

/* based on the number of images, find the number of rows that will give the best fit */
function getRows( count ){

	var rows=1;
	
	/* if screen is wider than it is tall */
	if ( $(window).width() > $(window).height() ) {
		rows=Math.floor(Math.sqrt(count));
	} else {
		rows=Math.ceil(count/Math.floor(Math.sqrt(count)));
	}

	return rows;
}

/* based on the number of images, find the number of columns that will give the best fit */
function getCols( count ){

	var cols=1;

	/* if screen is wider than it is tall */
	if ( $(window).width() > $(window).height() ) {
		cols=Math.ceil(count/Math.floor(Math.sqrt(count)));
	} else {
		cols=Math.floor(Math.sqrt(count));
	}

	return cols;
}

/* resize function called if the screen gets resized */
function resize(){
	if ( !fullscreen ) {
		/* the the rows and cols for resize */
		var rows = getRows(sourceURL.length);
		var cols = getCols(sourceURL.length);

		/* set the width and height based on the the screen size, divided by the number of cols and rows (respectively) */
		$(".gridBox").css( "width", ((($(window).width()*.9)/cols)+"px" ));
		$(".gridBox").css( "height", ((($(window).height()*.85)/rows)+"px" ));
	
		/* the line height must be set as well so the images can be centered vertically */
		$(".gridBox").css( "line-height", ((($(window).height()*.85)/rows)+"px" ));

		$("#innerWrapper").css( "width", $(window).width()*.95 );
		$(".expandButton").html("<img src=\"res/images/fullscreen.png\">");

		if ( $(".gridBox").width()/$(".gridBox").height() < 1 ) {
			console.log("tall");
			$(".cameraImage").css( "width", "100%" );
			$(".cameraImage").css( "height", "" );
		} else {
			console.log("wide");
			$(".cameraImage").css( "width", "" );
			$(".cameraImage").css( "height", "100%" );
		}

		for( var i = 0 ; i < sourceURL.length ; i++ ){
			if ( $("#cameraImage"+i).width() != 0 ) {
				if ( $("#cameraImage"+i).width()<$(".gridBox").width() ){
					console.log("good");
				} else {
					console.log("squish");
					$("#cameraImage"+i).css( "height", "" );
					$("#cameraImage"+i).css( "width", "100%" );
		
				}
			}
		}

	} else {
	
		

	}

}

/* main timer */
function timerTick(){

	setInterval(function(){
		/* iterate through camera seconds and increment the second count */
		for (var i = 0 ; i < cameraSeconds.length ; i++ ) {

			cameraSeconds[i]++;
		
			if ( sourceRefreshSeconds[i] - cameraSeconds[i] >= 0 ) {

				$("#timer"+i).html("Update in " + secToTime( sourceRefreshSeconds[i] - cameraSeconds[i] ) );


			} else {
				$("#timer"+i).html("Updated " + secToTime( cameraSeconds[i] ) + " ago" );
		
			}

			/* if the second count equals sourceRefreshSeconds, update the image */
			if ( cameraSeconds[i] >= sourceRefreshSeconds[i] && cameraSeconds[i] % 10 == 0 ) {
				updateCameraImg(i);
			}
		


			/* check if we should query for metaData 
			if ( typeof sourceMetaRefreshSeconds !== 'undefined' ) {

				if ( typeof sourceMetaRefreshSeconds[i] !== 'undefined' ) {

					if ( sourceMetaRefreshSeconds[i] ) {

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
	}, 1000);
	/* call function again in 1 second */
	//setTimeout( timerTick, 1000 );

}

function overrideSettings(){
	var urlParamObjsOver = $.parseParams(window.location);

	for(var index in urlParamObjsOver) { 
		if (urlParamObjsOver.hasOwnProperty(index)) {
			urlParamObjs[index] = urlParamObjsOver[index];
		}
	}

}

/* toggles fullscreen */
function expand( gridBox ){

	/* get the index from the button's id */
	var index = gridBox.id.substr(7);

	/* Checks if we are going to fullscreen or returning from it */
	if ($("#expButt"+index).html() == "<img src=\"res/images/fullscreen.png\">") {

		/* set fullscreen to true */		
		fullscreen = true;		


		/* iterate through the cams */
		for ( var i = 0 ; i < sourceURL.length ; i++ ) {
			/* this is the one to full screen */
			if ( i == index ) {
					$("#gridBox"+index).css({"width": "100%","height": "100%","max-height": ($(window).height()*.9)+"px"});
					$("#cameraImage"+index).css({"height": (($(window).height()*.9))+"px" });
					$("#expButt"+index).html("<img src=\"res/images/contract.png\">");
			} else {
			/* hide the ones we do not want fullscreen */
				$("#gridBox"+i).hide();
				
			}

		}
	} else {
		/* returns screen to normal */
		fullscreen = false;

		resize();
		//$("#cameraImage"+index).css({"height": "" });
		$(".gridBox").show();

		
	}
	

}



$( document ).ready(function(){
	

	/* adds additions settings to the settings object from settings.js */
	additionalSettings();

	/* gets settings from settings.js and saves it to local object */
	urlParamObjs = settingsObj;

	/* retrieve the parameters in the url and overwrite the ones in urlParamObjs */
	overrideSettings();


	/* Check for all required parameters */
	if ( urlParamObjs.hasOwnProperty("sourceURL") && urlParamObjs.hasOwnProperty("sourceRefreshSeconds") ) {

		sourceURL = urlParamObjs.sourceURL;
		sourceRefreshSeconds = urlParamObjs.sourceRefreshSeconds;

	} else {

		console.log("cannot continue, missing sourceURL or sourceRefreshSeconds");
		$("#innerWrapper").append("<h1>Error: Missing one or more required parameters: sourceURL or sourceRefreshSeconds</h1><br>");
		return;

	}

	/* make sure the two required parameters are the same length */
	if ( sourceURL.length != sourceRefreshSeconds.length ) {

		console.log("cannot continue, sourceURL array is not the same size as sourceRefreshSeconds array");
		$("#innerWrapper").append("<h1>Error: sourceURL array size is not equal to sourceRefreshSeconds array</h1><br>");
		return;

	}

	/* make sure the two required parameters contain no undefineds */
	for ( var i = 0 ; i < sourceURL.length ; i++ ) {	
		if ( typeof sourceURL[i] == 'undefined' || typeof sourceRefreshSeconds[i] == 'undefined') {

			console.log("cannot continue, sourceURL or sourceRefreshSeconds contain an undefined variable: "+i);
			$("#innerWrapper").append("<h1>Error: sourceURL and/or sourceRefreshSeconds contain an undefined variable</h1><br>");
			return;

		}
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

	if ( urlParamObjs.hasOwnProperty("sourceEXIF") ) {

		sourceEXIF = urlParamObjs.sourceEXIF;

	}

	if ( urlParamObjs.hasOwnProperty("sourceEXIFLabel") ) {

		sourceEXIFLabel = urlParamObjs.sourceEXIFLabel;

	}


	/* this function fires off when the window is resized */
	$(window).resize(function() {
		resize();
	});

	/* create the grid */
	createCamBlocks(sourceURL,sourceRefreshSeconds);

	/* setting the hover activity to show and hide the expand button */
	$(".gridBox").hover(function(){

		$(".expandButton").show();

	},function(){

		$(".expandButton").hide();

	});

	/* Added this for mobile so the buttons will appear. */
	$(".expandButton").show();

});
