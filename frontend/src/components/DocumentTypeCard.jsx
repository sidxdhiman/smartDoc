const DocumentTypeCard = ({ icon: Icon, title }) => (
  <div className="flex items-center p-6 bg-white rounded-xl hover:bg-blue-50 transition duration-300 transform hover:-translate-y-1 cursor-pointer shadow-md hover:shadow-lg">
    <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
      <Icon className="h-6 w-6 text-blue-600" />
    </div>
    <span className="text-lg text-gray-700 font-medium">{title}</span>
  </div>
);

export default DocumentTypeCard;
