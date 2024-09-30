import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function ForgotPassPage() {
  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            alt="Protect Data"
            src="/public/assets/logo-protect-data-white.png"
            className="mx-auto h-10 w-auto invert"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Redefinição de Senha
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form action="#" method="POST" className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-protectdata-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-protectdata-500 px-3 py-1.5 text-sm font-semibold leading-6 text-black shadow-sm hover:bg-protectdata-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-protectdata-500"
              >
                Solicitar Redefinição
              </button>
            </div>
            <div>
              <Link
                href="/auth/login"
                className="flex items-center gap-x-1 hover:opacity-85"
              >
                <ChevronLeft size={16} />
                Voltar ao Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
