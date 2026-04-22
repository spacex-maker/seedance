import instance from 'api/axios';
import type { MaterialDetail, MaterialFolderTree, MaterialItem, MaterialPageBody } from '../types';

export async function fetchFolderTree(): Promise<MaterialFolderTree[]> {
  const res = await instance.get<{ success: boolean; data: MaterialFolderTree[] }>(
    '/productx/sa-user-material/folder/tree',
  );
  if (res.data?.success && Array.isArray(res.data.data)) return res.data.data;
  return [];
}

export async function fetchMaterialPage(params: {
  currentPage: number;
  pageSize: number;
  materialType: string;
  folderId?: number | null;
  scope?: string;
}): Promise<MaterialPageBody | null> {
  const res = await instance.get<{ success: boolean; data: MaterialPageBody; message?: string }>(
    '/productx/sa-user-material/page',
    {
      params: {
        currentPage: params.currentPage,
        pageSize: params.pageSize,
        materialType: params.materialType,
        ...(params.scope ? { scope: params.scope } : {}),
        ...(params.folderId != null ? { folderId: params.folderId } : {}),
      },
    },
  );
  if (res.data?.success && res.data.data) return res.data.data;
  return null;
}

export async function fetchMaterialDetail(materialId: number): Promise<MaterialDetail | null> {
  const res = await instance.get<{ success: boolean; data: MaterialDetail; message?: string }>(
    `/productx/sa-user-material/${materialId}`,
  );
  if (res.data?.success && res.data.data) return res.data.data;
  return null;
}

export async function createFolder(name: string, parentId?: number | null): Promise<{ ok: boolean; message?: string }> {
  const res = await instance.post<{ success: boolean; message?: string }>('/productx/sa-user-material/folder', {
    name,
    ...(parentId != null ? { parentId } : {}),
  });
  return { ok: !!res.data?.success, message: res.data?.message };
}

export async function renameFolder(folderId: number, name: string): Promise<{ ok: boolean; message?: string }> {
  const res = await instance.put<{ success: boolean; message?: string }>(
    `/productx/sa-user-material/folder/${folderId}`,
    { name },
  );
  return { ok: !!res.data?.success, message: res.data?.message };
}

export async function deleteFolder(folderId: number): Promise<{ ok: boolean; message?: string }> {
  const res = await instance.delete<{ success: boolean; message?: string }>(
    `/productx/sa-user-material/folder/${folderId}`,
  );
  return { ok: !!res.data?.success, message: res.data?.message };
}

export async function moveMaterialToFolder(
  materialId: number,
  folderId: number | null,
): Promise<{ ok: boolean; message?: string }> {
  const res = await instance.patch<{ success: boolean; message?: string }>(
    `/productx/sa-user-material/${materialId}/folder`,
    { folderId },
  );
  return { ok: !!res.data?.success, message: res.data?.message };
}

export async function moveMaterialsToFolder(
  materialIds: number[],
  folderId: number | null,
): Promise<{ ok: boolean; failed?: { id: number; message?: string }[] }> {
  const failed: { id: number; message?: string }[] = [];
  for (const id of materialIds) {
    const r = await moveMaterialToFolder(id, folderId);
    if (!r.ok) failed.push({ id, message: r.message });
  }
  return { ok: failed.length === 0, failed: failed.length ? failed : undefined };
}
