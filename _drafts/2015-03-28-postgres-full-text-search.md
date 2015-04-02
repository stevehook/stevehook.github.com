---
title: "PostgreSQL Full Text Search"
layout: post
---

PostgreSQL has had full text search for a few releases now but until
recently I hadn't used it in a project. Previously, I'd always worked
with Lucene based indexing tools (ElasticSearch and Solr). So how does
it compare?

##The basics

PostgreSQL introduces two new datatypes to support full text search,
`tsvector` which represents a text document that can be searched for and
`tsquery` which represents something you want to search for.

###tsvector

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

...

###tsquery

So far we've indexed some documents using `to_tsvector` but we haven't
tried to do any full text queries or matches.




