// import React, { useState } from "react";
// import { useQuery, useMutation, gql } from "@apollo/client";
// import DataTable from 'react-data-table-component';
// import ConfigurableValues from "../../config/constants";
// import SearchBar from '../../components/TableHeader/SearchBar';
// import TableHeader from '../../components/TableHeader';
// import CustomLoader from '../../components/Loader/CustomLoader';

// // GraphQL Queries and Mutations
// const GET_BANNER_TEMPLATES = gql`
//   query GetBannerTemplates {
//     bannerTemplates {
//       _id
//       templateId
//       name
//       elements {
//         key
//         requiredTypes {
//           text
//           color
//           image
//           gradient
//         }
//       }
//     }
//   }
// `;

// const GET_BANNERS = gql`
//   query GetBanners {
//     banners {
//       _id
//       templateId
//       elements {
//         key
//         text
//         color
//         image
//         gradient
//       }
//     }
//   }
// `;

// const CREATE_BANNER = gql`
//   mutation CreateBanner($input: CreateBannerInput!) {
//     createBanner(input: $input) {
//       _id
//       templateId
//       elements {
//         key
//         text
//         color
//         image
//         gradient
//       }
//     }
//   }
// `;

// const UPDATE_BANNER = gql`
//   mutation UpdateBanner($id: ID!, $input: CreateBannerInput!) {
//     updateBanner(id: $id, input: $input) {
//       _id
//       templateId
//       elements {
//         key
//         text
//         color
//         image
//         gradient
//       }
//     }
//   }
// `;

// const DELETE_BANNER = gql`
//   mutation DeleteBanner($id: ID!) {
//     deleteBanner(id: $id)
//   }
// `;

// function BannerTemplate() {
//   const { CLOUDINARY_UPLOAD_URL, CLOUDINARY_FOOD } = ConfigurableValues(); // Get constants
//   const [formData, setFormData] = useState({});
//   const [previewData, setPreviewData] = useState({});
//   const [selectedTemplate, setSelectedTemplate] = useState(null);
//   const [editingBannerId, setEditingBannerId] = useState(null);
//   const [file, setFile] = useState(null); // State for the uploaded file
//   const [fileLoading, setFileLoading] = useState(false); // State for loading indicator
//   const [success, setSuccess] = useState('');
//   const [mainError, setMainError] = useState('');
//   const [searchQuery, setSearchQuery] = useState('');

//   // Fetch templates and banners
//   const { loading: templatesLoading, error: templatesError, data: templatesData } = useQuery(GET_BANNER_TEMPLATES);
//   const { loading: bannersLoading, error: bannersError, data: bannersData, refetch: refetchBanners } = useQuery(GET_BANNERS);

//   // Mutations
//   const [createBanner] = useMutation(CREATE_BANNER);
//   const [updateBanner] = useMutation(UPDATE_BANNER);
//   const [deleteBanner] = useMutation(DELETE_BANNER);

//   if (templatesLoading || bannersLoading) return <p>Loading...</p>;
//   if (templatesError || bannersError) return <p>Error: {templatesError?.message || bannersError?.message}</p>;

//   const templates = templatesData.bannerTemplates;
//   const banners = bannersData.banners;

//   // Handle input changes
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     setPreviewData((prev) => ({ ...prev, [name]: value }));
//   };

//   // Handle file upload
//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0];
//     if (selectedFile) {
//       const reader = new FileReader();
//       reader.onload = () => {
//         setFile(selectedFile); // Store the file for uploading
//         setPreviewData((prev) => ({ ...prev, image: reader.result })); // Preview the image
//       };
//       reader.readAsDataURL(selectedFile);
//     }
//   };

//   // Upload image to Cloudinary
//   const uploadImageToCloudinary = async() => {
//     if (!file) return ""; // If no file is selected, return an empty string

//     setFileLoading(true); // Show loading indicator while uploading
//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("upload_preset", CLOUDINARY_FOOD); // Use the preset from constants

//     try {
//       const response = await fetch(CLOUDINARY_UPLOAD_URL, {
//         method: "POST",
//         body: formData,
//       });
//       const imageData = await response.json();
//       return imageData.secure_url; // Return the uploaded image URL
//     } catch (error) {
//       console.error("Image upload error:", error);
//       return "";
//     } finally {
//       setFileLoading(false); // Hide loading indicator
//     }
//   };

//   // Save or update banner
//   const handleSave = async() => {
//     if (!selectedTemplate) {
//       alert("Please select a template.");
//       return;
//     }

//     const elements = selectedTemplate.elements.map((element) => {
//       const value = formData[element.key] || "";
//       const color = formData[`${element.key}Color`] || "";
//       const gradient = formData[`${element.key}Gradient`] || "";

//       const elementData = { key: element.key };

//       if (element.requiredTypes.text) {
//         elementData.text = value;
//       }
//       if (element.requiredTypes.color) {
//         elementData.color = color;
//       }
//       if (element.requiredTypes.gradient) {
//         elementData.gradient = gradient;
//       }
//       if (element.requiredTypes.image) {
//         elementData.image = value; // This will be the image URL after upload
//       }

//       return elementData;
//     });

//     const input = {
//       templateId: selectedTemplate.templateId,
//       elements,
//     };

//     // Check for required fields
//     const missingFields = selectedTemplate.elements.filter(element => {
//       return (element.requiredTypes.color && !formData[`${element.key}Color`]) ||
//              (element.requiredTypes.text && !formData[element.key]);
//     });

//     if (missingFields.length > 0) {
//       alert(`Missing required fields for: ${missingFields.map(field => field.key).join(", ")}`);
//       return;
//     }

//     try {
//       const imageUrl = await uploadImageToCloudinary(); // Upload image if a new one is selected
//       if (imageUrl) {
//         const imageElement = elements.find(el => el.key === "image");
//         if (imageElement) {
//           imageElement.image = imageUrl; // Update image URL in elements
//         }
//       }

//       console.log("Input for mutation:", input); // Log input for debugging

//       if (editingBannerId) {
//         await updateBanner({ variables: { id: editingBannerId, input } });
//         setEditingBannerId(null);
//         setSuccess("Banner updated successfully!");
//       } else {
//         await createBanner({ variables: { input } });
//         setSuccess("Banner created successfully!");
//       }

//       setFormData({});
//       setPreviewData({});
//       refetchBanners(); // Refresh the banners list
//     } catch (err) {
//       console.error("Error saving banner:", err);
//       setMainError("Failed to save banner.");
//     }
//   };

//   // Edit banner
//   const handleEdit = (banner) => {
//     const newFormData = {};
//     banner.elements.forEach((element) => {
//       if (element.text) newFormData[element.key] = element.text;
//       if (element.color) newFormData[`${element.key}Color`] = element.color;
//       if (element.gradient) newFormData[`${element.key}Gradient`] = element.gradient;
//       if (element.image) newFormData.image = element.image;
//     });
//     setFormData(newFormData);
//     setPreviewData(newFormData);
//     setEditingBannerId(banner._id);
//   };

//   // Delete banner
//   const handleDelete = async(id) => {
//     try {
//       await deleteBanner({ variables: { id} });
//       refetchBanners(); // Refresh the banners list
//       alert("Banner deleted successfully!");
//     } catch (err) {
//       console.error("Error deleting banner:", err);
//       alert("Failed to delete banner.");
//     }
//   };

//   // Search functionality
//   const filteredBanners = banners.filter(banner => 
//     banner.elements.some(el => 
//       el.text?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       el.color?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       el.gradient?.toLowerCase().includes(searchQuery.toLowerCase())
//     )
//   );

//   // Define columns for DataTable
//   const columns = [
//     {
//       name: 'ID',
//       selector: row => row._id,
//       sortable: true,
//     },
//     {
//       name: 'Template ID',
//       selector: row => row.templateId,
//       sortable: true,
//     },
//     {
//       name: 'Elements',
//       selector: row => row.elements.map(el => `${el.key}: ${el.text || el.color || el.gradient || "Image"}`).join(", "),
//     },
//     {
//       name: 'Image',
//       cell: row => (
//         row.elements.find(el => el.key === "image")?.image ? (
//           <img
//             src={row.elements.find(el => el.key === "image").image}
//             alt="Banner"
//             style={{ width: "100px", height: "100px", objectFit: "cover" }}
//           />
//         ) : null
//       ),
//     },
//     {
//       name: 'Actions',
//       cell: row => (
//         <>
//           <button
//             onClick={() => handleEdit(row)}
//             style={{
//               marginRight: "10px",
//               padding: "5px 10px",
//               backgroundColor: "#007bff",
//               color: "#fff",
//               border: "none",
//               borderRadius: "5px",
//               cursor: "pointer",
//             }}
//           >
//             Edit
//           </button>
//           <button
//             onClick={() => handleDelete(row._id)}
//             style={{
//               padding: "5px 10px",
//               backgroundColor: "#dc3545",
//               color: "#fff",
//               border: "none",
//               borderRadius: "5px",
//               cursor: "pointer",
//             }}
//           >
//             Delete
//           </button>
//         </>
//       ),
//     },
//   ];

//   return (
//     <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>

//       {/* Form and Live Preview Section */}
//       <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
//         {/* Form Section */}
//         <div style={{ flex: 1, marginRight: "20px" }}>
//           {/* Dropdown to select template */}
//           <div style={{ marginBottom: "20px" }}>
//             <label>
//               <strong>Select Template:</strong>
//             </label>
//             <select
//               onChange={(e) =>
//                 setSelectedTemplate(templates.find((t) => t._id === e.target.value))
//               }
//               style={{
//                 marginLeft: "10px",
//                 padding: "10px",
//                 borderRadius: "5px",
//                 border: "1px solid #ccc",
//               }}
//             >
//               <option value="">Select a template</option>
//               {templates.map((template) => (
//                 <option key={template._id} value={template._id}>
//                   {template.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Form Section */}
//           {selectedTemplate && (
//             <form
//               style={{
//                 display: "flex",
//                 flexDirection: "column",
//                 gap: "15px",
//               }}
//             >
//               {selectedTemplate.elements.map((element) => (
//                 <div key={element.key}>
//                   <label>
//                     <strong>{element.key}:</strong>
//                   </label>
//                   {element.requiredTypes.text && (
//                     <input
//                       type="text"
//                       name={element.key}
//                       value={formData[element.key] || ""}
//                       onChange={handleInputChange}
//                       placeholder={`Enter ${element.key}`}
//                       style={{
//                         marginLeft: "10px",
//                         padding: "10px",
//                         borderRadius: "5px",
//                         border: "1px solid #ccc",
//                         width: "300px",
//                       }}
//                     />
//                   )}
//                   {element.requiredTypes.color && (
//                     <input
//                       type="color"
//                       name={`${element.key}Color`} // Ensure the color input is named correctly
//                       value={formData[`${element.key}Color`] || "#000000"}
//                       onChange={handleInputChange}
//                       style={{ marginLeft: "10px" }}
//                     />
//                   )}
//                   {element.requiredTypes.image && (
//                     <input
//                       type="file"
//                       accept="image/*"
//                       onChange={handleFileChange}
//                       style={{ marginLeft: "10px" }}
//                     />
//                   )}
//                   {element.requiredTypes.gradient && (
//                     <input
//                       type="text"
//                       name={`${element.key}Gradient`}
//                       value={formData[`${element.key}Gradient`] || ""}
//                       onChange={handleInputChange}
//                       placeholder="Enter gradient (e.g., linear-gradient(...))"
//                       style={{
//                         marginLeft: "10px",
//                         padding: "10px",
//                         borderRadius: "5px",
//                         border: "1px solid #ccc",
//                         width: "300px",
//                       }}
//                     />
//                   )}
//                 </div>
//               ))}
//               <button
//                 type="button"
//                 onClick={handleSave}
//                 style={{
//                   padding: "10px 20px",
//                   width: "9rem",
//                   backgroundColor: "#FFB300",
//                   color: "#fff",
//                   border: "none",
//                   borderRadius: "5px",
//                   cursor: "pointer",
//                 }}
//               >
//                 {editingBannerId ? "Update Banner" : "Save Banner"}
//               </button>
//             </form>
//           )}
//         </div>

//         {/* Live Preview Section */}
//         <div
//           style={{
//             flex: 1,
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//             padding: "20px",
//             borderRadius: "10px",
//             background: previewData.backgroundGradient || "#f5f5f5",
//             border: "1px solid #ccc",
//           }}
//         >
//           {/* Text Content */}
//           <div style={{ flex: 1, paddingRight: "20px" }}>
//             <h3 style={{ color: previewData.titleColor || "#000", margin: 0 }}>
//               {previewData.title || "Title Preview"}
//             </h3>
//             <h4 style={{ color: previewData.highlightColor || "#000", margin: "10px 0" }}>
//               {previewData.highlight || "Highlight Preview"}
//             </h4>
//             <p style={{ color: previewData.contentColor || "#000", margin: 0 }}>
//               {previewData.content || "Content Preview"}
//             </p>
//           </div>

//           {/* Image */}
//           {previewData.image && (
//             <img
//               src={previewData.image}
//               alt="Preview"
//               style={{
//                 width: "200px",
//                 height: "200px",
//                 borderRadius: "10px",
//                 objectFit: "cover",
//               }}
//             />
//           )}
//         </div>
//       </div>

//       {/* DataTable Section */}
//       {/* <h3 >Saved Banners</h3> */}
//       <DataTable
//         subHeader={true}
//         subHeaderComponent={
//           <SearchBar
//             value={searchQuery}
//             onChange={e => setSearchQuery(e.target.value)}
//             onClick={() => refetchBanners()}
//           />
//         }
//         title={<TableHeader title="Saved Banners" />}
//         columns={columns}
//         data={filteredBanners}
//         pagination
//         progressPending={bannersLoading}
//         progressComponent={<CustomLoader />}
//         defaultSortField="ID"
//       />
//     </div>
//   );
// }

// export default BannerTemplate;


import React, { useState } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import DataTable from 'react-data-table-component';
import ConfigurableValues from "../../config/constants";
import SearchBar from '../../components/TableHeader/SearchBar';
import TableHeader from '../../components/TableHeader';
import CustomLoader from '../../components/Loader/CustomLoader';
import Tooltip from '@mui/material/Tooltip';
import './styles.css';

const GET_BANNER_TEMPLATES = gql`
  query GetBannerTemplates {
    bannerTemplates {
      _id
      templateId
      name
      elements {
        key
        requiredTypes {
          text
          color
          image
          gradient
        }
      }
    }
  }
`;

const GET_BANNERS = gql`
  query GetBanners {
    banners {
      _id
      templateId
      elements {
        key
        text
        color
        image
        gradient
      }
    }
  }
`;

const CREATE_BANNER = gql`
  mutation CreateBanner($input: CreateBannerInput!) {
    createBanner(input: $input) {
      _id
      templateId
      elements {
        key
        text
        color
        image
        gradient
      }
    }
  }
`;

const UPDATE_BANNER = gql`
  mutation UpdateBanner($id: ID!, $input: CreateBannerInput!) {
    updateBanner(id: $id, input: $input) {
      _id
      templateId
      elements {
        key
        text
        color
        image
        gradient
      }
    }
  }
`;

const DELETE_BANNER = gql`
  mutation DeleteBanner($id: ID!) {
    deleteBanner(id: $id)
  }
`;

function BannerTemplate() {
  const { CLOUDINARY_UPLOAD_URL, CLOUDINARY_FOOD } = ConfigurableValues(); // Get constants
  const [formData, setFormData] = useState({});
  const [previewData, setPreviewData] = useState({});
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [editingBannerId, setEditingBannerId] = useState(null);
  const [file, setFile] = useState(null); // State for the uploaded file
  const [fileLoading, setFileLoading] = useState(false); // State for loading indicator
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch templates and banners
  const { loading: templatesLoading, error: templatesError, data: templatesData } = useQuery(GET_BANNER_TEMPLATES);
  const { loading: bannersLoading, error: bannersError, data: bannersData, refetch: refetchBanners } = useQuery(GET_BANNERS);

  // Mutations
  const [createBanner] = useMutation(CREATE_BANNER);
  const [updateBanner] = useMutation(UPDATE_BANNER);
  const [deleteBanner] = useMutation(DELETE_BANNER);

  if (templatesLoading || bannersLoading) return <p>Loading...</p>;
  if (templatesError || bannersError) return <p>Error: {templatesError?.message || bannersError?.message}</p>;

  const templates = templatesData.bannerTemplates;
  const banners = bannersData.banners;

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setPreviewData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        setFile(selectedFile); // Store the file for uploading
        setPreviewData((prev) => ({ ...prev, image: reader.result })); // Preview the image
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  // Upload image to Cloudinary
  const uploadImageToCloudinary = async() => {
    if (!file) return ""; // If no file is selected, return an empty string

    setFileLoading(true); // Show loading indicator while uploading
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_FOOD); // Use the preset from constants

    try {
      const response = await fetch(CLOUDINARY_UPLOAD_URL, {
        method: "POST",
        body: formData,
      });
      const imageData = await response.json();
      return imageData.secure_url; // Return the uploaded image URL
    } catch (error) {
      console.error("Image upload error:", error);
      return "";
    } finally {
      setFileLoading(false); // Hide loading indicator
    }
  };

  // Save or update banner
  const handleSave = async() => {
    if (!selectedTemplate) {
      alert("Please select a template.");
      return;
    }

    const elements = selectedTemplate.elements.map((element) => {
      const value = formData[element.key] || "";
      const color = formData[`${element.key}Color`] || "";
      const gradient = formData[`${element.key}Gradient`] || "";

      const elementData = { key: element.key };

      if (element.requiredTypes.text) {
        elementData.text = value;
      }
      if (element.requiredTypes.color) {
        elementData.color = color;
      }
      if (element.requiredTypes.gradient) {
        elementData.gradient = gradient;
      }
      if (element.requiredTypes.image) {
        elementData.image = value; // This will be the image URL after upload
      }

      return elementData;
    });

    const input = {
      templateId: selectedTemplate.templateId,
      elements,
    };

    // Check for required fields
    const missingFields = selectedTemplate.elements.filter(element => {
      return (element.requiredTypes.color && !formData[`${element.key}Color`]) ||
             (element.requiredTypes.text && !formData[element.key]);
    });

    if (missingFields.length > 0) {
      alert(`Missing required fields for: ${missingFields.map(field => field.key).join(", ")}`);
      return;
    }

    try {
      const imageUrl = await uploadImageToCloudinary(); // Upload image if a new one is selected
      if (imageUrl) {
        const imageElement = elements.find(el => el.key === "image");
        if (imageElement) {
          imageElement.image = imageUrl; // Update image URL in elements
        }
      }

      console.log("Input for mutation:", input); // Log input for debugging

      if (editingBannerId) {
        await updateBanner({ variables: { id: editingBannerId, input } });
        setEditingBannerId(null);
        alert("Banner updated successfully!");
      } else {
        await createBanner({ variables: { input } });
        alert("Banner created successfully!");
      }

      setFormData({});
      setPreviewData({});
      refetchBanners(); // Refresh the banners list
    } catch (err) {
      console.error("Error saving banner:", err);
      alert("Failed to save banner.");
    }
  };

  // Edit banner
  const handleEdit = (banner) => {
    const newFormData = {};
    banner.elements.forEach((element) => {
      if (element.text) newFormData[element.key] = element.text;
      if (element.color) newFormData[`${element.key}Color`] = element.color;
      if (element.gradient) newFormData[`${element.key}Gradient`] = element.gradient;
      if (element.image) newFormData.image = element.image;
    });
    setFormData(newFormData);
    setPreviewData(newFormData);
    setEditingBannerId(banner._id);
  };

  // Delete banner
  const handleDelete = async(id) => {g
    try {
      await deleteBanner({ variables: { id } });
      refetchBanners();
      alert("Banner deleted successfully!");
    } catch (err) {
      console.error("Error deleting banner:", err);
      alert("Failed to delete banner.");
    }
  };

  // Search functionality
  const filteredBanners = banners.filter(banner =>
    banner.elements.some(el =>
      el.text?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      el.color?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      el.gradient?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // Define columns for DataTable
  const columns = [
    {
      name: 'ID',
      selector: row => row._id,
      sortable: true,
    },
    {
      name: 'Template ID',
      selector: row => row.templateId,
      sortable: true,
    },
    {
      name: 'Elements',
      selector: row => row.elements.map(el => `${el.key}: ${el.text || el.color || el.gradient || "Image"}`).join(", "),
      cell: row => (
        <Tooltip title={row.elements.map(el => `${el.key}: ${el.text || el.color || el.gradient || "Image"}`).join(", ")}>
          <span>{row.elements.map(el => `${el.key}: ${el.text || el.color || el.gradient || "Image"}`).join(", ")}</span>
        </Tooltip>
      ),
    },
    {
      name: 'Image',
      cell: row => (
        row.elements.find(el => el.key === "image")?.image ? (
          <img
            src={row.elements.find(el => el.key === "image").image}
            alt="Banner"
            style={{ width: "100px", height: "100px", objectFit: "cover" }}
          />
        ) : null
      ),
    },
    {
      name: 'Actions',
      cell: row => (
        <>
          <button
            onClick={() => handleEdit(row)}
            style={{
              marginRight: "10px",
              padding: "5px 10px",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(row._id)}
            style={{
              padding: "5px 10px",
              backgroundColor: "#dc3545",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Delete
          </button>
        </>
      ),
    },
  ];

  return (
    <div className="banner-template" style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      {/* Form and Live Preview Section */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        {/* Form Section */}
        <div style={{ flex: 1, marginRight: "20px" }}>
          {/* Dropdown to select template */}
          <div style={{ marginBottom: "20px" }}>
            <label>
              <strong>Select Template:</strong>
            </label>
            <select
              onChange={(e) =>
                setSelectedTemplate(templates.find((t) => t._id === e.target.value))
              }
              style={{
                marginLeft: "10px",
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            >
              <option value="">Select a template</option>
              {templates.map((template) => (
                <option key={template._id} value={template._id}>
                  {template.name}
                </option>
              ))}
            </select>
          </div>

          {/* Form Section */}
          {selectedTemplate && (
            <form
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "15px",
              }}
            >
              {selectedTemplate.elements.map((element) => (
                <div key={element.key}>
                  <label>
                    <strong>{element.key}:</strong>
                  </label>
                  {element.requiredTypes.text && (
                    <input
                      type="text"
                      name={element.key}
                      value={formData[element.key] || ""}
                      onChange={handleInputChange}
                      placeholder={`Enter ${element.key}`}
                      style={{
                        marginLeft: "10px",
                        padding: "10px",
                        borderRadius: "5px",
                        border: "1px solid #ccc",
                        width: "300px",
                      }}
                    />
                  )}
                  {element.requiredTypes.color && (
                    <input
                      type="color"
                      name={`${element.key}Color`} // Ensure the color input is named correctly
                      value={formData[`${element.key}Color`] || "#000000"}
                      onChange={handleInputChange}
                      style={{ marginLeft: "10px" }}
                    />
                  )}
                  {element.requiredTypes.image && (
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      style={{ marginLeft: "10px" }}
                    />
                  )}
                  {element.requiredTypes.gradient && (
                    <input
                      type="text"
                      name={`${element.key}Gradient`}
                      value={formData[`${element.key}Gradient`] || ""}
                      onChange={handleInputChange}
                      placeholder="Enter gradient (e.g., linear-gradient(...))"
                      style={{
                        marginLeft: "10px",
                        padding: "10px",
                        borderRadius: "5px",
                        border: "1px solid #ccc",
                        width: "300px",
                      }}
                    />
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={handleSave}
                style={{
                  padding: "10px 20px",
                  width: "9rem",
                  backgroundColor: "#FFB300",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                {editingBannerId ? "Update Banner" : "Save Banner"}
              </button>
            </form>
          )}
        </div>

        {/* Live Preview Section */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px",
            borderRadius: "10px",
            background: previewData.backgroundGradient || "#f5f5f5",
            border: "1px solid #ccc",
          }}
        >
          {/* Text Content */}
          <div style={{ flex: 1, paddingRight: "20px" }}>
            <h3 style={{ color: previewData.titleColor || "#000", margin: 0 }}>
              {previewData.title || "Title Preview"}
            </h3>
            <h4 style={{ color: previewData.highlightColor || "#000", margin: "10px 0" }}>
              {previewData.highlight || "Highlight Preview"}
            </h4>
            <p style={{ color: previewData.contentColor || "#000", margin: 0 }}>
              {previewData.content || "Content Preview"}
            </p>
          </div>

          {/* Image */}
          {previewData.image && (
            <img
              src={previewData.image}
              alt="Preview"
              style={{
                width: "200px",
                height: "200px",
                borderRadius: "10px",
                objectFit: "cover",
              }}
            />
          )}
        </div>
      </div>

      {/* DataTable Section */}
      <DataTable
        subHeader={true}
        subHeaderComponent={
          <SearchBar
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onClick={() => refetchBanners()}
          />
        }
        title={<TableHeader title="Saved Banners" />}
        columns={columns}
        data={filteredBanners}
        pagination
        progressPending={bannersLoading}
        progressComponent={<CustomLoader />}
        defaultSortField="ID"
      />
    </div>
  );
}

export default BannerTemplate;