import { Box, Typography } from "@mui/material"

const Footer = () => {
    
    return (
        <>
            <Box sx={{ textAlign: "center", background: "#f0f0f0", color: "#0d0d0d", py: 1, }}>
                <Typography variant="caption" >&copy; {new Date().getFullYear()} My Project. All rights reserved.</Typography>
            </Box>
        </>
    );
};

export default Footer;