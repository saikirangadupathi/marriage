import { config, events, ROUTES } from '../config'

const slug = (s) => s.toLowerCase().replace(/\s+/g, '')

/**
 * Parses /<type> or /<name>/<type>.
 * Returns { schedule, reversed } or null (shows the 404 page).
 * reversed = true puts coupleB first (also the default when no name is given).
 */
export function parseRoute(pathname) {
  const basePath = import.meta.env.BASE_URL.replace(/\/+$/, '')
  const appPath = basePath && (pathname === basePath || pathname.startsWith(`${basePath}/`))
    ? pathname.slice(basePath.length)
    : pathname
  const parts = appPath.split('/').filter(Boolean)
  let name = null
  let type
  if (parts.length === 1) type = parts[0].toLowerCase()
  else if (parts.length === 2) [name, type] = parts.map((p) => p.toLowerCase())
  else return null

  if (!Object.hasOwn(ROUTES, type)) return null

  let reversed = true
  if (name) {
    const slugsB = [slug(config.coupleB.name), config.coupleB.slug]
    const slugsA = [slug(config.coupleA.name), config.coupleA.slug]
    if (slugsB.includes(name)) reversed = true
    else if (slugsA.includes(name)) reversed = false
    else return null
  }

  const keys = ROUTES[type]
  return { schedule: keys ? events.filter((e) => keys.includes(e.key)) : events, reversed }
}
