"use client"

import { Shader, ChromaFlow, Swirl } from "shaders/react"

export default function ShaderBackground() {
  return (
    <>
      <Shader className="h-full w-full">
        <Swirl
          colorA="#3F00FF"
          colorB="#000000"
          speed={0.8}
          detail={0.5}
          blend={50}
          coarseX={15}
          coarseY={15}
          mediumX={20}
          mediumY={20}
          fineX={15}
          fineY={15}
        />
        <ChromaFlow
          baseColor="#000000"
          upColor="#3F00FF"
          downColor="#000000"
          leftColor="#000000"
          rightColor="#000000"
          intensity={0.7}
          radius={0.7}
          momentum={25}
          maskType="alpha"
          opacity={0.75}
        />
      </Shader>
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 0%, transparent 50%, rgba(0,0,0,0.6) 80%, rgba(0,0,0,0.9) 100%)",
        }}
      />
    </>
  )
}
