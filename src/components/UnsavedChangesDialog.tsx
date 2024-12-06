import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface UnsavedChangesDialogProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export const UnsavedChangesDialog: React.FC<UnsavedChangesDialogProps> = ({
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center mb-4">
          <AlertTriangle className="w-6 h-6 text-yellow-500 mr-2" />
          <h2 className="text-xl font-semibold">Unsaved Changes</h2>
        </div>
        <p className="text-gray-600 mb-6">
          You have unsaved changes. Are you sure you want to leave this page? Your changes will be lost.
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Leave Page
          </button>
        </div>
      </div>
    </div>
  );
};