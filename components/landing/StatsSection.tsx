export function StatsSection() {
  return (
    <div className="container mx-auto py-12 lg:py-24">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-white text-center">
        <div>
          <div className="text-2xl xs:text-3xl lg:text-4xl xl:text-5xl mb-4 text-gray-900">50,000+</div>
          <div className="text-base lg:text-lg text-gray-700">Tons of Waste Processed</div>
        </div>
        <div>
          <div className="text-2xl xs:text-3xl lg:text-4xl xl:text-5xl mb-4 text-gray-900">3,000+</div>
          <div className="text-base lg:text-lg text-gray-700">Businesses Served</div>
        </div>
        <div>
          <div className="text-2xl xs:text-3xl lg:text-4xl xl:text-5xl mb-4 text-gray-900">85%</div>
          <div className="text-base lg:text-lg text-gray-700">Recycling Rate Achieved</div>
        </div>
        <div>
          <div className="text-2xl xs:text-3xl lg:text-4xl xl:text-5xl mb-4 text-gray-900">20%</div>
          <div className="text-base lg:text-lg text-gray-700">Landfill Reduction</div>
        </div>
      </div>
    </div>
  );
}