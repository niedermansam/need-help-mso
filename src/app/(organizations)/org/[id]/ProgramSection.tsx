"use client"
import React, { type Dispatch, type SetStateAction } from 'react'
import type { ProgramData } from './getOrgData'
import { ProgramCard } from '@/app/_components/DisplayCard/server'
import { twMerge } from 'tailwind-merge'
// import { useSearchParams, useRouter } from 'next/navigation'

function PaginatedProgramList({
  programs,
  organization,
  currentPage,
  setCurrentPage,
}: {
  programs: ProgramData;
  organization: {
    id: string;
    name: string;
    phone: string | null;
    email: string | null;
    website: string | null;
  };
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
}) {
  const programsPerPage = 3;

  const indexOfLastProgram = (currentPage + 1) * programsPerPage;
  const indexOfFirstProgram = indexOfLastProgram - programsPerPage;
  const currentPrograms = programs.slice(
    indexOfFirstProgram,
    indexOfLastProgram
  );

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(programs.length / programsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <>
      <div>
        <ul className="list-inside list-disc">
          {currentPrograms.map((program) => (
            <ProgramCard
              key={program.id}
              program={{ ...program, organization }}
            />
          ))}
        </ul>
      </div>
      <div className="mb-4 flex flex-row flex-wrap">
        <button
          className={twMerge(
            `mb-2 mr-2 rounded-md bg-stone-400 px-2 py-2 text-sm font-medium text-stone-600 shadow-sm `,
            currentPage !== 0 &&
              `bg-stone-300 hover:bg-rose-600 hover:text-white focus:ring-rose-500`
          )}
          onClick={() => setCurrentPage(0)}
          aria-disabled={currentPage === 0}
            disabled={currentPage === 0}
        >
          &laquo;
        </button>
        <button
          className={twMerge(
            `mb-2 mr-4 rounded-md bg-stone-400 px-2 py-2 text-sm font-medium text-stone-600 shadow-sm `,
            currentPage !== 0 &&
              `bg-stone-300 hover:bg-rose-600 hover:text-white focus:ring-rose-500`
          )}
          onClick={() => setCurrentPage(currentPage - 1)}
          aria-disabled={currentPage === 0}
          disabled={currentPage === 0}
        >
          &lsaquo;
        </button>

        {pageNumbers.map((pageNumber) => (
          <button
            key={pageNumber}
            className={twMerge(
              `mb-2 mr-2 rounded-md bg-stone-300 px-4 py-2 font-medium text-stone-600 shadow-sm hover:bg-rose-300 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2 `,
              currentPage === pageNumber - 1 &&
                `bg-rose-600 hover:bg-rose-700 focus:ring-rose-500 text-white`
            )}
            onClick={() => setCurrentPage(pageNumber - 1)}
          >
            {pageNumber}
          </button>
        ))}


        <button
          className={twMerge(
            `mb-2 mr-2 ml-4 rounded-md bg-stone-400 px-2 py-2 text-sm font-medium text-stone-600 shadow-sm `,
            currentPage !== pageNumbers.length - 1 &&
              `bg-stone-300 hover:bg-rose-600 hover:text-white focus:ring-rose-500`
          )}
          onClick={() => setCurrentPage(currentPage + 1)}
          aria-disabled={currentPage === pageNumbers.length - 1}
          disabled={currentPage === pageNumbers.length - 1}
        >
            &rsaquo;
        </button>
        <button
          className={twMerge(
            `mb-2 mr-2 rounded-md bg-stone-400 px-2 py-2 text-sm font-medium text-stone-600 shadow-sm `,
            currentPage !== pageNumbers.length - 1 &&
              `bg-stone-300 hover:bg-rose-600 hover:text-white focus:ring-rose-500`
          )}
          onClick={() => setCurrentPage(pageNumbers.length - 1)}
          aria-disabled={currentPage === pageNumbers.length - 1}
          disabled={currentPage === pageNumbers.length - 1}
        >
            &raquo;
        </button>
            
      </div>
    </>
  );
}

function ProgramSection({programs, organization}: {
    programs: ProgramData,
    organization: {
        id: string,
        name: string
        phone: string | null,
        email: string | null,
        website: string | null,    
    
    }
}) {

    //const router  = useRouter()
    // const searchParams = useSearchParams()

    //const category = searchParams?.get('category')
    //const page = parseInt( searchParams?.get('page') || '0')



    const categories = programs.map((program) => program.category)

    const uniqueCategories = [...new Set(categories)]

    const [currentCategory, setCurrentCategory] = React.useState<string | null>(
        'all'
    )


    const [currentPage, setCurrentPage] = React.useState(0);

    const handleCategoryChange = (category: string) => {
        setCurrentCategory(category)
        setCurrentPage(0)
    }

  return (
    <div>
        {programs.length > 0 && (
            <div className="mx-6">
              <h2 className="mt-12 mb-4 text-3xl font-bold text-stone-500">Programs</h2>
              {
                uniqueCategories.length > 1 && (
                    <div className="flex flex-row flex-wrap mb-4">
                        <button 
                            className={twMerge(`px-4 py-2 mr-2 mb-2 rounded-md shadow-sm font-medium text-white bg-stone-500 hover:bg-stone-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-500`, currentCategory === null && `bg-rose-600 hover:bg-rose-700 focus:ring-rose-500`, currentCategory === 
                            "all" && `bg-rose-600 hover:bg-rose-700 focus:ring-rose-500`)}
                            onClick={() => handleCategoryChange('all')}
                        >
                            All
                        </button>

                        {uniqueCategories.map((category) => (
                            <button
                                key={category}
                                className={twMerge(`px-4 py-2 mr-2 mb-2 rounded-md shadow-sm font-medium text-white bg-stone-500 hover:bg-stone-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-500`, currentCategory === category && `bg-rose-600 hover:bg-rose-700 focus:ring-rose-500`)}
                                onClick={() => handleCategoryChange(category)}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                )
              }
              <PaginatedProgramList programs={programs.filter((program) => program.category === currentCategory || currentCategory === "all")} organization={organization} currentPage={currentPage} setCurrentPage={setCurrentPage} />

            </div>
          )
}
    </div>
  )
}

export default ProgramSection