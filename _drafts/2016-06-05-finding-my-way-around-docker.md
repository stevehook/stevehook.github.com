---
title: "Finding my way around Docker"
layout: post
---

These days we developers are forever hearing about the merits of Docker.
If you are happily running your development environment on host machine
what does Docker offer and what does it all mean?

## What is it for?

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
I'm not going to try to explain those here.

## Docker concepts

### Images, Containers and Dockerfiles

An image is the term for a saved Docker file-system and configuration. A
container is an instance of a running image. An image/container can be
as simple or as complex as you like, though typically they are small
and single-purposed, e.g. a Web server and database are likely to be
running in separate containers.

A `Dockerfile` is a recipe for an image. It defines the software that will
be installed in an image and the configuration of that image (e.g. the
ports that it exposes).

## Installing Docker

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

## Creating a Dockerfile

It is possible to create a Docker image and run a container to run your
application from scratch using the `docker` command but normally the
first step in dockerizing an application is to create a `Dockerfile`.
The `Dockerfile` is normally added to your application's Git repo so
that it can be used by other team members to reproduce the same
development environment.

Dockerfile commands are upper case words followed by a string of
arguments. The first line should always be a `FROM` command, this tells
docker what to use as the base image for your application's image. You
can start from a bare OS, e.g. `FROM ubuntu:16.04` in which case you'll
have a long list of dependencies to install, or you can use a publicly
available base image on Docker Hub that is a little more complete
allowing you to focus on your application specifics. For example, if you
are dockerizing a Rails project the recommending starting point is the
`ruby` image (see https://hub.docker.com/_/rails/). e.g.

     1 FROM ruby:2.3
     2 MAINTAINER Steve "steve@example.com"
     3
     4 RUN apt-get update \
     5  && apt-get install -y --no-install-recommends \
     6      postgresql-client \
     7  && rm -rf /var/lib/apt/lists/*
     8
     9 WORKDIR /usr/src/app
    10 COPY Gemfile* ./
    11 RUN bundle install
    12 COPY . .
    13
    14 EXPOSE 3000
    15 CMD ["rails", "server", "-b", "0.0.0.0"]

In this example we are using the `RUN` command to install the
`postgres-client` dependency because our Rails application needs to
connect to a database. You might have other requirements here.

The `WORKDIR` command defines the working directory for your
application, i.e. where the dockerised application will run from.  The
`COPY` command copies the contents of the host folder into that
directory in the container.

The `EXPOSE` command declares ports that the container should expose,
here we are just exposing port 3000 but we could also map a container
port to a different port on the host machine, e.g. `EXPOSE 80:3000`
exposes port 80 from the container as port 3000 on the host machine.

Finally the `CMD` command defines the process that will be run within
the container, in this case the Rails server).

## Docker compose

If you want to run small single-purpose containers they won't be able to
do a whole lot by themselves. You'll probably need more than one for a
non-trivial application. So if your application is built from a set of
interdependent containers you are going to need something to organise
them. This is where Docker compose comes in handy.

##Conclusion

There is a great deal more to Docker beyond the basics I've talked about
here.  But setting up a `Dockerfile` and `docker-compose.yml` you can
containerize your application development environment pretty easily
(check Dockerhub for examples if you are stuck).  This can significantly
reduce the effort needed to configure a development or test environment
for other team members.
