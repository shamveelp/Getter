'use client';

import { Wallet, CreditCard, Plus, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function WalletPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">My Wallet</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl p-6 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Wallet className="w-32 h-32 transform rotate-12" />
                    </div>

                    <div className="relative z-10">
                        <p className="text-purple-200 text-sm font-medium mb-1">Total Balance</p>
                        <h2 className="text-4xl font-bold text-white mb-6">$0.00</h2>

                        <div className="flex gap-3">
                            <button className="bg-white text-purple-600 px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-gray-100 transition-colors">
                                <Plus className="w-4 h-4" />
                                Add Funds
                            </button>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white/5 border border-white/10 rounded-2xl p-6"
                >
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-purple-500" />
                        Saved Cards
                    </h3>
                    <div className="flex flex-col items-center justify-center h-32 text-center">
                        <p className="text-gray-400 text-sm mb-3">No cards saved</p>
                        <button className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors">
                            + Add New Card
                        </button>
                    </div>
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-6"
            >
                <h3 className="text-lg font-semibold mb-6">Recent Transactions</h3>
                <div className="text-center py-12 text-gray-400">
                    No transactions yet
                </div>
            </motion.div>
        </div>
    );
}
