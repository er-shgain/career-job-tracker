import React from 'react';
import { Modal, Button, Input, Select, DatePicker } from 'antd';
import { Sparkles, Trash2 } from 'lucide-react';
import type { JobRecord, InterviewRound } from '../../utils/storageHelpers';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

interface ManageRoundsModalProps {
  isDark: boolean;
  managingRoundsJob: JobRecord | null;
  onClose: () => void;
  tempRounds: InterviewRound[];
  onAddRound: () => void;
  onUpdateRound: (index: number, field: keyof InterviewRound, value: any) => void;
  onRemoveRound: (index: number) => void;
  onSaveRounds: () => void;
}

export const ManageRoundsModal: React.FC<ManageRoundsModalProps> = ({
  isDark,
  managingRoundsJob,
  onClose,
  tempRounds,
  onAddRound,
  onUpdateRound,
  onRemoveRound,
  onSaveRounds
}) => {
  return (
    <Modal
      open={Boolean(managingRoundsJob)}
      title={
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#7C3AED]" />
          <span>Manage Interview Rounds — {managingRoundsJob?.role} ({managingRoundsJob?.company})</span>
        </div>
      }
      onCancel={onClose}
      onOk={onSaveRounds}
      okText="Save Rounds"
      width={600}
    >
      {managingRoundsJob && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7C3AED]">Scheduled Rounds ({tempRounds.length})</span>
            <Button
              size="small"
              type="dashed"
              onClick={onAddRound}
              className="rounded-md text-xs"
            >
              + Add Round
            </Button>
          </div>

          {tempRounds.length === 0 ? (
            <p className="text-xs text-[#64748B] italic">No interview rounds added yet.</p>
          ) : (
            <div className="space-y-3">
              {tempRounds.map((round, idx) => (
                <div key={round.id} className={`p-3 rounded-md border space-y-2.5 ${isDark ? 'bg-[#0F172A] border-[#293548]' : 'bg-white border-[#E2E8F0]'}`}>
                  <div className="flex items-center justify-between gap-2">
                    <Input
                      size="small"
                      value={round.name}
                      onChange={(e) => onUpdateRound(idx, 'name', e.target.value)}
                      placeholder="Round name"
                      className="w-full sm:w-44"
                    />
                    <DatePicker
                      size="small"
                      value={round.date ? (dayjs(round.date) as any) : null}
                      onChange={(d: Dayjs | null) => onUpdateRound(idx, 'date', d ? d.format('YYYY-MM-DD') : '')}
                      format="YYYY-MM-DD"
                      className="w-full sm:w-36"
                    />
                    <Select
                      size="small"
                      value={round.status}
                      onChange={(val) => onUpdateRound(idx, 'status', val)}
                      className="w-full sm:w-32"
                      options={[
                        { value: 'Scheduled', label: 'Scheduled' },
                        { value: 'Completed', label: 'Completed' },
                        { value: 'Cleared', label: 'Cleared' },
                        { value: 'Rejected', label: 'Rejected' }
                      ]}
                    />
                    <Button
                      size="small"
                      danger
                      type="text"
                      icon={<Trash2 className="w-4 h-4" />}
                      onClick={() => onRemoveRound(idx)}
                    />
                  </div>
                  <Input
                    size="small"
                    value={round.notes || ''}
                    onChange={(e) => onUpdateRound(idx, 'notes', e.target.value)}
                    placeholder="Round notes or feedback (optional)"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </Modal>
  );
};