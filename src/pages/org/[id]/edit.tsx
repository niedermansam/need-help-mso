import { useState } from "react";
import { OrganizationProps } from "..";
import NavBar from "../../../components/Nav";
import { api } from "../../../utils/api";
import { useRouter } from "next/router";
import { Organization, Resource, Tag } from "@prisma/client";
import { CreateResourceForm } from "../../resource";

function CreateOrganizationForm({
  orgData,
}: {
  orgData: Organization & {
    resources: Resource[];
    tags: Tag[];
  };
}) {
  const { id, name, description, website, email, phone, category, tags } =
    orgData;
  const INITIAL_STATE = {
    id: id,
    name: name,
    description: description,
    website: website,
    email,
    phone,
    category,
    tags: tags.map((x) => x.tag),
  } as const;

  const [formData, setFormData] = useState({ ...INITIAL_STATE });
  const addOrg = api.organization.update.useMutation();
  return (
    <div className="mx-6 max-w-md bg-gray-100 p-6">
      <h1>Create Organization</h1>
      <form className="flex flex-col ">
        <label htmlFor="name">Name</label>
        <input
          type="text"
          name="name"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <label htmlFor="description">Description</label>
        <textarea
          name="description"
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
        <label htmlFor="website">Website</label>
        <input
          type="text"
          name="website"
          id="website"
          value={formData.website || ""}
          onChange={(e) =>
            setFormData({ ...formData, website: e.target.value })
          }
        />
        <label htmlFor="email">Email</label>
        <input
          type="text"
          name="email"
          id="email"
          value={formData.email || ""}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <label htmlFor="phone">Phone</label>
        <input
          type="text"
          name="phone"
          id="phone"
          value={formData.phone || ""}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
        <label htmlFor="category">Category</label>
        <input
          type="text"
          name="category"
          id="category"
          value={formData.category || ""}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
        />
        <label htmlFor="tags">Tags</label>
        <input
          type="text"
          name="tags"
          id="tags"
          value={formData.tags}
          onChange={(e) =>
            setFormData({ ...formData, tags: e.target.value.split(",") })
          }
        />
        <button
          type="button"
          onClick={() =>
            addOrg.mutate({
              ...INITIAL_STATE,
              ...formData,
              website: formData.website || undefined,
              tags: formData.tags.map((x) => x.trim()),
            })
          }
        >
          Submit
        </button>
      </form>
    </div>
  );
}
export default function EditOrgPage() {
  const resourceId = useRouter().query.id;
  const { data: orgData } = api.organization.getById.useQuery({
    id: resourceId as string,
  });
  return (
    <div>
      <NavBar />
      <p>Edit Organization</p>
      {orgData ? <CreateOrganizationForm orgData={orgData} /> : null}
      {orgData ? <CreateResourceForm orgId={orgData.id} /> : null}
    </div>
  );
}
