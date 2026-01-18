
import React, { useState, useMemo, useEffect } from 'react';
import { BANKS } from './data/banks';
import { BankData, BankRateInfo } from './types';
import { Check, Info, Wallet, UserCheck, ExternalLink, X, Calculator, TrendingUp, Moon, Sun, UserPlus, ShieldCheck, Ban, LayoutGrid, List, ChevronDown, ChevronUp, CheckCircle2, PlusCircle, Coins, Heart, HeartOff } from 'lucide-react';

const OWNED_KEY = 'taiwan-bank-owned-ids-v2';
const CONSIDERING_KEY = 'taiwan-bank-considering-ids-v2';
const SETUP_COMPLETED_KEY = 'taiwan-bank-setup-completed';
const THEME_KEY = 'taiwan-bank-theme';
const VIEW_MODE_KEY = 'taiwan-bank-view-mode';

const DEFAULT_BANK_CODES = ['812', '017', '807', '048', '004']; // 台新, 兆豐, 永豐, 王道, 台銀
const DEFAULT_CASH = 1000000;

const App: React.FC = () => {
  const [ownedBankCodes, setOwnedBankCodes] = useState<Set<string>>(() => {
    const saved = localStorage.getItem(OWNED_KEY);
    if (saved) {
      try {
        return new Set(JSON.parse(saved));
      } catch (e) {
        return new Set(DEFAULT_BANK_CODES);
      }
    }
    return new Set(DEFAULT_BANK_CODES);
  });

  const [consideringBankCodes, setConsideringBankCodes] = useState<Set<string>>(() => {
    const saved = localStorage.getItem(CONSIDERING_KEY);
    if (saved) {
      try {
        return new Set(JSON.parse(saved));
      } catch (e) {
        return new Set();
      }
    }
    return new Set();
  });

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme) return savedTheme === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [viewMode, setViewMode] = useState<'card' | 'compact'>(() => {
    return (localStorage.getItem(VIEW_MODE_KEY) as 'card' | 'compact') || 'card';
  });

  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [totalCash, setTotalCash] = useState<number>(DEFAULT_CASH);

  useEffect(() => {
    localStorage.setItem(OWNED_KEY, JSON.stringify(Array.from(ownedBankCodes)));
  }, [ownedBankCodes]);

  useEffect(() => {
    localStorage.setItem(CONSIDERING_KEY, JSON.stringify(Array.from(consideringBankCodes)));
  }, [consideringBankCodes]);

  useEffect(() => {
    localStorage.setItem(VIEW_MODE_KEY, viewMode);
  }, [viewMode]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem(THEME_KEY, 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(THEME_KEY, 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const isSetupCompleted = localStorage.getItem(SETUP_COMPLETED_KEY);
    if (!isSetupCompleted) {
      setIsSettingsOpen(true);
    }
  }, []);

  const closeSettings = () => {
    setIsSettingsOpen(false);
    localStorage.setItem(SETUP_COMPLETED_KEY, 'true');
  };

  const toggleBankOwnedByCode = (code: string) => {
    const newOwned = new Set(ownedBankCodes);
    const newConsidering = new Set(consideringBankCodes);
    
    if (newOwned.has(code)) {
      newOwned.delete(code);
    } else {
      newOwned.add(code);
      newConsidering.delete(code); // If owned, cannot be 'considering'
    }
    setOwnedBankCodes(newOwned);
    setConsideringBankCodes(newConsidering);
  };

  const toggleBankConsideringByCode = (code: string) => {
    if (ownedBankCodes.has(code)) return; // Cannot consider if already owned

    const newConsidering = new Set(consideringBankCodes);
    if (newConsidering.has(code)) {
      newConsidering.delete(code);
    } else {
      newConsidering.add(code);
    }
    setConsideringBankCodes(newConsidering);
  };

  const toggleExpandRow = (id: string) => {
    const newSet = new Set(expandedRows);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setExpandedRows(newSet);
  };

  const toggleTheme = () => setIsDarkMode(prev => !prev);

  // Core Sorting Logic
  const sortedBanks = useMemo(() => {
    return [...BANKS].sort((a, b) => {
      const aOwned = ownedBankCodes.has(a.code);
      const aConsidering = consideringBankCodes.has(a.code);
      const bOwned = ownedBankCodes.has(b.code);
      const bConsidering = consideringBankCodes.has(b.code);

      const aPriority = aOwned || aConsidering ? 1 : 0;
      const bPriority = bOwned || bConsidering ? 1 : 0;

      // Group High Priority (Owned/Considering) at the top
      if (aPriority !== bPriority) return bPriority - aPriority;

      // Same group: Sort by current effective rate
      const aRate = aOwned ? a.oldCustomer.rate : a.newCustomer.rate;
      const bRate = bOwned ? b.oldCustomer.rate : b.newCustomer.rate;
      return bRate - aRate;
    });
  }, [ownedBankCodes, consideringBankCodes]);

  const allocation = useMemo(() => {
    let remaining = totalCash;
    const result: Record<string, number> = {};
    let totalInterest = 0;

    for (const bank of sortedBanks) {
      const isOwned = ownedBankCodes.has(bank.code);
      const isConsidering = consideringBankCodes.has(bank.code);
      const isActive = isOwned || isConsidering;
      
      if (!isActive) {
        result[bank.id] = 0;
        continue;
      }

      if (remaining <= 0) {
        result[bank.id] = 0;
        continue;
      }

      const data = isOwned ? bank.oldCustomer : bank.newCustomer;
      const deposit = Math.min(remaining, data.numericQuota);
      result[bank.id] = deposit;
      totalInterest += deposit * (data.rate / 100);
      remaining -= deposit;
    }

    return { result, totalInterest, remaining };
  }, [totalCash, sortedBanks, ownedBankCodes, consideringBankCodes]);

  const uniqueBanksForSettings = useMemo(() => {
    const seen = new Set();
    return BANKS.filter(bank => {
      const duplicate = seen.has(bank.code);
      seen.add(bank.code);
      return !duplicate;
    }).sort((a, b) => a.code.localeCompare(b.code, undefined, { numeric: true }));
  }, []);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'TWD', maximumFractionDigits: 0 }).format(val);
  };

  const renderBankItem = (bank: BankData) => {
    const isOwned = ownedBankCodes.has(bank.code);
    const isConsidering = consideringBankCodes.has(bank.code);
    const data: BankRateInfo = isOwned ? bank.oldCustomer : bank.newCustomer;
    const depositAmount = allocation.result[bank.id] || 0;
    const isSelectedForDeposit = depositAmount > 0;

    const getStatusLabel = () => {
      if (isOwned) return '已持有 (舊戶)';
      if (isConsidering) return '考慮申辦 (新戶)';
      return '未申辦';
    };

    const getStatusColors = () => {
      if (isOwned) return { bg: 'bg-emerald-500/20', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-500/30' };
      if (isConsidering) return { bg: 'bg-indigo-500/20', text: 'text-indigo-600 dark:text-indigo-400', border: 'border-indigo-500/30' };
      return { bg: 'bg-slate-500/10', text: 'text-slate-400 dark:text-slate-500', border: 'border-slate-300/30 dark:border-slate-800' };
    };

    const colors = getStatusColors();

    if (viewMode === 'card') {
      return (
        <div 
          key={bank.id}
          className={`group relative overflow-hidden bg-white dark:bg-[#0f172a] rounded-[2rem] p-6 shadow-sm border-2 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 ${colors.border} ${isSelectedForDeposit ? 'border-solid shadow-lg shadow-indigo-500/5' : 'border-dashed'}`}
        >
          <div className="space-y-5">
            {/* Top Badges */}
            <div className="flex items-center justify-between">
              <div className="flex items-center flex-wrap gap-2">
                <span className={`text-[10px] px-3 py-1 rounded-full font-black tracking-wider shadow-sm ${colors.bg} ${colors.text}`}>
                  {getStatusLabel()}
                </span>
                <span className="text-slate-400 dark:text-slate-500 text-[10px] font-mono font-bold px-2">#{bank.code}</span>
              </div>
              {!isOwned && (
                <button 
                  onClick={(e) => { e.stopPropagation(); toggleBankConsideringByCode(bank.code); }}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black transition-all ${
                    isConsidering 
                      ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:text-rose-600'
                  }`}
                >
                  {isConsidering ? <HeartOff className="w-3 h-3" /> : <Heart className="w-3 h-3" />}
                  {isConsidering ? '取消考慮' : '考慮申辦'}
                </button>
              )}
            </div>

            {/* Title */}
            <h3 className="text-xl md:text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">{bank.name}</h3>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-3 gap-2">
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">單筆上限</span>
                <span className="text-sm font-black text-slate-700 dark:text-slate-300">{data.quota}</span>
              </div>
              <div className="flex flex-col">
                <span className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${isSelectedForDeposit ? 'text-indigo-500 dark:text-indigo-400' : 'text-slate-400'}`}>建議存入</span>
                <span className={`text-sm font-black ${isSelectedForDeposit ? 'text-indigo-600 dark:text-indigo-300' : 'text-slate-400 dark:text-slate-500'}`}>
                  {isSelectedForDeposit ? formatCurrency(depositAmount) : '$0'}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">跨轉/跨提</span>
                <span className="text-sm font-black text-slate-700 dark:text-slate-300">{data.transfers}</span>
              </div>
            </div>

            {/* Rate Section */}
            <div className="pt-2">
              <div className={`text-4xl md:text-5xl font-black tracking-tighter transition-colors leading-none ${
                isOwned ? 'text-emerald-500 dark:text-emerald-400' : (isConsidering ? 'text-indigo-500 dark:text-indigo-400' : 'text-slate-300 dark:text-slate-700')
              }`}>{data.display}</div>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase mt-2 block tracking-widest">
                {isOwned ? '舊戶專屬利率' : '新戶開戶利率'}
              </span>
            </div>

            <div className="h-px bg-slate-100 dark:bg-slate-800/50 w-full"></div>

            {/* Notes Section */}
            {data.notes && (
              <div className="text-[11px] text-slate-500 dark:text-slate-400 flex gap-2 items-start leading-relaxed font-medium min-h-[2.5rem]">
                <Info className="w-4 h-4 flex-shrink-0 text-slate-300 dark:text-slate-600" />
                <span>{data.notes}</span>
              </div>
            )}

            {/* Internal Progress Bar */}
            {isSelectedForDeposit && data.numericQuota !== Infinity && (
              <div className="pt-2">
                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ease-out rounded-full ${isOwned ? 'bg-emerald-500' : 'bg-indigo-500'}`} 
                    style={{ width: `${(depositAmount / data.numericQuota) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    const isExpanded = expandedRows.has(bank.id);
    return (
      <React.Fragment key={bank.id}>
        <tr 
          onClick={() => toggleExpandRow(bank.id)}
          className={`group cursor-pointer transition-all relative hover:bg-indigo-50/30 dark:hover:bg-indigo-500/5 ${
            isSelectedForDeposit ? 'bg-indigo-50/10 dark:bg-indigo-500/5' : ''
          }`}
        >
          <td className="px-5 py-4">
            <div className="flex items-center gap-2">
              <span className="text-[9px] text-slate-400 dark:text-slate-500 font-black bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-md flex-shrink-0">
                {bank.code}
              </span>
              <div className="flex items-center gap-2 truncate">
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isOwned ? 'bg-emerald-500' : (isConsidering ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-700')}`}></span>
                <span className={`text-xs truncate font-bold ${isOwned || isConsidering ? 'text-slate-800 dark:text-slate-100' : 'text-slate-400 dark:text-slate-600'}`}>{bank.name}</span>
              </div>
            </div>
          </td>
          <td className={`px-5 py-4 text-right font-black text-xs whitespace-nowrap ${
            isOwned ? 'text-emerald-600 dark:text-emerald-400' : (isConsidering ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-700')
          }`}>
            {data.display}
          </td>
          <td className="px-5 py-4 text-right whitespace-nowrap">
            <div className="flex flex-col items-end gap-1.5">
              {isSelectedForDeposit ? (
                <>
                  <span className="text-indigo-600 dark:text-indigo-400 font-black text-xs">{formatCurrency(depositAmount)}</span>
                  {data.numericQuota !== Infinity && (
                    <div className="w-16 h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-1000 ${isOwned ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                        style={{ width: `${Math.min(100, (depositAmount / data.numericQuota) * 100)}%` }}
                      ></div>
                    </div>
                  )}
                </>
              ) : (
                <span className="text-[10px] font-black text-slate-300 dark:text-slate-700">$0</span>
              )}
            </div>
          </td>
          <td className="px-5 py-4 text-right">
             <div className="flex items-center justify-end gap-2">
                {!isOwned && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); toggleBankConsideringByCode(bank.code); }}
                    className={`p-1.5 rounded-lg transition-all ${isConsidering ? 'bg-rose-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-rose-500'}`}
                  >
                    {isConsidering ? <HeartOff className="w-3.5 h-3.5" /> : <Heart className="w-3.5 h-3.5" />}
                  </button>
                )}
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-black whitespace-nowrap opacity-60 w-16 text-right">{data.quota}</div>
             </div>
          </td>
          <td className="px-3 py-4">
            {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-300" /> : <ChevronDown className="w-4 h-4 text-slate-300" />}
          </td>
        </tr>
        {isExpanded && (
          <tr className="bg-slate-50/50 dark:bg-slate-950/40">
            <td colSpan={5} className="px-5 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-wider text-slate-400">
                    <div className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{getStatusLabel()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calculator className="w-3.5 h-3.5" />
                      <span>跨轉/提：{data.transfers}</span>
                    </div>
                  </div>
                  {data.notes && (
                    <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                      <Info className="w-3.5 h-3.5 inline-block mr-1.5 text-indigo-300 mb-0.5" />
                      {data.notes}
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-end">
                  {isSelectedForDeposit && data.numericQuota !== Infinity && (
                    <div className="w-full max-w-[160px] space-y-1.5">
                      <div className="flex justify-between text-[9px] font-black uppercase text-slate-400 tracking-widest">
                        <span>額度使用率</span>
                        <span>{Math.round((depositAmount / data.numericQuota) * 100)}%</span>
                      </div>
                      <div className="h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-1000 ${isOwned ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                          style={{ width: `${(depositAmount / data.numericQuota) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </td>
          </tr>
        )}
      </React.Fragment>
    );
  };

  const renderSeparator = () => {
    if (allocation.remaining <= 0) return null;
    
    return viewMode === 'card' ? (
      <div key="separator" className="py-6 px-4 bg-amber-50/50 dark:bg-amber-900/10 border-2 border-dashed border-amber-200 dark:border-amber-800/50 rounded-3xl text-center space-y-1 my-4">
        <p className="text-amber-700 dark:text-amber-400 font-black flex items-center justify-center gap-2 text-base">
          <Calculator className="w-5 h-5" />
          還有 {formatCurrency(allocation.remaining)} 資金溢出
        </p>
        <p className="text-[11px] text-amber-600/70 dark:text-amber-500/60 font-bold flex items-center justify-center gap-1">
          <PlusCircle className="w-3.5 h-3.5" />
          現有高利額度已滿，可點擊「考慮申辦」來擴充額度
        </p>
      </div>
    ) : (
      <tr key="separator" className="bg-amber-50/40 dark:bg-amber-900/10">
        <td colSpan={5} className="px-5 py-6 text-center">
          <div className="inline-flex flex-col items-center">
            <span className="text-amber-700 dark:text-amber-400 font-black text-sm flex items-center gap-2">
               還有 {formatCurrency(allocation.remaining)} 資金溢出
            </span>
            <span className="text-[10px] text-amber-600/70 dark:text-amber-500/60 font-bold flex items-center gap-1 mt-0.5">
              <PlusCircle className="w-3 h-3" />
              現有高利額度已滿，可點擊下方愛心考慮申辦
            </span>
          </div>
        </td>
      </tr>
    );
  };

  const { activeBanks, inactiveBanks } = useMemo(() => {
    const active = sortedBanks.filter(b => ownedBankCodes.has(b.code) || consideringBankCodes.has(b.code));
    const inactive = sortedBanks.filter(b => !ownedBankCodes.has(b.code) && !consideringBankCodes.has(b.code));
    return { activeBanks: active, inactiveBanks: inactive };
  }, [sortedBanks, ownedBankCodes, consideringBankCodes]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 pb-20 font-sans">
      <header className="bg-gradient-to-r from-indigo-600 to-violet-700 dark:from-slate-900 dark:to-indigo-950 text-white py-4 px-4 sticky top-0 z-40 shadow-lg backdrop-blur-md bg-opacity-95">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2 rounded-xl border border-white/20 backdrop-blur-md">
              <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-indigo-100" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-black leading-tight tracking-tight">高利活存攻略</h1>
              <p className="text-[10px] md:text-xs text-indigo-100/70 font-medium">個人化利息極大化助手</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all text-white border border-white/10">
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button 
              onClick={() => setIsSettingsOpen(true)} 
              className="flex items-center gap-2 px-3 py-2 bg-white text-indigo-700 dark:bg-indigo-500 dark:text-white rounded-full font-bold text-xs md:text-sm hover:scale-105 active:scale-95 transition-all shadow-xl shadow-indigo-500/20"
            >
              <UserCheck className="w-4 h-4" />
              <span>帳戶管理</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Statistics Dashboard */}
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 mb-6 space-y-6 transition-all">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex-1">
              <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.1em] mb-2.5 flex items-center gap-2">
                <Wallet className="w-4 h-4 text-indigo-500" />
                流動資金 (萬元)
              </label>
              <div className="relative group max-w-md">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-2xl font-black transition-colors group-focus-within:text-indigo-500">$</span>
                <input 
                  type="number"
                  placeholder="輸入金額"
                  className="w-full pl-12 pr-16 py-4 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 rounded-3xl text-3xl font-black focus:ring-0 text-slate-900 dark:text-white transition-all outline-none"
                  value={totalCash / 10000 || ''}
                  onChange={(e) => setTotalCash(Number(e.target.value) * 10000)}
                />
                <span className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 font-black text-lg">萬元</span>
              </div>
            </div>
          </div>

          {/* 整合式利息概覽面板 */}
          <div className="bg-rose-50/40 dark:bg-rose-950/20 p-4 md:p-6 rounded-[2rem] border-2 border-rose-100/50 dark:border-rose-900/30 relative overflow-hidden group transition-all">
            <div className="absolute top-[-30px] right-[-30px] opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
              <Coins className="w-32 h-32 text-rose-500" />
            </div>
            
            <div className="flex flex-row items-center relative z-10 w-full">
              {/* 左側：主月利息 (50%) */}
              <div className="w-1/2 min-w-0 pr-2">
                <div className="flex items-center gap-1 text-rose-600 dark:text-rose-400 font-black text-[10px] md:text-xs tracking-widest uppercase mb-0.5 whitespace-nowrap overflow-hidden">
                  <Coins className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">平均每月利息</span>
                </div>
                <div className="text-2xl md:text-4xl font-black text-rose-700 dark:text-rose-300 tracking-tighter transition-all truncate">
                  {formatCurrency(allocation.totalInterest / 12)}
                </div>
              </div>

              {/* 右側：補充資訊 (50%) */}
              <div className="w-1/2 min-w-0 flex flex-col gap-1.5 pl-2">
                <div className="flex flex-row items-center justify-between gap-1 px-2 py-1.5 md:px-3 md:py-2 bg-transparent rounded-xl md:rounded-2xl border-2 border-slate-300/40 dark:border-slate-700/40 w-full min-w-0">
                  <span className="text-[9px] md:text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap flex-shrink-0">預估年利息</span>
                  <span className="text-xs md:text-base font-black text-slate-600 dark:text-slate-300 whitespace-nowrap truncate text-right flex-1">
                    {formatCurrency(allocation.totalInterest)}
                  </span>
                </div>
                
                <div className="flex flex-row items-center justify-between gap-1 px-2 py-1.5 md:px-3 md:py-2 bg-transparent rounded-xl md:rounded-2xl border-2 border-slate-300/40 dark:border-slate-700/40 w-full min-w-0">
                  <span className="text-[9px] md:text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap flex-shrink-0">資產年化</span>
                  <span className="text-xs md:text-base font-black text-slate-600 dark:text-slate-300 whitespace-nowrap truncate text-right flex-1">
                    {totalCash > 0 ? ((allocation.totalInterest / totalCash) * 100).toFixed(3) : '0.000'}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4 px-2">
          <h2 className="text-lg font-black text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-indigo-500" />
            存款配置建議
          </h2>
          <div className="flex bg-slate-200/50 dark:bg-slate-800/50 p-1 rounded-xl border border-slate-200/50 dark:border-slate-800">
            <button 
              onClick={() => setViewMode('card')}
              className={`p-1.5 rounded-lg transition-all ${viewMode === 'card' ? 'bg-white dark:bg-slate-700 shadow-md text-indigo-600 dark:text-indigo-400' : 'text-slate-400 hover:text-slate-600'}`}
              title="卡片模式"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode('compact')}
              className={`p-1.5 rounded-lg transition-all ${viewMode === 'compact' ? 'bg-white dark:bg-slate-700 shadow-md text-indigo-600 dark:text-indigo-400' : 'text-slate-400 hover:text-slate-600'}`}
              title="列表模式"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {viewMode === 'card' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeBanks.map(renderBankItem)}
            <div className="col-span-1 md:col-span-2">
                {renderSeparator()}
            </div>
            {inactiveBanks.map(renderBankItem)}
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 text-[9px] font-black uppercase tracking-[0.2em]">
                    <th className="px-5 py-4 min-w-[160px]">銀行名稱</th>
                    <th className="px-5 py-4 text-right">利率</th>
                    <th className="px-5 py-4 text-right">建議存入</th>
                    <th className="px-5 py-4 text-right">狀態 & 上限</th>
                    <th className="px-3 py-4 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                  {activeBanks.map(renderBankItem)}
                  {renderSeparator()}
                  {inactiveBanks.map(renderBankItem)}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 overflow-hidden">
          <div className="absolute inset-0 bg-slate-900/70 dark:bg-black/80 backdrop-blur-xl transition-all" onClick={closeSettings}></div>
          <div className="relative bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] shadow-2xl flex flex-col max-h-[85vh] transition-all border border-white/10 overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
              <div>
                <h2 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-3">
                  <UserCheck className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  我有哪些帳戶？
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">勾選您已持有的帳戶，系統將自動套用「舊戶利率」。</p>
              </div>
              <button onClick={closeSettings} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all text-slate-400 hover:text-indigo-600 active:scale-90">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-2 custom-scrollbar">
              <div className="grid grid-cols-1 gap-2">
                {uniqueBanksForSettings.map((bank) => (
                  <button
                    key={bank.code}
                    onClick={() => toggleBankOwnedByCode(bank.code)}
                    className={`flex items-center justify-between w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 group ${
                      ownedBankCodes.has(bank.code)
                        ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 shadow-sm'
                        : 'bg-white dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-emerald-100 dark:hover:border-emerald-900'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                        ownedBankCodes.has(bank.code) ? 'bg-emerald-600 border-emerald-600 scale-105' : 'border-slate-200 dark:border-slate-700'
                      }`}>
                        {ownedBankCodes.has(bank.code) && <Check className="w-3.5 h-3.5 text-white font-black" />}
                      </div>
                      <span className="text-[10px] font-black bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-500 dark:text-slate-400 tracking-wider">#{bank.code}</span>
                      <span className="font-black text-sm">{bank.name.replace(/\(級距.\)|\(\d\)/, '').trim()}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-md">
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest">已持有</span>
                <span className="text-base font-black text-emerald-600 dark:text-emerald-400">{ownedBankCodes.size} <span className="text-xs">間</span></span>
              </div>
              <div className="flex gap-3">
                <button onClick={() => { setOwnedBankCodes(new Set()); setConsideringBankCodes(new Set()); }} className="px-3 py-2 text-slate-400 hover:text-red-500 text-xs font-black transition-colors uppercase tracking-widest">重設</button>
                <button onClick={closeSettings} className="px-8 py-3 bg-indigo-600 dark:bg-indigo-500 text-white rounded-xl font-black text-xs hover:scale-105 active:scale-95 transition-all shadow-xl shadow-indigo-500/30">確認</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="mt-12 text-center text-slate-400 dark:text-slate-600 text-[10px] pb-10 space-y-3 px-6 transition-colors">
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <a href="https://www.ptt.cc/bbs/Bank_Service/M.1767533701.A.974.html" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 font-black text-indigo-400 dark:text-indigo-600 hover:text-indigo-700 transition-colors uppercase tracking-widest">
            來源：PTT <ExternalLink className="w-3 h-3" />
          </a>
          <span className="opacity-20">/</span>
          <p className="font-bold tracking-tight">更新：2026/01/04</p>
        </div>
        <p className="font-black tracking-[0.2em] opacity-40 uppercase">© 2026 Taiwan High Interest Tracker</p>
        <p className="opacity-50 max-w-md mx-auto leading-relaxed font-medium italic">
          Disclaimer: 本工具僅為試算。具體利率與條件以各銀行最新官方公告為準。
        </p>
      </footer>
    </div>
  );
};

export default App;
