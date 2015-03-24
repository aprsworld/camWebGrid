/* settings object for camWebGrid. For parameters that need a specific index, use the additionalSettings function */
var settingsObj = {

	/* 
	required, page will display a message if not set. sourceURL and sourceRefreshSeconds must be the same length, as they are both required for each webcam.
	If these two arrays are not the same size, the page will display a message indicating this. Make sure addresses are url encoded. This can also be
	accomplished with encodeURIComponent("http://exampleURL.com");
	*/
	sourceURL: [],
	
	/* required, page will display a message if not set */
	sourceRefreshSeconds: [],

	/* These addresses are not required to be URL encoded  */
	sourceLinkToFullURL: [],

	/* These addresses are not required to be URL encoded */
	sourceMetaJSON: [],

	sourceMetaRefreshSeconds: [],

	/* "newTab", "newWindow", anything else will open in the same window */
	sourceLinkToFullURLBehavior: [],

	sourceStaleSeconds: [],

	sourceOverlayTextTop: [],

	sourceEXIF: [],

	sourceEXIFLabel: []

}

/* to set a specific array index without setting others, add them out side of the object */
function additionalSettings(){


}


/*
blank settings object for reference

var settingsObj = {

	sourceURL: [],
	
	sourceRefreshSeconds: [],

	sourceLinkToFullURL: [],

	sourceMetaJSON: [],

	sourceMetaRefreshSeconds: [],

	sourceLinkToFullURLBehavior: [],

	sourceStaleSeconds: [],

	sourceOverlayTextTop: [],

	sourceEXIF: [],

	sourceEXIFLabel: []

}

function additionalSettings(){



}

*/
