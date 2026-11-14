import React from 'react';
import { Button } from 'antd';
import { Sparkles } from 'lucide-react';

interface QuickGuideProps {
  isDark: boolean;
  onHide: () => void;
}

export const QuickGuide: React.FC<QuickGuideProps> = ({ isDark, onHide }) => {
  return (
    <div className={`rounded-lg border p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 ${isDark ? 'bg-[#0F172A]/90 border-[#1E293B]' : 'bg-white border-[#CBD5E1]'}`}>
      <div className="flex items-start gap-3">
        <div className={`w-9 h-9 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${isDark ? 'bg-[#6366F1]/15 text-[#818CF8]' : 'bg-[#EEF2FF] text-[#4F46E5]'}`}>
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="space-y-1">
          <div className={`text-sm font-semibold ${isDark ? 'text-[#F8FAFC]' : 'text-[#0F172A]'}`}>
            Quick Start Guide (Cloud JSON Sync Active)
          </div>
          <div className={`text-[13px] flex flex-wrap gap-x-4 gap-y-1 ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}`}>
            <span><strong>1.</strong> Click <strong>Add Job</strong> to save a role to the cloud JSON.</span>
            <span><strong>2.</strong> Click <strong>Mark as Applied</strong> to lock submitted status.</span>
            <span><strong>3.</strong> Deleted items go to <strong>Trash</strong> for restoration or permanent deletion.</span>
          </div>
        </div>
      </div>
      <Button size="small" type="text" onClick={onHide} className={isDark ? 'text-[#94A3B8] shrink-0' : 'text-[#64748B] shrink-0'}>
        Hide
      </Button>
    </div>
  );
};