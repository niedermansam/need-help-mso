"use client";
import { FormItemWrapper } from "@/app/_components/FormItemWrapper";
import {
  CategorySelect,
  type CategorySelectItem,
  CommunitySelect,
  TagSelect,
  getValidSingleValue,
} from "@/components/Selectors";
import { api } from "@/utils/api";
import { useUserStore } from "@/utils/userStore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { twMerge } from "tailwind-merge";

export const NEW_ORG_URL = "/admin/org/new";

const DEFAULT_CITY = "Missoula"
const DEFAULT_STATE = "MT"
const DEFAULT_ZIP = "59801"

const DEFAULT_OBJECT = {
  city: DEFAULT_CITY,
  state: DEFAULT_STATE,
  zip: DEFAULT_ZIP,
} as const


export function NewOrganizationForm() {
  const router = useRouter()
  const createOrganization = api.organization.create.useMutation({
    onSuccess: (data) => {
      if (!data) return;
      router.push("/admin/org/" + data.id);
    }

  });

  type CreateOrg = Parameters<typeof createOrganization.mutate>[0];

  const submitIsDisabled = (formData: Partial<CreateOrg>) => {
    const { category, name, description } = formData;

    if (category === undefined || category === null) return true;
    if (name === undefined || name === null) return true;

    if (description === undefined || description === null) return true;

    return false;
  };


  const [formData, setFormData] = React.useState<Partial<CreateOrg>>(DEFAULT_OBJECT);

  const [exclusiveToCommunities, setExclusiveToCommunities] = React.useState<{
    value: string;
    label: string;
  }>();

  const [helpfulToCommunities, setHelpfulToCommunities] = React.useState<{
    value: string;
    label: string;
  }>();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData) return;

    const { category, name, description, email } = formData;

    const sanitizedEmail = email === "" ? undefined : email;


    if (category === undefined || category === null) return;
    if (name === undefined || name === null) return;

    if (description === undefined || description === null) return;

    createOrganization.mutate({ ...formData, category, name, description, email: sanitizedEmail });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <h1 className="pb-3 text-2xl ">Add Organization</h1>
      <form
        className="grid-rows-auto grid grid-cols-1 gap-x-6 md:grid-cols-4"
        onSubmit={handleSubmit}
      >
        <FormItemWrapper>
          <label className="text-sm lowercase text-stone-600" htmlFor="name">
            Name*
          </label>
          <input
            className="text-bold rounded border border-stone-200 p-2 text-xl"
            type="text"
            name="name"
            id="name"
            onChange={handleChange}
            value={formData?.name || ""}
          />
        </FormItemWrapper>

        <div className=" col-span-1 flex min-h-[170px]  flex-col sm:col-span-2 md:row-span-4">
          <label
            className="text-sm lowercase text-stone-600 "
            htmlFor="description"
          >
            Description*
          </label>
          <textarea
            className="text-bold h-full rounded border border-stone-200 p-2"
            name="description"
            id="description"
            onChange={handleChange}
            value={formData?.description || ""}
          ></textarea>
        </div>
        <FormItemWrapper>
          <label
            className="text-sm lowercase text-stone-600"
            htmlFor="category"
          >
            Category*
          </label>
          <CategorySelect
            onChange={(newValue) => {
              const newValueString = getValidSingleValue(newValue);
              setFormData((prev) => ({ ...prev, category: newValueString }));
            }}
            title=""
            value={
              formData && formData.category
                ? {
                    value: formData.category,
                    label: formData.category,
                  }
                : []
            }
          />
        </FormItemWrapper>
        <FormItemWrapper className="col-span-2 md:col-span-1">
          <label
            className="text-sm font-light lowercase text-stone-600"
            htmlFor="phone"
          >
            Phone
          </label>
          <input
            type="text"
            name="phone"
            id="phone"
            className="text-bold rounded border border-stone-200 p-2 "
            onChange={handleChange}
            value={formData?.phone || ""}
          />
        </FormItemWrapper>
        <FormItemWrapper className="md:col-span-1 ">
          <label
            className="text-sm font-light lowercase text-stone-600"
            htmlFor="email"
          >
            Email
          </label>

          <input
            type="text"
            name="email"
            id="email"
            className="text-bold rounded border border-stone-200 p-2 "
            onChange={handleChange}
            value={formData?.email || ""}
          />
        </FormItemWrapper>
        <FormItemWrapper className="col-span-2 md:col-span-1">
          <label
            className="text-sm font-light lowercase text-stone-600"
            htmlFor="website"
          >
            Website
          </label>
          <input
            type="text"
            name="website"
            className="text-bold rounded border border-stone-200 p-2 "
            id="website"
            onChange={handleChange}
            value={formData?.website || ""}
          />
        </FormItemWrapper>
        <FormItemWrapper className="flex w-full flex-row">
          <FormItemWrapper className="w-6/12">
            <label
              className="text-sm font-light lowercase text-stone-600"
              htmlFor="address"
            >
              Address
            </label>
            <input
              type="text"
              name="address"
              className="text-bold rounded border border-stone-200 p-2 "
              id="address"
              value={formData?.address || ""}
              onChange={handleChange}
            />
          </FormItemWrapper>
          <FormItemWrapper className="w-1/12">
            <label
              className="text-sm font-light lowercase text-stone-600"
              htmlFor="apt"
            >
              Suite
            </label>
            <input
              type="text"
              name="apt"
              className="text-bold rounded border border-stone-200 p-2 "
              id="apt"
              value={formData?.apt || ""}
              onChange={handleChange}
            />
          </FormItemWrapper>
          <FormItemWrapper className="w-2/12">
            <label
              className="text-sm font-light lowercase text-stone-600"
              htmlFor="city"
            >
              City
            </label>
            <input
              type="text"
              name="city"
              className="text-bold rounded border border-stone-200 p-2 "
              id="city"
              value={formData?.city || ""}
              onChange={handleChange}
            />
          </FormItemWrapper>
          <FormItemWrapper className="w-1/12">
            <label
              className="text-sm font-light lowercase text-stone-600"
              htmlFor="state"
            >
              State
            </label>
            <input
              type="text"
              name="state"
              className="text-bold rounded border border-stone-200 p-2 "
              id="state"
              value={formData?.state || ""}
              onChange={handleChange}
            />
          </FormItemWrapper>
          <FormItemWrapper className="w-2/12">
            <label
              className="text-sm font-light lowercase text-stone-600"
              htmlFor="zip"
            >
              Zip
            </label>
            <input
              type="text"
              name="zip"
              className="text-bold rounded border border-stone-200 p-2 "
              id="zip"
              value={formData?.zip || ""}
              onChange={handleChange}
            />
          </FormItemWrapper>
        </FormItemWrapper>
        <FormItemWrapper className="col-span-2">
          <label
            className="text-sm font-light lowercase text-stone-600"
            htmlFor="tags"
          >
            Tags
          </label>
          <TagSelect
            title=""
            onChange={(value) => {
              if (!value) return setFormData({ ...formData, tags: [] });

              const newTags = (value as CategorySelectItem[]).map(
                (x) => x.value
              );

              if (formData?.tags === undefined || formData.tags === null)
                return setFormData({ ...formData, tags: newTags });

              setFormData({ ...formData, tags: newTags });
            }}
            value={
              formData?.tags
                ? formData.tags.map((x) => ({ label: x, value: x }))
                : []
            }
          />
        </FormItemWrapper>
        <FormItemWrapper className="col-span-2">
          <label
            className="text-sm font-light lowercase text-stone-600"
            htmlFor="exclusive-to-communities"
          >
            Exclusive to Communities
          </label>
          <CommunitySelect
            title=""
            onChange={(value) => {
              if (!value) {
                setExclusiveToCommunities(undefined);
                return setFormData({
                  ...formData,
                  exclusiveToCommunities: [],
                });
              }

              setExclusiveToCommunities(value as CategorySelectItem);

              const newTagIds = (value as CategorySelectItem[]).map(
                (x) => x.value
              );

              if (
                formData === undefined ||
                formData.exclusiveToCommunities === undefined ||
                formData.exclusiveToCommunities === null
              )
                return setFormData({
                  ...formData,
                  exclusiveToCommunities: newTagIds,
                });

              setFormData({ ...formData, exclusiveToCommunities: newTagIds });
            }}
            value={exclusiveToCommunities}
          />
        </FormItemWrapper>
        <FormItemWrapper className="col-span-2 ">
          <label
            className="text-sm font-light lowercase text-stone-600"
            htmlFor="helpful-for-communities"
          >
            Helpful to Communities
          </label>
          <CommunitySelect
            title=""
            onChange={(value) => {
              if (!value) {
                setHelpfulToCommunities(undefined);
                return setFormData({ ...formData, helpfulToCommunities: [] });
              }

              setHelpfulToCommunities(value as CategorySelectItem);

              const newTags = (value as CategorySelectItem[]).map(
                (x) => x.value
              );

              if (
                formData === undefined ||
                formData.helpfulToCommunities === undefined ||
                formData.helpfulToCommunities === null
              )
                return setFormData({
                  ...formData,
                  helpfulToCommunities: newTags,
                });

              setFormData({ ...formData, helpfulToCommunities: newTags });
            }}
            value={helpfulToCommunities}
          />
        </FormItemWrapper>

        <button
          disabled={submitIsDisabled(formData)}
          className={twMerge(
            "col-span-1 rounded p-2 text-white md:col-span-full",
            submitIsDisabled(formData) ? "bg-stone-500" : "bg-rose-500"
          )}
        >
          Submit
        </button>
        <p className="font-light text-stone-600">*required</p>
      </form>
    </>
  );
}

export function NewOrgButton({
  className,
  ...props
}: {
  className?: string;
  props?: React.ComponentProps<typeof Link>;
}) {
  const admin = useUserStore((state) => state.admin);

  return admin ? (
    <Link
      {...props}
      href={NEW_ORG_URL}
      className={twMerge(
        "w-full rounded bg-rose-500 px-4 py-2 text-center text-sm font-bold text-white",
        className || ""
      )}
    >
      Add New Organization
    </Link>
  ) : null;
}
