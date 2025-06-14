import React, { useEffect, useState, useCallback } from 'react'
import PMessage from '../../../../components/dashboard/patientDashboard/pMessage/PMessage'
import useDataCall from '../../../../hooks/useDataCall'
import { useSelector } from 'react-redux'

const PatientMessage = () => {
  const { getData, getSingleData } = useDataCall()
  const { messages } = useSelector((state) => state.data)
  const { userId, user } = useSelector((state) => state.auth)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = useCallback(async () => {
    if (!userId) return;
    
    try {
      setIsLoading(true)
      setError(null)
      await Promise.all([
        getData("patients"),
        getData("doctors"),
        getSingleData("messages", userId)
      ])
    } catch (err) {
      console.error('Error fetching message data:', err)
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }, [userId, getData, getSingleData])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">Error: {error}</div>
      </div>
    )
  }

  return (
    <div>
      <PMessage 
        patientProfile={user}
        patientMessage={messages}
      />
    </div>
  )
}

export default PatientMessage