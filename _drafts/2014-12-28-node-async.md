---
title: "Learning Node.js async"
layout: post
---


##Too many callbacks

Asynchronous I/O is the core strength of Node but there is a cost for
the programmer. First you have to get your head around the asynchronous
coding style and adopt the common patterns. Having done that you will
come up against situations that lead to callback hell so you'll then
need to find ways to stop you code turning into a mess of nested
functions.

###Getting into the async mindset

Most of the database APIs I have worked with have been synchronous. In
other words the method doesn't return until it has round-tripped to the
database and pulled back whatever results we asked for. So in
Ruby/ActiveRecord:

    orders = Order.where(user_id: current_user.id)
    orders.each do |order|
      puts order
    end
    puts 'done!!!'

The `where` method returns an `orders` query and the query is actually
executed when we call `each` on it, synchronously, so we wait for the
result before this program can continue. It's a simple programming model
because things happen in a linear fashion, call a method, it returns a
result and proceed to the next line. All that goes out the window with
Node (for good reason). So with Node/Sequelize:

    db.Order.findAll({ where: { userId: currentUser.id } }).then(function(order) {
      console.log(order);
    });
    console.log('done?');

Run this and `done?` will be output before any of the orders have been
processed because `findAll` is an asynchronous method and we need to
pass it a callback that will be called *at some time in the future*,
once for each order returned from the database. So there is no waiting
for the database query to return, we can get on with something else,
like processing another user's request.

When you start using Node it is easy to forget that most methods that do
anything significant are asynchronous. Things are made a little more
confusing because some APIs offer a synchronous alternative that it's
tempting to use (don't). Persevere though and async coding will start to
feel natural after a short time and often it really doesn't cause any
problem other than having to type `function(...) {...}` a lot more than
seems natural. But you will come across situations in which 

###Common patterns

###When you need things to happen in order

###When you have too many things to do in order


