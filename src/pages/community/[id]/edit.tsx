import type { GetServerSideProps, InferGetServerSidePropsType } from "next/types";
import NavBar from "../../../components/Nav";
import { getSession } from "next-auth/react";
import { prisma } from "../../../server/db";
import type { Community } from "@prisma/client";
import { useState } from "react";
import {
  CommunitySelect,
  getValidMultivalueArray,
} from "../../../components/Selectors";
import { api } from "../../../utils/api";

export default function EditCommunityPage({
  community,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [name, setName] = useState(community.name);
  const [id, setId] = useState(community.id);

  const updateCommunity = api.community.update.useMutation()
    


  const [parentCommunities, setParentCommunities] = useState(
    community.parentCommunities
  );
  console.log(parentCommunities)
  const [subCommunities, setSubCommunities] = useState(
    community.subCommunities
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();


    updateCommunity.mutate({
      id: id,
      name: name,
      parentCommunityIds: parentCommunities.map((community) => community.id),
      subCommunityIds: subCommunities.map((community) => community.id),
    })

  }
  
  return (
    <div>
      <NavBar />
      <h1 className="pt-12 text-4xl font-bold text-gray-700">Edit Community</h1>
      <form 
      onSubmit={handleSubmit}
      className="flex flex-col space-y-4">
        <label htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          type="text"
          className="rounded-md border border-gray-300"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label htmlFor="id">ID</label>
        <input
          id="id"
          name="id"
          type="text"
          className="rounded-md border border-gray-300"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
        <CommunitySelect
          id="parentCommunities"
          title="Parent Communities"
          name="parentCommunities"
          value={parentCommunities.map((community) => {
            return { label: community.name, value: community.id };
          })}
          onChange={(value) => {
            


            // disconnect communities that were removed 

            



            if (!value) return setParentCommunities([]);
            const newSelectValueArray = getValidMultivalueArray(value);

            const newCommunityArray = newSelectValueArray.map((community) => {
              return { id: community.value, name: community.label };
            });

            setParentCommunities(newCommunityArray);
          }}
        />
        <CommunitySelect
          id="subCommunities"
          title="Sub Communities"
          name="subCommunities"
          value={subCommunities.map((community) => {
            return { label: community.name, value: community.id };
          })}
          onChange={(value) => {

            if (!value) return setSubCommunities([]);
            const newSelectValueArray = getValidMultivalueArray(value);

            const newCommunityArray = newSelectValueArray.map((community) => {
              return { id: community.value, name: community.label };
            });

            setSubCommunities(newCommunityArray);
          }}
        />
        <button
          type="submit"
          className="px-4 py-2 text-white bg-blue-500 rounded-md"
        >
          Submit
        </button>

      </form>
    </div>
  );
}

type CommunityPick = Pick<Community, "name" | "id">;

type ServerSideProps = {
  community: CommunityPick & {
    parentCommunities: CommunityPick[];
    subCommunities: CommunityPick[];
  };
};

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async (
  context
) => {
  const session = await getSession(context);

  const communityId = context.params?.id as string;

  const isAdmin = session && session.user?.admin;

  if (!isAdmin) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const community = await prisma.community.findUnique({
    where: {
      id: communityId,
    },
    select: {
      id: true,
      name: true,
      description: true,
      parentCommunities: {
        select: {
          id: true,
          name: true,
        },
      },
      subCommunities: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!community) {
    return {
      notFound: true,
    };
  }

  return {
    props: { community },
  };
};
