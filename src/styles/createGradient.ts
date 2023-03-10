export const createTextGradient = (from: string, to: string, direction:string, via?: string) => {
    return `text-transparent bg-clip-text bg-gradient-to-${direction} from-${from} to-${to}`;
}