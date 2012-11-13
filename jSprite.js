/**
 * © Copyright 2012, Rosytown. All rights reserved.
 * @author Mark Rosendorff || www.rosytown.com.au
 */

((function(window) {

	window.jSprite = jSprite;
	
	jSprite.instanceCount = 0;
	jSprite.DegreesToRadians = (Math.PI / 180);
	
	function jSprite () {
		
		//public variables
		this.div;
		this.parent = null;
		this.numChildren = 0;
		this.eventVars = [];
		this.tweening = false;
		
		// private variables
		var _this = this;
		var _id = 'jSpriteInstance' + window.jSprite.instanceCount;
		var _classes = '';
		var _children = [];
		var _listeners = [];
		var _classString;
		var _buttonMode = false;
		var _mouseEnabled = true;
		var _mouseChildren = true;
		var _position = 'absolute';
		var _registrationPoint = {x:0, y:0};
		var _index;
		var _x = 0;
		var _y = 0;
		var _width = 0;
		var _height = 0;		
		var _alpha = 1;		
		var _visible = true;		
		var _rotation = 0;
		var _tint;
		var _tabEnabled = false;
		var _tabIndex;
		var _alphaString;
		var _rotationString;
		
		// Private Functions
		//----------------------------------------------------------------------------------------------------------
		
		var childAdded = function ($child) {
			$child.visible($child.visible());
			if(!_this.mouseChildren() || !_this.mouseEnabled())	$child.mouseChildren(false);
			$child.dispatchEvent(jEvent.ADDED_TO_STAGE);
		}
		
		// Public Functions
		//----------------------------------------------------------------------------------------------------------
		
		this.listenerProxy = function ($function) {
			$function(_this);
		}

		this.addChild = function ($child) {
			this.div.appendChild($child.div);
			$child.parent = this;
			$child.index(this.numChildren);
			_children.push($child);
			this.numChildren = _children.length;
			childAdded($child);
		}

		this.addChildAt = function ($child, $index) {
			if($index >= _children.length && _children.length > 0) {
				throw new Error('**jSprite Error: addChildAt cannot accept an index out of bounds.');
				return;
			}
			this.div.appendChild($child.div);
			$child.parent = this;
			$child.index($index);
			_children.splice($index, 0, $child);
			for(var k = $index + 1 ; k < _children.length ; k++) {
				_children[k].index(_children[k].index() + 1);
			}
			this.numChildren = _children.length;
			childAdded($child);
		}
		
		this.removeChild = function ($child) {
			this.div.removeChild($child.div);
			$child.parent = null;
			var $n;
			for(var i = 0 ; i < _children.length ; i++) {
				if (_children[i] == $child) {
					_children.splice(i, 1);
					$n = i;
					break;
				}
			}
			for(var k = $n ; k < _children.length ; k++) {
				_children[k].index(_children[k].index() - 1);
			}
			this.numChildren = _children.length;
		}

		this.removeChildAt = function ($index) {
			if($index >= _children.length && _children.length > 0) {
				throw new Error('**jSprite Error: removeChildAt cannot accept an index out of bounds.');
				return;
			}
			this.div.removeChild(_children[$index].div);
			_children[$index].parent = null;
			_children.splice($index, 1);
			for(var k = $index ; k < _children.length ; k++) {
				_children[k].index(_children[k].index() - 1);
			}
			this.numChildren = _children.length;
		}
		
		this.getChildAt = function ($index) {
			for(var i = 0 ; i < _children.length ; i++) {
				if(_children[i].index() == $index) {
					return	_children[i];
				}
			}
			return null;
		}

		this.addEventListener = function ($type, $function, $useCapture, $stopPropogation) {
			_this[$type + 'function'] = function(e){
				if(!_this.mouseEnabled())	return;
				_this.listenerProxy($function);
				if ($stopPropogation) {
					e.cancelBubble = true;
					if(e.stopPropagation)	e.stopPropagation();
				}
			};
			
			if (!jApp.IE7 && !jApp.IE8)	this.div.addEventListener($type, _this[$type + 'function'], $useCapture ? $useCapture : false);
			else 								this.div.attachEvent('on' + $type, _this[$type + 'function']);

			_listeners[$type] = _listeners[$type] || [];
			_listeners[$type].push(_this[$type + 'function']);			
		}
		
		this.removeEventListener = function ($type, $function, $useCapture) {
			if (!jApp.IE7 && !jApp.IE8)	this.div.removeEventListener($type, _this[$type + 'function'], $useCapture ? $useCapture : false);
			else 								this.div.detachEvent('on' + $type, _this[$type + 'function']);

			if(_listeners[$type]) _listeners[$type] = null;
			_this[$type + 'function'] = null;
		}

		this.dispatchEvent = function ($eventID) {
			if(arguments.length > 1) {
				this.eventVars = Array.prototype.slice.call(arguments);
				this.eventVars.splice(0,1);
			}
			if(_listeners[$eventID])	_listeners[$eventID][0]();

			this.eventVars = [];
		}
		
		// Getters & Setters
		//----------------------------------------------------------------------------------------------------------
		
		this.id = function ($v) {
			if ($v != undefined) {
				_id = $v;
				this.div.id = _id;
				return this;
			}
			else {
				return _id;
			}
		}

		this.classes = function ($v) {
			if ($v != undefined) {
				_classes = $v;
				this.div.className = _classes;
				return this;
			}
			else {
				return _classes;
			}
		}

		this.style = function ($s, $v) {
			if ($v != undefined) {
				eval('this.div.style.' + $s + ' = "' + $v + '"');
				return this;
			}
			else {
				return eval('this.div.style.' + $s);
			}
		}
		
		this.index = function ($v) {
			if ($v != undefined) {
				_index = $v;
				this.div.style.zIndex = _index;
				return this;
			}
			else {
				return _index;
			}
		}
		
		this.buttonMode = function ($v) {
			if ($v != undefined) {
				_buttonMode = $v;
				this.style('cursor',_buttonMode ? 'pointer' : 'auto');
				return this;
			}
			else {
				return _buttonMode;
			}
		}
		
		this.mouseEnabled = function ($v) {
			if ($v != undefined) {
				_mouseEnabled = $v;
				this.style('pointerEvents', _mouseEnabled ? 'visible' : 'none');//<-- this does not work in IE....sadface
				return this;
			}
			else {
				return _mouseEnabled;
			}
		}
		
		this.mouseChildren = function ($v) {
			if ($v != undefined) {
				_mouseChildren = $v;
				for(var i = 0 ; i < _children.length ; i++) {
					_children[i].mouseEnabled(_mouseChildren);
				}
				return this;
			}
			else {
				return _mouseChildren;
			}
		}
		
		this.registrationPoint = function ($x, $y) {
			if ($x != undefined && $y != undefined) {
				_registrationPoint = {x:$x, y:$y};
				this.x(0);
				this.y(0);
				return this;
			}
			else {
				return _registrationPoint;
			}
		}
		
		this.position = function ($v) {
			if ($v != undefined) {
				_position = $v;
				this.div.style.position = _position;
				return this;
			}
			else {
				return _position;
			}
		}
		
		this.x = function ($v) {
			if ($v != undefined) {
				_x = $v - _registrationPoint.x;
				this.div.style.left = _x.toString() + 'px';
				return this;
			}
			else {
				return _x + _registrationPoint.x;
			}
		}
		
		this.y = function ($v) {
			if ($v != undefined) {
				_y = $v - _registrationPoint.y;
				this.div.style.top = _y.toString() + 'px';
				return this;
			}
			else {
				return _y + _registrationPoint.y;
			}
		}
		
		this.width = function ($v) {
			if ($v != undefined) {
				_width = $v;
				this.div.style.width = _width.toString() + 'px';
				return this;
			}
			else {
				var $actualWidth;
				if(this.div.style.overflow == 'hidden' || this.div.style.overflowX == 'hidden' || this.numChildren == 0) {
					$actualWidth = _width;
				}
				else {
					$actualWidth = _width;
					for(var i = 0 ; i < this.numChildren ; i++) {
						if(this.getChildAt(i).x() + this.getChildAt(i).width() > $actualWidth) {
							$actualWidth = this.getChildAt(i).x() + this.getChildAt(i).width();
						}
					}
				}
				if(this.div.style.paddingLeft != '')	$actualWidth += parseInt(this.div.style.paddingLeft);
				if(this.div.style.paddingRight != '')	$actualWidth += parseInt(this.div.style.paddingRight);
				return $actualWidth;
			}
		}
		
		this.height = function ($v) {
			if ($v != undefined) {
				_height = $v;
				this.div.style.height = _height.toString() + 'px';
				return this;
			}
			else {
				var $actualHeight;
				if(this.div.style.overflow == 'hidden' || this.div.style.overflowY == 'hidden' || this.numChildren == 0) {
					$actualHeight = _height;
				}
				else {
					$actualHeight = _height;
					for(var i = 0 ; i < this.numChildren ; i++) {
						if(this.getChildAt(i).y() + this.getChildAt(i).height() > $actualHeight) {
							$actualHeight = this.getChildAt(i).y() + this.getChildAt(i).height();
						}
					}
				}
				if(this.div.style.paddingTop != '')		$actualHeight += parseInt(this.div.style.paddingTop);
				if(this.div.style.paddingBottom != '')	$actualHeight += parseInt(this.div.style.paddingBottom);
				return $actualHeight;
			}
		}
		
		this.alpha = function ($v) {
			if ($v != undefined) {
				_alpha = $v;
				if (!jApp.IE7 && !jApp.IE8) {
					this.div.style.cssText += 'opacity:' + _alpha;
					this.div.style.cssText += 'filter: alpha(opacity='+ _alpha * 100 + ')';
					this.div.style.cssText += '-ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity='+ _alpha * 100 + ')"';
			  		this.div.style.cssText += 'filter: progid:DXImageTransform.Microsoft.Alpha(Opacity='+ _alpha * 100 + ')';
				}
				else {
					if(_alphaString) {
						var $fs = this.div.style.filter.toString();
						$fs = $fs.replace(_alphaString, '');
						this.div.style.filter = $fs;
					}
					_alphaString = 'Alpha(Opacity=' + _alpha * 100 + ')';
					this.div.style.filter += _alphaString;
				}
				
				return this;
			}
			else {
				return _alpha;
			}
		}
		
		this.rotation = function ($v) {
			if ($v != undefined) {
				_rotation = $v;
				if (!jApp.IE7 && !jApp.IE8) {
					this.div.style.cssText += '-moz-transform: rotate(' + _rotation + 'deg)';
					this.div.style.cssText += '-webkit-transform: rotate(' + _rotation + 'deg)';
					this.div.style.cssText += '-o-transform: rotate(' + _rotation + 'deg)';
					this.div.style.cssText += '-ms-transform: rotate(' + _rotation + 'deg)';
					this.div.style.cssText += 'transform: rotate(' + _rotation + 'deg)';
				}
				else {
					if(_rotationString) {
						var $fs = this.div.style.filter.toString();
						$fs = $fs.replace(_rotationString, '');
						this.div.style.filter = $fs;
					}
					var $cos = Math.cos(_rotation * jSprite.DegreesToRadians);
					var $sin = Math.sin(_rotation * jSprite.DegreesToRadians);
					_rotationString = "progid:DXImageTransform.Microsoft.Matrix(M11="+$cos+",M12="+(-$sin)+",M21="+$sin+",M22="+$cos+",SizingMethod='auto expand')";
					this.div.style.filter += _rotationString;
				}
				
				return this;
			}
			else {
				return _rotation;
			}
		}
		
		this.visible = function ($v) {
			if ($v != undefined) {
				_visible = $v;
				for(var d = 0 ; d < _children.length ; d++) {
					_children[d].style('display', _visible ? 'inherit' : 'none');
				}
				this.style('visiblity', _visible ? 'visible' : 'hidden');
				return this;
			}
			else {
				return _visible;
			}
		}

		this.tabEnabled = function ($v) {
			if ($v != undefined) {
				_tabEnabled = $v;
				this.div.tabIndex = -1;
				return this;
			}
			else {
				return _tabEnabled;
			}
		}

		this.tabIndex = function ($v) {
			if ($v != undefined) {
				_tabIndex = $v;
				this.div.tabIndex = _tabIndex;
				return this;
			}
			else {
				return _tabIndex;
			}
		}
		
		// Constructor Implementation
		//----------------------------------------------------------------------------------------------------------
		
		this.div = document.createElement('div');
		this.div.id = _id;
		if (_classes.length > 0) 	this.div.className = _classes;
		this.position(_position);

		window.jSprite.instanceCount++;
	}
	
})(window));