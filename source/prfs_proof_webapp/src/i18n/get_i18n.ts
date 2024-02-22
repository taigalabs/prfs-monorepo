import { en } from "@taigalabs/prfs-i18n";

import { envs } from "@/envs";

export async function getI18N(): Promise<I18NData> {
  try {
    const data = await fetch(`${envs.NEXT_PUBLIC_PRFS_PROOF_WEBAPP_ENDPOINT}/api/i18n`);
    const json = await data.json();
    return json["en"] || en;
  } catch (err: unknown) {
    console.error("Error fetching i18n: %o", err);
    return en;
  }
}

export type I18NData = typeof en;
