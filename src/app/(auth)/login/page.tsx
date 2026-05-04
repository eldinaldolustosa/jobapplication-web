'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, Briefcase } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

const schema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(1, 'Informe a senha'),
});
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const { login } = useAuth();
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
      await login(data.email, data.password);
      router.push('/dashboard');
    } catch {
      setError('E-mail ou senha incorretos. Verifique e tente novamente.');
    }
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
      {/* Left panel */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-indigo-600 text-white"
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
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-4xl font-bold leading-tight mb-4"
          >
            Gerencie suas candidaturas com clareza
          </motion.h2>
          <p className="text-indigo-200 text-lg">
            Acompanhe cada etapa da sua jornada profissional em um só lugar.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-4">
            {[
              { label: 'Candidaturas', value: 'Organize' },
              { label: 'Etapas', value: 'Acompanhe' },
              { label: 'Empresas', value: 'Conecte' },
              { label: 'Contatos', value: 'Gerencie' },
            ].map((item) => (
              <div key={item.label} className="bg-white/10 rounded-xl p-4">
                <p className="text-2xl font-bold">{item.value}</p>
                <p className="text-indigo-200 text-sm">{item.label}</p>
              </div>
            ))}
          </div>
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
            Bem-vindo de volta
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 mb-8">
            Entre com sua conta para continuar
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
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
              placeholder="••••••••"
              icon={<Lock size={16} />}
              error={errors.password?.message}
              {...register('password')}
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
              Entrar
            </Button>
          </form>

          <p className="text-center text-sm text-neutral-500 dark:text-neutral-400 mt-6">
            Ainda não tem conta?{' '}
            <Link
              href="/register"
              className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
            >
              Criar conta
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
