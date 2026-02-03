import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { User, MapPin, Package, Wallet, LogOut, LayoutDashboard } from 'lucide-react'; // Added LayoutDashboard for dashboard link if needed
import { useDispatch } from 'react-redux';
import { logout } from '@/redux/features/authSlice';
import { userAuthService } from '@/services/user/userAuthApiService';
import { toast } from 'sonner';

const sidebarItems = [
    {
        title: 'My Profile',
        href: '/profile',
        icon: User,
    },
    {
        title: 'Addresses',
        href: '/addresses',
        icon: MapPin,
    },
    {
        title: 'My Orders',
        href: '/orders',
        icon: Package,
    },
    {
        title: 'Wallet',
        href: '/wallet',
        icon: Wallet,
    },
];

export function UserSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const dispatch = useDispatch();

    const handleLogout = async () => {
        try {
            await userAuthService.logout();
            dispatch(logout());
            toast.success('Logged out successfully');
            router.push('/login');
        } catch (error) {
            toast.error('Logout failed');
        }
    };

    return (
        <aside className="w-full md:w-64 flex-shrink-0">
            <div className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden sticky top-24">
                <div className="p-6 border-b border-white/10">
                    <h2 className="text-xl font-bold text-white">Account</h2>
                    <p className="text-sm text-gray-500">Manage your account</p>
                </div>

                <nav className="p-4 space-y-2">
                    {sidebarItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                    ? "bg-purple-600 text-white shadow-lg shadow-purple-900/20"
                                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                                    }`}
                            >
                                <item.icon className={`w-5 h-5 transition-colors ${isActive ? "text-white" : "text-gray-500 group-hover:text-purple-400"
                                    }`} />
                                <span className="font-medium">{item.title}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-white/10 mt-2">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-red-500/10 hover:text-red-500 transition-all duration-200 group text-left"
                    >
                        <LogOut className="w-5 h-5 text-gray-500 group-hover:text-red-500 transition-colors" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </div>
        </aside>
    );
}
