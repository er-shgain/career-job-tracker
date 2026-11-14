export const WORK_MODES = ['On-site', 'Hybrid', 'Remote'] as const;
export type WorkMode = typeof WORK_MODES[number];

export const STATUS_OPTIONS = [
  'Pending',
  'Shortlisted',
  'Interview',
  'Rejected',
  'Hired'
] as const;
export type JobStatus = typeof STATUS_OPTIONS[number];

export const PAGE_SIZE_OPTIONS = [5, 25, 50, 75, 100];

export const DATE_FILTER_OPTIONS = [
  { value: 'All', label: 'All Dates' },
  { value: 'Today', label: 'Today' },
  { value: 'Yesterday', label: 'Yesterday' },
  { value: 'This Week', label: 'This Week' },
  { value: 'This Month', label: 'This Month' },
  { value: 'This Year', label: 'This Year' },
  { value: 'Not Applied', label: 'Not Applied' },
  { value: 'Custom', label: 'Custom Date' }
];

export const TECH_CITIES = [
  'Kolkata',
  'Bengaluru',
  'Hyderabad',
  'Pune',
  'Mumbai',
  'Gurugram',
  'Noida',
  'Delhi NCR',
  'Chennai',
  'Ahmedabad',
  'Jaipur',
  'Kochi',
  'Thiruvananthapuram',
  'Chandigarh',
  'Indore',
  'Coimbatore',
  'San Francisco',
  'New York',
  'Seattle',
  'London',
  'Dublin',
  'Berlin',
  'Amsterdam',
  'Singapore',
  'Dubai',
  'Toronto',
  'Sydney',
  'Remote (India)',
  'Remote (Global)'
];