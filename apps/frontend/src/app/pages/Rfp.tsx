import { useEffect, useState } from 'react'
import { analyzePdf, getRfpAnalysis } from '../../api'
const Rfp = () => {
  const [file, setFile] = useState<File | null>(null)

  interface PdfData {
    entities: string[]
    sentences_with_dates: string[]
    sentences_with_money: string[]
  }

  const [data, setData] = useState('')

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
      const raw_response = await analyze_pdf(formData)
      console.log(raw_response)
      setData(await getRfpAnalysis(raw_response))
      console.log('Succesfully uploaded pdf')
    } catch (e) {
      console.error(e)
    }
  }
  return (
    <>
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
{data}
        {/* {data
          ? data.sentences_with_dates.map((sentence: string, index: number) => {
              return (
                <div className="m-4 font-bold" key={index}>
                  {sentence}
                </div>
              )
            })
          : 'No data'} */}
      </div>
    </>
  )
}

export default Rfp
