import React from 'react';
import { Card, Select, Input, Button, Popover, DatePicker, Tooltip } from 'antd';
import { Search, RotateCcw } from 'lucide-react';
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
  favoriteFilter: string;
  onFavoriteFilterChange: (val: string) => void;
  matchFilter: string;
  onMatchFilterChange: (val: string) => void;
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
  favoriteFilter,
  onFavoriteFilterChange,
  matchFilter,
  onMatchFilterChange,
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
        {/* Top Tier: All 7 Dropdown Filters with Uniform Styling */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
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
            <Select
              value={favoriteFilter}
              onChange={onFavoriteFilterChange}
              className="w-full"
              options={[
                { value: 'All', label: 'All Favorites' },
                { value: 'Favorite', label: 'Favorites Only' },
                { value: 'Not Favorite', label: 'Non-Favorites' }
              ]}
            />
          </div>

          <div>
            <Select
              value={matchFilter}
              onChange={onMatchFilterChange}
              className="w-full"
              options={[
                { value: 'All', label: 'All Matches' },
                { value: 'Match', label: 'Matches Only' },
                { value: 'No Match', label: 'Non-Matches' }
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

        {/* Bottom Tier: Search Bar & Reset Button */}
        <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t ${isDark ? 'border-[#1E293B]' : 'border-slate-100'}`}>
          <div className="w-full sm:flex-1">
            <Input
              allowClear
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              prefix={<Search className={`w-4 h-4 mr-1.5 ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`} />}
              placeholder="Search role, company, email, phone..."
            />
          </div>

          <Tooltip title="Reset all active filters and search">
            <Button
              icon={<RotateCcw className="w-4 h-4" />}
              disabled={!hasActiveFilters}
              onClick={onResetFilters}
              className="w-full sm:w-auto rounded-md shrink-0"
            >
              Reset Filters
            </Button>
          </Tooltip>
        </div>
      </div>
    </Card>
  );
};