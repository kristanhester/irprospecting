export interface Integration {
  id: string;
  name: string;
  description: string;
  category: 'CRM' | 'Email' | 'Data' | 'Events';
  status: 'connected' | 'available';
  color: string; // tailwind text color class for the avatar mark
  bg: string;    // tailwind bg color class for the avatar
}

export const INTEGRATIONS: Integration[] = [
  {
    id: 'outlook',
    name: 'Microsoft Outlook',
    description: 'Sync warm intros from your inbox and calendar history.',
    category: 'Email',
    status: 'connected',
    color: 'text-blue-700',
    bg: 'bg-blue-50',
  },
  {
    id: 'salesforce',
    name: 'Salesforce',
    description: 'Pull LP records, opportunities, and activity from your CRM.',
    category: 'CRM',
    status: 'connected',
    color: 'text-sky-700',
    bg: 'bg-sky-50',
  },
  {
    id: 'iconnections',
    name: 'iConnections',
    description: 'Surface LP attendance and meeting requests from cap intro events.',
    category: 'Events',
    status: 'available',
    color: 'text-indigo-700',
    bg: 'bg-indigo-50',
  },
  {
    id: 'fintrx',
    name: 'FINTRX',
    description: 'Enrich LP records with the FINTRX private wealth dataset.',
    category: 'Data',
    status: 'available',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
  },
];
