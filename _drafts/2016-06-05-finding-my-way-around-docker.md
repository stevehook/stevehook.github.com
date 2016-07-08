---
title: "Finding my way around Docker"
layout: post
---

These days we developers are forever hearing about the merits of Docker.
If you are happily running your development environment on host machine
what does Docker offer and what does it all mean?

I'm just finding my way with Docker and these are my notes.

##What is it for?

One use case is to provide a consistent runtime environment in which to
develop and test a system.

The idea of running your development environment in a virtual machine to
promote consistency is not a new idea. All the developers on the team
can share exactly the same setup without having to worry about what we
all install on our development machine. The downside is that virtual
machines are big and cumbersome, each one taking gigabytes of disk space
and lots of memory and CPU at runtime. Docker is different because it
uses the same OS kernel and file-system as the host machine, so a Docker
container is lightweight enough to have several of them setup or running
on your development machine. It's a little more complicated if your
development machine doesn't run Linux but you still get the same
benefits.

Of course Docker has other use cases for CI and production servers but
I'm not going to try to explain all of those here.

##Docker concepts

###Images, Containers and Dockerfiles

An image is the term for a saved Docker file-system and configuration. A
container is an instance of a running image. An image/container can be
as simple or as complex as you like, though typically they are small
and single-purposed, e.g. a Web server and database running in separate
containers.

A Dockerfile is a recipe for an image. It defines the software that will
be installed in an image and the configuration of that image (e.g. the
ports that it exposes).


##Installing Docker

I use a Mac for development. Docker doesn't run *natively* on OS X you
need a VM to run. On a Mac Docker runs inside an Ubuntu VM running on
Oracle VirtualBox. So does that mean that you lose all the benefits that
we listed above? No because the VM itself, that you need to run Docker
is pretty small and it can run multiple containers so you only need one
instance of it. Furthermore the Docker Toolbox now automates the
management of this VM so from a developer point of view it's pretty much
invisible.

Getting set up is as simple as downloading and running the Docker
Toolbox from https://www.docker.com/products/docker-toolbox

##Creating a Dockerfile


##Docker compose

