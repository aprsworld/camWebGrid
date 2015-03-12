/* settings object for camWebGrid. For parameters that need a specific index, use the additionalSettings function */
var settingsObj = {

	/* 
	required, page will display a message if not set. sourceURL and sourceRefreshSeconds must be the same length, as they are both required for each webcam.
	If these two arrays are not the same size, the page will display a message indicating this. Make sure addresses are url encoded. This can also be
	accomplished with encodeURIComponent("http://exampleURL.com");
	*/
	sourceURL: [encodeURIComponent("http://cam.aprsworld.com/A4241/latest.jpg"),encodeURIComponent("http://cam.aprsworld.com/A4235/latest.jpg"),encodeURIComponent("http://cam.aprsworld.com/A4236/latest.jpg"),encodeURIComponent("http://cam.aprsworld.com/A4606/latest.jpg")],
	
	/* required, page will display a message if not set */
	sourceRefreshSeconds: [60,60,60,60],

	/* Make sure addresses are url encoded. This can also be accomplished with encodeURIComponent("http://exampleURL.com"); */
	sourceLinkToFullURL: [("http://cam.aprsworld.com/A4241/latest.jpg"),("http://cam.aprsworld.com/A4235/latest.jpg"),("http://cam.aprsworld.com/A4236/latest.jpg"),("http://cam.aprsworld.com/A4606/latest.jpg")],

	/* These addresses are not required to be URL encoded */
	sourceMetaJSON: ["http://ian.aprsworld.com/camera/singleJSONcam.php?station_id=A4241","http://ian.aprsworld.com/camera/singleJSONcam.php?station_id=A4235","http://ian.aprsworld.com/camera/singleJSONcam.php?station_id=A4236","http://ian.aprsworld.com/camera/singleJSONcam.php?station_id=A4606"],

	sourceMetaRefreshSeconds: [],

	/* "newTab", "newWindow", anything else will open in the same window */
	sourceLinkToFullURLBehavior: [],

	sourceStaleSeconds: [],

	sourceOverlayTextTop: []

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

	sourceOverlayTextTop: []

}

function additionalSettings(){



}

*/
