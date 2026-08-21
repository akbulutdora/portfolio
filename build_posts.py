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
<link rel="stylesheet" href="/style.css">
</head>
<body>
<main>
<nav class="crumbs"><a href="/">{site}</a> / <a href="/posts/">Writing</a>{crumb}</nav>
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
            out.write_text(PAGE.format(title=html.escape(title), site=SITE_TITLE, description=html.escape(desc),
                                       crumb=f' / {html.escape(sec["name"])}', body=article))
            posts.append({"title": title, "date": d, "url": "/posts/" + out.relative_to(OUT).as_posix()})
        sections.append({**sec, "posts": posts})

    # Writing index page.
    parts = ['<h1>Writing</h1>']
    for sec in sections:
        parts.append(f'<h2>{html.escape(sec["name"])}</h2>')
        if sec.get("blurb"):
            parts.append(f'<p class="section-blurb">{html.escape(sec["blurb"])}</p>')
        parts.append('<ul class="post-list">' + "".join(
            f'<li><span class="date">{nice_date(p["date"])}</span><a href="{p["url"]}">{html.escape(p["title"])}</a></li>'
            for p in sec["posts"]) + '</ul>')
    (OUT / "index.html").write_text(PAGE.format(title="Writing", site=SITE_TITLE,
        description="Devlog, term papers, and notes by Dora Akbulut.", crumb="", body="\n".join(parts)))

    # Writing section on the home page: every section, its posts collapsed to one line.
    idx = ROOT / "site" / "index.html"
    s = idx.read_text()
    items = []
    for sec in sections:
        first = sec["posts"][0]
        n = len(sec["posts"])
        more = f' <span class="meta">and {n-1} more</span>' if n > 1 else ""
        items.append(f'    <li><strong>{html.escape(sec["name"])}</strong>: <a href="{first["url"]}">{html.escape(first["title"])}</a>{more}</li>')
    block = ('<ul class="writing">\n' + "\n".join(items) +
             '\n  </ul>\n  <p><a href="/posts/">All writing</a></p>')
    s, n = re.subn(r'<ul class="writing">.*?</ul>(\n  <p><a href="/posts/">All writing</a></p>)?', block, s, count=1, flags=re.S)
    assert n == 1, "Writing block not found in index.html"
    idx.write_text(s)
    total = sum(len(x["posts"]) for x in sections)
    print(f"built {total} posts in {len(sections)} sections")

if __name__ == "__main__":
    build()
