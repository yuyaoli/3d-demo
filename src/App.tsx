import { Suspense } from 'react'
import { OrbitControls, Stage, useGLTF } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import modelUrl from '../data/test.glb?url'
import './App.css'

function Model() {
  const { scene } = useGLTF(modelUrl)
  return <primitive object={scene} />
}

useGLTF.preload(modelUrl)

function App() {
  return (
    <div className="app">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <color attach="background" args={['#111']} />
        <Suspense fallback={null}>
          <Stage adjustCamera intensity={1}>
            <Model />
          </Stage>
        </Suspense>
        <OrbitControls makeDefault />
      </Canvas>
    </div>
  )
}

export default App
