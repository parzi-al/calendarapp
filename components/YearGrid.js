// 📁 src/components/YearGrid.jsx

import dayjs from "dayjs";
import CalendarGrid from "./CalendarGrid";

export default function YearGrid({ currentDate, events, onEventClick, onDateClick }) {
    const months = Array.from({ length: 12 }, (_, i) =>
        currentDate.startOf("year").add(i, "month")
    );

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {months.map((monthDate, idx) => (
                <div key={idx} className="border p-2 rounded shadow-sm">
                    <h3 className="text-center font-semibold mb-2">
                        {monthDate.format("MMMM YYYY")}
                    </h3>
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
    );
}
