"use client";

import { useRouter } from "next/navigation";
import React from "react";
import ReactSelect from "react-select";

function JumpToOrgSelect({
  orgs,
}: {
  orgs: {
    id: string;
    name: string;
  }[];
}) {
    const router = useRouter()
  return (
    <ReactSelect
      options={orgs.map((org) => {
        return { label: org.name, value: org.id };
      })}
      placeholder="Start typing an organization name..."
      onChange={(option) => {
        if (option) {
          router.push(`/org/${option.value}`);
      }
      }}
    />
  );
}

export default JumpToOrgSelect;
