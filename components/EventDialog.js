import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Pencil, Trash2, Save, X } from "lucide-react";

export default function EventDialog({ event, onClose, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(event || {});

  useEffect(() => {
    if (event) setFormData(event);
  }, [event]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    onUpdate(formData);
    setIsEditing(false);
    onClose();
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this event?")) {
      onDelete(event.id);
      onClose();
    }
  };

  return (
    <Dialog open={!!event} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        {event && (
          <>
            <DialogHeader className="mb-2">
              <DialogTitle className="text-xl font-semibold">
                {isEditing ? "Edit Event" : event.title}
              </DialogTitle>
              {!isEditing && (
                <DialogDescription className="text-gray-500">
                  {`${event.date} at ${event.time} • ${event.duration} mins`}
                </DialogDescription>
              )}
            </DialogHeader>

            {isEditing && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex gap-4">
                  <div className="flex-1 space-y-1">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      type="date"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <Label htmlFor="time">Time</Label>
                    <Input
                      type="time"
                      id="time"
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="duration">Duration (mins)</Label>
                  <Input
                    type="number"
                    id="duration"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                  />
                </div>
              </div>
            )}

            <div className="flex justify-between mt-6">
              <div>
                {!isEditing && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleDelete}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                )}
              </div>
              <div className="space-x-2">
                {isEditing ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(false)}
                    >
                      <X className="w-4 h-4 mr-1" />
                      Cancel
                    </Button>
                    <Button size="sm" onClick={handleSave}>
                      <Save className="w-4 h-4 mr-1" />
                      Save
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    <Pencil className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                )}
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
