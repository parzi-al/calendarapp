// 📁 src/components/Calendar.jsx
"use client";

import { useEffect, useState } from "react";
import CalendarHeader from "./CalendarHeader";
import CalendarGrid from "./CalendarGrid";
import useCalendar from "@/hooks/useCalendar";
import EventPanel from "./EventPanel";
import YearGrid from "./YearGrid";
export default function Calendar() {
  // const [events, setEvents] = useState([]);
  const [view, setView] = useState("month");
  const { currentDate, goToNextMonth, goToPrevMonth, goToNextYear, goToPrevYear } = useCalendar();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null); // 👈 new

  useEffect(() => {
    fetch("/api/events")
      .then((res) => res.json())
      .then((data) => {
        setEvents(data);
        localStorage.setItem("events", JSON.stringify(data));
      })
      .catch((err) => {
        console.error("Failed to load events", err);
        setEvents([]);
      });
  }, []);
  const handleSave = (newEvent) => {
    const updatedEvents = [...events, newEvent];
    setEvents(updatedEvents);
    localStorage.setItem("events", JSON.stringify(updatedEvents));

    fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEvent),
    }).catch((err) => {
      console.error("Failed to save to server:", err);
    });
  };
  const handleUpdate = (updatedEvent) => {
    const updatedEvents = events.map((e) =>
      e.id === updatedEvent.id ? updatedEvent : e
    );
    setEvents(updatedEvents);
    localStorage.setItem("events", JSON.stringify(updatedEvents));

    fetch("/api/events", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedEvent),
    }).catch((err) => console.error("Failed to update:", err));
  };

  const handleDelete = (id) => {
    try {
      const updatedEvents = events.filter((e) => e.id !== id);
      setEvents(updatedEvents);
      localStorage.setItem("events", JSON.stringify(updatedEvents));
    } catch (error) {
      console.error("Error updating local events:", error);
    }

    fetch("/api/events", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    }).catch((err) => console.error("Failed to delete:", err));
  };



  const handleDateClick = (date) => {
    setSelectedDate(date);
    setShowAddDialog(true);
  };

  return (
    <div className="flex flex-col justify-center items-center bg-white  ">
      <h1 className="text-2xl font-bold mb-4">Calendar</h1>
      <CalendarHeader
        currentDate={currentDate}
        onNext={view === "month" ? goToNextMonth : goToNextYear}
        onPrev={view === "month" ? goToPrevMonth : goToPrevYear}
        onAddEvent={() => {
          setSelectedDate(null);
          setShowAddDialog(true);
        }}
        onChangeView={setView}
        view={view}
      />

      <div className="flex flex-col p-10  justify-center items-center  bg-white rounded-lg shadow-md">

        {view === "month" ? (
          <CalendarGrid
            currentDate={currentDate}
            events={events}
            onEventClick={setSelectedEvent}
            onDateClick={handleDateClick}
            view={view}
            onChangeDate={(date) => console.log("Go to date:", date)}
          />
        ) : (
          <YearGrid
            currentDate={currentDate}
            events={events}
            onEventClick={setSelectedEvent}
            onDateClick={handleDateClick}
          />
        )}

      </div>

      <EventPanel
        event={selectedEvent || (showAddDialog && { date: selectedDate?.format("YYYY-MM-DD") })}
        onClose={() => {
          setSelectedEvent(null);
          setShowAddDialog(false);
        }}
        onSave={(event) => {
          const updatedEvents = selectedEvent
            ? events.map((e) => (e.id === event.id ? event : e))
            : [...events, event];

          setEvents(updatedEvents);
          localStorage.setItem("events", JSON.stringify(updatedEvents));

          fetch("/api/events", {
            method: selectedEvent ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(event),
          }).catch((err) => console.error("Save failed", err));
        }}
        onDelete={(id) => {
          const updatedEvents = events.filter((e) => e.id !== id);
          setEvents(updatedEvents);
          localStorage.setItem("events", JSON.stringify(updatedEvents));

          fetch("/api/events", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
          }).catch((err) => console.error("Delete failed", err));
        }}
      />



    </div>
  );
}
