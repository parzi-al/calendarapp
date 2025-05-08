// 📁 src/components/NewEventDialog.jsx

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function NewEventDialog({ open, onClose, onSave, date }) {
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    duration: "",
  });

  // ✅ Pre-fill date if passed in
  useEffect(() => {
    if (date) {
      setFormData((prev) => ({
        ...prev,
        date: date.format("YYYY-MM-DD"), // assuming `date` is a Day.js object
      }));
    }
  }, [date]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (formData.title && formData.date && formData.time) {
      onSave({ ...formData, duration: parseInt(formData.duration) || 60 });
      setFormData({ title: "", date: "", time: "", duration: "" });
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Event</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <Input placeholder="Title" name="title" value={formData.title} onChange={handleChange} />
          <Input type="date" name="date" value={formData.date} onChange={handleChange} />
          <Input type="time" name="time" value={formData.time} onChange={handleChange} />
          <Input type="number" name="duration" placeholder="Duration (mins)" value={formData.duration} onChange={handleChange} />
        </div>
        <div className="flex justify-end mt-4">
          <Button onClick={handleSubmit}>Add Event</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
