import React from 'react';
import { SortableContext, rectSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { Item } from './Item';
import type { Section as SectionType } from '../types';
import { ChevronDown, ChevronRight, GripVertical } from 'lucide-react';
import { useStore } from '../store/useStore';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '../utils/cn';

interface SectionProps {
  section: SectionType;
  isEditMode: boolean;
}

export const Section = ({ section, isEditMode }: SectionProps) => {
  const { setSections, saveToHistory } = useStore();
  const [isCollapsed, setIsCollapsed] = React.useState(section.collapsed);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `section-${section.id}`,
    disabled: !isEditMode,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    setSections(sections =>
      sections.map(s =>
        s.id === section.id ? { ...s, collapsed: !isCollapsed } : s
      )
    );
    saveToHistory();
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "bg-white rounded-lg shadow-sm",
        isDragging && "opacity-50",
        isEditMode && "cursor-move"
      )}
    >
      <div className="p-6">
        <div className="flex items-center gap-4">
          {isEditMode && (
            <div {...attributes} {...listeners}>
              <GripVertical className="w-5 h-5 text-gray-400" />
            </div>
          )}
          
          <div
            className="flex items-center cursor-pointer flex-grow"
            onClick={toggleCollapse}
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5 mr-2" />
            ) : (
              <ChevronDown className="w-5 h-5 mr-2" />
            )}
            <h2 className="text-xl font-semibold">{section.title}</h2>
          </div>
        </div>

        {!isCollapsed && (
          <SortableContext
            items={section.items.map(item => item.id)}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-4">
              {section.items.map((item) => (
                <Item
                  key={item.id}
                  item={item}
                  isEditMode={isEditMode}
                />
              ))}
            </div>
          </SortableContext>
        )}
      </div>
    </div>
  );
};