"use client";

import Link from "next/link";
import { Search, User, ShoppingBag } from "lucide-react";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Navbar() {
    const navRef = useRef<HTMLElement>(null);

    useEffect(() => {
        // Simple entrance animation
        gsap.fromTo(
            navRef.current,
            { y: -100, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.5 }
        );
    }, []);

    return (
        <nav
            ref={navRef}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-5xl rounded-full bg-black/40 backdrop-blur-xl border border-white/20 px-8 py-4 flex items-center justify-between shadow-[0_0_30px_0_rgba(255,255,255,0.1)] opacity-0"
        >
            {/* Brand Name */}
            <Link href="/" className="text-xl font-bold tracking-widest text-white hover:text-gray-300 transition-colors">
                SKING.
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-8">
                {["Home", "Shop", "Contact"].map((item) => (
                    <Link
                        key={item}
                        href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                        className="text-sm font-medium text-gray-300 hover:text-white transition-colors relative group"
                    >
                        {item}
                        <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full" />
                    </Link>
                ))}
            </div>

            {/* Icons / Actions */}
            <div className="flex items-center gap-6">
                <button aria-label="Search" className="text-gray-300 hover:text-white transition-colors hover:scale-110 active:scale-95 duration-200">
                    <Search size={20} />
                </button>
                <button aria-label="User Profile" className="text-gray-300 hover:text-white transition-colors hover:scale-110 active:scale-95 duration-200">
                    <User size={20} />
                </button>
                <button aria-label="Cart" className="text-gray-300 hover:text-white transition-colors hover:scale-110 active:scale-95 duration-200 relative">
                    <ShoppingBag size={20} />
                    {/* Optional: Cart badge placeholder */}
                    {/* <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span> */}
                </button>
            </div>
        </nav>
    );
}
