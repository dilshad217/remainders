/**
 * SetupInstructions Component
 * Minimalist Redesign - Full Screen Modal Version with Portal
 */

'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface SetupInstructionsProps {
  wallpaperUrl: string;
  selectedBrand: string;
}

export default function SetupInstructions({ wallpaperUrl, selectedBrand }: SetupInstructionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isIOS = selectedBrand === 'Apple';
  const isAndroid = selectedBrand !== 'Apple' && selectedBrand !== '';

  const copyUrl = async () => {
    try {
      if (typeof window !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(wallpaperUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        console.warn('Clipboard API not available');
      }
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  if (!mounted) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 backdrop-blur-md animate-in fade-in duration-300 p-6 md:p-8"
      onClick={() => setIsOpen(false)}
    >

      {/* Close Button - Top Right */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(false);
        }}
        className="absolute top-6 right-6 p-2 text-neutral-500 hover:text-white transition-colors z-10"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      <div
        className="w-full max-w-lg space-y-8 flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="text-center space-y-3 w-full">
          <h2 className="text-2xl font-light uppercase tracking-widest text-white">
            {isIOS ? 'iOS Automation' : isAndroid ? 'Android Automation' : 'Automation Setup'}
          </h2>
          <p className="text-neutral-500 text-sm font-light leading-relaxed max-w-sm mx-auto">
            Follow these steps to enable daily wallpaper updates.
          </p>
        </header>

        {/* Preview Image Modal */}
        {showPreview && isIOS ? (
          <div className="w-full bg-black/50 border border-orange-500/30 rounded-2xl p-4 shadow-2xl">
            <div className="relative">
              <button
                onClick={() => setShowPreview(false)}
                className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/40 flex items-center justify-center transition-colors z-10"
                title="Close preview"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-400">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
              <img 
                src="/IOS_Instructions.jpg"
                alt="iOS Shortcuts Example"
                className="w-full max-w-xs mx-auto rounded-lg"
              />
            </div>
          </div>
        ) : (
          <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl overflow-y-auto max-h-[70vh] no-scrollbar">

          {/* iOS Instructions */}
          {isIOS && (
            <div className="space-y-8 text-sm text-neutral-400">
              <div className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm font-medium text-white">1</span>
                <div className="pt-1.5 space-y-2">
                  <p className="font-medium text-white text-lg">Create Automation</p>
                  <p className="leading-relaxed">
                    Open <strong className="text-white">Shortcuts</strong> app → <strong className="text-white">Automation</strong> tab → New Automation.
                  </p>
                  <p className="leading-relaxed">
                    Select <strong className="text-neutral-300">Time of Day</strong> (e.g. 09:00 AM) → Select <strong className="text-white">Run Immediately</strong> (Important).
                  </p>
                  <p className="leading-relaxed">
                    Click <strong className="text-white">Next</strong>.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm font-medium text-white">2</span>
                <div className="pt-1.5 space-y-4 w-full min-w-0">
                  <p className="font-medium text-white text-lg">Create New Shortcut</p>

                  <div className="space-y-2">
                    <p className="text-xs text-neutral-500 uppercase tracking-wider">Action 1</p>
                    <p className="text-white font-medium">Search Action: Get Contents of URL</p>
                    <p>Paste your unique URL:</p>
                    <div className="relative w-full">
                      <button
                        onClick={copyUrl}
                        className="w-full flex items-center justify-between gap-3 px-3 py-3 bg-black/40 hover:bg-black/60 rounded-lg border border-white/10 transition-colors group overflow-hidden"
                      >
                        <span className="text-xs text-neutral-400 group-hover:text-white truncate font-mono flex-1 min-w-0 text-left">
                          {wallpaperUrl}
                        </span>
                        <span className="flex-shrink-0 text-[10px] font-bold text-orange-400 uppercase tracking-wider bg-orange-400/10 px-2 py-1 rounded">
                          {copied ? 'Copied' : 'Copy'}
                        </span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs text-neutral-500 uppercase tracking-wider">Action 2</p>
                    <p className="text-white font-medium">Search Action: Set Wallpaper Photo</p>
                    <p>Select the wallpaper (it needs to be a simple wallpaper).</p>
                    <div className="bg-orange-500/10 border border-orange-500/20 p-3 rounded-lg">
                      <p className="text-orange-200 text-xs leading-relaxed">
                        <strong className="text-orange-400">Important:</strong> Tap the arrow <span className="text-orange-400 opacity-60">{'(>)'}</span> on this action and turn <strong className="text-orange-400">OFF "Show Preview"</strong> and <strong className="text-orange-400">Crop to Subject</strong>.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* See Example Button */}
              <div className="flex justify-center pt-4">
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/40 transition-colors group"
                  title="Show example"
                >
                  <span className="text-orange-400 font-bold text-sm group-hover:scale-110 transition-transform">!</span>
                  <span className="text-orange-400 text-sm font-medium">See Example</span>
                </button>
              </div>
            </div>
          )}

          {/* Android Instructions */}
          {isAndroid && (
            <div className="space-y-8 text-sm text-neutral-400">
              {/* Prerequisites */}
              <div className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm font-medium text-white">1</span>
                <div className="pt-1.5 space-y-2">
                  <p className="font-medium text-white text-lg">Prerequisites</p>
                  <p className="leading-relaxed">
                    Install <a href="https://play.google.com/store/apps/details?id=com.arlosoft.macrodroid&hl=en" target="_blank" rel="noopener noreferrer" className="text-white underline decoration-white/30 hover:decoration-white font-semibold">MacroDroid</a> from Google Play Store.
                  </p>
                </div>
              </div>

              {/* Setup Macro */}
              <div className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm font-medium text-white">2</span>
                <div className="pt-1.5 space-y-2">
                  <p className="font-medium text-white text-lg">Setup Macro</p>
                  <p className="leading-relaxed">
                    Open <strong className="text-white">MacroDroid</strong> → <strong className="text-white">Add Macro</strong>
                  </p>
                  <div className="space-y-1 pl-4 border-l-2 border-white/10 mt-3">
                    <p className="text-neutral-300">
                      <strong className="text-white">Trigger:</strong> Date/Time → Day/Time → Set time to <strong className="text-white">00:00:00</strong>
                    </p>
                    <p className="text-neutral-400 text-xs">→ Activate <strong className="text-white">all weekdays</strong></p>
                  </div>
                </div>
              </div>

              {/* Configure Actions */}
              <div className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm font-medium text-white">3</span>
                <div className="pt-1.5 space-y-4 w-full min-w-0">
                  <p className="font-medium text-white text-lg">Configure Actions</p>

                  {/* Action 1 */}
                  <div className="space-y-2">
                    <p className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">4.1 Download Image</p>
                    <ul className="space-y-2 pl-4">
                      <li className="leading-relaxed">
                        Go to <strong className="text-white">Web Interactions</strong> → <strong className="text-white">HTTP Request</strong>
                      </li>
                      <li className="leading-relaxed">
                        Request method: <strong className="text-white">GET</strong>
                      </li>
                      <li className="leading-relaxed">Paste the URL below:</li>
                    </ul>
                    <div className="relative w-full mt-2">
                      <button
                        onClick={copyUrl}
                        className="w-full flex items-center justify-between gap-3 px-3 py-2.5 bg-black/40 hover:bg-black/60 rounded-lg border border-white/10 transition-colors group overflow-hidden"
                      >
                        <span className="text-xs text-neutral-400 group-hover:text-white truncate font-mono flex-1 min-w-0 text-left">
                          {wallpaperUrl}
                        </span>
                        <span className="flex-shrink-0 text-[10px] font-bold text-orange-400 uppercase tracking-wider bg-orange-400/10 px-2 py-1 rounded">
                          {copied ? 'Copied' : 'Copy'}
                        </span>
                      </button>
                    </div>
                    <ul className="space-y-1 pl-4 mt-2">
                      <li className="text-neutral-300">
                        Enable: <strong className="text-white">Block next actions until complete</strong>
                      </li>
                      <li className="text-neutral-300">
                        Response: Tick <strong className="text-white">Save HTTP response to file</strong>
                      </li>
                      <li className="text-neutral-300">
                        Folder & filename: <span className="font-mono text-white bg-white/10 px-1.5 py-0.5 rounded text-xs">/Download/life.png</span>
                      </li>
                    </ul>
                  </div>

                  {/* Action 2 */}
                  <div className="space-y-2">
                    <p className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">4.2 Set Wallpaper</p>
                    <ul className="space-y-2 pl-4">
                      <li className="leading-relaxed">
                        Go to <strong className="text-white">Device Settings</strong> → <strong className="text-white">Set Wallpaper</strong>
                      </li>
                      <li className="leading-relaxed">
                        Choose: <strong className="text-white">Image and Screen</strong>
                      </li>
                      <li className="leading-relaxed">
                        Enter folder & filename: <span className="font-mono text-white bg-white/10 px-1.5 py-0.5 rounded text-xs">/Download/life.png</span>
                      </li>
                    </ul>
                    <div className="bg-orange-500/10 border border-orange-500/20 p-3 rounded-lg mt-2">
                      <p className="text-orange-200 text-xs leading-relaxed">
                        <strong className="text-orange-400">Important:</strong> Use the exact same folder and filename in both actions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Finalize */}
              <div className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm font-medium text-white">4</span>
                <div className="pt-1.5 space-y-2">
                  <p className="font-medium text-white text-lg">Finalize</p>
                  <p className="leading-relaxed">
                    Give the macro a name → Tap <strong className="text-white">Create Macro</strong>
                  </p>
                </div>
              </div>

              {/* Testing */}
              <div className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm font-medium text-white">?</span>
                <div className="pt-1.5 space-y-2">
                  <p className="font-medium text-white text-lg">Testing & Managing</p>
                  <ul className="space-y-1 pl-4">
                    <li className="leading-relaxed">
                      <strong className="text-white">Test:</strong> MacroDroid → Macros → select your macro → More options → <strong className="text-white">Test macro</strong>
                    </li>
                    <li className="leading-relaxed">
                      <strong className="text-white">Stop:</strong> Toggle off or delete the macro
                    </li>
                    <li className="leading-relaxed">
                      <strong className="text-white">Edit URL:</strong> Tap the HTTP Request action → Update the URL → Save
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {!isIOS && !isAndroid && (
            <div className="text-center text-neutral-400 py-8">
              <p>Please select a device brand to view specific automation instructions.</p>
            </div>
          )}

          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="mx-auto flex items-center justify-center gap-2 px-6 py-3 text-neutral-500 hover:text-white transition-all duration-300 group hover:bg-white/5 rounded-full"
      >
        <span className="text-xs font-semibold uppercase tracking-widest text-neutral-400 group-hover:text-white transition-colors">Install & Automation</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-neutral-500 group-hover:text-white transition-colors">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
      </button>

      {isOpen && mounted && createPortal(modalContent, document.body)}
    </>
  );
}
