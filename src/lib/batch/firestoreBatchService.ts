import { db } from '@/lib/firebase';
import { collection, doc, writeBatch } from 'firebase/firestore';

export interface BatchMutation<T = Record<string, any>> {
  id: string;
  collectionName: string;
  type: 'update' | 'set' | 'delete';
  data?: Partial<T>;
}

export interface BatchProgressInfo {
  completed: number;
  total: number;
  currentChunk: number;
  totalChunks: number;
  percentage: number;
  isFinished: boolean;
  hasErrors: boolean;
  errorSummary?: string;
}

export type BatchProgressCallback = (progress: BatchProgressInfo) => void;

const DEFAULT_CHUNK_SIZE = 450; // Firestore limit is 500, keep safety margin

/**
 * Executes a list of mutations in chunked Firestore write batches.
 * Safely handles datasets of any size (e.g. 500, 2000+ records) without hitting Firestore limits.
 */
export async function executeFirestoreBatch<T = Record<string, any>>(
  mutations: BatchMutation<T>[],
  options?: {
    chunkSize?: number;
    onProgress?: BatchProgressCallback;
    abortSignal?: AbortSignal;
    retryCount?: number;
  }
): Promise<{
  success: boolean;
  totalProcessed: number;
  failedCount: number;
  errors: Array<{ chunkIndex: number; error: string }>;
}> {
  const chunkSize = options?.chunkSize || DEFAULT_CHUNK_SIZE;
  const onProgress = options?.onProgress;
  const signal = options?.abortSignal;
  const maxRetries = options?.retryCount ?? 2;

  const total = mutations.length;
  if (total === 0) {
    return { success: true, totalProcessed: 0, failedCount: 0, errors: [] };
  }

  // Partition into chunks
  const chunks: BatchMutation<T>[][] = [];
  for (let i = 0; i < total; i += chunkSize) {
    chunks.push(mutations.slice(i, i + chunkSize));
  }

  const totalChunks = chunks.length;
  let completed = 0;
  const errors: Array<{ chunkIndex: number; error: string }> = [];

  for (let chunkIdx = 0; chunkIdx < totalChunks; chunkIdx++) {
    if (signal?.aborted) {
      throw new Error('Batch operation cancelled by user.');
    }

    const currentChunk = chunks[chunkIdx];
    let attempt = 0;
    let chunkCommitted = false;

    while (attempt <= maxRetries && !chunkCommitted) {
      try {
        const batch = writeBatch(db);

        for (const item of currentChunk) {
          const docRef = doc(db, item.collectionName, item.id);
          if (item.type === 'delete') {
            batch.delete(docRef);
          } else if (item.type === 'set') {
            batch.set(docRef, (item.data || {}) as any, { merge: true });
          } else {
            batch.update(docRef, (item.data || {}) as any);
          }
        }

        await batch.commit();
        chunkCommitted = true;
      } catch (err: any) {
        attempt++;
        if (attempt > maxRetries) {
          errors.push({
            chunkIndex: chunkIdx,
            error: err.message || 'Unknown Firestore batch commit error',
          });
          console.error(`Firestore batch chunk ${chunkIdx + 1}/${totalChunks} failed:`, err);
        } else {
          // Exponential backoff wait before retry
          await new Promise((res) => setTimeout(res, 400 * Math.pow(2, attempt)));
        }
      }
    }

    completed += currentChunk.length;

    onProgress?.({
      completed,
      total,
      currentChunk: chunkIdx + 1,
      totalChunks,
      percentage: Math.min(100, Math.round((completed / total) * 100)),
      isFinished: chunkIdx + 1 === totalChunks,
      hasErrors: errors.length > 0,
      errorSummary: errors.length > 0 ? `${errors.length} chunks failed` : undefined,
    });
  }

  return {
    success: errors.length === 0,
    totalProcessed: completed,
    failedCount: errors.reduce((acc, curr) => acc + (chunks[curr.chunkIndex]?.length || 0), 0),
    errors,
  };
}
