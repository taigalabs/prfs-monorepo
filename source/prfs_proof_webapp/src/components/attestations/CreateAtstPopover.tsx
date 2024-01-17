import React from "react";
import { useRouter } from "next/navigation";
import { HiPlus } from "@react-icons/all-files/hi/HiPlus";
import Button from "@taigalabs/prfs-react-lib/src/button/Button";
import cn from "classnames";

import styles from "./CreateAtstPopover.module.scss";
// import localStore from "@/storage/localStore";
import { i18nContext } from "@/i18n/context";
import { paths } from "@/paths";
import Popover from "@taigalabs/prfs-react-lib/src/popover/Popover";
import { useAppDispatch } from "@/state/hooks";
// import { LocalPrfsAccount, signOut } from "@/state/userReducer";

const Modal: React.FC<ModalProps> = () => {
  const i18n = React.useContext(i18nContext);
  const router = useRouter();
  const dispatch = useAppDispatch();

  // const { prfsAccount, walletAddr } = localPrfsAccount;

  // const handleClickSignOut = React.useCallback(() => {
  //   dispatch(signOut(undefined));

  //   localStore.removePrfsAccount();

  //   router.push(paths.__);
  // }, []);

  return (
    <div className={styles.modal}>
      base
      {/* <div className={styles.info}> */}
      {/*   <p className={styles.infoLabel}>{i18n.signature}</p> */}
      {/*   <p className={styles.value}>{prfsAccount && prfsAccount.account_id}</p> */}
      {/* </div> */}
      {/* <div className={styles.info}> */}
      {/*   <p className={styles.infoLabel}>{i18n.wallet_addr}</p> */}
      {/*   <p className={styles.value}>{walletAddr}</p> */}
      {/* </div> */}
      {/* <ul className={styles.menu}> */}
      {/*   <li onClick={handleClickSignOut}>{i18n.sign_out}</li> */}
      {/* </ul> */}
    </div>
  );
};

const CreateAtstPopover: React.FC<CreateAtstPopoverProps> = ({}) => {
  const i18n = React.useContext(i18nContext);

  const createBase = React.useCallback((isOpen: boolean) => {
    return (
      <Button
        variant="light_blue_1"
        handleClick={() => {}}
        className={styles.addBtn}
        contentClassName={styles.addBtnContent}
      >
        <HiPlus />
        <span>{i18n.create_attestation}</span>
      </Button>
    );
  }, []);

  const createPopover = React.useCallback(
    (setIsOpen: React.Dispatch<React.SetStateAction<any>>) => {
      return <Modal setIsOpen={setIsOpen} />;
    },
    [],
  );

  return (
    <Popover
      createBase={createBase}
      createPopover={createPopover}
      offset={10}
      popoverClassName={styles.popoverWrapper}
    />
  );
};

export default CreateAtstPopover;

interface CreateAtstPopoverProps {}

interface ModalProps {
  setIsOpen: React.Dispatch<React.SetStateAction<any>>;
}
