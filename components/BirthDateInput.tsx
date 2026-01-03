/**
 * BirthDateInput Component
 * 
 * A date input field for users to enter their birth date.
 * Uses HTML5 date input for native date picker on all devices.
 */

'use client';

interface BirthDateInputProps {
  /** Current birth date value in YYYY-MM-DD format */
  value: string;
  
  /** Callback function when date changes */
  onChange: (date: string) => void;
}

export default function BirthDateInput({ value, onChange }: BirthDateInputProps) {
  /**
   * Get today's date in YYYY-MM-DD format for the max attribute
   * Users can't select future dates (can't be born in the future!)
   */
  const today = new Date().toISOString().split('T')[0];

  /**
   * Minimum reasonable birth date (120 years ago)
   * This is just a sanity check
   */
  const minDate = new Date();
  minDate.setFullYear(minDate.getFullYear() - 120);
  const minDateStr = minDate.toISOString().split('T')[0];

  return (
    <div className="w-full">
      <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-2">
        Birth Date
      </label>
      
      <input
        id="birthDate"
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={minDateStr}
        max={today}
        required
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
      />
      
      <p className="mt-2 text-sm text-gray-500">
        Your birth date is used to calculate weeks lived
      </p>
    </div>
  );
}
