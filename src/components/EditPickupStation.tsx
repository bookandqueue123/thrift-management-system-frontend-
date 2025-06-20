import React, { useEffect, useState } from 'react';
import Modal from './Modal';
import { useAuth } from '@/api/hooks/useAuth';

interface EditPickupStationProps {
  stationId: string;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const EditPickupStation: React.FC<EditPickupStationProps> = ({ stationId, open, onClose, onSuccess }) => {
  const { client } = useAuth();
  const [form, setForm] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (open && stationId) {
      setLoading(true);
      client.get(`/api/pickup-stations/${stationId}`)
        .then(res => setForm(res.data.data || res.data))
        .finally(() => setLoading(false));
    }
  }, [open, stationId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, path: string[] = []) => {
    const { name, value } = e.target;
    if (path.length) {
      setForm((prev: any) => {
        const updated = { ...prev };
        let obj = updated;
        for (let i = 0; i < path.length - 1; i++) {
          obj = obj[path[i]];
        }
        obj[path[path.length - 1]] = value;
        return updated;
      });
    } else {
      setForm((prev: any) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await client.put(`/api/pickup-stations/${stationId}`, form);
      setMessage('Pickup station updated successfully!');
      if (onSuccess) onSuccess();
      setTimeout(() => onClose(), 1000);
    } catch (error: any) {
      setMessage(error?.message || 'Error updating station');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <Modal title="Edit Pick Up Station" setModalState={onClose}>
      {loading || !form ? (
        <div className="text-center text-white">Loading...</div>
      ) : (
        <form className="p-4 text-white space-y-2" onSubmit={handleSubmit}>
          <div>
            <label>Name:</label>
            <input name="name" value={form.name || ''} onChange={handleChange} className="w-full text-black px-2 py-1 rounded" />
          </div>
          <div>
            <label>Code:</label>
            <input name="code" value={form.code || ''} onChange={handleChange} className="w-full text-black px-2 py-1 rounded" />
          </div>
          <div>
            <label>Street:</label>
            <input name="street" value={form.address?.street || ''} onChange={e => handleChange(e, ['address', 'street'])} className="w-full text-black px-2 py-1 rounded" />
          </div>
          <div>
            <label>City:</label>
            <input name="city" value={form.address?.city || ''} onChange={e => handleChange(e, ['address', 'city'])} className="w-full text-black px-2 py-1 rounded" />
          </div>
          <div>
            <label>State:</label>
            <input name="state" value={form.address?.state || ''} onChange={e => handleChange(e, ['address', 'state'])} className="w-full text-black px-2 py-1 rounded" />
          </div>
          <div>
            <label>Zip Code:</label>
            <input name="zipCode" value={form.address?.zipCode || ''} onChange={e => handleChange(e, ['address', 'zipCode'])} className="w-full text-black px-2 py-1 rounded" />
          </div>
          <div>
            <label>Country:</label>
            <input name="country" value={form.address?.country || ''} onChange={e => handleChange(e, ['address', 'country'])} className="w-full text-black px-2 py-1 rounded" />
          </div>
          <div>
            <label>Latitude:</label>
            <input name="latitude" value={form.coordinates?.latitude || ''} onChange={e => handleChange(e, ['coordinates', 'latitude'])} className="w-full text-black px-2 py-1 rounded" />
          </div>
          <div>
            <label>Longitude:</label>
            <input name="longitude" value={form.coordinates?.longitude || ''} onChange={e => handleChange(e, ['coordinates', 'longitude'])} className="w-full text-black px-2 py-1 rounded" />
          </div>
          <div>
            <label>Phone:</label>
            <input name="phone" value={form.contact?.phone || ''} onChange={e => handleChange(e, ['contact', 'phone'])} className="w-full text-black px-2 py-1 rounded" />
          </div>
          <div>
            <label>Email:</label>
            <input name="email" value={form.contact?.email || ''} onChange={e => handleChange(e, ['contact', 'email'])} className="w-full text-black px-2 py-1 rounded" />
          </div>
          {/* Add more fields as needed for manager, capacity, facilities, status, operatingHours, etc. */}
          <div className="flex justify-end mt-4">
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
          {message && <div className="text-center text-green-300 mt-2">{message}</div>}
        </form>
      )}
    </Modal>
  );
};

export default EditPickupStation; 