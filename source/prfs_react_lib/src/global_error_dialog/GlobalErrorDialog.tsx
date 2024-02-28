"use client";

import React from "react";
import cn from "classnames";
// import { IoMdWarning } from "@react-icons/all-files/io/IoMdWarning";
// import { IoClose } from "@react-icons/all-files/io5/IoClose";

import styles from "./GlobalErrorDialog.module.scss";
// import { useAppDispatch, useAppSelector } from "@/state/hooks";
// import Overlay from "@taigalabs/prfs-react-lib/src/overlay/Overlay";
// import { removeError } from "@/state/errorReducer";

export const GlobalErrorDialogWrapper: React.FC<GlobalErrorDialogProps> = ({ children }) => {
  return <div className={styles.wrapper}>{children}</div>;
};

export const GlobalErrorDialogContent: React.FC<GlobalErrorDialogProps> = ({ children }) => {
  return <div className={styles.content}>{children}</div>;
};

export const GlobalErrorDialogBtnGroup: React.FC<GlobalErrorDialogProps> = ({ children }) => {
  return <div className={styles.btnGroup}>{children}</div>;
};

// const GlobalErrorDialog: React.FC<GlobalErrorDialogProps> = ({}) => {
//   const error = useAppSelector(state => state.error.error);
//   const dispatch = useAppDispatch();
//   const handleClickClose = React.useCallback(() => {
//     dispatch(removeError());
//   }, [dispatch]);

//   return (
//       <Overlay className={styles.wrapper}>
//         <div className={styles.dialog}>
//           <div className={styles.content}>
//             <IoMdWarning />
//             <p>{error.message}</p>
//           </div>
//           <div className={styles.btnGroup}>
//             <button type="button" onClick={handleClickClose}>
//               <IoClose />
//             </button>
//           </div>
//         </div>
//       </Overlay>
//     )
//   );
// };

// export default GlobalErrorDialog;

export interface GlobalErrorDialogProps {
  children: React.ReactNode;
}
