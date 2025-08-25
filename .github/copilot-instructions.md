# Environment Variables UI Concept v2.0

**ALWAYS reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.**

This is a Next.js 15.2.4 React 19 application built with TypeScript, using shadcn/ui components and Tailwind CSS. It provides a modern dark-themed UI for managing environment variables across different environments (development, staging, production).

## Working Effectively

### Prerequisites and Setup
- Node.js v20+ is required (v20.19.4 confirmed working)
- This project uses pnpm as the package manager (confirmed by `pnpm-lock.yaml`)
- Install pnpm globally if not available: `npm install -g pnpm`

### Bootstrap and Build Process
1. **Install Dependencies**:
   ```bash
   pnpm install
   ```
   - Takes approximately 20-30 seconds
   - May show warnings about build scripts for @tailwindcss/oxide and sharp - this is normal

2. **CRITICAL BUILD ISSUE - Google Fonts Network Restriction**:
   - **The build FAILS by default** due to network restrictions accessing Google Fonts
   - Error: `getaddrinfo ENOTFOUND fonts.googleapis.com`
   - **REQUIRED WORKAROUND**: Temporarily modify `app/layout.tsx` to disable Google Fonts:
     ```typescript
     // Comment out the Google Font import
     // import { DM_Sans } from "next/font/google"
     
     // Comment out the font configuration
     // const dmSans = DM_Sans({...})
     
     // Use system fonts in the style tag instead:
     font-family: ui-sans-serif, system-ui, sans-serif;
     
     // Remove font references in body className
     <body>{children}</body>
     ```

3. **Build the Application**:
   ```bash
   pnpm build
   ```
   - **NEVER CANCEL** - Build takes approximately 10-15 seconds when working
   - **ALWAYS apply the Google Fonts workaround first or build will fail**
   - Successful build produces optimized static content

### Development Server
1. **Start Development Server**:
   ```bash
   pnpm dev
   ```
   - Starts on `http://localhost:3000`
   - Takes approximately 2-3 seconds to start
   - **NEVER CANCEL** - Wait for "Ready" message
   - **REQUIRES Google Fonts workaround to function properly**

### Linting and Code Quality
- **ESLint Configuration**: Project does not have pre-configured ESLint rules
- Running `pnpm lint` will prompt for ESLint setup - this requires manual interaction
- **DO NOT attempt automatic linting setup** - it requires user input
- TypeScript compilation is configured to skip type checking and linting during build

## Validation and Testing

### Manual Validation Scenarios
**ALWAYS run through these complete scenarios after making changes to ensure functionality:**

1. **Environment Variable Management**:
   - Add a new environment variable (fill both name and value fields, click "Add Variable")
   - Verify the variable appears in the table
   - Verify the variable count updates correctly
   - Test editing a variable using the edit button
   - Test deleting a variable using the trash button

2. **Environment Management**:
   - Click "Add Environment" button
   - Create a new environment (e.g., "testing")
   - Verify it switches to the new environment automatically
   - Verify the new environment shows 0 variables and empty state
   - Use the environment selector dropdown to switch between environments
   - Verify each environment maintains its own variable set

3. **Bulk Editor Functionality**:
   - Click "Bulk Editor" button to switch to bulk mode
   - Verify variables display in KEY=VALUE format, one per line
   - Verify "Save Changes" and "Cancel" buttons are present
   - Click "Table View" button to return to table mode
   - Verify data persists between views

4. **UI and Navigation**:
   - Verify dark theme rendering
   - Verify responsive layout
   - Verify all buttons and interactive elements respond correctly
   - Verify modal dialogs open and close properly

### Browser Testing Setup
- Use Playwright browser tools for validation
- Navigate to `http://localhost:3000` 
- Take screenshots to verify UI changes: `playwright-browser_take_screenshot`
- Test complete user workflows, not just page loading

## Project Structure and Navigation

### Key Files and Directories
```
/
├── app/
│   ├── layout.tsx          # Root layout with Google Fonts issue
│   ├── page.tsx           # Main Environment Variables CRM component
│   └── globals.css        # Global styles with dark theme (ACTIVE)
├── components/
│   ├── ui/                # shadcn/ui components (Button, Card, Dialog, etc.)
│   └── theme-provider.tsx # Theme management
├── lib/
│   └── utils.ts          # Utility functions (cn for className merging)
├── styles/
│   └── globals.css        # Alternative light theme styles (UNUSED)
├── package.json          # Project dependencies and scripts
├── next.config.mjs       # Next.js configuration (ignores ESLint/TS errors)
├── postcss.config.mjs    # PostCSS configuration
├── tsconfig.json         # TypeScript configuration
└── components.json       # shadcn/ui configuration
```

### Main Application Logic
- **Single Page Application**: All functionality in `app/page.tsx`
- **State Management**: Uses React useState for local state
- **Environment Data**: Hardcoded initial data for dev, staging, production
- **UI Components**: Built with Radix UI primitives and styled with Tailwind CSS

### Available npm Scripts
```json
{
  "dev": "next dev",        # Start development server
  "build": "next build",    # Build for production  
  "start": "next start",    # Start production server
  "lint": "next lint"       # Run linting (requires setup)
}
```

## Common Gotchas and Important Notes

### Font and Build Issues
- **NEVER attempt to build without addressing the Google Fonts issue first**
- The project was designed to use DM Sans from Google Fonts but network restrictions prevent this
- Always test with the font workaround in place
- Restore original fonts only after confirming network access or using local font files

### Development Workflow
1. **Before any changes**: Apply Google Fonts workaround
2. **Start dev server**: `pnpm dev`
3. **Make your changes** to the codebase
4. **Manual validation**: Run through all user scenarios
5. **Build test**: `pnpm build` to ensure no build regressions
6. **Clean up**: Restore original layout if needed (keep workaround for CI)

### Dependencies and Packages
- **shadcn/ui**: Modern React component library built on Radix UI
- **Tailwind CSS v4.x**: For styling (note: newer version, may have breaking changes)
- **Lucide React**: Icon library
- **Next.js 15.2.4**: Latest Next.js with App Router
- **React 19**: Latest React version (may have compatibility considerations)

### Time Expectations
- **Dependency Installation**: 20-30 seconds with pnpm
- **Development Server Start**: 2-3 seconds
- **Build Process**: 10-15 seconds (when working)
- **NEVER CANCEL** any build or dev server startup - they complete quickly

## Architecture Notes

This is a client-side React application that simulates environment variable management. The data is stored in React state and does not persist between sessions. The application demonstrates modern React patterns with TypeScript, shadcn/ui components, and Tailwind CSS styling in a dark theme.

Key architectural decisions:
- Single-page application with local state management
- No backend API or database integration
- Responsive design with modern component architecture
- Accessibility-focused UI components from Radix UI

**Always follow these instructions first - they contain validated, working commands and known solutions to common issues.**