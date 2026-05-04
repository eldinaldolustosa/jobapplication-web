'use client';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Building2, Link2, Mail, Briefcase } from 'lucide-react';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import { LinkedinContact } from '@/types';

const schema = z.object({
  name: z.string().min(1, 'Informe o nome'),
  role: z.string().optional(),
  company: z.string().optional(),
  linkedinUrl: z.string().url('URL inválida').optional().or(z.literal('')),
  email: z.string().email('E-mail inválido').optional().or(z.literal('')),
  notes: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

interface Props {
  initial?: Partial<LinkedinContact>;
  onSubmit: (data: FormData) => Promise<void>;
  loading?: boolean;
}

export default function ContactForm({ initial, onSubmit, loading }: Props) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initial?.name ?? '',
      role: initial?.role ?? '',
      company: initial?.company ?? '',
      linkedinUrl: initial?.linkedinUrl ?? '',
      email: initial?.email ?? '',
      notes: initial?.notes ?? '',
    },
  });

  useEffect(() => { if (initial) reset(initial as FormData); }, [initial, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input label="Nome *" placeholder="Nome do contato" icon={<User size={15} />} error={errors.name?.message} {...register('name')} />
      <div className="grid grid-cols-2 gap-4">
        <Input label="Cargo" placeholder="Ex: Recrutador" icon={<Briefcase size={15} />} {...register('role')} />
        <Input label="Empresa" placeholder="Nome da empresa" icon={<Building2 size={15} />} {...register('company')} />
      </div>
      <Input label="LinkedIn URL" type="url" placeholder="https://linkedin.com/in/..." icon={<Link2 size={15} />} error={errors.linkedinUrl?.message} {...register('linkedinUrl')} />
      <Input label="E-mail" type="email" placeholder="contato@exemplo.com" icon={<Mail size={15} />} error={errors.email?.message} {...register('email')} />
      <Textarea label="Notas" placeholder="Observações sobre este contato..." {...register('notes')} />
      <Button type="submit" loading={loading} className="w-full sm:w-auto self-end">
        {initial?._id ? 'Salvar' : 'Adicionar contato'}
      </Button>
    </form>
  );
}
