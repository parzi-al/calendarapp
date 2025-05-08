"use client"

import dayjs from "dayjs"

export default function DayCell({ date, events, onEventClick, onDateClick, compact }) {
  const isToday = date && dayjs().isSame(date, "day")
  const isWeekend = date && (date.day() === 0 || date.day() === 6)
  const formattedDate = date ? date.format("YYYY-MM-DD") : null
  const todaysEvents = []

  try {
    if (events && formattedDate) {
      todaysEvents.push(...events.filter((e) => e.date === formattedDate))
    }
  } catch (error) {
    console.error("Error filtering events:", error)
  }

  // Group events by time to find conflicts
  const timeMap = {}
  todaysEvents.forEach((event) => {
    if (!timeMap[event.time]) {
      timeMap[event.time] = []
    }
    timeMap[event.time].push(event)
  })

  const hasConflict = (event) => {
    return timeMap[event.time]?.length > 1
  }

  // Sort events by time
  const sortedEvents = [...todaysEvents].sort((a, b) => {
    return a.time.localeCompare(b.time)
  })

  // Determine if this is a day from another month (padding)
  const isPadding = !date

  return (
    <div
      onClick={() => date && onDateClick(date)}
      className={`relative p-1 border flex flex-col transition-all duration-200 overflow-hidden cursor-pointer 
        ${isPadding ? "bg-gray-50 cursor-default" : "hover:shadow-md hover:border-blue-300 hover:z-10"}
        ${isToday ? "bg-blue-50 border-blue-300 shadow-sm" : ""}
        ${isWeekend && !isToday ? "bg-gray-50" : ""}
        ${compact ? "h-16 text-[10px]" : "h-24 text-sm"}
        rounded-md transform transition-transform hover:scale-[1.02]`}
    >
      {date && (
        <>
          <div
            className={`flex justify-between items-center ${
              isToday ? "font-bold text-blue-600" : isWeekend ? "text-gray-500" : "text-gray-700"
            }`}
          >
            <span
              className={`text-xs ${isToday ? "bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center" : ""}`}
            >
              {date.date()}
            </span>
            {todaysEvents.length > 0 && !compact && (
              <span className="text-xs bg-gray-100 rounded-full px-1 text-gray-600">{todaysEvents.length}</span>
            )}
          </div>

          <div className="mt-1 space-y-1 overflow-y-auto flex-1">
            {!compact &&
              sortedEvents.map((event, idx) => (
                <div
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation()
                    onEventClick(event)
                  }}
                  className={`truncate text-xs px-1.5 py-0.5 rounded-sm transition-all duration-200
                    ${
                      hasConflict(event)
                        ? "bg-red-100 text-red-800 border-l-2 border-red-500 hover:bg-red-200"
                        : "bg-blue-100 text-blue-800 border-l-2 border-blue-500 hover:bg-blue-200"
                    }
                    transform hover:translate-x-0.5 hover:shadow-sm
                  `}
                  title={`${event.title} (${event.time})`}
                >
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full mr-1 bg-blue-500 flex-shrink-0"></div>
                    <span className="font-medium mr-1">{event.time.substring(0, 5)}</span>
                    {event.title}
                  </div>
                </div>
              ))}
          </div>
        </>
      )}
    </div>
  )
}
