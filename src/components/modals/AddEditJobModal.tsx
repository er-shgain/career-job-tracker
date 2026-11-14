import React from 'react';
import { Modal, Form, Input, InputNumber, Select, Button, DatePicker, Switch, Space } from 'antd';
import type { FormInstance } from 'antd';
import { Briefcase, Trash2 } from 'lucide-react';
import { WORK_MODES, STATUS_OPTIONS } from '../../constants/jobConstants';
import { getStatusColorConfig } from '../../utils/storageHelpers';
import type { JobRecord, InterviewRound } from '../../utils/storageHelpers';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';

interface AddEditJobModalProps {
  isDark: boolean;
  isOpen: boolean;
  onClose: () => void;
  editingJob: JobRecord | null;
  form: FormInstance;
  formValues: any;
  onValuesChange: () => void;
  onFinish: (values: any) => void;
  modalIsApplied: boolean;
  onModalIsAppliedChange: (checked: boolean) => void;
  modalRounds: InterviewRound[];
  onAddRound: () => void;
  onUpdateRound: (index: number, field: keyof InterviewRound, value: any) => void;
  onRemoveRound: (index: number) => void;
  cityOptions: { value: string; label: string }[];
  isFormValid: boolean;
  isFormDirty: boolean;
}

export const AddEditJobModal: React.FC<AddEditJobModalProps> = ({
  isDark,
  isOpen,
  onClose,
  editingJob,
  form,
  onValuesChange,
  onFinish,
  modalIsApplied,
  onModalIsAppliedChange,
  modalRounds,
  onAddRound,
  onUpdateRound,
  onRemoveRound,
  cityOptions,
  isFormValid,
  isFormDirty
}) => {
  const effectiveModalApplied = editingJob?.isApplied ? true : modalIsApplied;

  return (
    <Modal
      open={isOpen}
      title={
        <div className="flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-[#6366F1]" />
          <span>{editingJob ? 'Edit Job Application' : 'Add Direct Job Application'}</span>
        </div>
      }
      onCancel={onClose}
      footer={null}
      destroyOnHidden
      width={620}
    >
      <Form
        form={form}
        layout="vertical"
        onValuesChange={onValuesChange}
        onFinish={onFinish}
        className="pt-2"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
          <Form.Item name="role" label={<span className={`text-[13px] font-semibold ${isDark ? 'text-[#CBD5E1]' : 'text-[#334155]'}`}>Job Role / Title</span>} rules={[{ required: true, message: 'Please enter the job role' }]}>
            <Input placeholder="e.g., Frontend React Developer" />
          </Form.Item>

          <Form.Item name="company" label={<span className={`text-[13px] font-semibold ${isDark ? 'text-[#CBD5E1]' : 'text-[#334155]'}`}>Company Name</span>} rules={[{ required: true, message: 'Please enter the company name' }]}>
            <Input placeholder="e.g., Razorpay" />
          </Form.Item>

          <Form.Item name="workMode" label={<span className={`text-[13px] font-semibold ${isDark ? 'text-[#CBD5E1]' : 'text-[#334155]'}`}>Work Mode</span>} rules={[{ required: true }]}>
            <Select showSearch={false} options={WORK_MODES.map((mode) => ({ value: mode, label: mode }))} />
          </Form.Item>

          <Form.Item name="location" label={<span className={`text-[13px] font-semibold ${isDark ? 'text-[#CBD5E1]' : 'text-[#334155]'}`}>Company Location (City)</span>} rules={[{ required: true, message: 'Please select a city' }]}>
            <Select showSearch optionFilterProp="label" placeholder="Search & select city" options={cityOptions} />
          </Form.Item>

          <Form.Item name="expectedCtc" label={<span className={`text-[13px] font-semibold ${isDark ? 'text-[#CBD5E1]' : 'text-[#334155]'}`}>Expected Salary (CTC)</span>} rules={[{ required: true, message: 'Enter expected CTC in LPA' }]}>
            <Space.Compact style={{ width: '100%' }}>
              <InputNumber min={0} max={200} step={0.5} precision={1} className="w-full" placeholder="e.g., 8.5" />
              <span className="ant-input-group-addon">LPA</span>
            </Space.Compact>
          </Form.Item>

          <Form.Item
            name="status"
            label={
              <span className={`text-[13px] font-semibold flex items-center gap-1.5 ${isDark ? 'text-[#CBD5E1]' : 'text-[#334155]'}`}>
                <span>Current Stage</span>
                {!effectiveModalApplied && <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-[#1E293B] text-[#94A3B8]">Locked to Pending</span>}
              </span>
            }
            rules={[{ required: true }]}
          >
            <Select
              showSearch={false}
              disabled={!effectiveModalApplied}
              options={STATUS_OPTIONS.map((st) => {
                const cfg = getStatusColorConfig(st);
                return {
                  value: st,
                  label: <span style={{ color: cfg.text }} className="font-medium">{st}</span>
                };
              })}
            />
          </Form.Item>
        </div>

        {/* Conditional Interview Rounds Builder in Modal */}
        <Form.Item noStyle shouldUpdate={(prev, cur) => prev.status !== cur.status || prev.isApplied !== cur.isApplied}>
          {({ getFieldValue }) => {
            const currentStatus = getFieldValue('status');
            const isAppliedVal = getFieldValue('isApplied');
            if (currentStatus === 'Interview' && isAppliedVal) {
              return (
                <div className={`p-4 rounded-md border mb-4 space-y-3 ${isDark ? 'bg-[#131C31] border-[#334155]' : 'bg-[#F8FAFC] border-[#CBD5E1]'}`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-[#A78BFA]' : 'text-[#7C3AED]'}`}>
                      Interview Rounds ({modalRounds.length})
                    </span>
                    <Button
                      size="small"
                      type="dashed"
                      onClick={onAddRound}
                      className="rounded-md text-xs"
                    >
                      + Add Round
                    </Button>
                  </div>

                  {modalRounds.length === 0 ? (
                    <p className="text-xs text-[#64748B] italic m-0">No rounds added yet. Click &quot;+ Add Round&quot; to schedule.</p>
                  ) : (
                    <div className="space-y-3">
                      {modalRounds.map((round, idx) => (
                        <div key={round.id} className={`p-3 rounded-md border space-y-2.5 ${isDark ? 'bg-[#0F172A] border-[#293548]' : 'bg-white border-[#E2E8F0]'}`}>
                          <div className="flex items-center justify-between gap-2">
                            <Input
                              size="small"
                              value={round.name}
                              onChange={(e) => onUpdateRound(idx, 'name', e.target.value)}
                              placeholder="Round name (e.g., Technical 1)"
                              className="w-full sm:w-48"
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
              );
            }
            return null;
          }}
        </Form.Item>

        {/* Submission Toggle */}
        {!editingJob?.isApplied ? (
          <div className={`p-4 rounded-md border mb-4 ${isDark ? 'bg-[#131C31] border-[#1E293B]' : 'bg-[#F8FAFC] border-[#E2E8F0]'}`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className={`text-sm font-semibold ${isDark ? 'text-[#F8FAFC]' : 'text-[#0F172A]'}`}>
                  Have you submitted this application?
                </span>
                <p className={`text-[13px] mt-1 m-0 ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}`}>
                  Tip: Once turned ON and saved, this stays locked so you never lose track.
                </p>
              </div>
              <Form.Item name="isApplied" valuePropName="checked" className="m-0">
                <Switch
                  checked={modalIsApplied}
                  checkedChildren="Yes, Applied"
                  unCheckedChildren="Not Yet"
                  onChange={(checked) => {
                    onModalIsAppliedChange(checked);
                    form.setFieldValue('isApplied', checked);
                    if (checked && !form.getFieldValue('appliedDate')) {
                      form.setFieldValue('appliedDate', dayjs());
                    } else if (!checked) {
                      form.setFieldValue('status', 'Pending');
                    }
                  }}
                />
              </Form.Item>
            </div>
            {effectiveModalApplied && (
              <Form.Item name="appliedDate" label={<span className={`text-[13px] font-semibold ${isDark ? 'text-[#CBD5E1]' : 'text-[#334155]'}`}>Date Submitted</span>} className="mt-3 mb-0">
                <DatePicker className="w-full" format="YYYY-MM-DD" />
              </Form.Item>
            )}
          </div>
        ) : (
          <div className={`p-3.5 rounded-md border mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${isDark ? 'bg-[#131C31] border-[#1E293B]' : 'bg-[#F8FAFC] border-[#E2E8F0]'}`}>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md border text-xs font-semibold text-[#0369A1] bg-[#0369A1]/10 border-[#0369A1]/30">
              Submitted (Locked)
            </span>
            <Form.Item name="appliedDate" label={<span className={`text-xs font-semibold ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}`}>Date Submitted</span>} className="m-0 sm:w-48">
              <DatePicker className="w-full" format="YYYY-MM-DD" />
            </Form.Item>
          </div>
        )}

        <Form.Item name="portalUrl" label={<span className={`text-[13px] font-semibold ${isDark ? 'text-[#CBD5E1]' : 'text-[#334155]'}`}>Company Career Portal Link (Optional)</span>}>
          <Input placeholder="https://careers.company.com/jobs/..." />
        </Form.Item>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
          <Form.Item name="companyEmail" label={<span className={`text-[13px] font-semibold ${isDark ? 'text-[#CBD5E1]' : 'text-[#334155]'}`}>Company Email (Optional)</span>} rules={[{ type: 'email', message: 'Please enter a valid email address' }]}>
            <Input placeholder="e.g., careers@company.com" />
          </Form.Item>

          <Form.Item name="companyPhone" label={<span className={`text-[13px] font-semibold ${isDark ? 'text-[#CBD5E1]' : 'text-[#334155]'}`}>Company Phone (Optional)</span>}>
            <Input placeholder="e.g., +91 98765 43210" />
          </Form.Item>
        </div>

        <Form.Item name="notes" label={<span className={`text-[13px] font-semibold ${isDark ? 'text-[#CBD5E1]' : 'text-[#334155]'}`}>Notes / Referral / Round Details (Optional)</span>}>
          <Input.TextArea rows={2} placeholder="e.g., Referred by alumni..." />
        </Form.Item>

        <div className="flex items-center justify-end gap-2 pt-2">
          <Button onClick={onClose} className="rounded-md">
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            disabled={!isFormValid || !isFormDirty}
            style={{
              backgroundColor: '#6366F1',
              borderColor: '#6366F1',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.35)'
            }}
            className="font-semibold rounded-md"
          >
            {editingJob ? 'Save Changes' : 'Save Job Application'}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};