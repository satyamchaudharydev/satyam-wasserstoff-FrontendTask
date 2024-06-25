import React from "react";
import useCodeEditor from "./hooks/useCodeEditor";
import { Extension } from "@codemirror/state";
import { ViewUpdate } from "@codemirror/view";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  extensions?: Extension[];
  readOnly?: boolean;
  language?: string;
}

export default function CodeEditor({ 
  value, 
  onChange, 
  extensions, 
  readOnly = false, 
  language 
}: CodeEditorProps) {
  
  const adjustedLanguage = (language === "javascript" || language === "markup") ? "htmlMixed" : language;
  
  const ref = useCodeEditor({ 
    value, 
    onChange, 
    extensions, 
    readOnly, 
    language: adjustedLanguage 
  });

  return <div style={{ height: "100%" }} ref={ref} />;
}