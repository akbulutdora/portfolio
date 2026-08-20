# portfolio

Plain HTML page plus one Odin + raylib WebAssembly canvas.

- `site/` is the deployable directory. Serve it as static files.
- `toy/` is the Odin package for the canvas. `./build.sh` compiles it into `site/toy/`.
- `site/img/` holds one thumbnail per project (`mania.png`, `dikte.png`, ...). Missing images show a grey box.

Local preview: `python3 -m http.server -d site 8080`
