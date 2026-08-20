# portfolio

Plain HTML page plus one Odin + raylib WebAssembly canvas.

- `site/` is the deployable directory. Serve it as static files.
- `toy/` is the Odin package for the canvas. `./build.sh` compiles it into `site/toy/`.
- `site/img/` holds one thumbnail per project (`mania.png`, `dikte.png`, ...). Missing images show a grey box.

Local preview: `python3 -m http.server -d site 8080`

## Mania demo

`./build_mania.sh` builds `../mania-game` with `-define:EMBED_ASSETS=true` into `site/mania/`
(about 1.5 MB of WASM). Re-run it after every change in the game repo that you want on the page.
