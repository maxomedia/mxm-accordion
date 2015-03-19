# accordion

#### Prerequisites
- jQuery (http://jquery.com/download/)

#### Use
Any element can have the attribute **data-accordion-toggler** and become the trigger for the accordion, which has the attribute **data-accordion-content**.
The attribute value is the id of the accordion. You can have multiple togglers or contents, that work synchronous.

Optionally, you can group a set of accordions by adding **data-accordion-group** to the accordion elements you want grouped.

See **index.html** for an example usage.

```
<link href="path/to/accordion.css" rel="stylesheet"/>
<script src="path/to/accordion.js"></script>
<script>

  // Start the accordion script with the options
  var options = {
    duration: 300, // Animation duration in milliseconds
    easing: 'linear', // The easing function
  }
  
  // Initialize
  $('[data-accordion-content]').accordion(options);
</script>
```

The **data-accordion-state** attribute gets mirrored from the content to the toggler, so you can use to style e.g. arrows differently if `data-accordion-state="open"`.
If you want the accordion to be opened on page load, add the data-accordion-state='open' attribute on the content container.

#### Demo
http://codepen.io/tuelsch/full/yyoKVp/
