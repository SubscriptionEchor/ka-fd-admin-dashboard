
import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Select,
  MenuItem,
  TextField,
  Button,
  styled
} from '@mui/material';
import { ImagePlus, ChevronDown } from 'lucide-react';
import { ColorPicker } from './ColorPickers';


const FormCard = styled(Paper)(({ theme }) => ({
  borderRadius: 16,
  overflow: 'hidden',
  backgroundColor: theme.palette.background.paper,
  transition: 'box-shadow 0.3s ease',
  '&:hover': {
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
  }
}));

const FormHeader = styled(Box)({
  background: '#FFB300',
  padding: '12px 20px',
  color: '#FFF'
});

const FormContent = styled(Box)(({ theme }) => ({
  padding: 24,
}));

const UploadBox = styled(Box)(({ theme }) => ({
  border: '2px dashed #FFE082',
  borderRadius: 12,
  padding: theme.spacing(4),
  backgroundColor: 'rgba(255, 179, 0, 0.04)',
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    borderColor: '#FFB300',
    backgroundColor: 'rgba(255, 179, 0, 0.08)'
  }
}));

export function BannerForm({
  templates,
  selectedTemplate,
  setSelectedTemplate,
  formData,
  handleInputChange,
  handleFileChange,
  handleSave,
  editingBannerId,
  fileLoading
}) {
  return (
    <FormCard elevation={0}>
      <FormHeader>
        <Typography variant="h6" fontWeight={600} fontSize="1rem">
          {editingBannerId ? "Edit Banner" : "Create New Banner"}
        </Typography>
        <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.9, fontSize: '0.875rem' }}>
          Customize your banner design below
        </Typography>
      </FormHeader>

      <FormContent>
        {/* Template Selection */}
        <Box mb={3}>
          <Typography sx={{ color: 'black' }} variant="subtitle2" gutterBottom fontWeight={500} color="text.primary">
            Choose Template
          </Typography>
          <Select
            value={selectedTemplate?._id || ''}
            onChange={(e) => setSelectedTemplate(templates.find(t => t._id === e.target.value))}
            size="small"
            displayEmpty
            renderValue={(selected) => {
              if (!selected) {
                return <span style={{ color: '#aaa' }}>Choose Template</span>;
              }
              return templates.find((t) => t._id === selected)?.name;
            }}
            sx={{
              width: '25rem',
              color: '#333333',
              bgcolor: '#ffffff',
              '& .MuiSelect-select': {
                color: selectedTemplate ? '#333333' : '#aaa',
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 179, 0, 0.3)',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 179, 0, 0.5)',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#FFB300',
              },
            }}
            IconComponent={(props) => (
              <svg
                {...props}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ width: '1rem', height: '1rem', color: '#333333' }}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            )}
          >
            {/* Map through templates */}
            {templates.map((template) => (
              <MenuItem
                key={template._id}
                value={template._id}
                sx={{
                  color: '#333333',
                }}
              >
                {template.name}
              </MenuItem>
            ))}
          </Select>
        </Box>

        {selectedTemplate && (

          <Box>
            {selectedTemplate.elements.map((element) => (

              <Box key={element.key} mb={4}>
                <Typography
                  variant="subtitle2"
                  gutterBottom
                  fontWeight={500}
                  sx={{ textTransform: 'capitalize', color: 'black' }}
                >
                  {element.key}
                </Typography>

                {element.requiredTypes.text && (
                  <TextField
                    size="small"
                    name={element.key}
                    value={formData[element.key]?.length > (element.key === 'title' ? 20 : element.key === 'highlight' ? 18 : 30)
                      ? formData[element.key].slice(0, element.key === 'title' ? 20 : element.key === 'highlight' ? 18 : 30) + '...'
                      : formData[element.key] || ""}
                    onChange={(e) => {
                      const maxLength = element.key === 'title' ? 20 : element.key === 'highlight' ? 18 : 30;
                      if (e.target.value.length <= maxLength) {
                        handleInputChange(e);
                      }
                    }}
                    inputProps={{
                      maxLength: element.key === 'title' ? 20 : element.key === 'highlight' ? 18 : 30
                    }}
                    placeholder={`Enter ${element.key} (max ${element.key === 'title' ? 20 : element.key === 'highlight' ? 18 : 30} chars)`}
                    sx={{
                      width: '25rem',
                      mb: 2,
                      backgroundColor: '#ffffff',
                      '& .MuiOutlinedInput-root': {
                        color: '#333333',
                        '& fieldset': {
                          borderColor: 'rgba(255, 179, 0, 0.3)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(255, 179, 0, 0.5)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#FFB300',
                        },
                      },
                      '& .MuiInputBase-input::placeholder': {
                        color: '#666666',
                        opacity: 1
                      },
                      '& .MuiOutlinedInput-input': {
                        color: '#333333'
                      }
                    }}
                  />
                )}

                {element.requiredTypes.color && (
                  <ColorPicker
                    name={`${element.key}Color`}
                    value={formData[`${element.key}Color`] || "#000000"}
                    onChange={handleInputChange}
                    label={`Select color for ${element.key}`}
                  />
                )}

                {element.requiredTypes.image && (
                  <UploadBox
                    sx={{
                      maxWidth: '370px',
                      padding: '16px',
                      border: '1px dashed #FFB300',
                      borderRadius: '8px',
                      backgroundColor: '#FFF8E1',
                    }}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                      id="image-upload"
                    />
                    <label htmlFor="image-upload">
                      <Box>
                        <ImagePlus
                          size={48}
                          color="#FFB300"
                          strokeWidth={1.5}
                          style={{ marginBottom: 16 }}
                        />
                        <Typography
                          variant="body1"
                          fontWeight={500}
                          sx={{ color: '#FFB300' }}
                        >
                          Click to upload
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ mt: 0.5, color: '#666666' }}
                        >
                          or drag and drop
                        </Typography>
                        <Typography
                          variant="caption"
                          display="block"
                          sx={{ mt: 1, color: '#666666' }}
                        >
                          PNG, JPG, GIF up to 10MB
                        </Typography>
                      </Box>
                    </label>
                  </UploadBox>
                )}

                {element.requiredTypes.gradient && (
                  <TextField
                    size="small"
                    name={`${element.key}Gradient`}
                    value={formData[`${element.key}Gradient`] || ""}
                    onChange={handleInputChange}
                    placeholder="linear-gradient(to right, #FFB300, #FFE082)"
                    sx={{
                      width: '25rem',
                      backgroundColor: '#ffffff',
                      '& .MuiOutlinedInput-root': {
                        color: '#333333',
                        '& fieldset': {
                          borderColor: 'rgba(255, 179, 0, 0.3)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(255, 179, 0, 0.5)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#FFB300',
                        }
                      },
                      '& .MuiInputBase-input::placeholder': {
                        color: '#666666',
                        opacity: 1
                      },
                      '& .MuiOutlinedInput-input': {
                        color: '#333333'
                      }
                    }}
                  />
                )}
              </Box>
            ))}

            <Button
              fullWidth
              variant="contained"
              onClick={handleSave}
              disabled={fileLoading}
              sx={{
                width: '10rem',
                borderRadius: '50px',
                mt: 3,
                py: 1.5,
                backgroundColor: '#FFB300',
                '&:hover': {
                  backgroundColor: '#FFA000'
                },
                '&.Mui-disabled': {
                  backgroundColor: 'rgba(255, 179, 0, 0.3)'
                }
              }}
            >
              {fileLoading ? 'Uploading...' : editingBannerId ? 'Update Banner' : 'Create Banner'}
            </Button>
          </Box>
        )}
      </FormContent>
    </FormCard>
  );
}
