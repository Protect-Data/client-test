"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Frown, Loader2 } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import QRCode from "react-qr-code";

type LoginSchema = {
  code: string;
};

const loginFormSchema = z.object({
  code: z
    .string()
    .regex(/^\d{6}$/, "O código deve conter exatamente 6 dígitos.")
});

export default function TwoFactorAuthentication() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginFormSchema)
  });
  const { data: session }: any = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingQr, setLoadingQr] = useState<boolean>(false);
  const [loading2f, setLoading2f] = useState<boolean>(false);
  const [qrcode, setQrcode] = useState<string>("");
  const [locked, setLocked] = useState<boolean>(true);

  useEffect(() => {
    if (session && qrcode === "") {
      getActiveQrCode();
    }
  }, [session, qrcode]);

  const getActiveQrCode = async () => {
    setLoadingQr(true);
    try {
      const { data: response } = await axios.get("/api/v1/auth/two-factor");
      if (!response.success) {
        // toast.error(`Falha ao recuperar QRcode`);
        return false;
      }
      setQrcode(response.qrCodeImage);
    } catch (err: any) {
      toast.error(`${err.error}`);
      console.log("[handleLoginError]", err);
    } finally {
      setLoadingQr(false);
    }
  };

  const handleLogin = async (data: any) => {
    setLoading2f(true);
    try {
      const { data: response } = await axios.post("/api/v1/auth/two-factor", {
        code: data.code
      });
      if (!response.token) {
        toast.error(`Token inválido`);
        return false;
      }
      toast.success("Segundo fator autenticado, redirecionando...");
      router.push(`/dashboard/tasks`);
    } catch (err: any) {
      toast.error(`${err.error}`);
      console.log("[handleLoginError]", err);
    } finally {
      setLoading2f(false);
    }
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="mx-auto relative w-full h-10 invert">
            <Image
              alt="Protect Data"
              fill
              src="/assets/logo-protect-data-white.png"
              className="object-contain"
            />
          </div>
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Autenticação de Dois Fatores
            <em className="font-extrabold text-protectdata-600 -ml-0.5">!</em>
          </h2>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          {!session ? (
            <Loader2 size={20} className="mx-auto animate-spin" />
          ) : !session.two_factor.active || qrcode ? (
            <>
              <div className="w-full flex justify-between items-center gap-x-8">
                <div className="w-44 h-44 bg-white border border-zinc-300 rounded-xl p-4 shadow-lg flex justify-center items-center">
                  {loadingQr ? (
                    <Loader2 className="animate-spin" />
                  ) : qrcode !== "" ? (
                    <Image src={qrcode} width={176} height={176} alt="qrcode" />
                  ) : (
                    <Frown size={44} className="text-zinc-400" />
                  )}
                </div>
                <div className="flex-1 font-medium text-zinc-500">
                  Escaneie o QRCode usando o app Google Authenticator ou
                  similar.
                </div>
              </div>

              <form
                onSubmit={handleSubmit(handleLogin)}
                className="space-y-6 mt-8 py-6 border-t border-zinc-200"
              >
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Código Google Authenticator
                  </label>
                  <div className="mt-2">
                    <input
                      {...register("code")}
                      type="text"
                      required
                      disabled={loading2f}
                      minLength={6}
                      pattern="\d*"
                      maxLength={6}
                      placeholder="______"
                      className="block text-center w-full outline-none px-3 rounded-md border-0 py-1.5 text-gray-900 disabled:cursor-not-allowed disabled:opacity-50 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-protectdata-500 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-protectdata-500 px-3 py-1.5 text-sm font-semibold leading-6 disabled:cursor-not-allowed disabled:opacity-50 text-black shadow-sm hover:bg-protectdata-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-protectdata-500"
                  >
                    {loading2f ? (
                      <Loader2 size={16} className="mx-auto animate-spin" />
                    ) : (
                      `Autenticar`
                    )}
                  </button>
                </div>
              </form>

              <div className="w-full mt-2 py-6 border-t border-zinc-200 flex justify-center items-center">
                <button
                  onClick={() =>
                    signOut({
                      callbackUrl: "/auth/login"
                    })
                  }
                  className="w-full bg-zinc-50 hover:bg-red-100 hover:text-red-500 text-sm text-zinc-500 capitalize p-2 flex justify-center items-center rounded-md transition duration-300 ease-in-out"
                >
                  cancelar sessão
                </button>
              </div>
            </>
          ) : (
            <>
              <form onSubmit={handleSubmit(handleLogin)} className="space-y-6 ">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Código Google Authenticator
                  </label>
                  <div className="mt-2">
                    <input
                      {...register("code")}
                      type="text"
                      required
                      disabled={loading2f}
                      minLength={6}
                      pattern="\d*"
                      maxLength={6}
                      placeholder="______"
                      className="block text-center w-full outline-none px-3 rounded-md border-0 py-1.5 text-gray-900 disabled:cursor-not-allowed disabled:opacity-50 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-protectdata-500 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-protectdata-500 px-3 py-1.5 text-sm font-semibold leading-6 disabled:cursor-not-allowed disabled:opacity-50 text-black shadow-sm hover:bg-protectdata-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-protectdata-500"
                  >
                    {loading2f ? (
                      <Loader2 size={16} className="mx-auto animate-spin" />
                    ) : (
                      `Autenticar`
                    )}
                  </button>
                </div>
              </form>
              <div className="w-full mt-6 py-6 border-t border-zinc-200 flex justify-center items-center">
                <button
                  onClick={() =>
                    signOut({
                      callbackUrl: "/auth/login"
                    })
                  }
                  className="w-full bg-zinc-50 hover:bg-red-100 hover:text-red-500 text-sm text-zinc-500 capitalize p-2 flex justify-center items-center rounded-md transition duration-300 ease-in-out"
                >
                  cancelar sessão
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
