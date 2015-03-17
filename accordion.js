// UMD: Universal module definition
// https://github.com/umdjs/umd/blob/master/returnExports.js

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(require('jquery'));
    } else {
        // Browser globals (root is window)
        root.accordion = factory(root.jQuery);
    }
}(this, function ($) {

	var DEFAULT = {
		states: {
			open: 'open',
			closed: 'closed',
			opening: 'opening',
			closing: 'closing'
		},
		accordions: { DEFAULT: { duration: 300, easing: '' } }
	};
    
	function initialize(userOptions){

		// Convenience variables
		var ac = 'data-accordion-content';
		var at = 'data-accordion-toggler';
		var as = 'data-accordion-state';
		var transitionend = getTransitionEndString();
		var animationType = getAnimationType();
		
		// Merge options recursively
		var opt = $.extend(true, {}, DEFAULT, userOptions);
		var $contents = $('[data-accordion-content]');

		// Inject styles into page
		injectStyles(opt, $contents);

		// Sync states
		syncStates( $contents );

		// Bind event and handler
		$('[data-accordion-toggler]').on('click', toggle);

		function getAnimationType() {
			if (Modernizr && Modernizr.csstransitions) {
				return 'css';
			} else {
				if (typeof $.fn.animate === 'function') {
					return 'jquery';
				} else {
					return 'none';
				}
			}
		}

		function injectStyles(opt, $contents) {

			var rule = [
				'<style type="text/css">',
					'[data-accordion-content]',
					'{',
						'height: 0;',
						'overflow: hidden;',
					'}',
					'[data-accordion-state="', opt.states.open, '"] {',
						'height: auto;',
					'}'
			];
			if (animationType === 'css') {

				// Default style
				var def = '[data-accordion-state="{1}"], [data-accordion-state="{2}"]{{0}}';
				var defopt = opt.accordions.DEFAULT;
				var spec = '[data-accordion-content="{0}"][data-accordion-state="{2}"], [data-accordion-content="{0}"][data-accordion-state="{3}"]{{1}}';
				var stack = [
					'-webkit-transition: height {0}ms {1};',
					'-moz-transition: height {0}ms {1};',
					'-ms-transition: height {0}ms {1};',
					'-o-transition: height {0}ms {1};',
					'transition: height {0}ms {1};'
				].join('');

				// Push default styles
				rule.push(def.compose(stack.compose(defopt.duration, defopt.easing),  opt.states.opening, opt.states.closing));

				// Loop through spec styles
				$contents.each(function () {
					var $e = $(this);
					var id = $e.attr(ac);
					var specopt = opt.accordions[id];
					if (specopt) {
						specopt = $.extend({}, defopt, specopt);
						rule.push(spec.compose(id, stack.compose(specopt.duration, specopt.easing), opt.states.opening, opt.states.closing));
					}
				});
			}
			rule.push('</style>');
			$('head').append(rule.join(''));
		}

		function syncStates ($contents) {
			$contents.each(function () {
				var $e = $(this);
				var id = $e.attr(ac);
				var state = $e.attr(as);
				if (!state || state == '') state = opt.states.closed;
				$('[data-accordion-toggler="' + id + '"]').attr(as, state);			
			});
		}

		function toggle(e){

			e.preventDefault();

			var $target = $(e.currentTarget);
			var id = $target.attr(at);
			var specopt = $.extend({}, opt.accordions.DEFAULT, opt.accordions[id]);

			// Abort if no id
			if (!id || id == '') {
				console.log('Found unnamed accordion: ', $target, 'Please give it a name.');
				return;
			}

			var $content = $('[data-accordion-content="' + id + '"]');

			// Abort if there are no children
			if($content.length <= 0) { return false; }

			var state = $content.attr(as);

			if(state !== opt.states.open){

				// Open
				// For initial transition, set height
				var height = getHeights($content.children());

				var animationComplete = function () {
					$content.attr(as, opt.states.open);
					$target.attr(as, opt.states.open);
					$content.css({height: 'auto'});
					$content.triggerHandler('accordion.' + opt.states.open);
				}

				// Set initial states
				$content.css({'height': 0});
				$content.attr(as, opt.states.opening);
				$target.attr(as, opt.states.opening);
				$content.triggerHandler('accordion.' + opt.states.opening);

				if (animationType === 'css') {

					// CSS animations
					$content.css({'height': height});
					$content.one(transitionend, function () {
						$content.off(transitionend);
						animationComplete();
					});

				} else if (animationType === 'jquery') {

					// Jquery animations
					$content.animate(
						{'height': height},
						specopt.duration,
						specopt.easing,
						animationComplete
					);

				} else {

					// No animations
					animationComplete();
				}

			} else {

				// Close
				// For initial transition, set height with inline styles
				// to auto
				var height = getHeights($content.children());
				var animationComplete = function () {
					$content.attr(as, opt.states.closed);
					$target.attr(as, opt.states.closed);
					$content.triggerHandler('accordion.' + opt.states.closed);
				}

				// Initial state
				$content.css({'height': height});
				$content.outerHeight(); // Force webkit browsers to redraw, no need to store the variable
				$content.attr(as, opt.states.closing);
				$target.attr(as, opt.states.closing);
				$content.triggerHandler('accordion.' + opt.states.closing);

				if (animationType === 'css') {

					$content.css({height: 0});
					$content.on(transitionend, function () {
						$content.off(transitionend);
						animationComplete();
					});

				} else if (animationType === 'jquery') {

					$content.animate(
						{'height': 0},
						specopt.duration,
						specopt.easing,
						animationComplete
					);
				} else {
					$content.css({height: 0});
					animationComplete();
				}
			}
		}

		// Get calculated height of all elements
		function getHeights ($elements) {

			var height = 0;

			if ($elements.length <= 0) return height;

			$elements.each(function (index, element) {
				var $this = $(this);
				if ($this.is(':visible')) {
					height += $(this).outerHeight(true);
				}
			});

			return height;
		};
	}

	// Helper functions:
	// Get prefixed transitionend string
	function getTransitionEndString() {
		if (window.Modernizr) {
			var transEndEventNames = {
			    'WebkitTransition' : 'webkitTransitionEnd',// Saf 6, Android Browser
			    'MozTransition'    : 'transitionend',      // only for FF < 15
			    'transition'       : 'transitionend'       // IE10, Opera, Chrome, FF 15+, Saf 7+
			};
			return transEndEventNames[ window.Modernizr.prefixed('transition') ];
		}
	}

	// String helper
	Array.prototype.isArray=true;String.prototype.compose=function(d){var f=this;var b=(d.isArray)?d:arguments;if(b.length>0){var c=b.length;var e=/\{(\d+)\}/g;var f=f.replace(e,function(g,a,h){if(a<c){return b[a]}else{return g}})}return f};

    return initialize;
}));
