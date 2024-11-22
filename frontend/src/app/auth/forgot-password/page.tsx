"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { ChevronLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

type ForgotSchema = {
  email: string;
};

const forgotFormSchema = z.object({
  email: z.string().email("Informe um e-mail válido").toLowerCase()
});

export default function ForgotPassPage() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<ForgotSchema>({
    resolver: zodResolver(forgotFormSchema)
  });
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleForgot = async (data: any) => {
    setLoading(true);
    try {
      const { data: apiRequest } = await axios.post(
        "/api/v1/auth/forgot-pass",
        { ...data }
      );
      if (!apiRequest.success) {
        setLoading(false);
        toast.error(apiRequest.error);
        return false;
      }
      toast.success(
        "Verifique o código enviado no seu email para redefinir a senha..."
      );
      console.log("apiRequest", apiRequest);
      router.push(`/auth/redefine-password?email=${data.email}`);
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
            src="/assets/logo-protect-data-white.png"
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
                  type="email"
                  required
                  autoComplete="email"
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
                  `Solicitar Redefinição`
                )}
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
