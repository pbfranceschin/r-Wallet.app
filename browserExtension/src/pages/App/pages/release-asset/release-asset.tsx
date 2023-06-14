import React from "react";
import { Box, Container, Card, CardContent, Typography } from "@mui/material";
import Header from '../../components/header';

const ReleaseAsset = () => {

    return (
        <Container sx={{ width: '62vw', height: '100vh' }}>
            <Header />
            <Card sx={{ ml: 4, mr: 4, mt: 2, mb: 2 }}>
                <CardContent>
                    <Box
                    component="div"
                    display="flex"
                    flexDirection="row"
                    justifyContent="center"
                    alignItems="center"
                    sx={{
                    borderBottom: '1px solid rgba(0, 0, 0, 0.20)',
                    position: 'relative',
                    }}
                    >
                        <Typography variant="h6">Release Assets</Typography>
                    </Box>
                </CardContent>
            </Card>
        </Container>
    )

}

export default ReleaseAsset;