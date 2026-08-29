import { BankData } from '../types';

export const BANKS: BankData[] = [
  {
    id: '803',
    name: '聯邦 New New',
    code: '803',
    newCustomer: {
      rate: 10.0,
      display: '10.000%',
      quota: '15萬',
      numericQuota: 150000,
      transfers: '10轉/10提',
      notes: '僅限開戶當月21日~次月20日'
    },
    oldCustomer: {
      rate: 3.0,
      display: '3.000%',
      quota: '40萬',
      numericQuota: 400000,
      transfers: '10轉/10提',
      notes: '解任務升級金級會員享 3% (初級會員 1.5%)'
    },
    oldCustomerTaskNotMet: {
      rate: 1.5,
      display: '1.500%',
      quota: '40萬',
      numericQuota: 400000,
      transfers: '10轉/10提',
      notes: '未達任務條件時利率（初級會員）'
    }
  },
  // O-Bank runs two stacked campaigns: an inbound-transfer program open to all
  // customers (2.1% up to 200k, 1.5% from 200k to 1M) and a first-month 12% bonus
  // capped at 100k for brand-new customers. Splitting on the union of both sets of
  // tier boundaries lets new and existing customers share one set of rows.
  {
    id: '048-tier1',
    name: '王道 O-Bank (0~10萬)',
    code: '048',
    newCustomer: {
      rate: 12.0,
      display: '12.000%',
      quota: '10萬',
      numericQuota: 100000,
      transfers: '5轉/3提',
      notes: '新戶好禮 10萬內 12%，為期 1 個月'
    },
    oldCustomer: {
      rate: 2.1,
      display: '2.100%',
      quota: '10萬',
      numericQuota: 100000,
      transfers: '5轉/3提',
      notes: '他轉專案 20萬內 2.1%'
    }
  },
  {
    id: '048-tier2',
    name: '王道 O-Bank (10~20萬)',
    code: '048',
    newCustomer: {
      rate: 2.1,
      display: '2.100%',
      quota: '10萬',
      numericQuota: 100000,
      transfers: '5轉/3提',
      notes: '他轉專案 20萬內 2.1%；新戶好禮 12% 僅適用前 10 萬'
    },
    oldCustomer: {
      rate: 2.1,
      display: '2.100%',
      quota: '10萬',
      numericQuota: 100000,
      transfers: '5轉/3提',
      notes: '他轉專案 20萬內 2.1%'
    }
  },
  {
    id: '048-tier3',
    name: '王道 O-Bank (20~100萬)',
    code: '048',
    newCustomer: {
      rate: 1.5,
      display: '1.500%',
      quota: '80萬',
      numericQuota: 800000,
      transfers: '5轉/3提',
      notes: '他轉專案 20~100萬 1.5%'
    },
    oldCustomer: {
      rate: 1.5,
      display: '1.500%',
      quota: '80萬',
      numericQuota: 800000,
      transfers: '5轉/3提',
      notes: '他轉專案 20~100萬 1.5%'
    }
  },
  {
    id: '809',
    name: '凱基 Karry',
    code: '809',
    newCustomer: {
      rate: 8.8,
      display: '8.800%',
      quota: '5萬',
      numericQuota: 50000,
      transfers: '30次(共)',
      notes: '任務 6 選 1；5萬以上級距為 5~30萬牌告、30~100萬 1.28%、100~200萬 1.78%、200~300萬 1.98%'
    },
    oldCustomer: {
      rate: 0,
      display: '無優惠',
      quota: '—',
      numericQuota: 0,
      transfers: '30次(共)',
      notes: '新戶專案限定，既有戶權益依銀行公告'
    }
  },
  {
    id: '012',
    name: '富邦奈米存',
    code: '012',
    newCustomer: {
      rate: 2.75,
      display: '2.750%',
      quota: '20萬',
      numericQuota: 200000,
      transfers: '5轉/5提',
      notes: '15萬內 1%、15~20萬 8%，開戶成功日起算 180 天'
    },
    oldCustomer: {
      rate: 0.8,
      display: '0.800%',
      quota: '不限',
      numericQuota: Infinity,
      transfers: '5轉/5提',
      notes: '基本牌告利率'
    }
  },
  {
    id: '812',
    name: '台新 Richart',
    code: '812',
    newCustomer: {
      rate: 3.5,
      display: '3.500%',
      quota: '30萬',
      numericQuota: 300000,
      transfers: '5轉/5提',
      notes: '專案優惠利率'
    },
    oldCustomer: {
      rate: 1.8,
      display: '1.800%',
      quota: '100萬',
      numericQuota: 1000000,
      transfers: '5轉/5提',
      notes: '需解子帳戶任務'
    }
  },
  {
    id: '050',
    name: '臺灣企銀 Hokii',
    code: '050',
    newCustomer: {
      rate: 3.0,
      display: '3.000%',
      quota: '15萬',
      numericQuota: 150000,
      transfers: '20轉/12提',
      notes: '解任務最高加碼至 3.0% (基本 2.1% + 任務任務最高 0.9%)'
    },
    oldCustomer: {
      rate: 2.8,
      display: '2.800%',
      quota: '15萬',
      numericQuota: 150000,
      transfers: '20轉/12提',
      notes: '解任務最高加碼至 2.8% (基本 1.9% + 任務最高 0.9%)'
    },
    oldCustomerTaskNotMet: {
      rate: 1.9,
      display: '1.900%',
      quota: '15萬',
      numericQuota: 150000,
      transfers: '20轉/12提',
      notes: '未達任務條件時利率（基本利率）'
    }
  },
  {
    id: '806',
    name: '元大鑽金',
    code: '806',
    newCustomer: {
      rate: 3.0,
      display: '3.000%',
      quota: '5萬',
      numericQuota: 50000,
      transfers: '99次(共)',
      notes: '自開戶完成日起 6 個月，起息點 1 萬元'
    },
    oldCustomer: {
      rate: 0,
      display: '無優惠',
      quota: '—',
      numericQuota: 0,
      transfers: '2轉',
      notes: '無舊戶優惠利率，依活儲牌告計息；每月登入禮 2 次免跨行轉帳'
    }
  },
  {
    id: '108',
    name: '陽信 iSunny',
    code: '108',
    newCustomer: {
      rate: 3.15,
      display: '3.150%',
      quota: '10萬',
      numericQuota: 100000,
      transfers: '5轉/5提',
      notes: '解任務最高至 3.15% (基本 1.65% ~ 最高 3.15%)'
    },
    oldCustomer: {
      rate: 2.15,
      display: '2.150%',
      quota: '10~30萬',
      numericQuota: 300000,
      transfers: '5轉/5提',
      notes: '解任務最高至 2.15% (基本 0.65% ~ 最高 2.15%)'
    },
    oldCustomerTaskNotMet: {
      rate: 0.65,
      display: '0.650%',
      quota: '10萬',
      numericQuota: 100000,
      transfers: '5轉/5提',
      notes: '未達任務條件時利率與基本計息額度；額度提升至 30萬 需同時達成台幣與美元月均額'
    }
  },
  {
    id: '008',
    name: '華南 SnY',
    code: '008',
    newCustomer: {
      rate: 2.3,
      display: '2.300%',
      quota: '10萬',
      numericQuota: 100000,
      transfers: '20轉/10提',
      notes: ''
    },
    oldCustomer: {
      rate: 2.3,
      display: '2.300%',
      quota: '10萬',
      numericQuota: 100000,
      transfers: '20轉/10提',
      notes: '存款餘額需達 1 萬以上'
    }
  },
  {
    id: '052',
    name: '渣打心幸福',
    code: '052',
    newCustomer: {
      rate: 2.5,
      display: '2.500%',
      quota: '300萬',
      numericQuota: 3000000,
      transfers: '0~100次',
      notes: '牌告 0.9% + 數位開立 0.2% + 餘額滿 50萬 0.9%，一般最高 2%；優先理財貴賓再加 0.2%~0.5% 至 2.5%'
    },
    oldCustomer: {
      rate: 0.9,
      display: '0.900%',
      quota: '不限',
      numericQuota: Infinity,
      transfers: '0~100次',
      notes: '加碼為數位新戶限定；舊戶依心幸福牌告 0.625%~0.9% 計息（依當月新匯入資金）'
    }
  },
  // The 300k cap is conditional: the base cap is 200k, raised to 300k the month
  // after logging in to online banking or the app AND holding either a card
  // autopay mandate or USD 1,000 in the account. The free-transfer count runs off
  // a separate condition (Minions debit card spend), so it is not toggled here.
  {
    id: '011',
    name: '上海 Cloud Bank',
    code: '011',
    newCustomer: {
      rate: 2.085,
      display: '2.085%',
      quota: '20萬',
      numericQuota: 200000,
      transfers: '10~15次',
      notes: '牌告 + 0.36%；基本限額 20萬，解加碼條件次月起 30萬。跨轉提 15 次需小小兵 Debit 卡前月消費滿 5 千，否則 10 次'
    },
    oldCustomer: {
      rate: 2.085,
      display: '2.085%',
      quota: '30萬',
      numericQuota: 300000,
      transfers: '10~15次',
      notes: '牌告 + 0.36%；已達加碼條件（登入網銀/APP ＋ 信用卡代扣繳或美金餘額 ≧ USD 1,000）'
    },
    oldCustomerTaskNotMet: {
      rate: 2.085,
      display: '2.085%',
      quota: '20萬',
      numericQuota: 200000,
      transfers: '10次(共)',
      notes: '未達加碼條件時基本限額（牌告 + 0.36%）'
    }
  },
  {
    id: '004',
    name: '台銀',
    code: '004',
    newCustomer: {
      rate: 2.075,
      display: '2.075%',
      quota: '10萬',
      numericQuota: 100000,
      transfers: '10轉/10提',
      notes: '網銀 99 轉'
    },
    oldCustomer: {
      rate: 2.075,
      display: '2.075%',
      quota: '10萬',
      numericQuota: 100000,
      transfers: '10轉/10提',
      notes: '牌告 + 0.36%'
    }
  },
  {
    id: '007',
    name: '一銀 iLEO',
    code: '007',
    newCustomer: {
      rate: 2.0,
      display: '2.000%',
      quota: '12萬',
      numericQuota: 120000,
      transfers: '10轉/10提',
      notes: ''
    },
    oldCustomer: {
      rate: 2.0,
      display: '2.000%',
      quota: '12萬',
      numericQuota: 120000,
      transfers: '10轉/10提',
      notes: ''
    }
  },
  {
    id: '005',
    name: '土銀',
    code: '005',
    newCustomer: {
      rate: 1.94,
      display: '1.940%',
      quota: '10萬',
      numericQuota: 100000,
      transfers: '10轉/5提',
      notes: '牌告 + 0.215%'
    },
    oldCustomer: {
      rate: 1.94,
      display: '1.940%',
      quota: '10萬',
      numericQuota: 100000,
      transfers: '10轉/5提',
      notes: '牌告 + 0.215%'
    }
  },
  {
    id: '823',
    name: '將來銀行',
    code: '823',
    newCustomer: {
      rate: 1.3,
      display: '1.300%',
      quota: '不限',
      numericQuota: Infinity,
      transfers: '66轉/6提',
      notes: '基本牌告'
    },
    oldCustomer: {
      rate: 2.0,
      display: '2.000%',
      quota: '20萬',
      numericQuota: 200000,
      transfers: '50轉/5提',
      notes: '解任務 5~20萬享 2%，逾 20 萬為 1.6%'
    }
  },
  {
    id: '826',
    name: '樂天',
    code: '826',
    newCustomer: {
      rate: 2.8,
      display: '2.800%',
      quota: '5萬',
      numericQuota: 50000,
      transfers: '15~20次',
      notes: '開戶次日至次月底'
    },
    oldCustomer: {
      rate: 1.5,
      display: '1.500%',
      quota: '無上限',
      numericQuota: Infinity,
      transfers: '5~20次',
      notes: '要解任務'
    }
  },
  {
    id: '824',
    name: '連線 LINE',
    code: '824',
    newCustomer: {
      rate: 1.5,
      display: '1.500%',
      quota: '3000萬',
      numericQuota: 30000000,
      transfers: '30~50次',
      notes: '口袋帳戶'
    },
    oldCustomer: {
      rate: 1.5,
      display: '1.500%',
      quota: '3000萬',
      numericQuota: 30000000,
      transfers: '0~50次',
      notes: '口袋帳戶'
    }
  },
  {
    id: '807',
    name: '永豐 DAWHO',
    code: '807',
    newCustomer: {
      rate: 1.5,
      display: '1.500%',
      quota: '30萬',
      numericQuota: 300000,
      transfers: '20次(共)',
      notes: '需解任務升級大戶（如當月平均財富達 30 萬）'
    },
    oldCustomer: {
      rate: 1.5,
      display: '1.500%',
      quota: '30萬',
      numericQuota: 300000,
      transfers: '20次(共)',
      notes: '大戶等級專屬，需逐月解任務維持'
    }
  },
  {
    id: '805',
    name: '遠東 Bankee',
    code: '805',
    newCustomer: {
      rate: 2.6,
      display: '2.600%',
      quota: '5萬',
      numericQuota: 50000,
      transfers: '6轉/6提',
      notes: '必須以推薦碼開戶'
    },
    oldCustomer: {
      rate: 1.435,
      display: '1.435%',
      quota: '無上限',
      numericQuota: Infinity,
      transfers: '6轉/6提',
      notes: '成功邀請一人可享 2.6%'
    }
  },
  {
    id: '006',
    name: '合庫',
    code: '006',
    newCustomer: {
      rate: 1.5,
      display: '1.500%',
      quota: '12萬',
      numericQuota: 120000,
      transfers: '16轉/8提',
      notes: ''
    },
    oldCustomer: {
      rate: 1.5,
      display: '1.500%',
      quota: '12萬',
      numericQuota: 120000,
      transfers: '6轉/6提',
      notes: ''
    }
  },
  {
    id: '017',
    name: '兆豐 MegaLite',
    code: '017',
    newCustomer: {
      rate: 1.2,
      display: '1.200%',
      quota: '10萬',
      numericQuota: 100000,
      transfers: '10轉/10提',
      notes: '活儲機動 + 0.395%'
    },
    oldCustomer: {
      rate: 1.2,
      display: '1.200%',
      quota: '10萬',
      numericQuota: 100000,
      transfers: '10轉/10提',
      notes: '活儲機動 + 0.395%'
    }
  },
  {
    id: '053',
    name: '台中 Lolly',
    code: '053',
    newCustomer: {
      rate: 1.88,
      display: '1.880%',
      quota: '10萬',
      numericQuota: 100000,
      transfers: '10次(共)',
      notes: '限量 5,000 名'
    },
    oldCustomer: {
      rate: 1.0,
      display: '1.000%',
      quota: '10萬',
      numericQuota: 100000,
      transfers: '10次(共)',
      notes: ''
    }
  },
  {
    id: '009',
    name: '彰銀 e財寶',
    code: '009',
    newCustomer: {
      rate: 2.5,
      display: '2.500%',
      quota: '10萬',
      numericQuota: 100000,
      transfers: '30轉/30提',
      notes: '共計 2 個月'
    },
    oldCustomer: {
      rate: 1.64,
      display: '1.640%',
      quota: '10萬',
      numericQuota: 100000,
      transfers: '30轉/30提',
      notes: '大柴任務最高 1.64% (0.9% ~ 1.64%)'
    },
    oldCustomerTaskNotMet: {
      rate: 0.905,
      display: '0.905%',
      quota: '10萬',
      numericQuota: 100000,
      transfers: '30轉/30提',
      notes: '未達分級任務時利率（基本優惠）'
    }
  }
];
