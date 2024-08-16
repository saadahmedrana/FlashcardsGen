'use client'

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import db from "@/firebase";
import { useRouter } from "next/navigation";
import { AppBar, Box, Button, Card, CardActionArea, CardContent, IconButton, Container, Grid, Toolbar, Typography } from "@mui/material";
import Head from "next/head";
import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import HomeIcon from '@mui/icons-material/Home'


export default function Flashcards() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const router = useRouter();

  useEffect(() => {
    async function getFlashcards() {
      if (!user) return;
      const docRef = doc(collection(db, 'users'), user.id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const collections = docSnap.data().flashcards || [];
        setFlashcards(collections);
      } else {
        await setDoc(docRef, { flashcards: [] });
      }
    }
    getFlashcards();
  }, [user]);

  if (!isLoaded || !isSignedIn) {
    return <></>;
  }

  const handleCardClick = (id) => {
    router.push(`flashcard?id=${id}`);
  };

  return (
    <Container maxWidth={false} sx={{ backgroundColor: '#BDC3C7', py: 4 }}>
      <Head>
        <title>Flashcard History</title>
        <meta name="description" content="View your flashcard history" />
      </Head>

      <AppBar position="static" color="primary" sx={{ boxShadow: 'none', backgroundColor: '#2C3E50' }}>
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1, fontWeight: 'bold' }}>
            <IconButton edge="start" color="inherit" aria-label="home" onClick={() => router.push('/')}>
                <HomeIcon />
            </IconButton>
            <Button color="inherit" href="/" sx={{ fontWeight: 'bold' }}>Flashcard Saas</Button>
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
          Flashcard History
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom sx={{ color: '#34495E' }}>
          Review your previously generated flashcards.
        </Typography>
      </Box>

      <Grid container spacing={4} sx={{ mt: 4 }}>
        {flashcards.map((flashcard, index) => (
          <Grid item xs={12} sm={6} md={4} key={index} textAlign={"center"}>
            <Card sx={{ 
              backgroundColor: '#FDFEFE', 
              borderColor: '#BDC3C7', 
              borderRadius: 3, 
              boxShadow: 4,
              '&:hover': {
                boxShadow: 8,
              },
              transition: 'box-shadow 0.3s ease-in-out',
            }}>
              <CardActionArea
                onClick={() => handleCardClick(flashcard.name)}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2C3E50' }}>
                    {flashcard.name}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
