export interface ModalState {
  pomodoro: number;
  short: number;
  long: number;
  color: string;
  font: string;
  setColor: (newColor: string) => void;
  setFont: (newFont: string) => void;
  increment: (id: keyof ModalState) => void;
  decrement: (id: keyof ModalState) => void;
}

export interface AppState {
  pomodoro: number;
  short: number;
  long: number;
  color: string;
  font: string;
  setValue: (key: keyof AppState, value: number | string) => void;
}

export interface Button {
  id: string;
  label: string;
  duration: number;
}

export interface InputAttributes {
  checked: boolean;
}

export interface InputColors {
  "salmon": InputAttributes;
  "cyan": InputAttributes;
  "purple": InputAttributes;
}

export interface InputFonts {
  "type1": InputAttributes;
  "type2": InputAttributes;
  "type3": InputAttributes;
}
