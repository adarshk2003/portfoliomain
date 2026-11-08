import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { hasFinePointer, prefersReducedMotion } from '../hooks.js'

/** A glossy torus knot in the accent colour that follows the mouse and the scroll */
export default function HeroObject() {
  const mountRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    let renderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' })
    } catch (e) {
      return // WebGL not available — the tiles still look fine on their own
    }
    const finePointer = hasFinePointer()
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, finePointer ? 2 : 1.5))
    renderer.setClearColor(0x000000, 0)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    mount.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100)
    camera.position.set(0, 0, 8.5)

    const pmrem = new THREE.PMREMGenerator(renderer)
    const envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    scene.environment = envTexture

    const accent = () => getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#0a84ff'
    const material = new THREE.MeshPhysicalMaterial({
      color: accent(),
      metalness: 0.25,
      roughness: 0.12,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
      envMapIntensity: 1.1,
    })
    const geometry = new THREE.TorusKnotGeometry(1, 0.34, finePointer ? 220 : 150, finePointer ? 32 : 24, 2, 3)
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    const reduce = prefersReducedMotion()
    const clock = new THREE.Clock()
    let tx = 0
    let ty = 0
    let mx = 0
    let my = 0
    let raf = 0

    const resize = () => {
      const w = mount.clientWidth || 1
      const h = mount.clientHeight || 1
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      if (reduce) renderer.render(scene, camera)
    }
    const ro = new ResizeObserver(resize)
    ro.observe(mount)
    resize()

    const frame = () => {
      const t = clock.getElapsedTime()
      mx += (tx - mx) * (finePointer ? 0.06 : 0.035)
      my += (ty - my) * (finePointer ? 0.06 : 0.035)
      mesh.rotation.y = t * (finePointer ? 0.25 : 0.12) + mx * 0.9
      mesh.rotation.x = t * (finePointer ? 0.12 : 0.07) + my * 0.6 + window.scrollY * 0.0006
      mesh.position.y = Math.sin(t * 0.5) * (finePointer ? 0.08 : 0.04)
      renderer.render(scene, camera)
      raf = requestAnimationFrame(frame)
    }
    const start = () => {
      if (!raf && !reduce) raf = requestAnimationFrame(frame)
    }
    const stop = () => {
      cancelAnimationFrame(raf)
      raf = 0
    }

    const onMove = (e) => {
      if (!finePointer) return
      tx = (e.clientX / window.innerWidth) * 2 - 1
      ty = (e.clientY / window.innerHeight) * 2 - 1
    }
    const onAccent = (e) => {
      material.color.set(e.detail)
      if (reduce) renderer.render(scene, camera)
    }
    const onVisibility = () => (document.hidden ? stop() : start())
    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()), { threshold: 0 })
    io.observe(mount)

    if (finePointer) window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('accentchange', onAccent)
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      stop()
      io.disconnect()
      ro.disconnect()
      if (finePointer) window.removeEventListener('pointermove', onMove)
      window.removeEventListener('accentchange', onAccent)
      document.removeEventListener('visibilitychange', onVisibility)
      geometry.dispose()
      material.dispose()
      envTexture.dispose()
      pmrem.dispose()
      renderer.dispose()
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={mountRef} className="hero-canvas" aria-hidden="true" />
}
