---
title: "Immutable Notes"
layout: post
---

## Background
Immutable data structures and some of the libraries that depend on them
(I've been using Redux lately) can make state management easier to
reason about. Native JavaScript data structures are inherently mutable
so if you use them you need to be very careful not to change something
you shouldn't.

The Immutable library provides alternative data structures that obey the
rules. You just need to spend a little time getting familiar with the
new programming interface. Then you can stop worrying about mutable
state.

## Basics
Immutable provides several different data structures, the most
commonly used ones (in my code) are `Map` and `List`. `Iterable` is also
worth getting to know.

## To and from native JS
We can easily convert from native data structures with
`Immutable.fromJS` and back the other way with `toJS` the function that
all Immutable collections implement. e.g.

    import Immutable from 'immutable';
    let map = Immutable.fromJS({ foo: 'Foo', bar: ['bar', 'baz'] });
    // -> Map { "foo": "Foo", "bar": List [ "bar", "baz" ] }

    map.toJS();
    // -> { foo: 'Foo', bar: [ 'bar', 'baz' ] }

Note that these functions deeply convert to and from Immutable
structures so you don't have to worry about how deeply nested your data
structures are.

## Getting and setting properties
JavaScript objects and arrays have built in syntax for accessing and
setting items in the collections. e.g.

    let fooValue = someObject.foo; // or someObject['foo'];

For Immutable collections we fall back to regular JavaScript functions
so if we want to `get` or `set` items on a map:

    let map = Immutable.Map({ foo: 'foo' });
    map.get('foo');
    // -> 'foo'

    map.set('foo', 'bar');
    // -> Map { "foo": "bar" }

Of course `set` returns a brand new object, that's the whole point. The
original map is as it was:

    map.get('foo');
    // -> 'foo'

With deeper collections we can simplify things with the `setIn` and
`getIn` functions:

    let map = Immutable.fromJS({ foo: { bar: 'bar' } });

So there is no need to write

    map.get('foo').get('bar');
    // -> 'bar'

when you can do:

    map.getIn(['foo', 'bar']);
    // -> 'bar'

and it's easier to handle missing values, `map.get('boo').get('bar')`
goes bang but:

    map.getIn(['boo', 'bar']);
    // -> undefined

`setIn` works pretty much as you'd expect, filling out map with the
necessary nested structures:

    map.setIn(['boo', 'bar'], 'bar');
    // -> Map { "foo": Map { "bar": "bar" }, "boo": Map { "bar": "bar" } }

With lists these methods use 0 based indexes, just list `list[]` would
for a native JavaScript list.

    let list = Immutable.fromJS(['bob', 'alice']);
    // -> List [ "bob", "alice" ]

    list.get(1);
    // -> 'alice'

    list.set(0, 'jim');
    // -> List [ "jim", "alice" ]

Again Immutable does it's best to fill in the gaps:

    list.set(4, 'jim')
    // -> List [ "bob", "alice", undefined, undefined, "jim" ]

## Iteration
Because all Immutable collection types inherit from `Iterable` you can
use methods like `forEach`, `map` and `reduce`:

    list = Immutable.List([1, 2, 3, 4, 5]);
    // -> List [ 1, 2, 3, 4, 5 ]

    list.forEach((item, index) => console.log(item));
    // -> outputs 1, 2, 3, 4, 5

    list.map((a) => (a * a));
    // -> List [ 1, 4, 9, 16, 25 ]

    list.reduce((total, next) => total + next, 0);
    // -> 10

## Conclusion
There is a lot more in Immutable than what I've covered here. This was
just enough to get me going.

Using immutable data structures is opening up some interesting
possibilities and I expect to be working with them more in future.
