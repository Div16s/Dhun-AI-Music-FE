/**
 * Ambient declaration for plain (non-module) CSS side-effect imports, e.g.
 * `import "~/styles/globals.css"`.
 *
 * Next.js only ships a declaration for `*.module.css` (CSS Modules), so the
 * editor's TypeScript server has no type for a plain `*.css` import and flags
 * it with ts(2307). `*.module.css` is a more specific wildcard, so this does
 * not shadow Next's CSS Modules typing.
 */
declare module "*.css";
