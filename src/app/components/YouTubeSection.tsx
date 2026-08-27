export default function YouTubeSection() {
  return (
    <section id="youtube" className="py-12">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-center">
          YouTube Channel
        </h2>
        <p className="text-gray-300 text-center mb-12 max-w-2xl mx-auto">
          Check out my content where I share insights on coding, gaming, and tech.
        </p>
        
        {/* Placeholder for YouTube content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Add your YouTube videos or channel embed here */}
          <div className="aspect-video bg-white/5 rounded-lg border border-white/10 flex items-center justify-center">
            <p className="text-gray-400">Video 1</p>
          </div>
          <div className="aspect-video bg-white/5 rounded-lg border border-white/10 flex items-center justify-center">
            <p className="text-gray-400">Video 2</p>
          </div>
          <div className="aspect-video bg-white/5 rounded-lg border border-white/10 flex items-center justify-center">
            <p className="text-gray-400">Video 3</p>
          </div>
        </div>

        {/* Optional: Link to channel */}
        <div className="text-center mt-8">
          <a
            href="https://youtube.com/@yourchannel" 
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block border border-white/20 text-white px-6 py-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
          >
            Visit Channel
          </a>
        </div>
      </div>
    </section>
  );
}
