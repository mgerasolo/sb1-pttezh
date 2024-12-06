import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
  DragEndEvent,
  DragStartEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Item } from './Item';
import { Section } from './Section';
import type { LaunchpadItem } from '../types';
import { logger } from '../utils/logger';

export const Grid = () => {
  const { sections = [], setSections, isEditMode, saveToHistory } = useStore();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    if (!isEditMode) return;
    
    const { active } = event;
    setActiveId(active.id as string);
    const sectionId = sections.find(section =>
      section.items.some(item => item.id === active.id)
    )?.id;
    setActiveSection(sectionId || null);
    logger.info('Drag started', { itemId: active.id, sectionId });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    if (!isEditMode) return;
    
    const { active, over } = event;
    
    if (!over || active.id === over.id) {
      setActiveId(null);
      setActiveSection(null);
      return;
    }

    // Handle section reordering
    if (active.id.toString().startsWith('section-')) {
      const oldIndex = sections.findIndex(s => `section-${s.id}` === active.id);
      const newIndex = sections.findIndex(s => `section-${s.id}` === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const newSections = arrayMove(sections, oldIndex, newIndex);
        setSections(newSections);
        saveToHistory();
        logger.info('Section reordered', { oldIndex, newIndex });
      }
      return;
    }

    // Handle item reordering
    const activeSection = sections.find(section =>
      section.items.some(item => item.id === active.id)
    );
    const overSection = sections.find(section =>
      section.items.some(item => item.id === over.id)
    );

    if (!activeSection || !overSection) {
      logger.warn('Section not found during drag end', {
        activeId: active.id,
        overId: over.id,
      });
      return;
    }

    setSections(
      sections.map(section => {
        if (section.id !== activeSection.id && section.id !== overSection.id) {
          return section;
        }

        const oldIndex = section.items.findIndex(item => item.id === active.id);
        const newIndex = section.items.findIndex(item => item.id === over.id);

        return {
          ...section,
          items: arrayMove(section.items, oldIndex, newIndex),
        };
      })
    );

    saveToHistory();
    logger.info('Drag ended', {
      activeId: active.id,
      overId: over.id,
      activeSectionId: activeSection.id,
      overSectionId: overSection.id,
    });

    setActiveId(null);
    setActiveSection(null);
  };

  if (!Array.isArray(sections)) {
    logger.error('Sections is not an array', { sections });
    return null;
  }

  const sectionIds = sections.map(section => `section-${section.id}`);

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={sectionIds} strategy={verticalListSortingStrategy}>
        <div className="space-y-8">
          {sections.map((section) => (
            <Section
              key={section.id}
              section={section}
              isEditMode={isEditMode}
            />
          ))}
        </div>
      </SortableContext>

      <DragOverlay>
        {activeId && activeSection && (
          <div className="opacity-50">
            <Item
              item={
                sections
                  .find(s => s.id === activeSection)
                  ?.items.find(i => i.id === activeId) as LaunchpadItem
              }
            />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
};