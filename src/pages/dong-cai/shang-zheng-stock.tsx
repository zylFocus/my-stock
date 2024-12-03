import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Table,
  Tag,
  Space,
  Button,
  Input,
  Popover,
  Select,
  Tooltip,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { FilterControls } from "./FilterControls";
import { FilterConditions } from "../components/FilterConditions";
import { ObservationList } from "../components/ObservationList";
import { TaggedStocksList } from "../components/TaggedStocksList";
import {
  FilterObject,
  ObservedStocks,
  TaggedStock,
  TaggedStocks,
} from "../../types";
import request from "../../utils/axios";
import { MdDelete } from "react-icons/md";
import { BsQuestionCircle } from "react-icons/bs";
import { DongCaiStockData, transformToDongCaiStockDataList } from "./utils";

export const dongCaiUrl =
  "https://quote.eastmoney.com/center/gridlist.html#sh_a_board";

const defaultFilterObj = {
  /** 涨跌幅 */
  changeRate: {
    min: 3,
    max: 7,
    enabled: true,
  },
  /** 换手 */
  turnoverRate: {
    min: 0,
    max: 5,
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
    max: 10,
    enabled: false,
  },
  /** 市盈率 */
  peRatio: {
    min: 0,
    max: 100,
    enabled: false,
  },
};

export const ShangZhengStock: React.FC = () => {
  const [dataSource, setDataSource] = useState<DongCaiStockData[]>([]);
  const [queryPageSize, setQueryPageSize] = useState(1000);
  const [loading, setLoading] = useState(false);

  const [filterObj, setFilterObj] = useState(defaultFilterObj);

  const [observedStocks, setObservedStocks] = useState<ObservedStocks>({});

  const [taggedStocks, setTaggedStocks] = useState<TaggedStocks>({});
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");

  const [cookie, setCookie] = useState("");

  const [searchText, setSearchText] = useState("");

  const columns: ColumnsType<DongCaiStockData> = [
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
      dataIndex: "price",
      key: "price",
      width: 100,
    },
    {
      title: "涨跌幅(%)",
      dataIndex: "changeRate",
      key: "changeRate",
      width: 140,
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
      title: "市净率",
      dataIndex: "pbRatio",
      key: "pbRatio",
      width: 100,
    },
    {
      title: "流通市值",
      dataIndex: "circulationMarketValue",
      key: "circulationMarketValue",
      width: 120,
      render: (value) => `${value.toFixed(2)}亿`,
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
      title: (
        <Space>
          量比
          <Tooltip title="量比 = 当日成交量 ÷ (过去5个交易日平均每分钟成交量 × 当日交易时间(分钟))">
            <BsQuestionCircle style={{ fontSize: "14px", color: "#999" }} />
          </Tooltip>
        </Space>
      ),
      dataIndex: "volumeRatio",
      key: "volumeRatio",
      width: 100,
      sorter: (a, b) => a.volumeRatio - b.volumeRatio,
    },
    {
      title: "主力净流入",
      dataIndex: "mainForceNetInflow",
      key: "mainForceNetInflow",
      width: 120,
      render: (value) => (
        <span
          style={{ color: value > 0 ? "red" : value < 0 ? "green" : "black" }}
        >
          {`${value.toFixed(2)}万`}
        </span>
      ),
    },
    {
      title: "振幅(%)",
      dataIndex: "amplitude",
      key: "amplitude",
      width: 100,
    },
    {
      title: "成交额",
      dataIndex: "amount",
      key: "amount",
      width: 120,
      sorter: (a, b) => a.amount - b.amount,
      render: (value) => `${value.toFixed(2)}万`,
    },
    {
      title: "成交量",
      dataIndex: "volume",
      key: "volume",
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
      width: 200,
      render: (_, record) => (
        <Space>
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
          <Popover
            content={
              <div style={{ width: "200px" }}>
                <Space direction="vertical" style={{ width: "100%" }}>
                  <Select
                    style={{ width: "100%" }}
                    placeholder="选择标签"
                    value={getStockTag(record.code)}
                    onChange={(value) => handleAddTag(record.code, value)}
                    options={availableTags.map((tag) => ({
                      label: (
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <span>{tag}</span>
                          <MdDelete
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteTag(tag);
                            }}
                            style={{ cursor: "pointer", color: "#ff4d4f" }}
                          />
                        </div>
                      ),
                      value: tag,
                    }))}
                    dropdownRender={(menu) => (
                      <>
                        {menu}
                        <div style={{ padding: "8px" }}>
                          <Input.Group compact>
                            <Input
                              style={{ width: "70%" }}
                              value={newTag}
                              onChange={(e) => setNewTag(e.target.value)}
                              onPressEnter={() => handleCreateTag(newTag)}
                              placeholder="新建标签"
                            />
                            <Button
                              style={{ width: "30%" }}
                              type="primary"
                              onClick={() => handleCreateTag(newTag)}
                            >
                              添加
                            </Button>
                          </Input.Group>
                        </div>
                      </>
                    )}
                  />
                </Space>
              </div>
            }
            trigger="click"
            placement="left"
          >
            <div style={{ cursor: "pointer" }}>
              {getStockTag(record.code) ? (
                <Tag color="blue">{getStockTag(record.code)}</Tag>
              ) : (
                <Tag color="default">打标签</Tag>
              )}
            </div>
          </Popover>
        </Space>
      ),
    },
  ];

  const getStockTag = (code: string) => {
    for (const [tag, stocks] of Object.entries(taggedStocks)) {
      if (stocks.some((stock) => stock.code === code)) {
        return tag;
      }
    }
    return null;
  };

  useEffect(() => {
    const cookieStr = localStorage.getItem("dongCaiCookie");
    if (cookieStr) {
      setCookie(cookieStr);
    }
    const dataSource = localStorage.getItem("shangADataSource");
    if (dataSource) {
      setDataSource(JSON.parse(dataSource));
    }
    // Load observed stocks from localStorage
    const storedStocks = localStorage.getItem("observedStocks");
    if (storedStocks) {
      setObservedStocks(JSON.parse(storedStocks));
    }
    // Load tagged stocks from localStorage
    const storedTaggedStocks = localStorage.getItem("taggedStocks");
    if (storedTaggedStocks) {
      setTaggedStocks(JSON.parse(storedTaggedStocks));
    }
    const storedTags = localStorage.getItem("availableTags");
    if (storedTags) {
      setAvailableTags(JSON.parse(storedTags));
    }
    // Load filter settings from localStorage
    const storedFilterObj = localStorage.getItem("shangAFilterObj");
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
          date: today,
        });
      }

      localStorage.setItem("observedStocks", JSON.stringify(newStocks));
      return newStocks;
    });
  };

  const handleDeleteDateStocks = (date: string) => {
    setObservedStocks((prev) => {
      const newStocks = { ...prev };
      delete newStocks[date];
      localStorage.setItem("observedStocks", JSON.stringify(newStocks));
      return newStocks;
    });
  };

  const handleAddTag = (code: string, tag: string) => {
    const stockInfo = dataSource.find((item) => item.code === code);
    if (!stockInfo) return;

    setTaggedStocks((prev) => {
      const newTaggedStocks = { ...prev };

      // Remove stock from all other tags if it exists
      Object.keys(newTaggedStocks).forEach((existingTag) => {
        newTaggedStocks[existingTag] =
          newTaggedStocks[existingTag]?.filter(
            (stock) => stock.code !== code
          ) || [];
        if (newTaggedStocks[existingTag].length === 0) {
          delete newTaggedStocks[existingTag];
        }
      });

      // Add stock to new tag
      if (!newTaggedStocks[tag]) {
        newTaggedStocks[tag] = [];
      }
      newTaggedStocks[tag].push({
        code: stockInfo.code,
        name: stockInfo.name,
        tags: [tag],
      });

      localStorage.setItem("taggedStocks", JSON.stringify(newTaggedStocks));
      return newTaggedStocks;
    });
  };

  const handleCreateTag = (tagName: string) => {
    if (!tagName || availableTags.includes(tagName)) return;

    setAvailableTags((prev) => {
      const newTags = [...prev, tagName];
      localStorage.setItem("availableTags", JSON.stringify(newTags));
      return newTags;
    });
    setNewTag("");
  };

  const handleRemoveFromTag = (code: string, tag: string) => {
    setTaggedStocks((prev) => {
      const newTaggedStocks = { ...prev };
      newTaggedStocks[tag] =
        newTaggedStocks[tag]?.filter((stock) => stock.code !== code) || [];

      if (newTaggedStocks[tag].length === 0) {
        delete newTaggedStocks[tag];
      }

      localStorage.setItem("taggedStocks", JSON.stringify(newTaggedStocks));
      return newTaggedStocks;
    });
  };

  const handleDeleteTag = (tagToDelete: string) => {
    setTaggedStocks((prev) => {
      const newTaggedStocks = { ...prev };
      delete newTaggedStocks[tagToDelete];
      return newTaggedStocks;
    });
    setAvailableTags((prev) => prev.filter((tag) => tag !== tagToDelete));
  };

  const handleRefresh = async () => {
    // 这里可以添加刷新数据的逻辑
    console.log("刷新数据");
    setLoading(true);
    const res = await request
      .get(`/dong-fang-cai-fu/shang-a-data/${queryPageSize}`, {
        headers: {
          "coustom-cookie": cookie,
        },
      })
      .catch(() => {
        // setLoading(false);
      });
    setLoading(false);
    const dataList = transformToDongCaiStockDataList(res.data.diff);
    console.log("res ====", dataList);
    localStorage.setItem("shangADataSource", JSON.stringify(dataList));
    setDataSource(dataList);
  };

  const filterDataSource = useMemo(() => {
    return dataSource.filter((item) => {
      // 搜索过滤
      if (searchText) {
        const searchLower = searchText.toLowerCase();
        const nameMatch = item.name.toLowerCase().includes(searchLower);
        const codeMatch = item.code.toLowerCase().includes(searchLower);
        if (!nameMatch && !codeMatch) {
          return false;
        }
      }

      // 数据已经是数字类型，不需要转换
      const changeRate = item.changeRate;
      const turnoverRate = item.turnoverRate;
      const volumeRatio = item.volumeRatio;
      const marketValue = item.circulationMarketValue;
      const amplitude = item.amplitude;
      const peRatio = item.peRatio;

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
  }, [dataSource, filterObj, searchText]);

  return (
    <div style={{ padding: "20px" }}>
      <FilterControls
        loading={loading}
        cookie={cookie}
        setCookie={(value) => {
          setCookie(value);
          localStorage.setItem("dongCaiCookie", value);
        }}
        queryPageSize={queryPageSize}
        setQueryPageSize={setQueryPageSize}
        onRefresh={handleRefresh}
        dongCaiUrl={dongCaiUrl}
      />
      {Object.entries(taggedStocks).length > 0 && (
        <TaggedStocksList
          taggedStocks={taggedStocks}
          onRemoveFromTag={handleRemoveFromTag}
        />
      )}
      <ObservationList
        observedStocks={observedStocks}
        onDeleteDate={handleDeleteDateStocks}
        onRemoveStock={handleAddToObserved}
      />

      <FilterConditions
        filterObj={filterObj}
        onChange={(v) => {
          localStorage.setItem("shangAFilterObj", JSON.stringify(v));
          setFilterObj(v as any);
        }}
        onSearch={setSearchText}
        searchValue={searchText}
      />
      <Table
        dataSource={filterDataSource}
        columns={columns}
        scroll={{ x: 1500, y: "calc(100vh - 500px)" }}
        pagination={{
          total: filterDataSource.length,
          defaultPageSize: 200,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条`,
          pageSizeOptions: [50, 100, 200, 500, 1000],
        }}
        sortDirections={["descend", "ascend", "descend"]}
      />
    </div>
  );
};
