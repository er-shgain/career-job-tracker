import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ConfigProvider, theme, message, Modal, Form } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { Lock, Sparkles, AlertTriangle } from 'lucide-react';

import type { JobRecord, InterviewRound } from './utils/storageHelpers';
import {
  getTodayISO,
  loadJobsFromCloud,
  saveJobsToCloud,
  loadTrashFromCloud,
  saveTrashToCloud,
} from './utils/storageHelpers';

import { Header } from './components/Header';
import { QuickGuide } from './components/QuickGuide';
import { StatCards } from './components/StatCards';
import { FilterToolbar } from './components/FilterToolbar';
import { JobTable } from './components/JobTable';
import { BulkActionDock } from './components/BulkActionDock';

import { AddEditJobModal } from './components/modals/AddEditJobModal';
import { ManageRoundsModal } from './components/modals/ManageRoundsModal';
import { ViewJobModal } from './components/modals/ViewJobModal';
import { TrashModal } from './components/modals/TrashModal';

const THEME_STORAGE_KEY = 'career_portal_job_tracker_theme_v3';

export default function App() {
  const [messageApi, contextHolder] = message.useMessage();
  const [modalApi, modalContextHolder] = Modal.useModal();

  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      return saved ? saved === 'dark' : true;
    } catch {
      return true;
    }
  });

  const [jobs, setJobs] = useState<JobRecord[]>([]);
  const [trash, setTrash] = useState<JobRecord[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    let isMounted = true;
    Promise.all([loadJobsFromCloud(), loadTrashFromCloud()]).then(([loadedJobs, loadedTrash]) => {
      if (isMounted) {
        setJobs(loadedJobs);
        setTrash(loadedTrash);
        setIsInitialized(true);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const persistJobs = useCallback(async (updatedJobs: JobRecord[]) => {
    setJobs(updatedJobs);
    await saveJobsToCloud(updatedJobs);
  }, []);

  const persistTrash = useCallback(async (updatedTrash: JobRecord[]) => {
    setTrash(updatedTrash);
    await saveTrashToCloud(updatedTrash);
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [workModeFilter, setWorkModeFilter] = useState('All');
  const [locationFilter, setLocationFilter] = useState('All');
  const [appliedFilter, setAppliedFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('All');
  const [customDateRange, setCustomDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);
  const [isCustomDatePopoverOpen, setIsCustomDatePopoverOpen] = useState(false);

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobRecord | null>(null);
  const [modalIsApplied, setModalIsApplied] = useState(false);
  const [formInstance] = Form.useForm();
  const [formValues, setFormValues] = useState<any>({});
  const [modalRounds, setModalRounds] = useState<InterviewRound[]>([]);

  const [managingRoundsJob, setManagingRoundsJob] = useState<JobRecord | null>(null);
  const [tempRounds, setTempRounds] = useState<InterviewRound[]>([]);

  const [viewingJob, setViewingJob] = useState<JobRecord | null>(null);
  const [viewMode, setViewMode] = useState<'plain' | 'json'>('plain');
  const [copiedJson, setCopiedJson] = useState(false);

  const [isTrashOpen, setIsTrashOpen] = useState(false);

  const [tablePage, setTablePage] = useState(1);
  const [tablePageSize, setTablePageSize] = useState(5);

  const [showQuickGuide, setShowQuickGuide] = useState(true);

  useEffect(() => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, isDark ? 'dark' : 'light');
    } catch {}
  }, [isDark]);

  const cityOptions = useMemo(() => {
    const unique = new Set([
      'Kolkata', 'Bengaluru', 'Hyderabad', 'Pune', 'Mumbai', 'Gurugram', 'Noida',
      'Delhi NCR', 'Chennai', 'Ahmedabad', 'Jaipur', 'Kochi', 'Thiruvananthapuram',
      'Chandigarh', 'Indore', 'Coimbatore', 'Remote (India)', 'San Francisco',
      'New York', 'Seattle', 'London', 'Dublin', 'Berlin', 'Amsterdam',
      'Singapore', 'Dubai', 'Toronto', 'Sydney', 'Remote (Global)'
    ]);
    jobs.forEach((j) => {
      if (j.location) unique.add(j.location);
    });
    return Array.from(unique).map((city) => ({ value: city, label: city }));
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return jobs.filter((job) => {
      const effectiveStatus = job.isApplied ? job.status : 'Pending';

      if (statusFilter !== 'All' && effectiveStatus !== statusFilter) return false;
      if (workModeFilter !== 'All' && job.workMode !== workModeFilter) return false;
      if (locationFilter !== 'All' && job.location !== locationFilter) return false;
      if (appliedFilter === 'Applied' && !job.isApplied) return false;
      if (appliedFilter === 'Not Applied' && job.isApplied) return false;

      if (dateFilter === 'Not Applied') {
        if (job.isApplied) return false;
      } else if (dateFilter === 'Custom') {
        if (customDateRange && customDateRange[0] && customDateRange[1]) {
          if (!job.appliedDate) return false;
          const jobDate = dayjs(job.appliedDate);
          const start = customDateRange[0].startOf('day');
          const end = customDateRange[1].endOf('day');
          if (jobDate.isBefore(start) || jobDate.isAfter(end)) return false;
        }
      } else if (dateFilter !== 'All') {
        if (!job.appliedDate) return false;
        const jobDate = dayjs(job.appliedDate);
        const now = dayjs();

        if (dateFilter === 'Today' && !jobDate.isSame(now, 'day')) return false;
        if (dateFilter === 'Yesterday' && !jobDate.isSame(now.subtract(1, 'day'), 'day')) return false;
        if (dateFilter === 'This Week' && !jobDate.isSame(now, 'week')) return false;
        if (dateFilter === 'This Month' && !jobDate.isSame(now, 'month')) return false;
        if (dateFilter === 'This Year' && !jobDate.isSame(now, 'year')) return false;
      }

      if (query) {
        const haystack = [
          job.role,
          job.company,
          job.location,
          job.workMode,
          effectiveStatus,
          job.companyEmail,
          job.companyPhone,
          job.notes
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(query)) return false;
      }

      return true;
    });
  }, [jobs, searchQuery, statusFilter, workModeFilter, locationFilter, appliedFilter, dateFilter, customDateRange]);

  const stats = useMemo(() => {
    let pending = 0;
    let inProgress = 0;
    let hired = 0;
    let rejected = 0;

    jobs.forEach((job) => {
      const st = job.isApplied ? job.status : 'Pending';
      if (st === 'Pending') pending += 1;
      else if (st === 'Hired') hired += 1;
      else if (st === 'Rejected') rejected += 1;
      else inProgress += 1;
    });

    return { total: jobs.length, pending, inProgress, hired, rejected };
  }, [jobs]);

  const selectedJobs = useMemo(() => {
    const set = new Set(selectedRowKeys);
    return jobs.filter((j) => set.has(j.id));
  }, [jobs, selectedRowKeys]);

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    statusFilter !== 'All' ||
    workModeFilter !== 'All' ||
    locationFilter !== 'All' ||
    appliedFilter !== 'All' ||
    dateFilter !== 'All' ||
    customDateRange !== null;

  const clearAllFilters = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setWorkModeFilter('All');
    setLocationFilter('All');
    setAppliedFilter('All');
    setDateFilter('All');
    setCustomDateRange(null);
    setIsCustomDatePopoverOpen(false);
  };

  const paginatedTableJobs = useMemo(() => {
    const startIdx = (tablePage - 1) * tablePageSize;
    return filteredJobs.slice(startIdx, startIdx + tablePageSize);
  }, [filteredJobs, tablePage, tablePageSize]);

  const isFormValid = useMemo(() => {
    const r = formValues.role;
    const c = formValues.company;
    const w = formValues.workMode;
    const l = formValues.location;
    const e = formValues.expectedCtc;
    const s = formValues.status;
    return Boolean(r && String(r).trim() && c && String(c).trim() && w && l && e !== undefined && e !== null && s);
  }, [formValues]);

  const isFormDirty = useMemo(() => {
    if (!editingJob) return true;
    return (
      formValues.role !== editingJob.role ||
      formValues.company !== editingJob.company ||
      formValues.workMode !== editingJob.workMode ||
      formValues.location !== editingJob.location ||
      Number(formValues.expectedCtc) !== Number(editingJob.expectedCtc) ||
      formValues.status !== editingJob.status ||
      Boolean(formValues.isApplied) !== Boolean(editingJob.isApplied) ||
      String(formValues.portalUrl || '') !== String(editingJob.portalUrl || '') ||
      String(formValues.companyEmail || '') !== String(editingJob.companyEmail || '') ||
      String(formValues.companyPhone || '') !== String(editingJob.companyPhone || '') ||
      String(formValues.notes || '') !== String(editingJob.notes || '') ||
      JSON.stringify(modalRounds) !== JSON.stringify(editingJob.interviewRounds || [])
    );
  }, [editingJob, formValues, modalRounds]);

  const handleOpenAddModal = () => {
    setEditingJob(null);
    setModalIsApplied(false);
    setModalRounds([]);
    formInstance.resetFields();
    const defaults = {
      workMode: 'On-site',
      location: 'Kolkata',
      expectedCtc: 6.0,
      isApplied: false,
      status: 'Pending',
      appliedDate: dayjs()
    };
    formInstance.setFieldsValue(defaults);
    setFormValues(defaults);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (record: JobRecord) => {
    setEditingJob(record);
    const appliedState = Boolean(record.isApplied);
    setModalIsApplied(appliedState);
    setModalRounds(record.interviewRounds || []);
    formInstance.resetFields();
    const vals = {
      role: record.role,
      company: record.company,
      workMode: record.workMode,
      location: record.location,
      expectedCtc: Number(record.expectedCtc) || 6.0,
      isApplied: appliedState,
      status: appliedState ? record.status || 'Pending' : 'Pending',
      appliedDate: record.appliedDate ? dayjs(record.appliedDate) : dayjs(),
      companyEmail: record.companyEmail || '',
      companyPhone: record.companyPhone || '',
      portalUrl: record.portalUrl || '',
      notes: record.notes || ''
    };
    formInstance.setFieldsValue(vals);
    setFormValues(vals);
    setIsModalOpen(true);
  };

  const handleFormFinish = async (values: any) => {
    const rawUrl = values.portalUrl ? values.portalUrl.trim() : '';
    const sanitizedUrl = rawUrl && !/^https?:\/\//i.test(rawUrl) ? `https://${rawUrl}` : rawUrl;

    const finalIsApplied = editingJob?.isApplied ? true : Boolean(values.isApplied ?? modalIsApplied);
    const finalStatus = finalIsApplied ? values.status || 'Pending' : 'Pending';

    const formattedDate = finalIsApplied
      ? values.appliedDate
        ? values.appliedDate.format('YYYY-MM-DD')
        : editingJob?.appliedDate || getTodayISO()
      : null;

    const updatedRounds = finalStatus === 'Interview' ? modalRounds : (editingJob?.interviewRounds || modalRounds);
    const updatedSavedRounds = finalStatus === 'Interview' ? modalRounds : (editingJob?.savedInterviewRounds || modalRounds);

    let newJobsList = [...jobs];
    if (editingJob) {
      newJobsList = newJobsList.map((item) =>
        item.id === editingJob.id
          ? {
              ...item,
              role: values.role.trim(),
              company: values.company.trim(),
              workMode: values.workMode,
              location: values.location,
              expectedCtc: Number(values.expectedCtc) || 0,
              isApplied: finalIsApplied,
              appliedDate: formattedDate,
              status: finalStatus,
              interviewRounds: updatedRounds,
              savedInterviewRounds: updatedSavedRounds,
              companyEmail: values.companyEmail ? values.companyEmail.trim() : '',
              companyPhone: values.companyPhone ? values.companyPhone.trim() : '',
              portalUrl: sanitizedUrl,
              notes: values.notes ? values.notes.trim() : ''
            }
          : item
      );
      messageApi.success(`Updated ${values.role} at ${values.company}`);
    } else {
      const newJob: JobRecord = {
        id: `job-${Date.now()}`,
        role: values.role.trim(),
        company: values.company.trim(),
        workMode: values.workMode,
        location: values.location,
        expectedCtc: Number(values.expectedCtc) || 0,
        isApplied: finalIsApplied,
        appliedDate: formattedDate,
        status: finalStatus,
        interviewRounds: updatedRounds,
        savedInterviewRounds: updatedSavedRounds,
        companyEmail: values.companyEmail ? values.companyEmail.trim() : '',
        companyPhone: values.companyPhone ? values.companyPhone.trim() : '',
        portalUrl: sanitizedUrl,
        notes: values.notes ? values.notes.trim() : ''
      };
      newJobsList = [newJob, ...newJobsList];
      messageApi.success(`Added ${newJob.role} at ${newJob.company}`);
    }

    await persistJobs(newJobsList);
    setIsModalOpen(false);
    setEditingJob(null);
    setModalIsApplied(false);
    setModalRounds([]);
  };

  const handleMarkApplied = (record: JobRecord) => {
    if (!record || record.isApplied) return;
    const today = getTodayISO();

    modalApi.confirm({
      title: <span className={isDark ? 'text-[#F8FAFC]' : 'text-[#0F172A]'}>Mark Application as Submitted &amp; Lock?</span>,
      icon: <Lock className="w-6 h-6 text-[#6366F1] mr-2 shrink-0" />,
      content: (
        <div className={`${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'} text-sm pt-1 space-y-1.5`}>
          <p className="m-0">Confirm submission for <strong className={isDark ? 'text-[#F8FAFC]' : 'text-[#0F172A]'}>{record.role}</strong> at <strong className={isDark ? 'text-[#F8FAFC]' : 'text-[#0F172A]'}>{record.company}</strong>.</p>
        </div>
      ),
      okText: 'Yes, Mark Applied & Lock',
      okButtonProps: { style: { backgroundColor: '#6366F1', borderColor: '#6366F1', color: '#FFFFFF', fontWeight: 600 } },
      cancelText: 'Cancel',
      onOk: async () => {
        const updated = jobs.map((job) =>
          job.id === record.id
            ? { ...job, isApplied: true, appliedDate: job.appliedDate || today, status: 'Pending' as const }
            : job
        );
        await persistJobs(updated);
        messageApi.success(`Marked ${record.role} as submitted & locked`);
      }
    });
  };

  const handleStatusChange = (id: string, newStatus: any) => {
    const targetJob = jobs.find((job) => job.id === id);
    if (!targetJob || !targetJob.isApplied || targetJob.status === newStatus) return;

    modalApi.confirm({
      title: <span className={isDark ? 'text-[#F8FAFC]' : 'text-[#0F172A]'}>Update Application Stage?</span>,
      icon: <Sparkles className="w-6 h-6 text-[#6366F1] mr-2 shrink-0" />,
      content: (
        <div className={`${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'} text-sm pt-1 space-y-2.5`}>
          <p className="m-0">Move <strong className={isDark ? 'text-[#F8FAFC]' : 'text-[#0F172A]'}>{targetJob.role}</strong> to <strong>{newStatus}</strong>?</p>
        </div>
      ),
      okText: 'Yes, Update Stage',
      okButtonProps: { style: { backgroundColor: '#6366F1', borderColor: '#6366F1', color: '#FFFFFF', fontWeight: 600 } },
      cancelText: 'Cancel',
      onOk: async () => {
        const updated = jobs.map((job) => {
          if (job.id === id && job.isApplied) {
            let updatedRounds = job.interviewRounds;
            let updatedSavedRounds = job.savedInterviewRounds || job.interviewRounds;
            if (newStatus === 'Interview') {
              updatedRounds = job.savedInterviewRounds && job.savedInterviewRounds.length > 0 ? job.savedInterviewRounds : (job.interviewRounds.length > 0 ? job.interviewRounds : [{ id: `r-${Date.now()}`, name: 'Round 1 (Technical)', date: getTodayISO(), status: 'Scheduled', notes: '' }]);
            } else {
              updatedSavedRounds = job.interviewRounds;
              updatedRounds = [];
            }
            return { ...job, status: newStatus, interviewRounds: updatedRounds, savedInterviewRounds: updatedSavedRounds };
          }
          return job;
        });
        await persistJobs(updated);
        messageApi.success(`Stage updated to ${newStatus}`);
      }
    });
  };

  const handleDeleteToTrash = (record: JobRecord) => {
    modalApi.confirm({
      title: <span className={isDark ? 'text-[#F8FAFC]' : 'text-[#0F172A]'}>Move Job Application to Trash?</span>,
      icon: <AlertTriangle className="w-6 h-6 text-[#F43F5E] mr-2 shrink-0" />,
      content: (
        <div className={`${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'} text-sm pt-1`}>
          <p className="m-0">Move <strong className={isDark ? 'text-[#F8FAFC]' : 'text-[#0F172A]'}>{record.role}</strong> to Trash? You can restore it anytime.</p>
        </div>
      ),
      okText: 'Yes, Move to Trash',
      okType: 'danger',
      okButtonProps: { style: { backgroundColor: '#F43F5E', borderColor: '#F43F5E', color: '#FFFFFF', fontWeight: 600 } },
      cancelText: 'Cancel',
      onOk: async () => {
        const trashedItem: JobRecord = { ...record, deletedAt: new Date().toISOString() };
        const newJobs = jobs.filter((item) => item.id !== record.id);
        const newTrash = [trashedItem, ...trash];
        await persistJobs(newJobs);
        await persistTrash(newTrash);
        setSelectedRowKeys((prev) => prev.filter((key) => key !== record.id));
        messageApi.success(`Moved ${record.role} to trash`);
      }
    });
  };

  const handleRestoreFromTrash = async (record: JobRecord) => {
    const newTrash = trash.filter((item) => item.id !== record.id);
    const restored: JobRecord = { ...record };
    delete restored.deletedAt;
    const newJobs = [restored, ...jobs];
    await persistTrash(newTrash);
    await persistJobs(newJobs);
    messageApi.success(`Restored ${record.role} from trash`);
  };

  const handleDeleteForever = async (record: JobRecord) => {
    modalApi.confirm({
      title: <span className={isDark ? 'text-[#F8FAFC]' : 'text-[#0F172A]'}>Delete Forever?</span>,
      icon: <AlertTriangle className="w-6 h-6 text-[#F43F5E] mr-2 shrink-0" />,
      content: (
        <div className={`${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'} text-sm pt-1`}>
          <p className="m-0">Permanently delete <strong className={isDark ? 'text-[#F8FAFC]' : 'text-[#0F172A]'}>{record.role}</strong>? This cannot be undone.</p>
        </div>
      ),
      okText: 'Delete Forever',
      okType: 'danger',
      onOk: async () => {
        const newTrash = trash.filter((item) => item.id !== record.id);
        await persistTrash(newTrash);
        messageApi.success(`Permanently deleted ${record.role}`);
      }
    });
  };

  const handleEmptyTrash = async () => {
    modalApi.confirm({
      title: <span className={isDark ? 'text-[#F8FAFC]' : 'text-[#0F172A]'}>Empty Trash Forever?</span>,
      icon: <AlertTriangle className="w-6 h-6 text-[#F43F5E] mr-2 shrink-0" />,
      content: (
        <div className={`${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'} text-sm pt-1`}>
          <p className="m-0">Are you sure you want to permanently delete all items in trash?</p>
        </div>
      ),
      okText: 'Empty Trash',
      okType: 'danger',
      onOk: async () => {
        await persistTrash([]);
        messageApi.success('Emptied trash');
      }
    });
  };

  if (!isInitialized) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-[#090D16] text-[#F8FAFC]' : 'bg-[#F8FAFC] text-[#0F172A]'}`}>
        <div className="text-sm font-medium animate-pulse">Loading Cloud Firestore Database...</div>
      </div>
    );
  }

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          fontSize: 14,
          borderRadius: 6,
          colorPrimary: '#6366F1',
          colorBgBase: isDark ? '#090D16' : '#F8FAFC',
          colorBgContainer: isDark ? '#0F172A' : '#FFFFFF',
          colorBgElevated: isDark ? '#131C31' : '#FFFFFF',
          colorBorder: isDark ? '#334155' : '#94A3B8',
          colorBorderSecondary: isDark ? '#293548' : '#CBD5E1'
        }
      }}
    >
      {contextHolder}
      {modalContextHolder}

      <div className={`min-h-screen transition-colors duration-200 ${isDark ? 'bg-[#090D16] text-[#F8FAFC]' : 'bg-[#F8FAFC] text-[#0F172A]'}`}>
        {isDark && (
          <div
            className="pointer-events-none fixed inset-x-0 top-0 h-72 opacity-40"
            style={{
              background: 'radial-gradient(ellipse 70% 50% at 50% -10%, rgba(99,102,241,0.32), rgba(6,182,212,0.10), transparent)'
            }}
          />
        )}

        <Header
          isDark={isDark}
          onToggleTheme={() => setIsDark((prev) => !prev)}
          showQuickGuide={showQuickGuide}
          onToggleQuickGuide={() => setShowQuickGuide((prev) => !prev)}
          trashCount={trash.length}
          onOpenTrash={() => setIsTrashOpen(true)}
          onOpenAddModal={handleOpenAddModal}
        />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-5 pb-28">
          {showQuickGuide && (
            <QuickGuide isDark={isDark} onHide={() => setShowQuickGuide(false)} />
          )}

          <StatCards isDark={isDark} stats={stats} />

          <FilterToolbar
            isDark={isDark}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            workModeFilter={workModeFilter}
            onWorkModeFilterChange={setWorkModeFilter}
            locationFilter={locationFilter}
            onLocationFilterChange={setLocationFilter}
            appliedFilter={appliedFilter}
            onAppliedFilterChange={setAppliedFilter}
            dateFilter={dateFilter}
            onDateFilterChange={setDateFilter}
            customDateRange={customDateRange}
            onCustomDateRangeChange={setCustomDateRange}
            isCustomDatePopoverOpen={isCustomDatePopoverOpen}
            onCustomDatePopoverOpenChange={setIsCustomDatePopoverOpen}
            cityOptions={cityOptions}
            hasActiveFilters={hasActiveFilters}
            onResetFilters={clearAllFilters}
          />

          <JobTable
            isDark={isDark}
            jobs={paginatedTableJobs}
            selectedRowKeys={selectedRowKeys}
            onSelectedRowKeysChange={setSelectedRowKeys}
            tablePage={tablePage}
            tablePageSize={tablePageSize}
            totalJobs={filteredJobs.length}
            onPageChange={(page, size) => {
              setTablePage(page);
              setTablePageSize(size);
            }}
            hasActiveFilters={hasActiveFilters}
            onResetFilters={clearAllFilters}
            onOpenAddModal={handleOpenAddModal}
            onMarkApplied={handleMarkApplied}
            onStatusChange={handleStatusChange}
            onOpenManageRounds={(record: JobRecord) => {
              setManagingRoundsJob(record);
              setTempRounds(record.interviewRounds?.length ? [...record.interviewRounds] : [{ id: `r-${Date.now()}`, name: 'Round 1 (Technical)', date: getTodayISO(), status: 'Scheduled' }]);
            }}
            onViewJob={(record: JobRecord) => {
              setViewingJob(record);
              setViewMode('plain');
              setCopiedJson(false);
            }}
            onEditJob={handleOpenEditModal}
            onDeleteJob={handleDeleteToTrash}
          />
        </main>

        <BulkActionDock
          isDark={isDark}
          selectedRowKeys={selectedRowKeys}
          selectedJobs={selectedJobs}
          onDeselectAll={() => setSelectedRowKeys([])}
          onBatchStatusChange={async (status) => {
            const updated = jobs.map((j) => (selectedRowKeys.includes(j.id) && j.isApplied ? { ...j, status } : j));
            await persistJobs(updated);
            messageApi.success(`Moved status to ${status}`);
          }}
          onBatchDelete={async () => {
            const selectedSet = new Set(selectedRowKeys);
            const itemsToTrash = jobs.filter((j) => selectedSet.has(j.id)).map((j) => ({ ...j, deletedAt: new Date().toISOString() }));
            const newJobs = jobs.filter((item) => !selectedSet.has(item.id));
            const newTrash = [...itemsToTrash, ...trash];
            await persistJobs(newJobs);
            await persistTrash(newTrash);
            setSelectedRowKeys([]);
            messageApi.success('Moved selected jobs to trash');
          }}
        />

        <AddEditJobModal
          isDark={isDark}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingJob(null);
            setModalIsApplied(false);
            setModalRounds([]);
          }}
          editingJob={editingJob}
          form={formInstance}
          formValues={formValues}
          onValuesChange={() => setFormValues(formInstance.getFieldsValue())}
          onFinish={handleFormFinish}
          modalIsApplied={modalIsApplied}
          onModalIsAppliedChange={setModalIsApplied}
          modalRounds={modalRounds}
          onAddRound={() => setModalRounds((prev) => [...prev, { id: `r-${Date.now()}`, name: `Round ${prev.length + 1}`, date: getTodayISO(), status: 'Scheduled' }])}
          onUpdateRound={(idx: number, field: keyof InterviewRound, val: any) => setModalRounds((prev) => prev.map((item, i) => (i === idx ? { ...item, [field]: val } : item)))}
          onRemoveRound={(idx: number) => setModalRounds((prev) => prev.filter((_, i) => i !== idx))}
          cityOptions={cityOptions}
          isFormValid={isFormValid}
          isFormDirty={isFormDirty}
        />

        <ManageRoundsModal
          isDark={isDark}
          managingRoundsJob={managingRoundsJob}
          onClose={() => setManagingRoundsJob(null)}
          tempRounds={tempRounds}
          onAddRound={() => setTempRounds((prev) => [...prev, { id: `r-${Date.now()}`, name: `Round ${prev.length + 1}`, date: getTodayISO(), status: 'Scheduled' }])}
          onUpdateRound={(idx: number, field: keyof InterviewRound, val: any) => setTempRounds((prev) => prev.map((item, i) => (i === idx ? { ...item, [field]: val } : item)))}
          onRemoveRound={(idx: number) => setTempRounds((prev) => prev.filter((_, i) => i !== idx))}
          onSaveRounds={async () => {
            if (!managingRoundsJob) return;
            const updated = jobs.map((j) => (j.id === managingRoundsJob.id ? { ...j, interviewRounds: tempRounds, savedInterviewRounds: tempRounds } : j));
            await persistJobs(updated);
            messageApi.success(`Updated interview rounds for ${managingRoundsJob.role}`);
            setManagingRoundsJob(null);
          }}
        />

        <ViewJobModal
          isDark={isDark}
          viewingJob={viewingJob}
          onClose={() => setViewingJob(null)}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          copiedJson={copiedJson}
          onCopyJson={(job: JobRecord) => {
            navigator.clipboard?.writeText(JSON.stringify(job, null, 2));
            setCopiedJson(true);
            messageApi.success('Copied job JSON');
            setTimeout(() => setCopiedJson(false), 2000);
          }}
          onEditJob={handleOpenEditModal}
        />

        <TrashModal
          isDark={isDark}
          isOpen={isTrashOpen}
          onClose={() => setIsTrashOpen(false)}
          trashItems={trash}
          onRestore={handleRestoreFromTrash}
          onDeleteForever={handleDeleteForever}
          onEmptyTrash={handleEmptyTrash}
        />
      </div>
    </ConfigProvider>
  );
}