

$( document ).ready( function() {

	console.log("ready");

});

function addRow( rowId ) {

	//console.log(rowId);
	$("#"+rowId).append('<input type="text" name="'+rowId+'[]" value="" />');

}

function addAll() {

	addRow( 'sourceURL' );
	addRow( 'sourceRefreshSeconds' );
	addRow( 'sourceLinkToFullURL' );
	addRow( 'sourceMetaJSON' );
	addRow( 'sourceMetaRefreshSeconds' );
	addRow( 'sourceLinkToFullURLBehavior' );
	addRow( 'sourceStaleSeconds' );
	addRow( 'sourceOverlayTextTop' );
	addRow( 'sourceEXIF' );
	addRow( 'sourceEXIFLabel' );

}

function test(){
	var obj = $( ":input" ).serializeArray();
	var URLAr = [];
	var refSecAr = [];
	console.log(obj);
	$.each(obj, function(index, value){
		if ( "sourceURL[]" == value.name ) {

			console.log(value.name+" = "+value.value);

			if ( "" != value.value ) 
				URLAr.push(value.value);
	
		}	

		if ( "sourceRefreshSeconds[]" == value.name ) {

			console.log(value.name+" = "+value.value);

			if ( "" != value.value ) 
				refSecAr.push(value.value);
	
		}	

	});

	console.log(refSecAr);
	console.log(URLAr);
	
	
	
}

function submitForm(){
	/* get input objects from form */
	var obj = $( ":input" ).serializeArray();
	var URLAr = [];
	var refSecAr = [];
//	console.log(obj);
	/* iterate through the objects */
	$.each(obj, function(index, value){	
		/* save the required parameters to arrays */
		if ( "sourceURL[]" == value.name ) {

			console.log(value.name+" = "+value.value);

			if ( "" != value.value ) 
				URLAr.push(value.value);
	
		}	

		if ( "sourceRefreshSeconds[]" == value.name ) {

			console.log(value.name+" = "+value.value);
			/* sourceRefreshSeconds must be integers */
			if ( "" != value.value && isInt(parseInt(value.value)) ) { 
				refSecAr.push(value.value);
			} else {
				alert("sourceRefreshSeconds must be integers");
				return false;
			}
		}	

	});

	//console.log(refSecAr);

	/* check array lengths to be sure they are equal */
	if ( URLAr.length == refSecAr.length && 0 != URLAr.length ) {
		$("#form").submit();
	} else {
		alert("All required parameters must be set");
	}



}

function isInt(n) {
	return Number(n)===n && n%1===0;
}
