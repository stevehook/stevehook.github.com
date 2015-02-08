---
title: "Learning Node.js async"
layout: post
---

Writing asynchronous code is one of the biggest challenges for a
newcomer to Node.js.

##Too many callbacks?

Asynchronous I/O is the core strength of Node but it does make life
harder for the programmer. First you have to get your head around the
asynchronous coding style and adopt the common patterns. Having done
that you will come up against situations that lead to so-called callback
hell and you'll then need to find ways to stop you code turning into a
mess of nested functions.

##Getting into the async mindset

Writing code that reads from or writes to a database is second nature
for most developers. Most of the database APIs I have worked with have
been synchronous. In other words the method doesn't return until it has
round-tripped to the database and pulled back whatever results we asked
for. So in Ruby/ActiveRecord:

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
Node. So with Node.js (and the node-orm2 library):

    Order.find({ userId: currentUser.id }, function(err, orders) {
      _.forEach(orders, function(order) {
        console.log(order);
      });
    });
    console.log('done?');

Run this and `done?` will be output before any of the orders have been
processed because `find` is an asynchronous method and we need to
pass it a callback that will be called *at some time in the future*,
when the orders have been returned from the database. So there is no
waiting for the database query to return, we can get on with something
else, like processing another user's request.

When you start using Node it is easy to forget that most methods that do
anything significant are asynchronous. Things are made a little more
confusing because some APIs offer a synchronous alternative that it's
tempting to use (don't). Persevere though and async coding will start to
feel natural after a short time and often it really doesn't cause any
problem other than having to type `function(...) {...}` a lot.


##Common patterns

The APIs built-into Node.js all use a common callback pattern for
asynchronous methods. However many third-party modules use a promises
rather than direct callbacks. We need learn both approaches.


###Node.js callbacks

The 'standard' callback is a function that takes two parameters
`callback(err, result)`. The first argument to the callback function is
an error and the second the result of the call (whatever that might be).
So for example the `fs` (file system) module has a method for listing
the files in a given directory `readdir`:

    var fs = require('fs');
    fs.readdir('.', function(err, files) {
      if (err) {
        console.log(err);
      } else {
        console.log(files);
      }
    });

All being well this code will print out a list of files in the current
directory. If there was an error, say because you pass in a non-existent
directory the callback will receive a non-null `err` and no `files`.

With simple callbacks you will run into situations sooner or later in
which you experience so-called 'callback hell', when code becomes a mess
of nested callbacks, and starts to resemble fallen xmas tree. This
happens when you need to call more than two or three asynchronous
methods in sequence (the second depends on the result of the first and
so on).

For example, suppose you want to read a value from a file, use that
value to do a database query and then write the results of that query to
a different file. With a made up API, it might look something like this:

    fs = require('fs')
    fs.readFile('userIdFile', 'utf8', function(err, fileContents) {
      if (err) {
        return console.log(err);
      }
      Database.exec('SELECT count(*) from ORDERS WHERE user_id = :0', [fileContents], function(err, count) {
        if (err) {
          return console.log(err);
        }
        fs.writeFile('countFile', count.toString(), function(err, result) {
          if (err) {
            return console.log(err);
          }
          console.log('done');
        });
      });
    });

###Promises

Promises are objects that an asynchronous method returns to represent a
value that may be available in the future but isn't yet. They are an
alternative to the Node.js standard callback pattern and can make it
a little easier to write asynchronous code. Its best to use an example,
so using Bookshelf, a promise-based ORM, if we want to perform the
orders for a given user query shown above:

    new Order({ userId: currentUser.id }).fetchAll()
      .then(function(orders) {
        _.forEach(orders, function(order) {
          console.log(order);
        });
      });

So far we haven't gained much, we've just moved the callback into the
arguments to the `then` method.

Promises become more useful when you chain them together for more
complicated asynchronous tasks. The other advantage of Promises is that
they help to consolidate error handling code. Here is the same task
as the previous example coded against a fictional promise-based API:

    fs = require('fs')
    fs.readFile('userIdFile', 'utf8')
      .then(function(fileContents) {
        return Database.exec('SELECT count(*) from ORDERS WHERE user_id = :0', [fileContents]);
      })
      .then(function(count) {
        return fs.writeFile('countFile', count.toString());
      })
      .then(function() {
        console.log('done');
      })
      .catch(function(err) {
        console.log(err);
      });
    });

What is happening here is that the `readFile` method returns a promise
and we are chaining two additional asynchronous operations onto it. The
callback attached to the first `then` will get called after the
`readFile` succeeds in reading the contents of the file. This callback
then returns another promise representing the result of the database
query. The final step runs on the callback to the second `then` method
call returning another promise and when that succeeds we output 'done'.

The callback passed to the `catch` method call will be called if there
is an error *at any stage*, which makes error-handling a lot tidier than
in the original code.

There is a lot more to promises than this simple example illustrates.
They were included as part of Node.js in the very early days but then
removed, perhaps because they was no consensus on the finer details and
terminology and therefore Node.js could provide better inter-operability
between different modules by leaving promises and other tools for
managing callbacks in userland outside the core.

###async.js



