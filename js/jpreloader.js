/*
* jPreLoader - jQuery plugin
* Create a Loading Screen to preload images and content for you website
*
* Name:			jPreLoader.js
* Author:		Kenny Ooi - http://www.inwebson.com
* Date:			July 11, 2012		
* Version:		2.1
* Example:		http://www.inwebson.com/demo/jpreloader-v2/
* Updated by:   tremendo agency (April 30, 2020) 
*
*/

(function($) {
	var items = new Array(),
		errors = new Array(),
		onComplete = function() {},
		welcome = function() {},
		current = 0;
	
	var jpreOptions = {
		splashVPos: '35%',
		loaderVPos: '75%',
		splashID: '#jpreContent',
		showSplash: false,
		showPercentage: true,
		autoClose: true,
		closeBtnText: '',
		onetimeLoad: false,
		debugMode: false,
		splashFunction: function() {}
	}
	
	//cookie
	var getCookie = function() {
		if( jpreOptions.onetimeLoad ) {
			var cookies = document.cookie.split('; ');
			for (var i = 0, parts; (parts = cookies[i] && cookies[i].split('=')); i++) {
				if ((parts.shift()) === "jpreLoader") {
					return (parts.join('='));
				}
			}
			return false;
		} else {
			return false;
		}
		
	}
	var setCookie = function(expires) {
		if( jpreOptions.onetimeLoad ) {
			var exdate = new Date();
			exdate.setDate( exdate.getDate() + expires );
			var c_value = ((expires==null) ? "" : "expires=" + exdate.toUTCString());
			document.cookie="jpreLoader=loaded; " + c_value;
		}
	}
	
	//create jpreLoader UI
	var createContainer = function() {
		
		jOverlay = $('<div></div>')
		.attr('id', 'jpreOverlay')
		.css({
			position: "fixed",
			top: 0,
			left: 0,
			width: '100%',
			height: '100%',
			zIndex: 9999999
		})
		.appendTo('body');
		
		if(jpreOptions.showSplash) {
			jContent = $('<div></div>')
			.attr('id', 'jpreSlide')
			.appendTo(jOverlay);
			
			var conWidth = $(window).width() - $(jContent).width();
			$(jContent).css({
				position: "absolute",
				//top: jpreOptions.splashVPos,
				//left: Math.round((50 / $(window).width()) * conWidth) + '%'
			});
			$(jContent).html($(jpreOptions.splashID).wrap('<div/>').parent().html());
			$(jpreOptions.splashID).remove();
			jpreOptions.splashFunction()			
		}
		
		jLoader = $('<div></div>')
		.attr('id', 'jpreLoader')
		.attr('class', 'v-center')
		.appendTo(jOverlay);
		
		var posWidth = $(window).width() - $(jLoader).width();
		$(jLoader).css({
			position: 'absolute',
			//top: jpreOptions.loaderVPos,
			//left: Math.round((50 / $(window).width()) * posWidth) + '%'
		});
		
		jBar = $('<div></div>')
		.attr('id', 'jpreBar')
		.css({
			width: '100%',
			height: '0'
		})
		.appendTo(jLoader);
		
		if(jpreOptions.showPercentage) {
			jBox = $('<div></div>')
			.attr('id', 'jpreBox')
			.css({
				position: 'relative',
			})
			.appendTo(jLoader)
			jPer = $('<div></div>')
			.attr('id', 'jprePercentage')
			.css({
				position: 'relative',
			})
			.appendTo(jBox)
			.html('0%');
		}
		if( !jpreOptions.autoclose ) {
			jButton = $('<div></div>')
			.attr('id', 'jpreButton')
			.on('click', function() {
				loadComplete();
			})
			.css({
				position: 'relative',
				height: '100%'
			})
			.appendTo(jLoader)
			.text(jpreOptions.closeBtnText)
			.hide();
		}
	}
	
	//get all images from css and <img> tag
	var getImages = function(element) {
		$(element).find('*:not(script)').each(function() {
			var url = "";

			if ($(this).css('background-image').indexOf('none') == -1 && $(this).css('background-image').indexOf('-gradient') == -1) {
				url = $(this).css('background-image');
				if(url.indexOf('url') != -1) {
					var temp = url.match(/url\((.*?)\)/);
					url = temp[1].replace(/\"/g, '');
				}
			} else if ($(this).get(0).nodeName.toLowerCase() == 'img' && typeof($(this).attr('src')) != 'undefined') {
				url = $(this).attr('src');
			}
			
			if (url.length > 0) {
				items.push(url);
			}
		});
	}
	
	//create preloaded image
	var preloading = function() {
		for (var i = 0; i < items.length; i++) {
			if(loadImg(items[i]));
		}
	}
	var loadImg = function(url) {
		var imgLoad = new Image();
		$(imgLoad)
		.on("load",(function(){
			completeLoading();
		}))
		.on( "error", (function() {
			errors.push($(this).attr('src'));
			completeLoading();
		}))
		.attr('src', url);
	}
	
	//update progress bar once image loaded
	var completeLoading = function() {
		current++;

		var per = Math.round((current / items.length) * 100);
		$(jBar).stop().animate({
			height: per + '%'
		}, 500, 'linear');
		
		if(jpreOptions.showPercentage) {
			$(jPer).text(per+"%");
		}
		
		//if all images loaded
		if(current >= items.length) {
			current = items.length;
			setCookie();	//create cookie
			
			if(jpreOptions.showPercentage) {
				$(jPer).text("100%");
			}
			
			//fire debug mode
			if (jpreOptions.debugMode) {
				var error = debug();
			}
			
			
			//max progress bar
			$(jBar).stop().animate({
				height: '100%'
			}, 500, 'linear', function() {
				//autoclose on
				if( jpreOptions.autoClose ){
					loadComplete();
				}
				else{
					//$(jButton).fadeIn(1000);
				}
			});	
		}	
	}
	
	//triggered when all images are loaded
	var loadComplete = function() {
		$(jPer).css({'top':'-100%','-moz-transition':'top 0.5s ease-in','-webkit-transition':'top 0.5s ease-in','transition':'top 0.5s ease-in'});
		setTimeout(function() {
			$(jPer).css({'opacity': '0','top': '100%','-moz-transition':'top 0s linear','-webkit-transition':'top 0s linear','transition':'top 0s linear'});
			$(jPer).html('hola!');
			setTimeout(function() {
				$(jPer).css({'opacity': '1','top':'0','-moz-transition':'top 0.5s ease-in','-webkit-transition':'top 0.5s ease-in','transition':'top 0.5s ease-in'});
				setTimeout(function() {
					$(jPer).css({'top':'-100%','-moz-transition':'top 0.5s ease-in','-webkit-transition':'top 0.5s ease-in','transition':'top 0.5s ease-in'});
					setTimeout(function() {
						$(jOverlay).slideUp(1200, function() {
							$(jOverlay).remove();
							onComplete();	//callback function
						});
					}, 500);
				}, 1000);
			}, 750);
		}, 500);
			
			//$(jPer).css({'top': '100%'});
			//$(jPer).html('hola!');
			//$(jPer).animate({"top":'0'}, 800, function(){
				//$(jPer).animate({"top":'-100%'}, 800, function() {
					//$(jOverlay).slideUp(1200, function() {
					//	$(jOverlay).remove();
					//	onComplete();	//callback function
					//});
				//});
			//});
		
	}
	
	//debug mode
	var debug = function() {
		if(errors.length > 0) {
			var str = 'ERROR - IMAGE FILES MISSING!!!\n\r'
			str	+= errors.length + ' image files cound not be found. \n\r';	
			str += 'Please check your image paths and filenames:\n\r';
			for (var i = 0; i < errors.length; i++) {
				str += '- ' + errors[i] + '\n\r';
			}
			return true;
		} else {
			return false;
		}
	}
	
	$.fn.jpreLoader = function(options, callback) {
        if(options) {
            $.extend(jpreOptions, options );
        }
		if(typeof callback == 'function') {
			onComplete = callback;
		}
		
		//show preloader once JS loaded
		$('body').css({
			'display': 'block'
		});
		
		return this.each(function() {
			if( !(getCookie()) ) {
				createContainer();
				getImages(this);
				preloading();
			}
			else {	//onetime load / cookie is set
				$(jpreOptions.splashID).remove();
				onComplete();
			}
		});
    };

})(jQuery);