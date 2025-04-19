'use client'

import { useState } from 'react'

export function FaqSection() {
  const [accordions, setAccordions] = useState<{ [key: number]: boolean }>({})

  const toggleAccordion = (id: number) => {
    setAccordions(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }
  const faqs = [
    {
      id: 1,
      question: 'What is WasteWave’s waste management platform?',
      answer:
        'WasteWave is a SaaS platform designed to streamline waste management for businesses. It offers tools for real-time waste tracking, recycling optimization, regulatory compliance, and sustainability reporting to reduce waste and enhance environmental impact.',
    },
    {
      id: 2,
      question: 'What solutions does WasteWave offer?',
      answer:
        'We provide a suite of waste management solutions, including smart waste tracking, recycling optimization analytics, automated compliance reporting, and sustainability dashboards. These tools are customizable for industries like retail, manufacturing, and commercial properties.',
    },
    {
      id: 3,
      question: 'How can my business start using WasteWave?',
      answer:
        'Getting started with WasteWave is easy. We offer a free consultation to assess your waste management needs, followed by a tailored onboarding process. Our team sets up the platform, integrates it with your operations, and provides ongoing support to ensure success.',
    },
    {
      id: 4,
      question: 'What are the benefits of using WasteWave?',
      answer:
        'WasteWave helps businesses reduce waste disposal costs, increase recycling rates, ensure regulatory compliance, and strengthen sustainability credentials. By optimizing waste processes, you can lower your environmental footprint and enhance operational efficiency.',
    },
  ];

  return (
    <section className="py-12 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <h1 className="text-gray-800 text-6xl mb-6">FAQ</h1>
          <p className="text-gray-700">
            Here you will find the answers to the frequently asked questions.
          </p>
        </div>
        <div className="max-w-4xl mx-auto">
          {faqs.map((faq) => (
            <button
              key={faq.id}
              className="flex w-full py-6 px-8 mb-4 items-start justify-between text-left shadow-md rounded-2xl"
              onClick={() => toggleAccordion(faq.id)}
            >
              <div>
                <div className="pr-5">
                  <h5 className="text-lg font-medium text-lime-500">{faq.question}</h5>
                </div>
                <div
                  className={"overflow-hidden transition-all duration-500 " + (accordions[faq.id] ? "h-auto" : "h-0") + " pr-5"}
                >
                  <p className="text-gray-700 mt-4">{faq.answer}</p>
                </div>
              </div>
              <span className="flex-shrink-0">
                <div className={accordions[faq.id] ? "hidden" : ""}>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 5.69995V18.3"
                      stroke="#1D1F1E"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M5.69995 12H18.3"
                      stroke="#1D1F1E"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className={accordions[faq.id] ? "" : "hidden"}>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5.69995 12H18.3"
                      stroke="#1D1F1E"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
