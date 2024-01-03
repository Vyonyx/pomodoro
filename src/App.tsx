import { Dispatch, useEffect, useState } from "react";
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
          <h2>Settings</h2>
        </aside>
      </main>
    </>
  );
}

function Timer() {
  const [time, setTime] = useState(100);

  useEffect(() => {
    if (time === 0) return;

    const interval = setInterval(() => {
      setTime(time - 1);
    }, 1000);

    return () => clearInterval(interval);
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
      className={`flex items-center justify-center w-[400px] aspect-square bg-gradient-to-br from-purp-dark to-[rgba(255,255,255,0.1)] rounded-full shadow-[-35px_-35px_50px_rgba(255,255,255,0.04),35px_35px_50px_rgba(0,0,0,0.2)]`}
    >
      <div className="w-[345px] aspect-square bg-purp-dark rounded-full flex items-center justify-center">
        <h2 className="text-6xl text-light-grey">{clockTime}</h2>
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
