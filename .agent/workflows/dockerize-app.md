---
description: Dockerization
---

Goal: Containerize the current application. Steps:

Analyze the codebase to detect the language (Node) and dependencies (package.json).

Create a Dockerfile optimized for production (use multi-stage builds if possible).

Create a .dockerignore file to exclude node_modules, .git, and .env.

Create a docker-compose.yml file if a database is detected in the code configuration.
