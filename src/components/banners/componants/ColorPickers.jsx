import React, { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  IconButton,
  Tooltip,
  Fade,
  styled 
} from '@mui/material';
import { Palette } from 'lucide-react';
import { colorPalettes } from '../constants/colorPalettes';

const ColorButton = styled(Box)(({ theme }) => ({
  width: 36,
  height: 36,
  borderRadius: 8,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  border: '2px solid white',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  '&:hover': {
    transform: 'scale(1.1)',
    boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
  }
}));

const ColorPickerWrapper = styled(Paper)(({ theme }) => ({
  // padding: theme.spacing(2),
  borderRadius: theme.spacing(1.5),
  backgroundColor: theme.palette.background.paper,
  // border: `1px solid ${theme.palette.divider}`,
  width:"22rem"
}));

const ColorPaletteContainer = styled(Paper)(({ theme }) => ({
  position: 'absolute',
  top: '100%',
  left: 0,
  marginTop: theme.spacing(1),
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1.5),
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[3],
  zIndex: 1000,
  width: 320,
}));

export function ColorPicker({ value, onChange, name, label }) {
  const [showPalette, setShowPalette] = useState(false);

  return (
    <ColorPickerWrapper elevation={0}>
      <Box sx={{ position: 'relative' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Color Input */}
          <Box sx={{ position: 'relative', width: 40, height: 40 }}>
            <input
              type="color"
              name={name}
              value={value || "#000000"}
              onChange={onChange}
              style={{
                opacity: 0,
                position: 'absolute',
                width: '100%',
                height: '100%',
                cursor: 'pointer'
              }}
            />
            <Box
              sx={{
                width: '100%',
                height: '100%',
                borderRadius: 2,
                border: '3px solid white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                backgroundColor: value || "#000000"
              }}
            />
          </Box>

          {/* Palette Toggle Button */}
          {/* <IconButton
            onClick={() => setShowPalette(!showPalette)}
            sx={{
              bgcolor: 'rgba(255, 179, 0, 0.1)',
              '&:hover': {
                bgcolor: 'rgba(255, 179, 0, 0.2)',
              }
            }}
          >
            <Palette color="#FFB300" size={20} />
          </IconButton> */}

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontWeight: 500 }}
          >
            {label}
          </Typography>
        </Box>

        {/* Color Palette */}
        <Fade in={showPalette}>
          <ColorPaletteContainer elevation={6} sx={{ display: showPalette ? 'block' : 'none' }}>
            <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary' }}>
              Choose from palette
            </Typography>
            {Object.entries(colorPalettes).map(([name, colors]) => (
              <Box key={name} sx={{ mb: 3 }}>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: 'text.secondary',
                    textTransform: 'capitalize',
                    display: 'block',
                    mb: 1 
                  }}
                >
                  {name}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {colors.map((color) => (
                    <Tooltip 
                      key={color} 
                      title={color}
                      placement="top"
                      arrow
                    >
                      <ColorButton
                        sx={{ backgroundColor: color }}
                        onClick={() => {
                          onChange({ target: { name, value: color } });
                          setShowPalette(false);
                        }}
                      />
                    </Tooltip>
                  ))}
                </Box>
              </Box>
            ))}
          </ColorPaletteContainer>
        </Fade>
      </Box>
    </ColorPickerWrapper>
  );
}