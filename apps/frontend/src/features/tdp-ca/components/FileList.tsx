import React from 'react'

interface FileListProps {
  files: FileList | null
}

const FileList: React.FC<FileListProps> = ({ files }) => {
  if (!files || files.length === 0) {
    return null
  }

  return (
    <div style={{ marginBottom: '10px', fontSize: '14px', color: '#555' }}>
      {Array.from(files).map((file) => (
        <div key={file.name}>{file.name}</div>
      ))}
    </div>
  )
}

export default FileList

