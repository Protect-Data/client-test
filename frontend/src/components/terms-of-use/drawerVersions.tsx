"use client";

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle
} from "@headlessui/react";
import dayjs from "dayjs";
import { Check, CheckCircle2, ChevronRight, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function DrawerTermsVersions({
  open,
  setOpen,
  actual,
  versions
}: {
  open: boolean;
  setOpen: (e: boolean) => void;
  actual: any;
  versions: any;
}) {
  const [compare, setCompare] = useState<any>(null);

  useEffect(() => {
    if (!versions) {
      setCompare(null);
    }
  }, [versions]);

  return (
    <>
      <Dialog open={open} onClose={setOpen} className="relative z-50">
        <DialogBackdrop
          transition
          className="fixed bg-black/50 backdrop-blur-md inset-0 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
        />
        {compare ? (
          <>
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
              <button
                type="button"
                onClick={() => setCompare(null)}
                className="absolute right-4 top-4 p-2 rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2"
              >
                <span className="sr-only">Close</span>
                <X aria-hidden="true" className="h-6 w-6" />
              </button>
              <DialogPanel
                transition
                className="flex flex-col md:flex-row min-h-full items-end justify-center gap-4 p-4 text-center sm:items-center sm:p-0"
              >
                <div className="relative w-full transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95">
                  <div className="sm:flex sm:items-start">
                    <div className="w-full overflow-y-auto md:h-[600px]">
                      <h2 className="text-base font-semibold leading-7 text-gray-900">
                        Atual: {actual && actual.version}
                      </h2>
                      <div
                        className="mt-4 pt-4 border-t space-y-4 tracking-wide"
                        dangerouslySetInnerHTML={{
                          __html: actual.content
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="relative w-full transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95">
                  <div className="sm:flex sm:items-start">
                    <div className="w-full overflow-y-auto md:h-[600px]">
                      <h2 className="text-base font-semibold leading-7 text-gray-900">
                        Comparativo: {compare.version}
                      </h2>
                      <div
                        className="mt-4 pt-4 border-t space-y-4 tracking-wide"
                        dangerouslySetInnerHTML={{
                          __html: compare.content
                        }}
                      />
                    </div>
                  </div>
                </div>
              </DialogPanel>
            </div>
          </>
        ) : (
          <>
            <div className="fixed inset-0 overflow-hidden">
              <div className="absolute inset-0 overflow-hidden">
                <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
                  <DialogPanel
                    transition
                    className="pointer-events-auto w-screen max-w-lg transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
                  >
                    <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                      <div className="flex-1">
                        <div className="bg-gray-50 px-4 py-6 sm:px-6">
                          <div className="flex items-start justify-between space-x-3">
                            <div className="space-y-1">
                              <DialogTitle className="text-base font-semibold leading-6 text-gray-900">
                                Versões Anteriores
                              </DialogTitle>
                            </div>
                            <div className="flex h-7 items-center">
                              <button
                                type="button"
                                onClick={() => setOpen(false)}
                                className="relative text-gray-400 hover:text-gray-500"
                              >
                                <span className="absolute -inset-2.5" />
                                <span className="sr-only">Close panel</span>
                                <X aria-hidden="true" className="h-6 w-6" />
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4 py-6 sm:space-y-2 sm:divide-y sm:divide-gray-200 sm:py-0 p-6">
                          {versions &&
                            versions.map((x: any, k: number) => (
                              <button
                                key={k}
                                onClick={() => setCompare(x)}
                                disabled={
                                  actual && actual.version === x.version
                                }
                                className="w-full hover:bg-zinc-100 p-2 px-4 shadow-md disabled:cursor-not-allowed disabled:opacity-50 rounded-md border flex justify-between items-center hover:bgzinc-100 transition duration-300 ease-in-out"
                              >
                                <div className="flex flex-col font-semibold text-black items-start">
                                  {x.version}
                                  <small className="text-zinc-400 font-medium">
                                    {dayjs(x.updated_at).format("DD/MM/YYYY")}
                                  </small>
                                </div>
                                {actual && actual.version === x.version ? (
                                  <span className="p-1 px-2 rounded-md bg-zinc-900 text-white text-xs">
                                    Atual
                                  </span>
                                ) : (
                                  <ChevronRight size={16} />
                                )}
                              </button>
                            ))}
                        </div>
                      </div>
                    </div>
                  </DialogPanel>
                </div>
              </div>
            </div>
          </>
        )}
      </Dialog>
    </>
  );
}
