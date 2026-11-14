import React from 'react';
import { Button, Select } from 'antd';
import { Trash2 } from 'lucide-react';
import { STATUS_OPTIONS } from '../constants/jobConstants';
import type { JobStatus } from '../constants/jobConstants';
import type { JobRecord } from '../utils/storageHelpers';

interface BulkActionDockProps {
  isDark: boolean;
  selectedRowKeys: React.Key[];
  selectedJobs: JobRecord[];
  onDeselectAll: () => void;
  onBatchStatusChange: (status: JobStatus) => void;
  onBatchDelete: () => void;
}

export const BulkActionDock: React.FC<BulkActionDockProps> = ({
  isDark,
  selectedRowKeys,
  selectedJobs,
  onDeselectAll,
  onBatchStatusChange,
  onBatchDelete
}) => {
  if (selectedRowKeys.length === 0) return null;

  return (
    <div className="fixed bottom-5 inset-x-0 z-40 px-4 pointer-events-none">
      <div className={`max-w-4xl mx-auto pointer-events-auto rounded-lg border px-4 sm:px-5 py-3.5 shadow-2xl flex flex-wrap items-center justify-between gap-3 backdrop-blur-md ${isDark ? 'bg-[#131C31]/95 border-[#6366F1]/50 text-[#F8FAFC]' : 'bg-white/95 border-[#6366F1]/45 text-[#0F172A]'}`}>
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center justify-center px-3 py-1 rounded-md text-[13px] font-bold bg-[#6366F1] text-white">
            {selectedRowKeys.length} selected
          </span>
          <Button size="middle" onClick={onDeselectAll} className={`font-medium rounded-md ${isDark ? 'bg-[#0F172A] border-[#334155] text-[#CBD5E1]' : 'bg-[#F8FAFC] border-[#CBD5E1] text-[#334155]'}`}>
            Deselect
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Select
            size="middle"
            showSearch={false}
            placeholder="Move Stage..."
            value={null}
            disabled={!selectedJobs.some((j) => j.isApplied)}
            onChange={(val) => {
              if (val) onBatchStatusChange(val as JobStatus);
            }}
            className="w-44 text-[13px]"
            options={STATUS_OPTIONS.map((st) => ({ value: st, label: st }))}
          />
          <Button
            size="middle"
            danger
            icon={<Trash2 className="w-4 h-4" />}
            onClick={onBatchDelete}
            className="font-semibold rounded-md px-3.5"
          >
            Delete to Trash
          </Button>
        </div>
      </div>
    </div>
  );
};