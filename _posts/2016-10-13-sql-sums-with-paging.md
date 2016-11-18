---
title: "SQL sums with paging"
layout: post
---

## Background
This isn't obvious when you are having a hard-of-thinking day.

## The problem
In order to present bite size chunks of data to the user we often use
`LIMIT` and `OFFSET` clauses. (This might not be a terribly efficient
way of doing pagination if you have a large number of pages but that's a
whole different story). This makes it pretty easy to manage a large row
set as a sequence of pages.

So if I want the 3rd page of 20 from a query for customer orders I might
end up with a query like this one:

    SELECT id, order_number, created_on, price
    FROM orders
    WHERE customer_id = 123
    ORDER BY created_on, id
    LIMIT 20
    OFFSET 40;

Note that we need the `ORDER BY` clause here to ensure that the order is
deterministic, otherwise the same order could (theoretically at least)
appear on more than one page.

Separately we might want to work out the total spend for a given
customer. We'll do that with a `SUM` aggregate:

    SELECT SUM(price)
    FROM orders
    WHERE customer_id = 123

But what if you want to get the total spend for the current page rather
than all the pages?

## The solution

So if you are not thinking straight you might start by trying something
like:

    SELECT SUM(price)
    FROM orders
    WHERE customer_id = 123
    ORDER BY created_on, id
    LIMIT 20
    OFFSET 40;

It doesn't work, at least it doesn't return a per page total. The reason
being that `LIMIT` and `OFFSET` are applied the results of the whole
query. Now given that this query returns only one row (the sum value)
the `LIMIT` clause will have no effect but the `OFFSET` will mean that
we have an empty record set because there is no 11th row.

The solution is to perform a sub-query to get the page required and sum
the results in the outer query:

    SELECT SUM(page.price) FROM (
      SELECT price
      FROM orders
      WHERE customer_id = 123
      ORDER BY created_on, id
      LIMIT 20
      OFFSET 40
    ) AS page;
