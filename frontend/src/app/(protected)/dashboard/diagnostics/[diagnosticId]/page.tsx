"use client";

import axios from "axios";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function DiagnosticPage({
  params: { diagnosticId }
}: {
  params: { diagnosticId: string };
}) {
  const { data: session }: any = useSession();
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingS, setLoadingS] = useState<boolean>(false);
  const [sent, setSent] = useState<boolean>(false);
  const [data, setData] = useState<any>(null);
  const [answers, setAnswers] = useState<any>([]);
  const [active, setActive] = useState<number>(0);

  const question = data ? data.questions[active] : null;

  useEffect(() => {
    if (!data) getDiagData();
  }, [data]);

  const getDiagData = async () => {
    setLoading(true);
    try {
      const { data: _diagnostic }: any = await axios.get(
        `/api/v1/diagnostics?id=${diagnosticId}`
      );
      setData(_diagnostic);
    } catch (error) {
      console.error("getDiagData", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (answer: string) => {
    const _answers = [...answers];
    _answers[active] = answer;
    setAnswers(_answers);
  };

  const handleNext = () => {
    setActive(active + 1);
  };
  const handlePrev = () => {
    setActive(active - 1);
  };

  const handleFinalize = async () => {
    setLoadingS(true);
    try {
      const { data: query }: any = await axios.post(
        `/api/v1/diagnostics?id=${data.id}`,
        { answers }
      );
      if (query.error) {
        toast.error(query.error);
        return false;
      }
      setSent(true);
    } catch (error) {
      console.error("handleFinalize", error);
      toast.error(
        "Falha ao enviar o diagnóstico, tente novamente mais tarde..."
      );
    } finally {
      setLoadingS(false);
    }
  };

  return !session ? (
    <></>
  ) : (
    <>
      <div className="w-full h-full flex justify-center items-center bg-zinc-100">
        {loading ? (
          <>
            <Loader2 size={24} className="animate-spin text-zinc-600" />
          </>
        ) : (
          <>
            <div className="w-full max-w-xl shadow-md p-4 px-6 rounded-md border border-zinc-200 bg-white">
              <div className="w-full flex flex-col">
                <h2 className="text-lg text-zinc-800 font-semibold">
                  {data.title}
                </h2>
                <p className="text-sm text-zinc-600">
                  {data.descr || `Formulário de Diagnóstico ProtectData.`}
                </p>
              </div>
              <div
                className={`w-full py-4 flex flex-col ${
                  sent ? `` : `border-t border-b`
                } my-4`}
              >
                {question ? (
                  <fieldset>
                    <h4 className="text-zinc-900 text-lg font-semibold">
                      {active + 1}. {question.title}
                    </h4>
                    <div className="mt-4 space-y-2">
                      {question.answers && question.answers.length >= 1 ? (
                        question.answers.map((x: any, k: number) => (
                          <div key={k} className="flex items-center gap-x-3">
                            <input
                              id={x.title}
                              name={question.title}
                              type="radio"
                              onClick={() => handleAnswer(x.title)}
                              className="h-4 w-4 border-gray-300 text-zinc-600 focus:ring-zinc-600"
                              checked={
                                answers[active] && answers[active] === x.title
                              }
                            />
                            <label
                              htmlFor={x.title}
                              className="block text-sm font-medium leading-6 text-gray-900"
                            >
                              {x.title}
                            </label>
                          </div>
                        ))
                      ) : (
                        <>
                          <textarea
                            rows={4}
                            placeholder="Resposta descritiva..."
                            onChange={(e: any) => handleAnswer(e.target.value)}
                            value={answers[active] ? answers[active] : ""}
                            name={question.title}
                            maxLength={200}
                            className="block w-full outline-none rounded-md border-0 p-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-zinc-600 sm:text-sm sm:leading-6"
                            defaultValue={
                              answers[active] ? answers[active] : ""
                            }
                          />
                          <div className="w-full text-right text-sm text-zinc-400">
                            {answers[active] ? answers[active].length : 0}/200
                          </div>
                        </>
                      )}
                    </div>
                  </fieldset>
                ) : (
                  <>
                    {sent ? (
                      <>
                        <div className="py-8 text-center">
                          <CheckCircle2
                            size={44}
                            className="mx-auto text-emerald-500 mb-2"
                          />
                          <span className="text-zinc-500">
                            Formulário enviado com sucesso!
                            <br /> Você já pode fechar essa página e voltar ao
                            dashboard...
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        {data.questions.map((x: any, k: number) => (
                          <div key={k} className="flex flex-col mb-4 last:mb-0">
                            <span className="font-semibold">
                              {k + 1}. {x.title}
                            </span>
                            <span className="text-zinc-500 text-sm">
                              {answers[k]}
                            </span>
                          </div>
                        ))}
                      </>
                    )}
                  </>
                )}
              </div>
              <div className="flex justify-between items-center">
                <div className="text-zinc-800 font-semibold">
                  {question ? (
                    <>
                      {active + 1}/{data.questions.length}
                    </>
                  ) : (
                    <></>
                  )}
                </div>
                {!sent && (
                  <div className="sm:flex sm:flex-row-reverse">
                    {question ? (
                      <button
                        type="button"
                        onClick={handleNext}
                        disabled={!answers[active] || answers[active] === ""}
                        className={`inline-flex disabled:cursor-not-allowed disabled:opacity-25 bg-zinc-800 w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto`}
                      >
                        Próximo
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleFinalize}
                        disabled={loadingS}
                        className={`inline-flex disabled:cursor-not-allowed disabled:opacity-25 bg-protectdata-600 w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto`}
                      >
                        {loadingS ? (
                          <Loader2 size={20} className="mx-auto animate-spin" />
                        ) : (
                          `Finalizar`
                        )}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={handlePrev}
                      disabled={active === 0 || loadingS}
                      className="mt-3 inline-flex disabled:cursor-not-allowed disabled:opacity-25 w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    >
                      Anterior
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
