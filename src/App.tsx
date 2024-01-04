import { Dispatch, useEffect, useRef, useState } from "react";
import clsx from "clsx";

function App() {
  const [activeButton, setActiveButton] = useState("pomodoro");

  const buttons = [
    { id: "pomodoro", label: "Pomodoro" },
    { id: "short", label: "Short Break" },
    { id: "long", label: "Long Break" },
  ];

  return (
    <>
      <header className="text-light-grey bg-purp absolute top-0 left-0 w-full mt-10">
        <h1 className="text-4xl text-center">pomodoro</h1>
      </header>

      <main className="flex flex-col items-center gap-10 text-white bg-purp h-dvh pt-32">
        <nav className="flex items-center justify-items-end rounded-full bg-purp-dark w-fit p-2">
          {buttons.map((button) => (
            <PomodoroButton
              key={button.id}
              id={button.id}
              label={button.label}
              active={activeButton}
              click={setActiveButton}
            />
          ))}
        </nav>

        <Timer />

        <aside>
          <button className="cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path
                fill="#DBE0FB"
                d="M24 13.616v-3.232l-2.869-1.02c-.198-.687-.472-1.342-.811-1.955l1.308-2.751-2.285-2.285-2.751 1.307c-.613-.339-1.269-.613-1.955-.811l-1.021-2.869h-3.232l-1.021 2.869c-.686.198-1.342.471-1.955.811l-2.751-1.308-2.285 2.285 1.308 2.752c-.339.613-.614 1.268-.811 1.955l-2.869 1.02v3.232l2.869 1.02c.197.687.472 1.342.811 1.955l-1.308 2.751 2.285 2.286 2.751-1.308c.613.339 1.269.613 1.955.811l1.021 2.869h3.232l1.021-2.869c.687-.198 1.342-.472 1.955-.811l2.751 1.308 2.285-2.286-1.308-2.751c.339-.613.613-1.268.811-1.955l2.869-1.02zm-12 2.384c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4z"
              />
            </svg>
          </button>
        </aside>
      </main>
    </>
  );
}

function Timer() {
  const [initialTime, _] = useState(10);
  const [time, setTime] = useState(initialTime);
  const [offset, setOffset] = useState(0);
  const [paused, setPaused] = useState(true);

  const path = useRef<SVGCircleElement>(null);

  useEffect(() => {
    if (path.current) {
      const pathLength = Math.ceil(path.current.getTotalLength());
      path.current.setAttribute("stroke-dasharray", pathLength.toString());
      path.current.setAttribute("stroke-dashoffset", "0");
    }
  }, []);

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => {
      if (time === 0) return;
      setTime(time - 1);
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [time, paused]);

  useEffect(() => {
    if (!path.current) return;
    const pathLength = Math.ceil(path.current.getTotalLength());
    const offsetAmount = pathLength / initialTime;
    setOffset(offset + offsetAmount);
    path.current?.setAttribute("stroke-dashoffset", offset.toString());
  }, [time]);

  const generateClockText = () => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    let clockTime = "";

    clockTime += minutes < 10 ? "0" + minutes : minutes;
    clockTime += ":";
    clockTime += seconds < 10 ? "0" + seconds : seconds;

    return clockTime;
  };

  const clockTime = generateClockText();

  return (
    <div
      onClick={() => setPaused(!paused)}
      className={`flex items-center justify-center w-[400px] aspect-square bg-gradient-to-br from-purp-dark to-[rgba(255,255,255,0.1)] rounded-full shadow-[-35px_-35px_50px_rgba(255,255,255,0.04),35px_35px_50px_rgba(0,0,0,0.2)]`}
    >
      <div className="relative w-[345px] aspect-square bg-purp-dark rounded-full flex items-center justify-center p-4">
        <svg
          className="absolute top-0 left-0 m-4 -rotate-90"
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            ref={path}
            fill="none"
            stroke="#FA6E72"
            strokeWidth="3"
            cx="50"
            cy="50"
            r="48"
          />
        </svg>
        <h2 className="text-6xl text-light-grey">{clockTime}</h2>
        {paused && (
          <h3 className="absolute bottom-1/4 text-center text-light-grey tracking-widest">
            PAUSED
          </h3>
        )}
      </div>
    </div>
  );
}

function PomodoroButton({
  id,
  label,
  active,
  click,
}: {
  id: string;
  label: string;
  active?: string;
  click: Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <button
      onClick={() => click(id)}
      className={clsx(
        { "rounded-full text-lg text-light-grey py-4 px-8": true },
        { "text-purp-dark bg-salmon": id === active },
      )}
    >
      {label}
    </button>
  );
}

export default App;
