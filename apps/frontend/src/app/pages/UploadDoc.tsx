import React, { useState } from 'react'
import axios from 'axios'

interface ProgressState {
  started: boolean
  pc: number
}

const App: React.FC = () => {
  const [files, setFiles] = useState<FileList | null>(null)
  const [progress, setProgress] = useState<ProgressState>({ started: false, pc: 0 })
  const [msg, setMsg] = useState<string | null>(null)
  const [uploadedFiles, setUploadedFiles] = useState<Set<string>>(new Set())

  const handleUpload = (): void => {
    if (!files) {
      setMsg('No file selected')
      return
    }

    const fd = new FormData()

    // Append each file to FormData with the field name "files"
    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      // Check file type
      if (
        ![
          'application/pdf',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ].includes(file.type)
      ) {
        setMsg('Unsupported file format. Please upload a PDF or DOCX file.')
        return
      }

      // Check if file already processed
      if (uploadedFiles.has(file.name)) {
        setMsg(`File "${file.name}" has already been processed.`)
        return
      }

      // Matches backend's upload.array('files')
      fd.append('files', file)
    }

    setMsg('Pending')
    setProgress((prev) => ({ ...prev, started: true }))

    axios
      .post('http://localhost:3000/upload', fd, {
        onUploadProgress: (progressEvent) => {
          // Manually compute progress if your Axios version doesn't provide "progressEvent.progress"
          const total = progressEvent.total || 0
          const loaded = progressEvent.loaded || 0
          const pc = total > 0 ? Math.round((loaded * 100) / total) : 0

          setProgress((prev) => ({ ...prev, pc }))
        },
      })
      .then((res) => {
        // Check backend response
        if (res.data.success) {
          setMsg('Completed')
          // Mark these files as uploaded
          setUploadedFiles((prev) => {
            const newSet = new Set(prev)
            Array.from(files).forEach((f) => newSet.add(f.name))
            return newSet
          })
        } else {
          setMsg('Text extraction failed. Please try again.')
        }
      })
      .catch((err) => {
        console.error(err)
        setMsg('Failed to upload. Please retry.')
      })
  }

  return (
    <div
      className="App"
      style={{
        maxWidth: '400px',
        margin: 'auto',
        textAlign: 'center',
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h1 style={{ fontSize: '30px', marginBottom: '15px' }}>Upload Files</h1>

      <div>
        <label
          style={{
            display: 'inline-block',
            fontSize: '14px',
            padding: '10px 15px',
            backgroundColor: 'grey',
            color: 'white',
            justifyContent: 'center',
            cursor: 'pointer',
            borderRadius: '5px',
            marginBottom: '10px',
            marginRight: '170px',
          }}
        >
          Choose Files
          <input
            type="file"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFiles(e.target.files)
            }
            accept=".pdf, .docx"
            multiple
            style={{ display: 'none' }}
          />
        </label>

        <button
          onClick={handleUpload}
          style={{
            padding: '10px 15px',
            backgroundColor: 'grey',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            borderRadius: '5px',
          }}
        >
          Upload
        </button>

        {files && (
          <div style={{ marginBottom: '10px', fontSize: '14px', color: '#555' }}>
            {Array.from(files).map((file) => (
              <div key={file.name}>{file.name}</div>
            ))}
          </div>
        )}

        {msg === 'Failed to upload. Please retry.' && (
          <button
            onClick={handleUpload}
            style={{
              padding: '10px 15px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              borderRadius: '5px',
            }}
          >
            Retry
          </button>
        )}
      </div>

      {progress.started && (
        <progress
          max="100"
          value={progress.pc}
          style={{ width: '100%', marginBottom: '10px' }}
        />
      )}

      {msg && (
        <span
          style={{
            display: 'block',
            fontWeight: 'bold',
            color: msg.includes('failed') ? 'red' : 'black',
          }}
        >
          {msg}
        </span>
      )}
    </div>
  )
}

export default App

