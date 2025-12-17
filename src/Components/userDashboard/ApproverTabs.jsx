// // import { useEffect, useMemo, useState } from "react";
// // import { useTheme } from "@mui/material/styles";
// // import { Box, Card, CardContent, Typography, Grid, TextField, Button, Table, TableHead, TableRow, TableCell, TableBody, TableContainer, useMediaQuery, TablePagination, Autocomplete, } from "@mui/material";
// // import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// // import CancelIcon from '@mui/icons-material/Cancel';
// // import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
// // import PauseCircleIcon from '@mui/icons-material/PauseCircle';
// // import ErrorIcon from '@mui/icons-material/Error';
// // import UpdateIcon from '@mui/icons-material/Update';
// // import VisibilityIcon from '@mui/icons-material/Visibility';
// // import { useNavigate } from "react-router-dom";


// // const ApproverTabs = ({ approverStatus }) => {

// //     const theme = useTheme();
// //     const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

// //     const [selectedType, setSelectedType] = useState("");
// //     const [search, setSearch] = useState("");
// //     const [department, setDepartment] = useState("");
// //     const [tickets, setTickets] = useState({
// //         pending: [],
// //         approved: [],
// //         hold: [],
// //         reassigned: [],
// //         rejected: [],
// //         sla: []
// //     });

// //     const [page, setPage] = useState(0);
// //     const [rowsPerPage, setRowsPerPage] = useState(5);

// //     useEffect(() => {
// //         if (approverStatus) {
// //             setTickets({
// //                 pending: approverStatus.pending_tickets || [],
// //                 approved: approverStatus.approved_tickets || [],
// //                 hold: approverStatus.on_hold_tickets || [],
// //                 reassigned: approverStatus.reassigned_tickets || [],
// //                 rejected: approverStatus.rejected_tickets || [],
// //                 sla: approverStatus.sla_breached_tickets || []
// //             });
// //         }
// //     }, [approverStatus]);

// //     const statusCards = [
// //         { id: "pending", label: "PENDING", color: "warning.main", icon: <ErrorIcon />, count: approverStatus?.pending || 0 },
// //         { id: "approved", label: "APPROVED", color: "success.main", icon: <CheckCircleIcon />, count: approverStatus?.approved || 0 },
// //         { id: "hold", label: "ON HOLD", color: "info.main", icon: <PauseCircleIcon />, count: approverStatus?.on_hold || 0 },
// //         { id: "reassigned", label: "REASSIGNED", color: "warning.main", icon: <UpdateIcon />, count: approverStatus?.reassigned || 0 },
// //         { id: "rejected", label: "REJECTED", color: "error.main", icon: <CancelIcon />, count: approverStatus?.rejected || 0 },
// //         { id: "sla", label: "SLA BREACHED", color: "warning.main", icon: <AccessTimeFilledIcon />, count: approverStatus?.sla_breached_count || 0 },
// //     ];

// //     const ApproverTabelCol = [
// //         { id: 1, title: "Ticket ID" },
// //         { id: 2, title: "Title" },
// //         { id: 3, title: "Description" },
// //         { id: 4, title: "Status" },
// //         { id: 5, title: "Category" },
// //         { id: 6, title: "Subcategory" },
// //         { id: 7, title: "Priority" },
// //         { id: 8, title: "Department" },
// //         { id: 9, title: "Location" },
// //         { id: 10, title: "Requested By" },
// //         { id: 11, title: "Open Date" },
// //         { id: 12, title: "Last Update" },
// //         { id: 13, title: "Action" },
// //     ];

// //     const navigate = useNavigate();

// //     const selectedTickets = tickets[selectedType] || [];

// //     const departmentList = useMemo(
// //         () => [...new Set(selectedTickets.map((row) => row.department_detail?.field_name).filter(Boolean))],
// //         [selectedTickets]
// //     );

// //     const headingMap = {
// //         pending: "PENDING Tickets (APPROVER)",
// //         approved: "APPROVED Tickets (APPROVER)",
// //         hold: "ON HOLD Tickets (APPROVER)",
// //         reassigned: "REASSIGNED Tickets (APPROVER)",
// //         rejected: "REJECTED Tickets (APPROVER)",
// //         sla: "SLA BREACHED Tickets (APPROVER)",
// //     };

// //     const filteredRows = useMemo(() => {
// //         return selectedTickets.filter((row) => {
// //             const matchesSearch =
// //                 Object.values(row)
// //                     .join(" ")
// //                     .toLowerCase()
// //                     .includes(search.toLowerCase());

// //             const matchesDept = department ? row.department_detail?.field_name === department : true;

// //             return matchesSearch && matchesDept;
// //         });
// //     }, [selectedTickets, search, department]);

// //     const handleCardClick = (type) => {
// //         setSelectedType(type);
// //         setSearch("");
// //         setDepartment("");
// //         setPage(0);
// //     };

// //     const clearFilters = () => {
// //         setSearch("");
// //         setDepartment("");
// //         setPage(0);
// //     };

// //     // const handleTicketClick = (ticketId) => {
// //     //     console.log('Storing ticket ID:', ticketId);
// //     //     localStorage.setItem('selectedTicketId', ticketId);
// //     //     console.log('Navigating to Approval');
// //     //     navigate('/Approval');
// //     // };

// //     const handleTicketClick = (ticketNo) => {
// //         console.log('Storing ticket ID:', ticketNo);
// //         localStorage.setItem('selectedTicketId', ticketNo);
// //         console.log('Navigating to Approval');
// //         navigate('/Approval');
// //     };


// //     return (
// //         <>
// //             <Box sx={{ width: "100%" }}>
// //                 <Card>
// //                     <CardContent>
// //                         <Typography
// //                             textAlign="center"
// //                             variant={isMobile ? "h6" : "h5"}
// //                             fontWeight={700}
// //                             sx={{ mb: 3 }}
// //                         >
// //                             APPROVER DASHBOARD
// //                         </Typography>
// //                         <Grid container spacing={2}>
// //                             {statusCards.map((item) => (
// //                                 <Grid size={{ xs: 6, sm: 4, md: 3, lg: 2 }} key={item.id}>
// //                                     <Card
// //                                         onClick={() => handleCardClick(item.id)}
// //                                         sx={{
// //                                             borderRadius: 10,
// //                                             height: isMobile ? "90px" : "85px",
// //                                             boxShadow: selectedType === item.id ? "0px 4px 12px rgba(102,126,234,0.6)" : "0px 4px 10px rgba(0,0,0,0.1)",
// //                                             border: selectedType === item.id ? "2px solid #667eea" : "2px solid transparent",
// //                                             p: isMobile ? 0 : 1,
// //                                             transition: "0.3s",
// //                                             "&:hover": {
// //                                                 background: "linear-gradient(135deg, #667eea, #764ba2)",
// //                                                 transform: "translateY(-4px)",
// //                                             },
// //                                         }}
// //                                     >
// //                                         <CardContent
// //                                             sx={{
// //                                                 display: "flex",
// //                                                 alignItems: "center",
// //                                                 gap: isMobile ? 2 : 4,
// //                                             }}
// //                                         >
// //                                             <Box
// //                                                 sx={{
// //                                                     width: 45,
// //                                                     height: 45,
// //                                                     borderRadius: "50%",
// //                                                     backgroundColor: item.color,
// //                                                     color: "#fff",
// //                                                     display: "flex",
// //                                                     alignItems: "center",
// //                                                     justifyContent: "center",
// //                                                     fontSize: 22,
// //                                                 }}
// //                                             >
// //                                                 {item.icon}
// //                                             </Box>
// //                                             <Box>
// //                                                 <Typography variant={isMobile ? "h6" : "h5"} fontWeight={600}>
// //                                                     {item.count}
// //                                                 </Typography>
// //                                                 <Typography
// //                                                     variant="subtitle1"
// //                                                     fontWeight={600}
// //                                                     sx={{ color: "text.secondary", fontSize: isMobile ? 11 : 14 }}
// //                                                 >
// //                                                     {item.label}
// //                                                 </Typography>
// //                                             </Box>
// //                                         </CardContent>
// //                                     </Card>
// //                                 </Grid>
// //                             ))}
// //                         </Grid>
// //                         {selectedType && (
// //                             <Box>
// //                                 <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 5 }}>
// //                                     <Typography
// //                                         variant="h6"
// //                                         fontWeight={700}
// //                                         sx={{ mt: 0.5 }}
// //                                     >
// //                                         {headingMap[selectedType] || "Tickets"}
// //                                     </Typography>
// //                                     <Box
// //                                         sx={{
// //                                             display: "flex",
// //                                             flexDirection: isMobile ? "column" : "row",
// //                                             justifyContent: "flex-end",
// //                                             gap: 2,
// //                                         }}
// //                                     >
// //                                         <Autocomplete
// //                                             options={departmentList}
// //                                             value={department}
// //                                             onChange={(e, newValue) => setDepartment(newValue)}
// //                                             renderInput={(params) => <TextField {...params} label="Department" size="small" />}
// //                                             sx={{ width: 200 }}
// //                                         />
// //                                         <TextField
// //                                             size="small"
// //                                             label="Search"
// //                                             value={search}
// //                                             onChange={(e) => setSearch(e.target.value)}
// //                                             sx={{ width: 200 }}
// //                                         />
// //                                         <Button variant="outlined" fullWidth={isMobile} onClick={clearFilters}>
// //                                             Clear
// //                                         </Button>
// //                                     </Box>
// //                                 </Box>
// //                                 <Card sx={{ borderRadius: 6, mt: 5 }}>
// //                                     <TableContainer sx={{ overflowX: "auto" }}>
// //                                         <Table>
// //                                             <TableHead>
// //                                                 <TableRow>
// //                                                     {ApproverTabelCol.map((col) => (
// //                                                         <TableCell key={col.id} sx={{ fontWeight: 700, whiteSpace: "nowrap" }}>
// //                                                             {col.title}
// //                                                         </TableCell>
// //                                                     ))}
// //                                                 </TableRow>
// //                                             </TableHead>
// //                                             <TableBody>
// //                                                 {filteredRows.length > 0 ? (
// //                                                     filteredRows
// //                                                         .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
// //                                                         .map((t) => (
// //                                                             <TableRow key={t.id} hover>
// //                                                                 <TableCell>{t.ticket_no}</TableCell>
// //                                                                 <TableCell>{t.title}</TableCell>
// //                                                                 <TableCell>{t.description}</TableCell>
// //                                                                 <TableCell>{t.status_detail?.field_values}</TableCell>
// //                                                                 {/* <TableCell>{t.category_detail?.field_values || "-"}</TableCell>
// //                                                                 <TableCell>{t.subcategory_detail?.field_values || "-"}</TableCell> */}
// //                                                                 <TableCell>{t.category_detail?.category_name || "-"}</TableCell>
// //                                                             <TableCell>{t.subcategory_detail?.subcategory_name || "-"}</TableCell>
// //                                                                 <TableCell>{t.priority_detail?.field_values}</TableCell>
// //                                                                 <TableCell>{t.department_detail?.field_name}</TableCell>
// //                                                                 <TableCell>{t.location_detail?.field_name}</TableCell>
// //                                                                 <TableCell>{t.requested_detail?.email}</TableCell>
// //                                                                 <TableCell>{new Date(t.created_date).toLocaleString()}</TableCell>
// //                                                                 <TableCell>{new Date(t.updated_date).toLocaleString()}</TableCell>
// //                                                                 <TableCell>
// //                                                                     <VisibilityIcon
// //                                                                         onClick={() => handleTicketClick(t.ticket_no)}
// //                                                                         //onClick={() => navigate(`/Approval/${t.id}`)}
// //                                                                         //onClick={() => navigate("/Approval", { state: { ticket: t } })}
// //                                                                         style={{ cursor: "pointer", color: "#667eea" }}
// //                                                                     />
// //                                                                 </TableCell>
// //                                                             </TableRow>
// //                                                         ))
// //                                                 ) : (
// //                                                     <TableRow>
// //                                                         <TableCell colSpan={12} align="center">
// //                                                             No tickets found.
// //                                                         </TableCell>
// //                                                     </TableRow>
// //                                                 )}
// //                                             </TableBody>
// //                                         </Table>
// //                                     </TableContainer>
// //                                     <TablePagination
// //                                         component="div"
// //                                         count={filteredRows.length}
// //                                         page={page}
// //                                         rowsPerPage={rowsPerPage}
// //                                         onPageChange={(e, newPage) => setPage(newPage)}
// //                                         onRowsPerPageChange={(e) => {
// //                                             setRowsPerPage(parseInt(e.target.value, 5));
// //                                             setPage(0);
// //                                         }}
// //                                     />
// //                                 </Card>
// //                             </Box>
// //                         )}
// //                     </CardContent>
// //                 </Card>
// //             </Box>
// //         </>
// //     )
// // };

// // export default ApproverTabs;

// // import { useEffect, useMemo, useState } from "react";
// // import { useTheme } from "@mui/material/styles";
// // import { Box, Card, CardContent, Typography, Grid, TextField, Button, Table, TableHead, TableRow, TableCell, TableBody, TableContainer, useMediaQuery, TablePagination, Autocomplete, Stack, Pagination, Tooltip, } from "@mui/material";
// // import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// // import CancelIcon from '@mui/icons-material/Cancel';
// // import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
// // import PauseCircleIcon from '@mui/icons-material/PauseCircle';
// // import ErrorIcon from '@mui/icons-material/Error';
// // import UpdateIcon from '@mui/icons-material/Update';
// // import VisibilityIcon from '@mui/icons-material/Visibility';
// // import { useNavigate } from "react-router-dom";


// // const ApproverTabs = ({ approverStatus }) => {

// //     const theme = useTheme();
// //     const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

// //     const [selectedType, setSelectedType] = useState("pending");
// //     const [search, setSearch] = useState("");
// //     const [department, setDepartment] = useState("");
// //     const [tickets, setTickets] = useState({
// //         pending: [],
// //         approved: [],
// //         hold: [],
// //         reassigned: [],
// //         rejected: [],
// //         sla: []
// //     });

// //     const [page, setPage] = useState(0);
// //     const [rowsPerPage, setRowsPerPage] = useState(5);

// //     useEffect(() => {
// //         if (approverStatus) {
// //             setTickets({
// //                 pending: approverStatus.pending_tickets || [],
// //                 approved: approverStatus.approved_tickets || [],
// //                 hold: approverStatus.on_hold_tickets || [],
// //                 reassigned: approverStatus.reassigned_tickets || [],
// //                 rejected: approverStatus.rejected_tickets || [],
// //                 sla: approverStatus.sla_breached_tickets || []
// //             });
// //         }
// //     }, [approverStatus]);

// //     const statusCards = [
// //         { id: "pending", label: "PENDING", color: "warning.main", icon: <ErrorIcon />, count: approverStatus?.pending || 0 },
// //         { id: "approved", label: "APPROVED", color: "success.main", icon: <CheckCircleIcon />, count: approverStatus?.approved || 0 },
// //         { id: "hold", label: "ON HOLD", color: "info.main", icon: <PauseCircleIcon />, count: approverStatus?.on_hold || 0 },
// //         { id: "reassigned", label: "REASSIGNED", color: "warning.main", icon: <UpdateIcon />, count: approverStatus?.reassigned || 0 },
// //         { id: "rejected", label: "REJECTED", color: "error.main", icon: <CancelIcon />, count: approverStatus?.rejected || 0 },
// //         { id: "sla", label: "SLA BREACHED", color: "warning.main", icon: <AccessTimeFilledIcon />, count: approverStatus?.sla_breached_count || 0 },
// //     ];

// //     const ApproverTabelCol = [
// //         { id: 1, title: <>Ticket ID</> },
// //         { id: 2, title: <>Title</> },
// //         { id: 3, title: <>Description</> },
// //         { id: 4, title: <>Status<br />Priority</> },             // FIXED
// //         { id: 5, title: <>Category<br />Subcategory</> },       // FIXED
// //         { id: 6, title: <>Department<br />Location</> },        // FIXED
// //         { id: 7, title: <>Requested By</> },
// //         { id: 8, title: <>Open Date<br />Last Update</> },      // FIXED
// //         { id: 9, title: <>Action</> },
// //     ];

// //     // const ApproverTabelCol = [
// //     //     { id: 1, title: "Ticket ID" },
// //     //     { id: 2, title: "Title" },
// //     //     { id: 3, title: "Description" },
// //     //     { id: 4, title: "Status" },
// //     //     { id: 5, title: "Category" },
// //     //     { id: 6, title: "Subcategory" },
// //     //     { id: 7, title: "Priority" },
// //     //     { id: 8, title: "Department" },
// //     //     { id: 9, title: "Location" },
// //     //     { id: 10, title: "Requested By" },
// //     //     { id: 11, title: "Open Date" },
// //     //     { id: 12, title: "Last Update" },
// //     //     { id: 13, title: "Action" },
// //     // ];

// //     const navigate = useNavigate();

// //     const selectedTickets = tickets[selectedType] || [];

// //     const departmentList = useMemo(
// //         () => [...new Set(selectedTickets.map((row) => row.department_detail?.field_name).filter(Boolean))],
// //         [selectedTickets]
// //     );

// //     const headingMap = {
// //         pending: "PENDING Tickets (APPROVER)",
// //         approved: "APPROVED Tickets (APPROVER)",
// //         hold: "ON HOLD Tickets (APPROVER)",
// //         reassigned: "REASSIGNED Tickets (APPROVER)",
// //         rejected: "REJECTED Tickets (APPROVER)",
// //         sla: "SLA BREACHED Tickets (APPROVER)",
// //     };

// //     const filteredRows = useMemo(() => {
// //         return selectedTickets.filter((row) => {
// //             const matchesSearch =
// //                 Object.values(row)
// //                     .join(" ")
// //                     .toLowerCase()
// //                     .includes(search.toLowerCase());

// //             const matchesDept = department ? row.department_detail?.field_name === department : true;

// //             return matchesSearch && matchesDept;
// //         });
// //     }, [selectedTickets, search, department]);

// //     const handleCardClick = (type) => {
// //         setSelectedType(type);
// //         setSearch("");
// //         setDepartment("");
// //         setPage(0);
// //     };

// //     const clearFilters = () => {
// //         setSearch("");
// //         setDepartment("");
// //         setPage(0);
// //     };

// //     const handleTicketClick = (ticketNo) => {
// //         console.log('Storing ticket No:', ticketNo);
// //         localStorage.setItem('selectedTicketId', ticketNo);
// //         console.log('Navigating to Approval');
// //         navigate('/Approval');
// //     };

// //     return (
// //         <>
// //             <Box sx={{ width: "100%" }}>
// //                 <Card>
// //                     <CardContent>
// //                         <Typography
// //                             textAlign="center"
// //                             variant={isMobile ? "h6" : "h5"}
// //                             fontWeight={700}
// //                             sx={{ mb: 3 }}
// //                         >
// //                             APPROVER DASHBOARD
// //                         </Typography>
// //                         <Grid container spacing={2}>
// //                             {statusCards.map((item) => (
// //                                 <Grid size={{ xs: 6, sm: 4, md: 3, lg: 2 }} key={item.id}>
// //                                     <Card
// //                                         onClick={() => handleCardClick(item.id)}
// //                                         sx={{
// //                                             borderRadius: 10,
// //                                             height: isMobile ? "90px" : "85px",
// //                                             boxShadow: selectedType === item.id ? "0px 4px 12px rgba(102,126,234,0.6)" : "0px 4px 10px rgba(0,0,0,0.1)",
// //                                             border: selectedType === item.id ? "2px solid #667eea" : "2px solid transparent",
// //                                             p: isMobile ? 0 : 1,
// //                                             transition: "0.3s",
// //                                             "&:hover": {
// //                                                 background: "linear-gradient(135deg, #667eea, #764ba2)",
// //                                                 transform: "translateY(-4px)",
// //                                             },
// //                                         }}
// //                                     >
// //                                         <CardContent
// //                                             sx={{
// //                                                 display: "flex",
// //                                                 alignItems: "center",
// //                                                 gap: isMobile ? 2 : 4,
// //                                             }}
// //                                         >
// //                                             <Box
// //                                                 sx={{
// //                                                     width: 45,
// //                                                     height: 45,
// //                                                     borderRadius: "50%",
// //                                                     backgroundColor: item.color,
// //                                                     color: "#fff",
// //                                                     display: "flex",
// //                                                     alignItems: "center",
// //                                                     justifyContent: "center",
// //                                                     fontSize: 22,
// //                                                 }}
// //                                             >
// //                                                 {item.icon}
// //                                             </Box>
// //                                             <Box>
// //                                                 <Typography variant={isMobile ? "h6" : "h5"} fontWeight={600}>
// //                                                     {item.count}
// //                                                 </Typography>
// //                                                 <Typography
// //                                                     variant="subtitle1"
// //                                                     fontWeight={600}
// //                                                     sx={{ color: "text.secondary", fontSize: isMobile ? 11 : 14 }}
// //                                                 >
// //                                                     {item.label}
// //                                                 </Typography>
// //                                             </Box>
// //                                         </CardContent>
// //                                     </Card>
// //                                 </Grid>
// //                             ))}
// //                         </Grid>
// //                         {selectedType && (
// //                             <Box>
// //                                 <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 5 }}>
// //                                     <Typography variant="h6" fontWeight={700} sx={{ mt: 0.5 }}>
// //                                         {headingMap[selectedType] || "Tickets"}
// //                                     </Typography>
// //                                     <Box
// //                                         sx={{
// //                                             display: "flex",
// //                                             flexDirection: isMobile ? "column" : "row",
// //                                             justifyContent: "flex-end",
// //                                             gap: 2,
// //                                         }}
// //                                     >
// //                                         <Autocomplete
// //                                             options={departmentList}
// //                                             value={department}
// //                                             onChange={(e, newValue) => setDepartment(newValue)}
// //                                             renderInput={(params) => <TextField {...params} label="Department" size="small" />}
// //                                             sx={{
// //                                                 width: 200,
// //                                                 "& .MuiOutlinedInput-root": {
// //                                                     borderRadius: 3,
// //                                                 }
// //                                             }}
// //                                         />
// //                                         <TextField
// //                                             size="small"
// //                                             label="Search"
// //                                             value={search}
// //                                             onChange={(e) => setSearch(e.target.value)}
// //                                             sx={{
// //                                                 width: 200,
// //                                                 "& .MuiOutlinedInput-root": {
// //                                                     borderRadius: 3,
// //                                                 }
// //                                             }}
// //                                         />
// //                                         <Button variant="outlined" fullWidth={isMobile} onClick={clearFilters} sx={{ borderRadius: 3 }}>
// //                                             Clear
// //                                         </Button>
// //                                     </Box>
// //                                 </Box>
// //                                 <Card sx={{ borderRadius: 6, mt: 5 }}>
// //                                     <TableContainer sx={{ overflowX: "auto" }}>
// //                                         <Table>
// //                                             <TableHead>
// //                                                 <TableRow>
// //                                                     {ApproverTabelCol.map((col) => (
// //                                                         <TableCell key={col.id} sx={{ fontWeight: 700, whiteSpace: "nowrap" }}>
// //                                                             {col.title}
// //                                                         </TableCell>
// //                                                     ))}
// //                                                 </TableRow>
// //                                             </TableHead>
// //                                             <TableBody>
// //                                                 {filteredRows.length > 0 ? (
// //                                                     filteredRows
// //                                                         .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
// //                                                         .map((t) => (
// //                                                             <TableRow key={t.id} hover>
// //                                                                 <TableCell>{t.ticket_no}</TableCell>
// //                                                                 <TableCell>{t.title}</TableCell>
// //                                                                 <TableCell>
// //                                                                     <Tooltip
// //                                                                         title={t.description || "No description"}
// //                                                                         arrow
// //                                                                         placement="top"
// //                                                                     >
// //                                                                         <Typography
// //                                                                             sx={{
// //                                                                                 maxWidth: 200,
// //                                                                                 whiteSpace: "nowrap",
// //                                                                                 overflow: "hidden",
// //                                                                                 textOverflow: "ellipsis",
// //                                                                                 cursor: "pointer"
// //                                                                             }}
// //                                                                         >
// //                                                                             {t.description || "-"}
// //                                                                         </Typography>
// //                                                                     </Tooltip>
// //                                                                 </TableCell>
// //                                                                 <TableCell>
// //                                                                     {t.status_detail?.field_values} <br />
// //                                                                     {t.priority_detail?.field_values}
// //                                                                 </TableCell>
// //                                                                 <TableCell>
// //                                                                     <Tooltip
// //                                                                         arrow
// //                                                                         placement="top"
// //                                                                         title={
// //                                                                             <Box>
// //                                                                                 <div><strong>Category:</strong> {t.category_detail?.category_name || "-"}</div>
// //                                                                                 <div><strong>Subcategory:</strong> {t.subcategory_detail?.subcategory_name || "-"}</div>
// //                                                                             </Box>
// //                                                                         }
// //                                                                     >
// //                                                                         <Box sx={{ cursor: "pointer" }}>
// //                                                                             {t.category_detail?.category_name || "-"} <br />
// //                                                                             {t.subcategory_detail?.subcategory_name || "-"}
// //                                                                         </Box>
// //                                                                     </Tooltip>
// //                                                                 </TableCell>
// //                                                                 {/* <TableCell>{t.subcategory_detail?.field_values || "-"}</TableCell>
// //                                                                 <TableCell>{t.priority_detail?.field_values}</TableCell> */}
// //                                                                 <TableCell>
// //                                                                     {t.department_detail?.field_name} <br />
// //                                                                     {t.location_detail?.field_name}
// //                                                                 </TableCell>
// //                                                                 {/* <TableCell>{t.location_detail?.field_name}</TableCell> */}
// //                                                                 <TableCell>{t.requested_detail?.email}</TableCell>
// //                                                                 <TableCell>
// //                                                                     {new Date(t.created_date).toLocaleString()} <br />
// //                                                                     {new Date(t.updated_date).toLocaleString()}
// //                                                                 </TableCell>
// //                                                                 {/* <TableCell>{new Date(t.updated_date).toLocaleString()}</TableCell> */}
// //                                                                 <TableCell>
// //                                                                     <VisibilityIcon
// //                                                                         onClick={() => handleTicketClick(t.ticket_no)}
// //                                                                         //onClick={() => navigate(`/Approval/${t.id}`)}
// //                                                                         //onClick={() => navigate("/Approval", { state: { ticket: t } })}
// //                                                                         style={{ cursor: "pointer", color: "#667eea" }}
// //                                                                     />
// //                                                                 </TableCell>
// //                                                             </TableRow>
// //                                                         ))
// //                                                 ) : (
// //                                                     <TableRow>
// //                                                         <TableCell colSpan={12} align="center">
// //                                                             No tickets found.
// //                                                         </TableCell>
// //                                                     </TableRow>
// //                                                 )}
// //                                             </TableBody>
// //                                         </Table>
// //                                     </TableContainer>
// //                                     <Stack direction="row" justifyContent="end" sx={{ py: 2, px: 2 }}>
// //                                         <Pagination
// //                                             count={Math.ceil(filteredRows.length / rowsPerPage)}
// //                                             page={page + 1}
// //                                             onChange={(e, value) => setPage(value - 1)}
// //                                             variant="outlined"
// //                                             shape="rounded"
// //                                             showFirstButton={false}
// //                                             showLastButton={false}
// //                                             siblingCount={0}
// //                                             boundaryCount={1}
// //                                             sx={{
// //                                                 "& .MuiPaginationItem-root": {
// //                                                     borderRadius: "20px",
// //                                                     minWidth: 40,
// //                                                     height: 40,
// //                                                 },
// //                                             }}
// //                                         />
// //                                     </Stack>
// //                                 </Card>
// //                             </Box>
// //                         )}
// //                     </CardContent>
// //                 </Card>
// //             </Box>
// //         </>
// //     )
// // };

// // export default ApproverTabs;
// import { useEffect, useMemo, useState } from "react";
// import { useTheme } from "@mui/material/styles";
// import { 
//   Box, Card, CardContent, Typography, Grid, TextField, Button, 
//   Table, TableHead, TableRow, TableCell, TableBody, TableContainer, 
//   useMediaQuery, Autocomplete, Stack, Pagination, Tooltip, 
//   CircularProgress, IconButton, Drawer, Divider, Chip, Avatar,
//   Alert, AvatarGroup
// } from "@mui/material";
// import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// import CancelIcon from '@mui/icons-material/Cancel';
// import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
// import PauseCircleIcon from '@mui/icons-material/PauseCircle';
// import ErrorIcon from '@mui/icons-material/Error';
// import UpdateIcon from '@mui/icons-material/Update';
// import VisibilityIcon from '@mui/icons-material/Visibility';
// import ChatIcon from '@mui/icons-material/Chat';
// import SendIcon from '@mui/icons-material/Send';
// import PeopleIcon from '@mui/icons-material/People';
// import PersonIcon from '@mui/icons-material/Person';
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { fetchApproverTickets, fetchMessages, sendMessage, getTicketDetails } from "../../Api";

// const ApproverTabs = ({ approverStatus: propApproverStatus }) => {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

//   const [selectedType, setSelectedType] = useState("approved");
//   const [search, setSearch] = useState("");
//   const [department, setDepartment] = useState("");
//   const [tickets, setTickets] = useState({
//     pending: [],
//     approved: [],
//     hold: [],
//     reassigned: [],
//     rejected: [],
//     sla: []
//   });

//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [loading, setLoading] = useState(true);
//   const [approverStatus, setApproverStatus] = useState(null);
//   const [error, setError] = useState(null);

//   // Chat/follow-up states
//   const [showFollowUpChat, setShowFollowUpChat] = useState(false);
//   const [followUpChats, setFollowUpChats] = useState([]);
//   const [loadingFollowUpChats, setLoadingFollowUpChats] = useState(false);
//   const [newFollowUpMessage, setNewFollowUpMessage] = useState("");
//   const [sendingFollowUpMessage, setSendingFollowUpMessage] = useState(false);
//   const [currentChatTicket, setCurrentChatTicket] = useState(null);
//   const [requester, setRequester] = useState(null);
//   const [currentUserId, setCurrentUserId] = useState(null);
//   const [currentUserName, setCurrentUserName] = useState("You");

//   const navigate = useNavigate();

//   // Get current user ID and name on component mount
//   useEffect(() => {
//     const userDataString = localStorage.getItem("user");
//     if (userDataString) {
//       try {
//         const userData = JSON.parse(userDataString);
//         setCurrentUserId(userData?.id || null);
//         setCurrentUserName(userData?.name || userData?.username || "You");
//       } catch (err) {
//         console.error("Error parsing user data:", err);
//         setCurrentUserId(null);
//         setCurrentUserName("You");
//       }
//     } else {
//       const userId = localStorage.getItem("current_user_id") || null;
//       setCurrentUserId(userId ? parseInt(userId) : null);
//       setCurrentUserName("You");
//     }
//   }, []);

//   // Helper function to format assigned users and groups for display
//   const formatAssignees = (ticket) => {
//     if (!ticket) return { users: [], groups: [], displayText: "" };

//     const users = ticket.assigned_users || [];
//     const groups = ticket.assigned_groups || [];

//     // Format user names
//     const userNames = users.map(user => {
//       if (user.is_unknown || !user.id) {
//         // If user has no ID, show email or name
//         return user.email || user.name || "Unknown User";
//       }
//       return user.name || user.full_name || user.email || "User";
//     });

//     // Format group names
//     const groupNames = groups.map(group => {
//       if (group.is_unknown || !group.id) {
//         return group.name || "Unknown Group";
//       }
//       return group.name || "Group";
//     });

//     // Create display text
//     let displayText = "";
//     if (userNames.length > 0 && groupNames.length > 0) {
//       displayText = `${userNames.join(', ')} & ${groupNames.join(', ')}`;
//     } else if (userNames.length > 0) {
//       displayText = userNames.join(', ');
//     } else if (groupNames.length > 0) {
//       displayText = groupNames.join(', ');
//     } else {
//       displayText = "Not assigned";
//     }

//     return {
//       users: userNames,
//       groups: groupNames,
//       displayText,
//       hasUsers: userNames.length > 0,
//       hasGroups: groupNames.length > 0,
//       userCount: userNames.length,
//       groupCount: groupNames.length
//     };
//   };

//   // Get user initials for avatar
//   const getUserInitials = (user) => {
//     if (!user) return "?";

//     if (user.name && user.name !== "Unknown User") {
//       return user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
//     }

//     if (user.email && user.email !== "unknown@example.com") {
//       const namePart = user.email.split('@')[0];
//       return namePart.substring(0, 2).toUpperCase();
//     }

//     return "?";
//   };

//   // Get group initials for avatar
//   const getGroupInitials = (group) => {
//     if (!group) return "G";
//     if (group.name && group.name !== "Unknown Group") {
//       return group.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
//     }
//     return "G";
//   };

//   // Load approver data function
//   const loadApproverData = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//         console.log("propApproverStatus :",propApproverStatus);

//       if (propApproverStatus) {
//         setApproverStatus(propApproverStatus);
//       } else {
//         console.log('Fetching approver tickets...');

//         // Check authentication first
//         const token = localStorage.getItem("access_token");
//         if (!token) {
//           throw new Error("No authentication token found. Please login again.");
//         }

//         const data = await fetchApproverTickets();
//         console.log('Approver tickets data received:', data);

//         if (data && data.success && data.user_stats) {
//           // Process assigned_users and assigned_groups data
//           const processTickets = (ticketList) => {
//             if (!Array.isArray(ticketList)) return [];
//             return ticketList.map(ticket => {
//               // Ensure assigned_users and assigned_groups are properly formatted
//               return {
//                 ...ticket,
//                 assigned_users: Array.isArray(ticket.assigned_users) 
//                   ? ticket.assigned_users.map(user => ({
//                       id: user.id || null,
//                       name: user.name || user.full_name || user.email || "Unknown User",
//                       email: user.email || "unknown@example.com",
//                       full_name: user.full_name || user.name || user.email || "Unknown User",
//                       is_unknown: !user.id
//                     }))
//                   : [],
//                 assigned_groups: Array.isArray(ticket.assigned_groups)
//                   ? ticket.assigned_groups.map(group => ({
//                       id: group.id || null,
//                       name: group.name || "Unknown Group",
//                       description: group.description || "",
//                       is_unknown: !group.id
//                     }))
//                   : []
//               };
//             });
//           };

//           // Process all ticket categories
//           const processedStats = {
//             ...data.approver_stats,
//             pending_tickets: processTickets(data?.approver_stats?.pending_tickets),
//             approved_tickets: processTickets(data?.approver_stats?.approved_tickets),
//             on_hold_tickets: processTickets(data?.approver_stats?.on_hold_tickets),
//             reassigned_tickets: processTickets(data?.approver_stats?.reassigned_tickets),
//             rejected_tickets: processTickets(data?.approver_stats?.rejected_tickets),
//             sla_breached_tickets: processTickets(data?.approver_stats?.sla_breached_tickets)
//           };

//           setApproverStatus(processedStats);
//         } else {
//           throw new Error("Invalid response format from server");
//         }
//       }
//     } catch (err) {
//       console.error("Error fetching approver tickets:", err);
//       // More specific error messages
//       let errorMessage = "Failed to load approver dashboard";
//       if (err.message.includes("401") || err.message.includes("Unauthorized")) {
//         errorMessage = "Authentication failed. Please login again.";
//       } else if (err.message.includes("404")) {
//         errorMessage = "Approver endpoint not found. Please check the API URL.";
//       } else if (err.message.includes("Network Error") || err.message.includes("No response")) {
//         errorMessage = "Network error. Please check your connection.";
//       } else {
//         errorMessage = err.message || errorMessage;
//       }

//       setError(errorMessage);
//       toast.error(errorMessage);

//       // Set fallback empty state
//       setApproverStatus({ 
//         total_tickets: 0,
//         pending: 0, 
//         approved: 0, 
//         on_hold: 0, 
//         reassigned: 0, 
//         rejected: 0, 
//         sla_breached_count: 0,
//         pending_tickets: [],
//         approved_tickets: [],
//         on_hold_tickets: [],
//         reassigned_tickets: [],
//         rejected_tickets: [],
//         sla_breached_tickets: []
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch approver data on mount
//   useEffect(() => {
//     loadApproverData();
//   }, [propApproverStatus]);

//   // Set tickets from approverStatus
//   useEffect(() => {
//     if (approverStatus) {
//       console.log('Setting tickets from approverStatus:', approverStatus);
//       setTickets({
//         pending: approverStatus.pending_tickets || [],
//         approved: approverStatus.approved_tickets || [],
//         hold: approverStatus.on_hold_tickets || [],
//         reassigned: approverStatus.reassigned_tickets || [],
//         rejected: approverStatus.rejected_tickets || [],
//         sla: approverStatus.sla_breached_tickets || []
//       });
//     }
//   }, [approverStatus]);

//   // Calculate counts from ticket arrays if not directly provided
//   const getCount = (type) => {
//     if (approverStatus?.[type] !== undefined) {
//       return approverStatus[type];
//     }

//     const ticketArray = tickets[type] || [];
//     return ticketArray.length;
//   };

//   const statusCards = [
//     { id: "pending", label: "PENDING", color: "warning.main", icon: <ErrorIcon />, count: getCount("pending") },
//     { id: "approved", label: "APPROVED", color: "success.main", icon: <CheckCircleIcon />, count: getCount("approved") },
//     { id: "hold", label: "ON HOLD", color: "info.main", icon: <PauseCircleIcon />, count: getCount("on_hold") },
//     { id: "reassigned", label: "REASSIGNED", color: "warning.main", icon: <UpdateIcon />, count: getCount("reassigned") },
//     { id: "rejected", label: "REJECTED", color: "error.main", icon: <CancelIcon />, count: getCount("rejected") },
//     { id: "sla", label: "SLA BREACHED", color: "warning.main", icon: <AccessTimeFilledIcon />, count: getCount("sla_breached_count") },
//   ];

//   const ApproverTabelCol = [
//     { id: 1, title: <>Ticket ID</> },
//     { id: 2, title: <>Title</> },
//     { id: 3, title: <>Description</> },
//     { id: 4, title: <>Status<br />Priority</> },
//     { id: 5, title: <>Category<br />Subcategory</> },
//     { id: 6, title: <>Department<br />Location</> },
//     { id: 7, title: <>Assigned To</> }, // Changed from Requested By to Assigned To
//     { id: 8, title: <>Requested By</> }, // Added new column for requester
//     { id: 9, title: <>Open Date<br />Last Update</> },
//     { id: 10, title: <>Action</> },
//   ];

//   const selectedTickets = tickets[selectedType] || [];

//   const departmentList = useMemo(
//     () => [...new Set(selectedTickets.map((row) => row.department_detail?.field_name).filter(Boolean))],
//     [selectedTickets]
//   );

//   const headingMap = {
//     pending: "PENDING Tickets (APPROVER)",
//     approved: "APPROVED Tickets (APPROVER)",
//     hold: "ON HOLD Tickets (APPROVER)",
//     reassigned: "REASSIGNED Tickets (APPROVER)",
//     rejected: "REJECTED Tickets (APPROVER)",
//     sla: "SLA BREACHED Tickets (APPROVER)",
//   };

//   const filteredRows = useMemo(() => {
//     if (!Array.isArray(selectedTickets)) {
//       return [];
//     }

//     return selectedTickets.filter((row) => {
//       if (!row) return false;

//       // Create search string from relevant fields including assignees
//       const assigneesInfo = formatAssignees(row);
//       const assigneesSearchStr = [
//         ...assigneesInfo.users,
//         ...assigneesInfo.groups
//       ].join(" ").toLowerCase();

//       const searchStr = [
//         row.ticket_no?.toString(),
//         row.title,
//         row.description,
//         row.status_detail?.field_name,
//         row.priority_detail?.field_name,
//         row.category_detail?.category_name,
//         row.subcategory_detail?.subcategory_name,
//         row.department_detail?.field_name,
//         row.location_detail?.field_name,
//         row.requested_detail?.email,
//         assigneesSearchStr
//       ]
//         .filter(val => val !== null && val !== undefined)
//         .join(" ")
//         .toLowerCase();

//       const matchesSearch = search ? searchStr.includes(search.toLowerCase()) : true;
//       const matchesDept = department ? row.department_detail?.field_name === department : true;

//       return matchesSearch && matchesDept;
//     });
//   }, [selectedTickets, search, department]);

//   // Get initials for avatar
//   const getInitials = (name) => {
//     if (!name || name === "You") return "U";
//     return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
//   };

//   // Group chats by date
//   const groupedChats = useMemo(() => {
//     const groups = {};
//     followUpChats.forEach(msg => {
//       const date = new Date(msg.createdon).toLocaleDateString();
//       if (!groups[date]) {
//         groups[date] = [];
//       }
//       groups[date].push(msg);
//     });
//     return Object.entries(groups)
//       .map(([date, messages]) => ({
//         date,
//         messages: messages.sort((a, b) => new Date(a.createdon) - new Date(b.createdon))
//       }))
//       .sort((a, b) => new Date(a.date) - new Date(b.date));
//   }, [followUpChats]);

//   const handleCardClick = (type) => {
//     setSelectedType(type);
//     setSearch("");
//     setDepartment("");
//     setPage(0);
//   };

//   const clearFilters = () => {
//     setSearch("");
//     setDepartment("");
//     setPage(0);
//   };

//   const handleTicketClick = (ticketNo) => {
//     console.log('Storing ticket No:', ticketNo);
//     localStorage.setItem('selectedTicketId', ticketNo);
//     console.log('Navigating to Approval');
//     navigate('/Approval');
//   };

//   // Fetch all messages and filter by ticket_no and between current user and requester
//   const fetchTicketMessages = async (ticketNo, currentUserId, requesterId) => {
//     try {
//       const allMessages = await fetchMessages();
//       const filteredMessages = allMessages.filter((msg) =>
//         msg.ticket_no == ticketNo &&
//         ((msg.sender === currentUserId && msg.receiver === requesterId) ||
//           (msg.sender === requesterId && msg.receiver === currentUserId))
//       );
//       return filteredMessages || [];
//     } catch (err) {
//       console.error("Error loading ticket messages:", err);
//       toast.error("Failed to load messages");
//       return [];
//     }
//   };

//   const sendFollowUpMessageHandler = async (messageText) => {
//     if (!messageText.trim()) {
//       toast.error("Message cannot be empty");
//       return;
//     }

//     if (!currentChatTicket?.id) {
//       toast.error("No ticket selected");
//       return;
//     }

//     if (!requester?.id) {
//       toast.error("Requester not loaded");
//       return;
//     }

//     if (!currentUserId) {
//       toast.error("User not authenticated");
//       return;
//     }

//     const receiverId = requester.id;
//     setSendingFollowUpMessage(true);
//     try {
//       const payload = {
//         sender: currentUserId,
//         receiver: receiverId,
//         ticket_no: currentChatTicket.id,
//         message: messageText.trim(),
//       };
//       const resData = await sendMessage(payload);
//       const newMessage = {
//         ...resData,
//         sender: currentUserId,
//         createdon: new Date().toISOString(),
//       };

//       const updatedChats = [...followUpChats, newMessage].sort((a, b) => new Date(a.createdon) - new Date(b.createdon));
//       setFollowUpChats(updatedChats);
//       setNewFollowUpMessage("");

//       toast.success("Message sent successfully!");
//     } catch (err) {
//       toast.error("Failed to send message");
//       console.error("Error sending message:", err);
//     } finally {
//       setSendingFollowUpMessage(false);
//     }
//   };

//   const handleChatDrawerOpen = async (ticketNo) => {
//     if (!ticketNo || !currentUserId) {
//       toast.error("No ticket or user ID provided");
//       return;
//     }

//     const ticket = selectedTickets.find(t => t.ticket_no == ticketNo);
//     if (!ticket) {
//       toast.error("Ticket not found in current list");
//       return;
//     }

//     setLoadingFollowUpChats(true);
//     setShowFollowUpChat(true);
//     setFollowUpChats([]);

//     try {
//       // Fetch ticket details to get requester details
//       const ticketDetails = await getTicketDetails(ticketNo);
//       const ticketData = ticketDetails.ticket || ticketDetails;

//       // Get requester details
//       const requesterDetail = ticketData.requested_detail || ticket.requested_detail;
//       if (!requesterDetail?.id) {
//         throw new Error("Requester details not found");
//       }

//       setRequester(requesterDetail);

//       // Set ticket details
//       setCurrentChatTicket({
//         id: ticketNo,
//         title: ticketData.title || ticket.title || "",
//       });

//       const requesterId = requesterDetail.id;

//       // Fetch messages based on ticket_no and between current user and requester
//       const ticketMessages = await fetchTicketMessages(ticketNo, currentUserId, requesterId);

//       const sortedTicketMessages = ticketMessages.sort((a, b) =>
//         new Date(a.createdon) - new Date(b.createdon)
//       );

//       setFollowUpChats(sortedTicketMessages);
//     } catch (err) {
//       console.error("Error fetching ticket details or chats:", err);
//       toast.error("Failed to fetch ticket details or chats");
//       setShowFollowUpChat(false);
//     } finally {
//       setLoadingFollowUpChats(false);
//     }
//   };

//   const handleChatDrawerClose = () => {
//     setShowFollowUpChat(false);
//     setCurrentChatTicket(null);
//     setRequester(null);
//     setFollowUpChats([]);
//     setLoadingFollowUpChats(false);
//   };

//   // Render assigned users and groups with avatars
//   const renderAssignees = (ticket) => {
//     const assigneesInfo = formatAssignees(ticket);

//     if (!assigneesInfo.hasUsers && !assigneesInfo.hasGroups) {
//       return (
//         <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
//           Not assigned
//         </Typography>
//       );
//     }

//     const users = ticket.assigned_users || [];
//     const groups = ticket.assigned_groups || [];

//     return (
//       <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
//         {/* Users */}
//         {users.length > 0 && (
//           <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
//             <PersonIcon fontSize="small" color="primary" />
//             <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 24, height: 24, fontSize: '0.75rem' } }}>
//               {users.slice(0, 3).map((user, index) => (
//                 <Tooltip 
//                   key={index} 
//                   title={`${user.name}${user.email ? ` (${user.email})` : ''}`}
//                 >
//                   <Avatar sx={{ bgcolor: 'primary.main', color: 'white' }}>
//                     {getUserInitials(user)}
//                   </Avatar>
//                 </Tooltip>
//               ))}
//             </AvatarGroup>
//             {users.length > 3 && (
//               <Typography variant="caption" color="text.secondary">
//                 +{users.length - 3} more
//               </Typography>
//             )}
//           </Box>
//         )}

//         {/* Groups */}
//         {groups.length > 0 && (
//           <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
//             <PeopleIcon fontSize="small" color="secondary" />
//             <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 24, height: 24, fontSize: '0.75rem' } }}>
//               {groups.slice(0, 3).map((group, index) => (
//                 <Tooltip key={index} title={group.name}>
//                   <Avatar sx={{ bgcolor: 'secondary.main', color: 'white' }}>
//                     {getGroupInitials(group)}
//                   </Avatar>
//                 </Tooltip>
//               ))}
//             </AvatarGroup>
//             {groups.length > 3 && (
//               <Typography variant="caption" color="text.secondary">
//                 +{groups.length - 3} more
//               </Typography>
//             )}
//           </Box>
//         )}

//         {/* Text summary */}
//         <Tooltip title={assigneesInfo.displayText}>
//           <Typography 
//             variant="body2" 
//             sx={{ 
//               cursor: 'default',
//               overflow: 'hidden',
//               textOverflow: 'ellipsis',
//               display: '-webkit-box',
//               WebkitLineClamp: 2,
//               WebkitBoxOrient: 'vertical',
//             }}
//           >
//             {assigneesInfo.displayText}
//           </Typography>
//         </Tooltip>
//       </Box>
//     );
//   };

//   // Show error if exists
//   if (error && !loading) {
//     return (
//       <Box sx={{ width: "100%" }}>
//         <Alert 
//           severity="error" 
//           sx={{ mb: 2 }}
//           action={
//             <Button 
//               color="inherit" 
//               size="small"
//               onClick={loadApproverData}
//             >
//               Retry
//             </Button>
//           }
//         >
//           {error}
//         </Alert>
//         <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 400 }}>
//           <Typography color="error">
//             Unable to load approver dashboard. Please try again.
//           </Typography>
//         </Box>
//       </Box>
//     );
//   }

//   // Show loading spinner while fetching
//   if (loading) {
//     return (
//       <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 400 }}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   return (
//     <>
//       <Box sx={{ width: "100%" }}>
//         <Card>
//           <CardContent>
//             <Typography
//               textAlign="center"
//               variant={isMobile ? "h6" : "h5"}
//               fontWeight={700}
//               sx={{ mb: 3 }}
//             >
//               APPROVER DASHBOARD
//             </Typography>

//             <Grid container spacing={2}>
//               {statusCards.map((item) => (
//                 <Grid item xs={6} sm={4} md={2} key={item.id}>
//                   <Card
//                     onClick={() => handleCardClick(item.id)}
//                     sx={{
//                       borderRadius: 10,
//                       height: isMobile ? "90px" : "85px",
//                       boxShadow: selectedType === item.id ? "0px 4px 12px rgba(102,126,234,0.6)" : "0px 4px 10px rgba(0,0,0,0.1)",
//                       border: selectedType === item.id ? "2px solid #667eea" : "2px solid transparent",
//                       p: isMobile ? 0 : 1,
//                       transition: "0.3s",
//                       cursor: "pointer",
//                       "&:hover": {
//                         background: "linear-gradient(135deg, #667eea, #764ba2)",
//                         transform: "translateY(-4px)",
//                         color: "#fff",
//                         "& .MuiTypography-root": {
//                           color: "#fff !important",
//                         }
//                       },
//                     }}
//                   >
//                     <CardContent
//                       sx={{
//                         display: "flex",
//                         alignItems: "center",
//                         gap: isMobile ? 2 : 4,
//                       }}
//                     >
//                       <Box
//                         sx={{
//                           width: 45,
//                           height: 45,
//                           borderRadius: "50%",
//                           backgroundColor: item.color,
//                           color: "#fff",
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "center",
//                           fontSize: 22,
//                         }}
//                       >
//                         {item.icon}
//                       </Box>
//                       <Box>
//                         <Typography variant={isMobile ? "h6" : "h5"} fontWeight={600}>
//                           {item.count}
//                         </Typography>
//                         <Typography
//                           variant="subtitle1"
//                           fontWeight={600}
//                           sx={{ color: "text.secondary", fontSize: isMobile ? 11 : 14 }}
//                         >
//                           {item.label}
//                         </Typography>
//                       </Box>
//                     </CardContent>
//                   </Card>
//                 </Grid>
//               ))}
//             </Grid>

//             {selectedType && (
//               <Box>
//                 <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 5, flexWrap: 'wrap', gap: 2 }}>
//                   <Typography variant="h6" fontWeight={700}>
//                     {headingMap[selectedType] || "Tickets"} 
//                     {filteredRows.length > 0 && ` (${filteredRows.length})`}
//                   </Typography>
//                   <Box
//                     sx={{
//                       display: "flex",
//                       flexDirection: isMobile ? "column" : "row",
//                       justifyContent: "flex-end",
//                       gap: 2,
//                     }}
//                   >
//                     <Autocomplete
//                       options={departmentList}
//                       value={department}
//                       onChange={(e, newValue) => setDepartment(newValue)}
//                       renderInput={(params) => <TextField {...params} label="Department" size="small" />}
//                       sx={{
//                         width: isMobile ? '100%' : 200,
//                         "& .MuiOutlinedInput-root": {
//                           borderRadius: 3,
//                         }
//                       }}
//                       disabled={departmentList.length === 0}
//                     />
//                     <TextField
//                       size="small"
//                       label="Search"
//                       value={search}
//                       onChange={(e) => setSearch(e.target.value)}
//                       sx={{
//                         width: isMobile ? '100%' : 200,
//                         "& .MuiOutlinedInput-root": {
//                           borderRadius: 3,
//                         }
//                       }}
//                     />
//                     <Button variant="outlined" fullWidth={isMobile} onClick={clearFilters} sx={{ borderRadius: 3 }}>
//                       Clear
//                     </Button>
//                   </Box>
//                 </Box>

//                 <Card sx={{ borderRadius: 6, mt: 5, overflow: 'hidden' }}>
//                   <TableContainer sx={{ maxHeight: 500, overflowX: "auto" }}>
//                     <Table stickyHeader>
//                       <TableHead>
//                         <TableRow>
//                           {ApproverTabelCol.map((col) => (
//                             <TableCell key={col.id} sx={{ 
//                               fontWeight: 700, 
//                               whiteSpace: "nowrap",
//                               backgroundColor: theme.palette.grey[100]
//                             }}>
//                               {col.title}
//                             </TableCell>
//                           ))}
//                         </TableRow>
//                       </TableHead>
//                       <TableBody>
//                         {filteredRows.length > 0 ? (
//                           filteredRows
//                             .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//                             .map((t, index) => (
//                               <TableRow key={t.id || index} hover>
//                                 <TableCell sx={{ color: "#667eea", fontWeight: 600 }}>
//                                   #{t.ticket_no || t.id || '-'}
//                                 </TableCell>
//                                 <TableCell sx={{ color: "#2D3748", fontWeight: 500, maxWidth: 200 }}>
//                                   {t.title || '-'}
//                                 </TableCell>
//                                 <TableCell sx={{ maxWidth: 250 }}>
//                                   <Tooltip
//                                     title={t.description || "No description"}
//                                     arrow
//                                     placement="top"
//                                   >
//                                     <Typography
//                                       sx={{
//                                         whiteSpace: "nowrap",
//                                         overflow: "hidden",
//                                         textOverflow: "ellipsis",
//                                         cursor: "pointer",
//                                         color: "#4A5568"
//                                       }}
//                                     >
//                                       {t.description || "-"}
//                                     </Typography>
//                                   </Tooltip>
//                                 </TableCell>
//                                 <TableCell>
//                                   <Typography fontWeight={500} color="#2D3748">
//                                     {t.status_detail?.field_name || t.status || "-"}
//                                   </Typography>
//                                   <Typography fontSize="0.85rem" color="#718096">
//                                     {t.priority_detail?.field_name || t.priority || "-"}
//                                   </Typography>
//                                 </TableCell>
//                                 <TableCell>
//                                   <Tooltip
//                                     arrow
//                                     placement="top"
//                                     title={
//                                       <Box>
//                                         <div><strong>Category:</strong> {t.category_detail?.category_name || "-"}</div>
//                                         <div><strong>Subcategory:</strong> {t.subcategory_detail?.subcategory_name || "-"}</div>
//                                       </Box>
//                                     }
//                                   >
//                                     <Box sx={{ cursor: "pointer" }}>
//                                       <Typography fontWeight={500} color="#2D3748">
//                                         {t.category_detail?.category_name || "-"}
//                                       </Typography>
//                                       <Typography fontSize="0.85rem" color="#718096">
//                                         {t.subcategory_detail?.subcategory_name || "-"}
//                                       </Typography>
//                                     </Box>
//                                   </Tooltip>
//                                 </TableCell>
//                                 <TableCell>
//                                   <Typography fontWeight={500} color="#2D3748">
//                                     {t.department_detail?.field_name || "-"}
//                                   </Typography>
//                                   <Typography fontSize="0.85rem" color="#718096">
//                                     {t.location_detail?.field_name || "-"}
//                                   </Typography>
//                                 </TableCell>
//                                 <TableCell sx={{ maxWidth: 200 }}>
//                                   {renderAssignees(t)}
//                                 </TableCell>
//                                 <TableCell sx={{ color: "#4A5568", maxWidth: 150 }}>
//                                   <Tooltip title={t.requested_detail?.email || t.requested_by || "-"}>
//                                     <Typography 
//                                       sx={{
//                                         overflow: 'hidden',
//                                         textOverflow: 'ellipsis',
//                                         whiteSpace: 'nowrap'
//                                       }}
//                                     >
//                                       {t.requested_detail?.name || t.requested_detail?.email || t.requested_by || "-"}
//                                     </Typography>
//                                   </Tooltip>
//                                 </TableCell>
//                                 <TableCell>
//                                   <Typography fontSize="0.9rem" color="#2D3748">
//                                     {t.created_date ? new Date(t.created_date).toLocaleDateString() : "-"}
//                                   </Typography>
//                                   <Typography fontSize="0.8rem" color="#718096">
//                                     {t.updated_date ? new Date(t.updated_date).toLocaleDateString() : "-"}
//                                   </Typography>
//                                 </TableCell>
//                                 <TableCell>
//                                   <Box sx={{ display: "flex", gap: 1 }}>
//                                     <Tooltip title="Follow-up Chat">
//                                       <IconButton
//                                         onClick={() => handleChatDrawerOpen(t.ticket_no)}
//                                         sx={{ color: "#667eea" }}
//                                         size="small"
//                                       >
//                                         <ChatIcon fontSize="small" />
//                                       </IconButton>
//                                     </Tooltip>
//                                     <Tooltip title="View Details">
//                                       <IconButton
//                                         onClick={() => handleTicketClick(t.ticket_no)}
//                                         sx={{ color: "#667eea" }}
//                                         size="small"
//                                       >
//                                         <VisibilityIcon fontSize="small" />
//                                       </IconButton>
//                                     </Tooltip>
//                                   </Box>
//                                 </TableCell>
//                               </TableRow>
//                             ))
//                         ) : (
//                           <TableRow>
//                             <TableCell colSpan={10} align="center" sx={{ py: 4, color: "#718096" }}>
//                               {selectedTickets.length === 0 
//                                 ? `No ${selectedType} tickets available.` 
//                                 : "No tickets found matching your search criteria."}
//                             </TableCell>
//                           </TableRow>
//                         )}
//                       </TableBody>
//                     </Table>
//                   </TableContainer>

//                   {filteredRows.length > rowsPerPage && (
//                     <Stack direction="row" justifyContent="end" sx={{ py: 2, px: 2 }}>
//                       <Pagination
//                         count={Math.ceil(filteredRows.length / rowsPerPage)}
//                         page={page + 1}
//                         onChange={(e, value) => setPage(value - 1)}
//                         variant="outlined"
//                         shape="rounded"
//                         showFirstButton={false}
//                         showLastButton={false}
//                         siblingCount={0}
//                         boundaryCount={1}
//                         sx={{
//                           "& .MuiPaginationItem-root": {
//                             borderRadius: "20px",
//                             minWidth: 40,
//                             height: 40,
//                           },
//                         }}
//                       />
//                     </Stack>
//                   )}
//                 </Card>
//               </Box>
//             )}
//           </CardContent>
//         </Card>
//       </Box>

//       {/* Chat Drawer */}
//       <Drawer
//         anchor="right"
//         open={showFollowUpChat}
//         onClose={handleChatDrawerClose}
//         PaperProps={{ sx: { width: { xs: "100%", sm: 500 } } }}
//       >
//         <Box sx={{
//           display: "flex",
//           flexDirection: "column",
//           height: "100%",
//           bgcolor: "background.paper"
//         }}>
//           {/* Header */}
//           <Box sx={{
//             p: 2,
//             borderBottom: 1,
//             borderColor: "divider",
//             bgcolor: "primary.main",
//             color: "white"
//           }}>
//             <Typography variant="h6">
//               <ChatIcon sx={{ mr: 1, verticalAlign: "middle" }} />
//               Chat with {requester?.name || "Requester"}
//             </Typography>
//             <Typography variant="caption" sx={{ color: "white" }}>
//               Ticket #{currentChatTicket?.id}
//             </Typography>
//           </Box>

//           {/* Messages Area */}
//           <Box sx={{
//             flex: 1,
//             overflowY: "auto",
//             p: 2,
//             display: "flex",
//             flexDirection: "column",
//             gap: 2
//           }}>
//             {loadingFollowUpChats ? (
//               <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
//                 <CircularProgress />
//               </Box>
//             ) : groupedChats.length === 0 ? (
//               <Box sx={{
//                 display: "flex",
//                 flexDirection: "column",
//                 justifyContent: "center",
//                 alignItems: "center",
//                 height: "100%",
//                 color: "text.secondary"
//               }}>
//                 <ChatIcon sx={{ fontSize: 60, mb: 2, opacity: 0.5 }} />
//                 <Typography>No messages yet. Start the conversation!</Typography>
//               </Box>
//             ) : (
//               groupedChats.map((group, groupIndex) => (
//                 <Box key={group.date} sx={{ mb: 3 }}>
//                   <Divider sx={{ my: 2, width: "100%" }}>
//                     <Chip
//                       label={group.date}
//                       size="small"
//                       sx={{ bgcolor: "grey.200" }}
//                     />
//                   </Divider>

//                   {group.messages.map((msg, index) => {
//                     const isFromCurrentUser = msg.sender === currentUserId;

//                     return (
//                       <Box
//                         key={msg.id || index}
//                         sx={{
//                           display: "flex",
//                           justifyContent: isFromCurrentUser ? "flex-end" : "flex-start",
//                           mb: 2
//                         }}
//                       >
//                         {!isFromCurrentUser ? (
//                           <Box sx={{ display: "flex", alignItems: "flex-end", gap: 1 }}>
//                             <Avatar sx={{ width: 40, height: 40, bgcolor: "grey.300" }}>
//                               {getInitials(requester?.name)}
//                             </Avatar>
//                             <Box
//                               sx={{
//                                 maxWidth: "80%",
//                                 p: 2,
//                                 bgcolor: "grey.100",
//                                 color: "text.primary",
//                                 borderRadius: 2,
//                                 borderTopLeftRadius: 4,
//                                 borderTopRightRadius: 12,
//                                 borderBottomLeftRadius: 4,
//                                 borderBottomRightRadius: 12,
//                                 boxShadow: 1,
//                               }}
//                             >
//                               <Typography variant="body1" sx={{ wordBreak: "break-word" }}>
//                                 {msg.message}
//                               </Typography>

//                               <Box sx={{
//                                 display: "flex",
//                                 justifyContent: "space-between",
//                                 alignItems: "center",
//                                 mt: 1
//                               }}>
//                                 <Typography
//                                   variant="caption"
//                                   sx={{
//                                     color: "text.secondary",
//                                     fontSize: "0.7rem"
//                                   }}
//                                 >
//                                   {msg.createdon ? new Date(msg.createdon).toLocaleTimeString([], {
//                                     hour: '2-digit',
//                                     minute: '2-digit',
//                                     hour12: true
//                                   }) : ""}
//                                 </Typography>
//                                 <Typography
//                                   variant="caption"
//                                   sx={{
//                                     ml: 1,
//                                     color: "text.primary",
//                                     fontSize: "0.75rem",
//                                     fontWeight: "bold"
//                                   }}
//                                 >
//                                   {requester?.name || "Requester"}
//                                 </Typography>
//                               </Box>
//                             </Box>
//                           </Box>
//                         ) : (
//                           <Box sx={{ display: "flex", alignItems: "flex-end", gap: 1, flexDirection: "row-reverse" }}>
//                             <Box
//                               sx={{
//                                 maxWidth: "80%",
//                                 p: 2,
//                                 bgcolor: "primary.main",
//                                 color: "white",
//                                 borderRadius: 2,
//                                 borderTopLeftRadius: 12,
//                                 borderTopRightRadius: 4,
//                                 borderBottomLeftRadius: 12,
//                                 borderBottomRightRadius: 4,
//                                 boxShadow: 1,
//                               }}
//                             >
//                               <Typography variant="body1" sx={{ wordBreak: "break-word" }}>
//                                 {msg.message}
//                               </Typography>

//                               <Box sx={{
//                                 display: "flex",
//                                 justifyContent: "space-between",
//                                 alignItems: "center",
//                                 mt: 1
//                               }}>
//                                 <Typography
//                                   variant="caption"
//                                   sx={{
//                                     color: "rgba(255,255,255,0.8)",
//                                     fontSize: "0.7rem"
//                                   }}
//                                 >
//                                   {msg.createdon ? new Date(msg.createdon).toLocaleTimeString([], {
//                                     hour: '2-digit',
//                                     minute: '2-digit',
//                                     hour12: true
//                                   }) : ""}
//                                 </Typography>
//                                 <Typography
//                                   variant="caption"
//                                   sx={{
//                                     mr: 1,
//                                     color: "white",
//                                     fontSize: "0.75rem",
//                                     fontWeight: "bold"
//                                   }}
//                                 >
//                                   You
//                                 </Typography>
//                               </Box>
//                             </Box>
//                             <Avatar sx={{ width: 40, height: 40, bgcolor: "primary.main", color: "white" }}>
//                               {getInitials(currentUserName)}
//                             </Avatar>
//                           </Box>
//                         )}
//                       </Box>
//                     );
//                   })}
//                 </Box>
//               ))
//             )}
//           </Box>

//           {/* Message Input */}
//           <Box sx={{
//             p: 2,
//             borderTop: 1,
//             borderColor: "divider",
//             bgcolor: "background.default"
//           }}>
//             <Box sx={{ display: "flex", gap: 1 }}>
//               <TextField
//                 fullWidth
//                 size="medium"
//                 placeholder="Type your message..."
//                 value={newFollowUpMessage}
//                 onChange={e => setNewFollowUpMessage(e.target.value)}
//                 disabled={sendingFollowUpMessage || !requester}
//                 onKeyPress={(e) => {
//                   if (e.key === 'Enter' && !e.shiftKey) {
//                     e.preventDefault();
//                     sendFollowUpMessageHandler(newFollowUpMessage);
//                   }
//                 }}
//                 multiline
//                 maxRows={4}
//               />
//               <IconButton
//                 onClick={() => sendFollowUpMessageHandler(newFollowUpMessage)}
//                 disabled={!newFollowUpMessage.trim() || sendingFollowUpMessage || !requester}
//                 color="primary"
//                 sx={{ alignSelf: "flex-end", height: 40, width: 40 }}
//               >
//                 {sendingFollowUpMessage ? <CircularProgress size={20} /> : <SendIcon />}
//               </IconButton>
//             </Box>
//           </Box>
//         </Box>
//       </Drawer>
//     </>
//   );
// };

// export default ApproverTabs;

import { useEffect, useMemo, useState } from "react";
import { useTheme } from "@mui/material/styles";
import { Box, Card, CardContent, Typography, Grid, TextField, Button, Table, TableHead, TableRow, TableCell, TableBody, TableContainer, useMediaQuery, Autocomplete, Stack, Pagination, Tooltip, CircularProgress, IconButton, Drawer, Divider, Chip, Avatar, Alert, Tabs, Tab, Icon } from "@mui/material";
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ChatIcon from '@mui/icons-material/Chat';
import SendIcon from '@mui/icons-material/Send';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { fetchApproverTickets, fetchMessages, sendMessage, getTicketDetails, updateTicket, } from "../../Api";

const ApproverTabs = ({ approverStatus: propUserStatus }) => {

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [selectedType, setSelectedType] = useState("new_assigned");
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [tickets, setTickets] = useState({
    new_assigned: [],
    solved: [],
    closed: []
  });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const [userStatus, setUserStatus] = useState(null);
  const [error, setError] = useState(null);

  const [solvedStatusId, setSolvedStatusId] = useState(null);
  const [loadingStatusId, setLoadingStatusId] = useState(true);

  // Chat/follow-up states
  const [showFollowUpChat, setShowFollowUpChat] = useState(false);
  const [followUpChats, setFollowUpChats] = useState([]);
  const [loadingFollowUpChats, setLoadingFollowUpChats] = useState(false);
  const [newFollowUpMessage, setNewFollowUpMessage] = useState("");
  const [sendingFollowUpMessage, setSendingFollowUpMessage] = useState(false);
  const [currentChatTicket, setCurrentChatTicket] = useState(null);
  const [chatRecipient, setChatRecipient] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUserName, setCurrentUserName] = useState("You");

  // NEW: Store full ticket data for updates
  const [currentTicketData, setCurrentTicketData] = useState(null);

  // Tab state for chat drawer
  const [chatTab, setChatTab] = useState(0); // 0: Follow-up (Chat), 1: Solution

  const navigate = useNavigate();

  // Get current user ID and name on component mount
  useEffect(() => {
    const userDataString = localStorage.getItem("user");
    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString);
        setCurrentUserId(userData?.id || null);
        setCurrentUserName(userData?.name || userData?.username || "You");
      } catch (err) {
        console.error("Error parsing user data:", err);
        setCurrentUserId(null);
        setCurrentUserName("You");
      }
    } else {
      const userId = localStorage.getItem("current_user_id") || null;
      setCurrentUserId(userId ? parseInt(userId) : null);
      setCurrentUserName("You");
    }
  }, []);

  //   useEffect(() => {
  //     const fetchSolvedStatusConfig = async () => {
  //       try {
  //         setLoadingStatusId(true);
  //         const configData = await fetchConfigurations({ field_type: 'Status' });  // Assume API fetches statuses: GET /api/configurations/?field_type=Status
  //         if (configData && configData.success) {
  //           const solvedStatus = configData.data.find(status => status.field_name === 'Solved');
  //           if (solvedStatus && solvedStatus.id) {
  //             setSolvedStatusId(solvedStatus.id);
  //           } else {
  //             toast.error("Solved status not found in configuration");
  //             setSolvedStatusId(null);  // Or fallback to hardcoded if needed
  //           }
  //         } else {
  //           toast.error("Failed to load status configurations");
  //           setSolvedStatusId(null);
  //         }
  //       } catch (err) {
  //         console.error("Error fetching Solved status configuration:", err);
  //         toast.error("Failed to load status configurations");
  //         setSolvedStatusId(null);
  //       } finally {
  //         setLoadingStatusId(false);
  //       }
  //     };

  //     fetchSolvedStatusConfig();
  //   }, []);

  // Helper function to get display status (map "New" to "Pending")
  const getDisplayStatus = (status) => {
    if (status === "New") {
      return "Pending";
    }
    return status;
  };

  // Helper function to format assigned users and groups for display
  const formatAssignees = (ticket) => {
    if (!ticket) return { users: [], groups: [], displayText: "" };

    const users = ticket.assigned_users || [];
    const groups = ticket.assigned_groups || [];

    // Format user names
    const userNames = users.map(user => {
      if (user.is_unknown || !user.id) {
        // If user has no ID, show email or name
        return user.email || user.name || "Unknown User";
      }
      return user.name || user.full_name || user.email || "User";
    });

    // Format group names
    const groupNames = groups.map(group => {
      if (group.is_unknown || !group.id) {
        return group.name || "Unknown Group";
      }
      return group.name || "Group";
    });

    // Create display text
    let displayText = "";
    if (userNames.length > 0 && groupNames.length > 0) {
      displayText = `${userNames.join(', ')} & ${groupNames.join(', ')}`;
    } else if (userNames.length > 0) {
      displayText = userNames.join(', ');
    } else if (groupNames.length > 0) {
      displayText = groupNames.join(', ');
    } else {
      displayText = "Not assigned";
    }

    return {
      users: userNames,
      groups: groupNames,
      displayText,
      hasUsers: userNames.length > 0,
      hasGroups: groupNames.length > 0,
      userCount: userNames.length,
      groupCount: groupNames.length
    };
  };

  // Get user initials for avatar
  const getUserInitials = (user) => {
    if (!user) return "?";

    if (user.name && user.name !== "Unknown User") {
      return user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    }

    if (user.email && user.email !== "unknown@example.com") {
      const namePart = user.email.split('@')[0];
      return namePart.substring(0, 2).toUpperCase();
    }

    return "?";
  };

  // Process tickets function
  const processTickets = (ticketList) => {
    if (!Array.isArray(ticketList)) return [];
    return ticketList.map(ticket => ({
      ...ticket,
      assigned_users: Array.isArray(ticket.assigned_users)
        ? ticket.assigned_users.map(user => ({
          id: user.id || null,
          name: user.name || user.full_name || user.email || "Unknown User",
          email: user.email || "unknown@example.com",
          full_name: user.full_name || user.name || user.email || "Unknown User",
          is_unknown: !user.id
        }))
        : [],
      assigned_groups: Array.isArray(ticket.assigned_groups)
        ? ticket.assigned_groups.map(group => ({
          id: group.id || null,
          name: group.name || "Unknown Group",
          description: group.description || "",
          is_unknown: !group.id
        }))
        : []
    }));
  };

  // Load data function
  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("propUserStatus :", propUserStatus);

      if (propUserStatus) {
        let processedStatus = propUserStatus;
        if (propUserStatus.user_stats) {
          // Handle user_stats structure
          const stats = propUserStatus.user_stats;
          const processedNewTickets = processTickets(stats.new_assigned_tickets || []);
          const processedSolvedTickets = processTickets(stats.solved_tickets || []);
          const processedClosedTickets = processTickets(stats.closed_tickets || []);
          processedStatus = {
            new_assigned: stats.new_assigned || 0,
            solved: stats.solved || 0,
            closed: stats.closed || 0,
            new_assigned_tickets: processedNewTickets,
            solved_tickets: processedSolvedTickets,
            closed_tickets: processedClosedTickets
          };
        }
        setUserStatus(processedStatus);
      } else {
        console.log('Fetching tickets...');

        // Check authentication first
        const token = localStorage.getItem("access_token");
        if (!token) {
          throw new Error("No authentication token found. Please login again.");
        }

        const data = await fetchApproverTickets();
        console.log('Tickets data received:', data);

        if (data && data.success) {
          let processedStats;
          if (data.user_stats) {
            // Handle user_stats structure
            const stats = data.user_stats;
            const processedNewTickets = processTickets(stats.new_assigned_tickets || []);
            const processedSolvedTickets = processTickets(stats.solved_tickets || []);
            const processedClosedTickets = processTickets(stats.closed_tickets || []);
            processedStats = {
              new_assigned: stats.new_assigned || 0,
              solved: stats.solved || 0,
              closed: stats.closed || 0,
              new_assigned_tickets: processedNewTickets,
              solved_tickets: processedSolvedTickets,
              closed_tickets: processedClosedTickets
            };
          } else {
            throw new Error("Invalid response format from server");
          }
          setUserStatus(processedStats);
        } else {
          throw new Error("Invalid response format from server");
        }
      }
    } catch (err) {
      console.error("Error fetching tickets:", err);
      // More specific error messages
      let errorMessage = "Failed to load dashboard";
      if (err.message.includes("401") || err.message.includes("Unauthorized")) {
        errorMessage = "Authentication failed. Please login again.";
      } else if (err.message.includes("404")) {
        errorMessage = "Endpoint not found. Please check the API URL.";
      } else if (err.message.includes("Network Error") || err.message.includes("No response")) {
        errorMessage = "Network error. Please check your connection.";
      } else {
        errorMessage = err.message || errorMessage;
      }

      setError(errorMessage);
      toast.error(errorMessage);

      // Set fallback empty state
      setUserStatus({
        new_assigned: 0,
        solved: 0,
        closed: 0,
        new_assigned_tickets: [],
        solved_tickets: [],
        closed_tickets: []
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on mount
  useEffect(() => {
    loadData();
  }, [propUserStatus]);

  // Set tickets from userStatus
  useEffect(() => {
    if (userStatus) {
      console.log('Setting tickets from userStatus:', userStatus);
      setTickets({
        new_assigned: userStatus.new_assigned_tickets || [],
        solved: userStatus.solved_tickets || [],
        closed: userStatus.closed_tickets || []
      });
    }
  }, [userStatus]);

  // Calculate counts from ticket arrays if not directly provided
  const getCount = (type) => {
    if (userStatus?.[type] !== undefined) {
      return userStatus[type];
    }

    const ticketArray = tickets[type] || [];
    return ticketArray.length;
  };

  const statusCards = [
    { id: "new_assigned", label: "PENDING", color: "warning.main", icon: <NewReleasesIcon />, count: getCount("new_assigned") },
    { id: "solved", label: "RESOLVED", color: "success.main", icon: <DoneAllIcon />, count: getCount("solved") },
    { id: "closed", label: "CLOSED", color: "info.main", icon: <LockIcon />, count: getCount("closed") },
  ];

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

  const selectedTickets = tickets[selectedType] || [];

  const departmentList = useMemo(
    () => [...new Set(selectedTickets.map((row) => row.department_detail?.field_name).filter(Boolean))],
    [selectedTickets]
  );

  const headingMap = {
    new_assigned: "PENDING Tickets",
    solved: "RESOLVED Tickets",
    closed: "CLOSED Tickets",
  };

  const filteredRows = useMemo(() => {
    if (!Array.isArray(selectedTickets)) {
      return [];
    }

    return selectedTickets.filter((row) => {
      if (!row) return false;

      const searchStr = Object.values(row)
        .join(" ")
        .toLowerCase();

      const matchesSearch = search ? searchStr.includes(search.toLowerCase()) : true;
      const matchesDept = department ? row.department_detail?.field_name === department : true;

      return matchesSearch && matchesDept;
    });
  }, [selectedTickets, search, department]);

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

  const handleTicketClick = (ticketNo) => {
    console.log('Storing ticket No:', ticketNo);
    localStorage.setItem('selectedTicketId', ticketNo);
    console.log('Navigating to Approval');
    navigate('/Approval');
  };

  // Fetch all messages and filter by ticket_no and between current user and chat recipient
  const fetchTicketMessages = async (ticketNo, currentUserId, recipientId) => {
    try {
      const allMessages = await fetchMessages();
      const filteredMessages = allMessages.filter((msg) =>
        msg.ticket_no == ticketNo &&
        ((msg.sender === currentUserId && msg.receiver === recipientId) ||
          (msg.sender === recipientId && msg.receiver === currentUserId))
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

    if (!chatRecipient?.id) {
      toast.error("Chat recipient not loaded");
      return;
    }

    if (!currentUserId) {
      toast.error("User not authenticated");
      return;
    }

    const receiverId = chatRecipient.id;
    setSendingFollowUpMessage(true);
    try {
      const payload = {
        sender: currentUserId,
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

  // UPDATED: Include title, description, category, status, and preserve assigned_users/assigned_groups in payload
  const handleSolutionSubmit = async () => {
    if (!currentChatTicket?.id) {
      toast.error("No ticket selected");
      return;
    }

    if (!currentTicketData) {
      toast.error("Ticket details not loaded");
      return;
    }

    try {
      // Ensure ticket_no is a string
      const ticketNoStr = String(currentChatTicket.id);
      console.log('Updating ticket:', ticketNoStr); // Debug log

      // Extract current assignments for preservation
      const assigneesDetail = currentTicketData.assignees_detail || [];
      const assignedGroupsDetail = currentTicketData.assigned_groups_detail || [];

      // Map to required fields: assignee (emails), assigned_group (IDs), assigned_to_type (based on presence)
      const assigneeEmails = assigneesDetail.map(user => user.email).filter(Boolean);
      const assignedGroupIds = assignedGroupsDetail.map(group => group.id).filter(Boolean);
      const assignedToType = [];
      if (assigneeEmails.length > 0) assignedToType.push('user');
      if (assignedGroupIds.length > 0) assignedToType.push('group');

      // Construct payload with title, description, category (PK), status, and assignments
      const categoryId = currentTicketData.category || currentTicketData.category_detail?.id;
      const payload = {
        title: currentTicketData.title || "",
        description: currentTicketData.description || "",
        category: categoryId,
        status: "153",  // Adjust to actual solved status ID if needed
        assigned_to_type: assignedToType,  // e.g., ["user", "group"]
        assignee: assigneeEmails,  // List of emails
        assigned_group: assignedGroupIds  // List of group IDs
      };
      console.log('Update payload:', payload); // Debug log

      const result = await updateTicket(ticketNoStr, payload);
      if (!result.success) {
        throw new Error(result.error || "Update failed");
      }

      toast.success("Ticket updated and marked as Solved successfully!");

      // Close drawer and refresh data
      setShowFollowUpChat(false);
      loadData(); // Reload tickets to reflect the change

      // Optionally switch to "solved" tab
      setSelectedType("solved");
    } catch (err) {
      console.error("Error updating ticket:", err);
      toast.error("Failed to update ticket status");
    }
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

    try {
      // Ensure ticketNo is a string
      const ticketNoStr = String(ticketNo);
      console.log('Fetching details for ticket:', ticketNoStr); // Debug log

      // Fetch ticket details to get requester details and full data
      const ticketDetails = await getTicketDetails(ticketNoStr);
      const ticketData = ticketDetails.ticket || ticketDetails;

      // NEW: Set full ticket data for updates
      setCurrentTicketData(ticketData);

      // Get requester details
      const requesterDetail = ticketData.requested_detail;
      if (!requesterDetail || (!requesterDetail?.id && !requesterDetail?.email)) {
        throw new Error("Requester details not found");
      }

      setChatRecipient(requesterDetail);

      // Set ticket details (ensure id is string)
      setCurrentChatTicket({
        id: ticketNoStr,
        title: ticketData.title || ticket.title || "",
      });

      const requesterId = requesterDetail.id || requesterDetail.email; // Fallback to email if no id

      // Fetch messages based on ticket_no and between current user and requester
      const ticketMessages = await fetchTicketMessages(ticketNoStr, currentUserId, requesterId);

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
    setChatRecipient(null);
    setFollowUpChats([]);
    setCurrentTicketData(null); // NEW: Reset ticket data
    setLoadingFollowUpChats(false);
    setChatTab(0);
  };

  // Show error if exists
  if (error && !loading) {
    return (
      <Box sx={{ width: "100%" }}>
        <Alert
          severity="error"
          sx={{ mb: 2 }}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={loadData}
            >
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 400 }}>
          <Typography color="error">
            Unable to load dashboard. Please try again.
          </Typography>
        </Box>
      </Box>
    );
  }

  // Show loading spinner while fetching
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Helper to check if ticket is already solved
  const isTicketSolved = () => {
    if (!currentTicketData) return false;
    return currentTicketData.status_detail?.field_name === "Solved" || currentTicketData.status === "Solved";
  };

  return (
    <>
      <Box sx={{ width: "100%", mb: 2 }}>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {statusCards.map((item) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.id}>
              <Card
                onClick={() => handleCardClick(item.id)}
                sx={{
                  p: 1,
                  m: 1,
                  transition: "0.3s ease",
                  maxWidth: "600px",
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
                      bgcolor: item.color,
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
            {/* <Typography
              textAlign="center"
              variant={isMobile ? "h6" : "h5"}
              fontWeight={700}
              sx={{ mb: 4, color: "#2D3748" }}
            >
              MY REQUEST DASHBOARD
            </Typography> */}



            {selectedType && (
              <Box>
                <Box sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 4,
                  flexDirection: isMobile ? "column" : "row",
                  gap: isMobile ? 2 : 0
                }}>
                  <Typography variant="h5" fontWeight={700} sx={{ color: "#2D3748" }}>
                    {headingMap[selectedType] || "Tickets"}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: isMobile ? "column" : "row",
                      justifyContent: "flex-end",
                      gap: 2,
                      width: isMobile ? "100%" : "auto"
                    }}
                  >
                    <Autocomplete
                      options={departmentList}
                      value={department}
                      onChange={(e, newValue) => setDepartment(newValue)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Department"
                          size="small"
                          variant="outlined"
                        />
                      )}
                      sx={{
                        width: isMobile ? "100%" : 200,
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                        }
                      }}
                      disabled={departmentList.length === 0}
                    />
                    <TextField
                      size="small"
                      label="Search"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      variant="outlined"
                      sx={{
                        width: isMobile ? "100%" : 200,
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
                        borderColor: "#CBD5E0",
                        color: "#4A5568",
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

                <Card sx={{
                  borderRadius: 3,
                  boxShadow: 2,
                  overflow: "hidden"
                }}>
                  {isMobile ? (
                    <Box sx={{ p: 2 }}>
                      {filteredRows.length > 0 ? (
                        filteredRows
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((t, index) => (
                            <Card
                              sx={{
                                mb: 2,
                                borderRadius: 2,
                                boxShadow: "0px 2px 8px rgba(0,0,0,0.05)",
                              }}
                              key={t.id || index}
                            >
                              <CardContent>
                                {/* Header */}
                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                  <Typography fontWeight={700} color="#667eea">
                                    #{t.ticket_no}
                                  </Typography>
                                  <Typography
                                    fontSize={12}
                                    fontWeight={600}
                                    sx={{
                                      px: 1.5,
                                      py: 0.5,
                                      borderRadius: 2,
                                      backgroundColor: "#eef2ff",
                                      color: "#667eea",
                                    }}
                                  >
                                    {getDisplayStatus(t.status_detail?.field_name || t.status || "-")}
                                  </Typography>
                                </Box>
                                {/* Title */}
                                <Typography fontWeight={600} mt={1} color="#2D3748">
                                  {t.title}
                                </Typography>
                                {/* Priority */}
                                <Typography fontSize={13} color="#718096" mt={0.5}>
                                  Priority: {t.priority_detail?.field_name || "-"}
                                </Typography>
                                {/* Category */}
                                <Typography fontSize={13} mt={1.5}>
                                  <strong style={{ color: "#4A5568" }}>Category:</strong>{" "}
                                  <span style={{ color: "#2D3748" }}>
                                    {t.category_detail?.category_name || "-"} /{" "}
                                    {t.subcategory_detail?.subcategory_name || "-"}
                                  </span>
                                </Typography>
                                {/* Department & Location */}
                                <Typography fontSize={13} mt={1}>
                                  <strong style={{ color: "#4A5568" }}>Dept:</strong>{" "}
                                  <span style={{ color: "#2D3748" }}>
                                    {t.department_detail?.field_name || "-"} |{" "}
                                    {t.location_detail?.field_name || "-"}
                                  </span>
                                </Typography>
                                {/* Dates */}
                                <Typography fontSize={12} color="#718096" mt={1.5}>
                                  Open: {t.created_date ? new Date(t.created_date).toLocaleDateString() : "-"} <br />
                                  Update: {t.updated_date ? new Date(t.updated_date).toLocaleDateString() : "-"}
                                </Typography>
                                {/* Action */}
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
                                  <Button
                                    variant="contained"
                                    onClick={() => handleTicketClick(t.ticket_no)}
                                    sx={{
                                      backgroundColor: "#667eea",
                                      borderRadius: 2,
                                      textTransform: "none",
                                      fontSize: "0.85rem",
                                      px: 2,
                                      "&:hover": {
                                        backgroundColor: "#556cd6",
                                      }
                                    }}
                                  >
                                    View Details
                                  </Button>
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
                              .map((t, index) => (
                                <TableRow
                                  key={t.id || index}
                                  hover
                                  sx={{
                                    '&:hover': { backgroundColor: '#F7FAFC' },
                                    '&:last-child td': { borderBottom: 0 }
                                  }}
                                >
                                  <TableCell sx={{ color: "#667eea", fontWeight: 600 }}>
                                    #{t.ticket_no}
                                  </TableCell>
                                  <TableCell sx={{ fontWeight: 500 }}>
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
                                          
                                        }}
                                      >
                                        {t.description || "-"}
                                      </Typography>
                                    </Tooltip>
                                  </TableCell>
                                  <TableCell>
                                    <Typography fontWeight={500}>
                                      {getDisplayStatus(t.status_detail?.field_name || t.status || "-")}
                                    </Typography>
                                    <Typography fontSize="0.85rem">
                                      {t.priority_detail?.field_name || t.priority || "-"}
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
                                        <Typography fontWeight={500}>
                                          {t.category_detail?.category_name || "-"}
                                        </Typography>
                                        <Typography fontSize="0.85rem">
                                          {t.subcategory_detail?.subcategory_name || "-"}
                                        </Typography>
                                      </Box>
                                    </Tooltip>
                                  </TableCell>
                                  <TableCell>
                                    <Typography fontWeight={500}>
                                      {t.department_detail?.field_name || "-"}
                                    </Typography>
                                    <Typography fontSize="0.85rem">
                                      {t.location_detail?.field_name || "-"}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Tooltip title={t.requested_detail?.email}>
                                      <Typography
                                        sx={{
                                          overflow: 'hidden',
                                          textOverflow: 'ellipsis',
                                          whiteSpace: 'nowrap'
                                        }}
                                      >
                                        {t.requested_detail?.email || t.requested_by || "-"}
                                      </Typography>
                                    </Tooltip>
                                  </TableCell>
                                  <TableCell>
                                    <Typography fontSize="0.9rem">
                                      {t.created_date ? new Date(t.created_date).toLocaleDateString() : "-"}
                                    </Typography>
                                    <Typography fontSize="0.8rem">
                                      {t.updated_date ? new Date(t.updated_date).toLocaleDateString() : "-"}
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
                                          <ChatIcon fontSize="small" />
                                        </IconButton>
                                      </Tooltip>
                                      <Tooltip title="View Details">
                                        <IconButton
                                          onClick={() => handleTicketClick(t.ticket_no)}
                                          sx={{ color: "#667eea" }}
                                          size="small"
                                        >
                                          <VisibilityIcon fontSize="small" />
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
                  )}

                  {filteredRows.length > 0 && (
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ py: 2, px: 3, borderTop: "1px solid #E2E8F0" }}>
                      <Typography variant="body2" color="#718096">
                        Showing {page * rowsPerPage + 1} to {Math.min((page + 1) * rowsPerPage, filteredRows.length)} of {filteredRows.length} tickets
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
                        sx={{
                          "& .MuiPaginationItem-root": {
                            borderRadius: "8px",
                            borderColor: "#CBD5E0",
                            color: "#4A5568",
                            "&.Mui-selected": {
                              backgroundColor: "#667eea",
                              color: "#fff",
                              borderColor: "#667eea",
                              "&:hover": {
                                backgroundColor: "#556cd6",
                              }
                            },
                            "&:hover": {
                              backgroundColor: "#F7FAFC",
                            }
                          },
                        }}
                      />
                    </Stack>
                  )}
                </Card>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>

      {/* Chat Drawer */}
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
            p: 2,
            borderBottom: 1,
            borderColor: "divider",
            bgcolor: "primary.main",
            color: "white"
          }}>
            <Typography variant="h6">
              <ChatIcon sx={{ mr: 1, verticalAlign: "middle" }} />
              {currentChatTicket?.title || "Ticket Details"}
            </Typography>
            <Typography variant="caption" sx={{ color: "white" }}>
              Ticket #{currentChatTicket?.id}
            </Typography>
          </Box>

          {/* Tab Buttons */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={chatTab}
              onChange={(e, newValue) => setChatTab(newValue)}
              centered
              disabled={isTicketSolved()}  // NEW: Disable tabs if already solved
            >
              <Tab label="Follow-up" icon={<ChatIcon />} />
              <Tab
                label="Solution"
                icon={<DoneAllIcon />}
                disabled={isTicketSolved()}  // NEW: Disable Solution tab if already solved
              />
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
                                    {getInitials(chatRecipient?.name)}
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
                                        {msg.createdon ? new Date(msg.createdon).toLocaleTimeString([], {
                                          hour: '2-digit',
                                          minute: '2-digit',
                                          hour12: true
                                        }) : ""}
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
                                        {chatRecipient?.name || "Requester"}
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
                                        {msg.createdon ? new Date(msg.createdon).toLocaleTimeString([], {
                                          hour: '2-digit',
                                          minute: '2-digit',
                                          hour12: true
                                        }) : ""}
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
                      disabled={sendingFollowUpMessage || !chatRecipient}
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
                      disabled={!newFollowUpMessage.trim() || sendingFollowUpMessage || !chatRecipient}
                      color="primary"
                      sx={{ alignSelf: "flex-end", height: 40, width: 40 }}
                    >
                      {sendingFollowUpMessage ? <CircularProgress size={20} /> : <SendIcon />}
                    </IconButton>
                  </Box>
                </Box>
              </Box>
            )}

            {chatTab === 1 && (
              // Solution Tab: Update to Solved
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
                  Mark Ticket as Solved
                </Typography>
                {isTicketSolved() ? (
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    This ticket is already marked as Solved.
                  </Typography>
                ) : (
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Are you sure you want to mark this ticket as solved? This action cannot be undone.
                  </Typography>
                )}
                <Button
                  variant="contained"
                  color="success"
                  size="large"
                  onClick={handleSolutionSubmit}
                  disabled={isTicketSolved()}  // NEW: Disable button if already solved
                  sx={{ minWidth: 200 }}
                >
                  Confirm Solved
                </Button>
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
    </>
  );
};

export default ApproverTabs;