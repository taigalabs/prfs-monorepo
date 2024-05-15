import React from "react";
import cn from "classnames";
import {
  useEditor,
  EditorProvider,
  Extensions,
  Editor,
  EditorContent,
  FloatingMenu,
} from "@tiptap/react";

import styles from "./TextEditor.module.scss";
import EditorMenuBar from "./EditorMenuBar";

const TextEditor: React.FC<TextEditorProps> = ({ editor, className, showMenuBar }) => {
  return (
    <div className={cn(styles.wrapper, className)}>
      {showMenuBar && <EditorMenuBar editor={editor} />}
      <EditorContent editor={editor} className={styles.editor} />
    </div>
  );
};

export default TextEditor;

export interface TextEditorProps {
  editor: Editor;
  className?: string;
  showMenuBar?: boolean;
}
