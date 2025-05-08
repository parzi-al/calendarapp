import dayjs from "dayjs";

export default function DayCell({ date, events, onEventClick, onDateClick, compact }) {
  const isToday = date && dayjs().isSame(date, "day");
  const formattedDate = date ? date.format("YYYY-MM-DD") : null;
  const todaysEvents = [];
  try {
    if (events && formattedDate) {
      todaysEvents.push(...events.filter(e => e.date === formattedDate));
    }
  } catch (error) {
    console.error("Error filtering events:", error);
  }

  // Group events by time to find conflicts
  const timeMap = {};
  todaysEvents.forEach(event => {
    if (!timeMap[event.time]) {
      timeMap[event.time] = [];
    }
    timeMap[event.time].push(event);
  });

  const hasConflict = (event) => {
    return timeMap[event.time]?.length > 1;
  };

  return (
    <div
      onClick={() => onDateClick(date)}
      className={`p-1 border rounded-sm flex flex-col hover:bg-blue-100 transition-colors duration-300 overflow-hidden cursor-pointer 
        ${isToday ? "bg-blue-100 border-blue-400" : "bg-white"}
        ${compact ? "h-16 text-[10px]" : "h-24 text-sm"}`}
    >
      <div className="font-bold text-[10px]">{date ? date.date() : ""}</div>

      {!compact &&
        todaysEvents.map((event, idx) => (
          <div
            key={idx}
            onClick={(e) => {
              e.stopPropagation();
              onEventClick(event);
            }}
            className={`truncate text-xs px-1 rounded transition-colors duration-300
              ${hasConflict(event) ? "bg-red-200 text-red-900" : "hover:bg-gray-200"}
            `}
            title={hasConflict(event) ? "Conflict with another event at same time" : ""}
          >
            {event.title}
          </div>
        ))}
    </div>
  );
}
