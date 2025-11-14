import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react'

export function MetricsCard({
  title,
  value,
  trend,
  icon
}) {
  return (
    (<Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-4 w-4 text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <p className="flex items-center text-xs text-muted-foreground">
            {trend.isPositive ? (
              <ArrowUpIcon className="mr-1 h-4 w-4 text-green-500" />
            ) : (
              <ArrowDownIcon className="mr-1 h-4 w-4 text-red-500" />
            )}
            <span className={trend.isPositive ? "text-green-500" : "text-red-500"}>
              {trend.value}%
            </span>
            <span className="ml-1">from last month</span>
          </p>
        )}
      </CardContent>
    </Card>)
  );
}

