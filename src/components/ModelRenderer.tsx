import { useEffect, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import { Box3, Sphere, Vector3, type Mesh, type Object3D, type PerspectiveCamera } from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'

type ModelRendererProps = {
  scene: Object3D
  values: Record<string, number>
}

const desiredViewDirection = new Vector3(0.75, 0.2, 1)

export function ModelRenderer({ scene, values }: ModelRendererProps) {
  const camera = useThree((state) => state.camera)
  const controls = useThree((state) => state.controls as OrbitControlsImpl | undefined)
  const hasInitialized = useRef(false)

  useEffect(() => {
    if (hasInitialized.current) {
      return
    }

    const box = new Box3().setFromObject(scene)

    if (box.isEmpty()) {
      return
    }

    const center = new Vector3()
    box.getCenter(center)
    scene.position.sub(center)

    box.setFromObject(scene)

    const sphere = new Sphere()
    box.getBoundingSphere(sphere)

    const perspectiveCamera = camera as PerspectiveCamera
    const fovInRadians = (perspectiveCamera.fov * Math.PI) / 180
    const distance = (sphere.radius / Math.tan(fovInRadians / 2)) * 1.3
    const nextPosition = desiredViewDirection
      .clone()
      .normalize()
      .multiplyScalar(distance)

    perspectiveCamera.position.copy(nextPosition)
    perspectiveCamera.lookAt(0, 0, 0)
    perspectiveCamera.updateProjectionMatrix()

    if (controls) {
      controls.target.set(0, 0, 0)
      controls.update()
    }

    hasInitialized.current = true
  }, [camera, controls, scene])

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
