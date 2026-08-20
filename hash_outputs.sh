#!/usr/bin/env bash
# Renames <name>.js and <name>.wasm in site/<name>/ to <name>.<hash>.{js,wasm}
# and records the names in site/assets.json. Hashed files get an immutable
# cache header; assets.json and index.html stay uncached. Usage: hash_outputs.sh toy
set -eu
cd "$(dirname "$0")"
name="$1"; dir="site/$name"
rm -f "$dir/$name".*.js "$dir/$name".*.wasm
h=$(cat "$dir/$name.js" "$dir/$name.wasm" | shasum -a 256 | cut -c1-10)
mv "$dir/$name.js"   "$dir/$name.$h.js"
mv "$dir/$name.wasm" "$dir/$name.$h.wasm"
python3 - "$name" "$h" <<'PY'
import json, sys, os
name, h = sys.argv[1:]
p = "site/assets.json"
m = json.load(open(p)) if os.path.exists(p) else {}
m[name] = {"js": f"{name}/{name}.{h}.js", "wasm": f"{name}/{name}.{h}.wasm"}
json.dump(m, open(p, "w"), indent=2)
PY
echo "hashed: $dir/$name.$h.{js,wasm}"
