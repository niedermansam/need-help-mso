import { useRouter } from "next/router";
import NavBar from "../../components/Nav";
import { api } from "../../utils/api";
import Link from "next/link";

export default function OrganizationDetailsPage() {
  const { id: orgId } = useRouter().query;

  const { data: orgData } = api.organization.getById.useQuery({
    id: orgId as string,
  });

  if (!orgData) return <p>no data</p>;
  return (
    <div>
      <NavBar />
      <div className="p-2">
        <div className="m-4">
          <h1 className="pt-20 text-3xl">{orgData?.name}</h1>
          <p>{orgData.email}</p>
          <p>{orgData.phone}</p>
          <p>{orgData.description}</p>
        </div>
      </div>
      {orgData.resources.map((resource) => {
        return (
          <div key={resource.id} className="m-4 border border-gray-200 p-4">
            <Link href={`/resource/${resource.id}`}><h2>{resource.name}</h2></Link>
          </div>
        );
      })}
    </div>
  );
}
