"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";

const ADM_BORDER = "#e2e8f0";
const ADM_TEXT = "#1e293b";

import type { Editor } from "@tiptap/react";

type TiptapEditorProps = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  /** Callback when editor is ready; use to insert content at cursor (e.g. placeholder chips). */
  onEditorReady?: (editor: Editor) => void;
};

export default function TiptapEditor({ value, onChange, placeholder, onEditorReady }: TiptapEditorProps) {
  const t = useTranslations("admin.newsletter");
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Link.configure({ openOnClick: false, HTMLAttributes: { target: "_blank", rel: "noopener" } }),
    ],
    content: value || "",
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none min-h-[200px] px-3 py-2 outline-none",
      },
    },
  });

  const onUpdate = useCallback(() => {
    if (editor) onChange(editor.getHTML());
  }, [editor, onChange]);

  useEffect(() => {
    if (!editor) return;
    editor.on("update", onUpdate);
    return () => {
      editor.off("update", onUpdate);
    };
  }, [editor, onUpdate]);

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "", false);
    }
  }, [value, editor]);

  useEffect(() => {
    if (editor && onEditorReady) onEditorReady(editor);
  }, [editor, onEditorReady]);

  if (!editor) return <div className="min-h-[200px] rounded-lg border p-2" style={{ borderColor: ADM_BORDER }}>{t("editorLoading")}</div>;

  return (
    <div className="rounded-lg border overflow-hidden" style={{ borderColor: ADM_BORDER }}>
      <div className="flex flex-wrap gap-1 p-2 border-b" style={{ borderColor: ADM_BORDER }}>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-2 py-1 rounded text-sm font-medium ${editor.isActive("bold") ? "bg-slate-200" : ""}`}
          style={{ color: ADM_TEXT }}
          title={t("toolbarBold")}
        >
          {t("toolbarBold")}
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-2 py-1 rounded text-sm ${editor.isActive("italic") ? "bg-slate-200 italic" : ""}`}
          style={{ color: ADM_TEXT }}
          title={t("toolbarItalic")}
        >
          {t("toolbarItalic")}
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`px-2 py-1 rounded text-sm ${editor.isActive("heading", { level: 1 }) ? "bg-slate-200" : ""}`}
          style={{ color: ADM_TEXT }}
          title={t("toolbarH1")}
        >
          {t("toolbarH1")}
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-2 py-1 rounded text-sm ${editor.isActive("heading", { level: 2 }) ? "bg-slate-200" : ""}`}
          style={{ color: ADM_TEXT }}
          title={t("toolbarH2")}
        >
          {t("toolbarH2")}
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-2 py-1 rounded text-sm ${editor.isActive("bulletList") ? "bg-slate-200" : ""}`}
          style={{ color: ADM_TEXT }}
          title={t("toolbarBulletList")}
        >
          {t("toolbarBulletList")}
        </button>
        <button
          type="button"
          onClick={() => {
            const url = window.prompt("URL:");
            if (url) editor.chain().focus().setLink({ href: url }).run();
          }}
          className={`px-2 py-1 rounded text-sm ${editor.isActive("link") ? "bg-slate-200" : ""}`}
          style={{ color: ADM_TEXT }}
          title={t("toolbarLink")}
        >
          {t("toolbarLink")}
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
