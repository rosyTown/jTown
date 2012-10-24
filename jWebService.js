/**
 * © Copyright 2012, Rosytown. All rights reserved.
 * @author Mark Rosendorff || www.rosytown.com.au
 */

((function(window) {

	window.jWebService = jWebService;
	
	function jWebService () {
		
		this.request;
		this.responseArray;
		this.responseString;
		this.progressPercent = 0;

		var _this = this;
		
		// Private Functions
		//----------------------------------------------------------------------------------------------------------
		
		
		// Public Functions
		//----------------------------------------------------------------------------------------------------------
		
		this.pingService = function ($method, $address, $urlVars) {
			var $vars = '';
			if($urlVars != undefined) $vars = $urlVars;
			_this.request.open($method, $address);
			_this.request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			_this.request.send($vars);
		}

		this.getData = function ($method, $address, $table, $property, $condition) {
			var $urlVars = '';

			if($table != undefined) {
				$urlVars += 'table=' + escape($table);
			}
			if($property != undefined) {
				if($urlVars == '')	$urlVars + 'property=' + escape($property);
				else 				$urlVars += '&property=' + escape($property);
			}
			if($condition != undefined) {
				if($urlVars == '')	$urlVars + 'condition=' + escape($condition);
				else 				$urlVars += '&condition=' + escape($condition);
			}
			
			_this.request.open($method, $address);
			_this.request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			_this.request.send($urlVars);
		}

		this.sendData = function ($method, $address, $table, $dataObject) {
			if(!$table || $table == undefined) {
				throw new Error('**jWebService Error: sendData must accept a table argument.');
				return;
			}

			if(!$dataObject || $dataObject == undefined) {
				throw new Error('**jWebService Error: sendData must accept a dataObject argument.');
				return;
			}

			var $urlVars = 'table=' + escape($table);

			for (var i in $dataObject) {
				$urlVars += '&' + escape(i) + '=' + escape($dataObject[i]);
			}
			
			_this.request.open($method, $address);
			_this.request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			_this.request.send($urlVars);
		}

		this.addEventListener = function ($event, $function) {
			_this[$event] = $function;
		}

		this.destroy = function () {
			if (!jApp.IE7 && !jApp.IE8)	{
				_this.request.removeEventListener(jEvent.HTTP_REQUEST_PROGRESS, onProgress);
				_this.request.removeEventListener(jEvent.HTTP_REQUEST_COMPLETE, onComplete);
				_this.request.removeEventListener(jEvent.HTTP_REQUEST_ERROR, onError);
				_this.request.removeEventListener(jEvent.HTTP_REQUEST_ABORT, onAbort);
			}
			else {
				_this.request.detachEvent('on' + jEvent.HTTP_REQUEST_PROGRESS, onProgress);  
				_this.request.detachEvent('on' + jEvent.HTTP_REQUEST_COMPLETE, onComplete);  
				_this.request.detachEvent('on' + jEvent.HTTP_REQUEST_ERROR, onError);  
				_this.request.detachEvent('on' + jEvent.HTTP_REQUEST_ABORT, onAbort);
			}
			_this.request = null;
			_this = null;
		}

		// Event Handlers
		//----------------------------------------------------------------------------------------------------------

		var onProgress = function (e) {
			if(_this[jEvent.HTTP_REQUEST_PROGRESS]) {
				_this.progressPercent = e.loaded / e.total; 
				_this[jEvent.HTTP_REQUEST_PROGRESS](_this);
			}
		}

		var onComplete = function (e) {
			if(_this[jEvent.HTTP_REQUEST_COMPLETE]) {
				try
				{
					_this.responseArray = eval(_this.request.responseText);
				}
				catch(e)
				{
					_this.responseArray = [];
				}
				_this.responseString = _this.request.responseText;
				_this[jEvent.HTTP_REQUEST_COMPLETE](_this);
			}
		}

		var onError = function (e) {
			if(_this[jEvent.HTTP_REQUEST_ERROR])		_this[jEvent.HTTP_REQUEST_ERROR](_this);
		}

		var onAbort = function (e) {
			if(_this[jEvent.HTTP_REQUEST_ABORT])		_this[jEvent.HTTP_REQUEST_ABORT](_this);
		}
		
		// Constructor Implementation
		//----------------------------------------------------------------------------------------------------------
		
		_this.request = new XMLHttpRequest();

		if (!jApp.IE7 && !jApp.IE8)	{
			_this.request.addEventListener(jEvent.HTTP_REQUEST_PROGRESS, onProgress, false);  
			_this.request.addEventListener(jEvent.HTTP_REQUEST_COMPLETE, onComplete, false);  
			_this.request.addEventListener(jEvent.HTTP_REQUEST_ERROR, onError, false);  
			_this.request.addEventListener(jEvent.HTTP_REQUEST_ABORT, onAbort, false);
		}
		else {
			_this.request.onreadystatechange = function () {
				
				if (this.readyState != 4)	return;

				if(_this[jEvent.HTTP_REQUEST_COMPLETE]) {
					try
					{
						_this.responseArray = eval(_this.request.responseText);
					}
					catch(e)
					{
						_this.responseArray = [];
					}
					console.log('--' + _this.responseArray);
					_this.responseString = _this.request.responseText;
					_this[jEvent.HTTP_REQUEST_COMPLETE](_this);
				}
			}
		}
		
	}
	
})(window));