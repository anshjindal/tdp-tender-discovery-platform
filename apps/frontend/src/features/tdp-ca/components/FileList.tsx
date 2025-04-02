import React from 'react';
import LoadingSpinner from './LoadingSpinner';

interface FileListProps {
  files: FileList | null;
  isLoading?: boolean;
}

const FileList: React.FC<FileListProps> = ({ files, isLoading }) => {
  if (!files || files.length === 0) {
    return null;
  }

  return (
    <div className="relative my-4 border border-gray-200 rounded-md divide-y divide-gray-200">
      {isLoading && (
        <LoadingSpinner 
          overlay 
          size="lg" 
          color="#4f46e5" 
          message="Processing files..."
          className="absolute inset-0 bg-white bg-opacity-70"
        />
      )}
      {Array.from(files).map((file) => (
        <div key={file.name} className="px-4 py-3 flex justify-between items-center">
          <span className="truncate flex-1">{file.name}</span>
          <span className="text-xs text-gray-500 ml-2">
            {(file.size / 1024).toFixed(2)} KB
          </span>
        </div>
      ))}
    </div>
  );
};

export default FileList;