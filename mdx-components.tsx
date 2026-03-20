import type { MDXComponents } from "mdx/types";
import { highlight } from "sugar-high";

function Code({ children, ...props }: React.ComponentProps<"code">) {
  const isInline = typeof children === "string" && !children.includes("\n");
  if (isInline) {
    return <code {...props}>{children}</code>;
  }
  const codeHTML = highlight(children as string);
  return <code dangerouslySetInnerHTML={{ __html: codeHTML }} {...props} />;
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    code: Code,
    ...components,
  };
}
