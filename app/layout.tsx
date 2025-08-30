import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Diveplunge',
  description: 'Scopri i migliori spot subacquei.',
  openGraph: {
    title: 'Diveplunge',
    description: 'Scopri i migliori spot subacquei.',
    url: 'https://diveplunge.com',
    siteName: 'Diveplunge',
    type: 'website'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}