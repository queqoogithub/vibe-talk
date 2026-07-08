"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageCircle, BarChart3, BookOpen, Settings } from "lucide-react";

const navItems = [
  { href: "/", label: "Chat", icon: MessageCircle },
  { href: "/dashboard", label: "Stats", icon: BarChart3 },
  { href: "/vocabulary", label: "Vocab", icon: BookOpen },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-t border-pastel-border safe-area-bottom">
      <div className="max-w-lg mx-auto flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-0.5 px-4 py-2 rounded-xl transition-all duration-200 ${
                isActive
                  ? "text-pastel-pink-dark"
                  : "text-pastel-text-light hover:text-pastel-text"
              }`}
            >
              <item.icon
                size={22}
                strokeWidth={isActive ? 2.5 : 1.8}
                className="transition-all"
              />
              <span className="text-[11px] font-medium">{item.label}</span>
              {isActive && (
                <div className="absolute -bottom-0.5 w-6 h-0.5 rounded-full bg-pastel-pink" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
