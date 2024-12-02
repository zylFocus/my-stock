/**
 * 将东方财富的原始数据转换为标准格式
 * @param data 原始数据
 * @returns 转换后的数据
 */
export const transformToDongCaiStockData = (
  data: DongFangStockData
): DongCaiStockData => {
  return {
    code: data.f12,
    name: data.f14,
    price: data.f2,
    changeRate: data.f3,
    priceChange: data.f4,
    volume: data.f5,
    amount: Number((data.f6 / 10000).toFixed(2)), // 转换为万并保留两位小数
    amplitude: data.f7,
    turnoverRate: data.f8,
    volumeRatio: data.f10,
    peRatio: data.f9,
    pbRatio: data.f23,
    highPrice: data.f15,
    lowPrice: data.f16,
    openPrice: data.f17,
    preClosePrice: data.f18,
    totalMarketValue: data.f20,
    circulationMarketValue: Number((data.f21 / 100000000).toFixed(2)), // 转换为亿并保留两位小数
    speed: data.f22,
    mainForceNetInflow: Number((data.f62 / 10000).toFixed(2)), // 转换为万并保留两位小数
  };
};

/**
 * 批量转换东方财富数据
 * @param dataList 原始数据列表
 * @returns 转换后的数据列表
 */
export const transformToDongCaiStockDataList = (
  dataList: DongFangStockData[]
): DongCaiStockData[] => {
  return dataList.map(transformToDongCaiStockData);
};

export interface DongCaiStockData {
  /** 股票代码 f12 */
  code: string;
  /** 股票名称 f14 */
  name: string;
  /** 最新价 f2 */
  price: number;
  /** 涨跌幅(%) f3 */
  changeRate: number;
  /** 涨跌额 f4 */
  priceChange: number;
  /** 成交量(手) f5 */
  volume: number;
  /** 成交额 f6 */
  amount: number;
  /** 振幅(%) f7 */
  amplitude: number;
  /** 换手率(%) f8 */
  turnoverRate: number;
  /** 量比 f10 */
  volumeRatio: number;
  /** 市盈率(动态) f9 */
  peRatio: number;
  /** 市净率 f23 */
  pbRatio: number;
  /** 最高价 f15 */
  highPrice: number;
  /** 最低价 f16 */
  lowPrice: number;
  /** 今开价 f17 */
  openPrice: number;
  /** 昨收价 f18 */
  preClosePrice: number;
  /** 总市值 f20 */
  totalMarketValue: number;
  /** 流通市值 f21 */
  circulationMarketValue: number;
  /** 涨速 f22 */
  speed: number;
  /** 主力净流入 f62 */
  mainForceNetInflow: number;
}
export interface DongFangStockData {
  /** 未知字段 */
  f1: number;
  /** 最新价 */
  f2: number;
  /** 涨跌幅 */
  f3: number;
  /** 涨跌额 */
  f4: number;
  /** 成交量(手) */
  f5: number;
  /** 成交额 */
  f6: number;
  /** 振幅 */
  f7: number;
  /** 换手率 */
  f8: number;
  /** 市盈率(动态) */
  f9: number;
  /** 量比 */
  f10: number;
  /** 未知字段 */
  f11: number;
  /** 股票代码 */
  f12: string;
  /** 市场标识 */
  f13: number;
  /** 股票名称 */
  f14: string;
  /** 最高价 */
  f15: number;
  /** 最低价 */
  f16: number;
  /** 今开 */
  f17: number;
  /** 昨收 */
  f18: number;
  /** 总市值 */
  f20: number;
  /** 流通市值 */
  f21: number;
  /** 涨速 */
  f22: number;
  /** 市净率 */
  f23: number;
  /** 未知字段 */
  f24: number;
  /** 未知字段 */
  f25: number;
  /** 主力净流入 */
  f62: number;
  /** 未知字段 */
  f115: number;
  /** 未知字段 */
  f128: string;
  /** 未知字段 */
  f136: string;
  /** 未知字段（可选） */
  f140?: string;
  /** 未知字段（可选） */
  f141?: string;
  /** 未知字段 */
  f152: number;
}
