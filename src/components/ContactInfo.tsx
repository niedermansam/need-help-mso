import Link from "next/link";
import { getRawPhoneNumber, prettyUrl } from "../utils";
import {
  faEnvelope,
  faGlobe,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactModal from "react-modal";
import { useState } from "react";

export type ContactInfo = {
  phone: string | null;
  email: string | null;
  website: string | null;
}

export function ContactInfo({
  phone,
  email,
  website,
  shortUrl,
}: ContactInfo & { shortUrl?: boolean }) {
  const shortenUrl = shortUrl ?? false;
  return (
    <div className="w-full truncate">
      {phone && (
        <a
          className="mb-1.5 flex w-full items-center truncate text-sm text-stone-500 hover:text-cyan-700"
          href={getRawPhoneNumber(phone, true) || undefined}
        >
          <FontAwesomeIcon className="mr-2 h-4" icon={faPhone} />
          <span>{phone}</span>
        </a>
      )}
      {email && (
        <a
          className="mb-1.5 flex w-full items-center truncate text-ellipsis text-sm text-stone-500 hover:text-cyan-700"
          href={`mailto:${email}`}
        >
          <FontAwesomeIcon className="mr-2 h-4" icon={faEnvelope} />
          <span className="mr-2 truncate">{email}</span>
        </a>
      )}

      {website && (
        <Link
          className="mb-1.5 flex w-full items-center truncate whitespace-nowrap text-sm uppercase text-stone-500 hover:text-cyan-700"
          href={website}
        >
          <FontAwesomeIcon
            className="mr-2"
            icon={faGlobe}
            style={{ width: 18, height: 18 }}
          />
          <span className="mr-3 truncate text-xs font-semibold tracking-wide ">
            {prettyUrl(website, shortenUrl)}
          </span>
        </Link>
      )}
    </div>
  );
}

export interface ContactIconsProps
  extends React.ComponentPropsWithoutRef<"div"> {
  phone: string | null;
  email: string | null;
  website: string | null;
}

export function ContactIcons({
  phone,
  email,
  website,
  ...attributes
}: ContactIconsProps) {
  return (
    <div {...attributes} className={`flex ${attributes.className || ""}`}>
      {phone && (
        <button className="mx-2.5 flex h-8 w-8 items-center justify-center rounded-full border border-stone-300  bg-stone-100 p-1.5 text-stone-500  hover:border-cyan-700/50 hover:bg-cyan-700/20 hover:text-cyan-700 md:mx-4 md:h-6 md:w-6">
          <a
            href={getRawPhoneNumber(phone, true) || undefined}
            className="flex items-center justify-center md:h-3 md:w-3"
          >
            <FontAwesomeIcon
              className="h-4 w-4 md:h-3 md:w-3 "
              icon={faPhone}
            />
          </a>
        </button>
      )}
      {email && (
        <button className="mx-2.5 flex  h-8 w-8 items-center  justify-center rounded-full border border-stone-300  bg-stone-100 p-1.5 text-stone-500  hover:border-cyan-700/50 hover:bg-cyan-700/20 hover:text-cyan-700 md:mx-4 md:h-6 md:w-6">
          <a
            href={`mailto:${email}`}
            className="flex items-center justify-center"
          >
            <FontAwesomeIcon
              className="h-4 w-4 md:h-3 md:w-3 "
              icon={faEnvelope}
            />
          </a>
        </button>
      )}

      {website && (
        <button className="mx-2.5 flex  h-8 w-8 items-center justify-center rounded-full border border-stone-300  bg-stone-100 p-1.5 text-stone-500  hover:border-cyan-700/50 hover:bg-cyan-700/20 hover:text-cyan-700 md:mx-4 md:h-6 md:w-6">
          <Link
            href={website}
            className="flex h-4 w-4 items-center justify-center"
          >
            <FontAwesomeIcon
              className="h-4 w-4 md:h-3 md:w-3 "
              icon={faGlobe}
            />
          </Link>
        </button>
      )}
    </div>
  );
}

export function ContactModal({
  phone,
  email,
  website,
  shortUrl,
}: ContactInfo & { shortUrl?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <button
        className="text-sm text-stone-500 hover:text-cyan-700"
        onClick={() => setIsOpen(true)}
      >
        Contact
      </button>

      <ReactModal isOpen={isOpen}>
        <ContactInfo {...{ phone, email, website, shortUrl }} />
        <button onClick={() => setIsOpen(false)}>Close</button>
      </ReactModal>
    </>
  );
}
