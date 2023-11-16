"use client";

import React from "react";
import type { OrganizationFormProps } from "../../app/admin/org/[id]/page";
import {
  CategorySelect,
  type CategorySelectItem,
  CommunitySelect,
  TagSelect,
  getValidSingleValue,
} from "@/components/old/Selectors";
import { api } from "@/utils/api";
import { FormItemWrapper } from "@/components/FormItemWrapper";
import Link from "next/link";
import ReactModal from "react-modal";
import { twMerge } from "tailwind-merge";
import { useRouter } from "next/navigation";
import { useUserStore, userHasPermission } from "@/utils/userStore";

export function UpdateOrganizationForm({
  org,
}: {
  org: OrganizationFormProps;
}) {
  const editOrganization = api.organization.update.useMutation();
  const disconnectTag = api.organization.disconnectTag.useMutation();

  const updateAdminVerified =
    api.organization.updateAdminVerified.useMutation();


  type MutationOptions = Parameters<typeof editOrganization.mutate>;

  type FormValues = MutationOptions[0];
  const [formData, setFormData] = React.useState<FormValues>({
    id: org.id,
    adminVerified: org.adminVerified,
  });

  const [exclusiveToCommunities, setExclusiveToCommunities] = React.useState<
    {
      label: string;
      value: string;
    }[]
  >(
    org.exclusiveToCommunities.map((x) => ({
      label: x.name,
      value: x.id,
    }))
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    editOrganization.mutate({
      ...formData,
      exclusiveToCommunities: exclusiveToCommunities.map((x) => {
        return {
          id: x.value,
          name: x.label,
        };
      }),
      adminVerified: !!formData.adminVerified,
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
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
          <div className="flex gap-1">
            <input
              type="text"
              name="website"
              className="text-bold w-5/6 rounded border border-stone-200 p-2"
              id="website"
              defaultValue={org.website || ""}
              onChange={handleChange}
            />{" "}
            {org.website && (
              <Link
                target="_blank"
                className="flex items-center justify-center rounded bg-stone-300 px-2 text-center text-xs"
                href={org.website}
              >
                Visit Site
              </Link>
            )}
          </div>
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
              }[];
              if (!newValue) {
                setExclusiveToCommunities([]);
                return setFormData({ ...formData, exclusiveToCommunities: [] });
              }

              setExclusiveToCommunities(newValue);

              setFormData({
                ...formData,
                exclusiveToCommunities: newValue.map((x) => {
                  return {
                    id: x.value,
                    name: x.label,
                  };
                }),
              });
            }}
            value={exclusiveToCommunities}
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
              {
                const newValue = value as {
                  label: string;
                  value: string;
                }[];
                if (!newValue) {
                  return setFormData({ ...formData, helpfulToCommunities: [] });
                }

                setFormData({
                  ...formData,
                  helpfulToCommunities: newValue.map((x) => {
                    return {
                      id: x.value,
                      name: x.label,
                    };
                  }),
                });
              }
            }}
            value={
              formData.helpfulToCommunities
                ? formData.helpfulToCommunities.map((x) => ({
                    label: x.name,
                    value: x.id,
                  }))
                : org.helpfulToCommunities.map((x) => ({
                    label: x.name,
                    value: x.id,
                  }))
            }
          />
        </FormItemWrapper>

        <button className="col-span-1  rounded bg-rose-500 p-2 text-white md:col-span-2">
          Submit
        </button>
        <DeleteOrganizationButton orgId={org.id} />
        <FormItemWrapper className="flex flex-row">
          <input
            type="checkbox"
            name="adminVerified"
            onChange={(e) => {
              setFormData((prev) => ({
                ...prev,
                adminVerified: e.target.checked,
              }));
              updateAdminVerified.mutate({
                orgId: org.id,
                adminVerified: e.target.checked,
              });
            }}
            checked={formData.adminVerified}
          />
          <label
            className="text-sm font-light lowercase text-stone-600"
            htmlFor="adminVerified"
          >
            Verified by Admin
          </label>
        </FormItemWrapper>
      </form>
    </>
  );
}

export function DeleteOrganizationButton({ orgId }: { orgId: string }) {
  const router = useRouter();
  const userRole = useUserStore((state) => state.role);

  const hasPermission = userHasPermission(userRole, "ADMIN")

  const deleteOrganization = api.organization.delete.useMutation({
    onSuccess: () => {
      router.push("/admin/to-check");
    },
  });
  const [isOpen, setIsOpen] = React.useState(false);
  const [confirmString, setConfirmString] = React.useState("");
  const handleDelete = () => {
    if (!orgId) return;

    deleteOrganization.mutate({ orgId: orgId, confirmString });
  };

  const deleteButtonActive = (confirmString: string) =>
    confirmString.toLowerCase().trim() === "confirm";

  if (!hasPermission) return null;
  

  return (
    <>
      <button
        className="rounded bg-rose-500 p-2 text-white my-4"
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(true);
        }}
      >
        Delete Organization
      </button>
      <ReactModal
        className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2
      transform flex-col gap-4 rounded bg-white p-4"
        overlayClassName={twMerge(
          "fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50"
        )}
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
      >
        <div className="flex flex-col gap-4">
          <p>Are you sure you want to delete this organization?</p>
          <p>This action cannot be undone.</p>
          <p>Type the word &quot;confirm&quot; to continue</p>
          <input
            type="text"
            value={confirmString}
            onChange={(e) => setConfirmString(e.target.value)}
            className="rounded border border-stone-200 p-2"
          />
          <button
            className={twMerge(
              "rounded bg-rose-500 p-2 text-white",
              deleteButtonActive(confirmString) ? "bg-rose-500" : "bg-stone-300"
            )}
            onClick={handleDelete}
            disabled={!deleteButtonActive(confirmString)}
          >
            Delete
          </button>
        </div>
      </ReactModal>
    </>
  );
}
