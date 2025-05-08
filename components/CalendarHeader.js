
// 📁 src/components/CalendarHeader.jsx

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function CalendarHeader({ currentDate, onNext,view,onChangeView, onPrev, onAddEvent }) {
  const month = currentDate.format("MMMM");
  const year = currentDate.format("YYYY");

  return (
    <div className="flex justify-between items-center gap-4">
      <Button variant="outline" onClick={onPrev}>← Prev</Button>
      <h2 className="text-xl font-semibold">
        {month} {year}
      </h2>
      <Button
        variant="outline"
        onClick={() => onChangeView(view === "month" ? "year" : "month")}
      >
        {view === "month" ? "Switch to Year View" : "Switch to Month View"}
      </Button>

      <Button variant="default" size="sm" onClick={onAddEvent}>
        <Plus className="w-4 h-4 mr-1" /> Add Event
      </Button>
      <Button variant="outline" onClick={onNext}>Next →</Button>
    </div>
  );
}
