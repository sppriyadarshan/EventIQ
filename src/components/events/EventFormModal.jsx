import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Textarea from '../ui/Textarea';
import Button from '../ui/Button';
import IconButton from '../ui/IconButton';
import Badge from '../ui/Badge';

/**
 * EventIQ EventFormModal Component
 * Modal for creating and editing events with complete form fields and UI validation.
 */
export const EventFormModal = ({
  isOpen,
  initialData = null,
  onClose,
  onSubmit,
}) => {
  const isEditing = Boolean(initialData && initialData.id);

  const [formData, setFormData] = useState({
    name: '',
    type: 'Conference',
    date: '2026-09-20',
    startTime: '09:00 AM',
    endTime: '05:00 PM',
    location: '',
    organizer: '',
    expectedAttendance: '500',
    capacity: '600',
    status: 'Ready',
    description: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        type: initialData.type || 'Conference',
        date: initialData.date || '2026-09-20',
        startTime: initialData.startTime || '09:00 AM',
        endTime: initialData.endTime || '05:00 PM',
        location: initialData.location || '',
        organizer: initialData.organizer || '',
        expectedAttendance: String(initialData.expectedAttendance || '500'),
        capacity: String(initialData.capacity || '600'),
        status: initialData.status || 'Ready',
        description: initialData.description || '',
      });
    } else {
      setFormData({
        name: '',
        type: 'Conference',
        date: '2026-09-20',
        startTime: '09:00 AM',
        endTime: '05:00 PM',
        location: '',
        organizer: '',
        expectedAttendance: '500',
        capacity: '600',
        status: 'Ready',
        description: '',
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Event name is required.';
    if (!formData.location.trim()) newErrors.location = 'Location is required.';
    if (!formData.organizer.trim()) newErrors.organizer = 'Organizer is required.';
    if (!formData.date) newErrors.date = 'Event date is required.';

    const att = Number(formData.expectedAttendance);
    if (!formData.expectedAttendance || isNaN(att) || att <= 0) {
      newErrors.expectedAttendance = 'Must be a positive number.';
    }

    const cap = Number(formData.capacity);
    if (!formData.capacity || isNaN(cap) || cap <= 0) {
      newErrors.capacity = 'Must be a positive number.';
    } else if (att > cap) {
      newErrors.expectedAttendance = 'Attendance exceeds capacity.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-outfit">
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-brand-espresso/40 transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-brand-ivory rounded-card shadow-2xl border border-brand-beige z-10 max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-5 border-b border-brand-beige flex items-center justify-between bg-brand-ivory sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-brand-espresso">
              {isEditing ? 'Edit Event Details' : 'Create New Event'}
            </h3>
            <Badge variant="neutral" size="sm">Demo Session</Badge>
          </div>
          <IconButton variant="ghost" size="sm" onClick={onClose} ariaLabel="Close modal">
            <X className="w-5 h-5 text-brand-warm-gray" />
          </IconButton>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1" noValidate>
          <Input
            label="Event Name"
            placeholder="e.g. Annual Technology Conference 2026"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            error={errors.name}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Event Type"
              value={formData.type}
              onChange={(e) => handleChange('type', e.target.value)}
              required
            >
              <option value="Conference">Conference</option>
              <option value="Workshop">Workshop</option>
              <option value="Networking">Networking</option>
              <option value="Seminar">Seminar</option>
            </Select>

            <Select
              label="Status"
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
              required
            >
              <option value="Ready">Ready</option>
              <option value="Planning">Planning</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Completed">Completed</option>
              <option value="Needs Attention">Needs Attention</option>
            </Select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Event Date"
              type="date"
              value={formData.date}
              onChange={(e) => handleChange('date', e.target.value)}
              error={errors.date}
              required
            />
            <Input
              label="Start Time"
              placeholder="09:00 AM"
              value={formData.startTime}
              onChange={(e) => handleChange('startTime', e.target.value)}
            />
            <Input
              label="End Time"
              placeholder="05:00 PM"
              value={formData.endTime}
              onChange={(e) => handleChange('endTime', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Location / Venue"
              placeholder="e.g. Convention Center Hall A"
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              error={errors.location}
              required
            />
            <Input
              label="Organizer / Department"
              placeholder="e.g. Academic Affairs"
              value={formData.organizer}
              onChange={(e) => handleChange('organizer', e.target.value)}
              error={errors.organizer}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Expected Attendance"
              type="number"
              placeholder="500"
              value={formData.expectedAttendance}
              onChange={(e) => handleChange('expectedAttendance', e.target.value)}
              error={errors.expectedAttendance}
              required
            />
            <Input
              label="Venue Capacity"
              type="number"
              placeholder="600"
              value={formData.capacity}
              onChange={(e) => handleChange('capacity', e.target.value)}
              error={errors.capacity}
              required
            />
          </div>

          <Textarea
            label="Event Description"
            placeholder="Outline event goals, key speakers, or special requirements..."
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            rows={3}
          />

          {/* Modal Actions */}
          <div className="pt-4 border-t border-brand-beige flex items-center justify-end gap-3">
            <Button variant="secondary" size="md" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              type="submit"
              leftIcon={<Check className="w-4 h-4" />}
            >
              {isEditing ? 'Save Changes' : 'Create Event'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventFormModal;
