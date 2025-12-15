import { Box, Card, CardContent, Grid, Icon, Typography, useMediaQuery, useTheme } from "@mui/material";
import { FaTicket } from "react-icons/fa6";
import { FaCheckSquare } from "react-icons/fa";
import { FaWindowClose } from "react-icons/fa";

const CountCard = () => {

    const cardData = [
        {
            id: 1,
            count: 0,
            icon: <FaTicket />,
            cardName: "NEW + ASSIGNED",
            color: "warning"
        },
        {
            id: 2,
            count: 0,
            icon: <FaCheckSquare />,
            cardName: "SOLVED",
            color: "success"
        },
        {
            id: 3,
            count: 0,
            icon: <FaWindowClose />,
            cardName: "CLOSED",
            color: "info"
        },
    ];

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const isTablet = useMediaQuery(theme.breakpoints.between("md"));

    return (
        <>
            <Grid container spacing={2}>
                {cardData.map((data) => (
                    <Grid size={{ xs: 12, sm: 4, md: 4, lg: 4 }}>
                        <Card
                            sx={{
                                p: 1,
                                m: 1,
                                transition: "0.3s ease",
                                maxWidth: "600px",
                                borderRadius: 5,
                                "&:hover": {
                                    background: "linear-gradient(135deg, #667eea, #764ba2)",
                                    color: "#fff",
                                    transform: "scale(1.03)",
                                }
                            }}
                        >
                            <CardContent 
                            sx={{ 
                                        height: "100%", 
                                        display: "flex", 
                                        //flexDirection: "column",
                                        justifyContent: "space-between",
                                        p: 3
                                    }}>
                                <Box
                                    sx={{
                                        width: { xs: 50, sm: 40, md: 50 },
                                        height: { xs: 50, sm: 40, md: 50 },
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        borderRadius: 2,
                                        bgcolor: `${data.color}.main`,
                                        color: "#fff",
                                    }}
                                >
                                    <Icon sx={{ fontSize: { xs: 25, sm: 18, md: 25 } }}>{data.icon}</Icon>
                                </Box>
                                
                                    <Typography fontSize={{ xs: 25, sm: 20, md: 25 }} fontWeight={600}>
                                        {data.count}
                                    </Typography>
                                    <Typography fontSize={{ xs: 20, sm: 14, md: 20 }} fontWeight={550}>
                                        {data.cardName}
                                    </Typography>
                                
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid >
        </>
    );
};

export default CountCard;