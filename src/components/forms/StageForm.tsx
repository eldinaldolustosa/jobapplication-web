'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { APPLICATION_STATUSES } from '@/lib/utils';

const schema = z.object({
  stage: z.string().min(1, 'Selecione a etapa'),
  notes: z.string().optional(),
  date: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

interface Props {
  onSubmit: (data: FormData) => Promise<void>;
  loading?: boolean;
}

export default function StageForm({ onSubmit, loading }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { stage: 'Enviado', date: new Date().toISOString().split('T')[0] },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Select
        label="Etapa *"
        options={APPLICATION_STATUSES.map((s) => ({ value: s, label: s }))}
        error={errors.stage?.message}
        {...register('stage')}
      />
      <Input label="Data" type="date" {...register('date')} />
      <Textarea label="Observações" placeholder="Detalhes sobre esta etapa..." {...register('notes')} />
      <Button type="submit" loading={loading} className="w-full">
        Registrar etapa
      </Button>
    </form>
  );
}
