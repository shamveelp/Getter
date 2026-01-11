import React from 'react';
import Navbar from '@/components/user/Navbar';
import { Mail, MessageSquare, Phone } from 'lucide-react';

export default function SupportPage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black font-outfit">
            <Navbar />
            <div className="pt-32 px-4 md:px-8 max-w-4xl mx-auto space-y-12">

                <div className="text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
                        Help & Support
                    </h1>
                    <p className="text-neutral-400 max-w-xl mx-auto">
                        Need assistance with your booking? We're here to help.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-neutral-900/50 border border-white/5 rounded-2xl p-6 text-center space-y-4 hover:border-white/20 transition-colors">
                        <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto text-purple-400">
                            <MessageSquare size={24} />
                        </div>
                        <h3 className="font-semibold text-lg">Live Chat</h3>
                        <p className="text-sm text-neutral-400">Chat with our support team in real-time.</p>
                        <button className="text-sm font-medium text-white hover:underline">Start Chat</button>
                    </div>

                    <div className="bg-neutral-900/50 border border-white/5 rounded-2xl p-6 text-center space-y-4 hover:border-white/20 transition-colors">
                        <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto text-blue-400">
                            <Mail size={24} />
                        </div>
                        <h3 className="font-semibold text-lg">Email Us</h3>
                        <p className="text-sm text-neutral-400">Send us an email and we'll get back to you.</p>
                        <button className="text-sm font-medium text-white hover:underline">support@getter.com</button>
                    </div>

                    <div className="bg-neutral-900/50 border border-white/5 rounded-2xl p-6 text-center space-y-4 hover:border-white/20 transition-colors">
                        <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto text-green-400">
                            <Phone size={24} />
                        </div>
                        <h3 className="font-semibold text-lg">Phone</h3>
                        <p className="text-sm text-neutral-400">Call us for urgent inquiries.</p>
                        <button className="text-sm font-medium text-white hover:underline">+1 (555) 123-4567</button>
                    </div>
                </div>

                <div className="bg-neutral-900/30 border border-white/5 rounded-2xl p-8">
                    <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <h4 className="font-medium text-lg">How do I cancel a booking?</h4>
                            <p className="text-neutral-400 text-sm">You can cancel your booking from the 'My Tickets' section up to 24 hours before the event.</p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-medium text-lg">Can I get a refund?</h4>
                            <p className="text-neutral-400 text-sm">Refunds are processed automatically for cancellations made within the eligible window.</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
