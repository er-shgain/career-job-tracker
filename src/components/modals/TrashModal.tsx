import React from 'react';
import { Modal, Button, Empty } from 'antd';
import { Trash2, RotateCcw, AlertTriangle } from 'lucide-react';
import type { JobRecord } from '../../utils/storageHelpers';

interface TrashModalProps {
  isDark: boolean;
  isOpen: boolean;
  onClose: () => void;
  trashItems: JobRecord[];
  onRestore: (job: JobRecord) => void;
  onDeleteForever: (job: JobRecord) => void;
  onEmptyTrash: () => void;
}

export const TrashModal: React.FC<TrashModalProps> = ({
  isDark,
  isOpen,
  onClose,
  trashItems,
  onRestore,
  onDeleteForever,
  onEmptyTrash
}) => {
  return (
    <Modal
      open={isOpen}
      title={
        <div className="flex items-center gap-2">
          <Trash2 className="w-4 h-4 text-[#F43F5E]" />
          <span>Trash (`trash_database.json`) — Deleted Applications ({trashItems.length})</span>
        </div>
      }
      onCancel={onClose}
      footer={[
        trashItems.length > 0 ? (
          <Button
            key="empty"
            danger
            onClick={onEmptyTrash}
            className="rounded-md"
          >
            Empty Trash Forever
          </Button>
        ) : null,
        <Button key="close" type="primary" onClick={onClose} className="rounded-md" style={{ backgroundColor: '#6366F1' }}>
          Close
        </Button>
      ]}
      width={700}
    >
      <div className="space-y-3 pt-2 max-h-[60vh] overflow-y-auto pr-1">
        {trashItems.length === 0 ? (
          <div className="py-12">
            <Empty description={<span className={isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}>Trash is empty</span>} />
          </div>
        ) : (
          trashItems.map((job) => (
            <div key={job.id} className={`p-3.5 rounded-md border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${isDark ? 'bg-[#0F172A] border-[#293548]' : 'bg-white border-[#E2E8F0]'}`}>
              <div className="space-y-1">
                <div className={`font-semibold text-sm ${isDark ? 'text-[#F8FAFC]' : 'text-[#0F172A]'}`}>
                  {job.role} at <span className="text-[#6366F1]">{job.company}</span>
                </div>
                <div className="text-xs text-[#64748B] flex items-center gap-3">
                  <span>Deleted: {job.deletedAt ? new Date(job.deletedAt).toLocaleDateString() : 'Unknown'}</span>
                  <span>CTC: {job.expectedCtc} LPA</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button
                  size="small"
                  icon={<RotateCcw className="w-3.5 h-3.5 text-[#10B981]" />}
                  onClick={() => onRestore(job)}
                  className="rounded-md font-medium text-xs"
                >
                  Restore
                </Button>
                <Button
                  size="small"
                  danger
                  icon={<AlertTriangle className="w-3.5 h-3.5" />}
                  onClick={() => onDeleteForever(job)}
                  className="rounded-md font-medium text-xs"
                >
                  Delete Forever
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </Modal>
  );
};