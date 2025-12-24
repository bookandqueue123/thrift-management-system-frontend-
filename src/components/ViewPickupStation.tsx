import React, { useEffect, useState } from 'react';
import Modal from './Modal';
import { useAuth } from '@/api/hooks/useAuth';

interface ViewPickupStationProps {
  stationId: string;
  open: boolean;
  onClose: () => void;
}

const ViewPickupStation: React.FC<ViewPickupStationProps> = ({ stationId, open, onClose }) => {
  const { client } = useAuth();
  const [station, setStation] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [modalType, setModalType] = useState<string | null>(null);

  useEffect(() => {
    if (open && stationId) {
      setLoading(true);
      client.get(`/api/pickup-stations/${stationId}`)
        .then(res => setStation(res.data.data || res.data))
        .finally(() => setLoading(false));
    }
  }, [open, stationId]);

  if (!open) return null;

  return (
    <Modal title="View Pick Up Station" setModalState={onClose}>
      {loading ? (
        <div className="text-center text-white">Loading...</div>
      ) : station ? (
        <div className="p-4 text-white space-y-2">
          <div><b>Name:</b> {station.name}</div>
          <div><b>Code:</b> {station.code}</div>
          <div><b>Amount:</b> {station.amount ? `${station.amount.value} ${station.amount.currency}` : '--'}</div>
          <div>
            <b>Address:</b> <button className="btn btn-xs btn-info ml-2" onClick={() => setModalType('address')}>View</button>
          </div>
          <div>
            <b>Contact:</b> <button className="btn btn-xs btn-info ml-2" onClick={() => setModalType('contact')}>View</button>
          </div>
          <div>
            <b>Manager:</b> <button className="btn btn-xs btn-info ml-2" onClick={() => setModalType('manager')}>View</button>
          </div>
          <div>
            <b>Coordinates:</b> <button className="btn btn-xs btn-info ml-2" onClick={() => setModalType('coordinates')}>View</button>
          </div>
          <div>
            <b>Capacity:</b> <button className="btn btn-xs btn-info ml-2" onClick={() => setModalType('capacity')}>View</button>
          </div>
          <div>
            <b>Facilities:</b> <button className="btn btn-xs btn-info ml-2" onClick={() => setModalType('facilities')}>View</button>
          </div>
          <div>
            <b>Status:</b> <button className="btn btn-xs btn-info ml-2" onClick={() => setModalType('status')}>View</button>
          </div>
          <div>
            <b>Operating Hours:</b> <button className="btn btn-xs btn-info ml-2" onClick={() => setModalType('operatingHours')}>View</button>
          </div>
          {/* Add more fields as needed */}

          {/* Nested modals for each field */}
          {modalType === 'address' && (
            <Modal title="Address" setModalState={() => setModalType(null)}>
              <div className="p-4 text-white">
                <div><b>Street:</b> {station.address?.street}</div>
                <div><b>City:</b> {station.address?.city}</div>
                <div><b>State:</b> {station.address?.state}</div>
                <div><b>Zip Code:</b> {station.address?.zipCode}</div>
                <div><b>Country:</b> {station.address?.country}</div>
              </div>
            </Modal>
          )}
          {modalType === 'contact' && (
            <Modal title="Contact" setModalState={() => setModalType(null)}>
              <div className="p-4 text-white">
                <div><b>Phone:</b> {station.contact?.phone}</div>
                <div><b>Email:</b> {station.contact?.email}</div>
              </div>
            </Modal>
          )}
          {modalType === 'manager' && (
            <Modal title="Manager" setModalState={() => setModalType(null)}>
              <div className="p-4 text-white">
                <div><b>Name:</b> {station.manager?.fullName || station.manager?.name}</div>
                <div><b>Phone:</b> {station.manager?.phone}</div>
                <div><b>Email:</b> {station.manager?.email}</div>
                {station.manager?.pictures && station.manager.pictures.length > 0 && (
                  <div>
                    <b>Pictures:</b><br />
                    {station.manager.pictures.map((url: string, i: number) => (
                      <img key={i} src={url} alt="Manager" className="w-20 h-20 object-cover rounded inline-block mr-2 mt-1" />
                    ))}
                  </div>
                )}
              </div>
            </Modal>
          )}
          {modalType === 'coordinates' && (
            <Modal title="Coordinates" setModalState={() => setModalType(null)}>
              <div className="p-4 text-white">
                <div><b>Latitude:</b> {station.coordinates?.latitude}</div>
                <div><b>Longitude:</b> {station.coordinates?.longitude}</div>
              </div>
            </Modal>
          )}
          {modalType === 'capacity' && (
            <Modal title="Capacity" setModalState={() => setModalType(null)}>
              <div className="p-4 text-white">
                <div><b>Max Orders:</b> {station.capacity?.maxOrders}</div>
                <div><b>Current Orders:</b> {station.capacity?.currentOrders}</div>
              </div>
            </Modal>
          )}
          {modalType === 'facilities' && (
            <Modal title="Facilities" setModalState={() => setModalType(null)}>
              <div className="p-4 text-white">
                <div>{station.facilities?.join(', ')}</div>
              </div>
            </Modal>
          )}
          {modalType === 'status' && (
            <Modal title="Status" setModalState={() => setModalType(null)}>
              <div className="p-4 text-white">
                <div><b>Status:</b> {station.status}</div>
                <div><b>Is Available:</b> {station.isAvailable ? 'Yes' : 'No'}</div>
              </div>
            </Modal>
          )}
          {modalType === 'operatingHours' && (
            <Modal title="Operating Hours" setModalState={() => setModalType(null)}>
              <div className="p-4 text-white">
                <ul>
                  {station.operatingHours && Object.entries(station.operatingHours).map(([day, hours]: any) => (
                    <li key={day}>{day}: {hours.open || '--'} - {hours.close || '--'} {hours.closed ? '(Closed)' : ''}</li>
                  ))}
                </ul>
              </div>
            </Modal>
          )}
        </div>
      ) : <div className="text-center text-white">No data found.</div>}
    </Modal>
  );
};

export default ViewPickupStation; 