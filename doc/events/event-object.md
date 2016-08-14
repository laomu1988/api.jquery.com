
        <p>jQuery's event system normalizes the event object according to <a href="https://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html">W3C standards</a>. The event object is guaranteed to be passed to the event handler. Most properties from the original event are copied over and normalized to the new event object.</p>
        <div class="longdesc">
          <h4>jQuery.Event Constructor</h4>
          <p>The <code>jQuery.Event</code> constructor is exposed and can be used when calling <a href="/trigger">trigger</a>. The <code>new</code> operator is optional.</p>
          <p>Check <a href="/trigger">trigger</a>'s documentation to see how to combine it with your own event object.</p>
          <p>Example:</p>
          <pre><code>
//Create a new jQuery.Event object without the "new" operator.
var e = jQuery.Event( "click" );

// trigger an artificial click event
jQuery( "body" ).trigger( e );
</code></pre>
          <p>As of jQuery 1.6, you can also pass an object to <code>jQuery.Event()</code> and its properties will be set on the newly created Event object.</p>
          <p>Example:</p>
          <pre><code>
// Create a new jQuery.Event object with specified event properties.
var e = jQuery.Event( "keydown", { keyCode: 64 } );

// trigger an artificial keydown event with keyCode 64
jQuery( "body" ).trigger( e );
</code></pre>
          <h4>Common Event Properties</h4>
          <p>jQuery normalizes the following properties for cross-browser consistency:</p>
          <ul>
            <li>
              <code>target</code>
            </li>
            <li>
              <code>relatedTarget</code>
            </li>
            <li>
              <code>pageX</code>
            </li>
            <li>
              <code>pageY</code>
            </li>
            <li>
              <code>which</code>
            </li>
            <li>
              <code>metaKey</code>
            </li>
          </ul>
          <p>The following properties are also copied to the event object, though some of their values may be undefined depending on the event:</p>
          <p>altKey, bubbles, button, buttons, cancelable, char, charCode, clientX, clientY, ctrlKey, currentTarget, data, detail, eventPhase, key, keyCode, metaKey, offsetX, offsetY, originalTarget, pageX, pageY, relatedTarget, screenX, screenY, shiftKey, target, toElement, view, which</p>
          <h4>Other Properties</h4>
          <p>To access event properties not listed above, use the <code>event.originalEvent</code> object:</p>
          <pre><code>
// Access the `dataTransfer` property from the `drop` event which
// holds the files dropped into the browser window.
var files = event.originalEvent.dataTransfer.files;
</code></pre>
        </div>
      