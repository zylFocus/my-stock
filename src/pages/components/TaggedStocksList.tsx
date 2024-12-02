import React, { useState } from "react";
import { Tag } from "antd";
import { MdKeyboardArrowDown, MdKeyboardArrowRight } from "react-icons/md";

interface Stock {
  code: string;
  name: string;
}

interface TaggedStocksListProps {
  taggedStocks: Record<string, Stock[]>;
  onRemoveFromTag: (code: string, tag: string) => void;
}

const TaggedStocksList: React.FC<TaggedStocksListProps> = ({
  taggedStocks,
  onRemoveFromTag,
}) => {
  const [collapsedTags, setCollapsedTags] = useState<Record<string, boolean>>(
    {}
  );
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);

  const toggleCollapse = (tag: string) => {
    setCollapsedTags((prev) => ({
      ...prev,
      [tag]: !prev[tag],
    }));
  };

  if (Object.entries(taggedStocks).length === 0) {
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
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          marginBottom: "8px",
          cursor: "pointer",
          userSelect: "none",
        }}
        onClick={() => setIsPanelCollapsed(!isPanelCollapsed)}
      >
        {isPanelCollapsed ? <MdKeyboardArrowRight /> : <MdKeyboardArrowDown />}
        <span style={{ fontWeight: "500" }}>标签分组：</span>
      </div>
      <div style={{ display: isPanelCollapsed ? "none" : "block" }}>
        {Object.entries(taggedStocks).map(([tag, stocks]) => (
          <div key={tag} style={{ marginBottom: "16px" }}>
            <div
              style={{
                fontWeight: "500",
                fontSize: "14px",
                marginBottom: "8px",
                color: "#666",
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                cursor: "pointer",
                userSelect: "none",
              }}
              onClick={() => toggleCollapse(tag)}
            >
              {collapsedTags[tag] ? (
                <MdKeyboardArrowRight />
              ) : (
                <MdKeyboardArrowDown />
              )}
              <span>{tag}</span>
            </div>
            <div style={{ display: collapsedTags[tag] ? "none" : "block" }}>
              {stocks.map((stock) => (
                <Tag
                  key={stock.code}
                  closable
                  onClose={() => onRemoveFromTag(stock.code, tag)}
                  style={{ marginRight: "8px", marginBottom: "8px" }}
                >
                  <a
                    href={`https://stockpage.10jqka.com.cn/${stock.code}/`}
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
      </div>
    </div>
  );
};

export { TaggedStocksList };
