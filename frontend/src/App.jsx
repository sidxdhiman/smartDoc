import React from "react";
import { motion } from "framer-motion";
import {
  FileText,
  RefreshCw,
  Brain,
  Database,
  User,
  Building,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

export const Navbar = () => (
  <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md shadow-lg z-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-20">
        <div className="flex items-center">
          <img
            src="https://img1.digitallocker.gov.in/assets/img/icons/National-Emblem.png"
            className="h-max w-10 border-r-2 mr-2 pr-2 border-black"
            alt="National Emblem"
          />
             <img
              src="/icon.png"
              className="h-max w-14  mr-2 pr-2"
              alt="Smartdoc logo"
            />
          <span className="ml-3 text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
            SmartDoc
          </span>
        </div>

        <div className="hidden md:flex items-center space-x-10">
          <a
            href="#features"
            className="text-gray-600 hover:text-blue-600 transition"
          >
            Features
          </a>
          <a
            href="#users"
            className="text-gray-600 hover:text-blue-600 transition"
          >
            Users
          </a>
          <a
            href="#documents"
            className="text-gray-600 hover:text-blue-600 transition"
          >
            Documents
          </a>
          <Link to="/login">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105">
              Get Started
            </button>
          </Link>
        </div>
      </div>
    </div>
  </nav>
);

const HeroSection = () => (
  <div className="pt-32 pb-24 bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row items-center justify-between">
        <motion.div
          className="lg:w-1/2 text-left lg:pr-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-8 leading-tight">
            Securely access and verify documents <br/>
            <span className="text-blue-600">Anytime</span><span className="text-blue-600">,</span> {" "}
            <span className="text-blue-600">Anywhere</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10">
          All in one Comprehensive document issuing and verification portal.
          </p>
          <div className="flex space-x-6">
            <Link to="/login">
              <motion.button
                className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center text-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
               Login
                <ArrowRight className="ml-2 h-5 w-5" />
              </motion.button>
            </Link><Link to="/signup">
            <motion.button
              className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg hover:bg-blue-50 transition duration-300 text-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Sign Up
            </motion.button></Link>
          </div>
        </motion.div>
        <motion.div
          className="lg:w-1/2 mt-12 lg:mt-0"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="relative">
            <div className="absolute -top-6 -left-6 w-72 h-72 bg-blue-200 rounded-full filter blur-3xl opacity-30"></div>
            <div className="absolute -bottom-6 -right-6 w-72 h-72 bg-indigo-200 rounded-full filter blur-3xl opacity-30"></div>
            <img
              src="/banner.jpg"
              alt="Document Security"
              className="relative rounded-2xl shadow-2xl transform hover:scale-105 transition duration-500"
            />
          </div>
        </motion.div>
      </div>
    </div>
  </div>
);

const FeatureCard = ({ icon: Icon, title, description }) => (
  <motion.div
    className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition duration-300"
    whileHover={{ y: -5 }}
  >
    <motion.div
      className="h-16 w-16 bg-blue-100 rounded-xl flex items-center justify-center mb-6"
      whileHover={{ rotate: 360 }}
      transition={{ duration: 0.6 }}
    >
      <Icon className="h-8 w-8 text-blue-600" />
    </motion.div>
    <h3 className="text-xl font-semibold text-gray-900 mb-4">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </motion.div>
);

const FeaturesSection = () => (
  <div id="features" className="py-24 bg-white relative overflow-hidden">
    <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-100 rounded-full filter blur-3xl opacity-30"></div>
    <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-100 rounded-full filter blur-3xl opacity-30"></div>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Experience the next generation of document management with our
          cutting-edge features
        </p>
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <FeatureCard
          icon={RefreshCw}
          title="Secure Document Transfer"
          description="Transfer documents securely between organizations and individuals with end-to-end encryption and real-time tracking."
        />
        <FeatureCard
          icon={FileText}
          title="Comprehensive Support"
          description="Handle all types of documents from ID cards to passports with our versatile platform designed for maximum compatibility."
        />
        <FeatureCard
          icon={Brain}
          title="AI-Powered OCR"
          description="Advanced AI technology detects document tampering and verifies authenticity with unprecedented accuracy."
        />
        <FeatureCard
          icon={CheckCircle}
          title="Cross Verification"
          description="Verify documents across multiple trusted sources to ensure complete authenticity and compliance."
        />
        <FeatureCard
          icon={Database}
          title="Blockchain Storage"
          description="Immutable and secure document storage using advanced blockchain technology for ultimate security."
        />
        {/* <motion.div className="relative" whileHover={{ scale: 1.05 }}>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl transform rotate-1"></div>
           <div className="relative bg-white p-8 rounded-2xl shadow-lg">
            <img
              src="/placeholder.svg?height=200&width=400"
              alt="Security Features"
              className="rounded-lg mb-6"
            />
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Enterprise Security
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Military-grade encryption and security protocols to protect your
              sensitive documents.
            </p>
          </div> 
        </motion.div> */}
      </div>
    </div>
  </div>
);

const UserTypeCard = ({ icon: Icon, title, description, image }) => (
  <motion.div
    className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition duration-300"
    whileHover={{ y: -5 }}
  >
    <motion.div
      className="h-20 w-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6"
      whileHover={{ rotate: 360 }}
      transition={{ duration: 0.6 }}
    >
      <Icon className="h-10 w-10 text-blue-600" />
    </motion.div>
    {/* <img
      src={image}
      alt={title}
      className="w-full h-40 object-cover rounded-xl mb-6"
    /> */}
    <h3 className="text-2xl font-semibold text-gray-900 mb-4">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </motion.div>
);

const UsersSection = () => (
  <div id="users" className="py-24 bg-gray-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-4xl font-bold mb-4">Who Can Use SmartDoc?</h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Our platform is designed to serve various user needs with specialized
          features
        </p>
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <UserTypeCard
          icon={User}
          title="Individuals"
          description="Store and share your personal documents securely. Control who can access your information with advanced privacy settings."
          image="/placeholder.svg?height=200&width=400"
        />
        <UserTypeCard
          icon={Building}
          title="Document Issuers"
          description="Issue tamper-proof digital documents with blockchain verification and maintain complete audit trails."
          image="/placeholder.svg?height=200&width=400"
        />
        <UserTypeCard
          icon={CheckCircle}
          title="Verifiers"
          description="Quickly verify document authenticity with our advanced verification tools and automated compliance checks."
          image="/placeholder.svg?height=200&width=400"
        />
      </div>
    </div>
  </div>
);

const DocumentTypesSection = () => (
  <div id="documents" className="py-24 bg-white relative overflow-hidden">
    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-50/50 to-transparent"></div>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold mb-4">Documents We Handle</h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Comprehensive support for all your document verification needs
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[
          "ID Cards",
          "Birth Certificates",
        ].map((doc, index) => (
          <motion.div
            key={index}
            className="bg-white p-4 rounded-lg shadow-md text-center"
            whileHover={{
              y: -5,
              boxShadow: "0 10px 30px -15px rgba(0, 0, 0, 0.3)",
            }}
          >
            <FileText className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-gray-800">{doc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
);

const CallToAction = () => (
  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 py-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row items-center justify-between">
        <div className="text-white mb-8 lg:mb-0">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Secure Your Documents?
          </h2>
          <p className="text-xl">
            Join thousands of users who trust SmartDoc for their document
            security needs.
          </p>
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link to="/signup">
            <button className="bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-blue-50 transition duration-300 text-lg font-semibold flex items-center">
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </Link>
        </motion.div>
      </div>
    </div>
  </div>
);

const HomePage = () => (
  <div className="min-h-screen">
    <Navbar />
    <HeroSection />
    <FeaturesSection />
    <UsersSection />
    <DocumentTypesSection />
    <CallToAction />
  </div>
);

export default HomePage;
