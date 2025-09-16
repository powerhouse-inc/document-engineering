import { useEffect, useState } from 'react'
import type { EventLog } from './events.js'

interface EventLogCardProps {
  eventLogs: EventLog[]
  clearEventLogs: () => void
}

// Background effect implemented: new events show with blue background and pulse animation

export const EventLogCard = ({ eventLogs, clearEventLogs }: EventLogCardProps) => {
  const [newEventIds, setNewEventIds] = useState<Set<string>>(new Set())

  // Track when new events are added
  useEffect(() => {
    if (eventLogs.length === 0) {
      setNewEventIds(new Set())
      return
    }

    // Get the most recent event (first in array since new events are prepended)
    const latestEvent = eventLogs[0]
    setNewEventIds((prev) => new Set([...prev, latestEvent.id]))

    // Remove the "new" status after animation completes
    const timer = setTimeout(() => {
      setNewEventIds((prev) => {
        const updated = new Set(prev)
        updated.delete(latestEvent.id)
        return updated
      })
    }, 2000) // Remove effect after 2 seconds

    return () => {
      clearTimeout(timer)
    }
  }, [eventLogs])

  return (
    <div className="w-96 max-h-[650px] flex flex-col">
      <div className="sticky top-4 flex flex-col h-full">
        <div className="bg-white border border-gray-300 rounded-lg shadow-sm flex flex-col h-full">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center flex-shrink-0">
            <h3 className="text-md font-semibold text-gray-900">Event Logs</h3>
            <button
              onClick={clearEventLogs}
              className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded border border-gray-300 hover:bg-gray-50"
            >
              Clear
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {eventLogs.length === 0 ? (
              <div className="p-4 text-center text-gray-500 text-sm">
                No events logged yet. Interact with the table to see events.
              </div>
            ) : (
              <div className="p-2 space-y-2">
                {eventLogs.map((event) => {
                  const isNew = newEventIds.has(event.id)
                  return (
                    <div
                      key={event.id}
                      className={`p-3 rounded-md border text-xs transition-all duration-500 ease-out ${isNew ? 'bg-blue-100 border-blue-300 animate-pulse' : 'bg-gray-50 border-gray-200'}`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-semibold text-blue-600">{event.type}</span>
                        <span className="text-gray-500">{event.timestamp}</span>
                      </div>
                      <div className="text-gray-700 mb-2">{event.details}</div>
                      {(event.data as Record<string, unknown> | undefined) && (
                        <details className="text-gray-600">
                          <summary className="cursor-pointer text-xs text-gray-500 hover:text-gray-700">
                            View data
                          </summary>
                          <pre className="mt-1 p-2 bg-white rounded border text-xs overflow-x-auto">
                            {JSON.stringify(event.data as Record<string, unknown>, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
