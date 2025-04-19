import Link from 'next/link'
import React from 'react'
import Image from 'next/image'

const Footer = () => {
  return (
    <section className="relative py-12 lg:py-24 bg-orange-50 overflow-hidden">
    <Image
      className="absolute bottom-0 left-0"
      src="/waves-lines-left-bottom.png"
      alt=""
      width={500}
      height={300}
    />
    <div className="container px-4 mx-auto relative">
      <div className="flex flex-wrap mb-16 -mx-4">
        <div className="w-full lg:w-2/12 xl:w-2/12 px-4 mb-16 lg:mb-0">
          <Link href="/" className="inline-block mb-4">
            <Image src="/logo.svg" alt="Logo" width={200} height={100} />
          </Link>
        </div>
        <div className="w-full md:w-7/12 lg:w-6/12 px-4 mb-16 lg:mb-0">
          <div className="flex flex-wrap -mx-4">
            <div className="w-1/2 xs:w-1/3 px-4 mb-8 xs:mb-0">
              <h3 className="mb-6 font-bold text-gray-700">Platform</h3>
              <ul>
                <li className="mb-4">
                  <Link
                    className="inline-block text-gray-600 hover:text-lime-500 font-medium"
                    href="/solutions"
                  >
                    Solutions
                  </Link>
                </li>
                <li className="mb-4">
                  <Link
                    className="inline-block text-gray-600 hover:text-lime-500 font-medium"
                    href="/how-it-works"
                  >
                    How it works
                  </Link>
                </li>
                <li>
                  <Link
                    className="inline-block text-gray-600 hover:text-lime-500 font-medium"
                    href="/pricing"
                  >
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
            {/* Add Resources and Company sections similarly */}
            <div className="w-1/2 xs:w-1/3 px-4 mb-8 xs:mb-0">
              <h3 className="mb-6 font-bold text-gray-700">Resources</h3>
              <ul>
                <li className="mb-4">
                  <Link
                    className="inline-block text-gray-600 hover:text-lime-500 font-medium"
                    href="/blog"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    className="inline-block text-gray-600 hover:text-lime-500 font-medium"
                    href="/contact"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="w-full md:w-5/12 lg:w-4/12 px-4">
          <div className="max-w-sm p-8 bg-teal-900 rounded-2xl mx-auto md:mr-0">
            <h5 className="text-xl font-medium text-white mb-4">
              Your Source for Green Energy Updates
            </h5>
            <p className="text-sm text-white opacity-80 leading-normal mb-10">
              Stay in the loop with our Green Horizon newsletter, where we
              deliver bite-sized insights into the latest green energy
              solutions.
            </p>
            <div className="flex flex-col">
              <input
                className="h-12 w-full px-4 py-1 placeholder-gray-300 outline-none ring-offset-0 focus:ring-2 focus:ring-lime-500 shadow rounded-full"
                type="email"
                placeholder="Your e-mail..."
              />
              <Link
                className="h-12 inline-flex mt-3 py-1 px-5 items-center justify-center font-medium text-teal-900 border border-lime-500 hover:border-white bg-lime-500 hover:bg-white rounded-full transition duration-200"
                href="#"
              >
                Get in touch
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap -mb-3 justify-between">
        <div className="flex items-center mb-3">
          {/* Add social media icons */}
          <div className="flex -mx-2 space-x-8">
            <Link
              className="inline-block mx-2"
              href="https://www.facebook.com/flow"
            >
              <Image src="/meta.svg" alt="Meta" width={24} height={24} />
            </Link>
            <Link
              className="inline-block mx-2"
              href="https://www.instagram.com/flow"
            >
              <Image src="/instagram.svg" alt="Instagram" width={24} height={24} />
            </Link>
            <Link
              className="inline-block mx-2"
              href="https://www.twitter.com/flow"
            >
              <Image src="/x.svg" alt="X" width={24} height={24} />
            </Link>
          </div>
        </div>
        <p className="text-sm text-gray-500 mb-3">
          © 2025 Wastewave. All rights reserved.
        </p>
      </div>
    </div>
  </section>
  )
}

export default Footer