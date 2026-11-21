"""Pack the CC0 MakeHuman body geometry and adult morph targets for the dashboard.

Usage: python3 scripts/build-human-mesh.py base.obj female.target.gz male.target.gz weights.game_engine.json
The target files are MPFB caucasian-female-young and caucasian-male-young.
Use MPFB's CC0 game-engine weights for the matching MakeHuman base mesh.
Only body faces, anatomical joint centers, and grouped body weights are exported.
"""
import gzip
import json
from pathlib import Path
import sys

source, female_target, male_target, weights_path = sys.argv[1:]
targets = (female_target, male_target)
vertices = []
faces = []
group = ''
joints = {name: set() for name in ('shoulder', 'elbow', 'hand', 'hand-2', 'upper-leg', 'knee', 'ankle')}
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

weights = json.loads(Path(weights_path).read_text())
assert weights['license'] == 'CC0'

def bone_index(name):
    """Use one transform for the hand and fingers, and one for the foot and toes."""
    bone, _, side = name.rpartition('_')
    index = {
        'upperarm': 1, 'lowerarm': 2, 'hand': 3,
        'thigh': 4, 'calf': 5, 'foot': 6, 'ball': 6
    }.get(bone)
    if bone.startswith(('thumb_', 'index_', 'middle_', 'ring_', 'pinky_')):
        index = 3
    return index + (6 if side == 'r' else 0) if index is not None and side in ('l', 'r') else 0

grouped_weights = [{} for _ in used]
for bone, influences in weights['weights'].items():
    index = bone_index(bone)
    for vertex, weight in influences:
        if vertex in remap:
            grouped = grouped_weights[remap[vertex]]
            grouped[index] = grouped.get(index, 0) + weight

assert all(row for row in grouped_weights), 'Weights must match the body mesh indices'
packed_weights = []
for row in grouped_weights:
    active = [(index, weight) for index, weight in sorted(row.items()) if weight > .0005]
    total = sum(weight for _, weight in active)
    packed_weights.append([
        number for index, weight in active for number in (index, round(weight / total * 255))
    ])

data = {
    'profiles': profiles, 'arms': [row[:4] for row in landmarks], 'legs': [row[4:] for row in landmarks],
    'weights': packed_weights, 'faces': [remap[i] for face in faces for i in face]
}
assert len(data['faces']) == 4 * len(faces)
output = Path(__file__).resolve().parents[1] / 'dist' / 'human-mesh.js'
output.write_text('// MakeHuman / MPFB graphical assets, CC0 1.0. See README for sources.\n'
                  'const humanMeshData = ' + json.dumps(data, separators=(',', ':')) + ';\n')
