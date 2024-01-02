import { Prettify } from "@/types/trpc";
import React from "react";
import { set } from "zod";

const testObject = {
    name: "test",
    description: "test",
    tags: ["test"],
    n: 1,
    m: 2,
    program: {
        name: "test",
        description: "test",
        tags: ["test"],
    }
}


type SearchWeights<T>  = {
    [K in keyof T]: T[K] extends string | string[] ? number : never;
};

type RecursiveSearchWeights<T> = {
    [K in keyof T]: T[K] extends Record<string, unknown> ? SearchWeights<T[K]> : 
    T[K] extends string | string[] ? number : never;
};

type test = Prettify< RecursiveSearchWeights<typeof testObject>>;


// type Searchable = SearchWeights<typeof testObject>;

const isString = (value: unknown): value is string => {
    return typeof value === "string";
}

const isStringArray = (value: unknown): value is string[] => {
    return Array.isArray(value) && value.every(isString);
}

const createSearchWeight = <T extends Record<string, unknown>>(
  objects: T[]
): RecursiveSearchWeights<T> => {
  const weights = {} as RecursiveSearchWeights<T>;
  for (const object of objects) {
    for (const key in object) {
      const value = object[key];
      if (isString(value)) {
        // @ts-expect-error - this is fine
        weights[key as keyof T] = 1;
      } else if (isStringArray(value)) {
        // @ts-expect-error - this is fine
        weights[key as keyof T] = 1;
      }
    }
  }
  return weights;
};


type SearchOptions<T> = {
    weights?: RecursiveSearchWeights<T>,
    defaultQuery?: string,
}

export default function useSearch<TSearchObject extends Record<string, unknown>>(
  toSearch: TSearchObject[],
    options?: SearchOptions<TSearchObject>

) {

    type SearchObjectWithWeights = TSearchObject & {weight?: number};
  
  const defaultQuery = options?.defaultQuery || "";

  const [results, _setResults] = React.useState<(TSearchObject & {weight?: number})[]>(toSearch);
  const [weights, setWeights] = React.useState<SearchOptions<TSearchObject>['weights']>(
    options?.weights || createSearchWeight(toSearch)
  );
  const [_query, setQuery] = React.useState<string>(defaultQuery);
  
    const deeplySort = (a: SearchObjectWithWeights, b: SearchObjectWithWeights) => {

        if (a?.weight && b?.weight) {
            return b.weight - a.weight;
        }
        return 0;
    }

    React.useEffect(() => {
        const newWeights = createSearchWeight(toSearch);
        setWeights(newWeights);
    }
    , [toSearch])

    React.useEffect(() => {
        const query = _query.toLowerCase();
        const newResults = toSearch.map((object) => {
            let weight = 0;
            for (const key in object) {
                const value = object[key];
                const keyWeight = weights ? weights[key as keyof TSearchObject] : 0;
                if (isString(value)) {

                    if (value.toLowerCase().includes(query))  weight += keyWeight as number;
                } else if (isStringArray(value)) {
                    if (value.some((item) => item.toLowerCase().includes(query)))  weight += keyWeight as number;
                }
            }
            return  {
                ...object,
                weight,
            };
        }).filter((result) => !!result  ).sort((a, b) => {
        

            if (a?.weight && b?.weight) {
                return b.weight - a.weight;
                }
                return 0;
                }
                );
        _setResults(newResults);
    }
    , [_query, weights, toSearch])






  return {
    results,
    query: _query,
    setQuery,
  };
}
