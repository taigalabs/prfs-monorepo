import React from "react";
import { useEditor, EditorProvider } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";

import styles from "./TextEditor.module.scss";

const extensions = [
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  TextStyle.configure({ HTMLAttributes: { types: [ListItem.name] } }),
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false,
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false,
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
      "Type here. You can use Markdown to format. Copy pasting images will later be supported.",
  }),
];

// const EditorMenuBar = () => {
//   const { editor } = useCurrentEditor();

//   if (!editor) {
//     return null;
//   }

//   return (
//     <div className={styles.menuBar}>
//       <button
//         onClick={() => editor.chain().focus().toggleBold().run()}
//         disabled={!editor.can().chain().focus().toggleBold().run()}
//         className={editor.isActive("bold") ? "is-active" : ""}
//       >
//         bold
//       </button>
//       <button
//         onClick={() => editor.chain().focus().toggleItalic().run()}
//         disabled={!editor.can().chain().focus().toggleItalic().run()}
//         className={editor.isActive("italic") ? "is-active" : ""}
//       >
//         italic
//       </button>
//     </div>
//   );
// };

const TextEditor: React.FC<TextEditorProps> = ({ footer }) => {
  const editor = useEditor({
    extensions,
  });

  if (!editor) {
    return null;
  }

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
  footer: React.JSX.Element;
}
