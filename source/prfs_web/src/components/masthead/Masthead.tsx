import React from "react";
import Link from "next/link";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { useRouter } from "next/navigation";
import { useFloating, useClick, useInteractions, useDismiss } from "@floating-ui/react";
import localStorage from "@/storage/localStorage";

import styles from "./Masthead.module.scss";
import { i18nContext } from "@/contexts/i18n";
import Logo from "@/components/logo/Logo";
import { stateContext } from "@/contexts/state";
import { PrfsAccount } from "@/state/reducer";

const AccountStat: React.FC<AccountStatProps> = ({ account }) => {
  const i18n = React.useContext(i18nContext);
  const { dispatch } = React.useContext(stateContext);
  const { walletAddr, id } = account;
  let shortWalletAddr = `W: ${walletAddr.substring(0, 7)}`;
  const router = useRouter();

  const [isOpen, setIsOpen] = React.useState(false);
  const { refs, floatingStyles, context } = useFloating({
    placement: "bottom-end",
    open: isOpen,
    onOpenChange: setIsOpen,
  });
  const dismiss = useDismiss(context);
  const click = useClick(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss]);

  const handleClickSignOut = React.useCallback(() => {
    dispatch({
      type: "sign_out",
    });

    localStorage.putPrfsAccount("", "");

    router.push("/");
  }, []);

  return (
    <>
      <div className={styles.accountStat} ref={refs.setReference} {...getReferenceProps()}>
        <div>
          <div>{id}</div>
          <div>{shortWalletAddr}</div>
        </div>
        <div className={styles.btnArea}>{isOpen ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}</div>
      </div>
      {isOpen && (
        <div
          className={styles.dropdown}
          ref={refs.setFloating}
          style={floatingStyles}
          {...getFloatingProps()}
        >
          <ul>
            <li onClick={handleClickSignOut}>{i18n.sign_out}</li>
          </ul>
        </div>
      )}
    </>
  );
};

const Masthead: React.FC<any> = () => {
  const i18n = React.useContext(i18nContext);
  const { state } = React.useContext(stateContext);
  const { prfsAccount } = state;

  return (
    <div className={styles.wrapper}>
      <div className={styles.logoArea}>
        <Link href="/">
          <Logo />
        </Link>
      </div>
      <div className={styles.rightMenu}>
        {prfsAccount ? <AccountStat account={prfsAccount} /> : <Link href="/signin">connect</Link>}
      </div>
    </div>
  );
};

export default Masthead;

export interface AccountStatProps {
  account: PrfsAccount;
}
