import { Box, Card, CardContent, Grid, Typography, useMediaQuery, useTheme } from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import ErrorIcon from '@mui/icons-material/Error';

const CEOCardData = ({ data, metrics, loading, error }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    // Calculate counts from API data
    const getStatusCounts = () => {
        if (!data?.overall) return {};

        const { overall } = data;
        return {
            pending: overall.pending || 0,
            approved: overall.approved || 0,
            rejected: overall.rejected || 0,
            onHold: overall.on_hold || 0,
            slaBreached: overall.sla_breached_count || 0,
            solved: overall.solved || 0,
            closed: overall.closed || 0
        };
    };

    const statusCounts = getStatusCounts();

    const statusCards = [
        {
            id: 1,
            label: "PENDING",
            color: "warning.main",
            icon: <ErrorIcon />,
            count: statusCounts.pending
        },
        {
            id: 2,
            label: "APPROVED",
            color: "success.main",
            icon: <CheckCircleIcon />,
            count: statusCounts.approved
        },
        {
            id: 3,
            label: "ON HOLD",
            color: "info.main",
            icon: <PauseCircleIcon />,
            count: statusCounts.onHold
        },
        {
            id: 4,
            label: "REJECTED",
            color: "error.main",
            icon: <CancelIcon />,
            count: statusCounts.rejected
        },
        {
            id: 5,
            label: "SLA BREACHED",
            color: "warning.main",
            icon: <AccessTimeFilledIcon />,
            count: statusCounts.slaBreached
        },
    ];

    return (
        <Grid container spacing={2}>
            {statusCards.map((item) => (
                <Grid size={{ xs: 6, sm: 4, md: 4, lg: 2.4 }} key={item.id}>
                    <Card
                        sx={{
                            borderRadius: 8,
                            height: "80px",
                            p: 1,
                            transition: "0.3s",
                            "&:hover": {
                                background: "linear-gradient(135deg, #667eea, #764ba2)",
                                transform: "translateY(-4px)",
                            },
                        }}
                    >
                        <CardContent
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: isMobile ? 2 : 4,
                                py: isMobile ? 1 : 2,
                            }}
                        >
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
    );
};

export default CEOCardData;