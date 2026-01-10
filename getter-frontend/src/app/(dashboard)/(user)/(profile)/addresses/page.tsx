'use client';

import { MapPin, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AddressesPage() {
    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">My Addresses</h1>
                <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors">
                    <Plus className="w-4 h-4" />
                    Add New Address
                </button>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center"
            >
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No addresses saved</h3>
                <p className="text-gray-400 mb-6">Add an address to speed up your checkout process.</p>
            </motion.div>
        </div>
    );
}
