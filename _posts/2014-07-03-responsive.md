---
title: "Making this blog (a bit) responsive"
layout: post
---

So I tried opening this blog on my phone and it worked, but I couldn't
read the text without zooming in and scrolling left to right and back
again.

This is what I did to get it looking reasonable across the full range of
devices that I use (a phone, a tablet and a desktop computer). I am not
a designer or full-time front-end coder so this is going to be pretty
basic stuff.

## Viewports

I used Bootstrap as a CSS framework rather than writing everything from
scratch. Their documentation has some [handy advice about supporting
mobile devices](http://getbootstrap.com/css/#overview-mobile).

To start with they talk about adding the `meta` tag to your header. This
is typically used to set the size of the viewport - the area that
determines how content is laid out in a mobile browser.

Without a `meta viewport` declaration my blog was using the default
viewport which is 960px wide scaled down to fit the screen. Now that
doesn't work well because its effectively scaling the desktop design
down to a 4 inch screen. By declaring the viewport width to be the
device width you can avoid the scaling. So just this one small addition
to the site layouts makes a huge difference:

    <meta name="viewport" content="width=device-width, initial-scale=1">

You can also use this tag to disable zoom to stop your audience pinch
zooming your site.

## Media queries

So it turns out that Bootstrap does a pretty good job of laying out the
site once I set the `viewport` but there are a few things I'd like to
look a bit different on a mobile browser. For example, I might want the
default font size to be a bit smaller or larger on small screens.  Media
queries can help to solve this kind of problem. Basically a media query
is a wrapper around some CSS rules that come into effect when the host
browser meets some condition. A simple example would be a rule to make
the font smaller when the screen size is below a certain width:

    body {
      font: lighter 13pt 'Open Sans', 'Helvetica', sans-serif;
    }

    @media screen and (max-width: 768px) {
      body {
        font-size: 12pt;
      }
    }

## Bootstrap responsive CSS classes

Another thing that needs some attention is the side bar, it's just a
list of links, that gets dumped above the content in a mobile or tablet
browser because there is no space for it on the side. I'd like to hide
that until the user clicks on a link to reveal it. So I added a simple
plus icon to the header:

    <span class='visible-sm visible-xs glyphicon glyphicon-plus'></span>

Bootstrap has ready-made styles, like `visible-sm` and `visible-xs` used
here, to make sure that it is only shown on mobile and tablet size
screens.

Finally I needed a couple of lines of JavaScript to toggle the hidden
class on the sidebar. Rather than bring in the whole of jQuery for this
simple task I suppose I could have down this with framework-less
JavaScript, but I ended up dropping [Zepto](http://zeptojs.com/) into
the site, not a huge overhead at 9K minified.
