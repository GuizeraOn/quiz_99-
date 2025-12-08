'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';
import { Users, Target, CheckCircle2, Timer, Smartphone, Monitor, Activity } from 'lucide-react';
import { QUIZ_DATA } from '@/data/quizData';
import { motion } from 'framer-motion';

interface DashboardClientProps {
    data: any[];
}

const COLORS = ['#8b5cf6', '#ec4899', '#3b82f6', '#10b981', '#f59e0b'];

export default function DashboardClient({ data }: DashboardClientProps) {
    // --- CÁLCULO DE KPIS ---
    const totalVisitors = data.length;

    // Leads Iniciados: Quem respondeu pelo menos 1 pergunta (current_step > 0)
    const leadsIniciados = data.filter(s => s.current_step > 0).length;

    // Leads Qualificados: Status 'qualified' ou 'completed' (ou > 50% steps)
    const leadsQualificados = data.filter(s => s.status === 'qualified' || s.status === 'completed').length;

    // Completaram: is_completed ou status 'completed'
    const finalConversion = data.filter(s => s.completed || s.status === 'completed').length;

    // Taxas
    const engagementRate = totalVisitors > 0 ? Math.round((leadsIniciados / totalVisitors) * 100) : 0;
    const conversionRate = leadsIniciados > 0 ? Math.round((finalConversion / leadsIniciados) * 100) : 0;

    // Tempo Médio (apenas de quem completou para não sujar com abandono imediato)
    const completedSessions = data.filter(s => s.time_spent_seconds > 0);
    const avgTimeSeconds = completedSessions.length > 0
        ? Math.round(completedSessions.reduce((acc, curr) => acc + curr.time_spent_seconds, 0) / completedSessions.length)
        : 0;
    const avgTimeDisplay = `${Math.floor(avgTimeSeconds / 60)}m ${avgTimeSeconds % 60}s`;

    // --- FUNIL DE RETENÇÃO ---
    // Agrupar por "Até onde chegou" (max_step_reached)
    // Precisamos saber quantos usuários "sobreviveram" até o passo X
    const maxStepsInQuiz = QUIZ_DATA.length;
    const funnelData = [];

    for (let i = 0; i < maxStepsInQuiz; i++) {
        // Quantos chegaram pelo menos até aqui?
        const survivors = data.filter(s => s.max_step_reached >= i).length;
        // Nome do passo (curto)
        let stepName = `Q${i + 1}`;
        if (QUIZ_DATA[i]?.type === 'info') stepName = `Info ${i + 1}`;
        if (QUIZ_DATA[i]?.type === 'loading') stepName = `Load ${i + 1}`;

        funnelData.push({
            name: stepName,
            users: survivors,
            percentage: totalVisitors > 0 ? Math.round((survivors / totalVisitors) * 100) : 0
        });
    }

    // --- GRÁFICO DE DISPOSITIVOS ---
    const mobileCount = data.filter(s => s.device_type === 'mobile').length;
    const desktopCount = data.filter(s => s.device_type === 'desktop').length;
    const deviceData = [
        { name: 'Mobile', value: mobileCount },
        { name: 'Desktop', value: desktopCount },
    ];

    // --- TOP DORES (HEATMAP) ---
    // Vamos pegar respostas das perguntas chaves (type: single-select / questions)
    // Agregar todas as respostas
    const answerHeatmap: Record<string, number> = {};

    data.forEach(session => {
        if (!session.answers) return;
        Object.values(session.answers).forEach((val: any) => {
            if (typeof val === 'string') {
                answerHeatmap[val] = (answerHeatmap[val] || 0) + 1;
            }
        });
    });

    // Transformar em array e ordenar (Top 5)
    const topAnswers = Object.entries(answerHeatmap)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([key, count]) => {
            // Tentar humanizar label procurando no QUIZ_DATA
            // Isso é ineficiente O(N^3) mas ok para dashboard pequeno
            let label = key;
            for (const step of QUIZ_DATA) {
                if (step.type === 'question' && step.options) {
                    const opt = step.options.find(o => o.value === key);
                    if (opt) {
                        // Limpa HTML do label
                        label = opt.label.replace(/<[^>]*>?/gm, '');
                        break;
                    }
                }
            }
            return {
                label: label.length > 40 ? label.substring(0, 40) + '...' : label,
                count
            };
        });

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10 font-sans">
            <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-6 gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                        Painel de Controle
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">Análise de Performance do Quiz em Tempo Real</p>
                </div>
                <div className="flex items-center gap-2 bg-slate-900 px-4 py-2 rounded-lg border border-slate-800">
                    <Activity size={16} className="text-emerald-400 animate-pulse" />
                    <span className="text-xs font-mono text-emerald-400">STATUS: ONLINE</span>
                </div>
            </header>

            {/* SECTION A: KPI CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
                <KPICard title="Visitantes Totais" value={totalVisitors} icon={Users} color="text-blue-400" />
                <KPICard title="Leads Iniciados" value={leadsIniciados} icon={Activity} color="text-purple-400" />
                <KPICard title="Taxa de Engajamento" value={`${engagementRate}%`} icon={Target} color="text-amber-400" />
                <KPICard title="Leads Qualificados" value={leadsQualificados} icon={CheckCircle2} color="text-emerald-400" />
                <KPICard title="Conversão Final" value={finalConversion} icon={Timer} color="text-rose-400" />
            </div>

            {/* SECTION B: CHARTS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Funil de Retenção */}
                <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                    <h3 className="text-xl font-semibold mb-6 text-slate-200">Funil de Retenção por Etapa</h3>
                    <div style={{ width: '100%', height: 350, minHeight: 350 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={funnelData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                                <YAxis stroke="#64748b" fontSize={12} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc' }}
                                    cursor={{ fill: '#1e293b', opacity: 0.5 }}
                                />
                                <Bar dataKey="percentage" name="% Retenção" radius={[4, 4, 0, 0]}>
                                    {funnelData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={`hsl(${210 + (index * 5)}, 70%, 50%)`} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Métricas Secundárias */}
                <div className="flex flex-col gap-8">

                    {/* Dispositivos (Pie) */}
                    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 flex-1">
                        <h3 className="text-xl font-semibold mb-6 text-slate-200 flex items-center gap-2">
                            <Smartphone size={20} className="text-slate-400" />
                            Dispositivos
                        </h3>
                        <div style={{ width: '100%', height: 200, minHeight: 200, position: 'relative' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={deviceData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {deviceData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px' }} />
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                            {/* Center Text */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-8">
                                <span className="text-2xl font-bold text-slate-500">{Math.round((mobileCount / totalVisitors) * 100)}%</span>
                            </div>
                        </div>
                    </div>

                    {/* Tempo Médio */}
                    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Tempo Médio</h3>
                        <div className="flex items-end gap-3">
                            <span className="text-4xl font-bold text-white">{avgTimeDisplay}</span>
                            <span className="text-sm text-emerald-400 mb-1">+ Tempo de Qualidade</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* SECTION C: TOP DORES (HEATMAP) */}
            <div className="mt-8 bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-xl font-semibold mb-6 text-slate-200">🔥 Top Dores & Respostas (Market Intelligence)</h3>
                <div className="space-y-4">
                    {topAnswers.map((item, idx) => (
                        <div key={idx} className="relative">
                            <div className="flex justify-between items-center mb-1 text-sm z-10 relative">
                                <span className="font-medium text-slate-300">"{item.label}"</span>
                                <span className="font-bold text-white">{item.count} votos</span>
                            </div>
                            <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(item.count / totalVisitors) * 100}%` }}
                                    className="h-full bg-gradient-to-r from-rose-500 to-orange-500 rounded-full"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}

// Componente simples de Card
function KPICard({ title, value, icon: Icon, color }: any) {
    return (
        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-xl backdrop-blur-sm">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">{title}</p>
                    <h4 className="text-3xl font-bold text-slate-100">{value}</h4>
                </div>
                <div className={`p-2 rounded-lg bg-slate-950 ${color}`}>
                    <Icon size={20} />
                </div>
            </div>
        </div>
    );
}
