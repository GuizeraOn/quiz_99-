'use client';

import { useState, useEffect } from 'react';
import { testConnection } from '@/actions/debug';

export default function DebugPage() {
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const runTest = async () => {
        setLoading(true);
        try {
            const data = await testConnection();
            setResult(data);
        } catch (error) {
            console.error(error);
            setResult({ error: 'Falha ao chamar a server action.' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        runTest();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-green-400 p-8 font-mono flex items-center justify-center">
                <div className="text-xl animate-pulse">Running Diagnostics...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-green-400 p-8 font-mono overflow-auto">
            <div className="max-w-3xl mx-auto space-y-6">
                <header className="border-b border-green-800 pb-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold">System Diagnostics :: Supabase</h1>
                    <button
                        onClick={runTest}
                        className="px-4 py-2 bg-green-900 hover:bg-green-800 text-white text-sm rounded transition-colors"
                    >
                        Rerun Test
                    </button>
                </header>

                {/* Environment Variables Section */}
                <section className="bg-neutral-900 p-4 rounded border border-green-900">
                    <h2 className="text-lg font-bold mb-4 text-white">1. Variáveis de Ambiente (Server-Side)</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <StatusItem
                            label="NEXT_PUBLIC_SUPABASE_URL"
                            status={result?.env?.url}
                            info={result?.env?.urlPreview}
                        />
                        <StatusItem
                            label="SUPABASE_SERVICE_ROLE_KEY"
                            status={result?.env?.key}
                            info={result?.env?.area ? 'Present' : (result?.env?.keyConfigured ? 'Configured (Hidden)' : 'MISSING')}
                        />
                    </div>
                </section>

                {/* Connection Section */}
                <section className="bg-neutral-900 p-4 rounded border border-green-900">
                    <h2 className="text-lg font-bold mb-4 text-white">2. Conexão com Banco de Dados</h2>

                    <div className={`p-4 rounded mb-4 ${result?.connection?.success ? 'bg-green-900/30 border border-green-500' : 'bg-red-900/30 border border-red-500'}`}>
                        <div className="font-bold text-lg mb-2">
                            {result?.connection?.success ? 'CONEXÃO BEM SUCEDIDA' : 'FALHA DE CONEXÃO'}
                        </div>
                        <p>{result?.connection?.message}</p>
                        {result?.connection?.details && (
                            <pre className="mt-2 p-2 bg-black text-xs overflow-auto max-h-40 rounded border border-red-800 text-red-300">
                                {result.connection.details}
                            </pre>
                        )}
                    </div>
                </section>

                {/* Table Check Section */}
                <section className="bg-neutral-900 p-4 rounded border border-green-900">
                    <h2 className="text-lg font-bold mb-4 text-white">3. Verificação da Tabela (quiz_sessions)</h2>

                    <div className="grid grid-cols-1 gap-2">
                        <div className="flex justify-between items-center bg-black p-3 rounded border border-green-900/50">
                            <span>Status da Tabela:</span>
                            <span className={result?.tableCheck?.success ? 'text-green-400 font-bold' : 'text-red-500 font-bold'}>
                                {result?.tableCheck?.success ? 'OK' : 'ERRO'}
                            </span>
                        </div>

                        {result?.tableCheck?.success ? (
                            <div className="flex justify-between items-center bg-black p-3 rounded border border-green-900/50">
                                <span>Total de Sessões Registradas:</span>
                                <span className="text-white font-bold text-xl">{result?.tableCheck?.rowCount}</span>
                            </div>
                        ) : (
                            <div className="p-3 bg-red-900/20 text-red-400 border border-red-900 rounded">
                                {result?.tableCheck?.message}
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}

function StatusItem({ label, status, info }: { label: string, status: boolean, info: string }) {
    return (
        <div className="flex flex-col bg-black p-3 rounded border border-green-900/50">
            <span className="text-xs text-green-600 mb-1">{label}</span>
            <div className="flex items-center justify-between">
                <span className="font-mono text-sm text-gray-300 truncate max-w-[150px]" title={info}>{info}</span>
                <span className={`text-xs font-bold px-2 py-1 rounded ${status ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                    {status ? 'OK' : 'MISSING'}
                </span>
            </div>
        </div>
    );
}
