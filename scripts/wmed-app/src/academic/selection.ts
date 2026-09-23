import * as THREE from 'three';

/** Each mesh owns its highlight material, even when the GLB shares materials. */
export function prepareSelection(mesh: THREE.Mesh) {
  const original = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
  const copies = original.map(m => m.clone());
  mesh.material = Array.isArray(mesh.material) ? copies : copies[0];
  let active = false;
  return (selected: boolean) => {
    if (active === selected) return;
    active = selected;
    copies.forEach((material, i) => {
      const base = original[i];
      if (!(material instanceof THREE.MeshStandardMaterial) || !(base instanceof THREE.MeshStandardMaterial)) return;
      material.color.copy(selected ? new THREE.Color('#ffb020') : base.color);
      material.emissive.copy(selected ? new THREE.Color('#a34c00') : base.emissive);
      material.emissiveIntensity = selected ? 0.45 : base.emissiveIntensity;
      material.opacity = selected ? 1 : base.opacity;
      material.transparent = selected ? false : base.transparent;
      material.depthWrite = selected ? true : base.depthWrite;
      // Textures and vertex colors must not obscure the selected structure's color.
      material.map = selected ? null : base.map;
      material.vertexColors = selected ? false : base.vertexColors;
      material.needsUpdate = true;
    });
  };
}
