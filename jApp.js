/**
 * © Copyright 2012, Rosytown. All rights reserved.
 * @author Mark Rosendorff || www.rosytown.com.au
 */

((function(window) {

	window.jApp = jApp;
	
	// Public Static Functions
	//----------------------------------------------------------------------------------------------------------

	jApp.extend = function ($childClass, $superClass) {
		eval('var $super = new ' + $superClass + '()');
		for (var i in $super) {
			$childClass[i] = $super[i];
		}
		$super.listenerProxy = function ($function) {
			$function($childClass);
		}
		return	$super;
	}

	jApp.isRunningLocally = function () {
		return	new RegExp('file:/').exec(window.location.href) != null;
	}

	function jApp () {}

})(window));