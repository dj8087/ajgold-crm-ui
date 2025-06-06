import React from 'react';
import { LogOut, Settings, Bell, Search, RefreshCw } from 'lucide-react';
import { useEventContext } from '../context/EventContext';
import { useMessageContext } from '../context/MessageContext';

interface HeaderProps {
  operatorName: string;
  unreadNotifications: number;
  onRefreshTargets?: () => void; // Add optional prop
}

const Header: React.FC<HeaderProps> = ({ operatorName, unreadNotifications, onRefreshTargets }) => {

   const { triggerEvent } = useEventContext();
  const handleRefresh = () => {
    triggerEvent('refreshTargets', null); // Trigger the refresh event
    console.log('Refresh clicked');
    if (onRefreshTargets) {
      onRefreshTargets();
    }
  };

  return (
    <header className="bg-slate-800 text-white">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left side: Title and Search */}
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold">Customer Support Portal</h1>
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search customers..."
                className="pl-10 pr-4 py-1.5 bg-slate-700 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 placeholder-slate-400 w-64"
              />
            </div>
          </div>

          {/* Right side: Refresh, Notification, User, Settings, Logout */}
          <div className="flex items-center space-x-4">
            {/* Refresh Button */}
            <button
              className="p-2 hover:bg-slate-700 rounded-full"
              title="Refresh"
              onClick={handleRefresh}
            >
              <RefreshCw size={20} />
            </button>
            {/* Notification */}
            <div className="relative">
              <Bell size={20} className="text-slate-300 hover:text-white cursor-pointer" />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {unreadNotifications}
                </span>
              )}
            </div>
            {/* User Info */}
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium">{operatorName}</p>
                <p className="text-xs text-slate-400">Support Operator</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-slate-600 flex items-center justify-center text-sm font-medium">
                {operatorName.split(' ').map(n => n[0]).join('')}
              </div>
            </div>
            {/* Settings and Logout */}
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-slate-700 rounded-full" title="Settings">
                <Settings size={20} />
              </button>
              <button className="p-2 hover:bg-slate-700 rounded-full" title="Logout">
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;