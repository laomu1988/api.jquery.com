## .add()

Create a new jQuery object with elements added to the set of matched elements.

* add( selector )
    - **selector** {[Selector](types.md?#Selector)} A string representing a selector expression to find additional elements to add to the set of matched elements.


* add( elements )
    - **elements** {[Element](types.md?#Element)} One or more elements to add to the set of matched elements.


* add( html )
    - **html** {[htmlString](types.md?#htmlString)} An HTML fragment to add to the set of matched elements.


* add( selection )
    - **selection** {[jQuery](types.md?#jQuery)} An existing jQuery object to add to the set of matched elements.


* add( selector, context )
    - **selector** {[Selector](types.md?#Selector)} A string representing a selector expression to find additional elements to add to the set of matched elements.

    - **context** {[Element](types.md?#Element)} The point in the document at which the selector should begin matching; similar to the context argument of the$(selector, context)method.




<p>Given a jQuery object that represents a set of DOM elements, the<code>.add()</code>method constructs a new jQuery object from the union of those elements and the ones passed into the method. The argument to<code>.add()</code>can be pretty much anything that<code>$()</code>accepts, including a jQuery selector expression, references to DOM elements, or an HTML snippet.</p>
<p>Do not assume that this method appends the elements to the existing collection in the order they are passed to the<code>.add()</code>method. When all elements are members of the same document, the resulting collection from<code>.add()</code>will be sorted in document order; that is, in order of each element's appearance in the document. If the collection consists of elements from different documents or ones not in any document, the sort order is undefined. To create a jQuery object with elements in a well-defined order and without sorting overhead, use the<code>$(array_of_DOM_elements)</code>signature.</p>
<pre><code>$( "p" ).add( "div" ).addClass( "widget" );
var pdiv = $( "p" ).add( "div" );</code></pre>
<p>The following willsave the added elements, because the<code>.add()</code>method creates a new set and leaves the original set in pdiv unchanged:</p>
<pre><code>var pdiv = $( "p" );
pdiv.add( "div" ); // WRONG, pdiv will not change</code></pre>
<pre><code>&lt;ul&gt;
  &lt;li&gt;list item 1&lt;/li&gt;
  &lt;li&gt;list item 2&lt;/li&gt;
  &lt;li&gt;list item 3&lt;/li&gt;
&lt;/ul&gt;
&lt;p&gt;a paragraph&lt;/p&gt;</code></pre>
<p>We can select the list items and then the paragraph by using either a selector or a reference to the DOM element itself as the<code>.add()</code>method's argument:</p>
<pre><code>$( "li" ).add( "p" ).css( "background-color", "red" );</code></pre>
<pre><code>$( "li" ).add( document.getElementsByTagName( "p" )[ 0 ] )
  .css( "background-color", "red" );</code></pre>
<p>The result of this call is a red background behind all four elements.
Using an HTML snippet as the<code>.add()</code>method's argument (as in the third version), we can create additional elements on the fly and add those elements to the matched set of elements. Let's say, for example, that we want to alter the background of the list items along with a newly created paragraph:</p>
<pre><code>$( "li" ).add( "&lt;p id='new'&gt;new paragraph&lt;/p&gt;" )
  .css( "background-color", "red" );</code></pre>
<p>To reverse the<code>.add()</code>you can use<a><code>.not( elements | selector )</code></a>
to remove elements from the jQuery results, or<a><code>.end()</code></a>
to return to the selection before you added.</p>

<example>Finds all divs and makes a border.  Then adds all paragraphs to the jQuery object to set their backgrounds yellow.
<code>
$( "div" ).css( "border", "2px solid red" )
  .add( "p" )
  .css( "background", "yellow" );
</code></example>
<example>Adds more elements, matched by the given expression, to the set of matched elements.
<code>
$( "p" ).add( "span" ).css( "background", "yellow" );
</code></example>
<example>Adds more elements, created on the fly, to the set of matched elements.
<code>
$( "p" ).clone().add( "<span>Again</span>" ).appendTo( document.body );
</code></example>
<example>Adds one or more Elements to the set of matched elements.
<code>
$( "p" ).add( document.getElementById( "a" ) ).css( "background", "yellow" );
</code></example>
<example>Demonstrates how to add (or push) elements to an existing collection
<code>
var collection = $( "p" );
// Capture the new collection
collection = collection.add( document.getElementById( "a" ) );
collection.css( "background", "yellow" );
</code></example>
