/**
 * Chronos - Main Page Component
 * 
 * This is the main page of the application where users:
 * 1. Enter their birth date
 * 2. Select their phone model
 * 3. Choose a theme color
 * 4. Select view mode (Year or Life)
 * 5. Generate a wallpaper URL
 * 6. View setup instructions for automation
 * 
 * All user preferences are saved to localStorage for persistence.
 */

'use client';

import { useState, useEffect } from 'react';
import { UserProfile, DeviceModel } from '@/lib/types';
import DeviceSelector from '@/components/DeviceSelector';
import BirthDateInput from '@/components/BirthDateInput';
import ThemeColorPicker from '@/components/ThemeColorPicker';
import ViewModeToggle from '@/components/ViewModeToggle';
import SetupInstructions from '@/components/SetupInstructions';

/**
 * localStorage key for storing user profile
 */
const STORAGE_KEY = 'chronos-user-profile';

/**
 * Default theme color (Coral)
 */
const DEFAULT_THEME_COLOR = '#FF6B35';

export default function Home() {
  // State for user profile data
  const [birthDate, setBirthDate] = useState('');
  const [themeColor, setThemeColor] = useState(DEFAULT_THEME_COLOR);
  const [selectedDevice, setSelectedDevice] = useState<DeviceModel | null>(null);
  const [viewMode, setViewMode] = useState<'year' | 'life'>('life');
  
  // State for generated wallpaper URL
  const [wallpaperUrl, setWallpaperUrl] = useState('');
  
  // State for copy feedback
  const [copied, setCopied] = useState(false);

  /**
   * Load user profile from localStorage on component mount
   */
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem(STORAGE_KEY);
      if (savedProfile) {
        const profile: UserProfile = JSON.parse(savedProfile);
        setBirthDate(profile.birthDate);
        setThemeColor(profile.themeColor);
        setViewMode(profile.viewMode);
        
        // Reconstruct device object
        if (profile.device) {
          setSelectedDevice({
            brand: '', // Brand is not stored, but it's okay
            model: profile.device.modelName,
            width: profile.device.width,
            height: profile.device.height,
          });
        }
      }
    } catch (error) {
      console.error('Failed to load profile from localStorage:', error);
    }
  }, []);

  /**
   * Save user profile to localStorage whenever it changes
   */
  useEffect(() => {
    if (birthDate && selectedDevice) {
      const profile: UserProfile = {
        birthDate,
        themeColor,
        device: {
          modelName: selectedDevice.model,
          width: selectedDevice.width,
          height: selectedDevice.height,
        },
        viewMode,
      };
      
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
      } catch (error) {
        console.error('Failed to save profile to localStorage:', error);
      }
    }
  }, [birthDate, themeColor, selectedDevice, viewMode]);

  /**
   * Handle device selection
   */
  const handleDeviceSelect = (device: DeviceModel) => {
    setSelectedDevice(device);
  };

  /**
   * Generate wallpaper URL
   */
  const generateWallpaperUrl = () => {
    if (!selectedDevice) {
      alert('Please select a device');
      return;
    }

    // Birth date is only required for Life View
    if (viewMode === 'life' && !birthDate) {
      alert('Please enter your birth date for Life View');
      return;
    }

    // Build the wallpaper URL with query parameters
    const params = new URLSearchParams({
      themeColor: themeColor.replace('#', ''), // Remove # for URL
      width: selectedDevice.width.toString(),
      height: selectedDevice.height.toString(),
      viewMode,
    });

    // Only add birthDate for Life View
    if (viewMode === 'life' && birthDate) {
      params.append('birthDate', birthDate);
    }

    // Use window.location to get the current domain (works in production too)
    const baseUrl = typeof window !== 'undefined' 
      ? `${window.location.protocol}//${window.location.host}`
      : '';
    
    const url = `${baseUrl}/api/wallpaper?${params.toString()}`;
    setWallpaperUrl(url);
  };

  /**
   * Copy wallpaper URL to clipboard
   */
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(wallpaperUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      alert('Failed to copy URL. Please copy it manually.');
    }
  };

  /**
   * Check if form is complete
   */
  const isFormComplete = viewMode === 'year' ? selectedDevice !== null : (birthDate && selectedDevice);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            ⏳ Chronos
          </h1>
          <p className="text-lg text-gray-600">
            Visualize your life progress with a dynamic wallpaper
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Generate a personalized wallpaper that updates daily
          </p>
        </div>

        {/* Configuration Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Configure Your Wallpaper
          </h2>

          <div className="space-y-6">
            {/* Birth Date Input - Only for Life View */}
            {viewMode === 'life' && (
              <BirthDateInput value={birthDate} onChange={setBirthDate} />
            )}

            {/* Device Selector */}
            <DeviceSelector
              selectedModel={selectedDevice?.model || ''}
              onSelect={handleDeviceSelect}
            />

            {/* Theme Color Picker */}
            <ThemeColorPicker
              selectedColor={themeColor}
              onChange={setThemeColor}
            />

            {/* View Mode Toggle */}
            <ViewModeToggle
              selectedMode={viewMode}
              onChange={setViewMode}
            />

            {/* Generate Button */}
            <button
              onClick={generateWallpaperUrl}
              disabled={!isFormComplete}
              className={`
                w-full py-4 px-6 rounded-lg font-semibold text-white text-lg
                transition-all transform
                ${isFormComplete
                  ? 'bg-blue-600 hover:bg-blue-700 hover:scale-105 active:scale-95'
                  : 'bg-gray-300 cursor-not-allowed'
                }
              `}
            >
              {isFormComplete ? '🎨 Generate Wallpaper URL' : '⚠️ Fill in all fields'}
            </button>
          </div>
        </div>

        {/* Generated URL Display */}
        {wallpaperUrl && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              🎉 Your Wallpaper URL
            </h2>

            <p className="text-gray-600 mb-4">
              Use this URL in the automation apps (see instructions below):
            </p>

            {/* URL Display Box */}
            <div className="flex gap-2">
              <div className="flex-1 p-4 bg-gray-50 border border-gray-300 rounded-lg font-mono text-sm break-all">
                {wallpaperUrl}
              </div>
              
              <button
                onClick={copyToClipboard}
                className="px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors whitespace-nowrap"
              >
                {copied ? '✓ Copied!' : '📋 Copy'}
              </button>
            </div>

            {/* Preview Link */}
            <div className="mt-4">
              <a
                href={wallpaperUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 underline text-sm"
              >
                🔗 Open wallpaper in new tab (preview)
              </a>
            </div>
          </div>
        )}

        {/* Setup Instructions */}
        {wallpaperUrl && <SetupInstructions wallpaperUrl={wallpaperUrl} />}

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500 text-sm">
          <p>
            Built with ❤️ using Next.js, TypeScript, and Tailwind CSS
          </p>
          <p className="mt-2">
            Open source on{' '}
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 underline"
            >
              GitHub
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
