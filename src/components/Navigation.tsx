'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import BrandLogo from '@/components/BrandLogo';
import { useApp } from '@/context/AppContext';
import AudioPill from '@/components/audio/AudioPill';
import ReminderPillBadge from '@/components/reminders/ReminderPillBadge';
import NotificationBellBadge from '@/components/notifications/NotificationBellBadge';
import UnifiedLoginModal from '@/components/UnifiedLoginModal';
import SettingsTrigger from '@/components/settings/SettingsTrigger';
import ShareTriggerButton from '@/components/share/ShareTriggerButton';
import { useShare } from '@/hooks/useShare';
import {
  Sun,
  Moon,
  Laptop,
  Globe,
  Search,
  LogIn,
  Menu,
  X,
  FileText,
  Home,
  Calendar,
  Users,
  Sparkles,
  Share2,
  Compass,
  Image as ImageIcon,
} from 'lucide-react';

interface NavigationProps {
  onOpenSearch: () => void;
}

export default function Navigation({ onOpenSearch }: NavigationProps) {
  const { language, setLanguage, theme, setTheme, t, isRtl } = useApp();
  const { openShare } = useShare();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const homeEl = document.getElementById('home');
    if (homeEl) {
      homeEl.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = '/';
    }
  };

  const handleRegisterClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const regEl = document.getElementById('register');
    if (regEl) {
      regEl.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = '/#register';
    }
  };

  const handleSectionClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth' });
    }
    // If not found (e.g. on /about), the default Link href="/#sectionId" will navigate to homepage section!
  };

  return (
    <>
      {/* DESKTOP COMPACT FLOATING NAVBAR PILL (AUTO-FITTING WITH ZERO DEAD SPACE) */}
      <header
        role="banner"
        className="fixed top-4 left-1/2 -translate-x-1/2 z-40 hidden md:inline-flex items-center gap-2.5 lg:gap-3 px-3.5 py-1.5 rounded-full glass-panel shadow-2xl shadow-black/10 dark:shadow-black/30 border border-brand-gold/35 hover:border-brand-gold/60 transition-all duration-300 w-auto max-w-fit"
      >
        {/* Brand / Logo + Title (Home button) */}
        <Link
          href="#home"
          data-tour="brand"
          onClick={handleHomeClick}
          className="flex items-center gap-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold rounded-full px-1 py-0.5 hover:opacity-90 transition-opacity shrink-0"
          aria-label="UFUQ '26 Home"
        >
          <div className="relative w-7 h-7 rounded-full overflow-hidden flex items-center justify-center bg-[var(--logo-tile)] p-1 shadow-inner border border-brand-gold/30 group-hover:border-brand-gold transition-colors">
            <BrandLogo
              width={22}
              height={22}
              className="object-contain"
              priority
            />
          </div>
          <div className="flex flex-col text-left rtl:text-right">
            <span className="font-clash font-bold text-xs tracking-wide text-brand-navy dark:text-brand-gold-light leading-tight">
              UFUQ ’26
            </span>
            <span className="font-arabic text-[10px] text-brand-gold font-medium leading-none">
              أُفُق
            </span>
          </div>
        </Link>

        {/* Subtle Vertical Hairline Separator */}
        <div className="w-[1px] h-4 bg-neutral-300/60 dark:bg-white/15 mx-0.5 shrink-0" />

        {/* Tools Cluster: Search, Background Music, Language, Theme, Unified Login, Register */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* Global Search Button */}
          <button
            data-tour="search"
            onClick={onOpenSearch}
            className="p-2 rounded-full text-neutral-600 dark:text-neutral-300 hover:text-brand-gold dark:hover:text-brand-gold hover:bg-black/5 dark:hover:bg-white/5 transition-colors focus:outline-none"
            aria-label="Search camp details (Cmd+K)"
            title="Search camp details (Cmd+K)"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Share Hub Button */}
          {/* <ShareTriggerButton variant="icon" label={t('share.title') || "Share UFUQ '26"} /> */}

          {/* Background Music Pill */}
          <div data-tour="audio" className="inline-flex">
            <AudioPill compact={false} />
          </div>

          {/* Notifications & Summit Alerts */}
          <div data-tour="notifications" className="inline-flex">
            <NotificationBellBadge compact={false} />
          </div>

          {/* Language Selector Dropdown */}
          <div className="relative" data-tour="language">
            <button
              onClick={() => {
                setIsLangOpen(!isLangOpen);
                setIsThemeOpen(false);
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-black/5 dark:hover:bg-white/5 transition-colors focus:outline-none"
              aria-expanded={isLangOpen}
              aria-label="Change Language"
            >
              <Globe className="w-3.5 h-3.5 text-brand-gold" />
              <span className="uppercase text-[11px] font-semibold">{language}</span>
            </button>

            {isLangOpen && (
              <div
                className={`absolute top-full mt-2.5 ${
                  isRtl ? 'left-0' : 'right-0'
                } w-32 py-1.5 rounded-2xl glass-panel shadow-2xl border border-brand-gold/30 flex flex-col z-50`}
              >
                <button
                  onClick={() => {
                    setLanguage('en');
                    setIsLangOpen(false);
                  }}
                  className={`px-3 py-1.5 text-xs text-left rtl:text-right hover:bg-brand-gold/15 transition-colors ${
                    language === 'en' ? 'font-bold text-brand-gold' : 'text-neutral-800 dark:text-neutral-200'
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => {
                    setLanguage('ml');
                    setIsLangOpen(false);
                  }}
                  className={`px-3 py-1.5 text-xs text-left rtl:text-right hover:bg-brand-gold/15 transition-colors ${
                    language === 'ml' ? 'font-bold text-brand-gold' : 'text-neutral-800 dark:text-neutral-200'
                  }`}
                >
                  മലയാളം
                </button>
                <button
                  onClick={() => {
                    setLanguage('ar');
                    setIsLangOpen(false);
                  }}
                  className={`px-3 py-1.5 text-xs text-left rtl:text-right font-arabic hover:bg-brand-gold/15 transition-colors ${
                    language === 'ar' ? 'font-bold text-brand-gold' : 'text-neutral-800 dark:text-neutral-200'
                  }`}
                >
                  العربية
                </button>
              </div>
            )}
          </div>

          {/* Theme Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setIsThemeOpen(!isThemeOpen);
                setIsLangOpen(false);
              }}
              className="p-2 rounded-full text-neutral-600 dark:text-neutral-300 hover:text-brand-gold dark:hover:text-brand-gold hover:bg-black/5 dark:hover:bg-white/5 transition-colors focus:outline-none"
              aria-expanded={isThemeOpen}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Moon className="w-4 h-4 text-brand-gold" />
              ) : theme === 'light' ? (
                <Sun className="w-4 h-4 text-amber-500" />
              ) : (
                <Laptop className="w-4 h-4" />
              )}
            </button>

            {isThemeOpen && (
              <div
                className={`absolute top-full mt-2.5 ${
                  isRtl ? 'left-0' : 'right-0'
                } w-28 py-1.5 rounded-2xl glass-panel shadow-2xl border border-brand-gold/30 flex flex-col z-50`}
              >
                <button
                  onClick={() => {
                    setTheme('light');
                    setIsThemeOpen(false);
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs text-neutral-800 dark:text-neutral-200 hover:bg-brand-gold/15 transition-colors"
                >
                  <Sun className="w-3.5 h-3.5 text-amber-500" /> Light
                </button>
                <button
                  onClick={() => {
                    setTheme('dark');
                    setIsThemeOpen(false);
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs text-neutral-800 dark:text-neutral-200 hover:bg-brand-gold/15 transition-colors"
                >
                  <Moon className="w-3.5 h-3.5 text-brand-gold" /> Dark
                </button>
                <button
                  onClick={() => {
                    setTheme('system');
                    setIsThemeOpen(false);
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs text-neutral-800 dark:text-neutral-200 hover:bg-brand-gold/15 transition-colors"
                >
                  <Laptop className="w-3.5 h-3.5" /> System
                </button>
              </div>
            )}
          </div>

          {/* Global Preferences / Settings Button */}
          <SettingsTrigger variant="navbar-desktop" />

          {/* Schedule Masterpiece Link */}
          <Link
            href="/schedule"
            className="p-2 rounded-full text-neutral-600 dark:text-neutral-300 hover:text-brand-gold dark:hover:text-brand-gold hover:bg-black/5 dark:hover:bg-white/5 transition-colors focus:outline-none"
            title={t('nav.schedule') || 'Schedule & Timetable'}
            aria-label="Schedule"
          >
            <Calendar className="w-4 h-4" />
          </Link>

          {/* Gallery Showcase Link */}
          <Link
            href="/gallery"
            className="p-2 rounded-full text-neutral-600 dark:text-neutral-300 hover:text-brand-gold dark:hover:text-brand-gold hover:bg-black/5 dark:hover:bg-white/5 transition-colors focus:outline-none"
            title={t('nav.gallery') || 'Gallery & Horizons'}
            aria-label="Gallery"
          >
            <ImageIcon className="w-4 h-4" />
          </Link>

          {/* Interactive Guide & Experience Manual Link */}
          {/* <Link
            href="/guide"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-semibold text-brand-gold hover:text-brand-gold-light bg-brand-gold/10 hover:bg-brand-gold/20 border border-brand-gold/30 transition-colors focus:outline-none"
            title="Interactive Guide & How to Use"
            aria-label="Interactive Guide"
          >
            <Compass className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">{language === 'ml' ? 'വഴികാട്ടി' : language === 'ar' ? 'الدليل' : 'Guide'}</span>
          </Link> */}

          {/* Unified Login Button (single portal entry for both Dars & Admin) */}
          <button
            data-tour="unified-login"
            onClick={() => setIsLoginModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-neutral-700 dark:text-neutral-200 hover:text-brand-gold dark:hover:text-brand-gold hover:bg-black/5 dark:hover:bg-white/5 transition-colors focus:outline-none border border-neutral-300/40 dark:border-white/10"
            title="Portal Login (Dars & Admin)"
            aria-label="Open Login Portals"
          >
            <LogIn className="w-3.5 h-3.5 text-brand-gold" />
            <span className="hidden lg:inline">{t('nav.login') || 'Login'}</span>
          </button>

          {/* Register Action CTA Button */}
          <Link
            href="#register"
            data-tour="register-cta"
            onClick={handleRegisterClick}
            className="px-4 py-1.5 rounded-full text-xs font-semibold bg-brand-gold hover:bg-brand-gold-hover text-brand-navy shadow-sm hover:shadow transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            {t('nav.register') || 'Register'}
          </Link>
        </div>
      </header>

      {/* MOBILE TOP BAR (BRAND + CONTROLS) */}
      <header
        role="banner"
        className="fixed top-0 inset-x-0 z-40 md:hidden flex items-center justify-between px-4 py-3 glass-panel border-b border-brand-gold/20"
      >
        <Link
          href="#home"
          onClick={handleHomeClick}
          className="flex items-center gap-2"
          aria-label="UFUQ '26 Home"
        >
          <div className="w-7 h-7 rounded-full bg-[var(--logo-tile)] p-1 flex items-center justify-center border border-brand-gold/30">
            <BrandLogo
              width={22}
              height={22}
              className="object-contain"
            />
          </div>
          <span className="font-clash font-bold text-sm text-brand-navy dark:text-brand-gold-light">
            UFUQ ’26
          </span>
          <span className="font-arabic text-xs text-brand-gold font-medium">أُفُق</span>
        </Link>

        <div className="flex items-center gap-1">
          <button
            onClick={onOpenSearch}
            className="p-2 rounded-full text-neutral-600 dark:text-neutral-300"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>
          <AudioPill compact={true} />
          <NotificationBellBadge compact={true} />
          <SettingsTrigger variant="navbar-mobile" />
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-full text-neutral-600 dark:text-neutral-300"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* MOBILE FULLSCREEN MENU OVERLAY */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-black/75 backdrop-blur-xl flex flex-col p-6 animate-fade-in text-white">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="font-clash font-bold text-lg text-white">UFUQ ’26</span>
              <span className="font-arabic text-brand-gold">أُفُق</span>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 text-white/80 hover:text-white"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex flex-col gap-2.5 my-6">
            <Link
              href="/#home"
              onClick={(e) => {
                handleHomeClick(e);
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-neutral-200 hover:bg-white/10 transition-colors"
            >
              <Home className="w-4 h-4 text-brand-gold" />
              {t('nav.home')}
            </Link>
            <Link
              href="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-neutral-200 hover:bg-white/10 transition-colors"
            >
              <FileText className="w-4 h-4 text-brand-gold" />
              {t('nav.about')}
            </Link>
            <Link
              href="/schedule"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-neutral-200 hover:bg-white/10 transition-colors"
            >
              <Calendar className="w-4 h-4 text-brand-gold" />
              {t('nav.schedule')}
            </Link>
            <Link
              href="/#guests"
              onClick={(e) => {
                handleSectionClick(e, 'guests');
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-neutral-200 hover:bg-white/10 transition-colors"
            >
              <Users className="w-4 h-4 text-brand-gold" />
              {t('nav.guests')}
            </Link>
            <Link
              href="/gallery"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-neutral-200 hover:bg-white/10 transition-colors"
            >
              <ImageIcon className="w-4 h-4 text-brand-gold" />
              {t('nav.gallery') || 'Gallery & Horizons'}
            </Link>
            <Link
              href="/guide"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-brand-gold bg-brand-gold/15 border border-brand-gold/30 hover:bg-brand-gold/25 transition-colors"
            >
              <Compass className="w-4 h-4 text-brand-gold" />
              <span>{language === 'ml' ? 'അുഫുഖ് സമഗ്ര വഴികാട്ടി' : language === 'ar' ? 'دليل أُفُق التفاعلي' : 'Interactive Guide & How to Use'}</span>
            </Link>
            <Link
              href="#register"
              onClick={(e) => {
                handleRegisterClick(e);
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold bg-brand-gold text-brand-navy shadow-lg transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              {t('nav.register')}
            </Link>
          </nav>

          <div className="mt-auto pt-6 border-t border-white/10 flex flex-col gap-4">
            {/* Language & Theme Selectors */}
            <div className="flex items-center justify-between text-xs text-white/70">
              <span>{t('language.' + language)}:</span>
              <div className="flex gap-1.5">
                {(['en', 'ml', 'ar'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`px-3 py-1 rounded-lg font-medium text-xs ${
                      language === lang
                        ? 'bg-brand-gold text-brand-navy font-bold'
                        : 'bg-white/10 text-white'
                    }`}
                  >
                    {lang === 'en' ? 'EN' : lang === 'ml' ? 'മലയാളം' : 'العربية'}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-white/70">
              <span>Theme:</span>
              <div className="flex gap-1.5">
                {(['light', 'dark', 'system'] as const).map((th) => (
                  <button
                    key={th}
                    onClick={() => setTheme(th)}
                    className={`px-3 py-1 rounded-lg capitalize text-xs ${
                      theme === th
                        ? 'bg-brand-gold text-brand-navy font-bold'
                        : 'bg-white/10 text-white'
                    }`}
                  >
                    {th}
                  </button>
                ))}
              </div>
            </div>

            {/* Unified Login Button in Mobile Drawer */}
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsLoginModalOpen(true);
              }}
              className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-colors"
            >
              <LogIn className="w-4 h-4 text-brand-gold" />
              <span>{t('nav.unifiedLoginTitle') || 'Portal Access (Login)'}</span>
            </button>

            {/* Share Camp Button in Mobile Drawer */}
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                openShare({
                  title: "UFUQ ’26 — A Transition & Leadership Camp",
                  url: 'https://alathurpadidars.in',
                  type: 'event',
                });
              }}
              className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold bg-brand-gold/15 hover:bg-brand-gold/25 text-brand-gold border border-brand-gold/30 transition-colors"
            >
              <Share2 className="w-4 h-4 text-brand-gold" />
              <span>{t('share.title') || 'Share UFUQ ’26'}</span>
            </button>

            {/* Preferences Row in Mobile Drawer */}
            <div className="pt-1">
              <SettingsTrigger
                variant="drawer-item"
                onBeforeOpen={() => setIsMobileMenuOpen(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* MOBILE BOTTOM FLOATING DOCK */}
      <nav
        role="navigation"
        aria-label="Mobile Navigation"
        className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 md:hidden flex items-center justify-around w-[92%] max-w-sm py-2 px-3 rounded-full glass-panel shadow-2xl border border-brand-gold/30"
      >
        <Link
          href="#home"
          onClick={handleHomeClick}
          className="flex flex-col items-center gap-0.5 text-neutral-600 dark:text-neutral-400 hover:text-brand-gold py-1 px-2"
        >
          <Home className="w-4 h-4" />
          <span className="text-[10px]">{t('nav.home')}</span>
        </Link>
        <Link
          href="/schedule"
          className="flex flex-col items-center gap-0.5 text-neutral-600 dark:text-neutral-400 hover:text-brand-gold py-1 px-2"
        >
          <Calendar className="w-4 h-4" />
          <span className="text-[10px]">{t('nav.schedule')}</span>
        </Link>
        <Link
          href="#register"
          onClick={handleRegisterClick}
          className="flex items-center justify-center w-11 h-11 -mt-4 rounded-full bg-brand-gold text-brand-navy shadow-lg font-bold hover:scale-105 active:scale-95 transition-transform"
          aria-label="Register"
        >
          <FileText className="w-5 h-5" />
        </Link>
        <button
          onClick={() => setIsLoginModalOpen(true)}
          className="flex flex-col items-center gap-0.5 text-neutral-600 dark:text-neutral-400 hover:text-brand-gold py-1 px-2"
          aria-label="Portals"
        >
          <LogIn className="w-4 h-4" />
          <span className="text-[10px]">{t('nav.login')}</span>
        </button>
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="flex flex-col items-center gap-0.5 text-neutral-600 dark:text-neutral-400 hover:text-brand-gold py-1 px-2"
          aria-label="More"
        >
          <Menu className="w-4 h-4" />
          <span className="text-[10px]">Menu</span>
        </button>
      </nav>

      {/* UNIFIED LOGIN MODAL */}
      <UnifiedLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  );
}
