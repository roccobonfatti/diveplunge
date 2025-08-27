export const metadata = {
  title: 'Diveplunge',
  description: 'Scopri i migliori spot per immersioni.',
  openGraph: {
    url: 'https://diveplunge.com',
    siteName: 'Diveplunge',
    type: 'website',
  },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
