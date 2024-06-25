import { useEditorContext } from '@/store/EditorContext';
import { ReadmeFileContent, useFileContentContext } from '@/store/FileContentContext';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';


const ReadmePreview = ({ content }: { content?: ReadmeFileContent }) => {
  const markdown = content?.markdown || "";
  const markdownFileName = content?.fileName || "";
  const { updateFileContent } = useFileContentContext()
  const { selectedItem } = useEditorContext()
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      // setFileName(file.name);
      
      reader.onload = (e) => {
        const text = e.target?.result as string;
        // setMarkdownContent(text);
        updateFileContent(selectedItem?.name || "", {
          markdown: text,
          fileName: file.name
        });
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="p-4">
    <div className="mb-4">
      <input
        type="file"
        accept=".md"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-violet-50 file:text-violet-700
          hover:file:bg-violet-100"
      />
    </div>
    {/* {markdownFileName && (
      <div className="mb-4 text-sm text-gray-600">
        Selected file: <span className="font-semibold">{markdownFileName}</span>
      </div>
    )} */}
    <div className="">
      <ReactMarkdown>{markdown}</ReactMarkdown>
    </div>
  </div>
  );
};


export default ReadmePreview;
