import { envs } from "@/envs";
import en from "@/i18n/en";

export async function getI18N(): Promise<I18NData> {
  try {
    const data = await fetch(`${envs.NEXT_PUBLIC_WEBAPP_PROOF_ENDPOINT}/api`);
    const json = await data.json();
    return json;
  } catch (err) {
    console.error(`Error fetching i18n, ${err}`);
    return en;
  }
}

export type I18NData = typeof en;
