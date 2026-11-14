import dayjs from 'dayjs';
import { WORK_MODES, STATUS_OPTIONS } from '../constants/jobConstants';
import type { JobStatus, WorkMode } from '../constants/jobConstants';
import { db } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export interface InterviewRound {
  id: string;
  name: string;
  date: string;
  status: 'Scheduled' | 'Completed' | 'Cleared' | 'Rejected';
  notes?: string;
}

export interface JobRecord {
  id: string;
  role: string;
  company: string;
  workMode: WorkMode;
  location: string;
  expectedCtc: number;
  isApplied: boolean;
  appliedDate: string | null;
  status: JobStatus;
  interviewRounds: InterviewRound[];
  savedInterviewRounds: InterviewRound[];
  companyEmail?: string;
  companyPhone?: string;
  portalUrl?: string;
  notes?: string;
  deletedAt?: string;
}

export const getTodayISO = (): string => dayjs().format('YYYY-MM-DD');

export const sanitizeJobRecord = (raw: any): JobRecord => {
  const isApplied = Boolean(raw?.isApplied);
  const validStatus: JobStatus = STATUS_OPTIONS.includes(raw?.status)
    ? raw.status
    : 'Pending';

  return {
    id: raw?.id || `job-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    role: String(raw?.role || '').trim(),
    company: String(raw?.company || '').trim(),
    workMode: WORK_MODES.includes(raw?.workMode) ? raw.workMode : 'On-site',
    location: String(raw?.location || 'Kolkata').trim(),
    expectedCtc: Number(raw?.expectedCtc) || 6.0,
    isApplied,
    appliedDate: isApplied ? raw?.appliedDate || getTodayISO() : null,
    status: isApplied ? validStatus : 'Pending',
    interviewRounds: Array.isArray(raw?.interviewRounds) ? raw.interviewRounds : [],
    savedInterviewRounds: Array.isArray(raw?.savedInterviewRounds)
      ? raw.savedInterviewRounds
      : Array.isArray(raw?.interviewRounds)
      ? raw.interviewRounds
      : [],
    companyEmail: String(raw?.companyEmail || '').trim(),
    companyPhone: String(raw?.companyPhone || '').trim(),
    portalUrl: String(raw?.portalUrl || '').trim(),
    notes: String(raw?.notes || '').trim(),
    ...(raw?.deletedAt ? { deletedAt: raw.deletedAt } : {})
  };
};


export const loadJobsFromCloud = async (): Promise<JobRecord[]> => {
  try {
    const ref = doc(db, 'tracker_data', 'jobs');
    const snap = await getDoc(ref);
    if (snap.exists() && Array.isArray(snap.data()?.items)) {
      return snap.data().items.map(sanitizeJobRecord);
    }
  } catch (err) {
    console.error('Error loading jobs from Firestore:', err);
  }
  return [];
};

export const saveJobsToCloud = async (jobs: JobRecord[]): Promise<void> => {
  try {
    const ref = doc(db, 'tracker_data', 'jobs');
    await setDoc(ref, { items: jobs });
  } catch (err) {
    console.error('Error saving jobs to Firestore:', err);
  }
};

export const loadTrashFromCloud = async (): Promise<JobRecord[]> => {
  try {
    const ref = doc(db, 'tracker_data', 'trash');
    const snap = await getDoc(ref);
    if (snap.exists() && Array.isArray(snap.data()?.items)) {
      return snap.data().items.map(sanitizeJobRecord);
    }
  } catch (err) {
    console.error('Error loading trash from Firestore:', err);
  }
  return [];
};

export const saveTrashToCloud = async (trash: JobRecord[]): Promise<void> => {
  try {
    const ref = doc(db, 'tracker_data', 'trash');
    await setDoc(ref, { items: trash });
  } catch (err) {
    console.error('Error saving trash to Firestore:', err);
  }
};

export const getStatusColorConfig = (status: JobStatus) => {
  switch (status) {
    case 'Pending':
      return { text: '#D97706', border: '#D97706', dot: '#D97706' };
    case 'Shortlisted':
      return { text: '#0284C7', border: '#0284C7', dot: '#0284C7' };
    case 'Interview':
      return { text: '#7C3AED', border: '#7C3AED', dot: '#7C3AED' };
    case 'Rejected':
      return { text: '#E11D48', border: '#E11D48', dot: '#E11D48' };
    case 'Hired':
      return { text: '#059669', border: '#059669', dot: '#059669' };
    default:
      return { text: '#64748B', border: '#64748B', dot: '#64748B' };
  }
};