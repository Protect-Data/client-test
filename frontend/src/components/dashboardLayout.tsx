"use client";

import { ReactNode, useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  TransitionChild
} from "@headlessui/react";
import {
  Activity,
  Bell,
  BookmarkCheck,
  ChartBar,
  ChevronDown,
  EarthLock,
  GlobeLock,
  HomeIcon,
  ListIcon,
  MenuIcon,
  PaperclipIcon,
  Plug,
  Search,
  Stethoscope,
  UsersIcon,
  X
} from "lucide-react";
import classNames from "@/utils/classNames";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import AvatarName from "./avatarName";
import SearchPallete from "./commandPallete";

const teams = [
  { id: 1, name: "Heroicons", href: "#", initial: "H", current: false },
  { id: 2, name: "Tailwind Labs", href: "#", initial: "T", current: false },
  { id: 3, name: "Workcation", href: "#", initial: "W", current: false }
];
const userNavigation: any = [];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [search, setSearch] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const pathname = usePathname();
  const { data: session }: any = useSession();

  const navigation =
    session && session.manager
      ? [
          {
            name: "Tarefas",
            href: "/dashboard/tasks",
            icon: BookmarkCheck,
            current: pathname.includes("/dashboard/tasks")
          },
          {
            name: "Usuários",
            href: "/dashboard/users",
            icon: UsersIcon,
            current: pathname.includes("/dashboard/users")
          },
          {
            name: "Diagnósticos",
            href: "/dashboard/diagnostics",
            icon: Activity,
            current: pathname.includes("/dashboard/diagnostics")
          },
          {
            name: "Documentos",
            href: "/dashboard/documents",
            icon: PaperclipIcon,
            current: pathname.includes("/dashboard/documents")
          },
          {
            name: "Política de Privacidade",
            href: "/dashboard/policies",
            icon: GlobeLock,
            current: pathname.includes("/dashboard/policies")
          },
          {
            name: "Relatórios",
            href: "/dashboard/reports",
            icon: ChartBar,
            current: pathname.includes("/dashboard/reports")
          }
        ]
      : [
          {
            name: "Tarefas",
            href: "/dashboard/tasks",
            icon: BookmarkCheck,
            current: pathname.includes("/dashboard/tasks")
          },
          {
            name: "Diagnósticos",
            href: "/dashboard/diagnostics",
            icon: Activity,
            current: pathname.includes("/dashboard/diagnostics")
          },
          {
            name: "Documentos",
            href: "/dashboard/documents",
            icon: PaperclipIcon,
            current: pathname.includes("/dashboard/documents")
          },
          {
            name: "Relatórios",
            href: "/dashboard/reports",
            icon: ChartBar,
            current: pathname.includes("/dashboard/reports")
          }
        ];

  return (
    <>
      <SearchPallete open={search} setOpen={setSearch} />
      <div>
        <Dialog
          open={sidebarOpen}
          onClose={setSidebarOpen}
          className="relative z-50 lg:hidden"
        >
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-zinc-900/80 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
          />

          <div className="fixed inset-0 flex">
            <DialogPanel
              transition
              className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-[closed]:-translate-x-full"
            >
              <TransitionChild>
                <div className="absolute left-full top-0 flex w-16 justify-center pt-5 duration-300 ease-in-out data-[closed]:opacity-0">
                  <button
                    type="button"
                    onClick={() => setSidebarOpen(false)}
                    className="-m-2.5 p-2.5"
                  >
                    <span className="sr-only">Close sidebar</span>
                    <X aria-hidden="true" className="h-6 w-6 text-white" />
                  </button>
                </div>
              </TransitionChild>
              {/* Sidebar component, swap this element with another sidebar if you like */}
              <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-zinc-900 px-6 pb-4 ring-1 ring-white/10">
                <div className="flex h-16 shrink-0 items-center">
                  <img
                    alt="Protect Data"
                    src="/public/assets/logo-protect-data-white.png"
                    className="h-8 w-auto"
                  />
                </div>
                <nav className="flex  flex-1 flex-col">
                  <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    <li>
                      <ul role="list" className="-mx-2 space-y-1">
                        {navigation.map((item) => (
                          <li key={item.name}>
                            <a
                              href={item.href}
                              className={classNames(
                                item.current
                                  ? "bg-zinc-800 text-white"
                                  : "text-zinc-400 hover:bg-zinc-800 hover:text-white",
                                "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                              )}
                            >
                              <item.icon
                                aria-hidden="true"
                                className="h-6 w-6 shrink-0"
                              />
                              {item.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </li>
                  </ul>
                </nav>
              </div>
            </DialogPanel>
          </div>
        </Dialog>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-zinc-900 px-6 pb-4">
            <div className="flex h-16 shrink-0 items-center">
              <img
                alt="Protect Data"
                src="/public/assets/logo-protect-data-white.png"
                className="h-8 w-auto"
              />
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map((item) => (
                      <li key={item.name}>
                        <a
                          href={item.href}
                          className={classNames(
                            item.current
                              ? "bg-zinc-800 text-white"
                              : "text-zinc-400 hover:bg-zinc-800 hover:text-white",
                            "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                          )}
                        >
                          <item.icon
                            aria-hidden="true"
                            className="h-6 w-6 shrink-0"
                          />
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
                <li className="sm:hidden">
                  <div className="text-xs font-semibold leading-6 text-zinc-400">
                    Diagnósticos
                  </div>
                  <ul role="list" className="-mx-2 mt-2 space-y-1">
                    {teams.map((team) => (
                      <li key={team.name}>
                        <a
                          href={team.href}
                          className={classNames(
                            team.current
                              ? "bg-zinc-800 text-white"
                              : "text-zinc-400 hover:bg-zinc-800 hover:text-white",
                            "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                          )}
                        >
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-800 text-[0.625rem] font-medium text-zinc-400 group-hover:text-white">
                            {team.initial}
                          </span>
                          <span className="truncate">{team.name}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="lg:pl-72">
          <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-zinc-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="-m-2.5 p-2.5 text-zinc-700 lg:hidden"
            >
              <span className="sr-only">Open sidebar</span>
              <MenuIcon aria-hidden="true" className="h-6 w-6" />
            </button>

            {/* Separator */}
            <div
              aria-hidden="true"
              className="h-6 w-px bg-zinc-900/10 lg:hidden"
            />

            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
              <div
                className="relative flex flex-1"
                onClick={() => setSearch(true)}
              >
                <label htmlFor="search-field" className="sr-only">
                  Pesquisar
                </label>
                <Search
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-zinc-400"
                />
                <input
                  id="search-field"
                  type="text"
                  autoComplete="new-password"
                  placeholder="Pesquisar..."
                  className="block h-full outline-none w-full border-0 py-0 pl-8 pr-0 text-zinc-900 placeholder:text-zinc-400 focus:ring-0 sm:text-sm"
                />
              </div>
              <div className="flex items-center gap-x-4 lg:gap-x-6">
                <button
                  type="button"
                  className="-m-2.5 p-2.5 text-zinc-400 hover:text-zinc-500"
                >
                  <span className="sr-only">View notifications</span>
                  <Bell aria-hidden="true" className="h-6 w-6" />
                </button>

                {/* Separator */}
                <div
                  aria-hidden="true"
                  className="hidden lg:block lg:h-6 lg:w-px lg:bg-zinc-900/10"
                />

                {/* Profile dropdown */}
                <Menu as="div" className="relative">
                  <MenuButton className="-m-1.5 flex items-center p-1.5">
                    <span className="sr-only">Open user menu</span>
                    {session ? (
                      <AvatarName
                        name={session.name}
                        isAdmin={session.manager}
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-zinc-200" />
                    )}
                    <span className="hidden lg:flex lg:items-center">
                      <span
                        aria-hidden="true"
                        className="ml-4 text-sm font-semibold leading-6 text-zinc-900"
                      >
                        {session ? session.name : `Protect`}
                      </span>
                      <ChevronDown
                        aria-hidden="true"
                        className="ml-2 h-5 w-5 text-zinc-400"
                      />
                    </span>
                  </MenuButton>
                  <MenuItems
                    transition
                    className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-zinc-900/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                  >
                    {userNavigation.map((item: any) => (
                      <MenuItem key={item.name}>
                        <a
                          href={item.href}
                          className="block px-3 py-1 text-sm leading-6 text-zinc-900 data-[focus]:bg-zinc-50"
                        >
                          {item.name}
                        </a>
                      </MenuItem>
                    ))}
                    <MenuItem>
                      <button
                        onClick={() => signOut({ callbackUrl: "/auth/login" })}
                        className="block w-full px-3 py-1 text-sm leading-6 text-zinc-900 data-[focus]:bg-zinc-50"
                      >
                        Deslogar
                      </button>
                    </MenuItem>
                  </MenuItems>
                </Menu>
              </div>
            </div>
          </div>

          <main className="py-10">
            <div className="px-4 sm:px-6 lg:px-8">{children}</div>
          </main>
        </div>
      </div>
    </>
  );
}
