import { useContext, useEffect } from "react";
import EditorHeader from "./EditorHeader";
import { EditorContext } from "@/store/EditorContext";
import ReadmePreview from "../templates/Readme";
import ListMaker from "../templates/ListMaker";
import TextEditor from "../templates/TextEditor";
import NoteMaker from "../templates/NoteMaker";
import {
  EdFileContent,
  FileContentContext,
  LtFileContent,
  NoteFileContent,
  ReadmeFileContent,
} from "@/store/FileContentContext";
import { AnimatePresence, motion } from "framer-motion";

const EditorTemplate: React.FC = () => {
  const { selectedItem } = useContext(EditorContext);
  const { fileContents } = useContext(FileContentContext);

  const renderFileContent = () => {
    if (!selectedItem || selectedItem.type !== "file") {
      return (
        <div className="text-white/60 p-2 text-center">
          Please select a file to show here
        </div>
      );
    }

    const fileName = selectedItem.name;
    const fileContent = fileContents[fileName];
    const extension = fileName.split(".").pop();
    switch (extension) {
      case "ed":
        return (
          <TextEditor
            content={fileContent as EdFileContent}
            key={selectedItem.name}
          />
        );
      case "note":
        return <NoteMaker content={fileContent as NoteFileContent} />;
      case "lt":
        return <ListMaker content={fileContent as LtFileContent} />;
      case "readme":
        return <ReadmePreview content={fileContent as ReadmeFileContent} />;
      default:
        return <div className="text-white p-2">Unsupported file type</div>;
    }
  };

  return (
    <div className="flex flex-col w-full h-full bg-red-50">
      <EditorHeader />
      <div className="flex flex-1 bg-background">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedItem ? selectedItem.name : "empty"}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {renderFileContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default EditorTemplate;
