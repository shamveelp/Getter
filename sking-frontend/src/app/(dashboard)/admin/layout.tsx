import { Outfit } from 'next/font/google';
import "flatpickr/dist/flatpickr.css";
import { SidebarProvider } from '@/context/admin/SidebarContext';
import { ThemeProvider } from '@/context/admin/ThemeContext';
import AdminProtectedRoute from '@/components/admin/auth/AdminProtectedRoute';

const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider>
      <SidebarProvider>
        <AdminProtectedRoute>
          {children}
        </AdminProtectedRoute>
      </SidebarProvider>
    </ThemeProvider>
  );
}
