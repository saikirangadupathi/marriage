// Standalone production server: serves /manoj/* from dist/.
//   npm run build && npm start  ->  http://localhost:3000/manoj/marriageinvitation
import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), 'dist')
const PORT = process.env.PORT || 3000
const MOUNT_PATH = '/manoj'
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.webp': 'image/webp', '.ico': 'image/x-icon', '.mp4': 'video/mp4', '.mp3': 'audio/mpeg',
}

http.createServer((req, res) => {
  let pathname
  try {
    pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname)
  } catch {
    res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Bad request')
    return
  }

  const appPath = pathname === MOUNT_PATH
    ? '/'
    : pathname.startsWith(`${MOUNT_PATH}/`)
      ? pathname.slice(MOUNT_PATH.length)
      : pathname
  const file = path.resolve(ROOT, `.${appPath}`)
  if (file !== ROOT && !file.startsWith(`${ROOT}${path.sep}`)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Forbidden')
    return
  }

  const exists = fs.existsSync(file) && fs.statSync(file).isFile()
  if (!exists) {
    // Only document navigations get the SPA fallback. Missing assets must stay
    // 404s so browsers never try to parse index.html as CSS or JavaScript.
    const acceptsHtml = req.headers.accept?.includes('text/html')
    const looksLikeAsset = path.extname(appPath) !== ''
    if (!acceptsHtml || looksLikeAsset) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Not found')
      return
    }
    return serve(path.join(ROOT, 'index.html'))
  }

  serve(file)

  function serve(target) {
    const type = TYPES[path.extname(target)] || 'application/octet-stream'
    const { size } = fs.statSync(target)
    const range = req.headers.range

    // Range requests so <video>/<audio> can seek (the intro video skips ahead to 2.4s).
    if (range && (type === 'video/mp4' || type === 'audio/mpeg')) {
      const [s, e] = range.replace('bytes=', '').split('-')
      const start = Number(s)
      const end = e ? Number(e) : size - 1
      res.writeHead(206, {
        'Content-Type': type, 'Content-Range': `bytes ${start}-${end}/${size}`,
        'Accept-Ranges': 'bytes', 'Content-Length': end - start + 1,
      })
      return fs.createReadStream(target, { start, end }).pipe(res)
    }

    res.writeHead(200, { 'Content-Type': type, 'Content-Length': size, 'Accept-Ranges': 'bytes' })
    fs.createReadStream(target).pipe(res)
  }
}).listen(PORT, () => console.log(`http://localhost:${PORT}/manoj/marriageinvitation`))
