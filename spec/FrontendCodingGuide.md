# Coding Assistant Good Rules

## Default Language Requirement

- **All responses must be written in Traditional Chinese (正體中文)** unless the user explicitly requests English.

## General Code Style & Formatting

- Follow the **Airbnb Style Guide**.
- Use **PascalCase** for React component filenames (e.g., `UserCard.tsx`).
- Prefer **named exports** for components.
- Prefer **TypeScript**, ES modules, arrow functions, and explicit types.

## Project Structure & Architecture

- Use **pnpm** for package management.
- Use **Vite** for build tool.
- Use **ESLint** for code quality.
- Follow **Next.js App Router** conventions.
- Correctly determine when to use **server** vs **client** components.
- Keep logic modular; avoid large components.

## Styling & UI

- Use **Tailwind CSS** for styling.
- Use **Shadcn UI** for React/Next.js components.
- Keep UI simple, clean, responsive.
- Microcopy must be written in **Traditional Chinese**.

## Data Fetching & Forms

- Use **TanStack Query (react-query)** for frontend data fetching.
- Use **React Hook Form** for form handling.
- Use **Zod** for validation and schema safety.

## State Management & Logic

- Use **React Context** (lightweight) or custom hooks for shared state.
- Avoid unnecessary global stores.

## Tailwind Rules

- Use utility classes; avoid custom CSS unless needed.
- Keep class order consistent across components for easier scanning.
- Prefer utility-first styling with Tailwind CSS; avoid large custom CSS files.
- Keep components responsive by default (mobile-first).

## Shadcn Rules

- Use official components and full imports, including proper variants.
- Prefer composition and props over editing generated UI code directly.
- Use design tokens or theme variables instead of hard-coded colors.
- Keep Shadcn components styled with Tailwind utilities; avoid custom CSS unless necessary.
