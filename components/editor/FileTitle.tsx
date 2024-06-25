import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface FileSystemItem {
  type: "file" | "folder";
  name: string;
  path: string;
}

interface FileTitleProps {
  file: FileSystemItem;
  onTitleChange: (
    newTitle: string,
    filePath: string,
    onFail: () => void,
  ) => void;
  icon: any;
  isSelected: boolean;
}

const FileTitle: React.FC<FileTitleProps> = ({
  file,
  onTitleChange,
  icon,
  isSelected,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(file.name);

  useEffect(() => {
    setTitle(file.name);
  }, [file.name]);

  const handleBlur = () => {
    setIsEditing(false);
    if (title.trim() === "") {
      setTitle(file.name);
    } else if (title !== file.name) {
      onTitleChange(title, file.path, () => setTitle(file.name));
    }
  };

  return (
    <div className="flex items-center">
      <span className="text-[12px] mr-1">{icon}</span>

      {isEditing ? (
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleBlur}
          className="text-[#b0bacb] text-[11px] bg-transparent border-b border-transparent focus:outline-none focus:border-primary focus:ring-0"
        />
      ) : (
        <span
          onDoubleClick={() => setIsEditing(true)}
          className={cn(
            "text-[#b0bacb] text-[11px] font-[500]",
            isSelected && "text-white",
          )}
        >
          {title}
        </span>
      )}
    </div>
  );
};

export default FileTitle;
