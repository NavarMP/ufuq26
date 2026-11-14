'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import {
  Image as ImageIcon,
  Plus,
  Upload,
  Search,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  Star,
  Sparkles,
  ArrowUp,
  ArrowDown,
  LayoutGrid,
  List,
  CheckSquare,
  Square,
  Film,
  Tag,
  Calendar,
  Layers,
} from 'lucide-react';
import { GalleryItem, GalleryCategory } from '@/types/gallery';
import GalleryItemModal from './GalleryItemModal';
import BatchMediaUploaderModal from './BatchMediaUploaderModal';
import ConfirmDialog from '../shared/ConfirmDialog';
import StatCard from '../shared/StatCard';
import SectionHeader from '../shared/SectionHeader';

interface GalleryManagerProps {
  galleryItems: GalleryItem[];
  addGalleryItem: (item: Omit<GalleryItem, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateGalleryItem: (id: string, updates: Partial<GalleryItem>) => Promise<void>;
  deleteGalleryItem: (id: string) => Promise<void>;
  bulkUpdateGalleryItems: (ids: string[], updates: Partial<GalleryItem>) => Promise<void>;
  bulkDeleteGalleryItems: (ids: string[]) => Promise<void>;
  reorderGalleryItems: (items: GalleryItem[]) => Promise<void>;
}

const CATEGORY_LABELS: Record<GalleryCategory, string> = {
  camp_moments: "Camp UFUQ ’26",
  dars_heritage: "Alathurpadi Dars Heritage",
  ustad_scholars: "The Respected Ustads",
  adsa_initiatives: "ADSA & Alumni Council",
  suffa_fraternity: "39+ SUFFA Dars Network",
  suhba_life: "The Philosophy of SUHBA",
  digital_craft: "Digital Craft & Innovation",
};

export default function GalleryManager({
  galleryItems,
  addGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  bulkUpdateGalleryItems,
  bulkDeleteGalleryItems,
  reorderGalleryItems,
}: GalleryManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const [modalOpen, setModalOpen] = useState(false);
  const [batchModalOpen, setBatchModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

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

  // Filtered & Sorted items
  const filteredItems = useMemo(() => {
    return galleryItems
      .filter((item) => {
        // Search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle =
            item.title.en.toLowerCase().includes(q) ||
            (item.title.ml && item.title.ml.toLowerCase().includes(q)) ||
            (item.title.ar && item.title.ar.toLowerCase().includes(q));
          const matchTag = item.tags.some((t) => t.toLowerCase().includes(q));
          const matchLocation = item.location?.en?.toLowerCase().includes(q);
          if (!matchTitle && !matchTag && !matchLocation) return false;
        }

        // Category filter
        if (categoryFilter !== 'all' && item.category !== categoryFilter) {
          return false;
        }

        // Status filter
        if (statusFilter === 'published' && !item.published) return false;
        if (statusFilter === 'draft' && item.published) return false;

        return true;
      })
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [galleryItems, searchQuery, categoryFilter, statusFilter]);

  // Metrics
  const metrics = useMemo(() => {
    const total = galleryItems.length;
    const published = galleryItems.filter((i) => i.published).length;
    const featured = galleryItems.filter((i) => i.featured).length;
    const reels = galleryItems.filter((i) => Boolean(i.storyGroup)).length;
    return { total, published, featured, reels };
  }, [galleryItems]);

  // Selection handlers
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedIds.length === filteredItems.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredItems.map((i) => i.id));
    }
  };

  // Reorder handlers
  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= filteredItems.length) return;

    const newItems = [...filteredItems];
    const [moved] = newItems.splice(index, 1);
    newItems.splice(targetIndex, 0, moved);

    await reorderGalleryItems(newItems);
  };

  // Quick visibility toggle
  const handleTogglePublish = async (item: GalleryItem) => {
    await updateGalleryItem(item.id, { published: !item.published });
  };

  // Quick bento pin toggle
  const handleToggleFeatured = async (item: GalleryItem) => {
    await updateGalleryItem(item.id, { featured: !item.featured });
  };

  // Delete single
  const handleDeleteItem = (item: GalleryItem) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Gallery Artifact',
      description: `Are you sure you want to delete "${item.title.en}"? This action cannot be undone.`,
      onConfirm: async () => {
        await deleteGalleryItem(item.id);
        setSelectedIds((prev) => prev.filter((id) => id !== item.id));
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  // Bulk operations
  const handleBulkPublish = async (publish: boolean) => {
    if (selectedIds.length === 0) return;
    await bulkUpdateGalleryItems(selectedIds, { published: publish });
    setSelectedIds([]);
  };

  const handleBulkFeature = async (feature: boolean) => {
    if (selectedIds.length === 0) return;
    await bulkUpdateGalleryItems(selectedIds, { featured: feature });
    setSelectedIds([]);
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    setConfirmDialog({
      isOpen: true,
      title: `Delete ${selectedIds.length} Artifacts`,
      description: `Are you sure you want to permanently delete ${selectedIds.length} selected items?`,
      onConfirm: async () => {
        await bulkDeleteGalleryItems(selectedIds);
        setSelectedIds([]);
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-brand-gold/15 flex items-center justify-center text-brand-gold border border-brand-gold/30">
              <ImageIcon className="w-4 h-4" />
            </div>
            <h1 className="font-clash text-2xl font-bold text-white">Gallery Showcase Manager</h1>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Curate visual moments across Camp UFUQ ’26, Alathurpadi Dars, the Ustads, ADSA, SUFFA, and Suhbah
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setBatchModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-semibold transition-all hover:scale-[1.02]"
          >
            <Upload className="w-3.5 h-3.5 text-brand-gold" />
            <span>Batch Upload</span>
          </button>

          <button
            onClick={() => {
              setEditingItem(null);
              setModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-gold hover:bg-brand-gold-hover text-brand-navy text-xs font-bold transition-all shadow-md hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span>Add Artifact</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          label="Total Artifacts"
          value={metrics.total}
          subtext="All curated assets"
          icon={ImageIcon}
        />
        <StatCard
          label="Published Live"
          value={metrics.published}
          subtext={`${metrics.total - metrics.published} drafts hidden`}
          icon={Eye}
        />
        <StatCard
          label="Home Bento Pinned"
          value={metrics.featured}
          subtext="Featured on landing page"
          icon={Star}
        />
        <StatCard
          label="Story Horizon Reels"
          value={metrics.reels}
          subtext="Grouped ephemeral stories"
          icon={Sparkles}
        />
      </div>

      {/* Control Deck: Search, Filters & View Toggle */}
      <div className="p-4 rounded-2xl glass-panel border border-brand-gold/25 bg-black/20 space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by caption, tags, location, or scholar..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-brand-gold"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-brand-navy border border-white/10 text-xs text-white focus:outline-none focus:border-brand-gold"
            >
              <option value="all">All Pillars (7)</option>
              <option value="camp_moments">Camp UFUQ ’26</option>
              <option value="dars_heritage">Dars Heritage</option>
              <option value="ustad_scholars">The Respected Ustads</option>
              <option value="adsa_initiatives">ADSA & Alumni</option>
              <option value="suffa_fraternity">39+ SUFFA Dars</option>
              <option value="suhba_life">Philosophy of SUHBA</option>
              <option value="digital_craft">Digital Craft</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 rounded-xl bg-brand-navy border border-white/10 text-xs text-white focus:outline-none focus:border-brand-gold"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Drafts</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center rounded-xl bg-white/5 border border-white/10 p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-brand-gold text-brand-navy font-bold'
                    : 'text-neutral-400 hover:text-white'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  viewMode === 'table'
                    ? 'bg-brand-gold text-brand-navy font-bold'
                    : 'text-neutral-400 hover:text-white'
                }`}
                title="Table View"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Bulk Action Toolbar */}
        {selectedIds.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 p-2.5 rounded-xl bg-brand-gold/15 border border-brand-gold/40 text-xs text-brand-gold animate-fadeIn">
            <div className="flex items-center gap-2">
              <button
                onClick={selectAll}
                className="flex items-center gap-1 font-bold text-white hover:text-brand-gold"
              >
                <CheckSquare className="w-4 h-4 text-brand-gold" />
                <span>{selectedIds.length} selected</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleBulkPublish(true)}
                className="px-2.5 py-1 rounded-lg bg-black/40 hover:bg-black/60 text-white text-[11px] font-medium"
              >
                Publish Selected
              </button>
              <button
                onClick={() => handleBulkPublish(false)}
                className="px-2.5 py-1 rounded-lg bg-black/40 hover:bg-black/60 text-neutral-300 text-[11px] font-medium"
              >
                Unpublish
              </button>
              <button
                onClick={() => handleBulkFeature(true)}
                className="px-2.5 py-1 rounded-lg bg-black/40 hover:bg-black/60 text-amber-300 text-[11px] font-medium"
              >
                Pin to Home Bento
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-[11px] font-medium"
              >
                Delete Selected
              </button>
              <button
                onClick={() => setSelectedIds([])}
                className="text-[11px] text-neutral-400 hover:text-white ml-1"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {filteredItems.length === 0 ? (
        <div className="rounded-3xl glass-panel border border-brand-gold/20 p-12 text-center bg-black/20">
          <div className="w-16 h-16 rounded-3xl bg-brand-gold/15 flex items-center justify-center text-brand-gold mx-auto mb-4 border border-brand-gold/30">
            <ImageIcon className="w-8 h-8" />
          </div>
          <h3 className="font-clash text-lg font-bold text-white">No Gallery Artifacts Yet</h3>
          <p className="text-xs text-neutral-400 max-w-md mx-auto mt-1 mb-6">
            The gallery is currently clean. You can add authentic photos and reels one by one or batch upload your entire collection directly to Supabase Storage.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setBatchModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold"
            >
              <Upload className="w-4 h-4 text-brand-gold" />
              <span>Batch Upload Media</span>
            </button>
            <button
              onClick={() => {
                setEditingItem(null);
                setModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-brand-gold text-brand-navy text-xs font-bold hover:bg-brand-gold-hover"
            >
              <Plus className="w-4 h-4" />
              <span>Add First Artifact</span>
            </button>
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredItems.map((item, index) => {
            const isSelected = selectedIds.includes(item.id);
            return (
              <div
                key={item.id}
                className={`group rounded-2xl glass-panel border transition-all duration-300 overflow-hidden flex flex-col ${
                  isSelected
                    ? 'border-brand-gold bg-brand-gold/10'
                    : 'border-white/10 hover:border-brand-gold/40 bg-black/20'
                }`}
              >
                {/* Thumbnail & Badges */}
                <div className="relative aspect-video w-full bg-black/60 overflow-hidden">
                  {item.mediaType === 'video' ? (
                    <div className="w-full h-full flex items-center justify-center bg-black/80">
                      <Film className="w-8 h-8 text-brand-gold" />
                    </div>
                  ) : (
                    <Image
                      src={item.url}
                      alt={item.title.en}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      unoptimized
                    />
                  )}

                  {/* Gradient bottom shade */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

                  {/* Select Checkbox */}
                  <button
                    onClick={() => toggleSelect(item.id)}
                    className="absolute top-2.5 left-2.5 p-1 rounded-lg bg-black/60 backdrop-blur-sm text-white hover:text-brand-gold transition-colors z-10"
                  >
                    {isSelected ? (
                      <CheckSquare className="w-4 h-4 text-brand-gold" />
                    ) : (
                      <Square className="w-4 h-4 text-white/60" />
                    )}
                  </button>

                  {/* Status Badges */}
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-10">
                    {item.featured && (
                      <span className="p-1 rounded-lg bg-brand-gold text-brand-navy shadow-sm" title="Featured on Homepage Bento">
                        <Star className="w-3 h-3 fill-current" />
                      </span>
                    )}
                    {item.heroSpotlight && (
                      <span className="p-1 rounded-lg bg-amber-400 text-brand-navy shadow-sm" title="Hero Spotlight">
                        <Sparkles className="w-3 h-3 fill-current" />
                      </span>
                    )}
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold backdrop-blur-sm ${
                        item.published
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-neutral-800 text-neutral-400'
                      }`}
                    >
                      {item.published ? 'Live' : 'Draft'}
                    </span>
                  </div>

                  {/* Category Pill on bottom of thumbnail */}
                  <div className="absolute bottom-2 left-2 z-10">
                    <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-brand-gold text-[10px] font-medium border border-brand-gold/30">
                      {CATEGORY_LABELS[item.category] || item.category}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-3.5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h4 className="font-clash text-sm font-bold text-white line-clamp-1 group-hover:text-brand-gold transition-colors">
                      {item.title.en}
                    </h4>
                    {item.title.ml && (
                      <span className="text-xs text-neutral-400 line-clamp-1 block font-sans">
                        {item.title.ml}
                      </span>
                    )}
                    {item.caption?.en && (
                      <p className="text-[11px] text-neutral-400 line-clamp-2 mt-1">
                        {item.caption.en}
                      </p>
                    )}
                  </div>

                  {/* Meta footer & action buttons */}
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-neutral-400">
                    <span className="text-[10px] font-mono">#{item.order}</span>

                    <div className="flex items-center gap-1">
                      {/* Reorder Up/Down */}
                      <button
                        onClick={() => handleMove(index, 'up')}
                        disabled={index === 0}
                        className="p-1 rounded hover:bg-white/10 text-neutral-400 hover:text-white disabled:opacity-20"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleMove(index, 'down')}
                        disabled={index === filteredItems.length - 1}
                        className="p-1 rounded hover:bg-white/10 text-neutral-400 hover:text-white disabled:opacity-20"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>

                      {/* Featured Toggle */}
                      <button
                        onClick={() => handleToggleFeatured(item)}
                        className={`p-1 rounded hover:bg-white/10 ${
                          item.featured ? 'text-brand-gold' : 'text-neutral-500 hover:text-neutral-300'
                        }`}
                        title={item.featured ? 'Unpin from Home' : 'Pin to Home Bento'}
                      >
                        <Star className={`w-3.5 h-3.5 ${item.featured ? 'fill-current' : ''}`} />
                      </button>

                      {/* Publish Toggle */}
                      <button
                        onClick={() => handleTogglePublish(item)}
                        className="p-1 rounded hover:bg-white/10 text-neutral-400 hover:text-white"
                        title={item.published ? 'Hide / Make Draft' : 'Publish Live'}
                      >
                        {item.published ? (
                          <Eye className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <EyeOff className="w-3.5 h-3.5 text-neutral-500" />
                        )}
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() => {
                          setEditingItem(item);
                          setModalOpen(true);
                        }}
                        className="p-1 rounded hover:bg-white/10 text-neutral-400 hover:text-brand-gold"
                        title="Edit Artifact"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDeleteItem(item)}
                        className="p-1 rounded hover:bg-white/10 text-neutral-400 hover:text-rose-400"
                        title="Delete Artifact"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="rounded-2xl glass-panel border border-brand-gold/20 overflow-hidden bg-black/20">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/5 border-b border-white/10 text-neutral-400 uppercase tracking-wider font-semibold text-[10px]">
                <tr>
                  <th className="p-3 w-10 text-center">
                    <button onClick={selectAll}>
                      {selectedIds.length === filteredItems.length && filteredItems.length > 0 ? (
                        <CheckSquare className="w-4 h-4 text-brand-gold" />
                      ) : (
                        <Square className="w-4 h-4 text-neutral-400" />
                      )}
                    </button>
                  </th>
                  <th className="p-3 w-16">Preview</th>
                  <th className="p-3">Title & Information</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Date</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-center">Bento</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-neutral-200">
                {filteredItems.map((item, index) => {
                  const isSelected = selectedIds.includes(item.id);
                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-white/5 transition-colors ${
                        isSelected ? 'bg-brand-gold/10' : ''
                      }`}
                    >
                      <td className="p-3 text-center">
                        <button onClick={() => toggleSelect(item.id)}>
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-brand-gold" />
                          ) : (
                            <Square className="w-4 h-4 text-white/40" />
                          )}
                        </button>
                      </td>
                      <td className="p-3">
                        <div className="relative w-12 h-10 rounded-lg overflow-hidden bg-black/40 border border-white/10">
                          {item.mediaType === 'video' ? (
                            <div className="w-full h-full flex items-center justify-center">
                              <Film className="w-4 h-4 text-brand-gold" />
                            </div>
                          ) : (
                            <Image
                              src={item.url}
                              alt=""
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          )}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="font-semibold text-white">{item.title.en}</div>
                        {item.title.ml && (
                          <div className="text-[11px] text-neutral-400">{item.title.ml}</div>
                        )}
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full bg-brand-gold/10 text-brand-gold text-[10px] font-medium border border-brand-gold/30">
                          {CATEGORY_LABELS[item.category] || item.category}
                        </span>
                      </td>
                      <td className="p-3 text-neutral-400 font-mono text-[11px]">
                        {item.date || '—'}
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => handleTogglePublish(item)}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            item.published
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-neutral-800 text-neutral-400'
                          }`}
                        >
                          {item.published ? 'Published' : 'Draft'}
                        </button>
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => handleToggleFeatured(item)}
                          className={`p-1 rounded ${
                            item.featured ? 'text-brand-gold' : 'text-neutral-600 hover:text-neutral-400'
                          }`}
                        >
                          <Star className={`w-3.5 h-3.5 ${item.featured ? 'fill-current' : ''}`} />
                        </button>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setEditingItem(item);
                              setModalOpen(true);
                            }}
                            className="p-1 rounded hover:bg-white/10 text-neutral-400 hover:text-brand-gold"
                            title="Edit"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item)}
                            className="p-1 rounded hover:bg-white/10 text-neutral-400 hover:text-rose-400"
                            title="Delete"
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
        </div>
      )}

      {/* Item Modal (Create / Edit) */}
      <GalleryItemModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingItem(null);
        }}
        editingItem={editingItem}
        totalCount={galleryItems.length}
        onSave={async (itemData) => {
          if (editingItem) {
            await updateGalleryItem(editingItem.id, itemData);
          } else {
            await addGalleryItem(itemData);
          }
        }}
      />

      {/* Batch Upload Modal */}
      <BatchMediaUploaderModal
        isOpen={batchModalOpen}
        onClose={() => setBatchModalOpen(false)}
        totalExistingCount={galleryItems.length}
        onBatchCreated={async (newItems) => {
          for (const item of newItems) {
            await addGalleryItem(item);
          }
          setBatchModalOpen(false);
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
