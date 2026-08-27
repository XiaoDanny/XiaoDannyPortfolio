import Image from "next/image";
import { SOCIAL_LINKS } from "../constants";

export default function SocialLinks() {
  return (
    <div className="flex gap-4 mt-6 md:translate-x-4">
      <a
        href={SOCIAL_LINKS.linkedin}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Image
          src="/Images/Image2.svg"
          alt="LinkedIn profile"
          width={48}
          height={48}
          className="w-12 h-12 hover:opacity-80 transition-opacity"
        />
      </a>
      <a
        href={SOCIAL_LINKS.github}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Image
          src="/Images/Image3.svg"
          alt="GitHub profile"
          width={48}
          height={48}
          className="w-12 h-12 hover:opacity-80 transition-opacity"
        />
      </a>
    </div>
  );
}
