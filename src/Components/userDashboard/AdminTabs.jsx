// import { useState, useEffect, useMemo } from "react";
// import { useTheme } from "@mui/material/styles";
// import { Box, Card, CardContent, Typography, Grid, TextField, Button, Table, TableHead, TableRow, TableCell, TableBody, TableContainer, useMediaQuery, TablePagination, Autocomplete, Stack, Pagination, Tooltip, } from "@mui/material";
// import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// import PauseCircleIcon from '@mui/icons-material/PauseCircle';
// import ErrorIcon from '@mui/icons-material/Error';
// import VisibilityIcon from '@mui/icons-material/Visibility';
// import { useNavigate } from "react-router-dom";


// const AdminTabs = ({ watcherStatus }) => {

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
//         { id: 1, title: <>Ticket ID</> },
//         { id: 2, title: <>Title</> },
//         { id: 3, title: <>Description</> },
//         { id: 4, title: <>Status<br />Priority</> },             // FIXED
//         { id: 5, title: <>Category<br />Subcategory</> },       // FIXED
//         { id: 6, title: <>Department<br />Location</> },        // FIXED
//         { id: 7, title: <>Requested By</> },
//         { id: 8, title: <>Open Date<br />Last Update</> },      // FIXED
//         { id: 9, title: <>Action</> },
//     ];

//     // const NotifiedTabelCol = [
//     //     { id: 1, title: "Ticket ID" },
//     //     { id: 2, title: "Title" },
//     //     { id: 3, title: "Description" },
//     //     { id: 4, title: "Status" },
//     //     { id: 5, title: "Category" },
//     //     { id: 6, title: "Subcategory" },
//     //     { id: 7, title: "Priority" },
//     //     { id: 8, title: "Department" },
//     //     { id: 9, title: "Location" },
//     //     { id: 10, title: "Requested By" },
//     //     { id: 11, title: "Open Date" },
//     //     { id: 12, title: "Last Update" },
//     //     { id: 13, title: "Action" },
//     // ];

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

//     const handleTicketClick = (ticketNo) => {
//         console.log('Storing ticket No:', ticketNo);
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
//                                     <Typography variant="h6" fontWeight={700} sx={{ mt: 0.5 }}>
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
//                                             sx={{
//                                                 width: 200,
//                                                 "& .MuiOutlinedInput-root": {
//                                                     borderRadius: 3,
//                                                 }
//                                             }}
//                                         />
//                                         <TextField
//                                             size="small"
//                                             label="Search"
//                                             value={search}
//                                             onChange={(e) => setSearch(e.target.value)}
//                                             sx={{
//                                                 width: 200,
//                                                 "& .MuiOutlinedInput-root": {
//                                                     borderRadius: 3,
//                                                 }
//                                             }}
//                                         />
//                                         <Button variant="outlined" fullWidth={isMobile} onClick={clearFilters} sx={{ borderRadius: 3 }}>
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
//                                                                 {/* <TableCell>{t.subcategory_detail?.field_values || "-"}</TableCell>
//                                                                 <TableCell>{t.priority_detail?.field_values}</TableCell> */}
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
//                                     <Stack direction="row" justifyContent="end" sx={{ py: 2, px: 2 }}>
//                                         <Pagination
//                                             count={Math.ceil(filteredRows.length / rowsPerPage)}
//                                             page={page + 1}
//                                             onChange={(e, value) => setPage(value - 1)}
//                                             variant="outlined"
//                                             shape="rounded"
//                                             showFirstButton={false}
//                                             showLastButton={false}
//                                             siblingCount={0}
//                                             boundaryCount={1}
//                                             sx={{
//                                                 "& .MuiPaginationItem-root": {
//                                                     borderRadius: "20px",
//                                                     minWidth: 40,
//                                                     height: 40,
//                                                 },
//                                             }}
//                                         />
//                                     </Stack>
//                                 </Card>
//                             </Box>
//                         )}
//                     </CardContent>
//                 </Card>
//             </Box>
//         </>
//     )
// }

// export default AdminTabs;

// import { useEffect, useMemo, useState } from "react";
// import { useTheme } from "@mui/material/styles";
// import { Box, Card, CardContent, Typography, Grid, TextField, Button, Table, TableHead, TableRow, TableCell, TableBody, TableContainer, useMediaQuery, Autocomplete, Stack, Pagination, Tooltip, CircularProgress, IconButton, Drawer, Divider, Chip, Avatar, Alert, Tabs, Tab, Icon } from "@mui/material";
// import NewReleasesIcon from '@mui/icons-material/NewReleases';
// import DoneAllIcon from '@mui/icons-material/DoneAll';
// import LockIcon from '@mui/icons-material/Lock';
// import VisibilityIcon from '@mui/icons-material/Visibility';
// import ChatIcon from '@mui/icons-material/Chat';
// import SendIcon from '@mui/icons-material/Send';
// import CancelIcon from '@mui/icons-material/Cancel';
// import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { fetchMessages, sendMessage, getTicketDetails, fetchAdminTickets, } from "../../Api";

// const AdminTabs = ({ userStatus }) => {

//     const theme = useTheme();
//     const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
//     const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

//     const [selectedType, setSelectedType] = useState("new_assigned");
//     const [search, setSearch] = useState("");
//     const [department, setDepartment] = useState("");
//     const [tickets, setTickets] = useState({
//         new_assigned: [],
//         solved: [],
//         closed: [],
//         cancelled: [],
//     });
//     const [page, setPage] = useState(0);
//     const [rowsPerPage, setRowsPerPage] = useState(5);

//     // Chat/follow-up states
//     const [showFollowUpChat, setShowFollowUpChat] = useState(false);
//     const [followUpChats, setFollowUpChats] = useState([]);
//     const [loadingFollowUpChats, setLoadingFollowUpChats] = useState(false);
//     const [newFollowUpMessage, setNewFollowUpMessage] = useState("");
//     const [sendingFollowUpMessage, setSendingFollowUpMessage] = useState(false);
//     const [currentChatTicket, setCurrentChatTicket] = useState(null);
//     const [assignee, setAssignee] = useState(null);
//     const [currentUserId, setCurrentUserId] = useState(null);
//     const [currentUserName, setCurrentUserName] = useState("You");
//     // Tab state for chat drawer
//     const [chatTab, setChatTab] = useState(0); // 0: Follow-up (Chat), 1: Solution
//     // Solved ticket solution states
//     const [isSolvedTicket, setIsSolvedTicket] = useState(false);
//     const [solutionText, setSolutionText] = useState("");
//     const [isResolved, setIsResolved] = useState(false);
//     const [isApproved, setIsApproved] = useState(false);

//     useEffect(() => {
//         if (userStatus) {
//             setTickets({
//                 new_assigned: userStatus.new_assigned_tickets || [],
//                 solved: userStatus.solved_tickets || [],
//                 closed: userStatus.closed_tickets || [],
//                 cancelled: userStatus.cancelled_tickets || [],
//             });
//         }
//     }, [userStatus]);

//     // Get current user ID and name on component mount - Ticket Creator (Requester)
//     useEffect(() => {
//         const userDataString = localStorage.getItem("user");
//         if (userDataString) {
//             const userData = JSON.parse(userDataString);
//             setCurrentUserId(userData?.id || null);
//             setCurrentUserName(userData?.name || userData?.username || "You");
//         } else {
//             // Fallback
//             const userId = localStorage.getItem("current_user_id") || "11";
//             setCurrentUserId(parseInt(userId));
//             setCurrentUserName("You");
//         }
//     }, []);

//     // Only show New Assigned, Solved, and Closed cards
//     const statusCards = [
//         {
//             id: "new_assigned",
//             label: "NEW",
//             color: "warning",
//             icon: <NewReleasesIcon />,
//             count: userStatus?.new_assigned || 0,
//             description: "Tickets recently assigned to you"
//         },
//         {
//             id: "pending",
//             label: "PENDING",
//             color: "warning",
//             icon: <AccessTimeFilledIcon />,
//             //count: userStatus?.new_assigned || 0,
//             count: 0,
//             description: "Tickets recently assigned to you"
//         },
//         {
//             id: "solved",
//             label: "RESOLVED",
//             color: "success",
//             icon: <DoneAllIcon />,
//             count: userStatus?.solved || 0,
//             description: "Tickets you have resolved"
//         },
//         {
//             id: "cancelled",
//             label: "CANCEL",
//             color: "error",
//             icon: <CancelIcon />,
//             count: userStatus?.cancelled || 0,
//             description: "Tickets recently assigned to you"
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

//     // Get initials for avatar
//     const getInitials = (name) => {
//         if (!name || name === "You") return "U";
//         return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
//     };

//     // Group chats by date
//     const groupedChats = useMemo(() => {
//         const groups = {};
//         followUpChats.forEach(msg => {
//             const date = new Date(msg.createdon).toLocaleDateString();
//             if (!groups[date]) {
//                 groups[date] = [];
//             }
//             groups[date].push(msg);
//         });
//         return Object.entries(groups)
//             .map(([date, messages]) => ({
//                 date,
//                 messages: messages.sort((a, b) => new Date(a.createdon) - new Date(b.createdon))
//             }))
//             .sort((a, b) => new Date(a.date) - new Date(b.date));
//     }, [followUpChats]);

//     // Headings for New Assigned, Solved, Closed
//     const headingMap = {
//         new_assigned: "NEW TICKETS (MY REQUEST)",
//         pending: "PENDING TICKETS (MY REQUEST)",
//         solved: "SOLVED TICKETS (MY REQUEST)",
//         cancel: "CANCEL TICKETS (MY REQUEST)",
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

//     // Fetch all messages and filter by ticket_no and between current user (ticket creator) and receiver (assignee)
//     const fetchTicketMessages = async (ticketNo, currentUserId, receiverId) => {
//         try {
//             // Fetch all messages; adjust if API supports params
//             const allMessages = await fetchMessages();
//             // Filter by ticket_no and between currentUserId (ticket creator) and receiverId (assignee) (bidirectional)
//             const filteredMessages = allMessages.filter((msg) =>
//                 msg.ticket_no == ticketNo &&
//                 ((msg.sender === currentUserId && msg.receiver === receiverId) ||
//                     (msg.sender === receiverId && msg.receiver === currentUserId))
//             );
//             return filteredMessages || [];
//         } catch (err) {
//             console.error("Error loading ticket messages:", err);
//             toast.error("Failed to load messages");
//             return [];
//         }
//     };

//     const sendFollowUpMessageHandler = async (messageText) => {
//         if (!messageText.trim()) {
//             toast.error("Message cannot be empty");
//             return;
//         }

//         if (!currentChatTicket?.id) {
//             toast.error("No ticket selected");
//             return;
//         }
//         if (!assignee?.id) {
//             toast.error("Assignee not loaded");
//             return;
//         }
//         if (!currentUserId) {
//             toast.error("User not authenticated");
//             return;
//         }
//         const receiverId = assignee.id;
//         setSendingFollowUpMessage(true);
//         try {
//             const payload = {
//                 sender: currentUserId, // Explicitly include sender (logged-in user - ticket creator)
//                 receiver: receiverId,
//                 ticket_no: currentChatTicket.id,
//                 message: messageText.trim(),
//             };
//             const resData = await sendMessage(payload);
//             const newMessage = {
//                 ...resData,
//                 sender: currentUserId,
//                 createdon: new Date().toISOString(),
//             };

//             // Add to local state and sort
//             const updatedChats = [...followUpChats, newMessage].sort((a, b) => new Date(a.createdon) - new Date(b.createdon));
//             setFollowUpChats(updatedChats);
//             setNewFollowUpMessage("");

//             toast.success("Message sent successfully!");
//         } catch (err) {
//             toast.error("Failed to send message");
//             console.error("Error sending message:", err);
//         } finally {
//             setSendingFollowUpMessage(false);
//         }
//     };

//     const handleResolveSolution = () => {
//         // TODO: Call API to resolve solution
//         setIsResolved(true);
//         toast.success("Solution resolved!");
//     };

//     const handleApproveSolution = () => {
//         // TODO: Call API to approve solution
//         setIsApproved(true);
//         toast.success("Solution approved!");
//     };

//     const handleChatDrawerOpen = async (ticketNo) => {
//         if (!ticketNo || !currentUserId) {
//             toast.error("No ticket or user ID provided");
//             return;
//         }
//         const ticket = selectedTickets.find(t => t.ticket_no == ticketNo);
//         if (!ticket) {
//             toast.error("Ticket not found in current list");
//             return;
//         }
//         setChatTab(0); // Default to Follow-up tab
//         setLoadingFollowUpChats(true);
//         setShowFollowUpChat(true);
//         setFollowUpChats([]);
//         // Reset solved states
//         setIsSolvedTicket(false);
//         setSolutionText("");
//         setIsResolved(false);
//         setIsApproved(false);
//         try {
//             // Fetch ticket details to get assignee_detail
//             const ticketDetails = await getTicketDetails(ticketNo);
//             const ticketData = ticketDetails.ticket || ticketDetails;
//             const assigneesDetails = ticketData.assignees_detail; // It's an array
//             if (!assigneesDetails || assigneesDetails.length === 0) {
//                 throw new Error("Assignee details not found");
//             }
//             const assigneeDetail = assigneesDetails[0]; // Take the first assignee
//             if (!assigneeDetail.id) {
//                 throw new Error("Assignee ID not found");
//             }
//             setAssignee(assigneeDetail);
//             // Set ticket details
//             setCurrentChatTicket({
//                 id: ticketNo,
//                 title: ticketData.title || ticket.title || "",
//                 description: ticketData.description || ticket.description || "",
//             });
//             // Check if solved ticket and set solution data (for ticket creator view)
//             if (selectedType === "solved") {
//                 setIsSolvedTicket(true);
//                 // Assuming ticketData has solution_text, resolved_status, approved_status fields
//                 // Adjust field names based on your API response
//                 setSolutionText(ticketData.solution_text || ticketData.resolution_text || "");
//                 setIsResolved(ticketData.resolved_status === "yes" || ticketData.is_resolved || false);
//                 setIsApproved(ticketData.approved_status === "yes" || ticketData.is_approved || false);
//             }
//             const receiverId = assigneeDetail.id;
//             // Fetch messages based on ticket_no and between current user (ticket creator) and assignee
//             const ticketMessages = await fetchTicketMessages(ticketNo, currentUserId, receiverId);
//             const messagesCount = ticketMessages.length;
//             console.log('Fetched messages count:', messagesCount);

//             // Sort messages by timestamp
//             const sortedTicketMessages = ticketMessages.sort((a, b) =>
//                 new Date(a.createdon) - new Date(b.createdon)
//             );

//             setFollowUpChats(sortedTicketMessages);
//         } catch (err) {
//             console.error("Error fetching ticket details or chats:", err);
//             toast.error("Failed to fetch ticket details or chats");
//             setShowFollowUpChat(false);
//         } finally {
//             setLoadingFollowUpChats(false);
//         }
//     };

//     const handleChatDrawerClose = () => {
//         setShowFollowUpChat(false);
//         setCurrentChatTicket(null);
//         setAssignee(null);
//         setFollowUpChats([]);
//         setLoadingFollowUpChats(false);
//         setChatTab(0);
//         // Reset solved states
//         setIsSolvedTicket(false);
//         setSolutionText("");
//         setIsResolved(false);
//         setIsApproved(false);
//     };

//     const filteredRows = useMemo(() => {
//         const searchLower = search.toLowerCase().trim();

//         if (!searchLower && !department) {
//             return selectedTickets;
//         }

//         return selectedTickets.filter((row) => {
//             // Department filter (separate dropdown)
//             const matchesDept = department
//                 ? row.department_detail?.field_name === department
//                 : true;

//             if (!searchLower) return matchesDept;

//             // 1. Ticket Number
//             if (String(row.ticket_no || "").toLowerCase().includes(searchLower)) return true;

//             // 2. Title
//             if (row.title?.toLowerCase().includes(searchLower)) return true;

//             // 3. Description
//             if (row.description?.toLowerCase().includes(searchLower)) return true;

//             // 4. Status
//             if (row.status_detail?.field_values?.toLowerCase().includes(searchLower)) return true;

//             // 5. Priority
//             if (row.priority_detail?.field_values?.toLowerCase().includes(searchLower)) return true;

//             // 6. Category
//             if (row.category_detail?.category_name?.toLowerCase().includes(searchLower)) return true;

//             // 7. Subcategory
//             if (row.subcategory_detail?.subcategory_name?.toLowerCase().includes(searchLower)) return true;

//             // 8. Department
//             if (row.department_detail?.field_name?.toLowerCase().includes(searchLower)) return true;

//             // 9. Location
//             if (row.location_detail?.field_name?.toLowerCase().includes(searchLower)) return true;

//             // 10. Requested By (email or name)
//             if (row.requested_detail?.email?.toLowerCase().includes(searchLower)) return true;
//             if (row.requested_detail?.name?.toLowerCase().includes(searchLower)) return true;

//             // 11. Dates (Open Date / Last Update) - match formatted or raw
//             // const openDate = new Date(row.created_date).toLocaleDateString().toLowerCase();
//             // const updateDate = new Date(row.updated_date).toLocaleDateString().toLowerCase();
//             // if (openDate.includes(searchLower) || updateDate.includes(searchLower)) return true;

//             return false;
//         }).filter((row) => {
//             // Apply department filter at the end (in case user uses both search + department dropdown)
//             return department ? row.department_detail?.field_name === department : true;
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

//     const priorityColors = {
//         "Critical": "#D32F2F",
//         "Very High": "#b43d3bff",
//         "High": "#FB8C00",
//         "Medium": "#FDD835",
//         "Low": "#43A047",
//         "Very Low": "#1E88E5",
//     };

//     const statusColors = {
//         "Pending": "#EF6C00",
//         "Approved": "#2E7D32",
//         "On Hold": "#1565C0",
//         "Rejected": "#C62828",
//         "SLA Breached": "#F9A825",
//     };

//     return (
//         <Box sx={{ width: "100%", mb: 2 }}>
//             <Grid container spacing={1} sx={{ mb: 4 }}>
//                 {statusCards.map((item) => (
//                     <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }} key={item.id}>
//                         <Card
//                             onClick={() => handleCardClick(item.id)}
//                             sx={{
//                                 p: 1,
//                                 transition: "0.3s ease",
//                                 maxWidth: "600px",
//                                 maxHeight: 90,
//                                 borderRadius: 5,
//                                 "&:hover": {
//                                     background: "linear-gradient(135deg, #667eea, #764ba2)",
//                                     color: "#fff",
//                                     transform: "scale(1.03)",
//                                 }
//                             }}
//                         >
//                             <CardContent sx={{ display: "flex", gap: 2, alignItems: "center" }}>
//                                 <Box
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
//                                 <Box>
//                                     <Typography fontSize={{ xs: 25, sm: 20, md: 25 }} fontWeight={600}>
//                                         {item.count}
//                                     </Typography>
//                                     <Typography fontSize={{ xs: 20, sm: 14, md: 20 }} fontWeight={550}>
//                                         {item.label}
//                                     </Typography>
//                                 </Box>
//                             </CardContent>
//                         </Card>
//                     </Grid>
//                 ))}
//             </Grid>
//             <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
//                 <CardContent>
//                     {selectedType && (
//                         <Box>
//                             <Box
//                                 sx={{
//                                     display: "flex",
//                                     flexDirection: isMobile || isTablet ? "column" : "row",
//                                     justifyContent: !isMobile || !isTablet ? "space-between" : undefined,
//                                     alignItems: isMobile ? "flex-start" : "center",
//                                     mb: 4,
//                                     gap: isMobile ? 2 : 0,
//                                 }}
//                             >
//                                 <Typography
//                                     variant="h5"
//                                     fontWeight={700}
//                                     sx={{
//                                         color: "#2D3748",
//                                         width: isMobile || isTablet ? "100%" : "auto",
//                                     }}
//                                 >
//                                     {headingMap[selectedType] || "Tickets"}
//                                 </Typography>
//                                 <Box
//                                     sx={{
//                                         display: "flex",
//                                         flexDirection: isMobile ? "column" : "row",
//                                         flexWrap: isTablet ? "wrap" : "nowrap",
//                                         gap: 2,
//                                         width: isMobile || isTablet ? "100%" : "auto",
//                                         justifyContent: isTablet ? "flex-start" : "flex-end",
//                                         mt: isTablet ? 1.5 : 0
//                                     }}
//                                 >
//                                     <Autocomplete
//                                         options={departmentList}
//                                         value={department}
//                                         onChange={(e, newValue) => setDepartment(newValue)}
//                                         sx={{
//                                             width: { xs: "100%", sm: 300, md: 200 },
//                                             "& .MuiOutlinedInput-root": {
//                                                 borderRadius: 2,
//                                             }
//                                         }}
//                                         renderInput={(params) => (
//                                             <TextField {...params} label="Department" size="small" variant="outlined" />
//                                         )}
//                                     />
//                                     <TextField
//                                         size="small"
//                                         label="Search"
//                                         value={search}
//                                         onChange={(e) => setSearch(e.target.value)}
//                                         variant="outlined"
//                                         sx={{
//                                             width: { xs: "100%", sm: 300, md: 200 },
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
//                                             color: "info",
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
//                             {isMobile ? (
//                                 <Box>
//                                     {filteredRows.length > 0 ? (
//                                         filteredRows
//                                             .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//                                             .map((t) => (
//                                                 <Card
//                                                     sx={{ mb: 2, borderRadius: 2 }}
//                                                     key={t.id}
//                                                 >
//                                                     <CardContent>
//                                                         <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                                                             <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
//                                                                 <Typography fontWeight={700} color="#667eea">
//                                                                     #{t.ticket_no} -
//                                                                 </Typography>
//                                                                 <Chip
//                                                                     label={t.priority_detail?.field_values || "-"}
//                                                                     size="small"
//                                                                     sx={{
//                                                                         fontWeight: 800,
//                                                                         borderRadius: 50,
//                                                                         background: priorityColors[t.priority_detail?.field_values] || "#666",
//                                                                         color: "white",
//                                                                         animation: t.priority_detail?.field_values === "Critical" ? "pulse 2s infinite" : "none",
//                                                                     }}
//                                                                 />
//                                                             </Box>
//                                                             <Chip
//                                                                 label={t.status_detail?.field_values}
//                                                                 size="small"
//                                                                 sx={{
//                                                                     fontWeight: 700,
//                                                                     background: statusColors[t.status_detail?.field_values] || "#666",
//                                                                     color: "white",
//                                                                     borderRadius: 50,
//                                                                     py: 0.5,
//                                                                     px: 1,
//                                                                 }}
//                                                             />
//                                                         </Box>
//                                                         <Tooltip
//                                                             title={t.title}
//                                                             arrow
//                                                             placement="top"
//                                                         >
//                                                             <Typography
//                                                                 sx={{
//                                                                     maxWidth: 200,
//                                                                     color: "text.secondary",
//                                                                     whiteSpace: "nowrap",
//                                                                     overflow: "hidden",
//                                                                     textOverflow: "ellipsis",
//                                                                     cursor: "pointer",
//                                                                     mt: 0.5
//                                                                 }}
//                                                             >
//                                                                 {t.title}
//                                                             </Typography>
//                                                         </Tooltip>
//                                                         <Tooltip
//                                                             title={t.description || "No description"}
//                                                             arrow
//                                                             placement="top"
//                                                         >
//                                                             <Typography
//                                                                 sx={{
//                                                                     maxWidth: 200,
//                                                                     color: "text.secondary",
//                                                                     whiteSpace: "nowrap",
//                                                                     overflow: "hidden",
//                                                                     textOverflow: "ellipsis",
//                                                                     cursor: "pointer",
//                                                                     mt: 0.5
//                                                                 }}
//                                                             >
//                                                                 {t.description || "-"}
//                                                             </Typography>
//                                                         </Tooltip>
//                                                         <Typography fontSize={13} mt={1.5}>
//                                                             <strong style={{ color: "#4A5568" }}>Category:</strong>{" "}
//                                                             <span style={{ color: "#2D3748" }}>
//                                                                 {t.category_detail?.category_name || "-"} /{" "}
//                                                                 {t.subcategory_detail?.subcategory_name || "-"}
//                                                             </span>
//                                                         </Typography>
//                                                         <Typography fontSize={13} mt={1}>
//                                                             <strong style={{ color: "#4A5568" }}>Dept | Loc:</strong>{" "}
//                                                             <span style={{ color: "#2D3748" }}>
//                                                                 {t.department_detail?.field_name || "-"} |{" "}
//                                                                 {t.location_detail?.field_name || "-"}
//                                                             </span>
//                                                         </Typography>
//                                                         <Typography fontSize={12} color="#718096" mt={1.5}>
//                                                             Open: {new Date(t.created_date).toLocaleDateString()} <br />
//                                                             Update: {new Date(t.updated_date).toLocaleDateString()}
//                                                         </Typography>
//                                                         <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2, gap: 1 }}>
//                                                             <Tooltip title="Follow-up Chat">
//                                                                 <IconButton
//                                                                     onClick={() => handleChatDrawerOpen(t.ticket_no)}
//                                                                     size="small"
//                                                                     sx={{ color: "#667eea" }}
//                                                                 >
//                                                                     <ChatIcon />
//                                                                 </IconButton>
//                                                             </Tooltip>
//                                                             <Tooltip title="View Details">
//                                                                 <IconButton
//                                                                     onClick={() => handleTicketClick(t.ticket_no)}
//                                                                     sx={{ color: "#667eea" }}
//                                                                     size="small"
//                                                                 >
//                                                                     <VisibilityIcon />
//                                                                 </IconButton>
//                                                             </Tooltip>

//                                                         </Box>
//                                                     </CardContent>
//                                                 </Card>
//                                             ))
//                                     ) : (
//                                         <Typography align="center" py={4} color="#718096">
//                                             No tickets found.
//                                         </Typography>
//                                     )}
//                                 </Box>
//                             ) : (
//                                 <Card sx={{ borderRadius: 3, boxShadow: 2, overflow: "hidden" }}>
//                                     <TableContainer>
//                                         <Table stickyHeader>
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
//                                                                 <TableCell>
//                                                                     <Tooltip
//                                                                         title={t.title}
//                                                                         arrow
//                                                                         placement="top"
//                                                                     >
//                                                                         <Typography
//                                                                             sx={{
//                                                                                 maxWidth: 150,
//                                                                                 whiteSpace: "nowrap",
//                                                                                 overflow: "hidden",
//                                                                                 textOverflow: "ellipsis",
//                                                                                 cursor: "pointer",
//                                                                                 mt: 0.5
//                                                                             }}
//                                                                         >
//                                                                             {t.title}
//                                                                         </Typography>
//                                                                     </Tooltip>
//                                                                 </TableCell>

//                                                                 <TableCell>
//                                                                     <Tooltip
//                                                                         title={t.description || "No description"}
//                                                                         arrow
//                                                                         placement="top"
//                                                                     >
//                                                                         <Typography
//                                                                             sx={{
//                                                                                 maxWidth: 150,
//                                                                                 whiteSpace: "nowrap",
//                                                                                 overflow: "hidden",
//                                                                                 textOverflow: "ellipsis",
//                                                                                 cursor: "pointer",
//                                                                                 //color: "#4A5568"
//                                                                             }}
//                                                                         >
//                                                                             {t.description || "-"}
//                                                                         </Typography>
//                                                                     </Tooltip>
//                                                                 </TableCell>
//                                                                 <TableCell>
//                                                                     <Typography fontWeight={500} >
//                                                                         {t.status_detail?.field_values}
//                                                                     </Typography>
//                                                                     <Typography fontSize="0.85rem" >
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
//                                                                             <Typography fontWeight={500} >
//                                                                                 {t.category_detail?.category_name || "-"}
//                                                                             </Typography>
//                                                                             <Typography fontSize="0.85rem" >
//                                                                                 {t.subcategory_detail?.subcategory_name || "-"}
//                                                                             </Typography>
//                                                                         </Box>
//                                                                     </Tooltip>
//                                                                 </TableCell>
//                                                                 <TableCell>
//                                                                     <Typography fontWeight={500}>
//                                                                         {t.department_detail?.field_name}
//                                                                     </Typography>
//                                                                     <Typography fontSize="0.85rem">
//                                                                         {t.location_detail?.field_name}
//                                                                     </Typography>
//                                                                 </TableCell>
//                                                                 <TableCell >
//                                                                     {t.requested_detail?.email}
//                                                                 </TableCell>
//                                                                 <TableCell>
//                                                                     <Typography fontSize="0.9rem">
//                                                                         {new Date(t.created_date).toLocaleDateString()}
//                                                                     </Typography>
//                                                                     <Typography fontSize="0.8rem">
//                                                                         {new Date(t.updated_date).toLocaleDateString()}
//                                                                     </Typography>
//                                                                 </TableCell>
//                                                                 <TableCell>
//                                                                     <Box sx={{ display: "flex", gap: 1 }}>
//                                                                         <Tooltip title="Follow-up Chat">
//                                                                             <IconButton
//                                                                                 onClick={() => handleChatDrawerOpen(t.ticket_no)}
//                                                                                 size="small"
//                                                                                 sx={{ color: "#667eea" }}
//                                                                             >
//                                                                                 <ChatIcon />
//                                                                             </IconButton>
//                                                                         </Tooltip>
//                                                                         <Tooltip>
//                                                                             <IconButton
//                                                                                 onClick={() => handleTicketClick(t.ticket_no)}
//                                                                                 size="small"
//                                                                                 sx={{ color: "#667eea" }}
//                                                                             >
//                                                                                 <VisibilityIcon />
//                                                                             </IconButton>
//                                                                         </Tooltip>
//                                                                     </Box>
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
//                                 </Card>
//                             )}
//                             {filteredRows.length > 0 && (
//                                 <Stack
//                                     direction={isMobile ? "column" : "row"}
//                                     justifyContent="space-between"
//                                     alignItems="center"
//                                     spacing={isMobile ? 1.5 : 0}
//                                     sx={{
//                                         py: 2,
//                                         px: { xs: 0, sm: 3 },
//                                         borderTop: "1px solid #E2E8F0",
//                                         textAlign: isMobile ? "center" : "left",
//                                     }}
//                                 >
//                                     <Typography
//                                         variant="body2"
//                                         color="#718096"
//                                         sx={{ fontSize: { xs: "13px", sm: "14px" } }}
//                                     >
//                                         Showing {page * rowsPerPage + 1} to{" "}
//                                         {Math.min((page + 1) * rowsPerPage, filteredRows.length)} of{" "}
//                                         {filteredRows.length} tickets
//                                     </Typography>
//                                     <Pagination
//                                         count={Math.ceil(filteredRows.length / rowsPerPage)}
//                                         page={page + 1}
//                                         onChange={(e, value) => setPage(value - 1)}
//                                         variant="outlined"
//                                         shape="rounded"
//                                         showFirstButton
//                                         showLastButton
//                                         siblingCount={1}
//                                         boundaryCount={1}
//                                         size={isMobile ? "small" : "medium"}
//                                         sx={{
//                                             "& .MuiPaginationItem-root": {
//                                                 borderRadius: "8px",
//                                                 borderColor: "#CBD5E0",
//                                                 color: "#4A5568",
//                                                 fontSize: { xs: "12px", sm: "14px" },
//                                                 minWidth: { xs: 32, sm: 36 },
//                                                 "&.Mui-selected": {
//                                                     backgroundColor: "#667eea",
//                                                     color: "#fff",
//                                                     borderColor: "#667eea",
//                                                     "&:hover": {
//                                                         backgroundColor: "#556cd6",
//                                                     },
//                                                 },
//                                                 "&:hover": {
//                                                     backgroundColor: "#F7FAFC",
//                                                 },
//                                             },
//                                         }}
//                                     />
//                                 </Stack>
//                             )}
//                         </Box>
//                     )}
//                 </CardContent>
//             </Card>

//             <Drawer
//                 anchor="right"
//                 open={showFollowUpChat}
//                 onClose={handleChatDrawerClose}
//                 PaperProps={{ sx: { width: { xs: "100%", sm: 500 } } }}
//             >
//                 <Box sx={{
//                     display: "flex",
//                     flexDirection: "column",
//                     height: "100%",
//                     bgcolor: "background.paper"
//                 }}>
//                     {/* Header */}
//                     <Box sx={{
//                         display: "flow",
//                         p: 2,
//                         borderBottom: 1,
//                         borderColor: "divider",
//                         bgcolor: "primary.main",
//                         color: "white"
//                     }}>
//                         <Typography variant="caption" sx={{ color: "white", verticalAlign: "middle" }}>
//                             Ticket #{currentChatTicket?.id}
//                         </Typography>
//                         <Typography variant="caption" sx={{ color: "white" }}>
//                             {currentChatTicket?.title}
//                         </Typography>
//                         <Typography variant="caption" sx={{ color: "white" }}>
//                             {currentChatTicket?.description}
//                         </Typography>
//                     </Box>
//                     {/* Tab Buttons */}
//                     <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
//                         <Tabs
//                             value={chatTab}
//                             onChange={(e, newValue) => setChatTab(newValue)}
//                             centered
//                         >
//                             <Tab label="Follow-up" icon={<ChatIcon />} />
//                             {isSolvedTicket && <Tab label="Solution" icon={<DoneAllIcon />} />}
//                         </Tabs>
//                     </Box>
//                     {/* Tab Content */}
//                     <Box sx={{ flex: 1 }}>
//                         {chatTab === 0 && (
//                             // Follow-up Tab: Chat Messages
//                             <Box sx={{
//                                 display: "flex",
//                                 flexDirection: "column",
//                                 height: "100%"
//                             }}>
//                                 {/* Messages Area */}
//                                 <Box sx={{
//                                     flex: 1,
//                                     overflowY: "auto",
//                                     p: 2,
//                                     display: "flex",
//                                     flexDirection: "column",
//                                     gap: 2
//                                 }}>
//                                     {loadingFollowUpChats ? (
//                                         <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
//                                             <CircularProgress />
//                                         </Box>
//                                     ) : groupedChats.length === 0 ? (
//                                         <Box sx={{
//                                             display: "flex",
//                                             flexDirection: "column",
//                                             justifyContent: "center",
//                                             alignItems: "center",
//                                             height: "100%",
//                                             color: "text.secondary"
//                                         }}>
//                                             <ChatIcon sx={{ fontSize: 60, mb: 2, opacity: 0.5 }} />
//                                             <Typography>No messages yet. Start the conversation!</Typography>
//                                         </Box>
//                                     ) : (
//                                         groupedChats.map((group, groupIndex) => (
//                                             <Box key={group.date} sx={{ mb: 3 }}>
//                                                 <Divider sx={{ my: 2, width: "100%" }}>
//                                                     <Chip
//                                                         label={group.date}
//                                                         size="small"
//                                                         sx={{ bgcolor: "grey.200" }}
//                                                     />
//                                                 </Divider>
//                                                 {group.messages.map((msg, index) => {
//                                                     const isFromCurrentUser = msg.sender === currentUserId;

//                                                     return (
//                                                         <Box
//                                                             key={msg.id || index}
//                                                             sx={{
//                                                                 display: "flex",
//                                                                 justifyContent: isFromCurrentUser ? "flex-end" : "flex-start",
//                                                                 mb: 2
//                                                             }}
//                                                         >
//                                                             {!isFromCurrentUser ? (
//                                                                 <Box sx={{ display: "flex", alignItems: "flex-end", gap: 1 }}>
//                                                                     <Avatar sx={{ width: 40, height: 40, bgcolor: "grey.300" }}>
//                                                                         {getInitials(assignee?.name)}
//                                                                     </Avatar>
//                                                                     <Box
//                                                                         sx={{
//                                                                             maxWidth: "80%",
//                                                                             p: 2,
//                                                                             bgcolor: "grey.100",
//                                                                             color: "text.primary",
//                                                                             borderRadius: 2,
//                                                                             borderTopLeftRadius: 4,
//                                                                             borderTopRightRadius: 12,
//                                                                             borderBottomLeftRadius: 4,
//                                                                             borderBottomRightRadius: 12,
//                                                                             boxShadow: 1,
//                                                                         }}
//                                                                     >
//                                                                         <Typography variant="body1" sx={{ wordBreak: "break-word" }}>
//                                                                             {msg.message}
//                                                                         </Typography>

//                                                                         <Box sx={{
//                                                                             display: "flex",
//                                                                             justifyContent: "space-between",
//                                                                             alignItems: "center",
//                                                                             mt: 1
//                                                                         }}>
//                                                                             <Typography
//                                                                                 variant="caption"
//                                                                                 sx={{
//                                                                                     color: "text.secondary",
//                                                                                     fontSize: "0.7rem"
//                                                                                 }}
//                                                                             >
//                                                                                 {new Date(msg.createdon).toLocaleTimeString([], {
//                                                                                     hour: '2-digit',
//                                                                                     minute: '2-digit',
//                                                                                     hour12: true
//                                                                                 })}
//                                                                             </Typography>
//                                                                             <Typography
//                                                                                 variant="caption"
//                                                                                 sx={{
//                                                                                     ml: 1,
//                                                                                     color: "text.primary",
//                                                                                     fontSize: "0.75rem",
//                                                                                     fontWeight: "bold"
//                                                                                 }}
//                                                                             >
//                                                                                 {assignee?.name || "Assignee"}
//                                                                             </Typography>
//                                                                         </Box>
//                                                                     </Box>
//                                                                 </Box>
//                                                             ) : (
//                                                                 <Box sx={{ display: "flex", alignItems: "flex-end", gap: 1, flexDirection: "row-reverse" }}>
//                                                                     <Box
//                                                                         sx={{
//                                                                             maxWidth: "80%",
//                                                                             p: 2,
//                                                                             bgcolor: "primary.main",
//                                                                             color: "white",
//                                                                             borderRadius: 2,
//                                                                             borderTopLeftRadius: 12,
//                                                                             borderTopRightRadius: 4,
//                                                                             borderBottomLeftRadius: 12,
//                                                                             borderBottomRightRadius: 4,
//                                                                             boxShadow: 1,
//                                                                         }}
//                                                                     >
//                                                                         <Typography variant="body1" sx={{ wordBreak: "break-word" }}>
//                                                                             {msg.message}
//                                                                         </Typography>

//                                                                         <Box sx={{
//                                                                             display: "flex",
//                                                                             justifyContent: "space-between",
//                                                                             alignItems: "center",
//                                                                             mt: 1
//                                                                         }}>
//                                                                             <Typography
//                                                                                 variant="caption"
//                                                                                 sx={{
//                                                                                     color: "rgba(255,255,255,0.8)",
//                                                                                     fontSize: "0.7rem"
//                                                                                 }}
//                                                                             >
//                                                                                 {new Date(msg.createdon).toLocaleTimeString([], {
//                                                                                     hour: '2-digit',
//                                                                                     minute: '2-digit',
//                                                                                     hour12: true
//                                                                                 })}
//                                                                             </Typography>
//                                                                             <Typography
//                                                                                 variant="caption"
//                                                                                 sx={{
//                                                                                     mr: 1,
//                                                                                     color: "white",
//                                                                                     fontSize: "0.75rem",
//                                                                                     fontWeight: "bold"
//                                                                                 }}
//                                                                             >
//                                                                                 You
//                                                                             </Typography>
//                                                                         </Box>
//                                                                     </Box>
//                                                                     <Avatar sx={{ width: 40, height: 40, bgcolor: "primary.main", color: "white" }}>
//                                                                         {getInitials(currentUserName)}
//                                                                     </Avatar>
//                                                                 </Box>
//                                                             )}
//                                                         </Box>
//                                                     );
//                                                 })}
//                                             </Box>
//                                         ))
//                                     )}
//                                 </Box>
//                                 {/* Message Input */}
//                                 <Box sx={{
//                                     p: 2,
//                                     borderTop: 1,
//                                     borderColor: "divider",
//                                     bgcolor: "background.default"
//                                 }}>
//                                     <Box sx={{ display: "flex", gap: 1 }}>
//                                         <TextField
//                                             fullWidth
//                                             size="medium"
//                                             placeholder="Type your message..."
//                                             value={newFollowUpMessage}
//                                             onChange={e => setNewFollowUpMessage(e.target.value)}
//                                             disabled={sendingFollowUpMessage || !assignee}
//                                             onKeyPress={(e) => {
//                                                 if (e.key === 'Enter' && !e.shiftKey) {
//                                                     e.preventDefault();
//                                                     sendFollowUpMessageHandler(newFollowUpMessage);
//                                                 }
//                                             }}
//                                             multiline
//                                             maxRows={4}
//                                         />
//                                         <IconButton
//                                             onClick={() => sendFollowUpMessageHandler(newFollowUpMessage)}
//                                             disabled={!newFollowUpMessage.trim() || sendingFollowUpMessage || !assignee}
//                                             color="primary"
//                                             sx={{ alignSelf: "flex-end", height: 40, width: 40 }}
//                                         >
//                                             {sendingFollowUpMessage ? <CircularProgress size={20} /> : <SendIcon />}
//                                         </IconButton>
//                                     </Box>
//                                 </Box>
//                             </Box>
//                         )}
//                         {chatTab === 1 && isSolvedTicket && (
//                             // Solution Tab: Approve/Resolve Solution
//                             <Box sx={{
//                                 display: "flex",
//                                 flexDirection: "column",
//                                 justifyContent: "center",
//                                 alignItems: "center",
//                                 height: "100%",
//                                 p: 4,
//                                 gap: 2,
//                                 textAlign: "center"
//                             }}>
//                                 <DoneAllIcon sx={{ fontSize: 64, color: "success.main" }} />
//                                 <Typography variant="h6" fontWeight={600} color="text.primary">
//                                     Solution Provided
//                                 </Typography>
//                                 <Typography variant="body1" sx={{ mb: 3, wordBreak: "break-word", color: "text.primary" }}>
//                                     {solutionText}
//                                 </Typography>
//                                 <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
//                                     <Button
//                                         variant={isResolved ? "contained" : "outlined"}
//                                         color="success"
//                                         onClick={handleResolveSolution}
//                                         disabled={isResolved}
//                                         size="small"
//                                     >
//                                         {isResolved ? "Resolved" : "Resolve Solution"}
//                                     </Button>
//                                     <Button
//                                         variant={isApproved ? "contained" : "outlined"}
//                                         color="primary"
//                                         onClick={handleApproveSolution}
//                                         disabled={isApproved}
//                                         size="small"
//                                     >
//                                         {isApproved ? "Approved" : "Approve Solution"}
//                                     </Button>
//                                 </Box>
//                                 <Button
//                                     variant="outlined"
//                                     onClick={() => setChatTab(0)}
//                                     sx={{ mt: 1 }}
//                                 >
//                                     Back to Follow-up
//                                 </Button>
//                             </Box>
//                         )}
//                     </Box>
//                 </Box>
//             </Drawer>
//         </Box >
//     );
// };
// export default AdminTabs;

// import { useEffect, useMemo, useState } from "react";
// import { useTheme } from "@mui/material/styles";
// import {
//   Box, Card, CardContent, Typography, Grid, TextField, Button, Table, TableHead, TableRow, TableCell, TableBody, TableContainer,
//   useMediaQuery, Autocomplete, Stack, Pagination, Tooltip, CircularProgress, IconButton, Drawer, Divider, Chip, Avatar, Tabs, Tab
// } from "@mui/material";
// import NewReleasesIcon from '@mui/icons-material/NewReleases';
// import DoneAllIcon from '@mui/icons-material/DoneAll';
// import LockIcon from '@mui/icons-material/Lock';
// import VisibilityIcon from '@mui/icons-material/Visibility';
// import ChatIcon from '@mui/icons-material/Chat';
// import SendIcon from '@mui/icons-material/Send';
// import CancelIcon from '@mui/icons-material/Cancel';
// import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
// import CloseIcon from '@mui/icons-material/Close';
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { fetchMessages, sendMessage, getTicketDetails, fetchAdminTickets } from "../../Api";

// const AdminTabs = () => {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

//   const navigate = useNavigate();

//   const [selectedType, setSelectedType] = useState("new_assigned");
//   const [search, setSearch] = useState("");
//   const [department, setDepartment] = useState("");

//   // Admin dashboard data
//   const [adminData, setAdminData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Chat states
//   const [showFollowUpChat, setShowFollowUpChat] = useState(false);
//   const [followUpChats, setFollowUpChats] = useState([]);
//   const [loadingFollowUpChats, setLoadingFollowUpChats] = useState(false);
//   const [newFollowUpMessage, setNewFollowUpMessage] = useState("");
//   const [sendingFollowUpMessage, setSendingFollowUpMessage] = useState(false);
//   const [currentChatTicket, setCurrentChatTicket] = useState(null);
//   const [assignee, setAssignee] = useState(null);
//   const [currentUserId, setCurrentUserId] = useState(null);
//   const [currentUserName, setCurrentUserName] = useState("You");

//   // Load current user
//   useEffect(() => {
//     const userStr = localStorage.getItem("user");
//     if (userStr) {
//       const user = JSON.parse(userStr);
//       setCurrentUserId(user?.id);
//       setCurrentUserName(user?.name || user?.username || "You");
//     }
//   }, []);

//   // Fetch admin dashboard data
//   useEffect(() => {
//     const loadAdminData = async () => {
//       setLoading(true);
//       try {
//         const response = await fetchAdminTickets();
//         // The response is an object with counts and ticket lists
//         setAdminData(response);
//       } catch (err) {
//         console.error("Failed to load admin data:", err);
//         toast.error("Failed to load dashboard data");
//         setAdminData({});
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadAdminData();
//   }, []);

//   // Status cards using actual counts from API
//   const statusCards = [
//     { id: "new_assigned", label: "NEW", color: "warning", icon: <NewReleasesIcon />, count: adminData?.new_assigned || 0 },
//     { id: "solved", label: "SOLVED", color: "success", icon: <DoneAllIcon />, count: adminData?.solved || 0 },
//     { id: "closed", label: "CLOSED", color: "info", icon: <LockIcon />, count: adminData?.closed || 0 },
//     { id: "cancelled", label: "CANCELLED", color: "error", icon: <CancelIcon />, count: adminData?.cancelled || 0 },
//   ];

//   // Get tickets for selected tab
//   const selectedTickets = useMemo(() => {
//     if (!adminData) return [];
//     switch (selectedType) {
//       case "new_assigned": return adminData.new_assigned_tickets || [];
//       case "solved": return adminData.solved_tickets || [];
//       case "closed": return adminData.closed_tickets || [];
//       case "cancelled": return adminData.cancelled_tickets || [];
//       default: return [];
//     }
//   }, [adminData, selectedType]);

//   const departmentList = useMemo(() => {
//     return [...new Set(selectedTickets.map(t => t.department_detail?.field_name).filter(Boolean))];
//   }, [selectedTickets]);

//   const filteredTickets = useMemo(() => {
//     let filtered = selectedTickets;

//     if (department) {
//       filtered = filtered.filter(t => t.department_detail?.field_name === department);
//     }

//     if (search) {
//       const lower = search.toLowerCase();
//       filtered = filtered.filter(t =>
//         String(t.ticket_no || "").includes(search) ||
//         (t.title || "").toLowerCase().includes(lower) ||
//         (t.description || "").toLowerCase().includes(lower) ||
//         (t.status_detail?.field_name || "").toLowerCase().includes(lower) ||
//         (t.priority_detail?.field_name || "").toLowerCase().includes(lower) ||
//         (t.requested_detail?.email || "").toLowerCase().includes(lower)
//       );
//     }

//     return filtered;
//   }, [selectedTickets, search, department]);

//   const getInitials = (name) => {
//     if (!name) return "U";
//     return name.split(' ').map(n => n[0]?.toUpperCase() || '').join('').substring(0, 2);
//   };

//   const groupedChats = useMemo(() => {
//     const groups = {};
//     followUpChats.forEach(msg => {
//       const date = new Date(msg.createdon).toLocaleDateString();
//       if (!groups[date]) groups[date] = [];
//       groups[date].push(msg);
//     });
//     return Object.entries(groups)
//       .map(([date, msgs]) => ({ date, messages: msgs }))
//       .sort((a, b) => new Date(a.date) - new Date(b.date));
//   }, [followUpChats]);

//   const priorityColors = {
//     "Critical": "#D32F2F",
//     "Very High": "#E53935",
//     "High": "#FB8C00",
//     "Medium": "#FDD835",
//     "Low": "#43A047",
//     "Very Low": "#1E88E5"
//   };

//   const handleTicketClick = (ticketNo) => {
//     localStorage.setItem('selectedTicketId', ticketNo);
//     navigate('/Approval');
//   };

//   const handleChatDrawerOpen = async (ticketNo) => {
//     if (!ticketNo || !currentUserId) return toast.error("Missing info");

//     const ticket = selectedTickets.find(t => t.ticket_no == ticketNo);
//     if (!ticket) return toast.error("Ticket not found");

//     const assignees = ticket.assignees || ticket.assigned_users || [];
//     if (assignees.length === 0) return toast.warn("No assignee");

//     setAssignee(assignees[0]);
//     setCurrentChatTicket({ id: ticket.ticket_no, title: ticket.title });

//     setShowFollowUpChat(true);
//     setLoadingFollowUpChats(true);

//     try {
//       const messages = await fetchMessages();
//       const ticketMsgs = messages.filter(m => m.ticket_no == ticket.ticket_no);
//       setFollowUpChats(ticketMsgs.sort((a, b) => new Date(a.createdon) - new Date(b.createdon)));
//     } catch {
//       toast.error("Failed to load messages");
//     } finally {
//       setLoadingFollowUpChats(false);
//     }
//   };

//   const sendFollowUpMessageHandler = async (text) => {
//     if (!text.trim() || !assignee?.email || !currentChatTicket?.id) return;

//     setSendingFollowUpMessage(true);
//     try {
//       await sendMessage({
//         receiver: assignee.email.includes("@") ? assignee.email : assignee.id,
//         ticket_no: currentChatTicket.id,
//         message: text.trim(),
//       });

//       const messages = await fetchMessages();
//       const ticketMsgs = messages.filter(m => m.ticket_no == currentChatTicket.id);
//       setFollowUpChats(ticketMsgs.sort((a, b) => new Date(a.createdon) - new Date(b.createdon)));
//       setNewFollowUpMessage("");
//       toast.success("Message sent!");
//     } catch {
//       toast.error("Failed to send");
//     } finally {
//       setSendingFollowUpMessage(false);
//     }
//   };

//   if (loading) return <Box sx={{ p: 8, textAlign: "center" }}><CircularProgress /></Box>;

//   return (
//     <Box sx={{ p: { xs: 1, md: 3 } }}>
//       {/* Status Cards */}
//       <Grid container spacing={2} sx={{ mb: 4 }}>
//         {statusCards.map(card => (
//           <Grid item xs={12} sm={6} md={3} key={card.id}>
//             <Card
//               onClick={() => setSelectedType(card.id)}
//               sx={{
//                 cursor: "pointer",
//                 transition: "0.3s",
//                 "&:hover": { transform: "translateY(-5px)", boxShadow: 6 }
//               }}
//             >
//               <CardContent sx={{ display: "flex", alignItems: "center", gap: 3 }}>
//                 <Box sx={{ p: 2, bgcolor: `${card.color}.main`, borderRadius: 2, color: "white" }}>
//                   {card.icon}
//                 </Box>
//                 <Box>
//                   <Typography variant="h3" fontWeight={700}>{card.count}</Typography>
//                   <Typography variant="h6">{card.label}</Typography>
//                 </Box>
//               </CardContent>
//             </Card>
//           </Grid>
//         ))}
//       </Grid>

//       {/* Tickets Table */}
//       <Card>
//         <CardContent>
//           <Typography variant="h5" gutterBottom>
//             {selectedType.replace("_", " ").toUpperCase()} TICKETS
//           </Typography>

//           <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
//             <Autocomplete
//               options={departmentList}
//               value={department}
//               onChange={(_, v) => setDepartment(v)}
//               sx={{ minWidth: 200 }}
//               renderInput={p => <TextField {...p} label="Department" size="small" />}
//             />
//             <TextField
//               label="Search tickets..."
//               size="small"
//               value={search}
//               onChange={e => setSearch(e.target.value)}
//               sx={{ minWidth: 300 }}
//             />
//             <Button variant="outlined" onClick={() => { setSearch(""); setDepartment(""); }}>
//               Clear Filters
//             </Button>
//           </Box>

//           <TableContainer>
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   <TableCell><strong>Ticket No</strong></TableCell>
//                   <TableCell><strong>Title</strong></TableCell>
//                   <TableCell><strong>Status</strong></TableCell>
//                   <TableCell><strong>Priority</strong></TableCell>
//                   <TableCell><strong>Requester</strong></TableCell>
//                   <TableCell><strong>Department</strong></TableCell>
//                   <TableCell><strong>Created</strong></TableCell>
//                   <TableCell><strong>Actions</strong></TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {filteredTickets.length === 0 ? (
//                   <TableRow>
//                     <TableCell colSpan={8} align="center">No tickets found</TableCell>
//                   </TableRow>
//                 ) : (
//                   filteredTickets.map(t => (
//                     <TableRow key={t.ticket_no}>
//                       <TableCell>#{t.ticket_no}</TableCell>
//                       <TableCell>{t.title}</TableCell>
//                       <TableCell>
//                         <Chip label={t.status_detail?.field_name} size="small" />
//                       </TableCell>
//                       <TableCell>
//                         <Chip label={t.priority_detail?.field_name} color="warning" size="small" />
//                       </TableCell>
//                       <TableCell>{t.requested_detail?.email}</TableCell>
//                       <TableCell>{t.department_detail?.field_name}</TableCell>
//                       <TableCell>{new Date(t.created_date).toLocaleDateString()}</TableCell>
//                       <TableCell>
//                         <IconButton onClick={() => handleChatDrawerOpen(t.ticket_no)} size="small">
//                           <ChatIcon />
//                         </IconButton>
//                         <IconButton onClick={() => handleTicketClick(t.ticket_no)} size="small">
//                           <VisibilityIcon />
//                         </IconButton>
//                       </TableCell>
//                     </TableRow>
//                   ))
//                 )}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </CardContent>
//       </Card>

//       {/* Chat Drawer - Same beautiful design as before */}
//       <Drawer anchor="right" open={showFollowUpChat} onClose={() => setShowFollowUpChat(false)}>
//         <Box sx={{ width: { xs: "100%", sm: 500 }, height: "100%", display: "flex", flexDirection: "column" }}>
//           <Box sx={{ p: 2, bgcolor: "primary.main", color: "white", display: "flex", alignItems: "center", gap: 2 }}>
//             <IconButton onClick={() => setShowFollowUpChat(false)} sx={{ color: "white" }}>
//               <CloseIcon />
//             </IconButton>
//             <Avatar>{getInitials(assignee?.name || assignee?.email)}</Avatar>
//             <Box>
//               <Typography variant="h6">{assignee?.name || assignee?.email || "Assignee"}</Typography>
//               <Typography variant="body2">Ticket #{currentChatTicket?.id}</Typography>
//             </Box>
//           </Box>

//           <Box sx={{ flex: 1, overflowY: "auto", p: 2, bgcolor: "#f8f9fa" }}>
//             {loadingFollowUpChats ? (
//               <Box sx={{ textAlign: "center", mt: 8 }}><CircularProgress /></Box>
//             ) : groupedChats.length === 0 ? (
//               <Box sx={{ textAlign: "center", mt: 8, color: "text.secondary" }}>
//                 <ChatIcon sx={{ fontSize: 80, opacity: 0.3 }} />
//                 <Typography>No messages yet</Typography>
//               </Box>
//             ) : (
//               groupedChats.map(g => (
//                 <Box key={g.date} sx={{ mb: 4 }}>
//                   <Box sx={{ textAlign: "center", my: 2 }}>
//                     <Chip label={g.date} size="small" sx={{ bgcolor: "white" }} />
//                   </Box>
//                   {g.messages.map(m => {
//                     const isMe = m.sender == currentUserId;
//                     return (
//                       <Box key={m.id} sx={{ display: "flex", justifyContent: isMe ? "flex-end" : "flex-start", mb: 2 }}>
//                         <Box sx={{
//                           maxWidth: "75%",
//                           p: 2,
//                           bgcolor: isMe ? "primary.main" : "white",
//                           color: isMe ? "white" : "black",
//                           borderRadius: 18,
//                           boxShadow: 1,
//                         }}>
//                           <Typography>{m.message}</Typography>
//                           <Typography variant="caption" sx={{ opacity: 0.8, display: "block", mt: 1, textAlign: "right" }}>
//                             {new Date(m.createdon).toLocaleTimeString()}
//                           </Typography>
//                         </Box>
//                       </Box>
//                     );
//                   })}
//                 </Box>
//               ))
//             )}
//           </Box>

//           <Box sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
//             <Box sx={{ display: "flex", gap: 1 }}>
//               <TextField
//                 fullWidth
//                 size="small"
//                 placeholder="Type message..."
//                 value={newFollowUpMessage}
//                 onChange={e => setNewFollowUpMessage(e.target.value)}
//                 onKeyPress={e => e.key === "Enter" && !e.shiftKey && sendFollowUpMessageHandler(newFollowUpMessage)}
//               />
//               <IconButton color="primary" onClick={() => sendFollowUpMessageHandler(newFollowUpMessage)}>
//                 <SendIcon />
//               </IconButton>
//             </Box>
//           </Box>
//         </Box>
//       </Drawer>
//     </Box>
//   );
// };

// export default AdminTabs;

import { useEffect, useMemo, useState } from "react";
import { useTheme } from "@mui/material/styles";
import { Box, Card, CardContent, Typography, Grid, TextField, Button, Table, TableHead, TableRow, TableCell, TableBody, TableContainer, useMediaQuery, Autocomplete, Stack, CircularProgress, IconButton, Drawer, Divider, Chip, Avatar, Icon, Tooltip, Pagination, Tabs, Tab } from "@mui/material";
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ChatIcon from '@mui/icons-material/Chat';
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import SendIcon from '@mui/icons-material/Send';
import SecurityIcon from "@mui/icons-material/Security"; // or Lock, Shield, etc.
import CancelIcon from '@mui/icons-material/Cancel';
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { fetchMessages, sendMessage, fetchAdminTickets } from "../../Api";

const AdminTabs = () => {

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

    const navigate = useNavigate();

    const [selectedType, setSelectedType] = useState("new_assigned");
    const [search, setSearch] = useState("");
    const [department, setDepartment] = useState("");

    const [adminData, setAdminData] = useState(null);
    console.log("admindata", adminData?.admin_stats);
    const [loading, setLoading] = useState(true);

    // Chat states
    const [showFollowUpChat, setShowFollowUpChat] = useState(false);
    const [followUpChats, setFollowUpChats] = useState([]);
    const [loadingFollowUpChats, setLoadingFollowUpChats] = useState(false);
    const [newFollowUpMessage, setNewFollowUpMessage] = useState("");
    const [sendingFollowUpMessage, setSendingFollowUpMessage] = useState(false);
    const [currentChatTicket, setCurrentChatTicket] = useState(null);
    const [assignee, setAssignee] = useState(null);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [currentUserName, setCurrentUserName] = useState("You");
    const [currentEntityId, setCurrentEntityId] = useState(null); // Critical for entity_id
    
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const [chatTab, setChatTab] = useState(0);

    // Ticket data
    const [currentTicketData, setCurrentTicketData] = useState(null);

    // Add this state declaration
    const [isProtectedMode, setIsProtectedMode] = useState(false);
    const [revealedMessages, setRevealedMessages] = useState(new Set());
    const [myProtectedMessages, setMyProtectedMessages] = useState({});

    // Clarification states
    const [clarificationText, setClarificationText] = useState("");
    const [sendingClarification, setSendingClarification] = useState(false);
    
    // Load current user
    useEffect(() => {
        const userStr = localStorage.getItem("user");
        if (userStr) {
            const user = JSON.parse(userStr);
            setCurrentUserId(user?.id);
            setCurrentUserName(user?.name || user?.username || "You");

        }
    }, []);

    // Fetch admin data
    useEffect(() => {
        const loadAdminData = async () => {
            setLoading(true);
            try {
                const response = await fetchAdminTickets();
                console.log("Admin API Response:", response); // Remove after confirming it works

                // API returns direct object → use directly
                setAdminData(response || {});
            } catch (err) {
                console.error("Failed to load admin data:", err);
                toast.error("Failed to load dashboard data");
                setAdminData({});
            } finally {
                setLoading(false);
            }
        };

        loadAdminData();
    }, []);

    // Status cards - using exact keys from your API
    const statusCards = [
        { id: "new_assigned", label: "NEW", color: "warning", icon: <NewReleasesIcon />, count: adminData?.admin_stats?.new_assigned || 0 },
        { id: "solved", label: "SOLVED", color: "success", icon: <DoneAllIcon />, count: adminData?.admin_stats?.solved || 0 },
        { id: "closed", label: "CLOSED", color: "info", icon: <LockIcon />, count: adminData?.admin_stats?.closed || 0 },
        { id: "cancelled", label: "CANCELLED", color: "error", icon: <CancelIcon />, count: adminData?.admin_stats?.cancelled || 0 },
        { id: "clarification_applied", label: "CLARIFICATION APPLIED", color: "error", icon: <CancelIcon />, count: adminData?.admin_stats?.clarification_applied || 0 },
        { id: "clarification_required", label: "CLARIFICATION REQUIRED", color: "error", icon: <CancelIcon />, count: adminData?.admin_stats?.clarification_required || 0 },
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

    // Get tickets for selected tab - using exact array keys from your API
    const selectedTickets = useMemo(() => {
        if (!adminData) return [];

        const ticketMap = {
            new_assigned: adminData?.admin_stats?.new_assigned_tickets || [],
            solved: adminData?.admin_stats?.solved_tickets || [],
            closed: adminData?.admin_stats?.closed_tickets || [],
            cancelled: adminData?.admin_stats?.cancelled_tickets || [],
            clarification_applied: adminData?.admin_stats?.clarification_applied_tickets || [],
            clarification_required: adminData?.admin_stats?.clarification_required_tickets || [],
        };

        return ticketMap[selectedType] || [];
    }, [adminData, selectedType]);

    const departmentList = useMemo(() => {
        return [...new Set(selectedTickets.map(t => t.department_detail?.field_name).filter(Boolean))];
    }, [selectedTickets]);

    const filteredTickets = useMemo(() => {
        let list = selectedTickets;

        if (department) {
            list = list.filter(t => t.department_detail?.field_name === department);
        }

        if (search.trim()) {
            const term = search.toLowerCase().trim();
            list = list.filter(t =>
                String(t.ticket_no || "").toLowerCase().includes(term) ||
                (t.title || "").toLowerCase().includes(term) ||
                (t.description || "").toLowerCase().includes(term) ||
                (t.status_detail?.field_name || "").toLowerCase().includes(term) ||
                (t.priority_detail?.field_name || "").toLowerCase().includes(term) ||
                (t.requested_detail?.email || "").toLowerCase().includes(term) ||
                (t.category_detail?.category_name || "").toLowerCase().includes(term)
            );
        }

        return list;
    }, [selectedTickets, search, department]);

    const getInitials = (name) => {
        if (!name) return "U";
        return name.split(' ').map(n => n[0]?.toUpperCase() || '').join('').substring(0, 2);
    };

    const groupedChats = useMemo(() => {
        const groups = {};
        followUpChats.forEach(msg => {
            const date = new Date(msg.createdon).toLocaleDateString();
            if (!groups[date]) groups[date] = [];
            groups[date].push(msg);
        });
        return Object.entries(groups)
            .map(([date, msgs]) => ({ date, messages: msgs }))
            .sort((a, b) => new Date(a.date) - new Date(b.date));
    }, [followUpChats]);

    const handleTicketClick = (ticketNo) => {
        console.log('Storing ticket No:', ticketNo);
        localStorage.setItem('selectedTicketId', ticketNo);
        console.log('Navigating to Approval');
        navigate('/Approval');
    };

    const handleChatDrawerOpen = async (ticketNo) => {
        if (!ticketNo || !currentUserId) {
            toast.error("Missing ticket or user info");
            return;
        }

        const ticket = selectedTickets.find(t => t.ticket_no == ticketNo);
        if (!ticket) {
            toast.error("Ticket not found");
            return;
        }

        const assignees = ticket.assigned_users || ticket.assignees || [];
        if (assignees.length === 0) {
            toast.warn("No assignee");
            return;
        }

        setAssignee(assignees[0]);
        setCurrentChatTicket({ id: ticket.ticket_no, title: ticket.title });
        setShowFollowUpChat(true);
        setLoadingFollowUpChats(true);

        try {
            const messages = await fetchMessages();
            const ticketMsgs = messages.filter(m => m.ticket_no == ticket.ticket_no);
            setFollowUpChats(ticketMsgs.sort((a, b) => new Date(a.createdon) - new Date(b.createdon)));
        } catch (err) {
            toast.error("Failed to load messages");
        } finally {
            setLoadingFollowUpChats(false);
        }
    };

    const isTicketSolved = () => currentTicketData?.status_detail?.field_name === "Solved";

    const sendFollowUpMessageHandler = async (text) => {
        if (!text.trim() || !assignee || !currentChatTicket?.id) return;

        setSendingFollowUpMessage(true);
        try {
            await sendMessage({
                receiver: assignee.id,
                //receiver: assignee.id,
                ticket_no: currentChatTicket.id,
                message: text.trim(),
            });

            const messages = await fetchMessages();
            const ticketMsgs = messages.filter(m => m.ticket_no == currentChatTicket.id);
            setFollowUpChats(ticketMsgs.sort((a, b) => new Date(a.createdon) - new Date(b.createdon)));
            setNewFollowUpMessage("");
            toast.success("Message sent!");
        } catch (err) {
            toast.error("Failed to send message");
        } finally {
            setSendingFollowUpMessage(false);
        }
    };

    const handleSolutionSubmit = async () => {
        if (!currentChatTicket?.id || !currentTicketData) {
          toast.error("Ticket not loaded");
          return;
        }
    
        let entityId = currentTicketData?.entity_id || currentEntityId;
        if (!entityId) {
          toast.error("Entity ID not found. Contact administrator.");
          return;
        }
        if (!currentEntityId) {
          toast.error("Your entity is not configured. Contact admin.");
          return;
        }
    
        try {
          const ticketNoStr = String(currentChatTicket.id);
    
          const formData = new FormData();
          formData.append("title", currentTicketData.title || "");
          formData.append("description", currentTicketData.description || "");
          formData.append(
            "category",
            currentTicketData.category || currentTicketData.category_detail?.id || ""
          );
          formData.append("status", "156");
          formData.append("entity_id", String(currentEntityId));
          //formData.append("entity_id", String(entityId).trim());
    
          const assignedUsers = currentTicketData.assignees_detail || currentTicketData.assigned_users || [];
          const assignedGroups = currentTicketData.assigned_groups_detail || currentTicketData.assigned_groups || [];
    
          let assignedTypeIndex = 0;
          assignedUsers.forEach((user, index) => {
            if (user?.email) formData.append(`assignee[${index}]`, user.email);
          });
          if (assignedUsers.length > 0) formData.append(`assigned_to_type[${assignedTypeIndex++}]`, "user");
          assignedGroups.forEach((group, index) => {
            if (group?.id) formData.append(`assigned_group[${index}]`, group.id);
          });
          if (assignedGroups.length > 0) formData.append(`assigned_to_type[${assignedTypeIndex}]`, "group");
    
          const result = await updateTicket(ticketNoStr, formData);
          if (!result.success) throw new Error(result.error || "Update failed");
    
          toast.success("Ticket marked as Solved successfully!");
          setShowFollowUpChat(false);
          loadData();
          setSelectedType("solved");
          setTimeout(() => window.location.reload(), 500);
        } catch (err) {
          console.error("Solution submit error:", err);
          toast.error("Failed to mark as solved");
        }
    };

    const handleSendClarification = async () => {
        if (!clarificationText.trim()) {
          toast.error("Please enter a clarification message");
          return;
        }
        if (!currentChatTicket?.id || !currentTicketData) {
          toast.error("Ticket not loaded");
          return;
        }
        if (!currentEntityId) {
          toast.error("Your entity is not configured. Contact admin.");
          return;
        }
    
        // Get entity_id: prefer from current ticket, fallback to user
        let entityId = currentTicketData?.entity_id || currentEntityId;
    
        if (!entityId) {
          toast.error("Entity ID not found. Contact administrator.");
          return;
        }
    
        setSendingClarification(true);
        try {
          const ticketNoStr = String(currentChatTicket.id);
    
          const formData = new FormData();
          formData.append("title", currentTicketData.title || "");
          formData.append("description", currentTicketData.description || "");
          formData.append(
            "category",
            currentTicketData.category || currentTicketData.category_detail?.id || ""
          );
          formData.append("status", "156");
    
          // Send as clean string (FormData forces string anyway)
          formData.append("entity_id", String(currentEntityId));
    
          const assignedUsers = currentTicketData.assignees_detail || currentTicketData.assigned_users || [];
          const assignedGroups = currentTicketData.assigned_groups_detail || currentTicketData.assigned_groups || [];
    
          let assignedTypeIndex = 0;
          assignedUsers.forEach((user, index) => {
            if (user?.email) formData.append(`assignee[${index}]`, user.email);
          });
          if (assignedUsers.length > 0) formData.append(`assigned_to_type[${assignedTypeIndex++}]`, "user");
          assignedGroups.forEach((group, index) => {
            if (group?.id) formData.append(`assigned_group[${index}]`, group.id);
          });
          if (assignedGroups.length > 0) formData.append(`assigned_to_type[${assignedTypeIndex}]`, "group");
    
          const updateResult = await updateTicket(ticketNoStr, formData);
          if (!updateResult.success) throw new Error(updateResult.error || "Failed to update status");
    
          const clarificationMessage = `[CLARIFICATION REQUEST]\n\n${clarificationText.trim()}`;
          await sendFollowUpMessageHandler(clarificationMessage);
    
          toast.success("Clarification request sent and ticket status updated!");
          setClarificationText("");
          setChatTab(0);
          loadData();
        } catch (err) {
          console.error("Clarification error:", err);
          toast.error("Failed to send clarification or update status");
        } finally {
          setSendingClarification(false);
        }
    };

    // Loading state
    if (loading) {
        return (
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "70vh" }}>
                <CircularProgress />
                <Typography sx={{ mt: 2 }}>Loading admin dashboard...</Typography>
            </Box>
        );
    }

    // Empty state
    if (!adminData || Object.keys(adminData).length === 0) {
        return (
            <Box sx={{ p: 4, textAlign: "center" }}>
                <Typography color="error" variant="h6">No data available</Typography>
                <Typography color="text.secondary">Please check your connection or permissions.</Typography>
            </Box>
        );
    };

    const headingMap = {
        new_assigned: "NEW TICKETS",
        solved: "SOLVED TICKETS",
        closed: "CLOSED TICKETS",
        cancelled: "CANCEL TICKETS",
        clarification_applied: "CLARIFICATION APPLIED",
        clarification_required: "CLARIFICATION REQUIRED",
    };

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
            {/* Cards */}
            <Grid container spacing={1} sx={{ mb: 4 }}>
                {statusCards.map((card) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4 }} key={card.id}>
                        <Card
                            onClick={() => handleCardClick(card.id)}
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
                                        bgcolor: `${card.color}.main`,
                                        color: "white"
                                    }}
                                >
                                    <Icon sx={{ fontSize: { xs: 25, sm: 18, md: 25 } }}>{card.icon}</Icon>
                                </Box>
                                <Box>
                                    <Typography fontSize={{ xs: 25, sm: 20, md: 25 }} fontWeight={600}>{card.count}</Typography>
                                    <Typography fontSize={{ xs: 20, sm: 14, md: 20 }} fontWeight={550}>{card.label}</Typography>
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
                                    {filteredTickets.length > 0 ? (
                                        filteredTickets
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
                                                {filteredTickets.length > 0 ? (
                                                    filteredTickets
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
                            {filteredTickets.length > 0 && (
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
                                        {Math.min((page + 1) * rowsPerPage, filteredTickets.length)} of{" "}
                                        {filteredTickets.length} tickets
                                    </Typography>
                                    <Pagination
                                        count={Math.ceil(filteredTickets.length / rowsPerPage)}
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

            {/* Chat Drawer */}
            <Drawer anchor="right" open={showFollowUpChat} onClose={() => setShowFollowUpChat(false)}>
                <Box sx={{ display: "flex", flexDirection: "column", height: "100%", bgcolor: "background.paper" }}>
                    <Box sx={{ p: 2, bgcolor: "primary.main", color: "white", display: "flex", alignItems: "center", gap: 2 }}>
                        <Typography variant="caption" sx={{ color: "white" }}>
                            Ticket #{currentChatTicket?.id}
                        </Typography>
                        <Typography variant="h6">
                            {currentChatTicket?.title || "Ticket Details"}
                        </Typography>
                    </Box>

                    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                        <Tabs value={chatTab} onChange={(e, v) => setChatTab(v)} centered variant="fullWidth">
                            <Tab label="Follow-up" icon={<ChatIcon />} iconPosition="start" />
                            <Tab label="Solution" icon={<DoneAllIcon />} iconPosition="start" disabled={isTicketSolved()} />
                            <Tab label="Clarification Required" icon={<HelpOutlineIcon />} iconPosition="start" />
                        </Tabs>
                    </Box>

                    <Box sx={{ flex: 1 }}>
                        {chatTab === 0 && (
                            <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
                                <Box sx={{ flex: 1, overflowY: "auto", p: 2, display: "flex", flexDirection: "column", gap: 2 }}>
                                    {loadingFollowUpChats ? (
                                        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                                            <CircularProgress />
                                        </Box>
                                    ) : groupedChats.length === 0 ? (
                                        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100%", color: "text.secondary" }}>
                                            <ChatIcon sx={{ fontSize: 60, mb: 2, opacity: 0.5 }} />
                                            <Typography>No messages yet</Typography>
                                        </Box>
                                    ) : (
                                        groupedChats.map((group) => (
                                            <Box key={group.date} sx={{mb:4}}>
                                                <Divider sx={{ my: 3 }}>
                                                    <Chip label={group.date} size="small" sx={{ bgcolor: "grey.200" }} />
                                                </Divider>
                                                {group.messages.map((msg) => {
                                                    const isMe = Number(msg.sender) === Number(currentUserId);
                                                    const isProtected = msg.protected === true;
                                                    const messageId = msg.id;
                                                    const isRevealed = revealedMessages.has(messageId);
                                                    const canViewDecrypted = Number(msg.sender) === Number(currentUserId) || Number(msg.receiver) === Number(currentUserId);
                                                    const isClar = msg.message?.includes("[CLARIFICATION REQUEST]");
    
                                                    const toggleReveal = () => {
                                                        if (!canViewDecrypted) return;
                                                        setRevealedMessages((prev) => {
                                                        const newSet = new Set(prev);
                                                        newSet.has(messageId) ? newSet.delete(messageId) : newSet.add(messageId);
                                                        return newSet;
                                                        });
                                                    };

                                                    const getDisplayedText = () => {
                                                        if (!isProtected) return msg.message || "";
                                                        if (!canViewDecrypted) return "*** PROTECTED MESSAGE - VISIBLE ONLY TO PARTICIPANTS ***";
                                                        const decrypted = msg.decrypted_message || msg.message;
                                                        return isRevealed ? decrypted : " Protected Message (Click eye to reveal)";
                                                    };

                                                    return (
                                                        <Box
                                                            key={msg.id}
                                                            sx={{
                                                                display: "flex",
                                                                justifyContent: isMe ? "flex-end" : "flex-start",
                                                                mb: 2,
                                                            }}
                                                        >
                                                            {!isMe ? (
                                                                <Box sx={{ display: "flex", alignItems: "flex-end", gap: 1, maxWidth: "85%" }}>
                                                                    <Avatar sx={{ width: 36, height: 36, bgcolor: "grey.400", fontSize: "0.9rem" }}>
                                                                        {getInitials(chatRecipient?.name)}
                                                                    </Avatar>
                                                                    <Box
                                                                        sx={{
                                                                            position: "relative",
                                                                            bgcolor: isClar ? "warning.light" : "grey.100",
                                                                            color: "text.primary",
                                                                            p: 1.5,
                                                                            borderRadius: 2,
                                                                            border: isClar ? "1px solid warning.main" : "none",
                                                                            boxShadow: 1,
                                                                        }}
                                                                    >
                                                                        {isProtected && (
                                                                            <SecurityIcon
                                                                                sx={{
                                                                                    position: "absolute",
                                                                                    top: -8,
                                                                                    right: -8,
                                                                                    fontSize: 18,
                                                                                    bgcolor: "success.main",
                                                                                    color: "white",
                                                                                    borderRadius: "50%",
                                                                                    p: 0.4,
                                                                                }}
                                                                            />
                                                                        )}
                                                                        <Typography variant="body2" sx={{ wordBreak: "break-word", whiteSpace: "pre-wrap" }}>
                                                                            {getDisplayedText()}
                                                                        </Typography>

                                                                        {isClar && <Chip label="CLARIFICATION REQUEST" size="small" color="warning" sx={{ mt: 1 }} />}

                                                                        {isProtected && canViewDecrypted && (
                                                                            <IconButton
                                                                                size="small"
                                                                                onClick={toggleReveal}
                                                                                sx={{
                                                                                    position: "absolute",
                                                                                    bottom: 4,
                                                                                    right: 4,
                                                                                    bgcolor: "rgba(0,0,0,0.08)",
                                                                                    "&:hover": { bgcolor: "rgba(0,0,0,0.15)" },
                                                                                }}
                                                                            >
                                                                                {isRevealed ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                                                                            </IconButton>
                                                                        )}
                                                                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 0.5 }}>
                                                                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.65rem" }}>
                                                                                {new Date(msg.createdon).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
                                                                            </Typography>
                                                                            <Typography variant="caption" sx={{ fontSize: "0.7rem", ml: 1 }}>
                                                                                {chatRecipient?.name || "Requester"}
                                                                            </Typography>
                                                                        </Box>
                                                                    </Box>
                                                                </Box>
                                                            ) : (
                                                                <Box sx={{ display: "flex", alignItems: "flex-end", gap: 1, flexDirection: "row-reverse", maxWidth: "85%" }}>
                                                                    <Avatar sx={{ width: 36, height: 36, bgcolor: "primary.main", color: "white", fontSize: "0.9rem" }}>
                                                                        {getInitials(currentUserName)}
                                                                    </Avatar>
                                                                    <Box
                                                                        sx={{
                                                                            position: "relative",
                                                                            bgcolor: isClar ? "warning.main" : "primary.main",
                                                                            color: "white",
                                                                            p: 1.5,
                                                                            borderRadius: 2,
                                                                            boxShadow: 1,
                                                                        }}
                                                                    >
                                                                        {isProtected && (
                                                                            <SecurityIcon
                                                                                sx={{
                                                                                position: "absolute",
                                                                                top: -8,
                                                                                left: -8,
                                                                                fontSize: 18,
                                                                                bgcolor: "success.main",
                                                                                color: "white",
                                                                                borderRadius: "50%",
                                                                                p: 0.4,
                                                                                }}
                                                                            />
                                                                        )}
                                                                        <Typography variant="body2" sx={{ wordBreak: "break-word", whiteSpace: "pre-wrap" }}>
                                                                            {getDisplayedText()}
                                                                        </Typography>

                                                                        {isClar && (
                                                                            <Chip
                                                                                label="CLARIFICATION REQUEST"
                                                                                size="small"
                                                                                sx={{ mt: 1, bgcolor: "rgba(255,255,255,0.2)" }}
                                                                            />
                                                                        )}

                                                                        {isProtected && canViewDecrypted && (
                                                                            <IconButton
                                                                                size="small"
                                                                                onClick={toggleReveal}
                                                                                sx={{
                                                                                position: "absolute",
                                                                                bottom: 4,
                                                                                right: 4,
                                                                                color: "white",
                                                                                bgcolor: "rgba(255,255,255,0.2)",
                                                                                "&:hover": { bgcolor: "rgba(255,255,255,0.3)" },
                                                                                }}
                                                                            >
                                                                                {isRevealed ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                                                                            </IconButton>
                                                                        )}

                                                                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 0.5 }}>
                                                                            <Typography variant="caption" sx={{ opacity: 0.8, fontSize: "0.65rem" }}>
                                                                                {new Date(msg.createdon).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
                                                                            </Typography>
                                                                            <Typography variant="caption" sx={{ fontSize: "0.7rem", ml: 1 }}>
                                                                                You
                                                                            </Typography>
                                                                        </Box>
                                                                    </Box>
                                                                </Box>
                                                            )}
                                                        </Box>
                                                    );
                                                })}
                                            </Box>
                                        ))
                                    )}
                                </Box>
                                <Box sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
                                    <Box sx={{ display: "flex", gap: 1, alignItems: "flex-end" }}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            placeholder="Type your message..."
                                            value={newFollowUpMessage}
                                            onChange={(e) => setNewFollowUpMessage(e.target.value)}
                                            onKeyPress={(e) => {
                                            if (e.key === "Enter" && !e.shiftKey) {
                                                e.preventDefault();
                                                sendFollowUpMessageHandler(newFollowUpMessage);
                                            }
                                            }}
                                            multiline
                                            maxRows={4}
                                            disabled={sendingFollowUpMessage}
                                        />
                                        <Tooltip title={isProtectedMode ? "Protected Message Enabled" : "Send Protected Message"}>
                                            <IconButton
                                            color={isProtectedMode ? "success" : "default"}
                                            onClick={() => setIsProtectedMode(!isProtectedMode)}
                                            sx={{
                                                bgcolor: isProtectedMode ? "success.light" : "grey.200",
                                                "&:hover": { bgcolor: isProtectedMode ? "success.main" : "grey.300" },
                                            }}
                                            >
                                            <SecurityIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <IconButton
                                            onClick={() => sendFollowUpMessageHandler(newFollowUpMessage)}
                                            disabled={!newFollowUpMessage.trim() || sendingFollowUpMessage}
                                            color="primary"
                                        >
                                            {sendingFollowUpMessage ? <CircularProgress size={20} /> : <SendIcon />}
                                        </IconButton>
                                    </Box>
                                    {isProtectedMode && (
                                    <Typography variant="caption" color="success.main" sx={{ ml: 1, mt: 0.5, display: "block" }}>
                                        Protected message mode enabled
                                    </Typography>
                                    )}
                                </Box>
                            </Box>
                        )}

                        {chatTab === 1 && (
                            <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100%", p: 4, gap: 2 }}>
                                <DoneAllIcon sx={{ fontSize: 64, color: "success.main" }} />
                                <Typography variant="h6" fontWeight={600}>Mark Ticket as Solved</Typography>
                                {isTicketSolved() ? (
                                <Typography color="text.secondary" sx={{ mb: 3 }}>Already solved</Typography>
                                ) : (
                                <Typography color="text.secondary" sx={{ mb: 3 }}>Confirm to mark as solved</Typography>
                                )}
                                <Button variant="contained" color="success" size="large" onClick={handleSolutionSubmit} disabled={isTicketSolved()}>
                                Confirm Solved
                                </Button>
                                <Button variant="outlined" onClick={() => setChatTab(0)}>Back</Button>
                            </Box>
                        )}

                        {chatTab === 2 && (
                            <Box sx={{ display: "flex", flexDirection: "column", height: "100%", p: 3 }}>
                                <Box sx={{ textAlign: "center", mb: 3 }}>
                                    <HelpOutlineIcon sx={{ fontSize: 60, color: "warning.main", mb: 2 }} />
                                    <Typography variant="h6" fontWeight={600}>Request Clarification</Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                        Ask for more details if something is unclear.
                                    </Typography>
                                </Box>
                        
                                <TextField
                                    multiline
                                    rows={6}
                                    placeholder="Please clarify the following..."
                                    value={clarificationText}
                                    onChange={(e) => setClarificationText(e.target.value)}
                                    variant="outlined"
                                    fullWidth
                                    sx={{ mb: 3 }}
                                    disabled={sendingClarification}
                                />
                        
                                <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
                                    <Button
                                        variant="contained"
                                        color="warning"
                                        size="large"
                                        startIcon={<QuestionAnswerIcon />}
                                        onClick={handleSendClarification}
                                        disabled={!clarificationText.trim() || sendingClarification}
                                    >
                                        {sendingClarification ? <CircularProgress size={20} /> : "Send Request"}
                                    </Button>
                                    <Button variant="outlined" onClick={() => { setClarificationText(""); setChatTab(0); }} disabled={sendingClarification}>
                                        Cancel
                                    </Button>
                                </Box>
                            </Box>
                        )}
                    </Box>
                </Box>
            </Drawer>
        </Box>
    );
};

export default AdminTabs;