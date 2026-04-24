const command = process.argv[2]

if (command !== 'model') {
  console.error('Usage: bun run compress model')
  process.exit(1)
}

const proc = Bun.spawn(
  [
    'bun',
    'x',
    'gltf-transform',
    'optimize',
    'data/test2.glb',
    'data/test2_compressed.glb',
    '--simplify',
    'false',
  ],
  {
    stdout: 'inherit',
    stderr: 'inherit',
    stdin: 'inherit',
  },
)

const exitCode = await proc.exited

if (exitCode !== 0) {
  process.exit(exitCode)
}
