import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, Line } from '@react-three/drei'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'

const W = 3
const H = 2
const DEPTH = 0.04
const FLAP_H = H * 0.56
const FLAP_Z = 0.05
const INK = '#1a1a1a'
const LINE = 3

const clamp01 = (x: number) => Math.min(1, Math.max(0, x))
const easeInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2)
const easeOutBack = (x: number) => 1 + 2.4 * Math.pow(x - 1, 3) + 1.4 * Math.pow(x - 1, 2)
// progresso normalizado de uma fase [start, end] em segundos
const phase = (t: number, start: number, end: number) => clamp01((t - start) / (end - start))

function extrude(shape: THREE.Shape, depth = DEPTH) {
  const g = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false })
  g.translate(0, 0, -depth / 2)
  return g
}

// contorno preto em pixels (Line2), o traço grosso do neobrutalism
function outline(shape: THREE.Shape): [number, number, number][] {
  const pts = shape.getPoints().map((p) => [p.x, p.y, 0] as [number, number, number])
  return [...pts, pts[0]]
}

function rect(w: number, h: number) {
  const s = new THREE.Shape()
  s.moveTo(-w / 2, -h / 2)
  s.lineTo(w / 2, -h / 2)
  s.lineTo(w / 2, h / 2)
  s.lineTo(-w / 2, h / 2)
  s.closePath()
  return s
}

function heartShape(s: number) {
  const p = new THREE.Shape()
  p.moveTo(0, -0.9 * s)
  p.bezierCurveTo(-0.2 * s, -0.7 * s, -1 * s, -0.2 * s, -1 * s, 0.3 * s)
  p.bezierCurveTo(-1 * s, 0.85 * s, -0.25 * s, 1 * s, 0, 0.45 * s)
  p.bezierCurveTo(0.25 * s, 1 * s, 1 * s, 0.85 * s, 1 * s, 0.3 * s)
  p.bezierCurveTo(1 * s, -0.2 * s, 0.2 * s, -0.7 * s, 0, -0.9 * s)
  return p
}

function useTextTexture(draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void, w: number, h: number) {
  const [tex, setTex] = useState<THREE.CanvasTexture | null>(null)
  useEffect(() => {
    let alive = true
    const make = () => {
      if (!alive) return
      const c = document.createElement('canvas')
      c.width = w
      c.height = h
      draw(c.getContext('2d')!, w, h)
      const t = new THREE.CanvasTexture(c)
      t.colorSpace = THREE.SRGBColorSpace
      t.anisotropy = 4
      setTex(t)
    }
    // espera a fonte Caveat carregar para não desenhar com a fonte padrão
    Promise.race([document.fonts.load('700 80px Caveat'), new Promise((r) => setTimeout(r, 1500))]).then(make)
    return () => {
      alive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return tex
}

function EnvelopeModel({ opening, onDone }: { opening: boolean; onDone: () => void }) {
  const root = useRef<THREE.Group>(null!)
  const flap = useRef<THREE.Group>(null!)
  const seal = useRef<THREE.Group>(null!)
  const letter = useRef<THREE.Group>(null!)
  const startedAt = useRef<number | null>(null)
  const finished = useRef(false)
  const tilt = useRef({ x: 0, y: 0 })
  const { viewport, camera } = useThree()

  const geo = useMemo(() => {
    const back = rect(W, H)

    // frente com o "V" do envelope
    const front = new THREE.Shape()
    front.moveTo(-W / 2, -H / 2)
    front.lineTo(W / 2, -H / 2)
    front.lineTo(W / 2, H / 2)
    front.lineTo(0, -H * 0.08)
    front.lineTo(-W / 2, H / 2)
    front.closePath()

    // aba: pivô na borda de cima (y = 0 no grupo), ponta para baixo
    const flapS = new THREE.Shape()
    flapS.moveTo(-W / 2, 0)
    flapS.lineTo(W / 2, 0)
    flapS.lineTo(0, -FLAP_H)
    flapS.closePath()

    const letterS = rect(W * 0.88, H * 0.86)
    const seal = new THREE.Shape()
    seal.absarc(0, 0, 0.25, 0, Math.PI * 2, false)

    return {
      back: extrude(back, 0.02),
      front: extrude(front),
      flap: extrude(flapS, 0.03),
      letter: extrude(letterS, 0.015),
      heart: extrude(heartShape(0.11), 0.05),
      lines: {
        back: outline(back),
        front: outline(front),
        flap: outline(flapS),
        letter: outline(letterS),
        stamp: outline(rect(0.36, 0.42)),
        seal: outline(seal),
      },
    }
  }, [])

  const addressTex = useTextTexture(
    (ctx, w, h) => {
      ctx.clearRect(0, 0, w, h)
      ctx.fillStyle = INK
      ctx.textAlign = 'center'
      ctx.font = '700 92px Caveat'
      ctx.fillText('Para: Valen ♡', w / 2, h * 0.45)
      ctx.font = '600 64px Caveat'
      ctx.fillText('de: JP', w / 2, h * 0.82)
    },
    768,
    256,
  )

  const letterTex = useTextTexture(
    (ctx, w, h) => {
      ctx.fillStyle = '#fffdf8'
      ctx.fillRect(0, 0, w, h)
      ctx.strokeStyle = 'rgba(26,26,26,0.12)'
      ctx.lineWidth = 3
      for (let y = 150; y < h; y += 70) {
        ctx.beginPath()
        ctx.moveTo(60, y)
        ctx.lineTo(w - 60, y)
        ctx.stroke()
      }
      ctx.fillStyle = INK
      ctx.textAlign = 'center'
      ctx.font = '700 96px Caveat'
      ctx.fillText('oi, Valen ♡', w / 2, 120)
      ctx.font = '600 64px Caveat'
      ctx.fillText('tenho uma pergunta...', w / 2, 260)
    },
    768,
    512,
  )

  // inclinação pelo giroscópio (Android libera sem pedir permissão)
  useEffect(() => {
    const onOrient = (e: DeviceOrientationEvent) => {
      if (e.beta == null || e.gamma == null) return
      tilt.current = { x: THREE.MathUtils.clamp((e.beta - 45) / 45, -1, 1), y: THREE.MathUtils.clamp(e.gamma / 35, -1, 1) }
    }
    window.addEventListener('deviceorientation', onOrient)
    return () => window.removeEventListener('deviceorientation', onOrient)
  }, [])

  const fit = Math.min(1.1, (viewport.width * 0.74) / W)

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    const g = root.current
    if (opening && startedAt.current === null) startedAt.current = t
    const s = startedAt.current === null ? -1 : t - startedAt.current

    // flutuando + seguindo o dedo/giroscópio enquanto fechado
    const idle = s < 0 ? 1 : 1 - phase(s, 0, 0.6)
    const px = state.pointer.x + tilt.current.y
    const py = state.pointer.y + tilt.current.x
    g.position.y = Math.sin(t * 1.6) * 0.08 * idle
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, (px * 0.35 + Math.sin(t * 0.9) * 0.08) * idle, 4, delta)
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, (-py * 0.25 + 0.08) * idle, 4, delta)
    g.rotation.z = Math.sin(t * 1.1) * 0.04 * idle

    if (s < 0) return

    // 1. selo cresce e some girando
    const sp = phase(s, 0, 0.45)
    const sealScale = sp < 0.35 ? 1 + sp * 1.2 : Math.max(0, 1.42 * (1 - (sp - 0.35) / 0.65))
    seal.current.scale.setScalar(sealScale)
    seal.current.rotation.z = sp * Math.PI * 1.5

    // 2. aba abre para cima; depois de 90° passa para trás da carta
    const fp = easeInOut(phase(s, 0.3, 1.1))
    flap.current.rotation.x = -Math.PI * fp
    flap.current.position.z = fp > 0.5 ? -0.09 : FLAP_Z

    // 3. carta sobe
    const lp = easeOutBack(phase(s, 1.0, 1.8))
    letter.current.position.y = lp * H * 0.78

    // 4. carta vem para a câmera, o envelope desce
    const zp = easeInOut(phase(s, 1.9, 2.8))
    letter.current.position.z = zp * 3.2
    letter.current.rotation.x = -0.08 * (1 - zp)
    g.position.y = -zp * 1.6
    camera.position.z = 8 - zp * 1.2

    if (s > 2.75 && !finished.current) {
      finished.current = true
      onDone()
    }
  })

  return (
    <group ref={root} scale={fit}>
      {/* fundo (lado de dentro) */}
      <mesh geometry={geo.back} position-z={-0.06}>
        <meshToonMaterial color="#ff9db8" />
      </mesh>
      <Line points={geo.lines.back} position-z={-0.049} lineWidth={LINE} color={INK} />

      {/* carta */}
      <group ref={letter}>
        <mesh geometry={geo.letter} position-z={-0.03}>
          <meshToonMaterial color="#fffdf8" />
        </mesh>
        <Line points={geo.lines.letter} position-z={-0.019} lineWidth={LINE} color={INK} />
        {letterTex && (
          <mesh position={[0, 0, -0.02]}>
            <planeGeometry args={[W * 0.86, H * 0.84]} />
            <meshBasicMaterial map={letterTex} toneMapped={false} />
          </mesh>
        )}
      </group>

      {/* frente */}
      <mesh geometry={geo.front} position-z={0.01}>
        <meshToonMaterial color="#ffb5c8" />
      </mesh>
      <Line points={geo.lines.front} position-z={0.031} lineWidth={LINE} color={INK} />
      {addressTex && (
        <mesh position={[0, -H * 0.33, 0.035]}>
          <planeGeometry args={[1.35, 0.45]} />
          <meshBasicMaterial map={addressTex} transparent toneMapped={false} depthWrite={false} />
        </mesh>
      )}
      {/* selinho (carimbo) */}
      <mesh position={[W / 2 - 0.36, -H / 2 + 0.32, 0.04]} rotation-z={0.12}>
        <boxGeometry args={[0.36, 0.42, 0.02]} />
        <meshToonMaterial color="#ffe27a" />
        <Line points={geo.lines.stamp} position-z={0.011} lineWidth={2.5} color={INK} />
      </mesh>

      {/* aba + selo de cera */}
      <group ref={flap} position={[0, H / 2, FLAP_Z]}>
        <mesh geometry={geo.flap}>
          <meshToonMaterial color="#ff9fb8" />
        </mesh>
        <Line points={geo.lines.flap} position-z={0.016} lineWidth={LINE} color={INK} />
        <Line points={geo.lines.flap} position-z={-0.016} lineWidth={LINE} color={INK} />
        <group ref={seal} position={[0, -FLAP_H + 0.12, 0.05]}>
          <mesh rotation-x={Math.PI / 2}>
            <cylinderGeometry args={[0.24, 0.26, 0.07, 40]} />
            <meshStandardMaterial color="#e2365b" roughness={0.25} metalness={0.15} />
          </mesh>
          <Line points={geo.lines.seal} position-z={0.036} lineWidth={2.5} color={INK} />
          <mesh geometry={geo.heart} position-z={0.04}>
            <meshStandardMaterial color="#ff6f8e" roughness={0.2} metalness={0.2} />
          </mesh>
        </group>
      </group>
    </group>
  )
}

export default function Envelope3D({ opening, onDone, onFail }: { opening: boolean; onDone: () => void; onFail: () => void }) {
  return (
    <Canvas
      flat
      dpr={[1, 2]}
      camera={{ position: [0, 0, 8], fov: 35 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener('webglcontextlost', onFail)
      }}
      style={{ touchAction: 'none' }}
    >
      <ambientLight intensity={1.6} />
      <directionalLight position={[3, 4, 6]} intensity={2.2} />
      <directionalLight position={[-4, -2, 3]} intensity={0.6} color="#c9b6ff" />
      <EnvelopeModel opening={opening} onDone={onDone} />
      <ContactShadows position={[0, -1.7, 0]} opacity={0.35} scale={6} blur={2.4} far={3} frames={opening ? Infinity : 60} />
    </Canvas>
  )
}
