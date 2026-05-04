'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Briefcase } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

const schema = z.object({
  name: z.string().min(2, 'Nome deve ter ao menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha deve ter ao menos 6 caracteres'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
});
type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const router = useRouter();
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    setError('');
    try {
      await registerUser(data.name, data.email, data.password);
      router.push('/dashboard');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '';
      setError(msg || 'Não foi possível criar a conta. Tente novamente.');
    }
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
      {/* Left panel */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-gradient-to-b from-indigo-600 to-indigo-700 text-white"
      >
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-white/20 flex items-center justify-center">
            <Briefcase size={18} className="text-white" />
          </div>
          <span className="text-xl font-bold">JobTracker</span>
        </div>

        <div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold leading-tight mb-4"
          >
            Comece sua jornada hoje
          </motion.h2>
          <p className="text-indigo-200 text-lg">
            Crie sua conta gratuita e organize todas as suas candidaturas em um só lugar.
          </p>

          <ul className="mt-8 flex flex-col gap-3">
            {[
              'Cadastre e acompanhe candidaturas ilimitadas',
              'Registre cada etapa do processo seletivo',
              'Mapeie empresas e recrutadores no LinkedIn',
              'Interface intuitiva e responsiva',
            ].map((item) => (
              <li key={item} className="flex items-center gap-2 text-indigo-100 text-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-300 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-indigo-300 text-sm">© 2025 JobTracker. Todos os direitos reservados.</p>
      </motion.div>

      {/* Right panel */}
      <div className="flex flex-1 items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="h-8 w-8 rounded-xl bg-indigo-600 flex items-center justify-center">
              <Briefcase size={15} className="text-white" />
            </div>
            <span className="font-bold text-neutral-900 dark:text-neutral-100">JobTracker</span>
          </div>

          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-1">
            Criar conta
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 mb-8">
            Preencha os dados para começar gratuitamente
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Input
              label="Nome completo"
              type="text"
              placeholder="Seu nome"
              icon={<User size={16} />}
              error={errors.name?.message}
              {...register('name')}
            />
            <Input
              label="E-mail"
              type="email"
              placeholder="voce@exemplo.com"
              icon={<Mail size={16} />}
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              label="Senha"
              type="password"
              placeholder="Mínimo 6 caracteres"
              icon={<Lock size={16} />}
              error={errors.password?.message}
              {...register('password')}
            />
            <Input
              label="Confirmar senha"
              type="password"
              placeholder="Repita a senha"
              icon={<Lock size={16} />}
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-xl"
              >
                {error}
              </motion.p>
            )}

            <Button type="submit" size="lg" loading={isSubmitting} className="mt-1 w-full">
              Criar conta
            </Button>
          </form>

          <p className="text-center text-sm text-neutral-500 dark:text-neutral-400 mt-6">
            Já tem uma conta?{' '}
            <Link href="/login" className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
              Entrar
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
