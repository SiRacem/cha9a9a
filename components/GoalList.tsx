import React, { useState } from 'react';
import { Goal } from '../types';
import { formatCurrency } from '../constants';
import { Plus, Trash2, ChevronRight, Trophy } from 'lucide-react';

interface Props {
  goals: Goal[];
  onSelect: (id: string) => void;
  onCreateNew: () => void;
  onDelete: (id: string) => void;
}

const GoalList: React.FC<Props> = ({ goals, onSelect, onCreateNew, onDelete }) => {
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  return (
    <div className="max-w-2xl mx-auto p-4 pb-20">
      <div className="flex justify-between items-center mb-8 pt-4">
        <h1 className="text-3xl font-extrabold text-gray-800">أهدافي</h1>
        <button 
          onClick={onCreateNew}
          className="bg-red-600 text-white p-2 rounded-full shadow-lg hover:bg-red-700 transition-transform active:scale-95"
        >
          <Plus size={28} />
        </button>
      </div>

      <div className="grid gap-4">
        {goals.map((goal) => {
          const saved = goal.batches.reduce((acc, b) => b.isCompleted ? acc + b.totalValue : acc, 0);
          const total = goal.config.targetAmount;
          const progress = Math.min(100, (saved / total) * 100);
          
          if (deleteConfirmId === goal.id) {
            return (
              <div key={goal.id} className="bg-red-50 border-2 border-red-100 rounded-2xl p-6 flex flex-col items-center justify-center animate-fade-in-up">
                <p className="text-red-800 font-bold mb-4 text-center">هل تريد حقاً حذف هذا الهدف؟</p>
                <div className="flex gap-3 w-full">
                  <button 
                    onClick={() => setDeleteConfirmId(null)}
                    className="flex-1 py-2 bg-white text-gray-600 rounded-lg font-bold border"
                  >
                    إلغاء
                  </button>
                  <button 
                    onClick={() => onDelete(goal.id)}
                    className="flex-1 py-2 bg-red-600 text-white rounded-lg font-bold"
                  >
                    حذف
                  </button>
                </div>
              </div>
            );
          }

          return (
            <div 
              key={goal.id} 
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all relative overflow-hidden group cursor-pointer"
              onClick={() => onSelect(goal.id)}
            >
               {/* Progress Background */}
               <div 
                 className="absolute bottom-0 right-0 h-1 bg-emerald-500 transition-all duration-1000" 
                 style={{ width: `${progress}%` }}
               />

               <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
                        <Trophy size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">{goal.config.name}</h2>
                        <span className="text-sm text-gray-400 font-mono">{formatCurrency(total)}</span>
                    </div>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(goal.id); }}
                    className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
               </div>

               <div className="flex justify-between items-end">
                   <div>
                       <span className="text-sm text-gray-500 block mb-1">تم توفير</span>
                       <span className="text-2xl font-bold text-emerald-600 font-mono">{formatCurrency(saved)}</span>
                   </div>
                   <div className="text-emerald-500 font-bold text-lg flex items-center gap-1">
                       {progress.toFixed(0)}%
                       <ChevronRight size={20} className="text-gray-300 transform rotate-180" />
                   </div>
               </div>
            </div>
          );
        })}

        {goals.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
            <p className="text-gray-400 mb-4">ليس لديك أهداف بعد</p>
            <button onClick={onCreateNew} className="text-red-600 font-bold hover:underline">أضف هدفاً جديداً</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoalList;