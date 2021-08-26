import { MouseEventHandler } from "react";

export interface NotificationProps {
  show?: boolean
  title?: string
  text: string
  buttonText?: string
  buttonAction?: MouseEventHandler
  autoClose?: number
}