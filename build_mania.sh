#!/usr/bin/env bash
# Builds the Mania web demo from ../mania-game into site/mania/. Does not
# modify the game repo. Every level ships; the demo is the whole game today.
set -eu
cd "$(dirname "$0")"
MANIA="${MANIA:-$HOME/GitHub/mania-game}"
EMSDK="${EMSDK:-$HOME/development/emsdk}"
export PATH="$EMSDK/upstream/emscripten:$PATH"
OUT="$PWD/site/mania"
mkdir -p "$OUT"

(cd "$MANIA" && ./check_embed_dirs.sh && \
  odin build source/main_web -target:js_wasm32 -build-mode:obj \
    -define:RAYLIB_WASM_LIB=env.o -define:RAYGUI_WASM_LIB=env.o -define:EMBED_ASSETS=true \
    -vet -strict-style -o:speed -out:"$OUT/mania.wasm.o")

ODIN_ROOT=$(odin root)
cp "$ODIN_ROOT/core/sys/wasm/js/odin.js" "$OUT/odin.js"

# HEAPF32: raylib's miniaudio glue reads it; without the export audio aborts.
emcc -o "$OUT/mania.js" "$OUT/mania.wasm.o" \
  "$ODIN_ROOT/vendor/raylib/wasm/libraylib.a" "$ODIN_ROOT/vendor/raylib/wasm/libraygui.a" \
  -sUSE_GLFW=3 -sWASM_BIGINT -sWARN_ON_UNDEFINED_SYMBOLS=0 \
  -sEXPORTED_RUNTIME_METHODS=HEAPF32 \
  -sMODULARIZE=1 -sEXPORT_NAME=createMania -sENVIRONMENT=web -O2
rm "$OUT/mania.wasm.o"
echo "ok: $(du -sh "$OUT/mania.wasm" | cut -f1) $OUT/mania.wasm"
