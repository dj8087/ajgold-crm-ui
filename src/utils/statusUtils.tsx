import React from 'react';
import { CallStatus } from '../types';
import { PhoneIncoming, PhoneOff, PhoneMissed, Voicemail as VoiceMail, PhoneForwarded, Phone, Calendar, XCircle } from 'lucide-react';

export const getStatusIcon = (status: CallStatus) => {
  switch (status) {
    case CallStatus.RECEIVED:
      return PhoneIncoming;
    case CallStatus.NOT_REACHABLE:
      return PhoneOff;
    case CallStatus.VOICEMAIL:
      return VoiceMail;
    case CallStatus.MISSED:
      return PhoneMissed;
    case CallStatus.COMPLETED:
      return PhoneForwarded;
    case CallStatus.ONGOING:
      return Phone;
    case CallStatus.SCHEDULED:
      return Calendar;
    case CallStatus.CANCELLED:
      return XCircle;
    default:
      return Phone;
  }
};

export const getStatusColor = (status: CallStatus): { border: string, background: string, text: string } => {
  switch (status) {
    case CallStatus.RECEIVED:
      return {
        border: 'border-emerald-600',
        background: 'rgba(6, 78, 59, 0.1)',
        text: 'text-emerald-700'
      };
    case CallStatus.NOT_REACHABLE:
      return {
        border: 'border-rose-600',
        background: 'rgba(159, 18, 57, 0.1)',
        text: 'text-rose-700'
      };
    case CallStatus.VOICEMAIL:
      return {
        border: 'border-sky-600',
        background: 'rgba(3, 105, 161, 0.1)',
        text: 'text-sky-700'
      };
    case CallStatus.MISSED:
      return {
        border: 'border-amber-600',
        background: 'rgba(146, 64, 14, 0.1)',
        text: 'text-amber-700'
      };
    case CallStatus.COMPLETED:
      return {
        border: 'border-emerald-600',
        background: 'rgba(6, 78, 59, 0.1)',
        text: 'text-emerald-700'
      };
    case CallStatus.ONGOING:
      return {
        border: 'border-violet-600',
        background: 'rgba(109, 40, 217, 0.1)',
        text: 'text-violet-700'
      };
    case CallStatus.SCHEDULED:
      return {
        border: 'border-indigo-600',
        background: 'rgba(79, 70, 229, 0.1)',
        text: 'text-indigo-700'
      };
    case CallStatus.CANCELLED:
      return {
        border: 'border-slate-600',
        background: 'rgba(71, 85, 105, 0.1)',
        text: 'text-slate-700'
      };
    default:
      return {
        border: 'border-slate-600',
        background: 'rgba(71, 85, 105, 0.1)',
        text: 'text-slate-700'
      };
  }
};