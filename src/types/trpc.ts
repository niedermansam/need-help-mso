// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type UnwrapTRPCMutation<T> = T extends () => Record<"mutate", any>
  ? Parameters<ReturnType<T>["mutate"]>[0]
  : never;