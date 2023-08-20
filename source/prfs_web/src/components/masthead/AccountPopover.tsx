import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import cn from "classnames";
import { BsWallet2 } from "react-icons/bs";

import styles from "./AccountPopover.module.scss";
import localStore from "@/storage/localStore";
import { i18nContext } from "@/contexts/i18n";
import { stateContext } from "@/contexts/state";
import { LocalPrfsAccount } from "@/state/reducer";
import { paths } from "@/routes/path";
import Popover from "@taigalabs/prfs-react-components/src/popover/Popover";

const AccountModal: React.FC<AccountModalProps> = ({ localPrfsAccount }) => {
  const i18n = React.useContext(i18nContext);
  const { dispatch } = React.useContext(stateContext);
  const router = useRouter();

  const { prfsAccount, walletAddr } = localPrfsAccount;

  const handleClickSignOut = React.useCallback(() => {
    dispatch({
      type: "sign_out",
    });

    localStore.removePrfsAccount();

    router.push(paths.__);
  }, []);

  return (
    <div className={styles.modal}>
      <div>
        <p>{i18n.signature}</p>
        <p className={styles.value}>{prfsAccount.sig}</p>
      </div>
      <div>
        <p>{i18n.wallet_addr}</p>
        <p className={styles.value}>{walletAddr}</p>
      </div>
      <ul>
        <div>55</div>
        <li onClick={handleClickSignOut}>{i18n.sign_out}</li>
      </ul>
    </div>
  );
};

const AccountPopover: React.FC<AccountPopoverProps> = ({ localPrfsAccount }) => {
  const i18n = React.useContext(i18nContext);
  const { walletAddr, prfsAccount } = localPrfsAccount;

  // console.log(11, account.sig);

  const createBase = React.useCallback(
    (isOpen: boolean) => {
      const { sig } = prfsAccount;
      const s = sig.substring(2, 6);

      return (
        <div className={styles.base}>
          <div className={styles.id}>{s}</div>
        </div>
        // {/* <div className={styles.wallet}>{/* <BsWallet2 /> */}</div> */}
      );
    },
    [prfsAccount]
  );

  const createPopover = React.useCallback(
    (setIsOpen: React.Dispatch<React.SetStateAction<any>>) => {
      // const shortWalletAddr = walletAddr.substring(0, 15);

      return <AccountModal setIsOpen={setIsOpen} localPrfsAccount={localPrfsAccount} />;
    },
    []
  );

  return (
    <div className={styles.wrapper}>
      <Popover
        createBase={createBase}
        createPopover={createPopover}
        offset={10}
        popoverClassName={styles.popoverWrapper}
      />
    </div>
  );
};

export default AccountPopover;

interface AccountPopoverProps {
  localPrfsAccount: LocalPrfsAccount;
}

interface AccountModalProps {
  localPrfsAccount: LocalPrfsAccount;
  setIsOpen: React.Dispatch<React.SetStateAction<any>>;
}
