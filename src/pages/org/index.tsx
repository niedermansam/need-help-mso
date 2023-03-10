import { useState } from "react";
import NavBar from "../../components/Navbar";
import { api } from "../../utils/api";
import { Organization } from "@prisma/client";
import Link from "next/link";

function CreateOrganizationForm() {
  const INITIAL_STATE = {
    name: "",
    description: "",
    website: "",
    email: "",
    phone: "",
    category: "",
  };

    const [formData, setFormData] = useState(INITIAL_STATE);
  return (
    <div className="max-w-md bg-gray-100 p-6 mx-6">
      <h1>Create Organization</h1>
        <form className="flex flex-col ">
            <label htmlFor="name">Name</label>
            <input type="text" name="name" id="name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            <label htmlFor="description">Description</label>
            <textarea name="description" id="description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            <label htmlFor="website">Website</label>
            <input type="text" name="website" id="website" value={formData.website} onChange={e => setFormData({...formData, website: e.target.value})} />
            <label htmlFor="email">Email</label>
            <input type="text" name="email" id="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            <label htmlFor="phone">Phone</label>
            <input type="text" name="phone" id="phone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
            <label htmlFor="category">Category</label>
            <input type="text" name="category" id="category" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
            <button type="button">Submit</button>
        </form>
    </div>
  );
}

function OrganizationCard({org}:{org: Organization}) {
  return <div className="max-w-sm w-80 border border-gray-200 p-6 m-6">
    <Link href={`/org/${org.id}`}> <h2 className="text-xl">{org.name}</h2></Link>
    <p>{org.description}</p>
  </div>
}

export default function OrganizationsPage() {
  const {data: orgs} = api.organization.getAll.useQuery()
  return (
    <div>
      <NavBar />
      <CreateOrganizationForm />
      <div className="flex flex-wrap">
      {
        orgs?.map(org => <OrganizationCard org={org} />)
      }
    </div></div>
  );
}
