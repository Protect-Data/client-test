import { ReactNode } from "react";

export default function DiagRootLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="w-full py-4 flex justify-center items-center shadow-md fixed bg-zinc-900">
        <img
          alt="Protect Data"
          src="/assets/logo-protect-data-white.png"
          className="h-8 w-auto"
        />
      </div>
      {children}
    </>
  );
}
