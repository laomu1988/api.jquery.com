# Attribute

        <p>The CSS specification allows elements to be identified by their attributes. While not supported by some older browsers for the purpose of styling documents, jQuery allows you to employ them regardless of the browser being used.</p>
        <p>When using any of the following attribute selectors, you should account for attributes that have multiple, space-separated values. Since these selectors see attribute values as a single string, this selector, for example, <code>$("a[rel='nofollow']")</code>, will select <code>&lt;a href="example.html" rel="nofollow"&gt;Some text&lt;/a&gt;</code> but not <code>&lt;a href="example.html" rel="nofollow foe"&gt;Some text&lt;/a&gt;</code>.</p>
        <p>Attribute values in selector expressions <b>must</b> follow the rules for W3C CSS selectors; in general, that means anything other than a <a href="https://www.w3.org/TR/CSS21/syndata.html#value-def-identifier">valid identifier</a> should be surrounded by quotation marks.</p>
        <ul>
          <li>double quotes inside single quotes: <code>$('a[rel="nofollow self"]')</code></li>
          <li>single quotes inside double quotes: <code>$("a[rel='nofollow self']")</code></li>
          <li>escaped single quotes inside single quotes: <code>$('a[rel=\'nofollow self\']')</code></li>
          <li>escaped double quotes inside double quotes: <code>$("a[rel=\"nofollow self\"]")</code></li>
        </ul>
        <p>The variation you choose is generally a matter of style or convenience.</p>

        <p><strong>Note</strong>: In jQuery 1.3 <code>[@attr]</code> style selectors were removed (they were previously deprecated in jQuery 1.2). Simply remove the "@" symbol from your selectors in order to make them work again.</p>
        