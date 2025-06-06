import React, { useState } from 'react';
import { Customer } from '../types';
import { Phone, Mail, MapPin, Calendar } from 'lucide-react';

interface CustomerHeaderProps {
  customer: Customer;
}

const CustomerHeader: React.FC<CustomerHeaderProps> = ({ customer }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleNextTaskClick = () => {
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    setShowConfirm(false);
    // Add logic to skip and load next task here
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="relative w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mr-4 text-slate-700 text-xl font-bold">
              {customer.name.split(' ').map(part => part[0]).join('')}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">{customer.name}</h1>
              <p className="text-slate-500">{customer.id}</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-6">
            <button className="inline-flex items-center px-3 py-1.5 border border-slate-300 shadow-sm text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500">
              <Phone size={16} className="mr-2 text-slate-600" />
              Call
            </button>
            <button
              className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-slate-700 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
              onClick={handleNextTaskClick}
            >
              Next Task
            </button>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Phone Numbers</h3>
            <div className="space-y-2">
              {customer.contacts && customer.contacts.length > 0 ? (
                customer.contacts.map(contact => (
                  <div className="flex items-center group" key={contact.mobileNumber}>
                    <Phone size={16} className="text-blue-600 mr-2" />
                    <div>
                      <p className="text-gray-800 font-medium">{contact.mobileNumber}</p>
                      <p className="text-xs text-gray-500">{contact.name}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-gray-500">No phone numbers available</div>
              )}
            </div>
          </div>

          <div className="flex items-center text-slate-600">
            <MapPin size={16} className="mr-2 text-slate-400" />
            <span>{customer.address}</span>
          </div>
          
          <div className="flex items-center text-slate-600">
            <Calendar size={16} className="mr-2 text-slate-400" />
            <span>Customer since: {customer.customerSince}</span>
          </div>
        </div>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-[32rem] text-center border border-slate-200">
            <h2 className="text-lg font-semibold mb-4 text-slate-700">
              Do you want to skip this task and take next?
            </h2>
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={handleConfirm}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition"
              >
                Yes
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-semibold border border-slate-300 shadow hover:bg-slate-200 transition"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerHeader;