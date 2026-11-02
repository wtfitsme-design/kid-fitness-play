"""Rebuild the small previews and transparent WebP tree. Requires Pillow."""
import json
import subprocess
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
NEXT = ROOT / "next"
previews = NEXT / "assets/previews"
previews.mkdir(exist_ok=True)
sources = json.loads(subprocess.check_output(["node", "-e", """
const fs=require('fs'),vm=require('vm'),context={window:{}};
vm.createContext(context);
for(const file of ['next-content.js','next-illustrations.js'])
  vm.runInContext(fs.readFileSync('next/'+file,'utf8'),context);
console.log(JSON.stringify([...new Set(Object.entries(context.window.V2.skills)
  .flatMap(([id,skill])=>context.window.V2.allLeaf(skill)
    .map(leaf=>context.window.V2Motion.imageUrl(id,0,leaf))))]));
"""], cwd=ROOT, text=True))
before = after = 0
for source in sources:
    path = NEXT / source
    image = Image.open(path)
    image.thumbnail((270, 360), Image.Resampling.LANCZOS)
    destination = previews / path.name
    image.save(destination, "WEBP", quality=78, method=6)
    before += path.stat().st_size
    after += destination.stat().st_size

tree_source = NEXT / "assets/tree-skill-background.png"
tree = Image.open(tree_source)
# The original has alpha noise even in opaque regions. Quantizing the alpha
# plane to 32 levels keeps the silhouette while cutting that storage overhead.
tree.putalpha(tree.getchannel("A").point(lambda a: round(round(a / (255 / 31)) * (255 / 31))))
tree_destination = NEXT / "assets/tree-skill-background-fast.webp"
tree.save(tree_destination, "WEBP", quality=80, method=6)
print(json.dumps({"previews": len(sources), "preview_source_bytes": before,
                  "preview_bytes": after, "tree_source_bytes": tree_source.stat().st_size,
                  "tree_bytes": tree_destination.stat().st_size}, indent=2))
