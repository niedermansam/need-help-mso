"use client";
import React from "react";
import type { OrganizationFormProps } from "../page";
import { FormItemWrapper } from "@/app/_components/FormItemWrapper";
import { twMerge } from "tailwind-merge";
import { api } from "@/utils/api";

export type LocationArray = Pick<OrganizationFormProps, "locations">;
export type SingleLocation = LocationArray["locations"][0];


const DEFAULT_CITY = "Missoula";
const DEFAULT_STATE = "MT";
const DEFAULT_ZIP = "59801";

export const DEFAULT_LOCATION = {
  city: DEFAULT_CITY,
  state: DEFAULT_STATE,
  zip: DEFAULT_ZIP,
} as const;


function UpdateLocationForm({
  location,
}: {
  location: LocationArray["locations"][0];
}) {

  const updateLocation = api.organization.updateLocation.useMutation();

  const [formData, setFormData] = React.useState<Partial<SingleLocation>>({
    ...location,
  });

  const [hasChanged, setHasChanged] = React.useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setHasChanged(true);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const { name, address, apt, city, state, zip } = formData;
    if (!address || address.length < 2 || !city || !state || !zip) {
      return;
    }
    const newFormData = {
      locationid: location.id,
      name: name || undefined,
      address,
      apt: apt || undefined,
      city,
      state,
      zip,
    };

    updateLocation.mutate(newFormData);
    setHasChanged(false);
  }

  return (
    <form className="flex items-center justify-center gap-1" onSubmit={handleSubmit}>
      <FormItemWrapper>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          className="rounded border border-stone-200 p-2"
          name="name"
          value={formData.name || ""}
          onChange={handleChange}
        />
      </FormItemWrapper>

      <FormItemWrapper>
        <label htmlFor="address">Address</label>
        <input
          type="text"
          className="rounded border border-stone-200 p-2"
          name="address"
          value={formData.address || ""}
          onChange={handleChange}
        />
      </FormItemWrapper>

      <FormItemWrapper>
        <label htmlFor="apt">Apt</label>
        <input
          type="text"
          name="apt"
          className="rounded border border-stone-200 p-2"
          value={formData.apt || ""}
          onChange={handleChange}
        />
      </FormItemWrapper>
      <FormItemWrapper>
        <label htmlFor="city">City</label>
        <input
          type="text"
          name="city"
          className="rounded border border-stone-200 p-2"
          value={formData.city || ""}
          onChange={handleChange}
        />
      </FormItemWrapper>

      <FormItemWrapper>
        <label htmlFor="state">State</label>
        <input
          className="rounded border border-stone-200 p-2"
          type="text"
          name="state"
          value={formData.state || ""}
          onChange={handleChange}
        />
      </FormItemWrapper>

      <FormItemWrapper>
        <label htmlFor="zip">Zip</label>
        <input
          className="rounded border border-stone-200 p-2"
          type="text"
          name="zip"
          value={formData.zip || ""}
          onChange={handleChange}
        />
      </FormItemWrapper>
      <button
        className={twMerge(
          "mt-6 h-full rounded px-4 py-2 text-white",
          hasChanged ? "bg-rose-500" : "bg-stone-500"
        )}
        type="submit"
      >
        Submit
      </button>
    </form>
  );
}

function CreateLocationForm({orgId}: {
  orgId: string;
}) { 

  const createLocation = api.organization.createLocation.useMutation();

  const [formData, setFormData] = React.useState<Partial<SingleLocation>>({
    orgId: orgId,
    ...DEFAULT_LOCATION
  });



  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const { name, address, apt, city, state, zip } = formData;
    if (!address || address.length < 2 || !city || !state || !zip) {
      return;
    }
    const newFormData = {
      orgId,
      name: name || undefined,
      address,
      apt: apt || undefined,
      city,
      state,
      zip,
    };

    createLocation.mutate(newFormData);
  }

  return (
    <form className="flex items-center justify-center gap-1" onSubmit={handleSubmit}>
      <FormItemWrapper>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          className="rounded border border-stone-200 p-2"
          name="name"
          value={formData.name || ""}
          onChange={handleChange}
        />
      </FormItemWrapper>

      <FormItemWrapper>
        <label htmlFor="address">Address</label>
        <input
          type="text"
          className="rounded border border-stone-200 p-2"
          name="address"
          value={formData.address || ""}
          onChange={handleChange}
        />
      </FormItemWrapper>

      <FormItemWrapper>
        <label htmlFor="apt">Apt</label>
        <input
          type="text"
          name="apt"
          className="rounded border border-stone-200 p-2"
          value={formData.apt || ""}
          onChange={handleChange}
        />
      </FormItemWrapper>
      <FormItemWrapper>
        <label htmlFor="city">City</label>
        <input
          type="text"
          name="city"
          className="rounded border border-stone-200 p-2"
          value={formData.city || ""}
          onChange={handleChange}
        />
      </FormItemWrapper>

      <FormItemWrapper>
        <label htmlFor="state">State</label>
        <input
          className="rounded border border-stone-200 p-2"
          type="text"
          name="state"
          value={formData.state || ""}
          onChange={handleChange}
        />
      </FormItemWrapper>

      <FormItemWrapper>
        <label htmlFor="zip">Zip</label>
        <input
          className="rounded border border-stone-200 p-2"
          type="text"
          name="zip"
          value={formData.zip || ""}
          onChange={handleChange}
        />
      </FormItemWrapper>
      <button
        className={twMerge(
          "mt-6 h-full rounded px-4 py-2 text-white",
          formData.address?.length && formData.address.length > 2 ? "bg-rose-500" : "bg-stone-500"
        )}
        type="submit"
      >
        Submit
      </button>
    </form>
  );

}

export function LocationFormSection({ locations, orgId }: LocationArray & {
  orgId: string;
}) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-stone-600">Current Locations</h2>
      {locations.map((location) => {
        return <UpdateLocationForm location={location} key={location.id} />;
      })}
      <h2 className="text-2xl font-bold text-stone-600 pt-12">Add New Location</h2>
      <CreateLocationForm orgId={orgId} />
      <p className="pt-4 text-sm font-light text-stone-600">Locations are automatically geocoded when a change is submitted.</p>
    </div>
  );
}
