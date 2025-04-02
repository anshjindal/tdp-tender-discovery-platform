import React from 'react';
import { useFileUpload } from '../hooks/useFileUpload';
import FileList from '../components/FileList';
import LoadingSpinner from '../components/LoadingSpinner';

const UploadDoc: React.FC = () => {
  const {
    files,
    setFiles,
    progress,
    msg,
    handleUpload,
    nlpResults,
    isLoading,
    isNlpLoading
  } = useFileUpload();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(e.target.files);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md relative">
      {(isLoading || isNlpLoading) && (
        <LoadingSpinner 
          overlay 
          size="lg" 
          color="#4f46e5" 
          message={isNlpLoading ? "Analyzing documents..." : "Uploading files..."}
        />
      )}

      <h1 className="text-2xl font-bold text-center mb-6">Document Upload</h1>

      <div className="flex gap-3 mb-4">
        <label className="flex-1">
          <span className={`inline-flex items-center justify-center px-4 py-2 rounded-md transition-colors ${
            isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-600 hover:bg-gray-700 cursor-pointer'
          } text-white`}>
            Choose Files
            <input
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.docx"
              multiple
              className="hidden"
              disabled={isLoading}
            />
          </span>
        </label>

        <button
          onClick={handleUpload}
          disabled={!files || isLoading}
          className={`flex-1 inline-flex items-center justify-center px-4 py-2 rounded-md transition-colors ${
            !files || isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
          } text-white`}
        >
          {isLoading ? (
            <>
              <LoadingSpinner size="sm" color="white" className="mr-2" />
              Uploading...
            </>
          ) : (
            'Upload & Process'
          )}
        </button>
      </div>

      <FileList files={files} isLoading={isLoading || isNlpLoading} />

      {progress.started && (
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress.pc}%` }}
            ></div>
          </div>
          <div className="text-right text-sm text-gray-600 mt-1">
            {progress.pc}% complete
          </div>
        </div>
      )}

      {msg && (
        <div className={`p-3 rounded-md mb-4 ${
          msg.includes('Failed') 
            ? 'bg-red-100 text-red-800 border border-red-200' 
            : 'bg-green-100 text-green-800 border border-green-200'
        }`}>
          <div className="flex justify-between items-center">
            <span>{msg}</span>
            {msg.includes('Failed') && (
              <button
                onClick={handleUpload}
                className="ml-2 px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            )}
          </div>
        </div>
      )}

      {nlpResults && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold mb-3">Analysis Results</h2>
          
          <div className="mb-4">
            <h3 className="font-medium mb-1">Extracted Text:</h3>
            <div className="p-3 bg-white rounded border border-gray-300 text-sm whitespace-pre-wrap">
              {nlpResults.extractedText || 'No text extracted'}
            </div>
          </div>

          <div className="mb-4">
            <h3 className="font-medium mb-1">Tokenized Text:</h3>
            <div className="p-3 bg-white rounded border border-gray-300 text-sm">
              {Array.isArray(nlpResults.tokenizedText) 
                ? nlpResults.tokenizedText.join(', ') 
                : nlpResults.tokenizedText || 'N/A'}
            </div>
          </div>

          <div className="mb-4">
            <h3 className="font-medium mb-1">Named Entities:</h3>
            <pre className="p-3 bg-white rounded border border-gray-300 text-sm overflow-x-auto">
              {JSON.stringify(nlpResults.namedEntities, null, 2) || 'N/A'}
            </pre>
          </div>

          <div className="mb-4">
            <h3 className="font-medium mb-1">Sentiment Analysis:</h3>
            <pre className="p-3 bg-white rounded border border-gray-300 text-sm overflow-x-auto">
              {JSON.stringify(nlpResults.sentimentAnalysis, null, 2) || 'N/A'}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadDoc;