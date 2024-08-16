'use client';

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import db from "@/firebase";
import { useSearchParams } from "next/navigation";
import { Head, IconButton, AppBar, Box, Button, Grid, Container, Toolbar, Typography, LinearProgress, Card, CardActionArea } from "@mui/material";
import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Title } from "@mui/icons-material";
import HomeIcon from '@mui/icons-material/Home'



export default function Flashcard() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [flashcards, setFlashcards] = useState([]);
    const [flipped, setFlipped] = useState({});
    const searchParams = useSearchParams();
    const search = searchParams.get('id');
    
    
    const router = useRouter();

    useEffect(() => {
        async function getFlashcard() {
            if (!search || !user) return;
            const colRef = collection(doc(collection(db, 'users'), user.id), search);
            const docs = await getDocs(colRef);
            const flashcards = [];

            docs.forEach((doc) => {
                flashcards.push({ id: doc.id, ...doc.data() });
            });
            setFlashcards(flashcards);
        }
        getFlashcard();
    }, [user, search]);

    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    if (!isLoaded || !isSignedIn) {
        return <></>;
    }

    return (
        <Container maxWidth={false} sx={{ backgroundColor: '#BDC3C7', py: 4 }}>
            

            <AppBar position="static" color="primary" sx={{ boxShadow: 'none', backgroundColor: '#2C3E50' }}>
                <Toolbar>
                <IconButton edge="start" color="inherit" aria-label="home" onClick={() => router.push('/')}>
                    <HomeIcon />
                </IconButton>
                <Typography variant="h6" style={{ flexGrow: 1, fontWeight: 'bold' }}>
                    
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

            {/* Top Banner with Quote */}
            <Box sx={{
                mb: 4,
                py: 2,
                background: "linear-gradient(90deg, rgba(255,179,186,1) 0%, rgba(255,223,186,1) 100%)",
                borderRadius: "12px",
                textAlign: "center",
                boxShadow: 4,
            }}>
                <Typography variant="h5" sx={{ fontFamily: 'Poppins, sans-serif', color: '#2C3E50' }}>
                    "Learning never exhausts the mind. — Leonardo da Vinci"
                </Typography>
            </Box>

            {/* Welcome Section */}
            <Box sx={{ mb: 6, textAlign: "center" }}>
                <Typography variant="h4" sx={{ fontFamily: 'Raleway, sans-serif', color: '#2C3E50', background: 'linear-gradient(90deg, rgba(255,223,186,1) 0%, rgba(255,179,186,1) 100%)', padding: '10px', borderRadius: '12px', display: 'inline-block' }}>
                    {`Welcome back, ${user?.firstName || "Learner"}! Ready to master today's topic?`}
                </Typography>
            </Box>

            {/* Progress Bar */}
            <LinearProgress variant="determinate" value={(Object.keys(flipped).length / flashcards.length) * 100} sx={{ mb: 4, backgroundColor: '#ECF0F1' }} />

            {/* Flashcard Layout */}
            <Grid container spacing={4}>
                {flashcards.map((flashcard, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card sx={{
                            backgroundColor: flipped[index] ? '#ECF0F1' : '#2C3E50',
                            color: flipped[index] ? '#2C3E50' : '#ECF0F1',
                            boxShadow: '0px 6px 12px rgba(0,0,0,0.1)',
                            borderRadius: '12px',
                            height: '250px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            cursor: 'pointer',
                            transition: 'transform 0.8s ease-in-out',
                            transformStyle: 'preserve-3d',
                            perspective: '1000px',
                            transform: flipped[index] ? 'rotateY(360deg)' : 'rotateY(0deg)',

                        }}
                        onClick={() => handleCardClick(index)}
                        >
                            <CardActionArea
                                sx={{
                                    height: '100%',
                                    width: '100%',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    position: 'relative',
                                }}
                                
                            >
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        width: '100%',
                                        height: '100%',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        p: 2,
                                        backfaceVisibility: 'hidden',
                                    }}
                                >
                                    <Typography variant="h4" align="center" sx={{ fontFamily: 'cursive' }}>
                                        {flipped[index] ? flashcard.back : flashcard.front}
                                    </Typography>
                                </Box>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}
