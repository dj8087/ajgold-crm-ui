import React, { useEffect, useState } from 'react';
import CallTimeline from './CallTimeline';
import CurrentCallForm from './CurrentCallForm';
import CustomerHeader from './CustomerHeader';
import TargetCardsUi from './TargetCards';
import { NextTaskResponse } from '../types';
import { useEventContext } from '../context/EventContext';
import { fetchNextTask } from '../services/apiService';
import { useMessageContext } from '../context/MessageContext';

// Dummy data for initial state
const nextTaskResponseDummy: NextTaskResponse = {
    taskId:0,
    customer: {
      id: "",
      name: "",
      email: "",
      contacts: [],
      address: "",
      status: "Active",
      accountType: "",
      customerSince: ""
    },
    callHistory: []
  };

const CallHistoryPage  = () => {

  const [nextCallTask, setCallNextTask] = useState<NextTaskResponse>(nextTaskResponseDummy);
  const { workingCallPurpose } = useMessageContext();
  const { registerEvent } = useEventContext();
  useEffect(() => {
      registerEvent("loadNextTaskWithHistory", (purpose: string | null) => {
        loadNextTaskWithHistory(purpose);
      });

      registerEvent("clearCustomerDetails", () => {
        console.log("clearCustomerDetails event triggered");
        setCallNextTask(nextTaskResponseDummy);
      });

      



    }, [registerEvent]);

  
  
  const loadNextTaskWithHistory = async (purpose: string | null) => {
    //log purpose and workingCallPurpose
    console.log("loadNextTaskWithHistory called with purpose:", purpose, "and workingCallPurpose:", workingCallPurpose);
    if (!purpose) {
      setCallNextTask(nextTaskResponseDummy);
      loadNextWorkingTask();
      return;
    }
    const data = await fetchNextTask(purpose);
    if (data.taskId === 0) {
      alert('No pending call task');
    }
    setCallNextTask(data);
  };

  const loadNextWorkingTask = async () => {
    //log
    console.log("loadNextWorkingTask called with workingCallPurpose:", workingCallPurpose);
      if (workingCallPurpose) {
        const data = await fetchNextTask(workingCallPurpose);
        if (data.taskId === 0) {
          alert('No pending call task');
        }
        setCallNextTask(data);
      } else {
        alert('Please select a target card first');
      }
    };
  
  const [selectedCallId, setSelectedCallId] = useState<string | null>(null);

  const handleCallSelect = (callId: string) => {
    setSelectedCallId(callId === selectedCallId ? null : callId);
  };

  const hasCustomer = !!(nextCallTask && nextCallTask.customer  &&
      typeof nextCallTask.customer.name === 'string' &&
      nextCallTask.customer.name.trim() !== '' );

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="mb-6">
        <TargetCardsUi  />
      </div>

      {hasCustomer && <CustomerHeader customer={nextCallTask.customer} />}

      {hasCustomer && (

      <div className="flex flex-col lg:flex-row gap-6 mt-6">
        <div className="lg:w-3/5">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Communication History</h2>
            {hasCustomer && (
              <CallTimeline
                calls={nextCallTask.callHistory}
                selectedCallId={selectedCallId}
                onCallSelect={handleCallSelect}
              />
            )}
          </div>
        </div>

        <div className="lg:w-2/5">
         {hasCustomer && (
          <CurrentCallForm
            taskId={nextCallTask.taskId}
            previousCall={nextCallTask.callHistory.length > 0 ? nextCallTask.callHistory[0] : null}
          /> )}
        </div>
      </div>
      )}

    </div>
  );
};

export default CallHistoryPage;