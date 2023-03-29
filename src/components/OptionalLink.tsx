import type { LinkProps } from "next/link";
import Link from "next/link";



type OptionalLinkProps = Omit<LinkProps, 'href'> & { href: string | undefined | null; children: React.ReactNode; className?: HTMLElement['className'] }

export default function OptionalLink({ href, children, className, ...attributes }:OptionalLinkProps) {
    if(!href) return null
    else return <Link href={href} className={className} {...attributes}>{children}</Link>
}