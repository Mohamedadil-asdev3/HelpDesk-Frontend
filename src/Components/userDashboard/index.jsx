import { Grid, Backdrop, CircularProgress, Box } from "@mui/material";
import UserHeader from "./Header";
//import CountCard from "./CountCard";
//import TabsPage from "./TabsPage";
import { fetchApproverTickets, ticketcounts } from "../../Api"
import { useEffect, useState } from "react";
import stemzLogo from "../../assets/download.png";
import UserTabs from "./UserTabs";
import TechnicianTabs from "./TechnicianTabs";
import { toast } from "react-toastify";
import AdminTabs from "./AdminTabs";

const UserDashboard = () => {

    const [DashboardData, setDashboardData] = useState();
    console.log("dashboard", DashboardData)
    const [loading, setLoading] = useState(true);
    // const [error, setError] = useState("");

    const roleMapping = JSON.parse(
        localStorage.getItem("selected_role_mapping") || "{}"
    );
    const roleName = roleMapping?.role_name; // Technician, Admin, User, etc.
    const isAdmin = roleName === "Admin";
    const isTechnician = roleName === "Technician";

    const fetchDashboard = async (filters = {}) => {
        try {
            setLoading(true);
            const res = await ticketcounts(filters);
            const apiData = res.data?.data || res.data;
            setDashboardData(apiData);
        } catch (err) {
            toast.error("Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    const userStatus = DashboardData?.user_stats || null;
    console.log("userStats", userStatus);


    // const FetchData = async () => {
    //     try {
    //         setLoading(true);
    //         const res = await ticketcounts();
    //         setDashboardData(res.data)
    //         console.log("API Response:", res);
    //     } catch (err) {
    //         setError("Failed to fetch dashboard data");
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    // useEffect(() => {
    //     FetchData();
    // }, []);

    // const userStatus = DashboardData?.user_stats || '';
    // console.log("user", userStatus);
    // const approverStatus = DashboardData?.approver_stats || '';
    // console.log("approver", approverStatus);

    return (
        <>
            <Grid container spacing={2}>
                <Grid size={12}>
                    <UserHeader fetchData={fetchDashboard} />
                </Grid>
                {/* <Grid size={12}>
                    <CountCard />
                </Grid> */}
                {/* <Grid size={12}>
                    <TabsPage  DashboardData={DashboardData}/>
                </Grid> */}
                <Grid size={12}>
                    {isAdmin ? (
                        <AdminTabs adminStatus={userStatus} />
                    ) : isTechnician ? (
                        <TechnicianTabs approverStatus={userStatus} />
                    ) : (
                        <UserTabs userStatus={userStatus} />
                    )}
                </Grid>
            </Grid>
            <Backdrop
                sx={{
                    color: 'linear-gradient(135deg, #667eea, #764ba2)',
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    backdropFilter: 'blur(6px)',
                    backgroundColor: 'rgba(0, 0, 0, 0.1)'
                }}
                open={loading}
            >
                <Box
                    sx={{
                        position: 'relative',
                        width: 120,
                        height: 120,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <CircularProgress
                        color="inherit"
                        size={120}
                        thickness={4}
                        sx={{
                            position: 'absolute'
                        }}
                    />
                    <img
                        src={stemzLogo}
                        alt="Stemz Logo"
                        style={{
                            width: 80,
                            height: 80,
                            borderRadius: '50%',
                            objectFit: 'cover',
                            position: 'relative',
                            zIndex: 1
                        }}
                    />
                </Box>
            </Backdrop>
        </>
    )
};

export default UserDashboard;