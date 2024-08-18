'use client'

import db from "@/firebase"
import { useUser } from "@clerk/nextjs"
import { Box, Button, Container, Paper, TextField, Typography, Grid, Card, CardContent, CardActionArea, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, AppBar, Toolbar, IconButton } from "@mui/material"
import { collection, doc, getDoc, writeBatch } from "firebase/firestore"
import { useRouter } from "next/navigation"
import { useState } from "react"
import HomeIcon from '@mui/icons-material/Home'
import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs";


export default function Generate() {
    const { isLoaded, isSignedIn, user } = useUser()
    const [flashcards, setFlashcards] = useState([])
    const [flipped, setFlipped] = useState([])
    const [text, setText] = useState('')
    const [name, setName] = useState('')
    const [open, setOpen] = useState(false)
    const router = useRouter()

    const handleSubmit = async () => {
        if (!text.trim()) {
            alert('Please enter some text to generate flashcards.')
            return
        }

        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                body: text,
            })

            if (!response.ok) {
                throw new Error('Something is off, please try again :(')
            }

            const data = await response.json()
            setFlashcards(data)
        } catch (error) {
            console.error('Error generating flashcards:', error)
            alert('An error occurred while generating flashcards. Please try again.')
        }
    }

    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id]
        }))
    }

    const handleOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const saveFlashcards = async () => {
        if (!name) {
            alert('Please enter a name.')
            return
        }

        const batch = writeBatch(db)
        const userDocRef = doc(collection(db, 'users'), user.id)
        const docSnap = await getDoc(userDocRef)

        if (docSnap.exists()) {
            const collections = docSnap.data().flashcards || []
            if (collections.find((f) => f.name === name)) {
                alert('Flashcard collection with the same name already exists.')
                return
            } else {
                collections.push({ name })
                batch.set(userDocRef, { flashcards: collections }, { merge: true })
            }
        } else {
            batch.set(userDocRef, { flashcards: [{ name }] })
        }

        const colRef = collection(userDocRef, name)
        flashcards.forEach((flashcard) => {
            const cardDocRef = doc(colRef)
            batch.set(cardDocRef, flashcard)
        })

        await batch.commit()
        handleClose()
        router.push('/flashcards')
    }

    return (
        <Container maxWidth={false} sx={{ backgroundColor: '#BDC3C7', py: 4 }}>
            {/* Navigation Bar */}
            <AppBar position="static" color="primary" sx={{ boxShadow: 'none', backgroundColor: '#2C3E50', mb: 4 }}>
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

            {/* Top Section with Quote and Prompt Box */}
            <Box sx={{ mt: 4, mb: 6, textAlign: 'center' }}>
                <Typography variant="h4" sx={{ color: '#2C3E50', fontWeight: 'bold', mb: 2 }}>
                    Generate Flashcards
                </Typography>
                <Typography variant="body1" sx={{ color: '#2C3E50', fontStyle: 'italic', mb: 4 }}>
                    "Education is not the filling of a pail, but the lighting of a fire." — W.B. Yeats
                </Typography>
                <Paper
                    sx={{
                        p: 4,
                        width: '100%',
                        bgcolor: '#ECF0F1',
                        boxShadow: '0px 6px 12px rgba(0,0,0,0.2)',
                        borderRadius: '12px',
                    }}
                >
                    <TextField
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        label="Enter Text"
                        fullWidth
                        multiline
                        rows={4}
                        variant="outlined"
                        sx={{
                            mb: 2,
                            bgcolor: '#fff',
                            borderRadius: '8px',
                        }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        fullWidth
                        sx={{
                            borderRadius: '8px',
                            backgroundColor: '#2C3E50',
                            '&:hover': {
                                backgroundColor: '#1A242F',
                            },
                        }}
                    >
                        Submit
                    </Button>
                </Paper>
            </Box>

            {/* Flashcards Section */}
            {flashcards.length > 0 && (
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h5" component="h2" gutterBottom>
                        Generated Flashcards
                    </Typography>
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
                    <Box
                        sx={{
                            mt: 4,
                            display: 'flex',
                            justifyContent: 'center',
                        }}
                    >
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={handleOpen}
                            sx={{
                                borderRadius: '20px',
                                padding: '12px 24px',
                                backgroundColor: '#2C3E50',
                                color: '#fff',
                                '&:hover': {
                                    backgroundColor: '#1A242F',
                                },
                            }}
                        >
                            Save Flashcards
                        </Button>
                    </Box>
                </Box>
            )}

            {/* Dialog for Saving Flashcards */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>
                    Save Flashcards
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter a name for your flashcards collection.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Collection Name"
                        fullWidth
                        variant="standard"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={saveFlashcards}>Save</Button>
                </DialogActions>
            </Dialog>
        </Container>
    )
}
