import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import cn from "classnames";
import { BsWallet2 } from "react-icons/bs";

import styles from "./AccountPopover.module.scss";
import localStore from "@/storage/localStore";
import { i18nContext } from "@/contexts/i18n";
import { stateContext } from "@/contexts/state";
import { PrfsAccount } from "@/state/reducer";
import { paths } from "@/routes/path";
import Popover from "@taigalabs/prfs-react-components/src/popover/Popover";

const AccountModal: React.FC<AccountModalProps> = ({ account }) => {
  const i18n = React.useContext(i18nContext);
  const { dispatch } = React.useContext(stateContext);
  const router = useRouter();

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
        <p>{i18n.id}</p>
        <p className={styles.value}>{account.id}</p>
      </div>
      <div>
        <p>{i18n.wallet_addr}</p>
        <p className={styles.value}>{account.walletAddr}</p>
      </div>
      <ul>
        <div>55</div>
        <li onClick={handleClickSignOut}>{i18n.sign_out}</li>
      </ul>
    </div>
  );
};

const AccountPopover: React.FC<AccountPopoverProps> = ({ account }) => {
  const i18n = React.useContext(i18nContext);
  const { walletAddr, id } = account;

  const createBase = React.useCallback((isOpen: boolean) => {
    const s = id.substring(2, 6);

    return (
      <div className={styles.base}>
        <div className={styles.id}>{s}</div>
      </div>
      // {/* <div className={styles.wallet}>{/* <BsWallet2 /> */}</div> */}
    );
  }, []);

  const createPopover = React.useCallback(
    (setIsOpen: React.Dispatch<React.SetStateAction<any>>) => {
      const shortWalletAddr = walletAddr.substring(0, 15);

      return <AccountModal setIsOpen={setIsOpen} account={account} />;
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
  account: PrfsAccount;
}

interface AccountModalProps {
  account: PrfsAccount;
  setIsOpen: React.Dispatch<React.SetStateAction<any>>;
}
