import { Skeleton } from "@/components/ui/skeleton";

export default function Loading({text}: {text?: string}) {
    // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className='flex flex-col items-center justify-center mt-2.5 w-screen'>
      <div className="flex flex-col w-1/2 mt-0.5 gap-5">
        <Skeleton className="flex flex-row h-[125px] w-full rounded-xl items-center justify-center">{text || "Loading..."}</Skeleton>
        <Skeleton className="h-[50px] w-[75%] rounded-xl" />
        <Skeleton className="h-[50px] w-[50%] rounded-xl" />
      </div>
    </div>
  )
}