---
title: "Using SQL EXCEPT instead of sub-queries"
layout: post
---

In the ongoing series 'things your ORM cannot do but SQL can' a quick
look at the EXCEPT keyword.

## Subqueries

If you like to break problems down into manageable chunks of logic then
SQL sub-queries can be quite appealing, supposing we want to find all
the 'active' users that placed an order in the past month (maybe we want
to say 'thanks'):

    SELECT users.email FROM users where users.state NOT IN ('inactive', 'unsubscribed')
    WHERE users.email IN (
      SELECT DISTINCT users.email
      FROM orders
        JOIN users ON users.id = orders.user_id
      WHERE orders.created_at > (NOW() - interval '1 month')
    )

So that works but it's not very elegant from a SQL point of view.


    SELECT users.email FROM users where users.state NOT IN ('inactive', 'unsubscribed')
    WHERE users.email NOT IN (
      SELECT DISTINCT users.email
      FROM orders
        JOIN users ON users.id = orders.user_id
      WHERE orders.created_at > (NOW() - interval '1 month')
    )

    SELECT users.email FROM users where users.state NOT IN ('inactive', 'unsubscribed')
    EXCEPT
    SELECT DISTINCT users.email
    FROM orders
      JOIN users ON users.id = orders.user_id
    WHERE orders.created_at > (NOW() - interval '1 month');

