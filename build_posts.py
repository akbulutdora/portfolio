#!/usr/bin/env python3
"""Builds site/posts/ from posts/*.md with pandoc, driven by posts/manifest.toml.

Output paths mirror source paths, so URLs match the old GitHub Pages site.
Also writes site/posts/index.html and rewrites the Writing section of site/index.html.
"""
import html, re, subprocess, sys, tomllib
from datetime import date
from pathlib import Path

ROOT = Path(__file__).parent
SRC, OUT = ROOT / "posts", ROOT / "site" / "posts"
SITE_TITLE = "Dora Akbulut"

PAGE = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title} · {site}</title>
<meta name="description" content="{description}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="canonical" href="https://thoughtassault.dev{url}">
<meta property="og:type" content="article">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{description}">
<meta property="og:url" content="https://thoughtassault.dev{url}">
<meta property="og:image" content="https://thoughtassault.dev/og.png">
<meta name="twitter:card" content="summary_large_image">
<link rel="stylesheet" href="/style.css">
<script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{{"token": "677d0c70caa6464b9dc0569ef1c0a923"}}'></script>
</head>
<body>
<main>
<nav class="crumbs"><a href="/">{site}</a> / <a href="/#writing">Writing</a>{crumb}</nav>
{body}
</main>
</body>
</html>
"""

def md_to_html(path: Path) -> str:
    return subprocess.run(
        ["pandoc", "-f", "gfm+footnotes", "-t", "html5", "--wrap=none", str(path)],
        check=True, capture_output=True, text=True).stdout

def fix_links(body: str, src_rel: Path) -> str:
    # Internal .md links become .html; the old projects page is the home page now.
    body = body.replace('href="./projects.md"', 'href="/"')
    body = re.sub(r'href="(\.{1,2}/[^"]+)\.md"', r'href="\1.html"', body)
    body = body.replace('src="../../images/', 'src="/posts/images/')
    return body

def nice_date(d: date) -> str:
    return d.strftime("%-d %b %Y")

def version_css():
    """Cloudflare caches .css for 4 h whatever the origin says; a content hash in the
    query string makes every change take effect at once."""
    import hashlib
    css = ROOT / "site" / "style.css"
    h = hashlib.sha256(css.read_bytes()).hexdigest()[:8]
    for f in (ROOT / "site").rglob("*.html"):
        txt = f.read_text()
        new = re.sub(r'href="/style\.css(\?v=[0-9a-f]+)?"', f'href="/style.css?v={h}"', txt)
        if new != txt:
            f.write_text(new)

def build():
    man = tomllib.loads((SRC / "manifest.toml").read_text())
    OUT.mkdir(parents=True, exist_ok=True)
    sections = []
    for sec in man["section"]:
        posts = []
        for p in sec["posts"]:
            src = SRC / p["src"]
            body = md_to_html(src)
            m = re.search(r"<h1[^>]*>(.*?)</h1>", body, re.S)
            title = p.get("title") or (html.unescape(re.sub("<[^>]+>", "", m.group(1))) if m else src.stem)
            if m:
                body = body.replace(m.group(0), "", 1)
            body = fix_links(body, Path(p["src"]))
            d = date.fromisoformat(p["date"])
            first_p = re.search(r"<p>(.*?)</p>", body, re.S)
            desc = html.unescape(re.sub("<[^>]+>", "", first_p.group(1)))[:160] if first_p else title
            out = OUT / Path(p["src"]).with_suffix(".html")
            out.parent.mkdir(parents=True, exist_ok=True)
            article = (f'<article class="post"><h1>{html.escape(title)}</h1>'
                       f'<span class="date">{nice_date(d)} · {html.escape(sec["name"])}</span>\n{body}</article>')
            url = "/posts/" + out.relative_to(OUT).as_posix()
            out.write_text(PAGE.format(title=html.escape(title), site=SITE_TITLE, description=html.escape(desc),
                                       crumb=f' / {html.escape(sec["name"])}', body=article, url=url))
            posts.append({"title": title, "date": d, "url": url})
        sections.append({**sec, "posts": posts})

    # Writing section on the home page: every section with every post.
    idx = ROOT / "site" / "index.html"
    s = idx.read_text()
    parts = []
    for sec in sections:
        parts.append(f'  <h3>{html.escape(sec["name"])}</h3>')
        if sec.get("blurb"):
            parts.append(f'  <p class="section-blurb">{html.escape(sec["blurb"])}</p>')
        parts.append('  <ul class="post-list">' + "".join(
            f'<li><span class="date">{nice_date(p["date"])}</span><a href="{p["url"]}">{html.escape(p["title"])}</a></li>'
            for p in sec["posts"]) + '</ul>')
    block = "  <!-- writing:start -->\n" + "\n".join(parts) + "\n  <!-- writing:end -->"
    s, n = re.subn(r'  <!-- writing:start -->.*?<!-- writing:end -->', block, s, count=1, flags=re.S)
    assert n == 1, "writing markers not found in index.html"
    idx.write_text(s)
    old_index = OUT / "index.html"
    if old_index.exists():
        old_index.unlink()
    version_css()
    # sitemap.xml: home page plus every post.
    urls = ["https://thoughtassault.dev/"] + ["https://thoughtassault.dev" + p["url"] for sec in sections for p in sec["posts"]]
    (ROOT / "site" / "sitemap.xml").write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        + "".join(f"  <url><loc>{u}</loc></url>\n" for u in urls) + "</urlset>\n")
    total = sum(len(x["posts"]) for x in sections)
    print(f"built {total} posts in {len(sections)} sections")

if __name__ == "__main__":
    build()
