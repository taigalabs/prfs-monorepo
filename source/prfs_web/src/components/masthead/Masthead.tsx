import React from "react";
import Link from "next/link";
import { IoMdArrowDropup, IoMdArrowDropdown } from "react-icons/io";
import { useRouter } from "next/navigation";
import { useFloating, useClick, useInteractions, useDismiss } from "@floating-ui/react";
import classNames from "classnames";
import { BsWallet2 } from "react-icons/bs";
import { PiDotsNineBold } from "react-icons/pi";

import styles from "./Masthead.module.scss";
import localStore from "@/storage/localStore";
import { i18nContext } from "@/contexts/i18n";
import Logo from "@/components/logo/Logo";
import { stateContext } from "@/contexts/state";
import { PrfsAccount } from "@/state/reducer";
import Button from "@taigalabs/prfs-react-components/src/button/Button";

const AccountStat: React.FC<AccountStatProps> = ({ account }) => {
  const i18n = React.useContext(i18nContext);
  const { dispatch } = React.useContext(stateContext);
  const { walletAddr, id } = account;
  const shortWalletAddr = walletAddr.substring(0, 7);
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

    localStore.removePrfsAccount();

    router.push("/");
  }, []);

  return (
    <div className={styles.accountStat}>
      <div
        className={classNames({
          [styles.base]: true,
          [styles.isOpen]: isOpen,
        })}
        ref={refs.setReference}
        {...getReferenceProps()}
      >
        <div>
          <div>{id}</div>
          <div className={styles.wallet}>
            <BsWallet2 />
            {shortWalletAddr}
          </div>
        </div>
        <div className={styles.btnArea}>{isOpen ? <IoMdArrowDropup /> : <IoMdArrowDropdown />}</div>
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
    </div>
  );
};

const ConnectButton = () => {
  const i18n = React.useContext(i18nContext);

  return (
    <div className={styles.connectBtn}>
      <Link href="/signin">{i18n.connect}</Link>
    </div>
  );
};

const Masthead: React.FC<any> = () => {
  const i18n = React.useContext(i18nContext);
  const { state } = React.useContext(stateContext);
  const { prfsAccount } = state;

  return (
    <div className={styles.wrapper}>
      <div className={styles.logoArea}>
        <div className={styles.logoContainer}>
          <Link href="/">
            <Logo variant="simple" />
          </Link>
        </div>
        <div className={styles.betaTag}>Beta</div>
      </div>
      <ul className={styles.mainMenu}>
        <li>
          <Link href="/">{i18n.home}</Link>
        </li>
        <li className={styles.inactive}>{i18n.learn}</li>
      </ul>
      <div className={styles.rightMenu}>
        <li className={styles.inactive}>{i18n.sdk_api}</li>
        <li className={styles.inactive}>{i18n.vote}</li>
        <li className={styles.inactive}>{i18n.enrollment}</li>
        {/* <li className={styles.inactive}>{i18n.dashboard}</li> */}
        <li>
          <Button variant="transparent_d">
            <PiDotsNineBold />
          </Button>
        </li>
        {/* <li className={styles.inactive}> */}
        {/*   <p>{i18n.talk}</p> */}
        {/*   <div className={styles.newTag}>{i18n.new}</div> */}
        {/* </li> */}
        {prfsAccount ? <AccountStat account={prfsAccount} /> : <ConnectButton />}
      </div>
    </div>
  );
};

export default Masthead;

export interface AccountStatProps {
  account: PrfsAccount;
}
