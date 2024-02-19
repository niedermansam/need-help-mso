import React from "react";

export function HighlightedText({
  text,
  highlight,
}: {
  text: string;
  highlight: string | undefined;
}) {
  if (!highlight) return text;
  const parts = text.split(new RegExp(`(${highlight})`, "gi"));
  return (
    <span>
      {parts.map((part, index) => (
        <span
          key={index}
          className={
            part.toLowerCase() === highlight.toLowerCase()
              ? "bg-rose-200  text-stone-700"
              : ""
          }
        >
          {part}
        </span>
      ))}
    </span>
  );
}
