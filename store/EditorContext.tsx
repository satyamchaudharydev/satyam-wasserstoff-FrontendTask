
import { ReactNode, createContext, useContext, useState } from "react";
import { FileSystem, FileType } from "@/lib/types";

export interface SelectedFile {
    type: "file" | "folder",
    name: string

}
export type EditorContextType = {
    fileSystem: FileSystem;
    selectedItem: SelectedFile | null;
    setFileSystem: React.Dispatch<React.SetStateAction<FileSystem>>;
    setSelectedItem: React.Dispatch<React.SetStateAction<SelectedFile | null>>;
    updateOpenFiles: (newOpenFile: string) => void;
    openFiles: string[];
};

export const EditorContext = createContext<EditorContextType>({
  fileSystem: {},
  selectedItem: null,
  setFileSystem: () => {},
  setSelectedItem: () => {},
  updateOpenFiles: () => {},
  openFiles: []
});

export const EditorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [fileSystem, setFileSystem] = useState<FileSystem>({
    root: {
      type: 'folder',
      isOpen: true,
      children: {
        Documents: {
          type: 'folder',
          isOpen: false,
          children: {
            'note.note': { type: 'file', extension: FileType.NOTE },
            'list.lt': { type: 'file', extension: FileType.LT },
          },
        },
        'beadme.readme': { type: 'file', extension: FileType.README },
        'aext.ed': { type: 'file', extension: FileType.ED },
      },
    },
    'file.ed': {
      type: 'file',
      extension: FileType.ED,
    },
    dusraRoot: {
      type: 'folder',
      isOpen: true,
      children: {
        Documents: {
          type: 'folder',
          isOpen: false,
          children: {
            'note.note': { type: 'file', extension: FileType.NOTE },
            'list.lt': { type: 'file', extension: FileType.LT },
          },
        },
        'beadme.readme': { type: 'file', extension: FileType.README },
        'aext.ed': { type: 'file', extension: FileType.ED },
      },
    },
  });
  const [selectedItem, setSelectedItem] = useState<{
    type: "file" | "folder",
    name: string
  } | null>(null);
  const [openFiles, setOpenFiles] = useState<string[]>([]);
  
  
  const updateOpenFiles = (newOpenFile: string) => {
    if(openFiles.includes(newOpenFile)) return
    setOpenFiles([...openFiles, newOpenFile])
  }
  
  // const updateFileSystem = (newFileSystem: FileSystem) => {
    //     setFileSystem(newFileSystem);
    // }
    // const updateSelectedItem = (path: string) => {
      //     setSelectedItem(path);
      // }
      return (
        <EditorContext.Provider value={{ 
          fileSystem, 
          setFileSystem, 
          selectedItem,
          setSelectedItem, 
          updateOpenFiles,
          openFiles  
        }}>
            {children}
        </EditorContext.Provider>
    );
  };
export const useEditorContext = () => useContext(EditorContext);