import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Note,
  NoteFileContent,
  useFileContentContext,
} from "@/store/FileContentContext";
import Button from "../ui/Button";
import { createPortal } from "react-dom";
import { useEditorContext } from "@/store/EditorContext";

const NoteMaker = ({ content }: { content: NoteFileContent }) => {
  const { selectedItem } = useEditorContext();
  const { updateFileContent } = useFileContentContext();
  const filePath = selectedItem?.name || "";
  const [showEditor, setShowEditor] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const noteList = content || [];
  const onCloseEditor = () => {
    setShowEditor(false);
    setSelectedNote(null);
  };
  const saveNote = (note: string, status: string) => {
    if (selectedNote) {
      const updatedNote = {
        id: selectedNote.id,
        content: note,
        status: status,
      };
      const newNodeList = noteList?.notes?.map((note) => {
        if (note.id === selectedNote.id) {
          return updatedNote;
        }
        return note;
      });

      updateFileContent(filePath, {
        notes: newNodeList,
      });
      setSelectedNote(null);

      return;
    }
    const newNoteList = {
      id: Math.random().toString(36),
      content: note,
      status: status,
    };
    const updateNodeList = [...(noteList?.notes || []), newNoteList];

    updateFileContent(filePath, {
      notes: updateNodeList,
    });
    setSelectedNote(null);
  };
  return (
    <div className="flex space-x-4 p-6 flex-col gap-8">
      <Button className="h-fit mr-auto" onClick={() => setShowEditor(true)}>
        Add note
      </Button>
      <div className="flex gap-4 flex-wrap">
        {noteList?.notes?.map((note, index) => (
          <motion.div
            key={note.id}
            layoutId={note.id}
            className="p-4 border rounded bg-[#151A20]
             border-white/20 w-[300px] h-[300px]
             cursor-pointer hover:border-white/40
             "
            drag
            onClick={() => {
              setShowEditor(true);
              setSelectedNote({
                id: note.id,
                content: note.content,
                status: note.status,
              });
            }}
            // onDragEnd={handleDragEnd}
          >
            <div
              className="mb-auto relative rounded-full p-1 px-4
             bg-foreground w-fit text-[14px] text-white/80"
            >
              {note.status || "todo"}
            </div>
            <motion.p layout className="mt-2 text-white">
              {note.content}
            </motion.p>
          </motion.div>
        ))}
      </div>
      {createPortal(
        <NoteEditor
          onClose={onCloseEditor}
          onSave={saveNote}
          show={showEditor}
          selectedNote={selectedNote}
        />,
        document.body,
      )}
    </div>
  );
};

const NoteEditor = ({
  onClose,
  onSave,
  selectedNote,
  show,
}: {
  onClose: () => void;
  onSave: (note: string, status: string) => void;
  selectedNote: Note | null;
  show: boolean;
}) => {
  const [status, setStatus] = useState(selectedNote?.status || "");
  const [noteData, setNoteData] = useState(selectedNote?.content || "");

  const changeStatus = (text: string) => {
    setStatus(text);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          layoutId={selectedNote?.id || "new"}
          className="p-8 w-full h-full absolute inset-0 z-[9999] backdrop-blur-sm"
        >
          <div className="h-full bg-background rounded px-3 flex flex-col">
            <div className="min-h-[30px] border-b border-[#393b3f] p-2 flex justify-between">
              <div className="flex justify-center items-center gap-2">
                <Button
                  className="text-[14px] p-1 px-2"
                  onClick={() => {
                    onSave(noteData, status);
                    onClose();
                  }}
                >
                  Save
                </Button>
                <Button className="text-[14px] p-1 px-2" onClick={onClose}>
                  Close
                </Button>
              </div>
              <Status status={status} changeStatus={changeStatus} />
            </div>
            <textarea
              className="w-full text-white mt-3 p-2 flex-1  bg-transparent  border-white focus:outline-none focus:ring-2 focus:ring-primary-light"
              value={noteData}
              onChange={(e) => setNoteData(e.target.value)}
              placeholder="Enter your note here..."
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Status = ({
  status,
  changeStatus,
}: {
  status: string;
  changeStatus: (text: string) => void;
}) => {
  const [isEditing, setIsEditing] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const handleChange = (e: any) => {
    changeStatus(e.target.value);
  };

  const handleBlur = () => {
    if (status.trim() !== "") {
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter" && status.trim() !== "") {
      setIsEditing(false);
    }
  };

  const handlePillClick = () => {
    setIsEditing(true);
  };

  return (
    <div className="flex gap-2 justify-center items-center">
      <div className="text-[14px] text-white/80 font-[400]">Status: </div>
      <div className="relative w-[140px]">
        {isEditing ? (
          <motion.input
            ref={inputRef}
            type="text"
            value={status}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="w-full px-3 py-1 border rounded-[10px] focus:outline-none text-white h-10 bg-primary-light border-background"
            placeholder="Set status..."
          />
        ) : (
          <motion.div
            className="px-3 py-1 text-white bg-primary-light/20 rounded-[10px] cursor-pointer h-10 flex items-center"
            onClick={handlePillClick}
          >
            {status}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default NoteMaker;
