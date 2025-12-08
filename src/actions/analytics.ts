'use server';

import { supabaseAdmin } from '@/lib/supabase';
import { headers } from 'next/headers';

/**
 * Inicia uma nova sessão de rastreamento.
 * Captura automaticamente o User Agent e País via headers.
 */
export async function startSession(totalSteps: number) {
    try {
        const headersList = await headers();
        const userAgent = headersList.get('user-agent') || 'unknown';
        const country = headersList.get('x-vercel-ip-country') || 'unknown';

        const isMobile = /mobile/i.test(userAgent);
        const deviceType = isMobile ? 'mobile' : 'desktop';

        const { data, error } = await supabaseAdmin
            .from('quiz_sessions')
            .insert({
                total_steps: totalSteps,
                device_type: deviceType,
                country: country,
                status: 'started',
                current_step: 0,
                max_step_reached: 0,
                completed: false
            })
            .select('id')
            .single();

        if (error) {
            // Silencioso para não crashar o frontend se o Supabase falhar
            console.error('Analytics Error (startSession):', error.message);
            return null;
        }

        return data.id;
    } catch (error) {
        console.error('Analytics Exception:', error);
        return null;
    }
}

/**
 * Atualiza o progresso do usuário.
 * Armazena a resposta em JSONB e recalcula o status do Lead.
 */
export async function trackProgress(sessionId: string, stepIndex: number, answer: any, questionId: string) {
    if (!sessionId) return;

    try {
        // Recupera sessão atual para merge de respostas
        const { data: session } = await supabaseAdmin
            .from('quiz_sessions')
            .select('max_step_reached, answers, total_steps')
            .eq('id', sessionId)
            .single();

        if (!session) return;

        const newMaxStep = Math.max(session.max_step_reached, stepIndex);

        // Lógica de Qualificação (> 50% do quiz)
        let status = 'started';
        if ((stepIndex / session.total_steps) > 0.5) status = 'qualified';

        // Merge Answers
        // answer can be string or object, we force string for simplicity mostly
        const updatedAnswers = {
            ...session.answers,
            [questionId]: answer
        };

        await supabaseAdmin
            .from('quiz_sessions')
            .update({
                current_step: stepIndex,
                max_step_reached: newMaxStep,
                answers: updatedAnswers,
                status: status, // Update status based on qualification logic
                updated_at: new Date().toISOString()
            })
            .eq('id', sessionId);

    } catch (error) {
        console.error('Analytics Error (trackProgress):', error);
    }
}

/**
 * Marca a sessão como completa e salva o tempo total.
 */
export async function completeSession(sessionId: string, totalTimeSeconds: number) {
    if (!sessionId) return;

    try {
        await supabaseAdmin
            .from('quiz_sessions')
            .update({
                completed: true,
                status: 'completed',
                time_spent_seconds: totalTimeSeconds,
                updated_at: new Date().toISOString()
            })
            .eq('id', sessionId);
    } catch (error) {
        console.error('Analytics Error (completeSession):', error);
    }
}

/**
 * Registra o clique no botão de checkout.
 * Define status como 'checkout'.
 */
export async function trackCheckout(sessionId: string) {
    if (!sessionId) return;

    try {
        // Atualiza status para 'checkout' (Conversão Final)
        await supabaseAdmin
            .from('quiz_sessions')
            .update({
                status: 'checkout',
                updated_at: new Date().toISOString()
            })
            .eq('id', sessionId);
    } catch (error) {
        console.error('Analytics Error (trackCheckout):', error);
    }
}

/**
 * Busca dados para o Dashboard (Server-side fetch)
 */
export async function getAnalyticsMetrics(days: number = 30) {
    try {
        let query = supabaseAdmin
            .from('quiz_sessions')
            .select('*')
            .order('created_at', { ascending: false });

        if (days > 0) {
            const date = new Date();
            date.setDate(date.getDate() - days);
            query = query.gte('created_at', date.toISOString());
        }

        // Aumentando limite para permitir análises mais robustas
        const { data, error } = await query.limit(5000);

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Analytics Error (getAnalyticsMetrics):', error);
        return [];
    }
}
