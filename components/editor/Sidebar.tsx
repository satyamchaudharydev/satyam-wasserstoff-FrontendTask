import React, { useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SideBarHeader from "./SideBarHeader";
import { cn } from "@/lib/utils";
import FileTitle from "./FileTitle";
import { EditorContext } from "@/store/EditorContext";
import { FileType, FileSystem, Folder } from "@/lib/types";

const Sidebar: React.FC = () => {
  const {
    fileSystem,
    selectedItem,
    setFileSystem,
    setSelectedItem,
    updateOpenFiles,
  } = useContext(EditorContext);

  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const selectedFileName = selectedItem?.name || "";
  const toggleFolder = (path: string[]) => {
    setFileSystem((prevState) => {
      const newState = JSON.parse(JSON.stringify(prevState));
      let current = newState;
      for (let i = 0; i < path.length; i++) {
        if (i === path.length - 1) {
          current[path[i]].isOpen = !current[path[i]].isOpen;
        } else {
          current = current[path[i]].children;
        }
      }
      return newState;
    });
  };

  const onAddFile = () => {
    // when adding a file, we need to add it to the current dir
    const newFile = {
      [`untitled.ed`]: { type: "file", extension: FileType.ED },
    } as FileSystem;

    if (selectedItem === null) {
      // If no item is selected, add to the root
      const newFileSystem = { ...fileSystem, ...newFile };
      setFileSystem(newFileSystem);
    } else {
      const path = selectedFileName.split("/");
      const newFileSystem = JSON.parse(JSON.stringify(fileSystem));
      let current = newFileSystem;

      // If the selected item is a file, remove its name from the path
      if (selectedItem.type === "file") {
        path.pop();
      }

      for (let i = 0; i < path.length; i++) {
        if (i === path.length - 1) {
          // We're at the target directory
          current[path[i]].children = {
            ...current[path[i]].children,
            ...newFile,
          };
        } else {
          current = current[path[i]].children;
        }
      }

      setFileSystem(newFileSystem);
    }
  };
  const onCollapseFolder = () => {
    setFileSystem((prevState) => {
      const newState = JSON.parse(JSON.stringify(prevState));
      const closeFolders = (obj: FileSystem) => {
        Object.values(obj).forEach((value) => {
          if (value.type === "folder") {
            value.isOpen = false;
            closeFolders(value.children);
          }
        });
      };
      closeFolders(newState);
      return newState;
    });
  };
  const onAddFolder = () => {
    // when adding a folder, we need to add it to the current dir
    const newFolder = {
      [`untitled`]: { type: "folder", children: {} },
    } as FileSystem;
    if (selectedItem === null) {
      const newFileSystem = { ...fileSystem, ...newFolder };
      setFileSystem(newFileSystem);
    } else {
      const path = selectedFileName.split("/");
      const newFileSystem = JSON.parse(JSON.stringify(fileSystem));
      let current = newFileSystem;
      for (let i = 0; i < path.length; i++) {
        if (i === path.length - 1) {
          current[path[i]].children = {
            ...current[path[i]].children,
            ...newFolder,
          };
        } else {
          current = current[path[i]].children;
        }
      }
      setFileSystem(newFileSystem);
    }
  };
  const handleSidebarClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedItem(null);
    }
  };
  const renderIcon = (extension: FileType) => {
    switch (extension) {
      case "ed":
        return "📄";
      case "note":
        return "📝";
      case "lt":
        return "📋";
      case "readme":
        return "📚";
      default:
        return "📄";
    }
  };
  const onTitleChange = (
    newTitle: string,
    filePath: string,
    onFail: () => void
  ) => {
    const path = filePath.split("/");
    const newFileSystem = JSON.parse(JSON.stringify(fileSystem));
    let current = newFileSystem;

    for (let i = 0; i < path.length; i++) {
      if (i === path.length - 1) {
        const item = current[path[i]];

        // Check for duplicate item in the current directory
        const parentDir = path
          .slice(0, -1)
          .reduce((acc, key) => {
            if (acc[key].type === "folder") {
              const folder = acc[key] as Folder
              return folder.children;
            }
            return acc;
          }, fileSystem);

        if (parentDir[newTitle]) {
          alert(
            "An item with this name already exists in the current directory."
          );
          onFail();
          return;
        }

        delete current[path[i]];
        current[newTitle] = item;
      } else {
        current = current[path[i]].children;
      }
    }

    setFileSystem(newFileSystem);
  };

  const renderFileSystem = (
    obj: FileSystem,
    path: string[] = [],
  ): JSX.Element[] => {
    const sortedEntries = Object.entries(obj).sort(
      ([keyA, valueA], [keyB, valueB]) => {
        if (valueA.type === valueB.type) {
          return keyA.localeCompare(keyB);
        }
        return valueA.type === "folder" ? -1 : 1;
      },
    );
    return sortedEntries.map(([key, value]) => {
      const newPath = [...path, key];
      const itemPath = newPath.join("/");
      const isSelected = selectedFileName === itemPath;
      if (value.type === "folder") {
        return (
          <div key={itemPath} className="ml-[1px] relative">
            <motion.div
              className={cn(
                "flex items-center cursor-pointer p-1 rounded-md relative z-10 isolate",
                isSelected && "bg-gray",
              )}
              onClick={() => {
                toggleFolder(newPath);
                setSelectedItem({
                  type: "folder",
                  name: itemPath,
                });
              }}
              onHoverStart={() => setHoveredItem(itemPath)}
              onHoverEnd={() => setHoveredItem(null)}
              whileTap={{ scale: 0.95 }}
            >
              {(selectedFileName === itemPath || hoveredItem === itemPath) && (
                <motion.div
                  className="absolute inset-0 bg-gray rounded-md z-[-1]"
                  layoutId="highlight"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: selectedFileName === itemPath ? 1 : 0.5 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              <FileTitle
                key={itemPath}
                file={{ type: "folder", name: key, path: itemPath }}
                onTitleChange={(newTitle, filePath, onFail) =>
                  onTitleChange(newTitle, filePath, onFail)
                }
                icon={value.isOpen ? "📂" : "📁"}
                isSelected={isSelected}
              />
            </motion.div>

            <AnimatePresence initial={false}>
              {value.isOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="ml-4 overflow-hidden"
                >
                  {renderFileSystem(value.children, newPath)}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      } else {
        return (
          <div key={itemPath} className="ml-[1px] relative cursor-pointer">
            <motion.div
              className={cn(
                "flex items-center p-1 rounded-md relative z-10",
                isSelected && "bg-gray",
              )}
              onClick={() => {
                setSelectedItem({
                  type: "file",
                  name: itemPath,
                });
                updateOpenFiles(itemPath);
              }}
              onHoverStart={() => setHoveredItem(itemPath)}
              onHoverEnd={() => setHoveredItem(null)}
              whileTap={{ scale: 0.95 }}
            >
              <FileTitle
                key={itemPath}
                file={{ type: "file", name: key, path: itemPath }}
                onTitleChange={(newTitle, filePath, onFail) =>
                  onTitleChange(newTitle, filePath, onFail)
                }
                icon={renderIcon(itemPath.split(".").pop() as FileType)}
                isSelected={isSelected}
              />
            </motion.div>
            {hoveredItem === itemPath && (
              <motion.div
                className="absolute inset-0 bg-gray rounded-md z-0"
                layoutId="highlight"
                initial={{ opacity: 0 }}
                animate={{ opacity: selectedFileName === itemPath ? 1 : 0.5 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </div>
        );
      }
    });
  };

  return (
    <div
      className="w-full bg-foreground h-screen p-4 overflow-auto"
      onClick={handleSidebarClick}
    >
      <SideBarHeader
        onAddFile={onAddFile}
        onAddFolder={onAddFolder}
        onCollapseFolder={onCollapseFolder}
      />
      <div className="mt-3">{renderFileSystem(fileSystem)}</div>
    </div>
  );
};

export default Sidebar;
