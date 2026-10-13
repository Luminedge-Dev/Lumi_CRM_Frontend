// Global ambient declaration (no import/export in this file, so TypeScript treats it as a
// global script rather than a module — the wildcard pattern only resolves in that context).
// Lets the VS Code TypeScript server resolve plain, non-CSS-Modules side-effect imports like
// `import './globals.css'` in app/layout.tsx. Next.js's own build-time type check and webpack
// loader already handle this without it; this file exists only to silence that IDE-only warning.
declare module '*.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}
