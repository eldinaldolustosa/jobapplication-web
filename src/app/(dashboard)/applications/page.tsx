'use client';
import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Trash2, Edit2, ChevronDown, FileUp, History, ExternalLink } from 'lucide-react';
import { applicationsService } from '@/services/applications';
import { JobApplication, Stage } from '@/types';
import { APPLICATION_STATUSES, formatDate } from '@/lib/utils';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Modal from '@/components/ui/Modal';
import ApplicationForm from '@/components/forms/ApplicationForm';
import StageForm from '@/components/forms/StageForm';
import { useToast } from '@/components/ui/Toast';

export default function ApplicationsPage() {
  const { toast } = useToast();
  const [apps, setApps] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [stages, setStages] = useState<Record<string, Stage[]>>({});

  // Modals
  const [createOpen, setCreateOpen] = useState(false);
  const [editItem, setEditItem] = useState<JobApplication | null>(null);
  const [deleteItem, setDeleteItem] = useState<JobApplication | null>(null);
  const [stageItem, setStageItem] = useState<JobApplication | null>(null);
  const [resumeItem, setResumeItem] = useState<JobApplication | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchApps = () => {
    applicationsService.list().then(setApps).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(fetchApps, []);

  const filtered = useMemo(() => {
    return apps.filter((a) => {
      const matchSearch = !search || a.company.toLowerCase().includes(search.toLowerCase()) || a.position.toLowerCase().includes(search.toLowerCase());
      const matchStatus = !filterStatus || a.status === filterStatus;
      return matchSearch && matchStatus;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [apps, search, filterStatus]);

  async function handleCreate(data: Record<string, unknown>) {
    setSaving(true);
    try {
      const created = await applicationsService.create(data as Partial<JobApplication>);
      setApps((prev) => [created, ...prev]);
      setCreateOpen(false);
      toast('Candidatura adicionada!');
    } catch {
      toast('Erro ao criar candidatura', 'error');
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdate(data: Record<string, unknown>) {
    if (!editItem) return;
    setSaving(true);
    try {
      const updated = await applicationsService.update(editItem._id, data as Partial<JobApplication>);
      setApps((prev) => prev.map((a) => (a._id === updated._id ? updated : a)));
      setEditItem(null);
      toast('Candidatura atualizada!');
    } catch {
      toast('Erro ao atualizar candidatura', 'error');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteItem) return;
    setSaving(true);
    try {
      await applicationsService.delete(deleteItem._id);
      setApps((prev) => prev.filter((a) => a._id !== deleteItem._id));
      setDeleteItem(null);
      toast('Candidatura removida');
    } catch {
      toast('Erro ao remover candidatura', 'error');
    } finally {
      setSaving(false);
    }
  }

  async function handleExpandStages(app: JobApplication) {
    const newId = expandedId === app._id ? null : app._id;
    setExpandedId(newId);
    if (newId && !stages[newId]) {
      try {
        const s = await applicationsService.getStages(newId);
        setStages((prev) => ({ ...prev, [newId]: s }));
      } catch { /* ignore */ }
    }
  }

  async function handleAddStage(data: { stage: string; notes?: string; date?: string }) {
    if (!stageItem) return;
    setSaving(true);
    try {
      const stage = await applicationsService.addStage(stageItem._id, data);
      setStages((prev) => ({
        ...prev,
        [stageItem._id]: [...(prev[stageItem._id] ?? []), stage],
      }));
      setApps((prev) =>
        prev.map((a) => (a._id === stageItem._id ? { ...a, status: data.stage as JobApplication['status'] } : a))
      );
      setStageItem(null);
      toast('Etapa registrada!');
    } catch {
      toast('Erro ao registrar etapa', 'error');
    } finally {
      setSaving(false);
    }
  }

  async function handleResumeUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!resumeItem || !e.target.files?.[0]) return;
    setSaving(true);
    try {
      const updated = await applicationsService.uploadResume(resumeItem._id, e.target.files[0]);
      setApps((prev) => prev.map((a) => (a._id === updated._id ? updated : a)));
      setResumeItem(null);
      toast('Currículo enviado!');
    } catch {
      toast('Erro ao enviar currículo', 'error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">Candidaturas</h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
            {apps.length} candidatura{apps.length !== 1 ? 's' : ''} registrada{apps.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus size={16} /> Nova candidatura
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por empresa ou cargo..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-2.5 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Todos os status</option>
          {APPLICATION_STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex flex-col gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 rounded-2xl bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-neutral-500 dark:text-neutral-400 text-sm">Nenhuma candidatura encontrada</p>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          <AnimatePresence initial={false}>
            {filtered.map((app) => (
              <motion.div
                key={app._id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
              >
                <Card className="overflow-hidden">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm">{app.position}</p>
                        <Badge status={app.status} />
                      </div>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                        {app.company}{app.location ? ` · ${app.location}` : ''}
                      </p>
                      {app.notes && (
                        <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1 line-clamp-1">{app.notes}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {app.url && (
                        <a href={app.url} target="_blank" rel="noopener noreferrer"
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors">
                          <ExternalLink size={15} />
                        </a>
                      )}
                      <button onClick={() => setResumeItem(app)}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors">
                        <FileUp size={15} />
                      </button>
                      <button onClick={() => setStageItem(app)}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors">
                        <History size={15} />
                      </button>
                      <button onClick={() => setEditItem(app)}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                        <Edit2 size={15} />
                      </button>
                      <button onClick={() => setDeleteItem(app)}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-800">
                    <span className="text-xs text-neutral-400 dark:text-neutral-500">
                      {formatDate(app.createdAt)}
                    </span>
                    <button
                      onClick={() => handleExpandStages(app)}
                      className="flex items-center gap-1 text-xs text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    >
                      Etapas
                      <motion.span animate={{ rotate: expandedId === app._id ? 180 : 0 }}>
                        <ChevronDown size={13} />
                      </motion.span>
                    </button>
                  </div>

                  <AnimatePresence>
                    {expandedId === app._id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-3 mt-3 border-t border-neutral-100 dark:border-neutral-800">
                          {(stages[app._id] ?? []).length === 0 ? (
                            <p className="text-xs text-neutral-400 dark:text-neutral-500 text-center py-2">
                              Nenhuma etapa registrada
                            </p>
                          ) : (
                            <div className="flex flex-col gap-2">
                              {(stages[app._id] ?? []).map((stage) => (
                                <div key={stage._id} className="flex items-center gap-3">
                                  <div className="h-1.5 w-1.5 rounded-full bg-indigo-400 shrink-0" />
                                  <Badge status={stage.stage} />
                                  <span className="text-xs text-neutral-500 dark:text-neutral-400">
                                    {stage.notes}
                                  </span>
                                  <span className="text-xs text-neutral-400 dark:text-neutral-500 ml-auto">
                                    {formatDate(stage.createdAt)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Create modal */}
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Nova candidatura" size="lg">
        <ApplicationForm onSubmit={handleCreate} loading={saving} />
      </Modal>

      {/* Edit modal */}
      <Modal open={!!editItem} onClose={() => setEditItem(null)} title="Editar candidatura" size="lg">
        {editItem && <ApplicationForm initial={editItem} onSubmit={handleUpdate} loading={saving} />}
      </Modal>

      {/* Delete confirm */}
      <Modal open={!!deleteItem} onClose={() => setDeleteItem(null)} title="Remover candidatura" size="sm">
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
          Tem certeza que deseja remover a candidatura para{' '}
          <strong className="text-neutral-900 dark:text-neutral-100">{deleteItem?.position}</strong> em{' '}
          <strong className="text-neutral-900 dark:text-neutral-100">{deleteItem?.company}</strong>?
        </p>
        <div className="flex gap-2 justify-end">
          <Button variant="secondary" onClick={() => setDeleteItem(null)}>Cancelar</Button>
          <Button variant="danger" onClick={handleDelete} loading={saving}>Remover</Button>
        </div>
      </Modal>

      {/* Stage modal */}
      <Modal open={!!stageItem} onClose={() => setStageItem(null)} title="Registrar etapa">
        {stageItem && <StageForm onSubmit={handleAddStage} loading={saving} />}
      </Modal>

      {/* Resume upload modal */}
      <Modal open={!!resumeItem} onClose={() => setResumeItem(null)} title="Enviar currículo" size="sm">
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
          Selecione um arquivo PDF (máx. 5MB)
        </p>
        <input
          type="file"
          accept=".pdf"
          onChange={handleResumeUpload}
          className="block w-full text-sm text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 dark:file:bg-indigo-900/30 dark:file:text-indigo-300 hover:file:bg-indigo-100 dark:hover:file:bg-indigo-900/50 cursor-pointer"
        />
        {saving && <p className="text-xs text-neutral-500 mt-2">Enviando...</p>}
      </Modal>
    </div>
  );
}
