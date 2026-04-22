import type { ReactNode } from 'react';

export interface MaterialItem {
  id: number;
  fileUrl: string;
  fileStorageId?: number;
  folderId?: number | null;
  displayName?: string;
  thumbnailUrl?: string;
  materialType?: string;
  source?: string;
  createTime?: string;
}

export interface MaterialFolder {
  id: number;
  parentId?: number | null;
  name: string;
  sortOrder?: number;
}

export interface MaterialFolderTree {
  id: number;
  parentId?: number | null;
  name: string;
  children?: MaterialFolderTree[];
}

export interface MaterialDetail {
  id?: number;
  folderId?: number | null;
  folderName?: string | null;
  displayName?: string;
  description?: string | null;
  materialType?: string;
  source?: string;
  sourceTaskId?: number | null;
  thumbnailUrl?: string | null;
  extraMetadata?: string | null;
  status?: string;
  favorite?: boolean;
  sortOrder?: number;
  createTime?: string;
  updateTime?: string;
  fileStorageId?: number;
  storageFileName?: string;
  extension?: string;
  fileSizeBytes?: number;
  storagePath?: string;
  fileHash?: string;
  mimeType?: string;
  storageType?: string;
  downloadUrl?: string;
  fileVisibility?: string;
  fileVersion?: number;
  fileRecordStatus?: string;
  userStorageNodeId?: number;
}

export interface MaterialPageBody {
  records: MaterialItem[];
  total: number;
  current: number;
  size: number;
}

export type TreeTitleRenderFn = (node: { key: React.Key; title?: ReactNode }) => ReactNode;
