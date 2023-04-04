import Link from "next/link";
import { encodeTag } from "../utils/manageUrl";
import type { Tag } from "@prisma/client";

interface TagLinkProps extends React.HTMLAttributes<HTMLAnchorElement> {
  tag: string;
}

export function TagLink ({tag, ...props}: TagLinkProps) {
    return (
      <Link
        {...props}
        href={`/tag/${encodeTag(tag)}`}
        className={`mr-1 mb-1 rounded border border-stone-300 bg-stone-100 px-1 py-0.5 text-xs font-bold text-stone-500 hover:border-rose-400 hover:bg-rose-500 hover:text-white ${props.className || ""}}}`}
      >
        {tag}
      </Link>
    );
}


interface TagListProps extends React.ComponentPropsWithoutRef<"div"> {
  tags: Pick<Tag, "tag">[];
  tagProps?: React.ComponentPropsWithoutRef<"a">;
}

export function TagList({ tags, className, tagProps, ...props }: TagListProps) {
  return (
    <div {...props} className={`flex flex-wrap ${className || ""}`}>
      {tags.map((tag) => (
        <TagLink key={tag.tag} tag={tag.tag} {...tagProps} />
      ))}
    </div>
  );
}