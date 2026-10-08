#!/usr/bin/env node
/* ==========================================================================
   Local dev server for the Staxhe site. No dependencies.
   - Serves public/ (the folder Cloudflare deploys) as static files
   - Reloads the browser when a file changes

   npm run dev                 http://localhost:3000
   npm run dev -- --host       also reachable from your phone on the same Wi-Fi
   PORT=8080 npm run dev       different port
   ========================================================================== */

"use strict";

const http = require("http");
const fs = require("fs");
const path = require("path");
const os = require("os");

const ROOT = path.resolve(__dirname, "..", "public");
const EXPOSE = process.argv.includes("--host");
const HOST = EXPOSE ? "0.0.0.0" : "127.0.0.1";
const START_PORT = Number(process.env.PORT) || 3000;
const IGNORED = /(^|[\\/])(\.git|node_modules)([\\/]|$)/;

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".txt": "text/plain; charset=utf-8",
  ".md": "text/plain; charset=utf-8",
  ".webmanifest": "application/manifest+json",
};

/* ---------- Live reload ---------------------------------------------- */

const clients = new Set();

const RELOAD_SNIPPET = `
<script>
  (function () {
    var source = new EventSource("/__reload");
    source.onmessage = function () { location.reload(); };
  })();
</script>
`;

let reloadTimer = null;
function scheduleReload(file) {
  if (file && IGNORED.test(file)) return;
  clearTimeout(reloadTimer);
  reloadTimer = setTimeout(() => {
    if (file) console.log(`  changed  ${file}`);
    for (const res of clients) res.write("data: reload\n\n");
  }, 80);
}

function watch() {
  try {
    fs.watch(ROOT, { recursive: true }, (_event, file) => scheduleReload(file));
  } catch {
    // Older Node on Linux has no recursive watch: watch each folder instead.
    const walk = (dir) => {
      fs.watch(dir, (_event, file) => scheduleReload(file && path.relative(ROOT, path.join(dir, file))));
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory() && !IGNORED.test(full)) walk(full);
      }
    };
    walk(ROOT);
  }
}

/* ---------- Static files --------------------------------------------- */

function send(res, status, body, type = "text/plain; charset=utf-8") {
  res.writeHead(status, { "Content-Type": type, "Cache-Control": "no-store" });
  res.end(body);
}

function handler(req, res) {
  const url = new URL(req.url, "http://localhost");

  if (url.pathname === "/__reload") {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-store",
      Connection: "keep-alive",
    });
    res.write(": connected\n\n");
    clients.add(res);
    req.on("close", () => clients.delete(res));
    return;
  }

  let pathname;
  try {
    pathname = decodeURIComponent(url.pathname);
  } catch {
    return send(res, 400, "Bad request");
  }

  let file = path.join(ROOT, pathname);
  if ((file !== ROOT && !file.startsWith(ROOT + path.sep)) || IGNORED.test(path.relative(ROOT, file))) {
    return send(res, 403, "Forbidden");
  }

  fs.stat(file, (err, stat) => {
    if (!err && stat.isDirectory()) file = path.join(file, "index.html");

    fs.readFile(file, (readErr, data) => {
      if (readErr) {
        console.log(`  404      ${pathname}`);
        return send(res, 404, `Not found: ${pathname}`);
      }

      const type = TYPES[path.extname(file).toLowerCase()] || "application/octet-stream";
      if (type.startsWith("text/html")) {
        const html = data.toString("utf8");
        const withReload = html.includes("</body>")
          ? html.replace("</body>", `${RELOAD_SNIPPET}</body>`)
          : html + RELOAD_SNIPPET;
        return send(res, 200, withReload, type);
      }
      send(res, 200, data, type);
    });
  });
}

/* ---------- Start ------------------------------------------------------ */

function lanAddresses() {
  return Object.values(os.networkInterfaces())
    .flat()
    .filter((i) => i && i.family === "IPv4" && !i.internal)
    .map((i) => i.address);
}

function listen(port, attemptsLeft) {
  const server = http.createServer(handler);

  server.once("error", (err) => {
    if (err.code === "EADDRINUSE" && attemptsLeft > 0) {
      console.log(`  Port ${port} is in use, trying ${port + 1}…`);
      listen(port + 1, attemptsLeft - 1);
    } else {
      console.error(err.message);
      process.exit(1);
    }
  });

  server.listen(port, HOST, () => {
    console.log("\n  Staxhe dev server\n");
    console.log(`  Local    http://localhost:${port}`);
    if (EXPOSE) {
      for (const ip of lanAddresses()) console.log(`  Network  http://${ip}:${port}`);
    } else {
      console.log("  Network  run `npm run dev -- --host` to open it on your phone");
    }
    console.log("\n  Watching for changes. Press Ctrl+C to stop.\n");
    watch();
  });
}

listen(START_PORT, 10);
