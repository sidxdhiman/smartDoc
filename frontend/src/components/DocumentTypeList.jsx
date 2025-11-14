import React from "react";
import {
  Briefcase,
  FileText,
  Book,
  FileCheck,
  ScrollText,
  CreditCard,
  Package,
  Car,
  Truck,
  Calendar,
  Folder,
  Users,
} from "lucide-react";
import DocumentTypeCard from "./DocumentTypeCard";

const categorizedDocumentTypes = [
  {
    category: "Identity Documents",
    documents: [
      { icon: FileCheck, title: "Passport" },
      { icon: FileCheck, title: "ID Card" },
      { icon: FileCheck, title: "Driver’s License" },
      { icon: FileCheck, title: "Residence Permit" },
    ],
  },
  {
    category: "Financial Documents",
    documents: [
      { icon: CreditCard, title: "Bank Statement" },
      { icon: CreditCard, title: "Tax Statement" },
      { icon: FileText, title: "Balance Sheet" },
    ],
  },
  {
    category: "Legal Documents",
    documents: [
      { icon: Briefcase, title: "Contracts" },
      { icon: FileText, title: "Rental Agreements" },
      { icon: FileText, title: "Permits" },
    ],
  },
  {
    category: "Educational Documents",
    documents: [
      { icon: Book, title: "Diplomas" },
      { icon: FileText, title: "Transcripts" },
      { icon: ScrollText, title: "Certificates" },
    ],
  },
  {
    category: "Logistics Documents",
    documents: [
      { icon: Truck, title: "Bill of Lading" },
      { icon: Calendar, title: "Export License" },
      { icon: Folder, title: "Certificate of Origin" },
    ],
  },
  {
    category: "HR Documents",
    documents: [
      { icon: Users, title: "Resumes (CV)" },
      { icon: FileText, title: "Motivational Letter" },
      { icon: FileText, title: "Certificates of Conduct" },
    ],
  },
  {
    category: "Medical Documents",
    documents: [
      { icon: FileText, title: "Health Insurance Card" },
      { icon: FileText, title: "Medical Prescription" },
    ],
  },
  {
    category: "Automotive Documents",
    documents: [
      { icon: Car, title: "Car Title" },
      { icon: FileText, title: "Vehicle Registration Application" },
    ],
  },
];

const DocumentTypeList = () => {
  return (
    <div className="space-y-12">
      {categorizedDocumentTypes.map((category, index) => (
        <div key={index}>
          <h2 className="text-2xl font-bold mb-6">{category.category}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {category.documents.map((doc, docIndex) => (
              <DocumentTypeCard key={docIndex} icon={doc.icon} title={doc.title} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DocumentTypeList;
