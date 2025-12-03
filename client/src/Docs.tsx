import { ReactNode, useEffect, useState } from "react";
import MarkdownReact, { Options } from "react-markdown";

const Markdown = MarkdownReact as (options: Readonly<Options>) => ReactNode;

export default function Docs() {
    const [content, setContent] = useState("");

    let page = window.location.pathname.split("/docs")[1].replace("/", "").replace(".md", "");
    if (page == "") window.location.pathname = "/docs/home.md";

    useEffect(() => {
        import(`../../docs/${page}.md?raw`).then((res) => {
            setContent(res.default);
        });
    }, []);

    return (
        <div style={{ backgroundColor: "#f8f9fa" }}>
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