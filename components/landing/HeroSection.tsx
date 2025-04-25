import Link from "next/link";

export function HeroSection() {
  return (
    <div className="container mx-auto px-4 pt-20 pb-32 relative z-10">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-white text-5xl md:text-7xl font-bold mb-8">
          Transforming Waste<br />
          for a greener future
        </h1>
        <p className="text-white text-lg mb-10 max-w-2xl mx-auto">
          Our commitment to innovative waste management is paving the way for a cleaner, greener planet. Join us on a journey towards a future where recycling, reduction, and sustainable practices redefine how we handle waste.
        </p>
        <Link
              href="/solutions"
              className="bg-[#c5f76f] text-[#004d29] font-medium rounded-full px-8 py-3 hover:bg-white transition-colors inline-block"
              id='explore-cta'
            >
              Explore our solutions
            </Link>
      </div>
    </div>
  )
}
