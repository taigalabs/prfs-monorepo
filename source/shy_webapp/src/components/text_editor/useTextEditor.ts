import { useEditor, EditorProvider } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";

import styles from "./TextEditor.module.scss";

export function useTextEditor() {
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
      placeholder: "Type here. You can use Markdown to format.",
    }),
  ];

  const editor = useEditor({ extensions });

  return { editor, extensions };
}
