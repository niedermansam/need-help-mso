import { useRouter } from "next/router";
import { api } from "../../../utils/api";

export default function ResourcePage() {
  const router = useRouter();
  const { id } = router.query;
  const { data, error } = api.resource.getById.useQuery(id as string)

  if (error) {
    return <div>failed to load</div>;
  }
  if (!data) {
    return <div>loading...</div>;
  }

  return (
    <div>
      <h1>{data.name}</h1>
      <p>{data.description}</p>
      <p>{data.categoryMeta.category}</p>
      <p>{data.organization.name}</p>
      <p>{data.url}</p>
      <p>{data.tags.map((tag) => tag.tag).join(", ")}</p>
    </div>
  );
}