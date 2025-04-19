import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function Navigation() {
  return (
    <nav className="container mx-auto flex justify-between items-center py-6 px-4 relative z-10">
      <div className="flex items-center">
        <div className="text-white mr-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="#c5f76f" />
            <path
              d="M8 12L11 15L16 9"
              stroke="#004d29"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <span className="text-white text-xl font-semibold">Flora&Fauna</span>
      </div>

      <div className="hidden md:flex space-x-8 text-white">
        <Link href="#" className="transition-colors text-white hover:text-lime-500 font-medium">
          About us
        </Link>
        <Link href="#" className="transition-colors text-white hover:text-lime-500 font-medium">
          Pricing
        </Link>
        <Link href="#" className="transition-colors text-white hover:text-lime-500 font-medium">
          Contact us
        </Link>
        <Link href="#" className="transition-colors text-white hover:text-lime-500 font-medium">
          Blog
        </Link>
      </div>

      <Link 
        href="/sign-in" 
        className="bg-transparent text-white border border-white rounded-full px-5 py-2 flex items-center hover:bg-white hover:text-[#004d29] transition-colors"
      >
        Get Started <ArrowRight className="ml-2 h-4 w-4" />
      </Link>
    </nav>
  )
}
