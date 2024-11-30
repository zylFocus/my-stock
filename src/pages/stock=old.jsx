import React, { useEffect, useMemo, useState, useRef } from "react";
import { Button, Input, InputNumber, Table, Switch, Tag } from "antd";
import request from "../utils/axios";
import { FilterControls } from "./components/FilterControls";
import { FilterConditions } from "./components/FilterConditions";
import { parseHTMLTable, parseCookie } from "../utils/utils";

export const tongHuaShunUrl =
  "https://q.10jqka.com.cn/#refCountId=www_50a1b74a_693";

const defaultFilterObj = {
  /** 涨跌幅 */
  changeRate: {
    min: 3,
    max: 7,
    enabled: true,
  },
  /** 换手 */
  turnoverRate: {
    min: 5,
    max: 10,
    enabled: false,
  },
  /** 量比 */
  volumeRatio: {
    min: 1,
    max: 10,
    enabled: false,
  },
  /** 流通市值，建议 50 - 200  */
  marketValue: {
    min: 50,
    max: 500,
    enabled: false,
  },
  /** 振幅 */
  amplitude: {
    min: 0,
    max: 100,
    enabled: false,
  },
  /** 市盈率 */
  peRatio: {
    min: 0,
    max: 100,
    enabled: false,
  },
};

export const Stock = () => {
  // 模拟数据
  const [dataSource, setDataSource] = useState([]);
  const [pageSize, setPageSize] = useState(50);
  const [pageStart, setPageStart] = useState(1);
  const [pageEnd, setPageEnd] = useState(10);
  const [loading, setLoading] = useState(false);

  const [filterObj, setFilterObj] = useState(defaultFilterObj);

  const [observedStocks, setObservedStocks] = useState({});

  const [cookie, setCookie] = useState("");
  const [cookie2, setCookie2] = useState("");
  const [cookieObj, setCookieObj] = useState({});

  const hexinV = useMemo(() => {
    return cookieObj.v;
  }, [cookieObj]);

  const iframeRef = useRef(null);

  const columns = [
    {
      title: "序号",
      dataIndex: "index",
      key: "index",
      width: 80,
      render: (_, __, index) => index + 1,
    },
    {
      title: "代码",
      dataIndex: "code",
      key: "code",
      width: 100,
      render: (text) => (
        <a
          href={`https://stockpage.10jqka.com.cn/${text}/`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {text}
        </a>
      ),
    },
    {
      title: "名称",
      dataIndex: "name",
      key: "name",
      width: 120,
    },
    {
      title: "现价",
      dataIndex: "currentPrice",
      key: "currentPrice",
      width: 100,
    },
    {
      title: "涨跌幅(%)",
      dataIndex: "changeRate",
      key: "changeRate",
      width: 110,
      sorter: (a, b) => a.changeRate - b.changeRate,
      render: (text) => (
        <span
          style={{ color: text > 0 ? "red" : text < 0 ? "green" : "black" }}
        >
          {text > 0 ? `+${text}` : text}
        </span>
      ),
    },
    {
      title: "市盈率",
      dataIndex: "peRatio",
      key: "peRatio",
      width: 100,
    },
    {
      title: "流通市值",
      dataIndex: "marketValue",
      key: "marketValue",
      width: 120,
    },
    {
      title: "涨跌",
      dataIndex: "priceChange",
      key: "priceChange",
      width: 100,
      render: (text) => (
        <span
          style={{ color: text > 0 ? "red" : text < 0 ? "green" : "black" }}
        >
          {text > 0 ? `+${text}` : text}
        </span>
      ),
    },
    {
      title: "换手(%)",
      dataIndex: "turnoverRate",
      key: "turnoverRate",
      width: 100,
    },
    {
      title: "量比",
      dataIndex: "volumeRatio",
      key: "volumeRatio",
      width: 100,
      sorter: (a, b) => a.volumeRatio - b.volumeRatio,
    },
    {
      title: "振幅(%)",
      dataIndex: "amplitude",
      key: "amplitude",
      width: 100,
    },
    {
      title: "成交额",
      dataIndex: "dealAmount",
      key: "dealAmount",
      width: 120,
      sorter: (a, b) => {
        // 移除可能的单位（万、亿）并转换为数值进行比较
        const getValue = (str) => {
          const num = parseFloat(str.replace(/,/g, ""));
          if (str.includes("万")) return num * 10000;
          if (str.includes("亿")) return num * 100000000;
          return num;
        };
        return getValue(a.dealAmount) - getValue(b.dealAmount);
      },
    },
    {
      title: "流通股",
      dataIndex: "floatingStock",
      key: "floatingStock",
      width: 120,
    },
    {
      title: "涨速(%)",
      dataIndex: "speed",
      key: "speed",
      width: 100,
    },
    {
      title: "操作",
      key: "action",
      fixed: "right",
      width: 120,
      render: (_, record) => (
        <Button
          type={
            Object.values(observedStocks)
              .flat()
              .some((stock) => stock.code === record.code)
              ? "primary"
              : "default"
          }
          onClick={() => handleAddToObserved(record.code)}
        >
          {Object.values(observedStocks)
            .flat()
            .some((stock) => stock.code === record.code)
            ? "取消观察"
            : "加入观察"}
        </Button>
      ),
    },
  ];
  useEffect(() => {
    const cookieStr = localStorage.getItem("cookie");
    if (cookieStr) {
      setCookie(cookieStr);
      setCookieObj(parseCookie(cookieStr));
    }
    const cookie2Str = localStorage.getItem("cookie2");
    if (cookie2Str) {
      setCookie2(cookie2Str);
    }
    const dataSource = localStorage.getItem("dataSource");
    if (dataSource) {
      setDataSource(JSON.parse(dataSource));
    }
    // Load observed stocks from localStorage
    const storedStocks = localStorage.getItem("observedStocks");
    if (storedStocks) {
      setObservedStocks(JSON.parse(storedStocks));
    }
    // Load filter settings from localStorage
    const storedFilterObj = localStorage.getItem("filterObj");
    if (storedFilterObj) {
      setFilterObj(JSON.parse(storedFilterObj));
    }
  }, []);

  const handleAddToObserved = (code) => {
    const today = new Date().toISOString().split("T")[0];

    setObservedStocks((prev) => {
      const newStocks = { ...prev };

      // Find stock info from dataSource
      const stockInfo = dataSource.find((item) => item.code === code);
      if (!stockInfo) return prev;

      // Check if code exists in any date
      let exists = false;
      let existingDate = null;
      Object.entries(newStocks).forEach(([date, stocks]) => {
        if (stocks.some((stock) => stock.code === code)) {
          exists = true;
          existingDate = date;
        }
      });

      if (exists) {
        // Remove if exists
        newStocks[existingDate] = newStocks[existingDate].filter(
          (stock) => stock.code !== code
        );
        if (newStocks[existingDate].length === 0) {
          delete newStocks[existingDate];
        }
      } else {
        // Add to today's list
        if (!newStocks[today]) {
          newStocks[today] = [];
        }
        newStocks[today].push({
          code: stockInfo.code,
          name: stockInfo.name,
        });
      }

      localStorage.setItem("observedStocks", JSON.stringify(newStocks));
      return newStocks;
    });
  };

  const handleRefresh = async () => {
    // 这里可以添加刷新数据的逻辑
    console.log("刷新数据");
    setLoading(true);
    const dataList = [];
    for (let i = pageStart; i <= pageEnd; i++) {
      await request
        .get("/get-stock/" + i + "/" + i, {
          headers: {
            "coustom-cookie": cookie,
            "hexin-v": hexinV,
          },
        })
        .then((res) => {
          const data = parseHTMLTable(res);
          dataList.push(...data);
        })
        .catch(() => {
          // setLoading(false);
        });
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    setLoading(false);
    console.log("res ====", dataList);
    localStorage.setItem("dataSource", JSON.stringify(dataList));
    setDataSource(dataList);
  };
  const handleRefreshAndAppend = async () => {
    // 这里可以添加刷新数据的逻辑
    console.log("刷新数据");
    setLoading(true);
    const dataList = [...dataSource];
    for (let i = dataList.length / 20 + 1; i <= pageEnd; i++) {
      await request
        .get("/get-stock/" + i + "/" + i, {
          headers: {
            "coustom-cookie": cookie2,
            "hexin-v": hexinV,
          },
        })
        .then((res) => {
          const data = parseHTMLTable(res);
          dataList.push(...data);
        })
        .catch(() => {
          // setLoading(false);
        });
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    setLoading(false);
    console.log("res ====", dataList);
    localStorage.setItem("dataSource", JSON.stringify(dataList));
    if (dataList.length === 0) {
      return;
    }
    setDataSource(dataList);
  };

  const filterDataSource = useMemo(() => {
    return dataSource.filter((item) => {
      // Convert string values to numbers and handle unit conversions
      const changeRate = parseFloat(item.changeRate.replace("%", ""));
      const turnoverRate = parseFloat(item.turnoverRate.replace("%", ""));
      const volumeRatio = parseFloat(item.volumeRatio);
      const marketValue = parseFloat(item.marketValue.replace(/,/g, ""));
      const amplitude = parseFloat(item.amplitude.replace("%", ""));
      const peRatio = parseFloat(item.peRatio);

      return (
        (!filterObj.changeRate.enabled ||
          (changeRate >= filterObj.changeRate.min &&
            changeRate <= filterObj.changeRate.max)) &&
        (!filterObj.turnoverRate.enabled ||
          (turnoverRate >= filterObj.turnoverRate.min &&
            turnoverRate <= filterObj.turnoverRate.max)) &&
        (!filterObj.volumeRatio.enabled ||
          (volumeRatio >= filterObj.volumeRatio.min &&
            volumeRatio <= filterObj.volumeRatio.max)) &&
        (!filterObj.marketValue.enabled ||
          (marketValue >= filterObj.marketValue.min &&
            marketValue <= filterObj.marketValue.max)) &&
        (!filterObj.amplitude.enabled ||
          (amplitude >= filterObj.amplitude.min &&
            amplitude <= filterObj.amplitude.max)) &&
        (!filterObj.peRatio.enabled ||
          isNaN(peRatio) ||
          (peRatio >= filterObj.peRatio.min &&
            peRatio <= filterObj.peRatio.max))
      );
    });
  }, [dataSource, filterObj]);

  return (
    <div style={{ padding: "20px" }}>
      {Object.entries(observedStocks).length > 0 && (
        <div
          style={{
            marginBottom: "16px",
            background: "#f5f5f5",
            padding: "16px",
            borderRadius: "8px",
          }}
        >
          <div style={{ fontWeight: "500", marginBottom: "8px" }}>
            观察列表：
          </div>
          {Object.entries(observedStocks)
            .sort((a, b) => new Date(b[0]) - new Date(a[0])) // Sort by date descending
            .map(([date, stocks]) => (
              <div key={date} style={{ marginBottom: "16px" }}>
                <div
                  style={{
                    fontWeight: "500",
                    fontSize: "14px",
                    marginBottom: "8px",
                    color: "#666",
                  }}
                >
                  {date}
                </div>
                <div>
                  {stocks.map((stock) => (
                    <Tag
                      key={stock.code}
                      closable
                      onClose={() => handleAddToObserved(stock.code)}
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
      )}

      <FilterControls
        loading={loading}
        cookie={cookie}
        setCookie={(value) => {
          setCookie(value);
          setCookieObj(parseCookie(value));
          localStorage.setItem("cookie", value);
        }}
        cookie2={cookie2}
        setCookie2={(value) => {
          setCookie2(value);
          localStorage.setItem("cookie2", value);
        }}
        pageStart={pageStart}
        setPageStart={setPageStart}
        pageEnd={pageEnd}
        setPageEnd={setPageEnd}
        onRefresh={handleRefresh}
        onRefreshAndAppend={handleRefreshAndAppend}
      />
      <FilterConditions
        filterObj={filterObj}
        onChange={(v) => {
          localStorage.setItem("filterObj", JSON.stringify(v));
          setFilterObj(v);
        }}
      />
      <Table
        dataSource={filterDataSource}
        columns={columns}
        scroll={{ x: 1500, y: "calc(100vh - 500px)" }}
        pagination={{
          total: dataSource.length,
          defaultPageSize: 50,
          pageSize,
          showSizeChanger: true,
          showQuickJumper: true,
          onChange: (page, pageSize) => {
            setPageSize(pageSize);
          },
          showTotal: (total) => `共 ${total} 条`,
        }}
        sortDirections={["descend", "ascend", "descend"]}
        style={{
          height: "calc(100vh - 500px)",
          maxWidth: "90vw",
        }}
      />

      <iframe
        ref={iframeRef}
        src={tongHuaShunUrl}
        style={{
          position: "relative",
          top: "200px",
          left: 0,
          width: "100%",
          height: "900px",
          border: "none",
          zIndex: 9999,
        }}
        onLoad={() => {
          console.log("iframe loaded");
        }}
      />
    </div>
  );
};
