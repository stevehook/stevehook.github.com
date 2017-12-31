---
title: "Postgres queries - Beyond SELECT * FROM ..."
layout: post
---

## Background

Relational databases have a rich language for extracting and
manipulating the data that they contain. If you limit yourself to what
your ORM (object-relational mapping library) can do then you are missing
out.

### NoSQL is not replacing SQL

NoSQL databases have been around for a while now but SQL databases are
still going strong. It all depends on the use case. If you need a fast
key-value store then Redis is great. But if you want a store for regular
business data, robust transactional integrity and a rich query language
then Postgres works for me more often than not.

I could use MongoDB more, I like having a schemaless database and I
quite like the way it forces me to think about distinguishing between
composition and association relationships. As a developer it saves me
time, but I have less confidence in it keeping my data safe in
production. I'm sure it can be done, just that I havn't the experience
to set it up properly myself.

### Most systems don't need to support multiple relational databases

If you pick the right RDBMS at the start of a project it's unlikely that
you'll need to change it at any time during it's lifetime.  Unless you
are building a tool that has to work with multiple database platforms,
pick one (Postgres) and stick with it. Adopting a very limited SQL
vocabulary just so that developers can use SQLLite if they fancy it
isn't a good trade-off.

### RDBMS and SQL are worth learning

From a professional point of view it's often hard to justify spending a
lot of time honing your skills in a particular technology. That's not
being lazy, just practical - there are too many to choose from and only
so many hours in the day and we are a fickle business, who wants to
spend their weekends learning last years shiny new thing?

Since I started programming, one technology that has been ever present
is the relational database. Stuff I learnt about SQL over a decade ago
is still very useful. Stuff I learnt about certain JavaScript front-end
libraries less than two years ago is now pretty much useless - it was a
good mental exercise but the detail I memorised soon became a waste of
brain space.

### ORMs stop you using your RDBMS to it's full potential

I like ORMs, they make my job much easier at times, I've even built a
couple but they are abstractions, very leaky abstractions. Great for
perhaps 80-90% of your data access needs but they don't allow you to
construct queries that get the most out of a decent database.

They also stop you learning your database. If you limit yourself to
whatever queries your ORM can build for you then are missing out on some
great stuff. You can always use an ORM for the vanilla data access but
don't be afraid to side-step it entirely if you need to manipulate data
in an unusual way.

It's nearly always a good thing to have a database do the heavy lifting
for you. Do it to avoid loading a load of model objects via your ORM and
then filtering, sorting and aggregating their data in memory.

## An example - Common table expressions or WITH queries

Let's look at an example of a database feature that most ORMs don't
readily expose, but I found very useful recently.

We'll start with some simple data, the classic order - order item schema:

    # SELECT * FROM orders;
    ┌────┬─────────────┬─────────────────────┬─────────────────────┐
    │ id │ customer_id │     created_at      │     updated_at      │
    ├────┼─────────────┼─────────────────────┼─────────────────────┤
    │  1 │         101 │ 2017-10-01 00:00:00 │ 2017-10-01 00:00:00 │
    │  2 │         102 │ 2017-10-02 00:00:00 │ 2017-10-02 00:00:00 │
    │  3 │         103 │ 2017-10-03 00:00:00 │ 2017-10-03 00:00:00 │
    └────┴─────────────┴─────────────────────┴─────────────────────┘
    (3 rows)

    # SELECT * FROM order_items;
    ┌────┬──────────┬────────┐
    │ id │ order_id │ price  │
    ├────┼──────────┼────────┤
    │  1 │        1 │ 125.00 │
    │  2 │        1 │ 150.00 │
    │  3 │        1 │ 250.00 │
    │  4 │        2 │  55.00 │
    │  5 │        2 │  35.00 │
    │  6 │        2 │  65.00 │
    │  7 │        2 │  20.00 │
    │  8 │        3 │  90.00 │
    │  9 │        3 │  80.00 │
    │ 10 │        3 │ 105.00 │
    │ 11 │        3 │ 135.00 │
    │ 12 │        3 │ 125.00 │
    └────┴──────────┴────────┘
    (12 rows)

Now suppose we want to get the average price of the most expensive item
in each order, the second most expensive, third and so on.

First step is to rank each order item by price within it's order. We can
do this in Postgres with a window function, specifically `RANK` as
follows:

    # SELECT *,
      RANK() OVER (PARTITION BY order_items.order_id ORDER BY order_items.price DESC) AS rank
    FROM order_items;

    ┌────┬──────────┬────────┬──────┐
    │ id │ order_id │ price  │ rank │
    ├────┼──────────┼────────┼──────┤
    │  3 │        1 │ 250.00 │    1 │
    │  2 │        1 │ 150.00 │    2 │
    │  1 │        1 │ 125.00 │    3 │
    │  6 │        2 │  65.00 │    1 │
    │  4 │        2 │  55.00 │    2 │
    │  5 │        2 │  35.00 │    3 │
    │  7 │        2 │  20.00 │    4 │
    │ 11 │        3 │ 135.00 │    1 │
    │ 12 │        3 │ 125.00 │    2 │
    │ 10 │        3 │ 105.00 │    3 │
    │  8 │        3 │  90.00 │    4 │
    │  9 │        3 │  80.00 │    5 │
    └────┴──────────┴────────┴──────┘
    (12 rows)

So can we now GROUP by our rank to get the answer we are looking for?

    # SELECT AVG(price),
      RANK() OVER (PARTITION BY order_items.order_id ORDER BY order_items.price DESC) AS rank
    FROM order_items
    GROUP BY rank;

    ERROR:  window functions are not allowed in GROUP BY

No you can't. It turns out grouping by the output of a window function
is not allowed (which to be honest seems reasonable). So this is where a
`WITH` query becomes really useful. We can declare a `WITH` query
containing the rank and then feed query it as a normal table allowing us
to group the way we need to:

    WITH ranked_order_items AS (
      SELECT
        price,
        order_id,
        RANK() OVER (PARTITION BY order_items.order_id ORDER BY order_items.price DESC) AS rank
      FROM order_items
    )
    SELECT
      rank,
      AVG(price)
    FROM ranked_order_items
    GROUP BY rank
    ORDER BY rank;

    ┌──────┬──────────────────────┐
    │ rank │         avg          │
    ├──────┼──────────────────────┤
    │    1 │ 150.0000000000000000 │
    │    2 │ 110.0000000000000000 │
    │    3 │  88.3333333333333333 │
    │    4 │  55.0000000000000000 │
    │    5 │  80.0000000000000000 │
    └──────┴──────────────────────┘
    (5 rows)

Now we have the results we were looking for.

`WITH` queries or common table expressions are useful for getting around
limitations like these - they can also be used to define recursive
queries. You may also choose to use the when you simply want to break up
a large query into more manageable parts.

### References:

[Postgres documentation](https://www.postgresql.org/docs/9.6/static/queries-with.html)
