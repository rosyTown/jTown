/**
 * © Copyright 2012, Rosytown. All rights reserved.
 * @author Mark Rosendorff || www.rosytown.com.au
 */

((function(window) {

	window.jNavigator = jNavigator;
	
	jNavigator.instance;

	// Public Static Functions
	//----------------------------------------------------------------------------------------------------------

	jNavigator.init = function ($onChangeAddressFunction) {
		if(!$onChangeAddressFunction || $onChangeAddressFunction == undefined) {
			throw new Error('**jNavigator Error: initiate must accept onChangeAddressFunction argument');
			return;
		}
		jNavigator.instance = new jNavigator($onChangeAddressFunction);
	}

	jNavigator.getAddress = function () {
		return jNavigator.instance.currentAddress;
	}

	jNavigator.getHashTag = function () {
		return jNavigator.instance.currentHashTag;
	}

	jNavigator.setHashTag = function ($tag) {
		jNavigator.instance.newHashTag = $tag;
	}

	jNavigator.navigateToURL = function ($url, $window) {
		window.open($url, $window);
	}

	jNavigator.forceOnChange = function () {
		jNavigator.instance.forceOnChange();
	}

	jNavigator.normalToURLSafeFormat = function ($string) {
		$string = $string.replace(/ /g,'-');
		$string = $string.toLowerCase();
		return $string;
	}

	jNavigator.URLSafeToNormalFormat = function ($string) {
		$string = $string.replace(/-/g,' ');
		var $ar = $string.split(' ');
		$string = '';
		for ($word = 0 ; $word < $ar.length ; $word++) {
			$string += $ar[$word].charAt(0).toUpperCase() + $ar[$word].substring(1, $ar[$word].length);
			if($word < $ar.length - 1)	$string += ' ';
		}
		return $string;
	}

	function jNavigator ($onChangeFunction) {

		//public variables
		this.currentAddress;
		this.currentHashTag;
		this.newHashTag;
		this.currentVariables = [];

		// private variables
		var _this = this;
		var _onChangeFunction;
		var _timer;

		// Private Functions
		//----------------------------------------------------------------------------------------------------------
		
		var setCurrentState = function () {
			_this.currentAddress = document.location.href.split('#').length > 0 ? document.location.href.split('#')[0] : document.location.href;
			_this.currentHashTag = _this.newHashTag;
			if(_this.currentHashTag != undefined)		_this.currentVariables = _this.currentHashTag.split('/').length > 0 ? _this.currentHashTag.split('/') : [];
			else										_this.currentVariables = [];
			_this.currentVariables.splice(0, 1);
		}

		var checkHashTag = function () {
			// ie7 isnt keeping track of the href when back/forward are pressed....
			//console.log(document.location.href + ' : ' +_this.currentHashTag);
			if(_this.newHashTag != _this.currentHashTag) {							// if the hash has changed due to site navigation...
				setCurrentState();
				document.location.href = _this.currentAddress + '#' + _this.currentHashTag;
				if(_onChangeFunction != undefined) 	_onChangeFunction(_this);
			}			
			else if(document.location.href.split('#')[1] != _this.currentHashTag) {		// if the hash has changed due to the back/forward browser buttons....
				_this.newHashTag = document.location.href.split('#')[1];
				setCurrentState();
				document.location.href = _this.currentAddress + '#' + _this.currentHashTag;
				if(_onChangeFunction != undefined) 	_onChangeFunction(_this);
			}
		}

		// Public Functions
		//----------------------------------------------------------------------------------------------------------
		
		this.forceOnChange = function () {
			if(_onChangeFunction != undefined) 	_onChangeFunction(_this);
		}

		// Constructor Implementation
		//----------------------------------------------------------------------------------------------------------

		_this.newHashTag = document.location.href.split('#')[1];
		setCurrentState();
		_onChangeFunction = $onChangeFunction;
		_timer = setInterval(checkHashTag, 50);
	}
	
})(window));