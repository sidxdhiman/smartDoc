import React from "react";
import { FileText, Briefcase } from "lucide-react";

const availableDocuments = [
  {
    title: "ID Card",
    description: "Your official identification card for all purposes.",
    icon: <FileText className="text-indigo-600 w-8 h-8" />,
  },
  {
    title: "Experience Certificate",
    description: "Issued by your organization to validate your tenure.",
    icon: <Briefcase className="text-indigo-600 w-8 h-8" />,
  },
];

const AvailableDocuments = () => {
  return (
    <section className="bg-white rounded-2xl shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Available Documents
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {availableDocuments.map((doc, index) => (
          <div
            key={index}
            className="flex items-start bg-gray-50 p-4 rounded-xl hover:shadow-lg transition-shadow"
          >
            <div className="flex-shrink-0">{doc.icon}</div>
            <div className="ml-4">
              <h3 className="font-semibold text-gray-900">{doc.title}</h3>
              <p className="text-sm text-gray-600">{doc.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AvailableDocuments;
