import DayCell from "./DayCell"

export default function CalendarGrid({
  currentDate,
  events,
  onEventClick,
  onDateClick,
  view,
  showWeekdays = true,
  compact = false,
}) {
  const startOfMonth = currentDate.startOf("month")
  const daysInMonth = currentDate.daysInMonth()
  const startDay = startOfMonth.day()

  const days = []
  for (let i = 0; i < startDay; i++) {
    days.push(null) // padding
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(currentDate.date(i))
  }

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return (
    <div className="p-2">
      <div className={`grid grid-cols-7 gap-2 ${compact ? "text-xs" : ""}`}>
        {showWeekdays &&
          weekdays.map((d) => (
            <div
              key={d}
              className={`text-center font-medium text-gray-500 py-2 ${compact ? "text-[10px]" : "text-sm"}`}
            >
              {d}
            </div>
          ))}

        {days.map((date, idx) => (
          <DayCell
            key={idx}
            date={date}
            events={events}
            onEventClick={onEventClick}
            onDateClick={onDateClick}
            compact={compact}
          />
        ))}
      </div>
    </div>
  )
}
