import React, { useState } from 'react';
import { TUNISIAN_CURRENCY } from '../constants';
import { generateBatches } from '../utils/generator';
import { Goal, Batch } from '../types';
import { Coins, Calendar, Target, Type } from 'lucide-react';

interface Props {
  onCreate: (goal: Goal) => void;
  onCancel?: () => void;
  hasExistingGoals?: boolean;
}

const WelcomeScreen: React.FC<Props> = ({ onCreate, onCancel, hasExistingGoals }) => {
  const [name, setName] = useState('');
  const [target, setTarget] = useState<number | ''>(1000);
  const [duration, setDuration] = useState<number | ''>(365);
  const [selectedIds, setSelectedIds] = useState<string[]>(['500m', '1dt', '2dt', '5dt', '10dt']);
  const [error, setError] = useState<string>('');

  const toggleCurrency = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const handleCreate = () => {
    if (!name.trim()) {
      setError('الرجاء إدخال اسم للهدف');
      return;
    }
    if (!target || target < 10) {
      setError('الرجاء إدخال مبلغ هدف صحيح (أكثر من 10 د.ت)');
      return;
    }
    if (!duration || duration < 1) {
      setError('الرجاء إدخال مدة زمنية صحيحة');
      return;
    }
    if (selectedIds.length === 0) {
      setError('الرجاء اختيار نوع واحد من العملات على الأقل');
      return;
    }

    const selectedValues = TUNISIAN_CURRENCY
      .filter(c => selectedIds.includes(c.id))
      .map(c => c.value);

    // Generate Logic
    const batches: Batch[] = generateBatches(Number(target), selectedValues);

    const newGoal: Goal = {
      id: crypto.randomUUID(),
      config: {
        name: name,
        targetAmount: Number(target),
        durationDays: Number(duration),
        startDate: Date.now(),
        selectedDenominations: selectedValues
      },
      batches: batches
    };

    onCreate(newGoal);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 pb-20">
      <div className="text-center mb-8 animate-fade-in-down">
        <div className="inline-flex items-center justify-center p-4 bg-red-100 rounded-full mb-4 shadow-inner">
           <Coins size={48} className="text-red-600" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-800 mb-2">هدف جديد</h1>
        <p className="text-gray-500">حدد هدفك المالي وابدأ التحدي</p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        {/* Name Input */}
        <div className="mb-6">
          <label className="block text-gray-700 font-bold mb-2 flex items-center gap-2">
            <Type size={20} className="text-blue-600"/>
             اسم الهدف
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full text-xl p-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:bg-white focus:border-red-500 focus:ring-0 transition-colors text-left font-sans text-gray-900 placeholder-gray-400"
            placeholder="مثال: شراء سيارة، عطلة الصيف..."
          />
        </div>

        {/* Target Input */}
        <div className="mb-6">
          <label className="block text-gray-700 font-bold mb-2 flex items-center gap-2">
            <Target size={20} className="text-blue-600"/>
             المبلغ الهدف (د.ت)
          </label>
          <input
            type="number"
            value={target}
            onChange={(e) => setTarget(Number(e.target.value))}
            className="w-full text-xl p-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:bg-white focus:border-red-500 focus:ring-0 transition-colors text-left font-mono text-gray-900 placeholder-gray-400"
            placeholder="مثال: 1000"
          />
        </div>

        {/* Duration Input */}
        <div className="mb-8">
          <label className="block text-gray-700 font-bold mb-2 flex items-center gap-2">
             <Calendar size={20} className="text-blue-600"/>
             المدة (بالأيام)
          </label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full text-xl p-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:bg-white focus:border-red-500 focus:ring-0 transition-colors text-left font-mono text-gray-900 placeholder-gray-400"
            placeholder="مثال: 365"
          />
        </div>

        {/* Currency Selector */}
        <div className="mb-8">
          <label className="block text-gray-700 font-bold mb-4">العملات التي تريد استخدامها:</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {TUNISIAN_CURRENCY.map((currency) => {
              const isSelected = selectedIds.includes(currency.id);
              return (
                <button
                  key={currency.id}
                  onClick={() => toggleCurrency(currency.id)}
                  className={`
                    relative p-3 rounded-lg border-2 transition-all duration-200 flex flex-col items-center justify-center gap-2 h-20
                    ${isSelected 
                      ? 'border-red-500 bg-red-50 text-red-700 shadow-md transform scale-105' 
                      : 'border-gray-200 text-gray-400 hover:border-gray-300 bg-gray-50'
                    }
                  `}
                >
                  <span className={`font-bold text-lg ${isSelected ? 'text-gray-900' : 'text-gray-400'}`}>
                    {currency.label}
                  </span>
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6 text-center font-medium">
            {error}
          </div>
        )}

        <div className="flex gap-4">
          {hasExistingGoals && onCancel && (
            <button
              onClick={onCancel}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 text-lg font-bold py-4 px-6 rounded-xl transition-colors"
            >
              إلغاء
            </button>
          )}
          <button
            onClick={handleCreate}
            className="flex-[2] bg-red-600 hover:bg-red-700 text-white text-lg font-bold py-4 px-8 rounded-xl shadow-lg transform transition hover:-translate-y-1 hover:shadow-xl active:translate-y-0 active:shadow-md"
          >
            إنشاء الهدف
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;