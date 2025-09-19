"use client";

import React, { useState, useMemo, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

// import { ZoomIn, ZoomOut } from 'lucide-react';
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import {
//   ChartContainer,
//   ChartTooltipContent,
// } from '@/components/ui/chart';
// import { generateStockData } from '@/lib/data';

const MIN_ZOOM_POINTS = 20;

export default function ChartVision() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const allData = useMemo(() => generateStockData(200), []);

  const [zoomRange, setZoomRange] = useState({
    startIndex: 0,
    endIndex: allData.length - 1,
  });

  const displayedData = useMemo(() => {
    return allData.slice(zoomRange.startIndex, zoomRange.endIndex + 1);
  }, [allData, zoomRange]);

  const handleZoomIn = () => {
    const { startIndex, endIndex } = zoomRange;
    const currentRange = endIndex - startIndex;
    const zoomAmount = Math.max(1, Math.floor(currentRange * 0.1));

    if (currentRange - 2 * zoomAmount < MIN_ZOOM_POINTS) {
      const center = Math.floor(startIndex + currentRange / 2);
      const newStartIndex = Math.max(0, center - Math.floor(MIN_ZOOM_POINTS / 2));
      const newEndIndex = Math.min(allData.length - 1, newStartIndex + MIN_ZOOM_POINTS - 1);
      setZoomRange({ startIndex: newStartIndex, endIndex: newEndIndex });
    } else {
      setZoomRange({
        startIndex: startIndex + zoomAmount,
        endIndex: endIndex - zoomAmount,
      });
    }
  };

  const handleZoomOut = () => {
    const { startIndex, endIndex } = zoomRange;
    const zoomAmount = Math.max(1, Math.floor((endIndex - startIndex) * 0.1));
    setZoomRange({
      startIndex: Math.max(0, startIndex - zoomAmount),
      endIndex: Math.min(allData.length - 1, endIndex + zoomAmount),
    });
  };

  const isZoomInDisabled = zoomRange.endIndex - zoomRange.startIndex <= MIN_ZOOM_POINTS;
  const isZoomOutDisabled = zoomRange.startIndex === 0 && zoomRange.endIndex === allData.length - 1;

  const chartConfig = {
    price: {
      label: 'Price',
      color: 'hsl(var(--primary))',
    },
  };

  return (
    <Card className="shadow-lg rounded-xl">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 space-y-0 pb-2">
        <div>
          <CardTitle className="font-headline">Stock Price</CardTitle>
          <CardDescription>
            {displayedData.length > 0
              ? `Showing data from ${displayedData[0].date} to ${displayedData[displayedData.length - 1].date}`
              : 'Loading data...'}
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handleZoomOut} disabled={isZoomOutDisabled} aria-label="Zoom Out">
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleZoomIn} disabled={isZoomInDisabled} aria-label="Zoom In">
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ChartContainer config={chartConfig} className="h-[450px] w-full pr-4">
          <LineChart
            data={displayedData}
            margin={{ top: 20, right: 20, left: 10, bottom: 20 }}
            accessibilityLayer={true}
          >
            <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                  if (!isClient) return '';
                  const date = new Date(value);
                  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
              }}
              minTickGap={30}
            />
            <YAxis
              orientation="right"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `$${typeof value === 'number' ? value.toFixed(0) : ''}`}
              domain={['dataMin - 20', 'dataMax + 20']}
            />
            <Tooltip
              cursor={{ stroke: 'hsl(var(--accent))', strokeWidth: 1.5 }}
              content={<ChartTooltipContent 
                indicator="dot" 
                formatter={(value, name) => [`$${(value).toFixed(2)}`, name.charAt(0).toUpperCase() + name.slice(1)]}
                labelFormatter={(label) => {
                  if (!isClient) return '';
                  return new Date(label).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
                }}
              />}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={false}
              isAnimationActive={true}
              animationDuration={300}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
