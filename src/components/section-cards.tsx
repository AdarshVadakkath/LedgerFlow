"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function SectionCards({ data }: { data: Array<{ icon: any; title: string; value: string; description: string; isPositive: boolean }> }) {

  const cards = data;

  return (
    <div className="space-y-4 px-4 lg:px-6">
      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, index) => {
          const IconComponent = card.icon;
          return (
            <Card
              key={index}
              className="@container/card relative overflow-hidden transition-all hover:shadow-lg hover:scale-105"
            >
              <CardHeader className="relative z-10">
                <div className="flex items-start justify-between mb-2">
                  <div className="p-2 rounded-lg bg-muted text-foreground">
                    <IconComponent className="w-5 h-5" />
                  </div>
                </div>
                <CardDescription className="text-xs">
                  {card.description}
                </CardDescription>
                <CardTitle className="text-2xl font-bold tabular-nums @[250px]/card:text-3xl mt-2">
                  {card.value}
                </CardTitle>
                <p className="text-sm font-medium text-foreground/80 mt-1">
                  {card.title}
                </p>
              </CardHeader>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
