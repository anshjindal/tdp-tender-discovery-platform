import { useEffect, useState } from 'react'
import { analyzePdf, getRfpAnalysis } from '../../../api/api'

const CaMain = () => {
  const [file, setFile] = useState<File | null>(null)

  interface PdfData {
    entities: string[]
    sentences_with_dates: string[]
    sentences_with_money: string[]
  }

  const [data, setData] = useState<any>({}) // updated to accept object

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    const formData = new FormData()
    formData.append('pdf', file)

    try {
      const raw_response = await analyzePdf(formData)
      console.log(raw_response)
      setData(await getRfpAnalysis(raw_response))
      console.log('Succesfully uploaded pdf')
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <>
      <h1>Capability Assessment Module</h1>

      <div>
        <form onSubmit={handleSubmit}>
          <h1>Upload PDF</h1>
          <input
            type="file"
            name="pdf"
            accept="application/pdf"
            required
            onChange={handleChange}
          />
          <input
            type="submit"
            className="bg-black text-white p-12 hover:scale-110"
          />
        </form>

        {typeof data === 'object' && data.verdict && (
          <div className="p-4 border rounded bg-gray-50 mt-4">
            <h2 className="text-lg font-semibold">Verdict</h2>
            <p>{data.verdict}</p>
            <p className="text-sm text-gray-600">{data.explanation}</p>

            {data.matched_keywords?.length > 0 && (
              <div className="mt-2">
                <h3 className="text-sm font-medium">Matched Keywords:</h3>
                <ul className="list-disc list-inside">
                  {data.matched_keywords.map((kw: string, index: number) => (
                    <li key={index}>{kw}</li>
                  ))}
                </ul>
              </div>
            )}

            {data.processing_time_seconds && (
              <p className="text-xs mt-2 text-right text-gray-500">
                Processed in {data.processing_time_seconds.toFixed(2)}s
              </p>
            )}
          </div>
        )}
      </div>
    </>
  )
}

export default CaMain
