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

const UsersPage = () => (
  <Card className="shadow-lg">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-2xl font-bold">User Management</CardTitle>
      <Users className="h-6 w-6 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <p className="text-sm text-muted-foreground mb-4">
        View, edit, and manage user roles and permissions seamlessly.
      </p>
      <div className="rounded-md border">
        <table className="w-full caption-bottom text-sm">
          <thead className="[&_tr]:border-b">
            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                Name
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                Email
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                Role
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                Status
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <td className="p-4 align-middle">John Doe</td>
              <td className="p-4 align-middle">john@example.com</td>
              <td className="p-4 align-middle">Admin</td>
              <td className="p-4 align-middle">
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800"
                >
                  Active
                </Badge>
              </td>
              <td className="p-4 align-middle">
                <Button variant="outline" size="sm">
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="ml-2">
                  Deactivate
                </Button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </CardContent>
  </Card>
);

export default UsersPage;
