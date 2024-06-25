"use client";

import EditorTemplate from "@/components/editor/EditorTemplate";
import Sidebar from "@/components/editor/Sidebar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/Resizeable";
import { EditorProvider } from "@/store/EditorContext";
import { FileContentProvider } from "@/store/FileContentContext";
import React, { useState } from "react";

const Editor: React.FC = () => {
  return (
    <div>
      <EditorProvider>
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel
            defaultSize={14}
            minSize={9}
          >
            <Sidebar />
          </ResizablePanel>
          <ResizableHandle className="bg-gray hover:bg-primary" />
          <ResizablePanel
            defaultSize={86}
          >
            <FileContentProvider>
              <EditorTemplate />
            </FileContentProvider>
          </ResizablePanel>
        </ResizablePanelGroup>
      </EditorProvider>
    </div>
  );
};

export default Editor;
