// import { useState, useEffect, useMemo } from "react";
// import { useTheme } from "@mui/material/styles";
// import { Box, Card, CardContent, Typography, Grid, TextField, Button, Table, TableHead, TableRow, TableCell, TableBody, TableContainer, useMediaQuery, TablePagination, Autocomplete, } from "@mui/material";
// import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// import CancelIcon from '@mui/icons-material/Cancel';
// import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
// import PauseCircleIcon from '@mui/icons-material/PauseCircle';
// import ErrorIcon from '@mui/icons-material/Error';
// import VisibilityIcon from '@mui/icons-material/Visibility';
// import { useNavigate } from "react-router-dom";


// const NotifiedTabs = ({ watcherStatus }) => {

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
//         if (watcherStatus) {
//             setTickets({
//                 pending: watcherStatus.pending_tickets || [],
//                 approved: watcherStatus.approved_tickets || [],
//                 hold: watcherStatus.on_hold_tickets || [],
//                 rejected: watcherStatus.rejected_tickets || [],
//                 sla: watcherStatus.sla_breached_tickets || []
//             });
//         }
//     }, [watcherStatus]);

//     const statusCards = [
//         { id: "pending", label: "PENDING", color: "warning.main", icon: <ErrorIcon />, count: watcherStatus?.pending || 0 },
//         { id: "approved", label: "APPROVED", color: "success.main", icon: <CheckCircleIcon />, count: watcherStatus?.approved || 0 },
//         { id: "hold", label: "ON HOLD", color: "info.main", icon: <PauseCircleIcon />, count: watcherStatus?.on_hold || 0 },
//         { id: "rejected", label: "REJECTED", color: "error.main", icon: <CancelIcon />, count: watcherStatus?.rejected || 0 },
//         { id: "sla", label: "SLA BREACHED", color: "warning.main", icon: <AccessTimeFilledIcon />, count: watcherStatus?.sla_breached_count || 0 },
//     ];

//     const selectedTickets = tickets[selectedType] || [];

//     const departmentList = useMemo(
//         () => [...new Set(selectedTickets.map((row) => row.department_detail?.field_name).filter(Boolean))],
//         [selectedTickets]
//     );

//     const headingMap = {
//         pending: "PENDING Tickets (MONITORED)",
//         approved: "APPROVED Tickets (MONITORED)",
//         hold: "ON HOLD Tickets (MONITORED)",
//         rejected: "REJECTED Tickets (MONITORED)",
//         sla: "SLA BREACHED Tickets (MONITORED)",
//     };

//     const NotifiedTabelCol = [
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


//     return (
//         <>
//             <Box sx={{ width: "100%" }}>
//                 <Card>
//                     <CardContent>
//                         <Typography
//                             textAlign="center"
//                             variant={isMobile ? "h6" : "h5"}
//                             fontWeight={700}
//                             sx={{ mb: 3 }}
//                         >
//                             MONITORED DASHBOARD
//                         </Typography>
//                         <Grid container spacing={2}>
//                             {statusCards.map((item) => (
//                                 <Grid size={{ xs: 6, sm: 4, md: 3, lg: 2.4 }} key={item.id}>
//                                     <Card
//                                         onClick={() => handleCardClick(item.id)}
//                                         sx={{
//                                             borderRadius: 10,
//                                             height: isMobile ? "90px" : "80px",
//                                             boxShadow: selectedType === item.id ? "0px 4px 12px rgba(102,126,234,0.6)" : "0px 4px 10px rgba(0,0,0,0.1)",
//                                             border: selectedType === item.id ? "2px solid #667eea" : "2px solid transparent",
//                                             p: isMobile ? 0 : 1,
//                                             transition: "0.3s",
//                                             "&:hover": {
//                                                 background: "linear-gradient(135deg, #667eea, #764ba2)",
//                                                 transform: "translateY(-4px)",
//                                             },
//                                         }}
//                                     >
//                                         <CardContent
//                                             sx={{
//                                                 display: "flex",
//                                                 alignItems: "center",
//                                                 gap: isMobile ? 2 : 4,
//                                             }}
//                                         >
//                                             <Box
//                                                 sx={{
//                                                     width: 45,
//                                                     height: 45,
//                                                     borderRadius: "50%",
//                                                     backgroundColor: item.color,
//                                                     color: "#fff",
//                                                     display: "flex",
//                                                     alignItems: "center",
//                                                     justifyContent: "center",
//                                                     fontSize: 22,
//                                                 }}
//                                             >
//                                                 {item.icon}
//                                             </Box>
//                                             <Box>
//                                                 <Typography variant={isMobile ? "h6" : "h5"} fontWeight={600}>
//                                                     {item.count}
//                                                 </Typography>

//                                                 <Typography
//                                                     variant="subtitle1"
//                                                     fontWeight={600}
//                                                     sx={{ color: "text.secondary", fontSize: isMobile ? 11 : 14 }}
//                                                 >
//                                                     {item.label}
//                                                 </Typography>
//                                             </Box>
//                                         </CardContent>
//                                     </Card>
//                                 </Grid>
//                             ))}
//                         </Grid>
//                         {selectedType && (
//                             <Box>
//                                 <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 5 }}>
//                                     <Typography
//                                         variant="h6"
//                                         fontWeight={700}
//                                         sx={{ mt: 0.5 }}
//                                     >
//                                         {headingMap[selectedType] || "Tickets"}
//                                     </Typography>
//                                     <Box
//                                         sx={{
//                                             display: "flex",
//                                             flexDirection: isMobile ? "column" : "row",
//                                             justifyContent: "flex-end",
//                                             gap: 2,

//                                         }}
//                                     >
//                                         <Autocomplete
//                                             options={departmentList}
//                                             value={department}
//                                             onChange={(e, newValue) => setDepartment(newValue)}
//                                             renderInput={(params) => <TextField {...params} label="Department" size="small" />}
//                                             sx={{ width: 200 }}
//                                         />
//                                         <TextField
//                                             size="small"
//                                             label="Search"
//                                             value={search}
//                                             onChange={(e) => setSearch(e.target.value)}
//                                             sx={{ width: 200 }}
//                                         />
//                                         <Button variant="outlined" fullWidth={isMobile} onClick={clearFilters}>
//                                             Clear
//                                         </Button>
//                                     </Box>
//                                 </Box>
//                                 <Card sx={{ borderRadius: 6, mt: 5 }}>
//                                     <TableContainer sx={{ overflowX: "auto" }}>
//                                         <Table>
//                                             <TableHead>
//                                                 <TableRow>
//                                                     {NotifiedTabelCol.map((col) => (
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
//                                                                 <TableCell>{t.description}</TableCell>
//                                                                 <TableCell>{t.status_detail?.field_values}</TableCell>
//                                                                 {/* <TableCell>{t.category_detail?.field_values || "-"}</TableCell>
//                                                                 <TableCell>{t.subcategory_detail?.field_values || "-"}</TableCell> */}
//                                                                 <TableCell>{t.category_detail?.category_name || "-"}</TableCell>
//                                                             <TableCell>{t.subcategory_detail?.subcategory_name || "-"}</TableCell>
//                                                                 <TableCell>{t.priority_detail?.field_values}</TableCell>
//                                                                 <TableCell>{t.department_detail?.field_name}</TableCell>
//                                                                 <TableCell>{t.location_detail?.field_name}</TableCell>
//                                                                 <TableCell>{t.requested_detail?.email}</TableCell>
//                                                                 <TableCell>{new Date(t.created_date).toLocaleString()}</TableCell>
//                                                                 <TableCell>{new Date(t.updated_date).toLocaleString()}</TableCell>
//                                                                 <TableCell>
//                                                                     <VisibilityIcon
//                                                                         onClick={() => handleTicketClick(t.ticket_no)}
//                                                                         //onClick={() => navigate(`/Approval/${t.id}`)}
//                                                                         //onClick={() => navigate("/Approval", { state: { ticket: t } })}
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
//                                     <TablePagination
//                                         component="div"
//                                         count={filteredRows.length}
//                                         page={page}
//                                         rowsPerPage={rowsPerPage}
//                                         onPageChange={(e, newPage) => setPage(newPage)}
//                                         onRowsPerPageChange={(e) => {
//                                             setRowsPerPage(parseInt(e.target.value, 5));
//                                             setPage(0);
//                                         }}
//                                     />
//                                 </Card>
//                             </Box>
//                         )}
//                     </CardContent>
//                 </Card>
//             </Box>
//         </>
//     )
// }

// export default NotifiedTabs;

import { useState, useEffect, useMemo } from "react";
import { useTheme } from "@mui/material/styles";
import { Box, Card, CardContent, Typography, Grid, TextField, Button, Table, TableHead, TableRow, TableCell, TableBody, TableContainer, useMediaQuery, TablePagination, Autocomplete, Stack, Pagination, Tooltip, } from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import ErrorIcon from '@mui/icons-material/Error';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from "react-router-dom";
 
 
const NotifiedTabs = ({ watcherStatus }) => {
 
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
 
    const [selectedType, setSelectedType] = useState("pending");
    const [search, setSearch] = useState("");
    const [department, setDepartment] = useState("");
    const [tickets, setTickets] = useState({
        pending: [],
        approved: [],
        hold: [],
        rejected: [],
        sla: []
    });
 
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
 
    useEffect(() => {
        if (watcherStatus) {
            setTickets({
                pending: watcherStatus.pending_tickets || [],
                approved: watcherStatus.approved_tickets || [],
                hold: watcherStatus.on_hold_tickets || [],
                rejected: watcherStatus.rejected_tickets || [],
                sla: watcherStatus.sla_breached_tickets || []
            });
        }
    }, [watcherStatus]);
 
    const statusCards = [
        { id: "pending", label: "PENDING", color: "warning.main", icon: <ErrorIcon />, count: watcherStatus?.pending || 0 },
        { id: "approved", label: "APPROVED", color: "success.main", icon: <CheckCircleIcon />, count: watcherStatus?.approved || 0 },
        { id: "hold", label: "ON HOLD", color: "info.main", icon: <PauseCircleIcon />, count: watcherStatus?.on_hold || 0 },
        { id: "rejected", label: "REJECTED", color: "error.main", icon: <CancelIcon />, count: watcherStatus?.rejected || 0 },
        { id: "sla", label: "SLA BREACHED", color: "warning.main", icon: <AccessTimeFilledIcon />, count: watcherStatus?.sla_breached_count || 0 },
    ];
 
    const selectedTickets = tickets[selectedType] || [];
 
    const departmentList = useMemo(
        () => [...new Set(selectedTickets.map((row) => row.department_detail?.field_name).filter(Boolean))],
        [selectedTickets]
    );
 
    const headingMap = {
        pending: "PENDING Tickets (MONITORED)",
        approved: "APPROVED Tickets (MONITORED)",
        hold: "ON HOLD Tickets (MONITORED)",
        rejected: "REJECTED Tickets (MONITORED)",
        sla: "SLA BREACHED Tickets (MONITORED)",
    };
 
    const NotifiedTabelCol = [
        { id: 1, title: <>Ticket ID</> },
        { id: 2, title: <>Title</> },
        { id: 3, title: <>Description</> },
        { id: 4, title: <>Status<br />Priority</> },             // FIXED
        { id: 5, title: <>Category<br />Subcategory</> },       // FIXED
        { id: 6, title: <>Department<br />Location</> },        // FIXED
        { id: 7, title: <>Requested By</> },
        { id: 8, title: <>Open Date<br />Last Update</> },      // FIXED
        { id: 9, title: <>Action</> },
    ];
 
    // const NotifiedTabelCol = [
    //     { id: 1, title: "Ticket ID" },
    //     { id: 2, title: "Title" },
    //     { id: 3, title: "Description" },
    //     { id: 4, title: "Status" },
    //     { id: 5, title: "Category" },
    //     { id: 6, title: "Subcategory" },
    //     { id: 7, title: "Priority" },
    //     { id: 8, title: "Department" },
    //     { id: 9, title: "Location" },
    //     { id: 10, title: "Requested By" },
    //     { id: 11, title: "Open Date" },
    //     { id: 12, title: "Last Update" },
    //     { id: 13, title: "Action" },
    // ];
 
    const navigate = useNavigate();
 
    const filteredRows = useMemo(() => {
        return selectedTickets.filter((row) => {
            const matchesSearch =
                Object.values(row)
                    .join(" ")
                    .toLowerCase()
                    .includes(search.toLowerCase());
 
            const matchesDept = department ? row.department_detail?.field_name === department : true;
 
            return matchesSearch && matchesDept;
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
 
    const handleTicketClick = (ticketNo) => {
        console.log('Storing ticket No:', ticketNo);
        localStorage.setItem('selectedTicketId', ticketNo);
        console.log('Navigating to Approval');
        navigate('/Approval');
    };
 
 
    return (
        <>
            <Box sx={{ width: "100%" }}>
                <Card>
                    <CardContent>
                        <Typography
                            textAlign="center"
                            variant={isMobile ? "h6" : "h5"}
                            fontWeight={700}
                            sx={{ mb: 3 }}
                        >
                            MONITORED DASHBOARD
                        </Typography>
                        <Grid container spacing={2}>
                            {statusCards.map((item) => (
                                <Grid size={{ xs: 6, sm: 4, md: 3, lg: 2.4 }} key={item.id}>
                                    <Card
                                        onClick={() => handleCardClick(item.id)}
                                        sx={{
                                            borderRadius: 10,
                                            height: isMobile ? "90px" : "80px",
                                            boxShadow: selectedType === item.id ? "0px 4px 12px rgba(102,126,234,0.6)" : "0px 4px 10px rgba(0,0,0,0.1)",
                                            border: selectedType === item.id ? "2px solid #667eea" : "2px solid transparent",
                                            p: isMobile ? 0 : 1,
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
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    width: 45,
                                                    height: 45,
                                                    borderRadius: "50%",
                                                    backgroundColor: item.color,
                                                    color: "#fff",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    fontSize: 22,
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
                                                    sx={{ color: "text.secondary", fontSize: isMobile ? 11 : 14 }}
                                                >
                                                    {item.label}
                                                </Typography>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                        {selectedType && (
                            <Box>
                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 5 }}>
                                    <Typography variant="h6" fontWeight={700} sx={{ mt: 0.5 }}>
                                        {headingMap[selectedType] || "Tickets"}
                                    </Typography>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: isMobile ? "column" : "row",
                                            justifyContent: "flex-end",
                                            gap: 2,
                                        }}
                                    >
                                        <Autocomplete
                                            options={departmentList}
                                            value={department}
                                            onChange={(e, newValue) => setDepartment(newValue)}
                                            renderInput={(params) => <TextField {...params} label="Department" size="small" />}
                                            sx={{
                                                width: 200,
                                                "& .MuiOutlinedInput-root": {
                                                    borderRadius: 3,
                                                }
                                            }}
                                        />
                                        <TextField
                                            size="small"
                                            label="Search"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            sx={{
                                                width: 200,
                                                "& .MuiOutlinedInput-root": {
                                                    borderRadius: 3,
                                                }
                                            }}
                                        />
                                        <Button variant="outlined" fullWidth={isMobile} onClick={clearFilters} sx={{ borderRadius: 3 }}>
                                            Clear
                                        </Button>
                                    </Box>
                                </Box>
                                <Card sx={{ borderRadius: 6, mt: 5 }}>
                                    <TableContainer sx={{ overflowX: "auto" }}>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    {NotifiedTabelCol.map((col) => (
                                                        <TableCell key={col.id} sx={{ fontWeight: 700, whiteSpace: "nowrap" }}>
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
                                                            <TableRow key={t.id} hover>
                                                                <TableCell>{t.ticket_no}</TableCell>
                                                                <TableCell>{t.title}</TableCell>
                                                                <TableCell>
                                                                    <Tooltip
                                                                        title={t.description || "No description"}
                                                                        arrow
                                                                        placement="top"
                                                                    >
                                                                        <Typography
                                                                            sx={{
                                                                                maxWidth: 200,
                                                                                whiteSpace: "nowrap",
                                                                                overflow: "hidden",
                                                                                textOverflow: "ellipsis",
                                                                                cursor: "pointer"
                                                                            }}
                                                                        >
                                                                            {t.description || "-"}
                                                                        </Typography>
                                                                    </Tooltip>
                                                                </TableCell>
                                                                <TableCell>
                                                                    {t.status_detail?.field_values} <br />
                                                                    {t.priority_detail?.field_values}
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
                                                                            {t.category_detail?.category_name || "-"} <br />
                                                                            {t.subcategory_detail?.subcategory_name || "-"}
                                                                        </Box>
                                                                    </Tooltip>
                                                                </TableCell>
                                                                {/* <TableCell>{t.subcategory_detail?.field_values || "-"}</TableCell>
                                                                <TableCell>{t.priority_detail?.field_values}</TableCell> */}
                                                                <TableCell>
                                                                    {t.department_detail?.field_name} <br />
                                                                    {t.location_detail?.field_name}
                                                                </TableCell>
                                                                {/* <TableCell>{t.location_detail?.field_name}</TableCell> */}
                                                                <TableCell>{t.requested_detail?.email}</TableCell>
                                                                <TableCell>
                                                                    {new Date(t.created_date).toLocaleString()} <br />
                                                                    {new Date(t.updated_date).toLocaleString()}
                                                                </TableCell>
                                                                {/* <TableCell>{new Date(t.updated_date).toLocaleString()}</TableCell> */}
                                                                <TableCell>
                                                                    <VisibilityIcon
                                                                        onClick={() => handleTicketClick(t.ticket_no)}
                                                                        //onClick={() => navigate(`/Approval/${t.id}`)}
                                                                        //onClick={() => navigate("/Approval", { state: { ticket: t } })}
                                                                        style={{ cursor: "pointer", color: "#667eea" }}
                                                                    />
                                                                </TableCell>
                                                            </TableRow>
                                                        ))
                                                ) : (
                                                    <TableRow>
                                                        <TableCell colSpan={12} align="center">
                                                            No tickets found.
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    <Stack direction="row" justifyContent="end" sx={{ py: 2, px: 2 }}>
                                        <Pagination
                                            count={Math.ceil(filteredRows.length / rowsPerPage)}
                                            page={page + 1}
                                            onChange={(e, value) => setPage(value - 1)}
                                            variant="outlined"
                                            shape="rounded"
                                            showFirstButton={false}
                                            showLastButton={false}
                                            siblingCount={0}
                                            boundaryCount={1}
                                            sx={{
                                                "& .MuiPaginationItem-root": {
                                                    borderRadius: "20px",
                                                    minWidth: 40,
                                                    height: 40,
                                                },
                                            }}
                                        />
                                    </Stack>
                                </Card>
                            </Box>
                        )}
                    </CardContent>
                </Card>
            </Box>
        </>
    )
}
 
export default NotifiedTabs;