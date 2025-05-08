import CalendarGrid from "./CalendarGrid"

export default function YearGrid({ currentDate, events, onEventClick, onDateClick }) {
  const months = Array.from({ length: 12 }, (_, i) => currentDate.startOf("year").add(i, "month"))

  return (
    <div className="grid grid-cols-3 gap-6 p-4">
      {months.map((monthDate, idx) => (
        <div
          key={idx}
          className="border rounded-lg shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md hover:border-blue-200"
        >
          <div className="bg-gray-50 p-2 text-center font-medium border-b">{monthDate.format("MMMM")}</div>
          <CalendarGrid
            currentDate={monthDate}
            events={events}
            onEventClick={onEventClick}
            onDateClick={onDateClick}
            showWeekdays={false}
            compact={true}
          />
        </div>
      ))}
    </div>
  )
}
