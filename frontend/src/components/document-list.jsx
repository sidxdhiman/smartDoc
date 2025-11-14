import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FileText,
  MoreHorizontal,
  Download,
  Share2,
  Eye,
  CheckCircle2,
  Shield,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function DocumentList({ documents }) {
  return (
    <div className="rounded-xl border bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-semibold">Document Type</TableHead>
            <TableHead className="font-semibold">Recipient</TableHead>
            <TableHead className="font-semibold">Issued On</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold">Verification</TableHead>
            <TableHead className="text-right font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((doc) => (
            <TableRow
              key={doc.id}
              className="hover:bg-gray-50 transition-colors"
            >
              <TableCell>
                <div
                  onClick={() => window.open(doc.documentLink)}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <div className="bg-indigo-50 p-2 rounded-lg">
                    <FileText className="h-4 w-4 text-indigo-600" />
                  </div>
                  <span className="font-medium text-gray-900">{doc.type}</span>
                </div>
              </TableCell>

              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium text-gray-900">
                    {doc.recipient}
                  </span>
                </div>
              </TableCell>

              <TableCell>
                <span className="text-gray-600">{doc.issuedOn}</span>
              </TableCell>

              <TableCell>
                <Badge
                  variant={
                    doc.status === "approved"
                      ? "success"
                      : doc.status === "rejected"
                      ? "destructive"
                      : "default"
                  }
                  className="capitalize font-medium"
                >
                  {doc.status}
                </Badge>
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-3">
                  {doc.digitalCertificate === "issued" && (
                    <div className="flex items-center gap-1 text-green-600">
                      <CheckCircle2 className="h-4 w-4" />
                      <span className="text-sm">AI</span>
                    </div>
                  )}
                  {doc.verified === "true" && (
                    <div className="flex items-center gap-1 text-blue-600">
                      <Shield className="h-4 w-4" />
                      <span className="text-sm">Digitally Certified</span>
                    </div>
                  )}
                </div>
              </TableCell>

              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-8 w-8 p-0 hover:bg-gray-100"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem className="cursor-pointer">
                      <Eye className="h-4 w-4 mr-2" />
                      View details
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default DocumentList;
