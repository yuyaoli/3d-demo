import { Suspense, useMemo, useState } from 'react'
import { OrbitControls, Stage, useGLTF } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import type { Mesh } from 'three'
import modelUrl from '../data/test2_compressed.glb?url'
import { ModelRenderer } from './components/ModelRenderer.tsx'
import { ShapeKeyControls } from './components/ShapeKeyControls.tsx'
import './App.css'

useGLTF.preload(modelUrl)

function App() {
  const { scene } = useGLTF(modelUrl)
  const [values, setValues] = useState<Record<string, number>>({})
  const shapeKeys = useMemo(() => {
    const names = new Set<string>()

    scene.traverse((object) => {
      const mesh = object as Mesh

      Object.keys(mesh.morphTargetDictionary ?? {}).forEach((name) => {
        names.add(name)
      })
    })

    return [...names]
  }, [scene])

  return (
    <div
      className="app"
      style={{ display: 'flex', gap: 40, alignItems: 'stretch' }}
    >
      <aside
        className="sidebar"
        style={{ flex: '0 0 min(34vw, 440px)', minWidth: 320, maxWidth: 440 }}
      >
        <ShapeKeyControls
          shapeKeys={shapeKeys}
          values={values}
          onChange={(name, value) =>
            setValues((current) => ({ ...current, [name]: value }))
          }
        />
      </aside>
      <div
        className="preview"
        style={{ flex: '1 1 auto', minWidth: 0 }}
      >
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <color attach="background" args={['#f5efea']} />
          <Suspense fallback={null}>
            <Stage adjustCamera={false} intensity={0.7} preset="soft">
              <ModelRenderer scene={scene} values={values} />
            </Stage>
          </Suspense>
          <OrbitControls makeDefault />
        </Canvas>
      </div>
    </div>
  )
}

export default App
