/**
 * Wiederverwendbare Markdown-Komponenten für react-markdown
 */

import React from "react";
import type { Components } from "react-markdown";

/**
 * Erstellt die Markdown-Komponenten mit der primaryColor für Links und Blockquotes
 */
export function createMarkdownComponents(primaryColor: string): Components {
  return {
    a: ({ href, children, ...props }) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          color: primaryColor,
          textDecoration: "underline",
        }}
        {...props}
      >
        {children}
      </a>
    ),
    p: ({ children, ...props }) => (
      <p style={{ margin: "0 0 8px 0" }} {...props}>
        {children}
      </p>
    ),
    ul: ({ children, ...props }) => (
      <ul
        style={{
          margin: "8px 0",
          paddingLeft: "20px",
          listStyleType: "disc",
        }}
        {...props}
      >
        {children}
      </ul>
    ),
    ol: ({ children, ...props }) => (
      <ol
        style={{
          margin: "8px 0",
          paddingLeft: "20px",
          listStyleType: "decimal",
        }}
        {...props}
      >
        {children}
      </ol>
    ),
    li: ({ children, ...props }) => (
      <li style={{ marginBottom: "4px" }} {...props}>
        {children}
      </li>
    ),
    code: ({ children, className, ...props }) => {
      const isInline = !className;
      return isInline ? (
        <code
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.05)",
            padding: "2px 4px",
            borderRadius: "4px",
            fontSize: "0.9em",
            fontFamily: "monospace",
          }}
          {...props}
        >
          {children}
        </code>
      ) : (
        <code
          style={{
            display: "block",
            backgroundColor: "rgba(0, 0, 0, 0.05)",
            padding: "12px",
            borderRadius: "6px",
            fontSize: "0.9em",
            fontFamily: "monospace",
            overflowX: "auto",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
          {...props}
        >
          {children}
        </code>
      );
    },
    pre: ({ children, ...props }) => (
      <pre
        style={{
          margin: "8px 0",
          backgroundColor: "rgba(0, 0, 0, 0.05)",
          borderRadius: "6px",
          overflow: "auto",
        }}
        {...props}
      >
        {children}
      </pre>
    ),
    blockquote: ({ children, ...props }) => (
      <blockquote
        style={{
          margin: "8px 0",
          paddingLeft: "12px",
          borderLeft: `3px solid ${primaryColor}`,
          color: "#6b7280",
          fontStyle: "italic",
        }}
        {...props}
      >
        {children}
      </blockquote>
    ),
    h1: ({ children, ...props }) => (
      <h1
        style={{
          fontSize: "1.5em",
          fontWeight: "bold",
          margin: "16px 0 8px 0",
        }}
        {...props}
      >
        {children}
      </h1>
    ),
    h2: ({ children, ...props }) => (
      <h2
        style={{
          fontSize: "1.3em",
          fontWeight: "bold",
          margin: "14px 0 8px 0",
        }}
        {...props}
      >
        {children}
      </h2>
    ),
    h3: ({ children, ...props }) => (
      <h3
        style={{
          fontSize: "1.1em",
          fontWeight: "bold",
          margin: "12px 0 8px 0",
        }}
        {...props}
      >
        {children}
      </h3>
    ),
    strong: ({ children, ...props }) => (
      <strong style={{ fontWeight: "bold" }} {...props}>
        {children}
      </strong>
    ),
    em: ({ children, ...props }) => (
      <em style={{ fontStyle: "italic" }} {...props}>
        {children}
      </em>
    ),
    hr: ({ ...props }) => (
      <hr
        style={{
          margin: "16px 0",
          border: "none",
          borderTop: "1px solid #e5e7eb",
        }}
        {...props}
      />
    ),
    table: ({ children, ...props }) => (
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          margin: "8px 0",
          fontSize: "0.9em",
        }}
        {...props}
      >
        {children}
      </table>
    ),
    th: ({ children, ...props }) => (
      <th
        style={{
          border: "1px solid #e5e7eb",
          padding: "8px",
          backgroundColor: "rgba(0, 0, 0, 0.02)",
          fontWeight: "bold",
          textAlign: "left",
        }}
        {...props}
      >
        {children}
      </th>
    ),
    td: ({ children, ...props }) => (
      <td
        style={{
          border: "1px solid #e5e7eb",
          padding: "8px",
        }}
        {...props}
      >
        {children}
      </td>
    ),
  };
}
