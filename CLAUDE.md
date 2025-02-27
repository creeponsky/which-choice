# CLAUDE.md - Project Guidelines

## Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Run production build
- `npm run lint` - Run ESLint for code linting

## Code Style
- **Framework**: Next.js with React 19 and TypeScript 5
- **Styling**: TailwindCSS with class-variance-authority and tailwind-merge
- **Components**: Use shadcn/ui component library patterns
- **Naming**: Use PascalCase for components, camelCase for functions/variables
- **Imports**: Group imports by external libs, then internal components, then utilities
- **Types**: Always use proper TypeScript types, avoid using 'any'
- **State Management**: Use React hooks and context where appropriate
- **Error Handling**: Use try/catch for async operations
- **File Structure**: Follow Next.js app router conventions
- **Dark Mode**: Support both light and dark themes using next-themes