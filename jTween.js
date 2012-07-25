/**
 * © Copyright 2012, Rosytown. All rights reserved.
 * @author Mark Rosendorff || www.rosytown.com.au
 */

((function(window) {

	window.jTween = jTween;
	
	// public static variables
	jTween.allTweens = [];
	jTween.frameRate = 60;
	jTween.TwoPI = Math.PI * 2;
	
	function jTween ($jsprite, $time, $object, $from) {
	
		// public variables
		this.jsprite = $jsprite;
		
		// private variables
		var _jsprite = $jsprite;
		var _from = $from;
		var _totalTime = $time * 1000;
		var _object = $object;
		var _currentTime = 0;
		var _ratio;
		var _timer;
		var _interval;
		var _delay;
		var _onComplete;
		var _onStart;
		var _onProgress;
		var _ease;
		var _defaultEase = 'LinearEaseNone';
		var _easeParams = [];
		var _extraArgs;
		var _repeat;
		var _yoyo;
		var _properties = [];
		var _onStartFired = false;
		var _repeatCount = 0;
		var _yoyoCount = 0;
				
		// Private Functions
		//----------------------------------------------------------------------------------------------------------
		
		var setProperties = function () {
			for (i = 0 ; i < _properties.length ; i++) {
				var $obj = _properties[i];
				var $newValue = $obj.startValue + ($obj.diff * _ratio);
				eval('_jsprite.' + $obj.name + '(' + $newValue + ')');
			}
		}
		
		var update = function () {
			_currentTime += _interval;
			if(_currentTime >= _totalTime) {
				clearInterval(_timer);
				_timer = null;
				if (_repeat != null && _yoyo == null)			repeatClone();
				else if (_yoyo != null && _repeat == null)		yoyoClone();
				else if (_yoyo != null && _repeat != null) 		{}// shouldn't be using yoyo and repeat together!!! neither will be executed as a result.
				else {
					if (_onComplete) _onComplete();
					_jsprite.tweening = false;
					jTween.killTweensOf(_jsprite);
					return;
				}
			}
			
			if(_currentTime >= _delay) {
				if(_onStart && !_onStartFired) {
					_onStartFired = true;
					_onStart();
				}
				_ratio = eval('' + _ease + '(_currentTime - _delay, 0, 1, _totalTime - _delay' + _extraArgs + ')');
				setProperties();
				if(_onProgress)	_onProgress();
			}
		}
		
		var reset = function () {
			for (i = 0 ; i < _properties.length ; i++) {
				var $obj = _properties[i];
				eval('_jsprite.' + $obj.name + '(' + $obj.startValue + ')');
			}
			_currentTime = 0;
			_ratio = 0;
		}
		
		var buildTweeningProperties = function () {
			if(_from) {
				rebuildTweeningProperties(true);
				reset();
			}
			for (var o in _object) {
				if (o!='ease' && o!='easeParams' && o!='delay' && o!='onComplete' && o!='onStart' && o!='onProgress' && o!='repeat' && o!='yoyo') {
					var $startVal = _from ? _object[o] : eval('_jsprite.' + o + '()');
					var $endVal = _from ? eval('_jsprite.' + o + '()') : _object[o];
					var $diffVal = $endVal - $startVal;
					var $prop = {'name':o, 'startValue':$startVal, 'endValue':$endVal, 'diff':$diffVal};
					_properties.push($prop);
				}
			}
		}
		
		var rebuildTweeningProperties = function ($reversed) {
			for (i = 0 ; i < _properties.length ; i++) {
				var $prop = _properties[i];
				var $startVal = $prop.startValue;
				var $endVal = $prop.endValue;
				$prop.startValue = $reversed ? $endVal : $startVal;
				$prop.endValue = $reversed ? $startVal : $endVal;
				$prop.diff = $startVal - $endVal;
			}
		}
		
		var repeatClone = function () {
			if (_repeat != 0) {
				_repeat--;
				if (_repeat <= 0) {
					_repeat = null;
				}
				else {
					reset();
					_timer = setInterval(update, _interval);
				}
			}
			else {
				reset();
				_timer = setInterval(update, _interval);
			}
		}
		
		var yoyoClone = function () {
			if (_yoyo != 0) {
				_yoyo--;
				if (_yoyo <= 0) {
					_yoyo = null;
				}
				else {
					rebuildTweeningProperties(true);
					reset();
					_timer = setInterval(update, _interval);
				}
			}
			else {
				rebuildTweeningProperties(true);
				reset();
				_timer = setInterval(update, _interval);
			}
		}
		
		var pause = function(){
			clearInterval(_timer);
		}
		
		var resume = function(){
			_timer = setInterval(update, _interval);
		}
		
		var destroy = function () {
			clearInterval(_timer);
			_timer = null;
			_jsprite = null;
			_object = null;
			_onComplete = null;
			_onStart = null;
			_onProgress = null;
			_ease = null;
			_easeParams = null;
			_properties = null;
		}
		
		// ease functions
		//------------------------------------------------
		var LinearEaseNone = function (t, b, c, d) {
			return c*t/d + b;
		}
		
		var QuadEaseIn = function (t, b, c, d) {
			return c*(t/=d)*t + b;
		}
		
		var QuadEaseOut = function (t, b, c, d) {
			return -c *(t/=d)*(t-2) + b;
		}
		
		var QuadEaseInOut = function (t, b, c, d) {
			if ((t/=d*0.5) < 1) return c*0.5*t*t + b;
			return -c*0.5 * ((--t)*(t-2) - 1) + b;
		}
		
		var BackEaseIn = function (t, b, c, d, s) {
			s = s == undefined ? 1.70158 : s;
			return c*(t/=d)*t*((s+1)*t - s) + b;
		}
		
		var BackEaseOut = function (t, b, c, d, s) {
			s = s == undefined ? 1.70158 : s;
			return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
		}
		
		var BackEaseInOut = function (t, b, c, d, s) {
			s = s == undefined ? 1.70158 : s;
			if ((t/=d*0.5) < 1) return c*0.5*(t*t*(((s*=(1.525))+1)*t - s)) + b;
			return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
		}
		
		var ElasticEaseIn = function (t, b, c, d, a, p) {
			a = a == undefined ? 0 : a;
			p = p == undefined ? 0 : p;
			var s;
			if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
			if (!a || (c > 0 && a < c) || (c < 0 && a < -c)) { a=c; s = p/4; }
			else s = p/jTween.TwoPI * Math.asin (c/a);
			return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*jTween.TwoPI/p )) + b;
		}
		
		var ElasticEaseOut = function (t, b, c, d, a, p) {
			a = a == undefined ? 0 : a;
			p = p == undefined ? 0 : p;
			var s;
			if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
			if (!a || (c > 0 && a < c) || (c < 0 && a < -c)) { a=c; s = p/4; }
			else s = p/jTween.TwoPI * Math.asin (c/a);
			return (a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*jTween.TwoPI/p ) + c + b);
		}
		
		var ElasticEaseInOut = function (t, b, c, d, a, p) {
			a = a == undefined ? 0 : a;
			p = p == undefined ? 0 : p;
			var s;
			if (t==0) return b;  if ((t/=d*0.5)==2) return b+c;  if (!p) p=d*(.3*1.5);
			if (!a || (c > 0 && a < c) || (c < 0 && a < -c)) { a=c; s = p/4; }
			else s = p/jTween.TwoPI * Math.asin (c/a);
			if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*jTween.TwoPI/p )) + b;
			return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*jTween.TwoPI/p )*.5 + c + b;
		}
		
		var BounceEaseOut = function (t, b, c, d) {
			if ((t/=d) < (1/2.75)) {
				return c*(7.5625*t*t) + b;
			} else if (t < (2/2.75)) {
				return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
			} else if (t < (2.5/2.75)) {
				return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
			} else {
				return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
			}
		}
		
		var BounceEaseIn = function (t, b, c, d) {
			return c - easeOut(d-t, 0, c, d) + b;
		}
		
		var BounceEaseInOut = function (t, b, c, d) {
			if (t < d*0.5) return easeIn (t*2, 0, c, d) * .5 + b;
			else return easeOut (t*2-d, 0, c, d) * .5 + c*.5 + b;
		}
		//------------------------------------------------
		
		// Public Functions
		//----------------------------------------------------------------------------------------------------------
		
		this.pause = function () {
			pause();
		}
		
		this.resume = function () {
			resume();
		}
		
		this.destroy = function () {
			destroy();
		}
		
		// Constructor Implementation
		//----------------------------------------------------------------------------------------------------------
		
		buildTweeningProperties();
		
		_delay = _object.delay == undefined ? 0 : _object.delay * 1000;
		_totalTime += _delay;
		_ease = _object.ease == undefined ? _defaultEase : _object.ease;
		_easeParams = _object.easeParams == undefined ? [] : _object.easeParams;
		_extraArgs = _easeParams.length > 0 ? ',' + _easeParams.toString() : '';
		_onComplete = _object.onComplete == undefined ? null : _object.onComplete;
		_onStart = _object.onStart == undefined ? null : _object.onStart;
		_onProgress = _object.onProgress == undefined ? null : _object.onProgress;
		_repeat = _object.repeat == undefined ? null : _object.repeat;
		if(_repeat == 1 || _repeat < 0)	_repeat = null;
		_yoyo = _object.yoyo == undefined ? null : _object.yoyo;
		if(_yoyo == 1 || _yoyo < 0)	_yoyo = null;
		_interval = parseInt(1000 / jTween.frameRate);
		_timer = setInterval(update, _interval);
		_jsprite.tweening = true;
	}
	
	// Public Static Functions
	//----------------------------------------------------------------------------------------------------------
		
	jTween.to = function ($jsprite, $time, $object) {
		var $t = new jTween($jsprite, $time, $object, false);
		jTween.allTweens.push($t);
	}
	
	jTween.from = function ($jsprite, $time, $object) {
		var $t = new jTween($jsprite, $time, $object, true);
		jTween.allTweens.push($t);
	}
	
	jTween.killTweensOf = function ($jsprite) {
		for(i = 0 ; i < jTween.allTweens.length ; i++) {
			var $t = jTween.allTweens[i];
			if($jsprite == $t.jsprite) {
				$t.destroy();
				jTween.allTweens.splice(i, 1);
				return;
			}
		}
	}
	
	jTween.killAllTweens = function () {
		for(i = jTween.allTweens.length - 1 ; i >= 0 ; i--) {
			var $t = jTween.allTweens[i];
			$t.destroy();
			jTween.allTweens.splice(i, 1);
		}
	}
	
	jTween.pauseTweensOf = function ($jsprite) {
		for(i = 0 ; i < jTween.allTweens.length ; i++) {
			var $t = jTween.allTweens[i];
			if($jsprite == $t.jsprite) {
				$t.pause();
				return;
			}
		}
	}
	
	jTween.resumeTweensOf = function ($jsprite) {
		for(i = 0 ; i < jTween.allTweens.length ; i++) {
			var $t = jTween.allTweens[i];
			if($jsprite == $t.jsprite) {
				$t.resume();
				return;
			}
		}
	}
	
	jTween.pauseAllTweens = function () {
		for(i = 0 ; i < jTween.allTweens.length ; i++) {
			var $t = jTween.allTweens[i];
			$t.pause();
		}
	}
	
	jTween.resumeAllTweens = function () {
		for(i = 0 ; i < jTween.allTweens.length ; i++) {
			var $t = jTween.allTweens[i];
			$t.resume();
		}
	}
	
})(window));