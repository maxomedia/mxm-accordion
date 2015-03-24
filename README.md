# mxm-accordion

An accordion jQuery plugin which is very flexible. It supports tab groups or simple expander functionality, multiple togglers/content containers, emits events on opening, open, closing and closed and uses CSS3 transitions with a jQuery fallback or no animations.

### Prerequisites
- jQuery (http://jquery.com/download/)


### Demo
http://codepen.io/tuelsch/full/yyoKVp/

### Use
Any element can have the attribute `<button data-accordion-toggler="test">Toggle</button>` and become the trigger for the accordion, which has the attribute `<div data-accordion-content="test">...</div>`.
The attribute value is the id of the accordion. You can have multiple togglers or contents.

Optionally, you can group a set of accordions by adding **data-accordion-group** to the accordion elements you want grouped.

The elements need not have a common parent or follow a certain HTML structure. Events are live bound, so you can add an accordion after page load.

See **index.html** for an example usage.

```HTML
<head>
  <link href="path/to/accordion.css" rel="stylesheet"/>
</head>
<body>
  <button data-accordion-toggler="test">Toggle</button>
  
  <div data-accordion-content="test">
    <ul>
      <li>Lorem ipsum</li>
      <li>Lorem ipsum</li>
      <li>Lorem ipsum</li>
      <li>Lorem ipsum</li>
      <li>Lorem ipsum</li>
    </ul>
  </div>
  
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

The **data-accordion-state** attribute gets mirrored from the content to the toggler, so you can use it to style arrows.
If you want the accordion to be opened on page load, add the data-accordion-state='open' attribute on the content container.

```CSS
[data-accordion-toggler]:after {
  content: 'arrow';
  transition: transform 300ms;
}
[data-accordion-toggler][data-accordion-state^="open"]:after {
  transform: scaleY(-1);
}
```

## Options
These options only apply to the jQuery fallback.

Property | Type | Default | Value
:--------|:-----|:--------|:-----
**duration** | Number | 300 | Duration in milliseconds of the animation if the jQuery fallback is applied. See section below to find out how to change duration with CSS transitions.
**easing** | String | "swing" | Easing used if the jQuery fallback is applied. For a list of supported strings see: http://api.jquery.com/animate/

To change duration or the easing function of the CSS3 transition set `.accordion{ transition-duration: 500ms; transition-timing-function: cubic-bezier(0.1, 0.7, 1.0, 0.1); }` on the `data-accordion-content` with a class selector or higher. **Do not alter the transition property directly**, it only applies to the states "opening" and "closing". If the transition is set permanently on the object, there is a bug on IOS where the animation is jumping.

## Events
Bind your events to the `data-accordion-toggler` or the `data-accordion-content`, both elements are triggering the same event.

Event name | Description
:----------|:-----------
opening | Is triggered when the toggler is clicked and the accordion starts to animate.
open | Is triggered once the animation is complete or immediately if there is no animation.
closing | Is triggered when the accordion starts to close.
closed |  Is triggered when the closing animation has finished or immediately if there is no animation.



