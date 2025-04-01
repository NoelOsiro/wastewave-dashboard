export type Message =
  {
    type: string;
    message: string;
  };

export function FormMessage({ message }: { message: Message }) {
  return (
    <div className="flex flex-col gap-2 w-full max-w-md text-sm">
      {message.type === "success" && (
        <div className="text-status-success border-l-2 border-status-success  px-4">
          {message.message}
        </div>
      )}
      {message.type === "error" && (
        <div className="p-2 text-status-error border-l-2 border-status-error bg-red-100 text-bold px-4 text-center">
          {message.message}
        </div>
      )}
    </div>
  );
}
