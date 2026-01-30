# AI Coding Agent Instructions for carry.cards

carry.cards is a web application that allows users to create and manage their membership cards digitally. Any cards with a barcode or QR code can be added to the app, making it easy for users to access their membership information on the go. The application is a fully offline capable Progressive Web App (PWA) built using modern web technologies.

## Architecture

The application is built with the following technologies:

- **Framework**: Vue 3 with Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Pinia
- **Testing**: Vitest and Playwright
- **Internationalization**: vue-i18n

## Essential Commands

### Development Setup

```bash
npm ci                     # Install dependencies
npm run setup-local-env    # Interactive wizard - configures .dev.vars, generates keys
npm run dev                # Start dev server with hot reload
```

### Testing & Quality

```bash
npm run type-check        # TypeScript type checking
npm run test              # Run unit and e2e tests
npm run lint              # Run ESLint and oxlint
npm run format            # Format code with Prettier
```

### Build & Deploy

```bash
npm run build              # Production build
npm run preview            # Test production build locally
```

## Key Development Practices

### Code Quality

We use a combination of ESLint, Stylelint and Prettier to ensure consistent code quality. See [Essential Commands](#essential-commands) to see how to run these tools.

## Best Practices

### No global component registration

Always import components explicitly and do not rely on global registration.

### Composables over large components

Prefer using Vue composables to encapsulate logic instead of creating large monolithic components.

### Tailwind CSS utility classes

Use Tailwind CSS utility classes for styling wherever possible to maintain consistency and reduce custom CSS.

### Test files

Our tests are written using Vitest. Place your test files alongside the files they test, using the `.test.ts` suffix.

### Composition API

Prefer the Composition API over the Options API for better logic reuse and organization. DO NOT create new Options API components.

### Assets handling

Do not use the `public/` directory for assets that are imported in the application code. Instead, place them in the `src/assets/` directory and import them directly with Vite's `?url` imports.  
Use the `public/` directory only for static assets that are referenced directly in the HTML (e.g., favicons, robots.txt).

### Translations

Use the `vue-i18n` library for internationalization. Always use the `t` function from the `useI18n` composable for translations and avoid hardcoding strings in components.

### Avoid pixel units / calculations

Do not use pixel units `px` in CSS. Use modern units (`dvi`, `dvb`, `rem`) instead.

### CSS Logical properties

Use CSS logical properties (e.g., `inline-size`, `block-size`) instead of physical properties (e.g., `width`, `height`) for better adaptability to different writing modes and layouts.
For tailwind we utilize the `tailwindcss-logical` plugin.

### Do not use hardcoded colors & shadows

Always use colors from the theme (CSS variables / classes) instead of hardcoding colors in styles. This ensures consistency and adaptability to different themes (e.g., dark mode).

### Prefer List Rendering

When rendering lists of items, prefer using `v-for` with a key instead of manually creating elements. This improves maintainability drastically.

### Use `<script setup>`

Always use the `<script setup>` syntax for Vue components.

### Use dynamic imports

For large components that are not needed immediately (e.g., modals, complex widgets), use dynamic imports with `defineAsyncComponent` to improve initial load performance.

### Accessibility

Follow accessibility best practices, including using semantic HTML, ARIA attributes, and ensuring keyboard navigability.
