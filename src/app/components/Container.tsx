import type { ReactNode } from "react";

/**
 * Single source of truth for the page's content width and horizontal gutters.
 *
 * On desktop (lg+), content is a single reading column that starts just right of the
 * Spine nav, which sits at the page's literal one-third mark (see Spine.tsx) — content no
 * longer self-centers on the page. Below lg there's no Spine, so it centers normally.
 */
export const CONTAINER = "mx-auto w-full max-w-2xl px-6 lg:mx-0 lg:ml-[calc(33.333%+2rem)]";

export default function Container({
  as: Tag = "div",
  className = "",
  children,
  ...rest
}: {
  as?: "div" | "section" | "nav" | "footer" | "header";
  className?: string;
  children: ReactNode;
} & React.HTMLAttributes<HTMLElement>) {
  return (
    <Tag className={`${CONTAINER} ${className}`.trim()} {...rest}>
      {children}
    </Tag>
  );
}
