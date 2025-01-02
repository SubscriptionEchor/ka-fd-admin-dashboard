import React from 'react';
import {
  Box,
  Paper,
  Typography,
  styled
} from '@mui/material';

// Styled components for the BannerPreview
const PreviewCard = styled(Paper)(({ theme }) => ({
  borderRadius: 16,
  width: "60%",
  overflow: 'hidden',
  backgroundColor: theme.palette.background.paper,
  transition: 'box-shadow 0.3s ease',
  '&:hover': {
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
  }
}));

const PreviewHeader = styled(Box)({
  background: '#FFB300',
  padding: '12px 20px',
  color: '#FFF'
});

const PreviewContent = styled(Box)({
  padding: 16
});

// This is the actual preview area with fixed dimensions
const ContentBox = styled(Box)(({ theme, gradient }) => ({
  width: '392px',
  height: '155px',
  borderRadius: 12,
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'row',
  gap: theme.spacing(3),
  alignItems: 'center',
  position: 'relative',
  background: gradient || '#f8fafc', // Use gradient if provided, else fallback to a solid color
  border: '1px solid rgba(255, 179, 0, 0.1)',
}));

const TextContent = styled(Box)({
  flex: '1 1 60%',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  height: '100%',
  justifyContent: 'center',
  alignItems: 'start',
  textAlign: 'center'
});

const ImageContainer = styled(Box)({
  flex: '1 1 40%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
});

const PreviewImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  borderRadius: 8
});

// BannerPreview Component
export function BannerPreview({ previewData }) {
  return (
    <PreviewCard elevation={0}>
      <PreviewHeader>
        <Typography variant="h6" fontWeight={600} fontSize="1rem">
          Live Preview
        </Typography>
        <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.9, fontSize: '0.875rem' }}>
          Real-time banner preview
        </Typography>
      </PreviewHeader>

      <PreviewContent>
        <ContentBox gradient={previewData.backgroundGradient}>
          <TextContent>
            <Typography 
              variant="h4" 
              sx={{ 
                color: previewData.titleColor || '#1a1a1a',
                fontWeight: 700,
                lineHeight: 1.2,
                fontSize: "14px"
              }}
            >
              {previewData.title || 'Your Title Here'}
            </Typography>

            <Typography 
              variant="h5"
              sx={{ 
                color: previewData.highlightColor || '#4a4a4a',
                fontWeight: 600,
                fontSize: '22px'
              }}
            >
              {previewData.highlight || 'Highlight Message'}
            </Typography>

            <Typography 
              variant="body1"
              sx={{ 
                color: previewData.contentColor || '#666666',
                fontSize: '13px',
                lineHeight: 1.5
              }}
            >
              {previewData.content || 'description'}
            </Typography>
          </TextContent>

          {previewData.image && (
            <ImageContainer>
              <PreviewImage
                src={previewData.image}
                alt="Banner Preview"
              />
            </ImageContainer>
          )}
        </ContentBox>
      </PreviewContent>
    </PreviewCard>
  );
}