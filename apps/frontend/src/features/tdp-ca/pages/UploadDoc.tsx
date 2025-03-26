import React from 'react'
import { useFileUpload } from '../hooks/useFileUpload'
import FileList from '../components/FileList'


const UploadDoc: React.FC = () => {
  const { files, setFiles, progress, msg, handleUpload,nlpResults} = useFileUpload()
  

  return (
    <div
      style={{
        maxWidth: '400px',
        margin: 'auto',
        textAlign: 'center',
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h1 style={{ fontSize: '30px', marginBottom: '15px' }}>Upload Files</h1>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
  <label
    style={{
      display: 'inline-block',
      fontSize: '14px',
      padding: '10px 15px',
      backgroundColor: 'grey',
      color: 'white',
      cursor: 'pointer',
      borderRadius: '5px',
      marginBottom: '10px',
      marginRight: '100px',
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
    onClick={() => {
      handleUpload();  
      console.log(nlpResults); 
    }}
    style={{
      padding: '10px 15px',
      backgroundColor: 'grey',
      color: 'white',
      border: 'none',
      cursor: 'pointer',
      borderRadius: '5px',
      fontSize: '14px',
    }}
  >
    Upload
    
     

  </button>

        <FileList files={files} />

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
   {nlpResults && (        
  <div style={{ marginTop: '20px', width: '100%', display: 'flex', justifyContent: 'start' }}>
  <div style={{ textAlign: 'left', width: '100%' }}>
    <h2>NLP Results</h2>
    <p style={{ width: '100%' }}>
      <strong>Extracted Text:</strong> {nlpResults.extractedText}
    </p>
    <p style={{ width: '100%'}}>
      <strong>Tokenized Text:</strong> {nlpResults.tokenizedText}
    </p>
    <p style={{ width: '100%' }}>
      <strong>Named Entities:</strong> {nlpResults.namedEntities}
    </p>
    <p style={{ width: '100%' }}>
      <strong>Sentiment Analysis:</strong> {nlpResults.sentimentAnalysis}
    </p>
  </div>
</div>
)}
    </div>
    
  )
}

export default UploadDoc

