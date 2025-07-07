"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Minus, RotateCcw } from "lucide-react";

type ContentItem = {
  id: number;
  type: "card" | "section" | "banner";
  title: string;
  content: string;
};

const contentTemplates = {
  card: {
    title: "Demo Card",
    content:
      "This is a sample card to demonstrate the overflow behavior. Notice how the header and navigation stay fixed while this content scrolls.",
  },
  section: {
    title: "Content Section",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
  },
  banner: {
    title: "Feature Banner",
    content:
      "This is a large banner component that takes up significant vertical space to help demonstrate scrolling behavior.",
  },
};

export function OverflowDemo() {
  const [items, setItems] = useState<ContentItem[]>([
    {
      id: 1,
      type: "card",
      title: "Welcome Card",
      content:
        "This initial card shows how content appears in the scrollable area.",
    },
  ]);
  const [nextId, setNextId] = useState(2);

  const addContent = (type: keyof typeof contentTemplates) => {
    const template = contentTemplates[type];
    const newItem: ContentItem = {
      id: nextId,
      type,
      title: `${template.title} ${nextId}`,
      content: template.content,
    };
    setItems((prev) => [...prev, newItem]);
    setNextId((prev) => prev + 1);
  };

  const removeLastItem = () => {
    setItems((prev) => prev.slice(0, -1));
  };

  const resetDemo = () => {
    setItems([
      {
        id: 1,
        type: "card",
        title: "Welcome Card",
        content:
          "This initial card shows how content appears in the scrollable area.",
      },
    ]);
    setNextId(2);
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap gap-2 justify-center">
        <Button
          onClick={() => addContent("card")}
          size="sm"
          variant="outline"
          className="gap-1"
        >
          <Plus className="w-4 h-4" />
          Add Card
        </Button>
        <Button
          onClick={() => addContent("section")}
          size="sm"
          variant="outline"
          className="gap-1"
        >
          <Plus className="w-4 h-4" />
          Add Section
        </Button>
        <Button
          onClick={() => addContent("banner")}
          size="sm"
          variant="outline"
          className="gap-1"
        >
          <Plus className="w-4 h-4" />
          Add Banner
        </Button>
        <Button
          onClick={removeLastItem}
          size="sm"
          variant="outline"
          disabled={items.length <= 1}
          className="gap-1"
        >
          <Minus className="w-4 h-4" />
          Remove Last
        </Button>
        <Button
          onClick={resetDemo}
          size="sm"
          variant="outline"
          className="gap-1"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </Button>
      </div>

      {/* Info */}
      <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <strong>Items: {items.length}</strong> - Add content to see overflow
          in action. The header and navigation will stay fixed while this
          content area scrolls.
        </p>
      </div>

      {/* Dynamic Content */}
      <div className="space-y-4">
        {items.map((item) => {
          if (item.type === "card") {
            return (
              <div key={item.id} className="p-4 border rounded-lg bg-card">
                <h4 className="font-medium mb-2">{item.title}</h4>
                <p className="text-sm text-muted-foreground">{item.content}</p>
                <div className="mt-3 h-16 bg-muted rounded"></div>
              </div>
            );
          }

          if (item.type === "section") {
            return (
              <div key={item.id} className="p-6 border rounded-lg bg-muted/50">
                <h4 className="font-semibold text-lg mb-3">{item.title}</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  {item.content}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="h-12 bg-primary/20 rounded"></div>
                  <div className="h-12 bg-primary/20 rounded"></div>
                </div>
              </div>
            );
          }

          if (item.type === "banner") {
            return (
              <div
                key={item.id}
                className="h-64 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 rounded-lg border flex items-center justify-center"
              >
                <div className="text-center space-y-2">
                  <h4 className="font-semibold text-xl">{item.title}</h4>
                  <p className="text-sm text-muted-foreground max-w-md">
                    {item.content}
                  </p>
                </div>
              </div>
            );
          }

          return null;
        })}
      </div>

      {/* Footer info */}
      <div className="text-center text-xs text-muted-foreground pt-4 border-t">
        Try resizing your browser or switching between desktop and mobile views
        to see the responsive behavior!
      </div>
    </div>
  );
}
