'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ALL_TOOLS } from '@/lib/utils/constants';
import ThemeToggle from './ThemeToggle';
import { Wrench, Image as ImageIcon, FileText, Search, Menu, X, ChevronDown } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [imageDropdown, setImageDropdown] = useState(false);
  const [pdfDropdown, setPdfDropdown] = useState(false);

  const imageTools = ALL_TOOLS.filter((t) => t.category === 'image');
  const pdfTools = ALL_TOOLS.filter((t) => t.category === 'pdf');

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-500 p-[2px] shadow-sm group-hover:shadow-md transition-all">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                <Wrench className="w-5 h-5 text-cyan-600 group-hover:rotate-12 transition-transform" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-600 via-sky-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">
                RawByte<span className="text-slate-900 font-medium">Tools</span>
              </span>
              <span className="text-[10px] text-slate-500 tracking-wider font-semibold -mt-1">
                100% PRIVATE BROWSER UTILITIES
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className="px-3.5 py-2 rounded-xl text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              Home
            </Link>

            {/* Image Tools Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setImageDropdown(true)}
              onMouseLeave={() => setImageDropdown(false)}
            >
              <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors">
                <ImageIcon className="w-4 h-4 text-cyan-600" />
                Image Tools
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {imageDropdown && (
                <div className="absolute top-full left-0 w-64 pt-2 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="p-2 rounded-2xl bg-white border border-slate-200 shadow-xl">
                    {imageTools.map((tool) => (
                      <Link
                        key={tool.id}
                        href={`/${tool.slug}`}
                        className="flex items-center justify-between p-2.5 rounded-xl text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-cyan-50 border border-transparent transition-all"
                      >
                        <span>{tool.title}</span>
                        {tool.popular && (
                          <span className="px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-100 text-cyan-700 border border-cyan-200">
                            Popular
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* PDF Tools Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setPdfDropdown(true)}
              onMouseLeave={() => setPdfDropdown(false)}
            >
              <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors">
                <FileText className="w-4 h-4 text-purple-600" />
                PDF Tools
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {pdfDropdown && (
                <div className="absolute top-full left-0 w-64 pt-2 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="p-2 rounded-2xl bg-white border border-slate-200 shadow-xl">
                    {pdfTools.map((tool) => (
                      <Link
                        key={tool.id}
                        href={`/${tool.slug}`}
                        className="flex items-center justify-between p-2.5 rounded-xl text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-purple-50 border border-transparent transition-all"
                      >
                        <span>{tool.title}</span>
                        {tool.popular && (
                          <span className="px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-purple-100 text-purple-700 border border-purple-200">
                            Popular
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/about"
              className="px-3.5 py-2 rounded-xl text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="px-3.5 py-2 rounded-xl text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <ThemeToggle />

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white p-4 space-y-4 shadow-lg">
          <div className="space-y-1">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Home
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              About
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Contact
            </Link>
          </div>

          <div className="pt-2 border-t border-slate-200">
            <span className="block px-3 pb-2 text-xs font-semibold uppercase text-cyan-600 tracking-wider">
              Image Tools
            </span>
            <div className="grid grid-cols-2 gap-1">
              {imageTools.map((tool) => (
                <Link
                  key={tool.id}
                  href={`/${tool.slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                >
                  {tool.title}
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200">
            <span className="block px-3 pb-2 text-xs font-semibold uppercase text-purple-600 tracking-wider">
              PDF Tools
            </span>
            <div className="grid grid-cols-2 gap-1">
              {pdfTools.map((tool) => (
                <Link
                  key={tool.id}
                  href={`/${tool.slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                >
                  {tool.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
