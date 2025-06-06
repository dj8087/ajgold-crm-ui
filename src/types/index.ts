export enum CallStatus {
  NOT_REACHABLE = 'Not Reachable',
  MISSED = 'Missed',
  COMPLETED = 'Completed',
  NOT_INTERESTED = 'Not Interested',
  FOLLOW_UP = 'Follow Up Required',
  REQUESTED_CALL_BACK = 'Requested Call Back'
}

export enum CallPurpose {
  SALES_FEEDBACK = 'Sales Feedback',
  PAYMENT_RECOVERY = 'Payment Recovery',
  TODAYS_FOLLOWUP = 'Daily Follow-up',
  CUSTOMER_SERVICE = 'Customer Service',
  TECHNICAL_SUPPORT = 'Technical Support',
  ACCOUNT_MANAGEMENT = 'Account Management',
  PRODUCT_UPDATE = 'Product Update',
  GENERAL_INQUIRY = 'General Inquiry',
  INTIMATION = 'Firti Intimation'
}

export interface Call {
  id: string;
  customerId: string;
  agentId: string;
  agentName: string;
  status: CallStatus;
  purpose: CallPurpose;
  completedDate: string; // Renamed from timestamp
  duration: number; // in minutes
  operatorNotes: string;
  outcomes?: string[];
  nextActions?: string[];
}

export interface Contact {
  id: string;
  mobileNumber: string;
  name: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  contacts: Contact[]; // Changed from phone: string
  address: string;
  status: 'Active' | 'Inactive' | 'Pending';
  accountType: string;
  customerSince: string;
}

export interface TargetCardProps {
  title: string;
  target: number;
  completed: number;
  icon?: React.ReactNode; // Optional, UI only
  color: string;
  onCardClick: (title: string) => void;
}


export interface TargetCards {
  targets: TargetCardProps[];
  onCardClick: (title: string) => void;
}

export interface NextTaskResponse {
  taskId: number;
  customer: Customer;
  callHistory: Call[];
}