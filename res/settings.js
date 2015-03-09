/* settings object for camWebGrid */
var settingsObj = {

	/* 
	required, page will display a message if not set. sourceURL and sourceRefreshSeconds must be the same length, as they are both required for each webcam.
	If these two arrays are not the same size, the page will display a message indicating this. Make sure addresses are url encoded. This can also be
	accomplished with encodeURIComponent("http://exampleURL.com");
	*/
	sourceURL: ["http%3A%2F%2Fcam.aprsworld.com%2FA3400%2Flatest.jpg","http%3A%2F%2Fcam.aprsworld.com%2FA4035%2Flatest.jpg","http%3A%2F%2Fcam.aprsworld.com%2FA4606%2Flatest.jpg","http%3A%2F%2Fcam.aprsworld.com%2FA4241%2Flatest.jpg"],
	
	/* required, page will display a message if not set */
	sourceRefreshSeconds: [10,60,10,10],

	/* Make sure addresses are url encoded. This can also be accomplished with encodeURIComponent("http://exampleURL.com"); */
	sourceLinkToFullUrl: [],

	/* Make sure addresses are url encoded. This can also be accomplished with encodeURIComponent("http://exampleURL.com"); */
	sourceMetaJSON: [],

	sourceMetaRefreshSeconds: [],

	/* "newTab", "newWindow", anything else will open in the same window */
	sourceLinkToFullURLBehavior: [],

	sourceStaleSeconds: [],

	sourceOverlayTextTop: []

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
