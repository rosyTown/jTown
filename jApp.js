/**
 * © Copyright 2012, Rosytown. All rights reserved.
 * @author Mark Rosendorff || www.rosytown.com.au
 */

((function(window) {

	window.jApp = jApp;
	
	jApp.IE7 = false;
	jApp.IE8 = false;
	jApp.iPad = false;
	jApp.iPhone = false;
	jApp.touchDevice = false;
	jApp.hasFlash = false;
	jApp.flashVersion = '';

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

	function jApp () {

		var getBrowserInfo = function () {
			var $appCodeName = navigator.appCodeName;
			var $appName = navigator.appName;
			var $appVersion = navigator.appVersion;
			var $cookieEnabled = navigator.cookieEnabled;
			var $platform = navigator.platform;
			var $userAgent = navigator.userAgent;
			
			return{appCodeName:$appCodeName, appName:$appName, appVersion:$appVersion, cookieEnabled:$cookieEnabled, platform:$platform, userAgent:$userAgent};
		}

		var getFlashInfo = function () {
			var $version;
			var $versionObj;
			var $installed = false;
			var $raw;
			var $major;
			var $minor;
			var $revision;
			var $revisionString;
			
			var $getActiveXVersion = function ($activeXObj) {
		        var $version = -1;
		        try{
		            $version = $activeXObj.GetVariable('$version');
		        }catch(err){}
		        return $version;
		    };
			
			var $getActiveXObject = function($name) {
		        var $obj = -1;
		        try{
		            $obj = new ActiveXObject($name);
		        }catch(err){
		            $obj = {activeXError:true};
		        }
		        return $obj;
		    };
			
			var $decodeStandardVersionString = function($s) {
		        var $a = $s.split(/ +/);
		        var $mms = $a[2].split(/\./);
		        var $rs = $a[3];
		        return {'raw':$s, 'major':parseInt($mms[0], 10), 'minor':parseInt($mms[1], 10), 'revision':function ($str) { return parseInt($str.replace(/[a-zA-Z]/g, ""), 10); }, 'revisionString':$rs};
		    };
			
			var $decodeActiveXVersionString = function($s) {
		        var $a = $s.split(',');
		        return {'raw':$s, 'major':parseInt($a[0].split(' ')[1], 10), 'minor':parseInt($a[1], 10), 'revision':parseInt($a[2], 10), 'revisionString':$a[2]};
		    };
			
			var $activeXDetection = [
		        {'name':'ShockwaveFlash.ShockwaveFlash.7', 'version':function ($obj) { return $getActiveXVersion($obj); }},
		        {'name':'ShockwaveFlash.ShockwaveFlash.6', 'version':function ($obj) {
						var $version = '6,0,21';
		                try{
		                    $obj.AllowScriptAccess = 'always';
		                    $version = $getActiveXVersion($obj);
		                }catch(err){}
		                return $version;
		            }
		        },
				{'name':'ShockwaveFlash.ShockwaveFlash', 'version':function ($obj) { return $getActiveXVersion($obj); }}
		    ];
			
			if(navigator.plugins && navigator.plugins.length > 0) {
				var $type = 'application/x-shockwave-flash';
				var $mimeTypes = navigator.mimeTypes;
					if($mimeTypes && $mimeTypes[$type] && $mimeTypes[$type].enabledPlugin && $mimeTypes[$type].enabledPlugin.description) {
					$version = $mimeTypes[$type].enabledPlugin.description;
					$versionObj = $decodeStandardVersionString($version);
					$installed = true;
					$raw = $versionObj.raw;
					$major = $versionObj.major;
					$minor = $versionObj.minor;
					$revisionString = $versionObj.revisionString;
					$revision = $versionObj.revision($revisionString);
				}
		    }
			else if(navigator.appVersion.indexOf("Mac") == -1 && window.execScript) {
				$version = -1;
				for(var i = 0 ; i < $activeXDetection.length && $version == -1 ; i++) {
					var $object = $getActiveXObject($activeXDetection[i].name);
					if(!$object.activeXError) {
						$installed = true;
						$version = $activeXDetection[i].version($object);
						if($version != -1) {
							$versionObj = $decodeActiveXVersionString($version);
							$raw = $versionObj.raw;
							$major = $versionObj.major;
							$minor = $versionObj.minor;
							$revisionString = $versionObj.revisionString;
							$revision = $versionObj.revision;
						}
					}
				}
		    }
			
			jApp.hasFlash = $installed;
			jApp.flashVersion = $major + '.' + $minor + '.' + $revision;
		}

		getFlashInfo();
		jApp.IE7 = new RegExp('MSIE 7').exec(navigator.userAgent) != null;
		jApp.IE8 = new RegExp('MSIE 8').exec(navigator.userAgent) != null;

		if(/iPad/i.test(getBrowserInfo().userAgent)) {
			jApp.iPad = true;
			jApp.touchDevice = true;
		}
		if(/iPhone/i.test(getBrowserInfo().userAgent)) {
			jApp.iPhone = true;
			jApp.touchDevice = true;
		}
		if(/Android/i.test(getBrowserInfo().userAgent)) {
			jApp.touchDevice = true;
		}
		if(/Mobile/i.test(getBrowserInfo().userAgent)) {
			jApp.touchDevice = true;
		}
	}

	jApp();

})(window));