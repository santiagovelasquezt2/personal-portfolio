'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

export interface TechItem {
    name: string
    value: number
    color: string
}

interface TechStackChartProps {
    data: TechItem[]
    title?: string
}

// Custom tooltip component
const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number; payload: TechItem }> }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload
        return (
            <div className="bg-background/95 backdrop-blur-sm border border-border rounded-lg px-3 py-2 shadow-lg">
                <p className="font-medium text-foreground">{data.name}</p>
                <p className="text-sm text-muted-foreground">{data.value}%</p>
            </div>
        )
    }
    return null
}

// Custom legend component
const CustomLegend = ({ payload }: { payload?: Array<{ value: string; color: string }> }) => {
    if (!payload) return null

    return (
        <div className="flex flex-wrap justify-center gap-3 mt-4">
            {payload.map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                    <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-sm text-muted-foreground">{entry.value}</span>
                </div>
            ))}
        </div>
    )
}

export function TechStackChart({ data, title }: TechStackChartProps) {
    return (
        <div className="flex flex-col items-center w-full">
            {title && (
                <h4 className="text-lg font-semibold text-muted-foreground mb-2">{title}</h4>
            )}
            <div className="w-full h-72 pt-2">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart margin={{ top: 10, right: 0, bottom: 0, left: 0 }}>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="45%"
                            innerRadius={50}
                            outerRadius={80}
                            paddingAngle={3}
                            dataKey="value"
                            animationBegin={0}
                            animationDuration={800}
                            animationEasing="ease-out"
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.color}
                                    stroke="transparent"
                                    className="hover:opacity-80 transition-opacity cursor-pointer"
                                />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend content={<CustomLegend />} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
