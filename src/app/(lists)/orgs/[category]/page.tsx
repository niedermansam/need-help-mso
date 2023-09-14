import { BackButton } from '@/app/components/BackButton';
import { OrganizationCard } from '@/app/components/DisplayCard/server';
import { env } from '@/env.mjs';
import { prisma } from '@/server/db';
import React from 'react'

export async function generateStaticParams() {
    const categories = await fetch(`${env.NODE_ENV === "production" ? 'https://needhelpmissoula.org/api' : 'http://localhost:3000/api'}/categories`).then((res) => res.json()) as string[]
    const slugs = categories.map((category) => ({
        params: { category: category },
    }))

    return slugs
}

async function OrganizationByCategoryPage({params}: {params: {category: string}}) {

  const category = await prisma.category.findUnique({
    where: { slug: params.category },
    include: {
      organizations: 
      {
        include: {
          tags: true,
        }

      },
    }
  })

  if (!category) {
    return {
      notFound: true,
    }
  }



  return (
    <div>
      <h1 className="mb-6 text-4xl font-bold text-stone-700">
       <BackButton /> {category.category}
      </h1>
      {category.organizations.map((org) => (
        <OrganizationCard key={org.id} org={org} showDescription />
      ))}
    </div>
  );
}

export default OrganizationByCategoryPage;
