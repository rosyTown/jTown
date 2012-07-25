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
		
		// Constructor Implementation
		//----------------------------------------------------------------------------------------------------------
		
		if($src != undefined)	_this.source($src);
		
	}
	
})(window));