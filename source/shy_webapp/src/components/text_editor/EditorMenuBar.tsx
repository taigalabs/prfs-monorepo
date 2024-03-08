import React from "react";
import { useCurrentEditor } from "@tiptap/react";

import styles from "./EditorMenuBar.module.scss";

const EditorMenuBar: React.FC<EditorMenuBarProps> = ({}) => {
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

export default EditorMenuBar;

export interface EditorMenuBarProps {}
