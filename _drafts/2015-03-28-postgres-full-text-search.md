---
title: "PostgreSQL Full Text Search"
layout: post
---

PostgreSQL has had full text search for a few releases now but until
recently I hadn't used it in a project. Previously, I'd always worked
with Lucene based indexing tools (ElasticSearch and Solr). So how does
it compare?

## The basics

PostgreSQL introduces two new datatypes to support full text search,
`tsvector` which represents a text document that can be searched for and
`tsquery` which represents something you want to search for.

### tsvector

You can use `tsvector` to transform text into something searchable. It's
easy enough to explore what it does using the `to_tsvector` function:

    psql> select to_tsvector('The cats were sitting on the mats');
    ┌─────────────────────────┐
    │       to_tsvector       │
    ├─────────────────────────┤
    │ 'cat':2 'mat':7 'sit':4 │
    └─────────────────────────┘
    (1 row)

So as you can see a `tsvector` stores a list of word stems or *lexemes*
together with their position in the document. You can also see that
various stop words like *and* and *the* are ignored, they don't help
much with search matching.

A document is a logical piece of text that you might want to search for.
For example, if you have an e-commerce system your users are likely to
want to search for products that you sell by entering a short text
query. So you need to transform the text that you store for each product
into a document containing everything that the user is likely to search
by.

A document doesn't generally map to a database table or column because
the text for each document may need to be extracted from multiple tables
and columns. For example, for a product it's reasonable for a user to
expect to be able to search by manufacturer or publisher name, some kind
of product code like an ISBN, the model number or name or by the name of
one of the categories that it is grouped under. So the full text for a
product might be represented by the following query:

    SELECT products.id,
      products.title || ' ' || manufacturers.name || ' ' || products.code as document
    FROM products
    INNER JOIN manafacturers ON manufacturers.id = products.manufacturer.id;

Next step is to map the product text into a tsvector so that it can be
searched:

    SELECT products.id,
      to_tsvector(products.title || ' ' || manufacturers.name || ' ' || products.code as document)
    FROM products
    INNER JOIN manafacturers ON manufacturers.id = products.manufacturer.id;

There is a bit more work to do here but we need to first look at
`tsquery`.

### tsquery

So far we've *indexed* some documents using `to_tsvector` but we haven't
tried to do any full text queries or matches.

PostgreSQL provides the `tsquery` type to represent a search expression.
You can convert a string to a `tsquery` using `to_tsquery`:

    psql> select to_tsquery('cat');

    ┌────────────┐
    │ to_tsquery │
    ├────────────┤
    │ 'cat'      │
    └────────────┘
    (1 row)

You can use the following operators to build up a search expression:

* `&` - AND
* `|` - OR
* `!` - NOT

So for example `(dog | hound) & !cat` will match a document containing
*dog* or *hound* unless it also contains *cat*.

Searches are performed using regular SQL `SELECT` statements by putting
a condition into the `WHERE` clause that compares a `tsvector` to a
`tsquery` using the `@@` operator. You can experiment with these
conditions:

    psql> select to_tsvector('rabbits and dogs') @@ to_tsquery('(dog | hound) & !cat') as "match?";
    ┌────────┐
    │ match? │
    ├────────┤
    │ t      │
    └────────┘
    (1 row)

    psql> select to_tsvector('cats and dogs') @@ to_tsquery('(dog | hound) & !cat') as "match?";
    ┌────────┐
    │ match? │
    ├────────┤
    │ f      │
    └────────┘
    (1 row)

Continuing the more realistic example from above, the following query
will search for all products that have *cake* in their searchable text:

    SELECT products.id, products.title
    FROM products
    INNER JOIN manafacturers ON manufacturers.id = products.manufacturer.id;
    WHERE to_tsvector(products.title || ' ' || manufacturers.name ||
      ' ' || products.code as document) @@ to_tsquery('cake');

This query is fairly messy and won't be very fast so we still have work
to do.

## Views

Building `tsvector`s from scratch each time is fairly cumbersome and not
at all efficient. Typically the 'schema' for you search documents is
fixed so it makes sense to create a materialised view to contain the
search documents so that they can be queried more easily.


## Indexing


## Other search features


## Ruby APIs


## Pros and cons

There are a few advantages to having your database take care of search
rather than use a specialised text indexing system.

If you already have a database then using it for search means one less
moving part in your overall system architecture. So it will save you
some effort configuring a separate system and perhaps save you running
costs if you would otherwise have to pay for a hosted search service.

Another benefit is that as a developer you probably already know SQL so
once you take the trouble to learn the basics about `tsquery` and `tsvector`
you should be pretty comfortable working with your search data.

The cons are that PostgreSQL is still a little behind ElasticSearch and
Lucene in terms of features and tune-ability.
