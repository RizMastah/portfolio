import type { MDXComponents } from "mdx/types";
import { Facts, Flow } from "@/components/Diagram";

const components: MDXComponents = {
  h2: (props) => (
    <h2 className="display mt-20 mb-6 text-[clamp(2.5rem,6vw,4.5rem)] first:mt-0" {...props} />
  ),
  h3: (props) => <h3 className="label text-accent mt-10 mb-3" {...props} />,
  p: (props) => <p className="my-4 text-lg leading-relaxed" {...props} />,
  ul: (props) => <ul className="my-4 grid list-none gap-3 text-lg leading-relaxed" {...props} />,
  ol: (props) => (
    <ol
      className="marker:text-accent my-4 grid list-decimal gap-3 pl-6 text-lg leading-relaxed"
      {...props}
    />
  ),
  li: (props) => (
    <li
      className="[ul>&]:before:text-accent [ul>&]:relative [ul>&]:pl-6 [ul>&]:before:absolute [ul>&]:before:left-0 [ul>&]:before:content-['→']"
      {...props}
    />
  ),
  a: (props) => (
    <a className="text-accent underline underline-offset-4 hover:no-underline" {...props} />
  ),
  strong: (props) => <strong className="text-fg font-semibold" {...props} />,
  code: (props) => (
    <code
      className="bg-bg-raised border-line rounded border px-1.5 py-0.5 font-mono text-[0.85em]"
      {...props}
    />
  ),
  blockquote: (props) => (
    <blockquote className="border-accent text-muted my-8 border-l-2 pl-5 text-xl" {...props} />
  ),
  table: (props) => (
    <div className="my-8 overflow-x-auto">
      <table className="w-full text-left text-base" {...props} />
    </div>
  ),
  th: (props) => (
    <th className="label text-muted border-line border-b py-2 pr-4 font-normal" {...props} />
  ),
  td: (props) => <td className="border-line border-b py-3 pr-4 align-top" {...props} />,
  Flow,
  Facts,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
