import { simpleMarkdownToJsx } from "@/lib/markdown";

type ResponseDisplayProps = {
  content: string;
};

export default function ResponseDisplay({ content }: ResponseDisplayProps) {
  return (
    <div className="break-words text-[0.9375rem] leading-7 sm:text-base">
      {simpleMarkdownToJsx(content)}
    </div>
  );
}
