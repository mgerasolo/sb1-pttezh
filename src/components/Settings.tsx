import React from 'react';
import { X } from 'lucide-react';
import { useStore } from '../store/useStore';

export const Settings = () => {
  const { setSettingsOpen, currentPageId, pages, updatePage } = useStore();
  const currentPage = pages.find(page => page.id === currentPageId);

  if (!currentPage) return null;

  const settings = currentPage.settings;

  const handleClose = () => setSettingsOpen(false);

  const updateSettings = (path: string[], value: any) => {
    const newSettings = { ...settings };
    let current = newSettings;
    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]];
    }
    current[path[path.length - 1]] = value;
    updatePage(currentPage.id, { settings: newSettings });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Customization for {currentPage.title}</h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-8">
            {/* Layout Section */}
            <section>
              <h3 className="text-lg font-semibold mb-4">Layout</h3>
              <div className="space-y-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={settings?.layout.enableLeftSidebar}
                    onChange={(e) => updateSettings(['layout', 'enableLeftSidebar'], e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Enable left sidebar</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={settings?.layout.enableRightSidebar}
                    onChange={(e) => updateSettings(['layout', 'enableRightSidebar'], e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Enable right sidebar</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={settings?.layout.enablePings}
                    onChange={(e) => updateSettings(['layout', 'enablePings'], e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Enable pings</span>
                </label>
              </div>
            </section>

            {/* Gridstack Section */}
            <section>
              <h3 className="text-lg font-semibold mb-4">Gridstack</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Columns in small size
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="12"
                    value={settings?.gridstack.columnsSmall}
                    onChange={(e) => updateSettings(['gridstack', 'columnsSmall'], parseInt(e.target.value))}
                    className="w-full"
                  />
                  <span className="text-sm text-gray-500">{settings?.gridstack.columnsSmall} columns</span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Columns in medium size
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="12"
                    value={settings?.gridstack.columnsMedium}
                    onChange={(e) => updateSettings(['gridstack', 'columnsMedium'], parseInt(e.target.value))}
                    className="w-full"
                  />
                  <span className="text-sm text-gray-500">{settings?.gridstack.columnsMedium} columns</span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Columns in large size
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="12"
                    value={settings?.gridstack.columnsLarge}
                    onChange={(e) => updateSettings(['gridstack', 'columnsMedium'], parseInt(e.target.value))}
                    className="w-full"
                  />
                  <span className="text-sm text-gray-500">{settings?.gridstack.columnsLarge} columns</span>
                </div>
              </div>
            </section>

            {/* Appearance Section */}
            <section>
              <h3 className="text-lg font-semibold mb-4">Appearance</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Background Image
                  </label>
                  <input
                    type="text"
                    value={settings?.appearance.background}
                    onChange={(e) => updateSettings(['appearance', 'background'], e.target.value)}
                    placeholder="/imgs/backgrounds/background.png"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Primary Color
                  </label>
                  <input
                    type="color"
                    value={settings?.appearance.primaryColor}
                    onChange={(e) => updateSettings(['appearance', 'primaryColor'], e.target.value)}
                    className="mt-1 block rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    App Opacity
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={settings?.appearance.appOpacity}
                    onChange={(e) => updateSettings(['appearance', 'appOpacity'], parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <span className="text-sm text-gray-500">{Math.round(settings?.appearance.appOpacity * 100)}%</span>
                </div>
              </div>
            </section>

            {/* Access Section */}
            <section>
              <h3 className="text-lg font-semibold mb-4">Access</h3>
              <div className="space-y-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={settings?.access.allowAnonymous}
                    onChange={(e) => updateSettings(['access', 'allowAnonymous'], e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Allow anonymous access</span>
                </label>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};