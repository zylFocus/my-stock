import React, { HTMLProps, useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";

type Notes = Record<string, string[]>;

export interface NoteProps extends HTMLProps<HTMLDivElement> {}

const scrollbarStyles = {
  "&::-webkit-scrollbar": {
    width: "6px",
    height: "6px",
  },
  "&::-webkit-scrollbar-track": {
    background: "transparent",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "#bfbfbf",
    borderRadius: "3px",
    "&:hover": {
      backgroundColor: "#999",
    },
  },
  scrollbarWidth: "thin",
  scrollbarColor: "#bfbfbf transparent",
};

export const Note = (props: NoteProps) => {
  const { className = "", ...restProps } = props;
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [notes, setNotes] = useState<Notes>({});

  // Load notes from localStorage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem("stock-note");
    if (savedNotes) {
      try {
        setNotes(JSON.parse(savedNotes));
      } catch (error) {
        console.error("Error loading notes from localStorage:", error);
      }
    }
  }, []);

  const saveNotes = (notes: Notes) => {
    localStorage.setItem("stock-note", JSON.stringify(notes));
  };

  const handleSubmit = () => {
    if (!title || !content) return;

    setNotes((prev) => {
      const newNotes = {
        ...prev,
        [title]: [...(prev[title] || []), content],
      };
      saveNotes(newNotes);
      return newNotes;
    });
    setContent(""); // Clear content after submit
  };

  const handleDeleteTitle = (titleToDelete: string) => {
    setNotes((prev) => {
      const newNotes = { ...prev };
      delete newNotes[titleToDelete];
      saveNotes(newNotes);
      return newNotes;
    });
  };

  const handleDeleteNote = (title: string, indexToDelete: number) => {
    setNotes((prev) => {
      const newNotes = {
        ...prev,
        [title]: prev[title].filter((_, index) => index !== indexToDelete),
      };
      saveNotes(newNotes);
      return newNotes;
    });
  };

  return (
    <div className={className} {...restProps}>
      <div className="note-input-container" style={{ margin: "20px" }}>
        <div style={{ marginBottom: "10px" }}>
          <select
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              marginBottom: "10px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              backgroundColor: "white",
            }}
          >
            <option value="">选择或输入新标题</option>
            {Object.keys(notes).map((existingTitle) => (
              <option key={existingTitle} value={existingTitle}>
                {existingTitle}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="输入新标题"
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              boxSizing: "border-box",
            }}
          />
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="输入笔记内容（支持 Markdown 格式）"
          style={{
            width: "100%",
            height: "100px",
            padding: "8px",
            marginBottom: "10px",
            border: "1px solid #ddd",
            borderRadius: "4px",
            resize: "vertical",
            fontFamily: "monospace",
            boxSizing: "border-box",
          }}
        />
        <button
          onClick={handleSubmit}
          style={{
            padding: "8px 16px",
            backgroundColor: "#1890ff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          确定
        </button>
      </div>

      <div className="notes-display" style={{ margin: "20px" }}>
        {Object.entries(notes).map(([noteTitle, contents]) => (
          <div key={noteTitle} style={{ marginBottom: "20px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                borderBottom: "1px solid #ddd",
                paddingBottom: "8px",
                marginBottom: "10px",
              }}
            >
              <h3 style={{ margin: 0, flex: 1 }}>{noteTitle}</h3>
              <button
                onClick={() => handleDeleteTitle(noteTitle)}
                style={{
                  padding: "4px 8px",
                  backgroundColor: "#ff4d4f",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "12px",
                }}
              >
                删除标题
              </button>
            </div>
            {contents.map((noteContent, index) => (
              <div
                key={index}
                // @ts-ignore
                style={{
                  padding: "10px",
                  backgroundColor: "#f5f5f5",
                  marginBottom: "8px",
                  borderRadius: "4px",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "10px",
                  maxHeight: "300px",
                  overflow: "auto",
                  ...scrollbarStyles,
                }}
              >
                <div
                  style={{
                    flex: 1,
                    overflow: "auto",
                  }}
                  className="markdown-content"
                >
                  <ReactMarkdown
                    components={{
                      // 自定义标题样式
                      h1: ({ children }) => (
                        <h1
                          style={{
                            borderBottom: "1px solid #eee",
                            paddingBottom: "0.3em",
                          }}
                        >
                          {children}
                        </h1>
                      ),
                      h2: ({ children }) => (
                        <h2
                          style={{
                            borderBottom: "1px solid #eee",
                            paddingBottom: "0.3em",
                          }}
                        >
                          {children}
                        </h2>
                      ),
                      // 自定义代码块样式
                      code: ({ children }) => (
                        <code
                          style={{
                            backgroundColor: "#f0f0f0",
                            padding: "0.2em 0.4em",
                            borderRadius: "3px",
                            fontSize: "85%",
                          }}
                        >
                          {children}
                        </code>
                      ),
                    }}
                  >
                    {noteContent}
                  </ReactMarkdown>
                </div>
                <button
                  onClick={() => handleDeleteNote(noteTitle, index)}
                  style={{
                    padding: "4px 8px",
                    backgroundColor: "#ff4d4f",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "12px",
                  }}
                >
                  删除
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
