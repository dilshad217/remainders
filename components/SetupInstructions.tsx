/**
 * SetupInstructions Component
 * 
 * Displays step-by-step instructions for automating wallpaper updates
 * on iOS (using Shortcuts app) and Android (using MacroDroid app).
 * 
 * The component includes collapsible sections for each platform.
 */

'use client';

import { useState } from 'react';

interface SetupInstructionsProps {
  /** The generated wallpaper URL to use in automation */
  wallpaperUrl: string;
}

export default function SetupInstructions({ wallpaperUrl }: SetupInstructionsProps) {
  // State to track which accordion sections are open
  const [openSection, setOpenSection] = useState<'ios' | 'android' | null>(null);

  /**
   * Toggle accordion section
   */
  const toggleSection = (section: 'ios' | 'android') => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Automation Setup
      </h2>
      
      <p className="text-gray-600 mb-6">
        Set up your phone to automatically update this wallpaper daily.
        Choose your platform below for detailed instructions:
      </p>

      <div className="space-y-4">
        {/* iOS Instructions */}
        <div className="border border-gray-300 rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection('ios')}
            className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🍎</span>
              <span className="font-semibold text-gray-900">iOS (iPhone) Setup</span>
            </div>
            <span className="text-gray-500">
              {openSection === 'ios' ? '▼' : '▶'}
            </span>
          </button>
          
          {openSection === 'ios' && (
            <div className="px-6 py-4 bg-white space-y-4">
              <div className="space-y-3 text-gray-700">
                <h3 className="font-semibold text-lg text-gray-900">
                  Using the Shortcuts App
                </h3>
                
                <ol className="list-decimal list-inside space-y-3 pl-2">
                  <li>
                    <strong>Open Shortcuts app</strong> (pre-installed on iOS)
                  </li>
                  
                  <li>
                    <strong>Create a new Shortcut</strong> by tapping the "+" icon
                  </li>
                  
                  <li>
                    <strong>Add Action:</strong> Search for "Get Contents of URL"
                    <div className="mt-2 pl-6 text-sm">
                      • Paste your wallpaper URL into the URL field
                    </div>
                  </li>
                  
                  <li>
                    <strong>Add Action:</strong> Search for "Set Wallpaper"
                    <div className="mt-2 pl-6 text-sm">
                      • Choose "Lock Screen", "Home Screen", or "Both"<br />
                      • Disable "Show Preview" for automatic updates
                    </div>
                  </li>
                  
                  <li>
                    <strong>Name your Shortcut</strong> (e.g., "Update Chronos Wallpaper")
                  </li>
                  
                  <li>
                    <strong>Set up Automation:</strong>
                    <div className="mt-2 pl-6 text-sm">
                      • Go to the "Automation" tab<br />
                      • Tap "+" to create a new automation<br />
                      • Choose "Time of Day"<br />
                      • Set to 12:00 AM (midnight) daily<br />
                      • Add Action → Run Shortcut → Select your shortcut<br />
                      • Disable "Ask Before Running" for automatic execution
                    </div>
                  </li>
                </ol>

                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-900">
                    <strong>💡 Tip:</strong> Test your shortcut manually first by running it 
                    from the Shortcuts app before setting up automation.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Android Instructions */}
        <div className="border border-gray-300 rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection('android')}
            className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🤖</span>
              <span className="font-semibold text-gray-900">Android Setup</span>
            </div>
            <span className="text-gray-500">
              {openSection === 'android' ? '▼' : '▶'}
            </span>
          </button>
          
          {openSection === 'android' && (
            <div className="px-6 py-4 bg-white space-y-4">
              <div className="space-y-3 text-gray-700">
                <h3 className="font-semibold text-lg text-gray-900">
                  Using MacroDroid App
                </h3>
                
                <ol className="list-decimal list-inside space-y-3 pl-2">
                  <li>
                    <strong>Download MacroDroid</strong> from Google Play Store
                    <div className="mt-2 pl-6 text-sm text-gray-600">
                      (Free app with powerful automation features)
                    </div>
                  </li>
                  
                  <li>
                    <strong>Create a new Macro</strong> by tapping the "+" button
                  </li>
                  
                  <li>
                    <strong>Add Trigger:</strong> Select "Date/Time Trigger"
                    <div className="mt-2 pl-6 text-sm">
                      • Choose "Time of Day"<br />
                      • Set to 00:00 (midnight)<br />
                      • Select "Every Day"
                    </div>
                  </li>
                  
                  <li>
                    <strong>Add Action:</strong> Select "Connectivity" → "HTTP Request"
                    <div className="mt-2 pl-6 text-sm">
                      • Method: GET<br />
                      • URL: Paste your wallpaper URL<br />
                      • Store Response: Choose "File"<br />
                      • File path: /storage/emulated/0/Chronos/wallpaper.png
                    </div>
                  </li>
                  
                  <li>
                    <strong>Add Action:</strong> Select "Display" → "Set Wallpaper"
                    <div className="mt-2 pl-6 text-sm">
                      • Choose the file path from step 4<br />
                      • Select "Lock Screen", "Home Screen", or "Both"
                    </div>
                  </li>
                  
                  <li>
                    <strong>Name your Macro</strong> (e.g., "Chronos Daily Update")
                  </li>
                  
                  <li>
                    <strong>Enable the Macro</strong> by toggling the switch on
                  </li>
                </ol>

                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-900">
                    <strong>💡 Tip:</strong> Grant MacroDroid the necessary permissions 
                    (Storage, Display) when prompted. Test the macro manually using the 
                    "Test Actions" button before enabling automation.
                  </p>
                </div>

                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-900">
                    <strong>⚠️ Alternative:</strong> If MacroDroid doesn't work for your device, 
                    try "Tasker" (paid) or "Automate" (free) apps with similar HTTP Request 
                    and Set Wallpaper actions.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* General Tips */}
      <div className="mt-6 p-6 bg-gray-50 border border-gray-200 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-3">📌 Important Notes</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex gap-2">
            <span>•</span>
            <span>
              Your wallpaper URL is static and will automatically show updated progress 
              each time it's accessed
            </span>
          </li>
          <li className="flex gap-2">
            <span>•</span>
            <span>
              Make sure your device has an internet connection for the automation to work
            </span>
          </li>
          <li className="flex gap-2">
            <span>•</span>
            <span>
              The wallpaper updates at midnight, showing your current life progress
            </span>
          </li>
          <li className="flex gap-2">
            <span>•</span>
            <span>
              Save your wallpaper URL somewhere safe in case you need to reconfigure
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
