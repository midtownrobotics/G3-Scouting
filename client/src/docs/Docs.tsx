import { JSX, ReactNode, useEffect, useState } from "react";
import { Link45deg } from "react-bootstrap-icons";
import MarkdownReact, { Options, Components } from "react-markdown";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import * as codeStyles from 'react-syntax-highlighter/dist/esm/styles/prism';
import "./Docs.css";

const Markdown = MarkdownReact as (options: Readonly<Options>) => ReactNode;

const pages: Record<string, () => Promise<string>> = (import.meta as any).glob(
    '../../../docs/*.md',
    {
        query: '?raw',
        import: 'default',
    }
);

export default function Docs() {
    const [content, setContent] = useState("# Attempting to load page... \n ## [Click here if page doesn't redirect.](/docs/home.md)");

    let page = window.location.pathname.split("/docs")[1].replace("/", "").replace(".md", "");
    if (page == "") window.location.pathname = "/docs/home.md";

    useEffect(() => {
        const file = pages[`../../../docs/${page}.md`];
        if (!file) return;
        file().then((content) => setContent(content));
    }, [page]);

    useEffect(() => {
        const hash = window.location.hash;
        if (!hash) return;
        const targetElement = document.querySelector(hash);
        console.log(targetElement);
        if (!targetElement) return;
        targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }, [content])

    const components: Components = {
        h1: ({ children }) => Headings({ level: 1, children }),
        h2: ({ children }) => Headings({ level: 2, children }),
        h3: ({ children }) => Headings({ level: 3, children }),
        h4: ({ children }) => Headings({ level: 4, children }),
        h5: ({ children }) => Headings({ level: 5, children }),
        h6: ({ children }) => Headings({ level: 6, children }),
        code: ({ className, children }) => {
            const match = /language-(\w+)/.exec(className || '');

            if (match) {
                return (
                    <SyntaxHighlighter
                        style={codeStyles.vscDarkPlus}
                        language={match[1]}
                        PreTag="div"
                    >
                        {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                );
            }

            return (
                <code className={className}>
                    {children}
                </code>
            );
        }
    }

    return (
        <div id="docs-page">
            <div style={{ margin: "10px 30px 30px" }}>
                <a href="/">↩ Return to Scout-o-matic home.</a>
                <br />
                <br />
                <Markdown components={components}>
                    {content}
                </Markdown>
                <br />
            </div>
        </div>
    )
}

const Headings = ({ level, children }: { level?: number, children: ReactNode }) => {
    const heading = children;
    let anchor = typeof heading === 'string' ? heading.toLowerCase() : '';

    anchor = anchor.replace(/[^a-zA-Z0-9 ]/g, '');
    anchor = anchor.replace(/ /g, '-');

    const container = (children: React.ReactNode): JSX.Element => (
        <a id={anchor} href={`#${anchor}`} className="plain-link align-items-center d-flex">
            <span className="fs-5 link-icon"><Link45deg /></span>
            <span>{children}</span>
        </a>
    );

    switch (level) {
        case 1:
            return <h1 className="linked-header">{container(children)}</h1>;
        case 2:
            return <h2 className="linked-header">{container(children)}</h2>;
        case 3:
            return <h3 className="linked-header">{container(children)}</h3>;
        default:
            return <h6 className="linked-header">{container(children)}</h6>;
    }
};