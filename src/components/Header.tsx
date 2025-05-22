"use client"; // Add this for MUI components and useState

import React, { useState, useEffect } from 'react'; // Added useState, useEffect
import Image from 'next/image'; // For Logo
import Link from 'next/link'; // For Logo
import { AppBar, Toolbar, Box, Typography, Container } from '@mui/material';
import HeaderMenu from './HeaderMenu';

const Header = () => {
  const [dateInfo, setDateInfo] = useState({ day: '', month: '', year: '', dayOfWeek: '' });

  useEffect(() => {
    const today = new Date();
    setDateInfo({
      day: today.getDate().toString(),
      month: (today.getMonth() + 1).toString(),
      year: today.getFullYear().toString(),
      dayOfWeek: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][today.getDay()]
    });
  }, []); // Empty dependency array ensures this runs only on client-side mount

  return (
    <AppBar 
      position="static" 
      color="default" 
      elevation={0} 
      sx={{ 
        backgroundColor: '#f5f8fa', // Changed to new background color
        borderBottom: 'none' 
      }}
    >
      <Container maxWidth="lg"> {/* Changed to lg for wider layout, can be md if preferred */} 
        <Toolbar sx={{ 
          position: 'relative', // For absolute positioning of the logo
          display: 'flex', 
          justifyContent: 'space-between', // Pushes menu to left, date to right
          alignItems: 'center', 
          minHeight: { xs: 56, sm: 64 }, 
          px: { xs: 1, sm: 2 } /* Adjust padding */ }}>
          {/* Left section for Menu - takes up necessary space */} 
          <Box sx={{ display: 'flex', alignItems: 'center', zIndex: 1 /* Ensure menu is above logo if overlap */ }}>
            <HeaderMenu />
          </Box>
          
          {/* Center section for Logo - Absolutely positioned */}
          <Box sx={{ 
            position: 'absolute',
            left: '50%',
            top: '50%', // To vertically center along with transform
            transform: 'translate(-50%, -50%)', // Precise centering
            display: 'flex', // To ensure Link/Image behave as expected within
            alignItems: 'center'
          }}>
            <Link href="/" passHref>
              {/* Logo, ensure its container also helps in centering if direct style on Image isn't enough */}
              <Image src="/logo.png" alt="Crayon Logo" width={100} height={36} style={{ objectFit: 'contain', display: 'block' }} priority />
            </Link>
          </Box>
          
          {/* Right section for Date - takes up necessary space */}
          <Box sx={{ display: 'flex', alignItems: 'center', zIndex: 1 /* Ensure date is above logo if overlap */ }}>
            {/* Date container, ensure its own height and alignment contribute to overall centering */}
            <Box 
              display="flex" 
              alignItems="flex-end" // Keep alignment to bottom for the group
              sx={{ 
                minWidth: { xs: 80, sm: 90 }, 
                justifyContent: 'flex-end',
                height: '42px', // Increased height to allow more downward shift
                pb: '4px'      // Increased paddingBottom to push the entire date group down more
              }}
            >
              {dateInfo.day && ( // Render only when dateInfo is populated
              <>
                <Typography 
                  variant="h5" 
                  component="span" 
                  sx={{ 
                    fontWeight: 'bold', 
                    color: 'primary.main', // Changed from #d32f2f to theme color
                    lineHeight: 1, // Critical for controlling space around text
                    fontSize: '1.6rem',
                    // pb: '2px' // Example: if direct push down of this text is needed
                  }}
                >
                  {dateInfo.month}.{dateInfo.day}
                </Typography>
                <Box 
                  ml={0.5} 
                  display="flex" 
                  flexDirection="column" 
                  justifyContent="flex-end"
                  sx={{ 
                    lineHeight: '0.9em', 
                    pb: '1px'
                  }}
                >
                  <Typography variant="caption" component="span" sx={{ color: 'primary.main', display: 'block', lineHeight: 1, fontSize: '0.5rem', fontWeight:'medium', mb: 0 }}>
                    {dateInfo.dayOfWeek}
                  </Typography>
                  <Typography variant="caption" component="span" sx={{ color: 'primary.main', display: 'block', lineHeight: 1, fontSize: '0.5rem', fontWeight:'medium', mt: '0.1em' }}>
                    {dateInfo.year}
                  </Typography>
                </Box>
              </>
              )}
            </Box>
          </Box>
        </Toolbar>
        <Box sx={{ height: '2px', bgcolor: 'primary.main', width: '100%', mt: 0.5 }} />
      </Container>
    </AppBar>
  );
};

export default Header; 