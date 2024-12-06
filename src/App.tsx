import React, { useEffect, useState } from 'react';
import { Grid } from './components/Grid';
import { Sidebar } from './components/Sidebar';
import { Settings } from './components/Settings';
import { Plus, Edit2, Undo, Redo, Search, Settings as SettingsIcon, AlertTriangle } from 'lucide-react';
import { useStore } from './store/useStore';
import { logger } from './utils/logger';
import { UnsavedChangesDialog } from './components/UnsavedChangesDialog';

function App() {
  const {
    pages,
    currentPageId,
    setCurrentPageId,
    addPage,
    sections,
    setSections,
    isEditMode,
    setEditMode,
    isSettingsOpen,
    setSettingsOpen,
    searchQuery,
    setSearchQuery,
    undo,
    redo,
    history,
    currentHistoryIndex,
    saveToHistory,
    hasUnsavedChanges,
  } = useStore();

  const [targetPageId, setTargetPageId] = useState<string | null>(null);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);

  // Initialize with a default page if none exist
  useEffect(() => {
    if (pages.length === 0) {
      const defaultPage = {
        id: crypto.randomUUID(),
        title: 'Home',
        sections: [],
      };
      logger.info('Initializing default page', { page: defaultPage });
      addPage('Home');
    }
  }, [pages.length, addPage]);

  const handlePageChange = (pageId: string) => {
    if (hasUnsavedChanges) {
      setTargetPageId(pageId);
      setShowUnsavedDialog(true);
    } else {
      setCurrentPageId(pageId);
    }
  };

  const handleUnsavedDialogConfirm = () => {
    if (targetPageId) {
      setCurrentPageId(targetPageId);
      setShowUnsavedDialog(false);
      setTargetPageId(null);
    }
  };

  const handleUnsavedDialogCancel = () => {
    setShowUnsavedDialog(false);
    setTargetPageId(null);
  };

  const addSection = () => {
    const newSection = {
      id: crypto.randomUUID(),
      title: 'New Section',
      items: [],
    };
    logger.info('Adding new section', { section: newSection });
    setSections([...sections, newSection]);
    saveToHistory();
  };

  const handleAddPage = () => {
    const pageNumber = pages.length + 1;
    addPage(`Page ${pageNumber}`);
  };

  const canUndo = currentHistoryIndex > 0;
  const canRedo = currentHistoryIndex < history.length - 1;

  const currentPage = pages.find(p => p.id === currentPageId);
  const bgImage = currentPage?.settings?.appearance?.background;
  const bgOpacity = currentPage?.settings?.appearance?.appOpacity ?? 1;

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-navy-900 via-navy-800 to-purple-900"
      style={{
        backgroundImage: bgImage ? `url(${bgImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <header className="bg-navy-900/90 shadow-lg border-b border-navy-700">
        <div className="w-full px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-6">
              <h1 className="text-2xl font-bold text-white">LaunchPad</h1>
              
              <div className="flex space-x-2">
                {pages.map((page) => (
                  <button
                    key={page.id}
                    onClick={() => handlePageChange(page.id)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      currentPageId === page.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-navy-700'
                    }`}
                  >
                    {page.title}
                  </button>
                ))}
                <button
                  onClick={handleAddPage}
                  className="px-3 py-1 rounded-md text-sm font-medium text-gray-300 hover:bg-navy-700"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-navy-800 border border-navy-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <button
                onClick={() => setEditMode(!isEditMode)}
                className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isEditMode
                    ? 'bg-blue-600 text-white'
                    : 'bg-navy-800 text-gray-300 hover:bg-navy-700'
                }`}
              >
                <Edit2 className="w-4 h-4 mr-2" />
                {isEditMode ? 'Exit Edit Mode' : 'Edit Mode'}
              </button>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={undo}
                  disabled={!canUndo}
                  className={`p-2 rounded-md ${
                    canUndo
                      ? 'text-gray-300 hover:bg-navy-700'
                      : 'text-gray-600 cursor-not-allowed'
                  }`}
                >
                  <Undo className="w-5 h-5" />
                </button>
                <button
                  onClick={redo}
                  disabled={!canRedo}
                  className={`p-2 rounded-md ${
                    canRedo
                      ? 'text-gray-300 hover:bg-navy-700'
                      : 'text-gray-600 cursor-not-allowed'
                  }`}
                >
                  <Redo className="w-5 h-5" />
                </button>
              </div>

              <button
                onClick={addSection}
                className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Section
              </button>

              <button
                onClick={() => setSettingsOpen(true)}
                className="p-2 rounded-md text-gray-300 hover:bg-navy-700"
              >
                <SettingsIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main 
        className="w-full px-4 py-8"
        style={{ opacity: bgOpacity }}
      >
        <Grid />
      </main>

      <Sidebar />
      {isSettingsOpen && <Settings />}
      {showUnsavedDialog && (
        <UnsavedChangesDialog
          onConfirm={handleUnsavedDialogConfirm}
          onCancel={handleUnsavedDialogCancel}
        />
      )}
    </div>
  );
}

export default App;