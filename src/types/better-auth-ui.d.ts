import type { AuthPlugin } from "@better-auth-ui/react"

/**
 * Registers the React UI plugin shape into Better Auth UI's plugin registry.
 *
 * `@better-auth-ui/core` types `useAuth().plugins` as the union of every type
 * registered on `AuthPluginRegister`, falling back to the bare `AuthPluginBase`
 * when nothing is registered. The React package ships the richer `AuthPlugin`
 * type (adding UI slots like `accountCards`, `views`, `captchaComponent`,
 * `securityCards`, `settingsTabs`, `authButtons`, `userMenuItems`) but leaves
 * this registration to the consumer. Without it, the copied auth components
 * that read those slots fail to type-check against `AuthPluginBase`.
 */
declare module "@better-auth-ui/core" {
  interface AuthPluginRegister {
    react: AuthPlugin
  }
}
