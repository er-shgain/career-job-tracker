import React from 'react';
import { Modal, Button } from 'antd';
import { Eye, FileText, FileJson, Building2, ExternalLink, Copy, Check, Pencil } from 'lucide-react';
import type { JobRecord } from '../../utils/storageHelpers';

interface ViewJobModalProps {
  isDark: boolean;
  viewingJob: JobRecord | null;
  onClose: () => void;
  viewMode: 'plain' | 'json';
  onViewModeChange: (mode: 'plain' | 'json') => void;
  copiedJson: boolean;
  onCopyJson: (job: JobRecord) => void;
  onEditJob: (job: JobRecord) => void;
}

export const ViewJobModal: React.FC<ViewJobModalProps> = ({
  isDark,
  viewingJob,
  onClose,
  viewMode,
  onViewModeChange,
  copiedJson,
  onCopyJson,
  onEditJob
}) => {
  return (
    <Modal
      open={Boolean(viewingJob)}
      title={
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-[#6366F1]" />
          <span>Application Details</span>
        </div>
      }
      onCancel={onClose}
      footer={
        viewingJob ? (
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <Button
              icon={copiedJson ? <Check className="w-4 h-4 text-[#10B981]" /> : <Copy className="w-4 h-4" />}
              onClick={() => onCopyJson(viewingJob)}
              className="rounded-md"
            >
              {copiedJson ? 'Copied JSON' : 'Copy JSON'}
            </Button>

            <div className="flex items-center gap-2">
              <Button
                icon={<Pencil className="w-3.5 h-3.5" />}
                onClick={() => {
                  const target = viewingJob;
                  onClose();
                  onEditJob(target);
                }}
                className="rounded-md"
              >
                Edit
              </Button>
              <Button
                type="primary"
                onClick={onClose}
                style={{ backgroundColor: '#6366F1', borderColor: '#6366F1' }}
                className="rounded-md"
              >
                Close
              </Button>
            </div>
          </div>
        ) : null
      }
      width={640}
    >
      {viewingJob && (
        <div className="space-y-4 pt-2">
          <div className={`flex items-center justify-between p-2 rounded-md border ${isDark ? 'bg-[#131C31] border-[#1E293B]' : 'bg-[#F8FAFC] border-[#E2E8F0]'}`}>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => onViewModeChange('plain')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] font-semibold cursor-pointer border ${viewMode === 'plain' ? 'bg-[#6366F1] text-white border-[#6366F1]' : 'bg-transparent border-transparent'}`}
              >
                <FileText className="w-3.5 h-3.5" /> Plain View
              </button>
              <button
                type="button"
                onClick={() => onViewModeChange('json')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] font-semibold cursor-pointer border ${viewMode === 'json' ? 'bg-[#6366F1] text-white border-[#6366F1]' : 'bg-transparent border-transparent'}`}
              >
                <FileJson className="w-3.5 h-3.5" /> JSON View
              </button>
            </div>
            <span className="text-xs text-[#64748B] px-2">ID: {viewingJob.id}</span>
          </div>

          {viewMode === 'plain' ? (
            <div className="space-y-4">
              <div className={`p-4 rounded-md border ${isDark ? 'bg-[#131C31]/70 border-[#1E293B]' : 'bg-[#F8FAFC] border-[#E2E8F0]'}`}>
                <div className={`text-lg font-bold leading-snug ${isDark ? 'text-[#F8FAFC]' : 'text-[#0F172A]'}`}>
                  {viewingJob.role}
                </div>
                <div className={`flex items-center gap-1.5 text-sm mt-1 ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}`}>
                  <Building2 className="w-4 h-4 text-[#6366F1]" />
                  <span className="font-medium">{viewingJob.company}</span>
                </div>
                <div className="mt-2.5 flex items-center gap-2">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-md border text-indigo-500 border-indigo-500/30 bg-indigo-500/10">
                    Stage: {viewingJob.isApplied ? viewingJob.status : 'Pending'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className={`p-3 rounded-md border ${isDark ? 'bg-[#0F172A] border-[#1E293B]' : 'bg-white border-[#E2E8F0]'}`}>
                  <div className="text-xs text-[#64748B] mb-1">Work Mode</div>
                  <div className={`text-sm font-semibold ${isDark ? 'text-[#CBD5E1]' : 'text-[#334155]'}`}>{viewingJob.workMode}</div>
                </div>

                <div className={`p-3 rounded-md border ${isDark ? 'bg-[#0F172A] border-[#1E293B]' : 'bg-white border-[#E2E8F0]'}`}>
                  <div className="text-xs text-[#64748B] mb-1">Company Location</div>
                  <div className={`text-sm font-semibold ${isDark ? 'text-[#CBD5E1]' : 'text-[#334155]'}`}>{viewingJob.location}</div>
                </div>

                <div className={`p-3 rounded-md border ${isDark ? 'bg-[#0F172A] border-[#1E293B]' : 'bg-white border-[#E2E8F0]'}`}>
                  <div className="text-xs text-[#64748B] mb-1">Expected Salary (CTC)</div>
                  <div className={`text-sm font-semibold ${isDark ? 'text-[#34D399]' : 'text-[#047857]'}`}>{Number(viewingJob.expectedCtc || 0).toFixed(1)} LPA</div>
                </div>

                <div className={`p-3 rounded-md border ${isDark ? 'bg-[#0F172A] border-[#1E293B]' : 'bg-white border-[#E2E8F0]'}`}>
                  <div className="text-xs text-[#64748B] mb-1">Submission Status & Date</div>
                  <div className={`text-sm font-semibold ${viewingJob.isApplied ? 'text-[#38BDF8]' : 'text-[#FBBF24]'}`}>
                    {viewingJob.isApplied ? `Submitted (${viewingJob.appliedDate || 'No date'})` : 'Not Yet Submitted'}
                  </div>
                </div>

                <div className={`p-3 rounded-md border ${isDark ? 'bg-[#0F172A] border-[#1E293B]' : 'bg-white border-[#E2E8F0]'}`}>
                  <div className="text-xs text-[#64748B] mb-1">Company Email</div>
                  {viewingJob.companyEmail ? (
                    <a href={`mailto:${viewingJob.companyEmail}`} className="text-sm font-medium text-[#6366F1] hover:underline break-all">
                      {viewingJob.companyEmail}
                    </a>
                  ) : (
                    <span className="text-sm text-[#64748B]">Not provided</span>
                  )}
                </div>

                <div className={`p-3 rounded-md border ${isDark ? 'bg-[#0F172A] border-[#1E293B]' : 'bg-white border-[#E2E8F0]'}`}>
                  <div className="text-xs text-[#64748B] mb-1">Company Phone</div>
                  {viewingJob.companyPhone ? (
                    <a href={`tel:${viewingJob.companyPhone}`} className={`text-sm font-medium hover:underline ${isDark ? 'text-[#F8FAFC]' : 'text-[#0F172A]'}`}>
                      {viewingJob.companyPhone}
                    </a>
                  ) : (
                    <span className="text-sm text-[#64748B]">Not provided</span>
                  )}
                </div>

                <div className={`p-3 rounded-md border sm:col-span-2 ${isDark ? 'bg-[#0F172A] border-[#1E293B]' : 'bg-white border-[#E2E8F0]'}`}>
                  <div className="text-xs text-[#64748B] mb-1">Company Career Portal Link</div>
                  {viewingJob.portalUrl ? (
                    <a href={viewingJob.portalUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm font-medium text-[#6366F1] hover:underline break-all">
                      <span>{viewingJob.portalUrl}</span>
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                    </a>
                  ) : (
                    <span className="text-sm text-[#64748B]">No link saved</span>
                  )}
                </div>
              </div>

              {viewingJob.interviewRounds && viewingJob.interviewRounds.length > 0 && (
                <div className={`p-3.5 rounded-md border ${isDark ? 'bg-[#0F172A] border-[#1E293B]' : 'bg-white border-[#E2E8F0]'}`}>
                  <div className="text-xs text-[#7C3AED] font-bold uppercase tracking-wider mb-2">Interview Rounds</div>
                  <div className="space-y-2">
                    {viewingJob.interviewRounds.map((r, i) => (
                      <div key={r.id || i} className="p-2 rounded-md bg-slate-500/5 border border-slate-500/10 space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold">{r.name} ({r.date || 'No date'})</span>
                          <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-400 font-semibold">{r.status}</span>
                        </div>
                        {r.notes && <div className="text-xs text-slate-400">{r.notes}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className={`p-3.5 rounded-md border ${isDark ? 'bg-[#0F172A] border-[#1E293B]' : 'bg-white border-[#E2E8F0]'}`}>
                <div className="text-xs text-[#64748B] mb-1">Notes / Referral / Round Details</div>
                <p className={`text-sm m-0 whitespace-pre-wrap ${viewingJob.notes ? (isDark ? 'text-[#CBD5E1]' : 'text-[#334155]') : 'text-[#64748B] italic'}`}>
                  {viewingJob.notes || 'No notes added for this role.'}
                </p>
              </div>
            </div>
          ) : (
            <div className="relative">
              <pre className={`p-4 rounded-md border text-xs font-mono overflow-x-auto max-h-80 m-0 leading-relaxed ${isDark ? 'bg-[#090D16] border-[#1E293B] text-[#38BDF8]' : 'bg-[#F8FAFC] border-[#CBD5E1] text-[#0F172A]'}`}>
                {JSON.stringify(viewingJob, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
};