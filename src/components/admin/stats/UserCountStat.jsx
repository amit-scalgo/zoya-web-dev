import * as React from "react";
import { Label, Pie, PieChart, Sector } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const chartConfig = {
  customer: {
    label: "Customer",
    color: "hsl(var(--chart-1))",
  },
  support: {
    label: "Support",
    color: "hsl(var(--chart-2))",
  },
  guest: {
    label: "Staff",
    color: "hsl(var(--chart-3))",
  },
  admin: {
    label: "Admin",
    color: "hsl(var(--chart-4))",
  },
};

export function UserCountStat({ data }) {
  const customerCount = data?.find((i) => i.type === "user")?.count ?? 0;
  const supportCount = data?.find((i) => i.type === "support")?.count ?? 0;
  const userData = [
    { type: "Customer", count: customerCount, fill: "var(--color-customer)" },
    { type: "Support", count: supportCount, fill: "var(--color-support)" },
    { type: "Guest", count: 10, fill: "var(--color-guest)" },
    { type: "Admin", count: 1, fill: "var(--color-admin)" },
  ];

  const id = "pie-interactive";
  const [activeType, setActiveType] = React.useState(userData[0].type);

  const activeIndex = React.useMemo(
    () => userData.findIndex((item) => item.type === activeType),
    [activeType],
  );
  const userTypes = React.useMemo(() => userData.map((item) => item.type), []);

  return (
    <Card data-chart={id} className="flex flex-col shadow-sm">
      <ChartStyle id={id} config={chartConfig} />
      <CardHeader className="flex-row items-start space-y-0 pb-0">
        <div className="grid gap-1">
          <CardTitle>User Types</CardTitle>
          <CardDescription>Customer - Support</CardDescription>
        </div>
        <Select value={activeType} onValueChange={setActiveType}>
          <SelectTrigger
            className="ml-auto h-7 w-[130px] rounded-lg pl-2.5"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Select user type" />
          </SelectTrigger>
          <SelectContent align="end" className="rounded-xl">
            {userTypes.map((key) => (
              <SelectItem key={key} value={key} className="rounded-lg">
                <div className="flex items-center gap-2 text-xs">
                  <span
                    className="flex h-3 w-3 shrink-0 rounded-sm"
                    style={{
                      backgroundColor: `var(--color-${key.toLowerCase()})`,
                    }}
                  />
                  {chartConfig[key.toLowerCase()]?.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center pb-0">
        <ChartContainer
          id={id}
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[300px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={userData}
              dataKey="count"
              nameKey="type"
              innerRadius={60}
              strokeWidth={5}
              activeIndex={activeIndex}
              activeShape={({ outerRadius = 0, ...props }) => (
                <g>
                  <Sector {...props} outerRadius={outerRadius + 10} />
                  <Sector
                    {...props}
                    outerRadius={outerRadius + 25}
                    innerRadius={outerRadius + 12}
                  />
                </g>
              )}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {userData[activeIndex].count.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Users
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
