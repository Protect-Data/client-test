export default function AdminPage() {
  const diagnostic = [
    {
      title: "Estrutura",
      descr: "HTML/CSS",
      value: 64
    },
    {
      title: "Sistema",
      descr: "Banco de Dados e API",
      value: 92
    },
    {
      title: "Privacidade",
      descr: "LGPD",
      value: 33
    }
  ];

  return (
    <>
      <h2 className="pb-8 text-3xl">Diagnósticos</h2>
      <div className="grid grid-cols-1 gap-20 lg:grid-cols-3 lg:gap-10">
        {diagnostic.map((x: any, k: number) => (
          <div
            key={k}
            className="flex items-center flex-wrap max-w-md px-10 bg-white shadow-xl rounded-2xl h-20"
          >
            <div className="flex items-center justify-center -m-6 overflow-hidden bg-white rounded-full">
              <svg
                className="w-32 h-32 transform translate-x-1 translate-y-1"
                x-cloak
                aria-hidden="true"
              >
                <circle
                  className="text-gray-300"
                  stroke-width="10"
                  stroke="currentColor"
                  fill="transparent"
                  r="50"
                  cx="60"
                  cy="60"
                />
                <circle
                  className={
                    x.value >= 75
                      ? `text-emerald-500`
                      : x.value >= 45
                      ? `text-protectdata-500`
                      : `text-red-500`
                  }
                  stroke-width="10"
                  stroke-dasharray={50 * 2 * Math.PI}
                  stroke-dashoffset={
                    50 * 2 * Math.PI - (50 / 100) * x.value * 2 * Math.PI
                  }
                  stroke-linecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="50"
                  cx="60"
                  cy="60"
                />
              </svg>
              <span
                className={`absolute text-2xl select-none ${
                  x.value >= 75
                    ? `text-emerald-500`
                    : x.value >= 45
                    ? `text-protectdata-500`
                    : `text-red-500`
                } font-bold`}
              >
                {x.value}%
              </span>
            </div>
            <p className="ml-10 font-medium text-gray-600 sm:text-xl">
              {x.title}
            </p>

            <span
              className={`ml-auto text-sm font-medium text-zinc-400 hidden sm:block`}
            >
              {x.descr}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}
