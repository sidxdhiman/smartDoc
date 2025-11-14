import {
    FileText,
    ChevronRight,
  } from "lucide-react";
  import { Badge } from "@/components/ui/badge";
  import { Button } from "@/components/ui/button";
  import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
const VerifiedDocumentsPage = () => (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">Verified Documents</CardTitle>
        <FileText className="h-6 w-6 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Explore and manage documents that have been verified.
        </p>
        <div className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between py-2">
              <CardTitle className="text-lg font-semibold">Student ID</CardTitle>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Verified
              </Badge>
            </CardHeader>
            <CardContent className="pt-2">
              <dl className="grid grid-cols-1 gap-1 text-sm">
                <div className="flex justify-between">
                  <dt className="font-medium text-muted-foreground">Owner:</dt>
                  <dd>Raghav sharma</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-medium text-muted-foreground">
                    Issued On:
                  </dt>
                  <dd>December 5, 2024</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-medium text-muted-foreground">
                    Issuing Authority:
                  </dt>
                  <dd>Dronacharya College of Engineering</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-medium text-muted-foreground">
                    Digital Certificate:
                  </dt>
                  <dd>Issued</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-medium text-muted-foreground">
                    AI Verified:
                  </dt>
                  <dd>Yes</dd>
                </div>
              </dl>
              <Button variant="link" className="mt-2 p-0">
                View Document
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );

  export default VerifiedDocumentsPage