interface UserMessageProps {
  question: string;
}

export function UserMessage({ question }: UserMessageProps) {
  return (
    <div className="max-w-[78%] rounded-2xl rounded-br-md bg-sky-700 px-4 py-3 text-[15px] leading-6 whitespace-pre-wrap text-white shadow-sm sm:max-w-[70%]">
      {question}
    </div>
  );
}

