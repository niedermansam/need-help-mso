import type { GetServerSideProps, InferGetServerSidePropsType } from "next/types";
import NavBar from "../../components/Nav";
import { api } from "../../utils/api";
import { decodeTag, encodeTag } from "../../utils/manageUrl";
import { trimString } from "../../utils";
import { OrganizationItem } from "../org";
import { ResourceItem } from "../resource";

export default function TagPage({tag}:InferGetServerSidePropsType<typeof getServerSideProps>) {

    const { data } = api.tag.getResources.useQuery({tag});

    
  return (
    <div className="text-stone-700">
      <NavBar />
      <h1 className="mx-6 mb-4 pt-20 text-4xl font-extrabold capitalize">
        Tag: {decodeTag(tag)}
      </h1>
      <div>
        <h2 className="mx-6 -mb-4 text-2xl font-extrabold text-stone-500">
          Resources
        </h2>
        {data &&
          data?.resources.map((resource) => {
            return <ResourceItem resource={resource} key={resource.id} />;
          })}
      </div>
      <div>
        <h2 className="mx-6 -mb-3 text-2xl font-extrabold text-stone-500">
          Organizations
        </h2>
        {data &&
          data?.organizations.map((org) => {
            return <OrganizationItem org={org} key={org.id} admin={false} />;
          })}
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps: GetServerSideProps<{tag: string}> = async (context) => {
  const { query } = context;
  
  // check the query has a tag and that it is a string
    if (!query.tag || typeof query.tag !== "string") {
        return {
            notFound: true,

        };
    }

    const tag = encodeTag(query.tag) ;

    console.log(tag)



     
  return {
    props: {
      tag: tag,
    },
  };
};
