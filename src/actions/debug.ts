'use server';

import { supabaseAdmin } from '@/lib/supabase';

export async function testConnection() {
    const results = {
        env: {
            url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
            key: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
            // Show partial URL for verification without exposing full secret
            urlPreview: process.env.NEXT_PUBLIC_SUPABASE_URL
                ? `${process.env.NEXT_PUBLIC_SUPABASE_URL.slice(0, 8)}...`
                : 'MISSING',
            keyConfigured: !!process.env.SUPABASE_SERVICE_ROLE_KEY
        },
        connection: {
            success: false,
            message: '',
            details: null as string | null
        },
        tableCheck: {
            success: false,
            rowCount: -1,
            message: ''
        }
    };

    try {
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
            results.connection.message = 'CRÍTICO: Variáveis de ambiente faltando no servidor.';
            return results;
        }

        // Tenta fazer uma query simples para testar a conexão e a tabela
        // Usamos head: true para não baixar dados, só pegar metadados e contagem
        const { count, error } = await supabaseAdmin
            .from('quiz_sessions')
            .select('*', { count: 'exact', head: true });

        if (error) {
            results.connection.success = false;
            results.connection.message = `Falha ao conectar ou consultar: ${error.message}`;
            results.connection.details = JSON.stringify(error, null, 2);

            // Diagnósticos comuns
            if (error.code === '42P01') {
                results.tableCheck.message = 'A tabela "quiz_sessions" NÃO EXISTE no banco de dados conectado.';
            } else if (error.code === '42501') {
                results.tableCheck.message = 'Permissão negada (RLS). Verifique se você está usando a KEY de SERVICE_ROLE, não a anon.';
            } else {
                results.tableCheck.message = `Erro desconhecido: Code ${error.code}`;
            }
        } else {
            results.connection.success = true;
            results.connection.message = 'Conexão Sucesso!';

            results.tableCheck.success = true;
            results.tableCheck.rowCount = count ?? 0;
            results.tableCheck.message = 'Tabela encontrada e acessível.';
        }

    } catch (e: any) {
        results.connection.success = false;
        results.connection.message = 'Erro Inesperado na Action (Exception)';
        results.connection.details = e.message || String(e);
    }

    return results;
}
