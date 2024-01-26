import React from "react";
import { HiPlus } from "@react-icons/all-files/hi/HiPlus";
import Button from "@taigalabs/prfs-react-lib/src/button/Button";
import cn from "classnames";
import Link from "next/link";
import Popover from "@taigalabs/prfs-react-lib/src/popover/Popover";

import styles from "./CreateSetPopover.module.scss";
import { i18nContext } from "@/i18n/context";
import { paths } from "@/paths";

// const Modal: React.FC<ModalProps> = ({ setIsOpen }) => {
//   const i18n = React.useContext(i18nContext);
//   const handleClickItem = React.useCallback(() => {
//     setIsOpen(false);
//   }, [setIsOpen]);

//   return (
//     <div className={styles.modal}>
//       <ul className={styles.menu}>
//         {/* <li onClick={handleClickItem}> */}
//         {/*   <Link href={paths.attestations__create__twitter}>{i18n.twitter}</Link> */}
//         {/* </li> */}
//       </ul>
//     </div>
//   );
// };

const CreateAtstPopover: React.FC<CreateAtstPopoverProps> = () => {
  const i18n = React.useContext(i18nContext);

  const createBase = React.useCallback((isOpen: boolean) => {
    return (
      <Button
        variant="light_blue_1"
        className={styles.createBtn}
        contentClassName={styles.addBtnContent}
      >
        <a href={paths.sets__create}>
          <HiPlus />
          <span>{i18n.create_set}</span>
        </a>
      </Button>
    );
  }, []);

  // const createPopover = React.useCallback(
  //   (setIsOpen: React.Dispatch<React.SetStateAction<any>>) => {
  //     return <Modal setIsOpen={setIsOpen} />;
  //   },
  //   [],
  // );

  return (
    <Button
      variant="light_blue_1"
      className={styles.createBtn}
      contentClassName={styles.addBtnContent}
    >
      <a href={paths.sets__create}>
        <HiPlus />
        <span>{i18n.create_set}</span>
      </a>
    </Button>
  );
};

export default CreateAtstPopover;

interface CreateAtstPopoverProps {}

interface ModalProps {
  setIsOpen: React.Dispatch<React.SetStateAction<any>>;
}
