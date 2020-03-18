Title: Anatomy of HTML, CSS, and JavaScript
Date: 2019-12-03 10:20
Slug: anatomy-of-HTML-CSS-JavaScript
Authors: Monadical Team

## Anatomy of HTML

![](https://clearlydecoded.com/assets/images/posts/2017-09-04-anatomy-of-html-tag/html-tag-attributes.png)

An HTML document is a tree of HTML **elements** in a hierarchy.  An HTML code file is made up of **tags** with content inside of them, which together describe the layout of the final rendered page the user sees in their browser.
```html
<tag-name attribute-name="attribute-value1 attribute-value2 ..." ...>
    tag content
    ...
</tag-name>
...
```

### HTML Elements

"**Element**"" is generally used to decribe one rendered component of a page, for example a picture, a shaded rectangle, or a paragraph of text. A **tag** refers to the code used to generate that element.  The distinction is not super important, but it's handy to keep in mind that **elements** are things you see in the browser, and **tags** are things you see in your code editor that become the things in the browser when viewed.


### HTML Tags

An HTML **tag** is written in HTML syntax using three parts:

e.g. `<div>...children...</div>`

1. the **opening tag** = `<div>`
2. the **`...children...`** = can contain more child tags, or text, etc.
3.  the **closing tag** = `</div>`

*Some examples of tags:*

`<html>...</html>`, `<body>...</body>`, `<div>...</div>`, `<span>...</span>`

#### Self Closing tags

Some tags are called **self-closing tags**, these tags do not need a closing tag because they don't have any child content.

*Some examples of self-closing tags:*

``<img src="example.jpg"/>``, or `<br/>` for linebreak, and `<hr/>` for "horizontal line", etc.

You can usually distinguish self-closing tags by checking for the `/` at the end, like`<tag-name/>`, though some people don't follow this convention so it's not a 100% rule.

---

## Anatomy of CSS

![](https://learnwebcode.com/wp-content/uploads/2010/02/anatomy-of-a-css-rule.gif)

### CSS Rules

CSS consists of **rules**. A CSS **rule** is made up of a **selector** and a list of **styles** aka **properties** to apply to the elements that the selector matches.

```css
tagname {
    property-name: property value;
    ...
}

.class-name {
    ...
}
```

#### CSS Selectors

Examples of some CSS selectors:

 - select all the elements with a certain tag name, e.g. `h1`, `body`, or `div`:
    `h1 { ... }`, `body { ... }`, `div { ... }`
    
 - select all the elements with a certain class name, e.g. `featured-image`:
    `.featured-image { ... }`

The **selector** specifically refers to the `[h1]` part of the rule.  Selectors "select" which elements you want to style, and you can create more complex selectors that use multiple class names and tag names to find specific elements on the page and apply some styles;

e.g. This selector will match all `<small>` elements that are inside of an `h1` tag that has the `header-text` class on it.
```css
h1.header-text small {
    font-size: 14px;
}
```
Which would match the inner `<small>` element here, and the "Some subtext" inside would be displayed with a `14px` font size.
```html
<h1 class="header-text">
    Some header text...<br/>
    <small>Some subtext</small>
</h1>
```


#### CSS Properties

Once you've selected some elements to style, you can apply **properties** that describe which styles you want to change.

E.g. if we wanted to make out entire document use a specific font, we could do:

```css
body {
    font-family: Helvetica sans-serif;
}
```

##### CSS Property Names

In this example `font-family` is the **property name**, and `Helvetica sans-serif` is the **property value**.

Some examples of **property names**:
`font-size`, `width`, `display`, `white-space`, `opacity`, `text-align`

##### CSS Property Values

Some examples of **property values:**:
`20px`, `30vw`, `1.5em`, `10%`, `200`, `'Gill Sans' Helvetica sans-serif`

You'll notice that these property values can have different **units**.

##### CSS Property Units

Here are some examples of acceptable **CSS units**:

 - `px`: pixels
 - `%`: percentage of parent's value
 - `vw`: percentage of entire screen's width (`100vw` = `100%` of screen width)
 - `vh`: percentage of entire screen's height
 - `cm`: centimeters
 - `in`: inches
 - `em`: scale factor of inherited default font size (`1.1em` = 1.1x default font size, e.g. `1.1em` when the default is `14px` would be `15.4px`)
 - no unit: not all css values need units, e.g. `font-weight` or `opacity` can be `400` or `0.1` respectively


---

## Further Resources

This is a fantastic, in-depth guide to learn the whole process of web development:
https://btholt.github.io/intro-to-web-dev-v2/

---