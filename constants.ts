import { Denomination, CurrencyType } from './types';

export const TUNISIAN_CURRENCY: Denomination[] = [
  // Coins
  { 
    id: '50m', 
    value: 0.050, 
    label: '50 مليم', 
    displayValue: '50',
    type: CurrencyType.Coin, 
    colorClass: 'bg-gradient-to-br from-amber-200 to-amber-500 text-amber-950 border-4 border-amber-600 shadow-md' 
  },
  { 
    id: '100m', 
    value: 0.100, 
    label: '100 مليم', 
    displayValue: '100',
    type: CurrencyType.Coin, 
    colorClass: 'bg-gradient-to-br from-yellow-200 to-yellow-400 text-yellow-950 border-4 border-yellow-600 shadow-md' 
  },
  { 
    id: '200m', 
    value: 0.200, 
    label: '200 مليم', 
    displayValue: '200',
    type: CurrencyType.Coin, 
    colorClass: 'bg-gradient-to-br from-yellow-300 to-amber-400 text-amber-950 border-4 border-amber-600 shadow-md' 
  },
  { 
    id: '500m', 
    value: 0.500, 
    label: '500 مليم', 
    displayValue: '500',
    type: CurrencyType.Coin, 
    colorClass: 'bg-gradient-to-br from-slate-200 to-slate-400 text-slate-900 border-4 border-slate-500 shadow-md' 
  },
  { 
    id: '1dt', 
    value: 1.000, 
    label: '1 دينار', 
    displayValue: '1',
    type: CurrencyType.Coin, 
    colorClass: 'bg-gradient-to-br from-gray-200 to-gray-400 text-gray-900 border-4 border-gray-500 shadow-md' 
  },
  { 
    id: '2dt', 
    value: 2.000, 
    label: '2 دينار', 
    displayValue: '2',
    type: CurrencyType.Coin, 
    // Bi-metallic simulation: Gold Center (bg) with Silver Ring (border)
    colorClass: 'bg-gradient-to-br from-yellow-300 to-yellow-500 text-slate-900 border-4 border-slate-300 ring-1 ring-slate-400 shadow-md' 
  },
  
  // Bills
  { 
    id: '5dt', 
    value: 5.000, 
    label: '5 دنانير', 
    displayValue: '5',
    type: CurrencyType.Bill, 
    colorClass: 'bg-gradient-to-r from-emerald-100 to-emerald-300 text-emerald-900 border-2 border-emerald-500 shadow-md' 
  },
  { 
    id: '10dt', 
    value: 10.000, 
    label: '10 دنانير', 
    displayValue: '10',
    type: CurrencyType.Bill, 
    colorClass: 'bg-gradient-to-r from-blue-100 to-blue-300 text-blue-900 border-2 border-blue-500 shadow-md' 
  },
  { 
    id: '20dt', 
    value: 20.000, 
    label: '20 دينار', 
    displayValue: '20',
    type: CurrencyType.Bill, 
    colorClass: 'bg-gradient-to-r from-rose-100 to-rose-300 text-rose-900 border-2 border-rose-500 shadow-md' 
  },
  { 
    id: '50dt', 
    value: 50.000, 
    label: '50 دينار', 
    displayValue: '50',
    type: CurrencyType.Bill, 
    colorClass: 'bg-gradient-to-r from-purple-100 to-purple-300 text-purple-900 border-2 border-purple-500 shadow-md' 
  },
];

export const STORAGE_KEY = 'tounes_money_challenge_v2';

// Format helper
export const formatCurrency = (amount: number): string => {
  if (amount < 1) {
    return `${Math.round(amount * 1000)} مليم`;
  }
  return `${amount.toFixed(3)} د.ت`;
};