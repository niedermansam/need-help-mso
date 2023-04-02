import Link from "next/link";
import { encodeTag } from "../utils/manageUrl";

export function TagLink ({tag}: {tag: string}) {
    return (
      <Link
        href={`/tag/${encodeTag(tag)}`}
        className="mr-1 mb-1 rounded border border-stone-300 bg-stone-100 px-1 py-0.5 text-xs font-bold text-stone-500 hover:border-rose-400 hover:bg-rose-500 hover:text-white"
      >
        {tag}
      </Link>
    );
}