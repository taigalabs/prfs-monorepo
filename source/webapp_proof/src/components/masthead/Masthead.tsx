"use client";

import React from "react";
import cn from "classnames";
import Link from "next/link";
import PrfsAppsPopover from "@taigalabs/prfs-react-components/src/prfs_apps_popover/PrfsAppsPopover";
import { AiOutlineClose } from "@react-icons/all-files/ai/AiOutlineClose";
import { useRouter } from "next/navigation";

import styles from "./Masthead.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { paths } from "@/paths";
import { useSearchParams } from "next/navigation";
import { envs } from "@/envs";
import SignInBtn from "../sign_in_btn/SignInBtn";

const Masthead: React.FC<MastheadProps> = () => {
  const i18n = React.useContext(i18nContext);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [prfsSignInEndpoint, setPrfsSignInEndpoint] = React.useState<string | null>(null);

  // React.useEffect(() => {
  //   const sk = new PrivateKey();
  //   const pkHex = sk.publicKey.toHex();
  //   const redirect_uri = encodeURIComponent(window.location.toString());
  //   setPrfsSignInEndpoint(
  //     `${envs.NEXT_PUBLIC_WEBAPP_PROOF_ENDPOINT}${paths.accounts__signin}?pk=${pkHex}&redirect_uri=${redirect_uri}`,
  //   );
  // }, [setPrfsSignInEndpoint]);

  const [isTutorial, tutorialUrl] = React.useMemo(() => {
    if (searchParams.get("tutorial_id")) {
      return [true, paths.__];
    }
    return [false, `${paths.__}?tutorial_id=simple_hash`];
  }, [searchParams]);

  // const handleSucceedSignIn = React.useCallback(
  //   async (data: SignInSuccessPayload) => {
  //     console.log(222, data);
  //   },
  //   [router],
  // );

  return (
    <div className={cn({ [styles.wrapper]: true, [styles.isTutorial]: isTutorial })}>
      <div className={styles.inner}>
        <ul className={styles.rightGroup}>
          <li className={cn(styles.menu, styles.underline, styles.tutorialBtn)}>
            <a href={tutorialUrl}>
              <span>{i18n.tutorial}</span>
              {isTutorial && <AiOutlineClose />}
            </a>
          </li>
          <li className={cn(styles.menu, styles.underline)}>
            <Link href={paths.auth}>{i18n.auth}</Link>
          </li>
          <li className={styles.menu}>
            <PrfsAppsPopover
              webappPollEndpoint={process.env.NEXT_PUBLIC_WEBAPP_POLL_ENDPOINT}
              webappProofEndpoint={process.env.NEXT_PUBLIC_WEBAPP_PROOF_ENDPOINT}
              webappConsoleEndpoint={process.env.NEXT_PUBLIC_WEBAPP_CONSOLE_ENDPOINT}
            />
          </li>
          <li className={styles.menu}>
            <SignInBtn />
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Masthead;

export interface MastheadProps {}
