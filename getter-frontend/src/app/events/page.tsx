import React from 'react';
import Navbar from '@/components/user/Navbar';

export default function EventsPage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black font-outfit">
            <Navbar />
            <div className="pt-32 px-4 md:px-8 max-w-7xl mx-auto space-y-12">

                {/* Header */}
                <div className="text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
                        Upcoming Events
                    </h1>
                    <p className="text-neutral-400 max-w-2xl mx-auto">
                        Explore and book tickets for the hottest concerts, workshops, and gatherings in your city.
                    </p>
                </div>

                {/* Categories (Mock) */}
                <div className="flex flex-wrap justify-center gap-4">
                    {["All", "Concerts", "Workshops", "Meetups", "Nightlife"].map((cat) => (
                        <button key={cat} className="px-6 py-2 rounded-full border border-white/10 hover:bg-white/10 transition-colors text-sm font-medium">
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Event Grid (Mock) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3, 4, 5, 6].map((item) => (
                        <div key={item} className="group relative bg-neutral-900/50 border border-white/5 rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-300">
                            {/* Image Placeholder */}
                            <div className="aspect-[4/3] bg-neutral-800 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                                {/* Random colored orb for visual interest */}
                                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full blur-3xl opacity-50 ${item % 2 === 0 ? 'bg-purple-600' : 'bg-blue-600'}`} />

                                <span className="absolute top-4 right-4 z-20 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium border border-white/10">
                                    {item % 2 === 0 ? 'Concert' : 'Workshop'}
                                </span>
                            </div>

                            {/* Content */}
                            <div className="p-6 space-y-4">
                                <div className="space-y-1">
                                    <p className="text-sm text-brand-400 font-medium">Fri, Aug {10 + item} • 8:00 PM</p>
                                    <h3 className="text-xl font-semibold group-hover:text-brand-400 transition-colors">
                                        {item % 2 === 0 ? 'Neon Nights Festival' : 'Creative Design Summit'}
                                    </h3>
                                    <p className="text-sm text-neutral-400">Grand Arena, New York</p>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                    <span className="text-lg font-bold">$ {item * 20 + 50}</span>
                                    <button className="px-4 py-2 bg-white text-black rounded-full text-sm font-medium hover:bg-neutral-200 transition-colors">
                                        Book Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}
