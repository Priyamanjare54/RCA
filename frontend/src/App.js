// src/App.js
import React from "react";
import Navbar from "./components/Navbar";

function App() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-rcaDark text-white font-sans pt-20">
        <main>
          {/* Hero */}
          <section className="relative overflow-hidden">
            <div className="absolute inset-0 bg-heroGradient mix-blend-overlay"></div>

            <div className="max-w-6xl mx-auto px-6 py-24 relative z-10 flex flex-col lg:flex-row items-center gap-12">
              <div className="flex-1">
                <h2 className="text-4xl lg:text-5xl font-extrabold leading-tight">
                  Where Pune’s next <span className="text-rcaGold">India</span> player is <br /> forged.
                </h2>
                <p className="mt-6 text-gray-300 max-w-xl">
                  0.1% better every day — measurable, visible, undeniable. AI-powered video breakdowns,
                  discipline metrics, and mission-driven training for hungry young athletes.
                </p>

                <div className="mt-8 flex gap-4">
                  <a
                    href="#join"
                    className="inline-block px-6 py-3 rounded-lg bg-rcaGold text-rcaDark font-semibold shadow-lg hover:brightness-95"
                  >
                    Join the 0.1% Program
                  </a>
                  <a
                    href="#tour"
                    className="inline-block px-6 py-3 rounded-lg border border-rcaGold/50 text-sm hover:bg-white/5"
                  >
                    Take a virtual tour
                  </a>
                </div>

                {/* Quick metrics */}
                <div className="mt-10 grid grid-cols-3 gap-4 w-full max-w-md">
                  <div className="bg-white/6 p-4 rounded-lg">
                    <div className="text-2xl font-bold">+0.1%</div>
                    <div className="text-xs opacity-80">Daily Betterment Goal</div>
                  </div>
                  <div className="bg-white/6 p-4 rounded-lg">
                    <div className="text-2xl font-bold">AI</div>
                    <div className="text-xs opacity-80">Video breakdowns</div>
                  </div>
                  <div className="bg-white/6 p-4 rounded-lg">
                    <div className="text-2xl font-bold">Live</div>
                    <div className="text-xs opacity-80">Parent recap videos</div>
                  </div>
                </div>
              </div>

              {/* Right column: placeholder for video / demo */}
              <div className="flex-1 flex items-center justify-center">
                <div className="w-full max-w-md rounded-2xl overflow-hidden bg-black/60 border border-white/6 p-2">
                  <div className="aspect-video bg-gradient-to-br from-rcaBlue to-rcaDark flex items-center justify-center">
                    <div className="text-center px-6">
                      <div className="text-sm opacity-80">Demo: AI swing analysis</div>
                      <div className="mt-4 text-xl font-semibold">Before → After</div>
                      <div className="mt-6 text-xs opacity-70">(Replace this block with a short player highlight video)</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Starter content sections */}
          <section id="programs" className="max-w-6xl mx-auto px-6 py-16">
            <h3 className="text-2xl font-bold">Programs — Path of the Warrior</h3>
            <p className="mt-3 text-gray-300 max-w-2xl">Foundation, Skill Forge, Performance Warriors — structured paths with measurable goals.</p>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-white/6 rounded-lg">
                <h4 className="font-semibold text-rcaBlue">Kids (4–8)</h4>
                <p className="text-sm opacity-80 mt-2">Fun-first fundamentals and motor skill development.</p>
              </div>
              <div className="p-6 bg-white/6 rounded-lg">
                <h4 className="font-semibold text-rcaBlue">Juniors (9–14)</h4>
                <p className="text-sm opacity-80 mt-2">Skill mechanics, decision making and fitness.</p>
              </div>
              <div className="p-6 bg-white/6 rounded-lg">
                <h4 className="font-semibold text-rcaBlue">Seniors (15+)</h4>
                <p className="text-sm opacity-80 mt-2">Performance sharpening and video analytics.</p>
              </div>
            </div>
          </section>

          <section id="contact" className="max-w-6xl mx-auto px-6 py-12">
            <div className="bg-white/4 p-6 rounded-lg">
              <h4 className="font-semibold text-rcaBlue">Register / Contact</h4>
              <p className="text-sm opacity-80 mt-2">Quick registration form and WhatsApp connect will be added here.</p>
            </div>
          </section>
        </main>

        <footer className="mt-12 py-8 text-center text-sm opacity-70">
          © {new Date().getFullYear()} RCA — The Forge · Moshi, Pune
        </footer>
      </div>
    </>
  );
}

export default App;
