"use client";

import DashboardLayout from "@/components/dashboardLayout";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

import { Bar, Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import axios from "axios";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend
);

export default function ReportsPage() {
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
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">
              Relatórios
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              Relatório mensal de tarefas e atividades.
            </p>
          </div>
        </div>
        <div className="pt-8 grid grid-cols-12 gap-4 md:gap-8">
          <div className="col-span-7 h-96">
            <h3 className="font-semibold pb-4 text-center">
              Relatório de Tarefas &bull; {dayjs().format("MMMM")}/
              {dayjs().format("YY")}
            </h3>
            {chartData && (
              <Bar
                data={{
                  labels: [
                    ...chartData.tasks.labels.map((x: any) =>
                      dayjs(x).format("DD/MM")
                    )
                  ],
                  datasets: [
                    {
                      label: "Tarefas Concluídas",
                      data: [...chartData.tasks.data],
                      backgroundColor: "rgba(17,24,39,.8)"
                    }
                  ]
                }}
                options={{
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
          <div className="col-span-5 h-96">
            <h3 className="font-semibold pb-4 text-center">
              Relatório por Usuário &bull;{" "}
              {dayjs().subtract(1, "month").format("MMMM")}/
              {dayjs().subtract(1, "month").format("YY")}
            </h3>
            {chartData && (
              <Radar
                data={{
                  labels: [...chartData.byUsers.labels.map((x: any) => x)],
                  datasets: [
                    {
                      label: "Tarefas",
                      data: [5, 8, 12, 3],
                      fill: true,
                      backgroundColor: "rgba(17,24,39,.8)",
                      borderColor: "rgb(255, 99, 132)",
                      pointBackgroundColor: "rgb(255, 99, 132)",
                      pointBorderColor: "#fff",
                      pointHoverBackgroundColor: "#fff",
                      pointHoverBorderColor: "rgb(255, 99, 132)"
                    }
                  ]
                }}
                options={{
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
          <div className="col-span-12 md:h-[36rem] py-12">
            <h3 className="font-semibold pb-4 text-center">
              Comparativo com o Mês Anterior
            </h3>
            <Bar
              data={{
                labels: ["Tarefas Criadas", "Tarefas Concluídas"],
                datasets: [
                  {
                    label: "Agosto",
                    data: [5, 8],

                    backgroundColor: "rgba(17,24,39,.8)"
                  },
                  {
                    label: "Setembro",
                    data: [2, 3],

                    backgroundColor: "rgba(17,24,39,.8)"
                  }
                ]
              }}
              options={{
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
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}
