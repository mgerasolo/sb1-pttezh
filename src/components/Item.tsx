import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useStore } from '../store/useStore';
import type { LaunchpadItem } from '../types';
import {
  Chrome,
  Rss,
  Youtube,
  Twitter,
  LineChart,
  Bitcoin,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  GripVertical,
} from 'lucide-react';
import { cn } from '../utils/cn';

interface ItemProps {
  item: LaunchpadItem;
  isEditMode: boolean;
}

const iconMap = {
  bookmark: Chrome,
  feed: Rss,
  youtube: Youtube,
  twitter: Twitter,
  stock: LineChart,
  crypto: Bitcoin,
};

export const Item = ({ item, isEditMode }: ItemProps) => {
  const { setSelectedItem } = useStore();
  const [isCollapsed, setIsCollapsed] = React.useState(item.collapsed);
  const Icon = iconMap[item.type];

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.id,
    disabled: !isEditMode,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.url && !isEditMode) {
      window.open(item.url, '_blank');
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isEditMode) {
      setSelectedItem(item);
    }
  };

  const toggleCollapse = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={handleEdit}
      className={cn(
        'bg-white p-4 rounded-lg shadow-sm transition-all',
        'hover:shadow-md',
        isEditMode ? 'cursor-move' : 'cursor-pointer',
        isDragging && 'opacity-50',
        item.children?.length && 'border-l-4 border-blue-500'
      )}
    >
      <div className="flex items-center justify-between">
        {isEditMode && (
          <div {...attributes} {...listeners}>
            <GripVertical className="w-5 h-5 text-gray-400 mr-2" />
          </div>
        )}
        
        <div className="flex items-center space-x-3">
          <Icon className="w-6 h-6 text-gray-600" />
          <span className="font-medium">{item.title}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          {!isEditMode && item.url && (
            <button
              onClick={handleClick}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          )}
          
          {item.children?.length > 0 && (
            <button
              onClick={toggleCollapse}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          )}
        </div>
      </div>
      
      {!isCollapsed && item.children && (
        <div className="mt-2 pl-4 space-y-2">
          {item.children.map((child) => (
            <Item key={child.id} item={child} isEditMode={isEditMode} />
          ))}
        </div>
      )}
    </div>
  );
};