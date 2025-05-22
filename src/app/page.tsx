"use client";

import React, { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AppBar, Toolbar, Typography, IconButton, Box, Button, Card, CardContent, CardMedia, Container, Stack, Divider } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const featuredArticle = {
  id: '1',
  imageUrl: '/sample1.jpg',
  vol: 'x',
  date: 'yyyy/mm/dd',
  copyText: '--------------------',
  advertiser: 'aaa',
};

const latestArticles = [
  { id: '2', imageUrl: '/sample2.jpg', vol: 'x', date: 'yyyy/mm/dd', copyText: '--------------------', advertiser: 'aaa' },
  { id: '3', imageUrl: '/sample1.jpg', vol: 'x', date: 'yyyy/mm/dd', copyText: '--------------------', advertiser: 'aaa' },
  { id: '4', imageUrl: '/sample3.jpg', vol: 'x', date: 'yyyy/mm/dd', copyText: '--------------------', advertiser: 'aaa' },
];

export default function LandingPage() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollRef.current;
    if (!container) return;
    const scrollAmount = 320; // カード幅＋余白
    container.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
  };

  return (
    <Box sx={{ bgcolor: '#fff', minHeight: '100vh' }}>
      {/* Header */}
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <Link href="/" passHref style={{ textDecoration: 'none', color: 'inherit' }}>
            <Typography variant="h4" component="a" sx={{ flexGrow: 1, fontWeight: 'bold', letterSpacing: 4, cursor: 'pointer' }}>
              まいにち
              <Box component="span" sx={{ color: '#2253A3', fontWeight: 'bold', ml: 1 }}>広告部</Box>
            </Typography>
          </Link>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton edge="end" color="inherit">
            <MenuIcon sx={{ fontSize: 36 }} />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 6 }}>
        {/* Featured Article */}
        <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} alignItems="center" gap={4}>
          <Card sx={{ flex: 2, minWidth: 300 }}>
            <CardMedia>
              <Image src={featuredArticle.imageUrl} alt="" width={400} height={225} style={{ width: '100%', height: 'auto' }} />
            </CardMedia>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                <Typography variant="body1">Vol. {featuredArticle.vol}</Typography>
                <Typography variant="body1">{featuredArticle.date}</Typography>
              </Stack>
              <Divider sx={{ my: 1 }} />
              <Typography variant="body2" sx={{ mt: 1 }}>{featuredArticle.copyText}</Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>広告主：{featuredArticle.advertiser}</Typography>
            </CardContent>
          </Card>
          <Box flex={1} display="flex" justifyContent="center" alignItems="center">
            <Button
              variant="contained"
              sx={{
                bgcolor: '#19C37D',
                color: '#fff',
                fontSize: 22,
                px: 5,
                py: 2,
                borderRadius: 2,
                boxShadow: 2,
                '&:hover': { bgcolor: '#16a06a' },
              }}
            >
              LINE連携でリマインド
            </Button>
          </Box>
        </Box>

        {/* Latest Articles */}
        <Box mt={8}>
          <Stack direction="row" alignItems="center" spacing={1} mb={2}>
            <Box sx={{ width: 8, height: 28, bgcolor: '#2253A3', borderRadius: 1 }} />
            <Typography variant="h6" fontWeight="bold">最新記事</Typography>
          </Stack>
          <Box position="relative">
            <IconButton
              sx={{
                position: 'absolute', left: -48, top: '50%', transform: 'translateY(-50%)', zIndex: 2, bgcolor: '#2253A3', color: '#fff', '&:hover': { bgcolor: '#17407b' }, display: { xs: 'none', sm: 'flex' }
              }}
              onClick={() => scroll('left')}
            >
              <ArrowBackIosNewIcon />
            </IconButton>
            <Box
              ref={scrollRef}
              sx={{
                display: 'flex',
                overflowX: 'auto',
                gap: 2,
                pb: 2,
                scrollBehavior: 'smooth',
                '&::-webkit-scrollbar': { display: 'none' },
              }}
            >
              {latestArticles.map(article => (
                <Card key={article.id} sx={{ minWidth: 280, maxWidth: 300, flex: '0 0 auto' }}>
                  <CardMedia>
                    <Image src={article.imageUrl} alt="" width={300} height={180} style={{ width: '100%', height: 'auto' }} />
                  </CardMedia>
                  <CardContent>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                      <Typography variant="body2">Vol. {article.vol}</Typography>
                      <Typography variant="body2">{article.date}</Typography>
                    </Stack>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="body2">{article.copyText}</Typography>
                    <Typography variant="body2">広告主：{article.advertiser}</Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
            <IconButton
              sx={{
                position: 'absolute', right: -48, top: '50%', transform: 'translateY(-50%)', zIndex: 2, bgcolor: '#2253A3', color: '#fff', '&:hover': { bgcolor: '#17407b' }, display: { xs: 'none', sm: 'flex' }
              }}
              onClick={() => scroll('right')}
            >
              <ArrowForwardIosIcon />
            </IconButton>
          </Box>
        </Box>
      </Container>
    </Box>
  );
} 