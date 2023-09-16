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
import React from "react";
import { twMerge } from "tailwind-merge";

export const NEW_ORG_URL = "/admin/org/new";

export function NewOrganizationForm() {
  const createOrganization = api.organization.create.useMutation();

  type CreateOrg = Parameters<typeof createOrganization.mutate>[0];

  const [formData, setFormData] = React.useState<Partial<CreateOrg>>();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData) return;

    const { category, name, description } = formData;

    if (category === undefined || category === null) return;
    if (name === undefined || name === null) return;

    if (description === undefined || description === null) return;

    createOrganization.mutate({ ...formData, category, name, description });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <h1 className="pb-3 text-2xl ">Edit Organization</h1>
      <form
        className="grid-rows-auto grid grid-cols-1 gap-x-6 md:grid-cols-4"
        onSubmit={handleSubmit}
      >
        <FormItemWrapper>
          <label
            className="text-sm font-light lowercase text-stone-600"
            htmlFor="name"
          >
            Name
          </label>
          <input
            className="text-bold rounded border border-stone-200 p-2 text-xl"
            type="text"
            name="name"
            id="name"
            onChange={handleChange}
          />
        </FormItemWrapper>
        <FormItemWrapper className=" min-h-[170px] md:row-span-4">
          <label
            className="text-sm font-light lowercase text-stone-600 "
            htmlFor="description"
          >
            Description
          </label>
          <textarea
            className="text-bold h-full rounded border border-stone-200 p-2"
            name="description"
            id="description"
            onChange={handleChange}
          ></textarea>
        </FormItemWrapper>
        <FormItemWrapper>
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
          />
        </FormItemWrapper>
        <FormItemWrapper>
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
          />
        </FormItemWrapper>
        <FormItemWrapper>
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
          />
        </FormItemWrapper>
        <FormItemWrapper>
          <label
            className="text-sm font-light lowercase text-stone-600"
            htmlFor="category"
          >
            Category
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
        <FormItemWrapper>
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
        <FormItemWrapper className="">
          <label
            className="text-sm font-light lowercase text-stone-600"
            htmlFor="exclusive-to-communities"
          >
            Exclusive to Communities
          </label>
          <CommunitySelect
            title=""
            onChange={(value) => {
              if (!value)
                return setFormData({
                  ...formData,
                  exclusiveToCommunities: [],
                });

              const newTags = (value as CategorySelectItem[]).map(
                (x) => x.value
              );

              if (
                formData === undefined ||
                formData.exclusiveToCommunities === undefined ||
                formData.exclusiveToCommunities === null
              )
                return setFormData({
                  ...formData,
                  exclusiveToCommunities: newTags,
                });

              const oldTags = formData.exclusiveToCommunities.map((x) =>
                x.trim()
              );

              setFormData({ ...formData, exclusiveToCommunities: newTags });
            }}
            value={
              formData?.exclusiveToCommunities
                ? formData.exclusiveToCommunities.map((x) => ({
                    label: x,
                    value: x,
                  }))
                : []
            }
          />
        </FormItemWrapper>
        <FormItemWrapper>
          <label
            className="text-sm font-light lowercase text-stone-600"
            htmlFor="helpful-for-communities"
          >
            Helpful to Communities
          </label>
          <CommunitySelect
            title=""
            onChange={(value) => {
              if (!value)
                return setFormData({ ...formData, helpfulToCommunities: [] });

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
            value={
              formData?.helpfulToCommunities?.map((x) => ({
                label: x,
                value: x,
              })) || undefined
            }
          />
        </FormItemWrapper>

        <button className="col-span-1  rounded bg-rose-500 p-2 text-white md:col-span-2">
          Submit
        </button>
      </form>
    </>
  );
}

export function NewOrgButton ({className, ...props}: {
  className?: string,
  props?: React.ComponentProps<typeof Link>
} ){
  const admin = useUserStore((state) => state.admin);
  
  return (
    admin ? <Link
      {...props}
      href={NEW_ORG_URL}
      className={twMerge("bg-rose-500 text-white text-center rounded py-2 px-4 text-sm font-bold w-full", className || '') }
    >
      Add New Organization
    </Link> : null
  );
}
