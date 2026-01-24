import { BankData } from '../types';

export const BANKS: BankData[] = [
  {
    id: '803',
    name: '聯邦 New New',
    code: '803',
    newCustomer: {
      rate: 15.0,
      display: '15.000%',
      quota: '10萬',
      numericQuota: 100000,
      transfers: '10轉/10提',
      notes: '僅限開戶當月21日~次月20日'
    },
    oldCustomer: {
      rate: 4.0,
      display: '4.000%',
      quota: '30萬',
      numericQuota: 300000,
      transfers: '10轉/10提',
      notes: '解任務最高 4% (基本 1.5% + 加碼 2.5%)'
    }
  },
  {
    id: '048-tier1',
    name: '王道 O-Bank (1)',
    code: '048',
    newCustomer: {
      rate: 8.8,
      display: '8.800%',
      quota: '10萬',
      numericQuota: 100000,
      transfers: '5轉/3提',
      notes: '為期 2 個月'
    },
    oldCustomer: {
      rate: 2.1,
      display: '2.100%',
      quota: '20萬',
      numericQuota: 200000,
      transfers: '5轉/3提',
      notes: '20萬內享 2.1%'
    }
  },
  {
    id: '048-tier2',
    name: '王道 O-Bank (2)',
    code: '048',
    newCustomer: {
      rate: 1.5,
      display: '1.500%',
      quota: '80萬',
      numericQuota: 800000,
      transfers: '5轉/3提',
      notes: '新戶首月後級距'
    },
    oldCustomer: {
      rate: 1.5,
      display: '1.500%',
      quota: '80萬',
      numericQuota: 800000,
      transfers: '5轉/3提',
      notes: '20萬~100萬享 1.5%'
    }
  },
  {
    id: '012',
    name: '富邦奈米存',
    code: '012',
    newCustomer: {
      rate: 5.0,
      display: '5.000%',
      quota: '10萬',
      numericQuota: 100000,
      transfers: '5轉/5提',
      notes: '任務 6 選 3，開戶起算 180 天'
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
      quota: '10萬',
      numericQuota: 100000,
      transfers: '5轉/5提',
      notes: '專案優惠利率'
    },
    oldCustomer: {
      rate: 1.8,
      display: '1.800%',
      quota: '30萬',
      numericQuota: 300000,
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
    id: '011',
    name: '上海 Cloud Bank',
    code: '011',
    newCustomer: {
      rate: 2.085,
      display: '2.085%',
      quota: '20~30萬',
      numericQuota: 300000,
      transfers: '10~15次',
      notes: '牌告 + 0.36%'
    },
    oldCustomer: {
      rate: 2.085,
      display: '2.085%',
      quota: '20~30萬',
      numericQuota: 300000,
      transfers: '10~15次',
      notes: '牌告 + 0.36%'
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
      rate: 1.8,
      display: '1.800%',
      quota: '20萬',
      numericQuota: 200000,
      transfers: '50轉/5提',
      notes: '解任務 5~20萬最高享 1.8%'
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
      quota: '100萬',
      numericQuota: 1000000,
      transfers: '30~50次',
      notes: '口袋帳戶'
    },
    oldCustomer: {
      rate: 1.5,
      display: '1.500%',
      quota: '100萬',
      numericQuota: 1000000,
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
      notes: '平均餘額需達 10 萬'
    },
    oldCustomer: {
      rate: 1.5,
      display: '1.500%',
      quota: '30萬',
      numericQuota: 300000,
      transfers: '20次(共)',
      notes: '大戶等級專屬'
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
      notes: '限量 10,000 名'
    },
    oldCustomer: {
      rate: 1.0,
      display: '1.000%',
      quota: '10萬',
      numericQuota: 100000,
      transfers: '10次(共)',
      notes: '限量 15,000 名'
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
    }
  }
];