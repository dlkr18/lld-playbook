import fs from "fs/promises";
import path from "path";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export const dynamic = "force-dynamic";

type DocParams = {
  params: {
    slug?: string[];
  };
};

function normalizeDocHref(href: string): string {
  if (!href) {
    return href;
  }

  if (href.startsWith("https://dlkr18.github.io/lld-playbook/#")) {
    const hashPath = href.replace("https://dlkr18.github.io/lld-playbook/#", "");
    return `/docs${hashPath.startsWith("/") ? "" : "/"}${hashPath}`;
  }

  if (href.startsWith("https://dlkr18.github.io/lld-playbook")) {
    return "/docs";
  }

  if (href.startsWith("https://github.com/dlkr18/lld-playbook")) {
    return "/docs";
  }

  if (href.startsWith("/docs") || href.startsWith("#")) {
    return href;
  }

  if (href.startsWith("/")) {
    return `/docs${href}`;
  }

  return href;
}

function resolveImageSrc(src: string, baseDir: string): string {
  if (!src || src.startsWith("http") || src.startsWith("data:") || src.startsWith("/docs")) {
    return src;
  }

  if (src.startsWith("/")) {
    return `/docs${src}`;
  }

  const normalizedBase = baseDir ? `/${baseDir}` : "";
  return `/docs${normalizedBase}/${src}`.replace(/\/+/g, "/");
}

async function readDocFile(slug?: string[]) {
  const docsRoot = path.join(process.cwd(), "public", "docs");
  const segments = slug ?? [];
  const candidatePath = segments.length === 0 ? "home.md" : segments.join("/");

  const withExtension = path.extname(candidatePath) ? candidatePath : `${candidatePath}.md`;
  const fullPath = path.join(docsRoot, withExtension);

  try {
    const contents = await fs.readFile(fullPath, "utf8");
    return { contents, relativePath: withExtension };
  } catch {
    if (segments.length === 0) {
      throw new Error("Doc not found");
    }
  }

  const readmePath = path.join(docsRoot, candidatePath, "README.md");
  const contents = await fs.readFile(readmePath, "utf8");
  return { contents, relativePath: path.join(candidatePath, "README.md") };
}

export default async function DocsPage({ params }: DocParams) {
  let doc;
  try {
    doc = await readDocFile(params.slug);
  } catch {
    notFound();
  }

  const baseDir = path.dirname(doc.relativePath).replace(/\\/g, "/");
  const title = doc.relativePath.split("/").slice(-2).join(" / ").replace(/\.md$/, "");

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <Link
          href="/docs"
          className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors"
        >
          ← All Docs
        </Link>
        <h1 className="text-2xl font-semibold text-gray-200 mt-3">{title}</h1>
      </div>

      <div className="markdown-content">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            a({ href = "", children }) {
              const normalized = normalizeDocHref(href);
              const isExternal = /^https?:\/\//.test(normalized);
              if (isExternal) {
                return (
                  <a
                    href={normalized}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-300 transition-colors"
                  >
                    {children}
                  </a>
                );
              }

              return (
                <Link href={normalized} className="hover:text-blue-300 transition-colors">
                  {children}
                </Link>
              );
            },
            img({ src = "", alt = "" }) {
              const resolved = resolveImageSrc(src, baseDir);
              return (
                <img
                  src={resolved}
                  alt={alt}
                  className="rounded-lg border border-gray-800 my-4 max-w-full"
                />
              );
            },
          }}
        >
          {doc.contents}
        </ReactMarkdown>
      </div>
    </div>
  );
}
