// import { useState } from "react";

// import { Box, Button, FormControl, IconButton, MenuItem, Select, TextField, Typography, useMediaQuery, useTheme, } from "@mui/material";
// import FilterAltIcon from "@mui/icons-material/FilterAlt";
// import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";

// const AdminHeader = () => {

//     const [showFilters, setShowFilters] = useState(false);
//     const [startDate, setStartDate] = useState("2025-01-07");
//     const [endDate, setEndDate] = useState("2025-11-12");
//     const [priority, setPriority] = useState("");

//     const theme = useTheme();
//     const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
//     const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
//     const isLaptop = useMediaQuery(theme.breakpoints.between("md", "lg"));
//     const isLarge = useMediaQuery(theme.breakpoints.up("lg"));


//     const FilterUI = () => (
//         <Box
//             sx={{
//                 width: "100%",
//                 display: "flex",
//                 flexWrap: "wrap",

//                 flexDirection: {
//                     xs: "column",
//                     sm: "row",
//                     md: "row",
//                 },

//                 gap: 2,
//                 p: 2,
//                 borderRadius: 2,
//                 mt: 2,
//             }}
//         >
//             <TextField
//                 label="Start Date"
//                 type="date"
//                 size="small"
//                 InputLabelProps={{ shrink: true }}
//                 value={startDate}
//                 onChange={(e) => setStartDate(e.target.value)}
//                 inputProps={{ max: endDate || "" }}
//                 sx={{
//                     width: {
//                         xs: "100%",
//                         sm: "30%",
//                         md: "auto",
//                     },
//                     "& .MuiInputBase-root": {
//                         height: 35,
//                         borderRadius: "15px",
//                         backgroundColor: "#fff",
//                         color: "#000",
//                     },
//                 }}
//             />
//             <TextField
//                 label="End Date"
//                 type="date"
//                 size="small"
//                 InputLabelProps={{ shrink: true }}
//                 value={endDate}
//                 onChange={(e) => setEndDate(e.target.value)}
//                 inputProps={{ min: startDate || "" }}
//                 sx={{
//                     width: {
//                         xs: "100%",
//                         sm: "30%",
//                         md: "auto",
//                     },
//                     "& .MuiInputBase-root": {
//                         height: 35,
//                         borderRadius: "15px",
//                         backgroundColor: "#fff",
//                         color: "#000",
//                     },
//                 }}
//             />
//             <FormControl
//                 sx={{
//                     width: {
//                         xs: "100%",
//                         sm: "30%",
//                         md: "auto",
//                     },
//                     "& .MuiInputBase-root": {
//                         height: 35,
//                         borderRadius: "15px",
//                         backgroundColor: "#fff",
//                         color: "#000",
//                     },
//                 }}
//             >
//                 <Select
//                     value={priority}
//                     onChange={(e) => setPriority(e.target.value)}
//                     size="small"
//                     displayEmpty
//                     renderValue={(selected) =>
//                         selected === "" ? "Select priority" : selected
//                     }
//                 >
//                     <MenuItem disabled value="">
//                         Select priority
//                     </MenuItem>
//                     <MenuItem value="Very Low">Very Low</MenuItem>
//                     <MenuItem value="Low">Low</MenuItem>
//                     <MenuItem value="Medium">Medium</MenuItem>
//                     <MenuItem value="High">High</MenuItem>
//                     <MenuItem value="Very High">Very High</MenuItem>
//                 </Select>
//             </FormControl>
//             <Button
//                 variant="contained"
//                 onClick={() =>
//                     fetchData({
//                         start_date: startDate,
//                         end_date: endDate,
//                         priority,
//                     })
//                 }
//                 sx={{
//                     width: { xs: "100%", sm: "20%", md: "auto" },
//                     ml: isTablet ? 20 : 0,
//                     borderRadius: 5,
//                 }}
//             >
//                 Search
//             </Button>
//             <Button
//                 variant="contained"
//                 color="error"
//                 onClick={() => {
//                     setStartDate("");
//                     setEndDate("");
//                     setPriority("");
//                     setSearchTerm("");
//                     fetchData();
//                 }}
//                 sx={{
//                     width: { xs: "100%", sm: "20%", md: "auto" },
//                     borderRadius: 5,
//                 }}
//             >
//                 Clear
//             </Button>
//         </Box >
//     );

//     return (
//         <>
//             <Box
//                 sx={{
//                     display: "flex",
//                     flexDirection: "column",
//                     background: "linear-gradient(135deg, #667eea, #764ba2)",
//                     color: "#fff",
//                     borderRadius: "0 0 20px 20px",
//                     px: 4,
//                     py: 2,
//                 }}
//             >
//                 <Box
//                     sx={{
//                         display: "flex",
//                         justifyContent: "space-between",
//                         alignItems: "center",
//                         width: "100%",
//                     }}
//                 >
//                     <Typography
//                         fontSize={18}
//                         fontWeight={600}
//                         sx={{
//                             mt: { xs: 2, sm: 2, md: 0 },
//                         }}
//                     >
//                         Admin Dashboard
//                     </Typography>

//                     {(isLarge || isLaptop) && showFilters && (
//                         <Box>
//                             <FilterUI />
//                         </Box>
//                     )}
//                     <IconButton onClick={() => setShowFilters(!showFilters)}>
//                         {showFilters ? (
//                             <FilterAltOffIcon style={{ fontSize: 30, color: "#fff" }} />
//                         ) : (
//                             <FilterAltIcon style={{ fontSize: 30, color: "#fff" }} />
//                         )}
//                     </IconButton>
//                 </Box>
//                 {(isMobile || isTablet) && showFilters && (
//                     <Box mr={isMobile ? 2 : 0}>
//                         <FilterUI />
//                     </Box>
//                 )}
//             </Box>
//         </>
//     );
// };

// export default AdminHeader;
// AdminHeader.jsx
import React from 'react';
import { Typography } from '@mui/material';

const AdminHeader = () => {
  return (
    <Typography variant="h4" gutterBottom>
      Admin Helpdesk Dashboard
    </Typography>
  );
};

export default AdminHeader;