import { useEffect } from 'react'
import type { Mesh, Object3D } from 'three'

type ModelRendererProps = {
  scene: Object3D
  values: Record<string, number>
}

export function ModelRenderer({ scene, values }: ModelRendererProps) {
  useEffect(() => {
    scene.traverse((object) => {
      const mesh = object as Mesh
      const dict = mesh.morphTargetDictionary
      const influences = mesh.morphTargetInfluences

      if (!dict || !influences) {
        return
      }

      Object.entries(dict).forEach(([name, index]) => {
        influences[index] = values[name] ?? 0
      })
    })
  }, [scene, values])

  return <primitive object={scene} />
}
