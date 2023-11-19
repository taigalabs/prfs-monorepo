import React from "react";
import { useRouter } from "next/navigation";
import {
  EditorProvider,
  FloatingMenu,
  BubbleMenu,
  useEditor,
  EditorContent,
  useCurrentEditor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import Placeholder from "@tiptap/extension-placeholder";
import { useMutation } from "wagmi";
import { prfsApi2 } from "@taigalabs/prfs-api-js";
import { CreatePrfsProofInstanceRequest } from "@taigalabs/prfs-entities/bindings/CreatePrfsProofInstanceRequest";

import styles from "./TextEditor.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { paths } from "@/paths";

const extensions = [
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  TextStyle.configure({ HTMLAttributes: { types: [ListItem.name] } }),
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
  }),
  Placeholder.configure({
    emptyEditorClass: styles.isEditorEmpty,
  }),
];

const content = `
  <p><span>This has a &lt;span&gt; tag without a style attribute, so it’s thrown away.</span></p>
  <p><span style="color: blue;">But this one is wrapped in a &lt;span&gt; tag with an inline style attribute, so it’s kept - even if it’s empty for now.</span></p>
`;

const EditorMenuBar = () => {
  const { editor } = useCurrentEditor();

  if (!editor) {
    return null;
  }

  return (
    <div className={styles.menuBar}>
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={editor.isActive("bold") ? "is-active" : ""}
      >
        bold
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={editor.isActive("italic") ? "is-active" : ""}
      >
        italic
      </button>
    </div>
  );
};

const EditorFooter = () => {
  const i18n = React.useContext(i18nContext);
  const { editor } = useCurrentEditor();

  const { mutateAsync: createPrfsProofInstance, isLoading: isCreatePrfsProofInstanceLoading } =
    useMutation({
      mutationFn: (req: CreatePrfsProofInstanceRequest) => {
        return prfsApi2("create_prfs_proof_instance", req);
      },
    });

  if (!editor) {
    return null;
  }

  const handleClickPost = React.useCallback(() => {
    const text = editor.getText();
    console.log("text", text);
  }, [editor]);

  return (
    <div className={styles.footer}>
      <button onClick={handleClickPost}>{i18n.post}</button>
    </div>
  );
};

const TextEditor: React.FC = () => {
  const editor = useEditor({
    extensions,
    content,
  });

  if (!editor) {
    return null;
  }

  return (
    <EditorProvider
      slotBefore={<EditorMenuBar />}
      slotAfter={<EditorFooter />}
      extensions={extensions}
      content={""}
    >
      <div className={styles.wrapper}></div>
    </EditorProvider>
  );
};

export default TextEditor;

export interface TextEditorProps {}
