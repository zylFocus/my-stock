export interface StockData {
  /** 股票代码 */
  code: string;
  /** 股票名称 */
  name: string;
  /** 现价 */
  price: string;
  /** 涨跌幅(%) */
  changeRate: string;
  /** 涨跌额 */
  priceChange: string;
  /** 涨速 */
  speed: string;
  /** 换手(%) */
  turnoverRate: string;
  /** 振幅(%) */
  amplitude: string;
  /** 成交量 */
  volume: string;
  /** 成交额 */
  amount: string;
  /** 量比 */
  volumeRatio: string;
  /** 流通股 */
  floatingStock: string;
  /** 流通市值 */
  marketValue: string;
  /** 市盈率 */
  peRatio: string;
}

export interface FilterValue {
  enabled: boolean;
  min: number | null;
  max: number | null;
}

export interface FilterObject {
  [key: string]: FilterValue;
}

export interface ObservedStock {
  code: string;
  name: string;
  date: string;
}

export interface ObservedStocks {
  [date: string]: ObservedStock[];
}

export interface TaggedStock {
  code: string;
  name: string;
  tags: string[];
}

export interface TaggedStocks {
  [tag: string]: TaggedStock[];
}
