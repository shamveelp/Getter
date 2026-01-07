'use client';

import { UserSidebar } from '@/layout/user/UserSidebar';

export default function UserLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white pt-24 pb-12 px-4 md:px-8">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
                <UserSidebar />
                <main className="flex-1 min-w-0">
                    {children}
                </main>
            </div>
        </div>
    );
}
