import { Envs } from "./envs";

declare global {
  interface Window {
    ethereum: any;
  }

  namespace NodeJS {
    interface ProcessEnv extends Envs {}
  }
}
