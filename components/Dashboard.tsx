import React, { useState } from 'react';
import { Goal, Batch, CurrencyType } from '../types';
import { TUNISIAN_CURRENCY, formatCurrency } from '../constants';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { CheckCircle, Circle, Trophy, RefreshCcw, LayoutGrid, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  goal: Goal;
  onUpdateBatch: (batchId: string, isCompleted: boolean) => void;
  onBack: () => void;
}

const Dashboard: React.FC<Props> = ({ goal, onUpdateBatch, onBack }) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  
  // Derived Stats
  const totalAmount = goal.config.targetAmount;
  const savedAmount = goal.batches.reduce((acc, b) => b.isCompleted ? acc + b.totalValue : acc, 0);
  const progress = Math.min(100, (savedAmount / totalAmount) * 100);
  const batchesCompleted = goal.batches.filter(b => b.isCompleted).length;
  const totalBatches = goal.batches.length;

  const daysPassed = Math.floor((Date.now() - goal.config.startDate) / (1000 * 60 * 60 * 24));
  const daysLeft = Math.max(0, goal.config.durationDays - daysPassed);

  const handleBatchClick = (batch: Batch) => {
    const newState = !batch.isCompleted;
    if (newState && progress > 95) {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    }
    onUpdateBatch(batch.id, newState);
  };

  const filteredBatches = goal.batches.filter(b => {
    if (filter === 'completed') return b.isCompleted;
    if (filter === 'pending') return !b.isCompleted;
    return true;
  });

  const pieData = [
    { name: 'Saved', value: savedAmount },
    { name: 'Remaining', value: totalAmount - savedAmount }
  ];
  const COLORS = ['#10b981', '#e2e8f0']; // Green, Gray

  return (
    <div className="pb-20">
      {/* Sticky Header Stats */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm shadow-md border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-3">
          {/* Nav Header */}
          <div className="flex items-center gap-3 mb-4">
            <button 
              onClick={onBack} 
              className="p-2 -mr-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowRight size={24} className="transform rotate-0 rtl:rotate-180" />
            </button>
            <h2 className="text-lg font-bold text-gray-800 truncate">{goal.config.name}</h2>
          </div>

          <div className="flex justify-between items-center mb-2">
             <div>
                <span className="text-gray-500 text-sm font-medium">تم توفير</span>
                <div className="text-2xl font-extrabold text-emerald-600 font-mono">
                    {formatCurrency(savedAmount)}
                </div>
             </div>
             <div className="text-left">
                <span className="text-gray-500 text-sm font-medium">الهدف</span>
                <div className="text-xl font-bold text-gray-800 font-mono">
                    {formatCurrency(totalAmount)}
                </div>
             </div>
          </div>
          
          <div className="relative w-full h-4 bg-gray-100 rounded-full overflow-hidden">
             <div 
               className="absolute top-0 right-0 h-full bg-emerald-500 transition-all duration-500 ease-out"
               style={{ width: `${progress}%` }}
             ></div>
          </div>
          <div className="flex justify-between mt-1 text-xs text-gray-400 font-medium">
             <span>{progress.toFixed(1)}% مكتمل</span>
             <span>باقي {daysLeft} يوم</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-6">
        
        {/* Secondary Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
                <div className="h-20 w-full">
                   <ResponsiveContainer width="100%" height="100%">
                     <PieChart>
                       <Pie 
                         data={pieData} 
                         innerRadius={25} 
                         outerRadius={35} 
                         paddingAngle={0} 
                         dataKey="value" 
                         stroke="none"
                        >
                         {pieData.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                         ))}
                       </Pie>
                     </PieChart>
                   </ResponsiveContainer>
                </div>
                <span className="text-xs text-gray-400 mt-1">المحفظة</span>
            </div>
            
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center items-center">
                <LayoutGrid className="text-blue-500 mb-2" size={24} />
                <span className="text-2xl font-bold text-gray-800">{batchesCompleted} <span className="text-sm text-gray-400">/ {totalBatches}</span></span>
                <span className="text-xs text-gray-500">دفعة مكتملة</span>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center items-center">
                 <Trophy className="text-yellow-500 mb-2" size={24} />
                 <span className="text-2xl font-bold text-gray-800">{formatCurrency(totalAmount - savedAmount)}</span>
                 <span className="text-xs text-gray-500">مبلغ متبقي</span>
            </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 no-scrollbar">
          {(['all', 'pending', 'completed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${
                filter === f 
                ? 'bg-gray-800 text-white' 
                : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {f === 'all' && 'الكل'}
              {f === 'pending' && 'غير مكتمل'}
              {f === 'completed' && 'مكتمل'}
            </button>
          ))}
        </div>

        {/* The Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filteredBatches.map((batch) => {
            const currencyInfo = TUNISIAN_CURRENCY.find(c => Math.abs(c.value - batch.denominationValue) < 0.001);
            if (!currencyInfo) return null;

            const isCoin = currencyInfo.type === CurrencyType.Coin;
            const isCompleted = batch.isCompleted;

            return (
              <button
                key={batch.id}
                onClick={() => handleBatchClick(batch)}
                className={`
                   relative group p-4 rounded-2xl border-2 flex flex-col items-center justify-between min-h-[170px] transition-all duration-300
                   ${isCompleted 
                     ? 'bg-emerald-50 border-emerald-500 opacity-90' 
                     : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-lg hover:-translate-y-1'
                   }
                `}
              >
                {/* Check Icon */}
                <div className={`absolute top-3 left-3 z-20 transition-colors ${isCompleted ? 'text-emerald-500' : 'text-gray-200 group-hover:text-blue-200'}`}>
                  {isCompleted ? <CheckCircle size={24} fill="currentColor" className="text-white"/> : <Circle size={24} />}
                </div>

                {/* Currency Visual */}
                <div className="mt-4 flex flex-col items-center w-full">
                    <div className={`
                        flex items-center justify-center font-bold text-center shadow-lg relative transition-transform duration-300 group-hover:scale-105
                        ${isCoin ? 'w-16 h-16 rounded-full' : 'w-24 h-12 rounded-lg'}
                        ${currencyInfo.colorClass}
                        ${isCompleted ? 'grayscale-[0.5] opacity-75' : ''}
                    `}>
                        {/* Detail Ring for Coins */}
                        {isCoin && (
                            <div className="absolute inset-1 rounded-full border border-dashed border-black/10"></div>
                        )}
                        
                        {/* Text Value */}
                        <div className="relative z-10 flex flex-col items-center leading-none">
                             <span className={`${isCoin ? 'text-xl' : 'text-2xl'} drop-shadow-sm`}>
                                {currencyInfo.displayValue}
                             </span>
                             {isCoin && currencyInfo.value < 1 && (
                                 <span className="text-[9px] font-medium opacity-80 mt-0.5">مليم</span>
                             )}
                             {isCoin && currencyInfo.value >= 1 && (
                                 <span className="text-[9px] font-medium opacity-80 mt-0.5">دينار</span>
                             )}
                             {!isCoin && (
                                 <span className="text-[8px] font-medium opacity-80">دينار</span>
                             )}
                        </div>
                    </div>
                    
                    <span className="mt-3 text-gray-400 text-xs font-bold tracking-wide bg-gray-50 px-2 py-1 rounded-md">
                        ×{batch.count}
                    </span>
                </div>

                {/* Total Value */}
                <div className="w-full text-center mt-3 pt-3 border-t border-dashed border-gray-200">
                    <span className={`text-lg font-black font-mono tracking-tight ${isCompleted ? 'text-emerald-700 decoration-emerald-700' : 'text-gray-700'}`}>
                        {formatCurrency(batch.totalValue)}
                    </span>
                </div>
              </button>
            );
          })}
        </div>
        
        {filteredBatches.length === 0 && (
            <div className="text-center py-20 text-gray-400">
                لا توجد دفعات في هذه القائمة
            </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;