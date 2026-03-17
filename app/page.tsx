import Header from "./components/Header";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Header />

      <main className="bg-zinc-50 dark:bg-black">

        {/* HERO SECTION */}
        <section className="relative py-20 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Find Your Dream Home in Ahmedabad
            </h1>
            <p className="mt-4 text-lg opacity-90">
              Buy • Sell • Rent properties with video reels & best deals
            </p>

            {/* Search Bar */}
            <div className="mt-8 bg-white rounded-xl p-3 flex flex-col md:flex-row gap-3 shadow-lg">
              <input
                type="text"
                placeholder="Search by area, city, project..."
                className="flex-1 px-4 py-3 rounded-lg text-black outline-none"
              />
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
                Search
              </button>
            </div>

            {/* CTA */}
            <div className="mt-6 flex justify-center gap-4">
              <a
                href="/properties"
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold"
              >
                Browse Properties
              </a>
              <a
                href="/post-property"
                className="border border-white px-6 py-3 rounded-lg"
              >
                Post Property
              </a>
            </div>
          </div>
        </section>

        {/* FEATURED PROPERTIES */}
        <section className="max-w-7xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-bold mb-8 text-gray-800 dark:text-white">
            Featured Properties
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden shadow hover:shadow-xl transition"
              >
                <div className="h-48 bg-gray-300"></div>

                <div className="p-4">
                  <h3 className="text-lg font-semibold">
                    2BHK Flat in Bopal
                  </h3>

                  <p className="text-gray-500 text-sm mt-1">
                    ₹45 Lac • 1200 sqft
                  </p>

                  <div className="flex justify-between items-center mt-4">
                    <span className="text-sm text-gray-400">
                      Ready to Move
                    </span>
                    <button className="text-blue-600 text-sm font-medium">
                      View Details →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* REELS SECTION */}
        <section className="bg-white dark:bg-zinc-900 py-16">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
              Property Reels
            </h2>

            <div className="flex gap-6 overflow-x-auto pb-4">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="min-w-[220px] h-[360px] bg-black rounded-2xl relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white text-sm">
                    Bopal • ₹45L
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHY US SECTION */}
        <section className="max-w-7xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-bold mb-10 text-center text-gray-800 dark:text-white">
            Why Choose DreamHouse4Sale?
          </h2>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="font-semibold text-lg">Verified Listings</h3>
              <p className="text-gray-500 mt-2 text-sm">
                100% genuine properties from trusted agents & builders
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg">Video Reels</h3>
              <p className="text-gray-500 mt-2 text-sm">
                Explore properties through engaging short videos
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg">Best Deals</h3>
              <p className="text-gray-500 mt-2 text-sm">
                Compare and grab best offers in Ahmedabad
              </p>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}