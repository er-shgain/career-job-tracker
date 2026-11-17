import React from 'react';
import { Card, Select, Input, Button, Popover, DatePicker, Tooltip, Switch } from 'antd';
import { Search, RotateCcw, Star, CopyCheck } from 'lucide-react';
import { STATUS_OPTIONS, WORK_MODES, DATE_FILTER_OPTIONS } from '../constants/jobConstants';
import type { Dayjs } from 'dayjs';

interface FilterToolbarProps {
  isDark: boolean;
  searchQuery: string;
  onSearchChange: (val: string) => void;
  statusFilter: string;
  onStatusFilterChange: (val: string) => void;
  workModeFilter: string;
  onWorkModeFilterChange: (val: string) => void;
  locationFilter: string;
  onLocationFilterChange: (val: string) => void;
  appliedFilter: string;
  onAppliedFilterChange: (val: string) => void;
  favoriteOnly: boolean;
  onFavoriteOnlyChange: (checked: boolean) => void;
  matchOnly: boolean;
  onMatchOnlyChange: (checked: boolean) => void;
  dateFilter: string;
  onDateFilterChange: (val: string) => void;
  customDateRange: [Dayjs | null, Dayjs | null] | null;
  onCustomDateRangeChange: (dates: [Dayjs | null, Dayjs | null] | null) => void;
  isCustomDatePopoverOpen: boolean;
  onCustomDatePopoverOpenChange: (open: boolean) => void;
  cityOptions: { value: string; label: string }[];
  hasActiveFilters: boolean;
  onResetFilters: () => void;
}

export const FilterToolbar: React.FC<FilterToolbarProps> = ({
  isDark,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  workModeFilter,
  onWorkModeFilterChange,
  locationFilter,
  onLocationFilterChange,
  appliedFilter,
  onAppliedFilterChange,
  favoriteOnly,
  onFavoriteOnlyChange,
  matchOnly,
  onMatchOnlyChange,
  dateFilter,
  onDateFilterChange,
  customDateRange,
  onCustomDateRangeChange,
  isCustomDatePopoverOpen,
  onCustomDatePopoverOpenChange,
  cityOptions,
  hasActiveFilters,
  onResetFilters
}) => {
  return (
    <Card className={`rounded-xl shadow-sm ${isDark ? 'bg-[#0F172A] border-[#1E293B]' : 'bg-white border-[#E2E8F0]'}`} styles={{ body: { padding: '18px' } }}>
      <div className="space-y-4">
        {/* Top Tier: Primary Dropdown Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          <div>
            <Select
              value={statusFilter}
              onChange={onStatusFilterChange}
              className="w-full"
              options={[
                { value: 'All', label: 'All Stages' },
                ...STATUS_OPTIONS.map((st) => ({ value: st, label: st }))
              ]}
            />
          </div>

          <div>
            <Select
              value={workModeFilter}
              onChange={onWorkModeFilterChange}
              className="w-full"
              options={[{ value: 'All', label: 'All Work Modes' }, ...WORK_MODES.map((m) => ({ value: m, label: m }))]}
            />
          </div>

          <div>
            <Select
              showSearch
              optionFilterProp="label"
              value={locationFilter}
              onChange={onLocationFilterChange}
              className="w-full"
              options={[{ value: 'All', label: 'All Locations' }, ...cityOptions]}
            />
          </div>

          <div>
            <Select
              value={appliedFilter}
              onChange={onAppliedFilterChange}
              className="w-full"
              options={[
                { value: 'All', label: 'All Submissions' },
                { value: 'Applied', label: 'Submitted (Locked)' },
                { value: 'Not Applied', label: 'Not Yet Submitted' }
              ]}
            />
          </div>

          <div>
            <Popover
              trigger="click"
              open={isCustomDatePopoverOpen && dateFilter === 'Custom'}
              onOpenChange={(open) => {
                if (dateFilter === 'Custom') {
                  onCustomDatePopoverOpenChange(open);
                }
              }}
              content={
                <div className="p-2 space-y-2">
                  <div className={`text-xs font-semibold ${isDark ? 'text-[#F8FAFC]' : 'text-[#0F172A]'}`}>
                    Select Date Range:
                  </div>
                  <DatePicker.RangePicker
                    value={customDateRange}
                    onChange={(dates) => {
                      onCustomDateRangeChange(dates as [Dayjs | null, Dayjs | null] | null);
                      if (dates && dates[0] && dates[1]) {
                        onCustomDatePopoverOpenChange(false);
                      }
                    }}
                    format="YYYY-MM-DD"
                    autoFocus
                  />
                </div>
              }
            >
              <div className="w-full">
                <Select
                  value={dateFilter}
                  onChange={(val) => {
                    onDateFilterChange(val);
                    if (val === 'Custom') {
                      onCustomDatePopoverOpenChange(true);
                    } else {
                      onCustomDateRangeChange(null);
                      onCustomDatePopoverOpenChange(false);
                    }
                  }}
                  className="w-full"
                  options={DATE_FILTER_OPTIONS}
                />
              </div>
            </Popover>
          </div>
        </div>

        {/* Bottom Tier: Search bar, Toggle Switches & Reset */}
        <div className={`flex flex-col md:flex-row items-center justify-between gap-4 pt-3 border-t ${isDark ? 'border-[#1E293B]' : 'border-slate-100'}`}>
          {/* Search Input */}
          <div className="w-full md:w-72 lg:w-96 shrink-0">
            <Input
              allowClear
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              prefix={<Search className={`w-4 h-4 mr-1.5 ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`} />}
              placeholder="Search role, company, email, phone..."
            />
          </div>

          {/* Center/Right Action Toggles & Reset Button */}
          <div className="flex flex-wrap items-center justify-between md:justify-end w-full gap-4">
            <div className="flex items-center gap-5">
              {/* Favorites Toggle Pill */}
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-colors ${
                favoriteOnly 
                  ? (isDark ? 'bg-[#F59E0B]/15 border-[#F59E0B]/40' : 'bg-[#FFFBEB] border-[#FDE68A]') 
                  : (isDark ? 'bg-[#1E293B]/50 border-[#334155]' : 'bg-slate-50 border-slate-200')
              }`}>
                <Star className="w-4 h-4 text-[#F59E0B]" fill={favoriteOnly ? "currentColor" : "none"} />
                <span className={`text-[13px] font-medium ${isDark ? 'text-[#CBD5E1]' : 'text-[#334155]'}`}>Favorites</span>
                <Switch checked={favoriteOnly} onChange={onFavoriteOnlyChange} size="small" />
              </div>

              {/* Matches Toggle Pill */}
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-colors ${
                matchOnly 
                  ? (isDark ? 'bg-[#EF4444]/15 border-[#EF4444]/40' : 'bg-[#FEF2F2] border-[#FECACA]') 
                  : (isDark ? 'bg-[#1E293B]/50 border-[#334155]' : 'bg-slate-50 border-slate-200')
              }`}>
                <CopyCheck className="w-4 h-4 text-[#EF4444]" />
                <span className={`text-[13px] font-medium ${isDark ? 'text-[#CBD5E1]' : 'text-[#334155]'}`}>Matches</span>
                <Switch checked={matchOnly} onChange={onMatchOnlyChange} size="small" />
              </div>
            </div>

            <Tooltip title="Reset all active filters and search">
              <Button 
                icon={<RotateCcw className="w-4 h-4" />} 
                disabled={!hasActiveFilters} 
                onClick={onResetFilters} 
                className="rounded-md"
              >
                Reset Filters
              </Button>
            </Tooltip>
          </div>
        </div>
      </div>
    </Card>
  );
};