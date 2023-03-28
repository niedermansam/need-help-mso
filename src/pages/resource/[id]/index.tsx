import { useRouter } from "next/router";
import { api } from "../../../utils/api";
import NavBar from "../../../components/Nav";
import Link from "next/link";
import OptionalLink from "../../../components/OptionalLink";

export default function ResourcePage() {
  const router = useRouter();
  const { id } = router.query;
  const { data, error } = api.resource.getById.useQuery(id as string);

  if (error) {
    return <div>failed to load</div>;
  }
  if (!data) {
    return <div>loading...</div>;
  }

  return (
    <div>
      <NavBar />
      <div className="px-6 pt-16">
        <Link href={`/org/${data.organizationId}`}>
          <h2 className="text-xl font-light">{data.organization.name}</h2>
        </Link>
        <h1 className="text-3xl font-light">{data.name}</h1>
        <Link
          className="font-bold"
          href={`/cat/${encodeURI(
            data.categoryMeta.category.replaceAll(" ", "_")
          )}`}
        >
          {data.categoryMeta.category}
        </Link>
        <div>
          {data.tags.map((tag) => (
            <p className="bg-gray-100" key={tag.tag}>
              {tag.tag}
            </p>
          ))}
        </div>
        <p>{data.description}</p>
        <OptionalLink href={data.url}>{data.url}</OptionalLink>
        {data.url ? <Link href={data.url}>Official Website</Link> : null}
        <Link href={`/resource/${data.id}/edit`}>
          <p>edit</p>
        </Link>
      </div>
    </div>
  );
}
