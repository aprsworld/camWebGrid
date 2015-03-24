

$( document ).ready( function() {

	console.log("ready");

});

function addRow( rowId ) {

	console.log(rowId);
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

function submitForm(){

	$("#form").submit();

}
