import Header from "./components/Header";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Header />

      <main className="min-h-screen bg-zinc-50 dark:bg-black px-6 py-10">
        <div className="max-w-7xl mx-auto">

          {/* Hero Section */}
          <section className="text-center py-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white">
              Find Your Dream Home in Ahmedabad
            </h1>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Explore flats, villas, and plots with best deals & video reels
            </p>

            {/* CTA Buttons */}
            <div className="mt-6 flex justify-center gap-4">
              <a
                href="/properties"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
              >
                Browse Properties
              </a>
              <a
                href="/post-property"
                className="border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Post Property
              </a>
            </div>
          </section>

          {/* Featured Properties */}
          <section className="mt-16">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">
              Featured Properties
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="bg-white dark:bg-zinc-900 shadow-md rounded-xl p-4"
                >
                  <div className="h-40 bg-gray-200 rounded-lg mb-4"></div>
                  <h3 className="text-lg font-semibold">
                    2BHK Flat in Bopal
                  </h3>
                  <p className="text-gray-600 text-sm">
                    ₹45 Lac • 1200 sqft
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Reels Section */}
          <section className="mt-16">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">
              Property Reels
            </h2>

            <div className="flex gap-4 overflow-x-auto">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="min-w-[200px] h-[300px] bg-gray-300 rounded-xl"
                ></div>
              ))}
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </>
  );
}