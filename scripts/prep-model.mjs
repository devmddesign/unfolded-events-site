// Preprocess the Sketchfab chair GLB into a tiny, texture-free single-chair
// model that we re-skin at runtime. Run: npm run prep:model
import { NodeIO } from "@gltf-transform/core";
import { prune, dedup } from "@gltf-transform/functions";

const SRC = "model-src/foldable_chairs.glb";
const OUT = "public/models/chair.glb";

const io = new NodeIO();
const doc = await io.read(SRC);
const root = doc.getRoot();

// 1) Keep only the `chair` mesh — remove the `chair_2` node + mesh.
for (const node of root.listNodes()) {
  const mesh = node.getMesh();
  if (mesh && /chair_2/i.test(mesh.getName())) {
    mesh.dispose();
    node.dispose();
  }
}

// 2) Drop attributes we don't need for a flat matte material (no UV/normal maps).
for (const mesh of root.listMeshes()) {
  for (const prim of mesh.listPrimitives()) {
    for (const name of ["TANGENT", "TEXCOORD_0", "TEXCOORD_1", "COLOR_0"]) {
      if (prim.getAttribute(name)) prim.setAttribute(name, null);
    }
  }
}

// 3) Strip every texture — we apply our own dark+gold material at runtime.
for (const tex of root.listTextures()) tex.dispose();

// 4) Remove everything now orphaned.
await doc.transform(prune({ keepLeaves: false }), dedup());

await io.write(OUT, doc);

console.log(
  `✓ wrote ${OUT} — meshes:`,
  root.listMeshes().map((m) => m.getName()).join(", "),
  "| textures:",
  root.listTextures().length,
);
