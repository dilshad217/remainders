/**
 * DeviceSelector Component
 * 
 * A two-step selector that allows users to select their phone model:
 * 1. First select brand (Apple, Samsung, Google, etc.)
 * 2. Then select specific model within that brand
 */

'use client';

import { useState, useMemo } from 'react';
import { DEVICE_MODELS, getAllBrands, getDevicesByBrand } from '@/lib/devices';
import { DeviceModel } from '@/lib/types';

interface DeviceSelectorProps {
  /** Currently selected device model name */
  selectedModel: string;
  
  /** Callback function when a device is selected */
  onSelect: (device: DeviceModel) => void;
}

export default function DeviceSelector({ selectedModel, onSelect }: DeviceSelectorProps) {
  // State for selected brand
  const [selectedBrand, setSelectedBrand] = useState('');
  
  // State to track if user wants to change device
  const [isChanging, setIsChanging] = useState(false);
  
  // State for custom resolution
  const [customWidth, setCustomWidth] = useState('');
  const [customHeight, setCustomHeight] = useState('');
  
  // Get all available brands
  const brands = useMemo(() => getAllBrands(), []);

  /**
   * Handle brand selection
   */
  const handleBrandSelect = (brand: string) => {
    setSelectedBrand(brand);
  };

  /**
   * Handle device selection
   */
  const handleDeviceSelect = (device: DeviceModel) => {
    onSelect(device);
    setIsChanging(false);
    setSelectedBrand('');
  };

  /**
   * Handle custom device creation
   */
  const handleCustomDevice = () => {
    const width = parseInt(customWidth);
    const height = parseInt(customHeight);
    
    if (!width || !height || width <= 0 || height <= 0) {
      alert('Please enter valid width and height values');
      return;
    }
    
    const customDevice: DeviceModel = {
      brand: 'Custom',
      model: `Custom Device (${width}×${height})`,
      width,
      height,
    };
    
    onSelect(customDevice);
    setIsChanging(false);
    setSelectedBrand('');
    setCustomWidth('');
    setCustomHeight('');
  };

  /**
   * Go back to brand selection
   */
  const handleBack = () => {
    setSelectedBrand('');
    setCustomWidth('');
    setCustomHeight('');
  };

  /**
   * Start changing device
   */
  const handleStartChange = () => {
    setIsChanging(true);
    setSelectedBrand('');
  };

  /**
   * Get devices for selected brand
   */
  const devicesInBrand = useMemo(() => {
    if (!selectedBrand) return [];
    return getDevicesByBrand(selectedBrand);
  }, [selectedBrand]);

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Select Your Device
      </label>
      
      {/* Display selected device */}
      {selectedModel && !isChanging && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="text-sm text-gray-600">Selected:</div>
          <div className="font-semibold text-gray-900">{selectedModel}</div>
          <button
            type="button"
            onClick={handleStartChange}
            className="mt-2 text-sm text-blue-600 hover:text-blue-700 underline"
          >
            Change device
          </button>
        </div>
      )}

      {(!selectedModel || isChanging) && (
        <>
          {/* Step 1: Brand Selection */}
          {!selectedBrand && (
            <div>
              <p className="text-sm text-gray-600 mb-3">Choose your phone brand:</p>
              <div className="grid grid-cols-2 gap-3">
                {brands.map((brand) => (
                  <button
                    key={brand}
                    type="button"
                    onClick={() => handleBrandSelect(brand)}
                    className="p-4 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-center font-semibold text-gray-900"
                  >
                    {brand}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => handleBrandSelect('Custom')}
                  className="p-4 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-center font-semibold text-gray-900"
                >
                  Other
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Model Selection or Custom Input */}
          {selectedBrand && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <button
                  type="button"
                  onClick={handleBack}
                  className="text-blue-600 hover:text-blue-700"
                >
                  ← Back
                </button>
                <span className="text-sm text-gray-600">
                  {selectedBrand === 'Custom' 
                    ? 'Enter your device resolution:' 
                    : `Choose your ${selectedBrand} model:`}
                </span>
              </div>
              
              {selectedBrand === 'Custom' ? (
                // Custom resolution input
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Screen Width (pixels)
                    </label>
                    <input
                      type="number"
                      value={customWidth}
                      onChange={(e) => setCustomWidth(e.target.value)}
                      placeholder="e.g., 1170"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Screen Height (pixels)
                    </label>
                    <input
                      type="number"
                      value={customHeight}
                      onChange={(e) => setCustomHeight(e.target.value)}
                      placeholder="e.g., 2532"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <button
                    type="button"
                    onClick={handleCustomDevice}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                  >
                    Confirm Custom Device
                  </button>
                  
                  <p className="text-xs text-gray-500 mt-2">
                    💡 Tip: You can find your device's resolution in Settings → Display
                  </p>
                </div>
              ) : (
                // Brand-specific device list
                <div className="max-h-96 overflow-y-auto border border-gray-300 rounded-lg">
                  {devicesInBrand.map((device) => (
                    <button
                      key={device.model}
                      type="button"
                      onClick={() => handleDeviceSelect(device)}
                      className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      <div className="font-medium text-gray-900">{device.model}</div>
                      <div className="text-sm text-gray-500">
                        {device.width} × {device.height}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
