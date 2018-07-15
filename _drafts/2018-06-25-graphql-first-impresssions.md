---
title: "First impressions of GraphQL"
layout: post
---

## Background
It's not exactly cutting edge any longer but I've just started using
GraphQL and felt the urge to scribble down my first impressions, which
are fairly positive. I wonder if I will feel the same way a few months
from now.

## Type information is a good thing for an API
GraphQL introduces a concise and logical type system for APIs. Having a
self-describing API is generally a good thing and it's not incredibly
arduous to specify as a developer, in fact it just formalises some of
the thought processes that you would have to go through anyway as an API
developer.

Armed with some basic type information a GraphQL server can service all
kinds of different variations on the same kind of query. To a large
degree you can leave it to the client application to decide how much and
which data to fetch. The service developer no longer has to make those
impossible choices about whether to include this, that and the other
field just because somebody might need it one day and we won't be able
to go back and add it later.

It also means that versioning becomes less of an issue. Strictly
speaking every change in a RESTful API is a potential breaking change.
That's not the case with GraphQL because if the query the client sends
doesn't change then the response need not change either.

Documentation that you might have to partly hand-craft can be more
easily auto-generated when you have type information. I think that for
any serious documentation you would need to add some code examples but
the GraphQL schema covers a lot of the stuff that is very hard to keep
up to date if you are manually or semi-manually updating it.

## It smells a bit SOAPy
Several times when learning about how GraphQL services work I saw
parallels with SOAP Web services, not something I have happy memories of
to be honest. The most obvious parallel is that GraphQL services are
self-describing - they require type information. The problem with SOAP
was that this had to be done using a verbose and rather opaque XML
schema definition language. XML itself was bad enough with it's hard to
follow namespaces but the SOAP community missed no opportunity to layer
yet another kind of metadata on top of this already bloated format. Can
you tell I'm not a fan?

Another parallel is the idea that all GraphQL requests be routed through
a single HTTP endpoint using the HTTP `POST` verb. In other words, like
SOAP and unlike REST, GraphQL ignores the many features that HTTP
provides to build Web services upon. This makes some sense given that
GraphQL, as well as SOAP before it, aim to be transport protocol
independent. In other words not tied to HTTP. I like REST due to it's
simplicity and the way that it inherits it's conventions from HTTP.
Those conventions are straightforward and help guide a RESTful API
design to be consistent with other APIs. Time will tell about whether
GraphQL can find an equivalent set of conventions that achieve the same
kind of consistency.

## Conclusions
I've made peace with the aspects of GraphQL that stir up unpleasant
memories of SOAP. I'm now convinced that a Web API should include some
basic type information. GraphQL does that in a sane way that is so far
been a pleasure to use.
