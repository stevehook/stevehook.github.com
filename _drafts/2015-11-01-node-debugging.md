---
title: "Learning Node.js - debugging"
layout: post
---



##Not debugging

Debuggers are slow and sometimes painful to use. They interrupt the
normal developer workflow so often the best debugger is no debugger.

There are a few techniques worth trying before you reach for the
debugger itself:

    * ad-hoc logging.
    * set up a proper logging tool.


##The CLI debugger

Node.js has it's own built-in command-line debugger. It's not pretty but
it's worth learning the basics should you need to quickly set some
breakpoints and check what's going on inside a misbehaving program.


##node-inspector

node-inspector is a tool that lets us debug server-side code through the
Web inspector debugging tools that we may be more familiar with when
debugging client-side code. The basic idea is to fire up a browser that
establishes a debug session with your code running in a separate process
via Web sockets.


