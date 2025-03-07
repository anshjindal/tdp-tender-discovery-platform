import { useEffect, useState } from 'react'
import { getFilteredTenderNoticesFromDB, TenderNoticeInterface } from '../../api'

export function FilteredTenderData() {
  const [tableData, setTableData] = useState<TenderNoticeInterface[]>([])

  useEffect(() => {
    const getOpenTenderNoticesData = async function () {
      setTableData(await getFilteredTenderNoticesFromDB())
    }
    getOpenTenderNoticesData()
  }, [])

  const TenderTable = ({ data }: { data: TenderNoticeInterface[] }) => {
    const headers = data.length > 0 ? Object.keys(data[0]) : []
  
    return (
      <div className="overflow-x-auto shadow-md border-b mb-6">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-800 text-white">
              {headers.map((header) => (
                <th key={header} className="p-3 text-left border px-2">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} className="border-t">
                {headers.map((header) => (
                  <td key={header} className="p-3 border px-2">
                    <div className="max-h-12 overflow-y-auto">
                      {/* Cast header to keyof TenderNoticeInterface */}
                      {row[header as keyof TenderNoticeInterface]}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <>
      {tableData && tableData.length > 0 ? (
        <TenderTable data={tableData} />
      ) : (
        <p>No data available</p>
      )}
    </>
  )
}

export default FilteredTenderData
