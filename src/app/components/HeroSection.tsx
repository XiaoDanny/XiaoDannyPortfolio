import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8 flex justify-center">
          <Image
            src="/Images/Image1.jpg"
            alt="Daniel"
            width={200}
            height={200}
            className="rounded-full"
          />
        </div>
        <h1 className="text-5xl md:text-7xl font-bold mb-6">
          Hi, I&apos;m Daniel
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-8">
          Welcome to my portfolio
        </p>
      </div>
    </section>
  );
}
