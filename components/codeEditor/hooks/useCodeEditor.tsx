import { useEffect } from "react";
import { EditorView, ViewUpdate } from "@codemirror/view";
import { Extension } from "@codemirror/state";
import useCodeMirror from "./useCodeMirror";

type OnChangeFunction = (value: string) => void;

function onUpdate(onChange: OnChangeFunction): Extension {
  return EditorView.updateListener.of((viewUpdate: ViewUpdate) => {
    if (viewUpdate.docChanged) {
      const doc = viewUpdate.state.doc;
      const value = doc.toString();
      onChange(value);
    }
  });
}

interface UseCodeEditorProps {
  value: string;
  onChange: OnChangeFunction;
  extensions?: Extension[];
  readOnly?: boolean;
  language?: string;
}

export default function useCodeEditor({ 
  value, 
  onChange, 
  extensions = [], 
  readOnly,
  language 
}: UseCodeEditorProps): React.RefObject<HTMLDivElement> {
  const { ref, view } = useCodeMirror({
    extensions: [onUpdate(onChange), ...extensions],
    language
  });
  console.log("view",view, value)

  useEffect(() => {
    if (view) {
      const editorValue = view.state.doc.toString();
    console.log("editorValue",view)
      if (value !== editorValue) {
        view.dispatch({
          changes: {
            from: 0,
            to: editorValue.length,
            insert: value || "",
          },
        });
      }
    }
  }, [value, view]);

  return ref;
}