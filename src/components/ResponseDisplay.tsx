import { simpleMarkdownToJsx } from "@/lib/markdown";

type ResponseDisplayProps = {
  content: string;
};

export default function ResponseDisplay({ content }: ResponseDisplayProps) {
  return (
    <div className="whitespace-pre-wrap break-words text-[0.9375rem] leading-7">
      {simpleMarkdownToJsx(content)}
    </div>
  );
}
