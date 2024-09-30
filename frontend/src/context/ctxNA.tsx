"use client";

import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";

interface propsSession {
  children: ReactNode;
}

export default function AppProviders({ children }: propsSession) {
  return (
    <>
      <SessionProvider>{children}</SessionProvider>
    </>
  );
}
