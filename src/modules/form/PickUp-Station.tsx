"use client";
import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from "@/api/hooks/useAuth";

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Coordinates {
  latitude: string;
  longitude: string;
}

export interface Contact {
  phone: string;
  email: string;
}

export interface OperatingDay {
  open: string;
  close: string;
  closed: boolean;
}

const daysOfWeek = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday"
] as const;

type DayOfWeek = typeof daysOfWeek[number];

export interface OperatingHours {
  monday: OperatingDay;
  tuesday: OperatingDay;
  wednesday: OperatingDay;
  thursday: OperatingDay;
  friday: OperatingDay;
  saturday: OperatingDay;
  sunday: OperatingDay;
}

export interface Capacity {
  maxOrders: string;
  currentOrders: string;
}

export interface Manager {
  name: string;
  phone: string;
  email: string;
}

export interface PickupStationForm {
  name: string;
  code: string;
  status: string;
  address: Address;
  coordinates: Coordinates;
  contact: Contact;
  operatingHours: OperatingHours;
  capacity: Capacity;
  facilities: string[];
  manager: Manager;
  googleMapLink: string;
  landmarkArea: string;
  stationPicture: File | null;
  managerPicture1: File | null;
}

const initialState: PickupStationForm = {
  name: '',
  code: '',
  status: 'active',
  address: {
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  },
  coordinates: {
    latitude: '',
    longitude: '',
  },
  contact: {
    phone: '',
    email: '',
  },
  operatingHours: {
    monday: { open: '', close: '', closed: false },
    tuesday: { open: '', close: '', closed: false },
    wednesday: { open: '', close: '', closed: false },
    thursday: { open: '', close: '', closed: false },
    friday: { open: '', close: '', closed: false },
    saturday: { open: '', close: '', closed: false },
    sunday: { open: '', close: '', closed: false },
  },
  capacity: {
    maxOrders: '',
    currentOrders: '',
  },
  facilities: [],
  manager: {
    name: '',
    phone: '',
    email: '',
  },
  googleMapLink: '',
  landmarkArea: '',
  stationPicture: null,
  managerPicture1: null,
};

const facilitiesList = [
  'parking',
  'wheelchair_access',
  'air_conditioning',
  'waiting_area',
];

const steps = [
  'Basic Info',
  'Address & Coordinates',
  'Contact & Operating Hours',
  'Capacity, Facilities & Manager',
  'Review & Submit',
];

interface PickUpStationFormProps {
  onSuccess?: () => void;
}

const PickUpStation: React.FC<PickUpStationFormProps> = ({ onSuccess }) => {
  const [form, setForm] = useState<PickupStationForm>(initialState);
  const [currentStep, setCurrentStep] = useState(1);
  const [message, setMessage] = useState('');
  const queryClient = useQueryClient();
  const { client } = useAuth();

  const createPickupStationMutation = useMutation({
    mutationFn: async (form: PickupStationForm) => {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('code', form.code);
      formData.append('status', form.status);

      // Address
      Object.entries(form.address).forEach(([key, value]) => {
        formData.append(`address[${key}]`, value);
      });

      // Full address for backend
      const fullAddress = `${form.address.street}, ${form.address.city}, ${form.address.state} ${form.address.zipCode}, ${form.address.country}`;
      formData.append('fullAddress', fullAddress);

      // Coordinates
      formData.append('coordinates[latitude]', form.coordinates.latitude);
      formData.append('coordinates[longitude]', form.coordinates.longitude);

      // Contact
      Object.entries(form.contact).forEach(([key, value]) => {
        formData.append(`contact[${key}]`, value);
      });

      // Operating Hours
      daysOfWeek.forEach((day) => {
        formData.append(`operatingHours[${day}][open]`, form.operatingHours[day].open);
        formData.append(`operatingHours[${day}][close]`, form.operatingHours[day].close);
        formData.append(`operatingHours[${day}][closed]`, String(form.operatingHours[day].closed));
      });

      // Capacity
      formData.append('capacity[maxOrders]', form.capacity.maxOrders);
      formData.append('capacity[currentOrders]', form.capacity.currentOrders);

      // Facilities (array)
      form.facilities.forEach((facility) => {
        formData.append('facilities[]', facility);
      });

      // Manager
      Object.entries(form.manager).forEach(([key, value]) => {
        formData.append(`manager[${key}]`, value);
      });
      // Manager fullName for backend
      formData.append('manager[fullName]', form.manager.name);

      formData.append('googleMapLink', form.googleMapLink);
      formData.append('landmarkArea', form.landmarkArea);

      if (form.stationPicture) formData.append('stationPicture', form.stationPicture);
      if (form.managerPicture1) formData.append('managerPicture1', form.managerPicture1);

      // Use client.post instead of fetch
      return client.post('/api/pickup-stations', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pickup-stations'] });
      setForm(initialState);
      setCurrentStep(1);
      setMessage('Pickup station created successfully!');
      if (onSuccess) onSuccess();
    },
    onError: (error: any) => {
      setMessage(error.message || 'Error occurred');
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    path: string[] = []
  ) => {
    const { name, value, type, checked, files } = e.target as HTMLInputElement;
    if (path.length) {
      setForm(prev => {
        const updated: any = { ...prev };
        let obj = updated;
        for (let i = 0; i < path.length - 1; i++) {
          obj = obj[path[i]];
        }
        if (type === 'checkbox') {
          obj[path[path.length - 1]] = checked;
        } else if (type === 'file') {
          obj[path[path.length - 1]] = files && files[0] ? files[0] : null;
        } else {
          obj[path[path.length - 1]] = value;
        }
        return updated;
      });
    } else {
      if (type === 'file') {
        setForm(prev => ({ ...prev, [name]: files && files[0] ? files[0] : null }));
      } else {
        setForm(prev => ({ ...prev, [name]: value }));
      }
    }
  };

  const handleFacilityChange = (facility: string) => {
    setForm(prev => {
      const exists = prev.facilities.includes(facility);
      return {
        ...prev,
        facilities: exists
          ? prev.facilities.filter((f: string) => f !== facility)
          : [...prev.facilities, facility],
      };
    });
  };

  const nextStep = () => setCurrentStep(s => Math.min(s + 1, steps.length));
  const prevStep = () => setCurrentStep(s => Math.max(s - 1, 1));

  const handleSubmit = () => {
    setMessage('');
    createPickupStationMutation.mutate(form);
  };

  const loading = createPickupStationMutation.isPending;

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                <input name="name" value={form.name} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Code *</label>
                <input name="code" value={form.code} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select name="status" value={form.status} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                    <option value="maintenance">Maintenance</option>
                      <option value="temporarily_closed">Temporarily Closed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Station Picture</label>
                <input name="stationPicture" type="file" accept="image/*" onChange={handleChange} className="w-full" />
                {form.stationPicture && <span className="text-xs text-gray-500">{form.stationPicture.name}</span>}
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-base font-semibold text-gray-800 mb-2">Address</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Street *</label>
                  <input name="street" value={form.address.street} onChange={e => handleChange(e, ['address', 'street'])} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                  <input name="city" value={form.address.city} onChange={e => handleChange(e, ['address', 'city'])} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                  <input name="state" value={form.address.state} onChange={e => handleChange(e, ['address', 'state'])} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Zip Code *</label>
                  <input name="zipCode" value={form.address.zipCode} onChange={e => handleChange(e, ['address', 'zipCode'])} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
                  <input name="country" value={form.address.country} onChange={e => handleChange(e, ['address', 'country'])} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-base font-semibold text-gray-800 mb-2 mt-6">Coordinates</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Latitude *</label>
                  <input name="latitude" value={form.coordinates.latitude} onChange={e => handleChange(e, ['coordinates', 'latitude'])} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Longitude *</label>
                  <input name="longitude" value={form.coordinates.longitude} onChange={e => handleChange(e, ['coordinates', 'longitude'])} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required />
                </div>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-base font-semibold text-gray-800 mb-2">Contact</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                  <input name="phone" value={form.contact.phone} onChange={e => handleChange(e, ['contact', 'phone'])} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input name="email" value={form.contact.email} onChange={e => handleChange(e, ['contact', 'email'])} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-base font-semibold text-gray-800 mb-2 mt-6">Operating Hours</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                {daysOfWeek.map((day) => (
                  <div key={day} className="flex items-center gap-2">
                    <span className="w-24 capitalize">{day}</span>
                    <input type="time" value={form.operatingHours[day].open} onChange={e => handleChange({ target: { name: 'open', value: e.target.value } } as any, ['operatingHours', day, 'open'])} className="border rounded px-2 py-1" />
                    <input type="time" value={form.operatingHours[day].close} onChange={e => handleChange({ target: { name: 'close', value: e.target.value } } as any, ['operatingHours', day, 'close'])} className="border rounded px-2 py-1" />
                    <label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={form.operatingHours[day].closed} onChange={e => handleChange({ target: { name: 'closed', checked: e.target.checked, type: 'checkbox' } } as any, ['operatingHours', day, 'closed'])} />Closed</label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-base font-semibold text-gray-800 mb-2">Capacity</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Orders *</label>
                  <input name="maxOrders" type="number" value={form.capacity.maxOrders} onChange={e => handleChange(e, ['capacity', 'maxOrders'])} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Orders *</label>
                  <input name="currentOrders" type="number" value={form.capacity.currentOrders} onChange={e => handleChange(e, ['capacity', 'currentOrders'])} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-base font-semibold text-gray-800 mb-2 mt-6">Facilities</label>
              <div className="flex flex-wrap gap-4 bg-gray-50 p-4 rounded-lg">
                {facilitiesList.map(facility => (
                  <label key={facility} className="flex items-center gap-2">
                    <input type="checkbox" checked={form.facilities.includes(facility)} onChange={() => handleFacilityChange(facility)} />
                    {facility.replace('_', ' ')}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-base font-semibold text-gray-800 mb-2 mt-6">Manager</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                  <input name="name" value={form.manager.name} onChange={e => handleChange(e, ['manager', 'name'])} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                  <input name="phone" value={form.manager.phone} onChange={e => handleChange(e, ['manager', 'phone'])} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input name="email" value={form.manager.email} onChange={e => handleChange(e, ['manager', 'email'])} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Manager Picture</label>
                  <input name="managerPicture1" type="file" accept="image/*" onChange={e => handleChange(e, ['managerPicture1'])} className="w-full" />
                  {form.managerPicture1 && <span className="text-xs text-gray-500">{form.managerPicture1.name}</span>}
                </div>
              </div>
            </div>
            <div>
              <label className="block text-base font-semibold text-gray-800 mb-2 mt-6">Other Details</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Google Map Link</label>
                  <input name="googleMapLink" value={form.googleMapLink} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Landmark Area</label>
                  <input name="landmarkArea" value={form.landmarkArea} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-6">
            <pre className="bg-gray-100 p-4 rounded text-xs overflow-x-auto">{JSON.stringify(form, null, 2)}</pre>
            <button type="button" onClick={handleSubmit} disabled={loading} className="px-8 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors">
              {loading ? 'Submitting...' : 'Submit Pickup Station'}
            </button>
            {message && <p className="mt-2 text-sm text-center text-blue-500">{message}</p>}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen p-0">
      <div className="w-full flex items-center justify-between px-8 py-6 ">
       
      </div>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 mt-8">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-700">Step {currentStep} of {steps.length}</span>
              <span className="text-sm text-gray-500">{Math.round((currentStep / steps.length) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${(currentStep / steps.length) * 100}%` }}></div>
            </div>
          </div>
          {/* Step Content */}
          <div className="mb-8">{renderStep()}</div>
          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <button type="button" onClick={prevStep} disabled={currentStep === 1} className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${currentStep === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Previous</button>
            {currentStep < steps.length && (
              <button type="button" onClick={nextStep} className="flex items-center gap-2 px-6 py-3 bg-[#221c3e] text-white rounded-lg font-medium hover:bg-[#3b2f73] transition-colors">Next</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PickUpStation;