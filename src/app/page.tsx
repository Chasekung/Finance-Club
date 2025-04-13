import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#002D72] via-[#0056B8] to-[#6BA4D9]">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#6BA4D9] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#002D72] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#0056B8] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-white sm:text-6xl md:text-7xl">
            <span className="block">Welcome to</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#6BA4D9] to-white">
              Finance Club
            </span>
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-xl text-white/90">
            For students interested in corporate finance, the Finance Club aims to provide exciting opportunities for hands-on experiential learning and foster a community with passion around finance through participating in competitions, giving educational presentations and hosting guest speakers.
          </p>
          <div className="mt-8 max-w-md mx-auto sm:flex sm:justify-center md:mt-10">
            <div className="rounded-full shadow-lg transform transition hover:scale-105">
              <Link
                href="/login"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-gradient-to-r from-[#0056B8] to-[#002D72] hover:from-[#002D72] hover:to-[#0056B8] md:py-4 md:text-lg md:px-10"
              >
                Login
              </Link>
            </div>
            <div className="mt-3 rounded-full shadow-lg transform transition hover:scale-105 sm:mt-0 sm:ml-3">
              <Link
                href="/register"
                className="w-full flex items-center justify-center px-8 py-3 border-2 border-white text-base font-medium rounded-full text-white hover:bg-white hover:text-[#002D72] transition-colors md:py-4 md:text-lg md:px-10"
              >
                Register
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-xl transform transition hover:scale-105 border border-white/20">
            <div className="text-4xl mb-4">🏆</div>
            <h3 className="text-2xl font-bold text-white mb-4">Competitions</h3>
            <p className="text-white/90">
              Participate in finance competitions to test your skills and gain real-world experience.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-xl transform transition hover:scale-105 border border-white/20">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-2xl font-bold text-white mb-4">Presentations</h3>
            <p className="text-white/90">
              Learn from educational presentations and share your knowledge with the community.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-xl transform transition hover:scale-105 border border-white/20">
            <div className="text-4xl mb-4">🎤</div>
            <h3 className="text-2xl font-bold text-white mb-4">Guest Speakers</h3>
            <p className="text-white/90">
              Connect with industry professionals through our guest speaker events.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 