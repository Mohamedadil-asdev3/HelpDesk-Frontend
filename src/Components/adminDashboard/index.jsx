// import { Box, Grid, CircularProgress, Alert } from "@mui/material";
// import { useState, useEffect } from "react";
// import TodayIcon from '@mui/icons-material/Today';
// import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
// import AddIcon from '@mui/icons-material/Add';
// import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
// import LocalOfferIcon from '@mui/icons-material/LocalOffer';
// import GroupsIcon from '@mui/icons-material/Groups';
// import { ticketcounts } from '../../Api';
// import AdminCardData from "./CardData";
// import AdminGraphData from "./GraphData";
// import AdminHeader from "./AdminHeader";

// const AdminDashboard = () => {
//     const [data, setData] = useState({
//         cards: null,
//         graphs: null,
//     });
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const fetchTicketCounts = async () => {
//             try {
//                 setLoading(true);
//                 setError(null);
//                 const today = new Date().toISOString().split('T')[0];
//                 // Start of the year
//                 const startOfYear = new Date(new Date().getFullYear(), 0, 1)
//                     .toISOString()
//                     .split('T')[0];

//                 const response = await ticketcounts({ start_date: startOfYear, end_date: today });

//                 if (!response.success) {
//                     throw new Error(response.error || 'Failed to fetch ticket counts');
//                 }

//                 const stats = response.data.overall_stats || {};
//                 const month_wise = stats.month_wise || [];

//                 // Transform for cards
//                 const cardData = [
//                     {
//                         id: 1,
//                         icon: <TodayIcon />,
//                         count: stats.today_tickets?.toString() || "0",
//                         name: "Today",
//                         color: "warning.main",
//                     },
//                     {
//                         id: 2,
//                         icon: <CalendarTodayIcon />,
//                         count: stats.month_tickets?.toString() || "0",
//                         name: "This Month",
//                         color: "success.main",
//                     },
//                     {
//                         id: 3,
//                         icon: <AddIcon />,
//                         count: stats.total_tickets?.toString() || "0",
//                         name: "Total Tickets",
//                         color: "info.main",
//                     },
//                     {
//                         id: 4,
//                         icon: <AccessTimeFilledIcon />,
//                         count: stats.sla_breached?.toString() || "0",
//                         name: "Late",
//                         color: "error.main",
//                     },
//                     {
//                         id: 5,
//                         icon: <LocalOfferIcon />,
//                         count: stats.on_hold?.toString() || "0",
//                         name: "Backlog",
//                         color: "warning.main",
//                     },
//                     {
//                         id: 6,
//                         icon: <GroupsIcon />,
//                         count: stats.user_count?.toString() || "0",
//                         name: "Users",
//                         color: "secondary.main",
//                     },
//                 ];

//                 // Transform for graphs
//                 const months = month_wise.map(m => m.month || '');
//                 const totalTicketsByMonth = month_wise.map(m => m.total_tickets || 0);

//                 const ticketsEvolution = {
//                     series: [
//                         {
//                             name: "Tickets",
//                             data: totalTicketsByMonth,
//                         },
//                     ],
//                     options: {
//                         chart: { type: "line", toolbar: { show: false } },
//                         xaxis: {
//                             categories: months,
//                         },
//                         stroke: { curve: "smooth" },
//                         colors: ["#4F46E5"],
//                     },
//                 };

//                 const openedTicketsStatus = {
//                     series: [
//                         stats.pending || 0,
//                         stats.approved || 0,
//                         stats.rejected || 0,
//                         stats.on_hold || 0,
//                     ],
//                     options: {
//                         labels: ["Pending", "Approved", "Rejected", "On Hold"],
//                         chart: { type: "pie" },
//                         colors: ["#2196F3", "#4CAF50", "#f44336", "#FFC107"],
//                         legend: { position: "bottom" },
//                     },
//                 };

//                 const last7DaysData = month_wise.slice(-7).map(m => m.total_tickets || 0);
//                 const last7days = {
//                     series: [
//                         {
//                             name: "Tickets",
//                             data: last7DaysData,
//                         },
//                     ],
//                     options: {
//                         chart: { type: "bar", toolbar: { show: false } },
//                         xaxis: {
//                             categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
//                         },
//                         plotOptions: { bar: { borderRadius: 5 } },
//                         colors: ["#6366F1"],
//                     },
//                 };

//                 setData({
//                     cards: cardData,
//                     graphs: {
//                         ticketsEvolution,
//                         openedTicketsStatus,
//                         last7days,
//                         // solvingPeriod and openTicketsAge use defaults as no API data provided
//                     },
//                 });
//             } catch (err) {
//                 setError(err.message);
//                 console.error("Failed to fetch ticket counts:", err);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchTicketCounts();
//     }, []);

//     if (loading) {
//         return (
//             <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 400 }}>
//                 <CircularProgress />
//             </Box>
//         );
//     }

//     if (error) {
//         return (
//             <Alert severity="error" sx={{ my: 2 }}>
//                 {error}
//             </Alert>
//         );
//     }

//     return (
//         <Box sx={{ mb: 2 }}>
//             <Grid container spacing={3}>
//                 <Grid size={12}>
//                     <AdminHeader />
//                 </Grid>
//                 <Grid size={12}>
//                     <AdminCardData cardData={data.cards} />
//                 </Grid>
//                 <Grid size={12}>
//                     <AdminGraphData graphData={data.graphs} />
//                 </Grid>
//             </Grid>
//         </Box>
//     );
// };

// export default AdminDashboard;

import { Box, Grid, CircularProgress, Alert } from "@mui/material";
import { useState, useEffect } from "react";
import TodayIcon from '@mui/icons-material/Today';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AddIcon from '@mui/icons-material/Add';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import GroupsIcon from '@mui/icons-material/Groups';
import { ticketcounts } from '../../Api'; // Adjust path as needed
import AdminCardData from "./CardData";
import AdminGraphData from "./GraphData";
import AdminHeader from "./AdminHeader";
import stemzLogo from "../../assets/download.png";

const AdminDashboard = () => {
    const [data, setData] = useState({
        cards: null,
        graphs: null,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTicketCounts = async () => {
            try {
                setLoading(true);
                setError(null);
                const today = new Date().toISOString().split('T')[0];
                // Start of the year
                const startOfYear = new Date(new Date().getFullYear(), 0, 1)
                    .toISOString()
                    .split('T')[0];

                const response = await ticketcounts({ start_date: startOfYear, end_date: today });

                if (!response.success) {
                    throw new Error(response.error || 'Failed to fetch ticket counts');
                }

                const stats = response.data.overall_stats || {};
                const month_wise = stats.month_wise || [];
                const last_7_days = stats.last_7_days || [];
                const open_tickets_age = stats.open_tickets_age || {};
                const solving_period = stats.solving_period || {};

                // Transform for cards
                const cardData = [
                    {
                        id: 1,
                        icon: <TodayIcon />,
                        count: stats.today_tickets?.toString() || "0",
                        name: "Today",
                        color: "warning.main",
                    },
                    {
                        id: 2,
                        icon: <CalendarTodayIcon />,
                        count: stats.month_tickets?.toString() || "0",
                        name: "This Month",
                        color: "success.main",
                    },
                    {
                        id: 3,
                        icon: <AddIcon />,
                        count: stats.total_tickets?.toString() || "0",
                        name: "Total Tickets",
                        color: "info.main",
                    },
                    {
                        id: 4,
                        icon: <AccessTimeFilledIcon />,
                        count: stats.sla_breached_count?.toString() || "0",
                        name: "SLA Breached",
                        color: "error.main",
                    },
                    // {
                    //     id: 5,
                    //     icon: <LocalOfferIcon />,
                    //     count: stats.on_hold?.toString() || "0",
                    //     name: "Backlog",
                    //     color: "warning.main",
                    // },
                    {
                        id: 6,
                        icon: <GroupsIcon />,
                        count: stats.user_count?.toString() || "0",
                        name: "Users",
                        color: "secondary.main",
                    },
                ];

                // Transform for graphs
                // 1. Tickets Evolution (Month-wise data)
                const months = month_wise.map(m => m.month?.substring(0, 3) || '');
                const totalTicketsByMonth = month_wise.map(m => m.total_tickets || 0);

                const ticketsEvolution = {
                    series: [
                        {
                            name: "Tickets",
                            data: totalTicketsByMonth,
                        },
                    ],
                    options: {
                        chart: { type: "line", toolbar: { show: false } },
                        xaxis: {
                            categories: months,
                        },
                        stroke: { curve: "smooth" },
                        colors: ["#4F46E5"],
                    },
                };

                // 2. Opened Tickets by Status (Pie Chart)
                const openedTicketsStatus = {
                    series: [
                        stats.pending || 0,
                        stats.approved || 0,
                        stats.rejected || 0,
                        stats.on_hold || 0,
                    ],
                    options: {
                        labels: ["Pending", "Approved", "Rejected", "On Hold"],
                        chart: { type: "pie" },
                        colors: ["#2196F3", "#4CAF50", "#f44336", "#FFC107"],
                        legend: { position: "bottom" },
                    },
                };

                // 3. Ticket Solving Period (Donut Chart)
                const solvingPeriod = {
                    series: [
                        solving_period.less_than_1_day || 0,
                        solving_period["1_to_2_days"] || 0,
                        solving_period["3_to_5_days"] || 0,
                        solving_period["6_to_10_days"] || 0,
                        solving_period.more_than_10_days || 0,
                    ],
                    options: {
                        labels: ["<1 day", "1-2 days", "3-5 days", "6-10 days", ">10 days"],
                        chart: { type: "donut" },
                        colors: ["#4CAF50", "#FFEB3B", "#FF9800", "#F44336", "#9C27B0"],
                        legend: { position: "bottom" },
                    },
                };

                // 4. Tickets - Last 7 Days (Bar Chart)
                const last7daysLabels = last_7_days.map(day => day.label || '');
                const last7daysCounts = last_7_days.map(day => day.count || 0);

                const last7days = {
                    series: [
                        {
                            name: "Tickets",
                            data: stats.last_7_days_counts || [0, 0, 0, 0, 0, 0, 0],
                        },
                    ],
                    options: {
                        chart: { type: "bar", toolbar: { show: false } },
                        xaxis: {
                            categories: stats.last_7_days_labels || ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                        },
                        plotOptions: { bar: { borderRadius: 5 } },
                        colors: ["#6366F1"],
                        dataLabels: { enabled: false },
                    },
                };

                // 5. Open Tickets Age (Horizontal Bar Chart)
                // Note: Your API data only has one set of data (probably for requests)
                // For incidents, you might need to get separate data
                const openTicketsAge = {
                    series: [
                        {
                            name: "Request",
                            data: [
                                open_tickets_age.today || 0,
                                open_tickets_age["1_day"] || 0,
                                open_tickets_age["2_days"] || 0,
                                open_tickets_age["3_days"] || 0,
                                open_tickets_age["4_days"] || 0,
                                open_tickets_age["5_days"] || 0,
                                open_tickets_age["6_days"] || 0,
                                open_tickets_age["7_plus_days"] || 0,
                            ],
                        },
                        // If you have incident data, add it here
                        // {
                        //     name: "Incident",
                        //     data: [0, 0, 0, 0, 0, 0, 0, 0],
                        // },
                    ],
                    options: {
                        chart: { type: "bar", toolbar: { show: false } },
                        xaxis: {
                            categories: ["Today", "1 day", "2 days", "3 days", "4 days", "5 days", "6 days", "7+ days"],
                        },
                        plotOptions: { bar: { borderRadius: 5, horizontal: true } },
                        colors: ["#2196F3", "#000000"],
                    },
                };

                setData({
                    cards: cardData,
                    graphs: {
                        ticketsEvolution,
                        openedTicketsStatus,
                        solvingPeriod,
                        last7days,
                        openTicketsAge,
                    },
                });
            } catch (err) {
                setError(err.message);
                console.error("Failed to fetch ticket counts:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchTicketCounts();
    }, []);

    // if (loading) {
    //     return (
    //         <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 400 }}>
    //             <CircularProgress />
    //         </Box>
    //     );
    // }
     if (loading) {
        return (
            <Box
                sx={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 9999,
                }}
            >
                <Box sx={{ position: "relative", width: 140, height: 140 }}>
                    {/* Circular Progress Ring */}
                    <CircularProgress
                        size={140}
                        thickness={4.5}
                        sx={{
                            color: "#4F46E5", // Change color if you want (indigo)
                        }}
                    />

                    {/* Stemz Logo Centered Inside */}
                    <Box
                        sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: 90,
                            height: 90,
                            borderRadius: "50%",
                            overflow: "hidden",
                            backgroundColor: "#fff",
                            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <img
                            src={stemzLogo}
                            alt="Stemz"
                            style={{
                                width: "80%",
                                height: "80%",
                                objectFit: "contain",
                            }}
                        />
                    </Box>
                </Box>

                {/* Optional subtle text below */}
                <Box sx={{ position: "absolute", bottom: 80, fontSize: "1.1rem", color: "#555", fontWeight: 500 }}>
                    Loading Dashboard...
                </Box>
            </Box>
        );
    }
    if (error) {
        return (
            <Alert severity="error" sx={{ my: 2 }}>
                {error}
            </Alert>
        );
    }

    return (
        <>
            <Box sx={{ mb: 2 }}>
                <Grid container spacing={2}>
                    <Grid size={12}>
                        <AdminHeader />
                    </Grid>
                    <Grid size={12}>
                        <AdminCardData cardData={data.cards} />
                    </Grid>
                    <Grid size={12}>
                        <AdminGraphData graphData={data.graphs} />
                    </Grid>
                </Grid>
            </Box>
        </>
    );
};

export default AdminDashboard;