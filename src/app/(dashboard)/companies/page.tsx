'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, ExternalLink, Search, Building2 } from 'lucide-react';
import { linkedinService } from '@/services/linkedin';
import { LinkedinCompany } from '@/types';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Modal from '@/components/ui/Modal';
import CompanyForm from '@/components/forms/CompanyForm';
import { useToast } from '@/components/ui/Toast';

export default function CompaniesPage() {
  const { toast } = useToast();
  const [companies, setCompanies] = useState<LinkedinCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [editItem, setEditItem] = useState<LinkedinCompany | null>(null);
  const [deleteItem, setDeleteItem] = useState<LinkedinCompany | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchCompanies = () => {
    linkedinService.listCompanies().then(setCompanies).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(fetchCompanies, []);

  const filtered = companies.filter((c) =>
    !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.industry?.toLowerCase().includes(search.toLowerCase())
  );

  async function handleCreate(data: Partial<LinkedinCompany>) {
    setSaving(true);
    try {
      const created = await linkedinService.createCompany(data);
      setCompanies((prev) => [created, ...prev]);
      setCreateOpen(false);
      toast('Empresa adicionada!');
    } catch {
      toast('Erro ao adicionar empresa', 'error');
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdate(data: Partial<LinkedinCompany>) {
    if (!editItem) return;
    setSaving(true);
    try {
      const updated = await linkedinService.updateCompany(editItem._id, data);
      setCompanies((prev) => prev.map((c) => (c._id === updated._id ? updated : c)));
      setEditItem(null);
      toast('Empresa atualizada!');
    } catch {
      toast('Erro ao atualizar empresa', 'error');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteItem) return;
    setSaving(true);
    try {
      await linkedinService.deleteCompany(deleteItem._id);
      setCompanies((prev) => prev.filter((c) => c._id !== deleteItem._id));
      setDeleteItem(null);
      toast('Empresa removida');
    } catch {
      toast('Erro ao remover empresa', 'error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">Empresas LinkedIn</h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
            {companies.length} empresa{companies.length !== 1 ? 's' : ''} cadastrada{companies.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus size={16} /> Nova empresa
        </Button>
      </div>

      <div className="relative mb-6">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nome ou setor..."
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-32 rounded-2xl bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card className="text-center py-12">
          <Building2 size={32} className="mx-auto text-neutral-300 dark:text-neutral-600 mb-3" />
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Nenhuma empresa encontrada</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence initial={false}>
            {filtered.map((company) => (
              <motion.div
                key={company._id}
                layout
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
              >
                <Card hover className="flex flex-col h-full">
                  <div className="flex items-start justify-between gap-2">
                    <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center shrink-0">
                      <Building2 size={18} className="text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div className="flex items-center gap-1">
                      {company.linkedinUrl && (
                        <a href={company.linkedinUrl} target="_blank" rel="noopener noreferrer"
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors">
                          <ExternalLink size={14} />
                        </a>
                      )}
                      <button onClick={() => setEditItem(company)}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => setDeleteItem(company)}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className="font-semibold text-sm text-neutral-900 dark:text-neutral-100">{company.name}</p>
                    {company.industry && <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">{company.industry}</p>}
                    {company.size && <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">{company.size}</p>}
                    {company.notes && (
                      <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-2 line-clamp-2">{company.notes}</p>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Nova empresa">
        <CompanyForm onSubmit={handleCreate} loading={saving} />
      </Modal>

      <Modal open={!!editItem} onClose={() => setEditItem(null)} title="Editar empresa">
        {editItem && <CompanyForm initial={editItem} onSubmit={handleUpdate} loading={saving} />}
      </Modal>

      <Modal open={!!deleteItem} onClose={() => setDeleteItem(null)} title="Remover empresa" size="sm">
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
          Deseja remover <strong className="text-neutral-900 dark:text-neutral-100">{deleteItem?.name}</strong>?
        </p>
        <div className="flex gap-2 justify-end">
          <Button variant="secondary" onClick={() => setDeleteItem(null)}>Cancelar</Button>
          <Button variant="danger" onClick={handleDelete} loading={saving}>Remover</Button>
        </div>
      </Modal>
    </div>
  );
}
