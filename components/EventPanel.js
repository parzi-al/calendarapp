// 📁 src/components/EventPanel.jsx

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Save, Trash2 } from "lucide-react";

export default function EventPanel({ event, onClose, onSave, onDelete }) {
  const isNew = !event?.id;

  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    duration: "",
  });

  // Update local state when a new event is passed
  useEffect(() => {
    if (event) {
      setFormData({
        id: event.id || undefined,
        title: event.title || "",
        date: event.date || "",
        time: event.time || "",
        duration: event.duration || "",
      });
    }
  }, [event]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    const { title, date, time } = formData;
    if (!title || !date || !time) {
      alert("Please fill in title, date, and time.");
      return;
    }

    const payload = isNew
      ? { ...formData, id: Date.now() }
      : formData;

    onSave(payload);
    onClose();
  };

  const handleDelete = () => {
    if (event?.id && confirm("Are you sure you want to delete this event?")) {
      onDelete(event.id);
      onClose();
    }
  };

  if (!event) return null;

  return (
    <div className="fixed top-0 right-0 w-full max-w-sm h-full bg-white border-l border-gray-200 z-50 shadow-lg p-6 overflow-y-auto transition-transform duration-300">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          {isNew ? "Create Event" : "Edit Event"}
        </h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-5 h-5 text-gray-500" />
        </Button>
      </div>

      <div className="space-y-5">
        <div className="space-y-1">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            placeholder="Enter event title"
            value={formData.title}
            onChange={handleChange}
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1 space-y-1">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />
          </div>
          <div className="flex-1 space-y-1">
            <Label htmlFor="time">Time</Label>
            <Input
              id="time"
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="space-y-1">
          <Label htmlFor="duration">Duration (mins)</Label>
          <Input
            id="duration"
            type="number"
            name="duration"
            min="1"
            value={formData.duration}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="flex justify-between items-center mt-8">
        {!isNew && (
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            className="flex items-center"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Delete
          </Button>
        )}
        <Button
          size="sm"
          onClick={handleSubmit}
          className="ml-auto flex items-center"
        >
          <Save className="w-4 h-4 mr-1" />
          {isNew ? "Create" : "Save"}
        </Button>
      </div>
    </div>
  );
}
