import { Dispatch, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import Modal from "react-modal";
import { create } from "zustand";

interface ModalState {
  pomodoro: number;
  short: number;
  long: number;
  increment: (id: keyof ModalState) => void;
  decrement: (id: keyof ModalState) => void;
}

const useModalState = create<ModalState>((set) => ({
  pomodoro: 25,
  short: 10,
  long: 45,
  increment: (id) => set((state) => ({ [id]: Number(state[id]) + 1 })),
  decrement: (id) => set((state) => ({ [id]: Number(state[id]) - 1 })),
}));

Modal.setAppElement("#root");

const modalStyles = {
  overlay: {
    backgroundColor: "transparent",
  },
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    minWidth: "500px",
    padding: "0px",
    borderRadius: "20px",
    overflow: "visible",
  },
};

interface Button {
  id: string;
  label: string;
  duration: number;
}

function App() {
  const [activeButton, setActiveButton] = useState("pomodoro");
  const [initialTime, setInitialTime] = useState(10);
  const [buttons, setButtons] = useState<Button[]>([
    { id: "pomodoro", label: "Pomodoro", duration: 25 * 60 },
    { id: "short", label: "Short Break", duration: 10 * 60 },
    { id: "long", label: "Long Break", duration: 45 * 60 },
  ]);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const modalState = useModalState((state) => state);

  function applyModalValues() {
    const { pomodoro, short, long } = modalState;
    setButtons((prevState) => {
      return prevState.map((state) => {
        switch (state.id) {
          case "pomodoro":
            state.duration = pomodoro * 60;
            break;
          case "short":
            state.duration = short * 60;
            break;
          case "long":
            state.duration = long * 60;
            break;
        }
        return state;
      });
    });
    setModalIsOpen(false);
  }

  useEffect(() => {
    const currentButton = buttons.find((button) => button.id === activeButton);
    if (currentButton) setInitialTime(currentButton.duration);
  }, [buttons]);

  function openModal() {
    setModalIsOpen(true);
  }
  function closeModal() {
    setModalIsOpen(false);
  }

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
              click={() => {
                setActiveButton(button.id);
                setInitialTime(button.duration);
              }}
            />
          ))}
        </nav>

        <Timer initialTime={initialTime} />

        <aside>
          <button className="cursor-pointer" onClick={openModal}>
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

      <Modal
        style={modalStyles}
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
      >
        <div className="p-6">
          <h2 className="text-2xl font-bold">Settings</h2>
        </div>

        <div className="h-[1px] bg-light-grey w-full"></div>
        <div className="p-6 pb-0">
          <h3 className="text-lg tracking-widest uppercase mb-4">
            Time (Minutes)
          </h3>
          <div className="flex justify-between gap-4">
            <NumberInput id="pomodoro" labelText="pomodoro" />
            <NumberInput id="short" labelText="short break" />
            <NumberInput id="long" labelText="long break" />
          </div>
        </div>

        <div className="flex justify-center">
          <button
            className="rounded-full bg-salmon text-white px-10 py-4 translate-y-1/2 hover:text-purp-dark transition-colors"
            onClick={applyModalValues}
          >
            Apply
          </button>
        </div>
      </Modal>
    </>
  );
}

function NumberInput({
  labelText,
  id,
}: {
  labelText: string;
  id: keyof ModalState;
}) {
  const { increment, decrement } = useModalState((state) => state);
  const value: number = useModalState((state) => Number(state[id].valueOf()));

  function incrementState() {
    increment(id);
  }

  function decrementState() {
    decrement(id);
  }

  // function onChange(e: ChangeEvent<HTMLInputElement>) {
  //   const newValue = e.target.value;
  //   setValue(Number(newValue));
  // }

  return (
    <div className="flex-grow flex flex-col gap-2">
      <label htmlFor={id} className="font-bold text-slate-400">
        {labelText}
      </label>

      <div className="relative">
        <input
          id={id}
          type="number"
          min={1}
          max={100}
          value={value}
          className="relative w-full bg-slate-200 h-10 rounded-lg px-4"
          // onChange={onChange}
        />
        <button
          onClick={incrementState}
          className="absolute top-0 right-2 h-fit"
        >
          <svg
            className="scale-x-50 scale-y-[0.35]"
            width="24"
            height="24"
            xmlns="http://www.w3.org/2000/svg"
            fillRule="evenodd"
            clipRule="evenodd"
          >
            <path d="M23.245 20l-11.245-14.374-11.219 14.374-.781-.619 12-15.381 12 15.391-.755.609z" />
          </svg>
        </button>
        <button
          onClick={decrementState}
          className="absolute bottom-0 right-2 h-fit"
        >
          <svg
            className="scale-x-50 scale-y-[0.35]"
            width="24"
            height="24"
            xmlns="http://www.w3.org/2000/svg"
            fillRule="evenodd"
            clipRule="evenodd"
          >
            <path d="M23.245 4l-11.245 14.374-11.219-14.374-.781.619 12 15.381 12-15.391-.755-.609z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function Timer({ initialTime }: { initialTime: number }) {
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
    setTime(initialTime);
    setOffset(0);
    setPaused(true);
  }, [initialTime]);

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
        <button
          className="text-light-grey tracking-widest absolute bottom-1/4 hover:text-salmon"
          onClick={() => setPaused(!paused)}
        >
          {paused ? "PAUSED" : "PLAY"}
        </button>
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
