# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository overview
This is a Turborepo monorepo with:
- `apps/web` = frontend app
- `apps/api` = backend app
- `packages/*` = shared packages

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

## Required Project Rules

Before making changes, read and follow:

- `.claude/rules/development-standards.md`
- `.claude/rules/frontend-development.md`

## Skills

Project-specific skills are located in:

- `.claude/skills`

Use the relevant skill when the task matches the skill description.