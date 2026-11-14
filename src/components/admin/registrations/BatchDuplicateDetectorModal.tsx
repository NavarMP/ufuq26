'use client';

import React, { useState, useMemo } from 'react';
import { Registration } from '@/types';
import {
  Users,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Archive,
  ArrowRight,
  X,
  Sparkles,
  Phone,
} from 'lucide-react';
import toast from 'react-hot-toast';

export interface BatchDuplicateDetectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  registrations: Registration[];
  onArchiveRegistration: (id: string, reason?: string) => Promise<void>;
  onDeleteRegistration: (id: string) => Promise<void>;
  onUpdateRegistration: (id: string, updates: Partial<Registration>) => Promise<void>;
  onRefresh?: () => Promise<void>;
}

interface DuplicateCluster {
  key: string;
  type: 'phone' | 'name';
  value: string;
  items: Registration[];
}

export default function BatchDuplicateDetectorModal({
  isOpen,
  onClose,
  registrations,
  onArchiveRegistration,
  onDeleteRegistration,
  onUpdateRegistration,
  onRefresh,
}: BatchDuplicateDetectorModalProps) {
  const [selectedPrimaryMap, setSelectedPrimaryMap] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);

  // Group into duplicate clusters
  const clusters: DuplicateCluster[] = useMemo(() => {
    const phoneMap: Record<string, Registration[]> = {};

    registrations.forEach((r) => {
      if (r.isArchived) return; // Ignore already archived
      const cleanPhone = r.phone.replace(/\D/g, '').slice(-10);
      if (cleanPhone.length === 10) {
        if (!phoneMap[cleanPhone]) phoneMap[cleanPhone] = [];
        phoneMap[cleanPhone].push(r);
      }
    });

    const result: DuplicateCluster[] = [];

    Object.entries(phoneMap).forEach(([phone, items]) => {
      if (items.length > 1) {
        result.push({
          key: `phone_${phone}`,
          type: 'phone',
          value: phone,
          items: items.sort(
            (a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime()
          ),
        });
      }
    });

    return result;
  }, [registrations]);

  if (!isOpen) return null;

  const handleResolveCluster = async (
    cluster: DuplicateCluster,
    action: 'archive' | 'delete'
  ) => {
    const primaryId = selectedPrimaryMap[cluster.key] || cluster.items[0].id;
    const secondaries = cluster.items.filter((i) => i.id !== primaryId);
    const primaryItem = cluster.items.find((i) => i.id === primaryId);

    setIsProcessing(true);
    try {
      // Merge tags & notes if needed
      const allTags = Array.from(
        new Set([
          ...(primaryItem?.tags || []),
          ...secondaries.flatMap((s) => s.tags || []),
        ])
      );

      await onUpdateRegistration(primaryId, {
        tags: allTags,
        adminNotes: `${primaryItem?.adminNotes || ''}\n[Merged duplicate on ${new Date().toLocaleDateString()}]`.trim(),
      });

      for (const sec of secondaries) {
        if (action === 'archive') {
          await onArchiveRegistration(sec.id, `Merged into primary ${primaryId}`);
        } else {
          await onDeleteRegistration(sec.id);
        }
      }

      toast.success(
        `Resolved cluster for ${cluster.value} (${secondaries.length} secondary entries ${action}d)`
      );
      await onRefresh?.();
    } catch (err: any) {
      toast.error(`Resolution error: ${err.message || 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAutoResolveAll = async (action: 'archive' | 'delete') => {
    if (clusters.length === 0) return;
    setIsProcessing(true);
    let resolvedCount = 0;

    try {
      for (const cluster of clusters) {
        const primaryId = selectedPrimaryMap[cluster.key] || cluster.items[0].id;
        const secondaries = cluster.items.filter((i) => i.id !== primaryId);

        for (const sec of secondaries) {
          if (action === 'archive') {
            await onArchiveRegistration(sec.id, `Auto-merged duplicate`);
          } else {
            await onDeleteRegistration(sec.id);
          }
          resolvedCount++;
        }
      }

      toast.success(`Auto-resolved ${clusters.length} duplicate clusters (${resolvedCount} items ${action}d)!`);
      await onRefresh?.();
      onClose();
    } catch (err: any) {
      toast.error(`Failed during batch auto-resolve: ${err.message || 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-neutral-900 border border-brand-gold/40 rounded-2xl max-w-3xl w-full p-6 text-white shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/10 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-100">
                Duplicate Delegate Detector & Resolver
              </h3>
              <p className="text-xs text-neutral-400">
                Found{' '}
                <span className="font-mono font-bold text-amber-400">
                  {clusters.length}
                </span>{' '}
                clusters with identical phone numbers
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Global Toolbar */}
        {clusters.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-neutral-950/60 rounded-xl border border-white/10 shrink-0 text-xs">
            <span className="text-neutral-400">
              Pick which entry to keep as Primary. Secondary entries will have their tags merged and can be archived or deleted.
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleAutoResolveAll('archive')}
                disabled={isProcessing}
                className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-semibold border border-amber-500/30 flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <Archive className="w-3.5 h-3.5" />
                <span>Auto-Archive All Secondaries</span>
              </button>
            </div>
          </div>
        )}

        {/* Clusters List */}
        <div className="overflow-y-auto space-y-4 flex-1 pr-1">
          {clusters.length === 0 ? (
            <div className="p-8 text-center space-y-2">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <p className="text-sm font-semibold text-neutral-200">
                Zero Duplicates Found!
              </p>
              <p className="text-xs text-neutral-400">
                All registered delegates have distinct, unique phone numbers.
              </p>
            </div>
          ) : (
            clusters.map((cluster) => {
              const activePrimaryId = selectedPrimaryMap[cluster.key] || cluster.items[0].id;

              return (
                <div
                  key={cluster.key}
                  className="bg-neutral-950/70 p-4 rounded-xl border border-brand-gold/25 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-brand-gold" />
                      <span className="font-mono font-bold text-xs text-neutral-200">
                        Phone: {cluster.value}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-400 text-[10px] font-bold">
                        {cluster.items.length} Entries
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleResolveCluster(cluster, 'archive')}
                        disabled={isProcessing}
                        className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[11px] font-semibold border border-amber-500/30 flex items-center gap-1 transition-colors"
                      >
                        <Archive className="w-3 h-3" />
                        <span>Archive Secondary</span>
                      </button>

                      <button
                        onClick={() => handleResolveCluster(cluster, 'delete')}
                        disabled={isProcessing}
                        className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-[11px] font-semibold border border-rose-500/30 flex items-center gap-1 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete Secondary</span>
                      </button>
                    </div>
                  </div>

                  {/* Duplicate Items Comparison */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {cluster.items.map((item, idx) => {
                      const isPrimary = item.id === activePrimaryId;

                      return (
                        <div
                          key={item.id}
                          onClick={() =>
                            setSelectedPrimaryMap((prev) => ({
                              ...prev,
                              [cluster.key]: item.id,
                            }))
                          }
                          className={`p-3 rounded-xl border cursor-pointer transition-all ${
                            isPrimary
                              ? 'bg-brand-gold/15 border-brand-gold shadow-md'
                              : 'bg-neutral-900 border-white/10 hover:border-white/20 opacity-80'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="font-bold text-neutral-100 flex items-center gap-1.5">
                              <span
                                className={`w-2.5 h-2.5 rounded-full ${
                                  isPrimary ? 'bg-brand-gold' : 'bg-neutral-600'
                                }`}
                              />
                              {item.fullName}
                            </span>
                            <span className="text-[10px] font-mono text-neutral-400">
                              {new Date(item.submittedAt).toLocaleDateString()}
                            </span>
                          </div>

                          <div className="space-y-0.5 text-[11px] text-neutral-300">
                            <div>RegCode: <span className="font-mono text-brand-gold">{item.regCode || item.id}</span></div>
                            <div>Dars: {item.darsName || 'None'}</div>
                            <div>Status: <span className="uppercase text-[10px] font-bold text-emerald-400">{item.status}</span></div>
                          </div>

                          <div className="mt-2 text-[10px] font-bold uppercase tracking-wider text-right">
                            {isPrimary ? (
                              <span className="text-brand-gold">★ Primary (Keep)</span>
                            ) : (
                              <span className="text-neutral-500">Secondary</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-3 border-t border-white/10 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
