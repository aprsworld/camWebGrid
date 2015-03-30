# camWebGrid

settings.js
---
`settings.js` is where you set up what cameras you would like to show along to their refresh rates and all other parameters. In `settings.js` there is the settingsObj which is a javascript object that holds all of the settings and a function called `additionalSettings()`. Each settings is an array and must be set up carefully:
 * `title`: Not required. change the page title, otherwise leave it out or set it to `undefined` to use the title set in the html.
 * `debug`: Not required. determines whether or not the orange debug box appears in the corners of the cams.
 * `sourceURL`: REQUIRED! This is the source URL of the webcam. This array MUST be the same size as `sourceRefreshSeconds` as they are both required. Another important thing to note is that the `sourceURL` needs to be URI encoded. This can be done by using `encodeURIComponent("http://example.com")`
 * `sourceRefreshSeconds`: REQUIRED! This is the interval, in seconds, the webpage checks for a new image. This array MUST be the same size as `sourceURL` as they are both required.
 * `sourceLinkToFullURL`: Not required. This is the url clicking on the image will take you to. If it is not set, the image will not have a link attached to it.
 * `sourceMetaJSON`: Not required. This is the URL for the JSON page for the image. The json page will contain meta data on the image, including the age, which will be used to update the timer for the given image so it can update closer to the time the server updates. If there is no URL, the image will refresh at the interval given by `sourceRefreshSeconds`
 * `sourceMetaRefreshSeconds`: Not required. Not currently in use. 
 * `sourceLinkToFullURLBehavior`: Not required. This is used to decide how the `sourceLinkToFullURL` is opened. There are two options: `newTab`, `newWindow`. If this is not set, or anything else is put there, it will go with the default behavior of opening it in the same window. Please note: there is no true cross browser way to decide between opening a new tab or window due to browsers wanting to leave this option to the users. The method used in camWebGrid will work in the current versions of FireFox, Chrome, and Internet Explorer
 * `sourceStaleSeconds`: Not required. This is used to determine if a camera has taken longer than expected to refresh. If not set, then there will be no indication that it has taken too long.
 * `sourceOverlayTextTop`: Not required. If set, this will overlay a message at the top of the image. If not set, not message will be displayed.
 * `sourceEXIF`: Not required. If set, this will overlay a message at the top of the image. The message will contain the EXIF value of the tag from the image. This will more than likely be set to `UserComment` if it is set at all. For this to work, the image _MUST_ be from the same domain as the webhost for the website.
 * `sourceEXIFLabel`: Not required. This will replace the tag in the EXIF message with whatever is specified in this field.

The settings are saved as arrays, with each index representing a camera. For example, if a camera has its `sourceURL`  saved at index 0, then the every other setting for the camera will be set to index 0 of all the other arrays. Let's say you want to set overlay text for the camera at index 1 but not at index 0. There are two ways to accomplish this. The first way is to set up your array like this:

`sourceOverlayTextTop: [undefined,"text to overlay"]`

Note the undefined at index 0. This will make sure that no text overlay is set for index 0. The other way to handle this is by adding a line to `additionalSettings()` like:

`settingsObj.sourceOverlayTextTop[1]="This one uses JSON";`

This way you can add the text at what ever index you want without having to worry about dealing with the other indices. You also have the option of setting up your entire settings page in the `additionalSettings()` function if you would prefer to set one camera at a time. These two settings.js pages would accomplish the same thing

1.
```
var settingsObj = {

	sourceURL: [encodeURIComponent("http://camera1.com/A9998/latest.jpg"),
	"http%3A%2F%2Fcamera2.com%2FA9999%2Flatest.jpg"],

	sourceRefreshSeconds: [10,60],

	sourceLinkToFullURL: [],

	sourceMetaJSON: [],

	sourceMetaRefreshSeconds: [],

	sourceLinkToFullURLBehavior: [],

	sourceStaleSeconds: [],

	sourceOverlayTextTop: []

}

function additionalSettings(){
	/* everything already set in object */
}
```

2.
```javascript
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
	/* camera1 */
		settingsObj.sourceURL[0] = 
			encodeURIComponent("http://camera1.com/A9998/latest.jpg");
	settingsObj.sourceRefreshSeconds[0] = 10;

	/* camera2 */
	settingsObj.sourceURL[1] = 
		"http%3A%2F%2Fcamera2.com%2FA9999%2Flatest.jpg";
	settingsObj.sourceRefreshSeconds[1] = 60;
}
```

Everything in the settings.js page can be overridden by setting the parameter in the url. For example, if you would like to set the overlay text on camera at index 1, you can append:

`?sourceOverlayTextTop[1]=some%20text`

to the end of the url and it will overlay the text "some text" over the image for the camera at index 1. 

VERY IMPORTANT NOTE: You cannot only override one index in an array in the url. If you are going to be changing any settings in the array, make sure you set every index in the url that you want to show up on the page. For example, if you want to change the `sourceRefreshSeconds` in the url, make sure it matches the length of the `sourceURL` array like this:

`?sourceRefreshSeconds[0]=10&sourceRefreshSeconds[1]=30`

not like this:

~~`?sourceRefreshSeconds[1]=30`~~

This will cause the page to display a message because the whole `sourceRefreshSeconds` array has been overwritten.


generate_settings.html
---
You can use this page to generate a settings.js page. Instructions for its use can be found on the page itself.

Notes:
---

###Embedding into another page

To embed the webcams into another page, add all related script files:
```
<script type="text/javascript" src="res/jquery-1.11.1.min.js"></script>
<script type="text/javascript" src="res/jquery-param-plugin.js"></script>
<script type="text/javascript" src="res/timeFunctions.js"></script>
<script type="text/javascript" src="res/exif.js"></script>
<script type="text/javascript" src="res/settings.js"></script>
<script type="text/javascript" src="res/camWebGrid.js"></script>

```
as well as 
```
<div id="innerWrapper"></div><div style="clear: both;" ></div>
```
where ever you want the webcams to be. As the project is now, the webcams will still try to size themselves to be the width and height of the page. includeJS.js was removed because you would need to change all the urls to the script files for it to work, or at least check that they are all correct, and if you are doing that, you might as well just copy the script links because it is 6x faster than loading the libraries through jquery.

###Waking up from hibernation
To counteract the javascript not running when the computer goes to sleep, there is a window focus listener that is set to update everything when the window is focused on.

```
	$(window).focus(function() {
		//console.log("welcome back");
		for ( var i = 0 ; i < sourceURL.length ; i++ ){
			console.log("refreshing: "+i);
			updateCameraImg( i );
		}
	});
```

