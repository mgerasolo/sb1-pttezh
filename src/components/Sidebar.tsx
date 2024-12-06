import React from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import type { ItemType } from '../types';

export const Sidebar = () => {
  const { selectedItem, setSelectedItem, updateItem } = useStore();

  if (!selectedItem) return null;

  const handleClose = () => setSelectedItem(null);

  const handleChange = (field: string, value: string) => {
    updateItem(selectedItem.sectionId, {
      ...selectedItem,
      [field]: value,
    });
  };

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl p-4 overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Edit Item</h2>
        <button
          onClick={handleClose}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            value={selectedItem.title}
            onChange={(e) => handleChange('title', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {selectedItem.type === 'bookmark' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">URL</label>
            <input
              type="url"
              value={selectedItem.url}
              onChange={(e) => handleChange('url', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        )}

        {/* Add more specific fields based on item type */}
      </div>
    </div>
  );
};