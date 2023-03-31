import type { GetServerSideProps, InferGetServerSidePropsType } from "next/types";
import NavBar from "../../components/Nav";
import { api } from "../../utils/api";
import { decodeTag, encodeTag } from "../../utils/manageUrl";
import { trimString } from "../../utils";
import { OrganizationItem } from "../org";

export default function TagPage({tag}:InferGetServerSidePropsType<typeof getServerSideProps>) {

    const { data } = api.tag.getResources.useQuery({tag});

    
  return (
    <div>
      <NavBar />
      <h1 className="pt-20 capitalize">Tag: {decodeTag(tag)}</h1>
      <div>
        {data && data?.resources.map((resource) => {
          return (
            <div key={resource.id}>
              <h2>{resource.name}</h2>
              <p>{trimString(resource.description,25)}</p>
            </div>
          );
        }) }
      </div>
      <div>
        {data && data?.organizations.map((org) => {
          return (
            <OrganizationItem org={org} key={org.id} admin={false} />)})}
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
