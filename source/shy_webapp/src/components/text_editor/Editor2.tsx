// new Editor({
//   element: document.querySelector('.editor'),
//   extensions: [
//     StarterKit,
//     Image,
//   ],
//   editorProps: {
//     handleDrop: function(view, event, slice, moved) {
//       if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) { // if dropping external files
//         let file = event.dataTransfer.files[0]; // the dropped file
//         let filesize = ((file.size/1024)/1024).toFixed(4); // get the filesize in MB
//         if ((file.type === "image/jpeg" || file.type === "image/png") && filesize < 10) { // check valid image type under 10MB
//           // check the dimensions
//           let _URL = window.URL || window.webkitURL;
//           let img = new Image(); /* global Image */
//           img.src = _URL.createObjectURL(file);
//           img.onload = function () {
//             if (this.width > 5000 || this.height > 5000) {
//               window.alert("Your images need to be less than 5000 pixels in height and width."); // display alert
//             } else {
//               // valid image so upload to server
//               // uploadImage will be your function to upload the image to the server or s3 bucket somewhere
//               uploadImage(file).then(function(response) { // response is the image url for where it has been saved
//                 // pre-load the image before responding so loading indicators can stay
//                 // and swaps out smoothly when image is ready
//                 let image = new Image();
//                 image.src = response;
//                 image.onload = function() {
//                   // place the now uploaded image in the editor where it was dropped
//                   const { schema } = view.state;
//                   const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY });
//                   const node = schema.nodes.image.create({ src: response }); // creates the image element
//                   const transaction = view.state.tr.insert(coordinates.pos, node); // places it in the correct position
//                   return view.dispatch(transaction);
//                 }
//               }).catch(function(error) {
//                 if (error) {
//                   window.alert("There was a problem uploading your image, please try again.");
//                 }
//               });
//             }
//           };
//         } else {
//           window.alert("Images need to be in jpg or png format and less than 10mb in size.");
//         }
//         return true; // handled
//       }
//       return false; // not handled use default behaviour
//     }
//   },
//   content: `
//     <p>Hello World!</p>
//     <img src="https://source.unsplash.com/8xznAGy4HcY/800x400" />
//   `,
// });

import React from "react";
import cn from "classnames";
import { useEditor, EditorProvider } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";

import styles from "./TextEditor.module.scss";

const extensions = [
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  // Image,
  TextStyle.configure({ HTMLAttributes: { types: [ListItem.name] } }),
  // StarterKit.configure({
  //   bulletList: {
  //     keepMarks: true,
  //     keepAttributes: false,
  //   },
  //   orderedList: {
  //     keepMarks: true,
  //     keepAttributes: false,
  //   },
  // }),
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

const TextEditor2: React.FC<TextEditorProps> = ({ className }) => {
  console.log(123);
  const editor = useEditor({
    extensions,
    editorProps: {
      handleDrop: function (view, event, slice, moved) {
        console.log(123);
        // if (
        //   !moved &&
        //   event.dataTransfer &&
        //   event.dataTransfer.files &&
        //   event.dataTransfer.files[0]
        // ) {
        // let file = event.dataTransfer.files[0]; // the dropped file
        // let filesize = (file.size / 1024 / 1024).toFixed(4); // get the filesize in MB
        // if ((file.type === "image/jpeg" || file.type === "image/png") && filesize < 10) {
        //   // check valid image type under 10MB
        //   // check the dimensions
        //   let _URL = window.URL || window.webkitURL;
        //   let img = new window.Image(); /* global Image */
        //   img.src = _URL.createObjectURL(file);
        //   img.onload = function () {
        //     if (this.width > 5000 || this.height > 5000) {
        //       window.alert("Your images need to be less than 5000 pixels in height and width."); // display alert
        //     } else {
        //       // valid image so upload to server
        //       // uploadImage will be your function to upload the image to the server or s3 bucket somewhere
        //       uploadImage(file)
        //         .then(function (response) {
        //           // response is the image url for where it has been saved
        //           // pre-load the image before responding so loading indicators can stay
        //           // and swaps out smoothly when image is ready
        //           let image = new Image();
        //           image.src = response;
        //           image.onload = function () {
        //             // place the now uploaded image in the editor where it was dropped
        //             const { schema } = view.state;
        //             const coordinates = view.posAtCoords({
        //               left: event.clientX,
        //               top: event.clientY,
        //             });
        //             const node = schema.nodes.image.create({ src: response }); // creates the image element
        //             const transaction = view.state.tr.insert(coordinates.pos, node); // places it in the correct position
        //             return view.dispatch(transaction);
        //           };
        //         })
        //         .catch(function (error) {
        //           if (error) {
        //             window.alert("There was a problem uploading your image, please try again.");
        //           }
        //         });
        //     }
        //     };
        //   } else {
        //     window.alert("Images need to be in jpg or png format and less than 10mb in size.");
        //   }
        //   return true; // handled
        // }
        // return false; // not handled use default behaviour
      },
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className={cn(styles.wrapper, className)}>
      <EditorProvider
        editorProps={{
          attributes: {
            class: cn(styles.editor),
          },
        }}
        // slotBefore={<EditorMenuBar />}
        extensions={extensions}
        content={""}
      >
        <div className={styles.wrapper}></div>
      </EditorProvider>
    </div>
  );
};

export default TextEditor2;

export interface TextEditorProps {
  // footer: React.JSX.Element;
  className?: string;
  // editorClassName?: string;
}

async function uploadImage(file: any) {
  return "http://google.com";
}
