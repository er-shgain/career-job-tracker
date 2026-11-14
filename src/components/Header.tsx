import React from 'react';
import { Button, Tooltip, Badge } from 'antd';
import { Briefcase, Sun, Moon, HelpCircle, Plus, Trash2 } from 'lucide-react';

interface HeaderProps {
  isDark: boolean;
  onToggleTheme: () => void;
  showQuickGuide: boolean;
  onToggleQuickGuide: () => void;
  trashCount: number;
  onOpenTrash: () => void;
  onOpenAddModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isDark,
  onToggleTheme,
  showQuickGuide,
  onToggleQuickGuide,
  trashCount,
  onOpenTrash,
  onOpenAddModal
}) => {
  return (
    <header className={`sticky top-0 z-30 border-b backdrop-blur-md ${isDark ? 'bg-[#090D16]/85 border-[#1E293B]' : 'bg-white/90 border-[#E2E8F0]'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-linear-to-br from-[#6366F1] to-[#06B6D4] flex items-center justify-center shadow-md shadow-indigo-500/25 shrink-0">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className={`text-lg sm:text-xl font-bold tracking-tight m-0 leading-tight ${isDark ? 'text-[#F8FAFC]' : 'text-[#0F172A]'}`}>
              Job Application Tracker
            </h1>
            <p className={`text-xs sm:text-[13px] m-0 ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
              Cloud Firestore Database Sync
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {!showQuickGuide && (
            <Button
              size="small"
              icon={<HelpCircle className="w-3.5 h-3.5" />}
              onClick={onToggleQuickGuide}
              className="rounded-md"
            >
              Guide
            </Button>
          )}

          <Tooltip title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
            <Button
              icon={isDark ? <Sun className="w-4 h-4 text-[#FBBF24]" /> : <Moon className="w-4 h-4 text-[#475569]" />}
              onClick={onToggleTheme}
              className="rounded-md font-medium"
            >
              <span className="hidden sm:inline">{isDark ? 'Light' : 'Dark'}</span>
            </Button>
          </Tooltip>

          <Tooltip title="View Trash (Deleted Applications)">
            <Badge count={trashCount} offset={[-2, 2]}>
              <Button
                icon={<Trash2 className="w-4 h-4 text-[#F43F5E]" />}
                onClick={onOpenTrash}
                className="rounded-md"
              >
                <span className="hidden sm:inline">Trash</span>
              </Button>
            </Badge>
          </Tooltip>

          <Button
            type="primary"
            icon={<Plus className="w-4 h-4" />}
            onClick={onOpenAddModal}
            style={{
              backgroundColor: '#6366F1',
              borderColor: '#6366F1',
              boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)'
            }}
            className="rounded-md font-semibold px-4"
          >
            Add Job
          </Button>
        </div>
      </div>
    </header>
  );
};