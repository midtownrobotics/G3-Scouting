import { ReactNode, useEffect, useState } from "react";
import MarkdownReact, { Options } from "react-markdown";

const Markdown = MarkdownReact as (options: Readonly<Options>) => ReactNode;

const pages: Record<string, () => Promise<string>> = (import.meta as any).glob(
    '../../docs/*.md',
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
        const file = pages[`../../docs/${page}.md`];
        if (!file) return;
        file().then((content) => setContent(content));
    }, [page]);


    return (
        <div style={{ backgroundColor: "#f8f9fa", minHeight: "100%" }}>
            <div style={{ margin: "10px 30px 30px" }}>
                <a href="/">↩ Return to Scout-o-matic home.</a>
                <br />
                <br />
                <Markdown>{content}</Markdown>
                <br />
            </div>
        </div>
    )
}