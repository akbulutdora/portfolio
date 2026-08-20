#!/usr/bin/env bash
# Builds the Odin + raylib toy to WASM and drops it into site/toy/.
# Needs: odin on PATH, emcc on PATH or at $EMSDK.
set -eu
cd "$(dirname "$0")"
EMSDK="${EMSDK:-$HOME/development/emsdk}"
export PATH="$EMSDK/upstream/emscripten:$PATH"
OUT=site/toy
mkdir -p "$OUT"

odin build toy -target:js_wasm32 -build-mode:obj -define:RAYLIB_WASM_LIB=env.o \
  -vet -strict-style -o:speed -out:"$OUT/toy.wasm.o"

ODIN_ROOT=$(odin root)
cp "$ODIN_ROOT/core/sys/wasm/js/odin.js" "$OUT/odin.js"

emcc -o "$OUT/toy.js" "$OUT/toy.wasm.o" "$ODIN_ROOT/vendor/raylib/wasm/libraylib.a" \
  -sUSE_GLFW=3 -sWASM_BIGINT -sWARN_ON_UNDEFINED_SYMBOLS=0 \
  -sMODULARIZE=1 -sEXPORT_NAME=createToy -sENVIRONMENT=web -O2
rm "$OUT/toy.wasm.o"
./hash_outputs.sh toy
