import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useState } from "react";


export interface EdFileContent {
    type: 'ed';
    content: string;
}

export interface Note {
    id: string;
    content: string;
    status: string;

}
  
export interface NoteFileContent {
    notes: Note[]
}

export interface LtFileContent {
    type: 'lt';
    items: {id: string; content: string}[];
}

export interface ReadmeFileContent {
    type: 'readme';
    markdown: string;
    fileName: string;
}
  
type FileContent = EdFileContent | NoteFileContent | LtFileContent | ReadmeFileContent;
  
// Define a separate context for file contents
export type FileContentContextType = {
    fileContents: { [key: string]: FileContent };
    setFileContents: Dispatch<SetStateAction<{ [key: string]: FileContent }>>;
    updateFileContent: (path: string, content: Partial<FileContent>) => void;
  };
  
export const FileContentContext = createContext<FileContentContextType>({
    fileContents: {},
    setFileContents: () => {},
    updateFileContent: () => {},
});
  
export const FileContentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [fileContents, setFileContents] = useState<{ [key: string]: FileContent }>({});

    const updateFileContent = (path: string, content: Partial<FileContent>) => {
        console.log("calling this", path,content)
        setFileContents((prevContents: any ) => {
            const fileContent = prevContents[path];
            if (!fileContent) {
                return { ...prevContents, [path]: content };
            }
            return { ...prevContents, [path]: { ...fileContent, ...content } };
        });
    };
    
    console.log("fileContents", fileContents)
    return (
        <FileContentContext.Provider value={{ fileContents, setFileContents, updateFileContent }}>
            {children}
        </FileContentContext.Provider>
    );
};
  

export const useFileContentContext = () => {
    return useContext(FileContentContext);
}
  