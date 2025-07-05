import React, { useEffect, useState } from 'react';
import Modal from './Modal';
import { useAuth } from '@/api/hooks/useAuth';

interface PickupStationDetailsModalProps {
  stationId: string;
  onClose: () => void;
}

const PickupStationDetailsModal: React.FC<PickupStationDetailsModalProps> = ({ stationId, onClose }) => {
  const { client } = useAuth();
  const [station, setStation] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (stationId) {
      setLoading(true);
      client.get(`/api/pickup-stations/${stationId}`)
        .then(res => setStation(res.data.data || res.data))
        .catch(err => console.error("Failed to fetch station details", err))
        .finally(() => setLoading(false));
    }
  }, [stationId, client]);

  const getFullAddress = () => {
    if (!station?.address) return 'No address available';
    const { street, city, state, zipCode, country } = station.address;
    return [street, city, state, zipCode, country].filter(Boolean).join(', ');
  }
  
  return (
    <Modal title="View Pickup Station" setModalState={onClose as any}>
      {loading ? (
        <div className="text-center text-white p-4">Loading station details...</div>
      ) : station ? (
        <div className="p-4 text-white space-y-2">
          <div><b>Name:</b> {station.name}</div>
          <div><b>Address:</b> {getFullAddress()}</div>
          <div><b>Phone Number:</b> {station.contact?.phone || 'N/A'}</div>
          <div><b>Manager:</b> {station.manager?.fullName || 'N/A'}</div>
        </div>
      ) : <div className="text-center text-white p-4">No data found for this station.</div>}
    </Modal>
  );
};

export default PickupStationDetailsModal; 