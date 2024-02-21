"use client";
import React, { Dispatch, SetStateAction, useState } from "react";
import {
  OrganizationSearchListProps,
  OrganizationSearchProps,
} from "../search/page";
import { TagSelectSection } from "../search/TagSelectSection";
import CreatableSelect from "react-select/creatable";
import { TagSelect } from "@/components/old/Selectors";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  QuestionMarkCircledIcon,
  QuestionMarkIcon,
} from "@radix-ui/react-icons";
import ReactSelect, { ActionMeta, MultiValue } from "react-select";
import { api } from "@/utils/api";
import Link from "next/link";

const handleGenericChange =
  (
    addRemoveObj: {
      added: Set<string>;
      removed: Set<string>;
    },
    setAddRemoveObj: (addRemoveObj: {
      added: Set<string>;
      removed: Set<string>;
    }) => void,

    setNewState: Dispatch<SetStateAction<string[]>>
  ) =>
  (
    newValue: MultiValue<{
      value: string;
      label: string;
    }>,
    actionMeta: ActionMeta<{
      value: string;
      label: string;
    }>
  ) => {
    const updatedValue = newValue.map((x) => x.value);

    console.log(actionMeta)

    setNewState(updatedValue);

    switch (actionMeta.action) {
      case "select-option":
      case "create-option":
        setAddRemoveObj({
          ...addRemoveObj,
          added: new Set([...addRemoveObj.added, ...updatedValue]),
        });
        break;
      case "deselect-option":
      case "remove-value":

      const removedValue = actionMeta.removedValue?.value as string

      const newAdded = new Set(addRemoveObj.added)
      newAdded.delete(removedValue)
        
        setAddRemoveObj({
          added: newAdded,
          removed: new Set([...addRemoveObj.removed,  removedValue]),
        });
        break;
      default:
        break;
    }

    console.log("generic change");
  };

export const AdminOrgCard = (org: OrganizationSearchListProps[number]) => {
  const selectedTagsFromDb = org.tags.map((tag) => tag.tag);
  const tagOptions = api.tag.getAll.useQuery();

  const adminVerify = api.organization.updateAdminVerified.useMutation({
    onSuccess: () => {
      setAdminVerified(!adminVerified);
    },
  });

  const [adminVerified, setAdminVerified] = useState(org.adminVerified);

  const [selectedTags, setSelectedTags] =
    useState<string[]>(selectedTagsFromDb);

  const [tagUpdate, setTagUpdate] = useState({
    added: new Set<string>(),
    removed: new Set<string>(),
  });

  const handleTagChange = handleGenericChange(
    tagUpdate,
    setTagUpdate,
    setSelectedTags
  );

  return (
    <div className="my-2 rounded bg-white p-4 shadow">
      <div className="flex items-center gap-2 pb-2">
        <input type="checkbox"  checked={adminVerified}
          onChange={() => {
            adminVerify.mutate({
              orgId: org.id,
              adminVerified: !org.adminVerified,
            });
          }}
        />

        <h2 className="text-xl font-bold text-stone-600">
          {org.name}
        </h2>
          <DescriptionPopover description={org.description} />
          {org.website && (
            <a href={org.website} target="_blank" rel="noreferrer">
              {org.website}
            </a>
          )}
      </div>

      <CreatableSelect
        isMulti
        isClearable={false}
        value={selectedTags.map((tag) => ({
          value: tag,
          label: tag,
        }))}
        options={tagOptions.data?.map((tag) => ({
          value: tag.name,
          label: tag.name,
        }))}
        onChange={handleTagChange}
      />
      <SaveOrgButton
        orgId={org.id}
        tagUpdate={tagUpdate}
        setTagUpdate={setTagUpdate}
      />
      <ProgramCollapsible programs={org.programs} defaultOpen={!org.adminVerified} />
    </div>
  );
};

const SaveOrgButton = ({
  orgId,
  tagUpdate,
  setTagUpdate,
}: {
  orgId: string;
  tagUpdate: {
    added: Set<string>;
    removed: Set<string>;
  };
  setTagUpdate: (tagUpdate: {
    added: Set<string>;
    removed: Set<string>;
  }) => void;
}) => {
  const mutation = api.organization.updateTags.useMutation({
    onSuccess: () => {
      setTagUpdate({
        added: new Set(),
        removed: new Set(),
      });
    },
  });

  const handleSave = () => { 
    mutation.mutate({
      orgId,
      addedTags: [...tagUpdate.added],
      removedTags: [...tagUpdate.removed],
    });
  };
 

  if (tagUpdate.added.size === 0 && tagUpdate.removed.size === 0) return null;

  return <button onClick={handleSave}>Save</button>;
};

function DescriptionPopover({ description }: { description: string }) {
  const trimedDescription = description.trim();

  if (trimedDescription === "") return null;
  return (
    <Popover>
      <PopoverTrigger>
        <QuestionMarkCircledIcon className="size-5   font-bold text-stone-600" />
      </PopoverTrigger>
      <PopoverContent
        align="start"
        side="right"
        className="w-fit max-w-2xl whitespace-pre-line"
      >
        {description}
      </PopoverContent>
    </Popover>
  );
}

function ProgramCollapsible({
  programs,
  defaultOpen,
}: {
  programs: OrganizationSearchListProps[number]["programs"];
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen ?? true);
  if (programs === undefined) return null;
  if (programs.length === 0) return null;

  return (
    <Collapsible open={open}>
      <CollapsibleTrigger
        onClick={() => {
          setOpen(!open);
        }}
        className="text-xs font-bold text-stone-500"
      >
        {" "}
        {open ? "- Hide" : "+ Show"} {programs.length} Programs
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="grid grid-cols-4 gap-2 gap-y-4">
          {programs.map((program) => (
            <AdminProgramItem
              program={program}
              key={program.name}
              className="grid-cols-subgrid col-span-4 grid"
            />
          ))}
        </div>
      </CollapsibleContent>{" "}
    </Collapsible>
  );
}

const AdminProgramItem = ({
  program,
  className,
}: {
  program: OrganizationSearchListProps[number]["programs"][0];
  className?: string;
}) => {
  const tagOptions = api.tag.getAll.useQuery();
  const communityOptions = api.community.getAll.useQuery();

  const [exclusiveTo, setExclusiveTo] = useState(
    program.exclusiveToCommunities.map((community) => ({
      value: community.name,
      label: community.name,
    }))
  );

  const [helpfulTo, setHelpfulTo] = useState(
    program.helpfulToCommunities.map((community) => ({
      value: community.name,
      label: community.name,
    }))
  );

  const [tags, setTags] = useState(program.tags.map((tag) => tag.tag));
  const [tagUpdate, setTagUpdate] = useState({
    added: new Set<string>(),
    removed: new Set<string>(),
  });

  const handleTagChange = handleGenericChange(tagUpdate, setTagUpdate, setTags);

  return (
    <div className={className}>
      <div>
        <h3 className="flex items-center gap-1 font-semibold text-stone-600">
          {program.name}
          {program.description && (
            <DescriptionPopover description={program.description} />
          )}
        </h3>

        <SaveProgramButton
          programId={program.id}
          tagUpdate={tagUpdate}
          setTagUpdate={setTagUpdate}
        />
      </div>
      <div className="col-span-3">
        tags:
        <CreatableSelect
          isMulti
          isClearable={false}
          value={tags.map((tag) => ({
            value: tag,
            label: tag,
          }))}
          options={tagOptions.data?.map((tag) => ({
            value: tag.name,
            label: tag.name,
          }))}
          onChange={handleTagChange}
        />
      </div>
      {/* <div>
        Exclusive To:
        <ReactSelect isMulti value={exclusiveTo} />
      </div>
      <div>
        Helpful To:
        <ReactSelect isMulti value={helpfulTo} />
      </div> */}
    </div>
  );
};

const SaveProgramButton = ({
  programId,
  tagUpdate,
  setTagUpdate,
}: {
  programId: string;
  tagUpdate: {
    added: Set<string>;
    removed: Set<string>;
  };
  setTagUpdate: (tagUpdate: {
    added: Set<string>;
    removed: Set<string>;
  }) => void;
}) => {
  const mutation = api.program.updateTags.useMutation({
    onSuccess: () => {
      setTagUpdate({
        added: new Set(),
        removed: new Set(),
      });
    },
  });

  const handleSave = () => {
    mutation.mutate({
      programId: programId,
      addedTags: tagUpdate.added,
      removedTags: tagUpdate.removed,
    });
  };

  if (tagUpdate.added.size === 0 && tagUpdate.removed.size === 0) return null;

  return <button onClick={handleSave}>Save</button>;
};
