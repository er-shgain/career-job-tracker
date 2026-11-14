import React from 'react';
import { Card } from 'antd';
import { Layers, Clock, CheckCircle2, Trophy, XCircle } from 'lucide-react';

interface StatCardsProps {
  isDark: boolean;
  stats: {
    total: number;
    pending: number;
    inProgress: number;
    hired: number;
    rejected: number;
  };
}

export const StatCards: React.FC<StatCardsProps> = ({ isDark, stats }) => {
  const cardData = [
    { label: 'Total Saved', sub: 'All tracked roles', value: stats.total, icon: <Layers className="w-4 h-4 text-[#6366F1]" /> },
    { label: 'Waiting for Reply', sub: 'Applied & Pending', value: stats.pending, icon: <Clock className="w-4 h-4 text-[#F59E0B]" /> },
    { label: 'In Progress', sub: 'Shortlisted & Interview', value: stats.inProgress, icon: <CheckCircle2 className="w-4 h-4 text-[#38BDF8]" /> },
    { label: 'Offers Received', sub: 'Hired roles', value: stats.hired, icon: <Trophy className="w-4 h-4 text-[#10B981]" /> },
    { label: 'Not Selected', sub: 'Closed / Rejected', value: stats.rejected, icon: <XCircle className="w-4 h-4 text-[#F43F5E]" /> }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
      {cardData.map((stat) => (
        <Card key={stat.label} className={`rounded-lg ${isDark ? 'bg-[#0F172A] border-[#1E293B]' : 'bg-white border-[#E2E8F0]'}`} styles={{ body: { padding: '16px' } }}>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className={`text-[13px] font-medium ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}`}>{stat.label}</span>
            <span className={`w-7 h-7 rounded-md flex items-center justify-center ${isDark ? 'bg-[#131C31]' : 'bg-[#F1F5F9]'}`}>{stat.icon}</span>
          </div>
          <div className={`text-2xl font-bold leading-tight ${isDark ? 'text-[#F8FAFC]' : 'text-[#0F172A]'}`}>{stat.value}</div>
          <div className="text-xs mt-1 text-[#64748B]">{stat.sub}</div>
        </Card>
      ))}
    </div>
  );
};