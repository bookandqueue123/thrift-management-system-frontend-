"use client";
import React, { useState } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { useAuth } from "@/api/hooks/useAuth";
import { FaSpinner } from "react-icons/fa";
import { useRouter } from 'next/navigation';

export interface Address {
  street: string
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
  fullName: string;
  phone: string;
  email: string;
}
export interface StorageCapacity {
  indoor: {
    height: string;
    length: string;
    breadth: string;
  };
  outdoor: {
    height: string;
    length: string;
    breadth: string;
  };
  refrigerated: {
    height: string;
    length: string;
    breadth: string;
  };
  pickupCenterFee: string;
 
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
  storageCapacity: StorageCapacity; 
  facilities: string[];
  manager: Manager;
  googleMapLink: string;
  landmarkArea: string;
  stationPicture: File | null;
  managerPicture1: File | null;
  amount: {
    value: number;
    currency: string;
  };
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
  storageCapacity: {
    indoor: {
      height: '',
      length: '',
      breadth: '',
    },
    outdoor: {
      height: '',
      length: '',
      breadth: '',
    },
    refrigerated: {
      height: '',
      length: '',
      breadth: '',
    },
    pickupCenterFee: '',
   
  },
  manager: {
    fullName: '',
    phone: '',
    email: '',
  },
  googleMapLink: '',
  landmarkArea: '',
  stationPicture: null,
  managerPicture1: null,
  amount: { value: 0, currency: 'NGN' },
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

function extractLatLngFromGoogleMapsUrl(url: string): { latitude: string, longitude: string } | null {
  // Match @lat,lng or ?q=lat,lng
  const atMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (atMatch) {
    return { latitude: atMatch[1], longitude: atMatch[2] };
  }
  const qMatch = url.match(/[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (qMatch) {
    return { latitude: qMatch[1], longitude: qMatch[2] };
  }
  return null;
}

const PickUpStation: React.FC<PickUpStationFormProps> = ({ onSuccess }) => {
  const [form, setForm] = useState<PickupStationForm>(initialState);
  const [currentStep, setCurrentStep] = useState(1);
  const [message, setMessage] = useState('');
  const [autoFilledCoords, setAutoFilledCoords] = useState(false);
  const [centreType, setCentreType] = useState<'new' | 'existing'>('new');
  const [selectedMerchantId, setSelectedMerchantId] = useState<string>('');
  const [merchantSearch, setMerchantSearch] = useState(''); // <-- new state for search
  const [showMerchantDropdown, setShowMerchantDropdown] = useState(false); // <-- new state for dropdown visibility
  const queryClient = useQueryClient();
  const { client } = useAuth();
  const router = useRouter();

  // Fetch merchants
  const { data: merchants = [], isLoading: merchantsLoading } = useQuery({
    queryKey: ['allManagers'],
    queryFn: async () => {
      const res = await client.get('/api/user?role=organisation');
      return res.data;
    },
    enabled: centreType === 'existing',
  });

  // Filtered merchants based on search
  const filteredMerchants = React.useMemo(() => {
    if (!merchantSearch) return merchants;
    const search = merchantSearch.toLowerCase();
    return merchants.filter((m: any) =>
      (m.organisationName && m.organisationName.toLowerCase().includes(search)) ||
      (m.accountNumber && m.accountNumber.toLowerCase().includes(search))
    );
  }, [merchants, merchantSearch]);

  // When merchant is selected, auto-populate form
  React.useEffect(() => {
    if (centreType === 'existing' && selectedMerchantId && merchants.length > 0) {
      const merchant = merchants.find((m: any) => m._id === selectedMerchantId);
      if (merchant) {
        setForm((prev) => ({
          ...prev,
          name: merchant.organisationName || '',
          code: merchant.organisationName|| '',
          status: 'active',
          address: {
            street: merchant.officeAddress1 || '',
            city: merchant.city || '',
            state: merchant.state || '',
            country: merchant.country || '',
            zipCode: prev.address.zipCode,
          },
          googleMapLink: merchant.googleMapLink || '',
          landmarkArea: merchant.landmarkArea || '',
          contact: {
            ...prev.contact,
            phone: merchant.phoneNumber || '',
            email: merchant.email || '',
          },
          manager: {
            ...prev.manager,
            fullName: merchant.contactFullName || '',
            phone: merchant.contactPhoneNumber || merchant.phoneNumber || '',
            email: merchant.contactEmail || merchant.email || '',
          }
        }));
      }
    }
  }, [centreType, selectedMerchantId, merchants]);

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
      formData.append('manager[fullName]', form.manager.fullName);

      formData.append('googleMapLink', form.googleMapLink);
      formData.append('landmarkArea', form.landmarkArea);

      if (form.stationPicture) formData.append('stationPicture', form.stationPicture);
      if (form.managerPicture1) formData.append('managerPicture1', form.managerPicture1);

      // Add amount
      formData.append('amount[value]', String(form.amount.value));
      formData.append('amount[currency]', form.amount.currency);

      // Use client.post instead of fetch
      return client.post('/api/pickup-stations', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
    onSuccess: () => {
      setMessage('Pickup station created successfully!');
      setTimeout(() => {
        setMessage('');
        // Navigate to the pickup stations table page (update path if needed)
        router.push('/merchant/settings/location');
      }, 3000);
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
    if (name === "googleMapLink") {
      setForm(prev => {
        const updated = { ...prev, [name]: value };
        const coords = extractLatLngFromGoogleMapsUrl(value);
        if (coords) {
          updated.coordinates = {
            latitude: coords.latitude,
            longitude: coords.longitude,
          };
        }
        return updated;
      });
      const coords = extractLatLngFromGoogleMapsUrl(value);
      setAutoFilledCoords(!!coords);
      return;
    }
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
            <div className="grid grid-cols-1 gap-4 mb-6">
              <div className="flex items-center gap-4">
                <input
                  type="radio"
                  id="newCentre"
                  name="centreType"
                  value="new"
                  checked={centreType === 'new'}
                  onChange={() => {
                    setCentreType('new');
                    setSelectedMerchantId('');
                    setForm(initialState);
                  }}
                  className="w-4 h-4 text-blue-600"
                />
                <label htmlFor="newCentre" className="text-sm font-medium text-gray-700">
                  New Centre
                </label>
              </div>
              
              <div className="flex items-center gap-4">
                <input
                  type="radio"
                  id="existingMerchant"
                  name="centreType"
                  value="existing"
                  checked={centreType === 'existing'}
                  onChange={() => setCentreType('existing')}
                  className="w-4 h-4 text-blue-600"
                />
                <label htmlFor="existingMerchant" className="text-sm font-medium text-gray-700">
                  Choose Existing Merchant
                </label>
              </div>

              {centreType === 'existing' && (
                <div className="pl-8 mt-2 relative">
                  <input
                    type="text"
                    placeholder="Search merchants..."
                    value={merchantSearch}
                    onChange={e => setMerchantSearch(e.target.value)}
                    className="w-full px-2 py-2 mb-2 border border-gray-300 rounded-lg"
                    onFocus={() => setShowMerchantDropdown(true)}
                  />
                  <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white cursor-pointer" onClick={() => setShowMerchantDropdown((prev: boolean) => !prev)}>
                    {selectedMerchantId
                      ? (() => {
                          const m = merchants.find((m: any) => m._id === selectedMerchantId);
                          return m ? `${m.organisationName}` : 'Select merchant...';
                        })()
                      : 'Select merchant...'}
                  </div>
                  {showMerchantDropdown && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {filteredMerchants.length > 0 ? (
                        filteredMerchants.map((m: any) => (
                          <div
                            key={m._id}
                            onClick={() => {
                              setSelectedMerchantId(m._id);
                              setShowMerchantDropdown(false);
                            }}
                            className={`px-4 py-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0 ${selectedMerchantId === m._id ? 'bg-blue-50' : ''}`}
                          >
                            <div className="font-medium text-gray-900">{m.organisationName}</div>
                            <div className="text-sm text-gray-500">
                              {m.accountNumber ? `Account Number: ${m.accountNumber}` : ''}
                              {m.email ? ` | Email: ${m.email}` : ''}
                            </div>
                            {selectedMerchantId === m._id && <span className="text-blue-600 ml-2">✓ Selected</span>}
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-gray-500 text-center">
                          {merchantsLoading ? 'Loading merchants...' : 'No merchants found'}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Center&apos;s Name/Business Name *</label>
                <input 
                  name="name" 
                  value={form.name} 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Center&apos;s Code *</label>
                <input 
                  name="code" 
                  value={form.code} 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg" 
                />
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
              <label className="block text-base font-semibold text-gray-800 mb-2 mt-6">Coordinates/ Address(Google Map Link)</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Google Map Link</label>
                  <input name="googleMapLink" value={form.googleMapLink}
                   onChange={handleChange} 
                   placeholder='https://www.google.com/maps/place/Lagos/@6.5244,3.3792,17z/'
                   className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Landmark Area</label>
                  <input name="landmarkArea" value={form.landmarkArea} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Latitude *</label>
                  <input name="latitude" value={form.coordinates.latitude} onChange={e => handleChange(e, ['coordinates', 'latitude'])} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required readOnly={autoFilledCoords} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Longitude *</label>
                  <input name="longitude" value={form.coordinates.longitude} onChange={e => handleChange(e, ['coordinates', 'longitude'])} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required readOnly={autoFilledCoords} />
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Maximum orders *</label>
                  <input name="maxOrders" type="number" value={form.capacity.maxOrders} onChange={e => handleChange(e, ['capacity', 'maxOrders'])} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current orders *</label>
                  <input name="currentOrders" type="number" value={form.capacity.currentOrders} onChange={e => handleChange(e, ['capacity', 'currentOrders'])} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required />
                </div>
              </div>
            </div>
              <div>
       
           <div className="grid  gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
              <input
                type="number"
                name="amountValue"
                value={form.amount.value}
                onChange={e => setForm(prev => ({
                  ...prev,
                  amount: { ...prev.amount, value: Number(e.target.value) }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                placeholder="Enter amount value"
                required
              />
              <select
                name="amountCurrency"
                value={form.amount.currency}
                onChange={e => setForm(prev => ({
                  ...prev,
                  amount: { ...prev.amount, currency: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md mt-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
                required
              >
                <option value="NGN">NGN</option>
                <option value="USD">USD</option>
              </select>
            </div>
           
          </div>
{/*      
        <div className="mb-4">
          <h3 className="text-sm font-semibold  mb-2">Indoor products storage</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4  p-4 rounded-lg border ">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Height (m)</label>
              <input 
                name="indoorHeight" 
                type="number" 
                step="0.01"
                value={form.storageCapacity.indoor.height} 
                onChange={e => handleChange(e, ['storageCapacity', 'indoor', 'height'])} 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="Enter height"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Length (m)</label>
              <input 
                name="indoorLength" 
                type="number" 
                step="0.01"
                value={form.storageCapacity.indoor.length} 
                onChange={e => handleChange(e, ['storageCapacity', 'indoor', 'length'])} 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="Enter length"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Breadth (m)</label>
              <input 
                name="indoorBreadth" 
                type="number" 
                step="0.01"
                value={form.storageCapacity.indoor.breadth} 
                onChange={e => handleChange(e, ['storageCapacity', 'indoor', 'breadth'])} 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="Enter breadth"
              />
            </div>
            <div className="md:col-span-3">
              <div className="text-sm  font-medium">
                Indoor Capacity: {
                  (parseFloat(form.storageCapacity.indoor.height) || 0) * 
                  (parseFloat(form.storageCapacity.indoor.length) || 0) * 
                  (parseFloat(form.storageCapacity.indoor.breadth) || 0)
                } cubic meters
              </div>
            </div>
          </div>
        </div> */}

        
      
        {/* <div className="mb-4">
          <h3 className="text-sm font-semibold  mb-2">Outdoor Products storage</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4  p-4 rounded-lg border border-green-200">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Height (m)</label>
              <input 
                name="outdoorHeight" 
                type="number" 
                step="0.01"
                value={form.storageCapacity.outdoor.height} 
                onChange={e => handleChange(e, ['storageCapacity', 'outdoor', 'height'])} 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" 
                placeholder="Enter height"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Length (m)</label>
              <input 
                name="outdoorLength" 
                type="number" 
                step="0.01"
                value={form.storageCapacity.outdoor.length} 
                onChange={e => handleChange(e, ['storageCapacity', 'outdoor', 'length'])} 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" 
                placeholder="Enter length"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Breadth (m)</label>
              <input 
                name="outdoorBreadth" 
                type="number" 
                step="0.01"
                value={form.storageCapacity.outdoor.breadth} 
                onChange={e => handleChange(e, ['storageCapacity', 'outdoor', 'breadth'])} 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" 
                placeholder="Enter breadth"
              />
            </div>
            <div className="md:col-span-3">
              <div className="text-sm  font-medium">
                Outdoor Capacity: {
                  (parseFloat(form.storageCapacity.outdoor.height) || 0) * 
                  (parseFloat(form.storageCapacity.outdoor.length) || 0) * 
                  (parseFloat(form.storageCapacity.outdoor.breadth) || 0)
                } cubic meters
              </div>
            </div>
          </div>
        </div> */}

        {/* Refrigerated Products Storage */}
        {/* <div className="mb-4">
          <h3 className="text-sm font-semibold mb-2">Refrigerated products storage</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4  p-4 rounded-lg border border-purple-200">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Height (m)</label>
              <input 
                name="refrigeratedHeight" 
                type="number" 
                step="0.01"
                value={form.storageCapacity.refrigerated.height} 
                onChange={e => handleChange(e, ['storageCapacity', 'refrigerated', 'height'])} 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" 
                placeholder="Enter height"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Length (m)</label>
              <input 
                name="refrigeratedLength" 
                type="number" 
                step="0.01"
                value={form.storageCapacity.refrigerated.length} 
                onChange={e => handleChange(e, ['storageCapacity', 'refrigerated', 'length'])} 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" 
                placeholder="Enter length"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Breadth (m)</label>
              <input 
                name="refrigeratedBreadth" 
                type="number" 
                step="0.01"
                value={form.storageCapacity.refrigerated.breadth} 
                onChange={e => handleChange(e, ['storageCapacity', 'refrigerated', 'breadth'])} 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" 
                placeholder="Enter breadth"
              />
            </div>
            <div className="md:col-span-3">
              <div className="text-sm  font-medium">
                Refrigerated Capacity: {
                  (parseFloat(form.storageCapacity.refrigerated.height) || 0) * 
                  (parseFloat(form.storageCapacity.refrigerated.length) || 0) * 
                  (parseFloat(form.storageCapacity.refrigerated.breadth) || 0)
                } cubic meters
              </div>
            </div>
          </div>
        </div> */}

      

        
        {/* <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <h3 className="text-sm font-semibold text-yellow-800 mb-2">Total Storage Capacity Summary</h3>
          <div className="text-lg font-bold text-yellow-700">
            Total Capacity: {
              (
                (parseFloat(form.storageCapacity.indoor.height) || 0) * 
                (parseFloat(form.storageCapacity.indoor.length) || 0) * 
                (parseFloat(form.storageCapacity.indoor.breadth) || 0)
              ) + (
                (parseFloat(form.storageCapacity.outdoor.height) || 0) * 
                (parseFloat(form.storageCapacity.outdoor.length) || 0) * 
                (parseFloat(form.storageCapacity.outdoor.breadth) || 0)
              ) + (
                (parseFloat(form.storageCapacity.refrigerated.height) || 0) * 
                (parseFloat(form.storageCapacity.refrigerated.length) || 0) * 
                (parseFloat(form.storageCapacity.refrigerated.breadth) || 0)
              )
            } cubic meters
          </div>
        </div> */}
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
              <label className="block text-base font-semibold text-gray-800 mb-2 mt-6">Center&apos;s manager</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Manager &apos;s fullName *</label>
                  <input name="fullName" value={form.manager.fullName} onChange={e => handleChange(e, ['manager', 'fullName'])} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Manager &apos;s Phone number*</label>
                  <input name="phone" value={form.manager.phone} onChange={e => handleChange(e, ['manager', 'phone'])} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Manager&apos;s Email address *</label>
                  <input name="email" value={form.manager.email} onChange={e => handleChange(e, ['manager', 'email'])} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Manager&apos;s  Picture</label>
                  <input name="managerPicture1" type="file" accept="image/*" onChange={e => handleChange(e, ['managerPicture1'])} className="w-full" />
                  {form.managerPicture1 && <span className="text-xs text-gray-500">{form.managerPicture1.name}</span>}
                </div>
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <React.Fragment />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen p-0">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 mt-8">
          {/* Success message always at the top */}
          {message && (
            <div className="mb-4 p-3 bg-green-100 text-green-800 rounded text-center font-medium">
              {message}
            </div>
          )}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-700">Step {currentStep} of {steps.length}</span>
              <span className="text-sm text-gray-500">{Math.round((currentStep / steps.length) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${(currentStep / steps.length) * 100}%` }}></div>
            </div>
          </div>
          <div className="mb-8">{renderStep()}</div>
          <div className="flex justify-between">
            <button type="button" onClick={prevStep} disabled={currentStep === 1} className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${currentStep === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Previous</button>
            {currentStep < steps.length && (
              <button type="button" onClick={nextStep} className="flex items-center gap-2 px-6 py-3 bg-[#221c3e] text-white rounded-lg font-medium hover:bg-[#3b2f73] transition-colors">Next</button>
            )}
          </div>
          {/* Only show submit button on last step, below navigation */}
          {currentStep === steps.length && (
            <div className="mt-8 flex justify-center">
              <button type="button" onClick={handleSubmit} disabled={loading} className="px-8 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-green-700 transition-colors">
                {loading ? 'Submitting...' : 'Submit Pickup Station'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PickUpStation;