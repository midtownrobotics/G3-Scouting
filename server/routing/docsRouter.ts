import express from "express";
import fs from "fs";
import path from "path";
import { marked } from "marked";

const docsRouter = express.Router();

const docsDir = path.join(__dirname, "../../docs");

// Route that captures nested paths
docsRouter.get("/docs{/*path}", (req, res) => {

    const pathArray = (req.params as any).path as string[] | undefined;
    let filePath;

    if (pathArray === undefined || pathArray.length === 0) {
        res.redirect("/docs/home.md")
        return;
    } else {
        filePath = pathArray.join("/");
        if (!filePath.endsWith(".md")) filePath = filePath.concat(".md");
    }

    let fullPath = path.join(docsDir, filePath);

    if (!fs.existsSync(fullPath)) {
        res.redirect("/docs/home.md")
        return;
    }

    const fileContent = fs.readFileSync(fullPath, "utf-8");
    const html = marked(fileContent);

    res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>G3 Scout-o-matic Docs</title>
        <meta charset="utf-8"/>
        <style>
          body { max-width: 800px; margin: 2rem auto; font-family: sans-serif; line-height: 1.6; }
          pre { background: #f4f4f4; padding: 1em; overflow-x: auto; }
          code { background: #eee; padding: 0.2em 0.4em; border-radius: 4px; }
          a { color: #0366d6; text-decoration: none; }
          a:hover { text-decoration: underline; }
        </style>
      </head>
      <body>
        ${html}
      </body>
    </html>
  `);
});

// Optional: recursive index listing
function listFilesRecursive(dir: string, base = ""): string {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    let result = "<ul>";
    for (const entry of entries) {
        const relPath = path.join(base, entry.name);
        if (entry.isDirectory()) {
            result += `<li><strong>${entry.name}/</strong>${listFilesRecursive(path.join(dir, entry.name), relPath)}</li>`;
        } else if (entry.name.endsWith(".md")) {
            result += `<li><a href="/docs/${relPath}">${relPath}</a></li>`;
        }
    }
    return result + "</ul>";
}

export default docsRouter;