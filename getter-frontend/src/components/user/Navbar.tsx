"use client";

import Link from "next/link";
import { Search, ShoppingBag, Mouse as House, Store, Mail, X, LogIn, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { logout } from "@/redux/features/authSlice";
import { userAuthService } from "@/services/user/userAuthApiService";
import { toast } from "sonner";
import { RootState } from "@/redux/store";
import gsap from "gsap";

export default function Navbar() {
    const desktopNavRef = useRef<HTMLElement>(null);
    const mobileNavRef = useRef<HTMLElement>(null);
    const mobileSearchRef = useRef<HTMLDivElement>(null);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);

    const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch();
    const router = useRouter();

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Desktop Animation (Slide Down upon load)
            gsap.fromTo(
                desktopNavRef.current,
                { y: -100, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.5 }
            );

            // Mobile Navbar Animation (Slide Up upon load)
            gsap.fromTo(
                mobileNavRef.current,
                { y: 100, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.5 }
            );
        });
        return () => ctx.revert();
    }, []);

    // Handle Mobile Search Animation
    useEffect(() => {
        if (window.innerWidth < 768) {
            if (isSearchOpen) {
                gsap.to(mobileSearchRef.current, {
                    y: 0,
                    opacity: 1,
                    duration: 0.5,
                    ease: "power3.out",
                    pointerEvents: "all",
                });
            } else {
                gsap.to(mobileSearchRef.current, {
                    y: -100,
                    opacity: 0,
                    duration: 0.4,
                    ease: "power3.in",
                    pointerEvents: "none",
                });
            }
        }
    }, [isSearchOpen]);

    const handleLogout = async () => {
        try {
            await userAuthService.logout();
            dispatch(logout());
            setShowUserMenu(false);
            toast.success('Logged out successfully');
            router.push('/');
        } catch (error) {
            toast.error('Logout failed');
        }
    };

    return (
        <>
            {/* --- Desktop Navbar (Top) --- */}
            <nav
                ref={desktopNavRef}
                className="hidden md:flex fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-5xl rounded-full bg-black/40 backdrop-blur-xl border border-white/20 px-6 py-3 items-center justify-between shadow-[0_0_30px_0_rgba(255,255,255,0.1)] opacity-0"
            >
                {/* Brand Name (Hidden when search is open) */}
                {!isSearchOpen && (
                    <Link href="/" className="text-xl font-bold tracking-widest text-white hover:text-gray-300 transition-colors">
                        SKING.
                    </Link>
                )}

                {/* Navigation Links (Hidden when search is open) */}
                {!isSearchOpen && (
                    <div className="flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
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
                )}

                {/* Search Bar Container (Expands to fill) */}
                <div className={`flex items-center justify-end transition-all duration-500 ease-in-out ${isSearchOpen ? "w-full" : "w-auto"}`}>
                    {isSearchOpen ? (
                        <div className="w-full flex items-center gap-4">
                            <Search size={20} className="text-white shrink-0" />
                            <input
                                type="text"
                                autoFocus
                                placeholder="Search products..."
                                className="w-full bg-transparent text-white placeholder-gray-400 outline-none text-sm font-light tracking-wide"
                            />
                            <button
                                onClick={() => setIsSearchOpen(false)}
                                className="text-gray-400 hover:text-white transition-colors"
                                aria-label="Close Search"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    ) : (
                        /* Icons / Actions when Search Closed */
                        <div className="flex items-center gap-6">
                            <button
                                onClick={() => setIsSearchOpen(true)}
                                aria-label="Search"
                                className="text-gray-300 hover:text-white transition-colors hover:scale-110 active:scale-95 duration-200"
                            >
                                <Search size={20} />
                            </button>

                            {isAuthenticated ? (
                                <div className="relative">
                                    <button
                                        onClick={() => setShowUserMenu(!showUserMenu)}
                                        className="flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                                    >
                                        <User size={20} />
                                        <span className="hidden sm:inline">{user?.username}</span>
                                    </button>

                                    {showUserMenu && (
                                        <div className="absolute top-full right-0 mt-2 w-48 bg-black/90 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg py-2">
                                            <Link
                                                href="/profile"
                                                className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                                                onClick={() => setShowUserMenu(false)}
                                            >
                                                Profile
                                            </Link>
                                            <Link
                                                href="/orders"
                                                className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                                                onClick={() => setShowUserMenu(false)}
                                            >
                                                Orders
                                            </Link>
                                            <Link
                                                href="/settings"
                                                className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                                                onClick={() => setShowUserMenu(false)}
                                            >
                                                Settings
                                            </Link>
                                            <hr className="my-2 border-white/20" />
                                            <button
                                                onClick={handleLogout}
                                                className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-white/10 transition-colors"
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex items-center gap-4">
                                    <Link href="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                                        Login
                                    </Link>
                                    <Link href="/register" className="text-sm font-medium px-4 py-2 rounded-full bg-white text-black hover:bg-gray-200 transition-colors">
                                        Register
                                    </Link>
                                </div>
                            )}

                            <button aria-label="Cart" className="text-gray-300 hover:text-white transition-colors hover:scale-110 active:scale-95 duration-200 relative">
                                <ShoppingBag size={20} />
                            </button>
                        </div>
                    )}
                </div>
            </nav>

            {/* --- Mobile Top Search Bar (Floating) --- */}
            <div
                ref={mobileSearchRef}
                className="md:hidden fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md rounded-full bg-black/60 backdrop-blur-xl border border-white/20 px-6 py-3 flex items-center gap-3 shadow-[0_0_20px_0_rgba(255,255,255,0.1)] opacity-0 pointer-events-none"
            >
                <Search size={18} className="text-gray-300" />
                <input
                    type="text"
                    placeholder="Search..."
                    className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none text-sm"
                />
                <button onClick={() => setIsSearchOpen(false)} className="text-gray-300">
                    <X size={18} />
                </button>
            </div>

            {/* --- Mobile Navbar (Bottom) --- */}
            <nav
                ref={mobileNavRef}
                className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md rounded-2xl bg-black/60 backdrop-blur-xl border border-white/20 px-6 py-4 flex items-center justify-between shadow-[0_0_20px_0_rgba(255,255,255,0.1)] opacity-0"
            >
                <Link href="/" className="flex flex-col items-center gap-1 text-gray-300 hover:text-white transition-colors">
                    <House size={22} />
                </Link>
                <Link href="/shop" className="flex flex-col items-center gap-1 text-gray-300 hover:text-white transition-colors">
                    <Store size={22} />
                </Link>
                <button
                    onClick={() => setIsSearchOpen(true)}
                    aria-label="Search"
                    className={`flex flex-col items-center gap-1 transition-colors ${isSearchOpen ? "text-white scale-110" : "text-gray-300 hover:text-white"}`}
                >
                    <Search size={22} />
                </button>
                <Link href="/contact" className="flex flex-col items-center gap-1 text-gray-300 hover:text-white transition-colors">
                    <Mail size={22} />
                </Link>

                {isAuthenticated ? (
                    <Link href="/profile" className="flex flex-col items-center gap-1 text-gray-300 hover:text-white transition-colors">
                        <User size={22} />
                    </Link>
                ) : (
                    <Link href="/login" className="flex flex-col items-center gap-1 text-gray-300 hover:text-white transition-colors">
                        <LogIn size={22} />
                    </Link>
                )}
            </nav>

            {/* Click outside to close user menu */}
            {showUserMenu && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowUserMenu(false)}
                />
            )}
        </>
    );
}