# accordion

#### Prerequisites
- Modernizr ([minimal build](http://modernizr.com/download/#-csstransitions-shiv-cssclasses-prefixed-testprop-testallprops-domprefixes-load)) (Required for CSS3 transitions)
- jQuery (http://jquery.com/download/)

If the script does not find an instance of Modernizr on the page, the jQuery animation fallback will be used. Note the limitation in timing functions for jQuery animations. If you pass a timing function which jQuery does not support, jQuery will throw an error.

#### Use
Any element can have the attribute **data-accordion-toggler** and become the trigger for the accordion, which has the attribute **data-accordion-content**.
The attribute value is the id of the accordion. You can have multiple togglers or contents, that work synchronous.

Add the attributes to your HTML elements:
```html

<button data-accordion-toggler='sample'>Open/close</button>

<ul data-accordion-content='sample'>
  <li>Some content</li>
  <li>Some more</li>
  <li>Whatever</li>
</ul>

...

<script src="path/to/accordion.js"></script>
<script>

  // Start the accordion script with the options
  var options = {
  
    // How are you gonna name the different states?
    // These values will be written to the data-accordion-state attribute
    states: {
      open: 'open',
      opening: 'opening',
      closed: 'closed',
      closing: 'closing'
    },
    
    // Settings for specific accordions on the page
    // Object key is the accordion id
    accordions: {
      /*DEFAULT: {
        duration: 300,
        easing: ''
      }*/
      sample: {
        duration: 500, // Animation duration in milliseconds
        easing: 'linear', // The easing function
      }
    }
  }
  
  // Initialize
  accordion(options);
</script>
```
Of course, you should store the script code in a separate file.

**Flickering/FOUC (flash of unstyled content):**
The script injects styles for accordion content as soon as possible, but normally the content display before these styles take effect.
To counteract this, you can include the following lines in your CSS file/s: 
```css
[data-accordion-content] {
	overflow: hidden;
	height: 0;
}
[data-accordion-state="open"] {
	height: auto;
}
```
The **data-accordion-state** attribute gets mirrored from the content to the toggler, so you can use to style e.g. arrows differently if `data-accordion-state="open"`.
If you want the accordion to be opened on page load, add the data-accordion-state='open' attribute on the content container.

#### Demo
http://codepen.io/tuelsch/full/yyoKVp/
