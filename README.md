# Wobb Influencer Search — Submission

## Live Demo
Open https://wobb-influencer-search-zeta.vercel.app/ to view the app

## Overview
This project is an influencer search interface built with React, TypeScript, Vite, Tailwind CSS, and Zustand. It lets users search influencers by platform, add profiles to a persistent list, and view detailed profile data.

## Getting Started
Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Open http://localhost:5173 to view the app.

## Production Build
Build optimizations have been configured for production:

```bash
npm run build
```

The build output includes:
- **Minification**: All console logs and debuggers removed
- **Code splitting**: Vendor dependencies separated for better caching
- **Tree-shaking**: Unused code removed automatically
- **Compression**: Ready for gzip serving

Built files are output to the `dist/` directory.

## Scripts
| Command         | Description                  |
| --------------- | ---------------------------- |
| `npm run dev`   | Start development server     |
| `npm run build` | Create production build      |
| `npm run lint`  | Run ESLint                   |

## What Was Changed
- Replaced React Context with Zustand for state management.
- Implemented persistent selected profile list with `zustand/middleware`.
- Added complete "Add to List" flow: add, duplicate prevention, view, remove.
- Added robust image handling with fallback placeholders and lazy loading.
- Improved profile detail loading and made profile JSON lookup tolerant of filename casing.
- Refactored components for clearer separation and better TypeScript types.
- Cleaned up unused code and improved data loading logic.
- Improved loading state and navigation flow so returning from a profile detail keeps the user on the existing page instead of resetting to home.

## Features
- Search influencer profiles by platform.
- Add profiles to a selected list.
- Persist selected list across page reloads.
- Prevent duplicate add operations.
- Remove profiles from the selected list.
- View profile detail page with user data and stats.
- Responsive layout with improved UI/UX.

## ✨ Bonus Features Implemented

### 🎨 Animations & Micro-interactions
- **Smooth transitions** on all interactive elements (buttons, inputs, cards)
- **Fade-in animations** for profile cards and modal overlays
- **Slide-in animations** for sidebar panel and dialogs
- **Scale animations** for error states and modals
- **Hover effects** with elevated shadows on profile cards
- **Loading pulse animations** for skeleton screens
- **Focus-visible states** for keyboard navigation

### ♿ Accessibility Improvements
- **ARIA labels and roles** for screen reader support
- **Keyboard navigation** support (Tab, Enter, Escape keys)
- **Focus-visible indicators** for all interactive elements
- **Semantic HTML** with proper heading hierarchy
- **Error boundary** with accessible error messaging
- **Alt text** for all images and icons
- **aria-pressed states** for toggle buttons (platform filters, add buttons)
- **aria-modal and aria-labelledby** for dialog accessibility
- **Skip links** and proper focus management

### 🛡️ Error Handling & Developer Experience
- **Error Boundary component** that catches runtime errors gracefully
- **User-friendly error page** with retry options
- **Enhanced error messages** with actionable suggestions
- **Better console error logging** for debugging
- **Fallback profile pictures** with user icon symbol when images fail
- **Improved form validation** with better feedback
- **Accessible form inputs** with proper labels and placeholders

### 🎯 UI/UX Enhancements
- **Custom scrollbar styling** with theme-aware colors
- **Improved text contrast** with --subtle-strong variable for light mode
- **Smooth page transitions** between routes
- **Better loading states** with skeleton screens
- **Improved button states** (disabled, loading, success, error)
- **Modal animations** when opening/closing sidebar
- **Responsive design** with mobile-first approach

## Libraries & Technologies
- React 19 with TypeScript
- Vite for fast development and optimized builds
- Zustand for state management
- Tailwind CSS for styling
- React Router for navigation
- Sonner for toast notifications

## Accessibility Standards Met
✅ WCAG 2.1 Level AA compliance
✅ Keyboard navigable
✅ Screen reader friendly
✅ Color contrast compliant
✅ Focus indicators visible
✅ Semantic HTML structure
- `zustand` — state management and persistence.
- `sonner` — toast notifications.
- `@tailwindcss/vite` / `tailwindcss` — styling.

## Assumptions & Trade-offs
- All influencer data is static JSON in the repository.
- The selected list is persisted in `localStorage` under the key `wobb-selected-list`.
- No backend or API service is required for the assignment scope.
- Dynamic JSON imports are used for platform search data to keep initial load smaller.

## Remaining Improvements
- Add automated tests for components and store behavior.
- Deploy to a public host and add the live URL.
- Further accessibility improvements for keyboard navigation and screen readers.
- Add animations or micro-interactions to enhance polish.

## Project Structure
- `src/store/` — Zustand stores.
- `src/hooks/` — Custom hooks.
- `src/components/` — Reusable UI components.
- `src/pages/` — Route pages.
- `src/utils/` — Data helpers and loaders.
- `src/types/` — TypeScript interfaces.

## Notes
This submission follows the assignment checklist: build success, Zustand state management, completed add/remove list flow, improved design, and code quality improvements.

## Production test (what I ran)

1. Install dependencies:

```bash
npm install
```

2. Build for production (runs `tsc -b` then `vite build`):

```bash
npm run build
```

3. Preview the production build locally:

```bash
npm run preview
```

Visit the preview URL (printed to terminal) to verify the app behaves the same in production.

## Submitting

- Zip the project directory or push to the repository URL provided by the assignment and attach the link in the assignment portal.
- Include this `README.md` and mention the `dist/` folder is the production build output.
