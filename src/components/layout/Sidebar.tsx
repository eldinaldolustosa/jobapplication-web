'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase,
  Building2,
  Users,
  LayoutDashboard,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

const links = [
  { href: '/dashboard', label: 'Painel', icon: LayoutDashboard },
  { href: '/applications', label: 'Candidaturas', icon: Briefcase },
  { href: '/companies', label: 'Empresas', icon: Building2 },
  { href: '/contacts', label: 'Contatos', icon: Users },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="flex flex-col h-full bg-white dark:bg-neutral-900 border-r border-neutral-100 dark:border-neutral-800 shrink-0 overflow-hidden"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-neutral-100 dark:border-neutral-800">
        <div className="h-8 w-8 rounded-xl bg-indigo-600 flex items-center justify-center shrink-0">
          <Briefcase size={16} className="text-white" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="font-bold text-sm text-neutral-900 dark:text-neutral-100 whitespace-nowrap"
            >
              JobTracker
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 flex flex-col gap-1">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-150',
                active
                  ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100'
              )}
            >
              <Icon size={18} className="shrink-0" />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="whitespace-nowrap"
                  >
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-neutral-100 dark:border-neutral-800 p-3 flex flex-col gap-2">
        <div className={cn('flex items-center gap-3 px-2 py-2', collapsed && 'justify-center')}>
          <div className="h-7 w-7 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center shrink-0">
            <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">
              {user?.name?.[0]?.toUpperCase() ?? 'U'}
            </span>
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="min-w-0"
              >
                <p className="text-xs font-medium text-neutral-900 dark:text-neutral-100 truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-neutral-400 dark:text-neutral-500 truncate">{user?.email}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={logout}
          className={cn(
            'flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-neutral-500 dark:text-neutral-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors',
            collapsed && 'justify-center'
          )}
        >
          <LogOut size={16} className="shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                Sair
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        <button
          onClick={() => setCollapsed((v) => !v)}
          className="flex items-center justify-center p-2 rounded-xl text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
    </motion.aside>
  );
}
