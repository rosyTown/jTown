/**
 * © Copyright 2012, Rosytown. All rights reserved.
 * @author Mark Rosendorff || www.rosytown.com.au
 */

((function(window) {

	window.jText = jText;
	
	function jText ($text) {
		
		var _super = jApp.extend(this, jSprite);

		this.numLines = 0;
		this.lineHeight = 0;

		var _this = this;
		var _text = '';
		var _font = '';
		var _size = '';
		var _sizeNum = 0;
		var _color = '#000000';
		var _bold = false;
		var _textAlign = 'left';
		var _setWidth = 0;
		var _setHeight = 0;
		var _textWidth = 0;
		var _textHeight = 0;
		var _input = false;
		var _inputType = 'text';
		var _proxyText;
		
		// Private Functions
		//----------------------------------------------------------------------------------------------------------
		
		var createProxyText = function ($text) {
			_proxyText = document.createElement('div');
			_proxyText.style.visibility = 'hidden';
			_proxyText.style.display = 'inline';
			_proxyText.style.position = 'absolute';
			_proxyText.style.fontWeight = _bold ? 'bold' : 'normal';
			_proxyText.style.lineHeight = _this.style('lineHeight');
			_proxyText.style.width = _this.setWidth() == 0 ? 'auto' : _this.setWidth() + 'px';
			_proxyText.style.height = _this.setHeight() == 0 ? 'auto' : _this.setHeight() + 'px';
			_proxyText.style.fontFamily = _font;
			_proxyText.style.fontSize = _size;
			_proxyText.style.wordWrap = _this.style('wordWrap');
			if(_setWidth == 0)	_proxyText.style.whiteSpace = 'nowrap';
			if(_this.input() && _proxyText.style.height == 'auto')	_proxyText.style.height = _proxyText.style.lineHeight;

			document.body.appendChild(_proxyText);

			_proxyText.innerHTML = 'W';
			var $singleLineHeight = _proxyText.offsetHeight;
			
			var $leading = 0;
			if(new RegExp('em').exec(_this.style('lineHeight')) != null)		$leading = parseFloat(document.body.style.lineHeight) * parseFloat(_this.style('lineHeight'));
			else 																$leading = parseFloat(_this.style('lineHeight'));

			_proxyText.innerHTML = $text;

			_this.lineHeight = $singleLineHeight >= _proxyText.offsetHeight ? $singleLineHeight : $leading;
		}

		var removeProxyText = function () {
			document.body.removeChild(_proxyText);
			_proxyText = null;
		}

		var updateDimensions = function () {
			_this.numLines = Math.round(_proxyText.offsetHeight / _this.lineHeight);
			if(_this.numLines == 1)	_this.style('whiteSpace', 'nowrap');
			else 					_this.style('whiteSpace', 'normal');
			
			_this.textWidth(_proxyText.offsetWidth);
			_this.textHeight(_proxyText.offsetHeight);
			_this.width(_this.setWidth() == 0 ? _proxyText.offsetWidth : _this.setWidth());
			_this.height(_this.setHeight() == 0 ? _proxyText.offsetHeight : _this.setHeight());
			removeProxyText();
		}
		
		// Public Functions
		//----------------------------------------------------------------------------------------------------------
		
		this.appendText = function ($string) {
			var $newText = _this.text() + $string;
			this.text($newText);
		}

		// Event Handlers
		//----------------------------------------------------------------------------------------------------------

		var onAddedToStage = function (e) {
			_this.removeEventListener(jEvent.ADDED_TO_STAGE, onAddedToStage);
			_this.visible(true);
		}

		// Getters & Setters
		//----------------------------------------------------------------------------------------------------------
		
		this.text = function ($v) {
			if ($v != undefined) {
				_text = $v;
				//createProxyText(this.text());
				createProxyText(_text);
				updateDimensions();
				this.input() ? this.div.value = _text : this.div.innerHTML = _text;
				return this;
			}
			else {
				return this.input() ? this.div.value : _text;
			}
		}

		this.font = function ($v) {
			if ($v != undefined) {
				_font = $v;
				_this.style('fontFamily', _font);
				createProxyText(this.text());
				updateDimensions();
				return this;
			}
			else {
				return _font;
			}
		}

		this.size = function ($v) {
			if ($v != undefined) {
				_size = $v;
				_this.style('fontSize', _size);
				if(new RegExp('em').exec(_size) != null)	_sizeNum = parseFloat(document.body.style.fontSize) * parseFloat(_size);
				else										_sizeNum = parseFloat(_size);
				createProxyText(this.text());
				updateDimensions();
				return this;
			}
			else {
				return _size;
			}
		}

		this.color = function ($v) {
			if ($v != undefined) {
				_color = $v;
				_this.style('color', _color);
				return this;
			}
			else {
				return _color;
			}
		}

		this.bold = function ($v) {
			if ($v != undefined) {
				_bold = $v;
				_this.style('fontWeight', _bold ? 'bold' : 'normal');
				createProxyText(this.text());
				updateDimensions();
				return this;
			}
			else {
				return _bold;
			}
		}
		
		this.textAlign = function ($v) {
			if ($v != undefined) {
				_textAlign = $v;
				_this.style('textAlign', _textAlign);
				return this;
			}
			else {
				return _textAlign;
			}
		}

		this.setWidth = function ($v) {
			if ($v != undefined) {
				if($v == 0)	return this;
				_setWidth = $v;
				createProxyText(this.text());
				updateDimensions();
				return this;
			}
			else {
				return _setWidth;
			}
		}

		this.setHeight = function ($v) {
			if ($v != undefined) {
				if($v == 0)	return this;
				_setHeight = $v;
				createProxyText(this.text());
				updateDimensions();
				if(this.input())	this.input(true);
				return this;
			}
			else {
				return _setHeight;
			}
		}

		this.textWidth = function ($v) {
			if ($v != undefined) {
				_textWidth = $v;
				return this;
			}
			else {
				return _textWidth;
			}
		}

		this.textHeight = function ($v) {
			if ($v != undefined) {
				_textHeight = $v;
				return this;
			}
			else {
				return _textHeight;
			}
		}

		this.input = function ($v) {
			if ($v != undefined) {
				_input = $v;
				var $inputTag = _this.setHeight() == 0 ? document.createElement('input') : document.createElement('textarea');

				for (var node = 0 ; node < document.body.childNodes.length ; node++) {
					if(document.body.childNodes[node].id == _this.id()) {
						document.body.removeChild(document.body.childNodes[node]);
					}
				}

				if(_this.parent) {
					_this.parent.div.removeChild(_this.div);
					_this.parent.div.appendChild($inputTag);
				}				
				$inputTag.id = _this.div.id;
				for(var ii in _this.div.style) {
					$inputTag.style[ii] = _this.div.style[ii];
				}
				$inputTag.type = _inputType;
				_this.div = $inputTag;
				_this.text(_text);
				return this;
			}
			else {
				return _input;
			}
		}

		this.inputType = function ($v) {
			if ($v != undefined) {
				_inputType = $v;
				if(_this.input()) {
					_this.div.type = _inputType;
				}
				return this;
			}
			else {
				return _inputType;
			}
		}

		// Constructor Implementation
		//----------------------------------------------------------------------------------------------------------
		
		// as a result of CSS returning '(empty string)' as a default for most text values we need to set these ourselves.
		if(document.body.style.fontSize == '')			document.body.style.fontSize = '16px';
		if(document.body.style.fontFamily == '')		document.body.style.fontFamily = 'Arial, Helvetica, sans-serif';
		if(document.body.style.lineHeight == '')		document.body.style.lineHeight = '16px';
		if(document.body.style.letterSpacing == '')		document.body.style.letterSpacing = '0px';

		if(_this.style('fontFamily') == '')		_this.font(document.body.style.fontFamily);
		if(_this.style('fontSize') == '')		_this.size(document.body.style.fontSize);
		if(_this.style('lineHeight') == '')		_this.style('lineHeight', document.body.style.lineHeight);
		if(_this.style('letterSpacing') == '')	_this.style('letterSpacing', document.body.style.letterSpacing);

		// so we have to secretly add this.div to the body so that we can extract its dimension data (width, height)
		// then when this is added to the stage for real, we can set it's visibility back to true.
		_this.addEventListener(jEvent.ADDED_TO_STAGE, onAddedToStage, false);
		document.body.appendChild(_this.div);
		_this.visible(false);

		if($text != undefined)	_this.text($text);
	}
	
})(window));