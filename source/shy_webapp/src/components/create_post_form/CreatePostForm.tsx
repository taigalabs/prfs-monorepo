import React from "react";
import { useRouter } from "next/navigation";

import styles from "./CreatePostForm.module.scss";
import { i18nContext } from "@/i18n/context";
import { paths } from "@/paths";
import RightBar from "@/components/right_bar/RightBar";
import TextEditor from "@/components/text_editor/TextEditor";
import { ShyChannel } from "@taigalabs/shy-entities/bindings/ShyChannel";

const CreatePostForm: React.FC<CreatePostFormProps> = ({ channel }) => {
  const i18n = React.useContext(i18nContext);
  const router = useRouter();

  return (
    <div className={styles.wrapper}>
      33
      {/* <ContentMainInfiniteScroll> */}
      {/*   <ContentMainCenter> */}
      {/*     <ContentMainHeader style={{ height: 65 }}> */}
      {/*       <ContentMainTitle> */}
      {/*         {i18n.code} for {channelId} */}
      {/*       </ContentMainTitle> */}
      {/*     </ContentMainHeader> */}
      {/*     <ContentMainBody style={{ paddingTop: 65 }}> */}
      {/*       <div className={styles.editorContainer}> */}
      {/*         <TextEditor /> */}
      {/*       </div> */}
      {/*       <div className={styles.btnRow}>btn</div> */}
      {/*     </ContentMainBody> */}
      {/*   </ContentMainCenter> */}
      {/*   <ContentMainRight> */}
      {/*     <RightBar /> */}
      {/*   </ContentMainRight> */}
      {/* </ContentMainInfiniteScroll> */}
    </div>
  );
};

export default CreatePostForm;

export interface CreatePostFormProps {
  channel: ShyChannel;
}
