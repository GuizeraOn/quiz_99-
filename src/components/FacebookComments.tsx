import React from 'react';
import commentsData from '@/data/comentarios.json';
import { ThumbsUp } from 'lucide-react';

export default function FacebookComments() {
    return (
        <div className="w-full bg-white font-sans max-w-2xl mx-auto mt-4 px-2">
            {/* Header */}
            <div className="flex justify-between items-center mb-4 border-b pb-2">
                <h3 className="text-[#65676b] font-bold text-base hover:underline cursor-pointer">
                    6.136 comentarios
                </h3>
                <div className="flex items-center gap-1 text-[#65676b] text-sm font-semibold cursor-pointer">
                    <span>Más relevantes</span>
                    <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                </div>
            </div>

            {/* Fake Input */}
            <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0 overflow-hidden">
                    <img
                        src="https://i.pravatar.cc/150?u=guest"
                        alt="User"
                        className="w-full h-full object-cover opacity-80"
                    />
                </div>
                <div className="flex-1 bg-[#f0f2f5] rounded-full h-10 px-4 flex items-center text-[#65676b] text-[15px] cursor-text">
                    Escribe un comentario...
                </div>
            </div>

            {/* Comments List */}
            <div className="space-y-4">
                {commentsData.map((comment) => (
                    <div key={comment.id} className="flex gap-2">
                        {/* Avatar */}
                        <div className="shrink-0 cursor-pointer">
                            <img
                                src={comment.avatarUrl}
                                alt={comment.name}
                                className="w-10 h-10 rounded-full object-cover border border-gray-100"
                            />
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                            {/* Bubble */}
                            <div className="bg-[#f0f2f5] rounded-2xl px-3 py-2 inline-block">
                                <div className="font-semibold text-[13px] text-[#050505] leading-snug cursor-pointer hover:underline">
                                    {comment.name}
                                </div>
                                <div className="text-[15px] text-[#050505] leading-snug mt-0.5">
                                    {comment.text}
                                </div>
                            </div>

                            {/* Meta Actions */}
                            <div className="flex items-center gap-4 ml-3 mt-1 text-[12px] font-bold text-[#65676b]">
                                <span className="cursor-pointer hover:underline">Me gusta</span>
                                <span className="cursor-pointer hover:underline">Responder</span>
                                <span className="font-normal text-gray-500 hover:underline cursor-pointer">{comment.timeAgo}</span>
                            </div>

                            {/* Likes Indicator (Fake) */}
                            {comment.likesCount > 0 && (
                                <div className="flex items-center gap-1 ml-auto -mt-6 mr-2 bg-white rounded-full px-1 shadow-sm border border-white float-right relative top-4">
                                    <div className="bg-[#1877f2] rounded-full p-[2px]">
                                        <ThumbsUp size={8} className="text-white fill-current" />
                                    </div>
                                    <span className="text-[11px] text-[#65676b]">{comment.likesCount}</span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 text-center">
                <button className="text-[#65676b] font-semibold text-sm hover:underline">
                    Ver más comentarios
                </button>
            </div>
        </div>
    );
}
