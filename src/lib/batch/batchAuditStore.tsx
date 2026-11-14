'use client';

import toast from 'react-hot-toast';

export interface AuditRecord<T = Record<string, any>> {
  id: string;
  title: string;
  collectionName: string;
  itemCount: number;
  timestamp: number;
  snapshot: Array<{ id: string; prevData: Partial<T> }>;
  onUndo: () => Promise<void>;
}

class BatchAuditManager {
  private records: AuditRecord[] = [];
  private activeToastId: string | null = null;
  private undoTimer: NodeJS.Timeout | null = null;

  /**
   * Registers a batch action with snapshot and triggers the 15-second undo toast
   */
  registerUndoableAction<T>(record: Omit<AuditRecord<T>, 'id' | 'timestamp'>) {
    const id = `audit_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const fullRecord: AuditRecord = {
      ...record,
      id,
      timestamp: Date.now(),
    };

    this.records.unshift(fullRecord);
    if (this.records.length > 50) {
      this.records.pop(); // Keep last 50
    }

    this.showUndoToast(fullRecord);
  }

  private showUndoToast(record: AuditRecord) {
    if (this.activeToastId) {
      toast.dismiss(this.activeToastId);
    }
    if (this.undoTimer) {
      clearTimeout(this.undoTimer);
    }

    let secondsLeft = 15;

    const toastId = toast.custom(
      (t) => {
        return (
          <div
            className={`${
              t.visible ? 'animate-enter' : 'animate-leave'
            } max-w-md w-full bg-neutral-900 border border-brand-gold/50 shadow-2xl rounded-2xl pointer-events-auto flex items-center justify-between p-3.5 text-white gap-3 z-50`}
          >
            <div className="flex flex-col gap-0.5 text-left">
              <span className="text-xs font-semibold text-neutral-100 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {record.title}
              </span>
              <span className="text-[11px] text-neutral-400">
                {record.itemCount} items modified • Reversible
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={async () => {
                  toast.dismiss(toastId);
                  const loadingToast = toast.loading('Reverting batch changes...');
                  try {
                    await record.onUndo();
                    toast.dismiss(loadingToast);
                    toast.success('Changes successfully reverted!');
                  } catch (err: any) {
                    toast.dismiss(loadingToast);
                    toast.error(`Revert failed: ${err.message || 'Unknown error'}`);
                  }
                }}
                className="px-3 py-1.5 rounded-xl bg-brand-gold hover:bg-brand-gold/90 text-neutral-950 font-bold text-xs shadow-md transition-all active:scale-95 flex items-center gap-1"
              >
                <span>Undo</span>
              </button>
              <button
                onClick={() => toast.dismiss(toastId)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 text-xs"
              >
                ✕
              </button>
            </div>
          </div>
        );
      },
      { duration: 15000, position: 'bottom-right' }
    );

    this.activeToastId = toastId;
    this.undoTimer = setTimeout(() => {
      this.activeToastId = null;
    }, 15000);
  }

  getHistory(): AuditRecord[] {
    return [...this.records];
  }
}

export const batchAuditManager = new BatchAuditManager();
