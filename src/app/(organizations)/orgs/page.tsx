// import type { Organization } from '@prisma/client'
import React from "react";
import { prisma } from "@/server/db";
import { CategorySection } from "@/components/organization/CategorySection";

async function OrganizationPage() {
  const categories = await prisma.category.findMany({});

  return (
    <div className=" bg-stone-50">
      <h1 className="w-full pb-6 text-center text-2xl font-bold text-stone-500 sm:text-4xl">
        Choose a Category
      </h1>
      <CategorySection categoryList={categories} />
    </div>
  );
}

export default OrganizationPage;
