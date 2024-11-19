"use client";

import DashboardLayout from "@/components/dashboardLayout";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
dayjs.locale("pt-br");
import { useEffect, useState } from "react";

import { Bar, Doughnut, Line, Pie, Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  RadialLinearScale,
  ArcElement,
  Colors,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import axios from "axios";
import { AlertTriangle, ChevronDown, ThumbsUp } from "lucide-react";
import Image from "next/image";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  ArcElement,
  Colors,
  Title,
  Tooltip,
  Legend
);

const Velocimetro = ({ valor }: { valor: number }) => {
  const maxValor = 100; // valor máximo do velocímetro
  const angle = (valor / maxValor) * 180; // converte valor para ângulo

  return (
    <>
      <div className="relative select-none">
        <div className="flex items-center justify-center max-w-[220px] mx-auto">
          <div className="relative w-full h-0 pb-[50%] max-w-[220px] overflow-hidden">
            <div
              className={`absolute inset-0 border-[8px] ${
                valor <= 20
                  ? `border-red-500`
                  : valor <= 75
                  ? `border-yellow-500`
                  : `border-emerald-500`
              }  rounded-t-full border-b-0`}
            />
            <div
              className="absolute inset-0 border-[8px] border-zinc-300 rounded-t-full border-b-0"
              style={{
                transform: `rotate(${angle}deg)`,
                transformOrigin: "center bottom"
              }}
            />
          </div>
        </div>
      </div>
      <div className="w-full group text-sm px-8 overflow-hidden -mt-12 md:-mt-16 flex flex-col justify-center items-center">
        {valor <= 20 ? (
          <>
            <div className="w-20 h-20 flex justify-center rounded-full items-center bg-red-50 text-red-500">
              <AlertTriangle size={32} />
            </div>
          </>
        ) : valor <= 75 ? (
          <>
            <div className="w-20 h-20 flex justify-center rounded-full items-center bg-yellow-50 text-yellow-500">
              <AlertTriangle size={32} />
            </div>
          </>
        ) : (
          <>
            <Image
              src="/assets/sentiment/happy.png"
              width={95}
              height={83}
              alt="happy green face"
            />
          </>
        )}
        {valor <= 20 ? (
          <>
            <div className="text-red-500 font-semibold text-xl pt-1">
              Atenção!
            </div>
          </>
        ) : valor <= 75 ? (
          <>
            <div className="text-yellow-500 font-semibold text-xl pt-1">
              Em Adequação
            </div>
          </>
        ) : (
          <>
            <div className="text-emerald-500 font-semibold text-xl pt-1">
              Excelente!
            </div>
          </>
        )}
        <div className="flex justify-center items-center gap-x-3 pt-6 py-4 text-zinc-500">
          <span className="text-right text-3xl text-black">{valor}%</span>
          <span className="">
            dos requisitos de adequação
            <br /> foram cumpridos.
          </span>
        </div>
      </div>
    </>
  );
};

export default function ReportsPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    if (!chartData) getChartData();
  }, [chartData]);

  const getChartData = async () => {
    try {
      const { data: reports }: any = await axios.get("/api/v1/reports");
      setChartData(reports);
    } catch (error) {
      console.error("getChartData", error);
    }
  };

  return (
    <>
      <DashboardLayout>
        {loading ? (
          <></>
        ) : !chartData ? (
          <></>
        ) : (
          <>
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 lg:col-span-3 bg-white border shadow-lg p-2 rounded-md">
                <div className="p-4 md:px-8 text-sm">
                  <span className="font-semibold text-lg">
                    Média de Conformidade
                  </span>
                </div>
                <Velocimetro valor={chartData.counter.score || 0} />
              </div>
              <div className="col-span-12 lg:col-span-6 flex flex-col justify-between bg-white border shadow-lg p-2 rounded-md">
                <div className="p-4 text-sm w-full flex justify-between items-center">
                  <span className="font-semibold text-lg">
                    Relatório de Tarefas
                  </span>
                  <button
                    disabled
                    className="flex items-center gap-x-1 disabled:cursor-not-allowed disabled:opacity-50 bg-zinc-100 text-zinc-500 text-sm p-2 px-4 font-semibold rounded-lg"
                  >
                    2024 <ChevronDown size={16} />
                  </button>
                </div>
                <div className="max-h-[240px] min-h-[240px] w-full text-xs p-1 md:p-2">
                  {chartData && (
                    <Bar
                      data={{
                        labels: [
                          ...chartData.tasks.labels.map((x: any) =>
                            dayjs(x).format("MMMM")
                          )
                        ],
                        datasets: [
                          {
                            label: "Tarefas",
                            data: [...chartData.tasks.data],
                            backgroundColor: "#fabf00"
                          }
                        ]
                      }}
                      options={{
                        scales: {
                          x: {
                            grid: {
                              display: false
                            },
                            border: {
                              display: false
                            },
                            ticks: {
                              color: "#999",
                              font: {
                                size: 11
                              }
                            },
                            title: {
                              display: false
                            }
                          },
                          y: {
                            grid: {
                              display: false
                            },
                            border: {
                              display: false
                            },
                            ticks: {
                              display: false
                            },
                            title: {
                              display: false
                            }
                          }
                        },
                        plugins: {
                          legend: {
                            display: false,
                            position: "bottom"
                          },
                          title: {
                            display: false
                          }
                        },
                        maintainAspectRatio: false,
                        responsive: true
                      }}
                    />
                  )}
                </div>
              </div>
              <div className="col-span-12 lg:col-span-3 bg-white border shadow-lg rounded-md">
                <div className="p-4 md:p-8 text-sm">
                  <span className="font-semibold text-lg">
                    Tarefas Concluídas
                  </span>
                  <div className="flex items-center text-lg gap-x-1 py-2 text-zinc-400">
                    <span className="text-5xl font-bold tracking-tight text-protectdata-500">
                      {chartData.counter.tasksFinished}
                    </span>
                    /{chartData.counter.tasks}
                  </div>
                  <span className="text-zinc-400">
                    <strong className="text-protectdata-500 font-bold">
                      {chartData.counter.tasksPercent}%
                    </strong>{" "}
                    das tarefas foram concluídas
                  </span>
                </div>
                <div className="max-h-[132px] w-full text-xs p-1 md:p-2">
                  {chartData && (
                    <Line
                      data={{
                        labels: [
                          ...chartData.tasksFinished.labels.map((x: any) =>
                            dayjs(x).format("MMMM")
                          )
                        ],
                        datasets: [
                          {
                            label: "Tarefas Concluídas",
                            data: [...chartData.tasksFinished.data],
                            backgroundColor: "#fabf00",
                            tension: 0.4
                          }
                        ]
                      }}
                      options={{
                        scales: {
                          x: {
                            grid: {
                              display: false
                            },
                            border: {
                              display: false
                            },
                            ticks: {
                              color: "#999",
                              font: {
                                size: 11
                              }
                            },
                            title: {
                              display: false
                            }
                          },
                          y: {
                            grid: {
                              display: false
                            },
                            border: {
                              display: false
                            },
                            ticks: {
                              display: false
                            },
                            title: {
                              display: false
                            }
                          }
                        },
                        plugins: {
                          legend: {
                            display: false
                          },
                          title: {
                            display: false
                          },
                          colors: {
                            enabled: false
                          }
                        },
                        maintainAspectRatio: false,
                        responsive: true
                      }}
                    />
                  )}
                </div>
              </div>
              <div className="col-span-12 lg:col-span-3 bg-white border shadow-lg rounded-md">
                <div className="p-4 md:p-8 text-sm">
                  <span className="font-semibold text-lg">Usuários</span>
                  <div className="flex items-center text-lg gap-x-1 py-2 text-zinc-400">
                    <span className="text-5xl font-bold tracking-tight text-zinc-900">
                      {chartData && chartData.counter.users}
                    </span>
                  </div>
                  <span className="text-zinc-400">
                    <strong className="text-emerald-500 font-bold">
                      {chartData && chartData.counter.admins}%
                    </strong>{" "}
                    são administradores
                  </span>
                </div>
              </div>
              <div className="col-span-12 lg:col-span-3 bg-white border shadow-lg rounded-md">
                <div className="p-4 md:p-8 text-sm">
                  <span className="font-semibold text-lg">Diagnósticos</span>
                  <div className="flex items-center text-lg gap-x-1 py-2 text-zinc-400">
                    <span className="text-5xl font-bold tracking-tight text-zinc-900">
                      {chartData && chartData.counter.diagnostics}
                    </span>
                  </div>
                  <span className="text-zinc-400">
                    <strong className="text-emerald-500 font-bold">
                      {chartData && chartData.counter.diagnosticsAnswered}%
                    </strong>{" "}
                    foram respondidos
                  </span>
                </div>
              </div>
              <div className="col-span-12 lg:col-span-3 bg-white border shadow-lg rounded-md">
                <div className="p-4 md:p-8 text-sm">
                  <span className="font-semibold text-lg">Documentos</span>
                  <div className="flex items-center text-lg gap-x-1 py-2 text-zinc-400">
                    <span className="text-5xl font-bold tracking-tight text-zinc-900">
                      {chartData && chartData.counter.documents}
                    </span>
                  </div>
                  <span className="text-zinc-400">&nbsp;</span>
                </div>
              </div>
              <div className="col-span-12 lg:col-span-3 bg-white border shadow-lg rounded-md">
                <div className="p-4 md:p-8 text-sm">
                  <span className="font-semibold text-lg">
                    Políticas de Privacidade
                  </span>
                  <div className="flex items-center text-lg gap-x-1 py-2 text-zinc-400">
                    <span className="text-5xl font-bold tracking-tight text-zinc-900">
                      {chartData && chartData.counter.policies}
                    </span>
                  </div>
                  <span className="text-zinc-400">
                    <strong className="text-emerald-500 font-bold">
                      {chartData && chartData.counter.policiesActive}
                    </strong>{" "}
                    versões publicadas
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </DashboardLayout>
    </>
  );
}
