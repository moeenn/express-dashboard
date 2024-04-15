import html from "noop-tag"
import { BaseLayout } from "#src/views/layouts/BaseLayout.mjs"

/**
 * @typedef Props
 * @property {string} name
 *
 * @param {Props} props
 * @returns {string}
 */
export function HomePage(props) {
  const children = html`
    <div class="container mx-auto p-4">
      <h1>Hello, ${props.name}!</h1>
    </div>
  `

  return BaseLayout({ title: "Home", children })
}
