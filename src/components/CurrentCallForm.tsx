import React, { useState } from 'react';
import { Call, CallStatus } from '../types';
import { Phone, Save } from 'lucide-react';
import { completeCallTask, CompleteTaskRequest } from '../services/apiService';
import { useEventContext } from '../context/EventContext';
import { useMessageContext } from '../context/MessageContext';

interface CurrentCallFormProps {
  taskId: number;
  previousCall: Call | null;
}

const departments = [
  { id: 1, name: 'CRM' },
  { id: 2, name: 'Production' },
  { id: 3, name: 'Account' },
  { id: 4, name: 'Sales' }
];

const CurrentCallForm: React.FC<CurrentCallFormProps> = ({ taskId, previousCall }) => {


  const { workingCallPurpose } = useMessageContext();

  const { triggerEvent } = useEventContext();
  
  const [notes, setNotes] = useState('');
  const [nextActions, setNextActions] = useState('');
  const [outcomes, setOutcomes] = useState('');
  const [callStatus, setCallStatus] = useState<string>('');
  const [duration, setDuration] = useState<number | ''>('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [followUpTime, setFollowUpTime] = useState('');
  const [followUpRequired, setFollowUpRequired] = useState(false);
  const [followUpDeptId, setFollowUpDeptId] = useState<number | undefined>(undefined);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPopup, setShowPopup] = useState(false);

  const notReachableOrMissed = callStatus === 'NOT_REACHABLE' || callStatus === 'MISSED';
  const followUpStatuses = callStatus === 'FOLLOWUP_REQUIRED' || callStatus === 'REQUESTED_CALLBACK';

  React.useEffect(() => {
    //console log
    console.log('Call status changed:', callStatus);
    if (notReachableOrMissed) {
      setFollowUpRequired(true);
    } else if (followUpStatuses) {
      setFollowUpRequired(true);
    }
    //log followUpRequired
    console.log('Follow up required:', followUpRequired);
  }, [callStatus]);

  const validate = () => {
    // No validation required if Not reachable or Missed
    const newErrors: { [key: string]: string } = {};
    if (notReachableOrMissed) {
      if (!followUpDate) newErrors.followUpDate = 'Please select follow-up date';
      if (!followUpTime) newErrors.followUpTime = 'Please select follow-up time';
      if (!followUpDeptId) newErrors.followUpDeptId = 'Please select department';
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    }
    if (!callStatus) newErrors.callStatus = 'Please select call status';
    if (duration === '' || Number(duration) <= 0) newErrors.duration = 'Please enter duration in minutes';
    if (!notes.trim()) newErrors.notes = 'Please enter call notes';
    if (!outcomes.trim()) newErrors.outcomes = 'Please enter call outcomes';
    if (!nextActions.trim()) newErrors.nextActions = 'Please enter next actions';
    if (followUpRequired) {
      if (!followUpDate) newErrors.followUpDate = 'Please select follow-up date';
      if (!followUpTime) newErrors.followUpTime = 'Please select follow-up time';
      if (!followUpDeptId) newErrors.followUpDeptId = 'Please select department';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    console.log('Follow up required:', followUpRequired);
    e.preventDefault();
    if (!validate()) return;

    let followUpDateTime = '';
    if (followUpRequired && followUpDate && followUpTime) {
      followUpDateTime = `${followUpDate}T${followUpTime}`;
    }

    const payload: CompleteTaskRequest = {
      taskId: taskId,
      status: callStatus,
      duration: Number(duration),
      operatorNotes: notes,
      outcomes: outcomes,
      nextActions: nextActions,
      followUpDateTime: followUpRequired ? followUpDateTime : '',
      followUpDepartmentId: followUpRequired ? followUpDeptId : undefined
    };
    try {
      await completeCallTask(payload);
      triggerEvent('refreshTargets', null);
      setShowPopup(true); // Show popup on success
    } catch (error) {
      alert('Failed to save call record!');
      console.error(error);
    }
  };

  const handleNextTask = () => {
    setShowPopup(false);
    triggerEvent('clearCustomerDetails', null);
    triggerEvent('loadNextTaskWithHistory', workingCallPurpose);
  };

  const handleDashboard = () => {
    setShowPopup(false);
    // Add your logic to navigate to dashboard here
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-slate-800">Current Call ({workingCallPurpose})</h2>
        <div className="flex items-center px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm">
          <Phone size={16} className="mr-1" />
          <span>Active Call</span>
        </div>
      </div>

      {previousCall && (
        <div className="mb-4 p-3 bg-sky-50 rounded-lg border border-sky-100">
          <h3 className="text-sm font-medium text-sky-800 mb-1">Previous Call Summary</h3>
          <p className="text-sm text-sky-700">
            {previousCall.purpose} ({new Date(previousCall.completedDate).toLocaleDateString()})
          </p>
          {previousCall.nextActions && previousCall.nextActions.length > 0 && (
            <div className="mt-1 text-xs text-sky-700">
              <span className="font-medium">Follow up: </span>
              {previousCall.nextActions[0]}
              {previousCall.nextActions.length > 1 && '...'}
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="callStatus" className="block text-sm font-medium text-slate-700 mb-1">
              Call Status
            </label>
            <select
              id="callStatus"
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500"
              value={callStatus}
              onChange={(e) => setCallStatus(e.target.value)}
            >
              <option value="">Select...</option>
              {Object.keys(CallStatus).map((key) => (
                <option key={key} value={key}>
                  {CallStatus[key as keyof typeof CallStatus]}
                </option>
              ))}
            </select>
            {errors.callStatus && <p className="text-red-500 text-xs mt-1">{errors.callStatus}</p>}
          </div>

          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-slate-700 mb-1">
              Duration (minutes)
            </label>
            <input
              type="number"
              id="duration"
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500"
              value={duration}
              min={0}
              onChange={(e) => setDuration(e.target.value === '' ? '' : Number(e.target.value))}
              disabled={notReachableOrMissed}
            />
            {errors.duration && <p className="text-red-500 text-xs mt-1">{errors.duration}</p>}
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-slate-700 mb-1">
              Call Notes
            </label>
            <textarea
              id="notes"
              rows={4}
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500"
              placeholder="Enter detailed notes about the call..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={notReachableOrMissed}
            ></textarea>
            {errors.notes && <p className="text-red-500 text-xs mt-1">{errors.notes}</p>}
          </div>

          <div>
            <label htmlFor="outcomes" className="block text-sm font-medium text-slate-700 mb-1">
              Call Outcomes
            </label>
            <textarea
              id="outcomes"
              rows={2}
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500"
              placeholder="Enter one outcome per line..."
              value={outcomes}
              onChange={(e) => setOutcomes(e.target.value)}
              disabled={notReachableOrMissed}
            ></textarea>
            <p className="mt-1 text-xs text-slate-500">Enter each outcome on a new line</p>
            {errors.outcomes && <p className="text-red-500 text-xs mt-1">{errors.outcomes}</p>}
          </div>

          <div>
            <label htmlFor="nextActions" className="block text-sm font-medium text-slate-700 mb-1">
              Next Actions
            </label>
            <textarea
              id="nextActions"
              rows={2}
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500"
              placeholder="Enter one action per line..."
              value={nextActions}
              onChange={(e) => setNextActions(e.target.value)}
              disabled={notReachableOrMissed}
            ></textarea>
            <p className="mt-1 text-xs text-slate-500">Enter each action on a new line</p>
            {errors.nextActions && <p className="text-red-500 text-xs mt-1">{errors.nextActions}</p>}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="followUpRequired"
              checked={followUpRequired}
              onChange={e => setFollowUpRequired(e.target.checked)}
              className="h-4 w-4 text-slate-600 border-gray-300 rounded"
              disabled={notReachableOrMissed || followUpStatuses}
            />
            <label htmlFor="followUpRequired" className="text-sm font-medium text-slate-700">
              Follow up Required?
            </label>
          </div>

          {followUpRequired && (
            <>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label htmlFor="followUpDate" className="block text-sm font-medium text-slate-700 mb-1">
                    Follow-up Date
                  </label>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    id="followUpDate"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                  />
                  {errors.followUpDate && <p className="text-red-500 text-xs mt-1">{errors.followUpDate}</p>}
                </div>
                <div className="flex-1">
                  <label htmlFor="followUpTime" className="block text-sm font-medium text-slate-700 mb-1">
                    Follow-up Time
                  </label>
                  <input
                    type="time"
                    id="followUpTime"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500"
                    value={followUpTime}
                    onChange={(e) => setFollowUpTime(e.target.value)}
                  />
                  {errors.followUpTime && <p className="text-red-500 text-xs mt-1">{errors.followUpTime}</p>}
                </div>
              </div>
              <div>
                <label htmlFor="followUpDeptId" className="block text-sm font-medium text-slate-700 mb-1">
                  Department
                </label>
                <select
                  id="followUpDeptId"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500"
                  value={followUpDeptId}
                  onChange={(e) => setFollowUpDeptId(Number(e.target.value))}
                >
                  <option value="">Select...</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
                {errors.followUpDeptId && <p className="text-red-500 text-xs mt-1">{errors.followUpDeptId}</p>}
              </div>
            </>
          )}

          <div className="pt-2">
            <button
              type="submit"
              className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-slate-700 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
            >
              <Save size={18} className="mr-2" />
              Save Call Record
            </button>
          </div>
        </div>
      </form>

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-80 text-center border border-slate-200">
            <h2 className="text-lg font-semibold mb-4 text-slate-700">Call record saved!</h2>
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={handleNextTask}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition"
              >
                Next Task
              </button>
              <button
                onClick={handleDashboard}
                className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-semibold border border-slate-300 shadow hover:bg-slate-200 transition"
              >
                Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrentCallForm;