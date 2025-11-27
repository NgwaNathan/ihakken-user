
'use client'

import { useParams, useSearchParams } from 'next/navigation'
import AccommodationDetailsClient from './accommodation-details-client'
import { useDecodedPayload } from '@/hooks/useDecodedPayload'
import { Accommodation } from '@/lib/types/interfaces'
import { useGetAccommodationsQuery } from '@/lib/api/lodging'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { createSelector } from '@reduxjs/toolkit'
import { skipToken } from '@reduxjs/toolkit/query/react'
import { lodgingApi } from '@/lib/api/lodging'

// Define proper types for the API response structure
interface Floor {
  accommodations?: Accommodation[]
}

interface AccommodationsResponse {
  data?: Floor[]
}

export default function AccommodationDetailsPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  
  const id = params.id as string
  const branchId = params.branchId as string
  const payload = searchParams.get('payload') || ''
  const { data: decoded, loading: payloadLoading } = useDecodedPayload(payload)
  const { data: accommodationsData, isLoading, error } = useGetAccommodationsQuery(branchId)
  const selectAccommodationById = useMemo(
    () =>
      createSelector(
        [lodgingApi.endpoints.getAccommodations.select(branchId)],
        (result) => {
          const data = result?.data as AccommodationsResponse | Accommodation[] | undefined
          
          if (!data) return undefined

          if (Array.isArray(data)) {
            return data.find((acc: Accommodation) => acc.id === id)
          } else if ('data' in data && Array.isArray(data.data)) {
            for (const floor of data.data) {
              const found = floor.accommodations?.find(
                (acc: Accommodation) => acc.id === id
              )
              if (found) return found
            }
          }
          return undefined
        }
      ),
    [id, branchId]
  )

  // Get the accommodation from cache using selector
  const accommodation = useSelector(selectAccommodationById)

  if (payloadLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading accommodation details...</p>
      </div>
    )
  }

  if (error || !accommodation) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto text-center pt-20">
          <h1 className="text-2xl font-bold mb-4">Accommodation not found</h1>
          {error && (
            <p className="text-sm text-muted-foreground mb-4">{error.toString()}</p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <AccommodationDetailsClient
        accommodation={accommodation}
        branchId={branchId}
        selectedImageDefault={accommodation.mainImage?.[0]?.url || '/placeholder.svg'}
      />
    </div>
  )
}