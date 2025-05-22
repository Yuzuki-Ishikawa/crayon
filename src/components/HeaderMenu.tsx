"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

export default function HeaderMenu() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const todayArticlePath = "/copy"; // TODO: 最新記事へのパスを決定

  const menuItems = [
    { text: 'トップページ', href: '/' },
    { text: '記事一覧', href: '/copy' },
    { text: '今日の記事', href: todayArticlePath },
  ];

  const list = () => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {menuItems.map((item) => (
          <Link href={item.href} passHref key={item.text} legacyBehavior>
            <ListItem 
              disablePadding 
              component="a" 
              sx={{ 
                textDecoration: 'none', 
                '&:hover': { textDecoration: 'none' } 
              }}
            >
              <ListItemButton sx={{ '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' } }}>
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{ sx: { color: 'black', fontWeight: 'medium' } }} 
                />
              </ListItemButton>
            </ListItem>
          </Link>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <IconButton
        edge="start"
        color="inherit"
        aria-label="open drawer"
        onClick={toggleDrawer(true)}
        sx={{ 
          mr: { xs: 0, sm: 1 }, 
          display: { xs: 'block' },
          color: 'black'
        }}
      >
        <MenuIcon sx={{ fontSize: 28 }} />
      </IconButton>
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
      >
        {list()}
      </Drawer>
    </>
  );
} 