import React, { useEffect, useState } from 'react';
import { useAuth } from '@/api/hooks/useAuth';

interface AvailablePickupStationsProps {
  city: string;
}

const AvailablePickupStations: React.FC<AvailablePickupStationsProps> = ({ city }) => {
  const { client } = useAuth();
  const [stations, setStations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    client.get(`/api/pickup-stations/available?city=${encodeURIComponent(city)}`)
      .then(res => setStations(res.data.data || []))
      .catch(err => setError(err?.message || 'Error fetching available stations'))
      .finally(() => setLoading(false));
  }, [city]);

  if (loading) return <div className="text-white">Loading...</div>;
  if (error) return <div className="text-red-400">{error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold text-white mb-4">Available Pickup Stations in {city}</h2>
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
          </tr>
        </thead>
        <tbody>
          {stations.length > 0 ? stations.map(station => (
            <tr key={station._id || station.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                {station.fullAddress ||
                  [
                    station.address?.street,
                    station.address?.city,
                    station.address?.state,
                    station.address?.zipCode,
                    station.address?.country
                  ].filter(Boolean).join(', ')
                }
              </td>
            </tr>
          )) : <tr><td className="text-center text-white">No available stations found.</td></tr>}
        </tbody>
      </table>
    </div>
  );
};

export default AvailablePickupStations; 