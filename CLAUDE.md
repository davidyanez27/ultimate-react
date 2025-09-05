# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development Server**: `npm run dev` - Start the Vite development server with hot module replacement
- **Build**: `npm run build` - TypeScript compilation followed by Vite production build
- **Linting**: `npm run lint` - Run ESLint on the codebase
- **Preview**: `npm run preview` - Preview the production build locally

## Project Architecture

This is a React TypeScript application built with Vite, using a layered architecture pattern:

### Core Structure
- **Presentation Layer** (`src/Presentation/`): Contains all UI-related code, organized by feature
- **Interface Layer** (`src/Interface/`): Type definitions and interfaces
- **Configuration** (`src/config/`): Application configuration including regex patterns
- **Core** (`src/Core/`): Core business logic (currently minimal)

### Key Architectural Patterns

**State Management**: 
- Uses Redux Toolkit (`@reduxjs/toolkit`) with React Redux
- Store configured in `src/Presentation/Store/store.ts`
- Authentication state managed via `authSlice`
- Custom hooks like `useAuthStore` provide abstraction over Redux

**Routing**:
- React Router v7 (`react-router`) handles navigation
- Main router in `src/Presentation/router/AppRouter.tsx`
- Authentication-based route protection (authenticated vs non-authenticated users)
- Nested routes with `AppLayout` as the authenticated route wrapper

**Component Organization**:
- Components grouped by feature: `Auth/`, `Form/`, `UI/`, `Common/`, `Header/`, `UserProfile/`
- Barrel exports via `index.ts` files for clean imports
- Reusable form components (Input, Button, Label, Checkbox, Select)
- Layout components for different app states (AppLayout, AuthLayout)

**Context Management**:
- Theme management via `ThemeContext`
- Sidebar state via `SidebarContext`
- Custom providers combine multiple contexts

**Styling**: 
- Tailwind CSS v4 for styling
- Custom CSS in `src/index.css`
- SVG icons organized in `src/Presentation/Assets/icons/`

**API Integration**:
- Axios for HTTP requests
- API modules in `src/Presentation/Api/`
- Inventory API abstraction

### Important Files
- `src/App.tsx`: Root component with routing and theme provider setup
- `src/Presentation/router/AppRouter.tsx`: Main routing logic with auth-based route switching
- `src/Presentation/Store/store.ts`: Redux store configuration
- `src/Presentation/Layouts/AppLayout.tsx`: Main authenticated app layout

The routing logic has inverted authentication checks (authenticated users see login/register, non-authenticated see the main app), which may need review.