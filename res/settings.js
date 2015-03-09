/* settings object for camWebGrid. For parameters that need a specific index, use the additionalSettings function */
var settingsObj = {

	/* 
	required, page will display a message if not set. sourceURL and sourceRefreshSeconds must be the same length, as they are both required for each webcam.
	If these two arrays are not the same size, the page will display a message indicating this. Make sure addresses are url encoded. This can also be
	accomplished with encodeURIComponent("http://exampleURL.com");
	*/
	sourceURL: [encodeURIComponent("http://cam.aprsworld.com/A3400/latest.jpg"),"http%3A%2F%2Fcam.aprsworld.com%2FA4035%2Flatest.jpg","http%3A%2F%2Fcam.aprsworld.com%2FA4606%2Flatest.jpg","http%3A%2F%2Fcam.aprsworld.com%2Ffairbanks0%2Flatest.jpg"],
	
	/* required, page will display a message if not set */
	sourceRefreshSeconds: [10,60,10,10*60],

	/* Make sure addresses are url encoded. This can also be accomplished with encodeURIComponent("http://exampleURL.com"); */
	sourceLinkToFullURL: [],

	/* Make sure addresses are url encoded. This can also be accomplished with encodeURIComponent("http://exampleURL.com"); */
	sourceMetaJSON: [],

	sourceMetaRefreshSeconds: [],

	/* "newTab", "newWindow", anything else will open in the same window */
	sourceLinkToFullURLBehavior: [],

	sourceStaleSeconds: [],

	sourceOverlayTextTop: []

}

/* to set a specific array index without setting others, add them out side of the object */
function additionalSettings(){

	console.log("additional settings");

	settingsObj.sourceLinkToFullURL[1]="http%3A%2F%2Fcam.aprsworld.com%2FA4035%2Flatest.jpg";
	settingsObj.sourceOverlayTextTop[1]="This one uses JSON";

	settingsObj.sourceLinkToFullURL[1]="http%3A%2F%2Fcam.aprsworld.com%2Ffairbanks0%2Flatest.jpg";
	settingsObj.sourceLinkToFullURLBehavior[1]="newTab";

}


/*
blank settings object for reference

var settingsObj = {

	sourceURL: [],
	
	sourceRefreshSeconds: [],

	sourceLinkToFullUrl: [],

	sourceMetaJSON: [],

	sourceMetaRefreshSeconds: [],

	sourceLinkToFullURLBehavior: [],

	sourceStaleSeconds: [],

	sourceOverlayTextTop: []

}
*/
