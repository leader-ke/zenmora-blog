"use client";

import type { ChangeEvent } from "react";
import { useEffect, useRef, useState, useTransition } from "react";

type PostContentEditorProps = {
  defaultValue?: string;
  name: string;
};

type UploadKind = "image" | "file";

function getSelectionRange() {
  const selection = window.getSelection();

  if (!selection || selection.rangeCount === 0) {
    return null;
  }

  return selection.getRangeAt(0);
}

export function PostContentEditor({ defaultValue = "", name }: PostContentEditorProps) {
  const [value, setValue] = useState(defaultValue);
  const [status, setStatus] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const editorRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== defaultValue) {
      editorRef.current.innerHTML = defaultValue || "<p></p>";
    }
  }, [defaultValue]);

  function syncValue() {
    const nextValue = editorRef.current?.innerHTML ?? "";
    setValue(nextValue);
  }

  function focusEditor() {
    editorRef.current?.focus();
  }

  function runCommand(command: string, commandValue?: string) {
    focusEditor();
    document.execCommand(command, false, commandValue);
    syncValue();
  }

  function setBlock(block: "P" | "H2" | "BLOCKQUOTE") {
    focusEditor();
    document.execCommand("formatBlock", false, block);
    syncValue();
  }

  function insertList(ordered = false) {
    runCommand(ordered ? "insertOrderedList" : "insertUnorderedList");
  }

  function insertHtml(html: string) {
    const range = getSelectionRange();
    focusEditor();

    if (range) {
      range.deleteContents();
      const template = document.createElement("template");
      template.innerHTML = html;
      range.insertNode(template.content);
      range.collapse(false);
    } else {
      document.execCommand("insertHTML", false, html);
    }

    syncValue();
  }

  async function uploadInline(file: File, kind: UploadKind) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("directory", kind === "image" ? "editor-images" : "editor-files");

    const response = await fetch("/api/admin/uploads", {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      throw new Error("Upload failed");
    }

    const uploaded = (await response.json()) as { fileName: string; relativePath: string };

    if (kind === "image") {
      insertHtml(
        `<figure class="article-figure"><img src="${uploaded.relativePath}" alt="${file.name.replace(/\.[^.]+$/, "")}" /><figcaption>${file.name.replace(/\.[^.]+$/, "")}</figcaption></figure><p></p>`
      );
    } else {
      insertHtml(
        `<p><a href="${uploaded.relativePath}" target="_blank" rel="noreferrer" class="article-file-link">${file.name}</a></p>`
      );
    }
  }

  function handleFileSelection(event: ChangeEvent<HTMLInputElement>, kind: UploadKind) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setStatus("Uploading...");
    startTransition(async () => {
      try {
        await uploadInline(file, kind);
        setStatus(kind === "image" ? "Image inserted into the post." : "File link inserted into the post.");
      } catch {
        setStatus("Upload failed. Try again.");
      } finally {
        event.target.value = "";
      }
    });
  }

  return (
    <div className="editor-stack">
      <div className="editor-toolbar">
        <div className="editor-toolbar__group">
          <button type="button" className="editor-toolbutton editor-toolbutton--wide" onClick={() => setBlock("P")}>
            Paragraph
          </button>
          <button type="button" className="editor-toolbutton editor-toolbutton--wide" onClick={() => setBlock("H2")}>
            Heading
          </button>
          <button type="button" className="editor-toolbutton editor-toolbutton--wide" onClick={() => setBlock("BLOCKQUOTE")}>
            Quote
          </button>
        </div>

        <div className="editor-toolbar__group">
          <button type="button" className="editor-toolbutton" onClick={() => runCommand("bold")}>
            B
          </button>
          <button type="button" className="editor-toolbutton" onClick={() => runCommand("italic")}>
            I
          </button>
          <button type="button" className="editor-toolbutton" onClick={() => runCommand("underline")}>
            U
          </button>
        </div>

        <div className="editor-toolbar__group">
          <button type="button" className="editor-toolbutton" onClick={() => insertList(false)}>
            • List
          </button>
          <button type="button" className="editor-toolbutton" onClick={() => insertList(true)}>
            1. List
          </button>
        </div>

        <div className="editor-toolbar__group">
          <button type="button" className="editor-toolbutton editor-toolbutton--wide" onClick={() => imageInputRef.current?.click()} disabled={isPending}>
            Upload image
          </button>
          <button type="button" className="editor-toolbutton editor-toolbutton--wide" onClick={() => fileInputRef.current?.click()} disabled={isPending}>
            Upload file
          </button>
        </div>
      </div>

      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(event) => handleFileSelection(event, "image")}
      />
      <input ref={fileInputRef} type="file" hidden onChange={(event) => handleFileSelection(event, "file")} />

      <div
        ref={editorRef}
        className="wysiwyg-editor"
        contentEditable
        suppressContentEditableWarning
        onInput={syncValue}
        onBlur={syncValue}
      />

      <input type="hidden" name={name} value={value} />

      {status ? <div className="status-note">{status}</div> : null}
    </div>
  );
}
