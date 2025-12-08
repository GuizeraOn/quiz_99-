-- SCRIPT DE CORREÇÃO TOTAL DO SCHEMA (CORRIGIDO)
-- Copie e cole TUDO isso no SQL Editor do Supabase E clique em Run.

-- 1. Forçar a atualização do cache de schema recarregando a configuração
NOTIFY pgrst, 'reload config';

-- 2. Garantir que a tabela existe e criar colunas uma a uma para não dar erro
CREATE TABLE IF NOT EXISTS public.quiz_sessions (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Adicionando colunas de forma segura (Idempotente)
DO $$
BEGIN
    BEGIN
        ALTER TABLE public.quiz_sessions ADD COLUMN total_steps int;
    EXCEPTION
        WHEN duplicate_column THEN NULL;
    END;

    BEGIN
        ALTER TABLE public.quiz_sessions ADD COLUMN current_step int default 0;
    EXCEPTION
        WHEN duplicate_column THEN NULL;
    END;

    BEGIN
        ALTER TABLE public.quiz_sessions ADD COLUMN max_step_reached int default 0;
    EXCEPTION
        WHEN duplicate_column THEN NULL;
    END;

    BEGIN
        ALTER TABLE public.quiz_sessions ADD COLUMN device_type text;
    EXCEPTION
        WHEN duplicate_column THEN NULL;
    END;

    BEGIN
        ALTER TABLE public.quiz_sessions ADD COLUMN country text;
    EXCEPTION
        WHEN duplicate_column THEN NULL;
    END;

    BEGIN
        ALTER TABLE public.quiz_sessions ADD COLUMN completed boolean default false;
    EXCEPTION
        WHEN duplicate_column THEN NULL;
    END;

    BEGIN
        ALTER TABLE public.quiz_sessions ADD COLUMN time_spent_seconds int default 0;
    EXCEPTION
        WHEN duplicate_column THEN NULL;
    END;

    BEGIN
        ALTER TABLE public.quiz_sessions ADD COLUMN answers jsonb default '{}'::jsonb;
    EXCEPTION
        WHEN duplicate_column THEN NULL;
    END;

    BEGIN
        ALTER TABLE public.quiz_sessions ADD COLUMN status text default 'visitor';
    EXCEPTION
        WHEN duplicate_column THEN NULL;
    END;
    
    BEGIN
        ALTER TABLE public.quiz_sessions ADD COLUMN updated_at timestamp with time zone default timezone('utc'::text, now());
    EXCEPTION
        WHEN duplicate_column THEN NULL;
    END;
END $$;

-- 3. Recriar/Garantir Índices
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_created_at ON public.quiz_sessions(created_at);
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_status ON public.quiz_sessions(status);

-- 4. Permissões (RLS) - Isso é crucial para o erro não voltar
ALTER TABLE public.quiz_sessions ENABLE ROW LEVEL SECURITY;

-- Remove policies antigas para evitar conflitos
DROP POLICY IF EXISTS "Allow anonymous inserts" ON public.quiz_sessions;
DROP POLICY IF EXISTS "Allow service role updates" ON public.quiz_sessions;
DROP POLICY IF EXISTS "Allow service role selects" ON public.quiz_sessions;
DROP POLICY IF EXISTS "Service Role Full Access" ON public.quiz_sessions;

-- Cria policies corretas
CREATE POLICY "Allow anonymous inserts" ON public.quiz_sessions FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Service Role Full Access" ON public.quiz_sessions FOR ALL TO service_role USING (true) WITH CHECK (true);

-- 5. Comentário final (Corrigido para texto estático)
COMMENT ON TABLE public.quiz_sessions IS 'Schema reparado';
