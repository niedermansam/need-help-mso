import { twMerge } from "tailwind-merge";

export const LocationPin = ({className ,primary, secondary, ...props}:{ className?: string,primary?: string, secondary?: string,
    props?: React.SVGProps<SVGSVGElement>
}) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={twMerge("icon-location-pin w-8", className)} {...props}><g><path className={twMerge("fill-rose-500",secondary) } d="M12 1v6a3 3 0 0 0 0 6v9.31a1 1 0 0 1-.7-.29l-5.66-5.66A9 9 0 0 1 12 1z"/><path className={twMerge('fill-rose-500',primary)} d="M12 1a9 9 0 0 1 6.36 15.36l-5.65 5.66a1 1 0 0 1-.71.3V13a3 3 0 0 0 0-6V1z"/></g></svg>
