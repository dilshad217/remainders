/**
 * ViewModeToggle Component
 * 
 * A radio button group that allows users to switch between:
 * - Year View: Shows the current year (52 weeks)
 * - Life View: Shows entire life (4160 weeks)
 */

'use client';

import { ViewMode } from '@/lib/types';

interface ViewModeToggleProps {
  /** Currently selected view mode */
  selectedMode: ViewMode;
  
  /** Callback function when mode changes */
  onChange: (mode: ViewMode) => void;
}

export default function ViewModeToggle({ selectedMode, onChange }: ViewModeToggleProps) {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        View Mode
      </label>
      
      <div className="flex gap-4">
        {/* Year View Option */}
        <label className="flex-1 relative">
          <input
            type="radio"
            name="viewMode"
            value="year"
            checked={selectedMode === 'year'}
            onChange={() => onChange('year')}
            className="peer sr-only"
          />
          <div className="
            flex flex-col items-center justify-center
            p-4 border-2 rounded-lg cursor-pointer
            transition-all
            border-gray-300 bg-white
            peer-checked:border-blue-500 peer-checked:bg-blue-50
            hover:border-gray-400
          ">
            <div className="text-2xl mb-2">📅</div>
            <div className="font-semibold text-gray-900">Year View</div>
            <div className="text-xs text-gray-500 mt-1">Current year only</div>
          </div>
        </label>

        {/* Life View Option */}
        <label className="flex-1 relative">
          <input
            type="radio"
            name="viewMode"
            value="life"
            checked={selectedMode === 'life'}
            onChange={() => onChange('life')}
            className="peer sr-only"
          />
          <div className="
            flex flex-col items-center justify-center
            p-4 border-2 rounded-lg cursor-pointer
            transition-all
            border-gray-300 bg-white
            peer-checked:border-blue-500 peer-checked:bg-blue-50
            hover:border-gray-400
          ">
            <div className="text-2xl mb-2">🌍</div>
            <div className="font-semibold text-gray-900">Life View</div>
            <div className="text-xs text-gray-500 mt-1">Full 80 years</div>
          </div>
        </label>
      </div>
      
      <p className="mt-2 text-sm text-gray-500">
        {selectedMode === 'year' 
          ? 'Shows 52 weeks of the current year'
          : 'Shows all 4,160 weeks of an 80-year life'}
      </p>
    </div>
  );
}
