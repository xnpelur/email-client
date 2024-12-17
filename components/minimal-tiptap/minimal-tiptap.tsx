import * as React from "react";
import "./styles/index.css";

import type { Content, Editor } from "@tiptap/react";
import type { UseMinimalTiptapEditorProps } from "./hooks/use-minimal-tiptap";
import { EditorContent } from "@tiptap/react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { SectionTwo } from "./components/section/two";
import { SectionThree } from "./components/section/three";
import { SectionFour } from "./components/section/four";
import { LinkBubbleMenu } from "./components/bubble-menu/link-bubble-menu";
import { useMinimalTiptapEditor } from "./hooks/use-minimal-tiptap";
import { MeasuredContainer } from "./components/measured-container";

export interface MinimalTiptapProps
    extends Omit<UseMinimalTiptapEditorProps, "onUpdate"> {
    value?: Content;
    onChange?: (value: Content) => void;
    className?: string;
    editorContentClassName?: string;
}

const Toolbar = ({ editor }: { editor: Editor }) => (
    <div className="shrink-0 overflow-x-auto">
        <div className="flex w-max items-center gap-px">
            <SectionTwo
                editor={editor}
                activeActions={[
                    "bold",
                    "italic",
                    "underline",
                    "strikethrough",
                    "code",
                    "clearFormatting",
                ]}
                mainActionCount={3}
            />

            <Separator orientation="vertical" className="mx-2 h-7" />

            <SectionThree editor={editor} />

            <Separator orientation="vertical" className="mx-2 h-7" />

            <SectionFour
                editor={editor}
                activeActions={["orderedList", "bulletList"]}
                mainActionCount={0}
            />
        </div>
    </div>
);

export const MinimalTiptapEditor = React.forwardRef<
    HTMLDivElement,
    MinimalTiptapProps
>(({ value, onChange, className, editorContentClassName, ...props }, ref) => {
    const editor = useMinimalTiptapEditor({
        value,
        onUpdate: onChange,
        ...props,
    });

    if (!editor) {
        return null;
    }

    return (
        <MeasuredContainer
            as="div"
            name="editor"
            ref={ref}
            className={cn("flex h-auto w-full flex-1 flex-col", className)}
        >
            <EditorContent
                editor={editor}
                className={cn(
                    "minimal-tiptap-editor flex-1",
                    editorContentClassName,
                )}
            />
            <Toolbar editor={editor} />
            <LinkBubbleMenu editor={editor} />
        </MeasuredContainer>
    );
});

MinimalTiptapEditor.displayName = "MinimalTiptapEditor";

export default MinimalTiptapEditor;
