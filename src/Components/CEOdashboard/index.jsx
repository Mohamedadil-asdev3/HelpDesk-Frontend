import { Box, Grid, CircularProgress, Typography, Button } from "@mui/material";
import CEOCardData from "./CardData";
import CEOGraphData from "./GraphData";
import { useState, useEffect } from "react";
import { fetchCeodashboard } from "../../Api";
import RefreshIcon from '@mui/icons-material/Refresh';
import CeoHeader from "./CeoHeader";

const COEDashboard = () => {

    const [ceoData, setCeoData] = useState({
        overall: null,
        departmentWise: [],
        priorityWise: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getCeoData = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchCeodashboard();

            const transformedData = {
                overall: data?.overall || {
                    total_tickets: 0,
                    today_tickets: 0,
                    month_tickets: 0,
                    pending: 0,
                    approved: 0,
                    rejected: 0,
                    on_hold: 0,
                    solved: 0,
                    closed: 0,
                    sla_breached_count: 0,
                    sla_breached_tickets: []
                },
                departmentWise: data?.department_wise || [],
                priorityWise: data?.priority_wise || []
            };

            setCeoData(transformedData);
        } catch (error) {
            console.error("Error fetching CEO dashboard:", error);
            setError("Failed to load dashboard data");
            setCeoData({
                overall: {
                    total_tickets: 0,
                    today_tickets: 0,
                    month_tickets: 0,
                    pending: 0,
                    approved: 0,
                    rejected: 0,
                    on_hold: 0,
                    solved: 0,
                    closed: 0,
                    sla_breached_count: 0,
                    sla_breached_tickets: []
                },
                departmentWise: [],
                priorityWise: []
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getCeoData();
    }, []);

    const calculateMetrics = () => {
        if (!ceoData.overall) return {};

        const { overall } = ceoData;

        return {
            totalTickets: overall.total_tickets || 0,
            todayTickets: overall.today_tickets || 0,
            monthTickets: overall.month_tickets || 0,
            pendingTickets: overall.pending || 0,
            approvedTickets: overall.approved || 0,
            rejectedTickets: overall.rejected || 0,
            slaBreached: overall.sla_breached_count || 0,
            resolutionRate: overall.total_tickets > 0
                ? Math.round(((overall.approved + overall.solved + overall.closed) / overall.total_tickets) * 100)
                : 0
        };
    };

    const metrics = calculateMetrics();

    // Show main loader only during initial load
    if (loading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '50vh',
                    gap: 2
                }}
            >
                <CircularProgress size={60} />
                <Typography variant="h6" color="textSecondary">
                    Loading Dashboard Data...
                </Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '50vh',
                    gap: 2
                }}
            >
                <Typography variant="h6" color="error">
                    {error}
                </Typography>
                <Button
                    variant="contained"
                    onClick={getCeoData}
                    startIcon={<RefreshIcon />}
                >
                    Retry
                </Button>
            </Box>
        );
    }

    return (
        <Box sx={{ mb: 2 }}>
            <Grid container spacing={3}>
                <Grid size={12}>
                    <CeoHeader />
                </Grid>
                <Grid size={12}>
                    {/* Pass both raw data and calculated metrics */}
                    <CEOCardData
                        data={ceoData}
                        metrics={metrics}
                        loading={false} // No loading prop needed as main loader handles it
                        error={null}
                    />
                </Grid>
                <Grid size={12}>
                    {/* Pass structured data for graphs */}
                    <CEOGraphData
                        departmentData={ceoData.departmentWise}
                        priorityData={ceoData.priorityWise}
                        overallData={ceoData.overall}
                        loading={false} // No loading prop needed as main loader handles it
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

export default COEDashboard;