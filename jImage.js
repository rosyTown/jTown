/**
 * © Copyright 2012, Rosytown. All rights reserved.
 * @author Mark Rosendorff || www.rosytown.com.au
 */

((function(window) {

	window.jImage = jImage;

	function jImage ($src) {
		
		var _super = jApp.extend(this, jSprite);

		var _this = this;
		var _image;
		var _source;
		var _timer;
		var _width;
		var _height;
		var _visible = true;
		
		// Private Functions
		//----------------------------------------------------------------------------------------------------------
		
		var testImage = function () {
			if(_image.complete != null && _image.complete) {
				clearInterval(_timer);
				addImage();
			}
		}

		var addImage = function () {
			_this.div.appendChild(_image);

			if(_width == undefined)		_this.width(_image.width);
			else						_this.width(_width);
			
			if(_height == undefined)	_this.height(_image.height);
			else						_this.height(_height);
			
			if(_this.rotation() != 0) {
				$r90210 = _this.rotation();
				_this.rotation($r90210);
			}

			$v90210 = _this.visible();
			_this.visible($v90210);
			
			_this.dispatchEvent(jEvent.IMAGE_READY);
		}

		// Public Functions
		//----------------------------------------------------------------------------------------------------------

		
		
		// Getters & Setters
		//----------------------------------------------------------------------------------------------------------
		
		this.source = function ($v) {
			if ($v != undefined) {
				_source = $v;
				if(_image) {
					this.div.removeChild(_image);
					_image = null;
				}
				_image = document.createElement('img');
				_image.src = _source;
				_timer = setInterval(testImage, 10);
				return this;
			}
			else {
				return _source;
			}
		}

		this.width = function ($v) {
			if ($v != undefined) {
				_width = $v;
				_image.style.width = _width.toString() + 'px';
				return this;
			}
			else {
				return _width;
			}
		}
		
		this.height = function ($v) {
			if ($v != undefined) {
				_height = $v;
				_image.style.height = _height.toString() + 'px';
				return this;
			}
			else {
				return _height;
			}
		}
		
		this.visible = function ($v) {
			if ($v != undefined) {
				_visible = $v;
				_image.style.visibility = _visible ? 'visible' : 'hidden';
				return this;
			}
			else {
				return _visible;
			}
		}

		// Constructor Implementation
		//----------------------------------------------------------------------------------------------------------
		
		if($src != undefined)	_this.source($src);
		
	}
	
})(window));