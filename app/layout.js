import './globals.css';

export const metadata = {
  title: 'ORBIT Lab Beta',
  description: 'Crypto strategy research and secure digital delivery.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
