import { Separator } from "react-resizable-panels";

export const ResizeHandle = ({ id, direction = "vertical" }: { id: string; direction?: "horizontal" | "vertical" }) => {
  const isHorizontal = direction === "horizontal";
  
  return (
    <Separator 
      id={id}
      className={`${isHorizontal ? 'h-[2px] w-full cursor-row-resize' : 'w-[2px] h-full cursor-col-resize'} bg-border hover:bg-accent-green active:bg-accent-green transition-colors relative group shrink-0`}
    >
      {/* Subtle grabber visual on hover */}
      {isHorizontal ? (
        <div className="absolute left-1/2 -translate-x-1/2 -top-1 h-2.5 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex justify-center items-center gap-[2px]">
          <div className="w-[2px] h-[2px] bg-black rounded-full" />
          <div className="w-[2px] h-[2px] bg-black rounded-full" />
          <div className="w-[2px] h-[2px] bg-black rounded-full" />
        </div>
      ) : (
        <div className="absolute top-1/2 -translate-y-1/2 -left-1 w-2.5 h-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center items-center gap-[2px]">
          <div className="w-[2px] h-[2px] bg-black rounded-full" />
          <div className="w-[2px] h-[2px] bg-black rounded-full" />
          <div className="w-[2px] h-[2px] bg-black rounded-full" />
        </div>
      )}
    </Separator>
  );
};
