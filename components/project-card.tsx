import { Card } from '@/components/ui/card'
import { TechStackChart, TechItem } from '@/components/tech-stack-chart'

interface ProjectCardProps {
  title: string
  description: React.ReactNode
  videoUrl: string
  reverse?: boolean
  aspectRatio?: 'landscape' | 'portrait'
  techStack?: TechItem[]
  chartPosition?: 'left' | 'right'
}

export function ProjectCard({
  title,
  description,
  videoUrl,
  reverse = false,
  aspectRatio = 'landscape',
  techStack,
  chartPosition = 'right'
}: ProjectCardProps) {
  // Portrait aspect ratio for iPhone 15 Pro recordings (9:19.5), landscape for standard (16:9)
  const aspectClass = aspectRatio === 'portrait' ? 'aspect-[9/19.5]' : 'aspect-video'

  // For landscape: video and text split 50/50, with chart below text
  // For portrait: video is smaller, content area is flex-1
  // The chart appears on the opposite side of the text (where there isn't content)

  if (aspectRatio === 'portrait') {
    // Portrait layout: video | text + chart (stacked)
    return (
      <div className={`flex flex-col ${reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-8 lg:gap-12 items-center`}>
        <div className="w-48 sm:w-56 md:w-64 lg:w-52 xl:w-64">
          <Card className="overflow-hidden border-border bg-card">
            <video
              src={videoUrl}
              controls
              className={`w-full ${aspectClass} object-contain bg-black`}
            >
              Your browser does not support the video tag.
            </video>
          </Card>
        </div>
        <div className="flex-1 flex flex-col lg:flex-row gap-8 items-center">
          <div className="flex-1 space-y-4">
            <h3 className="text-3xl font-bold text-balance">{title}</h3>
            <p className="text-muted-foreground text-lg leading-relaxed">{description}</p>
          </div>
          {techStack && techStack.length > 0 && (
            <div className="w-full lg:w-64 xl:w-72 shrink-0">
              <TechStackChart data={techStack} title="Tech Stack" />
            </div>
          )}
        </div>
      </div>
    )
  }

  // Landscape layout with chart position control
  // Chart appears to the left or right of text
  const chartComponent = techStack && techStack.length > 0 && (
    <div className="w-48 shrink-0">
      <TechStackChart data={techStack} title="Tech Stack" />
    </div>
  )

  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
      {/* Video side */}
      <div className={`w-full lg:w-1/2 ${reverse ? 'lg:order-2' : 'lg:order-1'}`}>
        <Card className="overflow-hidden border-border bg-card">
          <video
            src={videoUrl}
            controls
            className={`w-full ${aspectClass} object-contain bg-black`}
          >
            Your browser does not support the video tag.
          </video>
        </Card>
      </div>

      {/* Text + Chart side - chart positioned horizontally relative to text */}
      <div className={`w-full lg:w-1/2 ${reverse ? 'lg:order-1' : 'lg:order-2'} flex flex-col lg:flex-row gap-6 items-center`}>
        {chartPosition === 'left' && chartComponent}
        <div className="flex-1 space-y-4">
          <h3 className="text-3xl font-bold text-balance">{title}</h3>
          <p className="text-muted-foreground text-lg leading-relaxed">{description}</p>
        </div>
        {chartPosition === 'right' && chartComponent}
      </div>
    </div>
  )
}

