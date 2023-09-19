"use client";

import React from "react";
import type { OrganizationFormProps } from "../../admin/org/[id]/page";
import {
  CategorySelect,
  type CategorySelectItem,
  CommunitySelect,
  TagSelect,
  getValidSingleValue,
} from "@/components/Selectors";
import { api } from "@/utils/api";
import { FormItemWrapper } from "../FormItemWrapper";

export function UpdateOrganizationForm({
  org,
}: {
  org: OrganizationFormProps;
}) {
  const editOrganization = api.organization.update.useMutation();
  const disconnectTag = api.organization.disconnectTag.useMutation();



  type MutationOptions = Parameters<typeof editOrganization.mutate>;

  type FormValues = MutationOptions[0];
  const [formData, setFormData] = React.useState<FormValues>({
    id: org.id,
  });

  const [exclusiveToCommunities, setExclusiveToCommunities] = React.useState<
    {
      label: string;
      value: string;
    }[]> (org.exclusiveToCommunities.map((x) => ({
      label: x.name,
      value: x.id,
      })))

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    editOrganization.mutate(formData);
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
            defaultValue={org.name}
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
            defaultValue={org.description}
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
            defaultValue={org.phone || ""}
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
            defaultValue={org.email || ""}
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
            defaultValue={org.website || ""}
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
            value={{
              value: formData.category || org.category,
              label: formData.category || org.category,
            }}
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

              if (formData.tags === undefined || formData.tags === null)
                return setFormData({ ...formData, tags: newTags });

              const oldTags = formData.tags.map((x) => x.trim());

              // check if any tags have been removed from oldTags
              const removedTags = oldTags.filter((x) => !newTags.includes(x));

              console.log(removedTags);

              if (removedTags.length > 0) {
                // remove the tags from the org
                removedTags.forEach((tag) => {
                  disconnectTag.mutate({ orgId: org.id, tag: tag });
                });
              }

              setFormData({ ...formData, tags: newTags });
            }}
            value={
              formData.tags
                ? formData.tags.map((x) => ({ label: x, value: x }))
                : org.tags.map((x) => ({ label: x.tag, value: x.tag }))
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
              const newValue = value as {
                label: string;
                value: string;
              }[]
              if (!newValue){
                setExclusiveToCommunities(
                  []
                )
                return setFormData({ ...formData, exclusiveToCommunities: [] });}

                setExclusiveToCommunities(newValue)
              const newTags = (newValue as CategorySelectItem[]).map(
                (x) => x.value
              );

              if (
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

              // check if any tags have been removed from oldTags
              const removedTags = oldTags.filter((x) => !newTags.includes(x));

              console.log(removedTags);

              if (removedTags.length > 0) {
                // remove the tags from the org
                removedTags.forEach((tag) => {
                  disconnectTag.mutate({ orgId: org.id, tag: tag });
                });
              }

              setFormData({ ...formData, exclusiveToCommunities: newTags });
            }}
            value={
              exclusiveToCommunities
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
                formData.helpfulToCommunities === undefined ||
                formData.helpfulToCommunities === null
              )
                return setFormData({
                  ...formData,
                  helpfulToCommunities: newTags,
                });

              const oldTags = formData.helpfulToCommunities.map((x) =>
                x.trim()
              );

              // check if any tags have been removed from oldTags
              const removedTags = oldTags.filter((x) => !newTags.includes(x));

              console.log(removedTags);

              if (removedTags.length > 0) {
                // remove the tags from the org
                removedTags.forEach((tag) => {
                  disconnectTag.mutate({ orgId: org.id, tag: tag });
                });
              }

              setFormData({ ...formData, helpfulToCommunities: newTags });
            }}
            value={
              formData.helpfulToCommunities
                ? formData.helpfulToCommunities.map((x) => ({
                    label: x,
                    value: x,
                  }))
                : org.helpfulToCommunities.map((x) => ({
                    label: x.name,
                    value: x.name,
                  }))
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
