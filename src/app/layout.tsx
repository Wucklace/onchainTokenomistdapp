import type { Metadata } from 'next';
import { Providers } from './providers';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Footer } from '@/components/layout/Footer';
import { BottomTabBar } from '@/components/layout/BottomTabBar';

// @ts-ignore
import './globals.css';

export const metadata: Metadata = {
  title: 'OnchainTokenomist',
  description: 'Verifiable Token Distribution Made Simple',
  icons: {
    icon: '/OTKM_logo.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#000000] text-white antialiased min-h-screen">
        <Providers>
          <div className="flex min-h-screen">
            {/* Sidebar — hidden on mobile, visible lg+ */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex flex-col flex-1 min-w-0">
              <Header />
              <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 lg:pb-8">
                {children}
              </main>
              <Footer />
            </div>
          </div>

          {/* Bottom Tab Bar — visible on mobile, hidden lg+ */}
          <BottomTabBar />
        </Providers>
      </body>
    </html>
  );
}