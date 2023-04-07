// q: how dow I create a loading spinner component in react with typescript and tailwindcss?
// a:   import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faSpinner } from "@fortawesome/free-solid-svg-icons";

import { faEdit } from "@fortawesome/free-solid-svg-icons";
import {
  FontAwesomeIcon,
  type FontAwesomeIconProps,
} from "@fortawesome/react-fontawesome";
import Link, { type LinkProps } from "next/link";

export function LoadingAnimation({ className }: { className?: HTMLElement["className"]}) {
  return (
    <div className=
    {`ellipsis ${className ||''}`}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
}

type EditLinkProps = LinkProps & { className?: HTMLElement["className"] } & {
  iconProps?: Omit<FontAwesomeIconProps, "icon"> & {
    icon?: FontAwesomeIconProps["icon"] | undefined | null;
  };
};

export function EditLink({
  href,
  className,
  iconProps,
  ...attributes
}: EditLinkProps) {
  const defaultIconProps = {
    icon: faEdit,
    className: "mx-2 text-rose-800 hover:text-rose-500",
  };

  return (
    <Link href={href} className={className} {...attributes}>
      <FontAwesomeIcon
        {...iconProps}
        icon={iconProps?.icon || defaultIconProps.icon}
        className={`${iconProps?.className || defaultIconProps.className}`}
      />
    </Link>
  );
}
