import { cn, getFileName } from "@/lib/utils";
import { useEditorContext } from "@/store/EditorContext";
import { Reorder, motion } from "framer-motion";
import { useState, useEffect } from "react";

const EditorHeader = () => {
    const { openFiles, selectedItem, setSelectedItem } = useEditorContext();
    const [orderedFiles, setOrderedFiles] = useState(openFiles);

    useEffect(() => {
        setOrderedFiles(openFiles);
    }, [openFiles]);

    const isFileOpen = (file: string) => {
        return selectedItem?.name === file;
    }

    return (
        <Reorder.Group 
            as="div" 
            axis="x" 
            values={orderedFiles} 
            onReorder={setOrderedFiles}
            className="flex items-center h-[45px] bg-foreground pt-3 relative"
        >
            {orderedFiles.map((file) => (
                <Reorder.Item 
                    key={file} 
                    value={file}
                    className={cn(
                        "px-4 py-1 text-white h-full text-[14px] flex justify-center items-center relative",
                        isFileOpen(file) ? 'bg-background' : 'opacity-[0.6]'
                    )}
                    onClick={() => setSelectedItem({
                        type: "file",
                        name: file
                    })}
                    whileDrag={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                    {getFileName(file)}
                    {isFileOpen(file) && (
                        <motion.div 
                            className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-500"
                            layoutId="underline"
                        />
                    )}
                </Reorder.Item>
            ))}
        </Reorder.Group>
    );
}

export default EditorHeader;