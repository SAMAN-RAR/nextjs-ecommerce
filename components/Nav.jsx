"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const Nav = ({ children }) => {
  return (
    <div className="mx-auto bg-primary text-primary-foreground ">
      <div className="flex justify-between items-center container mx-auto px-4">
        {children}
      </div>
    </div>
  );
};

export const NavLink = ({ href, children }) => {
  const pathname = usePathname();
  return (
    <Link
      href={href}
      className={`p-4 hover:bg-secondary hover:text-secondary-foreground focus-visible:bg-secondary focus-visible:text-secondary-foreground ${
        pathname === href && "bg-background text-foreground"
      }`}
    >
      {children}
    </Link>
  );
};
