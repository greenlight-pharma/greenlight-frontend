// WMed Lumen: leitura de moléculas (SDF e PDB), ligações por distância e orientação pelos eixos principais.
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import {build} from 'esbuild';
async function load(path){const r=await build({entryPoints:[path],bundle:true,write:false,format:'esm',platform:'node'});return import(`data:text/javascript;base64,${Buffer.from(r.outputFiles[0].text).toString('base64')}`)}
const file=f=>readFileSync(new URL(`../public/molecular/${f}`,import.meta.url),'utf8');

test('SDF do ATP: átomos, ligações e molécula deitada no eixo X',async()=>{
 const {parseSDF,buildMolecule}=await load('src/lumen/molecule.ts');const THREE=await import('three');
 const mol=parseSDF(file('ATP.sdf'));
 assert.ok(mol.atoms.length>=31);assert.ok(mol.bonds.every(([a,b])=>mol.atoms[a]&&mol.atoms[b]));
 assert.equal(mol.atoms.filter(a=>a.elem==='P').length,3,'três fosfatos');
 const size=new THREE.Box3().setFromObject(buildMolecule(mol,{style:'stick',hydrogens:false,theme:'clinical'}).group).getSize(new THREE.Vector3());
 assert.ok(size.x>=size.y&&size.y>=size.z*0.9,`eixos ${size.x.toFixed(1)} ${size.y.toFixed(1)} ${size.z.toFixed(1)}`);
});
test('PDB: ignora água, liga átomos pela distância e não liga metais',async()=>{
 const {parsePDB}=await load('src/lumen/molecule.ts');
 const mol=parsePDB(file('1HHO.pdb'));
 assert.ok(mol.atoms.length>2000);assert.ok(!mol.atoms.some(a=>a.resn==='HOH'));
 const perAtom=mol.bonds.length/mol.atoms.length;assert.ok(perAtom>0.9&&perAtom<1.3,`ligações por átomo ${perAtom.toFixed(2)}`);
 const fe=mol.atoms.findIndex(a=>a.elem==='Fe');assert.ok(fe>=0);assert.ok(!mol.bonds.some(([a,b])=>a===fe||b===fe));
});
test('fitas de proteína: hélices e folhas do arquivo, uma malha por trecho contínuo e ligantes à parte',async()=>{
 const {parsePDB,buildCartoon}=await load('src/lumen/molecule.ts');const THREE=await import('three');
 const mol=parsePDB(file('1HHO.pdb'));
 assert.ok([...mol.ss.values()].filter(v=>v==='helix').length>100,'hemoglobina é rica em hélices');
 const c=buildCartoon(mol,{theme:'holo'});
 const ribbons=c.group.children.filter(o=>o.userData.ribbon);
 assert.ok(ribbons.length>=2&&ribbons.length<=8,`${ribbons.length} trechos`);
 assert.ok(ribbons.every(m=>m.geometry.attributes.color&&m.geometry.index.count>1000));
 const size=new THREE.Box3().setFromObject(c.group).getSize(new THREE.Vector3());
 assert.ok(size.x>=size.y&&size.x<120,`tamanho ${size.x.toFixed(0)} Å`);
 // o heme (HETATM) aparece como ligante em esferas e ligações
 assert.ok(c.group.children.some(o=>o.isGroup));
});
