"""Pack the CC0 MakeHuman body geometry and adult morph targets for the dashboard.

Usage: python3 scripts/build-human-mesh.py base.obj female.target.gz male.target.gz
The target files are MPFB caucasian-female-young and caucasian-male-young.
Only the body surface is exported. Rig markers and helper meshes are excluded.
"""
import gzip
import json
from pathlib import Path
import sys

source, *targets = sys.argv[1:]
vertices = []
faces = []
group = ''
joints = {name: set() for name in ('shoulder', 'elbow', 'hand')}
for line in Path(source).read_text().splitlines():
    parts = line.split()
    if not parts:
        continue
    if parts[0] == 'v':
        vertices.append(tuple(map(float, parts[1:4])))
    elif parts[0] == 'g':
        group = parts[1]
    elif parts[0] == 'f' and group == 'body':
        faces.append([int(value.split('/')[0])-1 for value in parts[1:]])

    elif parts[0] == 'f' and group.removeprefix('joint-l-') in joints:
        joints[group.removeprefix('joint-l-')].update(int(value.split('/')[0])-1 for value in parts[1:])

used = sorted({index for face in faces for index in face})
remap = {index: position for position, index in enumerate(used)}
profiles = []
landmarks = []
for target in targets:
    offsets = {}
    with gzip.open(target, 'rt') as file:
        for line in file:
            parts = line.split()
            if len(parts) == 4 and parts[0].isdigit():
                offsets[int(parts[0])] = tuple(map(float, parts[1:]))
    landmarks.append([
        [round(sum(vertices[i][axis]+offsets.get(i, (0, 0, 0))[axis] for i in indices)/len(indices), 4)
         for axis in range(3)]
        for indices in joints.values()
    ])
    profiles.append([
        round(value + delta, 4)
        for index in used
        for value, delta in zip(vertices[index], offsets.get(index, (0, 0, 0)))
    ])

data = {'profiles': profiles, 'arms': landmarks, 'faces': [remap[i] for face in faces for i in face]}
assert len(data['faces']) == 4 * len(faces)
output = Path(__file__).resolve().parents[1] / 'dist' / 'human-mesh.js'
output.write_text('// MakeHuman / MPFB graphical assets, CC0 1.0. See README for sources.\n'
                  'const humanMeshData = ' + json.dumps(data, separators=(',', ':')) + ';\n')
