import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { Box, styled } from '@mui/material';
import ConfigurableValues from "../../../config/constants";
import { GET_BANNER_TEMPLATES, GET_BANNERS } from '../graphql/queries';
import { CREATE_BANNER, UPDATE_BANNER, DELETE_BANNER } from '../graphql/mutations';
import { BannerForm } from '../componants/BannerForm';
import { BannerPreview } from '../componants/BannerPreview';
import { BannerTable } from '../componants/BannerTable';
import CustomLoader from '../../../components/Loader/CustomLoader';
import { showSuccessAlert,showErrorAlert } from '../../../utils/sweetAlert';

const MainContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  backgroundColor: '#F5F5F5',
  padding: '20px'
}));

const FormPreviewWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '24px',
  marginBottom: '24px',
  '@media (max-width: 1200px)': {
    flexDirection: 'column'
  }
}));

const FormContainer = styled(Box)({
  flex: '0 0 420px',
  '@media (max-width: 1200px)': {
    flex: '1 1 auto'
  }
});

const PreviewContainer = styled(Box)({
  flex: 1,
  minWidth: 0
});

function BannerTemplate() {
  const { CLOUDINARY_UPLOAD_URL, CLOUDINARY_FOOD, ImgUrlS3} = ConfigurableValues();
  const [formData, setFormData] = useState({});
  const [previewData, setPreviewData] = useState({});
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [editingBannerId, setEditingBannerId] = useState(null);
  const [file, setFile] = useState(null);
  const [fileLoading, setFileLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { loading: templatesLoading, error: templatesError, data: templatesData } = useQuery(GET_BANNER_TEMPLATES);
  const { loading: bannersLoading, error: bannersError, data: bannersData, refetch: refetchBanners } = useQuery(GET_BANNERS);
  const [createBanner] = useMutation(CREATE_BANNER);
  const [updateBanner] = useMutation(UPDATE_BANNER);
  const [deleteBanner] = useMutation(DELETE_BANNER);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setPreviewData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        setFile(selectedFile);
        setPreviewData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const uploadImageToCloudinary = async() => {
    const token = JSON.parse(localStorage.getItem('user-enatega'))
    if (!file) return "";

    setFileLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    // formData.append("upload_preset", CLOUDINARY_FOOD);

    try {
      const response = await fetch(ImgUrlS3, {
        method: "POST",
        body: formData,
        headers: {
          'Authorization': `Bearer ${token.token}`
        }
      });
      const imageData = await response.json();
      return imageData.url;
    } catch (error) {
      console.error("Image upload error:", error);
      return "";
    } finally {
      setFileLoading(false);
    }
  };

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

      if (element.requiredTypes.text) elementData.text = value;
      if (element.requiredTypes.color) elementData.color = color;
      if (element.requiredTypes.gradient) elementData.gradient = gradient;
      if (element.requiredTypes.image) elementData.image = value;

      return elementData;
    });

    const input = {
      templateId: selectedTemplate.templateId,
      elements,
    };

    const missingFields = selectedTemplate.elements.filter(element => 
      (element.requiredTypes.color && !formData[`${element.key}Color`]) ||
      (element.requiredTypes.text && !formData[element.key])
    );

    if (missingFields.length > 0) {
      alert(`Missing required fields for: ${missingFields.map(field => field.key).join(", ")}`);
      return;
    }

    try {
      const imageUrl = await uploadImageToCloudinary();
      if (imageUrl) {
        const imageElement = elements.find(el => el.key === "image");
        if (imageElement) imageElement.image = imageUrl;
      }

      if (editingBannerId) {
        await updateBanner({ variables: { id: editingBannerId, input } });
        setEditingBannerId(null);
      } else {
        await createBanner({ variables: { input } });
      }

      showSuccessAlert(`Banner ${editingBannerId ? 'updated' : 'created'} successfully!`);
      setFormData({});
      setPreviewData({});
      refetchBanners();
    } catch (err) {
      console.error("Error saving banner:", err);
      alert("Failed to save banner.");
    }
  };

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
    setSelectedTemplate(templatesData.bannerTemplates.find(t => t.templateId === banner.templateId));
  };

  const handleDelete = async(id) => {
   
     try {
        await deleteBanner({ variables: { id } });
        refetchBanners();
        showSuccessAlert("Banner deleted successfully!");
      } catch (err) {
        console.error("Error deleting banner:", err);
        show("Failed to delete banner.");
      }
    
  };

  const filteredBanners = bannersData?.banners.filter(banner =>
    banner.elements.some(el =>
      el.text?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      el.color?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      el.gradient?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  ) || [];

  if (templatesLoading || bannersLoading) return <CustomLoader />;
  if (templatesError || bannersError) 
    return <div className="p-4 text-red-500">Error: {templatesError?.message || bannersError?.message}</div>;

  const templates = templatesData.bannerTemplates;

  return (
    <MainContainer>
      <FormPreviewWrapper>
        <FormContainer>
          <BannerForm
            templates={templates}
            selectedTemplate={selectedTemplate}
            setSelectedTemplate={setSelectedTemplate}
            formData={formData}
            handleInputChange={handleInputChange}
            handleFileChange={handleFileChange}
            handleSave={handleSave}
            editingBannerId={editingBannerId}
            fileLoading={fileLoading}
          />
        </FormContainer>

        <PreviewContainer>
          <BannerPreview previewData={previewData} />
        </PreviewContainer>
      </FormPreviewWrapper>

      <BannerTable
        banners={filteredBanners}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        loading={bannersLoading}
        refetchBanners={refetchBanners}
      />
    </MainContainer>
  );
}

export default BannerTemplate;