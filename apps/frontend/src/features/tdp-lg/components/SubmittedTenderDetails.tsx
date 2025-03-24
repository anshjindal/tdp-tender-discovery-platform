import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

interface Tender {
  submission_id: string
  title: string
  status: string
  submitted_at: string
  updated_at: string
  tender_ref: string
  user_name: string
}

const TenderDetails: React.FC = () => {
  const { subId } = useParams<{ subId: string }>()
  const [tender, setTender] = useState<Tender | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTenderDetails = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("access_token");

        if (!token) {
          setError("You must be logged in to view your bids.");
          setLoading(false);
          return;
        }

        const response = await fetch(
          `http://localhost:3000/api/v1/tenders/submittedtenders/${subId}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
        });

        const result = await response.json()
        console.log("API Response >>>>>>>>.",result);

        if (result!) {
          setTender(result.tender)
          console.log("resrult.tender>>>>>>>",result.tender)
        } else {
          setError('Tender not found')
        }
      } catch (error) {
        console.error('Error fetching tender details:', error)
        setError('Server error')
      } finally {
        setLoading(false)
      }
    }

    fetchTenderDetails()
  }, [subId])

  if (loading) return <p>Loading...</p>
  if (error) return <p className="text-red-500">{error}</p>
  if (!tender) return <p>No details available</p>
  console.log("tender>>>>>>>>>>",tender)

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-3xl font-bold mb-4">{tender.title}</h1>
      <p>
        <strong>Status:</strong> {tender.status}
      </p>
      <p>
        <strong>Reference:</strong> {tender.tender_ref}
      </p>
      <p>
        <strong>Submitted By:</strong> {tender.user_name}
      </p>
      <p>
        <strong>Submitted At:</strong> {tender.submitted_at}
      </p>
      <p>
        <strong>Last Updated:</strong> {tender.updated_at}
      </p>
    </div>
  )
}

export default TenderDetails
