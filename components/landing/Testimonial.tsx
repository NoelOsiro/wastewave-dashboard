'use client'

import Image from 'next/image'
import React, { useState } from 'react'

const Testimonial = () => {
  const [activeSlide, setActiveSlide] = useState(1)
  const slideCount = 3

  return (
    <section className="py-12 lg:py-24 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center -mx-4">
            <div className="w-full md:w-1/2 px-4 mb-12 md:mb-0">
              <div className="max-w-lg mx-auto md:mx-0 overflow-hidden">
                <div
                  className="flex -mx-4 transition-transform duration-500"
                  style={{
                    transform: `translateX(-${(activeSlide - 1) * 100}%)`,
                  }}
                >
                  {Array.from({ length: slideCount }).map((_, index) => (
                    <Image
                      key={index}
                      className="block flex-shrink-0 w-full px-4"
                      src="/photo-lg.png"
                      alt=""
                      width={500}
                      height={500}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/2 px-4">
              <div className="max-w-lg mx-auto md:mr-0 overflow-hidden">
                <div
                  className="flex -mx-4 transition-transform duration-500"
                  style={{
                    transform: `translateX(-${(activeSlide - 1) * 100}%)`,
                  }}
                >
                  {[
                    {
                      quote:
                        '“WasteWave revolutionized our waste management. Their smart tracking tools cut costs and boosted efficiency!”',
                      author: 'Jenny Wilson',
                      role: 'Operations Manager, Retail Chain',
                    },
                    {
                      quote:
                        '“Switching to WasteWave’s recycling optimization was seamless. Their platform helped us achieve an 80% recycling rate!”',
                      author: 'Sarah Johnson',
                      role: 'Sustainability Coordinator, Manufacturing',
                    },
                    {
                      quote:
                        '“Incredible ROI with WasteWave’s compliance tools. It’s the best decision for our business’s sustainability goals!”',
                      author: 'Michael Chen',
                      role: 'Facility Manager, Commercial Property',
                    },
                    {
                      quote:
                        '“Incredible ROI with WasteWave’s compliance tools. It’s the best decision for our business’s sustainability goals!”',
                      author: 'Michael Chen',
                      role: 'Facility Manager, Commercial Property',
                    },
                  ].map((testimonial, index) => (
                    <div key={index} className="flex-shrink-0 px-4 w-full">
                      <h4 className="text-3xl lg:text-4xl font-medium mb-10 text-lime-500">
                        {testimonial.quote}
                      </h4>
                      <span className="block text-xl font-medium text-lime-500">
                        {testimonial.author}
                      </span>
                      <span className="block mb-12 lg:mb-32 text-lg text-gray-700">
                        {testimonial.role}
                      </span>
                    </div>
                  ))}
                </div>
                <div>
                  <button
                    className="inline-block mr-4 text-gray-700 hover:text-lime-500"
                    onClick={() =>
                      setActiveSlide(
                        activeSlide > 1 ? activeSlide - 1 : slideCount
                      )
                    }
                  >
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 32 32"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M24.4 16H7.59998"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M16 24.4L7.59998 16L16 7.59998"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <button
                    className="inline-block text-gray-700 hover:text-lime-500"
                    onClick={() =>
                      setActiveSlide(
                        activeSlide < slideCount ? activeSlide + 1 : 1
                      )
                    }
                  >
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 32 32"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M7.59998 16H24.4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M16 7.59998L24.4 16L16 24.4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
  )
}

export default Testimonial