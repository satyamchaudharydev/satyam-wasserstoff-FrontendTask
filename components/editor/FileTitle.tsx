import { cn } from "@/lib/utils";
import { useState } from "react";

interface FileSystemItem {
    type: 'file' | 'folder';
    name: string;
    path: string;
}

interface FileTitleProps {
    file: FileSystemItem;
    onTitleChange: (newTitle: string, filePath: string) => void;
    icon: any;
    isSelected: boolean;
}

const FileTitle: React.FC<FileTitleProps> = ({ file, onTitleChange, icon, isSelected }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(file.name);
    
    const handleBlur = () => {
        setIsEditing(false);
        if (title.trim() === "") {
            setTitle(file.name);
        } else {
            onTitleChange(title, file.path);
        }
    };
    
    return (
        <div className="flex items-center">
         <span className="mr-2">{icon}</span>

        {isEditing ? (
            <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleBlur}
            className="text-[#b0bacb] text-[14px]  bg-transparent border-b border-transparent focus:outline-none focus:border-primary focus:ring-0"
            />
        ) : (
            <span onDoubleClick={() => setIsEditing(true)} className={cn('text-[#b0bacb] text-[14px]', isSelected && 'text-white')}>{title}</span>

        )}
        </div>
    );
    }

export default FileTitle;