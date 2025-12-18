// // import { Grid } from "@mui/material";
// // import UserHeader from "./Header";
// // import CountCard from "./CountCard";
// // import TabsPage from "./TabsPage";
// // import { ticketcounts } from "../../Api"
// // import { useEffect, useState } from "react";

// // const UserDashboard = () => {

// //     const [DashboardData, setDashboardData] = useState();
// //     const [loading, setLoading] = useState(true);
// //     const [error, setError] = useState("");

// //     const FetchData = async () => {
// //         try {
// //             setLoading(true);
// //             const res = await ticketcounts();
// //             setDashboardData(res.data)
// //             console.log("API Response:", res);
// //         } catch (err) {
// //             setError("Failed to fetch dashboard data");
// //         } finally {
// //             setLoading(false);
// //         }
// //     };

// //     useEffect(() => {
// //         FetchData();
// //     }, []);

// //     return (
// //         <>
// //             <Grid container spacing={2}>
// //                 <Grid size={12}>
// //                     <UserHeader />
// //                 </Grid>
// //                 <Grid size={12}>
// //                     <CountCard />
// //                 </Grid>
// //                 <Grid size={12}>
// //                     <TabsPage  DashboardData={DashboardData}/>
// //                 </Grid>
// //             </Grid>
// //         </>
// //     )
// // };

// // export default UserDashboard;
// import { Grid, Backdrop, CircularProgress, Box } from "@mui/material";
// import UserHeader from "./Header";
// import CountCard from "./CountCard";
// import TabsPage from "./TabsPage";
// import { ticketcounts } from "../../Api"
// import { useEffect, useState } from "react";
// import stemzLogo from "../../assets/download.png"; // Assuming the logo path; adjust as needed

// const UserDashboard = () => {

//     const [DashboardData, setDashboardData] = useState();
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState("");

//     const FetchData = async () => {
//         try {
//             setLoading(true);
//             const res = await ticketcounts();
//             setDashboardData(res.data)
//             console.log("API Response:", res);
//         } catch (err) {
//             setError("Failed to fetch dashboard data");
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         FetchData();
//     }, []);

//     return (
//         <>
//             <Grid container spacing={2}>
//                 <Grid size={12}>
//                     <UserHeader />
//                 </Grid>
//                 {/* <Grid size={12}>
//                     <CountCard />
//                 </Grid> */}
//                 <Grid size={12}>
//                     <TabsPage  DashboardData={DashboardData}/>
//                 </Grid>
//             </Grid>
//             <Backdrop
//                 sx={{ 
//                     color: 'linear-gradient(135deg, #667eea, #764ba2)', 
//                     zIndex: (theme) => theme.zIndex.drawer + 1,
//                     backdropFilter: 'blur(6px)',
//                     backgroundColor: 'rgba(0, 0, 0, 0.1)'
//                 }}
//                 open={loading}
//             >
//                 <Box
//                     sx={{
//                         position: 'relative',
//                         width: 120,
//                         height: 120,
//                         display: 'flex',
//                         alignItems: 'center',
//                         justifyContent: 'center'
//                     }}
//                 >
//                     <CircularProgress 
//                         color="inherit" 
//                         size={120} 
//                         thickness={4}
//                         sx={{
//                             position: 'absolute'
//                         }}
//                     />
//                     <img 
//                         src={stemzLogo} 
//                         alt="Stemz Logo" 
//                         style={{ 
//                             width: 80, 
//                             height: 80, 
//                             borderRadius: '50%',
//                             objectFit: 'cover',
//                             position: 'relative',
//                             zIndex: 1
//                         }} 
//                     />
//                 </Box>
//             </Backdrop>
//         </>
//     )
// };

// export default UserDashboard;

// // import { Grid } from "@mui/material";
// // import { useEffect, useState } from "react";
// // import UserHeader from "./Header";
// // import CountCard from "./CountCard";
// // import TabsPage from "./TabsPage";
// // import { ticketcounts } from "../../Api";

// // const UserDashboard = () => {
// //     const [loading, setLoading] = useState(true);
// //     const [approvalData, setApprovalData] = useState({});
// //     const [ticketData, setTicketData] = useState({});
// //     const [error, setError] = useState("");

// //     const FetchData = async () => {
// //         try {
// //             setLoading(true);
// //             const res = await ticketcounts(); // API CALL
// //             console.log("API Response:", res.data);

// //             // 🟢 Destructure the response
// //             const {
// //                 approval_data = {},
// //                 ticket_data = {}
// //             } = res.data.data || {};

// //             setApprovalData(approval_data);
// //             setTicketData(ticket_data);
// //         } catch (err) {
// //             setError("Failed to fetch dashboard data");
// //         } finally {
// //             setLoading(false);
// //         }
// //     };

// //     useEffect(() => {
// //         FetchData();
// //     }, []);

// //     if (loading) return <p style={{ padding: 20 }}>Loading...</p>;
// //     if (error) return <p style={{ padding: 20, color: "red" }}>{error}</p>;

// //     return (
// //         <>
// //             <Grid container spacing={2}>
// //                 <Grid item xs={12}>
// //                     <UserHeader />
// //                 </Grid>

// //                 <Grid item xs={12}>
// //                     <CountCard approvalData={approvalData} />
// //                 </Grid>

// //                 <Grid item xs={12}>
// //                     <TabsPage approvalData={approvalData} ticketData={ticketData} />
// //                 </Grid>
// //             </Grid>
// //         </>
// //     );
// // };

// // export default UserDashboard;


import { Grid, Backdrop, CircularProgress, Box } from "@mui/material";
import UserHeader from "./Header";
//import CountCard from "./CountCard";
//import TabsPage from "./TabsPage";
import { fetchApproverTickets, ticketcounts } from "../../Api"
import { useEffect, useState } from "react";
import stemzLogo from "../../assets/download.png";
import RequestTabs from "./RequestTabs";
import ApproverTabs from "./ApproverTabs";
import { toast } from "react-toastify";
 
const UserDashboard = () => {
 
    const [DashboardData, setDashboardData] = useState();
    console.log("dashboard", DashboardData)
    const [loading, setLoading] = useState(true);
    // const [error, setError] = useState("");
 
    const roleMapping = JSON.parse(
        localStorage.getItem("selected_role_mapping") || "{}"
    );
    const roleName = roleMapping?.role_name; // Technician, Admin, User, etc.
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
    console.log("userStats",userStatus);
   
 
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
                    {isTechnician ?
                        <ApproverTabs approverStatus={userStatus} />
                        :
                        <RequestTabs userStatus={userStatus} />
                    }
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
