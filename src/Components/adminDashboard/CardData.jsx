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

import { Box, Card, CardContent, Grid, Icon, Typography } from "@mui/material";
import TodayIcon from '@mui/icons-material/Today';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AddIcon from '@mui/icons-material/Add';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import GroupsIcon from '@mui/icons-material/Groups';

const AdminCardData = ({ cardData }) => {
    // If no data passed, fallback to empty/hardcoded (but ideally always pass props)
    const defaultCardData = [
        {
            id: 1,
            icon: <TodayIcon />,
            count: "0",
            name: "Today",
            color: "warning.main",
        },
        {
            id: 2,
            icon: <CalendarTodayIcon />,
            count: "0",
            name: "This Month",
            color: "success.main",
        },
        {
            id: 3,
            icon: <AddIcon />,
            count: "0",
            name: "Total Tickets",
            color: "info.main",
        },
        {
            id: 4,
            icon: <AccessTimeFilledIcon />,
            count: "0",
            name: "Late",
            color: "error.main",
        },
        {
            id: 5,
            icon: <LocalOfferIcon />,
            count: "0",
            name: "Backlog",
            color: "warning.main",
        },
        {
            id: 6,
            icon: <GroupsIcon />,
            count: "0",
            name: "Users",
            color: "secondary.main",
        },
    ];

    const dataToRender = cardData || defaultCardData;

    return (
        <Grid container spacing={2}>
            {dataToRender.map((data) => (
                <Grid item size={{ xs: 6, sm: 4, md: 4, lg: 2.4 }} key={data.id}>
                    <Card sx={{ borderRadius: 8, width: "100%" }}>
                        <CardContent sx={{ display: "flex", alignItems: "center", gap: 4 }}>
                            <Box
                                sx={{
                                    width: 35,
                                    height: 35,
                                    borderRadius: 3,
                                    backgroundColor: data.color,
                                    color: "#fff",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                {data.icon}
                            </Box>
                            <Box>
                                <Typography fontSize={22} fontWeight="bold">
                                    {data.count}
                                </Typography>
                                <Typography fontSize={17} fontWeight={550}>
                                    {data.name}
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