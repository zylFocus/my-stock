import React, { useState } from "react";
import { Button, Tag, Collapse } from "antd";
import { MarketType, ObservedStocks } from "../../types";

interface ObservationListProps {
  observedStocks: ObservedStocks;
  onDeleteDate: (date: string) => void;
  onRemoveStock: (code: string) => void;
}

export const ObservationList: React.FC<ObservationListProps> = ({
  observedStocks,
  onDeleteDate,
  onRemoveStock,
}) => {
  const [activeKey, setActiveKey] = useState<string[]>([]);

  if (Object.entries(observedStocks).length === 0) {
    return null;
  }

  return (
    <div
      style={{
        marginBottom: "16px",
        background: "#f5f5f5",
        padding: "16px",
        borderRadius: "8px",
      }}
    >
      <Collapse
        ghost
        activeKey={activeKey}
        onChange={(keys) => setActiveKey(keys as string[])}
      >
        <Collapse.Panel
          header={
            <span style={{ fontWeight: "500", color: "#000" }}>观察列表</span>
          }
          key="1"
        >
          {Object.entries(observedStocks)
            .sort((a, b) => Number(new Date(b[0])) - Number(new Date(a[0])))
            .map(([date, stocks]) => (
              <div key={date} style={{ marginBottom: "16px" }}>
                <div
                  style={{
                    fontWeight: "500",
                    fontSize: "14px",
                    marginBottom: "8px",
                    color: "#666",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>{date}</span>
                  <Button
                    size="small"
                    type="text"
                    danger
                    onClick={() => onDeleteDate(date)}
                  >
                    清空
                  </Button>
                </div>
                <div>
                  {stocks.map((stock) => (
                    <Tag
                      key={stock.code}
                      closable
                      onClose={() => onRemoveStock(stock.code)}
                      style={{ marginRight: "8px", marginBottom: "8px" }}
                    >
                      <a
                        href={
                          stock.marketType === "sh"
                            ? `https://quote.eastmoney.com/kcb/${stock.code}.html`
                            : `https://quote.eastmoney.com/sz${stock.code}.html`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {stock.code} - {stock.name}
                      </a>
                    </Tag>
                  ))}
                </div>
              </div>
            ))}
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};
