import Link from "next/link";

export const metadata = {
  title: "Beyond the Code — Daniel Coyle",
  description: "A few things I enjoy in my free time.",
};

export default function BeyondPage() {
  return (
    <div className="min-h-screen bg-[#0d0d0f] text-white font-sans">
      {/* Hero */}
      <header className="border-b border-white/10">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <Link
            href="/"
            className="text-xs uppercase tracking-widest text-gray-400 hover:text-white transition-colors"
          >
            ← Back to Portfolio
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-16 space-y-12">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-tight">
            Beyond the Code
          </h1>
          <p className="mt-3 text-gray-400 text-sm md:text-base">
            A little more of me!
          </p>
        </div>

        {/* Hobbies */}
        <section className="border-t border-white/10 pt-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Hobbies</h2>
          <p className="text-gray-400 text-sm md:text-base mb-10 max-w-2xl">
            A few things I enjoy in my free time:
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Piano */}
            <div className="flex flex-col rounded-xl border border-white/10 bg-white/[0.02] p-6">
              <h3 className="text-lg font-semibold mb-4">Piano</h3>
              <a
                href="https://www.youtube.com/@XiaoDannyPiani"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit Daniel Coyle's piano YouTube channel"
                className="group relative mb-4 block aspect-video overflow-hidden rounded-lg border border-white/10 bg-black/20"
              >
                <img
                  src="/Images/BeyondTheCode/DanielPiano.jpg"
                  alt="Daniel Coyle playing piano"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <span className="absolute inset-x-0 bottom-0 bg-black/65 px-4 py-2 text-center text-[10px] uppercase tracking-widest text-white opacity-0 transition-opacity group-hover:opacity-100">
                  Visit YouTube channel
                </span>
              </a>
              <ul className="mb-6 space-y-2 text-sm text-gray-300">
                <li>I&apos;ve played piano on and off since I was a kid, with a long break during college</li>
                <li>Recently regained my passion for piano</li>
                <li>I enjoy applying a growth mindset to continually improve my playing</li>
                <li>There's no better feeling having everything come together after lots of practice</li>
                <li>Currently working toward recording and sharing covers and compositions</li>

              </ul>
              <a
                href="https://www.youtube.com/@XiaoDannyPiani"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto self-start inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2 text-xs uppercase tracking-widest text-white transition-colors hover:bg-white hover:text-black"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                  <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z" />
                </svg>
                HEAR ME PLAY
              </a>
            </div>

            {/* Gaming */}
            <div className="flex flex-col rounded-xl border border-white/10 bg-white/[0.02] p-6">
              <h3 className="text-lg font-semibold mb-4">Competitive Gaming</h3>
              <img
                src="/Images/BeyondTheCode/Gamer.jpg"
                alt="League of Legends"
                className="mb-4 aspect-video w-full rounded-lg border border-white/10 object-cover"
              />
<ul className="mb-6 space-y-2 text-sm text-gray-300">
  <li>I play League of Legends at a semi-professional level</li>
  <li>Maintained Challenger (the highest rank) for 5 consecutive years (Top 0.01% of players)</li>
  <li>Earned a scholarship to compete for UCI Esports</li>
  <li>Met many of my closest friends through both League of Legends and gaming in general</li>
  <li>Some games I&apos;m enjoying currently are Halo, Rainbow Six Siege, and Terraria</li>
</ul>
<div className="mt-auto flex flex-wrap items-center gap-3">
  <a
                href="https://www.twitch.tv/xiaodannylol"
                target="_blank"
                rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2 text-xs uppercase tracking-widest text-white transition-colors hover:bg-white hover:text-black"
                >
                  <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                    <path d="M4 3h17v12l-5 5h-4l-3 3v-3H4V3Zm2 2v13h4v1.2l1.2-1.2h4l3.8-3.8V5H6Zm3 3h2v5H9V8Zm4 0h2v5h-2V8Z" />
                  </svg>
                  WATCH ME STREAM
                </a>
                <a
                  href="https://www.youtube.com/@xiaodanny5288"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit Daniel Coyle's gaming YouTube channel"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-sm text-white transition-colors hover:bg-white hover:text-black"
                >
                  <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                    <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 px-6 text-center">
        <p className="mb-6 text-lg md:text-xl font-medium text-white">
          That&apos;s me.
        </p>
        <Link
          href="/"
          className="text-xs uppercase tracking-widest text-gray-400 hover:text-white transition-colors"
        >
          ← Back to Portfolio
        </Link>
        <div className="flex justify-center mt-10">
          <div className="w-24 h-px bg-white/15" />
        </div>
        <div className="mt-12 text-sm text-gray-400">
          <p>Designed &amp; Developed by</p>
          <p className="mt-1 font-semibold text-white">Daniel Coyle</p>
        </div>
      </footer>
    </div>
  );
}
