"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Trash2, Pencil, Plus, Calendar } from "lucide-react"
import LoadingSpinner from "./LoadingSpinner"

export default function SidePanel({
  isOpen,
  onClose,
  selectedEvent,
  selectedDate,
  events,
  onSave,
  onUpdate,
  onDelete,
  onAddNew,
  isProcessing,
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    duration: "60",
  })
  const [isPanelVisible, setIsPanelVisible] = useState(false)

  // Filter events for the selected date
  const dateEvents =
    selectedDate && !selectedEvent && !isCreating
      ? events.filter((event) => event.date === selectedDate.format("YYYY-MM-DD"))
      : []

  useEffect(() => {
    if (isOpen) {
      setIsPanelVisible(true)
    } else {
      setTimeout(() => {
        setIsPanelVisible(false)
      }, 300)
    }
  }, [isOpen])

  useEffect(() => {
    if (selectedEvent) {
      setFormData(selectedEvent)
      setIsEditing(false)
      setIsCreating(false)
    } else if (isCreating) {
      setFormData({
        title: "",
        date: selectedDate ? selectedDate.format("YYYY-MM-DD") : "",
        time: "",
        duration: "60",
      })
    } else {
      setIsEditing(false)
    }
  }, [selectedEvent, selectedDate, isCreating])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSave = () => {
    if (isEditing) {
      onUpdate(formData)
    } else if (isCreating) {
      onSave({ ...formData, duration: Number(formData.duration) || 60 })
    }
    setIsEditing(false)
    setIsCreating(false)
  }

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this event?")) {
      onDelete(selectedEvent.id)
    }
  }

  const handleAddNew = () => {
    setIsCreating(true)
  }

  const handleEventClick = (event) => {
    onAddNew(event)
  }

  if (!isPanelVisible) return null

  // Determine what to show in the panel
  let panelContent
  let panelTitle

  if (selectedEvent && !isEditing) {
    // View event details
    panelTitle = selectedEvent.title
    panelContent = (
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-500">Date</p>
          <p>{selectedEvent.date}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Time</p>
          <p>{selectedEvent.time}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Duration</p>
          <p>{selectedEvent.duration} minutes</p>
        </div>
      </div>
    )
  } else if (isEditing || isCreating || selectedEvent) {
    // Edit or create event form
    panelTitle = isEditing ? "Edit Event" : "New Event"
    panelContent = (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" value={formData.title} onChange={handleChange} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input type="date" id="date" name="date" value={formData.date} onChange={handleChange} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="time">Time</Label>
          <Input type="time" id="time" name="time" value={formData.time} onChange={handleChange} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="duration">Duration (minutes)</Label>
          <Input type="number" id="duration" name="duration" value={formData.duration} onChange={handleChange} />
        </div>
      </div>
    )
  } else if (selectedDate) {
    // Show events for selected date
    const formattedDate = selectedDate.format("MMMM D, YYYY")
    panelTitle = formattedDate
    panelContent = (
      <div className="space-y-4">
        {dateEvents.length > 0 ? (
          dateEvents.map((event) => (
            <div
              key={event.id}
              className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer transition-all duration-200 hover:shadow-sm transform hover:translate-x-0.5"
              onClick={() => handleEventClick(event)}
            >
              <div className="font-medium">{event.title}</div>
              <div className="text-sm text-gray-500">
                {event.time} • {event.duration} mins
              </div>
            </div>
          ))
        ) : (
          <div className="text-gray-500 flex flex-col items-center justify-center py-8">
            <Calendar className="h-12 w-12 text-gray-300 mb-2" />
            <p>No events scheduled</p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div
      className={`fixed right-0 top-0 h-full w-80 bg-white border-l shadow-lg z-50 flex flex-col transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-semibold truncate">{panelTitle}</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="transition-transform hover:rotate-90 duration-300"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="p-4 flex-1 overflow-y-auto">
        {isProcessing ? (
          <div className="flex flex-col items-center justify-center h-full">
            <LoadingSpinner />
            <p className="mt-2 text-gray-500">Processing...</p>
          </div>
        ) : (
          panelContent
        )}
      </div>

      <div className="p-4 border-t flex justify-between">
        {selectedEvent && !isEditing ? (
          <>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              className="transition-all duration-200 hover:bg-red-600"
              disabled={isProcessing}
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="transition-all duration-200 hover:border-blue-300 hover:bg-blue-50"
              disabled={isProcessing}
            >
              <Pencil className="w-4 h-4 mr-1" />
              Edit
            </Button>
          </>
        ) : isEditing || isCreating ? (
          <>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditing(false)
                setIsCreating(false)
              }}
              className="transition-all duration-200 hover:bg-gray-100"
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="transition-all duration-200 hover:bg-blue-600"
              disabled={isProcessing}
            >
              {isProcessing ? <LoadingSpinner size="small" /> : "Save"}
            </Button>
          </>
        ) : (
          <Button
            className="ml-auto transition-all duration-200 hover:bg-blue-600 hover:scale-105"
            onClick={() => setIsCreating(true)}
            disabled={isProcessing}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Event
          </Button>
        )}
      </div>
    </div>
  )
}
