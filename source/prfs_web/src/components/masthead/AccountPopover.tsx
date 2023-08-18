import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFloating, useClick, useInteractions, useDismiss } from "@floating-ui/react";
import cn from "classnames";
import { BsWallet2 } from "react-icons/bs";

import styles from "./AccountPopover.module.scss";
import localStore from "@/storage/localStore";
import { i18nContext } from "@/contexts/i18n";
import { stateContext } from "@/contexts/state";
import { PrfsAccount } from "@/state/reducer";
import Button from "@taigalabs/prfs-react-components/src/button/Button";
import { paths } from "@/routes/path";
import Popover from "@taigalabs/prfs-react-components/src/popover/Popover";

const AccountModal: React.FC<AccountModalProps> = ({}) => {
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
    <ul className={styles.modal}>
      <li onClick={handleClickSignOut}>{i18n.sign_out}</li>
    </ul>
  );
};

const AccountPopover: React.FC<AccountPopoverProps> = ({ account }) => {
  const i18n = React.useContext(i18nContext);
  const { walletAddr, id } = account;
  const shortWalletAddr = walletAddr.substring(0, 7);

  const createBase = React.useCallback((isOpen: boolean) => {
    return (
      <div className={styles.base}>
        <div>{id}</div>
        <div className={styles.wallet}>
          <BsWallet2 />
          {shortWalletAddr}
        </div>
      </div>
    );
  }, []);

  const createPopover = React.useCallback(
    (setIsOpen: React.Dispatch<React.SetStateAction<any>>) => {
      return <AccountModal setIsOpen={setIsOpen} />;
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
  setIsOpen: React.Dispatch<React.SetStateAction<any>>;
}
