/**
 * Accordion/expander functionality supporting CSS transitions,
 * jQuery fallback or no animation at all.
 * @author Philipp Gfeller, Maxomedia AG
 * @param  {Object} root    Application root, like window in browser environments
 * @param  {Object} factory jQuery instance, imported with available
 *                          module loader (CommonJS, AMD, globals).
 * @return {undefined}
 */
(function (root, factory) {

    // Universal Module Definition
    // https://github.com/umdjs/umd
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

    /**
     * The default options and at the same time the
     * minimum of needed options set
     * @type {Object}
     */
    var DEFAULT = {
        duration: 300,
        easing: ''
    };

    var Accordion;
    var initialize;
    var bindEvents;
    var createStyleTag;
    var getAnimationType;
    var getHeights;
    var getAnimationType;
    var getTransitionEnd;

    /**
     * Constructor for the accordion object.
     * It will be accessible at $(element).data('accordion')
     */
    Accordion = function () {

        var acc = this;

        this.$content;
        this.$toggler;
        this.group;
        this.id;
        this.state;
        this.settings;

        /**
         * Update the state attributes on content and toggler.
         * Additionally trigger a state change on both elements
         * @return {undefined}
         */
        this.updateState = function () {
            acc.$content.attr('data-accordion-state', acc.state);
            acc.$toggler.attr('data-accordion-state', acc.state);
            acc.triggerEvents();
        };

        /**
         * Trigger events reflecting the current
         * state on the toggler and content
         * @return {undefined}
         */
        this.triggerEvents = function () {
            acc.$content.trigger('accordion.' + acc.state);
            acc.$toggler.trigger('accordion.' + acc.state);
        };

        /**
         * Open the accordion
         * @param  {Object} e Event object, optional
         * @return {undefined}
         */
        this.open = function (e) {
            if (e) e.preventDefault();

            // Open the accordion
            var callback;
            var height = getHeights(acc.$content.children());

            /**
             * Callback function to be executed after the animation
             * @return {undefined}
             */
            callback = function () {
                acc.state = 'open';
                acc.updateState();
                acc.$content.css('height', '');

            }

            // If this accordion is part of a group,
            // close other open tabs
            if (acc.group) {
                var $tabs = $('[data-accordion-group="{0}"]'.compose(acc.group));
                $tabs.each(function (index, element) {
                    var accordion = $(element).data('accordion');
                    if (accordion.state !== 'closed') accordion.close();
                });
            }

            // Perform adequate animation
            acc.state = 'opening';
            acc.updateState();

            if (animationType === 'css') {
                acc.$content.css('height', height);
                acc.$content.one(transitionEnd, callback);
            } else if (animationType === 'jquery') {
                $content.animate(
                    { height: height },
                    acc.settings.duration,
                    acc.settings.easing,
                    callback
                );
            } else {
                callback();
            }
        };

        /**
         * Close the accordion
         * @param  {Object} e Event object, optional
         * @return {undefined}
         */
        this.close = function (e) {
            if (e) e.preventDefault();

            // Close the accordion
            var callback;
            var height = getHeights(acc.$content.children());

            callback = function () {
                acc.state = 'closed';
                acc.$content.css('height', '');
                acc.updateState();
            }

            // Set initial state
            acc.$content.css('height', height);
            acc.$content.outerHeight();
            acc.state = 'closing';
            acc.updateState();

            // Perform adequate animation
            if (animationType === 'css') {
                acc.$content.css('height', 0);
                acc.$content.one(transitionEnd, callback);
            } else if (animationType === 'jquery') {
                acc.$content.animate(
                    {height: 0},
                    acc.settings.duration,
                    acc.settings.easing,
                    callback
                );
            } else {
                acc.$content.css('height', 0);
                callback();
            }
        }

        /**
         * Toggle the accordion
         * @param  {Object} e Event object
         * @return {undefined}
         */
        this.toggle = function (e) {
            if (acc.state === 'open') {
                acc.close(e);
            } else {
                acc.open(e);
            }
        }

        /**
         * Sync content state to toggler
         * @return {undefined}
         */
        this.sync = function () {
            acc.state = acc.$content.attr('data-accordion-state');
            if (!acc.state) acc.state = 'closed';
            acc.updateState();
        }
    }

    /**
     * Initialize each accordion for itself
     * @param  {Object} userOptions Options for jQuery animation
     * @return {undefined}
     */
    initialize = function (userOptions) {

        // Merge options
        var options = $.extend({}, DEFAULT, userOptions);

        // The content element is the base of every expander
        var $content = $(this);
        var id = $content.data('accordion-content');
        var group = $content.data('accordion-group');
        var $toggler = $('[data-accordion-toggler="{0}"]'.compose(id));

        // Abort if one of the above has a non expected value
        if ($content.length == 0) return;
        if ($toggler.length == 0) return;
        if (!id) return;

        // Init the accordion object
        var accordion = new Accordion();
        accordion.$content = $content;
        accordion.$toggler = $toggler;
        accordion.id = id;
        accordion.settings = options;
        accordion.group = (group) ? group : undefined; // Group is optional

        // Sync content state to toggler
        accordion.sync();

        // Save object reference on element for later use
        $content.data('accordion', accordion);
        $toggler.data('accordion', accordion);
        

    };

    /**
     * Live binding of toggler events
     * @return {undefined}
     */
    bindEvents = function () {

        // Bind the click events
        $(document).on('click', '[data-accordion-toggler]', function (e) {

            // Get the accordion instance
            var $target = $(e.currentTarget);
            var accordion = $target.data('accordion');

            // If the target has not been initialized, initialize it
            if (!accordion) {
                var id = $target.data('accordion-toggler');
                var selector = '[data-accordion-content="{0}"]'.compose(id);
                initialize(0, $(selector));
            }

            // Trigger the toggle
            accordion.toggle(e);
        });
    }

    /**
     * Get the sum of heigts of all passed, visible elements
     * @param  {Object} $elements Set of jQuery elements
     * @return {Number}           Height of all elements
     */
    getHeights = function ($elements) {

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

    /**
     * Decide on what animation strategy to use
     * @return {String} Animation strategy
     */
    getAnimationType = function () {
        if (transitionEnd) {
            return 'css';
        } else {
            return (typeof $.fn.animate === 'function') ? 'jquery' : 'none';
        }
    }

    /**
     * Detect transition support and get transitionend string
     * @return {String} Transitionend String or '' if not supported
     */
    getTransitionEnd = function () {
        // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
        // http://stackoverflow.com/questions/2794148/css3-transition-events
        var el = document.createElement('bootstrap')

        var transEndEventNames = {
            'WebkitTransition' : 'webkitTransitionEnd',
            'MozTransition'    : 'transitionend',
            'OTransition'      : 'oTransitionEnd otransitionend',
            'transition'       : 'transitionend'
        }

        for (var name in transEndEventNames) {
            if (el.style[name] !== undefined) {
                return transEndEventNames[name];
            }
        }

        return ''; // explicit for ie8 (  ._.)
    }

    /**
     * Replace placeholders in a string (like "{0}".compose('that'))
     * @param  {Array} d        You can pass an array or a comma separated list of parameters
     * @return {String}         Composed string
     */
    Array.prototype.isArray=true;String.prototype.compose=function(d){var f=this;var b=(d.isArray)?d:arguments;if(b.length>0){var c=b.length;var e=/\{(\d+)\}/g;var f=f.replace(e,function(g,a,h){if(a<c){return b[a]}else{return g}})}return f};

    // Set caches for heavily used, never changing properties
    var transitionEnd = getTransitionEnd();
    var animationType = getAnimationType();


    $.fn.extend({
        /**
         * Extend jQuery with the accordion function, to
         * initialize the accordion functionality on a
         * set of jQuery elements.
         * @param {Object} options The options for this set of accordions
         * @return {Object}          Original set of jQuery elements
         */
        accordion: function (options) {
            this.each(function () {
                initialize.apply($(this), [options]);
            });

            return this;
        }
    });

    // Bind events (live binding)
    bindEvents();
}));
