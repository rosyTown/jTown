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
		
		// Private Functions
		//----------------------------------------------------------------------------------------------------------
		
		var testImage = function () {
			if(_image.complete != null && _image.complete) {
				clearInterval(_timer);
				addImage();
			}
		}

		var addImage = function () {
			_this.width(_image.width);
			_this.height(_image.height);
			_this.div.appendChild(_image);
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
		
		// Constructor Implementation
		//----------------------------------------------------------------------------------------------------------
		
		if($src != undefined)	_this.source($src);
		
	}
	
})(window));