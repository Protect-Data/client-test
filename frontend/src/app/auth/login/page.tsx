"use client";

import ReCaptchaCustom from "@/components/recaptcha";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const recaptchaKey = process.env.RECAPTCHA_KEY || "";

type LoginSchema = {
  email: string;
  password: string;
};

const loginFormSchema = z.object({
  email: z
    .string()
    .nonempty("O campo e-mail é obrigatório")
    .email("Informe um e-mail válido")
    .toLowerCase(),
  password: z.string().min(3, "A senha precisa de no mínimo 3 caracteres")
});

export default function AuthLoginPage() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginFormSchema)
  });
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const handleReCaptchaChange = (token: string) => {
    setCaptchaToken(token);
  };

  const handleLogin = async (data: any) => {
    if (recaptchaKey && !captchaToken) {
      toast.error(`Captcha obrigatório.`);
      return;
    }
    try {
      const { email, password } = data;
      setLoading(true);
      const resultSignin = await signIn("credentials", {
        email: email,
        password: password,
        redirect: false
      });
      if (resultSignin?.status !== 200) {
        setLoading(false);
        toast.error(`${resultSignin?.error || "Credenciais inválidas"}`);
      } else {
        router.push("/");
      }
      // console.log("handleLogin", resultSignin);
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
          <div className="mx-auto relative w-full h-10 invert">
            <Image
              alt="Protect Data"
              fill
              src="/assets/logo-protect-data-white.png"
              className="object-contain"
            />
          </div>
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Bem-vindo(a)
            <em className="font-extrabold text-protectdata-600 -ml-0.5">!</em>
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit(handleLogin)} className="space-y-6">
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
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Senha
                </label>
                <div className="text-sm">
                  <Link
                    href="/auth/forgot-password"
                    className="font-semibold text-protectdata-500 hover:text-protectdata-600"
                  >
                    Esqueceu sua senha?
                  </Link>
                </div>
              </div>
              <div className="mt-2">
                <input
                  {...register("password")}
                  type="password"
                  required
                  autoComplete="current-password"
                  className="block w-full outline-none px-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-protectdata-500 sm:text-sm sm:leading-6"
                />
              </div>
              <ReCaptchaCustom onChange={handleReCaptchaChange} />
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-protectdata-500 px-3 py-1.5 text-sm font-semibold leading-6 text-black shadow-sm hover:bg-protectdata-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-protectdata-500"
              >
                {loading ? (
                  <Loader2 size={16} className="mx-auto animate-spin" />
                ) : (
                  `Entrar`
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
