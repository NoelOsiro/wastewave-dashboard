// app/recycler/processing/page.tsx

"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const mockStats = [
  { type: "Plastic", input: 500, output: 420 },
  { type: "Organic", input: 300, output: 275 },
  { type: "E-waste", input: 200, output: 120 },
]

export default function ProcessingStatsPage() {
  return (
    <div className="grid gap-6 mt-6">
      {mockStats.map((stat, idx) => {
        const efficiency = ((stat.output / stat.input) * 100).toFixed(1)
        return (
          <Card key={idx}>
            <CardHeader>
              <CardTitle>{stat.type} Recovery</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">
                Input: {stat.input} kg · Output: {stat.output} kg
              </p>
              <Progress value={Number(efficiency)} />
              <p className="text-sm mt-1">Efficiency: {efficiency}%</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
