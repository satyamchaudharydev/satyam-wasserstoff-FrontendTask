import { EditorContext } from "@/store/EditorContext";
import { EdFileContent, FileContentContext } from "@/store/FileContentContext"
import { useContext, useEffect, useRef, useState } from "react";
import CodeEditor from "../codeEditor";
import Preview from "../ui/Preview";

const TextEditor = ({
    content = {
        type: 'ed',
        content: ''
    }
}: {
    content?: EdFileContent
}) => {
    const { updateFileContent } = useContext(FileContentContext);
    const {
        selectedItem
    } = useContext(EditorContext);
    const [editorContent, setEditorContent] = useState(content.content);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
   
    useEffect(() => {
        if (textAreaRef.current) {
            textAreaRef.current.focus();
        }
    }, [selectedItem]);
    const handleContentChange = (newCode: string) => {
        setEditorContent(newCode);
        updateFileContent(selectedItem?.name || "", { content: newCode });
    };
    return (
        <>
            <div className="w-full h-full">
                <CodeEditor value={editorContent} onChange={(code) => handleContentChange(code)} />
            </div>
        </>
    )
}

export default TextEditor