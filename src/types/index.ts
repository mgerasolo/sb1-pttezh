export type ItemType = 'bookmark' | 'feed' | 'youtube' | 'twitter' | 'stock' | 'crypto';

export interface LaunchpadItem {
  id: string;
  type: ItemType;
  title: string;
  icon?: string;
  url?: string;
  children?: LaunchpadItem[];
  collapsed?: boolean;
  data?: any;
  position?: { x: number; y: number };
  size?: { w: number; h: number };
}

export interface Section {
  id: string;
  title: string;
  items: LaunchpadItem[];
  collapsed?: boolean;
}

export interface Page {
  id: string;
  title: string;
  sections: Section[];
  settings?: PageSettings;
}

export interface PageSettings {
  layout: {
    enableLeftSidebar: boolean;
    enableRightSidebar: boolean;
    enablePings: boolean;
  };
  gridstack: {
    columnsSmall: number;
    columnsMedium: number;
    columnsLarge: number;
  };
  metadata: {
    pageTitle: string;
    metaTitle: string;
    logo: string;
    favicon: string;
  };
  appearance: {
    background: string;
    backgroundAttachment: 'fixed' | 'scroll';
    backgroundSize: 'cover' | 'contain';
    backgroundRepeat: 'no-repeat' | 'repeat';
    primaryColor: string;
    secondaryColor: string;
    shade: string;
    appOpacity: number;
    customCSS: string;
  };
  access: {
    allowAnonymous: boolean;
  };
}</content>