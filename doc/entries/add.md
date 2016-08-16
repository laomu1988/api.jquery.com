## .add()

* add( selector )
**selector** {[Selector](types.md?#Selector)} A string representing a selector expression to find additional elements to add to the set of matched elements.
* add( elements )
**elements** {[Element](types.md?#Element)} One or more elements to add to the set of matched elements.
* add( html )
**html** {[htmlString](types.md?#htmlString)} An HTML fragment to add to the set of matched elements.
* add( selection )
**selection** {[jQuery](types.md?#jQuery)} An existing jQuery object to add to the set of matched elements.
* add( selector, context )
**selector** {[Selector](types.md?#Selector)} A string representing a selector expression to find additional elements to add to the set of matched elements.
**context** {[Element](types.md?#Element)} The point in the document at which the selector should begin matching; similar to the context argument of the$(selector, context)method.
Create a new jQuery object with elements added to the set of matched elements.

<p>Given a jQuery object that represents a set of DOM elements, the
```
.add()
```
method constructs a new jQuery object from the union of those elements and the ones passed into the method. The argument to
```
.add()
```
can be pretty much anything that
```
$()
```
accepts, including a jQuery selector expression, references to DOM elements, or an HTML snippet.</p>
<p>Do not assume that this method appends the elements to the existing collection in the order they are passed to the
```
.add()
```
method. When all elements are members of the same document, the resulting collection from
```
.add()
```
will be sorted in document order; that is, in order of each element's appearance in the document. If the collection consists of elements from different documents or ones not in any document, the sort order is undefined. To create a jQuery object with elements in a well-defined order and without sorting overhead, use the
```
$(array_of_DOM_elements)
```
signature.</p>
<pre>
```
$( "p" ).add( "div" ).addClass( "widget" );
var pdiv = $( "p" ).add( "div" );
```
</pre>
<p>The following willsave the added elements, because the
```
.add()
```
method creates a new set and leaves the original set in pdiv unchanged:</p>
<pre>
```
var pdiv = $( "p" );
pdiv.add( "div" ); // WRONG, pdiv will not change
```
</pre>
<pre>
```
&lt;ul&gt;
  &lt;li&gt;list item 1&lt;/li&gt;
  &lt;li&gt;list item 2&lt;/li&gt;
  &lt;li&gt;list item 3&lt;/li&gt;
&lt;/ul&gt;
&lt;p&gt;a paragraph&lt;/p&gt;
```
</pre>
<p>We can select the list items and then the paragraph by using either a selector or a reference to the DOM element itself as the
```
.add()
```
method's argument:</p>
<pre>
```
$( "li" ).add( "p" ).css( "background-color", "red" );
```
</pre>
<pre>
```
$( "li" ).add( document.getElementsByTagName( "p" )[ 0 ] )
  .css( "background-color", "red" );
```
</pre>
<p>The result of this call is a red background behind all four elements.
Using an HTML snippet as the
```
.add()
```
method's argument (as in the third version), we can create additional elements on the fly and add those elements to the matched set of elements. Let's say, for example, that we want to alter the background of the list items along with a newly created paragraph:</p>
<pre>
```
$( "li" ).add( "&lt;p id='new'&gt;new paragraph&lt;/p&gt;" )
  .css( "background-color", "red" );
```
</pre>
<p>To reverse the
```
.add()
```
you can use<a>
```
.not( elements | selector )
```
</a>
to remove elements from the jQuery results, or<a>
```
.end()
```
</a>
to return to the selection before you added.</p>

<example>Finds all divs and makes a border.  Then adds all paragraphs to the jQuery object to set their backgrounds yellow.
```

$( "div" ).css( "border", "2px solid red" )
  .add( "p" )
  .css( "background", "yellow" );

```
</example>
<example>Adds more elements, matched by the given expression, to the set of matched elements.
```

$( "p" ).add( "span" ).css( "background", "yellow" );

```
</example>
<example>Adds more elements, created on the fly, to the set of matched elements.
```

$( "p" ).clone().add( "<span>Again</span>" ).appendTo( document.body );

```
</example>
<example>Adds one or more Elements to the set of matched elements.
```

$( "p" ).add( document.getElementById( "a" ) ).css( "background", "yellow" );

```
</example>
<example>Demonstrates how to add (or push) elements to an existing collection
```

var collection = $( "p" );
// Capture the new collection
collection = collection.add( document.getElementById( "a" ) );
collection.css( "background", "yellow" );

```
</example>
