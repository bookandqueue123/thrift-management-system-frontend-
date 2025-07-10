"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/api/hooks/useAuth';
import TransactionsTable from '@/components/Tables';
import Modal from '@/components/Modal';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import ViewPickupStation from '@/components/ViewPickupStation';
import EditPickupStation from '@/components/EditPickupStation';

const PickUpStationForm = dynamic(() => import('../form/PickUp-Station'), { ssr: false });

interface PickUpStation {
  _id: string;
  id?: string;
  name: string;
  code: string;
  address: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  coordinates?: {
    latitude?: number | string;
    longitude?: number | string;
  };
  contact?: {
    phone?: string;
    email?: string;
  };
  operatingHours?: {
    [key: string]: {
      open?: string;
      close?: string;
      closed?: boolean;
    };
  };
  capacity?: {
    maxOrders?: number | null;
    currentOrders?: number | null;
  };
  manager?: {
    name?: string;
    phone?: string;
    email?: string;
    pictures?: string[];
    fullName?: string;
  };
  facilities?: string[];
  status?: string;
  isAvailable?: boolean;
  stationPictureUrl?: string;
  googleMapLink?: string;
  landmarkArea?: string;
  createdAt?: string;
  updatedAt?: string;
  fullAddress?: string;
  amount?: {
    value: number;
    currency: string;
  };
}

type StationsResponse = {
  data: PickUpStation[];
  pagination?: {
    currentPage: number;
  totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
};

const PAGE_SIZE = 10;

const STATUS_OPTIONS = [
  { label: 'All statuses', value: '' },
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Maintenance', value: 'maintenance' },
  { label: 'Temporary Closed', value: 'temporarily_closed' },
];

const GetPickStation = () => {
  const { client } = useAuth();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedStation, setSelectedStation] = useState<PickUpStation | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [city, setCity] = useState('');
  const [available, setAvailable] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [showStatusFilterModal, setShowStatusFilterModal] = useState(false);
  const [statusStations, setStatusStations] = useState<PickUpStation[]>([]);

  const [showAvailableModal, setShowAvailableModal] = useState(false);
  const [availableStations, setAvailableStations] = useState<PickUpStation[]>([]);

  const [showNearbyModal, setShowNearbyModal] = useState(false);
  const [nearbyStations, setNearbyStations] = useState<PickUpStation[]>([]);
  const [nearbyParams, setNearbyParams] = useState({ latitude: '', longitude: '', maxDistance: '5' });

  const [dropdownOpen, setDropdownOpen] = useState<number | null>(null);
  const [deleteStationId, setDeleteStationId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState('');

  // Fetch all pick up stations
  const { data, isLoading, refetch } = useQuery<StationsResponse>({
    queryKey: ['pickup-stations', city, available, currentPage, searchQuery],
    queryFn: async () => {
      let url = `/api/pickup-stations?limit=${PAGE_SIZE}&page=${currentPage}`;
      if (city) url += `&city=${encodeURIComponent(city)}`;
      if (available) url += `&available=true`;
      if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;
      const res = await client.get(url);
      return res.data;
    },
  });

  // Table headers
  const headers = [
    'S/N',
    'Name',
    'Code',
    'Amount',
    'Address',
    'Contact',
    'Manager',
    'Capacity',
    'Status',
    'Coordinates',
    'Facilities',
    'Operating Hours',
    'Actions',
  ];

  // Table content
  const paginatedStations = data?.data || [];
  const totalPages = data?.pagination?.totalPages || 1;

  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [viewStationId, setViewStationId] = useState<string | null>(null);
  const [editStationId, setEditStationId] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deleteStationId) return;
    setDeleteLoading(true);
    setDeleteMessage('');
    try {
      await client.delete(`/api/pickup-stations/${deleteStationId}`);
      setDeleteMessage('Pick up station deleted successfully!');
      setTimeout(() => {
        setDeleteStationId(null);
        setDeleteMessage('');
        refetch();
      }, 1000);
    } catch (error: any) {
      setDeleteMessage(error?.message || 'Error deleting station');
    } finally {
      setDeleteLoading(false);
    }
  };

  const content = isLoading ? (
    <tr><td colSpan={headers.length} className="text-center text-white">Loading pick up stations...</td></tr>
  ) : paginatedStations.length > 0 ? (
    paginatedStations.map((station, idx) => (
      <tr key={station._id || station.id} className="hover:bg-gray-800">
        <td className="px-6 py-4 whitespace-nowrap">{(currentPage - 1) * PAGE_SIZE + idx + 1}</td>
        <td className="px-6 py-4 whitespace-nowrap">{station.name}</td>
        <td className="px-6 py-4 whitespace-nowrap">{station.code}</td>
        {/* Amount column */}
        <td className="px-6 py-4 whitespace-nowrap">
          {station.amount ? `${station.amount.value} ${station.amount.currency}` : '--'}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <button className="btn btn-xs btn-info" onClick={() => { setSelectedStation(station); setModalType('address'); setShowModal(true); setDropdownOpen(null); }}>Address</button>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <button className="btn btn-xs btn-info" onClick={() => { setSelectedStation(station); setModalType('contact'); setShowModal(true); setDropdownOpen(null); }}>Contact</button>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <button className="btn btn-xs btn-info" onClick={() => { setSelectedStation(station); setModalType('manager'); setShowModal(true); setDropdownOpen(null); }}>Manager</button>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <button className="btn btn-xs btn-info" onClick={() => { setSelectedStation(station); setModalType('capacity'); setShowModal(true); setDropdownOpen(null); }}>Capacity</button>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <button className="btn btn-xs btn-info" onClick={() => { setSelectedStation(station); setModalType('status'); setShowModal(true); setDropdownOpen(null); }}>View</button>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <button className="btn btn-xs btn-info" onClick={() => { setSelectedStation(station); setModalType('coordinates'); setShowModal(true); setDropdownOpen(null); }}>View</button>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <button className="btn btn-xs btn-info" onClick={() => { setSelectedStation(station); setModalType('facilities'); setShowModal(true); setDropdownOpen(null); }}>View</button>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <button className="btn btn-xs btn-info" onClick={() => { setSelectedStation(station); setModalType('operatingHours'); setShowModal(true); setDropdownOpen(null); }}>View</button>
        </td>
        <td className="px-6 py-4 whitespace-nowrap flex gap-2">
          <div className="relative">
            <button className="btn btn-xs btn-accent" onClick={() => setDropdownOpen(dropdownOpen === idx ? null : idx)}>Actions ▼</button>
            {dropdownOpen === idx && (
              <div className="absolute z-10 bg-[#3b3652] text-white rounded shadow-lg mt-2 min-w-[180px]">
                <button className="block w-full text-left px-4 py-2 hover:bg-[#221c3e]" onClick={() => { setViewStationId(station._id ?? station.id ?? null); setDropdownOpen(null); }}>View Pick Up Station</button>
                <button className="block w-full text-left px-4 py-2 hover:bg-[#221c3e]" onClick={() => { setEditStationId(station._id ?? station.id ?? null); setDropdownOpen(null); }}>Edit Pick Up Station</button>
                <button className="block w-full text-left px-4 py-2 hover:bg-red-600" onClick={() => { setDeleteStationId(station._id ?? station.id ?? null); setDropdownOpen(null); }}>Delete Pick Up Station</button>
              </div>
            )}
          </div>
        </td>
      </tr>
    ))
  ) : (
    <tr><td colSpan={headers.length} className="text-center text-white">No pick up stations found.</td></tr>
  );

  // Fetch stations by status
  const fetchStatusStations = async (status: string) => {
    if (!status) return;
    try {
      // This assumes you want to fetch all stations and filter by status
      // If you have a bulk status endpoint, adjust accordingly
      let url = `/api/pickup-stations?status=${status}`;
      const res = await client.get(url);
      setStatusStations(res.data.stations || []);
    } catch (e) {
      setStatusStations([]);
    }
  };

  // Fetch available stations
  const fetchAvailableStations = async () => {
    try {
      let url = `/api/pickup-stations/available`;
      if (city) url += `?city=${encodeURIComponent(city)}`;
      const res = await client.get(url);
      setAvailableStations(res.data.data || []);
    } catch (e) {
      setAvailableStations([]);
    }
  };

  // Fetch nearby stations
  const fetchNearbyStations = async () => {
    try {
      const { latitude, longitude, maxDistance } = nearbyParams;
      if (!latitude || !longitude) return;
      let url = `/api/pickup-stations/nearby?latitude=${latitude}&longitude=${longitude}&maxDistance=${maxDistance}`;
      const res = await client.get(url);
      setNearbyStations(res.data.stations || []);
    } catch (e) {
      setNearbyStations([]);
    }
  };

  return (
    <>
      <div className="container mx-auto max-w-7xl px-4 py-2 md:px-6 md:py-8 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-ajo_offWhite">Pick Up Stations</h2>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => setShowCreateModal(true)}
          >
            Create Pick Up Station
          </button>
        </div>
        {/* Filter Dropdowns */}
        <div className="mb-4 flex flex-wrap gap-4 items-center">
          <div>
            <label className="block text-xs font-semibold mb-1 text-white">Filter by status</label>
            <select
              value={statusFilter}
              onChange={e => {
                setStatusFilter(e.target.value);
                if (e.target.value) {
                  fetchStatusStations(e.target.value);
                  setShowStatusFilterModal(true);
                }
              }}
              className="rounded-2xl border px-3 py-2 text-white bg-[#221c3e]"
            >
              {STATUS_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2 w-full sm:w-auto sm:flex-row sm:gap-4">
            <div className="flex-1">
              <label className="block text-xs font-semibold mb-1 text-white">Available Only</label>
              <button
                className="rounded-2xl border px-3 py-2 text-black bg-white w-full h-12 sm:w-40 sm:h-12"
                onClick={() => {
                  fetchAvailableStations();
                  setShowAvailableModal(true);
                }}
              >
                Show Available
              </button>
            </div>
            <div className="flex-1">
              <label className="block text-xs font-semibold mb-1 text-white">Nearby</label>
              <button
                className="rounded-2xl border px-3 py-2 text-black bg-white w-full h-12 sm:w-40 sm:h-12"
                onClick={() => setShowNearbyModal(true)}
              >
                Find Nearby
              </button>
            </div>
          </div>
        </div>
        <div className="mt-8">
          <TransactionsTable
            headers={headers}
            content={content}
          />
        </div>
        {/* Pagination below the container */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-4">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 border rounded ${
                  currentPage === page
                    ? 'bg-orange-500 text-white border-orange-500'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
      {/* Modal for create */}
      {showCreateModal && (
        <Modal title="Create Pick Up Station" setModalState={setShowCreateModal}>
          <PickUpStationForm
            onSuccess={() => {
              setShowCreateModal(false);
              refetch();
            }}
          />
        </Modal>
      )}
      {/* Modals for each field */}
      {showModal && selectedStation && modalType === 'address' && (
        <Modal title="Address" setModalState={setShowModal}>
          <div className="p-4 text-white">
            <div><b>Street:</b> {selectedStation.address?.street}</div>
            <div><b>City:</b> {selectedStation.address?.city}</div>
            <div><b>State:</b> {selectedStation.address?.state}</div>
            <div><b>Zip Code:</b> {selectedStation.address?.zipCode}</div>
            <div><b>Country:</b> {selectedStation.address?.country}</div>
          </div>
        </Modal>
      )}
      {showModal && selectedStation && modalType === 'contact' && (
        <Modal title="Contact" setModalState={setShowModal}>
          <div className="p-4 text-white">
            <div><b>Phone:</b> {selectedStation.contact?.phone}</div>
            <div><b>Email:</b> {selectedStation.contact?.email}</div>
          </div>
        </Modal>
      )}
      {showModal && selectedStation && modalType === 'manager' && (
        <Modal title="Manager" setModalState={setShowModal}>
          <div className="p-4 text-white">
            <div><b>Name:</b> {selectedStation.manager?.fullName || selectedStation.manager?.name}</div>
            <div><b>Phone:</b> {selectedStation.manager?.phone}</div>
            <div><b>Email:</b> {selectedStation.manager?.email}</div>
            {selectedStation.manager?.pictures && selectedStation.manager.pictures.length > 0 && (
              <div>
                <b>Pictures:</b><br />
                {selectedStation.manager.pictures.map((url: string, i: number) => (
                  <img key={i} src={url} alt="Manager" className="w-20 h-20 object-cover rounded inline-block mr-2 mt-1" />
                ))}
              </div>
            )}
          </div>
        </Modal>
      )}
      {showModal && selectedStation && modalType === 'capacity' && (
        <Modal title="Capacity" setModalState={setShowModal}>
          <div className="p-4 text-white">
            <div><b>Max Orders:</b> {selectedStation.capacity?.maxOrders}</div>
            <div><b>Current Orders:</b> {selectedStation.capacity?.currentOrders}</div>
          </div>
        </Modal>
      )}
      {showModal && selectedStation && modalType === 'status' && (
        <Modal title="Status" setModalState={setShowModal}>
          <div className="p-4 text-white">
            <div><b>Status:</b> {selectedStation.status}</div>
            <div><b>Is Available:</b> {selectedStation.isAvailable ? 'Yes' : 'No'}</div>
          </div>
        </Modal>
      )}
      {showModal && selectedStation && modalType === 'coordinates' && (
        <Modal title="Coordinates" setModalState={setShowModal}>
          <div className="p-4 text-white">
            <div><b>Latitude:</b> {selectedStation.coordinates?.latitude}</div>
            <div><b>Longitude:</b> {selectedStation.coordinates?.longitude}</div>
          </div>
        </Modal>
      )}
      {showModal && selectedStation && modalType === 'facilities' && (
        <Modal title="Facilities" setModalState={setShowModal}>
          <div className="p-4 text-white">
            <div>{selectedStation.facilities?.join(', ')}</div>
          </div>
        </Modal>
      )}
      {showModal && selectedStation && modalType === 'operatingHours' && (
        <Modal title="Operating Hours" setModalState={setShowModal}>
          <div className="p-4 text-white">
            <ul>
              {selectedStation.operatingHours && Object.entries(selectedStation.operatingHours).map(([day, hours]) => (
                <li key={day}>{day}: {hours.open || '--'} - {hours.close || '--'} {hours.closed ? '(Closed)' : ''}</li>
              ))}
            </ul>
          </div>
        </Modal>
      )}
      {/* View and Edit Pickup Station Modals */}
      {viewStationId && (
        <ViewPickupStation stationId={viewStationId} open={!!viewStationId} onClose={() => setViewStationId(null)} />
      )}
      {editStationId && (
        <EditPickupStation stationId={editStationId} open={!!editStationId} onClose={() => setEditStationId(null)} />
      )}
      {/* Modal for status filter */}
      {showStatusFilterModal && (
        <Modal title="Filter by Status" setModalState={setShowStatusFilterModal}>
          <div className="p-4">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {statusStations.length > 0 ? statusStations.map(station => (
                  <tr key={station._id}>
                    <td className="px-6 py-4 whitespace-nowrap">{station.status || ''}</td>
                  </tr>
                )) : (
                  <tr><td className="text-center">No stations found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </Modal>
      )}
      {/* Modal for available stations */}
      {showAvailableModal && (
        <Modal title="Available Pick Up Stations" setModalState={setShowAvailableModal}>
          <div className="p-4">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                </tr>
              </thead>
              <tbody>
                {availableStations.length > 0 ? availableStations.map(station => (
                  <tr key={station._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-white">
                      {station.address ? (
                        <div>
                          <div><b>Street:</b> {station.address.street}</div>
                          <div><b>City:</b> {station.address.city}</div>
                          <div><b>State:</b> {station.address.state}</div>
                          <div><b>Zip Code:</b> {station.address.zipCode}</div>
                          <div><b>Country:</b> {station.address.country}</div>
                        </div>
                      ) : (
                        station.fullAddress || ''
                      )}
                    </td>
                  </tr>
                )) : <tr><td className="text-center text-white">No available stations found.</td></tr>}
              </tbody>
            </table>
          </div>
        </Modal>
      )}
      {/* Modal for nearby stations */}
      {showNearbyModal && (
        <Modal title="Nearby Pick Up Stations" setModalState={setShowNearbyModal}>
          <div className="p-4 space-y-4">
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Latitude"
                value={nearbyParams.latitude}
                onChange={e => setNearbyParams(p => ({ ...p, latitude: e.target.value }))}
                className="border px-2 py-1 rounded"
              />
              <input
                type="text"
                placeholder="Longitude"
                value={nearbyParams.longitude}
                onChange={e => setNearbyParams(p => ({ ...p, longitude: e.target.value }))}
                className="border px-2 py-1 rounded"
              />
              <input
                type="number"
                placeholder="Max Distance (km)"
                value={nearbyParams.maxDistance}
                onChange={e => setNearbyParams(p => ({ ...p, maxDistance: e.target.value }))}
                className="border px-2 py-1 rounded"
              />
              <button
                className="bg-blue-500 text-white px-3 py-1 rounded"
                onClick={fetchNearbyStations}
              >
                Search
              </button>
            </div>
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {nearbyStations.length > 0 ? nearbyStations.map(station => (
                  <tr key={station._id}>
                    <td className="px-6 py-4 whitespace-nowrap">{station.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{station.address?.city || ''}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{station.status || ''}</td>
                  </tr>
                )) : <tr><td colSpan={3} className="text-center">No stations found.</td></tr>}
              </tbody>
            </table>
          </div>
        </Modal>
      )}
      {/* Delete Confirmation Modal */}
      {deleteStationId && (
        <Modal title="Delete Pick Up Station" setModalState={() => setDeleteStationId(null)}>
          <div className="p-4 text-white">
            <p>Are you sure you want to delete this pick up station?</p>
            <div className="flex gap-4 mt-4">
              <button className="bg-red-600 px-4 py-2 rounded" onClick={handleDelete} disabled={deleteLoading}>
                {deleteLoading ? 'Deleting...' : 'Delete'}
              </button>
              <button className="bg-gray-400 px-4 py-2 rounded" onClick={() => setDeleteStationId(null)}>Cancel</button>
            </div>
            {deleteMessage && <div className="mt-2 text-green-300">{deleteMessage}</div>}
          </div>
        </Modal>
      )}
    </>
  );
};

export default GetPickStation;