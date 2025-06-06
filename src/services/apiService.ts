import { Call, CallStatus, CallPurpose, Customer, TargetCardProps, NextTaskResponse } from '../types';

const API_BASE_URL = 'http://localhost:3880/ajgold/crm/v1';
const USERS_ENDPOINT = `${API_BASE_URL}/users/1`;
const CALLS_ENDPOINT = `${API_BASE_URL}/call`;
const TODAY_TARGET_ENDPOINT = `${API_BASE_URL}/call-tasks/today`;
const NEXT_TASK_ENDPOINT = `${API_BASE_URL}/call-tasks/next-task`;
const COMPLETE_TASK_ENDPOINT = `${API_BASE_URL}/call-tasks/complete`;

// Mock data for customer
export const fetchCustomerData = async (customerId: string): Promise<Customer> => {

    try {
        const response = await fetch(USERS_ENDPOINT);
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data: Customer = await response.json();
        return data;
      } catch (err) {
        console.log("Error:", err)
      } finally {
        // setLoading(false);
      }
      throw new Error('Failed to fetch users');
};

// Mock data for call history
export const fetchCallHistory = async (customerId: string): Promise<Call[]> => {

  try {
        const response = await fetch(CALLS_ENDPOINT);
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data: Call[] = await response.json();
        return data;
      } catch (err) {
        console.log("Error:", err)
      } finally {
        // setLoading(false);
          throw new Error('Failed to fetch users');
      }

};

// API endpoint for today's targets
export const fetchTodayTargets = async (): Promise<Omit<TargetCardProps, 'icon'>[]> => {
  try {
    const response = await fetch(TODAY_TARGET_ENDPOINT);
    //handle response 404 and 500 errors
    
    if (!response.ok) {
      throw new Error('Failed to fetch today\'s targets');
    }
    const data: Omit<TargetCardProps, 'icon'>[] = await response.json();
    return data;
  } catch (err) {
    console.log("Error:", err);
    return [];
  }
};

export const fetchNextTask = async (purpose: string): Promise<NextTaskResponse> => {
  try {
    const response = await fetch(`${NEXT_TASK_ENDPOINT}?purpose=${encodeURIComponent(purpose)}`);

    if (response.status === 404) {
      // Return an object with id=0 for 404
      return {
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
        } as NextTaskResponse;
    }

    if (!response.ok) {
      throw new Error('Failed to fetch next task');
    }
    const data: NextTaskResponse = await response.json();

    // Convert status, purpose, nextActions, and outcomes to correct formats for each call in callHistory
    const callHistory = (data.callHistory || []).map((call: any) => ({
      ...call,
      status: CallStatus[call.status as keyof typeof CallStatus] ?? call.status,
      purpose: CallPurpose[call.purpose as keyof typeof CallPurpose] ?? call.purpose,
      nextActions: !call.nextActions
        ? []
        : Array.isArray(call.nextActions)
          ? call.nextActions
          : typeof call.nextActions === 'string'
            ? call.nextActions.split('\n').filter((s: string) => s.trim() !== '')
            : [],
      outcomes: !call.outcomes
        ? []
        : Array.isArray(call.outcomes)
          ? call.outcomes
          : typeof call.outcomes === 'string'
            ? call.outcomes.split('\n').filter((s: string) => s.trim() !== '')
            : []
    }));

    return {
      ...data,
      callHistory,
    };
  } catch (err) {
    console.log("Error:", err);
    throw new Error('Failed to fetch next task');
  }
};

export interface CompleteTaskRequest {
  taskId: number;
  status: string;
  duration: number;
  operatorNotes: string;
  outcomes: string;
  nextActions: string;
  followUpDateTime: string | null;
  followUpDepartmentId: number | undefined;
}

export const completeCallTask = async (payload: CompleteTaskRequest): Promise<any> => {
  try {
    const response = await fetch(COMPLETE_TASK_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    if (!response.ok) {
      throw new Error('Failed to complete call task');
    }
    return await response.json();
  } catch (err) {
    console.log("Error:", err);
    throw err;
  }
};