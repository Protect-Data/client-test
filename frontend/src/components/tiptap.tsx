"use client";

import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import { EditorProvider, useCurrentEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React from "react";

const MenuBar = () => {
  const { editor } = useCurrentEditor();

  if (!editor) {
    return null;
  }

  return (
    <div className="control-group">
      <div className="flex flex-wrap gap-1 mb-4">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={`${
            editor.isActive("bold")
              ? "bg-protectdata-500 hover:bg-protectdata-400"
              : "bg-zinc-200 hover:bg-zinc-300"
          } rounded-lg p-1.5 px-2 text-black text-sm disabled:cursor-not-allowed disabled:opacity-50 transition duration-300 ease-in-out`}
        >
          Bold
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={`${
            editor.isActive("italic")
              ? "bg-protectdata-500 hover:bg-protectdata-400"
              : "bg-zinc-200 hover:bg-zinc-300"
          } rounded-lg p-1.5 px-2 text-black text-sm disabled:cursor-not-allowed disabled:opacity-50 transition duration-300 ease-in-out`}
        >
          Italic
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={`${
            editor.isActive("strike")
              ? "bg-protectdata-500 hover:bg-protectdata-400"
              : "bg-zinc-200 hover:bg-zinc-300"
          } rounded-lg p-1.5 px-2 text-black text-sm disabled:cursor-not-allowed disabled:opacity-50 transition duration-300 ease-in-out`}
        >
          Strike
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={!editor.can().chain().focus().toggleCode().run()}
          className={`${
            editor.isActive("code")
              ? "bg-protectdata-500 hover:bg-protectdata-400"
              : "bg-zinc-200 hover:bg-zinc-300"
          } rounded-lg p-1.5 px-2 text-black text-sm disabled:cursor-not-allowed disabled:opacity-50 transition duration-300 ease-in-out`}
        >
          Code
        </button>
        <button
          onClick={() => editor.chain().focus().unsetAllMarks().run()}
          className={`bg-zinc-200 hover:bg-zinc-300 rounded-lg p-1.5 px-2 text-black text-sm disabled:cursor-not-allowed disabled:opacity-50 transition duration-300 ease-in-out`}
        >
          Clear marks
        </button>
        <button
          onClick={() => editor.chain().focus().clearNodes().run()}
          className={`bg-zinc-200 hover:bg-zinc-300 rounded-lg p-1.5 px-2 text-black text-sm disabled:cursor-not-allowed disabled:opacity-50 transition duration-300 ease-in-out`}
        >
          Clear nodes
        </button>
        <button
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={`${
            editor.isActive("paragraph")
              ? "bg-protectdata-500 hover:bg-protectdata-400"
              : "bg-zinc-200 hover:bg-zinc-300"
          } rounded-lg p-1.5 px-2 text-black text-sm disabled:cursor-not-allowed disabled:opacity-50 transition duration-300 ease-in-out`}
        >
          Paragraph
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={`${
            editor.isActive("heading", { level: 1 })
              ? "bg-protectdata-500 hover:bg-protectdata-400"
              : "bg-zinc-200 hover:bg-zinc-300"
          } rounded-lg p-1.5 px-2 text-black text-sm disabled:cursor-not-allowed disabled:opacity-50 transition duration-300 ease-in-out`}
        >
          H1
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={`${
            editor.isActive("heading", { level: 2 })
              ? "bg-protectdata-500 hover:bg-protectdata-400"
              : "bg-zinc-200 hover:bg-zinc-300"
          } rounded-lg p-1.5 px-2 text-black text-sm disabled:cursor-not-allowed disabled:opacity-50 transition duration-300 ease-in-out`}
        >
          H2
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={`${
            editor.isActive("heading", { level: 3 })
              ? "bg-protectdata-500 hover:bg-protectdata-400"
              : "bg-zinc-200 hover:bg-zinc-300"
          } rounded-lg p-1.5 px-2 text-black text-sm disabled:cursor-not-allowed disabled:opacity-50 transition duration-300 ease-in-out`}
        >
          H3
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 4 }).run()
          }
          className={`${
            editor.isActive("heading", { level: 4 })
              ? "bg-protectdata-500 hover:bg-protectdata-400"
              : "bg-zinc-200 hover:bg-zinc-300"
          } rounded-lg p-1.5 px-2 text-black text-sm disabled:cursor-not-allowed disabled:opacity-50 transition duration-300 ease-in-out`}
        >
          H4
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 5 }).run()
          }
          className={`${
            editor.isActive("heading", { level: 5 })
              ? "bg-protectdata-500 hover:bg-protectdata-400"
              : "bg-zinc-200 hover:bg-zinc-300"
          } rounded-lg p-1.5 px-2 text-black text-sm disabled:cursor-not-allowed disabled:opacity-50 transition duration-300 ease-in-out`}
        >
          H5
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 6 }).run()
          }
          className={`${
            editor.isActive("heading", { level: 6 })
              ? "bg-protectdata-500 hover:bg-protectdata-400"
              : "bg-zinc-200 hover:bg-zinc-300"
          } rounded-lg p-1.5 px-2 text-black text-sm disabled:cursor-not-allowed disabled:opacity-50 transition duration-300 ease-in-out`}
        >
          H6
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`${
            editor.isActive("bulletList")
              ? "bg-protectdata-500 hover:bg-protectdata-400"
              : "bg-zinc-200 hover:bg-zinc-300"
          } rounded-lg p-1.5 px-2 text-black text-sm disabled:cursor-not-allowed disabled:opacity-50 transition duration-300 ease-in-out`}
        >
          Bullet list
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`${
            editor.isActive("orderedList")
              ? "bg-protectdata-500 hover:bg-protectdata-400"
              : "bg-zinc-200 hover:bg-zinc-300"
          } rounded-lg p-1.5 px-2 text-black text-sm disabled:cursor-not-allowed disabled:opacity-50 transition duration-300 ease-in-out`}
        >
          Ordered list
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`${
            editor.isActive("codeBlock")
              ? "bg-protectdata-500 hover:bg-protectdata-400"
              : "bg-zinc-200 hover:bg-zinc-300"
          } rounded-lg p-1.5 px-2 text-black text-sm disabled:cursor-not-allowed disabled:opacity-50 transition duration-300 ease-in-out`}
        >
          Code block
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`${
            editor.isActive("blockquote")
              ? "bg-protectdata-500 hover:bg-protectdata-400"
              : "bg-zinc-200 hover:bg-zinc-300"
          } rounded-lg p-1.5 px-2 text-black text-sm disabled:cursor-not-allowed disabled:opacity-50 transition duration-300 ease-in-out`}
        >
          Blockquote
        </button>
        <button
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className={`bg-zinc-200 hover:bg-zinc-300 rounded-lg p-1.5 px-2 text-black text-sm disabled:cursor-not-allowed disabled:opacity-50 transition duration-300 ease-in-out`}
        >
          Horizontal rule
        </button>
        <button
          onClick={() => editor.chain().focus().setHardBreak().run()}
          className={`bg-zinc-200 hover:bg-zinc-300 rounded-lg p-1.5 px-2 text-black text-sm disabled:cursor-not-allowed disabled:opacity-50 transition duration-300 ease-in-out`}
        >
          Hard break
        </button>
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          className={`bg-zinc-200 hover:bg-zinc-300 rounded-lg p-1.5 px-2 text-black text-sm disabled:cursor-not-allowed disabled:opacity-50 transition duration-300 ease-in-out`}
        >
          Undo
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          className={`bg-zinc-200 hover:bg-zinc-300 rounded-lg p-1.5 px-2 text-black text-sm disabled:cursor-not-allowed disabled:opacity-50 transition duration-300 ease-in-out`}
        >
          Redo
        </button>
      </div>
    </div>
  );
};

const extensions = [
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false
    }
  })
];

const Tiptap = ({
  defaultContent,
  onUpdate
}: {
  defaultContent: any;
  onUpdate: (e: any) => void;
}) => {
  return (
    <EditorProvider
      slotBefore={<MenuBar />}
      extensions={extensions}
      content={defaultContent}
      onUpdate={({ editor }) => {
        onUpdate(editor.getHTML());
      }}
    ></EditorProvider>
  );
};

export default Tiptap;
