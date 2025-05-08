"use client"

import dayjs from "dayjs"

export default function WeekView({ currentDate, events, onEventClick, onDateClick }) {
  // Get the start of the week (Sunday)
  const startOfWeek = currentDate.startOf("week")

  // Create an array of 7 days starting from the start of the week
  const weekDays = Array.from({ length: 7 }, (_, i) => startOfWeek.add(i, "day"))

  // Get all hours for the day
  const hours = Array.from({ length: 24 }, (_, i) => i)

  // Format the current week range for display
  const weekRangeDisplay = `${startOfWeek.format("MMM D")} - ${startOfWeek.add(6, "day").format("MMM D, YYYY")}`

  return (
    <div className="flex flex-col h-full">
      <div className="text-center text-sm text-gray-500 mb-2 font-medium">{weekRangeDisplay}</div>

      {/* Day headers */}
      <div className="grid grid-cols-8 border-b sticky top-0 bg-white z-10">
        <div className="p-2 text-center text-xs font-medium text-gray-500 border-r">Time</div>
        {weekDays.map((day, idx) => {
          const isToday = day.format("YYYY-MM-DD") === dayjs().format("YYYY-MM-DD")
          return (
            <div
              key={idx}
              className={`p-2 text-center cursor-pointer transition-all duration-200 ${
                isToday ? "bg-blue-50" : "hover:bg-gray-50"
              }`}
              onClick={() => onDateClick(day)}
            >
              <div className={`text-xs font-medium ${isToday ? "text-blue-600" : "text-gray-500"}`}>
                {day.format("ddd")}
              </div>
              <div className={`text-sm ${isToday ? "text-blue-600 font-bold" : ""}`}>
                {isToday ? (
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center mx-auto">
                    {day.format("D")}
                  </span>
                ) : (
                  day.format("D")
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Time grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-8">
          {/* Time labels */}
          <div className="border-r sticky left-0 bg-white z-10">
            {hours.map((hour) => (
              <div key={hour} className="h-16 border-b text-xs text-gray-500 text-right pr-2 pt-0">
                {hour === 0 ? "12 AM" : hour < 12 ? `${hour} AM` : hour === 12 ? "12 PM" : `${hour - 12} PM`}
              </div>
            ))}
          </div>

          {/* Days columns */}
          {weekDays.map((day, dayIdx) => {
            const isToday = day.format("YYYY-MM-DD") === dayjs().format("YYYY-MM-DD")
            const dayEvents = events.filter((event) => event.date === day.format("YYYY-MM-DD"))

            return (
              <div key={dayIdx} className={`border-r relative ${isToday ? "bg-blue-50/30" : ""}`}>
                {/* Hour cells */}
                {hours.map((hour) => (
                  <div
                    key={hour}
                    className={`h-16 border-b hover:bg-gray-50 cursor-pointer transition-colors duration-200 ${
                      hour >= 9 && hour <= 17 ? "bg-white" : "bg-gray-50/30"
                    }`}
                    onClick={() => {
                      const clickedDate = day.hour(hour).minute(0)
                      onDateClick(clickedDate)
                    }}
                  ></div>
                ))}

                {/* Events */}
                {dayEvents.map((event, eventIdx) => {
                  const [hours, minutes] = event.time.split(":").map(Number)
                  const eventTop = hours * 16 + (minutes / 60) * 16
                  const eventHeight = (event.duration / 60) * 16

                  return (
                    <div
                      key={eventIdx}
                      className="absolute left-0 right-0 mx-1 bg-blue-100 border-l-2 border-blue-500 rounded-sm text-xs p-1 overflow-hidden shadow-sm transition-all duration-200 hover:shadow-md hover:z-20 hover:translate-x-0.5"
                      style={{
                        top: `${eventTop}rem`,
                        height: `${eventHeight}rem`,
                        zIndex: 10,
                      }}
                      onClick={(e) => {
                        e.stopPropagation()
                        onEventClick(event)
                      }}
                    >
                      <div className="font-medium truncate">{event.title}</div>
                      <div className="text-xs text-gray-600 truncate">{event.time}</div>
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
