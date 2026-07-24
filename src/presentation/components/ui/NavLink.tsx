"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const NavLink: React.FC<NavLinkProps> = ({ href, children, icon }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
        isActive
          ? "bg-purple-600/20 text-purple-300 border border-purple-500/30 shadow-sm"
          : "text-gray-400 hover:text-white hover:bg-white/5"
      }`}
    >
      {icon && <span className="text-sm">{icon}</span>}
      <span>{children}</span>
    </Link>
  );
};