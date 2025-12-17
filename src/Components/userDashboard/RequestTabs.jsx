// import { useState, useEffect, useMemo } from "react";
// import { useTheme } from "@mui/material/styles";
// import { Box, Card, CardContent, Typography, Grid, TextField, Button, Table, TableHead, TableRow, TableCell, TableBody, TableContainer, useMediaQuery, Autocomplete, TablePagination, } from "@mui/material";
// import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// import CancelIcon from '@mui/icons-material/Cancel';
// import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
// import PauseCircleIcon from '@mui/icons-material/PauseCircle';
// import ErrorIcon from '@mui/icons-material/Error';
// import VisibilityIcon from '@mui/icons-material/Visibility';
// import { useNavigate } from "react-router-dom";

// const RequestTabs = ({ userStatus }) => {

//     const theme = useTheme();
//     const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

//     const [selectedType, setSelectedType] = useState("");
//     const [search, setSearch] = useState("");
//     const [department, setDepartment] = useState("");
//     const [tickets, setTickets] = useState({
//         pending: [],
//         approved: [],
//         hold: [],
//         rejected: [],
//         sla: []
//     });

//     const [page, setPage] = useState(0);
//     const [rowsPerPage, setRowsPerPage] = useState(5);

//     useEffect(() => {
//         if (userStatus) {
//             setTickets({
//                 pending: userStatus.pending_tickets || [],
//                 approved: userStatus.approved_tickets || [],
//                 hold: userStatus.on_hold_tickets || [],
//                 rejected: userStatus.rejected_tickets || [],
//                 sla: userStatus.sla_breached_tickets || []
//             });
//         }
//     }, [userStatus]);

//     const statusCards = [
//         { id: "pending", label: "PENDING", color: "warning.main", icon: <ErrorIcon />, count: userStatus?.pending || 0 },
//         { id: "approved", label: "APPROVED", color: "success.main", icon: <CheckCircleIcon />, count: userStatus?.approved || 0 },
//         { id: "hold", label: "ON HOLD", color: "info.main", icon: <PauseCircleIcon />, count: userStatus?.on_hold || 0 },
//         { id: "rejected", label: "REJECTED", color: "error.main", icon: <CancelIcon />, count: userStatus?.rejected || 0 },
//         { id: "sla", label: "SLA BREACHED", color: "warning.main", icon: <AccessTimeFilledIcon />, count: userStatus?.sla_breached_count || 0 },
//     ];

//     const selectedTickets = tickets[selectedType] || [];

//     const departmentList = useMemo(
//         () => [...new Set(selectedTickets.map((row) => row.department_detail?.field_name).filter(Boolean))],
//         [selectedTickets]
//     );

//     const headingMap = {
//         pending: "PENDING Tickets (MY REQUEST)",
//         approved: "APPROVED Tickets (MY REQUEST)",
//         hold: "ON HOLD Tickets (MY REQUEST)",
//         rejected: "REJECTED Tickets (MY REQUEST)",
//         sla: "SLA BREACHED Tickets (MY REQUEST)",
//     };

//     const RequestTabelCol = [
//         { id: 1, title: "Ticket ID" },
//         { id: 2, title: "Title" },
//         { id: 3, title: "Description" },
//         { id: 4, title: "Status" },
//         { id: 5, title: "Category" },
//         { id: 6, title: "Subcategory" },
//         { id: 7, title: "Priority" },
//         { id: 8, title: "Department" },
//         { id: 9, title: "Location" },
//         { id: 10, title: "Requested By" },
//         { id: 11, title: "Open Date" },
//         { id: 12, title: "Last Update" },
//         { id: 13, title: "Action" },
//     ];

//     const navigate = useNavigate();

//     // const handleTicketClick = (ticketId) => {
//     //     console.log('Storing ticket ID:', ticketId);
//     //     localStorage.setItem('selectedTicketId', ticketId);
//     //     console.log('Navigating to Approval');
//     //     navigate('/Approval');
//     // };

//     const handleTicketClick = (ticketNo) => {
//         console.log('Storing ticket ID:', ticketNo);
//         localStorage.setItem('selectedTicketId', ticketNo);
//         console.log('Navigating to Approval');
//         navigate('/Approval');
//     };

//     const filteredRows = useMemo(() => {
//         return selectedTickets.filter((row) => {
//             const matchesSearch =
//                 Object.values(row)
//                     .join(" ")
//                     .toLowerCase()
//                     .includes(search.toLowerCase());

//             const matchesDept = department ? row.department_detail?.field_name === department : true;

//             return matchesSearch && matchesDept;
//         });
//     }, [selectedTickets, search, department]);

//     const handleCardClick = (type) => {
//         setSelectedType(type);
//         setSearch("");
//         setDepartment("");
//         setPage(0);
//     };

//     const clearFilters = () => {
//         setSearch("");
//         setDepartment("");
//         setPage(0);
//     };


//     return (
//         <Box sx={{ width: "100%" }}>
//             <Card>
//                 <CardContent>
//                     <Typography
//                         textAlign="center"
//                         variant={isMobile ? "h6" : "h5"}
//                         fontWeight={700}
//                         sx={{ mb: 3 }}
//                     >
//                         MY REQUEST DASHBOARD
//                     </Typography>
//                     <Grid container spacing={2}>
//                         {statusCards.map((item) => (
//                             <Grid size={{ xs: 6, sm: 4, md: 3, lg: 2.4 }} key={item.id}>
//                                 <Card
//                                     onClick={() => handleCardClick(item.id)}
//                                     sx={{
//                                         borderRadius: 10,
//                                         height: isMobile ? "90px" : "80px",
//                                         boxShadow: selectedType === item.id ? "0px 4px 12px rgba(102,126,234,0.6)" : "0px 4px 10px rgba(0,0,0,0.1)",
//                                         border: selectedType === item.id ? "2px solid #667eea" : "2px solid transparent",
//                                         p: isMobile ? 0 : 1,
//                                         transition: "0.3s",
//                                         "&:hover": {
//                                             background: "linear-gradient(135deg, #667eea, #764ba2)",
//                                             transform: "translateY(-4px)",
//                                         },
//                                     }}
//                                 >
//                                     <CardContent
//                                         sx={{
//                                             display: "flex",
//                                             alignItems: "center",
//                                             gap: isMobile ? 2 : 4,
//                                         }}
//                                     >
//                                         <Box
//                                             sx={{
//                                                 width: 45,
//                                                 height: 45,
//                                                 borderRadius: "50%",
//                                                 backgroundColor: item.color,
//                                                 color: "#fff",
//                                                 display: "flex",
//                                                 alignItems: "center",
//                                                 justifyContent: "center",
//                                                 fontSize: 22,
//                                             }}
//                                         >
//                                             {item.icon}
//                                         </Box>
//                                         <Box>
//                                             <Typography variant={isMobile ? "h6" : "h5"} fontWeight={600}>
//                                                 {item.count}
//                                             </Typography>
//                                             <Typography
//                                                 variant="subtitle1"
//                                                 fontWeight={600}
//                                                 sx={{ color: "text.secondary", fontSize: isMobile ? 11 : 14 }}
//                                             >
//                                                 {item.label}
//                                             </Typography>
//                                         </Box>
//                                     </CardContent>
//                                 </Card>
//                             </Grid>
//                         ))}
//                     </Grid>
//                     {selectedType && (
//                         <Box>
//                             <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 5 }}>
//                                 <Typography variant="h6" fontWeight={700} sx={{ mt: 0.5 }}>
//                                     {headingMap[selectedType] || "Tickets"}
//                                 </Typography>
//                                 <Box
//                                     sx={{
//                                         display: "flex",
//                                         flexDirection: isMobile ? "column" : "row",
//                                         justifyContent: "flex-end",
//                                         gap: 2,
//                                     }}
//                                 >
//                                     <Autocomplete
//                                         options={departmentList}
//                                         value={department}
//                                         onChange={(e, newValue) => setDepartment(newValue)}
//                                         renderInput={(params) => <TextField {...params} label="Department" size="small" />}
//                                         sx={{
//                                             width: 200,
//                                             "& .MuiOutlinedInput-root": {
//                                                 borderRadius: 3,
//                                             }
//                                         }}
//                                     />
//                                     <TextField
//                                         size="small"
//                                         label="Search"
//                                         value={search}
//                                         onChange={(e) => setSearch(e.target.value)}
//                                         sx={{
//                                             width: 200,
//                                             "& .MuiOutlinedInput-root": {
//                                                 borderRadius: 3,
//                                             }
//                                         }}
//                                     />
//                                     <Button variant="outlined" fullWidth={isMobile} onClick={clearFilters} sx={{ borderRadius: 3 }}>
//                                         Clear
//                                     </Button>
//                                 </Box>
//                             </Box>
//                             <Card sx={{ borderRadius: 6, mt: 5 }}>
//                                 <TableContainer sx={{ overflowX: "auto" }}>
//                                     <Table>
//                                         <TableHead>
//                                             <TableRow>
//                                                 {RequestTabelCol.map((col) => (
//                                                     <TableCell key={col.id} sx={{ fontWeight: 700, whiteSpace: "nowrap" }}>
//                                                         {col.title}
//                                                     </TableCell>
//                                                 ))}
//                                             </TableRow>
//                                         </TableHead>
//                                         <TableBody>
//                                             {filteredRows.length > 0 ? (
//                                                 filteredRows
//                                                     .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//                                                     .map((t) => (
//                                                         <TableRow key={t.id} hover>
//                                                             <TableCell>{t.ticket_no}</TableCell>
//                                                             <TableCell>{t.title}</TableCell>
//                                                             <TableCell>{t.description}</TableCell>
//                                                             <TableCell>{t.status_detail?.field_values}</TableCell>
//                                                             <TableCell>{t.category_detail?.category_name || "-"}</TableCell>
//                                                             <TableCell>{t.subcategory_detail?.subcategory_name || "-"}</TableCell>
//                                                             <TableCell>{t.priority_detail?.field_values}</TableCell>
//                                                             <TableCell>{t.department_detail?.field_name}</TableCell>
//                                                             <TableCell>{t.location_detail?.field_name}</TableCell>
//                                                             <TableCell>{t.requested_detail?.email}</TableCell>
//                                                             <TableCell>{new Date(t.created_date).toLocaleString()}</TableCell>
//                                                             <TableCell>{new Date(t.updated_date).toLocaleString()}</TableCell>
//                                                             <TableCell>
//                                                                 <VisibilityIcon
//                                                                     // onClick={() => {
//                                                                     //     localStorage.setItem("selectedTicketId", JSON.stringify(t));   // Store in localStorage
//                                                                     //     navigate("/Approval", { state: { ticket: t } });             // Pass via router
//                                                                     // }}
//                                                                     onClick={() => handleTicketClick(t.ticket_no)}
//                                                                     //onClick={() => navigate("/Approval", { state: { ticket: t } })}
//                                                                     //onClick={() => navigate(`/Approval/${t.id}`)}
//                                                                     style={{ cursor: "pointer", color: "#667eea" }}
//                                                                 />
//                                                             </TableCell>
//                                                         </TableRow>
//                                                     ))
//                                             ) : (
//                                                 <TableRow>
//                                                     <TableCell colSpan={12} align="center">
//                                                         No tickets found.
//                                                     </TableCell>
//                                                 </TableRow>
//                                             )}
//                                         </TableBody>
//                                     </Table>
//                                 </TableContainer>
//                                 <TablePagination
//                                     component="div"
//                                     count={filteredRows.length}
//                                     page={page}
//                                     rowsPerPage={rowsPerPage}
//                                     onPageChange={(e, newPage) => setPage(newPage)}
//                                     onRowsPerPageChange={(e) => {
//                                         setRowsPerPage(parseInt(e.target.value, 5));
//                                         setPage(0);
//                                     }}
//                                 />
//                             </Card>
//                         </Box>
//                     )}
//                 </CardContent>
//             </Card>
//         </Box>
//     );
// };

// export default RequestTabs;

// import { useState, useEffect, useMemo } from "react";
// import { useTheme } from "@mui/material/styles";
// import { Box, Card, CardContent, Typography, Grid, TextField, Button, Table, TableHead, TableRow, TableCell, TableBody, TableContainer, useMediaQuery, Autocomplete, TablePagination, Stack, Pagination, Tooltip, IconButton, } from "@mui/material";
// import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// import CancelIcon from '@mui/icons-material/Cancel';
// import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
// import PauseCircleIcon from '@mui/icons-material/PauseCircle';
// import ErrorIcon from '@mui/icons-material/Error';
// import VisibilityIcon from '@mui/icons-material/Visibility';
// import { useNavigate } from "react-router-dom";

// const RequestTabs = ({ userStatus }) => {

//     const theme = useTheme();
//     const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

//     const [selectedType, setSelectedType] = useState("pending");
//     const [search, setSearch] = useState("");
//     const [department, setDepartment] = useState("");
//     const [tickets, setTickets] = useState({
//         pending: [],
//         approved: [],
//         hold: [],
//         rejected: [],
//         sla: []
//     });

//     const [page, setPage] = useState(0);
//     const [rowsPerPage, setRowsPerPage] = useState(5);

//     useEffect(() => {
//         if (userStatus) {
//             setTickets({
//                 pending: userStatus.pending_tickets || [],
//                 approved: userStatus.approved_tickets || [],
//                 hold: userStatus.on_hold_tickets || [],
//                 rejected: userStatus.rejected_tickets || [],
//                 sla: userStatus.sla_breached_tickets || []
//             });
//         }
//     }, [userStatus]);

//     const statusCards = [
//         { id: "pending", label: "PENDING", color: "warning.main", icon: <ErrorIcon />, count: userStatus?.pending || 0 },
//         { id: "approved", label: "APPROVED", color: "success.main", icon: <CheckCircleIcon />, count: userStatus?.approved || 0 },
//         { id: "hold", label: "ON HOLD", color: "info.main", icon: <PauseCircleIcon />, count: userStatus?.on_hold || 0 },
//         { id: "rejected", label: "REJECTED", color: "error.main", icon: <CancelIcon />, count: userStatus?.rejected || 0 },
//         { id: "sla", label: "SLA BREACHED", color: "warning.main", icon: <AccessTimeFilledIcon />, count: userStatus?.sla_breached_count || 0 },
//     ];

//     const selectedTickets = tickets[selectedType] || [];

//     const departmentList = useMemo(
//         () => [...new Set(selectedTickets.map((row) => row.department_detail?.field_name).filter(Boolean))],
//         [selectedTickets]
//     );

//     const headingMap = {
//         pending: "PENDING Tickets (MY REQUEST)",
//         approved: "APPROVED Tickets (MY REQUEST)",
//         hold: "ON HOLD Tickets (MY REQUEST)",
//         rejected: "REJECTED Tickets (MY REQUEST)",
//         sla: "SLA BREACHED Tickets (MY REQUEST)",
//     };

//     const RequestTabelCol = [
//         { id: 1, title: <>Ticket ID</> },
//         { id: 2, title: <>Title</> },
//         { id: 3, title: <>Description</> },
//         { id: 4, title: <>Status<br />Priority</> },
//         { id: 5, title: <>Category<br />Subcategory</> },
//         { id: 6, title: <>Department<br />Location</> },
//         { id: 7, title: <>Requested By</> },
//         { id: 8, title: <>Open Date<br />Last Update</> },
//         { id: 9, title: <>Action</> },
//     ];

//     // const RequestTabelCol = [
//     //     { id: 1, title: "Ticket ID" },
//     //     { id: 2, title: "Title" },
//     //     { id: 3, title: "Description" },
//     //     { id: 4, title: "Status Priority" },
//     //     { id: 5, title: "Category Subcategory" },
//     //     // { id: 6, title: "Subcategory" },
//     //     // { id: 7, title: "Priority" },
//     //     { id: 6, title: "Department Location" },
//     //     // { id: 9, title: "Location" },
//     //     { id: 7, title: "Requested By" },
//     //     { id: 8, title: "Open Date Last Update" },
//     //     // { id: 12, title: "Last Update" },
//     //     { id: 9, title: "Action" },
//     // ];

//     const navigate = useNavigate();

//     const handleTicketClick = (ticketNo) => {
//         console.log('Storing ticket No:', ticketNo);
//         localStorage.setItem('selectedTicketId', ticketNo);
//         console.log('Navigating to Approval');
//         navigate('/Approval');
//     };

//     const filteredRows = useMemo(() => {
//         return selectedTickets.filter((row) => {
//             const matchesSearch =
//                 Object.values(row)
//                     .join(" ")
//                     .toLowerCase()
//                     .includes(search.toLowerCase());

//             const matchesDept = department ? row.department_detail?.field_name === department : true;

//             return matchesSearch && matchesDept;
//         });
//     }, [selectedTickets, search, department]);

//     const handleCardClick = (type) => {
//         setSelectedType(type);
//         setSearch("");
//         setDepartment("");
//         setPage(0);
//     };

//     const clearFilters = () => {
//         setSearch("");
//         setDepartment("");
//         setPage(0);
//     };


//     return (
//         <Box sx={{ width: "100%" }}>
//             <Card>
//                 <CardContent>
//                     <Typography
//                         textAlign="center"
//                         variant={isMobile ? "h6" : "h5"}
//                         fontWeight={700}
//                         sx={{ mb: 3 }}
//                     >
//                         MY REQUEST DASHBOARD
//                     </Typography>
//                     <Grid container spacing={2}>
//                         {statusCards.map((item) => (
//                             <Grid size={{ xs: 6, sm: 4, md: 3, lg: 2.4 }} key={item.id}>
//                                 <Card
//                                     onClick={() => handleCardClick(item.id)}
//                                     sx={{
//                                         borderRadius: 10,
//                                         height: isMobile ? "90px" : "80px",
//                                         boxShadow: selectedType === item.id ? "0px 4px 12px rgba(102,126,234,0.6)" : "0px 4px 10px rgba(0,0,0,0.1)",
//                                         border: selectedType === item.id ? "2px solid #667eea" : "2px solid transparent",
//                                         p: isMobile ? 0 : 1,
//                                         transition: "0.3s",
//                                         "&:hover": {
//                                             background: "linear-gradient(135deg, #667eea, #764ba2)",
//                                             transform: "translateY(-4px)",
//                                         },
//                                     }}
//                                 >
//                                     <CardContent
//                                         sx={{
//                                             display: "flex",
//                                             alignItems: "center",
//                                             gap: isMobile ? 2 : 4,
//                                         }}
//                                     >
//                                         <Box
//                                             sx={{
//                                                 width: 45,
//                                                 height: 45,
//                                                 borderRadius: "50%",
//                                                 backgroundColor: item.color,
//                                                 color: "#fff",
//                                                 display: "flex",
//                                                 alignItems: "center",
//                                                 justifyContent: "center",
//                                                 fontSize: 22,
//                                             }}
//                                         >
//                                             {item.icon}
//                                         </Box>
//                                         <Box>
//                                             <Typography variant={isMobile ? "h6" : "h5"} fontWeight={600}>
//                                                 {item.count}
//                                             </Typography>
//                                             <Typography
//                                                 variant="subtitle1"
//                                                 fontWeight={600}
//                                                 sx={{ color: "text.secondary", fontSize: isMobile ? 11 : 14 }}
//                                             >
//                                                 {item.label}
//                                             </Typography>
//                                         </Box>
//                                     </CardContent>
//                                 </Card>
//                             </Grid>
//                         ))}
//                     </Grid>
//                     {selectedType && (
//                         <Box>
//                             <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 5 }}>
//                                 <Typography variant="h6" fontWeight={700} sx={{ mt: 0.5 }}>
//                                     {headingMap[selectedType] || "Tickets"}
//                                 </Typography>
//                                 <Box
//                                     sx={{
//                                         display: "flex",
//                                         flexDirection: isMobile ? "column" : "row",
//                                         justifyContent: "flex-end",
//                                         gap: 2,
//                                     }}
//                                 >
//                                     <Autocomplete
//                                         options={departmentList}
//                                         value={department}
//                                         onChange={(e, newValue) => setDepartment(newValue)}
//                                         renderInput={(params) => <TextField {...params} label="Department" size="small" />}
//                                         sx={{
//                                             width: 200,
//                                             "& .MuiOutlinedInput-root": {
//                                                 borderRadius: 3,
//                                             }
//                                         }}
//                                     />
//                                     <TextField
//                                         size="small"
//                                         label="Search"
//                                         value={search}
//                                         onChange={(e) => setSearch(e.target.value)}
//                                         sx={{
//                                             width: 200,
//                                             "& .MuiOutlinedInput-root": {
//                                                 borderRadius: 3,
//                                             }
//                                         }}
//                                     />
//                                     <Button variant="outlined" fullWidth={isMobile} onClick={clearFilters} sx={{ borderRadius: 3 }}>
//                                         Clear
//                                     </Button>
//                                 </Box>
//                             </Box>
//                             <Card sx={{ borderRadius: 6, mt: 5 }}>
//                                 {isMobile ? (
//                                     <Box>
//                                         {filteredRows.length > 0 ? (
//                                             filteredRows
//                                                 .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//                                                 .map((t) => (
//                                                     <Card
//                                                         sx={{
//                                                             mb: 2,
//                                                             borderRadius: 4,
//                                                             //boxShadow: "0px 6px 16px rgba(0,0,0,0.08)",
//                                                         }}
//                                                     >
//                                                         <CardContent>
//                                                             {/* Header */}
//                                                             <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                                                                 <Typography fontWeight={700}>
//                                                                     #{t.ticket_no}
//                                                                 </Typography>
//                                                                 <Typography
//                                                                     fontSize={12}
//                                                                     fontWeight={600}
//                                                                     sx={{
//                                                                         px: 1.5,
//                                                                         py: 0.5,
//                                                                         borderRadius: 3,
//                                                                         backgroundColor: "#eef2ff",
//                                                                         color: "#667eea",
//                                                                     }}
//                                                                 >
//                                                                     {t.status_detail?.field_values}
//                                                                 </Typography>
//                                                             </Box>

//                                                             {/* Title */}
//                                                             <Typography fontWeight={600} mt={1}>
//                                                                 {t.title}
//                                                             </Typography>

//                                                             {/* Priority */}
//                                                             <Typography fontSize={13} color="text.secondary">
//                                                                 Priority: {t.priority_detail?.field_values || "-"}
//                                                             </Typography>

//                                                             {/* Category */}
//                                                             <Typography fontSize={13} mt={1}>
//                                                                 <strong>Category:</strong>{" "}
//                                                                 {t.category_detail?.category_name || "-"} /{" "}
//                                                                 {t.subcategory_detail?.subcategory_name || "-"}
//                                                             </Typography>

//                                                             {/* Department & Location */}
//                                                             <Typography fontSize={13}>
//                                                                 <strong>Dept:</strong>{" "}
//                                                                 {t.department_detail?.field_name || "-"} |{" "}
//                                                                 {t.location_detail?.field_name || "-"}
//                                                             </Typography>

//                                                             {/* Dates */}
//                                                             <Typography fontSize={12} color="text.secondary" mt={1}>
//                                                                 Open: {new Date(t.created_date).toLocaleString()} <br />
//                                                                 Update:{new Date(t.updated_date).toLocaleString()}
//                                                             </Typography>

//                                                             {/* Action */}
//                                                             <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
//                                                                 <IconButton
//                                                                     onClick={() => handleTicketClick(t.ticket_no)}
//                                                                     sx={{
//                                                                         //backgroundColor: "#667eea",
//                                                                         color: "#667eea",
//                                                                         //"&:hover": { backgroundColor: "#556cd6" },
//                                                                     }}
//                                                                 >
//                                                                     <VisibilityIcon />
//                                                                 </IconButton>
//                                                             </Box>
//                                                         </CardContent>
//                                                     </Card>
//                                                 ))
//                                         ) : (
//                                             <Typography align="center">No tickets found.</Typography>
//                                         )}
//                                     </Box>
//                                 ) : (
//                                     <TableContainer sx={{ overflowX: "auto" }}>
//                                         <Table>
//                                             <TableHead>
//                                                 <TableRow>
//                                                     {RequestTabelCol.map((col) => (
//                                                         <TableCell key={col.id} sx={{ fontWeight: 700, whiteSpace: "nowrap" }}>
//                                                             {col.title}
//                                                         </TableCell>
//                                                     ))}
//                                                 </TableRow>
//                                             </TableHead>
//                                             <TableBody>
//                                                 {filteredRows.length > 0 ? (
//                                                     filteredRows
//                                                         .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//                                                         .map((t) => (
//                                                             <TableRow key={t.id} hover>
//                                                                 <TableCell>{t.ticket_no}</TableCell>
//                                                                 <TableCell>{t.title}</TableCell>
//                                                                 <TableCell>
//                                                                     <Tooltip
//                                                                         title={t.description || "No description"}
//                                                                         arrow
//                                                                         placement="top"
//                                                                     >
//                                                                         <Typography
//                                                                             sx={{
//                                                                                 maxWidth: 200,
//                                                                                 whiteSpace: "nowrap",
//                                                                                 overflow: "hidden",
//                                                                                 textOverflow: "ellipsis",
//                                                                                 cursor: "pointer"
//                                                                             }}
//                                                                         >
//                                                                             {t.description || "-"}
//                                                                         </Typography>
//                                                                     </Tooltip>
//                                                                 </TableCell>
//                                                                 <TableCell>
//                                                                     {t.status_detail?.field_values} <br />
//                                                                     {t.priority_detail?.field_values}
//                                                                 </TableCell>
//                                                                 <TableCell>
//                                                                     <Tooltip
//                                                                         arrow
//                                                                         placement="top"
//                                                                         title={
//                                                                             <Box>
//                                                                                 <div><strong>Category:</strong> {t.category_detail?.category_name || "-"}</div>
//                                                                                 <div><strong>Subcategory:</strong> {t.subcategory_detail?.subcategory_name || "-"}</div>
//                                                                             </Box>
//                                                                         }
//                                                                     >
//                                                                         <Box sx={{ cursor: "pointer" }}>
//                                                                             {t.category_detail?.category_name || "-"} <br />
//                                                                             {t.subcategory_detail?.subcategory_name || "-"}
//                                                                         </Box>
//                                                                     </Tooltip>
//                                                                 </TableCell>
//                                                                 {/* <TableCell>{t.subcategory_detail?.subcategory_name || "-"}</TableCell> */}
//                                                                 {/* <TableCell>{t.priority_detail?.field_values}</TableCell> */}
//                                                                 <TableCell>
//                                                                     {t.department_detail?.field_name} <br />
//                                                                     {t.location_detail?.field_name}
//                                                                 </TableCell>
//                                                                 {/* <TableCell>{t.location_detail?.field_name}</TableCell> */}
//                                                                 <TableCell>{t.requested_detail?.email}</TableCell>
//                                                                 <TableCell>
//                                                                     {new Date(t.created_date).toLocaleString()} <br />
//                                                                     {new Date(t.updated_date).toLocaleString()}
//                                                                 </TableCell>
//                                                                 {/* <TableCell>{new Date(t.updated_date).toLocaleString()}</TableCell> */}
//                                                                 <TableCell>
//                                                                     <VisibilityIcon
//                                                                         // onClick={() => {
//                                                                         //     localStorage.setItem("selectedTicketId", JSON.stringify(t));   // Store in localStorage
//                                                                         //     navigate("/Approval", { state: { ticket: t } });             // Pass via router
//                                                                         // }}
//                                                                         onClick={() => handleTicketClick(t.ticket_no)}
//                                                                         //onClick={() => navigate("/Approval", { state: { ticket: t } })}
//                                                                         //onClick={() => navigate(`/Approval/${t.id}`)}
//                                                                         style={{ cursor: "pointer", color: "#667eea" }}
//                                                                     />
//                                                                 </TableCell>
//                                                             </TableRow>
//                                                         ))
//                                                 ) : (
//                                                     <TableRow>
//                                                         <TableCell colSpan={12} align="center">
//                                                             No tickets found.
//                                                         </TableCell>
//                                                     </TableRow>
//                                                 )}
//                                             </TableBody>
//                                         </Table>
//                                     </TableContainer>
//                                 )}

//                                 <Stack direction="row" justifyContent="end" sx={{ py: 2, px: 2 }}>
//                                     <Pagination
//                                         count={Math.ceil(filteredRows.length / rowsPerPage)}
//                                         page={page + 1}
//                                         onChange={(e, value) => setPage(value - 1)}
//                                         variant="outlined"
//                                         shape="rounded"
//                                         showFirstButton={false}
//                                         showLastButton={false}
//                                         siblingCount={0}
//                                         boundaryCount={1}
//                                         sx={{
//                                             "& .MuiPaginationItem-root": {
//                                                 borderRadius: "20px",
//                                                 minWidth: 40,
//                                                 height: 40,
//                                             },
//                                         }}
//                                     />
//                                 </Stack>
//                             </Card>
//                         </Box>
//                     )}
//                 </CardContent>
//             </Card>
//         </Box>
//     );
// };

// export default RequestTabs;
// import { useState, useEffect, useMemo } from "react";
// import { useTheme } from "@mui/material/styles";
// import { Box, Card, CardContent, Typography, Grid, TextField, Button, Table, TableHead, TableRow, TableCell, TableBody, TableContainer, useMediaQuery, Autocomplete, TablePagination, Stack, Pagination, Tooltip, IconButton, Icon} from "@mui/material";
// import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// import CancelIcon from '@mui/icons-material/Cancel';
// import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
// import PauseCircleIcon from '@mui/icons-material/PauseCircle';
// import ErrorIcon from '@mui/icons-material/Error';
// import VisibilityIcon from '@mui/icons-material/Visibility';
// import { useNavigate } from "react-router-dom";
// import NewReleasesIcon from '@mui/icons-material/NewReleases'; // For New Assigned
// import DoneAllIcon from '@mui/icons-material/DoneAll'; // For Solved
// import LockIcon from '@mui/icons-material/Lock'; // For Closed

// const RequestTabs = ({ userStatus }) => {

//     const theme = useTheme();
//     const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
//     const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
//     const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

//     const [selectedType, setSelectedType] = useState("new_assigned");
//     const [search, setSearch] = useState("");
//     const [department, setDepartment] = useState("");
//     const [tickets, setTickets] = useState({
//         new_assigned: [],
//         solved: [],
//         closed: []
//     });

//     const [page, setPage] = useState(0);
//     const [rowsPerPage, setRowsPerPage] = useState(5);

//     useEffect(() => {
//         if (userStatus) {
//             setTickets({
//                 new_assigned: userStatus.new_assigned_tickets || [],
//                 solved: userStatus.solved_tickets || [],
//                 closed: userStatus.closed_tickets || []
//             });
//         }
//     }, [userStatus]);

//     // UPDATED: Only show New Assigned, Solved, and Closed cards
//     const statusCards = [
//         { 
//             id: "new_assigned", 
//             label: "NEW ASSIGNED", 
//             color: "warning",
//             icon: <NewReleasesIcon />, 
//             count: userStatus?.new_assigned || 0,
//             description: "Tickets recently assigned to you"
//         },
//         { 
//             id: "solved", 
//             label: "SOLVED", 
//             color: "success",
//             icon: <DoneAllIcon />, 
//             count: userStatus?.solved || 0,
//             description: "Tickets you have resolved"
//         },
//         { 
//             id: "closed", 
//             label: "CLOSED", 
//             color: "info",
//             icon: <LockIcon />, 
//             count: userStatus?.closed || 0,
//             description: "Tickets that are completed"
//         },
//     ];

//     const selectedTickets = tickets[selectedType] || [];

//     const departmentList = useMemo(
//         () => [...new Set(selectedTickets.map((row) => row.department_detail?.field_name).filter(Boolean))],
//         [selectedTickets]
//     );

//     // UPDATED: Headings for New Assigned, Solved, Closed
//     const headingMap = {
//         new_assigned: "NEW ASSIGNED TICKETS (MY REQUEST)",
//         solved: "SOLVED TICKETS (MY REQUEST)",
//         closed: "CLOSED TICKETS (MY REQUEST)",
//     };

//     const RequestTabelCol = [
//         { id: 1, title: <>Ticket ID</> },
//         { id: 2, title: <>Title</> },
//         { id: 3, title: <>Description</> },
//         { id: 4, title: <>Status<br />Priority</> },
//         { id: 5, title: <>Category<br />Subcategory</> },
//         { id: 6, title: <>Department<br />Location</> },
//         { id: 7, title: <>Requested By</> },
//         { id: 8, title: <>Open Date<br />Last Update</> },
//         { id: 9, title: <>Action</> },
//     ];

//     const navigate = useNavigate();

//     const handleTicketClick = (ticketNo) => {
//         console.log('Storing ticket No:', ticketNo);
//         localStorage.setItem('selectedTicketId', ticketNo);
//         console.log('Navigating to Approval');
//         navigate('/Approval');
//     };

//     const filteredRows = useMemo(() => {
//         return selectedTickets.filter((row) => {
//             const matchesSearch =
//                 Object.values(row)
//                     .join(" ")
//                     .toLowerCase()
//                     .includes(search.toLowerCase());

//             const matchesDept = department ? row.department_detail?.field_name === department : true;

//             return matchesSearch && matchesDept;
//         });
//     }, [selectedTickets, search, department]);

//     const handleCardClick = (type) => {
//         setSelectedType(type);
//         setSearch("");
//         setDepartment("");
//         setPage(0);
//     };

//     const clearFilters = () => {
//         setSearch("");
//         setDepartment("");
//         setPage(0);
//     };

//     return (
//         <Box sx={{ width: "100%" }}>
//             <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
//                 <CardContent>
//                     <Typography
//                         textAlign="center"
//                         variant={isMobile ? "h6" : "h5"}
//                         fontWeight={700}
//                         sx={{ mb: 4, color: "#2D3748" }}
//                     >
//                         MY REQUEST DASHBOARD
//                     </Typography>

//                     {/* UPDATED: Grid with only 3 cards - Full width */}
//                     <Grid container spacing={3} sx={{ mb: 4 }}>
//                         {statusCards.map((item) => (
//                             <Grid size={{xs:12,sm:6,md:4}} key={item.id}>
//                                 <Card
//                                     onClick={() => handleCardClick(item.id)}
//                                     sx={{
//                                 p: 1,
//                                 m: 1,
//                                 transition: "0.3s ease",
//                                 maxWidth: "600px",
//                                 borderRadius: 5,
//                                 "&:hover": {
//                                     background: "linear-gradient(135deg, #667eea, #764ba2)",
//                                     color: "#fff",
//                                     transform: "scale(1.03)",
//                                 }
//                             }}
//                                 >
//                                     <CardContent 
//                                     sx={{ 
//                                         height: "100%", 
//                                         display: "flex", 
//                                         //flexDirection: "column",
//                                         justifyContent: "space-between",
//                                         p: 3
//                                     }}>
//                                         <Box
//                                     sx={{
//                                         width: { xs: 50, sm: 40, md: 50 },
//                                         height: { xs: 50, sm: 40, md: 50 },
//                                         display: "flex",
//                                         alignItems: "center",
//                                         justifyContent: "center",
//                                         borderRadius: 2,
//                                         bgcolor: `${item.color}.main`,
//                                         color: "#fff",
//                                     }}
//                                 >
//                                     <Icon sx={{ fontSize: { xs: 25, sm: 18, md: 25 } }}>{item.icon}</Icon>
//                                 </Box>
//                                     <Typography fontSize={{ xs: 25, sm: 20, md: 25 }} fontWeight={600}>
//                                         {item.count}
//                                     </Typography>
//                                     <Typography fontSize={{ xs: 20, sm: 14, md: 20 }} fontWeight={550}>
//                                         {item.label}
//                                     </Typography>        

//                                     </CardContent>
//                                 </Card>
//                             </Grid>
//                         ))}
//                     </Grid>

//                     {selectedType && (
//                         <Box>
//                             <Box sx={{ 
//                                 display: "flex", 
//                                 justifyContent: "space-between", 
//                                 alignItems: "center", 
//                                 mb: 4,
//                                 flexDirection: isMobile ? "column" : "row",
//                                 gap: isMobile ? 2 : 0
//                             }}>
//                                 <Typography variant="h5" fontWeight={700} sx={{ color: "#2D3748" }}>
//                                     {headingMap[selectedType] || "Tickets"}
//                                 </Typography>
//                                 <Box
//                                     sx={{
//                                         display: "flex",
//                                         flexDirection: isMobile ? "column" : "row",
//                                         justifyContent: "flex-end",
//                                         gap: 2,
//                                         width: isMobile ? "100%" : "auto"
//                                     }}
//                                 >
//                                     <Autocomplete
//                                         options={departmentList}
//                                         value={department}
//                                         onChange={(e, newValue) => setDepartment(newValue)}
//                                         renderInput={(params) => (
//                                             <TextField 
//                                                 {...params} 
//                                                 label="Department" 
//                                                 size="small" 
//                                                 variant="outlined"
//                                             />
//                                         )}
//                                         sx={{
//                                             width: isMobile ? "100%" : 200,
//                                             "& .MuiOutlinedInput-root": {
//                                                 borderRadius: 2,
//                                             }
//                                         }}
//                                     />
//                                     <TextField
//                                         size="small"
//                                         label="Search"
//                                         value={search}
//                                         onChange={(e) => setSearch(e.target.value)}
//                                         variant="outlined"
//                                         sx={{
//                                             width: isMobile ? "100%" : 200,
//                                             "& .MuiOutlinedInput-root": {
//                                                 borderRadius: 2,
//                                             }
//                                         }}
//                                     />
//                                     <Button 
//                                         variant="outlined" 
//                                         fullWidth={isMobile} 
//                                         onClick={clearFilters} 
//                                         sx={{ 
//                                             borderRadius: 2,
//                                             borderColor: "#CBD5E0",
//                                             color: "#4A5568",
//                                             "&:hover": {
//                                                 borderColor: "#667eea",
//                                                 backgroundColor: "#667eea10"
//                                             }
//                                         }}
//                                     >
//                                         Clear
//                                     </Button>
//                                 </Box>
//                             </Box>

//                             <Card sx={{ 
//                                 borderRadius: 3, 
//                                 boxShadow: 2,
//                                 overflow: "hidden"
//                             }}>
//                                 {isMobile ? (
//                                     <Box sx={{ p: 2 }}>
//                                         {filteredRows.length > 0 ? (
//                                             filteredRows
//                                                 .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//                                                 .map((t) => (
//                                                     <Card
//                                                         sx={{
//                                                             mb: 2,
//                                                             borderRadius: 2,
//                                                             boxShadow: "0px 2px 8px rgba(0,0,0,0.05)",
//                                                         }}
//                                                         key={t.id}
//                                                     >
//                                                         <CardContent>
//                                                             {/* Header */}
//                                                             <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                                                                 <Typography fontWeight={700} color="#667eea">
//                                                                     #{t.ticket_no}
//                                                                 </Typography>
//                                                                 <Typography
//                                                                     fontSize={12}
//                                                                     fontWeight={600}
//                                                                     sx={{
//                                                                         px: 1.5,
//                                                                         py: 0.5,
//                                                                         borderRadius: 2,
//                                                                         backgroundColor: "#eef2ff",
//                                                                         color: "#667eea",
//                                                                     }}
//                                                                 >
//                                                                     {t.status_detail?.field_values}
//                                                                 </Typography>
//                                                             </Box>

//                                                             {/* Title */}
//                                                             <Typography fontWeight={600} mt={1} color="#2D3748">
//                                                                 {t.title}
//                                                             </Typography>

//                                                             {/* Priority */}
//                                                             <Typography fontSize={13} color="#718096" mt={0.5}>
//                                                                 Priority: {t.priority_detail?.field_values || "-"}
//                                                             </Typography>

//                                                             {/* Category */}
//                                                             <Typography fontSize={13} mt={1.5}>
//                                                                 <strong style={{ color: "#4A5568" }}>Category:</strong>{" "}
//                                                                 <span style={{ color: "#2D3748" }}>
//                                                                     {t.category_detail?.category_name || "-"} /{" "}
//                                                                     {t.subcategory_detail?.subcategory_name || "-"}
//                                                                 </span>
//                                                             </Typography>

//                                                             {/* Department & Location */}
//                                                             <Typography fontSize={13} mt={1}>
//                                                                 <strong style={{ color: "#4A5568" }}>Dept:</strong>{" "}
//                                                                 <span style={{ color: "#2D3748" }}>
//                                                                     {t.department_detail?.field_name || "-"} |{" "}
//                                                                     {t.location_detail?.field_name || "-"}
//                                                                 </span>
//                                                             </Typography>

//                                                             {/* Dates */}
//                                                             <Typography fontSize={12} color="#718096" mt={1.5}>
//                                                                 Open: {new Date(t.created_date).toLocaleDateString()} <br />
//                                                                 Update: {new Date(t.updated_date).toLocaleDateString()}
//                                                             </Typography>

//                                                             {/* Action */}
//                                                             <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
//                                                                 <Button
//                                                                     variant="contained"
//                                                                     onClick={() => handleTicketClick(t.ticket_no)}
//                                                                     sx={{
//                                                                         backgroundColor: "#667eea",
//                                                                         borderRadius: 2,
//                                                                         textTransform: "none",
//                                                                         fontSize: "0.85rem",
//                                                                         px: 2,
//                                                                         "&:hover": {
//                                                                             backgroundColor: "#556cd6",
//                                                                         }
//                                                                     }}
//                                                                 >
//                                                                     View Details
//                                                                 </Button>
//                                                             </Box>
//                                                         </CardContent>
//                                                     </Card>
//                                                 ))
//                                         ) : (
//                                             <Typography align="center" py={4} color="#718096">
//                                                 No tickets found.
//                                             </Typography>
//                                         )}
//                                     </Box>
//                                 ) : (
//                                     <TableContainer>
//                                         <Table>
//                                             <TableHead>
//                                                 <TableRow sx={{ backgroundColor: "#F7FAFC" }}>
//                                                     {RequestTabelCol.map((col) => (
//                                                         <TableCell 
//                                                             key={col.id} 
//                                                             sx={{ 
//                                                                 fontWeight: 700, 
//                                                                 whiteSpace: "nowrap",
//                                                                 color: "#2D3748",
//                                                                 borderBottom: "2px solid #E2E8F0",
//                                                                 py: 2
//                                                             }}
//                                                         >
//                                                             {col.title}
//                                                         </TableCell>
//                                                     ))}
//                                                 </TableRow>
//                                             </TableHead>
//                                             <TableBody>
//                                                 {filteredRows.length > 0 ? (
//                                                     filteredRows
//                                                         .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//                                                         .map((t) => (
//                                                             <TableRow 
//                                                                 key={t.id} 
//                                                                 hover 
//                                                                 sx={{ 
//                                                                     '&:hover': { backgroundColor: '#F7FAFC' },
//                                                                     '&:last-child td': { borderBottom: 0 }
//                                                                 }}
//                                                             >
//                                                                 <TableCell sx={{ color: "#667eea", fontWeight: 600 }}>
//                                                                     #{t.ticket_no}
//                                                                 </TableCell>
//                                                                 <TableCell sx={{ color: "#2D3748", fontWeight: 500 }}>
//                                                                     {t.title}
//                                                                 </TableCell>
//                                                                 <TableCell>
//                                                                     <Tooltip
//                                                                         title={t.description || "No description"}
//                                                                         arrow
//                                                                         placement="top"
//                                                                     >
//                                                                         <Typography
//                                                                             sx={{
//                                                                                 maxWidth: 200,
//                                                                                 whiteSpace: "nowrap",
//                                                                                 overflow: "hidden",
//                                                                                 textOverflow: "ellipsis",
//                                                                                 cursor: "pointer",
//                                                                                 color: "#4A5568"
//                                                                             }}
//                                                                         >
//                                                                             {t.description || "-"}
//                                                                         </Typography>
//                                                                     </Tooltip>
//                                                                 </TableCell>
//                                                                 <TableCell>
//                                                                     <Typography fontWeight={500} color="#2D3748">
//                                                                         {t.status_detail?.field_values}
//                                                                     </Typography>
//                                                                     <Typography fontSize="0.85rem" color="#718096">
//                                                                         {t.priority_detail?.field_values}
//                                                                     </Typography>
//                                                                 </TableCell>
//                                                                 <TableCell>
//                                                                     <Tooltip
//                                                                         arrow
//                                                                         placement="top"
//                                                                         title={
//                                                                             <Box>
//                                                                                 <div><strong>Category:</strong> {t.category_detail?.category_name || "-"}</div>
//                                                                                 <div><strong>Subcategory:</strong> {t.subcategory_detail?.subcategory_name || "-"}</div>
//                                                                             </Box>
//                                                                         }
//                                                                     >
//                                                                         <Box sx={{ cursor: "pointer" }}>
//                                                                             <Typography fontWeight={500} color="#2D3748">
//                                                                                 {t.category_detail?.category_name || "-"}
//                                                                             </Typography>
//                                                                             <Typography fontSize="0.85rem" color="#718096">
//                                                                                 {t.subcategory_detail?.subcategory_name || "-"}
//                                                                             </Typography>
//                                                                         </Box>
//                                                                     </Tooltip>
//                                                                 </TableCell>
//                                                                 <TableCell>
//                                                                     <Typography fontWeight={500} color="#2D3748">
//                                                                         {t.department_detail?.field_name}
//                                                                     </Typography>
//                                                                     <Typography fontSize="0.85rem" color="#718096">
//                                                                         {t.location_detail?.field_name}
//                                                                     </Typography>
//                                                                 </TableCell>
//                                                                 <TableCell sx={{ color: "#4A5568" }}>
//                                                                     {t.requested_detail?.email}
//                                                                 </TableCell>
//                                                                 <TableCell>
//                                                                     <Typography fontSize="0.9rem" color="#2D3748">
//                                                                         {new Date(t.created_date).toLocaleDateString()}
//                                                                     </Typography>
//                                                                     <Typography fontSize="0.8rem" color="#718096">
//                                                                         {new Date(t.updated_date).toLocaleDateString()}
//                                                                     </Typography>
//                                                                 </TableCell>
//                                                                 <TableCell>
//                                                                     <Button
//                                                                         variant="outlined"
//                                                                         onClick={() => handleTicketClick(t.ticket_no)}
//                                                                         sx={{
//                                                                             borderColor: "#667eea",
//                                                                             color: "#667eea",
//                                                                             borderRadius: 2,
//                                                                             textTransform: "none",
//                                                                             fontSize: "0.85rem",
//                                                                             px: 2,
//                                                                             "&:hover": {
//                                                                                 backgroundColor: "#667eea10",
//                                                                                 borderColor: "#556cd6",
//                                                                             }
//                                                                         }}
//                                                                     >
//                                                                         View
//                                                                     </Button>
//                                                                 </TableCell>
//                                                             </TableRow>
//                                                         ))
//                                                 ) : (
//                                                     <TableRow>
//                                                         <TableCell colSpan={9} align="center" sx={{ py: 4, color: "#718096" }}>
//                                                             No tickets found.
//                                                         </TableCell>
//                                                     </TableRow>
//                                                 )}
//                                             </TableBody>
//                                         </Table>
//                                     </TableContainer>
//                                 )}

//                                 {filteredRows.length > 0 && (
//                                     <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ py: 2, px: 3, borderTop: "1px solid #E2E8F0" }}>
//                                         <Typography variant="body2" color="#718096">
//                                             Showing {page * rowsPerPage + 1} to {Math.min((page + 1) * rowsPerPage, filteredRows.length)} of {filteredRows.length} tickets
//                                         </Typography>
//                                         <Pagination
//                                             count={Math.ceil(filteredRows.length / rowsPerPage)}
//                                             page={page + 1}
//                                             onChange={(e, value) => setPage(value - 1)}
//                                             variant="outlined"
//                                             shape="rounded"
//                                             showFirstButton
//                                             showLastButton
//                                             siblingCount={1}
//                                             boundaryCount={1}
//                                             sx={{
//                                                 "& .MuiPaginationItem-root": {
//                                                     borderRadius: "8px",
//                                                     borderColor: "#CBD5E0",
//                                                     color: "#4A5568",
//                                                     "&.Mui-selected": {
//                                                         backgroundColor: "#667eea",
//                                                         color: "#fff",
//                                                         borderColor: "#667eea",
//                                                         "&:hover": {
//                                                             backgroundColor: "#556cd6",
//                                                         }
//                                                     },
//                                                     "&:hover": {
//                                                         backgroundColor: "#F7FAFC",
//                                                     }
//                                                 },
//                                             }}
//                                         />
//                                     </Stack>
//                                 )}
//                             </Card>
//                         </Box>
//                     )}
//                 </CardContent>
//             </Card>
//         </Box>
//     );
// };

// export default RequestTabs;

import { useState, useEffect, useMemo } from "react";
import { useTheme } from "@mui/material/styles";
import { Box, Card, CardContent, Typography, Grid, TextField, Button, Table, TableHead, TableRow, TableCell, TableBody, TableContainer, useMediaQuery, Autocomplete, Stack, Pagination, Tooltip, IconButton, Icon, Drawer, CircularProgress, Divider, Chip, Avatar, Tabs, Tab } from "@mui/material";
import { useNavigate } from "react-router-dom";
import VisibilityIcon from '@mui/icons-material/Visibility';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import CancelIcon from '@mui/icons-material/Cancel';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import LockIcon from '@mui/icons-material/Lock';
import { Chat as ChatIcon, Send as SendIcon, } from "@mui/icons-material";
import { toast } from "react-toastify";
import { fetchMessages, sendMessage, getTicketDetails, } from "../../Api";

const RequestTabs = ({ userStatus }) => {

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

    const [selectedType, setSelectedType] = useState("new_assigned");
    const [search, setSearch] = useState("");
    const [department, setDepartment] = useState("");
    const [tickets, setTickets] = useState({
        new_assigned: [],
        solved: [],
        closed: [],
        cancelled: [],
    });
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    // Chat/follow-up states
    const [showFollowUpChat, setShowFollowUpChat] = useState(false);
    const [followUpChats, setFollowUpChats] = useState([]);
    const [loadingFollowUpChats, setLoadingFollowUpChats] = useState(false);
    const [newFollowUpMessage, setNewFollowUpMessage] = useState("");
    const [sendingFollowUpMessage, setSendingFollowUpMessage] = useState(false);
    const [currentChatTicket, setCurrentChatTicket] = useState(null);
    const [assignee, setAssignee] = useState(null);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [currentUserName, setCurrentUserName] = useState("You");
    // Tab state for chat drawer
    const [chatTab, setChatTab] = useState(0); // 0: Follow-up (Chat), 1: Solution
    // Solved ticket solution states
    const [isSolvedTicket, setIsSolvedTicket] = useState(false);
    const [solutionText, setSolutionText] = useState("");
    const [isResolved, setIsResolved] = useState(false);
    const [isApproved, setIsApproved] = useState(false);

    useEffect(() => {
        if (userStatus) {
            setTickets({
                new_assigned: userStatus.new_assigned_tickets || [],
                solved: userStatus.solved_tickets || [],
                closed: userStatus.closed_tickets || [],
                cancelled: userStatus.cancelled_tickets || [],
            });
        }
    }, [userStatus]);

    // Get current user ID and name on component mount - Ticket Creator (Requester)
    useEffect(() => {
        const userDataString = localStorage.getItem("user");
        if (userDataString) {
            const userData = JSON.parse(userDataString);
            setCurrentUserId(userData?.id || null);
            setCurrentUserName(userData?.name || userData?.username || "You");
        } else {
            // Fallback
            const userId = localStorage.getItem("current_user_id") || "11";
            setCurrentUserId(parseInt(userId));
            setCurrentUserName("You");
        }
    }, []);

    // Only show New Assigned, Solved, and Closed cards
    const statusCards = [
        {
            id: "new_assigned",
            label: "NEW",
            color: "warning",
            icon: <NewReleasesIcon />,
            count: userStatus?.new_assigned || 0,
            description: "Tickets recently assigned to you"
        },
        {
            id: "pending",
            label: "PENDING",
            color: "warning",
            icon: <AccessTimeFilledIcon />,
            //count: userStatus?.new_assigned || 0,
            count: 0,
            description: "Tickets recently assigned to you"
        },
        {
            id: "solved",
            label: "RESOLVED",
            color: "success",
            icon: <DoneAllIcon />,
            count: userStatus?.solved || 0,
            description: "Tickets you have resolved"
        },
        {
            id: "cancelled",
            label: "CANCEL",
            color: "error",
            icon: <CancelIcon />,
            count: userStatus?.cancelled || 0,
            description: "Tickets recently assigned to you"
        },
        {
            id: "closed",
            label: "CLOSED",
            color: "info",
            icon: <LockIcon />,
            count: userStatus?.closed || 0,
            description: "Tickets that are completed"
        },
    ];

    const selectedTickets = tickets[selectedType] || [];
    const departmentList = useMemo(
        () => [...new Set(selectedTickets.map((row) => row.department_detail?.field_name).filter(Boolean))],
        [selectedTickets]
    );

    // Get initials for avatar
    const getInitials = (name) => {
        if (!name || name === "You") return "U";
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };

    // Group chats by date
    const groupedChats = useMemo(() => {
        const groups = {};
        followUpChats.forEach(msg => {
            const date = new Date(msg.createdon).toLocaleDateString();
            if (!groups[date]) {
                groups[date] = [];
            }
            groups[date].push(msg);
        });
        return Object.entries(groups)
            .map(([date, messages]) => ({
                date,
                messages: messages.sort((a, b) => new Date(a.createdon) - new Date(b.createdon))
            }))
            .sort((a, b) => new Date(a.date) - new Date(b.date));
    }, [followUpChats]);

    // Headings for New Assigned, Solved, Closed
    const headingMap = {
        new_assigned: "NEW TICKETS (MY REQUEST)",
        pending: "PENDING TICKETS (MY REQUEST)",
        solved: "SOLVED TICKETS (MY REQUEST)",
        cancel: "CANCEL TICKETS (MY REQUEST)",
        closed: "CLOSED TICKETS (MY REQUEST)",
    };

    const RequestTabelCol = [
        { id: 1, title: <>Ticket ID</> },
        { id: 2, title: <>Title</> },
        { id: 3, title: <>Description</> },
        { id: 4, title: <>Status<br />Priority</> },
        { id: 5, title: <>Category<br />Subcategory</> },
        { id: 6, title: <>Department<br />Location</> },
        { id: 7, title: <>Requested By</> },
        { id: 8, title: <>Open Date<br />Last Update</> },
        { id: 9, title: <>Action</> },
    ];

    const navigate = useNavigate();
    const handleTicketClick = (ticketNo) => {
        console.log('Storing ticket No:', ticketNo);
        localStorage.setItem('selectedTicketId', ticketNo);
        console.log('Navigating to Approval');
        navigate('/Approval');
    };

    // Fetch all messages and filter by ticket_no and between current user (ticket creator) and receiver (assignee)
    const fetchTicketMessages = async (ticketNo, currentUserId, receiverId) => {
        try {
            // Fetch all messages; adjust if API supports params
            const allMessages = await fetchMessages();
            // Filter by ticket_no and between currentUserId (ticket creator) and receiverId (assignee) (bidirectional)
            const filteredMessages = allMessages.filter((msg) =>
                msg.ticket_no == ticketNo &&
                ((msg.sender === currentUserId && msg.receiver === receiverId) ||
                    (msg.sender === receiverId && msg.receiver === currentUserId))
            );
            return filteredMessages || [];
        } catch (err) {
            console.error("Error loading ticket messages:", err);
            toast.error("Failed to load messages");
            return [];
        }
    };

    const sendFollowUpMessageHandler = async (messageText) => {
        if (!messageText.trim()) {
            toast.error("Message cannot be empty");
            return;
        }

        if (!currentChatTicket?.id) {
            toast.error("No ticket selected");
            return;
        }
        if (!assignee?.id) {
            toast.error("Assignee not loaded");
            return;
        }
        if (!currentUserId) {
            toast.error("User not authenticated");
            return;
        }
        const receiverId = assignee.id;
        setSendingFollowUpMessage(true);
        try {
            const payload = {
                sender: currentUserId, // Explicitly include sender (logged-in user - ticket creator)
                receiver: receiverId,
                ticket_no: currentChatTicket.id,
                message: messageText.trim(),
            };
            const resData = await sendMessage(payload);
            const newMessage = {
                ...resData,
                sender: currentUserId,
                createdon: new Date().toISOString(),
            };

            // Add to local state and sort
            const updatedChats = [...followUpChats, newMessage].sort((a, b) => new Date(a.createdon) - new Date(b.createdon));
            setFollowUpChats(updatedChats);
            setNewFollowUpMessage("");

            toast.success("Message sent successfully!");
        } catch (err) {
            toast.error("Failed to send message");
            console.error("Error sending message:", err);
        } finally {
            setSendingFollowUpMessage(false);
        }
    };

    const handleResolveSolution = () => {
        // TODO: Call API to resolve solution
        setIsResolved(true);
        toast.success("Solution resolved!");
    };

    const handleApproveSolution = () => {
        // TODO: Call API to approve solution
        setIsApproved(true);
        toast.success("Solution approved!");
    };

    const handleChatDrawerOpen = async (ticketNo) => {
        if (!ticketNo || !currentUserId) {
            toast.error("No ticket or user ID provided");
            return;
        }
        const ticket = selectedTickets.find(t => t.ticket_no == ticketNo);
        if (!ticket) {
            toast.error("Ticket not found in current list");
            return;
        }
        setChatTab(0); // Default to Follow-up tab
        setLoadingFollowUpChats(true);
        setShowFollowUpChat(true);
        setFollowUpChats([]);
        // Reset solved states
        setIsSolvedTicket(false);
        setSolutionText("");
        setIsResolved(false);
        setIsApproved(false);
        try {
            // Fetch ticket details to get assignee_detail
            const ticketDetails = await getTicketDetails(ticketNo);
            const ticketData = ticketDetails.ticket || ticketDetails;
            const assigneesDetails = ticketData.assignees_detail; // It's an array
            if (!assigneesDetails || assigneesDetails.length === 0) {
                throw new Error("Assignee details not found");
            }
            const assigneeDetail = assigneesDetails[0]; // Take the first assignee
            if (!assigneeDetail.id) {
                throw new Error("Assignee ID not found");
            }
            setAssignee(assigneeDetail);
            // Set ticket details
            setCurrentChatTicket({
                id: ticketNo,
                title: ticketData.title || ticket.title || "",
                description: ticketData.description || ticket.description || "",
            });
            // Check if solved ticket and set solution data (for ticket creator view)
            if (selectedType === "solved") {
                setIsSolvedTicket(true);
                // Assuming ticketData has solution_text, resolved_status, approved_status fields
                // Adjust field names based on your API response
                setSolutionText(ticketData.solution_text || ticketData.resolution_text || "");
                setIsResolved(ticketData.resolved_status === "yes" || ticketData.is_resolved || false);
                setIsApproved(ticketData.approved_status === "yes" || ticketData.is_approved || false);
            }
            const receiverId = assigneeDetail.id;
            // Fetch messages based on ticket_no and between current user (ticket creator) and assignee
            const ticketMessages = await fetchTicketMessages(ticketNo, currentUserId, receiverId);
            const messagesCount = ticketMessages.length;
            console.log('Fetched messages count:', messagesCount);

            // Sort messages by timestamp
            const sortedTicketMessages = ticketMessages.sort((a, b) =>
                new Date(a.createdon) - new Date(b.createdon)
            );

            setFollowUpChats(sortedTicketMessages);
        } catch (err) {
            console.error("Error fetching ticket details or chats:", err);
            toast.error("Failed to fetch ticket details or chats");
            setShowFollowUpChat(false);
        } finally {
            setLoadingFollowUpChats(false);
        }
    };

    const handleChatDrawerClose = () => {
        setShowFollowUpChat(false);
        setCurrentChatTicket(null);
        setAssignee(null);
        setFollowUpChats([]);
        setLoadingFollowUpChats(false);
        setChatTab(0);
        // Reset solved states
        setIsSolvedTicket(false);
        setSolutionText("");
        setIsResolved(false);
        setIsApproved(false);
    };

    const filteredRows = useMemo(() => {
        const searchLower = search.toLowerCase().trim();

        if (!searchLower && !department) {
            return selectedTickets;
        }

        return selectedTickets.filter((row) => {
            // Department filter (separate dropdown)
            const matchesDept = department
                ? row.department_detail?.field_name === department
                : true;

            if (!searchLower) return matchesDept;

            // 1. Ticket Number
            if (String(row.ticket_no || "").toLowerCase().includes(searchLower)) return true;

            // 2. Title
            if (row.title?.toLowerCase().includes(searchLower)) return true;

            // 3. Description
            if (row.description?.toLowerCase().includes(searchLower)) return true;

            // 4. Status
            if (row.status_detail?.field_values?.toLowerCase().includes(searchLower)) return true;

            // 5. Priority
            if (row.priority_detail?.field_values?.toLowerCase().includes(searchLower)) return true;

            // 6. Category
            if (row.category_detail?.category_name?.toLowerCase().includes(searchLower)) return true;

            // 7. Subcategory
            if (row.subcategory_detail?.subcategory_name?.toLowerCase().includes(searchLower)) return true;

            // 8. Department
            if (row.department_detail?.field_name?.toLowerCase().includes(searchLower)) return true;

            // 9. Location
            if (row.location_detail?.field_name?.toLowerCase().includes(searchLower)) return true;

            // 10. Requested By (email or name)
            if (row.requested_detail?.email?.toLowerCase().includes(searchLower)) return true;
            if (row.requested_detail?.name?.toLowerCase().includes(searchLower)) return true;

            // 11. Dates (Open Date / Last Update) - match formatted or raw
            // const openDate = new Date(row.created_date).toLocaleDateString().toLowerCase();
            // const updateDate = new Date(row.updated_date).toLocaleDateString().toLowerCase();
            // if (openDate.includes(searchLower) || updateDate.includes(searchLower)) return true;

            return false;
        }).filter((row) => {
            // Apply department filter at the end (in case user uses both search + department dropdown)
            return department ? row.department_detail?.field_name === department : true;
        });
    }, [selectedTickets, search, department]);

    const handleCardClick = (type) => {
        setSelectedType(type);
        setSearch("");
        setDepartment("");
        setPage(0);
    };

    const clearFilters = () => {
        setSearch("");
        setDepartment("");
        setPage(0);
    };

    const priorityColors = {
        "Critical": "#D32F2F",
        "Very High": "#b43d3bff",
        "High": "#FB8C00",
        "Medium": "#FDD835",
        "Low": "#43A047",
        "Very Low": "#1E88E5",
    };

    const statusColors = {
        "Pending": "#EF6C00",
        "Approved": "#2E7D32",
        "On Hold": "#1565C0",
        "Rejected": "#C62828",
        "SLA Breached": "#F9A825",
    };

    return (
        <Box sx={{ width: "100%", mb: 2 }}>
            <Grid container spacing={1} sx={{ mb: 4 }}>
                {statusCards.map((item) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }} key={item.id}>
                        <Card
                            onClick={() => handleCardClick(item.id)}
                            sx={{
                                p: 1,
                                transition: "0.3s ease",
                                maxWidth: "600px",
                                maxHeight: 90,
                                borderRadius: 5,
                                "&:hover": {
                                    background: "linear-gradient(135deg, #667eea, #764ba2)",
                                    color: "#fff",
                                    transform: "scale(1.03)",
                                }
                            }}
                        >
                            <CardContent sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                                <Box
                                    sx={{
                                        width: { xs: 50, sm: 40, md: 50 },
                                        height: { xs: 50, sm: 40, md: 50 },
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        borderRadius: 2,
                                        bgcolor: `${item.color}.main`,
                                        color: "#fff",
                                    }}
                                >
                                    <Icon sx={{ fontSize: { xs: 25, sm: 18, md: 25 } }}>{item.icon}</Icon>
                                </Box>
                                <Box>
                                    <Typography fontSize={{ xs: 25, sm: 20, md: 25 }} fontWeight={600}>
                                        {item.count}
                                    </Typography>
                                    <Typography fontSize={{ xs: 20, sm: 14, md: 20 }} fontWeight={550}>
                                        {item.label}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                <CardContent>
                    {selectedType && (
                        <Box>
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: isMobile || isTablet ? "column" : "row",
                                    justifyContent: !isMobile || !isTablet ? "space-between" : undefined,
                                    alignItems: isMobile ? "flex-start" : "center",
                                    mb: 4,
                                    gap: isMobile ? 2 : 0,
                                }}
                            >
                                <Typography
                                    variant="h5"
                                    fontWeight={700}
                                    sx={{
                                        color: "#2D3748",
                                        width: isMobile || isTablet ? "100%" : "auto",
                                    }}
                                >
                                    {headingMap[selectedType] || "Tickets"}
                                </Typography>
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: isMobile ? "column" : "row",
                                        flexWrap: isTablet ? "wrap" : "nowrap",
                                        gap: 2,
                                        width: isMobile || isTablet ? "100%" : "auto",
                                        justifyContent: isTablet ? "flex-start" : "flex-end",
                                        mt: isTablet ? 1.5 : 0
                                    }}
                                >
                                    <Autocomplete
                                        options={departmentList}
                                        value={department}
                                        onChange={(e, newValue) => setDepartment(newValue)}
                                        sx={{
                                            width: { xs: "100%", sm: 300, md: 200 },
                                            "& .MuiOutlinedInput-root": {
                                                borderRadius: 2,
                                            }
                                        }}
                                        renderInput={(params) => (
                                            <TextField {...params} label="Department" size="small" variant="outlined" />
                                        )}
                                    />
                                    <TextField
                                        size="small"
                                        label="Search"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        variant="outlined"
                                        sx={{
                                            width: { xs: "100%", sm: 300, md: 200 },
                                            "& .MuiOutlinedInput-root": {
                                                borderRadius: 2,
                                            }
                                        }}
                                    />
                                    <Button
                                        variant="outlined"
                                        fullWidth={isMobile}
                                        onClick={clearFilters}
                                        sx={{
                                            borderRadius: 2,
                                            color: "info",
                                            "&:hover": {
                                                borderColor: "#667eea",
                                                backgroundColor: "#667eea10"
                                            }
                                        }}
                                    >
                                        Clear
                                    </Button>
                                </Box>
                            </Box>
                            {isMobile ? (
                                <Box>
                                    {filteredRows.length > 0 ? (
                                        filteredRows
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((t) => (
                                                <Card
                                                    sx={{ mb: 2, borderRadius: 2 }}
                                                    key={t.id}
                                                >
                                                    <CardContent>
                                                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                                                                <Typography fontWeight={700} color="#667eea">
                                                                    #{t.ticket_no} -
                                                                </Typography>
                                                                <Chip
                                                                    label={t.priority_detail?.field_values || "-"}
                                                                    size="small"
                                                                    sx={{
                                                                        fontWeight: 800,
                                                                        borderRadius: 50,
                                                                        background: priorityColors[t.priority_detail?.field_values] || "#666",
                                                                        color: "white",
                                                                        animation: t.priority_detail?.field_values === "Critical" ? "pulse 2s infinite" : "none",
                                                                    }}
                                                                />
                                                            </Box>
                                                            <Chip
                                                                label={t.status_detail?.field_values}
                                                                size="small"
                                                                sx={{
                                                                    fontWeight: 700,
                                                                    background: statusColors[t.status_detail?.field_values] || "#666",
                                                                    color: "white",
                                                                    borderRadius: 50,
                                                                    py: 0.5,
                                                                    px: 1,
                                                                }}
                                                            />
                                                        </Box>
                                                        <Tooltip
                                                            title={t.title}
                                                            arrow
                                                            placement="top"
                                                        >
                                                            <Typography
                                                                sx={{
                                                                    maxWidth: 200,
                                                                    color: "text.secondary",
                                                                    whiteSpace: "nowrap",
                                                                    overflow: "hidden",
                                                                    textOverflow: "ellipsis",
                                                                    cursor: "pointer",
                                                                    mt: 0.5
                                                                }}
                                                            >
                                                                {t.title}
                                                            </Typography>
                                                        </Tooltip>
                                                        <Tooltip
                                                            title={t.description || "No description"}
                                                            arrow
                                                            placement="top"
                                                        >
                                                            <Typography
                                                                sx={{
                                                                    maxWidth: 200,
                                                                    color: "text.secondary",
                                                                    whiteSpace: "nowrap",
                                                                    overflow: "hidden",
                                                                    textOverflow: "ellipsis",
                                                                    cursor: "pointer",
                                                                    mt: 0.5
                                                                }}
                                                            >
                                                                {t.description || "-"}
                                                            </Typography>
                                                        </Tooltip>
                                                        <Typography fontSize={13} mt={1.5}>
                                                            <strong style={{ color: "#4A5568" }}>Category:</strong>{" "}
                                                            <span style={{ color: "#2D3748" }}>
                                                                {t.category_detail?.category_name || "-"} /{" "}
                                                                {t.subcategory_detail?.subcategory_name || "-"}
                                                            </span>
                                                        </Typography>
                                                        <Typography fontSize={13} mt={1}>
                                                            <strong style={{ color: "#4A5568" }}>Dept | Loc:</strong>{" "}
                                                            <span style={{ color: "#2D3748" }}>
                                                                {t.department_detail?.field_name || "-"} |{" "}
                                                                {t.location_detail?.field_name || "-"}
                                                            </span>
                                                        </Typography>
                                                        <Typography fontSize={12} color="#718096" mt={1.5}>
                                                            Open: {new Date(t.created_date).toLocaleDateString()} <br />
                                                            Update: {new Date(t.updated_date).toLocaleDateString()}
                                                        </Typography>
                                                        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2, gap: 1 }}>
                                                            <Tooltip title="Follow-up Chat">
                                                                <IconButton
                                                                    onClick={() => handleChatDrawerOpen(t.ticket_no)}
                                                                    size="small"
                                                                    sx={{ color: "#667eea" }}
                                                                >
                                                                    <ChatIcon />
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip title="View Details">
                                                                <IconButton
                                                                    onClick={() => handleTicketClick(t.ticket_no)}
                                                                    sx={{ color: "#667eea" }}
                                                                    size="small"
                                                                >
                                                                    <VisibilityIcon />
                                                                </IconButton>
                                                            </Tooltip>

                                                        </Box>
                                                    </CardContent>
                                                </Card>
                                            ))
                                    ) : (
                                        <Typography align="center" py={4} color="#718096">
                                            No tickets found.
                                        </Typography>
                                    )}
                                </Box>
                            ) : (
                                <Card sx={{ borderRadius: 3, boxShadow: 2, overflow: "hidden" }}>
                                    <TableContainer>
                                        <Table stickyHeader>
                                            <TableHead>
                                                <TableRow sx={{ backgroundColor: "#F7FAFC" }}>
                                                    {RequestTabelCol.map((col) => (
                                                        <TableCell
                                                            key={col.id}
                                                            sx={{
                                                                fontWeight: 700,
                                                                whiteSpace: "nowrap",
                                                                color: "#2D3748",
                                                                borderBottom: "2px solid #E2E8F0",
                                                                py: 2
                                                            }}
                                                        >
                                                            {col.title}
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {filteredRows.length > 0 ? (
                                                    filteredRows
                                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                        .map((t) => (
                                                            <TableRow
                                                                key={t.id}
                                                                hover
                                                                sx={{
                                                                    '&:hover': { backgroundColor: '#F7FAFC' },
                                                                    '&:last-child td': { borderBottom: 0 }
                                                                }}
                                                            >
                                                                <TableCell sx={{ color: "#667eea", fontWeight: 600 }}>
                                                                    #{t.ticket_no}
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Tooltip
                                                                        title={t.title}
                                                                        arrow
                                                                        placement="top"
                                                                    >
                                                                        <Typography
                                                                            sx={{
                                                                                maxWidth: 150,
                                                                                whiteSpace: "nowrap",
                                                                                overflow: "hidden",
                                                                                textOverflow: "ellipsis",
                                                                                cursor: "pointer",
                                                                                mt: 0.5
                                                                            }}
                                                                        >
                                                                            {t.title}
                                                                        </Typography>
                                                                    </Tooltip>
                                                                </TableCell>

                                                                <TableCell>
                                                                    <Tooltip
                                                                        title={t.description || "No description"}
                                                                        arrow
                                                                        placement="top"
                                                                    >
                                                                        <Typography
                                                                            sx={{
                                                                                maxWidth: 150,
                                                                                whiteSpace: "nowrap",
                                                                                overflow: "hidden",
                                                                                textOverflow: "ellipsis",
                                                                                cursor: "pointer",
                                                                                //color: "#4A5568"
                                                                            }}
                                                                        >
                                                                            {t.description || "-"}
                                                                        </Typography>
                                                                    </Tooltip>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Typography fontWeight={500} >
                                                                        {t.status_detail?.field_values}
                                                                    </Typography>
                                                                    <Typography fontSize="0.85rem" >
                                                                        {t.priority_detail?.field_values}
                                                                    </Typography>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Tooltip
                                                                        arrow
                                                                        placement="top"
                                                                        title={
                                                                            <Box>
                                                                                <div><strong>Category:</strong> {t.category_detail?.category_name || "-"}</div>
                                                                                <div><strong>Subcategory:</strong> {t.subcategory_detail?.subcategory_name || "-"}</div>
                                                                            </Box>
                                                                        }
                                                                    >
                                                                        <Box sx={{ cursor: "pointer" }}>
                                                                            <Typography fontWeight={500} >
                                                                                {t.category_detail?.category_name || "-"}
                                                                            </Typography>
                                                                            <Typography fontSize="0.85rem" >
                                                                                {t.subcategory_detail?.subcategory_name || "-"}
                                                                            </Typography>
                                                                        </Box>
                                                                    </Tooltip>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Typography fontWeight={500}>
                                                                        {t.department_detail?.field_name}
                                                                    </Typography>
                                                                    <Typography fontSize="0.85rem">
                                                                        {t.location_detail?.field_name}
                                                                    </Typography>
                                                                </TableCell>
                                                                <TableCell >
                                                                    {t.requested_detail?.email}
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Typography fontSize="0.9rem">
                                                                        {new Date(t.created_date).toLocaleDateString()}
                                                                    </Typography>
                                                                    <Typography fontSize="0.8rem">
                                                                        {new Date(t.updated_date).toLocaleDateString()}
                                                                    </Typography>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Box sx={{ display: "flex", gap: 1 }}>
                                                                        <Tooltip title="Follow-up Chat">
                                                                            <IconButton
                                                                                onClick={() => handleChatDrawerOpen(t.ticket_no)}
                                                                                size="small"
                                                                                sx={{ color: "#667eea" }}
                                                                            >
                                                                                <ChatIcon />
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                        <Tooltip>
                                                                            <IconButton
                                                                                onClick={() => handleTicketClick(t.ticket_no)}
                                                                                size="small"
                                                                                sx={{ color: "#667eea" }}
                                                                            >
                                                                                <VisibilityIcon />
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                    </Box>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))
                                                ) : (
                                                    <TableRow>
                                                        <TableCell colSpan={9} align="center" sx={{ py: 4, color: "#718096" }}>
                                                            No tickets found.
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Card>
                            )}
                            {filteredRows.length > 0 && (
                                <Stack
                                    direction={isMobile ? "column" : "row"}
                                    justifyContent="space-between"
                                    alignItems="center"
                                    spacing={isMobile ? 1.5 : 0}
                                    sx={{
                                        py: 2,
                                        px: { xs: 0, sm: 3 },
                                        borderTop: "1px solid #E2E8F0",
                                        textAlign: isMobile ? "center" : "left",
                                    }}
                                >
                                    <Typography
                                        variant="body2"
                                        color="#718096"
                                        sx={{ fontSize: { xs: "13px", sm: "14px" } }}
                                    >
                                        Showing {page * rowsPerPage + 1} to{" "}
                                        {Math.min((page + 1) * rowsPerPage, filteredRows.length)} of{" "}
                                        {filteredRows.length} tickets
                                    </Typography>
                                    <Pagination
                                        count={Math.ceil(filteredRows.length / rowsPerPage)}
                                        page={page + 1}
                                        onChange={(e, value) => setPage(value - 1)}
                                        variant="outlined"
                                        shape="rounded"
                                        showFirstButton
                                        showLastButton
                                        siblingCount={1}
                                        boundaryCount={1}
                                        size={isMobile ? "small" : "medium"}
                                        sx={{
                                            "& .MuiPaginationItem-root": {
                                                borderRadius: "8px",
                                                borderColor: "#CBD5E0",
                                                color: "#4A5568",
                                                fontSize: { xs: "12px", sm: "14px" },
                                                minWidth: { xs: 32, sm: 36 },
                                                "&.Mui-selected": {
                                                    backgroundColor: "#667eea",
                                                    color: "#fff",
                                                    borderColor: "#667eea",
                                                    "&:hover": {
                                                        backgroundColor: "#556cd6",
                                                    },
                                                },
                                                "&:hover": {
                                                    backgroundColor: "#F7FAFC",
                                                },
                                            },
                                        }}
                                    />
                                </Stack>
                            )}
                        </Box>
                    )}
                </CardContent>
            </Card>

            <Drawer
                anchor="right"
                open={showFollowUpChat}
                onClose={handleChatDrawerClose}
                PaperProps={{ sx: { width: { xs: "100%", sm: 500 } } }}
            >
                <Box sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    bgcolor: "background.paper"
                }}>
                    {/* Header */}
                    <Box sx={{
                        display: "flow",
                        p: 2,
                        borderBottom: 1,
                        borderColor: "divider",
                        bgcolor: "primary.main",
                        color: "white"
                    }}>
                        <Typography variant="caption" sx={{ color: "white", verticalAlign: "middle" }}>
                            Ticket #{currentChatTicket?.id}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "white" }}>
                            {currentChatTicket?.title}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "white" }}>
                            {currentChatTicket?.description}
                        </Typography>
                    </Box>
                    {/* Tab Buttons */}
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs
                            value={chatTab}
                            onChange={(e, newValue) => setChatTab(newValue)}
                            centered
                        >
                            <Tab label="Follow-up" icon={<ChatIcon />} />
                            {isSolvedTicket && <Tab label="Solution" icon={<DoneAllIcon />} />}
                        </Tabs>
                    </Box>
                    {/* Tab Content */}
                    <Box sx={{ flex: 1 }}>
                        {chatTab === 0 && (
                            // Follow-up Tab: Chat Messages
                            <Box sx={{
                                display: "flex",
                                flexDirection: "column",
                                height: "100%"
                            }}>
                                {/* Messages Area */}
                                <Box sx={{
                                    flex: 1,
                                    overflowY: "auto",
                                    p: 2,
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 2
                                }}>
                                    {loadingFollowUpChats ? (
                                        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                                            <CircularProgress />
                                        </Box>
                                    ) : groupedChats.length === 0 ? (
                                        <Box sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            height: "100%",
                                            color: "text.secondary"
                                        }}>
                                            <ChatIcon sx={{ fontSize: 60, mb: 2, opacity: 0.5 }} />
                                            <Typography>No messages yet. Start the conversation!</Typography>
                                        </Box>
                                    ) : (
                                        groupedChats.map((group, groupIndex) => (
                                            <Box key={group.date} sx={{ mb: 3 }}>
                                                <Divider sx={{ my: 2, width: "100%" }}>
                                                    <Chip
                                                        label={group.date}
                                                        size="small"
                                                        sx={{ bgcolor: "grey.200" }}
                                                    />
                                                </Divider>
                                                {group.messages.map((msg, index) => {
                                                    const isFromCurrentUser = msg.sender === currentUserId;

                                                    return (
                                                        <Box
                                                            key={msg.id || index}
                                                            sx={{
                                                                display: "flex",
                                                                justifyContent: isFromCurrentUser ? "flex-end" : "flex-start",
                                                                mb: 2
                                                            }}
                                                        >
                                                            {!isFromCurrentUser ? (
                                                                <Box sx={{ display: "flex", alignItems: "flex-end", gap: 1 }}>
                                                                    <Avatar sx={{ width: 40, height: 40, bgcolor: "grey.300" }}>
                                                                        {getInitials(assignee?.name)}
                                                                    </Avatar>
                                                                    <Box
                                                                        sx={{
                                                                            maxWidth: "80%",
                                                                            p: 2,
                                                                            bgcolor: "grey.100",
                                                                            color: "text.primary",
                                                                            borderRadius: 2,
                                                                            borderTopLeftRadius: 4,
                                                                            borderTopRightRadius: 12,
                                                                            borderBottomLeftRadius: 4,
                                                                            borderBottomRightRadius: 12,
                                                                            boxShadow: 1,
                                                                        }}
                                                                    >
                                                                        <Typography variant="body1" sx={{ wordBreak: "break-word" }}>
                                                                            {msg.message}
                                                                        </Typography>

                                                                        <Box sx={{
                                                                            display: "flex",
                                                                            justifyContent: "space-between",
                                                                            alignItems: "center",
                                                                            mt: 1
                                                                        }}>
                                                                            <Typography
                                                                                variant="caption"
                                                                                sx={{
                                                                                    color: "text.secondary",
                                                                                    fontSize: "0.7rem"
                                                                                }}
                                                                            >
                                                                                {new Date(msg.createdon).toLocaleTimeString([], {
                                                                                    hour: '2-digit',
                                                                                    minute: '2-digit',
                                                                                    hour12: true
                                                                                })}
                                                                            </Typography>
                                                                            <Typography
                                                                                variant="caption"
                                                                                sx={{
                                                                                    ml: 1,
                                                                                    color: "text.primary",
                                                                                    fontSize: "0.75rem",
                                                                                    fontWeight: "bold"
                                                                                }}
                                                                            >
                                                                                {assignee?.name || "Assignee"}
                                                                            </Typography>
                                                                        </Box>
                                                                    </Box>
                                                                </Box>
                                                            ) : (
                                                                <Box sx={{ display: "flex", alignItems: "flex-end", gap: 1, flexDirection: "row-reverse" }}>
                                                                    <Box
                                                                        sx={{
                                                                            maxWidth: "80%",
                                                                            p: 2,
                                                                            bgcolor: "primary.main",
                                                                            color: "white",
                                                                            borderRadius: 2,
                                                                            borderTopLeftRadius: 12,
                                                                            borderTopRightRadius: 4,
                                                                            borderBottomLeftRadius: 12,
                                                                            borderBottomRightRadius: 4,
                                                                            boxShadow: 1,
                                                                        }}
                                                                    >
                                                                        <Typography variant="body1" sx={{ wordBreak: "break-word" }}>
                                                                            {msg.message}
                                                                        </Typography>

                                                                        <Box sx={{
                                                                            display: "flex",
                                                                            justifyContent: "space-between",
                                                                            alignItems: "center",
                                                                            mt: 1
                                                                        }}>
                                                                            <Typography
                                                                                variant="caption"
                                                                                sx={{
                                                                                    color: "rgba(255,255,255,0.8)",
                                                                                    fontSize: "0.7rem"
                                                                                }}
                                                                            >
                                                                                {new Date(msg.createdon).toLocaleTimeString([], {
                                                                                    hour: '2-digit',
                                                                                    minute: '2-digit',
                                                                                    hour12: true
                                                                                })}
                                                                            </Typography>
                                                                            <Typography
                                                                                variant="caption"
                                                                                sx={{
                                                                                    mr: 1,
                                                                                    color: "white",
                                                                                    fontSize: "0.75rem",
                                                                                    fontWeight: "bold"
                                                                                }}
                                                                            >
                                                                                You
                                                                            </Typography>
                                                                        </Box>
                                                                    </Box>
                                                                    <Avatar sx={{ width: 40, height: 40, bgcolor: "primary.main", color: "white" }}>
                                                                        {getInitials(currentUserName)}
                                                                    </Avatar>
                                                                </Box>
                                                            )}
                                                        </Box>
                                                    );
                                                })}
                                            </Box>
                                        ))
                                    )}
                                </Box>
                                {/* Message Input */}
                                <Box sx={{
                                    p: 2,
                                    borderTop: 1,
                                    borderColor: "divider",
                                    bgcolor: "background.default"
                                }}>
                                    <Box sx={{ display: "flex", gap: 1 }}>
                                        <TextField
                                            fullWidth
                                            size="medium"
                                            placeholder="Type your message..."
                                            value={newFollowUpMessage}
                                            onChange={e => setNewFollowUpMessage(e.target.value)}
                                            disabled={sendingFollowUpMessage || !assignee}
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    sendFollowUpMessageHandler(newFollowUpMessage);
                                                }
                                            }}
                                            multiline
                                            maxRows={4}
                                        />
                                        <IconButton
                                            onClick={() => sendFollowUpMessageHandler(newFollowUpMessage)}
                                            disabled={!newFollowUpMessage.trim() || sendingFollowUpMessage || !assignee}
                                            color="primary"
                                            sx={{ alignSelf: "flex-end", height: 40, width: 40 }}
                                        >
                                            {sendingFollowUpMessage ? <CircularProgress size={20} /> : <SendIcon />}
                                        </IconButton>
                                    </Box>
                                </Box>
                            </Box>
                        )}
                        {chatTab === 1 && isSolvedTicket && (
                            // Solution Tab: Approve/Resolve Solution
                            <Box sx={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "100%",
                                p: 4,
                                gap: 2,
                                textAlign: "center"
                            }}>
                                <DoneAllIcon sx={{ fontSize: 64, color: "success.main" }} />
                                <Typography variant="h6" fontWeight={600} color="text.primary">
                                    Solution Provided
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 3, wordBreak: "break-word", color: "text.primary" }}>
                                    {solutionText}
                                </Typography>
                                <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
                                    <Button
                                        variant={isResolved ? "contained" : "outlined"}
                                        color="success"
                                        onClick={handleResolveSolution}
                                        disabled={isResolved}
                                        size="small"
                                    >
                                        {isResolved ? "Resolved" : "Resolve Solution"}
                                    </Button>
                                    <Button
                                        variant={isApproved ? "contained" : "outlined"}
                                        color="primary"
                                        onClick={handleApproveSolution}
                                        disabled={isApproved}
                                        size="small"
                                    >
                                        {isApproved ? "Approved" : "Approve Solution"}
                                    </Button>
                                </Box>
                                <Button
                                    variant="outlined"
                                    onClick={() => setChatTab(0)}
                                    sx={{ mt: 1 }}
                                >
                                    Back to Follow-up
                                </Button>
                            </Box>
                        )}
                    </Box>
                </Box>
            </Drawer>
        </Box >
    );
};
export default RequestTabs;