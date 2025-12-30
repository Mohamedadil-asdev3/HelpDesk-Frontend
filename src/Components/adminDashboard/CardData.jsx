// import { Box, Card, CardContent, Grid, Icon, Typography, useMediaQuery, useTheme } from "@mui/material";
// import TodayIcon from '@mui/icons-material/Today';
// import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
// import AddIcon from '@mui/icons-material/Add';
// import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
// import LocalOfferIcon from '@mui/icons-material/LocalOffer';
// import GroupsIcon from '@mui/icons-material/Groups';

// const AdminCardData = ({ cardData }) => {

//     const theme = useTheme();
//     const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

//     // If no data passed, fallback to empty/hardcoded (but ideally always pass props)
//     const defaultCardData = [
//         {
//             id: 1,
//             icon: <TodayIcon />,
//             count: "0",
//             name: "Today",
//             color: "warning.main",
//         },
//         {
//             id: 2,
//             icon: <CalendarTodayIcon />,
//             count: "0",
//             name: "This Month",
//             color: "success.main",
//         },
//         {
//             id: 3,
//             icon: <AddIcon />,
//             count: "0",
//             name: "Total Tickets",
//             color: "info.main",
//         },
//         {
//             id: 4,
//             icon: <AccessTimeFilledIcon />,
//             count: "0",
//             name: "Late",
//             color: "error.main",
//         },
//         {
//             id: 5,
//             icon: <LocalOfferIcon />,
//             count: "0",
//             name: "Backlog",
//             color: "warning.main",
//         },
//         {
//             id: 6,
//             icon: <GroupsIcon />,
//             count: "0",
//             name: "Users",
//             color: "secondary.main",
//         },
//     ];

//     const dataToRender = cardData || defaultCardData;

//     return (
//         <Grid container spacing={2}>
//             {dataToRender.map((data) => (
//                 <Grid item size={{ xs: 6, sm: 4, md: 4, lg: 2 }} key={data.id}>
//                     <Card
//                         sx={{
//                             borderRadius: 8,
//                             transition: "0.3s",
//                             "&:hover": {
//                                 background: "linear-gradient(135deg, #667eea, #764ba2)",
//                                 transform: "translateY(-4px)",
//                             },
//                         }}
//                     >
//                         <CardContent sx={{ display: "flex", alignItems: "center", gap: 4 }}>
//                             <Box
//                                 sx={{
//                                     width: 35,
//                                     height: 35,
//                                     borderRadius: 3,
//                                     backgroundColor: data.color,
//                                     color: "#fff",
//                                     display: "flex",
//                                     alignItems: "center",
//                                     justifyContent: "center",
//                                 }}
//                             >
//                                 {data.icon}
//                             </Box>
//                             <Box>
//                                 <Typography fontSize={22} fontWeight="bold">
//                                     {data.count}
//                                 </Typography>
//                                 <Typography fontSize={17} fontWeight={550}>
//                                     {data.name}
//                                 </Typography>
//                             </Box>
//                         </CardContent>
//                     </Card>
//                 </Grid>
//             ))}
//         </Grid>
//     );
// };

// export default AdminCardData;

// import { Box, Card, CardContent, Grid, Icon, Typography } from "@mui/material";
// import TodayIcon from '@mui/icons-material/Today';
// import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
// import AddIcon from '@mui/icons-material/Add';
// import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
// import LocalOfferIcon from '@mui/icons-material/LocalOffer';
// import GroupsIcon from '@mui/icons-material/Groups';

// const AdminCardData = ({ cardData }) => {
//     // If no data passed, fallback to empty/hardcoded (but ideally always pass props)
//     const defaultCardData = [
//         {
//             id: 1,
//             icon: <TodayIcon />,
//             count: "0",
//             name: "Today",
//             color: "warning.main",
//         },
//         {
//             id: 2,
//             icon: <CalendarTodayIcon />,
//             count: "0",
//             name: "This Month",
//             color: "success.main",
//         },
//         {
//             id: 3,
//             icon: <AddIcon />,
//             count: "0",
//             name: "Total Tickets",
//             color: "info.main",
//         },
//         {
//             id: 4,
//             icon: <AccessTimeFilledIcon />,
//             count: "0",
//             name: "Late",
//             color: "error.main",
//         },
//         {
//             id: 5,
//             icon: <LocalOfferIcon />,
//             count: "0",
//             name: "Backlog",
//             color: "warning.main",
//         },
//         {
//             id: 6,
//             icon: <GroupsIcon />,
//             count: "0",
//             name: "Users",
//             color: "secondary.main",
//         },
//     ];

//     const dataToRender = cardData || defaultCardData;

//     return (
//         <Grid container spacing={2}>
//             {dataToRender.map((data) => (
//                 <Grid item size={{ xs: 6, sm: 4, md: 4, lg: 2.4 }} key={data.id}>
//                     <Card sx={{ borderRadius: 8, width: "100%" }}>
//                         <CardContent sx={{ display: "flex", alignItems: "center", gap: 4 }}>
//                             <Box
//                                 sx={{
//                                     width: 35,
//                                     height: 35,
//                                     borderRadius: 3,
//                                     backgroundColor: data.color,
//                                     color: "#fff",
//                                     display: "flex",
//                                     alignItems: "center",
//                                     justifyContent: "center",
//                                 }}
//                             >
//                                 {data.icon}
//                             </Box>
//                             <Box>
//                                 <Typography fontSize={22} fontWeight="bold">
//                                     {data.count}
//                                 </Typography>
//                                 <Typography fontSize={17} fontWeight={550}>
//                                     {data.name}
//                                 </Typography>
//                             </Box>
//                         </CardContent>
//                     </Card>
//                 </Grid>
//             ))}
//         </Grid>
//     );
// };

// export default AdminCardData;

// CardData.jsx
import React from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import { FaTicketAlt, FaClock, FaCalendarAlt, FaCheckCircle, FaLock, FaChartBar } from 'react-icons/fa';

const AdminCardData = ({ onCardClick, newAssigned, clarificationRequired, supplied, solved, closed, totalTickets }) => {
  const cardConfig = [
    { id: 1, count: newAssigned, icon: <FaTicketAlt />, cardName: "New Assigned Tickets", color: "primary", type: 'assigned' },
    { id: 2, count: clarificationRequired, icon: <FaClock />, cardName: "Clarification Required", color: "warning", type: 'pending' },
    { id: 3, count: supplied, icon: <FaCalendarAlt />, cardName: "Clarification Supplied", color: "info", type: 'planned' },
    { id: 4, count: solved, icon: <FaCheckCircle />, cardName: "Solved Tickets", color: "success", type: 'solved' },
    { id: 5, count: closed, icon: <FaLock />, cardName: "Closed Tickets", color: "secondary", type: 'closed' },
    { id: 6, count: totalTickets, icon: <FaChartBar />, cardName: "Total Tickets", color: "#333", type: 'total' },
  ];

  return (
    <Grid container spacing={2}>
      {cardConfig.map((config) => (
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }} key={config.id}>
          <Card
            onClick={() => onCardClick(config)}
            sx={{
              p: 1,
              m: 1,
              transition: "0.3s ease",
              maxWidth: "600px",
              borderRadius: 5,
              cursor: 'pointer',
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
                justifyContent: "space-between",
                p: 3
              }}
            >
              <Box
                sx={{
                  width: { xs: 50, sm: 40, md: 50 },
                  height: { xs: 50, sm: 40, md: 50 },
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 2,
                  bgcolor: config.color === "#333" ? "#333" : `${config.color}.main`,
                  color: "#fff",
                }}
              >
                <Box sx={{ fontSize: { xs: 25, sm: 18, md: 25 } }}>{config.icon}</Box>
              </Box>
              
              <Box sx={{ textAlign: 'right' }}>
                <Typography fontSize={{ xs: 25, sm: 20, md: 25 }} fontWeight={600}>
                  {(config.count || 0).toLocaleString()}
                </Typography>
                <Typography fontSize={{ xs: 20, sm: 14, md: 20 }} fontWeight={550}>
                  {config.cardName}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default AdminCardData;