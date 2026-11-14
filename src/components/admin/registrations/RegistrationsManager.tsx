'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { Registration, SuffaDars } from '@/types';
import { useEvent } from '@/context/EventContext';
import RegistrationStatsOverview from './RegistrationStatsOverview';
import RegistrationSegmentTabs, { SegmentTab } from './RegistrationSegmentTabs';
import RegistrationFiltersBar, { SortField, SortOrder } from './RegistrationFiltersBar';
import RegistrationFilterDrawer from './RegistrationFilterDrawer';
import RegistrationActiveChips, { FilterState } from './RegistrationActiveChips';
import RegistrationTable from './RegistrationTable';
import RegistrationDetailDrawer from './RegistrationDetailDrawer';
import RegistrationFormModal from './RegistrationFormModal';
import BulkActionBar from './BulkActionBar';
import BatchCardPrintModal from '@/components/badge/BatchCardPrintModal';
import {
  cleanPhoneNumber,
  isToday,
  isYesterday,
  isWithinDays,
} from './registrationUtils';

interface RegistrationsManagerProps {
  registrations: Registration[];
  darsList: SuffaDars[];
  onRefresh?: () => Promise<void>;
}

const initialFilterState: FilterState = {
  search: '',
  status: [],
  darsId: '',
  district: '',
  category: '',
  contactType: 'all',
  dateRange: 'all',
  customStartDate: '',
  customEndDate: '',
};

export default function RegistrationsManager({
  registrations,
  darsList,
  onRefresh,
}: RegistrationsManagerProps) {
  const {
    addRegistration,
    updateRegistration,
    updateRegistrationStatus,
    archiveRegistration,
    unarchiveRegistration,
    deleteRegistration,
    bulkUpdateRegistrationStatus,
    bulkArchiveRegistrations,
    bulkUnarchiveRegistrations,
    bulkDeleteRegistrations,
    exportRegistrationsCSV,
  } = useEvent();

  // Tab State
  const [activeTab, setActiveTab] = useState<SegmentTab>('active');

  // Filters & Search State
  const [filters, setFilters] = useState<FilterState>(initialFilterState);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Sorting State (default: newest entry time first)
  const [sortField, setSortField] = useState<SortField>('submittedAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Selection for bulk actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Syncing state
  const [isSyncing, setIsSyncing] = useState(false);

  // Modals & Drawers State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRegistration, setEditingRegistration] = useState<Registration | null>(null);

  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [inspectingRegistration, setInspectingRegistration] = useState<Registration | null>(null);
  const [isBatchPrintModalOpen, setIsBatchPrintModalOpen] = useState(false);

  // Dars Lookup Map & Counts
  const { darsNameMap, darsDistrictMap, darsCounts } = useMemo(() => {
    const nameMap: Record<string, string> = {};
    const districtMap: Record<string, string> = {};
    const counts: Record<string, number> = {};

    darsList.forEach((d) => {
      nameMap[d.regNo] = d.nameEn;
      nameMap[d.id] = d.nameEn;
      if (d.district) {
        districtMap[d.regNo] = d.district;
        districtMap[d.id] = d.district;
      }
    });

    registrations.forEach((r) => {
      const key = r.darsRegNo || r.darsId || '';
      if (key) {
        counts[key] = (counts[key] || 0) + 1;
      }
    });

    return { darsNameMap: nameMap, darsDistrictMap: districtMap, darsCounts: counts };
  }, [darsList, registrations]);

  // Sync Cloud Handler
  const handleSyncCloud = async () => {
    if (!onRefresh) return;
    setIsSyncing(true);
    try {
      await onRefresh();
    } finally {
      setIsSyncing(false);
    }
  };

  // Filter Updates
  const handleFilterChange = useCallback(
    <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const handleRemoveFilter = useCallback((key: keyof FilterState) => {
    setFilters((prev) => ({ ...prev, [key]: initialFilterState[key] }));
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilters(initialFilterState);
  }, []);

  // Sort Toggle
  const handleSortToggle = (field: SortField) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Active filter count (excluding search)
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.darsId) count++;
    if (filters.district) count++;
    if (filters.category) count++;
    if (filters.contactType !== 'all') count++;
    if (filters.dateRange !== 'all') count++;
    return count;
  }, [filters]);

  // Masterpiece Filter & Search Algorithm
  const filteredRegistrations = useMemo(() => {
    return registrations.filter((reg) => {
      // 1. Segment Tab check (active, confirmed, pending, cancelled, archived)
      const isArchived = Boolean(reg.isArchived);
      if (activeTab === 'archived') {
        if (!isArchived) return false;
      } else {
        if (isArchived) return false;
        if (activeTab === 'confirmed' && reg.status !== 'confirmed') return false;
        if (activeTab === 'pending' && reg.status !== 'pending') return false;
        if (activeTab === 'cancelled' && reg.status !== 'cancelled') return false;
      }

      // 2. Omni-Search matching
      if (filters.search.trim()) {
        const q = filters.search.trim().toLowerCase();
        const digits = cleanPhoneNumber(filters.search);

        const matchName = (reg.fullName || '').toLowerCase().includes(q);
        const matchId = (reg.id || '').toLowerCase().includes(q);
        const matchEmail = (reg.email || '').toLowerCase().includes(q);
        const matchDarsName = (reg.darsName || '').toLowerCase().includes(q);
        const matchDarsRegNo = (reg.darsRegNo || '').toLowerCase().includes(q);
        const matchMudarris = (reg.darsMudarris || '').toLowerCase().includes(q);
        const matchNotes = (reg.adminNotes || '').toLowerCase().includes(q);
        const matchDistrict = (reg.darsDistrict || '').toLowerCase().includes(q);

        // Phone digit matching (handles partial phone search or full +91)
        let matchPhone = false;
        if (digits.length >= 3) {
          const regDigits = cleanPhoneNumber(reg.phone);
          matchPhone = regDigits.includes(digits) || digits.includes(regDigits);
        } else {
          matchPhone = (reg.phone || '').includes(q);
        }

        if (
          !matchName &&
          !matchPhone &&
          !matchId &&
          !matchEmail &&
          !matchDarsName &&
          !matchDarsRegNo &&
          !matchMudarris &&
          !matchNotes &&
          !matchDistrict
        ) {
          return false;
        }
      }

      // 3. SUFFA Dars filter
      if (filters.darsId) {
        const matchesDars =
          reg.darsRegNo === filters.darsId ||
          reg.darsId === filters.darsId ||
          (reg.darsName || '').toLowerCase() === filters.darsId.toLowerCase();
        if (!matchesDars) return false;
      }

      // 4. District filter
      if (filters.district) {
        const regDist =
          reg.darsDistrict ||
          (reg.darsRegNo ? darsDistrictMap[reg.darsRegNo] : '') ||
          (reg.darsId ? darsDistrictMap[reg.darsId] : '');
        if ((regDist || '').toLowerCase() !== filters.district.toLowerCase()) {
          return false;
        }
      }

      // 5. Category filter
      if (filters.category) {
        if ((reg.category || 'regular') !== filters.category) {
          return false;
        }
      }

      // 6. Contact completeness
      if (filters.contactType === 'has_email' && !reg.email) {
        return false;
      }
      if (filters.contactType === 'phone_only' && reg.email) {
        return false;
      }

      // 7. Date range filter
      if (filters.dateRange === 'today' && !isToday(reg.submittedAt)) {
        return false;
      }
      if (filters.dateRange === 'yesterday' && !isYesterday(reg.submittedAt)) {
        return false;
      }
      if (filters.dateRange === 'last_7_days' && !isWithinDays(reg.submittedAt, 7)) {
        return false;
      }
      if (filters.dateRange === 'last_30_days' && !isWithinDays(reg.submittedAt, 30)) {
        return false;
      }
      if (filters.dateRange === 'custom') {
        const time = new Date(reg.submittedAt).getTime();
        if (filters.customStartDate) {
          const start = new Date(filters.customStartDate).setHours(0, 0, 0, 0);
          if (time < start) return false;
        }
        if (filters.customEndDate) {
          const end = new Date(filters.customEndDate).setHours(23, 59, 59, 999);
          if (time > end) return false;
        }
      }

      return true;
    });
  }, [registrations, activeTab, filters, darsDistrictMap]);

  // Masterpiece Sorting Algorithm with tie-breaker
  const sortedRegistrations = useMemo(() => {
    return [...filteredRegistrations].sort((a, b) => {
      let cmp = 0;

      if (sortField === 'submittedAt') {
        cmp =
          new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime();
      } else if (sortField === 'fullName') {
        cmp = (a.fullName || '').localeCompare(b.fullName || '');
      } else if (sortField === 'id') {
        cmp = (a.id || '').localeCompare(b.id || '');
      } else if (sortField === 'status') {
        const orderMap: Record<string, number> = { pending: 1, confirmed: 2, cancelled: 3 };
        cmp = (orderMap[a.status] || 0) - (orderMap[b.status] || 0);
      } else if (sortField === 'darsName') {
        cmp = (a.darsName || '').localeCompare(b.darsName || '');
      } else if (sortField === 'darsDistrict') {
        cmp = (a.darsDistrict || '').localeCompare(b.darsDistrict || '');
      }

      if (cmp === 0) {
        // Secondary tie-breaker: newest submittedAt
        return (
          new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
        );
      }

      return sortOrder === 'asc' ? cmp : -cmp;
    });
  }, [filteredRegistrations, sortField, sortOrder]);

  // Row Selection Handlers
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (select: boolean) => {
    if (select) {
      setSelectedIds(sortedRegistrations.map((r) => r.id));
    } else {
      setSelectedIds([]);
    }
  };

  // Inspect Drawer Handlers
  const handleViewDetails = (reg: Registration) => {
    setInspectingRegistration(reg);
    setIsDetailDrawerOpen(true);
  };

  // Edit Modal Handlers
  const handleOpenEdit = (reg: Registration) => {
    setEditingRegistration(reg);
    setIsEditModalOpen(true);
  };

  // Permanent Delete Safeguard
  const handlePermanentDelete = async (id: string, name: string) => {
    if (
      confirm(
        `Are you sure you want to permanently delete registration for "${name}" (${id})?\n\nThis action cannot be undone.`
      )
    ) {
      await deleteRegistration(id);
      setSelectedIds((prev) => prev.filter((i) => i !== id));
      if (inspectingRegistration?.id === id) {
        setIsDetailDrawerOpen(false);
      }
    }
  };

  // Bulk Operations
  const handleBulkStatus = async (status: Registration['status']) => {
    if (selectedIds.length === 0) return;
    await bulkUpdateRegistrationStatus(selectedIds, status);
  };

  const handleBulkArchive = async () => {
    if (selectedIds.length === 0) return;
    await bulkArchiveRegistrations(selectedIds);
    setSelectedIds([]);
  };

  const handleBulkUnarchive = async () => {
    if (selectedIds.length === 0) return;
    await bulkUnarchiveRegistrations(selectedIds);
    setSelectedIds([]);
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (
      confirm(
        `Permanently delete ${selectedIds.length} selected registrations from database? This cannot be undone.`
      )
    ) {
      await bulkDeleteRegistrations(selectedIds);
      setSelectedIds([]);
    }
  };

  const handleBulkExportCSV = () => {
    const subset = registrations.filter((r) => selectedIds.includes(r.id));
    exportRegistrationsCSV(
      subset,
      `UFUQ26_Selected_${selectedIds.length}_Registrations.csv`
    );
  };

  const handleExportFilteredCSV = () => {
    exportRegistrationsCSV(
      sortedRegistrations,
      `UFUQ26_Registrations_${activeTab}_${new Date().toISOString().slice(0, 10)}.csv`
    );
  };

  const handleCopyPhoneNumbers = () => {
    const list =
      selectedIds.length > 0
        ? registrations.filter((r) => selectedIds.includes(r.id))
        : sortedRegistrations;

    const phones = list
      .map((r) => cleanPhoneNumber(r.phone))
      .filter((p) => p.length >= 10)
      .map((p) => (p.startsWith('91') ? p : `91${p.slice(-10)}`));

    const unique = Array.from(new Set(phones)).join(', ');
    navigator.clipboard.writeText(unique);
  };

  return (
    <div className="space-y-4">
      {/* 1. Real-Time KPI Metric Cards */}
      <RegistrationStatsOverview
        registrations={registrations}
        darsList={darsList}
      />

      {/* 2. Primary Segment Tabs (Active, Confirmed, Pending, Cancelled, Archived) */}
      <div className="pt-2">
        <RegistrationSegmentTabs
          currentTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            setSelectedIds([]); // clear selection when switching tabs
          }}
          registrations={registrations}
        />
      </div>

      {/* 3. Filter Bar (Omni-Search, Filter Drawer Toggle, Sort Selector, Actions) */}
      <RegistrationFiltersBar
        search={filters.search}
        onSearchChange={(val) => handleFilterChange('search', val)}
        activeFilterCount={activeFilterCount}
        onOpenFilterDrawer={() => setIsFilterDrawerOpen(true)}
        sortField={sortField}
        sortOrder={sortOrder}
        onSortChange={(field, order) => {
          setSortField(field);
          setSortOrder(order);
        }}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
        onSyncCloud={handleSyncCloud}
        isSyncing={isSyncing}
        onExportCSV={handleExportFilteredCSV}
        totalFilteredCount={sortedRegistrations.length}
      />

      {/* 4. Active Removable Filter Chips */}
      <RegistrationActiveChips
        filters={filters}
        onRemoveFilter={handleRemoveFilter}
        onClearAll={handleResetFilters}
        filteredCount={sortedRegistrations.length}
        totalCount={registrations.length}
        darsNameMap={darsNameMap}
      />

      {/* 5. Masterpiece Data Table with Precision Dual-Line Timestamps & Sorting */}
      <RegistrationTable
        registrations={sortedRegistrations}
        selectedIds={selectedIds}
        onToggleSelect={handleToggleSelect}
        onSelectAll={handleSelectAll}
        sortField={sortField}
        sortOrder={sortOrder}
        onSortToggle={handleSortToggle}
        onViewDetails={handleViewDetails}
        onEditRegistration={handleOpenEdit}
        onStatusChange={(id, status) => updateRegistrationStatus(id, status)}
        onArchiveRegistration={(id) => archiveRegistration(id)}
        onUnarchiveRegistration={(id) => unarchiveRegistration(id)}
        onPermanentDelete={handlePermanentDelete}
        isArchivedView={activeTab === 'archived'}
      />

      {/* 6. Floating Contextual Bulk Action Bar */}
      <BulkActionBar
        selectedCount={selectedIds.length}
        onClearSelection={() => setSelectedIds([])}
        onBulkStatus={handleBulkStatus}
        onBulkArchive={handleBulkArchive}
        onBulkUnarchive={handleBulkUnarchive}
        onBulkDelete={handleBulkDelete}
        onBulkExport={handleBulkExportCSV}
        onCopyPhoneNumbers={handleCopyPhoneNumbers}
        onBulkPrintBadges={() => setIsBatchPrintModalOpen(true)}
        isArchivedView={activeTab === 'archived'}
      />

      {/* 7. Slide-over Right Drawer for Advanced Filters */}
      <RegistrationFilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        darsList={darsList}
        darsCounts={darsCounts}
      />

      {/* 8. Slide-over Right Drawer for Deep Record Inspection */}
      <RegistrationDetailDrawer
        registration={inspectingRegistration}
        isOpen={isDetailDrawerOpen}
        onClose={() => {
          setIsDetailDrawerOpen(false);
          setInspectingRegistration(null);
        }}
        onEdit={(reg) => {
          setIsDetailDrawerOpen(false);
          handleOpenEdit(reg);
        }}
        onStatusChange={async (id, status) => {
          await updateRegistrationStatus(id, status);
          if (inspectingRegistration) {
            setInspectingRegistration({ ...inspectingRegistration, status });
          }
        }}
        onArchive={async (id) => {
          await archiveRegistration(id);
          setIsDetailDrawerOpen(false);
        }}
        onUnarchive={async (id) => {
          await unarchiveRegistration(id);
          setIsDetailDrawerOpen(false);
        }}
        onPermanentDelete={handlePermanentDelete}
        onSaveNotes={async (id, notes) => {
          await updateRegistration(id, { adminNotes: notes });
          if (inspectingRegistration) {
            setInspectingRegistration({ ...inspectingRegistration, adminNotes: notes });
          }
        }}
        darsList={darsList}
      />

      {/* 9. Create New Registration Modal (Walk-in / Delegate / VIP) */}
      <RegistrationFormModal
        isOpen={isCreateModalOpen}
        mode="create"
        registration={null}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={async (data) => {
          await addRegistration(data);
        }}
        darsList={darsList}
        existingRegistrations={registrations}
      />

      {/* 10. Edit Existing Registration Modal */}
      <RegistrationFormModal
        isOpen={isEditModalOpen}
        mode="edit"
        registration={editingRegistration}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingRegistration(null);
        }}
        onSave={async (data) => {
          if (editingRegistration) {
            await updateRegistration(editingRegistration.id, data);
          }
        }}
        darsList={darsList}
        existingRegistrations={registrations}
      />

      {/* 11. Batch CR80 Plastic Card Print Modal */}
      <BatchCardPrintModal
        isOpen={isBatchPrintModalOpen}
        onClose={() => setIsBatchPrintModalOpen(false)}
        registrations={registrations.filter((r) => selectedIds.includes(r.id))}
      />
    </div>
  );
}
