import { useState } from 'react';
import axios from './../../../utils/axios.customize';

interface ProgressState {
  started: boolean;
  pc: number;
}

interface UseFileUploadReturn {
  files: FileList | null;
  setFiles: React.Dispatch<React.SetStateAction<FileList | null>>;
  progress: ProgressState;
  msg: string | null;
  handleUpload: () => Promise<void>;
  uploadedFiles: Set<string>;
  nlpResults: any;
  isLoading: boolean;
  isNlpLoading: boolean;
}

export function useFileUpload(): UseFileUploadReturn {
  const [files, setFiles] = useState<FileList | null>(null);
  const [progress, setProgress] = useState<ProgressState>({ started: false, pc: 0 });
  const [msg, setMsg] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<Set<string>>(new Set());
  const [nlpResults, setNlpResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isNlpLoading, setIsNlpLoading] = useState(false);

  const handleUpload = async (): Promise<void> => {
    if (!files || files.length === 0) {
      setMsg('No files selected');
      return;
    }

    setIsLoading(true);
    setProgress({ started: true, pc: 0 });
    setMsg('Uploading files...');

    try {
      const fd = new FormData();
      const validTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];

      // Validate files
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!validTypes.includes(file.type)) {
          setMsg('Only PDF and DOCX files are allowed');
          setIsLoading(false);
          return;
        }
        if (uploadedFiles.has(file.name)) {
          setMsg(`File "${file.name}" was already uploaded`);
          setIsLoading(false);
          return;
        }
        fd.append('files', file);
      }

      // Upload files
      const uploadResponse = await axios.post(
        'http://localhost:3000/api/v1/documents/upload',
        fd,
        {
          onUploadProgress: (progressEvent) => {
            const total = progressEvent.total || 0;
            const loaded = progressEvent.loaded || 0;
            const pc = total > 0 ? Math.round((loaded * 100) / total) : 0;
            setProgress(prev => ({ ...prev, pc }));
          },
        }
      );

      if (!uploadResponse.data.success) {
        throw new Error('Upload failed');
      }

      // Process NLP
      setMsg('Processing documents...');
      setIsNlpLoading(true);
      
      const documentId = uploadResponse.data.files[0].documentId;
      const nlpResponse = await axios.get(
        `http://localhost:3000/api/v1/documents/${documentId}/data`
      );

      if (nlpResponse.data.success) {
        setNlpResults(nlpResponse.data);
        setUploadedFiles(prev => {
          const newSet = new Set(prev);
          Array.from(files).forEach(f => newSet.add(f.name));
          return newSet;
        });
        setMsg('Processing complete');
      } else {
        throw new Error('NLP processing failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setMsg('Failed to process files. Please try again.');
    } finally {
      setIsLoading(false);
      setIsNlpLoading(false);
    }
  };

  return {
    files,
    setFiles,
    progress,
    msg,
    handleUpload,
    uploadedFiles,
    nlpResults,
    isLoading,
    isNlpLoading,
  };
}