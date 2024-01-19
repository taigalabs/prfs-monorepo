import React from "react";
// import { useRouter } from "next/navigation";
import { HiPlus } from "@react-icons/all-files/hi/HiPlus";
import Button from "@taigalabs/prfs-react-lib/src/button/Button";
import cn from "classnames";
import Link from "next/link";
import Popover from "@taigalabs/prfs-react-lib/src/popover/Popover";

import styles from "./CreateAtstPopover.module.scss";
import { i18nContext } from "@/i18n/context";
import { paths } from "@/paths";

const Modal: React.FC<ModalProps> = ({ setIsOpen }) => {
  const i18n = React.useContext(i18nContext);
  const handleClickItem = React.useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  return (
    <div className={styles.modal}>
      <ul className={styles.menu}>
        <li onClick={handleClickItem}>
          <Link href={paths.attestations__create__twitter}>{i18n.twitter}</Link>
        </li>
        <li onClick={handleClickItem}>
          <Link href={paths.attestations__create__crypto_size}>{i18n.crypto_asset_size}</Link>
        </li>
      </ul>
    </div>
  );
};

const CreateAtstPopover: React.FC<CreateAtstPopoverProps> = () => {
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
      offset={4}
      popoverClassName={styles.popoverWrapper}
    />
  );
};

export default CreateAtstPopover;

interface CreateAtstPopoverProps {}

interface ModalProps {
  setIsOpen: React.Dispatch<React.SetStateAction<any>>;
}
