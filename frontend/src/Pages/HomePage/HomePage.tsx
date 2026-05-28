import { Link } from "react-router-dom";
import welcomeImage from "./Welcome.jpg";

export default function HomePage() {
  return (
    <main className="relative min-h-[85vh] flex items-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Decorative background shapes */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 translate-y-1/3 -translate-x-1/4" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-16 lg:py-24">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Text section */}
          <div className="flex-1 space-y-6 text-center lg:text-left">
            <span className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-4 py-1.5 rounded-full tracking-wide uppercase">
              Share your opinion
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
              Welcome to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                ReviewForEvery
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Read honest reviews, rate products, and share your experience with
              thousands of users.
            </p>
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <Link
                to="/add"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg shadow-blue-200 hover:shadow-blue-300 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
                Find a product
              </Link>
              <Link
                to="/add"
                className="inline-flex items-center gap-2 bg-white border border-gray-200 hover:border-blue-300 text-gray-700 font-semibold px-8 py-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
              >
                Leave a review
              </Link>
            </div>
          </div>

          <div className="flex-1 relative mt-8 lg:mt-0">
            <div className="relative mx-auto max-w-sm lg:max-w-none">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-indigo-500 rounded-3xl blur-xl opacity-20 transform rotate-3 scale-95" />
              <img
                src={welcomeImage}
                alt=""
                role="presentation"
                loading="lazy"
                className="relative w-full h-auto rounded-3xl shadow-2xl ring-1 ring-gray-900/5 object-cover aspect-[4/3]"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
