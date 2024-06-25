import { useState, useRef, useEffect } from "react";
import { EditorView, basicSetup } from "codemirror";
import { keymap } from "@codemirror/view";
import { indentWithTab } from "@codemirror/commands";
import { Extension } from "@codemirror/state";

import { html  } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { javascript } from "@codemirror/lang-javascript";
import { dracula } from "@uiw/codemirror-theme-dracula";

const mixedHTML = html();

interface CodeMirrorOptions {
  language?: string;
  lint?: boolean;
  extensions?: Extension[];
  readOnly?: boolean;
}

interface CodeMirrorHookResult {
  ref: React.RefObject<HTMLDivElement>;
  view: EditorView | undefined;
}

export default function useCodeMirror({
  language,
  extensions = [],
  readOnly = false,
}: CodeMirrorOptions = {}): CodeMirrorHookResult {

  const ref = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<EditorView>();

  useEffect(() => {

    if (!ref.current) return;

    const lang = language && getLanguage(language);
    const view = new EditorView({
      extensions: [
        basicSetup,
        keymap.of([indentWithTab]),
        lang ? lang : [],
        dracula,
        EditorView.lineWrapping,
        EditorView.theme(
          {
            "&": {
              fontSize: `18px`,
              height: "100%",
            },
            ".cm-scroller": {
              backgroundColor: "#181A1D",
            },
            "&.cm-focused": {
              backgroundColor: "#181A1D",
            },
            ".cm-gutters": {
              backgroundColor: "#181A1D !important",
            },
          },
          { dark: true }
        ),
        ...extensions,
      ],
      parent: ref.current,
    });

    setView(view);

    return () => {
      view.destroy();
      setView(undefined);
    };
  }, []);

  function getLanguage(language: string): Extension {
    switch (language) {
      case "htmlMixed":
        return mixedHTML;
      default:
        return mixedHTML;
    }
  }

  return { ref, view };
}