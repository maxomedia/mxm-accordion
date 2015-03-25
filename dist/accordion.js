!function(t,n){"function"==typeof define&&define.amd?define(["jquery"],n):"object"==typeof exports?module.exports=n(require("jquery")):t.accordion=n(t.jQuery)}(this,function(t){var n,e,o,i,a,i,c,r={duration:300,easing:""};n=function(){var n=this;this.$content,this.$toggler,this.group,this.id,this.state,this.settings,this.updateState=function(){n.$content.attr("data-accordion-state",n.state),n.$toggler.attr("data-accordion-state",n.state),n.triggerEvents()},this.triggerEvents=function(){n.$content.trigger("accordion."+n.state),n.$toggler.trigger("accordion."+n.state)},this.open=function(e){e&&e.preventDefault();var o,i=a(n.$content.children());if(o=function(){n.state="open",n.updateState(),n.$content.css("height","")},n.group){var c=t('[data-accordion-group="{0}"]'.compose(n.group));c.each(function(n,e){var o=t(e).data("accordion");"closed"!==o.state&&o.close()})}n.state="opening",n.updateState(),"css"===d?(n.$content.css("height",i),n.$content.one(s,o)):"jquery"===d?n.$content.animate({height:i},n.settings.duration,n.settings.easing,o):o()},this.close=function(t){t&&t.preventDefault();var e,o=a(n.$content.children());e=function(){n.state="closed",n.$content.css("height",""),n.updateState()},n.$content.css("height",o),n.$content.outerHeight(),n.state="closing",n.updateState(),"css"===d?(n.$content.css("height",0),n.$content.one(s,e)):"jquery"===d?n.$content.animate({height:0},n.settings.duration,n.settings.easing,e):(n.$content.css("height",0),e())},this.toggle=function(t){"open"===n.state?n.close(t):n.open(t)},this.sync=function(){n.state=n.$content.attr("data-accordion-state"),n.state||(n.state="closed"),n.updateState()}},e=function(e){var o=t.extend({},r,e),i=t(this),a=i.data("accordion-content"),c=i.data("accordion-group"),s=t('[data-accordion-toggler="{0}"]'.compose(a)),d=t('[data-accordion-content="{0}"]'.compose(a));if(0!=d.length&&0!=s.length&&a){var u=new n;u.$content=d,u.$toggler=s,u.id=a,u.settings=o,u.group=c?c:void 0,u.sync(),i.data("accordion",u),s.data("accordion",u)}},o=function(){t(document).on("click","[data-accordion-toggler]",function(n){var o=t(n.currentTarget),i=o.data("accordion");if(!i){var a=o.data("accordion-toggler"),c='[data-accordion-content="{0}"]'.compose(a);e(0,t(c))}i.toggle(n)})},a=function(n){var e=0;return n.length<=0?e:(n.each(function(){var n=t(this);n.is(":visible")&&(e+=t(this).outerHeight(!0))}),e)},i=function(){return s?"css":"function"==typeof t.fn.animate?"jquery":"none"},c=function(){var t=document.createElement("bootstrap"),n={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd otransitionend",transition:"transitionend"};for(var e in n)if(void 0!==t.style[e])return n[e];return""},Array.prototype.isArray=!0,String.prototype.compose=function(t){var n=this,e=t.isArray?t:arguments;if(e.length>0)var o=e.length,i=/\{(\d+)\}/g,n=n.replace(i,function(t,n){return o>n?e[n]:t});return n};var s=c(),d=i();t.fn.extend({accordion:function(n){return this.each(function(){e.apply(t(this),[n])}),this}}),o()});