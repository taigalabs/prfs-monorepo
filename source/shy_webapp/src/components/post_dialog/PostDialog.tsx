import React from "react";
import cn from "classnames";
import {
  useFloating,
  useDismiss,
  useRole,
  useClick,
  useInteractions,
  useId,
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
} from "@floating-ui/react";
import { AiOutlineClose } from "@react-icons/all-files/ai/AiOutlineClose";
import { MetamaskActions, usePrfsSnap } from "@taigalabs/prfs-react-lib/src/hooks/use_prfs_snap";

import styles from "./PostDialog.module.scss";
import { i18nContext } from "@/i18n/context";
import TextEditor from "@/components/text_editor/TextEditor";
import OpenSnapDialog from "./OpenSnapDialog";

const PostDialog: React.FC<PostDialogProps> = ({ children }) => {
  const i18n = React.useContext(i18nContext);
  const [isOpen, setIsOpen] = React.useState(false);

  const { refs, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
  });
  const click = useClick(context);
  const role = useRole(context);
  const dismiss = useDismiss(context, { outsidePressEvent: "mousedown" });
  const { getReferenceProps, getFloatingProps } = useInteractions([click, role, dismiss]);
  const headingId = useId();
  const descriptionId = useId();

  // const { state, dispatch } = usePrfsSnap();

  // const handleClickSnap = React.useCallback(async () => {
  //   try {
  //     console.log("Get Proofs from Snap");

  //     // await addProof({
  //     //   proof_label: proofInstance.proof_label,
  //     //   proof_short_url: proofShortUrl,
  //     // });
  //   } catch (error) {
  //     console.error(error);
  //     dispatch({ type: MetamaskActions.SetError, payload: error });
  //   }
  // }, []);

  return (
    <>
      <div className={styles.base} ref={refs.setReference} {...getReferenceProps()}>
        {children}
      </div>
      {/* <FloatingPortal> */}
      {/*   {isOpen && ( */}
      {/*     <FloatingOverlay className={styles.dialogOverlay}> */}
      {/*       <FloatingFocusManager context={context}> */}
      {/*         <> */}
      {/*           <div */}
      {/*             className={styles.dialog} */}
      {/*             ref={refs.setFloating} */}
      {/*             aria-labelledby={headingId} */}
      {/*             aria-describedby={descriptionId} */}
      {/*             {...getFloatingProps()} */}
      {/*           > */}
      {/*             <OpenSnapDialog /> */}
      {/*             <div className={styles.header}> */}
      {/*               <div className={styles.title}>{i18n.write_to_shy}</div> */}
      {/*               <div className={styles.topBtnRow}> */}
      {/*                 <button onClick={() => setIsOpen(false)}> */}
      {/*                   <AiOutlineClose /> */}
      {/*                 </button> */}
      {/*               </div> */}
      {/*             </div> */}
      {/*           </div> */}
      {/*         </> */}
      {/*       </FloatingFocusManager> */}
      {/*     </FloatingOverlay> */}
      {/*   )} */}
      {/* </FloatingPortal> */}
    </>
  );
};

export default PostDialog;

export interface PostDialogProps {
  children: React.ReactNode;
}
