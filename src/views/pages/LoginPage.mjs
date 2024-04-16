import html from "noop-tag"
import { BaseLayout } from "#src/views/layouts/BaseLayout.mjs"
import { LoginForm } from "#src/views/components/LoginForm.mjs"

/**
 * @typedef Props
 * @property {string} [email]
 * @property {string} [password]
 *
 * @param {Props} props
 * @returns {string}
 */
export function LoginPage(props) {
  return BaseLayout({ title: "Login" })(html`
    <div class="container mx-auto p-4">
      <h2 class="text-xl font-serif mb-4">Login</h2>
      ${LoginForm(props)}
    </div>
  `)
}
