import bpy, bmesh, hashlib, json, math, struct
import numpy as np
from mathutils import Vector
def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def clear():
    for obj in list(bpy.data.objects):
        bpy.data.objects.remove(obj, do_unlink=True)
    for collection in (bpy.data.meshes, bpy.data.materials, bpy.data.images):
        for item in list(collection):
            if item.users == 0:
                collection.remove(item)


class Kit:
    def __init__(self, cell, out):
        self.cell, self.out = cell, out
        self.parts = {p['id']: p for p in cell['parts']}
        self.materials = {}
        self.objects = []
        self.serial = 0

    def material(self, part, color=None):
        assert part in self.parts, (self.cell['id'], part)
        key = (part, color)
        if key in self.materials:
            return self.materials[key]
        hex_color = (color or self.parts[part]['colorHex']).lstrip('#')
        rgb = np.array([int(hex_color[i:i + 2], 16) / 255 for i in (0, 2, 4)])
        seed = int(hashlib.sha256((self.cell['id'] + part).encode()).hexdigest()[:8], 16)
        rng = np.random.default_rng(seed)
        n = 256
        y, x = np.mgrid[0:n, 0:n] / n
        # Original periodic multiscale granularity; no directional sine stripe
        # and no photograph-derived texture is placed on the cell membrane.
        frequency_y=np.fft.fftfreq(n)[:,None]
        frequency_x=np.fft.rfftfreq(n)[None,:]
        squared_frequency=frequency_y**2+frequency_x**2
        height=np.zeros((n,n),dtype=np.float32)
        for sigma,weight in ((2.2,.064),(6.5,.045),(19.,.027)):
            random_field=rng.normal(size=(n,n))
            spectrum=np.fft.rfft2(random_field)
            field=np.fft.irfft2(spectrum*np.exp(-2*math.pi**2*sigma**2*squared_frequency),s=(n,n))
            height+=weight*field/max(field.std(),.000001)
        albedo = np.ones((n, n, 4), dtype=np.float32)
        albedo[:, :, :3] = np.clip(rgb[None, None, :] * (1 + .50 * height[:, :, None]), 0, 1)
        gy, gx = np.gradient(height)
        normal = np.ones((n, n, 4), dtype=np.float32)
        normal[:, :, 0] = .5 - gx * .65
        normal[:, :, 1] = .5 - gy * .65
        normal[:, :, 2] = 1
        texture_dir = self.out / 'textures'
        texture_dir.mkdir(exist_ok=True)
        images = []
        for suffix, pixels, space in [('color', albedo, 'sRGB'), ('normal', normal, 'Non-Color')]:
            name = f'{part}-{len(self.materials):02d}-{suffix}'
            image = bpy.data.images.new(name, width=n, height=n, alpha=True)
            image.colorspace_settings.name = space
            image.pixels.foreach_set(pixels.ravel())
            image.file_format = 'PNG'
            image.filepath_raw = str(texture_dir / (name + '.png'))
            image.save()
            images.append(image)
        mat = bpy.data.materials.new('Vytal_' + part)
        mat.diffuse_color = (*rgb, 1)
        mat.use_nodes = True
        nodes, links = mat.node_tree.nodes, mat.node_tree.links
        shader = nodes.get('Principled BSDF')
        shader.inputs['Roughness'].default_value = .59
        shader.inputs['Metallic'].default_value = 0
        shader.inputs['Specular IOR Level'].default_value = .28
        tex = nodes.new('ShaderNodeTexImage')
        tex.image = images[0]
        links.new(tex.outputs['Color'], shader.inputs['Base Color'])
        tex_n = nodes.new('ShaderNodeTexImage')
        tex_n.image = images[1]
        normal_node = nodes.new('ShaderNodeNormalMap')
        normal_node.inputs['Strength'].default_value = .33
        links.new(tex_n.outputs['Color'], normal_node.inputs['Color'])
        links.new(normal_node.outputs['Normal'], shader.inputs['Normal'])
        self.materials[key] = mat
        return mat

    def mesh(self, part, vertices, faces, color=None):
        assert part in self.parts, (self.cell['id'], part)
        self.serial += 1
        data = bpy.data.meshes.new(part)
        data.from_pydata(vertices, [], faces)
        data.update()
        assert len(data.polygons) and len(data.vertices), (self.cell['id'], part, 'empty mesh')
        # Weld coincident parameterization poles/seams; retain sharp cut boundaries.
        bm = bmesh.new()
        bm.from_mesh(data)
        bmesh.ops.remove_doubles(bm, verts=list(bm.verts), dist=0.000001)
        bmesh.ops.recalc_face_normals(bm, faces=list(bm.faces))
        bm.to_mesh(data)
        bm.free()
        uv = data.uv_layers.new(name='Original procedural UV')
        center = sum((v.co for v in data.vertices), Vector()) / len(data.vertices)
        z_range = max(v.co.z for v in data.vertices) - min(v.co.z for v in data.vertices)
        z_min = min(v.co.z for v in data.vertices)
        for poly in data.polygons:
            poly.use_smooth = True
            for li in poly.loop_indices:
                p = data.vertices[data.loops[li].vertex_index].co
                relative = p - center
                uv.data[li].uv = ((math.atan2(relative.y, relative.x) / (2 * math.pi)) % 1,
                                  (p.z - z_min) / max(z_range, .000001))
        obj = bpy.data.objects.new(part.replace('-', '_') + f'_{self.serial:04d}', data)
        bpy.context.scene.collection.objects.link(obj)
        obj['teaching_part'] = part
        obj.data.materials.append(self.material(part, color))
        self.objects.append(obj)
        return obj

    def merged(self):
        result = []
        grouped = {part: [o for o in self.objects if o.get('teaching_part') == part] for part in self.parts}
        for part in self.parts:
            objects = grouped[part]
            assert objects, (self.cell['id'], 'missing part', part)
            bpy.ops.object.select_all(action='DESELECT')
            for obj in objects:
                obj.hide_set(False)
                obj.select_set(True)
            bpy.context.view_layer.objects.active = objects[0]
            if len(objects) > 1:
                bpy.ops.object.join()
            obj = bpy.context.view_layer.objects.active
            obj.name = part.replace('-', '_') + '_mesh'
            obj['teaching_part'] = part
            result.append(obj)
        return result


def bounds(objects):
    coords = [obj.matrix_world @ Vector(v) for obj in objects for v in obj.bound_box]
    return [[min(p[i] for p in coords) for i in range(3)], [max(p[i] for p in coords) for i in range(3)]]


def inspect_glb(path, expected):
    raw = path.read_bytes()
    magic, version, size = struct.unpack_from('<4sII', raw)
    assert magic == b'glTF' and version == 2 and size == len(raw)
    length, chunk = struct.unpack_from('<II', raw, 12)
    assert chunk == 0x4E4F534A
    doc = json.loads(raw[20:20 + length])
    assert all('uri' not in b for b in doc['buffers'])
    assert all('uri' not in i and 'bufferView' in i for i in doc['images'])
    parts = {n.get('extras', {}).get('teaching_part') for n in doc['nodes'] if 'mesh' in n}
    assert parts == expected, (path, parts, expected)
    for mat in doc['materials']:
        assert 'baseColorTexture' in mat['pbrMetallicRoughness'] and 'normalTexture' in mat
    triangles = 0
    for mesh in doc['meshes']:
        for p in mesh['primitives']:
            assert p.get('mode', 4) == 4 and 'NORMAL' in p['attributes'] and 'TEXCOORD_0' in p['attributes']
            triangles += doc['accessors'][p['indices']]['count'] // 3
    return dict(bytes=len(raw), sha256=sha(path), meshes=len(doc['meshes']), triangles=triangles,
                parts=sorted(parts), embeddedImages=len(doc['images']), allResourcesEmbedded=True)


