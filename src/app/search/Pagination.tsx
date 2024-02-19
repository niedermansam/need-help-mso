"use client";
import React from "react";

export const Pagination = ({
  setPage,
  page,
  maxPage,
}: {
  setPage: (page: number) => void;
  page: number;
  maxPage: number;
}) => {
  return (
    <div className="flex justify-center">
      <button
        className="m-2 rounded-md bg-gray-200 p-2"
        onClick={() => setPage(page - 1)}
        disabled={page === 1}
      >
        Prev
      </button>
      <span className="m-2 p-2">
        Page {page} of {maxPage}
      </span>
      <button
        className="m-2 rounded-md bg-gray-200 p-2"
        onClick={() => setPage(page + 1)}
        disabled={page === maxPage}
      >
        Next
      </button>
    </div>
  );
};
