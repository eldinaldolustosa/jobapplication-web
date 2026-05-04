'use client';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Building2, MapPin, Link2, FileText } from 'lucide-react';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { APPLICATION_STATUSES } from '@/lib/utils';
import { JobApplication } from '@/types';

const schema = z.object({
  company: z.string().min(1, 'Informe a empresa'),
  position: z.string().min(1, 'Informe o cargo'),
  location: z.string().optional(),
  url: z.string().url('URL inválida').optional().or(z.literal('')),
  status: z.string(),
  notes: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

interface Props {
  initial?: Partial<JobApplication>;
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  loading?: boolean;
}

export default function ApplicationForm({ initial, onSubmit, loading }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      company: initial?.company ?? '',
      position: initial?.position ?? '',
      location: initial?.location ?? '',
      url: initial?.url ?? '',
      status: initial?.status ?? 'Enviado',
      notes: initial?.notes ?? '',
    },
  });

  useEffect(() => {
    if (initial) reset(initial as FormData);
  }, [initial, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Empresa *"
          placeholder="Nome da empresa"
          icon={<Building2 size={15} />}
          error={errors.company?.message}
          {...register('company')}
        />
        <Input
          label="Cargo *"
          placeholder="Ex: Desenvolvedor Frontend"
          icon={<FileText size={15} />}
          error={errors.position?.message}
          {...register('position')}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Localização"
          placeholder="Cidade / Remoto"
          icon={<MapPin size={15} />}
          error={errors.location?.message}
          {...register('location')}
        />
        <Input
          label="URL da vaga"
          type="url"
          placeholder="https://..."
          icon={<Link2 size={15} />}
          error={errors.url?.message}
          {...register('url')}
        />
      </div>
      <Select
        label="Status"
        options={APPLICATION_STATUSES.map((s) => ({ value: s, label: s }))}
        error={errors.status?.message}
        {...register('status')}
      />
      <Textarea
        label="Notas"
        placeholder="Observações sobre a candidatura..."
        {...register('notes')}
      />
      <Button type="submit" loading={loading} className="mt-1 w-full sm:w-auto self-end">
        {initial?._id ? 'Salvar alterações' : 'Adicionar candidatura'}
      </Button>
    </form>
  );
}
