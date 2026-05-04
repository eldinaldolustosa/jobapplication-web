'use client';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Building2, Link2, Layers, Users2 } from 'lucide-react';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import { LinkedinCompany } from '@/types';

const schema = z.object({
  name: z.string().min(1, 'Informe o nome da empresa'),
  linkedinUrl: z.string().url('URL inválida').optional().or(z.literal('')),
  industry: z.string().optional(),
  size: z.string().optional(),
  notes: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

interface Props {
  initial?: Partial<LinkedinCompany>;
  onSubmit: (data: FormData) => Promise<void>;
  loading?: boolean;
}

export default function CompanyForm({ initial, onSubmit, loading }: Props) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initial?.name ?? '',
      linkedinUrl: initial?.linkedinUrl ?? '',
      industry: initial?.industry ?? '',
      size: initial?.size ?? '',
      notes: initial?.notes ?? '',
    },
  });

  useEffect(() => { if (initial) reset(initial as FormData); }, [initial, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input label="Nome *" placeholder="Nome da empresa" icon={<Building2 size={15} />} error={errors.name?.message} {...register('name')} />
      <Input label="LinkedIn URL" type="url" placeholder="https://linkedin.com/company/..." icon={<Link2 size={15} />} error={errors.linkedinUrl?.message} {...register('linkedinUrl')} />
      <div className="grid grid-cols-2 gap-4">
        <Input label="Setor" placeholder="Ex: Tecnologia" icon={<Layers size={15} />} {...register('industry')} />
        <Input label="Porte" placeholder="Ex: 50-200 funcionários" icon={<Users2 size={15} />} {...register('size')} />
      </div>
      <Textarea label="Notas" placeholder="Observações sobre a empresa..." {...register('notes')} />
      <Button type="submit" loading={loading} className="w-full sm:w-auto self-end">
        {initial?._id ? 'Salvar' : 'Adicionar empresa'}
      </Button>
    </form>
  );
}
