// components/FinkiaAbout.js
const FinkiaAbout = () => {
    const features = [
      {
        id: 1,
        title: "01",
        description: "Online sales of products/services",
      },
      {
        id: 2,
        title: "02",
        description: "AI-powered photo editor",
      },
      {
        id: 3,
        title: "03",
        description: "Bills collection and management",
      },
      {
        id: 4,
        title: "04",
        description: "Self-serviced smart savings and thrift collection/co-operative society management.",
      },
    ];
  
    return (
      <section className="bg-white py-10">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
            What&apos;s Finkia About?
          </h2>
          <p className="text-gray-600 text-center max-w-2xl mx-auto mb-8">
            FINKIA is an AI-powered, business-process management and productivity-enhancing platform that comes with:
          </p>
  
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div
                key={feature.id}
                className="bg-[#F4F1EC] rounded-lg shadow-md p-6 text-center"
              >
                <h3 className="text-4xl font-bold text-amber-500 mb-4">
                  {feature.title}
                </h3>
                <p className="text-[#80663B]">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };
  
  export default FinkiaAbout;
  