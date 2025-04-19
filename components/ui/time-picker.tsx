"use client"

import * as React from "react"
import { format } from "date-fns"
import { Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface TimePickerProps {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
  className?: string
}

export function TimePicker({ date, setDate, className }: TimePickerProps) {
  const [selectedTime, setSelectedTime] = React.useState<string>(date ? format(date, "HH:mm") : "")

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedTime(e.target.value)

    if (e.target.value) {
      const [hours, minutes] = e.target.value.split(":").map(Number)
      const newDate = new Date()
      if (date) {
        newDate.setFullYear(date.getFullYear(), date.getMonth(), date.getDate())
      }
      newDate.setHours(hours)
      newDate.setMinutes(minutes)
      setDate(newDate)
    } else {
      setDate(undefined)
    }
  }

  React.useEffect(() => {
    if (date) {
      setSelectedTime(format(date, "HH:mm"))
    }
  }, [date])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground", className)}
        >
          <Clock className="mr-2 h-4 w-4" />
          {selectedTime ? format(new Date(`2000-01-01T${selectedTime}`), "h:mm a") : <span>Pick a time</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4">
        <div className="space-y-2">
          <Label htmlFor="time">Time</Label>
          <Input id="time" type="time" value={selectedTime} onChange={handleTimeChange} />
        </div>
      </PopoverContent>
    </Popover>
  )
}
