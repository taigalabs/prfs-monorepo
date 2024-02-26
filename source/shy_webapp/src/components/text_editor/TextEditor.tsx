import React from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
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
import Link from "@tiptap/extension-link";
import { useMutation } from "@taigalabs/prfs-react-lib/react_query";
import { shyApi2 } from "@taigalabs/shy-api-js";
import { CreateShyPostRequest } from "@taigalabs/shy-entities/bindings/CreateShyPostRequest";
import { ShyPost } from "@taigalabs/shy-entities/bindings/ShyPost";

import styles from "./TextEditor.module.scss";
import { i18nContext } from "@/i18n/context";
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
  Link.extend({
    inclusive: false,
  }).configure({
    autolink: true,
  }),
  Placeholder.configure({
    emptyEditorClass: styles.isEditorEmpty,
    placeholder:
      "Type here. You can use Markdown to format. Copy pasting images will later be supported",
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

const EditorFooter: React.FC<EditorFooterProps> = ({}) => {
  const i18n = React.useContext(i18nContext);
  const { editor } = useCurrentEditor();
  const router = useRouter();

  const { mutateAsync: createSocialPost } = useMutation({
    mutationFn: (req: CreateShyPostRequest) => {
      return shyApi2({ type: "create_shy_post", ...req });
    },
  });

  if (!editor) {
    return null;
  }

  const handleClickPost = React.useCallback(async () => {
    try {
      const html = editor.getHTML();
      console.log("html", html);

      // const text = editor.getText();
      // console.log("text", text);

      const post_id = uuidv4();
      const post: ShyPost = {
        post_id,
        content: html,
        channel_id: "default",
      };

      const { payload } = await createSocialPost({ post });
      console.log("create social post resp", payload);

      window.location.reload();
    } catch (err) {}
  }, [editor, createSocialPost, router]);

  return (
    <div className={styles.footer}>
      <button onClick={handleClickPost}>{i18n.post}</button>
    </div>
  );
};

const TextEditor: React.FC<TextEditorProps> = ({ handleClickPost }) => {
  const editor = useEditor({
    extensions,
    content,
  });

  if (!editor) {
    return null;
  }

  const footer = <EditorFooter handleClickPost={handleClickPost} />;

  return (
    <div className={styles.wrapper}>
      <EditorProvider
        editorProps={{
          attributes: {
            class: `${styles.editor}`,
          },
        }}
        // slotBefore={<EditorMenuBar />}
        slotAfter={footer}
        extensions={extensions}
        content={""}
      >
        <div className={styles.wrapper}></div>
      </EditorProvider>
    </div>
  );
};

export default TextEditor;

export interface TextEditorProps {
  handleClickPost: () => void;
}

export interface EditorFooterProps {
  handleClickPost: () => void;
}
