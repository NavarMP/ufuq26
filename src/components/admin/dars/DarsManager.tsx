'use client';

import React, { useState, useMemo } from 'react';
import {
  KeyRound,
  Building2,
  CheckCircle,
  Sparkles,
  Search,
  Download,
  Plus,
  Copy,
  Check,
  Eye,
  EyeOff,
  Share2,
  Edit,
  Trash2,
  RotateCcw,
  Loader2,
} from 'lucide-react';
import { DarsAccount, SuffaDars, Registration } from '@/types';
import { normalizePhone } from '@/lib/authHelpers';
import DarsAccountModal from './DarsAccountModal';
import DarsEditModal from './DarsEditModal';
import ConfirmDialog from '../shared/ConfirmDialog';

interface DarsManagerProps {
  darsList: SuffaDars[];
  darsAccounts: DarsAccount[];
  registrations: Registration[];
  addDarsAccount: (account: DarsAccount) => Promise<void>;
  updateDarsAccount: (id: string, updates: Partial<DarsAccount>) => Promise<void>;
  deleteDarsAccount: (id: string) => Promise<void>;
  seedDarsAccounts: () => Promise<{ count: number; seeded: DarsAccount[] }>;
  exportDarsCredentialsCSV: () => void;
  addDars: (dars: Omit<SuffaDars, 'id'> & { id?: string }) => Promise<void>;
  updateDars: (id: string, updates: Partial<SuffaDars>) => Promise<void>;
  deleteDars: (id: string) => Promise<void>;
  resetDarsToDefault: () => Promise<void>;
}

export default function DarsManager({
  darsList,
  darsAccounts,
  registrations,
  addDarsAccount,
  updateDarsAccount,
  deleteDarsAccount,
  seedDarsAccounts,
  exportDarsCredentialsCSV,
  addDars,
  updateDars,
  deleteDars,
  resetDarsToDefault,
}: DarsManagerProps) {
  const [darsSubTab, setDarsSubTab] = useState<'logins' | 'directory'>('logins');
  const [darsLoginSearch, setDarsLoginSearch] = useState('');
  const [darsSearch, setDarsSearch] = useState('');

  // Modals state
  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<DarsAccount | null>(null);

  const [darsModalOpen, setDarsModalOpen] = useState(false);
  const [editingDars, setEditingDars] = useState<SuffaDars | null>(null);

  // Password visibility & copy state
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isSeedingDars, setIsSeedingDars] = useState(false);

  // Confirm dialog state
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void | Promise<void>;
  }>({
    isOpen: false,
    title: '',
    description: '',
    onConfirm: () => {},
  });

  const handleCopyText = (key: string, text: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  const handleShareWhatsApp = (acc: DarsAccount) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://ufuq26.in';
    const message = `*UFUQ '26 — SUFFA DARS PORTAL ACCESS*
----------------------------------------
പ്രിയ മുദരിസ്/കോർഡിനേറ്റർ,
UFUQ '26 റസിഡൻസി ക്യാമ്പിലേക്ക് നിങ്ങളുടെ ദർസിന്റെ വിവരങ്ങളും വിദ്യാർത്ഥികളുടെ രജിസ്ട്രേഷനും കൈകാര്യം ചെയ്യാനുള്ള ലോഗിൻ വിവരങ്ങൾ താഴെ നൽകുന്നു:

*Dars:* ${acc.darsNameEn} (${acc.regNo})
*Mudarris:* ${acc.mudarris}
*Login URL:* ${origin}/dars
*User ID / Reg No:* ${acc.regNo}
*Password:* ${acc.password}

ഈ ലിങ്കിൽ പ്രവേശിച്ച് നിങ്ങളുടെ ദർസിലെ വിദ്യാർത്ഥികളുടെ വിവരങ്ങൾ ചേർക്കാനും പരിശോധിക്കാനും സാധിക്കും.`;

    const cleanPh = normalizePhone(acc.phone);
    const waUrl = `https://wa.me/91${cleanPh}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  };

  const handleSeedAllDarsLogins = async () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Seed All 39 SUFFA Dars Logins',
      description:
        'This will generate protected standard coordinator credentials for all 39 SUFFA centers. Existing custom passwords will not be overwritten.',
      onConfirm: async () => {
        setIsSeedingDars(true);
        try {
          const res = await seedDarsAccounts();
          alert(`Successfully seeded ${res.count} SUFFA Dars login accounts!`);
        } catch (err: any) {
          console.error(err);
          alert('Failed to seed Dars accounts: ' + err.message);
        } finally {
          setIsSeedingDars(false);
          setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        }
      },
    });
  };

  const filteredDarsAccounts = useMemo(() => {
    const q = darsLoginSearch.toLowerCase().trim();
    if (!q) return darsAccounts;
    return darsAccounts.filter(
      (acc) =>
        (acc.regNo || '').toLowerCase().includes(q) ||
        (acc.darsNameEn || '').toLowerCase().includes(q) ||
        (acc.darsNameMl || '').toLowerCase().includes(q) ||
        (acc.mudarris || '').toLowerCase().includes(q) ||
        (acc.phone || '').includes(q)
    );
  }, [darsAccounts, darsLoginSearch]);

  const filteredDars = useMemo(() => {
    const q = darsSearch.toLowerCase().trim();
    if (!q) return darsList;
    return darsList.filter(
      (d) =>
        (d.regNo || '').toLowerCase().includes(q) ||
        (d.nameEn || '').toLowerCase().includes(q) ||
        (d.nameMl || '').toLowerCase().includes(q) ||
        (d.mudarris || '').toLowerCase().includes(q) ||
        (d.phone || '').includes(q) ||
        (d.district || '').toLowerCase().includes(q)
    );
  }, [darsList, darsSearch]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Subtab Pills */}
      <div className="flex items-center gap-2 p-1 rounded-2xl bg-black/5 dark:bg-white/5 w-fit border border-brand-gold/15">
        <button
          type="button"
          onClick={() => setDarsSubTab('logins')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            darsSubTab === 'logins'
              ? 'bg-brand-gold text-brand-navy shadow-md'
              : 'text-neutral-600 dark:text-neutral-300 hover:text-brand-gold'
          }`}
        >
          <KeyRound className="w-3.5 h-3.5" />
          <span>Dars Logins & Portals ({darsAccounts.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setDarsSubTab('directory')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            darsSubTab === 'directory'
              ? 'bg-brand-gold text-brand-navy shadow-md'
              : 'text-neutral-600 dark:text-neutral-300 hover:text-brand-gold'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Dars Directory Centers ({darsList.length})</span>
        </button>
      </div>

      {/* SUB-VIEW 1: DARS LOGIN ACCOUNTS */}
      {darsSubTab === 'logins' && (
        <div className="space-y-5">
          {/* Metrics Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl glass-panel bg-white/70 dark:bg-[#141c2c]/70 border border-brand-gold/20 flex items-center justify-between">
              <div>
                <p className="text-[11px] text-neutral-400 font-medium">Total Dars Logins</p>
                <p className="text-xl font-clash font-bold text-brand-gold">{darsAccounts.length}</p>
              </div>
              <KeyRound className="w-6 h-6 text-brand-gold/40" />
            </div>
            <div className="p-4 rounded-2xl glass-panel bg-white/70 dark:bg-[#141c2c]/70 border border-brand-gold/20 flex items-center justify-between">
              <div>
                <p className="text-[11px] text-neutral-400 font-medium">Active Portals</p>
                <p className="text-xl font-clash font-bold text-emerald-500">
                  {darsAccounts.filter((a) => a.isActive).length}
                </p>
              </div>
              <CheckCircle className="w-6 h-6 text-emerald-500/40" />
            </div>
            <div className="p-4 rounded-2xl glass-panel bg-white/70 dark:bg-[#141c2c]/70 border border-brand-gold/20 flex items-center justify-between">
              <div>
                <p className="text-[11px] text-neutral-400 font-medium">Auto Password Standard</p>
                <p className="text-xs font-mono font-bold text-neutral-700 dark:text-neutral-300">
                  Protected Standard
                </p>
              </div>
              <Sparkles className="w-6 h-6 text-brand-gold/40" />
            </div>
          </div>

          {/* Search & Actions Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={darsLoginSearch}
                onChange={(e) => setDarsLoginSearch(e.target.value)}
                placeholder="Search phone, Dars name, Reg No..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/70 dark:bg-[#141c2c]/70 border border-brand-gold/25 text-xs text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleSeedAllDarsLogins}
                disabled={isSeedingDars}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-gold/15 hover:bg-brand-gold/25 border border-brand-gold/30 text-brand-gold font-bold text-xs transition-colors shrink-0 disabled:opacity-50"
                title="Seed all 39 SUFFA centers with auto-generated passwords"
              >
                {isSeedingDars ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
                <span>Seed 39 SUFFA Logins</span>
              </button>

              <button
                type="button"
                onClick={exportDarsCredentialsCSV}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl glass-panel bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-neutral-700 dark:text-neutral-300 text-xs font-semibold transition-colors shrink-0"
                title="Export credentials list to CSV spreadsheet"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEditingAccount(null);
                  setAccountModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-gold text-brand-navy font-bold text-xs shadow hover:bg-brand-gold-hover transition-colors shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add Dars Login</span>
              </button>
            </div>
          </div>

          {/* Table of Accounts */}
          <div className="rounded-3xl glass-panel bg-white/70 dark:bg-[#141c2c]/70 border border-brand-gold/20 overflow-hidden shadow-lg">
            {filteredDarsAccounts.length === 0 ? (
              <div className="py-12 text-center text-neutral-400 text-xs space-y-2">
                <p>No Dars login accounts found matching &ldquo;{darsLoginSearch}&rdquo;.</p>
                <button
                  type="button"
                  onClick={handleSeedAllDarsLogins}
                  className="text-brand-gold font-bold underline hover:opacity-80"
                >
                  Click here to seed all 39 SUFFA Dars accounts
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-black/5 dark:bg-white/5 border-b border-brand-gold/15 text-neutral-500 uppercase font-mono text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Reg No</th>
                      <th className="py-3 px-4">Dars Center & Mudarris</th>
                      <th className="py-3 px-4">Login Phone</th>
                      <th className="py-3 px-4">Password</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-center">Students</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-gold/10">
                    {filteredDarsAccounts.map((acc) => {
                      const isRevealed = !!visiblePasswords[acc.id];
                      const studentCount = registrations.filter(
                        (r) => r.darsRegNo === acc.regNo || r.darsId === acc.id
                      ).length;

                      return (
                        <tr key={acc.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                          <td className="py-3 px-4 font-mono font-bold text-brand-gold">
                            <span className="px-2 py-0.5 rounded-md bg-brand-gold/15 border border-brand-gold/30">
                              {acc.regNo}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <p className="font-bold text-neutral-900 dark:text-neutral-100">
                              {acc.darsNameEn}
                            </p>
                            {acc.darsNameMl && (
                              <p className="text-[11px] text-neutral-500 font-medium">
                                {acc.darsNameMl}
                              </p>
                            )}
                            <p className="text-[10px] text-brand-teal dark:text-emerald-400">
                              {acc.mudarris}
                            </p>
                          </td>
                          <td className="py-3 px-4">
                            <div className="inline-flex items-center gap-1.5 font-mono text-neutral-700 dark:text-neutral-300">
                              <span>{acc.phone}</span>
                              <button
                                type="button"
                                onClick={() => handleCopyText(`ph-${acc.id}`, acc.phone)}
                                className="p-1 rounded text-neutral-400 hover:text-brand-gold"
                                title="Copy phone"
                              >
                                {copiedKey === `ph-${acc.id}` ? (
                                  <Check className="w-3 h-3 text-emerald-500" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="inline-flex items-center gap-1.5 font-mono">
                              <span className="px-2 py-0.5 rounded bg-black/10 dark:bg-white/10 font-bold text-[11px]">
                                {isRevealed ? acc.password : '••••••••••••'}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  setVisiblePasswords((prev) => ({
                                    ...prev,
                                    [acc.id]: !prev[acc.id],
                                  }))
                                }
                                className="p-1 rounded text-neutral-400 hover:text-brand-gold"
                                title={isRevealed ? 'Hide Password' : 'Show Password'}
                              >
                                {isRevealed ? (
                                  <EyeOff className="w-3.5 h-3.5" />
                                ) : (
                                  <Eye className="w-3.5 h-3.5" />
                                )}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleCopyText(`pw-${acc.id}`, acc.password)}
                                className="p-1 rounded text-neutral-400 hover:text-brand-gold"
                                title="Copy Password"
                              >
                                {copiedKey === `pw-${acc.id}` ? (
                                  <Check className="w-3 h-3 text-emerald-500" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <button
                              type="button"
                              onClick={() => updateDarsAccount(acc.id, { isActive: !acc.isActive })}
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-colors ${
                                acc.isActive
                                  ? 'bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/25'
                                  : 'bg-rose-500/15 text-rose-600 hover:bg-rose-500/25'
                              }`}
                              title="Click to toggle active status"
                            >
                              {acc.isActive ? 'Active' : 'Suspended'}
                            </button>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className="inline-block px-2.5 py-0.5 rounded-full font-mono font-bold text-[11px] bg-brand-gold/15 text-brand-gold border border-brand-gold/30">
                              {studentCount}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="inline-flex items-center gap-1 justify-end">
                              <button
                                type="button"
                                onClick={() => handleShareWhatsApp(acc)}
                                className="p-1.5 rounded-lg text-emerald-500 hover:bg-emerald-500/10 transition-colors"
                                title="Send credentials to Mudarris via WhatsApp"
                              >
                                <Share2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingAccount(acc);
                                  setAccountModalOpen(true);
                                }}
                                className="p-1.5 rounded-lg text-neutral-400 hover:text-brand-gold hover:bg-brand-gold/10 transition-colors"
                                title="Edit login details"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setConfirmDialog({
                                    isOpen: true,
                                    title: 'Revoke Dars Login Account',
                                    description: `Are you sure you want to revoke and delete the login account for ${acc.darsNameEn} (${acc.regNo})? Coordinators will no longer be able to log in.`,
                                    onConfirm: async () => {
                                      await deleteDarsAccount(acc.id);
                                      setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
                                    },
                                  });
                                }}
                                className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                                title="Delete login account"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: DARS CENTERS DIRECTORY */}
      {darsSubTab === 'directory' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={darsSearch}
                onChange={(e) => setDarsSearch(e.target.value)}
                placeholder="Search by Dars, Reg No, Mudarris..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/70 dark:bg-[#141c2c]/70 border border-brand-gold/25 text-xs text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setConfirmDialog({
                    isOpen: true,
                    title: 'Reset Dars Directory',
                    description:
                      'Are you sure you want to reset the Dars Directory back to the initial 39 SUFFA centers?',
                    onConfirm: async () => {
                      await resetDarsToDefault();
                      setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
                    },
                  });
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl glass-panel bg-black/5 dark:bg-white/5 hover:bg-brand-gold/20 text-neutral-700 dark:text-neutral-300 text-xs font-semibold transition-colors shrink-0"
                title="Reset to default 39 SUFFA directory list"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Default</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEditingDars(null);
                  setDarsModalOpen(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-gold text-brand-navy font-bold text-xs shadow hover:bg-brand-gold-hover transition-colors shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add Dars Center</span>
              </button>
            </div>
          </div>

          <div className="rounded-3xl glass-panel bg-white/70 dark:bg-[#141c2c]/70 border border-brand-gold/20 overflow-hidden shadow-lg">
            {filteredDars.length === 0 ? (
              <div className="py-12 text-center text-neutral-400 text-xs">
                No Dars centers found matching &ldquo;{darsSearch}&rdquo;.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-black/5 dark:bg-white/5 border-b border-brand-gold/15 text-neutral-500 uppercase font-mono text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Reg No</th>
                      <th className="py-3 px-4">Dars Name (English)</th>
                      <th className="py-3 px-4">Dars Name (Malayalam)</th>
                      <th className="py-3 px-4">Mudarris</th>
                      <th className="py-3 px-4">District</th>
                      <th className="py-3 px-4">Contact Phone</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-gold/10">
                    {filteredDars.map((dars) => (
                      <tr key={dars.id || dars.regNo} className="hover:bg-black/5 dark:hover:bg-white/5">
                        <td className="py-3 px-4 font-mono font-bold text-brand-gold">
                          <span className="px-2 py-0.5 rounded-md bg-brand-gold/15 border border-brand-gold/30">
                            {dars.regNo}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-semibold text-neutral-900 dark:text-neutral-100">
                          {dars.nameEn}
                        </td>
                        <td className="py-3 px-4 text-neutral-600 dark:text-neutral-300">
                          {dars.nameMl}
                        </td>
                        <td className="py-3 px-4 text-neutral-700 dark:text-neutral-200">
                          {dars.mudarris}
                        </td>
                        <td className="py-3 px-4 text-neutral-500 font-mono text-[11px]">
                          {dars.district || 'Kerala'}
                        </td>
                        <td className="py-3 px-4 font-mono text-neutral-600 dark:text-neutral-300">
                          {dars.phone}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="inline-flex items-center gap-1 justify-end">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingDars(dars);
                                setDarsModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg text-neutral-400 hover:text-brand-gold hover:bg-brand-gold/10 transition-colors"
                              title="Edit Dars center"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setConfirmDialog({
                                  isOpen: true,
                                  title: 'Delete Dars Center',
                                  description: `Are you sure you want to delete ${dars.nameEn} (${dars.regNo}) from the directory?`,
                                  onConfirm: async () => {
                                    await deleteDars(dars.id || dars.regNo);
                                    setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
                                  },
                                });
                              }}
                              className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                              title="Delete Dars center"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Dars Account Modal */}
      <DarsAccountModal
        isOpen={accountModalOpen}
        onClose={() => setAccountModalOpen(false)}
        editingAccount={editingAccount}
        darsList={darsList}
        onSave={async (acc) => {
          if (editingAccount) {
            await updateDarsAccount(editingAccount.id, acc);
          } else {
            await addDarsAccount(acc);
          }
        }}
      />

      {/* Dars Edit Modal */}
      <DarsEditModal
        isOpen={darsModalOpen}
        onClose={() => setDarsModalOpen(false)}
        editingDars={editingDars}
        onSave={async (darsPayload) => {
          if (editingDars) {
            await updateDars(editingDars.id, darsPayload);
          } else {
            await addDars(darsPayload);
          }
        }}
      />

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        description={confirmDialog.description}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
