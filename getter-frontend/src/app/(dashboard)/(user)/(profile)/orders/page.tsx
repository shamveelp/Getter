'use client';

import { Package, Search } from 'lucide-react';
import { motion } from 'framer-motion';

export default function OrdersPage() {
    return (
        <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <h1 className="text-3xl font-bold">My Orders</h1>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search orders..."
                        className="bg-white/5 border border-white/10 rounded-xl px-10 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/50 w-full md:w-64 transition-all"
                    />
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center"
            >
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No orders found</h3>
                <p className="text-gray-400">You haven't placed any orders yet.</p>
            </motion.div>
        </div>
    );
}
