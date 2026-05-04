'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { applicationsService } from '@/services/applications';
import { JobApplication } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import { formatDate } from '@/lib/utils';

const stagger = {
  animate: { transition: { staggerChildren: 0.07 } },
};
const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    applicationsService.list().then(setApplications).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const total = applications.length;
  const active = applications.filter((a) => !['Contrato', 'Rejeitado'].includes(a.status)).length;
  const offers = applications.filter((a) => a.status === 'Contrato').length;
  const recent = [...applications].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  const stats = [
    { label: 'Total de candidaturas', value: total, icon: Briefcase, color: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' },
    { label: 'Em andamento', value: active, icon: Clock, color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' },
    { label: 'Propostas recebidas', value: offers, icon: CheckCircle, color: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' },
    { label: 'Taxa de sucesso', value: total > 0 ? `${Math.round((offers / total) * 100)}%` : '—', icon: TrendingUp, color: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400' },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
          Olá, {user?.name?.split(' ')[0]} 👋
        </h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
          Aqui está um resumo das suas candidaturas
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div variants={stagger} initial="initial" animate="animate" className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <motion.div key={stat.label} variants={fadeUp}>
            <Card>
              <div className={`inline-flex p-2.5 rounded-xl mb-3 ${stat.color}`}>
                <stat.icon size={18} />
              </div>
              <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                {loading ? '—' : stat.value}
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">{stat.label}</p>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Recent applications */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
            Candidaturas recentes
          </h3>
          <Link href="/applications" className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">
            Ver todas
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col gap-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 rounded-2xl bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
            ))}
          </div>
        ) : recent.length === 0 ? (
          <Card className="text-center py-10">
            <Briefcase size={32} className="mx-auto text-neutral-300 dark:text-neutral-600 mb-3" />
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Nenhuma candidatura ainda</p>
            <Link href="/applications" className="mt-2 inline-block text-xs text-indigo-600 dark:text-indigo-400 hover:underline">
              Adicionar candidatura
            </Link>
          </Card>
        ) : (
          <div className="flex flex-col gap-3">
            {recent.map((app) => (
              <motion.div key={app._id} whileHover={{ x: 2 }} transition={{ type: 'spring', stiffness: 300 }}>
                <Card className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                      {app.position}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">{app.company}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <Badge status={app.status} />
                    <span className="text-xs text-neutral-400 dark:text-neutral-500 hidden sm:block">
                      {formatDate(app.createdAt)}
                    </span>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
