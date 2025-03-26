import { useEffect, useState } from 'react'
import axios from './/../../../utils/axios.customize'  // changed from 'axios' to use the customized instance

interface ProgressState {
  started: boolean
  pc: number
}

interface UseFileUploadReturn {
  files: FileList | null
  setFiles: React.Dispatch<React.SetStateAction<FileList | null>>
  progress: ProgressState
  msg: string | null
  handleUpload: () => void
  uploadedFiles: Set<string>
  nlpResults: any
}

export function useFileUpload(): UseFileUploadReturn {
  const [files, setFiles] = useState<FileList | null>(null)
  const [progress, setProgress] = useState<ProgressState>({ started: false, pc: 0 })
  const [msg, setMsg] = useState<string | null>(null)
  const [uploadedFiles, setUploadedFiles] = useState<Set<string>>(new Set())
  const [nlpResults, setNlpResults] = useState<any>(null)

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

      fd.append('files', file)
    }

    setMsg('Pending')
    setProgress((prev) => ({ ...prev, started: true }))

    axios
      .post('http://localhost:3000/api/v1/documents/upload', fd, {
        onUploadProgress: (progressEvent) => {
          // Manually compute progress if necessary
          const total = progressEvent.total || 0
          const loaded = progressEvent.loaded || 0
          const pc = total > 0 ? Math.round((loaded * 100) / total) : 0

          setProgress((prev) => ({ ...prev, pc }))
        },
      })
      .then((res) => {
        if (res.data.success) {
          setMsg('Completed')
          setUploadedFiles((prev) => {
            const newSet = new Set(prev)
            Array.from(files).forEach((f) => newSet.add(f.name))
            
            return newSet
          })

          
       const documentId = res.data.files[0].documentId; 
      
       axios
       .get(`http://localhost:3000/api/v1/documents/${documentId}/data`)
       
       .then((nlpRes) => {
        console.log(nlpRes)
         if (nlpRes.data.success) {
           setNlpResults(nlpRes.data);  // Assuming response contains 'results'
     
           // Log the NLP results to the console
           console.log('NLP Results:', nlpRes.data); 
         } else {
           setMsg('Failed to retrieve NLP results');
         }
       })
       .catch((nlpErr) => {
         console.error(nlpErr);
         setMsg('Failed to fetch NLP results');
       })
     
            
        } else {
          setMsg('Text extraction failed. Please try again.');
        }
      })
      .catch((err) => {
        console.error(err)
        setMsg('Failed to upload. Please retry.')
      })
  }

  return {
    files,
    setFiles,
    progress,
    msg,
    handleUpload,
    uploadedFiles,
    nlpResults, 
  }
}

