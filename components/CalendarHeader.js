"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Plus, Calendar, CalendarDays, CalendarRange } from "lucide-react"
import { useState, useEffect } from "react"

export default function CalendarHeader({ currentDate, onNext, view, onChangeView, onPrev, onAddEvent, onToday }) {
  const month = currentDate.format("MMMM")
  const year = currentDate.format("YYYY")
  const [activeView, setActiveView] = useState(view)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    setActiveView(view)
  }, [view])

  const handleViewChange = (newView) => {
    if (newView === activeView) return

    setIsAnimating(true)
    setTimeout(() => {
      onChangeView(newView)
      setIsAnimating(false)
    }, 300)
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-3 rounded-lg shadow-sm mb-4 gap-3">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={onPrev} className="h-8 w-8 transition-transform hover:scale-105">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-lg font-semibold">
          {month} {year}
        </h2>
        <Button variant="outline" size="icon" onClick={onNext} className="h-8 w-8 transition-transform hover:scale-105">
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onToday}
          className="transition-all hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
        >
          Today
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex border rounded-md overflow-hidden bg-gray-50">
          <Button
            variant={activeView === "month" ? "default" : "ghost"}
            size="sm"
            onClick={() => handleViewChange("month")}
            className={`rounded-none transition-all duration-300 ${isAnimating ? "opacity-50" : ""}`}
            disabled={isAnimating}
          >
            <Calendar className="h-4 w-4 mr-1" />
            Month
          </Button>
          <Button
            variant={activeView === "week" ? "default" : "ghost"}
            size="sm"
            onClick={() => handleViewChange("week")}
            className={`rounded-none transition-all duration-300 ${isAnimating ? "opacity-50" : ""}`}
            disabled={isAnimating}
          >
            <CalendarRange className="h-4 w-4 mr-1" />
            Week
          </Button>
          <Button
            variant={activeView === "year" ? "default" : "ghost"}
            size="sm"
            onClick={() => handleViewChange("year")}
            className={`rounded-none transition-all duration-300 ${isAnimating ? "opacity-50" : ""}`}
            disabled={isAnimating}
          >
            <CalendarDays className="h-4 w-4 mr-1" />
            Year
          </Button>

          {/* Animated indicator */}
          <div
            className="absolute bottom-0 h-0.5 bg-primary transition-all duration-300 ease-in-out"
            style={{
              left: activeView === "month" ? "0%" : activeView === "week" ? "33.33%" : "66.66%",
              width: "33.33%",
            }}
          ></div>
        </div>
        <Button size="sm" onClick={onAddEvent} className="transition-transform hover:scale-105">
          <Plus className="h-4 w-4 mr-1" />
          Add Event
        </Button>
      </div>
    </div>
  )
}
