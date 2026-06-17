import { useRef, useEffect, useState } from 'react'
import { Box, CircularProgress, Typography } from '@mui/material'
import * as THREE from 'three'
import { STLLoader } from 'three/addons/loaders/STLLoader.js'
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

interface Props {
  dataBase64: string
  format: 'stl' | 'obj'
}

export default function ModelViewer3D({ dataBase64, format }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const animFrameRef = useRef<number>(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Scene setup
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x1a1a2e)

    const width = container.clientWidth || 400
    const height = container.clientHeight || 280

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 10000)
    camera.position.set(0, 0, 5)

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(window.devicePixelRatio)
    container.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 0.8)
    dirLight1.position.set(1, 2, 3)
    scene.add(dirLight1)

    const dirLight2 = new THREE.DirectionalLight(0x6688cc, 0.4)
    dirLight2.position.set(-2, -1, -1)
    scene.add(dirLight2)

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05

    // Load model
    const loadModel = () => {
      try {
        // Decode base64 to ArrayBuffer
        const binary = atob(dataBase64.includes(',') ? dataBase64.split(',')[1] : dataBase64)
        const buffer = new ArrayBuffer(binary.length)
        const view = new Uint8Array(buffer)
        for (let i = 0; i < binary.length; i++) {
          view[i] = binary.charCodeAt(i)
        }

        if (format === 'stl') {
          const loader = new STLLoader()
          const geometry = loader.parse(buffer)

          // Center and scale
          geometry.computeBoundingBox()
          const bbox = geometry.boundingBox!
          const center = new THREE.Vector3()
          bbox.getCenter(center)
          geometry.translate(-center.x, -center.y, -center.z)

          const size = new THREE.Vector3()
          bbox.getSize(size)
          const maxDim = Math.max(size.x, size.y, size.z)
          const scale = maxDim > 0 ? 3 / maxDim : 1

          const material = new THREE.MeshPhongMaterial({
            color: 0x4fc3f7,
            specular: 0x222222,
            shininess: 40,
          })
          const mesh = new THREE.Mesh(geometry, material)
          mesh.scale.setScalar(scale)
          scene.add(mesh)

          // Position camera
          camera.position.set(0, 0, 5)
          controls.target.set(0, 0, 0)
          controls.update()

          setLoading(false)
        } else {
          // OBJ: decode to text and parse
          const decoder = new TextDecoder('utf-8')
          const text = decoder.decode(view)
          const loader = new OBJLoader()
          const obj = loader.parse(text)

          // Center and scale the OBJ group
          const box = new THREE.Box3().setFromObject(obj)
          const center = new THREE.Vector3()
          box.getCenter(center)
          obj.position.sub(center)

          const size = new THREE.Vector3()
          box.getSize(size)
          const maxDim = Math.max(size.x, size.y, size.z)
          const scale = maxDim > 0 ? 3 / maxDim : 1
          obj.scale.setScalar(scale)

          const material = new THREE.MeshPhongMaterial({ color: 0x4fc3f7, specular: 0x222222, shininess: 40 })
          obj.traverse((child) => {
            if (child instanceof THREE.Mesh) child.material = material
          })

          scene.add(obj)
          camera.position.set(0, 0, 5)
          controls.target.set(0, 0, 0)
          controls.update()
          setLoading(false)
        }
      } catch (err) {
        console.error('ModelViewer3D load error:', err)
        setError('Failed to load 3D model')
        setLoading(false)
      }
    }

    loadModel()

    // Animation loop
    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    // ResizeObserver
    const resizeObserver = new ResizeObserver(() => {
      if (!container) return
      const w = container.clientWidth
      const h = container.clientHeight
      if (w > 0 && h > 0) {
        camera.aspect = w / h
        camera.updateProjectionMatrix()
        renderer.setSize(w, h)
      }
    })
    resizeObserver.observe(container)

    return () => {
      cancelAnimationFrame(animFrameRef.current)
      resizeObserver.disconnect()
      controls.dispose()
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry?.dispose()
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose())
          } else {
            obj.material?.dispose()
          }
        }
      })
      renderer.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [dataBase64, format])

  return (
    <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
      {loading && (
        <Box sx={{
          position: 'absolute', inset: 0, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          bgcolor: 'rgba(26,26,46,0.8)', zIndex: 1, borderRadius: 1,
        }}>
          <CircularProgress size={32} />
        </Box>
      )}
      {error && (
        <Box sx={{
          position: 'absolute', inset: 0, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          bgcolor: 'rgba(26,26,46,0.8)', zIndex: 1, borderRadius: 1,
        }}>
          <Typography color="error" variant="caption">{error}</Typography>
        </Box>
      )}
      <Box ref={containerRef} sx={{ width: '100%', height: '100%', borderRadius: 1, overflow: 'hidden' }} />
    </Box>
  )
}
