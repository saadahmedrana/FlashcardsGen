import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import db from "@/firebase";
import { Head, IconButton, AppBar, Box, Button, Grid, Container, Toolbar, Typography, LinearProgress, Card, CardActionArea } from "@mui/material";
import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { Title } from "@mui/icons-material";
import HomeIcon from '@mui/icons-material/Home'


export default function SignUpPage(){
    return <Container maxWidth={false} sx={{ backgroundColor: '#BDC3C7', py: 4 }}>
        <AppBar position="static" color="primary" sx={{ boxShadow: 'none', backgroundColor: '#2C3E50' }}>
            <Toolbar>
                <Typography 
                    variant="h6" 
                    sx={{
                        flexGrow: 1
                    }}
                >   
                    <IconButton edge="start" color="inherit" aria-label="home" href="/">
                        <HomeIcon />
                    </IconButton>
                    <Button color="inherit" href="/">
                        Flashcard SaaS                  
                    </Button>
                </Typography>

                <Button color="inherit">
                    <Link href="/sign-in" passHref>
                        Login
                    </Link>                    
                </Button>
                <Button color="inherit">
                    <Link href="/sign-up" passHref>
                        Sign Up
                    </Link>                    
                </Button>
            </Toolbar>
        </AppBar>

        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            sx={{textAlign: 'center', my: 4}}
        >
            <Typography variant="h4">
                Sign Up
            </Typography>
            <SignUp />
        </Box>
    </Container>
}