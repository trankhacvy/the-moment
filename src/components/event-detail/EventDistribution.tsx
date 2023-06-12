import { Button } from "@/components/ui/Button"
import { DistributeEventModal } from "../DistributeEventModal"

type EventDistributionProps = {
  eventId: string
}

export const EventDistribution = ({ eventId }: EventDistributionProps) => {
  const hasDistribution = false

  if (!hasDistribution) {
    return (
      <div className="flex items-center justify-center p-6">
        <DistributeEventModal eventId={eventId} trigger={<Button>Distribute your POAP</Button>} onSuccess={() => {}} />
      </div>
    )
  }

  return <div className="mt-10 flex h-40 gap-6 bg-red-400"></div>
}
