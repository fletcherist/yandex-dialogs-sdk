export interface ButtonParams {
  title?: string,
  text?: string,
  tts?: string,
  url?: string,
  hide?: boolean,
  payload?: {}
}

export interface IButton {
  title: string,
  tts?: string,
  url?: string,
  hide?: boolean,
  payload?: {}
}
