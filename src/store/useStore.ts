import { create } from 'zustand';
import { logger } from '../utils/logger';

const MAX_HISTORY = 50;

interface HistoryEntry {
  pages: Page[];
  timestamp: number;
}

interface Store {
  pages: Page[];
  currentPageId: string | null;
  sections: Section[];
  selectedItem: LaunchpadItem | null;
  isEditMode: boolean;
  isSettingsOpen: boolean;
  searchQuery: string;
  history: HistoryEntry[];
  currentHistoryIndex: number;
  hasUnsavedChanges: boolean;

  setCurrentPageId: (id: string) => void;
  addPage: (title: string) => void;
  updatePage: (id: string, updates: Partial<Page>) => void;
  setSections: (sections: Section[]) => void;
  setSelectedItem: (item: LaunchpadItem | null) => void;
  setEditMode: (isEdit: boolean) => void;
  setSettingsOpen: (isOpen: boolean) => void;
  setSearchQuery: (query: string) => void;
  setHasUnsavedChanges: (value: boolean) => void;
  updateItem: (sectionId: string, updatedItem: LaunchpadItem) => void;
  saveToHistory: () => void;
  undo: () => void;
  redo: () => void;
}

export const useStore = create<Store>((set, get) => ({
  pages: [],
  currentPageId: null,
  sections: [],
  selectedItem: null,
  isEditMode: false,
  isSettingsOpen: false,
  searchQuery: '',
  history: [],
  currentHistoryIndex: -1,
  hasUnsavedChanges: false,

  setCurrentPageId: (id) => set({ currentPageId: id }),
  
  addPage: (title) => {
    const newPage: Page = {
      id: crypto.randomUUID(),
      title,
      sections: [],
      settings: {
        layout: {
          enableLeftSidebar: false,
          enableRightSidebar: false,
          enablePings: false,
        },
        gridstack: {
          columnsSmall: 1,
          columnsMedium: 4,
          columnsLarge: 6,
        },
        metadata: {
          pageTitle: title,
          metaTitle: title,
          logo: '',
          favicon: '',
        },
        appearance: {
          background: '',
          backgroundAttachment: 'fixed',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          primaryColor: '#3B82F6',
          secondaryColor: '#F59E0B',
          shade: '#2563EB',
          appOpacity: 1,
          customCSS: '',
        },
        access: {
          allowAnonymous: false,
        },
      },
    };
    
    set((state) => ({
      pages: [...state.pages, newPage],
      currentPageId: newPage.id,
    }));
    
    logger.info('Added new page', { pageId: newPage.id, title });
  },

  updatePage: (id, updates) => {
    set((state) => ({
      pages: state.pages.map((page) =>
        page.id === id ? { ...page, ...updates } : page
      ),
      hasUnsavedChanges: true,
    }));
    get().saveToHistory();
  },

  setSections: (sections) => {
    if (!Array.isArray(sections)) {
      logger.error('Invalid sections data', { sections });
      return;
    }
    logger.info('Updating sections', { count: sections.length });
    set({ sections, hasUnsavedChanges: true });
  },

  setSelectedItem: (item) => set({ selectedItem: item }),
  setEditMode: (isEdit) => set({ isEditMode: isEdit }),
  setSettingsOpen: (isOpen) => set({ isSettingsOpen: isOpen }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setHasUnsavedChanges: (value) => set({ hasUnsavedChanges: value }),

  updateItem: (sectionId, updatedItem) => {
    const { sections } = get();
    if (!Array.isArray(sections)) {
      logger.error('Invalid sections data during item update', { sections });
      return;
    }
    
    logger.info('Updating item', { sectionId, itemId: updatedItem.id });
    set((state) => ({
      sections: state.sections.map((section) => {
        if (section.id !== sectionId) return section;
        return {
          ...section,
          items: section.items.map((item) =>
            item.id === updatedItem.id ? updatedItem : item
          ),
        };
      }),
      hasUnsavedChanges: true,
    }));
    get().saveToHistory();
  },

  saveToHistory: () => {
    const { pages, history, currentHistoryIndex } = get();
    
    const currentState = JSON.parse(JSON.stringify(pages));
    const newHistory = history.slice(0, currentHistoryIndex + 1);
    
    newHistory.push({
      pages: currentState,
      timestamp: Date.now(),
    });

    if (newHistory.length > MAX_HISTORY) {
      newHistory.shift();
    }

    logger.info('Saving to history', {
      historySize: newHistory.length,
      currentIndex: newHistory.length - 1,
    });

    set({
      history: newHistory,
      currentHistoryIndex: newHistory.length - 1,
      hasUnsavedChanges: false,
    });
  },

  undo: () => {
    const { currentHistoryIndex, history } = get();
    if (currentHistoryIndex > 0) {
      const newIndex = currentHistoryIndex - 1;
      const previousState = history[newIndex];
      set({
        pages: previousState.pages,
        currentHistoryIndex: newIndex,
      });
      logger.info('Undo operation', { newIndex });
    }
  },

  redo: () => {
    const { currentHistoryIndex, history } = get();
    if (currentHistoryIndex < history.length - 1) {
      const newIndex = currentHistoryIndex + 1;
      const nextState = history[newIndex];
      set({
        pages: nextState.pages,
        currentHistoryIndex: newIndex,
      });
      logger.info('Redo operation', { newIndex });
    }
  },
}));