import { useState } from "react";
import NavBar from "../../components/Nav";
import { api } from "../../utils/api";
import type { Organization } from "@prisma/client";
import Link from "next/link";

export type OrganizationProps = {
  name: string;
  description: string;
  url: string;
  email: string;
  phone: string;
  category: string;
  tags: string[];
};

function CreateOrganizationForm() {
  const INITIAL_STATE:OrganizationProps = {
    name: "",
    description: "",
    url: "",
    email: "",
    phone: "",
    category: "",
    tags: [],
  };

  const [formData, setFormData] = useState(INITIAL_STATE);
  const addOrg = api.organization.create.useMutation({
    onSuccess: () => setFormData({...INITIAL_STATE, category: formData.category}),
  });
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
          value={formData.url}
          onChange={(e) =>
            setFormData({ ...formData, url: e.target.value })
          }
        />
        <label htmlFor="email">Email</label>
        <input
          type="text"
          name="email"
          id="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <label htmlFor="phone">Phone</label>
        <input
          type="text"
          name="phone"
          id="phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
        <label htmlFor="category">Category</label>
        <input
          type="text"
          name="category"
          id="category"
          value={formData.category}
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
          onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(",") })}
        />
        <button type="button" onClick={() => addOrg.mutate({...formData, tags: formData.tags.map(x => x.trim())})}>
          Submit
        </button>
      </form>
    </div>
  );
}

function OrganizationCard({ org }: { org: Organization }) {
  return (
    <div className="m-6 w-80 max-w-sm border border-gray-200 p-6">
      <Link href={`/org/${org.id}`}>
        {" "}
        <h2 className="text-xl">{org.name}</h2>
      </Link>
      <p>{org.description}</p>
    </div>
  );
}

export default function OrganizationsPage() {
  const { data: orgs } = api.organization.getAll.useQuery();
  return (
    <div>
      <NavBar />
      <CreateOrganizationForm />
      <div className="flex flex-wrap">
        {orgs?.map((org) => (
          <OrganizationCard key={org.id} org={org} />
        ))}
      </div>
    </div>
  );
}
