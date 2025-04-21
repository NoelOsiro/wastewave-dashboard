// app/recycler/inbound/page.tsx

"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const mockData = [
  { source: "WasteGen Co", material: "Plastic", weight: 250, status: "Accepted", time: "10:30 AM" },
  { source: "EcoClub", material: "Organic", weight: 150, status: "Pending", time: "11:00 AM" },
  { source: "GreenTech", material: "E-waste", weight: 80, status: "Rejected", time: "11:15 AM" },
]

export default function InboundWastePage() {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Inbound Waste Log</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Source</TableHead>
              <TableHead>Material</TableHead>
              <TableHead>Weight (kg)</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockData.map((item, idx) => (
              <TableRow key={idx}>
                <TableCell>{item.source}</TableCell>
                <TableCell>{item.material}</TableCell>
                <TableCell>{item.weight}</TableCell>
                <TableCell>{item.status}</TableCell>
                <TableCell>{item.time}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
