"use client";

import { cn } from "@/lib/utils";
import Link, { LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import { forwardRef } from "react";

interface NavLinkCompatProps extends Omit<LinkProps, "className"> {
  children: React.ReactNode;
  className?: string;
  activeClassName?: string;
  exact?: boolean;
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkCompatProps>(
  ({ className, exact = false, href, children, ...props }, ref) => {
    const pathname = usePathname();

    const activeClassName = "bg-primary text-white font-medium";

    // Normalize URLs for comparison
    const normalizeUrl = (url: string) => {
      return url.replace(/\/$/, ""); // Remove trailing slash
    };

    const currentPath = normalizeUrl(pathname || "");
    const targetPath = normalizeUrl(
      typeof href === "string" ? href : href.pathname || "",
    );

    // Determine if link is active
    let isActive = false;

    if (exact) {
      isActive = currentPath === targetPath;
    } else {
      isActive =
        currentPath.startsWith(targetPath) &&
        (targetPath === "" ||
          currentPath === targetPath ||
          currentPath.charAt(targetPath.length) === "/");
    }

    return (
      <Link
        ref={ref}
        href={href}
        className={cn(className, isActive && activeClassName)}
        {...props}
      >
        {children}
      </Link>
    );
  },
);

NavLink.displayName = "NavLink";

export { NavLink };
