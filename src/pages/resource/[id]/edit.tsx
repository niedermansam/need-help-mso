import { useRouter } from "next/router";
import NavBar from "../../../components/Nav";
import {
  CategorySelect,
  type CategorySelectItem,
  TagSelect,
  CommunitySelect,
} from "../../../components/select";
import { api } from "../../../utils/api";
import { useState } from "react";

export default function EditResourcePage() {
  const resourceId = useRouter().query.id as string;
  const { data: resource } = api.resource.getById.useQuery(resourceId, {
    enabled: !!resourceId,
    onSuccess: (data) => {
      setFormData({ ...data });
    },
  });

  const updateResource = api.resource.update.useMutation();

  const [formData, setFormData] = useState({ ...resource });

  if (!resource) return <div>Loading...</div>;

  return (
    <div>
      <NavBar />
      <div className="px-5 pt-20 text-5xl font-light capitalize">
        Edit Resource
      </div>

      <form className="flex max-w-xl flex-col">
        <label htmlFor="name">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          id="name"
        />

        <label htmlFor="description">Description</label>
        <textarea
          name="description"
          id="description"
          className="h-60"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />

        <label htmlFor="url">URL</label>
        <input
          type="text"
          name="url"
          id="url"
          value={formData.url || ""}
          onChange={(e) => setFormData({ ...formData, url: e.target.value })}
        />

        <CategorySelect
          value={
            formData.category
              ? { value: formData.category, label: formData.category }
              : undefined
          }
          onChange={(value) => {
            const category = (value as CategorySelectItem).value;
            setFormData({ ...formData, category: category });
          }}
        />

        <TagSelect
          value={
            formData.tags
              ? formData.tags.map((tag) => {
                  return { value: tag.tag, label: tag.tag };
                })
              : []
          }
          onChange={(value, action) => {
            if (action.action === "clear") {
              setFormData({ ...formData, tags: [] });
              return;
            }

            const tags = (value as { value: string; label: string }[]).map(
              (tag) => {
                return { tag: tag.value, description: "" };
              }
            );

            setFormData({ ...formData, tags: tags });
          }}
        />
        <CommunitySelect
          title="Exclusive To"
          isMulti
          value={
            formData.exclusiveToCommunities
              ? formData.exclusiveToCommunities.map((community) => {
                  return { value: community.name, label: community.name };
                })
              : undefined
          }
          onChange={(value) => {
            const communities = (
              value as { value: string; label: string }[]
            ).map((community) => {
              return { name: community.value };
            });

            setFormData({ ...formData, exclusiveToCommunities: communities });
          }}
        />
        <CommunitySelect title="Helpful To"
        isMulti
        value={
          formData.helpfulToCommunities
            ? formData.helpfulToCommunities.map((community) => {

                return { value: community.name, label: community.name };
              })
            : undefined
        }
        onChange={(value) => {
          const communities = (
            value as { value: string; label: string }[]
          ).map((community) => {
            return { name: community.value };
          });

          setFormData({ ...formData, helpfulToCommunities: communities });
        }}

        />
        <button
          type="button"
          onClick={() => {
            updateResource.mutate({
              ...formData,
              tags: formData.tags
                ? formData.tags.map((tag) => {
                    return tag.tag;
                  })
                : [],
                exclusiveTo: formData.exclusiveToCommunities?.map((community) => {
                  return community.name;
                  }),
                  helpfulTo: formData.helpfulToCommunities?.map((community) => {
                    return community.name;
                    }),
              id: resourceId,
            });
          }}
        >
          Submit
        </button>
      </form>
    </div>
  );
}
