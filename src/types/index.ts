export interface StockData {
  code: string;
  name: string;
  price: string;
  changeRate: string;
  priceChange: string;
  speed: string;
  turnoverRate: string;
  amplitude: string;
  volume: string;
  amount: string;
  volumeRatio: string;
  floatingStock: string;
  marketValue: string;
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
