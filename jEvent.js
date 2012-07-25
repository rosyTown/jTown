/**
 * © Copyright 2012, Rosytown. All rights reserved.
 * @author Mark Rosendorff || www.rosytown.com.au
 */

((function(window) {

	window.jEvent = jEvent;
	
	// sprite events
	jEvent.ADDED_TO_STAGE = 'addedToStage';

	// image events
	jEvent.IMAGE_READY = 'imageReady';

	// div events
	jEvent.FOCUS_IN = 'focus';
	jEvent.FOCUS_OUT = 'blur';

	// mouse events
	jEvent.CLICK = 'click';
	jEvent.DOUBLE_CLICK = 'dblclick';
	jEvent.MOUSE_DOWN = 'mousedown';
	jEvent.MOUSE_UP = 'mouseup';
	jEvent.ROLL_OVER = 'mouseover';
	jEvent.ROLL_OUT = 'mouseout';
	jEvent.RIGHT_CLICK = 'contextmenu';
	jEvent.MOUSE_WHEEL = 'scroll';
	jEvent.MOUSE_MOVE = 'mousemove';
	jEvent.CONTEXT_MENU = 'contextmenu';
	
	// touch events
	jEvent.TOUCH_START = 'touchstart';
	jEvent.TOUCH_END = 'touchend';
	jEvent.TOUCH_MOVE = 'touchmove';
	jEvent.TOUCH_CANCEL = 'touchcancel';

	// xmlhttprequest events
	jEvent.HTTP_REQUEST_PROGRESS = 'progress';
	jEvent.HTTP_REQUEST_COMPLETE = 'load';
	jEvent.HTTP_REQUEST_ERROR = 'error';
	jEvent.HTTP_REQUEST_ABORT = 'abort';
	
	function jEvent () {}
	
})(window));