import type { ReactNode } from "react";

/** Single source of truth for the page's content width and horizontal gutters. */
export const CONTAINER = "mx-auto w-full max-w-5xl px-6";

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
