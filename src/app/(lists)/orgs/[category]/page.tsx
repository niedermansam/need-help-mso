import { BackButton } from '@/app/components/BackButton';
import { OrganizationCard } from '@/app/components/DisplayCard/server';
import { prisma } from '@/server/db';
import React from 'react'

export async function generateStaticParams() {
    const categories = await prisma.category.findMany({})

    const slugs = categories.map((category) => ({
        params: { category: category.slug },
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
