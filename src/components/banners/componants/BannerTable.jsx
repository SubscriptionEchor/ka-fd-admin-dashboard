// src/features/banners/components/BannerTable.jsx
import React from 'react';
import { 
  Box, 
  Paper, 
  Typography,
  IconButton,
  TextField,
  Tooltip,
  styled 
} from '@mui/material';
import { Edit2, Trash2, Image } from 'lucide-react';
import DataTable from 'react-data-table-component';

const TableCard = styled(Paper)(({ theme }) => ({
  borderRadius: 16,
  overflow: 'hidden',
  backgroundColor: theme.palette.background.paper,
  marginTop: theme.spacing(3)
}));

const SearchField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 8,
    '& fieldset': {
      borderColor: 'rgba(255, 179, 0, 0.3)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(255, 179, 0, 0.5)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#FFB300',
    }
  }
}));

const customStyles = {
  header: {
    style: {
      backgroundColor: '#fff',
      color: '#1a1a1a',
      padding: '20px 24px',
      fontSize: '1.125rem',
      fontWeight: 600
    }
  },
  headRow: {
    style: {
      backgroundColor: '#FFF8E1',
      borderBottom: '1px solid #FFE082',
      '&:hover': {
        backgroundColor: '#FFF8E1'
      }
    }
  },
  headCells: {
    style: {
      fontSize: '0.875rem',
      fontWeight: 600,
      color: '#1a1a1a',
      paddingLeft: '16px',
      paddingRight: '16px'
    }
  },
  cells: {
    style: {
      fontSize: '0.875rem',
      paddingLeft: '16px',
      paddingRight: '16px'
    }
  },
  rows: {
    style: {
      backgroundColor: '#ffffff',
      '&:hover': {
        backgroundColor: 'rgba(255, 179, 0, 0.04)',
        cursor: 'pointer',
        transition: 'all 0.2s ease'
      }
    },
    stripedStyle: {
      backgroundColor: '#fafafa'
    }
  }
};

export function BannerTable({ 
  banners, 
  searchQuery,
  setSearchQuery,
  handleEdit, 
  handleDelete,
  loading 
}) {
  const columns = [
    {
      name: 'Preview',
      cell: row => (
        <Box p={1}>
          {row.elements.find(el => el.key === "image")?.image ? (
            <img
              src={row.elements.find(el => el.key === "image").image}
              alt="Banner"
              style={{ 
                width: 100, 
                height: 100, 
                objectFit: 'cover', 
                borderRadius: 8,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s ease',
                '&:hover': {
                  transform: 'scale(1.05)'
                }
              }}
            />
          ) : (
            <Box
              sx={{
                width: 100,
                height: 100,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(255, 179, 0, 0.1)',
                borderRadius: 2,
                border: '1px dashed #FFB300'
              }}
            >
              <Image size={24} color="#FFB300" />
            </Box>
          )}
        </Box>
      ),
      width: '150px'
    },
    {
      name: 'Template ID',
      selector: row => row.templateId,
      sortable: true,
      width: '150px'
    },
    {
      name: 'Elements',
      grow: 2,
      cell: row => (
        <Tooltip 
          title={row.elements.map(el => 
            `${el.key}: ${el.text || el.color || el.gradient || "Image"}`
          ).join("\n")}
        >
          <Typography 
            noWrap 
            sx={{ 
              maxWidth: 400,
              color: '#666666'
            }}
          >
            {row.elements.map(el => 
              `${el.key}: ${el.text || el.color || el.gradient || "Image"}`
            ).join(", ")}
          </Typography>
        </Tooltip>
      )
    },
    {
      name: 'Actions',
      cell: row => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton 
            onClick={() => {
              window.scrollTo(0, 0);
              handleEdit(row)
            }}
            sx={{
              color: '#FFB300',
              '&:hover': {
                backgroundColor: 'rgba(255, 179, 0, 0.1)'
              }
            }}
          >
            <Edit2 size={18} />
          </IconButton>
          <IconButton 
            onClick={() => handleDelete(row._id)}
            sx={{
              color: '#d32f2f',
              '&:hover': {
                backgroundColor: 'rgba(211, 47, 47, 0.1)'
              }
            }}
          >
            <Trash2 size={18} />
          </IconButton>
        </Box>
      ),
      width: '120px'
    }
  ];

  return (
    <TableCard elevation={0}>
      <DataTable
        title="Saved Banners"
        columns={columns}
        data={banners}
        pagination
        customStyles={customStyles}
        progressPending={loading}
        subHeader
        subHeaderComponent={
          <Box sx={{ p: 2, width: 300}}>
            <SearchField
              fullWidth
              size="small"
              placeholder="Search banners..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-input::placeholder': {
                  color: '#9e9e9e', // Light gray placeholder color
                  opacity: 0.7
                },
                '& .MuiOutlinedInput-input': {
                  color: '#000000' // Black color for entered text
                }
              }}
            />
          </Box>
        }
        striped
      />
    </TableCard>
  );
}