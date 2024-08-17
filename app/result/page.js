'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation"
import { CircularProgress, IconButton, AppBar, Box, Button, Grid, Container, Toolbar, Typography, LinearProgress, Card, CardActionArea } from "@mui/material";
import HomeIcon from '@mui/icons-material/Home'
import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs";



const ResultPage = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const session_id = searchParams.get('session_id')

    const [loading, setLoading] = useState(true)
    const [session, setSession] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchCheckourSession = async () => {
            if (!session_id) return

            try{
                const res = await fetch(`/api/checkout_session?session_id=${session_id}`)
                const sessionData = await res.json()
                if (res.ok) {
                    setSession(sessionData)
                } else {
                    setError(sessionData.error || 'An unexpected error occurred.')
                }
            } catch (err) {
                setError('An error occurred.')
            } finally {
                setLoading(false)
            }
        }
        fetchCheckourSession()
    }, [session_id])

    const handleGoHome = () => {
        router.push('/')
    }

    if (loading) {
        return (
            <Container
                maxWidth="100vw"
                sx={{
                    textAlign: 'center',
                    mt: 4,
                }}
            >
                <CircularProgress/>
                <Typography
                    variant="h6"
                >
                    Loading...
                </Typography>
            </Container>
        )
    }

    if (error){
        return(
            <Container
                maxWidth="100vw"
                sx={{
                    textAlign: 'center',
                    mt:4,
                }}
            >
                <Typography variant="h6">
                    {typeof error === 'string' ? error : JSON.stringify(error)}
                </Typography>
                <Button 
                    variant="contained" 
                    color="primary" 
                    sx={{ mt: 2 }} 
                    onClick={handleGoHome}
                >
                    Go to Home
                </Button>
            </Container>
        )
    }
    
    return(
        <Container maxWidth={false} sx={{ backgroundColor: '#BDC3C7', py: 4, }}>
            

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
        {
            session?.payment_status === 'paid' ? (
                <>
                    <Typography variant="h4" textAlign={"center"}>Thank you for purchasing!</Typography>
                    <Box sx={{mt: 2}}>
                        <Typography variant="h6" textAlign={"center"}>Session ID: {session_id}</Typography>
                        <Typography variant="body1" textAlign={"center"}>
                            We have received your payment. You will receive an email with the order details shortly.
                        </Typography>
                    </Box>
                </>
            ) : (
                <>
                    <Typography variant="h4" textAlign={"center"}>Payment Failed</Typography>
                    <Box sx={{mt: 2}}>
                        <Typography variant="body1" textAlign={"center"}>
                            Your payment was not successful. Please try again!
                        </Typography>
                    </Box>
                </>
            )
        }
        <Box textAlign={'center'}>
            <Button 
                variant="contained" 
                color="primary" 
                
                sx={{ mt: 4 }} 
                onClick={handleGoHome}
                    
            >
                Go to Home
            </Button>
        </Box>
        </Container>
    )
}

export default ResultPage
