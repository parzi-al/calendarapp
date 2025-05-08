"use client"

import { useEffect, useState } from "react"
import dayjs from "dayjs"
import CalendarHeader from "./CalendarHeader"
import CalendarGrid from "./CalendarGrid"
import WeekView from "./WeekView"
import useCalendar from "@/hooks/useCalendar"
import SidePanel from "./SidePanel"
import YearGrid from "./YearGrid"
import LoadingSpinner from "./LoadingSpinner"

export default function Calendar() {
  const [view, setView] = useState("month")
  const {
    currentDate,
    setCurrentDate,
    goToNextMonth,
    goToPrevMonth,
    goToNextYear,
    goToPrevYear,
    goToNextWeek,
    goToPrevWeek,
  } = useCalendar()
  const [events, setEvents] = useState([])
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [showSidePanel, setShowSidePanel] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [viewTransitioning, setViewTransitioning] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    fetch("/api/events")
      .then((res) => res.json())
      .then((data) => {
        setEvents(data)
        setIsLoading(false)
      })
      .catch((err) => {
        console.error("Failed to load events", err)
        setEvents([])
        setIsLoading(false)
      })
  }, [])

  const handleSave = (newEvent) => {
    setIsProcessing(true)
    fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEvent),
    })
      .then((res) => res.json())
      .then((data) => {
        const updatedEvents = [...events, { id: Date.now(), ...newEvent }]
        setEvents(updatedEvents)
        setShowSidePanel(false)
        setIsProcessing(false)
      })
      .catch((err) => {
        console.error("Failed to save to server:", err)
        setIsProcessing(false)
      })
  }

  const handleUpdate = (updatedEvent) => {
    setIsProcessing(true)
    fetch("/api/events", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedEvent),
    })
      .then(() => {
        const updatedEvents = events.map((e) => (e.id === updatedEvent.id ? updatedEvent : e))
        setEvents(updatedEvents)
        setShowSidePanel(false)
        setSelectedEvent(null)
        setIsProcessing(false)
      })
      .catch((err) => {
        console.error("Failed to update:", err)
        setIsProcessing(false)
      })
  }

  const handleDelete = (id) => {
    setIsProcessing(true)
    fetch("/api/events", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
      .then(() => {
        const updatedEvents = events.filter((e) => e.id !== id)
        setEvents(updatedEvents)
        setShowSidePanel(false)
        setSelectedEvent(null)
        setIsProcessing(false)
      })
      .catch((err) => {
        console.error("Failed to delete:", err)
        setIsProcessing(false)
      })
  }

  const handleDateClick = (date) => {
    setSelectedDate(date)
    setSelectedEvent(null)
    setShowSidePanel(true)
  }

  const handleEventClick = (event) => {
    setSelectedEvent(event)
    setSelectedDate(null)
    setShowSidePanel(true)
  }

  const handleAddEvent = () => {
    setSelectedEvent(null)
    setSelectedDate(currentDate)
    setShowSidePanel(true)
  }

  const handleToday = () => {
    setCurrentDate(dayjs())
  }

  const handleChangeView = (newView) => {
    setViewTransitioning(true)
    setTimeout(() => {
      setView(newView)
      setViewTransitioning(false)
    }, 300)
  }

  const getNavigationHandlers = () => {
    switch (view) {
      case "week":
        return { onNext: goToNextWeek, onPrev: goToPrevWeek }
      case "year":
        return { onNext: goToNextYear, onPrev: goToPrevYear }
      case "month":
      default:
        return { onNext: goToNextMonth, onPrev: goToPrevMonth }
    }
  }

  const { onNext, onPrev } = getNavigationHandlers()

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 flex flex-col p-4 overflow-hidden">
        <h1 className="text-2xl font-bold mb-4">Calendar</h1>
        <CalendarHeader
          currentDate={currentDate}
          onNext={onNext}
          onPrev={onPrev}
          onAddEvent={handleAddEvent}
          onChangeView={handleChangeView}
          onToday={handleToday}
          view={view}
        />

        <div className="flex-1 overflow-auto mt-4 bg-white rounded-lg shadow-sm relative">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10">
              <LoadingSpinner size="large" />
            </div>
          ) : (
            <div
              className={`h-full transition-opacity duration-300 ${viewTransitioning ? "opacity-0" : "opacity-100"}`}
            >
              {view === "month" && (
                <CalendarGrid
                  currentDate={currentDate}
                  events={events}
                  onEventClick={handleEventClick}
                  onDateClick={handleDateClick}
                  view={view}
                />
              )}

              {view === "week" && (
                <WeekView
                  currentDate={currentDate}
                  events={events}
                  onEventClick={handleEventClick}
                  onDateClick={handleDateClick}
                />
              )}

              {view === "year" && (
                <YearGrid
                  currentDate={currentDate}
                  events={events}
                  onEventClick={handleEventClick}
                  onDateClick={handleDateClick}
                />
              )}
            </div>
          )}

          {isProcessing && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 z-20">
              <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
                <LoadingSpinner />
                <p className="mt-2 text-gray-600">Processing...</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <SidePanel
        isOpen={showSidePanel}
        onClose={() => setShowSidePanel(false)}
        selectedEvent={selectedEvent}
        selectedDate={selectedDate}
        events={events}
        onSave={handleSave}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        onAddNew={handleEventClick}
        isProcessing={isProcessing}
      />
    </div>
  )
}
