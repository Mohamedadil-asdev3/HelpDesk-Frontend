import { Box, Card, CardContent, Grid, Typography, useMediaQuery, useTheme } from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import ErrorIcon from '@mui/icons-material/Error';

const HODCardData = ({ data }) => {

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    if (!data) return null; // Show nothing while loading

    // Map API values to status cards
    const statusCards = [
        { id: 1, label: "PENDING", color: "warning.main", icon: <ErrorIcon />, count: data.pending_count || 0 },
        { id: 2, label: "APPROVED", color: "success.main", icon: <CheckCircleIcon />, count: data.approved_count || 0 },
        { id: 3, label: "ON HOLD", color: "info.main", icon: <PauseCircleIcon />, count: data.on_hold_count || 0 },
        { id: 4, label: "REJECTED", color: "error.main", icon: <CancelIcon />, count: data.rejected_count || 0 },
        { id: 5, label: "SLA BREACHED", color: "warning.main", icon: <AccessTimeFilledIcon />, count: data.sla_breached_count || 0 },
    ];

    return (
        <Grid container spacing={2}>
            {statusCards.map((item) => (
                <Grid size={{ xs: 12, sm: 6, md: 6, lg: 2.4 }} key={item.id}>
                    <Card
                        sx={{
                            borderRadius: 8,
                            height: "80px",
                            //textAlign: "center",
                            width: "100%",
                            p: 0.5,
                            transition: "0.3s",
                            "&:hover": {
                                background: "linear-gradient(135deg, #667eea, #764ba2)",
                                transform: "translateY(-4px)",
                            },
                        }}
                    >
                        <CardContent sx={{ display: "flex", alignItems: "center", gap: 4 }}>
                            <Box
                                sx={{
                                    width: isMobile ? 35 : 45,
                                    height: isMobile ? 35 : 45,
                                    borderRadius: 3,
                                    backgroundColor: item.color,
                                    color: "#fff",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                {item.icon}
                            </Box>
                            <Box>
                                <Typography variant={isMobile ? "h6" : "h5"} fontWeight={600}>
                                    {item.count}
                                </Typography>
                                <Typography
                                    variant="subtitle1"
                                    fontWeight={600}
                                    sx={{
                                        color: "text.secondary",
                                        fontSize: isMobile ? 12 : 14,
                                        mt: { xs: 1, sm: 0 },
                                    }}
                                >
                                    {item.label}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    )
}

export default HODCardData;