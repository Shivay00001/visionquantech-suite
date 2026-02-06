import './globals.css';

export const metadata = {
  title: 'VisionQuantech Business Suite',
  description: 'Complete Business Management Platform - CRM, HR, Finance, Inventory & More',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
