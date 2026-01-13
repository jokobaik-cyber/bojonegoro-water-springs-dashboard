import React, { useState } from 'react';
import { Send, User, MessageSquareHeart } from 'lucide-react';
import { Comment } from '../types';

interface CommentSectionProps {
  comments: Comment[];
  onAddComment: (text: string) => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({ comments, onAddComment }) => {
  const [newComment, setNewComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    onAddComment(newComment);
    setNewComment('');
  };

  return (
    <div className="mt-12 pt-12 border-t border-slate-100 dark:border-slate-800">
      <div className="flex items-center justify-between mb-10">
        <h4 className="text-2xl font-black text-slate-800 dark:text-white tracking-tighter flex items-center gap-3">
          <MessageSquareHeart size={28} className="text-blue-500 dark:text-blue-400" /> 
          Diskusi Komunitas <span className="text-slate-300 dark:text-slate-700 font-normal ml-2">({comments.length})</span>
        </h4>
      </div>

      <form onSubmit={handleSubmit} className="mb-12">
        <div className="group bg-white dark:bg-slate-800 p-2 rounded-[2rem] shadow-sm border border-slate-200 dark:border-slate-700 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-50 dark:focus-within:ring-blue-900/20 transition-all duration-300">
          <div className="flex gap-4 px-4 py-2">
            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex-shrink-0 items-center justify-center hidden sm:flex">
              <User size={18} className="text-slate-400 dark:text-slate-500" />
            </div>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Berikan kabar terbaru atau bagikan keindahan sumber ini..."
              className="flex-1 px-0 py-3 bg-transparent border-none outline-none text-sm font-medium text-slate-600 dark:text-slate-300 resize-none placeholder:text-slate-400 dark:placeholder:text-slate-600"
              rows={2}
            />
          </div>
          <div className="flex items-center justify-end px-2 pb-2">
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="px-8 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-lg shadow-blue-200 dark:shadow-none flex items-center gap-2"
            >
              Kirim Pesan <Send size={14} />
            </button>
          </div>
        </div>
      </form>

      <div className="grid gap-6">
        {comments.length === 0 ? (
          <div className="text-center py-16 bg-slate-50/50 dark:bg-slate-900/50 rounded-[3rem] border border-dashed border-slate-200 dark:border-slate-800">
            <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-slate-100 dark:border-slate-700">
              <MessageSquareHeart size={32} className="text-slate-200 dark:text-slate-700" />
            </div>
            <p className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Belum ada diskusi terbuka</p>
            <p className="text-xs text-slate-400 dark:text-slate-600 mt-2">Suara Anda penting untuk kelestarian air.</p>
          </div>
        ) : (
          comments.slice().reverse().map((comment) => (
            <div key={comment.id} className="group flex gap-5 animate-fade-in">
              <div className="flex-shrink-0 w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-blue-500 dark:text-blue-400 shadow-sm border border-slate-100 dark:border-slate-700 group-hover:scale-110 group-hover:bg-blue-500 group-hover:text-white transition-all duration-500">
                <User size={22} />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <h5 className="text-sm font-black text-slate-800 dark:text-slate-100">{comment.user}</h5>
                  <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{comment.createdAt}</span>
                </div>
                <div className="p-6 bg-white dark:bg-slate-800 rounded-[2rem] rounded-tl-none border border-slate-100 dark:border-slate-700 group-hover:shadow-xl group-hover:shadow-slate-200/50 transition-all duration-500">
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed">{comment.text}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;