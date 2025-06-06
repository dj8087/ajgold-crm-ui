import React, { useEffect, useState } from 'react';
import { Phone, DollarSign, Bell, Users, CalendarCheck } from 'lucide-react';
import { TargetCardProps, TargetCards } from '../types';
import { fetchTodayTargets } from '../services/apiService';
import { useEventContext } from "../context/EventContext";
import { useMessageContext } from '../context/MessageContext';

// Updated icon map and keys to match new field names
const iconMap: Record<string, React.ReactNode> = {
  SALES_FEEDBACK: <Phone size={24} />,
  PAYMENT_RECOVERY: <DollarSign size={24} />,
  INTIMATION: <Bell size={24} />,
  CRM: <Users size={24} />,
  TODAYS_FOLLOWUP: <CalendarCheck size={24} />
};

//create color map as same as iconMap
const colorMap: Record<string, string> = {
  SALES_FEEDBACK: 'border-emerald-500',
  PAYMENT_RECOVERY: 'border-rose-500',
  INTIMATION: 'border-amber-500',
  CRM: 'border-sky-500',
  TODAYS_FOLLOWUP: 'border-violet-500'
};


const TargetCardUi: React.FC<TargetCardProps> = ({ title, target, completed, icon, color,  onCardClick}) => {
  
  return (
  <div style={{ cursor: target === completed ?  'default' : 'pointer' }} onClick={target === completed ? undefined : () => onCardClick(title)} className={`bg-white rounded-lg shadow-sm p-4 border-l-4 ${color}`}>
    <div className="flex justify-between items-start">
      <div>
        <h3 className="text-sm font-medium text-slate-600">{title}</h3>
        <div className="mt-2">
          <span className="text-2xl font-bold text-slate-800">{completed}</span>
          <span className="text-slate-500 text-sm ml-1">/ {target}</span>
        </div>
      </div>
      <div className={`${color.replace('border', 'text')} opacity-80`}>
        {icon}
      </div>
    </div>
    <div className="mt-3">
      <div className="w-full bg-slate-100 rounded-full h-2">
        <div 
          className={`${color.replace('border', 'bg')} h-2 rounded-full`}
          style={{ width: `${Math.min((completed / target) * 100, 100)}%` }}
        ></div>
      </div>
    </div>
  </div>
);
};


const TargetCardsUi = ({}) => {
  const { registerEvent, triggerEvent } = useEventContext();
  const { updateWorkingCallPurpose } = useMessageContext();
  // 
  useEffect(() => {
    registerEvent("refreshTargets", () => fetchTargets());
  }, [registerEvent]);

  const loadNextTaskWithHistory = (title: string) => {
    console.log(`Loading next task for: ${title}`);
    updateWorkingCallPurpose(title);
    triggerEvent('loadNextTaskWithHistory', title);
  }
  
  const [targets, setTargets] = useState<TargetCardProps[]>([]);
  
  const fetchTargets = async () => {
    const data = await fetchTodayTargets();
    // Use the new keys for icon mapping
    const targetsWithIcons: TargetCardProps[] = data.map(target => ({
        ...target,
        icon: iconMap[target.title] || <Phone size={24} />
        // Use the new color map for border colors
        , color: colorMap[target.title] || 'border-gray-300'
        , onCardClick: loadNextTaskWithHistory || (() => {})
      }));
    setTargets(targetsWithIcons);
  };

  useEffect(() => {
    fetchTargets();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {targets.map((target) => (
        <TargetCardUi key={target.title} {...target} />
      ))}
    </div>
  );
};

export default TargetCardsUi;