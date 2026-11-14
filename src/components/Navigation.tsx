'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useApp } from '@/context/AppContext';
import {
  Sun,
  Moon,
  Laptop,
  Globe,
  Search,
  Volume2,
  VolumeX,
  ShieldAlert,
  Calendar,
  Users,
  HelpCircle,
  MapPin,
  FileText,
  Home,
  Menu,
  X,
} from 'lucide-react';

interface NavigationProps {
  onOpenSearch: () => void;
}

export default function Navigation({ onOpenSearch }: NavigationProps) {
  const { language, setLanguage, theme, setTheme, t, isRtl, isAudioPlaying, toggleAudio } = useApp();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '#home', label: t('nav.home'), icon: Home },
    { href: '#about', label: t('nav.about'), icon: FileText },
    { href: '#schedule', label: t('nav.schedule'), icon: Calendar },
    { href: '#guests', label: t('nav.guests'), icon: Users },
    { href: '#register', label: t('nav.register'), icon: FileText, highlight: true },
    { href: '#faq', label: t('nav.faq'), icon: HelpCircle },
    { href: '#contact', label: t('nav.contact'), icon: MapPin },
  ];

  return (
    <>
      {/* DESKTOP FLOATING NAVBAR (TOP) */}
      <header
        role="banner"
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 hidden md:flex items-center justify-between gap-4 px-5 py-2.5 rounded-full glass-panel shadow-lg shadow-black/5 dark:shadow-black/20 max-w-5xl w-[92%] transition-all duration-300 border border-brand-gold/25"
      >
        {/* Brand / Logo */}
        <Link
          href="#home"
          className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold rounded-full px-1"
          aria-label="UFUQ '26 Home"
        >
          <div className="relative w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-brand-navy p-1">
            <Image
              src="/images/UFUQ-Logo.svg"
              alt="UFUQ '26 Logo"
              width={26}
              height={26}
              className="object-contain"
            />
          </div>
          <div className="flex flex-col text-left rtl:text-right">
            <span className="font-clash font-bold text-sm tracking-wide text-brand-navy dark:text-brand-gold-light leading-tight">
              UFUQ ’26
            </span>
            <span className="font-arabic text-[11px] text-brand-gold font-medium leading-none">
              أُفُق
            </span>
          </div>
        </Link>

        {/* Center Nav Links */}
        <nav
          role="navigation"
          aria-label="Main Navigation"
          className="flex items-center gap-1 lg:gap-2"
        >
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                item.highlight
                  ? 'bg-brand-gold hover:bg-brand-gold-hover text-brand-navy font-semibold shadow-sm'
                  : 'text-neutral-700 dark:text-neutral-300 hover:text-brand-gold dark:hover:text-brand-gold hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right Tools: Search, Audio, Theme, Lang, Admin */}
        <div className="flex items-center gap-1.5">
          {/* Global Search Button */}
          <button
            onClick={onOpenSearch}
            className="p-2 rounded-full text-neutral-600 dark:text-neutral-300 hover:bg-black/5 dark:hover:bg-white/5 transition-colors focus:outline-none"
            aria-label="Search camp details (Cmd+K)"
            title="Search camp details (Cmd+K)"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Ambient Audio Toggle */}
          <button
            onClick={toggleAudio}
            className={`p-2 rounded-full transition-colors focus:outline-none ${
              isAudioPlaying
                ? 'text-brand-gold bg-brand-gold/10'
                : 'text-neutral-600 dark:text-neutral-300 hover:bg-black/5 dark:hover:bg-white/5'
            }`}
            aria-label={isAudioPlaying ? 'Mute ambient soundscape' : 'Play ambient soundscape'}
            title={isAudioPlaying ? 'Mute ambient soundscape' : 'Play ambient soundscape (gentle meditative chord)'}
          >
            {isAudioPlaying ? <Volume2 className="w-4 h-4 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setIsLangOpen(!isLangOpen);
                setIsThemeOpen(false);
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              aria-expanded={isLangOpen}
              aria-label="Change Language"
            >
              <Globe className="w-3.5 h-3.5 text-brand-gold" />
              <span className="uppercase">{language}</span>
            </button>

            {isLangOpen && (
              <div
                className={`absolute top-full mt-2 ${
                  isRtl ? 'left-0' : 'right-0'
                } w-32 py-1 rounded-2xl glass-panel shadow-xl border border-brand-gold/20 flex flex-col`}
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
              className="p-2 rounded-full text-neutral-600 dark:text-neutral-300 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
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
                className={`absolute top-full mt-2 ${
                  isRtl ? 'left-0' : 'right-0'
                } w-28 py-1 rounded-2xl glass-panel shadow-xl border border-brand-gold/20 flex flex-col`}
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

          {/* Admin link */}
          <Link
            href="/admin"
            className="p-2 rounded-full text-neutral-500 hover:text-brand-gold hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            title="Organizer Admin Portal"
            aria-label="Organizer Admin Portal"
          >
            <ShieldAlert className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* MOBILE TOP BAR (MINIMAL: BRAND + CONTROLS) */}
      <header
        role="banner"
        className="fixed top-0 inset-x-0 z-40 md:hidden flex items-center justify-between px-4 py-3 glass-panel border-b border-brand-gold/20"
      >
        <Link href="#home" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-brand-navy p-1 flex items-center justify-center">
            <Image
              src="/images/UFUQ-Logo.svg"
              alt="UFUQ '26"
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
          <button
            onClick={toggleAudio}
            className={`p-2 rounded-full ${isAudioPlaying ? 'text-brand-gold' : 'text-neutral-600 dark:text-neutral-300'}`}
            aria-label="Audio"
          >
            {isAudioPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-full text-neutral-600 dark:text-neutral-300"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* MOBILE MENU MODAL / OVERLAY */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-black/60 backdrop-blur-md flex flex-col p-6 animate-fade-in">
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

          <nav className="flex flex-col gap-3 my-6">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  item.highlight
                    ? 'bg-brand-gold text-brand-navy font-bold shadow'
                    : 'text-neutral-200 hover:bg-white/10'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-auto pt-6 border-t border-white/10 flex flex-col gap-4">
            {/* Language Selection */}
            <div className="flex items-center justify-between text-xs text-white/70">
              <span>{t('language.' + language)}:</span>
              <div className="flex gap-2">
                {(['en', 'ml', 'ar'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`px-3 py-1.5 rounded-lg font-medium text-xs ${
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

            {/* Theme Selection */}
            <div className="flex items-center justify-between text-xs text-white/70">
              <span>Theme:</span>
              <div className="flex gap-2">
                {(['light', 'dark', 'system'] as const).map((th) => (
                  <button
                    key={th}
                    onClick={() => setTheme(th)}
                    className={`px-3 py-1.5 rounded-lg capitalize text-xs ${
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

            <Link
              href="/admin"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              <ShieldAlert className="w-4 h-4 text-brand-gold" />
              {t('nav.admin')} Portal
            </Link>
          </div>
        </div>
      )}

      {/* MOBILE BOTTOM FLOATING DOCK */}
      <nav
        role="navigation"
        aria-label="Mobile Navigation"
        className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 md:hidden flex items-center justify-around w-[94%] max-w-md py-2 px-3 rounded-full glass-panel shadow-2xl border border-brand-gold/30"
      >
        <Link
          href="#home"
          className="flex flex-col items-center gap-0.5 text-neutral-600 dark:text-neutral-400 hover:text-brand-gold py-1 px-2"
        >
          <Home className="w-4 h-4" />
          <span className="text-[10px]">{t('nav.home')}</span>
        </Link>
        <Link
          href="#schedule"
          className="flex flex-col items-center gap-0.5 text-neutral-600 dark:text-neutral-400 hover:text-brand-gold py-1 px-2"
        >
          <Calendar className="w-4 h-4" />
          <span className="text-[10px]">{t('nav.schedule')}</span>
        </Link>
        <Link
          href="#register"
          className="flex items-center justify-center w-11 h-11 -mt-4 rounded-full bg-brand-gold text-brand-navy shadow-lg font-bold hover:scale-105 active:scale-95 transition-transform"
          aria-label="Register"
        >
          <FileText className="w-5 h-5" />
        </Link>
        <Link
          href="#guests"
          className="flex flex-col items-center gap-0.5 text-neutral-600 dark:text-neutral-400 hover:text-brand-gold py-1 px-2"
        >
          <Users className="w-4 h-4" />
          <span className="text-[10px]">{t('nav.guests')}</span>
        </Link>
        <Link
          href="#contact"
          className="flex flex-col items-center gap-0.5 text-neutral-600 dark:text-neutral-400 hover:text-brand-gold py-1 px-2"
        >
          <MapPin className="w-4 h-4" />
          <span className="text-[10px]">{t('nav.contact')}</span>
        </Link>
      </nav>
    </>
  );
}
