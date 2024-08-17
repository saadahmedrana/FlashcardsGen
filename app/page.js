'use client';

import Image from "next/image";
import getStripe from "@/utils/get-stripe";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { AppBar,IconButton, Box, Button, Grid, Container, Toolbar, Typography, Fade } from "@mui/material";
import Head from "next/head";
import { useEffect, useState } from "react";
import HomeIcon from '@mui/icons-material/Home'


export default function Home() {

  const handleSubmit = async () => {
    const checkoutSession = await fetch('/api/checkout_session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!checkoutSession.ok) {
      const message = `An error has occurred: ${checkoutSession.status}`;
      console.error(message);
      return;
    }

    try {
      const checkoutSessionJson = await checkoutSession.json();
      const stripe = await getStripe();

      const { error } = await stripe.redirectToCheckout({
        sessionId: checkoutSessionJson.id,
      });

      if (error) {
        console.warn(error.message);
      }
    } catch (error) {
      console.error('Error processing the checkout session:', error);
    }
  };

  const [currentFeature, setCurrentFeature] = useState(0);
  const features = [
    {
      title: "Easy Text Input",
      description: "Simply input the text and let our software do the rest. Creating Flashcards has never been easier."
    },
    {
      title: "Smart Flashcards",
      description: "Our AI intelligently breaks down your text into concise flashcards for study."
    },
    {
      title: "Accessible Anywhere",
      description: "Access your flashcards from any device, at any time. Study on the go with ease."
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prevFeature) => (prevFeature + 1) % features.length);
    }, 5000); // Change feature every 5 seconds
    return () => clearInterval(interval);
  }, [features.length]);

  return (
    <Container maxWidth={false} sx={{ backgroundColor: '#BDC3C7', py: 4 }}>
      <Head>
        <title>Flashcard SaaS</title>
        <meta name="description" content="Create flashcards from your text" />
      </Head>

      <AppBar position="static" color="primary" sx={{ boxShadow: 'none', backgroundColor: '#2C3E50' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="home" onClick={() => router.push('/')}>
            <HomeIcon />
          </IconButton>
          <Typography variant="h6" style={{ flexGrow: 1, fontWeight: 'bold' }}>
            Flashcard SaaS
          </Typography>
          <SignedOut>
            <Button color="inherit" href="/sign-in" sx={{ fontWeight: 'bold' }}>Login</Button>
            <Button color="inherit" href="/sign-up" sx={{ fontWeight: 'bold' }}>Sign Up</Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>

      <Box sx={{ textAlign: 'center', my: 4, py: 6, bgcolor: '#ECF0F1', borderRadius: 3, boxShadow: 4 }}>
        
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#2C3E50', letterSpacing: 1.5 }}>
          Welcome to Flashcard SaaS
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          The easiest way to create flashcards from your text.
        </Typography>
        <SignedIn>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 3, mr: 2, px: 4, py: 1.5, fontWeight: 'bold', backgroundColor: '#2980B9' }}
            href="/generate"
          >
            Generate
          </Button>
          <Button
            variant="outlined"
            color="primary"
            sx={{ mt: 3, ml: 2, px: 4, py: 1.5, fontWeight: 'bold', borderColor: '#2980B9', color: '#2980B9' }}
            href="/flashcards"
          >
            View History
          </Button>
        </SignedIn>

        <SignedOut>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 3, mr: 2, px: 4, py: 1.5, fontWeight: 'bold', backgroundColor: '#2980B9' }}
            href="/sign-in"
          >
            Get Started
          </Button>
        </SignedOut>
        
      </Box>

      <Box sx={{ my: 8, textAlign: 'center' }}>
        
        <Grid container spacing={5} justifyContent="center" gutterBottom>
        <Box sx={{ textAlign: 'center', my: 4, py: 2, bgcolor: '#ECF0F1', borderRadius: 3, boxShadow: 4 }}
        variant="contained" color="primary"  textAlign={'center'}>
        <Fade in={true} timeout={1000} key={currentFeature}>
          <Box>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#34495E' }}>
              {features[currentFeature].title}
            </Typography>
            <Typography variant="h10" gutterBottom sx={{ color: '#34495E' }}>
              {features[currentFeature].description}
            </Typography>
          </Box>
        </Fade>
        </Box>
        </Grid>
      </Box>

      <Box sx={{ my: 8, textAlign: 'center' }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', color: '#2C3E50' }}>
          Pricing
        </Typography>
        <Grid container spacing={5} justifyContent="center">
          <Grid item xs={12} md={4}>
            <Box sx={{
              p: 4,
              border: '1px solid',
              borderColor: '#BDC3C7',
              borderRadius: 3,
              '&:hover': {
                boxShadow: 8,
              },
              transition: 'box-shadow 0.3s ease-in-out',
              backgroundColor: '#FDFEFE'
            }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#2C3E50' }}>
                Basic
              </Typography>
              <Typography sx={{ color: '#7F8C8D' }}>
                Free for limited features.
              </Typography>
              <Button variant="contained" color="primary" sx={{ mt: 3, backgroundColor: '#2980B9', px: 4, py: 1.5 }} onClick={handleSubmit}>
                Upgrade Plan
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{
              p: 4,
              border: '1px solid',
              borderColor: '#BDC3C7',
              borderRadius: 3,
              '&:hover': {
                boxShadow: 8,
              },
              transition: 'box-shadow 0.3s ease-in-out',
              backgroundColor: '#FDFEFE'
            }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#2C3E50' }}>
                Pro
              </Typography>
              <Typography sx={{ color: '#7F8C8D' }}>
                Access all features for $10/month.
              </Typography>
              <Button variant="contained" color="primary" sx={{ mt: 3, backgroundColor: '#2980B9', px: 4, py: 1.5 }} onClick={handleSubmit}>
                Choose Plan
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
