import { en } from "@taigalabs/prfs-i18n";

import { envs } from "@/envs";

export async function getI18N(): Promise<I18NData> {
  try {
    // const data2 = await fetch("https://www.httpbin.org/get");
    // console.log(22, await data2.json());

    console.log(33, envs.NEXT_PUBLIC_WEBAPP_PROOF_ENDPOINT);

    const data = await fetch(`${envs.NEXT_PUBLIC_WEBAPP_PROOF_ENDPOINT}/api/i18n`);
    const json = await data.json();
    return json["en"] || en;
  } catch (err: unknown) {
    // console.error("Error fetching i18n: %o", err);
    return en;
  }
}

export type I18NData = typeof en;
