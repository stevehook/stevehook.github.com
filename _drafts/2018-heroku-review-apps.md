---
title: "Using Heroku Review apps"
layout: post
---

Heroku review apps have been around for a while now. They are a
convenient way to manage temporary deployments of your application for
testing purposes.

Setting up review apps is reasonably straightforward but there are a few
minor pitfalls to navigate. These are the subject of this post.

## How do review apps work?

Review apps mirror a Github pull request (PR), once set up the application is
refreshed whenever you push a commit to the PR and destroyed when the PR
is closed. A review app is a clone of a parent app, in our case it is
the staging environment, with a few tweaks to make it work
independently.

Review apps depend on integration with Github because they are always
related to a Github PR, so you'll need to enable this in the Heroku
dashboard.

They also depend on (and are an extension of) pipelines so again you'll
need to set up a pipeline for your application. Pipelines consist of one
or more Heroku apps that share the same codebase (and Github repo) and
define the deployment workflow. A typical pipeline with review apps
consist of a small number of review apps (for feature testing) that flow
to a staging app (for integration testing) that flows to a production
app (for the live site).

Review apps can be configured to be created automatically for every PR
that is raised in Github or created manually (from a simple button on
the Pipeline page in the Heroku Dashboard). I went for the manual option
because I was happy to perform this step by hand and because not all PRs
need to be feature tested. If you do set up automatic review apps bear
in mind that there may be an associated cost - Heroku bills them just
like any other apps including addons.

## Configuration
