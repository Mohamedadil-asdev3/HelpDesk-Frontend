

// import { useEffect, useMemo, useState } from "react";
// import { useTheme } from "@mui/material/styles";
// import { 
//   Box, Card, CardContent, Typography, Grid, TextField, Button, Table, TableHead, TableRow, TableCell, TableBody, TableContainer,
//   useMediaQuery, Autocomplete, Stack, Pagination, Tooltip, CircularProgress, IconButton, Drawer, Divider, Chip, Avatar, Alert,
//   Tabs, Tab, Icon,
// } from "@mui/material";
// import NewReleasesIcon from "@mui/icons-material/NewReleases";
// import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
// import DoneAllIcon from "@mui/icons-material/DoneAll";
// import LockIcon from "@mui/icons-material/Lock";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import SecurityIcon from "@mui/icons-material/Security";
// import ChatIcon from "@mui/icons-material/Chat";
// import SendIcon from "@mui/icons-material/Send";
// import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
// import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import {
//   fetchApproverTickets,
//   fetchMessages,
//   sendMessage,
//   getTicketDetails,
//   updateTicket,
// } from "../../Api";

// const ApproverTabs = ({ approverStatus: propUserStatus }) => {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
//   const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

//   const [selectedType, setSelectedType] = useState("new_assigned");
//   const [search, setSearch] = useState("");
//   const [department, setDepartment] = useState("");
//   const [tickets, setTickets] = useState({
//     new_assigned: [],
//     solved: [],
//     closed: [],
//     clarification_required: [],
//     clarification_applied: [],
//   });

//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [loading, setLoading] = useState(true);
//   const [userStatus, setUserStatus] = useState(null);
//   const [error, setError] = useState(null);

//   // User & Entity
//   const [currentUserId, setCurrentUserId] = useState(null);
//   const [currentUserName, setCurrentUserName] = useState("You");
//   const [currentEntityId, setCurrentEntityId] = useState(null);

//   // Chat states
//   const [showFollowUpChat, setShowFollowUpChat] = useState(false);
//   const [followUpChats, setFollowUpChats] = useState([]);
//   const [loadingFollowUpChats, setLoadingFollowUpChats] = useState(false);
//   const [newFollowUpMessage, setNewFollowUpMessage] = useState("");
//   const [sendingFollowUpMessage, setSendingFollowUpMessage] = useState(false);
//   const [currentChatTicket, setCurrentChatTicket] = useState(null);
//   const [chatRecipient, setChatRecipient] = useState(null);
//   // Ticket data
//   const [currentTicketData, setCurrentTicketData] = useState(null);

//   // Protected & Reveal states
//   const [isProtectedMode, setIsProtectedMode] = useState(false);
//   const [revealedMessages, setRevealedMessages] = useState(new Set());

//   // Solution States
//   const [selectedResolutionType, setSelectedResolutionType] = useState(null);
//   const [solutionRemark, setSolutionRemark] = useState("");
//   const [sendingSolution, setSendingSolution] = useState(false);

//   // Clarification states
//   const [clarificationText, setClarificationText] = useState("");
//   const [sendingClarification, setSendingClarification] = useState(false);

//   // Add this state near your other useStates
//   const [isConfidentialTicket, setIsConfidentialTicket] = useState(false);
//   const [myProtectedMessages, setMyProtectedMessages] = useState({});

//   // Tab index
//   const [chatTab, setChatTab] = useState(0);

//   const navigate = useNavigate();

//   useEffect(() => {
//     const userDataString = localStorage.getItem("user");
//     if (userDataString) {
//       try {
//         const userData = JSON.parse(userDataString);
//         setCurrentUserId(userData?.id || null);
//         setCurrentUserName(userData?.name || userData?.username || "You");

//         let entityId = null;
//         if (userData?.entity_data?.id) entityId = userData.entity_data.id;
//         else if (userData?.entities?.length > 0) entityId = userData.entities[0].id;
//         else if (userData?.entities_ids?.length > 0) entityId = userData.entities_ids[0];
//         setCurrentEntityId(entityId ? Number(entityId) : null);
//       } catch (err) {
//         console.error("Error parsing user data:", err);
//       }
//     } else {
//       const userId = localStorage.getItem("current_user_id");
//       setCurrentUserId(userId ? parseInt(userId, 10) : null);
//     }
//   }, []);

//   const getDisplayStatus = (status) => (status === "New" ? "Pending" : status);

//   const processTickets = (ticketList) => {
//     if (!Array.isArray(ticketList)) return [];
//     return ticketList.map((ticket) => ({
//       ...ticket,
//       assigned_users: Array.isArray(ticket.assigned_users)
//         ? ticket.assigned_users.map((user) => ({
//             id: user.id || null,
//             name: user.name || user.full_name || user.email || "Unknown User",
//             email: user.email || "unknown@example.com",
//             is_unknown: !user.id,
//           }))
//         : [],
//       assigned_groups: Array.isArray(ticket.assigned_groups)
//         ? ticket.assigned_groups.map((group) => ({
//             id: group.id || null,
//             name: group.name || "Unknown Group",
//             is_unknown: !group.id,
//           }))
//         : [],
//     }));
//   };

//   const loadData = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       if (propUserStatus) {
//         let processed = propUserStatus;
//         if (propUserStatus.user_stats) {
//           const s = propUserStatus.user_stats;
//           processed = {
//             new_assigned: s.new_assigned || 0,
//             solved: s.solved || 0,
//             closed: s.closed || 0,
//             clarification_required: s.clarification_required || 0,
//             clarification_applied: s.clarification_applied || 0,
//             new_assigned_tickets: processTickets(s.new_assigned_tickets || []),
//             solved_tickets: processTickets(s.solved_tickets || []),
//             closed_tickets: processTickets(s.closed_tickets || []),
//             clarification_required_tickets: processTickets(s.clarification_required_tickets || []),
//             clarification_applied_tickets: processTickets(s.clarification_applied_tickets || []),
//           };
//         }
//         setUserStatus(processed);
//       } else {
//         const data = await fetchApproverTickets();
//         if (data?.success && data.user_stats) {
//           const s = data.user_stats;
//           setUserStatus({
//             new_assigned: s.new_assigned || 0,
//             solved: s.solved || 0,
//             closed: s.closed || 0,
//             clarification_required: s.clarification_required || 0,
//             clarification_applied: s.clarification_applied || 0,
//             new_assigned_tickets: processTickets(s.new_assigned_tickets || []),
//             solved_tickets: processTickets(s.solved_tickets || []),
//             closed_tickets: processTickets(s.closed_tickets || []),
//             clarification_required_tickets: processTickets(s.clarification_required_tickets || []),
//             clarification_applied_tickets: processTickets(s.clarification_applied_tickets || []),
//           });
//         } else {
//           throw new Error("Invalid response");
//         }
//       }
//     } catch (err) {
//       setError(err.message || "Failed to load dashboard");
//       toast.error(err.message || "Failed to load");
//       setUserStatus({
//         new_assigned: 0,
//         solved: 0,
//         closed: 0,
//         clarification_required: 0,
//         clarification_applied: 0,
//         new_assigned_tickets: [],
//         solved_tickets: [],
//         closed_tickets: [],
//         clarification_required_tickets: [],
//         clarification_applied_tickets: [],
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadData();
//   }, [propUserStatus]);

//   useEffect(() => {
//     if (userStatus) {
//       setTickets({
//         new_assigned: userStatus.new_assigned_tickets || [],
//         solved: userStatus.solved_tickets || [],
//         closed: userStatus.closed_tickets || [],
//         clarification_required: userStatus.clarification_required_tickets || [],
//         clarification_applied: userStatus.clarification_applied_tickets || [],
//       });
//     }
//   }, [userStatus]);

//   const getCount = (type) => {
//     if (type === "clarification_required") return userStatus?.clarification_required ?? 0;
//     if (type === "clarification_applied") return userStatus?.clarification_applied ?? 0;
//     return userStatus?.[type] ?? (tickets[type]?.length || 0);
//   };

//   const statusCards = [
//     {
//       id: "new_assigned",
//       label: "Pending",
//       color: "warning",
//       icon: <NewReleasesIcon sx={{ fontSize: { xs: 25, sm: 18, md: 25 } }} />,
//       count: getCount("new_assigned"),
//     },
//     {
//       id: "solved",
//       label: "Resolved",
//       color: "success",
//       icon: <DoneAllIcon sx={{ fontSize: { xs: 25, sm: 18, md: 25 } }} />,
//       count: getCount("solved"),
//     },
//     {
//       id: "closed",
//       label: "Closed",
//       color: "info",
//       icon: <LockIcon sx={{ fontSize: { xs: 25, sm: 18, md: 25 } }} />,
//       count: getCount("closed"),
//     },
//     {
//       id: "clarification_required",
//       label: "Clar. Required",
//       color: "error",
//       icon: <HelpOutlineIcon sx={{ fontSize: { xs: 25, sm: 18, md: 25 } }} />,
//       count: getCount("clarification_required"),
//     },
//     {
//       id: "clarification_applied",
//       label: "Clar. Supplied",
//       color: "primary",
//       icon: <QuestionAnswerIcon sx={{ fontSize: { xs: 25, sm: 18, md: 25 } }} />,
//       count: getCount("clarification_applied"),
//     },
//   ];

//   const resolutionTypes = [
//     { value: 1, label: "Configuration Change", description: "Adjust settings or parameters (e.g., user permissions, system options)." },
//     { value: 2, label: "Bug Fix", description: "Resolve a software defect that’s causing an error or crash." },
//     { value: 3, label: "Enhancement", description: "Add a new feature or improve an existing one beyond the original spec." },
//     { value: 4, label: "Infrastructure Issue", description: "Problems with servers, networks, storage, or other backend components." },
//     { value: 5, label: "Security Patch", description: "Apply updates to close vulnerabilities or address compliance gaps." },
//     { value: 6, label: "Performance Tuning", description: "Optimize speed, memory usage, or response times." },
//     { value: 7, label: "Data Correction", description: "Fix inaccurate or corrupted data (e.g., manual record updates)." },
//     { value: 8, label: "Integration Fix", description: "Resolve issues with third-party APIs, interfaces, or middleware." },
//     { value: 9, label: "Third-Party dependencies", description: "Issue caused by or resolved via third-party library/service update." },
//     { value: 10, label: "User Training / Documentation", description: "Provide guidance or update docs when the “issue” is a skill gap." },
//     { value: 11, label: "Other's", description: "" },
//   ];

//   const headingMap = {
//     new_assigned: "Pending Tickets",
//     solved: "Resolved Tickets",
//     closed: "Closed Tickets",
//     clarification_required: "Clarification Required Tickets",
//     clarification_applied: "Clarification Supplied Tickets",
//   };

//   const TechTabelCol = [
//     { id: 1, title: <>Ticket ID</> },
//     { id: 2, title: <>Title</> },
//     { id: 3, title: <>Description</> },
//     { id: 4, title: <>Status<br />Priority</> },
//     { id: 5, title: <>Category<br />Subcategory</> },
//     { id: 6, title: <>Department<br />Location</> },
//     { id: 7, title: <>Requested By</> },
//     { id: 8, title: <>Open Date<br />Last Update</> },
//     { id: 9, title: <>Action</> },
//   ];

//   const selectedTickets = tickets[selectedType] || [];

//   const departmentList = useMemo(
//     () => [...new Set(selectedTickets.map((t) => t.department_detail?.field_name).filter(Boolean))],
//     [selectedTickets]
//   );

//   const filteredRows = useMemo(() => {
//     const lower = search.toLowerCase().trim();
//     if (!lower && !department) return selectedTickets;
//     return selectedTickets
//       .filter((t) => {
//         const deptMatch = department ? t.department_detail?.field_name === department : true;
//         if (!lower) return deptMatch;
//         const fields = [
//           String(t.ticket_no),
//           t.title,
//           t.description,
//           t.status_detail?.field_values,
//           t.priority_detail?.field_values,
//           t.category_detail?.category_name,
//           t.subcategory_detail?.subcategory_name,
//           t.department_detail?.field_name,
//           t.location_detail?.field_name,
//           t.requested_detail?.email,
//           t.requested_detail?.name,
//         ];
//         return fields.some((f) => f?.toLowerCase().includes(lower));
//       })
//       .filter((t) => !department || t.department_detail?.field_name === department);
//   }, [selectedTickets, search, department]);

//   const getInitials = (name) =>
//     !name || name === "You" ? "U" : name.split(" ").map((n) => n[0]).join("").toUpperCase().substring(0, 2);

//   const groupedChats = useMemo(() => {
//     const groups = {};
//     followUpChats.forEach((m) => {
//       const date = new Date(m.createdon);
//       const dateKey = date.toISOString().split("T")[0];
//       if (!groups[dateKey]) groups[dateKey] = [];
//       groups[dateKey].push(m);
//     });

//     return Object.entries(groups)
//       .map(([dateKey, msgs]) => ({
//         dateKey,
//         date: new Date(dateKey).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }),
//         messages: msgs.sort((a, b) => new Date(a.createdon) - new Date(b.createdon)),
//       }))
//       .sort((a, b) => a.dateKey.localeCompare(b.dateKey));
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

//   const handleTicketClick = (no) => {
//     localStorage.setItem("selectedTicketId", no);
//     navigate("/Approval");
//   };

//   const fetchTicketMessages = async (ticketNo, currentUserId, recipientId) => {
//     try {
//       const allMessages = await fetchMessages();
//       return allMessages.filter(
//         (msg) =>
//           msg.ticket_no == ticketNo &&
//           ((msg.sender === currentUserId && msg.receiver === recipientId) ||
//             (msg.sender === recipientId && msg.receiver === currentUserId))
//       ) || [];
//     } catch (err) {
//       toast.error("Failed to load messages");
//       return [];
//     }
//   };

//   const sendFollowUpMessageHandler = async (text) => {
//     if (!text.trim()) return toast.error("Message cannot be empty");
//     if (!currentChatTicket?.id || !chatRecipient?.id || !currentUserId) return toast.error("Cannot send message");

//     const shouldProtect = isConfidentialTicket || isProtectedMode;

//     setSendingFollowUpMessage(true);
//     try {
//       await sendMessage({
//         sender: currentUserId,
//         receiver: chatRecipient.id,
//         ticket_no: currentChatTicket.id,
//         message: text.trim(),
//         protected: shouldProtect,
//       });

//       const msgs = await fetchMessages();
//       const filtered = msgs.filter(m =>
//         m.ticket_no == currentChatTicket.id &&
//         ((m.sender === currentUserId && m.receiver === chatRecipient.id) ||
//          (m.sender === chatRecipient.id && m.receiver === currentUserId))
//       );

//       setFollowUpChats(filtered.sort((a, b) => new Date(a.createdon) - new Date(b.createdon)));
//       setNewFollowUpMessage("");

//       if (!isConfidentialTicket) setIsProtectedMode(false);

//       toast.success(shouldProtect ? "Protected message sent!" : "Message sent!");
//     } catch (err) {
//       toast.error("Failed to send message");
//     } finally {
//       setSendingFollowUpMessage(false);
//     }
//   };

//   const handleSendClarification = async () => {
//     if (!clarificationText.trim()) {
//       toast.error("Please enter a clarification message");
//       return;
//     }
//     if (!currentChatTicket?.id || !currentTicketData) {
//       toast.error("Ticket not loaded");
//       return;
//     }
//     if (!currentEntityId) {
//       toast.error("Your entity is not configured. Contact admin.");
//       return;
//     }

//     setSendingClarification(true);
//     try {
//       const ticketNoStr = String(currentChatTicket.id);
//       const formData = new FormData();
//       formData.append("title", currentTicketData.title || "");
//       formData.append("description", currentTicketData.description || "");
//       formData.append("category", currentTicketData.category || currentTicketData.category_detail?.id || "");
//       formData.append("status", "156"); // Clarification Required
//       formData.append("entity_id", String(currentEntityId));

//       const assignedUsers = currentTicketData.assignees_detail || currentTicketData.assigned_users || [];
//       const assignedGroups = currentTicketData.assigned_groups_detail || currentTicketData.assigned_groups || [];

//       let assignedTypeIndex = 0;
//       assignedUsers.forEach((user, index) => {
//         if (user?.email) formData.append(`assignee[${index}]`, user.email);
//       });
//       if (assignedUsers.length > 0) formData.append(`assigned_to_type[${assignedTypeIndex++}]`, "user");
//       assignedGroups.forEach((group, index) => {
//         if (group?.id) formData.append(`assigned_group[${index}]`, group.id);
//       });
//       if (assignedGroups.length > 0) formData.append(`assigned_to_type[${assignedTypeIndex}]`, "group");

//       const updateResult = await updateTicket(ticketNoStr, formData);
//       if (!updateResult.success) throw new Error(updateResult.error || "Failed to update status");

//       const clarificationMessage = `[Clarification Required]\n\n${clarificationText.trim()}`;
//       await sendFollowUpMessageHandler(clarificationMessage);

//       toast.success("Clarification required sent and ticket status updated!");
//       setClarificationText("");
//       setChatTab(0);
//       loadData();
//     } catch (err) {
//       console.error("Clarification error:", err);
//       toast.error("Failed to send clarification or update status");
//     } finally {
//       setSendingClarification(false);
//     }
//   };

//   const handleSolutionSubmit = async () => {
//     if (!currentChatTicket?.id || !currentTicketData) {
//       toast.error("Ticket not loaded");
//       return;
//     }
//     if (!currentEntityId) {
//       toast.error("Your entity is not configured. Contact admin.");
//       return;
//     }

//     setSendingSolution(true);
//     try {
//       const ticketNoStr = String(currentChatTicket.id);
//       const formData = new FormData();
//       formData.append("title", currentTicketData.title || "");
//       formData.append("description", currentTicketData.description || "");
//       formData.append("category", currentTicketData.category || currentTicketData.category_detail?.id || "");
//       formData.append("status", "153"); // Solved
//       formData.append("entity_id", String(currentEntityId));

//       const assignedUsers = currentTicketData.assignees_detail || currentTicketData.assigned_users || [];
//       const assignedGroups = currentTicketData.assigned_groups_detail || currentTicketData.assigned_groups || [];

//       let assignedTypeIndex = 0;
//       assignedUsers.forEach((user, index) => {
//         if (user?.email) formData.append(`assignee[${index}]`, user.email);
//       });
//       if (assignedUsers.length > 0) formData.append(`assigned_to_type[${assignedTypeIndex++}]`, "user");
//       assignedGroups.forEach((group, index) => {
//         if (group?.id) formData.append(`assigned_group[${index}]`, group.id);
//       });
//       if (assignedGroups.length > 0) formData.append(`assigned_to_type[${assignedTypeIndex}]`, "group");

//       const result = await updateTicket(ticketNoStr, formData);
//       if (!result.success) throw new Error(result.error || "Update failed");

//       // Send solution message to chat
//       const resolutionLabel = selectedResolutionType?.label || "Not specified";
//       const resolutionDesc = selectedResolutionType?.description || "";
//       const remark = solutionRemark.trim();

//       const solutionMessage = `[Solution Provided]\n\n**Type of Fix:** ${resolutionLabel}\n${resolutionDesc ? `\n${resolutionDesc}\n` : ""}${remark ? `\n**Remarks:**\n${remark}` : ""}`;

//       await sendMessage({
//         sender: currentUserId,
//         receiver: chatRecipient.id,
//         ticket_no: currentChatTicket.id,
//         message: solutionMessage.trim(),
//         protected: false,
//       });

//       // Refresh messages
//       const msgs = await fetchMessages();
//       const filtered = msgs.filter(
//         (m) =>
//           m.ticket_no == currentChatTicket.id &&
//           ((m.sender === currentUserId && m.receiver === chatRecipient.id) ||
//             (m.sender === chatRecipient.id && m.receiver === currentUserId))
//       );
//       setFollowUpChats(filtered.sort((a, b) => new Date(a.createdon) - new Date(b.createdon)));

//       toast.success("Ticket marked as Solved and solution sent!");

//       setSelectedResolutionType(null);
//       setSolutionRemark("");

//       setShowFollowUpChat(false);
//       setSelectedType("solved");
//       loadData();
//     } catch (err) {
//       console.error("Solution submit error:", err);
//       toast.error("Failed to mark as solved");
//     } finally {
//       setSendingSolution(false);
//     }
//   };

//   const handleChatDrawerOpen = async (ticketNo) => {
//     if (!ticketNo || !currentUserId) return toast.error("Invalid ticket");
//     const ticket = selectedTickets.find((t) => t.ticket_no == ticketNo);
//     if (!ticket) return toast.error("Ticket not found");

//     setChatTab(0);
//     setLoadingFollowUpChats(true);
//     setShowFollowUpChat(true);
//     setFollowUpChats([]);
//     setRevealedMessages(new Set());

//     try {
//       const details = await getTicketDetails(String(ticketNo));
//       const data = details.ticket || details;
//       setCurrentTicketData(data);
//       setChatRecipient(data.requested_detail);
//       setCurrentChatTicket({ id: ticketNo, title: data.title || ticket.title });

//       // Check for confidential ticket
//       const confidential = data.confidential === true || data.confidential === "true";
//       setIsConfidentialTicket(confidential);
//       setIsProtectedMode(confidential); // Force ON if confidential

//       const recipientId = data.requested_detail?.id || data.requested_detail?.email;
//       const msgs = await fetchTicketMessages(ticketNo, currentUserId, recipientId);
//       setFollowUpChats(msgs.sort((a, b) => new Date(a.createdon) - new Date(b.createdon)));
//     } catch {
//       toast.error("Failed to load chat");
//       setShowFollowUpChat(false);
//     } finally {
//       setLoadingFollowUpChats(false);
//     }
//   };

//   const handleChatDrawerClose = () => {
//     setShowFollowUpChat(false);
//     setCurrentChatTicket(null);
//     setChatRecipient(null);
//     setFollowUpChats([]);
//     setCurrentTicketData(null);
//     setLoadingFollowUpChats(false);
//     setChatTab(0);
//     setClarificationText("");
//     setRevealedMessages(new Set());
//   };

//   const isTicketSolved = () => currentTicketData?.status_detail?.field_name === "Solved";
//   const isTicketClarificationRequired = () => currentTicketData?.status_detail?.field_name === "Clarification Required";
//   const isActionDisabled = () => isTicketSolved() || isTicketClarificationRequired();

//   if (error && !loading) {
//     return (
//       <Box sx={{ width: "100%" }}>
//         <Alert severity="error" sx={{ mb: 2 }} action={<Button onClick={loadData}>Retry</Button>}>
//           {error}
//         </Alert>
//       </Box>
//     );
//   }

//   if (loading) {
//     return (
//       <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 400 }}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   const priorityColors = {
//     "Critical": "#D32F2F",
//     "Very High": "#b43d3bff",
//     "High": "#FB8C00",
//     "Medium": "#FDD835",
//     "Low": "#43A047",
//     "Very Low": "#1E88E5",
//   };

//   const statusColors = {
//     "Pending": "#EF6C00",
//     "Approved": "#2E7D32",
//     "On Hold": "#1565C0",
//     "Rejected": "#C62828",
//     "SLA Breached": "#F9A825",
//   };

//   return (
//     <>
//       <Box sx={{ width: "100%", mb:2 }}>
//         <Grid container spacing={1} sx={{ mb: 2 }}>
//           {statusCards.map((item) => (
//             <Grid size={{ xs: 6, sm: 6, md: 4, lg: 2.4 }} key={item.id}>
//               <Card
//                 onClick={() => handleCardClick(item.id)}
//                 sx={{
//                   transition: "0.3s ease",
//                   maxWidth: isMobile ? 500 : 300,
//                   maxHeight: 110,
//                   minHeight: 100,
//                   borderRadius: 5,
//                   "&:hover": {
//                     background: "linear-gradient(135deg, #667eea, #764ba2)",
//                     color: "#fff",
//                     transform: "scale(1.03)",
//                   },
//                 }}
//               >
//                 <CardContent 
//                   sx={{
//                     "&:last-child": { pt: 1 },
//                     display: "flex",
//                     gap: 2,
//                     alignItems: "center"
//                   }}
//                 >
//                   <Box
//                     sx={{
//                       width: { xs: 40, sm: 40, md: 40 },
//                       height: { xs: 40, sm: 40, md: 40 },
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       borderRadius: 2,
//                       bgcolor: `${item.color}.main`,
//                       color: "#fff",
//                     }}
//                   >
//                     <Icon sx={{ fontSize: { xs: 25, sm: 18, md: 25 } }}>{item.icon}</Icon>
//                   </Box>
//                   <Box>
//                     <Typography fontSize={{ xs: 25, sm: 20, md: 25 }} fontWeight={600}>
//                       {item.count}
//                     </Typography>
//                     <Typography fontSize={{ xs: 20, sm: 14, md: 20 }} fontWeight={550}>
//                       {item.label}
//                     </Typography>
//                   </Box>
//                 </CardContent>
//               </Card>
//             </Grid>
//           ))}
//         </Grid>
//         <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
//           <CardContent>
//             {selectedType && (
//               <Box>
//                 <Box
//                   sx={{
//                     display: "flex",
//                     flexDirection: isMobile || isTablet ? "column" : "row",
//                     justifyContent: !isMobile || !isTablet ? "space-between" : undefined,
//                     alignItems: isMobile ? "flex-start" : "center",
//                     mb: 1,
//                     gap: isMobile ? 2 : 0,
//                   }}
//                 >
//                   <Typography variant="h5" fontWeight={700} sx={{ color: "#2D3748" }}>
//                     {headingMap[selectedType] || "Tickets"} 
//                   </Typography>
//                   <Box
//                     sx={{
//                       display: "flex",
//                       flexDirection: isMobile ? "column" : "row",
//                       flexWrap: isTablet ? "wrap" : "nowrap",
//                       gap: 2,
//                       width: isMobile || isTablet ? "100%" : "auto",
//                       justifyContent: isTablet ? "flex-start" : "flex-end",
//                       mt: isTablet ? 1.5 : 0
//                     }}
//                   >
//                     <Autocomplete
//                       options={departmentList}
//                       value={department}
//                       onChange={(e, newValue) => setDepartment(newValue)}
//                       renderInput={(params) => (
//                         <TextField {...params} label="Department" size="small" variant="outlined" />
//                       )}
//                       sx={{
//                         width: { xs: "100%", sm: 300, md: 200 },
//                         "& .MuiOutlinedInput-root": {
//                           borderRadius: 2,
//                         }
//                       }}
//                       disabled={departmentList.length === 0}
//                     />
//                     <TextField
//                       size="small"
//                       label="Search"
//                       value={search}
//                       onChange={(e) => setSearch(e.target.value)}
//                       variant="outlined"
//                       sx={{
//                         width: { xs: "100%", sm: 300, md: 200 },
//                         "& .MuiOutlinedInput-root": {
//                           borderRadius: 2,
//                         }
//                       }}
//                     />
//                     <Button
//                       variant="outlined"
//                       fullWidth={isMobile}
//                       onClick={clearFilters}
//                       sx={{
//                         borderRadius: 2,
//                         borderColor: "#CBD5E0",
//                         color: "#4A5568",
//                         "&:hover": { borderColor: "#667eea", backgroundColor: "#667eea10" },
//                       }}
//                     >
//                       Clear
//                     </Button>
//                   </Box>
//                 </Box>
//                 {isMobile ? (
//                   <Box>
//                     {filteredRows.length > 0 ? (
//                       filteredRows
//                         .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//                         .map((t, index) => (
//                           <Card
//                               sx={{
//                                 mb: 2,
//                                 borderRadius: 2,
//                                 boxShadow: "0px 2px 8px rgba(0,0,0,0.05)",
//                               }}
//                               key={t.id || index}
//                             >
//                               <CardContent>
//                                 <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                                   <Box sx={{display: "flex", gap: 1, alignItems: "center" }}>
//                                     <Typography fontWeight={700} color="#667eea">
//                                       #{t.ticket_no} - 
//                                     </Typography>
//                                     <Chip
//                                       label={t.priority_detail?.field_values || "-"}
//                                       size="small"
//                                       sx={{
//                                         fontWeight: 800,
//                                         borderRadius: 50,
//                                         background: priorityColors[t.priority_detail?.field_values] || "#666",
//                                         color: "white",
//                                         animation: t.priority_detail?.field_values === "Critical" ? "pulse 2s infinite" : "none",
//                                       }}
//                                     />
//                                   </Box>
//                                   <Chip
//                                     label={t.status_detail?.field_values}
//                                     size="small"
//                                     sx={{
//                                       fontWeight: 700,
//                                       background: statusColors[t.status_detail?.field_values] || "#666",
//                                       color: "white",
//                                       borderRadius: 50,
//                                       py: 0.5,
//                                       px: 1,
//                                     }}
//                                   />
//                                 </Box>
//                                 <Tooltip
//                                   title={t.title}
//                                   arrow
//                                   placement="top"
//                                 >
//                                   <Typography
//                                     sx={{
//                                       maxWidth: 200,
//                                       color: "text.secondary",
//                                       whiteSpace: "nowrap",
//                                       overflow: "hidden",
//                                       textOverflow: "ellipsis",
//                                       cursor: "pointer",
//                                       mt: 0.5
//                                     }}
//                                   >
//                                     {t.title}
//                                   </Typography>
//                                 </Tooltip>
//                                 <Tooltip
//                                   title={t.description || "No description"}
//                                   arrow
//                                   placement="top"
//                                 >
//                                   <Typography
//                                     sx={{
//                                       maxWidth: 200,
//                                       color: "text.secondary",
//                                       whiteSpace: "nowrap",
//                                       overflow: "hidden",
//                                       textOverflow: "ellipsis",
//                                       cursor: "pointer",
//                                       mt: 0.5
//                                     }}
//                                   >
//                                     {t.description || "-"}
//                                   </Typography>
//                                 </Tooltip>
//                                 <Typography fontSize={13} mt={1.5}>
//                                   <strong style={{ color: "#4A5568" }}>Category:</strong>{" "}
//                                   <span style={{ color: "#2D3748" }}>
//                                     {t.category_detail?.category_name || "-"} / {t.subcategory_detail?.subcategory_name || "-"}
//                                   </span>
//                                 </Typography>
//                                 <Typography fontSize={13} mt={1}>
//                                   <strong style={{ color: "#4A5568" }}>Dept:</strong>{" "}
//                                   <span style={{ color: "#2D3748" }}>
//                                     {t.department_detail?.field_name || "-"} | {t.location_detail?.field_name || "-"}
//                                   </span>
//                                 </Typography>
//                                 <Typography fontSize={12} color="#718096" mt={1.5}>
//                                   Open: {t.created_date ? new Date(t.created_date).toLocaleDateString() : "-"} <br />
//                                   Update: {t.updated_date ? new Date(t.updated_date).toLocaleDateString() : "-"}
//                                 </Typography>
//                                 <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2, gap: 1 }}>
//                                   <Tooltip title="Follow-up Chat">
//                                     <IconButton onClick={() => handleChatDrawerOpen(t.ticket_no)} size="small" sx={{ color: "#667eea" }}>
//                                       <ChatIcon />
//                                     </IconButton>
//                                   </Tooltip>
//                                   <Tooltip title="View Details">
//                                     <IconButton
//                                       onClick={() => handleTicketClick(t.ticket_no)}
//                                       sx={{ color: "#667eea" }}
//                                       size="small"
//                                     >
//                                       <VisibilityIcon />
//                                     </IconButton>
//                                   </Tooltip>
//                                 </Box>
//                               </CardContent>
//                             </Card>
//                           ))
//                       ) : (
//                         <Typography align="center" py={4} color="#718096">
//                           No tickets found.
//                         </Typography>
//                       )}
//                     </Box>
//                   ) : (
//                     <Card sx={{ borderRadius: 3, boxShadow: 2, overflow: "hidden" }}>
//                       <TableContainer>
//                         <Table stickyHeader>
//                           <TableHead>
//                             <TableRow sx={{ backgroundColor: "#F7FAFC" }}>
//                               {TechTabelCol.map((col) => (
//                                 <TableCell
//                                   key={col.id}
//                                   sx={{
//                                     fontWeight: 700,
//                                     whiteSpace: "nowrap",
//                                     color: "#2D3748",
//                                     borderBottom: "2px solid #E2E8F0",
//                                     py: 2,
//                                     lineHeight: 1.2,
//                                   }}
//                                 >
//                                   {col.title}
//                                 </TableCell>
//                               ))}
//                             </TableRow>
//                           </TableHead>
//                           <TableBody>
//                             {filteredRows.length > 0 ? (
//                               filteredRows
//                                 .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//                                 .map((t, index) => (
//                                   <TableRow
//                                     key={t.id || index}
//                                     hover
//                                     sx={{
//                                       '&:hover': { backgroundColor: '#F7FAFC' },
//                                       '&:last-child td': { borderBottom: 0 }
//                                     }}
//                                   >
//                                     <TableCell sx={{ color: "#667eea", fontWeight: 600 }}>
//                                       #{t.ticket_no || t.id || "-"}
//                                     </TableCell>
//                                     <TableCell>
//                                       <Tooltip
//                                         title={t.title}
//                                         arrow
//                                         placement="top"
//                                       >
//                                         <Typography
//                                           sx={{
//                                             maxWidth:200,
//                                             whiteSpace: "nowrap",
//                                             overflow: "hidden",
//                                             textOverflow: "ellipsis",
//                                             cursor: "pointer",
//                                           }}
//                                         >
//                                           {t.title || "-"}
//                                         </Typography>
//                                       </Tooltip>
//                                     </TableCell>
//                                     <TableCell>
//                                       <Tooltip title={t.description || "No description"} arrow placement="top">
//                                         <Typography
//                                           sx={{
//                                             maxWidth: 200,
//                                             whiteSpace: "nowrap",
//                                             overflow: "hidden",
//                                             textOverflow: "ellipsis",
//                                             cursor: "pointer",
//                                           }}
//                                         >
//                                           {t.description || "-"}
//                                         </Typography>
//                                       </Tooltip>
//                                     </TableCell>
//                                     <TableCell>
//                                       <Typography fontSize="0.85rem">
//                                         {getDisplayStatus(t.status_detail?.field_name || t.status || "-")}
//                                       </Typography>
//                                       <Typography fontSize="0.85rem">
//                                         {t.priority_detail?.field_name || t.priority || "-"}
//                                       </Typography>
//                                     </TableCell>
//                                     <TableCell>
//                                       <Tooltip
//                                         arrow
//                                         placement="top"
//                                         title={
//                                           <Box>
//                                             <div>
//                                               <strong>Category:</strong> {t.category_detail?.category_name || "-"}
//                                             </div>
//                                             <div>
//                                               <strong>Subcategory:</strong> {t.subcategory_detail?.subcategory_name || "-"}
//                                             </div>
//                                           </Box>
//                                         }
//                                       >
//                                         <Box sx={{ cursor: "pointer" }}>
//                                           <Typography fontSize="0.85rem">
//                                             {t.category_detail?.category_name || "-"}
//                                           </Typography>
//                                           <Typography fontSize="0.85rem">
//                                             {t.subcategory_detail?.subcategory_name || "-"}
//                                           </Typography>
//                                         </Box>
//                                       </Tooltip>
//                                     </TableCell>
//                                     <TableCell>
//                                       <Typography fontSize="0.85rem">
//                                         {t.department_detail?.field_name || "-"}
//                                       </Typography>
//                                       <Typography fontSize="0.85rem">
//                                         {t.location_detail?.field_name || "-"}
//                                       </Typography>
//                                     </TableCell>
//                                     <TableCell sx={{ maxWidth: 150 }}>
//                                       <Tooltip title={t.requested_detail?.email || t.requested_by || "-"}>
//                                         <Typography fontSize="0.85rem"
//                                           sx={{
//                                             overflow: "hidden",
//                                             textOverflow: "ellipsis",
//                                             whiteSpace: "nowrap",
//                                           }}
//                                         >
//                                           {t.requested_detail?.email || t.requested_by || "-"}
//                                         </Typography>
//                                       </Tooltip>
//                                     </TableCell>
//                                     <TableCell>
//                                       <Typography fontSize="0.85rem">
//                                         {t.created_date ? new Date(t.created_date).toLocaleDateString() : "-"}
//                                       </Typography>
//                                       <Typography fontSize="0.85rem">
//                                         {t.updated_date ? new Date(t.updated_date).toLocaleDateString() : "-"}
//                                       </Typography>
//                                     </TableCell>
//                                     <TableCell>
//                                       <Box sx={{ display: "flex", gap: 1 }}>
//                                         <Tooltip title="Follow-up Chat">
//                                           <IconButton
//                                             onClick={() => handleChatDrawerOpen(t.ticket_no)}
//                                             size="small"
//                                             sx={{ color: "#667eea" }}
//                                           >
//                                             <ChatIcon fontSize="small" />
//                                           </IconButton>
//                                         </Tooltip>
//                                         <Tooltip title="View Details">
//                                           <IconButton
//                                             onClick={() => handleTicketClick(t.ticket_no)}
//                                             sx={{ color: "#667eea" }}
//                                             size="small"
//                                           >
//                                             <VisibilityIcon fontSize="small" />
//                                           </IconButton>
//                                         </Tooltip>
//                                       </Box>
//                                     </TableCell>
//                                   </TableRow>
//                                 ))
//                             ) : (
//                               <TableRow>
//                                 <TableCell colSpan={9} align="center" sx={{ py: 4, color: "#718096" }}>
//                                   No tickets found.
//                                 </TableCell>
//                               </TableRow>
//                             )}
//                           </TableBody>
//                         </Table>
//                       </TableContainer>
//                     </Card>
//                   )}
//                   {filteredRows.length > 0 && (
//                     <Stack
//                       direction={isMobile ? "column" : "row"}
//                       justifyContent="space-between"
//                       alignItems="center"
//                       sx={{ py: 2, px: 3, borderTop: "1px solid #E2E8F0" }}
//                     >
//                       <Typography
//                         variant="body2"
//                         color="#718096"
//                         sx={{ fontSize: { xs: "13px", sm: "14px" } }}
//                       >
//                         Showing {page * rowsPerPage + 1} to{" "}
//                         {Math.min((page + 1) * rowsPerPage, filteredRows.length)} of{" "}
//                         {filteredRows.length} tickets
//                       </Typography>
//                       <Pagination
//                         count={Math.ceil(filteredRows.length / rowsPerPage)}
//                         page={page + 1}
//                         onChange={(e, value) => setPage(value - 1)}
//                         variant="outlined"
//                         shape="rounded"
//                         showFirstButton
//                         showLastButton
//                         siblingCount={1}
//                         boundaryCount={1}
//                         size={isMobile ? "small" : "medium"}
//                         sx={{
//                           "& .MuiPaginationItem-root": {
//                             borderRadius: "8px",
//                             borderColor: "#CBD5E0",
//                             color: "#4A5568",
//                             fontSize: { xs: "12px", sm: "14px" },
//                             minWidth: { xs: 32, sm: 36 },
//                             "&.Mui-selected": {
//                               backgroundColor: "#667eea",
//                               color: "#fff",
//                               borderColor: "#667eea",
//                               "&:hover": {
//                                 backgroundColor: "#556cd6",
//                               },
//                             },
//                             "&:hover": {
//                               backgroundColor: "#F7FAFC",
//                             },
//                           },
//                         }}
//                       />
//                     </Stack>
//                   )}
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
//         <Box sx={{ display: "flex", flexDirection: "column", height: "100%", bgcolor: "background.paper" }}>
//           <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider", bgcolor: "primary.main", color: "white" }}>
//             <Typography variant="caption" sx={{ color: "white" }}>
//               Ticket #{currentChatTicket?.id}
//             </Typography>
//             <Typography variant="h6">{currentChatTicket?.title || "Ticket Details"}</Typography>
//           </Box>

//           <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
//             <Tabs value={chatTab} onChange={(e, v) => setChatTab(v)} centered variant="fullWidth">
//               <Tab label="Follow-up" icon={<ChatIcon />} iconPosition="start" />
//               <Tab label="Clarification Required" icon={<HelpOutlineIcon />} iconPosition="start" disabled={isTicketSolved() || isTicketClarificationRequired()} />
//               <Tab label="Solution" icon={<DoneAllIcon />} iconPosition="start" disabled={isTicketSolved() || isTicketClarificationRequired()} />
//               {/* <Tab
//                 label="Solution"
//                 icon={<DoneAllIcon />}
//                 iconPosition="start"
//                 disabled={
//                   isTicketSolved() ||
//                   isTicketClarificationRequired() ||
//                   currentTicketData?.status_detail?.field_name === "Closed" ||
//                   selectedType === "clarification_applied" // When viewing clarification_applied tickets
//                 }
//               /> */}
              
//               {/* <Tab
//                 label="Clarification Required"
//                 icon={<HelpOutlineIcon />}
//                 iconPosition="start"
//                 disabled={
//                   isTicketSolved() ||
//                   isTicketClarificationRequired() ||
//                   currentTicketData?.status_detail?.field_name === "Closed"
//                 }
//               /> */}
               
//             </Tabs>
//           </Box>

//           <Box sx={{ flex: 1 }}>
//             {chatTab === 0 && (
//               <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
//                 <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
//                   {loadingFollowUpChats ? (
//                     <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
//                       <CircularProgress />
//                     </Box>
//                   ) : groupedChats.length === 0 ? (
//                     <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100%", color: "text.secondary" }}>
//                       <ChatIcon sx={{ fontSize: 60, mb: 2, opacity: 0.5 }} />
//                       <Typography>No messages yet</Typography>
//                     </Box>
//                   ) : (
//                     groupedChats.map((group) => (
//                       <Box key={group.dateKey} sx={{ mb: 4 }}>
//                         <Divider sx={{ my: 3 }}>
//                           <Chip label={group.date} size="small" sx={{ bgcolor: "grey.200" }} />
//                         </Divider>
//                         {group.messages.map((msg, index) => {
//                           const msgId = msg.id || `msg-${index}-${Date.now()}`;
//                           const isMe = Number(msg.sender) === Number(currentUserId);
//                           const isProtected = msg.protected === true || msg.protected === "true";
//                           const isRevealed = revealedMessages.has(msgId);
//                           const canReveal = Number(msg.sender) === Number(currentUserId) || Number(msg.receiver) === Number(currentUserId);

//                           const toggleReveal = () => {
//                             if (!canReveal) return;
//                             setRevealedMessages(prev => {
//                               const newSet = new Set(prev);
//                               if (newSet.has(msgId)) {
//                                 newSet.delete(msgId);
//                               } else {
//                                 newSet.add(msgId);
//                               }
//                               return newSet;
//                             });
//                           };

//                           // Exact behavior you requested
//                           const getDisplayedMessage = () => {
//                             if (!isProtected) {
//                               return msg.message || "";
//                             }

//                             if (!canReveal) {
//                               return "*** PROTECTED MESSAGE - VISIBLE ONLY TO PARTICIPANTS ***";
//                             }

//                             // If user can reveal
//                             if (isRevealed) {
//                               // Show real decrypted content
//                               return msg.decrypted_message || msg.message || "(No content)";
//                             }

//                             // Default for protected: show masked text + eye
//                             return "*** PROTECTED MESSAGE - VISIBLE ONLY TO PARTICIPANTS ***";
//                           };

//                           return (
//                             <Box
//                               key={msgId}
//                               sx={{
//                                 display: "flex",
//                                 justifyContent: isMe ? "flex-end" : "flex-start",
//                                 mb: 2,
//                               }}
//                             >
//                               {!isMe ? (
//                                 <Box sx={{ display: "flex", alignItems: "flex-end", gap: 1, maxWidth: "85%" }}>
//                                   <Avatar sx={{ width: 36, height: 36, bgcolor: "grey.400" }}>
//                                     {getInitials(chatRecipient?.name || "R")}
//                                   </Avatar>
//                                   <Box
//                                     sx={{
//                                       position: "relative",
//                                       bgcolor: "grey.100",
//                                       color: "text.primary",
//                                       p: 1.5,
//                                       borderRadius: 2,
//                                       boxShadow: 1,
//                                     }}
//                                   >
//                                     {/* Shield icon for protected messages */}
//                                     {isProtected && (
//                                       <SecurityIcon
//                                         sx={{
//                                           position: "absolute",
//                                           top: -8,
//                                           right: -8,
//                                           fontSize: 18,
//                                           bgcolor: "success.main",
//                                           color: "white",
//                                           borderRadius: "50%",
//                                           p: 0.4,
//                                           boxShadow: 2,
//                                         }}
//                                       />
//                                     )}

//                                     <Typography variant="body2" sx={{ wordBreak: "break-word", whiteSpace: "pre-wrap" }}>
//                                       {getDisplayedMessage()}
//                                     </Typography>

//                                     {/* Eye icon: only for protected messages and authorized users */}
//                                     {isProtected && canReveal && (
//                                       <IconButton
//                                         size="small"
//                                         onClick={toggleReveal}
//                                         sx={{
//                                           position: "absolute",
//                                           bottom: 4,
//                                           right: 4,
//                                           bgcolor: "rgba(0,0,0,0.08)",
//                                           "&:hover": { bgcolor: "rgba(0,0,0,0.15)" },
//                                         }}
//                                       >
//                                         {isRevealed ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
//                                       </IconButton>
//                                     )}

//                                     <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1 }}>
//                                       <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.65rem" }}>
//                                         {msg.createdon
//                                           ? new Date(msg.createdon).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
//                                           : "—"}
//                                       </Typography>
//                                       <Typography variant="caption" sx={{ fontSize: "0.7rem", ml: 1 }}>
//                                         {chatRecipient?.name || "Requester"}
//                                       </Typography>
//                                     </Box>
//                                   </Box>
//                                 </Box>
//                               ) : (
//                                 <Box sx={{ display: "flex", alignItems: "flex-end", gap: 1, flexDirection: "row-reverse", maxWidth: "85%" }}>
//                                   <Avatar sx={{ width: 36, height: 36, bgcolor: "primary.main", color: "white" }}>
//                                     {getInitials(currentUserName)}
//                                   </Avatar>
//                                   <Box
//                                     sx={{
//                                       position: "relative",
//                                       bgcolor: "primary.main",
//                                       color: "white",
//                                       p: 1.5,
//                                       borderRadius: 2,
//                                       boxShadow: 1,
//                                     }}
//                                   >
//                                     {isProtected && (
//                                       <SecurityIcon
//                                         sx={{
//                                           position: "absolute",
//                                           top: -8,
//                                           left: -8,
//                                           fontSize: 18,
//                                           bgcolor: "success.main",
//                                           color: "white",
//                                           borderRadius: "50%",
//                                           p: 0.4,
//                                           boxShadow: 2,
//                                         }}
//                                       />
//                                     )}

//                                     <Typography variant="body2" sx={{ wordBreak: "break-word", whiteSpace: "pre-wrap" }}>
//                                       {getDisplayedMessage()}
//                                     </Typography>

//                                     {isProtected && canReveal && (
//                                       <IconButton
//                                         size="small"
//                                         onClick={toggleReveal}
//                                         sx={{
//                                           position: "absolute",
//                                           bottom: 4,
//                                           right: 4,
//                                           color: "white",
//                                           bgcolor: "rgba(255,255,255,0.2)",
//                                           "&:hover": { bgcolor: "rgba(255,255,255,0.3)" },
//                                         }}
//                                       >
//                                         {isRevealed ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
//                                       </IconButton>
//                                     )}

//                                     <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1 }}>
//                                       <Typography variant="caption" sx={{ opacity: 0.8, fontSize: "0.65rem" }}>
//                                         {msg.createdon
//                                           ? new Date(msg.createdon).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
//                                           : "—"}
//                                       </Typography>
//                                       <Typography variant="caption" sx={{ fontSize: "0.7rem", ml: 1 }}>
//                                         You
//                                       </Typography>
//                                     </Box>
//                                   </Box>
//                                 </Box>
//                               )}
//                             </Box>
//                           );
//                         })}
//                       </Box>
//                     ))
//                   )}
//                 </Box>

//                 <Box sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
//                   <Box sx={{ display: "flex", gap: 1, alignItems: "flex-end" }}>
//                     <TextField
//                       fullWidth
//                       size="small"
//                       placeholder="Type your message..."
//                       value={newFollowUpMessage}
//                       onChange={(e) => setNewFollowUpMessage(e.target.value)}
//                       onKeyPress={(e) => {
//                         if (e.key === "Enter" && !e.shiftKey) {
//                           e.preventDefault();
//                           sendFollowUpMessageHandler(newFollowUpMessage);
//                         }
//                       }}
//                       multiline
//                       maxRows={4}
//                       disabled={sendingFollowUpMessage}
//                     />
//                     <Tooltip title={isConfidentialTicket ? "All messages protected (Confidential)" : isProtectedMode ? "Protected ON" : "Send protected"}>
//                       <span>
//                         <IconButton
//                           onClick={() => !isConfidentialTicket && setIsProtectedMode(!isProtectedMode)}
//                           disabled={isConfidentialTicket}
//                           sx={{
//                             color: isProtectedMode || isConfidentialTicket ? "white" : "default",
//                             bgcolor: isProtectedMode || isConfidentialTicket ? "success.main" : "grey.200",
//                             "&:hover": { bgcolor: isProtectedMode || isConfidentialTicket ? "success.dark" : "grey.300" },
//                           }}
//                         >
//                           <SecurityIcon />
//                         </IconButton>
//                       </span>
//                     </Tooltip>
//                     <IconButton
//                       onClick={() => sendFollowUpMessageHandler(newFollowUpMessage)}
//                       disabled={!newFollowUpMessage.trim() || sendingFollowUpMessage}
//                       color="primary"
//                     >
//                       {sendingFollowUpMessage ? <CircularProgress size={20} /> : <SendIcon />}
//                     </IconButton>
//                   </Box>
//                   {(isProtectedMode || isConfidentialTicket) && (
//                     <Typography variant="caption" color="success.main" sx={{ mt: 1, textAlign: "center", display: "block" }}>
//                       <SecurityIcon fontSize="small" sx={{ verticalAlign: "middle", mr: 0.5 }} />
//                       {isConfidentialTicket ? "All messages are protected" : "This message will be protected"}
//                     </Typography>
//                   )}
//                 </Box>
//               </Box>
//             )}

//             {chatTab === 1 && (
//               <Box sx={{ display: "flex", flexDirection: "column", p: 3 }}>
//                 {isTicketClarificationRequired() ? (
//                   <Box sx={{ textAlign: "center", flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
//                     <HelpOutlineIcon sx={{ fontSize: 80, color: "warning.main", mb: 2 }} />
//                     <Typography variant="h6" fontWeight={600}>Clarification Required Already Sent</Typography>
//                     <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>
//                       Waiting for requester to respond.
//                     </Typography>
//                     <Button variant="outlined" onClick={() => setChatTab(0)}>
//                       Back to Follow-up
//                     </Button>
//                   </Box>
//                 ) : isTicketSolved() ? (
//                   <Box sx={{ textAlign: "center", flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
//                     <DoneAllIcon sx={{ fontSize: 80, color: "success.main", mb: 2 }} />
//                     <Typography variant="h6" fontWeight={600}>Ticket Already Solved</Typography>
//                     <Typography color="text.secondary" sx={{ mt: 1 }}>
//                       Cannot request clarification on solved tickets.
//                     </Typography>
//                   </Box>
//                 ) : (
//                   <>
//                     <Box sx={{ textAlign: "center", mb: 3 }}>
//                       <HelpOutlineIcon sx={{ fontSize: 60, color: "warning.main", mb: 2 }} />
//                       <Typography variant="h6" fontWeight={600}>Clarification Required</Typography>
//                       <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
//                         Ask for more details if something is unclear.
//                       </Typography>
//                     </Box>

//                     <TextField
//                       multiline
//                       rows={6}
//                       placeholder="Please clarify the following..."
//                       value={clarificationText}
//                       onChange={(e) => setClarificationText(e.target.value)}
//                       variant="outlined"
//                       fullWidth
//                       sx={{ mb: 3 }}
//                       disabled={sendingClarification}
//                     />

//                     <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
//                       <Button
//                         variant="contained"
//                         color="warning"
//                         size="large"
//                         startIcon={<QuestionAnswerIcon />}
//                         onClick={handleSendClarification}
//                         disabled={!clarificationText.trim() || sendingClarification}
//                       >
//                         {sendingClarification ? <CircularProgress size={20} /> : "Send Request"}
//                       </Button>
//                       <Button variant="outlined" onClick={() => { setClarificationText(""); setChatTab(0); }} disabled={sendingClarification}>
//                         Cancel
//                       </Button>
//                     </Box>
//                   </>
//                 )}
//               </Box>
//             )}

//             {chatTab === 2 && (
//               <Box sx={{ p: 4 }}>
//                 {isTicketSolved() ? (
//                   <Box sx={{ textAlign: "center" }}>
//                     <DoneAllIcon sx={{ fontSize: 80, color: "success.main", mb: 2 }} />
//                     <Typography variant="h6">Ticket Already Solved</Typography>
//                   </Box>
//                 ) : isTicketClarificationRequired() ? (
//                   <Box sx={{ textAlign: "center" }}>
//                     <HelpOutlineIcon sx={{ fontSize: 80, color: "warning.main", mb: 2 }} />
//                     <Typography variant="h6">Clarification Required</Typography>
//                     <Typography color="text.secondary">Resolve clarification first.</Typography>
//                   </Box>
//                 ) : (
//                   <>
//                     <Box sx={{ textAlign: "center", mb: 2 }}>
//                       <DoneAllIcon sx={{ fontSize: 64, color: "success.main" }} />
//                       <Typography variant="h6" gutterBottom textAlign="center" color="success.main">
//                         Mark as Solved
//                       </Typography>
//                     </Box>
                    
//                     <Autocomplete
//                       options={resolutionTypes}
//                       getOptionLabel={(option) => option.label}
//                       value={selectedResolutionType}
//                       onChange={(e, newValue) => {
//                         setSelectedResolutionType(newValue);
//                         if (newValue) {
//                           setSolutionRemark(newValue.description + (solutionRemark ? "\n\n" + solutionRemark : ""));
//                         } else {
//                           setSolutionRemark("");
//                         }
//                       }}
//                       renderInput={(params) => (
//                         <TextField {...params} label="Type of Fix" size="small" variant="outlined" fullWidth sx={{"& .MuiOutlinedInput-root": { borderRadius: 3 }}}/>
//                       )}
//                       sx={{ mb: 3 }}
//                     />

//                     <TextField
//                       multiline
//                       rows={6}
//                       label="Remarks / Solution Details"
//                       placeholder="Add any additional details..."
//                       value={solutionRemark}
//                       onChange={(e) => setSolutionRemark(e.target.value)}
//                       variant="outlined"
//                       fullWidth
//                       sx={{ mb: 3, "& .MuiOutlinedInput-root": { borderRadius: 3 }, }}
//                       disabled={sendingSolution}
//                     />

//                     <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
//                       <Button
//                         variant="contained"
//                         color="success"
//                         size="large"
//                         startIcon={sendingSolution ? <CircularProgress size={20} /> : <DoneAllIcon />}
//                         onClick={handleSolutionSubmit}
//                         disabled={sendingSolution}
//                         sx={{ borderRadius: 3 }}
//                       >
//                         {sendingSolution ? "Submitting..." : "Confirm Solved"}
//                       </Button>
//                       <Button variant="outlined" sx={{ borderRadius: 3 }} onClick={() => setChatTab(0)} disabled={sendingSolution}>
//                         Cancel
//                       </Button>
//                     </Box>
//                   </>
//                 )}
//               </Box>
//             )}
//             {/* {chatTab === 1 && (
//               <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", p: 4, gap: 2 }}>
//                 {isTicketSolved() ? (
//                   <>
//                     <DoneAllIcon sx={{ fontSize: 64, color: "success.main" }} />
//                     <Typography variant="h6" fontWeight={600}>Ticket Already Solved</Typography>
//                     <Typography color="text.secondary">This ticket has been marked as solved.</Typography>
//                   </>
//                 ) : isTicketClarificationRequired() ? (
//                   <>
//                     <HelpOutlineIcon sx={{ fontSize: 64, color: "warning.main" }} />
//                     <Typography variant="h6" fontWeight={600}>Clarification Required</Typography>
//                     <Typography color="text.secondary">Cannot mark as solved until clarification is resolved.</Typography>
//                   </>
//                 ) : (
//                   <Box>
//                     <Box sx={{ textAlign: "center", mb: 2 }}>
//                       <DoneAllIcon sx={{ fontSize: 64, color: "success.main" }} />
//                       <Typography variant="h6" fontWeight={600}>Mark Ticket as Solved</Typography>
//                     </Box>
                    
//                     <TextField
//                       multiline
//                       rows={4}
//                       placeholder="Please clarify the following..."
//                       value={slovedText}
//                       onChange={(e) => setSlovedText(e.target.value)}
//                       variant="outlined"
//                       fullWidth
//                       sx={{ mb: 3 }}
//                       disabled={sendingSloved}
//                     />
                    
//                     <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
//                       <Button
//                         variant="contained"
//                         color="warning"
//                         size="large"
//                         startIcon={<DoneAllIcon />}
//                         onClick={handleSolutionSubmit}
//                         disabled={!clarificationText.trim() || sendingSloved}
//                       >
//                         {sendingSloved ? "Confirm" : "Confirm Solved"}
//                       </Button>
//                       <Button variant="outlined" onClick={() => {setChatTab(0); }} disabled={sendingClarification}>
//                         Cancel
//                       </Button>
//                     </Box>
//                     <Button variant="contained" color="success" size="large" onClick={handleSolutionSubmit}>
//                       Confirm Solved
//                     </Button>
//                   </Box>
//                 )}
//                 <Button variant="outlined" onClick={() => setChatTab(0)}>Back</Button>
//               </Box>
//             )} */}

            
//           </Box>
//         </Box>
//       </Drawer>
//     </>
//   );
// };

// export default ApproverTabs;
import { useEffect, useMemo, useState } from "react";
import { useTheme } from "@mui/material/styles";
import {
  Box, Card, CardContent, Typography, Grid, TextField, Button, Table, TableHead, TableRow, TableCell, TableBody, TableContainer,
  useMediaQuery, Autocomplete, Stack, Pagination, Tooltip, CircularProgress, IconButton, Drawer, Divider, Chip, Avatar, Alert,
  Tabs, Tab, Icon,
} from "@mui/material";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SecurityIcon from "@mui/icons-material/Security";
import ChatIcon from "@mui/icons-material/Chat";
import SendIcon from "@mui/icons-material/Send";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  fetchApproverTickets,
  fetchMessages,
  sendMessage,
  getTicketDetails,
  updateTicket,
  fetchFixTypes,
  fetchConfigurations,
} from "../../Api";

const ApproverTabs = ({ approverStatus: propUserStatus }) => {
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
    clarification_required: [],
    clarification_applied: [],
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const [userStatus, setUserStatus] = useState(null);
  const [error, setError] = useState(null);
  
  // User & Entity
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUserName, setCurrentUserName] = useState("You");
  const [currentEntityId, setCurrentEntityId] = useState(null);
  
  // Chat states
  const [showFollowUpChat, setShowFollowUpChat] = useState(false);
  const [followUpChats, setFollowUpChats] = useState([]);
  const [loadingFollowUpChats, setLoadingFollowUpChats] = useState(false);
  const [newFollowUpMessage, setNewFollowUpMessage] = useState("");
  const [sendingFollowUpMessage, setSendingFollowUpMessage] = useState(false);
  const [currentChatTicket, setCurrentChatTicket] = useState(null);
  const [chatRecipient, setChatRecipient] = useState(null);
  
  // Ticket data
  const [currentTicketData, setCurrentTicketData] = useState(null);
  
  // Protected & Reveal states
  const [isProtectedMode, setIsProtectedMode] = useState(false);
  const [revealedMessages, setRevealedMessages] = useState(new Set());
  
  // Solution States
  const [selectedResolutionType, setSelectedResolutionType] = useState(null);
  const [solutionRemark, setSolutionRemark] = useState("");
  const [sendingSolution, setSendingSolution] = useState(false);
  
  // Clarification states
  const [clarificationText, setClarificationText] = useState("");
  const [sendingClarification, setSendingClarification] = useState(false);
  
  // Confidential ticket state
  const [isConfidentialTicket, setIsConfidentialTicket] = useState(false);
  const [myProtectedMessages, setMyProtectedMessages] = useState({});
  
  // Tab index
  const [chatTab, setChatTab] = useState(0);
  
  // Resolution types state
  const [resolutionTypes, setResolutionTypes] = useState([]);
  
  // Configurations state - store all configurations
  const [configurations, setConfigurations] = useState([]);
  // Status configurations extracted from configurations
  const [statusConfigs, setStatusConfigs] = useState([]);
  
  const navigate = useNavigate();

  useEffect(() => {
    const userDataString = localStorage.getItem("user");
    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString);
        setCurrentUserId(userData?.id || null);
        setCurrentUserName(userData?.name || userData?.username || "You");
        let entityId = null;
        if (userData?.entity_data?.id) entityId = userData.entity_data.id;
        else if (userData?.entities?.length > 0) entityId = userData.entities[0].id;
        else if (userData?.entities_ids?.length > 0) entityId = userData.entities_ids[0];
        setCurrentEntityId(entityId ? Number(entityId) : null);
      } catch (err) {
        console.error("Error parsing user data:", err);
      }
    } else {
      const userId = localStorage.getItem("current_user_id");
      setCurrentUserId(userId ? parseInt(userId, 10) : null);
    }
  }, []);

  // Fetch configurations including statuses
  useEffect(() => {
    const loadConfigurations = async () => {
      try {
        const response = await fetchConfigurations();
        const data = response?.data || response || [];
        
        if (Array.isArray(data)) {
          setConfigurations(data);
          
          // Extract status configurations where field_type is "Status" or "status"
          const statusList = data
            .filter(config => 
              config.field_type?.toLowerCase() === "status" || 
              config.field_type === ""
            )
            .map(config => ({
              id: config.id,
              field_name: config.field_name || "",
              field_values: config.field_values || "",
              field_type: config.field_type || ""
            }));
          
          setStatusConfigs(statusList);
          console.log("Status configurations loaded:", statusList);
        }
      } catch (err) {
        console.error("Failed to fetch configurations:", err);
        toast.error("Failed to load configurations");
      }
    };
    
    loadConfigurations();
  }, []);

  // Helper function to get status ID by field_name or field_values
  const getStatusId = (statusName) => {
    if (!statusName || !statusConfigs.length) return null;
    
    // Try to find by field_name first
    let status = statusConfigs.find(config => 
      config.field_name?.toLowerCase() === statusName.toLowerCase()
    );
    
    // If not found by field_name, try by field_values
    if (!status) {
      status = statusConfigs.find(config => 
        config.field_values?.toLowerCase() === statusName.toLowerCase()
      );
    }
    
    // If still not found, try partial matching
    if (!status) {
      status = statusConfigs.find(config => 
        config.field_name?.toLowerCase().includes(statusName.toLowerCase()) ||
        config.field_values?.toLowerCase().includes(statusName.toLowerCase())
      );
    }
    
    return status ? status.id : null;
  };

  // Helper function to get status by ID
  const getStatusById = (statusId) => {
    if (!statusId || !statusConfigs.length) return null;
    return statusConfigs.find(config => config.id === statusId);
  };

  // Fetch resolution types
  useEffect(() => {
    const loadFixTypes = async () => {
      try {
        const response = await fetchFixTypes();
        const data = response?.data || response || [];
        if (Array.isArray(data)) {
          const activeTypes = data
            .filter(type => type.is_active)
            .map(type => ({
              value: type.id,
              label: type.name,
              description: type.description,
            }))
            .sort((a, b) => a.value - b.value);
          
          setResolutionTypes(activeTypes);
        }
      } catch (err) {
        console.error("Failed to fetch fix types:", err);
        toast.error("Failed to load resolution types");
      }
    };
    loadFixTypes();
  }, []);

  const getDisplayStatus = (status) => (status === "New" ? "Pending" : status);

  const processTickets = (ticketList) => {
    if (!Array.isArray(ticketList)) return [];
    return ticketList.map((ticket) => ({
      ...ticket,
      assigned_users: Array.isArray(ticket.assigned_users)
        ? ticket.assigned_users.map((user) => ({
            id: user.id || null,
            name: user.name || user.full_name || user.email || "Unknown User",
            email: user.email || "unknown@example.com",
            is_unknown: !user.id,
          }))
        : [],
      assigned_groups: Array.isArray(ticket.assigned_groups)
        ? ticket.assigned_groups.map((group) => ({
            id: group.id || null,
            name: group.name || "Unknown Group",
            is_unknown: !group.id,
          }))
        : [],
    }));
  };

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      if (propUserStatus) {
        let processed = propUserStatus;
        if (propUserStatus.user_stats) {
          const s = propUserStatus.user_stats;
          processed = {
            new_assigned: s.new_assigned || 0,
            solved: s.solved || 0,
            closed: s.closed || 0,
            clarification_required: s.clarification_required || 0,
            clarification_applied: s.clarification_applied || 0,
            new_assigned_tickets: processTickets(s.new_assigned_tickets || []),
            solved_tickets: processTickets(s.solved_tickets || []),
            closed_tickets: processTickets(s.closed_tickets || []),
            clarification_required_tickets: processTickets(s.clarification_required_tickets || []),
            clarification_applied_tickets: processTickets(s.clarification_applied_tickets || []),
          };
        }
        setUserStatus(processed);
      } else {
        const data = await fetchApproverTickets();
        if (data?.success && data.user_stats) {
          const s = data.user_stats;
          setUserStatus({
            new_assigned: s.new_assigned || 0,
            solved: s.solved || 0,
            closed: s.closed || 0,
            clarification_required: s.clarification_required || 0,
            clarification_applied: s.clarification_applied || 0,
            new_assigned_tickets: processTickets(s.new_assigned_tickets || []),
            solved_tickets: processTickets(s.solved_tickets || []),
            closed_tickets: processTickets(s.closed_tickets || []),
            clarification_required_tickets: processTickets(s.clarification_required_tickets || []),
            clarification_applied_tickets: processTickets(s.clarification_applied_tickets || []),
          });
        } else {
          throw new Error("Invalid response");
        }
      }
    } catch (err) {
      setError(err.message || "Failed to load dashboard");
      toast.error(err.message || "Failed to load");
      setUserStatus({
        new_assigned: 0,
        solved: 0,
        closed: 0,
        clarification_required: 0,
        clarification_applied: 0,
        new_assigned_tickets: [],
        solved_tickets: [],
        closed_tickets: [],
        clarification_required_tickets: [],
        clarification_applied_tickets: [],
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [propUserStatus]);

  useEffect(() => {
    if (userStatus) {
      setTickets({
        new_assigned: userStatus.new_assigned_tickets || [],
        solved: userStatus.solved_tickets || [],
        closed: userStatus.closed_tickets || [],
        clarification_required: userStatus.clarification_required_tickets || [],
        clarification_applied: userStatus.clarification_applied_tickets || [],
      });
    }
  }, [userStatus]);

  const getCount = (type) => {
    if (type === "clarification_required") return userStatus?.clarification_required ?? 0;
    if (type === "clarification_applied") return userStatus?.clarification_applied ?? 0;
    return userStatus?.[type] ?? (tickets[type]?.length || 0);
  };

  const statusCards = [
    {
      id: "new_assigned",
      label: "Pending",
      color: "warning",
      icon: <NewReleasesIcon sx={{ fontSize: { xs: 25, sm: 18, md: 25 } }} />,
      count: getCount("new_assigned"),
    },
    {
      id: "solved",
      label: "Resolved",
      color: "success",
      icon: <DoneAllIcon sx={{ fontSize: { xs: 25, sm: 18, md: 25 } }} />,
      count: getCount("solved"),
    },
    {
      id: "closed",
      label: "Closed",
      color: "info",
      icon: <LockIcon sx={{ fontSize: { xs: 25, sm: 18, md: 25 } }} />,
      count: getCount("closed"),
    },
    {
      id: "clarification_required",
      label: "Clar. Required",
      color: "error",
      icon: <HelpOutlineIcon sx={{ fontSize: { xs: 25, sm: 18, md: 25 } }} />,
      count: getCount("clarification_required"),
    },
    {
      id: "clarification_applied",
      label: "Clar. Supplied",
      color: "primary",
      icon: <QuestionAnswerIcon sx={{ fontSize: { xs: 25, sm: 18, md: 25 } }} />,
      count: getCount("clarification_applied"),
    },
  ];

  const headingMap = {
    new_assigned: "Pending Tickets",
    solved: "Resolved Tickets",
    closed: "Closed Tickets",
    clarification_required: "Clarification Required Tickets",
    clarification_applied: "Clarification Supplied Tickets",
  };

  const TechTabelCol = [
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
    () => [...new Set(selectedTickets.map((t) => t.department_detail?.field_name).filter(Boolean))],
    [selectedTickets]
  );

  const filteredRows = useMemo(() => {
    const lower = search.toLowerCase().trim();
    if (!lower && !department) return selectedTickets;
    return selectedTickets
      .filter((t) => {
        const deptMatch = department ? t.department_detail?.field_name === department : true;
        if (!lower) return deptMatch;
        const fields = [
          String(t.ticket_no),
          t.title,
          t.description,
          t.status_detail?.field_values,
          t.priority_detail?.field_values,
          t.category_detail?.category_name,
          t.subcategory_detail?.subcategory_name,
          t.department_detail?.field_name,
          t.location_detail?.field_name,
          t.requested_detail?.email,
          t.requested_detail?.name,
        ];
        return fields.some((f) => f?.toLowerCase().includes(lower));
      })
      .filter((t) => !department || t.department_detail?.field_name === department);
  }, [selectedTickets, search, department]);

  const getInitials = (name) =>
    !name || name === "You" ? "U" : name.split(" ").map((n) => n[0]).join("").toUpperCase().substring(0, 2);

  const groupedChats = useMemo(() => {
    const groups = {};
    followUpChats.forEach((m) => {
      const date = new Date(m.createdon);
      const dateKey = date.toISOString().split("T")[0];
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(m);
    });
    return Object.entries(groups)
      .map(([dateKey, msgs]) => ({
        dateKey,
        date: new Date(dateKey).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }),
        messages: msgs.sort((a, b) => new Date(a.createdon) - new Date(b.createdon)),
      }))
      .sort((a, b) => a.dateKey.localeCompare(b.dateKey));
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

  const handleTicketClick = (no) => {
    localStorage.setItem("selectedTicketId", no);
    navigate("/Approval");
  };

  const fetchTicketMessages = async (ticketNo, currentUserId, recipientId) => {
    try {
      const allMessages = await fetchMessages();
      return allMessages.filter(
        (msg) =>
          msg.ticket_no == ticketNo &&
          ((msg.sender === currentUserId && msg.receiver === recipientId) ||
            (msg.sender === recipientId && msg.receiver === currentUserId))
      ) || [];
    } catch (err) {
      toast.error("Failed to load messages");
      return [];
    }
  };

  const sendFollowUpMessageHandler = async (text) => {
    if (!text.trim()) return toast.error("Message cannot be empty");
    if (!currentChatTicket?.id || !chatRecipient?.id || !currentUserId) return toast.error("Cannot send message");
    const shouldProtect = isConfidentialTicket || isProtectedMode;
    setSendingFollowUpMessage(true);
    try {
      await sendMessage({
        sender: currentUserId,
        receiver: chatRecipient.id,
        ticket_no: currentChatTicket.id,
        message: text.trim(),
        protected: shouldProtect,
      });
      const msgs = await fetchMessages();
      const filtered = msgs.filter(m =>
        m.ticket_no == currentChatTicket.id &&
        ((m.sender === currentUserId && m.receiver === chatRecipient.id) ||
         (m.sender === chatRecipient.id && m.receiver === currentUserId))
      );
      setFollowUpChats(filtered.sort((a, b) => new Date(a.createdon) - new Date(b.createdon)));
      setNewFollowUpMessage("");
      if (!isConfidentialTicket) setIsProtectedMode(false);
      toast.success(shouldProtect ? "Protected message sent!" : "Message sent!");
    } catch (err) {
      toast.error("Failed to send message");
    } finally {
      setSendingFollowUpMessage(false);
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
    
    // Get Clarification Required status ID dynamically
    const clarificationRequiredId = getStatusId("Clarification Required");
    if (!clarificationRequiredId) {
      toast.error("Clarification Required status not found in configurations");
      return;
    }
    
    setSendingClarification(true);
    try {
      const ticketNoStr = String(currentChatTicket.id);
      const formData = new FormData();
      formData.append("title", currentTicketData.title || "");
      formData.append("description", currentTicketData.description || "");
      formData.append("category", currentTicketData.category || currentTicketData.category_detail?.id || "");
      
      // Use dynamically fetched status ID for clarification required
      formData.append("status", String(clarificationRequiredId));
      
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
      
      const clarificationMessage = `[Clarification Required]\n\n${clarificationText.trim()}`;
      await sendFollowUpMessageHandler(clarificationMessage);
      
      toast.success("Clarification required sent and ticket status updated!");
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

  const handleSolutionSubmit = async () => {
    if (!currentChatTicket?.id || !currentTicketData) {
      toast.error("Ticket not loaded");
      return;
    }
    if (!currentEntityId) {
      toast.error("Your entity is not configured. Contact admin.");
      return;
    }
    
    // Get Solved status ID dynamically
    const solvedStatusId = getStatusId("Solved");
    if (!solvedStatusId) {
      toast.error("Solved status not found in configurations");
      return;
    }
    
    setSendingSolution(true);
    try {
      const ticketNoStr = String(currentChatTicket.id);
      const formData = new FormData();
      formData.append("title", currentTicketData.title || "");
      formData.append("description", currentTicketData.description || "");
      formData.append("category", currentTicketData.category || currentTicketData.category_detail?.id || "");
      
      // Use dynamically fetched status ID for solved
      formData.append("status", String(solvedStatusId));
      
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
      
      const result = await updateTicket(ticketNoStr, formData);
      if (!result.success) throw new Error(result.error || "Update failed");
      
      // Send solution message to chat
      const resolutionLabel = selectedResolutionType?.label || "Not specified";
      const remark = solutionRemark.trim();
      const solutionMessage = `[Solution Provided]\n\n**Type of Fix:** ${resolutionLabel}\n${remark ? `\n**Remarks:**\n${remark}` : ""}`;
      
      await sendMessage({
        sender: currentUserId,
        receiver: chatRecipient.id,
        ticket_no: currentChatTicket.id,
        message: solutionMessage.trim(),
        protected: false,
      });
      
      // Refresh messages
      const msgs = await fetchMessages();
      const filtered = msgs.filter(
        (m) =>
          m.ticket_no == currentChatTicket.id &&
          ((m.sender === currentUserId && m.receiver === chatRecipient.id) ||
            (m.sender === chatRecipient.id && m.receiver === currentUserId))
      );
      setFollowUpChats(filtered.sort((a, b) => new Date(a.createdon) - new Date(b.createdon)));
      
      toast.success("Ticket marked as Solved and solution sent!");
      setSelectedResolutionType(null);
      setSolutionRemark("");
      setShowFollowUpChat(false);
      setSelectedType("solved");
      loadData();
    } catch (err) {
      console.error("Solution submit error:", err);
      toast.error("Failed to mark as solved");
    } finally {
      setSendingSolution(false);
    }
  };

  const handleChatDrawerOpen = async (ticketNo) => {
    if (!ticketNo || !currentUserId) return toast.error("Invalid ticket");
    const ticket = selectedTickets.find((t) => t.ticket_no == ticketNo);
    if (!ticket) return toast.error("Ticket not found");
    
    setChatTab(0);
    setLoadingFollowUpChats(true);
    setShowFollowUpChat(true);
    setFollowUpChats([]);
    setRevealedMessages(new Set());
    
    try {
      const details = await getTicketDetails(String(ticketNo));
      const data = details.ticket || details;
      setCurrentTicketData(data);
      setChatRecipient(data.requested_detail);
      setCurrentChatTicket({ id: ticketNo, title: data.title || ticket.title });
      
      // Check for confidential ticket
      const confidential = data.confidential === true || data.confidential === "true";
      setIsConfidentialTicket(confidential);
      setIsProtectedMode(confidential); // Force ON if confidential
      
      const recipientId = data.requested_detail?.id || data.requested_detail?.email;
      const msgs = await fetchTicketMessages(ticketNo, currentUserId, recipientId);
      setFollowUpChats(msgs.sort((a, b) => new Date(a.createdon) - new Date(b.createdon)));
    } catch {
      toast.error("Failed to load chat");
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
    setCurrentTicketData(null);
    setLoadingFollowUpChats(false);
    setChatTab(0);
    setClarificationText("");
    setRevealedMessages(new Set());
  };

  // Check if ticket is solved based on status from configurations
  const isTicketSolved = () => {
    if (!currentTicketData?.status_detail?.field_values) return false;
    const solvedStatus = statusConfigs.find(config => 
      config.field_name === "Solved" || config.field_values === "Solved"
    );
    if (!solvedStatus) return false;
    return currentTicketData.status_detail.field_values === solvedStatus.field_values;
  };

  // Check if ticket requires clarification based on status from configurations
  const isTicketClarificationRequired = () => {
    if (!currentTicketData?.status_detail?.field_values) return false;
    const clarificationStatus = statusConfigs.find(config => 
      config.field_name === "Clarification Required" || config.field_values === "Clarification Required"
    );
    if (!clarificationStatus) return false;
    return currentTicketData.status_detail.field_values === clarificationStatus.field_values;
  };

  const isActionDisabled = () => isTicketSolved() || isTicketClarificationRequired();

  if (error && !loading) {
    return (
      <Box sx={{ width: "100%" }}>
        <Alert severity="error" sx={{ mb: 2 }} action={<Button onClick={loadData}>Retry</Button>}>
          {error}
        </Alert>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

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
    "Solved": "#2E7D32",
    "Clarification Required": "#FB8C00",
    "Closed": "#757575",
    "Clarification Supplied": "#2196F3",
    "Follow-Up": "#9C27B0",
    "Cancelled": "#9E9E9E",
    "Re-assigned": "#FF9800",
  };

  // Loading configurations check
  const isConfigsLoading = statusConfigs.length === 0;

  return (
    <>
      <Box sx={{ width: "100%", mb:2 }}>
        <Grid container spacing={1} sx={{ mb: 2 }}>
          {statusCards.map((item) => (
            <Grid size={{ xs: 6, sm: 6, md: 4, lg: 2.4 }} key={item.id}>
              <Card
                onClick={() => handleCardClick(item.id)}
                sx={{
                  transition: "0.3s ease",
                  maxWidth: isMobile ? 500 : 300,
                  maxHeight: 110,
                  minHeight: 100,
                  borderRadius: 5,
                  "&:hover": {
                    background: "linear-gradient(135deg, #667eea, #764ba2)",
                    color: "#fff",
                    transform: "scale(1.03)",
                  },
                }}
              >
                <CardContent
                  sx={{
                    "&:last-child": { pt: 1 },
                    display: "flex",
                    gap: 2,
                    alignItems: "center"
                  }}
                >
                  <Box
                    sx={{
                      width: { xs: 40, sm: 40, md: 40 },
                      height: { xs: 40, sm: 40, md: 40 },
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
                    mb: 1,
                    gap: isMobile ? 2 : 0,
                  }}
                >
                  <Typography variant="h5" fontWeight={700} sx={{ color: "#2D3748" }}>
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
                      renderInput={(params) => (
                        <TextField {...params} label="Department" size="small" variant="outlined" />
                      )}
                      sx={{
                        width: { xs: "100%", sm: 300, md: 200 },
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
                        borderColor: "#CBD5E0",
                        color: "#4A5568",
                        "&:hover": { borderColor: "#667eea", backgroundColor: "#667eea10" },
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
                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                  <Box sx={{display: "flex", gap: 1, alignItems: "center" }}>
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
                                    {t.category_detail?.category_name || "-"} / {t.subcategory_detail?.subcategory_name || "-"}
                                  </span>
                                </Typography>
                                <Typography fontSize={13} mt={1}>
                                  <strong style={{ color: "#4A5568" }}>Dept:</strong>{" "}
                                  <span style={{ color: "#2D3748" }}>
                                    {t.department_detail?.field_name || "-"} | {t.location_detail?.field_name || "-"}
                                  </span>
                                </Typography>
                                <Typography fontSize={12} color="#718096" mt={1.5}>
                                  Open: {t.created_date ? new Date(t.created_date).toLocaleDateString() : "-"} <br />
                                  Update: {t.updated_date ? new Date(t.updated_date).toLocaleDateString() : "-"}
                                </Typography>
                                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2, gap: 1 }}>
                                  <Tooltip title="Follow-up Chat">
                                    <IconButton onClick={() => handleChatDrawerOpen(t.ticket_no)} size="small" sx={{ color: "#667eea" }}>
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
                              {TechTabelCol.map((col) => (
                                <TableCell
                                  key={col.id}
                                  sx={{
                                    fontWeight: 700,
                                    whiteSpace: "nowrap",
                                    color: "#2D3748",
                                    borderBottom: "2px solid #E2E8F0",
                                    py: 2,
                                    lineHeight: 1.2,
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
                                      #{t.ticket_no || t.id || "-"}
                                    </TableCell>
                                    <TableCell>
                                      <Tooltip
                                        title={t.title}
                                        arrow
                                        placement="top"
                                      >
                                        <Typography
                                          sx={{
                                            maxWidth:200,
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            cursor: "pointer",
                                          }}
                                        >
                                          {t.title || "-"}
                                        </Typography>
                                      </Tooltip>
                                    </TableCell>
                                    <TableCell>
                                      <Tooltip title={t.description || "No description"} arrow placement="top">
                                        <Typography
                                          sx={{
                                            maxWidth: 200,
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
                                      <Typography fontSize="0.85rem">
                                        {getDisplayStatus(t.status_detail?.field_values || t.status || "-")}
                                      </Typography>
                                      <Typography fontSize="0.85rem">
                                        {t.priority_detail?.field_values || t.priority || "-"}
                                      </Typography>
                                    </TableCell>
                                    <TableCell>
                                      <Tooltip
                                        arrow
                                        placement="top"
                                        title={
                                          <Box>
                                            <div>
                                              <strong>Category:</strong> {t.category_detail?.category_name || "-"}
                                            </div>
                                            <div>
                                              <strong>Subcategory:</strong> {t.subcategory_detail?.subcategory_name || "-"}
                                            </div>
                                          </Box>
                                        }
                                      >
                                        <Box sx={{ cursor: "pointer" }}>
                                          <Typography fontSize="0.85rem">
                                            {t.category_detail?.category_name || "-"}
                                          </Typography>
                                          <Typography fontSize="0.85rem">
                                            {t.subcategory_detail?.subcategory_name || "-"}
                                          </Typography>
                                        </Box>
                                      </Tooltip>
                                    </TableCell>
                                    <TableCell>
                                      <Typography fontSize="0.85rem">
                                        {t.department_detail?.field_name || "-"}
                                      </Typography>
                                      <Typography fontSize="0.85rem">
                                        {t.location_detail?.field_name || "-"}
                                      </Typography>
                                    </TableCell>
                                    <TableCell sx={{ maxWidth: 150 }}>
                                      <Tooltip title={t.requested_detail?.email || t.requested_by || "-"}>
                                        <Typography fontSize="0.85rem"
                                          sx={{
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                          }}
                                        >
                                          {t.requested_detail?.email || t.requested_by || "-"}
                                        </Typography>
                                      </Tooltip>
                                    </TableCell>
                                    <TableCell>
                                      <Typography fontSize="0.85rem">
                                        {t.created_date ? new Date(t.created_date).toLocaleDateString() : "-"}
                                      </Typography>
                                      <Typography fontSize="0.85rem">
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
                    </Card>
                  )}
                  
                  {filteredRows.length > 0 && (
                    <Stack
                      direction={isMobile ? "column" : "row"}
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{ py: 2, px: 3, borderTop: "1px solid #E2E8F0" }}
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
      </Box>
      
      {/* Chat Drawer */}
      <Drawer
        anchor="right"
        open={showFollowUpChat}
        onClose={handleChatDrawerClose}
        PaperProps={{ sx: { width: { xs: "100%", sm: 500 } } }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%", bgcolor: "background.paper" }}>
          <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider", bgcolor: "primary.main", color: "white" }}>
            <Typography variant="caption" sx={{ color: "white" }}>
              Ticket #{currentChatTicket?.id}
            </Typography>
            <Typography variant="h6">{currentChatTicket?.title || "Ticket Details"}</Typography>
          </Box>
          
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs value={chatTab} onChange={(e, v) => setChatTab(v)} centered variant="fullWidth">
              <Tab label="Follow-up" icon={<ChatIcon />} iconPosition="start" />
              <Tab 
                label="Clarification Required" 
                icon={<HelpOutlineIcon />} 
                iconPosition="start" 
                disabled={isTicketSolved() || isTicketClarificationRequired() || isConfigsLoading} 
              />
              <Tab 
                label="Solution" 
                icon={<DoneAllIcon />} 
                iconPosition="start" 
                disabled={isTicketSolved() || isTicketClarificationRequired() || isConfigsLoading} 
              />
            </Tabs>
          </Box>
          
          <Box sx={{ flex: 1 }}>
            {chatTab === 0 && (
              <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
                <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
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
                      <Box key={group.dateKey} sx={{ mb: 4 }}>
                        <Divider sx={{ my: 3 }}>
                          <Chip label={group.date} size="small" sx={{ bgcolor: "grey.200" }} />
                        </Divider>
                        {group.messages.map((msg, index) => {
                          const msgId = msg.id || `msg-${index}-${Date.now()}`;
                          const isMe = Number(msg.sender) === Number(currentUserId);
                          const isProtected = msg.protected === true || msg.protected === "true";
                          const isRevealed = revealedMessages.has(msgId);
                          const canReveal = Number(msg.sender) === Number(currentUserId) || Number(msg.receiver) === Number(currentUserId);
                          
                          const toggleReveal = () => {
                            if (!canReveal) return;
                            setRevealedMessages(prev => {
                              const newSet = new Set(prev);
                              if (newSet.has(msgId)) {
                                newSet.delete(msgId);
                              } else {
                                newSet.add(msgId);
                              }
                              return newSet;
                            });
                          };
                          
                          const getDisplayedMessage = () => {
                            if (!isProtected) {
                              return msg.message || "";
                            }
                            if (!canReveal) {
                              return "*** PROTECTED MESSAGE - VISIBLE ONLY TO PARTICIPANTS ***";
                            }
                            if (isRevealed) {
                              return msg.decrypted_message || msg.message || "(No content)";
                            }
                            return "*** PROTECTED MESSAGE - VISIBLE ONLY TO PARTICIPANTS ***";
                          };
                          
                          return (
                            <Box
                              key={msgId}
                              sx={{
                                display: "flex",
                                justifyContent: isMe ? "flex-end" : "flex-start",
                                mb: 2,
                              }}
                            >
                              {!isMe ? (
                                <Box sx={{ display: "flex", alignItems: "flex-end", gap: 1, maxWidth: "85%" }}>
                                  <Avatar sx={{ width: 36, height: 36, bgcolor: "grey.400" }}>
                                    {getInitials(chatRecipient?.name || "R")}
                                  </Avatar>
                                  <Box
                                    sx={{
                                      position: "relative",
                                      bgcolor: "grey.100",
                                      color: "text.primary",
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
                                          right: -8,
                                          fontSize: 18,
                                          bgcolor: "success.main",
                                          color: "white",
                                          borderRadius: "50%",
                                          p: 0.4,
                                          boxShadow: 2,
                                        }}
                                      />
                                    )}
                                    <Typography variant="body2" sx={{ wordBreak: "break-word", whiteSpace: "pre-wrap" }}>
                                      {getDisplayedMessage()}
                                    </Typography>
                                    {isProtected && canReveal && (
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
                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1 }}>
                                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.65rem" }}>
                                        {msg.createdon
                                          ? new Date(msg.createdon).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
                                          : "—"}
                                      </Typography>
                                      <Typography variant="caption" sx={{ fontSize: "0.7rem", ml: 1 }}>
                                        {chatRecipient?.name || "Requester"}
                                      </Typography>
                                    </Box>
                                  </Box>
                                </Box>
                              ) : (
                                <Box sx={{ display: "flex", alignItems: "flex-end", gap: 1, flexDirection: "row-reverse", maxWidth: "85%" }}>
                                  <Avatar sx={{ width: 36, height: 36, bgcolor: "primary.main", color: "white" }}>
                                    {getInitials(currentUserName)}
                                  </Avatar>
                                  <Box
                                    sx={{
                                      position: "relative",
                                      bgcolor: "primary.main",
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
                                          boxShadow: 2,
                                        }}
                                      />
                                    )}
                                    <Typography variant="body2" sx={{ wordBreak: "break-word", whiteSpace: "pre-wrap" }}>
                                      {getDisplayedMessage()}
                                    </Typography>
                                    {isProtected && canReveal && (
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
                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1 }}>
                                      <Typography variant="caption" sx={{ opacity: 0.8, fontSize: "0.65rem" }}>
                                        {msg.createdon
                                          ? new Date(msg.createdon).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
                                          : "—"}
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
                    <Tooltip title={isConfidentialTicket ? "All messages protected (Confidential)" : isProtectedMode ? "Protected ON" : "Send protected"}>
                      <span>
                        <IconButton
                          onClick={() => !isConfidentialTicket && setIsProtectedMode(!isProtectedMode)}
                          disabled={isConfidentialTicket}
                          sx={{
                            color: isProtectedMode || isConfidentialTicket ? "white" : "default",
                            bgcolor: isProtectedMode || isConfidentialTicket ? "success.main" : "grey.200",
                            "&:hover": { bgcolor: isProtectedMode || isConfidentialTicket ? "success.dark" : "grey.300" },
                          }}
                        >
                          <SecurityIcon />
                        </IconButton>
                      </span>
                    </Tooltip>
                    <IconButton
                      onClick={() => sendFollowUpMessageHandler(newFollowUpMessage)}
                      disabled={!newFollowUpMessage.trim() || sendingFollowUpMessage}
                      color="primary"
                    >
                      {sendingFollowUpMessage ? <CircularProgress size={20} /> : <SendIcon />}
                    </IconButton>
                  </Box>
                  {(isProtectedMode || isConfidentialTicket) && (
                    <Typography variant="caption" color="success.main" sx={{ mt: 1, textAlign: "center", display: "block" }}>
                      <SecurityIcon fontSize="small" sx={{ verticalAlign: "middle", mr: 0.5 }} />
                      {isConfidentialTicket ? "All messages are protected" : "This message will be protected"}
                    </Typography>
                  )}
                </Box>
              </Box>
            )}
            
            {chatTab === 1 && (
              <Box sx={{ display: "flex", flexDirection: "column", p: 3 }}>
                {isTicketClarificationRequired() ? (
                  <Box sx={{ textAlign: "center", flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <HelpOutlineIcon sx={{ fontSize: 80, color: "warning.main", mb: 2 }} />
                    <Typography variant="h6" fontWeight={600}>Clarification Required Already Sent</Typography>
                    <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>
                      Waiting for requester to respond.
                    </Typography>
                    <Button variant="outlined" onClick={() => setChatTab(0)}>
                      Back to Follow-up
                    </Button>
                  </Box>
                ) : isTicketSolved() ? (
                  <Box sx={{ textAlign: "center", flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <DoneAllIcon sx={{ fontSize: 80, color: "success.main", mb: 2 }} />
                    <Typography variant="h6" fontWeight={600}>Ticket Already Solved</Typography>
                    <Typography color="text.secondary" sx={{ mt: 1 }}>
                      Cannot request clarification on solved tickets.
                    </Typography>
                  </Box>
                ) : isConfigsLoading ? (
                  <Box sx={{ textAlign: "center", flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <CircularProgress sx={{ mb: 2 }} />
                    <Typography variant="h6" fontWeight={600}>Loading Configurations</Typography>
                    <Typography color="text.secondary" sx={{ mt: 1 }}>
                      Please wait while we load status configurations...
                    </Typography>
                  </Box>
                ) : (
                  <>
                    <Box sx={{ textAlign: "center", mb: 3 }}>
                      <HelpOutlineIcon sx={{ fontSize: 60, color: "warning.main", mb: 2 }} />
                      <Typography variant="h6" fontWeight={600}>Clarification Required</Typography>
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
                        disabled={!clarificationText.trim() || sendingClarification || isConfigsLoading}
                      >
                        {sendingClarification ? <CircularProgress size={20} /> : "Send Request"}
                      </Button>
                      <Button variant="outlined" onClick={() => { setClarificationText(""); setChatTab(0); }} disabled={sendingClarification}>
                        Cancel
                      </Button>
                    </Box>
                  </>
                )}
              </Box>
            )}
            
            {chatTab === 2 && (
              <Box sx={{ p: 4 }}>
                {isTicketSolved() ? (
                  <Box sx={{ textAlign: "center" }}>
                    <DoneAllIcon sx={{ fontSize: 80, color: "success.main", mb: 2 }} />
                    <Typography variant="h6">Ticket Already Solved</Typography>
                  </Box>
                ) : isTicketClarificationRequired() ? (
                  <Box sx={{ textAlign: "center" }}>
                    <HelpOutlineIcon sx={{ fontSize: 80, color: "warning.main", mb: 2 }} />
                    <Typography variant="h6">Clarification Required</Typography>
                    <Typography color="text.secondary">Resolve clarification first.</Typography>
                  </Box>
                ) : isConfigsLoading ? (
                  <Box sx={{ textAlign: "center" }}>
                    <CircularProgress sx={{ mb: 2 }} />
                    <Typography variant="h6">Loading Configurations</Typography>
                    <Typography color="text.secondary">Please wait while we load status configurations...</Typography>
                  </Box>
                ) : (
                  <>
                    <Box sx={{ textAlign: "center", mb: 2 }}>
                      <DoneAllIcon sx={{ fontSize: 64, color: "success.main" }} />
                      <Typography variant="h6" gutterBottom textAlign="center" color="success.main">
                        Mark as Solved
                      </Typography>
                    </Box>
                  
                    <Autocomplete
                      options={resolutionTypes}
                      getOptionLabel={(option) => option.label}
                      value={selectedResolutionType}
                      onChange={(e, newValue) => {
                        setSelectedResolutionType(newValue);
                      }}
                      renderInput={(params) => (
                        <TextField {...params} label="Type of Fix" size="small" variant="outlined" fullWidth sx={{"& .MuiOutlinedInput-root": { borderRadius: 3 }}}/>
                      )}
                      sx={{ mb: 3 }}
                    />
                    <TextField
                      multiline
                      rows={6}
                      label="Remarks / Solution Details"
                      placeholder="Add any additional details..."
                      value={solutionRemark}
                      onChange={(e) => setSolutionRemark(e.target.value)}
                      variant="outlined"
                      fullWidth
                      sx={{ mb: 3, "& .MuiOutlinedInput-root": { borderRadius: 3 }, }}
                      disabled={sendingSolution}
                    />
                    <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
                      <Button
                        variant="contained"
                        color="success"
                        size="large"
                        startIcon={sendingSolution ? <CircularProgress size={20} /> : <DoneAllIcon />}
                        onClick={handleSolutionSubmit}
                        disabled={sendingSolution || isConfigsLoading}
                        sx={{ borderRadius: 3 }}
                      >
                        {sendingSolution ? "Submitting..." : "Confirm Solved"}
                      </Button>
                      <Button variant="outlined" sx={{ borderRadius: 3 }} onClick={() => setChatTab(0)} disabled={sendingSolution}>
                        Cancel
                      </Button>
                    </Box>
                  </>
                )}
              </Box>
            )}
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default ApproverTabs;
// import { useEffect, useMemo, useState } from "react";
// import { useTheme } from "@mui/material/styles";
// import {
//   Box, Card, CardContent, Typography, Grid, TextField, Button, Table, TableHead, TableRow, TableCell, TableBody, TableContainer,
//   useMediaQuery, Autocomplete, Stack, Pagination, Tooltip, CircularProgress, IconButton, Drawer, Divider, Chip, Avatar, Alert,
//   Tabs, Tab, Icon,
// } from "@mui/material";
// import NewReleasesIcon from "@mui/icons-material/NewReleases";
// import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
// import DoneAllIcon from "@mui/icons-material/DoneAll";
// import LockIcon from "@mui/icons-material/Lock";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import SecurityIcon from "@mui/icons-material/Security";
// import ChatIcon from "@mui/icons-material/Chat";
// import SendIcon from "@mui/icons-material/Send";
// import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
// import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import {
//   fetchApproverTickets,
//   fetchMessages,
//   sendMessage,
//   getTicketDetails,
//   updateTicket,
//   fetchFixTypes,
// } from "../../Api";
// const ApproverTabs = ({ approverStatus: propUserStatus }) => {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
//   const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
//   const [selectedType, setSelectedType] = useState("new_assigned");
//   const [search, setSearch] = useState("");
//   const [department, setDepartment] = useState("");
//   const [tickets, setTickets] = useState({
//     new_assigned: [],
//     solved: [],
//     closed: [],
//     clarification_required: [],
//     clarification_applied: [],
//   });
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [loading, setLoading] = useState(true);
//   const [userStatus, setUserStatus] = useState(null);
//   const [error, setError] = useState(null);
//   // User & Entity
//   const [currentUserId, setCurrentUserId] = useState(null);
//   const [currentUserName, setCurrentUserName] = useState("You");
//   const [currentEntityId, setCurrentEntityId] = useState(null);
//   // Chat states
//   const [showFollowUpChat, setShowFollowUpChat] = useState(false);
//   const [followUpChats, setFollowUpChats] = useState([]);
//   const [loadingFollowUpChats, setLoadingFollowUpChats] = useState(false);
//   const [newFollowUpMessage, setNewFollowUpMessage] = useState("");
//   const [sendingFollowUpMessage, setSendingFollowUpMessage] = useState(false);
//   const [currentChatTicket, setCurrentChatTicket] = useState(null);
//   const [chatRecipient, setChatRecipient] = useState(null);
//   // Ticket data
//   const [currentTicketData, setCurrentTicketData] = useState(null);
//   // Protected & Reveal states
//   const [isProtectedMode, setIsProtectedMode] = useState(false);
//   const [revealedMessages, setRevealedMessages] = useState(new Set());
//   // Solution States
//   const [selectedResolutionType, setSelectedResolutionType] = useState(null);
//   const [solutionRemark, setSolutionRemark] = useState("");
//   const [sendingSolution, setSendingSolution] = useState(false);
//   // Clarification states
//   const [clarificationText, setClarificationText] = useState("");
//   const [sendingClarification, setSendingClarification] = useState(false);
//   // Add this state near your other useStates
//   const [isConfidentialTicket, setIsConfidentialTicket] = useState(false);
//   const [myProtectedMessages, setMyProtectedMessages] = useState({});
//   // Tab index
//   const [chatTab, setChatTab] = useState(0);
//   // Resolution types state
//   const [resolutionTypes, setResolutionTypes] = useState([]);
//   const navigate = useNavigate();
//   useEffect(() => {
//     const userDataString = localStorage.getItem("user");
//     if (userDataString) {
//       try {
//         const userData = JSON.parse(userDataString);
//         setCurrentUserId(userData?.id || null);
//         setCurrentUserName(userData?.name || userData?.username || "You");
//         let entityId = null;
//         if (userData?.entity_data?.id) entityId = userData.entity_data.id;
//         else if (userData?.entities?.length > 0) entityId = userData.entities[0].id;
//         else if (userData?.entities_ids?.length > 0) entityId = userData.entities_ids[0];
//         setCurrentEntityId(entityId ? Number(entityId) : null);
//       } catch (err) {
//         console.error("Error parsing user data:", err);
//       }
//     } else {
//       const userId = localStorage.getItem("current_user_id");
//       setCurrentUserId(userId ? parseInt(userId, 10) : null);
//     }
//   }, []);
//   // Fetch resolution types
//   useEffect(() => {
//     const loadFixTypes = async () => {
//       try {
//         const response = await fetchFixTypes();
//         const data = response?.data || response || [];
//         if (Array.isArray(data)) {
//           const activeTypes = data
//             .filter(type => type.is_active)
//             .map(type => ({
//               value: type.id,
//               label: type.name,
//               description: type.description,
//             }))
//             .sort((a, b) => a.value - b.value);
//           // Add "Other" option if not present
//           // if (!activeTypes.find(t => t.value === 11)) {
//           //   activeTypes.push({ value: 11, label: "Other", description: "" });
//           // }
//           setResolutionTypes(activeTypes);
//         }
//       } catch (err) {
//         console.error("Failed to fetch fix types:", err);
//         toast.error("Failed to load resolution types");
//         // Fallback to empty array or hardcoded if needed
//       }
//     };
//     loadFixTypes();
//   }, []);
//   const getDisplayStatus = (status) => (status === "New" ? "Pending" : status);
//   const processTickets = (ticketList) => {
//     if (!Array.isArray(ticketList)) return [];
//     return ticketList.map((ticket) => ({
//       ...ticket,
//       assigned_users: Array.isArray(ticket.assigned_users)
//         ? ticket.assigned_users.map((user) => ({
//             id: user.id || null,
//             name: user.name || user.full_name || user.email || "Unknown User",
//             email: user.email || "unknown@example.com",
//             is_unknown: !user.id,
//           }))
//         : [],
//       assigned_groups: Array.isArray(ticket.assigned_groups)
//         ? ticket.assigned_groups.map((group) => ({
//             id: group.id || null,
//             name: group.name || "Unknown Group",
//             is_unknown: !group.id,
//           }))
//         : [],
//     }));
//   };
//   const loadData = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       if (propUserStatus) {
//         let processed = propUserStatus;
//         if (propUserStatus.user_stats) {
//           const s = propUserStatus.user_stats;
//           processed = {
//             new_assigned: s.new_assigned || 0,
//             solved: s.solved || 0,
//             closed: s.closed || 0,
//             clarification_required: s.clarification_required || 0,
//             clarification_applied: s.clarification_applied || 0,
//             new_assigned_tickets: processTickets(s.new_assigned_tickets || []),
//             solved_tickets: processTickets(s.solved_tickets || []),
//             closed_tickets: processTickets(s.closed_tickets || []),
//             clarification_required_tickets: processTickets(s.clarification_required_tickets || []),
//             clarification_applied_tickets: processTickets(s.clarification_applied_tickets || []),
//           };
//         }
//         setUserStatus(processed);
//       } else {
//         const data = await fetchApproverTickets();
//         if (data?.success && data.user_stats) {
//           const s = data.user_stats;
//           setUserStatus({
//             new_assigned: s.new_assigned || 0,
//             solved: s.solved || 0,
//             closed: s.closed || 0,
//             clarification_required: s.clarification_required || 0,
//             clarification_applied: s.clarification_applied || 0,
//             new_assigned_tickets: processTickets(s.new_assigned_tickets || []),
//             solved_tickets: processTickets(s.solved_tickets || []),
//             closed_tickets: processTickets(s.closed_tickets || []),
//             clarification_required_tickets: processTickets(s.clarification_required_tickets || []),
//             clarification_applied_tickets: processTickets(s.clarification_applied_tickets || []),
//           });
//         } else {
//           throw new Error("Invalid response");
//         }
//       }
//     } catch (err) {
//       setError(err.message || "Failed to load dashboard");
//       toast.error(err.message || "Failed to load");
//       setUserStatus({
//         new_assigned: 0,
//         solved: 0,
//         closed: 0,
//         clarification_required: 0,
//         clarification_applied: 0,
//         new_assigned_tickets: [],
//         solved_tickets: [],
//         closed_tickets: [],
//         clarification_required_tickets: [],
//         clarification_applied_tickets: [],
//       });
//     } finally {
//       setLoading(false);
//     }
//   };
//   useEffect(() => {
//     loadData();
//   }, [propUserStatus]);
//   useEffect(() => {
//     if (userStatus) {
//       setTickets({
//         new_assigned: userStatus.new_assigned_tickets || [],
//         solved: userStatus.solved_tickets || [],
//         closed: userStatus.closed_tickets || [],
//         clarification_required: userStatus.clarification_required_tickets || [],
//         clarification_applied: userStatus.clarification_applied_tickets || [],
//       });
//     }
//   }, [userStatus]);
//   const getCount = (type) => {
//     if (type === "clarification_required") return userStatus?.clarification_required ?? 0;
//     if (type === "clarification_applied") return userStatus?.clarification_applied ?? 0;
//     return userStatus?.[type] ?? (tickets[type]?.length || 0);
//   };
//   const statusCards = [
//     {
//       id: "new_assigned",
//       label: "Pending",
//       color: "warning",
//       icon: <NewReleasesIcon sx={{ fontSize: { xs: 25, sm: 18, md: 25 } }} />,
//       count: getCount("new_assigned"),
//     },
//     {
//       id: "solved",
//       label: "Resolved",
//       color: "success",
//       icon: <DoneAllIcon sx={{ fontSize: { xs: 25, sm: 18, md: 25 } }} />,
//       count: getCount("solved"),
//     },
//     {
//       id: "closed",
//       label: "Closed",
//       color: "info",
//       icon: <LockIcon sx={{ fontSize: { xs: 25, sm: 18, md: 25 } }} />,
//       count: getCount("closed"),
//     },
//     {
//       id: "clarification_required",
//       label: "Clar. Required",
//       color: "error",
//       icon: <HelpOutlineIcon sx={{ fontSize: { xs: 25, sm: 18, md: 25 } }} />,
//       count: getCount("clarification_required"),
//     },
//     {
//       id: "clarification_applied",
//       label: "Clar. Supplied",
//       color: "primary",
//       icon: <QuestionAnswerIcon sx={{ fontSize: { xs: 25, sm: 18, md: 25 } }} />,
//       count: getCount("clarification_applied"),
//     },
//   ];
//   const headingMap = {
//     new_assigned: "Pending Tickets",
//     solved: "Resolved Tickets",
//     closed: "Closed Tickets",
//     clarification_required: "Clarification Required Tickets",
//     clarification_applied: "Clarification Supplied Tickets",
//   };
//   const TechTabelCol = [
//     { id: 1, title: <>Ticket ID</> },
//     { id: 2, title: <>Title</> },
//     { id: 3, title: <>Description</> },
//     { id: 4, title: <>Status<br />Priority</> },
//     { id: 5, title: <>Category<br />Subcategory</> },
//     { id: 6, title: <>Department<br />Location</> },
//     { id: 7, title: <>Requested By</> },
//     { id: 8, title: <>Open Date<br />Last Update</> },
//     { id: 9, title: <>Action</> },
//   ];
//   const selectedTickets = tickets[selectedType] || [];
//   const departmentList = useMemo(
//     () => [...new Set(selectedTickets.map((t) => t.department_detail?.field_name).filter(Boolean))],
//     [selectedTickets]
//   );
//   const filteredRows = useMemo(() => {
//     const lower = search.toLowerCase().trim();
//     if (!lower && !department) return selectedTickets;
//     return selectedTickets
//       .filter((t) => {
//         const deptMatch = department ? t.department_detail?.field_name === department : true;
//         if (!lower) return deptMatch;
//         const fields = [
//           String(t.ticket_no),
//           t.title,
//           t.description,
//           t.status_detail?.field_values,
//           t.priority_detail?.field_values,
//           t.category_detail?.category_name,
//           t.subcategory_detail?.subcategory_name,
//           t.department_detail?.field_name,
//           t.location_detail?.field_name,
//           t.requested_detail?.email,
//           t.requested_detail?.name,
//         ];
//         return fields.some((f) => f?.toLowerCase().includes(lower));
//       })
//       .filter((t) => !department || t.department_detail?.field_name === department);
//   }, [selectedTickets, search, department]);
//   const getInitials = (name) =>
//     !name || name === "You" ? "U" : name.split(" ").map((n) => n[0]).join("").toUpperCase().substring(0, 2);
//   const groupedChats = useMemo(() => {
//     const groups = {};
//     followUpChats.forEach((m) => {
//       const date = new Date(m.createdon);
//       const dateKey = date.toISOString().split("T")[0];
//       if (!groups[dateKey]) groups[dateKey] = [];
//       groups[dateKey].push(m);
//     });
//     return Object.entries(groups)
//       .map(([dateKey, msgs]) => ({
//         dateKey,
//         date: new Date(dateKey).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }),
//         messages: msgs.sort((a, b) => new Date(a.createdon) - new Date(b.createdon)),
//       }))
//       .sort((a, b) => a.dateKey.localeCompare(b.dateKey));
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
//   const handleTicketClick = (no) => {
//     localStorage.setItem("selectedTicketId", no);
//     navigate("/Approval");
//   };
//   const fetchTicketMessages = async (ticketNo, currentUserId, recipientId) => {
//     try {
//       const allMessages = await fetchMessages();
//       return allMessages.filter(
//         (msg) =>
//           msg.ticket_no == ticketNo &&
//           ((msg.sender === currentUserId && msg.receiver === recipientId) ||
//             (msg.sender === recipientId && msg.receiver === currentUserId))
//       ) || [];
//     } catch (err) {
//       toast.error("Failed to load messages");
//       return [];
//     }
//   };
//   const sendFollowUpMessageHandler = async (text) => {
//     if (!text.trim()) return toast.error("Message cannot be empty");
//     if (!currentChatTicket?.id || !chatRecipient?.id || !currentUserId) return toast.error("Cannot send message");
//     const shouldProtect = isConfidentialTicket || isProtectedMode;
//     setSendingFollowUpMessage(true);
//     try {
//       await sendMessage({
//         sender: currentUserId,
//         receiver: chatRecipient.id,
//         ticket_no: currentChatTicket.id,
//         message: text.trim(),
//         protected: shouldProtect,
//       });
//       const msgs = await fetchMessages();
//       const filtered = msgs.filter(m =>
//         m.ticket_no == currentChatTicket.id &&
//         ((m.sender === currentUserId && m.receiver === chatRecipient.id) ||
//          (m.sender === chatRecipient.id && m.receiver === currentUserId))
//       );
//       setFollowUpChats(filtered.sort((a, b) => new Date(a.createdon) - new Date(b.createdon)));
//       setNewFollowUpMessage("");
//       if (!isConfidentialTicket) setIsProtectedMode(false);
//       toast.success(shouldProtect ? "Protected message sent!" : "Message sent!");
//     } catch (err) {
//       toast.error("Failed to send message");
//     } finally {
//       setSendingFollowUpMessage(false);
//     }
//   };
//   const handleSendClarification = async () => {
//     if (!clarificationText.trim()) {
//       toast.error("Please enter a clarification message");
//       return;
//     }
//     if (!currentChatTicket?.id || !currentTicketData) {
//       toast.error("Ticket not loaded");
//       return;
//     }
//     if (!currentEntityId) {
//       toast.error("Your entity is not configured. Contact admin.");
//       return;
//     }
//     setSendingClarification(true);
//     try {
//       const ticketNoStr = String(currentChatTicket.id);
//       const formData = new FormData();
//       formData.append("title", currentTicketData.title || "");
//       formData.append("description", currentTicketData.description || "");
//       formData.append("category", currentTicketData.category || currentTicketData.category_detail?.id || "");
//       formData.append("status", "156"); // Clarification Required
//       formData.append("entity_id", String(currentEntityId));
//       const assignedUsers = currentTicketData.assignees_detail || currentTicketData.assigned_users || [];
//       const assignedGroups = currentTicketData.assigned_groups_detail || currentTicketData.assigned_groups || [];
//       let assignedTypeIndex = 0;
//       assignedUsers.forEach((user, index) => {
//         if (user?.email) formData.append(`assignee[${index}]`, user.email);
//       });
//       if (assignedUsers.length > 0) formData.append(`assigned_to_type[${assignedTypeIndex++}]`, "user");
//       assignedGroups.forEach((group, index) => {
//         if (group?.id) formData.append(`assigned_group[${index}]`, group.id);
//       });
//       if (assignedGroups.length > 0) formData.append(`assigned_to_type[${assignedTypeIndex}]`, "group");
//       const updateResult = await updateTicket(ticketNoStr, formData);
//       if (!updateResult.success) throw new Error(updateResult.error || "Failed to update status");
//       const clarificationMessage = `[Clarification Required]\n\n${clarificationText.trim()}`;
//       await sendFollowUpMessageHandler(clarificationMessage);
//       toast.success("Clarification required sent and ticket status updated!");
//       setClarificationText("");
//       setChatTab(0);
//       loadData();
//     } catch (err) {
//       console.error("Clarification error:", err);
//       toast.error("Failed to send clarification or update status");
//     } finally {
//       setSendingClarification(false);
//     }
//   };
//   const handleSolutionSubmit = async () => {
//     if (!currentChatTicket?.id || !currentTicketData) {
//       toast.error("Ticket not loaded");
//       return;
//     }
//     if (!currentEntityId) {
//       toast.error("Your entity is not configured. Contact admin.");
//       return;
//     }
//     setSendingSolution(true);
//     try {
//       const ticketNoStr = String(currentChatTicket.id);
//       const formData = new FormData();
//       formData.append("title", currentTicketData.title || "");
//       formData.append("description", currentTicketData.description || "");
//       formData.append("category", currentTicketData.category || currentTicketData.category_detail?.id || "");
//       formData.append("status", "153"); // Solved
//       formData.append("entity_id", String(currentEntityId));
//       const assignedUsers = currentTicketData.assignees_detail || currentTicketData.assigned_users || [];
//       const assignedGroups = currentTicketData.assigned_groups_detail || currentTicketData.assigned_groups || [];
//       let assignedTypeIndex = 0;
//       assignedUsers.forEach((user, index) => {
//         if (user?.email) formData.append(`assignee[${index}]`, user.email);
//       });
//       if (assignedUsers.length > 0) formData.append(`assigned_to_type[${assignedTypeIndex++}]`, "user");
//       assignedGroups.forEach((group, index) => {
//         if (group?.id) formData.append(`assigned_group[${index}]`, group.id);
//       });
//       if (assignedGroups.length > 0) formData.append(`assigned_to_type[${assignedTypeIndex}]`, "group");
//       const result = await updateTicket(ticketNoStr, formData);
//       if (!result.success) throw new Error(result.error || "Update failed");
//       // Send solution message to chat
//       const resolutionLabel = selectedResolutionType?.label || "Not specified";
//       const remark = solutionRemark.trim();
//       const solutionMessage = `[Solution Provided]\n\n**Type of Fix:** ${resolutionLabel}\n${remark ? `\n**Remarks:**\n${remark}` : ""}`;
//       await sendMessage({
//         sender: currentUserId,
//         receiver: chatRecipient.id,
//         ticket_no: currentChatTicket.id,
//         message: solutionMessage.trim(),
//         protected: false,
//       });
//       // Refresh messages
//       const msgs = await fetchMessages();
//       const filtered = msgs.filter(
//         (m) =>
//           m.ticket_no == currentChatTicket.id &&
//           ((m.sender === currentUserId && m.receiver === chatRecipient.id) ||
//             (m.sender === chatRecipient.id && m.receiver === currentUserId))
//       );
//       setFollowUpChats(filtered.sort((a, b) => new Date(a.createdon) - new Date(b.createdon)));
//       toast.success("Ticket marked as Solved and solution sent!");
//       setSelectedResolutionType(null);
//       setSolutionRemark("");
//       setShowFollowUpChat(false);
//       setSelectedType("solved");
//       loadData();
//     } catch (err) {
//       console.error("Solution submit error:", err);
//       toast.error("Failed to mark as solved");
//     } finally {
//       setSendingSolution(false);
//     }
//   };
//   const handleChatDrawerOpen = async (ticketNo) => {
//     if (!ticketNo || !currentUserId) return toast.error("Invalid ticket");
//     const ticket = selectedTickets.find((t) => t.ticket_no == ticketNo);
//     if (!ticket) return toast.error("Ticket not found");
//     setChatTab(0);
//     setLoadingFollowUpChats(true);
//     setShowFollowUpChat(true);
//     setFollowUpChats([]);
//     setRevealedMessages(new Set());
//     try {
//       const details = await getTicketDetails(String(ticketNo));
//       const data = details.ticket || details;
//       setCurrentTicketData(data);
//       setChatRecipient(data.requested_detail);
//       setCurrentChatTicket({ id: ticketNo, title: data.title || ticket.title });
//       // Check for confidential ticket
//       const confidential = data.confidential === true || data.confidential === "true";
//       setIsConfidentialTicket(confidential);
//       setIsProtectedMode(confidential); // Force ON if confidential
//       const recipientId = data.requested_detail?.id || data.requested_detail?.email;
//       const msgs = await fetchTicketMessages(ticketNo, currentUserId, recipientId);
//       setFollowUpChats(msgs.sort((a, b) => new Date(a.createdon) - new Date(b.createdon)));
//     } catch {
//       toast.error("Failed to load chat");
//       setShowFollowUpChat(false);
//     } finally {
//       setLoadingFollowUpChats(false);
//     }
//   };
//   const handleChatDrawerClose = () => {
//     setShowFollowUpChat(false);
//     setCurrentChatTicket(null);
//     setChatRecipient(null);
//     setFollowUpChats([]);
//     setCurrentTicketData(null);
//     setLoadingFollowUpChats(false);
//     setChatTab(0);
//     setClarificationText("");
//     setRevealedMessages(new Set());
//   };
//   const isTicketSolved = () => currentTicketData?.status_detail?.field_name === "Solved";
//   const isTicketClarificationRequired = () => currentTicketData?.status_detail?.field_name === "Clarification Required";
//   const isActionDisabled = () => isTicketSolved() || isTicketClarificationRequired();
//   if (error && !loading) {
//     return (
//       <Box sx={{ width: "100%" }}>
//         <Alert severity="error" sx={{ mb: 2 }} action={<Button onClick={loadData}>Retry</Button>}>
//           {error}
//         </Alert>
//       </Box>
//     );
//   }
//   if (loading) {
//     return (
//       <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 400 }}>
//         <CircularProgress />
//       </Box>
//     );
//   }
//   const priorityColors = {
//     "Critical": "#D32F2F",
//     "Very High": "#b43d3bff",
//     "High": "#FB8C00",
//     "Medium": "#FDD835",
//     "Low": "#43A047",
//     "Very Low": "#1E88E5",
//   };
//   const statusColors = {
//     "Pending": "#EF6C00",
//     "Approved": "#2E7D32",
//     "On Hold": "#1565C0",
//     "Rejected": "#C62828",
//     "SLA Breached": "#F9A825",
//   };
//   return (
//     <>
//       <Box sx={{ width: "100%", mb:2 }}>
//         <Grid container spacing={1} sx={{ mb: 2 }}>
//           {statusCards.map((item) => (
//             <Grid size={{ xs: 6, sm: 6, md: 4, lg: 2.4 }} key={item.id}>
//               <Card
//                 onClick={() => handleCardClick(item.id)}
//                 sx={{
//                   transition: "0.3s ease",
//                   maxWidth: isMobile ? 500 : 300,
//                   maxHeight: 110,
//                   minHeight: 100,
//                   borderRadius: 5,
//                   "&:hover": {
//                     background: "linear-gradient(135deg, #667eea, #764ba2)",
//                     color: "#fff",
//                     transform: "scale(1.03)",
//                   },
//                 }}
//               >
//                 <CardContent
//                   sx={{
//                     "&:last-child": { pt: 1 },
//                     display: "flex",
//                     gap: 2,
//                     alignItems: "center"
//                   }}
//                 >
//                   <Box
//                     sx={{
//                       width: { xs: 40, sm: 40, md: 40 },
//                       height: { xs: 40, sm: 40, md: 40 },
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       borderRadius: 2,
//                       bgcolor: `${item.color}.main`,
//                       color: "#fff",
//                     }}
//                   >
//                     <Icon sx={{ fontSize: { xs: 25, sm: 18, md: 25 } }}>{item.icon}</Icon>
//                   </Box>
//                   <Box>
//                     <Typography fontSize={{ xs: 25, sm: 20, md: 25 }} fontWeight={600}>
//                       {item.count}
//                     </Typography>
//                     <Typography fontSize={{ xs: 20, sm: 14, md: 20 }} fontWeight={550}>
//                       {item.label}
//                     </Typography>
//                   </Box>
//                 </CardContent>
//               </Card>
//             </Grid>
//           ))}
//         </Grid>
//         <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
//           <CardContent>
//             {selectedType && (
//               <Box>
//                 <Box
//                   sx={{
//                     display: "flex",
//                     flexDirection: isMobile || isTablet ? "column" : "row",
//                     justifyContent: !isMobile || !isTablet ? "space-between" : undefined,
//                     alignItems: isMobile ? "flex-start" : "center",
//                     mb: 1,
//                     gap: isMobile ? 2 : 0,
//                   }}
//                 >
//                   <Typography variant="h5" fontWeight={700} sx={{ color: "#2D3748" }}>
//                     {headingMap[selectedType] || "Tickets"}
//                   </Typography>
//                   <Box
//                     sx={{
//                       display: "flex",
//                       flexDirection: isMobile ? "column" : "row",
//                       flexWrap: isTablet ? "wrap" : "nowrap",
//                       gap: 2,
//                       width: isMobile || isTablet ? "100%" : "auto",
//                       justifyContent: isTablet ? "flex-start" : "flex-end",
//                       mt: isTablet ? 1.5 : 0
//                     }}
//                   >
//                     <Autocomplete
//                       options={departmentList}
//                       value={department}
//                       onChange={(e, newValue) => setDepartment(newValue)}
//                       renderInput={(params) => (
//                         <TextField {...params} label="Department" size="small" variant="outlined" />
//                       )}
//                       sx={{
//                         width: { xs: "100%", sm: 300, md: 200 },
//                         "& .MuiOutlinedInput-root": {
//                           borderRadius: 2,
//                         }
//                       }}
//                       disabled={departmentList.length === 0}
//                     />
//                     <TextField
//                       size="small"
//                       label="Search"
//                       value={search}
//                       onChange={(e) => setSearch(e.target.value)}
//                       variant="outlined"
//                       sx={{
//                         width: { xs: "100%", sm: 300, md: 200 },
//                         "& .MuiOutlinedInput-root": {
//                           borderRadius: 2,
//                         }
//                       }}
//                     />
//                     <Button
//                       variant="outlined"
//                       fullWidth={isMobile}
//                       onClick={clearFilters}
//                       sx={{
//                         borderRadius: 2,
//                         borderColor: "#CBD5E0",
//                         color: "#4A5568",
//                         "&:hover": { borderColor: "#667eea", backgroundColor: "#667eea10" },
//                       }}
//                     >
//                       Clear
//                     </Button>
//                   </Box>
//                 </Box>
//                 {isMobile ? (
//                   <Box>
//                     {filteredRows.length > 0 ? (
//                       filteredRows
//                         .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//                         .map((t, index) => (
//                           <Card
//                               sx={{
//                                 mb: 2,
//                                 borderRadius: 2,
//                                 boxShadow: "0px 2px 8px rgba(0,0,0,0.05)",
//                               }}
//                               key={t.id || index}
//                             >
//                               <CardContent>
//                                 <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                                   <Box sx={{display: "flex", gap: 1, alignItems: "center" }}>
//                                     <Typography fontWeight={700} color="#667eea">
//                                       #{t.ticket_no} -
//                                     </Typography>
//                                     <Chip
//                                       label={t.priority_detail?.field_values || "-"}
//                                       size="small"
//                                       sx={{
//                                         fontWeight: 800,
//                                         borderRadius: 50,
//                                         background: priorityColors[t.priority_detail?.field_values] || "#666",
//                                         color: "white",
//                                         animation: t.priority_detail?.field_values === "Critical" ? "pulse 2s infinite" : "none",
//                                       }}
//                                     />
//                                   </Box>
//                                   <Chip
//                                     label={t.status_detail?.field_values}
//                                     size="small"
//                                     sx={{
//                                       fontWeight: 700,
//                                       background: statusColors[t.status_detail?.field_values] || "#666",
//                                       color: "white",
//                                       borderRadius: 50,
//                                       py: 0.5,
//                                       px: 1,
//                                     }}
//                                   />
//                                 </Box>
//                                 <Tooltip
//                                   title={t.title}
//                                   arrow
//                                   placement="top"
//                                 >
//                                   <Typography
//                                     sx={{
//                                       maxWidth: 200,
//                                       color: "text.secondary",
//                                       whiteSpace: "nowrap",
//                                       overflow: "hidden",
//                                       textOverflow: "ellipsis",
//                                       cursor: "pointer",
//                                       mt: 0.5
//                                     }}
//                                   >
//                                     {t.title}
//                                   </Typography>
//                                 </Tooltip>
//                                 <Tooltip
//                                   title={t.description || "No description"}
//                                   arrow
//                                   placement="top"
//                                 >
//                                   <Typography
//                                     sx={{
//                                       maxWidth: 200,
//                                       color: "text.secondary",
//                                       whiteSpace: "nowrap",
//                                       overflow: "hidden",
//                                       textOverflow: "ellipsis",
//                                       cursor: "pointer",
//                                       mt: 0.5
//                                     }}
//                                   >
//                                     {t.description || "-"}
//                                   </Typography>
//                                 </Tooltip>
//                                 <Typography fontSize={13} mt={1.5}>
//                                   <strong style={{ color: "#4A5568" }}>Category:</strong>{" "}
//                                   <span style={{ color: "#2D3748" }}>
//                                     {t.category_detail?.category_name || "-"} / {t.subcategory_detail?.subcategory_name || "-"}
//                                   </span>
//                                 </Typography>
//                                 <Typography fontSize={13} mt={1}>
//                                   <strong style={{ color: "#4A5568" }}>Dept:</strong>{" "}
//                                   <span style={{ color: "#2D3748" }}>
//                                     {t.department_detail?.field_name || "-"} | {t.location_detail?.field_name || "-"}
//                                   </span>
//                                 </Typography>
//                                 <Typography fontSize={12} color="#718096" mt={1.5}>
//                                   Open: {t.created_date ? new Date(t.created_date).toLocaleDateString() : "-"} <br />
//                                   Update: {t.updated_date ? new Date(t.updated_date).toLocaleDateString() : "-"}
//                                 </Typography>
//                                 <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2, gap: 1 }}>
//                                   <Tooltip title="Follow-up Chat">
//                                     <IconButton onClick={() => handleChatDrawerOpen(t.ticket_no)} size="small" sx={{ color: "#667eea" }}>
//                                       <ChatIcon />
//                                     </IconButton>
//                                   </Tooltip>
//                                   <Tooltip title="View Details">
//                                     <IconButton
//                                       onClick={() => handleTicketClick(t.ticket_no)}
//                                       sx={{ color: "#667eea" }}
//                                       size="small"
//                                     >
//                                       <VisibilityIcon />
//                                     </IconButton>
//                                   </Tooltip>
//                                 </Box>
//                               </CardContent>
//                             </Card>
//                           ))
//                       ) : (
//                         <Typography align="center" py={4} color="#718096">
//                           No tickets found.
//                         </Typography>
//                       )}
//                     </Box>
//                   ) : (
//                     <Card sx={{ borderRadius: 3, boxShadow: 2, overflow: "hidden" }}>
//                       <TableContainer>
//                         <Table stickyHeader>
//                           <TableHead>
//                             <TableRow sx={{ backgroundColor: "#F7FAFC" }}>
//                               {TechTabelCol.map((col) => (
//                                 <TableCell
//                                   key={col.id}
//                                   sx={{
//                                     fontWeight: 700,
//                                     whiteSpace: "nowrap",
//                                     color: "#2D3748",
//                                     borderBottom: "2px solid #E2E8F0",
//                                     py: 2,
//                                     lineHeight: 1.2,
//                                   }}
//                                 >
//                                   {col.title}
//                                 </TableCell>
//                               ))}
//                             </TableRow>
//                           </TableHead>
//                           <TableBody>
//                             {filteredRows.length > 0 ? (
//                               filteredRows
//                                 .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//                                 .map((t, index) => (
//                                   <TableRow
//                                     key={t.id || index}
//                                     hover
//                                     sx={{
//                                       '&:hover': { backgroundColor: '#F7FAFC' },
//                                       '&:last-child td': { borderBottom: 0 }
//                                     }}
//                                   >
//                                     <TableCell sx={{ color: "#667eea", fontWeight: 600 }}>
//                                       #{t.ticket_no || t.id || "-"}
//                                     </TableCell>
//                                     <TableCell>
//                                       <Tooltip
//                                         title={t.title}
//                                         arrow
//                                         placement="top"
//                                       >
//                                         <Typography
//                                           sx={{
//                                             maxWidth:200,
//                                             whiteSpace: "nowrap",
//                                             overflow: "hidden",
//                                             textOverflow: "ellipsis",
//                                             cursor: "pointer",
//                                           }}
//                                         >
//                                           {t.title || "-"}
//                                         </Typography>
//                                       </Tooltip>
//                                     </TableCell>
//                                     <TableCell>
//                                       <Tooltip title={t.description || "No description"} arrow placement="top">
//                                         <Typography
//                                           sx={{
//                                             maxWidth: 200,
//                                             whiteSpace: "nowrap",
//                                             overflow: "hidden",
//                                             textOverflow: "ellipsis",
//                                             cursor: "pointer",
//                                           }}
//                                         >
//                                           {t.description || "-"}
//                                         </Typography>
//                                       </Tooltip>
//                                     </TableCell>
//                                     <TableCell>
//                                       <Typography fontSize="0.85rem">
//                                         {getDisplayStatus(t.status_detail?.field_name || t.status || "-")}
//                                       </Typography>
//                                       <Typography fontSize="0.85rem">
//                                         {t.priority_detail?.field_name || t.priority || "-"}
//                                       </Typography>
//                                     </TableCell>
//                                     <TableCell>
//                                       <Tooltip
//                                         arrow
//                                         placement="top"
//                                         title={
//                                           <Box>
//                                             <div>
//                                               <strong>Category:</strong> {t.category_detail?.category_name || "-"}
//                                             </div>
//                                             <div>
//                                               <strong>Subcategory:</strong> {t.subcategory_detail?.subcategory_name || "-"}
//                                             </div>
//                                           </Box>
//                                         }
//                                       >
//                                         <Box sx={{ cursor: "pointer" }}>
//                                           <Typography fontSize="0.85rem">
//                                             {t.category_detail?.category_name || "-"}
//                                           </Typography>
//                                           <Typography fontSize="0.85rem">
//                                             {t.subcategory_detail?.subcategory_name || "-"}
//                                           </Typography>
//                                         </Box>
//                                       </Tooltip>
//                                     </TableCell>
//                                     <TableCell>
//                                       <Typography fontSize="0.85rem">
//                                         {t.department_detail?.field_name || "-"}
//                                       </Typography>
//                                       <Typography fontSize="0.85rem">
//                                         {t.location_detail?.field_name || "-"}
//                                       </Typography>
//                                     </TableCell>
//                                     <TableCell sx={{ maxWidth: 150 }}>
//                                       <Tooltip title={t.requested_detail?.email || t.requested_by || "-"}>
//                                         <Typography fontSize="0.85rem"
//                                           sx={{
//                                             overflow: "hidden",
//                                             textOverflow: "ellipsis",
//                                             whiteSpace: "nowrap",
//                                           }}
//                                         >
//                                           {t.requested_detail?.email || t.requested_by || "-"}
//                                         </Typography>
//                                       </Tooltip>
//                                     </TableCell>
//                                     <TableCell>
//                                       <Typography fontSize="0.85rem">
//                                         {t.created_date ? new Date(t.created_date).toLocaleDateString() : "-"}
//                                       </Typography>
//                                       <Typography fontSize="0.85rem">
//                                         {t.updated_date ? new Date(t.updated_date).toLocaleDateString() : "-"}
//                                       </Typography>
//                                     </TableCell>
//                                     <TableCell>
//                                       <Box sx={{ display: "flex", gap: 1 }}>
//                                         <Tooltip title="Follow-up Chat">
//                                           <IconButton
//                                             onClick={() => handleChatDrawerOpen(t.ticket_no)}
//                                             size="small"
//                                             sx={{ color: "#667eea" }}
//                                           >
//                                             <ChatIcon fontSize="small" />
//                                           </IconButton>
//                                         </Tooltip>
//                                         <Tooltip title="View Details">
//                                           <IconButton
//                                             onClick={() => handleTicketClick(t.ticket_no)}
//                                             sx={{ color: "#667eea" }}
//                                             size="small"
//                                           >
//                                             <VisibilityIcon fontSize="small" />
//                                           </IconButton>
//                                         </Tooltip>
//                                       </Box>
//                                     </TableCell>
//                                   </TableRow>
//                                 ))
//                             ) : (
//                               <TableRow>
//                                 <TableCell colSpan={9} align="center" sx={{ py: 4, color: "#718096" }}>
//                                   No tickets found.
//                                 </TableCell>
//                               </TableRow>
//                             )}
//                           </TableBody>
//                         </Table>
//                       </TableContainer>
//                     </Card>
//                   )}
//                   {filteredRows.length > 0 && (
//                     <Stack
//                       direction={isMobile ? "column" : "row"}
//                       justifyContent="space-between"
//                       alignItems="center"
//                       sx={{ py: 2, px: 3, borderTop: "1px solid #E2E8F0" }}
//                     >
//                       <Typography
//                         variant="body2"
//                         color="#718096"
//                         sx={{ fontSize: { xs: "13px", sm: "14px" } }}
//                       >
//                         Showing {page * rowsPerPage + 1} to{" "}
//                         {Math.min((page + 1) * rowsPerPage, filteredRows.length)} of{" "}
//                         {filteredRows.length} tickets
//                       </Typography>
//                       <Pagination
//                         count={Math.ceil(filteredRows.length / rowsPerPage)}
//                         page={page + 1}
//                         onChange={(e, value) => setPage(value - 1)}
//                         variant="outlined"
//                         shape="rounded"
//                         showFirstButton
//                         showLastButton
//                         siblingCount={1}
//                         boundaryCount={1}
//                         size={isMobile ? "small" : "medium"}
//                         sx={{
//                           "& .MuiPaginationItem-root": {
//                             borderRadius: "8px",
//                             borderColor: "#CBD5E0",
//                             color: "#4A5568",
//                             fontSize: { xs: "12px", sm: "14px" },
//                             minWidth: { xs: 32, sm: 36 },
//                             "&.Mui-selected": {
//                               backgroundColor: "#667eea",
//                               color: "#fff",
//                               borderColor: "#667eea",
//                               "&:hover": {
//                                 backgroundColor: "#556cd6",
//                               },
//                             },
//                             "&:hover": {
//                               backgroundColor: "#F7FAFC",
//                             },
//                           },
//                         }}
//                       />
//                     </Stack>
//                   )}
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
//         <Box sx={{ display: "flex", flexDirection: "column", height: "100%", bgcolor: "background.paper" }}>
//           <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider", bgcolor: "primary.main", color: "white" }}>
//             <Typography variant="caption" sx={{ color: "white" }}>
//               Ticket #{currentChatTicket?.id}
//             </Typography>
//             <Typography variant="h6">{currentChatTicket?.title || "Ticket Details"}</Typography>
//           </Box>
//           <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
//             <Tabs value={chatTab} onChange={(e, v) => setChatTab(v)} centered variant="fullWidth">
//               <Tab label="Follow-up" icon={<ChatIcon />} iconPosition="start" />
//               <Tab label="Clarification Required" icon={<HelpOutlineIcon />} iconPosition="start" disabled={isTicketSolved() || isTicketClarificationRequired()} />
//               <Tab label="Solution" icon={<DoneAllIcon />} iconPosition="start" disabled={isTicketSolved() || isTicketClarificationRequired()} />
//               {/* <Tab
//                 label="Solution"
//                 icon={<DoneAllIcon />}
//                 iconPosition="start"
//                 disabled={
//                   isTicketSolved() ||
//                   isTicketClarificationRequired() ||
//                   currentTicketData?.status_detail?.field_name === "Closed" ||
//                   selectedType === "clarification_applied" // When viewing clarification_applied tickets
//                 }
//               /> */}
            
//               {/* <Tab
//                 label="Clarification Required"
//                 icon={<HelpOutlineIcon />}
//                 iconPosition="start"
//                 disabled={
//                   isTicketSolved() ||
//                   isTicketClarificationRequired() ||
//                   currentTicketData?.status_detail?.field_name === "Closed"
//                 }
//               /> */}
             
//             </Tabs>
//           </Box>
//           <Box sx={{ flex: 1 }}>
//             {chatTab === 0 && (
//               <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
//                 <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
//                   {loadingFollowUpChats ? (
//                     <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
//                       <CircularProgress />
//                     </Box>
//                   ) : groupedChats.length === 0 ? (
//                     <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100%", color: "text.secondary" }}>
//                       <ChatIcon sx={{ fontSize: 60, mb: 2, opacity: 0.5 }} />
//                       <Typography>No messages yet</Typography>
//                     </Box>
//                   ) : (
//                     groupedChats.map((group) => (
//                       <Box key={group.dateKey} sx={{ mb: 4 }}>
//                         <Divider sx={{ my: 3 }}>
//                           <Chip label={group.date} size="small" sx={{ bgcolor: "grey.200" }} />
//                         </Divider>
//                         {group.messages.map((msg, index) => {
//                           const msgId = msg.id || `msg-${index}-${Date.now()}`;
//                           const isMe = Number(msg.sender) === Number(currentUserId);
//                           const isProtected = msg.protected === true || msg.protected === "true";
//                           const isRevealed = revealedMessages.has(msgId);
//                           const canReveal = Number(msg.sender) === Number(currentUserId) || Number(msg.receiver) === Number(currentUserId);
//                           const toggleReveal = () => {
//                             if (!canReveal) return;
//                             setRevealedMessages(prev => {
//                               const newSet = new Set(prev);
//                               if (newSet.has(msgId)) {
//                                 newSet.delete(msgId);
//                               } else {
//                                 newSet.add(msgId);
//                               }
//                               return newSet;
//                             });
//                           };
//                           // Exact behavior you requested
//                           const getDisplayedMessage = () => {
//                             if (!isProtected) {
//                               return msg.message || "";
//                             }
//                             if (!canReveal) {
//                               return "*** PROTECTED MESSAGE - VISIBLE ONLY TO PARTICIPANTS ***";
//                             }
//                             // If user can reveal
//                             if (isRevealed) {
//                               // Show real decrypted content
//                               return msg.decrypted_message || msg.message || "(No content)";
//                             }
//                             // Default for protected: show masked text + eye
//                             return "*** PROTECTED MESSAGE - VISIBLE ONLY TO PARTICIPANTS ***";
//                           };
//                           return (
//                             <Box
//                               key={msgId}
//                               sx={{
//                                 display: "flex",
//                                 justifyContent: isMe ? "flex-end" : "flex-start",
//                                 mb: 2,
//                               }}
//                             >
//                               {!isMe ? (
//                                 <Box sx={{ display: "flex", alignItems: "flex-end", gap: 1, maxWidth: "85%" }}>
//                                   <Avatar sx={{ width: 36, height: 36, bgcolor: "grey.400" }}>
//                                     {getInitials(chatRecipient?.name || "R")}
//                                   </Avatar>
//                                   <Box
//                                     sx={{
//                                       position: "relative",
//                                       bgcolor: "grey.100",
//                                       color: "text.primary",
//                                       p: 1.5,
//                                       borderRadius: 2,
//                                       boxShadow: 1,
//                                     }}
//                                   >
//                                     {/* Shield icon for protected messages */}
//                                     {isProtected && (
//                                       <SecurityIcon
//                                         sx={{
//                                           position: "absolute",
//                                           top: -8,
//                                           right: -8,
//                                           fontSize: 18,
//                                           bgcolor: "success.main",
//                                           color: "white",
//                                           borderRadius: "50%",
//                                           p: 0.4,
//                                           boxShadow: 2,
//                                         }}
//                                       />
//                                     )}
//                                     <Typography variant="body2" sx={{ wordBreak: "break-word", whiteSpace: "pre-wrap" }}>
//                                       {getDisplayedMessage()}
//                                     </Typography>
//                                     {/* Eye icon: only for protected messages and authorized users */}
//                                     {isProtected && canReveal && (
//                                       <IconButton
//                                         size="small"
//                                         onClick={toggleReveal}
//                                         sx={{
//                                           position: "absolute",
//                                           bottom: 4,
//                                           right: 4,
//                                           bgcolor: "rgba(0,0,0,0.08)",
//                                           "&:hover": { bgcolor: "rgba(0,0,0,0.15)" },
//                                         }}
//                                       >
//                                         {isRevealed ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
//                                       </IconButton>
//                                     )}
//                                     <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1 }}>
//                                       <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.65rem" }}>
//                                         {msg.createdon
//                                           ? new Date(msg.createdon).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
//                                           : "—"}
//                                       </Typography>
//                                       <Typography variant="caption" sx={{ fontSize: "0.7rem", ml: 1 }}>
//                                         {chatRecipient?.name || "Requester"}
//                                       </Typography>
//                                     </Box>
//                                   </Box>
//                                 </Box>
//                               ) : (
//                                 <Box sx={{ display: "flex", alignItems: "flex-end", gap: 1, flexDirection: "row-reverse", maxWidth: "85%" }}>
//                                   <Avatar sx={{ width: 36, height: 36, bgcolor: "primary.main", color: "white" }}>
//                                     {getInitials(currentUserName)}
//                                   </Avatar>
//                                   <Box
//                                     sx={{
//                                       position: "relative",
//                                       bgcolor: "primary.main",
//                                       color: "white",
//                                       p: 1.5,
//                                       borderRadius: 2,
//                                       boxShadow: 1,
//                                     }}
//                                   >
//                                     {isProtected && (
//                                       <SecurityIcon
//                                         sx={{
//                                           position: "absolute",
//                                           top: -8,
//                                           left: -8,
//                                           fontSize: 18,
//                                           bgcolor: "success.main",
//                                           color: "white",
//                                           borderRadius: "50%",
//                                           p: 0.4,
//                                           boxShadow: 2,
//                                         }}
//                                       />
//                                     )}
//                                     <Typography variant="body2" sx={{ wordBreak: "break-word", whiteSpace: "pre-wrap" }}>
//                                       {getDisplayedMessage()}
//                                     </Typography>
//                                     {isProtected && canReveal && (
//                                       <IconButton
//                                         size="small"
//                                         onClick={toggleReveal}
//                                         sx={{
//                                           position: "absolute",
//                                           bottom: 4,
//                                           right: 4,
//                                           color: "white",
//                                           bgcolor: "rgba(255,255,255,0.2)",
//                                           "&:hover": { bgcolor: "rgba(255,255,255,0.3)" },
//                                         }}
//                                       >
//                                         {isRevealed ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
//                                       </IconButton>
//                                     )}
//                                     <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1 }}>
//                                       <Typography variant="caption" sx={{ opacity: 0.8, fontSize: "0.65rem" }}>
//                                         {msg.createdon
//                                           ? new Date(msg.createdon).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
//                                           : "—"}
//                                       </Typography>
//                                       <Typography variant="caption" sx={{ fontSize: "0.7rem", ml: 1 }}>
//                                         You
//                                       </Typography>
//                                     </Box>
//                                   </Box>
//                                 </Box>
//                               )}
//                             </Box>
//                           );
//                         })}
//                       </Box>
//                     ))
//                   )}
//                 </Box>
//                 <Box sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
//                   <Box sx={{ display: "flex", gap: 1, alignItems: "flex-end" }}>
//                     <TextField
//                       fullWidth
//                       size="small"
//                       placeholder="Type your message..."
//                       value={newFollowUpMessage}
//                       onChange={(e) => setNewFollowUpMessage(e.target.value)}
//                       onKeyPress={(e) => {
//                         if (e.key === "Enter" && !e.shiftKey) {
//                           e.preventDefault();
//                           sendFollowUpMessageHandler(newFollowUpMessage);
//                         }
//                       }}
//                       multiline
//                       maxRows={4}
//                       disabled={sendingFollowUpMessage}
//                     />
//                     <Tooltip title={isConfidentialTicket ? "All messages protected (Confidential)" : isProtectedMode ? "Protected ON" : "Send protected"}>
//                       <span>
//                         <IconButton
//                           onClick={() => !isConfidentialTicket && setIsProtectedMode(!isProtectedMode)}
//                           disabled={isConfidentialTicket}
//                           sx={{
//                             color: isProtectedMode || isConfidentialTicket ? "white" : "default",
//                             bgcolor: isProtectedMode || isConfidentialTicket ? "success.main" : "grey.200",
//                             "&:hover": { bgcolor: isProtectedMode || isConfidentialTicket ? "success.dark" : "grey.300" },
//                           }}
//                         >
//                           <SecurityIcon />
//                         </IconButton>
//                       </span>
//                     </Tooltip>
//                     <IconButton
//                       onClick={() => sendFollowUpMessageHandler(newFollowUpMessage)}
//                       disabled={!newFollowUpMessage.trim() || sendingFollowUpMessage}
//                       color="primary"
//                     >
//                       {sendingFollowUpMessage ? <CircularProgress size={20} /> : <SendIcon />}
//                     </IconButton>
//                   </Box>
//                   {(isProtectedMode || isConfidentialTicket) && (
//                     <Typography variant="caption" color="success.main" sx={{ mt: 1, textAlign: "center", display: "block" }}>
//                       <SecurityIcon fontSize="small" sx={{ verticalAlign: "middle", mr: 0.5 }} />
//                       {isConfidentialTicket ? "All messages are protected" : "This message will be protected"}
//                     </Typography>
//                   )}
//                 </Box>
//               </Box>
//             )}
//             {chatTab === 1 && (
//               <Box sx={{ display: "flex", flexDirection: "column", p: 3 }}>
//                 {isTicketClarificationRequired() ? (
//                   <Box sx={{ textAlign: "center", flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
//                     <HelpOutlineIcon sx={{ fontSize: 80, color: "warning.main", mb: 2 }} />
//                     <Typography variant="h6" fontWeight={600}>Clarification Required Already Sent</Typography>
//                     <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>
//                       Waiting for requester to respond.
//                     </Typography>
//                     <Button variant="outlined" onClick={() => setChatTab(0)}>
//                       Back to Follow-up
//                     </Button>
//                   </Box>
//                 ) : isTicketSolved() ? (
//                   <Box sx={{ textAlign: "center", flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
//                     <DoneAllIcon sx={{ fontSize: 80, color: "success.main", mb: 2 }} />
//                     <Typography variant="h6" fontWeight={600}>Ticket Already Solved</Typography>
//                     <Typography color="text.secondary" sx={{ mt: 1 }}>
//                       Cannot request clarification on solved tickets.
//                     </Typography>
//                   </Box>
//                 ) : (
//                   <>
//                     <Box sx={{ textAlign: "center", mb: 3 }}>
//                       <HelpOutlineIcon sx={{ fontSize: 60, color: "warning.main", mb: 2 }} />
//                       <Typography variant="h6" fontWeight={600}>Clarification Required</Typography>
//                       <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
//                         Ask for more details if something is unclear.
//                       </Typography>
//                     </Box>
//                     <TextField
//                       multiline
//                       rows={6}
//                       placeholder="Please clarify the following..."
//                       value={clarificationText}
//                       onChange={(e) => setClarificationText(e.target.value)}
//                       variant="outlined"
//                       fullWidth
//                       sx={{ mb: 3 }}
//                       disabled={sendingClarification}
//                     />
//                     <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
//                       <Button
//                         variant="contained"
//                         color="warning"
//                         size="large"
//                         startIcon={<QuestionAnswerIcon />}
//                         onClick={handleSendClarification}
//                         disabled={!clarificationText.trim() || sendingClarification}
//                       >
//                         {sendingClarification ? <CircularProgress size={20} /> : "Send Request"}
//                       </Button>
//                       <Button variant="outlined" onClick={() => { setClarificationText(""); setChatTab(0); }} disabled={sendingClarification}>
//                         Cancel
//                       </Button>
//                     </Box>
//                   </>
//                 )}
//               </Box>
//             )}
//             {chatTab === 2 && (
//               <Box sx={{ p: 4 }}>
//                 {isTicketSolved() ? (
//                   <Box sx={{ textAlign: "center" }}>
//                     <DoneAllIcon sx={{ fontSize: 80, color: "success.main", mb: 2 }} />
//                     <Typography variant="h6">Ticket Already Solved</Typography>
//                   </Box>
//                 ) : isTicketClarificationRequired() ? (
//                   <Box sx={{ textAlign: "center" }}>
//                     <HelpOutlineIcon sx={{ fontSize: 80, color: "warning.main", mb: 2 }} />
//                     <Typography variant="h6">Clarification Required</Typography>
//                     <Typography color="text.secondary">Resolve clarification first.</Typography>
//                   </Box>
//                 ) : (
//                   <>
//                     <Box sx={{ textAlign: "center", mb: 2 }}>
//                       <DoneAllIcon sx={{ fontSize: 64, color: "success.main" }} />
//                       <Typography variant="h6" gutterBottom textAlign="center" color="success.main">
//                         Mark as Solved
//                       </Typography>
//                     </Box>
                  
//                     <Autocomplete
//                       options={resolutionTypes}
//                       getOptionLabel={(option) => option.label}
//                       value={selectedResolutionType}
//                       onChange={(e, newValue) => {
//                         setSelectedResolutionType(newValue);
//                       }}
//                       renderInput={(params) => (
//                         <TextField {...params} label="Type of Fix" size="small" variant="outlined" fullWidth sx={{"& .MuiOutlinedInput-root": { borderRadius: 3 }}}/>
//                       )}
//                       sx={{ mb: 3 }}
//                     />
//                     <TextField
//                       multiline
//                       rows={6}
//                       label="Remarks / Solution Details"
//                       placeholder="Add any additional details..."
//                       value={solutionRemark}
//                       onChange={(e) => setSolutionRemark(e.target.value)}
//                       variant="outlined"
//                       fullWidth
//                       sx={{ mb: 3, "& .MuiOutlinedInput-root": { borderRadius: 3 }, }}
//                       disabled={sendingSolution}
//                     />
//                     <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
//                       <Button
//                         variant="contained"
//                         color="success"
//                         size="large"
//                         startIcon={sendingSolution ? <CircularProgress size={20} /> : <DoneAllIcon />}
//                         onClick={handleSolutionSubmit}
//                         disabled={sendingSolution}
//                         sx={{ borderRadius: 3 }}
//                       >
//                         {sendingSolution ? "Submitting..." : "Confirm Solved"}
//                       </Button>
//                       <Button variant="outlined" sx={{ borderRadius: 3 }} onClick={() => setChatTab(0)} disabled={sendingSolution}>
//                         Cancel
//                       </Button>
//                     </Box>
//                   </>
//                 )}
//               </Box>
//             )}
//             {/* {chatTab === 1 && (
//               <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", p: 4, gap: 2 }}>
//                 {isTicketSolved() ? (
//                   <>
//                     <DoneAllIcon sx={{ fontSize: 64, color: "success.main" }} />
//                     <Typography variant="h6" fontWeight={600}>Ticket Already Solved</Typography>
//                     <Typography color="text.secondary">This ticket has been marked as solved.</Typography>
//                   </>
//                 ) : isTicketClarificationRequired() ? (
//                   <>
//                     <HelpOutlineIcon sx={{ fontSize: 64, color: "warning.main" }} />
//                     <Typography variant="h6" fontWeight={600}>Clarification Required</Typography>
//                     <Typography color="text.secondary">Cannot mark as solved until clarification is resolved.</Typography>
//                   </>
//                 ) : (
//                   <Box>
//                     <Box sx={{ textAlign: "center", mb: 2 }}>
//                       <DoneAllIcon sx={{ fontSize: 64, color: "success.main" }} />
//                       <Typography variant="h6" fontWeight={600}>Mark Ticket as Solved</Typography>
//                     </Box>
                  
//                     <TextField
//                       multiline
//                       rows={4}
//                       placeholder="Please clarify the following..."
//                       value={slovedText}
//                       onChange={(e) => setSlovedText(e.target.value)}
//                       variant="outlined"
//                       fullWidth
//                       sx={{ mb: 3 }}
//                       disabled={sendingSloved}
//                     />
                  
//                     <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
//                       <Button
//                         variant="contained"
//                         color="warning"
//                         size="large"
//                         startIcon={<DoneAllIcon />}
//                         onClick={handleSolutionSubmit}
//                         disabled={!clarificationText.trim() || sendingSloved}
//                       >
//                         {sendingSloved ? "Confirm" : "Confirm Solved"}
//                       </Button>
//                       <Button variant="outlined" onClick={() => {setChatTab(0); }} disabled={sendingClarification}>
//                         Cancel
//                       </Button>
//                     </Box>
//                     <Button variant="contained" color="success" size="large" onClick={handleSolutionSubmit}>
//                       Confirm Solved
//                     </Button>
//                   </Box>
//                 )}
//                 <Button variant="outlined" onClick={() => setChatTab(0)}>Back</Button>
//               </Box>
//             )} */}
          
//           </Box>
//         </Box>
//       </Drawer>
//     </>
//   );
// };
// export default ApproverTabs;