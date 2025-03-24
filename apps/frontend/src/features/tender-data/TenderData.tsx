import { useEffect, useState } from 'react'
import {
  getOpenTenderNoticesFromDB,
  TenderNoticeInterface
} from '../../api/api'
import { placeholderTenderData } from './dummy';
import '../../styles/styles.css'


// This component will be rendered is data is ot yet available
const PlaceholderTable = ({ data }: { data: string[] }) => {
  const rows = 10;
  const cols = 10;
  const headers = Array.from({ length: cols }, (_, i) => `text ${i + 1}`);

  return (
    <table className="table-placeholder">
      <thead>
        <tr>
          {headers.map((header) => (
            <th key={header}>
              <span className="skeleton-text">{header}</span>
            </th>
          ))}
        </tr>
      </thead>
      {/* TODO: Use placeholderTenderData to render the placeholder table */}
      <tbody>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <tr key={rowIndex}>
            {Array.from({ length: cols }).map((_, colIndex) => (
              <td key={colIndex}>
                <span className="skeleton-text"> {data[rowIndex * cols + colIndex]}</span>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};



export function App() {

  const [tableData, setTableData] = useState<TenderNoticeInterface[]>([])

  useEffect(() => {
    const getOpenTenderNoticesData = async function () {
      setTableData(await getOpenTenderNoticesFromDB())
    }
    getOpenTenderNoticesData()
  }, [])

  const TenderTable = ({ data }: { data: any[] }) => {
    const headers = Object.keys(data[0])

    return (
      <table className="table-placeholder">
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              {headers.map((header, cellIndex) => (
                <td key={cellIndex}>
                  <div className="max-h-12 overflow-y-auto">{row[header]}</div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    )
  }

  return (
    <>
      {tableData && tableData.length > 0 ? (
        <TenderTable data={tableData} />
      ) : (
        <PlaceholderTable data={placeholderTenderData} />
      )}
    </>
  )
}

export default App
