import React, { useEffect, useState } from 'react';
import { useAuth } from '@/api/hooks/useAuth';

interface StatusPickupStationsProps {
  status: string;
}

const StatusPickupStations: React.FC<StatusPickupStationsProps> = ({ status }) => {
  const { client } = useAuth();
  const [stations, setStations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    client.get(`/api/pickup-stations?status=${status}`)
      .then(res => setStations(res.data.data || []))
      .catch(err => setError(err?.message || 'Error fetching stations'))
      .finally(() => setLoading(false));
  }, [status]);

  if (loading) return <div className="text-white">Loading...</div>;
  if (error) return <div className="text-red-400">{error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold text-white mb-4">Pickup Stations (Status: {status})</h2>
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
          </tr>
        </thead>
        <tbody>
          {stations.length > 0 ? stations.map(station => (
            <tr key={station._id || station.id}>
              <td className="px-6 py-4 whitespace-nowrap">{station.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {station.address?.street}, {station.address?.city}, {station.address?.state} {station.address?.zipCode}, {station.address?.country}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">{station.status}</td>
            </tr>
          )) : <tr><td colSpan={3} className="text-center text-white">No stations found.</td></tr>}
        </tbody>
      </table>
    </div>
  );
};

export default StatusPickupStations; 