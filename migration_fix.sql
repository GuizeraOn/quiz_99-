-- Este script corrige a tabela quiz_sessions no banco de produção (Supabase)
-- Copie e cole este conteúdo NO SQL EDITOR do seu painel Supabase

-- 1. Adicionar colunas faltantes que causaram o erro
ALTER TABLE public.quiz_sessions 
ADD COLUMN IF NOT EXISTS completed boolean default false;

ALTER TABLE public.quiz_sessions 
ADD COLUMN IF NOT EXISTS time_spent_seconds int default 0;

ALTER TABLE public.quiz_sessions 
ADD COLUMN IF NOT EXISTS status text default 'visitor';

-- 2. Garantir que as outras colunas essenciais existam
ALTER TABLE public.quiz_sessions 
ADD COLUMN IF NOT EXISTS current_step int default 0;

ALTER TABLE public.quiz_sessions 
ADD COLUMN IF NOT EXISTS max_step_reached int default 0;

ALTER TABLE public.quiz_sessions 
ADD COLUMN IF NOT EXISTS answers jsonb default '{}'::jsonb;

ALTER TABLE public.quiz_sessions 
ADD COLUMN IF NOT EXISTS device_type text;

ALTER TABLE public.quiz_sessions 
ADD COLUMN IF NOT EXISTS country text;

-- 3. Atualizar cache do schema (o Supabase faz isso automaticamente ao rodar DDL, mas é bom saber)
COMMENT ON TABLE public.quiz_sessions IS 'Tabela de sessões do quiz (Updated Schema)';

-- 4. Verificar Policies (Permissões) para garantir que o Analytics funcione
-- Remover policies antigas para recriar corretamente (segurança)
DROP POLICY IF EXISTS "Allow anonymous inserts" ON public.quiz_sessions;
DROP POLICY IF EXISTS "Allow service role updates" ON public.quiz_sessions;
DROP POLICY IF EXISTS "Allow service role selects" ON public.quiz_sessions;

-- Recriar Policies
CREATE POLICY "Allow anonymous inserts" ON public.quiz_sessions FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow service role updates" ON public.quiz_sessions FOR UPDATE TO service_role USING (true);
CREATE POLICY "Allow service role selects" ON public.quiz_sessions FOR SELECT TO service_role USING (true);

-- Habilitar RLS sem o qual as policies não funcionam
ALTER TABLE public.quiz_sessions ENABLE ROW LEVEL SECURITY;
