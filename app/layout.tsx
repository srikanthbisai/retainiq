import './globals.css';

export const metadata = {
  title: 'Variant Table UI',
  description: 'UI for managing states and variant columns dynamically',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100">{children}</body>
    </html>
  );
}
