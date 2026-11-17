import React from 'react';
import { Card, Table, Button, Tooltip, Select, Space, Empty, Popover, Tag } from 'antd';
import {
  ExternalLink,
  Building2,
  Building,
  Laptop,
  MapPin,
  Calendar,
  Lock,
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Star
} from 'lucide-react';
import type { JobRecord } from '../utils/storageHelpers';
import { STATUS_OPTIONS } from '../constants/jobConstants';
import type { JobStatus } from '../constants/jobConstants';
import { getStatusColorConfig } from '../utils/storageHelpers';

interface JobTableProps {
  isDark: boolean;
  jobs: JobRecord[];
  selectedRowKeys: React.Key[];
  onSelectedRowKeysChange: (keys: React.Key[]) => void;
  tablePage: number;
  tablePageSize: number;
  totalJobs: number;
  onPageChange: (page: number, size: number) => void;
  hasActiveFilters: boolean;
  onResetFilters: () => void;
  onOpenAddModal: () => void;
  onMarkApplied: (record: JobRecord) => void;
  onStatusChange: (id: string, status: JobStatus) => void;
  onOpenManageRounds: (record: JobRecord) => void;
  onViewJob: (record: JobRecord) => void;
  onEditJob: (record: JobRecord) => void;
  onDeleteJob: (record: JobRecord) => void;
  onToggleFavorite: (record: JobRecord) => void;
}

export const JobTable: React.FC<JobTableProps> = ({
  isDark,
  jobs,
  selectedRowKeys,
  onSelectedRowKeysChange,
  tablePage,
  tablePageSize,
  totalJobs,
  onPageChange,
  hasActiveFilters,
  onResetFilters,
  onOpenAddModal,
  onMarkApplied,
  onStatusChange,
  onOpenManageRounds,
  onViewJob,
  onEditJob,
  onDeleteJob,
  onToggleFavorite
}) => {
  const columns = [
    {
      title: 'Role & Company',
      key: 'roleCompany',
      width: 250,
      align: 'center' as const,
      render: (_: any, record: JobRecord) => {
        const showPortalIcon = !record.isApplied && record.portalUrl;

        const normalizeStr = (val: any) => (val ? String(val).trim().toLowerCase() : '');
        const normalizeUrl = (val: any) => {
          let str = normalizeStr(val);
          if (str) {
            str = str.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '');
          }
          return str;
        };

        const getMatchReasons = (job: JobRecord) => {
          const reasons: { type: string; value: string }[] = [];
          
          const recCompany = normalizeStr(record.company);
          const jobCompany = normalizeStr(job.company);
          if (recCompany && jobCompany && recCompany === jobCompany) {
            reasons.push({ type: 'Company', value: record.company });
          }
          
          const recEmailOrig = (record as any).email || (record as any).companyEmail || '';
          const jobEmailOrig = (job as any).email || (job as any).companyEmail || '';
          if (normalizeStr(recEmailOrig) && normalizeStr(jobEmailOrig) && normalizeStr(recEmailOrig) === normalizeStr(jobEmailOrig)) {
            reasons.push({ type: 'Email', value: String(recEmailOrig) });
          }
          
          const recPhoneOrig = (record as any).phone || (record as any).companyPhone || '';
          const jobPhoneOrig = (job as any).phone || (job as any).companyPhone || '';
          if (normalizeStr(recPhoneOrig) && normalizeStr(jobPhoneOrig) && normalizeStr(recPhoneOrig) === normalizeStr(jobPhoneOrig)) {
            reasons.push({ type: 'Phone', value: String(recPhoneOrig) });
          }
          
          const recUrlOrig = record.portalUrl || (record as any).companyUrl || (record as any).url || '';
          const jobUrlOrig = job.portalUrl || (job as any).companyUrl || (job as any).url || '';
          if (normalizeUrl(recUrlOrig) && normalizeUrl(jobUrlOrig) && normalizeUrl(recUrlOrig) === normalizeUrl(jobUrlOrig)) {
            reasons.push({ type: 'URL', value: String(recUrlOrig) });
          }
          
          return reasons;
        };

        const matches = jobs.filter((job) => {
          if (job.id === record.id) return false;
          return getMatchReasons(job).length > 0;
        });

        const matchPopoverContent = (
          <div className="w-72 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
            {matches.map(m => {
              const reasons = getMatchReasons(m);
              return (
                <div key={m.id} className={`py-2.5 border-b last:border-0 ${isDark ? 'border-[#1E293B]' : 'border-[#E2E8F0]'}`}>
                  <div className={`text-[13px] font-semibold mb-1.5 ${isDark ? 'text-[#F8FAFC]' : 'text-[#0F172A]'}`}>
                    {m.role} <span className="font-normal opacity-75">at {m.company}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    {reasons.map((r, i) => (
                      <div key={i} className={`text-[12px] flex items-start gap-1.5 ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
                        <span className="font-medium text-[#EF4444] shrink-0">{r.type}:</span>
                        <span className="break-all">{r.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        );

        return (
          <div className="min-w-0 text-left">
            <div className="flex items-center gap-1.5">
              <span className={`font-semibold text-[15px] leading-snug ${isDark ? 'text-[#F8FAFC]' : 'text-[#0F172A]'}`}>
                {record.role}
              </span>
              {showPortalIcon && (
                <Tooltip title="Open company application portal">
                  <a
                    href={record.portalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center ${isDark ? 'text-[#94A3B8] hover:text-[#818CF8]' : 'text-[#64748B] hover:text-[#4F46E5]'}`}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </Tooltip>
              )}
            </div>
            <div className={`flex items-center flex-wrap gap-1.5 text-[13px] mt-0.5 ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}`}>
              <div className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-[#6366F1] shrink-0" />
                <span>{record.company}</span>
              </div>
              
              {matches.length > 0 && (
                <Popover
                  content={matchPopoverContent}
                  title={<span className={isDark ? 'text-[#F8FAFC]' : 'text-[#0F172A]'}>Similar Applications</span>}
                  trigger="click"
                  placement="right"
                  overlayInnerStyle={{
                    backgroundColor: isDark ? '#0F172A' : '#ffffff',
                    borderColor: isDark ? '#1E293B' : '#E2E8F0',
                    borderStyle: 'solid',
                    borderWidth: '1px',
                    boxShadow: isDark ? '0 10px 15px -3px rgba(0, 0, 0, 0.5)' : '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  }}
                  arrow={false}
                >
                  <Tag
                    className="cursor-pointer m-0 px-1.5 rounded text-[11px] border transition-colors font-bold bg-[#EF4444]! text-white border-[#DC2626]! hover:bg-[#DC2626]!"
                  >
                    {matches.length} Match{matches.length > 1 ? 'es' : ''}
                  </Tag>
                </Popover>
              )}
            </div>
          </div>
        );
      }
    },
    {
      title: 'Work Mode',
      dataIndex: 'workMode',
      key: 'workMode',
      width: 130,
      align: 'center' as const,
      render: (mode: string) => {
        const IconComponent = mode === 'Remote' ? Laptop : mode === 'Hybrid' ? Building : Building2;
        return (
          <span className={`inline-flex items-center gap-1.5 text-[13px] font-medium whitespace-nowrap ${isDark ? 'text-[#CBD5E1]' : 'text-[#334155]'}`}>
            <IconComponent className={`w-3.5 h-3.5 shrink-0 ${mode === 'Remote' ? 'text-[#06B6D4]' : mode === 'Hybrid' ? 'text-[#6366F1]' : 'text-[#10B981]'}`} />
            <span>{mode}</span>
          </span>
        );
      }
    },
    {
      title: 'Company Location',
      dataIndex: 'location',
      key: 'location',
      width: 165,
      align: 'center' as const,
      render: (loc: string) => (
        <span className={`inline-flex items-center gap-1.5 text-[13px] font-medium whitespace-nowrap ${isDark ? 'text-[#CBD5E1]' : 'text-[#334155]'}`}>
          <MapPin className={`w-3.5 h-3.5 shrink-0 ${isDark ? 'text-[#06B6D4]' : 'text-[#0284C7]'}`} />
          <span>{loc}</span>
        </span>
      )
    },
    {
      title: 'Submission Status',
      key: 'isApplied',
      width: 175,
      align: 'center' as const,
      render: (_: any, record: JobRecord) =>
        record.isApplied ? (
          <span className={`inline-flex items-center gap-1.5 text-[13px] font-medium whitespace-nowrap ${isDark ? 'text-[#38BDF8]' : 'text-[#0369A1]'}`}>
            <Lock className="w-3.5 h-3.5 shrink-0" />
            <span>Submitted</span>
          </span>
        ) : (
          <Tooltip title="Not yet submitted. Click to mark this job as applied and lock its status.">
            <Button
              size="small"
              onClick={() => onMarkApplied(record)}
              style={{
                backgroundColor: isDark ? 'rgba(99, 102, 241, 0.14)' : 'rgba(99, 102, 241, 0.08)',
                borderColor: isDark ? 'rgba(99, 102, 241, 0.42)' : 'rgba(99, 102, 241, 0.35)',
                color: isDark ? '#818CF8' : '#4F46E5'
              }}
              className="text-[13px] font-semibold rounded-md whitespace-nowrap"
            >
              Mark as Applied
            </Button>
          </Tooltip>
        )
    },
    {
      title: 'Applied Date',
      key: 'appliedDate',
      width: 150,
      align: 'center' as const,
      render: (_: any, record: JobRecord) =>
        record.isApplied && record.appliedDate ? (
          <span className={`inline-flex items-center gap-1.5 text-[13px] font-medium whitespace-nowrap ${isDark ? 'text-[#CBD5E1]' : 'text-[#334155]'}`}>
            <Calendar className={`w-3.5 h-3.5 shrink-0 ${isDark ? 'text-[#A855F7]' : 'text-[#7C3AED]'}`} />
            <span>{record.appliedDate}</span>
          </span>
        ) : (
          <span className={`inline-flex items-center gap-1 text-[13px] italic whitespace-nowrap ${isDark ? 'text-[#64748B]' : 'text-[#94A3B8]'}`}>
            <span>Not Applied</span>
          </span>
        )
    },
    {
      title: 'Current Stage',
      key: 'status',
      width: 195,
      align: 'center' as const,
      render: (_: any, record: JobRecord) => {
        const effectiveStatus = record.isApplied ? record.status : 'Pending';
        const colorCfg = getStatusColorConfig(effectiveStatus);

        if (!record.isApplied) {
          return (
            <Tooltip title="Locked to Pending until Submission Status is marked as applied & locked">
              <div className="flex flex-col items-center gap-1">
                <div
                  style={{ color: colorCfg.text, borderColor: colorCfg.border }}
                  className={`inline-flex items-center justify-between w-36 px-2.5 py-1 rounded-md border text-[13px] font-semibold opacity-75 cursor-not-allowed select-none ${isDark ? 'bg-[#1E293B]/70' : 'bg-slate-100'
                    }`}
                >
                  <span className="flex items-center gap-1.5">
                    <span style={{ backgroundColor: colorCfg.dot }} className="w-2 h-2 rounded-full shrink-0" />
                    <span>Pending</span>
                  </span>
                  <span className="text-xs opacity-60">▼</span>
                </div>
              </div>
            </Tooltip>
          );
        }

        return (
          <div className="flex flex-col items-center gap-1.5">
            <Select
              showSearch={false}
              value={record.status}
              onChange={(val) => onStatusChange(record.id, val)}
              className="w-36 text-[13px] status-text-select"
              popupMatchSelectWidth={false}
              style={{
                ['--stage-color' as any]: colorCfg.text,
                ['--stage-border' as any]: colorCfg.border
              }}
              labelRender={({ value }) => {
                const cfg = getStatusColorConfig(value as JobStatus);
                return (
                  <span style={{ color: cfg.text }} className="inline-flex items-center gap-1.5 text-[13px] font-semibold">
                    <span style={{ backgroundColor: cfg.dot }} className="w-2 h-2 rounded-full shrink-0" />
                    {value}
                  </span>
                );
              }}
              options={STATUS_OPTIONS.map((st) => {
                const cfg = getStatusColorConfig(st);
                return {
                  value: st,
                  label: (
                    <span style={{ color: cfg.text }} className="inline-flex items-center gap-1.5 text-[13px] font-medium">
                      <span style={{ backgroundColor: cfg.dot }} className="w-2 h-2 rounded-full shrink-0" />
                      {st}
                    </span>
                  )
                };
              })}
            />

            {record.status === 'Interview' && (
              <Button
                size="small"
                onClick={() => onOpenManageRounds(record)}
                style={{
                  color: isDark ? '#A78BFA' : '#7C3AED',
                  borderColor: isDark ? 'rgba(167, 139, 250, 0.4)' : 'rgba(124, 58, 237, 0.35)',
                  backgroundColor: isDark ? 'rgba(124, 58, 237, 0.1)' : 'rgba(124, 58, 237, 0.05)'
                }}
                className="text-[11px] font-semibold rounded-md h-6 px-2"
              >
                Manage Rounds ({record.interviewRounds?.length || 0})
              </Button>
            )}
          </div>
        );
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 220,
      align: 'center' as const,
      render: (_: any, record: JobRecord) => (
        <Space size={10} className="justify-center">
          <Tooltip title={record.isFavorite ? "Remove from Favorites" : "Add to Favorites"}>
            <Button
              size="middle"
              icon={<Star className={`w-4 h-4 ${record.isFavorite&&"text-white!"}`} fill={record.isFavorite ? "white" : "none"} />}
              onClick={() => onToggleFavorite(record)}
              className={`inline-flex items-center justify-center w-9 h-9 rounded-md border transition-all ${record.isFavorite&&"border-[#ff1493]! bg-[#ff1493]!"}`}
            />
          </Tooltip>
          <Tooltip title="View full details">
            <Button
              size="middle"
              icon={<Eye className="w-4 h-4 text-[#0EA5E9]" />}
              onClick={() => onViewJob(record)}
              className={`inline-flex items-center justify-center w-9 h-9 rounded-md border transition-all ${isDark
                  ? 'bg-[#0EA5E9]/10 border-[#0EA5E9]/35 hover:border-[#0EA5E9] hover:bg-[#0EA5E9]/20'
                  : 'bg-[#F0F9FF] border-[#BAE6FD] hover:border-[#0284C7] hover:bg-[#E0F2FE]'
                }`}
            />
          </Tooltip>
          <Tooltip title="Edit job details">
            <Button
              size="middle"
              icon={<Pencil className="w-4 h-4 text-[#6366F1]" />}
              onClick={() => onEditJob(record)}
              className={`inline-flex items-center justify-center w-9 h-9 rounded-md border transition-all ${isDark
                  ? 'bg-[#6366F1]/10 border-[#6366F1]/35 hover:border-[#6366F1] hover:bg-[#6366F1]/20'
                  : 'bg-[#EEF2FF] border-[#C7D2FE] hover:border-[#6366F1] hover:bg-[#E0E7FF]'
                }`}
            />
          </Tooltip>
          <Tooltip title="Delete job (Moves to Trash)">
            <Button
              size="middle"
              danger
              icon={<Trash2 className="w-4 h-4 text-[#F43F5E]" />}
              onClick={() => onDeleteJob(record)}
              className={`inline-flex items-center justify-center w-9 h-9 rounded-md border transition-all ${isDark
                  ? 'bg-[#F43F5E]/10 border-[#F43F5E]/35 hover:border-[#F43F5E] hover:bg-[#F43F5E]/20'
                  : 'bg-[#FFF1F2] border-[#FECDD3] hover:border-[#E11D48] hover:bg-[#FFE4E6]'
                }`}
            />
          </Tooltip>
        </Space>
      )
    }
  ];

  const totalTablePages = Math.max(1, Math.ceil(totalJobs / tablePageSize));

  return (
    <Card className={`rounded-lg overflow-hidden ${isDark ? 'bg-[#0F172A] border-[#1E293B]' : 'bg-white border-[#E2E8F0]'}`} styles={{ body: { padding: 0 } }}>
      <Table
        rowKey="id"
        rowSelection={{
          selectedRowKeys,
          onChange: (keys) => onSelectedRowKeysChange(keys),
          preserveSelectedRowKeys: true
        }}
        columns={columns}
        dataSource={jobs}
        scroll={{ x: 1110 }}
        pagination={false}
        locale={{
          emptyText: (
            <div className="py-12">
              <Empty
                description={
                  <div className="space-y-1">
                    <div className={`text-base font-semibold ${isDark ? 'text-[#F8FAFC]' : 'text-[#0F172A]'}`}>
                      {totalJobs === 0 ? 'No job applications added yet' : 'No matching jobs found'}
                    </div>
                    <div className={`text-sm ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
                      {totalJobs === 0 ? 'Start tracking by adding your first direct company application.' : 'Try clearing your search or switching filters.'}
                    </div>
                  </div>
                }
              >
                {hasActiveFilters ? (
                  <Button onClick={onResetFilters} className="rounded-md">Reset Filters</Button>
                ) : (
                  <Space>
                    <Button type="primary" onClick={onOpenAddModal} className="rounded-md">Add First Job</Button>
                  </Space>
                )}
              </Empty>
            </div>
          )
        }}
      />

      {totalJobs > 0 && (
        <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3.5 border-t ${isDark ? 'bg-[#0F172A] border-[#293548]' : 'bg-white border-[#CBD5E1]'}`}>
          <span className={`text-[13px] ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}`}>
            Showing <strong className={isDark ? 'text-[#F8FAFC]' : 'text-[#0F172A]'}>{(tablePage - 1) * tablePageSize + 1}–{Math.min(tablePage * tablePageSize, totalJobs)}</strong> of {totalJobs} jobs
          </span>

          <div className="flex flex-wrap items-center gap-5">
            <div className="flex items-center gap-2">
              <span className={`text-[13px] ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}`}>Rows per page:</span>
              <Select
                showSearch={false}
                value={tablePageSize}
                onChange={(size) => onPageChange(1, size)}
                className="w-20 text-[13px]"
                options={[5, 10, 25, 50, 100].map(s => ({
                  value: s,
                  label: String(s)
                }))}
              />
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="small"
                className="flex items-center justify-center w-8 h-8 rounded-md"
                disabled={tablePage === 1}
                onClick={() => onPageChange(tablePage - 1, tablePageSize)}
                icon={<ChevronLeft className="w-4 h-4" />}
              />
              <span className={`text-[13px] font-medium px-2 min-w-[50px] text-center ${isDark ? 'text-[#F8FAFC]' : 'text-[#0F172A]'}`}>
                {tablePage} / {totalTablePages}
              </span>
              <Button
                size="small"
                className="flex items-center justify-center w-8 h-8 rounded-md"
                disabled={tablePage === totalTablePages}
                onClick={() => onPageChange(tablePage + 1, tablePageSize)}
                icon={<ChevronRight className="w-4 h-4" />}
              />
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};