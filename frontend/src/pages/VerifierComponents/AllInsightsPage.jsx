import {
    FileText,
    Bell,
    Home,
    BarChart2,
    Users,
    Zap,
    Shield,
    ChevronRight,
    Clock,
    CheckCircle,
    XCircle,
  } from "lucide-react";
  import { Badge } from "@/components/ui/badge";
  import { Button } from "@/components/ui/button";
  import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
  } from "@/components/ui/card";
  import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
  import { ScrollArea } from "@/components/ui/scroll-area";
  import { Progress } from "@/components/ui/progress";

const AIInsightsPage = () => (
  <Card className="shadow-lg">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-2xl font-bold">AI Insights</CardTitle>
      <Zap className="h-6 w-6 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <p className="text-sm text-muted-foreground mb-4">
        Discover AI-powered insights to optimize processes and enhance
        efficiency.
      </p>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Fraud Detection Accuracy
            </CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground">+2% from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Document Processing Time
            </CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.2 sec</div>
            <p className="text-xs text-muted-foreground">
              -0.5 sec from last week
            </p>
          </CardContent>
        </Card>
      </div>
    </CardContent>
  </Card>
);

export default AIInsightsPage;
