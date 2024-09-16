import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { AppSidebar } from '@/components/app-sidebar';
import { ClientSidebarTrigger } from '@/components/client-sidebar-trigger';
import { SidebarLayout } from '@/components/ui/sidebar';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { cookies } = await import('next/headers');
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-[family-name:var(--font-geist-mono)] antialiased dark bg-accent`}
      >
        <SidebarLayout
          defaultOpen={cookies().get('sidebar:state')?.value === 'true'}
        >
          <AppSidebar />
          <main className="flex flex-1 flex-col transition-all duration-300 ease-in-out bg-background h-screen w-full overflow-none">
            <div className="h-full grid [&>*]:col-start-1 [&>*]:row-start-1">
              <div className="p-5 z-20 pointer-events-none">
                <div className="pointer-events-auto">
                  <ClientSidebarTrigger />
                </div>
              </div>
              {children}
            </div>
          </main>
        </SidebarLayout>
      </body>
    </html>
  );
}
