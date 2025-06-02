import React, { useState, useMemo } from "react";
import Button from "../UI/Button";
import SeniorCitizenForm from "./SeniorCitizenForm";
import Modal from "../UI/Modal"; // This will be your smaller modal
import Modal2 from "../UI/Modal2"; // This is your larger modal for the form
import { Search, Plus, Pencil, Trash, ArrowDown, ArrowUp } from "lucide-react";

const SeniorCitizen = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCitizen, setSelectedCitizen] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBarangay, setFilterBarangay] = useState("All Barangays");
  const [filterHealthStatus, setFilterHealthStatus] =
    useState("All Health Status");
  const [sortBy, setSortBy] = useState("name"); // 'name', 'age', 'gender', 'barangay'
  const [sortOrder, setSortOrder] = useState("asc"); // 'asc' or 'desc'

  // Mock data for senior citizens (keep this as is)
  const [seniorCitizens, setSeniorCitizens] = useState([
    {
      id: 1,
      name: "Maria Santos",
      age: 67,
      gender: "Female",
      address: "Brgy. Poblacion",
      contact: "09123456789",
      healthStatus: "Good",
      firstName: "Maria",
      lastName: "Santos",
      middleName: "Dela",
      suffix: "",
      birthdate: "1958-01-15",
      civilStatus: "Widowed",
      religion: "Catholic",
      bloodType: "O+",
      houseNumberStreet: "123 Main St.",
      barangay: "Poblacion 1",
      municipality: "San Jose",
      province: "Occidental Mindoro",
      zipCode: "5100",
      mobileNumber: "09123456789",
      telephoneNumber: "",
      emailAddress: "maria.santos@example.com",
      validIdType: "UMID",
      validIdNumber: "123-456-789",
      philSysId: "PH-1234567890",
      sssNumber: "01-1234567-8",
      gsisNumber: "",
      philhealthNumber: "00-123456789-0",
      tinNumber: "123-456-789-000",
      employmentStatus: "Retired",
      occupation: "Homemaker",
      highestEducation: "High School Graduate",
      classification: "Pensioner",
      monthlyPension: "8000",
      emergencyContactName: "Juanito Santos",
      emergencyContactRelationship: "Son",
      emergencyContactNumber: "09987654321",
      healthNotes: "Occasional mild arthritis.",
    },
    {
      id: 2,
      name: "Pedro Reyes",
      age: 72,
      gender: "Male",
      address: "Brgy. Labangan",
      contact: "09234567890",
      healthStatus: "With Maintenance Meds", // Updated to match options
      firstName: "Pedro",
      lastName: "Reyes",
      middleName: "Cruz",
      suffix: "",
      birthdate: "1953-03-20",
      civilStatus: "Married",
      religion: "Catholic",
      bloodType: "A+",
      houseNumberStreet: "456 Elm St.",
      barangay: "Labangan",
      municipality: "San Jose",
      province: "Occidental Mindoro",
      zipCode: "5100",
      mobileNumber: "09234567890",
      telephoneNumber: "043-1234567",
      emailAddress: "pedro.reyes@example.com",
      validIdType: "Driver's License",
      validIdNumber: "DR-1234567",
      philSysId: "PH-0987654321",
      sssNumber: "02-2345678-9",
      gsisNumber: "",
      philhealthNumber: "00-234567890-1",
      tinNumber: "234-567-890-001",
      employmentStatus: "Retired",
      occupation: "Farmer",
      highestEducation: "Elementary Graduate",
      classification: "Pensioner",
      monthlyPension: "5000",
      emergencyContactName: "Maria Reyes",
      emergencyContactRelationship: "Wife",
      emergencyContactNumber: "09170000000",
      healthNotes: "Hypertension, takes medication daily.",
    },
    {
      id: 3,
      name: "Juan Dela Cruz",
      age: 65,
      gender: "Male",
      address: "Brgy. San Roque",
      contact: "09345678901",
      healthStatus: "Good",
      firstName: "Juan",
      lastName: "Dela Cruz",
      middleName: "Santos",
      suffix: "",
      birthdate: "1960-07-01",
      civilStatus: "Married",
      religion: "Catholic",
      bloodType: "B+",
      houseNumberStreet: "789 Pine Ave.",
      barangay: "San Roque",
      municipality: "San Jose",
      province: "Occidental Mindoro",
      zipCode: "5100",
      mobileNumber: "09345678901",
      telephoneNumber: "",
      emailAddress: "",
      validIdType: "Voter's ID",
      validIdNumber: "VM-123456",
      philSysId: "PH-1357924680",
      sssNumber: "03-3456789-0",
      gsisNumber: "",
      philhealthNumber: "00-345678901-2",
      tinNumber: "345-678-901-002",
      employmentStatus: "Self-Employed",
      occupation: "Vendor",
      highestEducation: "High School Level",
      classification: "Working Senior",
      monthlyPension: "0",
      emergencyContactName: "Ana Dela Cruz",
      emergencyContactRelationship: "Daughter",
      emergencyContactNumber: "09991112222",
      healthNotes: "No known major health issues.",
    },
    {
      id: 4,
      name: "Elena Magtanggol",
      age: 70,
      gender: "Female",
      address: "Brgy. Pag-asa",
      contact: "09456789012",
      healthStatus: "With Maintenance Meds", // Updated to match options
      firstName: "Elena",
      lastName: "Magtanggol",
      middleName: "Garcia",
      suffix: "",
      birthdate: "1955-09-10",
      civilStatus: "Single",
      religion: "Christian",
      bloodType: "AB-",
      houseNumberStreet: "101 Oak St.",
      barangay: "Pag-asa",
      municipality: "San Jose",
      province: "Occidental Mindoro",
      zipCode: "5100",
      mobileNumber: "09456789012",
      telephoneNumber: "",
      emailAddress: "elena.m@example.com",
      validIdType: "Passport",
      validIdNumber: "P1234567",
      philSysId: "PH-2468013579",
      sssNumber: "04-4567890-1",
      gsisNumber: "200012345678",
      philhealthNumber: "00-456789012-3",
      tinNumber: "456-789-012-003",
      employmentStatus: "Retired",
      occupation: "Teacher",
      highestEducation: "College Graduate",
      classification: "Pensioner",
      monthlyPension: "15000",
      emergencyContactName: "Roberto Magtanggol",
      emergencyContactRelationship: "Nephew",
      emergencyContactNumber: "09088889999",
      healthNotes: "Diabetes, controlled by diet and medication.",
    },
    {
      id: 5,
      name: "Ricardo Dalisay",
      age: 68,
      gender: "Male",
      address: "Brgy. Rizal",
      contact: "09567890123",
      healthStatus: "Needs Medical Attention", // Updated to match options
      firstName: "Ricardo",
      lastName: "Dalisay",
      middleName: "Lopez",
      suffix: "Sr.",
      birthdate: "1957-02-28",
      civilStatus: "Married",
      religion: "Catholic",
      bloodType: "O-",
      houseNumberStreet: "202 Maple Lane",
      barangay: "Rizal",
      municipality: "San Jose",
      province: "Occidental Mindoro",
      zipCode: "5100",
      mobileNumber: "09567890123",
      telephoneNumber: "",
      emailAddress: "",
      validIdType: "PRC ID",
      validIdNumber: "0012345",
      philSysId: "PH-9753108642",
      sssNumber: "05-5678901-2",
      gsisNumber: "",
      philhealthNumber: "00-567890123-4",
      tinNumber: "567-890-123-004",
      employmentStatus: "Unemployed",
      occupation: "Former Carpenter",
      highestEducation: "Elementary Level",
      classification: "Indigent",
      monthlyPension: "0",
      emergencyContactName: "Flora Dalisay",
      emergencyContactRelationship: "Wife",
      emergencyContactNumber: "09151234567",
      healthNotes: "Mild heart condition, needs regular check-ups.",
    },
  ]);

  const handleEdit = (citizen) => {
    setSelectedCitizen(citizen);
    setShowEditModal(true);
  };

  const handleDelete = (citizen) => {
    setSelectedCitizen(citizen);
    setShowDeleteModal(true);
  };

  const handleFormSubmit = (formData) => {
    if (formData.id) {
      // Editing existing citizen
      setSeniorCitizens((prevCitizens) =>
        prevCitizens.map((citizen) =>
          citizen.id === formData.id ? { ...citizen, ...formData } : citizen
        )
      );
    } else {
      // Adding new citizen
      const newId = Math.max(...seniorCitizens.map((c) => c.id), 0) + 1;
      setSeniorCitizens((prevCitizens) => [
        ...prevCitizens,
        {
          id: newId,
          ...formData,
          name: `${formData.firstName} ${formData.lastName}`,
        }, // Update name for display
      ]);
    }
    setShowAddModal(false);
    setShowEditModal(false);
    setSelectedCitizen(null);
  };

  const handleDeleteConfirm = () => {
    setSeniorCitizens((prevCitizens) =>
      prevCitizens.filter((citizen) => citizen.id !== selectedCitizen.id)
    );
    setShowDeleteModal(false);
    setSelectedCitizen(null);
  };

  // Memoized filtered and sorted citizens
  const filteredAndSortedCitizens = useMemo(() => {
    let filteredCitizens = [...seniorCitizens];

    // Apply search term
    if (searchTerm) {
      filteredCitizens = filteredCitizens.filter((citizen) =>
        Object.values(citizen).some((value) =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Apply barangay filter
    if (filterBarangay !== "All Barangays") {
      filteredCitizens = filteredCitizens.filter(
        (citizen) => citizen.barangay === filterBarangay
      );
    }

    // Apply health status filter
    if (filterHealthStatus !== "All Health Status") {
      filteredCitizens = filteredCitizens.filter(
        (citizen) => citizen.healthStatus === filterHealthStatus
      );
    }

    // Apply sorting
    filteredCitizens.sort((a, b) => {
      let comparison = 0;
      if (sortBy === "name") {
        const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
        const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
        if (nameA > nameB) {
          comparison = 1;
        } else if (nameA < nameB) {
          comparison = -1;
        }
      } else if (sortBy === "age") {
        comparison = a.age - b.age;
      } else if (sortBy === "gender") {
        if (a.gender > b.gender) {
          comparison = 1;
        } else if (a.gender < b.gender) {
          comparison = -1;
        }
      } else if (sortBy === "barangay") {
        if (a.barangay > b.barangay) {
          comparison = 1;
        } else if (a.barangay < b.barangay) {
          comparison = -1;
        }
      }

      return sortOrder === "asc" ? comparison : comparison * -1;
    });

    return filteredCitizens;
  }, [
    seniorCitizens,
    searchTerm,
    filterBarangay,
    filterHealthStatus,
    sortBy,
    sortOrder,
  ]);

  const toggleSortOrder = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const barangayOptions = [
    "All Barangays",
    "Adela",
    "Bagong Sikat",
    "Bangkal",
    "Central",
    "F. Balagtas",
    "Ilik",
    "Labangan",
    "Magsaysay",
    "Maibara",
    "Malasin",
    "Mangarin",
    "Mapaya",
    "Murtha",
    "Pag-asa",
    "Pandurucan",
    "Pinagturilan",
    "Poblacion 1",
    "Poblacion 2",
    "Poblacion 3",
    "Poblacion 4",
    "Rizal",
    "San Isidro",
    "San Roque",
    "Santo Niño",
    "Tadyawan",
    "Tamao",
    "Tuban",
  ];

  const healthStatusOptions = [
    "All Health Status",
    "Good",
    "With Maintenance Meds",
    "Needs Medical Attention",
    "Bedridden",
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Senior Citizen List</h1>
        <Button
          onClick={() => setShowAddModal(true)}
          variant="primary"
          icon={<Plus className="h-4 w-4 mr-2" />}
        >
          Add New Senior Citizen
        </Button>
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search senior citizens..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
          <div className="flex space-x-2">
            <select
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={filterBarangay}
              onChange={(e) => setFilterBarangay(e.target.value)}
            >
              {barangayOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <select
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={filterHealthStatus}
              onChange={(e) => setFilterHealthStatus(e.target.value)}
            >
              {healthStatusOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => toggleSortOrder("name")}
                >
                  <div className="flex items-center">
                    Name
                    {sortBy === "name" &&
                      (sortOrder === "asc" ? (
                        <ArrowUp className="h-4 w-4 ml-1" />
                      ) : (
                        <ArrowDown className="h-4 w-4 ml-1" />
                      ))}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => toggleSortOrder("age")}
                >
                  <div className="flex items-center">
                    Age
                    {sortBy === "age" &&
                      (sortOrder === "asc" ? (
                        <ArrowUp className="h-4 w-4 ml-1" />
                      ) : (
                        <ArrowDown className="h-4 w-4 ml-1" />
                      ))}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => toggleSortOrder("gender")}
                >
                  <div className="flex items-center">
                    Gender
                    {sortBy === "gender" &&
                      (sortOrder === "asc" ? (
                        <ArrowUp className="h-4 w-4 ml-1" />
                      ) : (
                        <ArrowDown className="h-4 w-4 ml-1" />
                      ))}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => toggleSortOrder("barangay")}
                >
                  <div className="flex items-center">
                    Address
                    {sortBy === "barangay" &&
                      (sortOrder === "asc" ? (
                        <ArrowUp className="h-4 w-4 ml-1" />
                      ) : (
                        <ArrowDown className="h-4 w-4 ml-1" />
                      ))}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Health Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAndSortedCitizens.map((citizen) => (
                <tr key={citizen.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">
                      {`${citizen.firstName} ${
                        citizen.middleName ? citizen.middleName + " " : ""
                      }${citizen.lastName} ${
                        citizen.suffix ? citizen.suffix : ""
                      }`}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {citizen.age}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {citizen.gender}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {`${citizen.houseNumberStreet}, Brgy. ${citizen.barangay}, ${citizen.municipality}, ${citizen.province}`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {citizen.mobileNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        citizen.healthStatus === "Good"
                          ? "bg-green-100 text-green-800"
                          : citizen.healthStatus === "With Maintenance Meds"
                          ? "bg-blue-100 text-blue-800"
                          : citizen.healthStatus === "Needs Medical Attention"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800" // For Bedridden
                      }`}
                    >
                      {citizen.healthStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(citizen)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Pencil className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(citizen)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Previous
            </button>
            <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to{" "}
                <span className="font-medium">
                  {filteredAndSortedCitizens.length}
                </span>{" "}
                of <span className="font-medium">{seniorCitizens.length}</span>{" "}
                results
              </p>
            </div>
            <div>
              <nav
                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span className="sr-only">Previous</span>
                  Previous
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  1
                </button>
                <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span className="sr-only">Next</span>
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* --- Add Senior Citizen Modal (using Modal2 for larger form) --- */}
      <Modal2 // Use Modal2 for the form
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Register New Senior Citizen"
      >
        <SeniorCitizenForm onSubmit={handleFormSubmit} />
      </Modal2>

      {/* --- Edit Senior Citizen Modal (using Modal2 for larger form) --- */}
      <Modal2 // Use Modal2 for the form
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Senior Citizen Record"
      >
        {/* Pass selectedCitizen to pre-fill the form */}
        <SeniorCitizenForm
          citizen={selectedCitizen}
          onSubmit={handleFormSubmit}
        />
      </Modal2>

      {/* --- Delete Confirmation Modal (using the smaller Modal) --- */}
      <Modal // Use the regular Modal for the confirmation
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirm Deletion"
      >
        <div className="p-6">
          <p className="mb-4 text-gray-700">
            Are you sure you want to delete the record for{" "}
            <span className="font-semibold text-red-600">
              {selectedCitizen
                ? `${selectedCitizen.firstName} ${selectedCitizen.lastName}`
                : "this citizen"}
            </span>
            ? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SeniorCitizen;
