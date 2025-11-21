# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Super Sui Pets is a SvelteKit application built with:
- **Svelte 5** with the latest runes API ($props, $state, etc.)
- **SvelteKit** for the application framework
- **TypeScript** with strict type checking enabled
- **Tailwind CSS v4** for styling (using Vite plugin)
- **Phaser 4.0.0-rc.5** for game development
- **bits-ui** for accessible UI primitives
- Pre-built UI component library in `src/lib/components/ui/`

## Development Commands

```bash
# Start development server
npm run dev
# or with browser open
npm run dev -- --open

# Type checking
npm run check
# Type checking in watch mode
npm run check:watch

# Linting
npm run lint

# Formatting
npm run format

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── routes/              # SvelteKit file-based routing
│   ├── +page.svelte    # Homepage
│   └── +layout.svelte  # Root layout
├── lib/
│   ├── components/
│   │   └── ui/         # Pre-built UI components (alert, badge, button, card, etc.)
│   ├── hooks/          # Svelte runes-based hooks
│   ├── assets/         # Static assets
│   └── utils.ts        # Utility functions (cn for className merging)
├── app.html            # HTML template
├── app.css             # Global styles with Tailwind and CSS variables
└── app.d.ts            # TypeScript declarations
```

## Key Architecture Details

### Svelte 5 Runes API
This project uses Svelte 5 with the new runes API:
- Use `$props()` for component props
- Use `$state()` for reactive state
- Use `$derived()` for computed values
- Use `$effect()` for side effects
- Use `{@render children()}` for slot content

### UI Components
- Located in `src/lib/components/ui/`
- Built on **bits-ui** for accessibility
- Styled with **Tailwind CSS v4** using CSS variables
- Each component has an `index.ts` for clean exports
- Components follow a consistent pattern with TypeScript types

### Styling System
- **Tailwind CSS v4** configured via Vite plugin (no separate config file needed)
- CSS variables defined in `src/app.css` for theming
- Light/dark mode support via `.dark` class
- Custom `cn()` utility in `src/lib/utils.ts` for className merging using `clsx` and `tailwind-merge`
- Animation utilities from `tw-animate-css`

### TypeScript Configuration
- Strict mode enabled
- `noUnusedLocals` and `noUnusedParameters` set to `false`
- Module resolution: `bundler`
- Path aliases handled by SvelteKit (`$lib` for `src/lib/`)

### ESLint Configuration
- Uses flat config format
- TypeScript ESLint with recommended rules
- Svelte plugin with recommended rules
- Notable disabled rules:
  - `no-undef` (handled by TypeScript)
  - `@typescript-eslint/no-explicit-any`
  - `@typescript-eslint/no-unused-vars`
  - `no-unused-vars`

### Prettier Configuration
- Uses tabs for indentation
- Single quotes
- No trailing commas
- Print width: 88
- Svelte plugin enabled

## Important Notes

1. **Svelte 5 Syntax**: Always use the new runes API. Do not use the old `export let` syntax for props.

2. **Component Imports**: UI components should be imported from their index files:
   ```typescript
   import { Button } from '$lib/components/ui/button';
   ```

3. **Styling**: Use the `cn()` utility to merge Tailwind classes with conditional logic:
   ```typescript
   import { cn } from '$lib/utils';

   const classes = cn('base-class', condition && 'conditional-class');
   ```

4. **TypeScript**: The project uses strict TypeScript. Ensure proper typing for all new code.

5. **File Structure**: Follow SvelteKit conventions for file-based routing and the `+` prefix for special files (`+page.svelte`, `+layout.svelte`, etc.).

6. **Phaser Integration**: The project includes Phaser 4.0.0-rc.5 for game development. This is a release candidate version, so be aware of potential API changes.

## Svelte MCP Server

You are able to use the Svelte MCP server, where you have access to comprehensive Svelte 5 and SvelteKit documentation. Here's how to use the available tools effectively:

### Available MCP Tools:

#### 1. list-sections

Use this FIRST to discover all available documentation sections. Returns a structured list with titles, use_cases, and paths.
When asked about Svelte or SvelteKit topics, ALWAYS use this tool at the start of the chat to find relevant sections.

#### 2. get-documentation

Retrieves full documentation content for specific sections. Accepts single or multiple sections.
After calling the list-sections tool, you MUST analyze the returned documentation sections (especially the use_cases field) and then use the get-documentation tool to fetch ALL documentation sections that are relevant for the user's task.

#### 3. svelte-autofixer

Analyzes Svelte code and returns issues and suggestions.
You MUST use this tool whenever writing Svelte code before sending it to the user. Keep calling it until no issues or suggestions are returned.

#### 4. playground-link

Generates a Svelte Playground link with the provided code.
After completing the code, ask the user if they want a playground link. Only call this tool after user confirmation and NEVER if code was written to files in their project.
