'use client';

import { NextUIProvider } from '@nextui-org/react'
import { UserProvider } from '../contexts/UserContext';
import Header from '../components/Header';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <NextUIProvider>
          <UserProvider>
            <Header />
            <main>{children}</main>
          </UserProvider>
        </NextUIProvider>
      </body>
    </html>
  );
}