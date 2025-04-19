import Image from "next/image"

export function BackgroundPattern() {
  return (
    <div className="absolute inset-0 z-0 opacity-20">
      <Image
        src="/bg-waves.png"
        alt="Background Pattern"
        fill
        priority
        className="object-cover"
      />
    </div>
  )
}
