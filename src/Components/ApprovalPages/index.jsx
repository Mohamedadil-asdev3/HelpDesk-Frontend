// import { Box, Grid, Card, CardContent, Typography, TextField, Button, Divider, Chip, Stack, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Autocomplete, Drawer, Tabs, Tab, Avatar } from "@mui/material";
// import { useState, useEffect, useMemo } from "react";
// import { useNavigate } from 'react-router-dom';
// import EditIcon from "@mui/icons-material/Edit";
// import ChatIcon from '@mui/icons-material/Chat';
// import SendIcon from '@mui/icons-material/Send';
// import { getTicketDetails, fetchMessages, sendMessage, fetchUsersAPI, updateTicket } from '../../Api';
// import { toast } from 'react-toastify';


// const ApprovalPage = () => {

//   const navigate = useNavigate();
//   const [ticket, setTicket] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [newFiles, setNewFiles] = useState([]);
//   const [isEditMode, setIsEditMode] = useState(false);

//   const currentUserStr = localStorage.getItem("user");
//   const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;
//   const currentUserId = currentUser?.id;

//   const isRequester = currentUserId && ticket?.requester_id === currentUserId;
//   const isEditable = ticket && ticket.status === "New" && isRequester;
//   //const isEditable = Boolean(ticket && ticket.status === "New");

//   const [openConfirm, setOpenConfirm] = useState(false);
//   const [saving, setSaving] = useState(false);

//   const isImage = (name = "") => /\.(jpg|jpeg|png|gif|webp)$/i.test(name);
//   const isPdf = (name = "") => /\.pdf$/i.test(name);

//   const [approvalStatus, setApprovalStatus] = useState('');
//   const [approvalLogs, setApprovalLogs] = useState([]);
//   const [currentApprovers, setCurrentApprovers] = useState([]);
//   const [allApprovers, setAllApprovers] = useState([]);

//   //Follow up states
//   const [showFollowUpChat, setShowFollowUpChat] = useState(false);
//   const [followUpChats, setFollowUpChats] = useState([]);
//   const [loadingFollowUpChats, setLoadingFollowUpChats] = useState(false);
//   const [newFollowUpMessage, setNewFollowUpMessage] = useState("");
//   const [sendingFollowUpMessage, setSendingFollowUpMessage] = useState(false);
//   const [currentChatTicket, setCurrentChatTicket] = useState(null);
//   const [assignee, setAssignee] = useState(null);
//   const [PresentUserId, setPresentUserId] = useState(null);
//   const [currentUserName, setCurrentUserName] = useState("You");
//   const [chatTab, setChatTab] = useState(0);

//   const [isSolvedTicket, setIsSolvedTicket] = useState(false);
//   const [solutionText, setSolutionText] = useState("");
//   const [isResolved, setIsResolved] = useState(false);
//   const [isApproved, setIsApproved] = useState(false);


//   useEffect(() => {
//     const userDataString = localStorage.getItem("user");
//     if (userDataString) {
//       const userData = JSON.parse(userDataString);
//       setPresentUserId(userData?.id || null);
//       setCurrentUserName(userData?.name || userData?.username || "You");
//     } else {
//       // Fallback
//       const userId = localStorage.getItem("current_user_id") || "11";
//       setPresentUserId(parseInt(userId));
//       setCurrentUserName("You");
//     }
//   }, []);

//   // Load users
//   useEffect(() => {
//     const loadUsers = async () => {
//       try {
//         const res = await fetchUsersAPI();
//         setAllApprovers(Array.isArray(res) ? res : res.results || []);
//       } catch (err) {
//         console.error("Failed to load users", err);
//       }
//     };
//     loadUsers();
//   }, []);

//   // Load ticket
//   const loadTicket = async () => {
//     const ticketId = localStorage.getItem('selectedTicketId');
//     if (!ticketId) {
//       setError('No ticket ID found.');
//       setLoading(false);
//       return;
//     }

//     setLoading(true);
//     try {
//       const { ticket: ticketData, approvalLogs = [] } = await getTicketDetails(ticketId);
//       setApprovalLogs(approvalLogs);

//       const currentStatus = ticketData.status_detail?.referrence_to || 'Pending';

//       const mappedTicket = {
//         id: ticketData.ticket_no || '',

//         // Store both display name and ID
//         type: ticketData.type_detail?.field_name || '',
//         type_id: ticketData.type_detail?.id || null,

//         department: ticketData.department_detail?.field_name || '',
//         department_id: ticketData.department_detail?.id || null,

//         location: ticketData.location_detail?.field_name || '',
//         location_id: ticketData.location_detail?.id || null,

//         platform: ticketData.platform_detail?.field_name || '',
//         platform_id: ticketData.platform_detail?.id || null,

//         priority: ticketData.priority_detail?.field_name || '',
//         priority_id: ticketData.priority_detail?.id || null,

//         category: ticketData.category_detail?.category_name?.trim() || '',
//         category_id: ticketData.category_detail?.id || null,

//         subcategory: ticketData.subcategory_detail?.subcategory_name || '',
//         subcategory_id: ticketData.subcategory_detail?.id || null,

//         title: ticketData.title || '',
//         description: ticketData.description || '',
//         files: ticketData.documents || [],

//         entity_id: ticketData.category_detail?.entity_id || ticketData.subcategory_detail?.entity_id || null,

//         // assignedTo: ticketData.assignees_detail && ticketData.assignees_detail.length > 0
//         //   ? ticketData.assignees_detail.map(u => u.name || u.username).join(', ')
//         //   : ticketData.assigned_groups_detail && ticketData.assigned_groups_detail.length > 0
//         //     ? `${ticketData.assigned_groups_detail[0].name} (Group${ticketData.assigned_groups_detail[0].members_count ? ` - ${ticketData.assigned_groups_detail[0].members_count} members` : ''})`
//         //     : 'Unassigned',

//         // assignedToId: ticketData.assigned_to || null, // if individual assignment exists

//         // Raw assignee data - preserved across reloads
//         assignees_detail: ticketData.assignees_detail || [],
//         assigned_groups_detail: ticketData.assigned_groups_detail || [],
//         assigned_to: ticketData.assigned_to || null,  // renamed to match backend field

//         status: ticketData.status_detail?.field_name || "",
//         status_id: ticketData.status_detail?.id,
//       };

//       // const mappedTicket = {
//       //   id: ticketData.ticket_no || '',
//       //   type: ticketData.type_detail?.field_name || ticketData.type_detail?.field_values || '',
//       //   department: ticketData.department_detail?.field_name || ticketData.department_detail?.field_values || '',
//       //   location: ticketData.location_detail?.field_name || '',
//       //   platform: ticketData.platform_detail?.field_name || ticketData.platform_detail?.field_values || '', // ← Fixed
//       //   category: ticketData.category_detail?.category_name?.trim() || '',
//       //   subcategory: ticketData.subcategory_detail?.subcategory_name || '',
//       //   priority: ticketData.priority_detail?.field_name || ticketData.priority_detail?.field_values || '',
//       //   title: ticketData.title || '',
//       //   description: ticketData.description || '',
//       //   files: ticketData.documents || [],
//       //   entity_id: ticketData.category_detail?.entity_id || ticketData.subcategory_detail?.entity_id || null,
//       //   category_id: ticketData.category_detail?.id,
//       //   subcategory_id: ticketData.subcategory_detail?.id,
//       //   approvalStatus: currentStatus,
//       //   assignedTo: ticketData.assignees_detail && ticketData.assignees_detail.length > 0
//       //     ? ticketData.assignees_detail.map(u => u.name || u.username).join(', ')
//       //     : ticketData.assigned_groups_detail && ticketData.assigned_groups_detail.length > 0
//       //       ? `${ticketData.assigned_groups_detail[0].name} (Group${ticketData.assigned_groups_detail[0].members_count ? ` - ${ticketData.assigned_groups_detail[0].members_count} members` : ''})`
//       //       : 'Unassigned',
//       //   assignedToId: ticketData.assigned_to || null,
//       //   status: ticketData.status_detail?.field_name || "",
//       //   status_id: ticketData.status_detail?.id,
//       // };

//       setTicket(mappedTicket);
//       setApprovalStatus(currentStatus);
//       setError(null);
//     } catch (err) {
//       setError(err.message || 'Failed to fetch ticket.');
//       toast.error(err.message || 'Failed to load ticket.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { loadTicket(); }, []);

//   // Fetch SLA Approvers
//   // useEffect(() => {
//   //   if (!ticket?.entity_id || !ticket?.category_id || !ticket?.subcategory_id) {
//   //     setCurrentApprovers([]);
//   //     setSlaLoading(false);
//   //     return;
//   //   }

//   //   const fetchApprovers = async () => {
//   //     setSlaLoading(true);
//   //     try {
//   //       const slaResponse = await fetchTicketSLAByEntityAndCategory(
//   //         ticket.entity_id, ticket.category_id, ticket.subcategory_id
//   //       );
//   //       const sla = Array.isArray(slaResponse) && slaResponse.length > 0 ? slaResponse[0] : slaResponse;

//   //       if (sla) {
//   //         const list = [
//   //           { user: sla.Approver_level1_user, time: sla.Approver_level1_time },
//   //           { user: sla.Approver_level2_user, time: sla.Approver_level2_time },
//   //           { user: sla.Approver_level3_user, time: sla.Approver_level3_time },
//   //           { user: sla.Approver_level4_user, time: sla.Approver_level4_time },
//   //           { user: sla.Approver_level5_user, time: sla.Approver_level5_time },
//   //         ].filter(a => a.user?.trim());
//   //         setCurrentApprovers(list);
//   //       }
//   //     } catch (err) {
//   //       console.error("SLA Error:", err);
//   //     } finally {
//   //       setSlaLoading(false);
//   //     }
//   //   };
//   //   fetchApprovers();
//   // }, [ticket?.entity_id, ticket?.category_id, ticket?.subcategory_id]);

//   const handleSaveChanges = async () => {
//     setSaving(true);

//     try {
//       const formData = new FormData();

//       // SEND IDs, NOT NAMES
//       formData.append("type", ticket.type_id);
//       formData.append("department", ticket.department_id);
//       formData.append("location", ticket.location_id);
//       formData.append("platform", ticket.platform_id);
//       formData.append("priority", ticket.priority_id);
//       formData.append("category", ticket.category_id);
//       formData.append("subcategory", ticket.subcategory_id);

//       // These might also need IDs — check your API
//       formData.append("entity", ticket.entity_id || "");

//       // Editable fields (strings are fine)
//       formData.append("title", ticket.title);
//       formData.append("description", ticket.description);

//       formData.append("assigned_to", ticket.assigned_to || "");

//       // New files
//       newFiles.forEach((file) => {
//         formData.append("documents", file);
//       });

//       await updateTicket(ticket.id, formData);

//       toast.success("Ticket updated successfully");
//       setIsEditMode(false);
//       setNewFiles([]);
//       setOpenConfirm(false);
//       await loadTicket();
//     } catch (err) {
//       console.error(err.response?.data || err);
//       toast.error(err.response?.data?.detail || "Failed to update ticket");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleCancelTicket = async () => {
//     setSaving(true);

//     try {
//       const formData = new FormData();

//       formData.append("type", ticket.type_id);
//       formData.append("department", ticket.department_id);
//       formData.append("location", ticket.location_id);
//       formData.append("platform", ticket.platform_id);
//       formData.append("priority", ticket.priority_id);
//       formData.append("category", ticket.category_id);
//       formData.append("subcategory", ticket.subcategory_id);

//       formData.append("entity", ticket.entity_id || "");
//       formData.append("title", ticket.title);
//       formData.append("description", ticket.description);
//       formData.append("assigned_to", ticket.assigned_to || "");

//       newFiles.forEach((file) => {
//         formData.append("documents", file);
//       });

//       formData.append("status", CANCELLED_STATUS_ID);

//       await updateTicket(ticket.id, formData);

//       toast.success("Ticket cancelled successfully");
//       await loadTicket();
//     } catch (err) {
//       console.error(err.response?.data || err);
//       toast.error("Failed to cancel ticket");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const CANCELLED_STATUS_ID = 154;

//   // const handleChatDrawerOpen = async (ticketNo) => {
//   //   if (!ticketNo || !PresentUserId) {
//   //     toast.error("No ticket or user ID provided");
//   //     return;
//   //   }
//   //   const ticket = selectedTickets.find(t => t.ticket_no == ticketNo);
//   //   if (!ticket) {
//   //     toast.error("Ticket not found in current list");
//   //     return;
//   //   }
//   //   setChatTab(0); // Default to Follow-up tab
//   //   setLoadingFollowUpChats(true);
//   //   setShowFollowUpChat(true);
//   //   setFollowUpChats([]);
//   //   // Reset solved states
//   //   setIsSolvedTicket(false);
//   //   setSolutionText("");
//   //   setIsResolved(false);
//   //   setIsApproved(false);
//   //   try {
//   //     // Fetch ticket details to get assignee_detail
//   //     const ticketDetails = await getTicketDetails(ticketNo);
//   //     const ticketData = ticketDetails.ticket || ticketDetails;
//   //     const assigneesDetails = ticketData.assignees_detail; // It's an array
//   //     if (!assigneesDetails || assigneesDetails.length === 0) {
//   //       throw new Error("Assignee details not found");
//   //     }
//   //     const assigneeDetail = assigneesDetails[0]; // Take the first assignee
//   //     if (!assigneeDetail.id) {
//   //       throw new Error("Assignee ID not found");
//   //     }
//   //     setAssignee(assigneeDetail);
//   //     // Set ticket details
//   //     setCurrentChatTicket({
//   //       id: ticketNo,
//   //       title: ticketData.title || ticket.title || "",
//   //       description: ticketData.description || ticket.description || "",
//   //     });
//   //     // Check if solved ticket and set solution data (for ticket creator view)
//   //     if (selectedType === "solved") {
//   //       setIsSolvedTicket(true);
//   //       // Assuming ticketData has solution_text, resolved_status, approved_status fields
//   //       // Adjust field names based on your API response
//   //       setSolutionText(ticketData.solution_text || ticketData.resolution_text || "");
//   //       setIsResolved(ticketData.resolved_status === "yes" || ticketData.is_resolved || false);
//   //       setIsApproved(ticketData.approved_status === "yes" || ticketData.is_approved || false);
//   //     }
//   //     const receiverId = assigneeDetail.id;
//   //     // Fetch messages based on ticket_no and between current user (ticket creator) and assignee
//   //     const ticketMessages = await fetchTicketMessages(ticketNo, currentUserId, receiverId);
//   //     const messagesCount = ticketMessages.length;
//   //     console.log('Fetched messages count:', messagesCount);

//   //     // Sort messages by timestamp
//   //     const sortedTicketMessages = ticketMessages.sort((a, b) =>
//   //       new Date(a.createdon) - new Date(b.createdon)
//   //     );

//   //     setFollowUpChats(sortedTicketMessages);
//   //   } catch (err) {
//   //     console.error("Error fetching ticket details or chats:", err);
//   //     toast.error("Failed to fetch ticket details or chats");
//   //     setShowFollowUpChat(false);
//   //   } finally {
//   //     setLoadingFollowUpChats(false);
//   //   }
//   // };

//   const handleChatDrawerOpen = async () => {
//     if (!ticket?.id || !PresentUserId) {
//       toast.error("No ticket or user ID provided");
//       return;
//     }

//     setChatTab(0);
//     setLoadingFollowUpChats(true);
//     setShowFollowUpChat(true);
//     setFollowUpChats([]);

//     try {
//       // Use the already-loaded ticket data
//       const ticketData = ticket;

//       const assigneesDetails = ticketData.assignees_detail;
//       if (!assigneesDetails || assigneesDetails.length === 0) {
//         throw new Error("No assignee found for this ticket");
//       }

//       const assigneeDetail = assigneesDetails[0]; // First assignee
//       setAssignee(assigneeDetail);

//       setCurrentChatTicket({
//         id: ticketData.id,
//         title: ticketData.title || "",
//         description: ticketData.description || "",
//       });

//       const receiverId = assigneeDetail.id;

//       // Fetch messages
//       const ticketMessages = await fetchTicketMessages(ticketData.id, PresentUserId, receiverId);

//       const sortedMessages = ticketMessages.sort((a, b) =>
//         new Date(a.createdon) - new Date(b.createdon)
//       );

//       setFollowUpChats(sortedMessages);
//     } catch (err) {
//       console.error("Error opening chat:", err);
//       toast.error(err.message || "Failed to open follow-up chat");
//       setShowFollowUpChat(false);
//     } finally {
//       setLoadingFollowUpChats(false);
//     }
//   };

//   const handleChatDrawerClose = () => {
//     setShowFollowUpChat(false);
//     setCurrentChatTicket(null);
//     setAssignee(null);
//     setFollowUpChats([]);
//     setLoadingFollowUpChats(false);
//     setChatTab(0);
//     // Reset solved states
//     setIsSolvedTicket(false);
//     setSolutionText("");
//     setIsResolved(false);
//     setIsApproved(false);
//   };

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

//   const fetchTicketMessages = async (ticketNo, currentUserId, receiverId) => {
//     try {
//       // Fetch all messages; adjust if API supports params
//       const allMessages = await fetchMessages();
//       // Filter by ticket_no and between currentUserId (ticket creator) and receiverId (assignee) (bidirectional)
//       const filteredMessages = allMessages.filter((msg) =>
//         msg.ticket_no == ticketNo &&
//         ((msg.sender === currentUserId && msg.receiver === receiverId) ||
//           (msg.sender === receiverId && msg.receiver === currentUserId))
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
//     if (!assignee?.id) {
//       toast.error("Assignee not loaded");
//       return;
//     }
//     if (!currentUserId) {
//       toast.error("User not authenticated");
//       return;
//     }
//     const receiverId = assignee.id;
//     setSendingFollowUpMessage(true);
//     try {
//       const payload = {
//         sender: currentUserId, // Explicitly include sender (logged-in user - ticket creator)
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

//       // Add to local state and sort
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

//   const handleBackTicket = () => {
//     localStorage.removeItem('selectedTicketId');
//     navigate('/tickethistory');
//   };

//   if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>;
//   if (error || !ticket) return <Box sx={{ p: 3 }}><Typography color="error">{error || "Ticket not found"}</Typography></Box>;

//   const priorityColors = {
//     "Critical": "#D32F2F", "Very High": "#E53935", "High": "#FB8C00",
//     "Medium": "#FDD835", "Low": "#43A047", "Very Low": "#1E88E5"
//   };

//   const disabledFieldSx = {
//     "& .MuiInputBase-input.Mui-disabled": {
//       color: "#1f1f1f",
//       WebkitTextFillColor: "#1f1f1f",
//       fontWeight: 600,
//     },
//     "& .MuiOutlinedInput-root": { borderRadius: 3 },
//   };

//   return (
//     <Box sx={{ p: 3, background: "#f5f6fa" }}>
//       <Card sx={{ borderRadius: 3 }}>
//         <CardContent sx={{ p: 3 }}>
//           <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
//             <Typography variant="h3" fontWeight={600}>Ticket #{ticket.id}</Typography>
//             <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
//               {ticket?.status === "New" && isRequester && !isEditMode && (
//                 <IconButton
//                   onClick={() => setIsEditMode(true)}
//                   sx={{
//                     bgcolor: "primary.light",
//                     color: "white",
//                     "&:hover": { bgcolor: "primary.main" },
//                   }}
//                   title="Edit Ticket"
//                 >
//                   <EditIcon />
//                 </IconButton>
//               )}
//               {/* {ticket.status === "New" && !isEditMode && (
//                 <IconButton
//                   onClick={() => setIsEditMode(true)}
//                   sx={{
//                     bgcolor: "primary.light",
//                     color: "white",
//                     "&:hover": { bgcolor: "primary.main" },
//                   }}
//                   title="Edit Ticket"
//                 >
//                   <EditIcon />
//                 </IconButton>
//               )} */}
//               <Chip
//                 label={ticket.status}
//                 size="small"
//                 sx={{
//                   fontSize: "1rem", py: 2.5, px: 3, fontWeight: 800,
//                   backgroundColor:
//                     ticket.status === "New"
//                       ? "#3182CE"
//                       : ticket.status === "Approved"
//                         ? "#2F855A"
//                         : ticket.status === "Rejected"
//                           ? "#C53030"
//                           : "#718096",
//                   color: "#fff",
//                 }}
//               />
//               <Chip label={ticket.priority} sx={{
//                 fontWeight: 800, fontSize: "1rem", py: 2.5, px: 3,
//                 background: priorityColors[ticket.priority] || "#666", color: "white",
//               }} />
//             </Box>
//           </Box>
//           <Divider sx={{ my: 2 }} />
//           <Grid container spacing={2}>
//             {[
//               { label: "Type", value: ticket.type },
//               { label: "Department", value: ticket.department },
//               { label: "Location", value: ticket.location },
//               { label: "Platform", value: ticket.platform },
//               { label: "Category", value: ticket.category },
//               { label: "Subcategory", value: ticket.subcategory },
//               { label: "Priority", value: ticket.priority },
//               {
//                 label: "Assign To",
//                 value: ticket.assignees_detail?.length > 0
//                   ? ticket.assignees_detail.map(u => u.name || u.username || u.email).join(', ')
//                   : ticket.assigned_groups_detail?.length > 0
//                     ? `${ticket.assigned_groups_detail[0].name} (Group${ticket.assigned_groups_detail[0].members_count ? ` - ${ticket.assigned_groups_detail[0].members_count} members` : ''})`
//                     : 'Unassigned'
//               },
//               // { label: "Assign To", value: ticket.assignedTo }
//             ].map((item) => (
//               <Grid size={{ xs: 12, sm: 6, md: 3 }} key={item.label}>
//                 <Typography fontWeight={600} sx={{ mb: 1 }}>
//                   {item.label}
//                 </Typography>
//                 <TextField fullWidth size="small" value={item.value || "-"} disabled sx={disabledFieldSx} />
//               </Grid>
//             ))}
//           </Grid>
//           <Box sx={{ mt: 3 }}>
//             <Typography fontWeight={600} sx={{ mb: 1 }}>Title</Typography>
//             <TextField
//               fullWidth
//               size="small"
//               value={ticket.title}
//               onChange={(e) =>
//                 setTicket((prev) => ({ ...prev, title: e.target.value }))
//               }
//               disabled={!isEditMode}
//               sx={disabledFieldSx}
//             />
//           </Box>
//           <Box sx={{ mt: 3 }}>
//             <Typography fontWeight={600} sx={{ mb: 1 }}>Description</Typography>
//             <TextField
//               multiline
//               rows={4}
//               fullWidth
//               value={ticket.description}
//               disabled={!isEditMode}
//               onChange={(e) =>
//                 setTicket((prev) => ({ ...prev, description: e.target.value }))
//               }
//               sx={disabledFieldSx}
//             />

//           </Box>

//           {isEditMode && (
//             <Box sx={{ mt: 3 }}>
//               <Typography fontWeight={600}>Attachments</Typography>
//               <Button
//                 variant="contained"
//                 component="label"
//                 sx={{ mt: 1 }}
//               >
//                 Choose Files ({newFiles.length})
//                 <input
//                   type="file"
//                   hidden
//                   multiple
//                   onChange={(e) => setNewFiles(Array.from(e.target.files))}
//                 />
//               </Button>
//             </Box>
//           )}

//           {newFiles.length > 0 && isEditMode && (
//             <Stack direction="row" spacing={2} sx={{ mt: 2, flexWrap: "wrap" }}>
//               {newFiles.map((file, i) => (
//                 <Box key={i} sx={{ width: 120, textAlign: "center", position: "relative" }}>

//                   {/* Remove button */}
//                   <IconButton
//                     size="small"
//                     onClick={() =>
//                       setNewFiles((prev) => prev.filter((_, idx) => idx !== i))
//                     }
//                     sx={{
//                       position: "absolute",
//                       top: -8,
//                       right: -8,
//                       bgcolor: "error.main",
//                       color: "#fff",
//                       "&:hover": { bgcolor: "error.dark" },
//                     }}
//                   >
//                     ✕
//                   </IconButton>

//                   {isImage(file.name) ? (
//                     <Box
//                       component="img"
//                       src={URL.createObjectURL(file)}
//                       alt={file.name}
//                       sx={{
//                         width: "100%",
//                         height: 80,
//                         objectFit: "cover",
//                         borderRadius: 2,
//                       }}
//                     />
//                   ) : (
//                     <Typography fontSize="0.75rem">📄 {file.name}</Typography>
//                   )}
//                 </Box>
//               ))}
//             </Stack>
//           )}

//           {ticket.files?.length > 0 && (
//             <Box sx={{ my: 3 }}>
//               <Typography variant="overline" sx={{ fontWeight: 700 }}>
//                 Attachments
//               </Typography>

//               <Stack direction="row" spacing={2} sx={{ mt: 1, flexWrap: "wrap" }}>
//                 {ticket.files.map((f, i) => {
//                   const name = f.file?.split("/").pop();
//                   return (
//                     <Box key={i} sx={{ width: 120, textAlign: "center" }}>
//                       {isImage(name) ? (
//                         <Box
//                           component="img"
//                           src={f.file}
//                           alt={name}
//                           sx={{ width: "100%", height: 80, objectFit: "cover", borderRadius: 2 }}
//                         />
//                       ) : (
//                         <Button
//                           href={f.file}
//                           target="_blank"
//                           size="small"
//                           variant="outlined"
//                         >
//                           {name || "File"}
//                         </Button>
//                       )}
//                     </Box>
//                   );
//                 })}
//               </Stack>
//             </Box>
//           )}

//           {ticket.files?.length > 0 && (
//             <Box sx={{ my: 3 }}>
//               <Typography variant="overline" sx={{ color: "#667eea", fontWeight: 700 }}>Attachments</Typography>
//               <Stack spacing={1} sx={{ mt: 1 }}>
//                 {ticket.files.map((f, i) => (
//                   <Button key={i} href={f.file || f.url} target="_blank" variant="outlined" size="small">
//                     {f.file?.split('/').pop() || `File ${i + 1}`}
//                   </Button>
//                 ))}
//               </Stack>
//             </Box>
//           )}

//           {isEditMode && (
//             <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end", gap: 2 }}>
//               <Button
//                 variant="outlined"
//                 color="error"
//                 sx={{ borderRadius: 3 }}
//                 onClick={() => {
//                   setIsEditMode(false);
//                   setNewFiles([]);
//                   loadTicket();
//                 }}
//               >
//                 Cancel Edit
//               </Button>

//               <Button
//                 variant="contained"
//                 color="primary"
//                 sx={{ borderRadius: 3 }}
//                 onClick={() => setOpenConfirm(true)}
//               >
//                 Save Changes
//               </Button>
//             </Box>
//           )}
//           <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 4 }}>
//             <Button variant="contained" color="info" sx={{ borderRadius: 3 }} onClick={() => handleChatDrawerOpen(ticket.ticket_no)}>Follow up Info</Button>
//             <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
//               {ticket?.status === "New" && isRequester && !isEditMode && (
//                 <Button color="error" variant="outlined" sx={{ borderRadius: 3 }} onClick={handleCancelTicket}>Cancel Ticket</Button>
//               )}
//               {/* {ticket.status === "New" && !isEditMode && (
//                 <Button color="error" variant="outlined" sx={{ borderRadius: 3 }} onClick={handleCancelTicket}>Cancel Ticket</Button>
//               )} */}
//               <Button variant="contained" onClick={handleBackTicket} color="info" sx={{ borderRadius: 3 }}>Back to Tickets</Button>
//             </Box>
//           </Box>
//         </CardContent>
//       </Card>

//       <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
//         <DialogTitle>Confirm Save</DialogTitle>
//         <DialogContent>
//           <Typography>
//             Are you sure you want to save the changes to this ticket?
//           </Typography>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenConfirm(false)}>Cancel</Button>
//           <Button
//             variant="contained"
//             onClick={handleSaveChanges}
//             disabled={saving}
//           >
//             {saving ? "Saving..." : "Confirm"}
//           </Button>
//         </DialogActions>
//       </Dialog>

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
//             display: "flow",
//             p: 2,
//             borderBottom: 1,
//             borderColor: "divider",
//             bgcolor: "primary.main",
//             color: "white"
//           }}>
//             <Typography variant="h6" sx={{ color: "white" }}>
//               Ticket #{currentChatTicket?.id}
//             </Typography>
//             <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
//               {currentChatTicket?.title || "No Title"}
//             </Typography>
//             <Typography variant="caption" sx={{ color: "white" }}>
//               {currentChatTicket?.description}
//             </Typography>
//           </Box>
//           {/* Tab Buttons */}
//           <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
//             <Tabs
//               value={chatTab}
//               onChange={(e, newValue) => setChatTab(newValue)}
//               centered
//             >
//               <Tab label="Follow-up" icon={<ChatIcon />} />
//               {isSolvedTicket && <Tab label="Solution" icon={<DoneAllIcon />} />}
//             </Tabs>
//           </Box>
//           {/* Tab Content */}
//           <Box sx={{ flex: 1 }}>
//             {chatTab === 0 && (
//               // Follow-up Tab: Chat Messages
//               <Box sx={{
//                 display: "flex",
//                 flexDirection: "column",
//                 height: "100%"
//               }}>
//                 {/* Messages Area */}
//                 <Box sx={{
//                   flex: 1,
//                   overflowY: "auto",
//                   p: 2,
//                   display: "flex",
//                   flexDirection: "column",
//                   gap: 2
//                 }}>
//                   {loadingFollowUpChats ? (
//                     <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
//                       <CircularProgress />
//                     </Box>
//                   ) : groupedChats.length === 0 ? (
//                     <Box sx={{
//                       display: "flex",
//                       flexDirection: "column",
//                       justifyContent: "center",
//                       alignItems: "center",
//                       height: "100%",
//                       color: "text.secondary"
//                     }}>
//                       <ChatIcon sx={{ fontSize: 60, mb: 2, opacity: 0.5 }} />
//                       <Typography>No messages yet. Start the conversation!</Typography>
//                     </Box>
//                   ) : (
//                     groupedChats.map((group, groupIndex) => (
//                       <Box key={group.date} sx={{ mb: 3 }}>
//                         <Divider sx={{ my: 2, width: "100%" }}>
//                           <Chip
//                             label={group.date}
//                             size="small"
//                             sx={{ bgcolor: "grey.200" }}
//                           />
//                         </Divider>
//                         {group.messages.map((msg, index) => {
//                           const isFromCurrentUser = msg.sender === currentUserId;

//                           return (
//                             <Box
//                               key={msg.id || index}
//                               sx={{
//                                 display: "flex",
//                                 justifyContent: isFromCurrentUser ? "flex-end" : "flex-start",
//                                 mb: 2
//                               }}
//                             >
//                               {!isFromCurrentUser ? (
//                                 <Box sx={{ display: "flex", alignItems: "flex-end", gap: 1 }}>
//                                   <Avatar sx={{ width: 40, height: 40, bgcolor: "grey.300" }}>
//                                     {getInitials(assignee?.name)}
//                                   </Avatar>
//                                   <Box
//                                     sx={{
//                                       maxWidth: "80%",
//                                       p: 2,
//                                       bgcolor: "grey.100",
//                                       color: "text.primary",
//                                       borderRadius: 2,
//                                       borderTopLeftRadius: 4,
//                                       borderTopRightRadius: 12,
//                                       borderBottomLeftRadius: 4,
//                                       borderBottomRightRadius: 12,
//                                       boxShadow: 1,
//                                     }}
//                                   >
//                                     <Typography variant="body1" sx={{ wordBreak: "break-word" }}>
//                                       {msg.message}
//                                     </Typography>

//                                     <Box sx={{
//                                       display: "flex",
//                                       justifyContent: "space-between",
//                                       alignItems: "center",
//                                       mt: 1
//                                     }}>
//                                       <Typography
//                                         variant="caption"
//                                         sx={{
//                                           color: "text.secondary",
//                                           fontSize: "0.7rem"
//                                         }}
//                                       >
//                                         {new Date(msg.createdon).toLocaleTimeString([], {
//                                           hour: '2-digit',
//                                           minute: '2-digit',
//                                           hour12: true
//                                         })}
//                                       </Typography>
//                                       <Typography
//                                         variant="caption"
//                                         sx={{
//                                           ml: 1,
//                                           color: "text.primary",
//                                           fontSize: "0.75rem",
//                                           fontWeight: "bold"
//                                         }}
//                                       >
//                                         {assignee?.name || "Assignee"}
//                                       </Typography>
//                                     </Box>
//                                   </Box>
//                                 </Box>
//                               ) : (
//                                 <Box sx={{ display: "flex", alignItems: "flex-end", gap: 1, flexDirection: "row-reverse" }}>
//                                   <Box
//                                     sx={{
//                                       maxWidth: "80%",
//                                       p: 2,
//                                       bgcolor: "primary.main",
//                                       color: "white",
//                                       borderRadius: 2,
//                                       borderTopLeftRadius: 12,
//                                       borderTopRightRadius: 4,
//                                       borderBottomLeftRadius: 12,
//                                       borderBottomRightRadius: 4,
//                                       boxShadow: 1,
//                                     }}
//                                   >
//                                     <Typography variant="body1" sx={{ wordBreak: "break-word" }}>
//                                       {msg.message}
//                                     </Typography>

//                                     <Box sx={{
//                                       display: "flex",
//                                       justifyContent: "space-between",
//                                       alignItems: "center",
//                                       mt: 1
//                                     }}>
//                                       <Typography
//                                         variant="caption"
//                                         sx={{
//                                           color: "rgba(255,255,255,0.8)",
//                                           fontSize: "0.7rem"
//                                         }}
//                                       >
//                                         {new Date(msg.createdon).toLocaleTimeString([], {
//                                           hour: '2-digit',
//                                           minute: '2-digit',
//                                           hour12: true
//                                         })}
//                                       </Typography>
//                                       <Typography
//                                         variant="caption"
//                                         sx={{
//                                           mr: 1,
//                                           color: "white",
//                                           fontSize: "0.75rem",
//                                           fontWeight: "bold"
//                                         }}
//                                       >
//                                         You
//                                       </Typography>
//                                     </Box>
//                                   </Box>
//                                   <Avatar sx={{ width: 40, height: 40, bgcolor: "primary.main", color: "white" }}>
//                                     {getInitials(currentUserName)}
//                                   </Avatar>
//                                 </Box>
//                               )}
//                             </Box>
//                           );
//                         })}
//                       </Box>
//                     ))
//                   )}
//                 </Box>
//                 {/* Message Input */}
//                 <Box sx={{
//                   p: 2,
//                   borderTop: 1,
//                   borderColor: "divider",
//                   bgcolor: "background.default"
//                 }}>
//                   <Box sx={{ display: "flex", gap: 1 }}>
//                     <TextField
//                       fullWidth
//                       size="small"
//                       placeholder="Type your message..."
//                       value={newFollowUpMessage}
//                       onChange={e => setNewFollowUpMessage(e.target.value)}
//                       disabled={sendingFollowUpMessage || !assignee}
//                       onKeyPress={(e) => {
//                         if (e.key === 'Enter' && !e.shiftKey) {
//                           e.preventDefault();
//                           sendFollowUpMessageHandler(newFollowUpMessage);
//                         }
//                       }}
//                       multiline
//                       maxRows={4}
//                     />
//                     <IconButton
//                       onClick={() => sendFollowUpMessageHandler(newFollowUpMessage)}
//                       disabled={!newFollowUpMessage.trim() || sendingFollowUpMessage || !assignee}
//                       color="primary"
//                       sx={{ alignSelf: "flex-end", height: 40, width: 40 }}
//                     >
//                       {sendingFollowUpMessage ? <CircularProgress size={20} /> : <SendIcon style={{ fontSize: 35 }} />}
//                     </IconButton>
//                   </Box>
//                 </Box>
//               </Box>
//             )}
//             {chatTab === 1 && isSolvedTicket && (
//               // Solution Tab: Approve/Resolve Solution
//               <Box sx={{
//                 display: "flex",
//                 flexDirection: "column",
//                 justifyContent: "center",
//                 alignItems: "center",
//                 height: "100%",
//                 p: 4,
//                 gap: 2,
//                 textAlign: "center"
//               }}>
//                 <DoneAllIcon sx={{ fontSize: 64, color: "success.main" }} />
//                 <Typography variant="h6" fontWeight={600} color="text.primary">
//                   Solution Provided
//                 </Typography>
//                 <Typography variant="body1" sx={{ mb: 3, wordBreak: "break-word", color: "text.primary" }}>
//                   {solutionText}
//                 </Typography>
//                 <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
//                   <Button
//                     variant={isResolved ? "contained" : "outlined"}
//                     color="success"
//                     onClick={handleResolveSolution}
//                     disabled={isResolved}
//                     size="small"
//                   >
//                     {isResolved ? "Resolved" : "Resolve Solution"}
//                   </Button>
//                   <Button
//                     variant={isApproved ? "contained" : "outlined"}
//                     color="primary"
//                     onClick={handleApproveSolution}
//                     disabled={isApproved}
//                     size="small"
//                   >
//                     {isApproved ? "Approved" : "Approve Solution"}
//                   </Button>
//                 </Box>
//                 <Button
//                   variant="outlined"
//                   onClick={() => setChatTab(0)}
//                   sx={{ mt: 1 }}
//                 >
//                   Back to Follow-up
//                 </Button>
//               </Box>
//             )}
//           </Box>
//         </Box>
//       </Drawer>

//     </Box>
//   );
// };

// export default ApprovalPage;

import { Box, Grid, Card, CardContent, Typography, TextField, Button, Divider, Chip, Stack, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Drawer, Tabs, Tab, Avatar, Autocomplete } from "@mui/material";
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from 'react-router-dom';
import EditIcon from "@mui/icons-material/Edit";
import ChatIcon from '@mui/icons-material/Chat';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { getTicketDetails, fetchMessages, sendMessage, updateTicket, fetchUsersAPI, fetchWatcherGroups } from '../../Api';
import { toast } from 'react-toastify';
import { useSearchParams } from 'react-router-dom';


const ApprovalPage = () => {

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const urlMode = searchParams.get('mode');

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newFiles, setNewFiles] = useState([]);
  const [chatTab, setChatTab] = useState(0);

  const currentUserStr = localStorage.getItem("user");
  const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;
  const currentUserId = currentUser?.id;
  const currentUserName = currentUser?.name || currentUser?.username || "You";

  const isAdmin = currentUser?.roles?.some(role =>
    role.name === "Admin" || role.name.toLowerCase() === "admin"
  ) || false;

  const [isEditMode, setIsEditMode] = useState(urlMode === 'edit');

  // Update edit mode when URL changes
  useEffect(() => {
    setIsEditMode(urlMode === 'edit');
  }, [urlMode]);

  const isRequester = currentUserId && ticket?.requester_id === currentUserId;
  //const isEditable = ticket && ticket.status === "New" && (isRequester || isAdmin);
  //const isEditable = Boolean(ticket && ticket.status === "New");
  //const canEnterEditMode = ticket && ticket.status === "New" && (isRequester || isAdmin);

  const [openConfirm, setOpenConfirm] = useState(false);
  const [saving, setSaving] = useState(false);

  const [isSolvedTicket, setIsSolvedTicket] = useState(false);
  const [solutionText, setSolutionText] = useState("");
  const [isResolved, setIsResolved] = useState(false);
  const [isApproved, setIsApproved] = useState(false);

  const isImage = (name = "") => /\.(jpg|jpeg|png|gif|webp)$/i.test(name);

  // Follow-up chat states
  const [showFollowUpChat, setShowFollowUpChat] = useState(false);
  const [followUpChats, setFollowUpChats] = useState([]);
  const [loadingFollowUpChats, setLoadingFollowUpChats] = useState(false);
  const [newFollowUpMessage, setNewFollowUpMessage] = useState("");
  const [sendingFollowUpMessage, setSendingFollowUpMessage] = useState(false);
  const [currentChatTicket, setCurrentChatTicket] = useState(null);
  const [assignee, setAssignee] = useState(null);

  // Assignment editing (for Admin)
  const [allUsers, setAllUsers] = useState([]);
  const [watcherGroups, setWatcherGroups] = useState([]);
  const [selectionTypes, setSelectionTypes] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState([]);

  const [chatManuallyClosed, setChatManuallyClosed] = useState(false);

  const loadTicket = async () => {
    const ticketId = localStorage.getItem('selectedTicketId');
    if (!ticketId) {
      setError('No ticket ID found.');
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { ticket: ticketData } = await getTicketDetails(ticketId);

      const mappedTicket = {
        id: ticketData.ticket_no || '',
        type: ticketData.type_detail?.field_name || '',
        type_id: ticketData.type_detail?.id || null,
        department: ticketData.department_detail?.field_name || '',
        department_id: ticketData.department_detail?.id || null,
        location: ticketData.location_detail?.field_name || '',
        location_id: ticketData.location_detail?.id || null,
        platform: ticketData.platform_detail?.field_name || '',
        platform_id: ticketData.platform_detail?.id || null,
        priority: ticketData.priority_detail?.field_name || '',
        priority_id: ticketData.priority_detail?.id || null,
        category: ticketData.category_detail?.category_name?.trim() || '',
        category_id: ticketData.category_detail?.id || null,
        subcategory: ticketData.subcategory_detail?.subcategory_name || '',
        subcategory_id: ticketData.subcategory_detail?.id || null,
        title: ticketData.title || '',
        description: ticketData.description || '',
        files: ticketData.documents || [],
        assignees_detail: ticketData.assignees_detail || [],
        assigned_groups_detail: ticketData.assigned_groups_detail || [],
        status: ticketData.status_detail?.field_name || "",
        requester_id: ticketData.requested || ticketData.requested_detail?.id,
      };

      setTicket(mappedTicket);

      // Pre-fill assignment for editing (Admin only)
      if (isAdmin && isEditMode) {
        const types = [];
        const users = [];
        const groups = [];

        if (ticketData.assignees_detail && ticketData.assignees_detail.length > 0) {
          types.push('user');
          users.push(...ticketData.assignees_detail);
        }
        if (ticketData.assigned_groups_detail && ticketData.assigned_groups_detail.length > 0) {
          types.push('group');
          groups.push(...ticketData.assigned_groups_detail);
        }

        setSelectionTypes(types);
        setSelectedUsers(users);
        setSelectedGroups(groups);
      }
    } catch (err) {
      setError('Failed to load ticket.');
      toast.error('Failed to load ticket.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTicket();
  }, []);

  // Load users/groups for Admin
  useEffect(() => {
    if (isAdmin && isEditMode) {
      const loadOptions = async () => {
        try {
          const users = await fetchUsersAPI();
          setAllUsers(Array.isArray(users) ? users : []);
          const groups = await fetchWatcherGroups();
          setWatcherGroups(Array.isArray(groups) ? groups : []);
        } catch (err) {
          console.error("Failed to load assignment options", err);
        }
      };
      loadOptions();
    }
  }, [isAdmin, isEditMode]);

  // Reset manual close flag when mode or ticket changes
  useEffect(() => {
    setChatManuallyClosed(false);
  }, [urlMode, ticket?.id]);

  // Auto-open chat only in view mode AND if not manually closed
  useEffect(() => {
    if (!loading && ticket && urlMode !== 'edit' && !showFollowUpChat && !chatManuallyClosed) {
      handleChatDrawerOpen();
    }
  }, [loading, ticket, urlMode, chatManuallyClosed]);

  // Open Follow-up Chat
  const handleChatDrawerOpen = async () => {

    if (!ticket?.id || !currentUserId) {
      toast.error("User or ticket not loaded");
      return;
    }

    const assignees = ticket.assignees_detail || [];
    if (!assignees || assignees.length === 0) {
      toast.warn("No assignee found for this ticket");
      return;
    }

    setAssignee(assignees[0]);
    setCurrentChatTicket({
      id: ticket.id,
      title: ticket.title,
      description: ticket.description,
    });
    setShowFollowUpChat(true);
    setLoadingFollowUpChats(true);
    setFollowUpChats([]);

    try {
      const messages = await fetchMessages();
      const ticketMsgs = messages.filter(m => m.ticket_no == ticket.id);
      setFollowUpChats(ticketMsgs.sort((a, b) => new Date(a.createdon) - new Date(b.createdon)));
    } catch {
      toast.error("Failed to load messages");
    } finally {
      setLoadingFollowUpChats(false);
    }
  };

  const handleChatDrawerClose = () => {
    setShowFollowUpChat(false);
    setCurrentChatTicket(null);
    setAssignee(null);
    setFollowUpChats([]);
    setNewFollowUpMessage("");
    setChatManuallyClosed(true); // Prevent auto-reopen
  };

  const sendFollowUpMessageHandler = async (text) => {
    if (!text.trim()) {
      toast.error("Message cannot be empty");
      return;
    }

    if (!assignee?.id || !currentChatTicket?.id) {
      toast.error("Cannot send message: missing assignee or ticket");
      return;
    }

    setSendingFollowUpMessage(true);
    try {
      await sendMessage({
        receiver: assignee.id || assignee.email,
        ticket_no: currentChatTicket.id,
        message: text.trim(),
      });

      // Refetch messages to get the latest (including the one just sent)
      const messages = await fetchMessages();
      const ticketMessages = messages.filter(msg => msg.ticket_no == currentChatTicket.id);
      const sorted = ticketMessages.sort((a, b) => new Date(a.createdon) - new Date(b.createdon));
      setFollowUpChats(sorted);
      setNewFollowUpMessage("");
      toast.success("Message sent!");
    } catch (err) {
      toast.error("Failed to send message");
    } finally {
      setSendingFollowUpMessage(false);
    }
  };

  const groupedChats = useMemo(() => {
    const groups = {};
    followUpChats.forEach(msg => {
      const date = new Date(msg.createdon).toLocaleDateString();
      if (!groups[date]) groups[date] = [];
      groups[date].push(msg);
    });

    return Object.entries(groups)
      .map(([date, msgs]) => ({
        date,
        messages: msgs.sort((a, b) => new Date(a.createdon) - new Date(b.createdon))
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [followUpChats]);

  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(' ').map(n => n[0]?.toUpperCase() || '').join('').substring(0, 2);
  };

  const handleBackTicket = () => {
    localStorage.removeItem('selectedTicketId');
    navigate('/tickethistory');
  };

  const handleSaveChanges = async () => {
    setSaving(true);
    try {
      const formData = new FormData();

      // Only send fields that are allowed to change
      if (isRequester && isEditMode) {
        // Requester can update these
        formData.append("title", ticket.title);
        formData.append("description", ticket.description);
        newFiles.forEach(file => formData.append("documents", file));
      }

      if (isAdmin && isEditMode) {
        // Admin can only update assignment
        selectionTypes.forEach(type => formData.append("assigned_to_type", type));
        selectedUsers.forEach(user => formData.append("assignee", user.email || user.id));
        selectedGroups.forEach(group => formData.append("assigned_groups", group.id));
      }

      // Common fields (IDs - not editable in UI)
      formData.append("type", ticket.type_id);
      formData.append("department", ticket.department_id);
      formData.append("location", ticket.location_id);
      formData.append("platform", ticket.platform_id);
      formData.append("priority", ticket.priority_id);
      formData.append("category", ticket.category_id);
      formData.append("subcategory", ticket.subcategory_id || "");

      await updateTicket(ticket.id, formData);

      toast.success("Ticket updated successfully");
      setIsEditMode(false);
      setNewFiles([]);
      setOpenConfirm(false);
      await loadTicket();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to update ticket");
    } finally {
      setSaving(false);
    }
  };

  const handleCancelTicket = async () => {
    setSaving(true);

    try {
      const formData = new FormData();
      formData.append("type", ticket.type_id);
      formData.append("department", ticket.department_id);
      formData.append("location", ticket.location_id);
      formData.append("platform", ticket.platform_id);
      formData.append("priority", ticket.priority_id);
      formData.append("category", ticket.category_id);
      formData.append("subcategory", ticket.subcategory_id);
      formData.append("entity", ticket.entity_id || "");
      formData.append("title", ticket.title);
      formData.append("description", ticket.description);
      formData.append("assigned_to", ticket.assigned_to || "");
      newFiles.forEach((file) => {
        formData.append("documents", file);
      });

      formData.append("status", CANCELLED_STATUS_ID);

      await updateTicket(ticket.id, formData);

      toast.success("Ticket cancelled successfully");
      await loadTicket();
    } catch (err) {
      console.error(err.response?.data || err);
      toast.error("Failed to cancel ticket");
    } finally {
      setSaving(false);
    }
  };

  const CANCELLED_STATUS_ID = 154;

  const fetchTicketMessages = async (ticketNo, senderId, receiverId) => {
    try {
      const allMessages = await fetchMessages();

      const filtered = allMessages.filter((msg) =>
        Number(msg.ticket_no) === Number(ticketNo) &&
        (
          (Number(msg.sender) === Number(senderId) && Number(msg.receiver) === Number(receiverId)) ||
          (Number(msg.sender) === Number(receiverId) && Number(msg.receiver) === Number(senderId))
        )
      );

      console.log("Filtered messages for ticket", ticketNo, ":", filtered); // Debug

      return filtered || [];
    } catch (err) {
      console.error("Error loading ticket messages:", err);
      toast.error("Failed to load messages");
      return [];
    }
  };


  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>;
  if (error || !ticket) return <Box sx={{ p: 3 }}><Typography color="error">{error || "Ticket not found"}</Typography></Box>;

  const priorityColors = {
    "Critical": "#D32F2F", "Very High": "#E53935", "High": "#FB8C00",
    "Medium": "#FDD835", "Low": "#43A047", "Very Low": "#1E88E5"
  };

  const disabledFieldSx = {
    "& .MuiInputBase-input.Mui-disabled": {
      color: "#1f1f1f",
      WebkitTextFillColor: "#1f1f1f",
      fontWeight: 600,
    },
    "& .MuiOutlinedInput-root": { borderRadius: 3 },
  };

  return (
    <Box sx={{ p: 3, background: "#f5f6fa" }}>
      <Card sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography fontSize={30} fontWeight={600}>Ticket #{ticket.id}</Typography>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              {!isEditMode && ticket?.status === "New" && isRequester && (
                <IconButton
                  onClick={() => setIsEditMode(true)}
                  sx={{
                    bgcolor: "primary.light",
                    color: "white",
                    "&:hover": { bgcolor: "primary.main" },
                  }}
                  title="Edit Ticket"
                >
                  <EditIcon />
                </IconButton>
              )}
              <Chip
                label={ticket.status}
                size="small"
                sx={{
                  fontSize: "1rem", py: 2.5, px: 3, fontWeight: 800,
                  backgroundColor:
                    ticket.status === "New"
                      ? "#3182CE"
                      : ticket.status === "Approved"
                        ? "#2F855A"
                        : ticket.status === "Rejected"
                          ? "#C53030"
                          : "#718096",
                  color: "#fff",
                }}
              />
              <Chip label={ticket.priority} sx={{
                fontWeight: 800, fontSize: "1rem", py: 2.5, px: 3,
                background: priorityColors[ticket.priority] || "#666", color: "white",
              }} />
            </Box>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Grid container spacing={2}>
            {[
              { label: "Type", value: ticket.type },
              { label: "Department", value: ticket.department },
              { label: "Location", value: ticket.location },
              { label: "Platform", value: ticket.platform },
              { label: "Category", value: ticket.category },
              { label: "Subcategory", value: ticket.subcategory },
              { label: "Priority", value: ticket.priority },
            ].map((item, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                <Typography fontWeight={600} sx={{ mb: 1 }}>{item.label}</Typography>
                <TextField fullWidth size="small" value={item.value || "-"} disabled sx={disabledFieldSx} />
              </Grid>
            ))}
            {/* Assign To Field */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Typography fontWeight={600} sx={{ mb: 1 }}>Assign To</Typography>
              {isEditMode && isAdmin ? (
                <>
                  <Autocomplete
                    multiple
                    options={[{ label: 'User', type: 'user' }, { label: 'Group', type: 'group' }]}
                    getOptionLabel={(option) => option.label}
                    value={selectionTypes.map(type => ({ label: type === 'user' ? 'User' : 'Group', type }))}
                    onChange={(_, newValue) => {
                      const types = newValue.map(v => v.type);
                      setSelectionTypes(types);
                      if (!types.includes('user')) setSelectedUsers([]);
                      if (!types.includes('group')) setSelectedGroups([]);
                    }}
                    renderInput={(params) => (
                      <TextField {...params} placeholder="Select User/Group" size="small" sx={{ mb: 1, "& .MuiOutlinedInput-root": { borderRadius: 3 }, }} />
                    )}
                  />
                  {selectionTypes.includes('user') && (
                    <Autocomplete
                      multiple
                      options={allUsers}
                      getOptionLabel={(u) => `${u.name || u.email} (${u.email})`}
                      value={selectedUsers}
                      onChange={(_, v) => setSelectedUsers(v)}
                      renderInput={(params) => (
                        <TextField {...params} placeholder="Select Users" size="small" sx={{ mb: 1, "& .MuiOutlinedInput-root": { borderRadius: 3 }, }} />
                      )}
                    />
                  )}
                  {selectionTypes.includes('group') && (
                    <Autocomplete
                      multiple
                      options={watcherGroups}
                      getOptionLabel={(g) => g.name}
                      value={selectedGroups}
                      onChange={(_, v) => setSelectedGroups(v)}
                      renderInput={(params) => (
                        <TextField {...params} placeholder="Select Groups" size="small" sx={{ mb: 1, "& .MuiOutlinedInput-root": { borderRadius: 3 }, }} />
                      )}
                    />
                  )}
                </>
              ) : (
                <TextField
                  fullWidth
                  size="small"
                  value={
                    ticket.assignees_detail?.length > 0
                      ? ticket.assignees_detail.map(u => u.name || u.email).join(', ')
                      : ticket.assigned_groups_detail?.length > 0
                        ? ticket.assigned_groups_detail.map(g => g.name).join(', ')
                        : 'Unassigned'
                  }
                  disabled
                  sx={disabledFieldSx}
                />
              )}
              {/* Show who assigned (Admin name) */}
              <Typography variant="caption" sx={{ mt: 1, display: "block", color: "text.secondary" }}>
                Assigned by: <strong>{currentUserName}</strong>
              </Typography>
            </Grid>
          </Grid>
          <Box sx={{ mt: 3 }}>
            <Typography fontWeight={600} sx={{ mb: 1 }}>Title</Typography>
            <TextField
              fullWidth
              size="small"
              value={ticket.title}
              onChange={(e) =>
                setTicket((prev) => ({ ...prev, title: e.target.value }))
              }
              disabled={!isEditMode || !isRequester}
              sx={disabledFieldSx}
            />
          </Box>
          <Box sx={{ mt: 3 }}>
            <Typography fontWeight={600} sx={{ mb: 1 }}>Description</Typography>
            <TextField
              multiline
              rows={4}
              fullWidth
              value={ticket.description}
              disabled={!isEditMode || !isRequester}
              onChange={(e) =>
                setTicket((prev) => ({ ...prev, description: e.target.value }))
              }
              sx={disabledFieldSx}
            />
          </Box>

          {isEditMode && isRequester && (
            <Box sx={{ mt: 3 }}>
              <Typography fontWeight={600}>Attachments</Typography>
              <Button
                variant="contained"
                component="label"
                sx={{ mt: 1 }}
              >
                Choose Files ({newFiles.length})
                <input
                  type="file"
                  hidden
                  multiple
                  onChange={(e) => setNewFiles(Array.from(e.target.files))}
                />
              </Button>
            </Box>
          )}

          {newFiles.length > 0 && isEditMode && isRequester && (
            <Stack direction="row" spacing={2} sx={{ mt: 2, flexWrap: "wrap" }}>
              {newFiles.map((file, i) => (
                <Box key={i} sx={{ width: 120, textAlign: "center", position: "relative" }}>

                  {/* Remove button */}
                  <IconButton
                    size="small"
                    onClick={() =>
                      setNewFiles((prev) => prev.filter((_, idx) => idx !== i))
                    }
                    sx={{
                      position: "absolute",
                      top: -8,
                      right: -8,
                      bgcolor: "error.main",
                      color: "#fff",
                      "&:hover": { bgcolor: "error.dark" },
                    }}
                  >
                    ✕
                  </IconButton>

                  {isImage(file.name) ? (
                    <Box
                      component="img"
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      sx={{
                        width: "100%",
                        height: 80,
                        objectFit: "cover",
                        borderRadius: 2,
                      }}
                    />
                  ) : (
                    <Typography fontSize="0.75rem">📄 {file.name}</Typography>
                  )}
                </Box>
              ))}
            </Stack>
          )}

          {ticket.files?.length > 0 && (
            <Box sx={{ my: 3 }}>
              <Typography variant="overline" sx={{ fontWeight: 700 }}>
                Attachments
              </Typography>

              <Stack direction="row" spacing={2} sx={{ mt: 1, flexWrap: "wrap" }}>
                {ticket.files.map((f, i) => {
                  const name = f.file?.split("/").pop();
                  return (
                    <Box key={i} sx={{ width: 120, textAlign: "center" }}>
                      {isImage(name) ? (
                        <Box
                          component="img"
                          src={f.file}
                          alt={name}
                          sx={{ width: "100%", height: 80, objectFit: "cover", borderRadius: 2 }}
                        />
                      ) : (
                        <Button
                          href={f.file}
                          target="_blank"
                          size="small"
                          variant="outlined"
                        >
                          {name || "File"}
                        </Button>
                      )}
                    </Box>
                  );
                })}
              </Stack>
            </Box>
          )}

          {ticket.files?.length > 0 && (
            <Box sx={{ my: 3 }}>
              <Typography variant="overline" sx={{ color: "#667eea", fontWeight: 700 }}>Attachments</Typography>
              <Stack spacing={1} sx={{ mt: 1 }}>
                {ticket.files.map((f, i) => (
                  <Button key={i} href={f.file || f.url} target="_blank" variant="outlined" size="small">
                    {f.file?.split('/').pop() || `File ${i + 1}`}
                  </Button>
                ))}
              </Stack>
            </Box>
          )}

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, alignItems: "center", mt: 2 }}>
            {isEditMode ? (
              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                <Button
                  variant="outlined"
                  color="error"
                  sx={{ borderRadius: 3 }}
                  onClick={() => {
                    setIsEditMode(false);
                    setNewFiles([]);
                    loadTicket();
                  }}
                >
                  Cancel
                </Button>

                <Button
                  variant="contained"
                  color="success"
                  sx={{ borderRadius: 3 }}
                  onClick={() => setOpenConfirm(true)}
                >
                  Save
                </Button>
              </Box>
            ) : (
              <Button variant="contained" color="info" sx={{ borderRadius: 3 }} onClick={handleChatDrawerOpen}>Follow up</Button>
            )}
            {ticket?.status === "New" && isRequester && !isEditMode && (
              <Button color="error" variant="outlined" sx={{ borderRadius: 3 }} onClick={handleCancelTicket}>Cancel Ticket</Button>
            )}
            <Button variant="contained" onClick={handleBackTicket} color="info" sx={{ borderRadius: 3 }}>Back</Button>
          </Box>
        </CardContent>
      </Card>

      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>Confirm Save</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to save the changes to this ticket?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSaveChanges}
            disabled={saving}
          >
            {saving ? "Saving..." : "Confirm"}
          </Button>
        </DialogActions>
      </Dialog>

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
          {/* <Box sx={{ p: 2, bgcolor: "primary.main", color: "white", display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton onClick={() => setShowFollowUpChat(false)} sx={{ color: "white" }}>
              <CloseIcon />
            </IconButton>

            <Box>
              <Typography variant="h6" sx={{ color: "white" }}>
                Ticket #{currentChatTicket?.id}
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {currentChatTicket?.title || "No Title"}
              </Typography>
              <Typography variant="caption" sx={{ color: "white" }}>
                {currentChatTicket?.description}
              </Typography>
            </Box>
          </Box> */}
          <Box sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 2,
            borderBottom: 1,
            borderColor: "divider",
            bgcolor: "primary.main",
            color: "white"
          }}>
            <Box>
              <Typography variant="h6" sx={{ color: "white" }}>
                Ticket #{currentChatTicket?.id}
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "white" }}>
                {currentChatTicket?.title || "No Title"}
              </Typography>
              <Typography variant="caption" sx={{ color: "white", opacity: 0.9 }}>
                {currentChatTicket?.description}
              </Typography>
            </Box>

            {/* Close Button */}
            <IconButton onClick={handleChatDrawerClose}
             sx={{ color: "white" }}>
              <CloseIcon />
            </IconButton>
          </Box>

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

          <Box sx={{ flex: 1 }}>
            {chatTab === 0 && (
              // Follow-up Tab: Chat Messages
              <Box sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%"
              }}>

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
                          const isFromCurrentUser = msg.sender == currentUserId;;

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

                <Box sx={{
                  p: 2,
                  borderTop: 1,
                  borderColor: "divider",
                  bgcolor: "background.default"
                }}>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <TextField
                      fullWidth
                      size="small"
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

export default ApprovalPage;