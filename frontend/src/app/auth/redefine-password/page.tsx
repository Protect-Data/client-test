"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { ChevronLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

type ForgotSchema = {
  email: string;
  password: string;
  code: string;
};

const forgotFormSchema = z.object({
  email: z.string().email("Informe um e-mail válido"),
  password: z.string().min(6, "Mínimo de 6 caracteres"),
  code: z.string().min(4, "Informe um código válido")
});

export default function RedefinePassPage() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<ForgotSchema>({
    resolver: zodResolver(forgotFormSchema)
  });
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  const paramsEmail = searchParams.get("email");

  useEffect(() => {
    if (paramsEmail) {
      setValue("email", paramsEmail);
    }
  }, [paramsEmail]);

  const handleForgot = async (data: any) => {
    setLoading(true);
    try {
      const { data: apiRequest } = await axios.post(
        "/api/v1/auth/redefine-pass",
        data
      );
      if (!apiRequest.success) {
        setLoading(false);
        toast.error(apiRequest.error);
        return false;
      }
      toast.success("Senha redefinida com sucesso!");
      console.log("apiRequest", apiRequest);
      router.push(`/auth/login`);
    } catch (err: any) {
      setLoading(false);
      toast.error(`${err.error}`);
      console.log("[handleLoginError]", err);
    }
  };

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
          <form onSubmit={handleSubmit(handleForgot)} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email
              </label>
              <div className="mt-2">
                <input
                  {...register("email")}
                  disabled={paramsEmail ? true : false}
                  type="email"
                  required
                  autoComplete="email"
                  className="block w-full disabled:cursor-not-allowed disabled:opacity-50 outline-none px-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-protectdata-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Nova Senha
              </label>
              <div className="mt-2">
                <input
                  {...register("password")}
                  type="password"
                  required
                  className="block w-full outline-none px-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-protectdata-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Código de Segurança
              </label>
              <div className="mt-2">
                <input
                  {...register("code")}
                  placeholder="0000"
                  type="text"
                  required
                  className="block w-full outline-none px-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-protectdata-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded-md bg-protectdata-500 px-3 py-1.5 text-sm font-semibold leading-6 text-black shadow-sm hover:bg-protectdata-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-protectdata-500"
              >
                {loading ? (
                  <Loader2 size={16} className="mx-auto animate-spin" />
                ) : (
                  `Redefinir Senha`
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
