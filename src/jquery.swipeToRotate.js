(function($) {
	
	$.fn.swipeToRotate = function(options) {
		
		// Default thresholds & swipe functions
		var defaults = {
			threshold: {
				x: 70
			},
			speed: 100,
			swipeLeft: $.noop(),
			swipeRight: $.noop()
		};
		
		//webkitTransitionEnd transitionend msTransitionEnd oTransitionEnd
	
		var options = $.extend(defaults, options);
	
		if (!this) return false;
	
		return this.each(function(i, elmnt) {
			// Private variables for each element
			var me = $(this).children('.box').first(),
				_this = this,
				val = 0,
				lasttouch = 0,
				startx = 0, 
				finalx = 0, 
				dir, 
				starty, 
				finaly,
				isTouch = false; //for mousedown
	
			// Screen touched, store the original coordinate
			function touchStart(e) {
				e.preventDefault();

				//x = 0;
				var touch = (e.touches ? e.touches[0] : e);
				startx = touch.clientX;
				starty = touch.clientY;

				isTouch = true;
			}
	
			// Store coordinates as finger is swiping
			function touchMove(e) {
				if(!isTouch) {return false;}
				e.preventDefault();	
				var touch = (e.touches ? e.touches[0] : e);
				
				finalx = touch.clientX; // Updated X,Y coordinates
				finaly = touch.clientY;
				
				//Finn retningen
				var lengthX = Math.abs(finalx - startx);
				if(lasttouch < finalx) {//sjekker om forrige pos er høyere eller lavere enn denne
					val += (lengthX/360)*Math.PI;
					dir = 1;
				} else if( lasttouch > finalx){
					val -= (lengthX/360)*Math.PI;
					dir = 0;
				}
				lasttouch = finalx; 
				me.css({'transform': 'rotateY('+val+'deg)', '-webkit-transform': 'rotateY('+val+'deg)'});
			}
	
			function touchEnd(e) {				
				//Må vite hvor mye den har rotert, lagre i datatag
				var rotated = parseInt(me.attr('data-rotated')) || 0;
				me.addClass('transitions');

				var length = Math.abs(finalx - startx);
				console.log(length);
				//sjekke om dratt langt nok
				if(length > options.threshold.x) {	
					if(dir === 1) {
						//rotated += 90;
						rotated = rotated+90;
					} else {
						//rotated -= 90;
						rotated = rotated-90;
					}
				} else if(length < options.threshold.x){
					rotated = rotated+0;
				}
					val = rotated;//brukes av touchmove for å huske posisjonen
					//console.log(rotated);
					me.css({'transform': 'rotateY('+rotated+'deg)', '-webkit-transform': 'rotateY('+rotated+'deg)'});
					
					me.attr('data-rotated', rotated);
					isTouch = false;

					finalx = startx = 0;
			}
	
			// Swipe was canceled
			/*
			function touchCancel(event) { 
				//care
			}
			*/
			

			// Add gestures to all swipable areas
			_this.addEventListener("touchstart", touchStart, false);
			_this.addEventListener("mousedown", touchStart, false);

			_this.addEventListener("touchmove", touchMove, false);
			window.addEventListener("mousemove", touchMove, false);

			_this.addEventListener("touchend", touchEnd, false);
			window.addEventListener("mouseup", touchEnd, false);

			//_this.addEventListener("touchcancel", touchCancel, false);
			//window.addEventListener("mouseup", touchCancel, false);
			//Sjekk etter transition end, støtte alle end-events
			_this.addEventListener('transitionend', function() {
				//buggy
				/*if(dir === 1) {
					options.swipeRight();
				} else if(dir === 0) {
					options.swipeLeft();
				}*/ 
				me.removeClass('transitions');
			}, false);
		});
	};
	
}(jQuery));