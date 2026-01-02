// import { useState, useEffect, useMemo } from "react";
// import { useTheme } from "@mui/material/styles";
// import { Box, Card, CardContent, Typography, Grid, TextField, Button, Table, TableHead, TableRow, TableCell, TableBody, TableContainer, useMediaQuery, Autocomplete, Stack, Pagination, Tooltip, IconButton, Icon, Drawer, CircularProgress, Divider, Chip, Avatar, Tabs, Tab } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import VisibilityIcon from '@mui/icons-material/Visibility';
// import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
// import CloseIcon from '@mui/icons-material/Close';
// import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
// import SecurityIcon from '@mui/icons-material/Security';
// import NewReleasesIcon from '@mui/icons-material/NewReleases';
// import DoneAllIcon from '@mui/icons-material/DoneAll';
// import CancelIcon from '@mui/icons-material/Cancel';
// import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
// import LockIcon from '@mui/icons-material/Lock';
// import { Chat as ChatIcon, Send as SendIcon, } from "@mui/icons-material";
// import { toast } from "react-toastify";
// import {fetchMessages, sendMessage, getTicketDetails, updateTicket} from "../../Api";

// const RequestTabs = ({ userStatus }) => {

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
//         Cancelled: [],
//         clarification_applied: [],
//         clarification_required: [],
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
//     const [chatTab, setChatTab] = useState(0); 
//     console.log("chat", chatTab);
    
//     // 0: Follow-up (Chat), 1: Solution
//     // Solved ticket solution states
//     const [isSolvedTicket, setIsSolvedTicket] = useState(false);
//     const [solutionText, setSolutionText] = useState("");
//     const [isResolved, setIsResolved] = useState(false);
//     const [isApproved, setIsApproved] = useState(false);

//     const [isProtected, setIsProtected] = useState(false);
//     console.log("protected???", isProtected);
    
//     const [revealedMessages, setRevealedMessages] = useState(new Set());
//     const [myProtectedMessages, setMyProtectedMessages] = useState({});
//     const [clarificationText, setClarificationText] = useState("");
//     const [clarificationSent, setClarificationSent] = useState(false);
//     const [sendingClarification, setSendingClarification] = useState(false);
    
//     // useEffect(() => {
//     //     if (userStatus) {
//     //         setTickets({
//     //             new_assigned: Array.isArray(userStatus.new_assigned_tickets) ? userStatus.new_assigned_tickets : [],
//     //             solved: Array.isArray(userStatus.solved_tickets) ? userStatus.solved_tickets : [],
//     //             closed: Array.isArray(userStatus.closed_tickets) ? userStatus.closed_tickets : [],
//     //             Cancelled: Array.isArray(userStatus.cancelled_tickets) ? userStatus.cancelled_tickets : [],
//     //             clarification_required: Array.isArray(userStatus.clarification_required) ? userStatus.clarification_required : [],
//     //             clarification_applied: Array.isArray(userStatus.clarification_applied) ? userStatus.clarification_applied : [],
//     //         });
//     //     }
//     // }, [userStatus]);
//     useEffect(() => {
//     if (userStatus) {
//         setTickets({
//             new_assigned: Array.isArray(userStatus.new_assigned_tickets) ? userStatus.new_assigned_tickets : [],
//             solved: Array.isArray(userStatus.solved_tickets) ? userStatus.solved_tickets : [],
//             closed: Array.isArray(userStatus.closed_tickets) ? userStatus.closed_tickets : [],
//             Cancelled: Array.isArray(userStatus.cancelled_tickets) ? userStatus.cancelled_tickets : [],
//             clarification_required: Array.isArray(userStatus.clarification_required_tickets) 
//                 ? userStatus.clarification_required_tickets 
//                 : [],
//             clarification_applied: Array.isArray(userStatus.clarification_applied_tickets) 
//                 ? userStatus.clarification_applied_tickets 
//                 : [],
//         });
//     }
// }, [userStatus]);
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
//             label: "New",
//             color: "warning",
//             icon: <NewReleasesIcon />,
//             count: userStatus?.new_assigned || 0,
//             description: "Tickets recently assigned to you"
//         },
//         {
//             id: "pending",
//             label: "Processing",
//             color: "warning",
//             icon: <AccessTimeFilledIcon />,
//             //count: userStatus?.new_assigned || 0,
//             count: 0,
//             description: "Tickets recently assigned to you"
//         },
//         {
//             id: "solved",
//             label: "Resolved",
//             color: "success",
//             icon: <DoneAllIcon />,
//             count: userStatus?.solved || 0,
//             description: "Tickets you have resolved"
//         },
//         {
//             id: "Cancelled",  // ← Change from "cancel" to "Cancelled"
//             label: "Cancel",
//             color: "error",
//             icon: <CancelIcon />,
//             count: userStatus?.cancelled || 0,
//             description: "Tickets recently assigned to you"
//         },
//         {
//             id: "closed",
//             label: "Closed",
//             color: "info",
//             icon: <LockIcon />,
//             count: userStatus?.closed || 0,
//             description: "Tickets that are completed"
//         },
//         { 
//             id: "clarification_applied",
//             label: "Clar Supplied", 
//             color: "error", 
//             icon: <CancelIcon sx={{ fontSize: { xs: 25, sm: 18, md: 25 } }} />, 
//             count: userStatus?.clarification_applied || 0,
//         },
//         { 
//             id: "clarification_required", 
//             label: "Clar Required", 
//             color: "error", 
//             icon: <CancelIcon sx={{ fontSize: { xs: 25, sm: 18, md: 25 } }} />, 
//             count: userStatus?.clarification_required || 0,
//         },
//     ];

//     // const selectedTickets = tickets[selectedType] || [];
//     // const departmentList = useMemo(
//     //     () => [...new Set(selectedTickets.map((row) => row.department_detail?.field_name).filter(Boolean))],
//     //     [selectedTickets]
//     // );

//     const selectedTickets = useMemo(() => {
//         const ticketsForType = tickets[selectedType];
//         return Array.isArray(ticketsForType) ? ticketsForType : [];
//     }, [tickets, selectedType]);

//     const departmentList = useMemo(() => {
//         if (!Array.isArray(selectedTickets)) return [];
//         const departments = selectedTickets
//             .map((row) => row?.department_detail?.field_name)
//             .filter(Boolean);
//         return [...new Set(departments)];
//     }, [selectedTickets]);

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
//         new_assigned: "NEW ASSIGNED TICKETS (MY REQUEST)",
//         pending: "PENDING TICKETS (MY REQUEST)",
//         solved: "SOLVED TICKETS (MY REQUEST)",
//         cancel: "CANCEL TICKETS (MY REQUEST)",
//         closed: "CLOSED TICKETS (MY REQUEST)",
//         clarification_applied : "Clarification Supplied Ticket",
//         clarification_required : "Clarification Required Ticket"
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
//             // toast.error("Failed to load messages");
//             return [];
//         }
//     };

//     // const sendFollowUpMessageHandler = async (messageText) => {
//     //     if (!messageText.trim()) {
//     //         toast.error("Message cannot be empty");
//     //         return;
//     //     }

//     //     if (!currentChatTicket?.id) {
//     //         toast.error("No ticket selected");
//     //         return;
//     //     }
//     //     if (!assignee?.id) {
//     //         toast.error("Assignee not loaded");
//     //         return;
//     //     }
//     //     if (!currentUserId) {
//     //         toast.error("User not authenticated");
//     //         return;
//     //     }
//     //     const receiverId = assignee.id;
//     //     setSendingFollowUpMessage(true);
//     //     try {
//     //         const payload = {
//     //             sender: currentUserId, // Explicitly include sender (logged-in user - ticket creator)
//     //             receiver: receiverId,
//     //             ticket_no: currentChatTicket.id,
//     //             message: messageText.trim(),
//     //             protected: isProtected,
//     //         };
//     //         const resData = await sendMessage(payload);
//     //         const newMessage = {
//     //             ...resData,
//     //             sender: currentUserId,
//     //             createdon: new Date().toISOString(),
//     //         };

//     //         const message = await fetchMessages();
//     //         const ticketMsgs = message.filter(msg => msg.ticket_no == currentChatTicket.id);
//     //         setFollowUpChats(ticketMsgs.sort((a,b) => new Date(a.createdon) - new Date(b.createdon)));

//     //         setNewFollowUpMessage("");
//     //         setIsProtected(false);
//     //         toast.success(isProtected ? "Protected message sent!" : "Message sent successfully!");
//     //     } catch (err) {
//     //         toast.error("Failed to send message");
//     //         console.error("Error sending message:", err);
//     //     } finally {
//     //         setSendingFollowUpMessage(false);
//     //     }
//     // };

//     // const handleResolveSolution = () => {
//     //     // TODO: Call API to resolve solution
//     //     setIsResolved(true);
//     //     toast.success("Solution resolved!");
//     // };

//     // const sendFollowUpMessageHandler = async (text) => {
//     //     if (!text.trim() || !chatRecipient?.id || !currentChatTicket?.id) {
//     //         toast.error("Cannot send message: missing details");
//     //         return;
//     //     }
 
//     //     const receiverId = chatRecipient.id;
 
//     //     setSendingFollowUpMessage(true);
//     //     try {
//     //         await sendMessage({
//     //             receiver: receiverId,
//     //             ticket_no: currentChatTicket.id,
//     //             message: text.trim(),
//     //             protected: isProtected,
//     //         });
 
//     //         // Refetch messages to show the new one
//     //         const messages = await fetchMessages();
//     //         const ticketMsgs = messages.filter(m => m.ticket_no == currentChatTicket.id);
//     //         setFollowUpChats(ticketMsgs.sort((a, b) => new Date(a.createdon) - new Date(b.createdon)));
 
//     //         setNewFollowUpMessage("");
//     //         setIsProtected(false); // Reset shield toggle
//     //         toast.success(isProtected ? "🔒 Protected message sent!" : "Message sent!");
//     //     } catch (err) {
//     //         console.error("Send error:", err);
//     //         toast.error("Failed to send message");
//     //     } finally {
//     //         setSendingFollowUpMessage(false);
//     //     }
//     // };


//     const sendFollowUpMessageHandler = async (text) => {
//         if (!text.trim()) {
//             toast.error("Message cannot be empty");
//             return;
//         }
//         if (!assignee?.id || !currentChatTicket?.id || !currentUserId) {
//             toast.error("Cannot send message: missing details");
//             return;
//         }

//         const receiverId = assignee.id;
        
//         setSendingFollowUpMessage(true);

//         try {
//             await sendMessage({
//                 receiver: receiverId,
//                 ticket_no: currentChatTicket.id,
//                 message: text.trim(),
//                 protected: isProtected,
//             });
            
            
//             const message = await fetchMessages();
//             const ticketMsgs = message.filter(
//                 m =>
//                     m.ticket_no == currentChatTicket.id &&
//                     ((m.sender === currentUserId && m.receiver === receiverId) ||
//                     (m.sender === receiverId && m.receiver === currentUserId))
//             );
//             setFollowUpChats(ticketMsgs.sort((a, b) => new Date(a.createdon) - new Date(b.createdon)));

//             setNewFollowUpMessage("");
//             toast.success(isProtected ? "Protected message sent!" : "Message sent!");
//         } catch (err) {
//             console.error("Send error:", err);
//             toast.error("Failed to send message");

//             if (newMessageId) {
//                 setFollowUpChats(prev => prev.filter(m => m.id !== newMessageId));
//                 setMyProtectedMessages(prev => {
//                     const copy = { ...prev };
//                     delete copy[newMessageId];
//                     return copy;
//                 });
//             }
//         } finally {
//             setSendingFollowUpMessage(false);
//         }
//     };

//     const handleResolveSolution = async () => {
//         if (!currentChatTicket?.id) {
//             toast.error("No ticket selected");
//             return;
//         }

//         let currentTicketData = {};
//         try {
//             const ticketDetails = await getTicketDetails(currentChatTicket.id);
//             currentTicketData = ticketDetails.ticket || ticketDetails;
//         } catch (err) {
//             toast.error("Could not fetch ticket details");
//             return;
//         }

//         // try {
//         //     const ticketNoStr = String(currentChatTicket.id);

//         //     const assigneesDetail = currentTicketData.assignees_detail || [];
//         //     const assignedGroupsDetail = currentTicketData.assigned_groups_detail || [];

//         //     const assigneeEmails = assigneesDetail.map(u => u.email).filter(Boolean);
//         //     const assignedGroupIds = assignedGroupsDetail.map(g => g.id).filter(Boolean);

//         //     const assignedToType = [];
//         //     if (assigneeEmails.length > 0) assignedToType.push('user');
//         //     if (assignedGroupIds.length > 0) assignedToType.push('group');

//         //     const categoryId = currentTicketData.category || currentTicketData.category_detail?.id;

//         //     const payload = {
//         //         title: currentTicketData.title || "",
//         //         description: currentTicketData.description || "",
//         //         category: categoryId,
//         //         status: "41", // ← NEW (or use another ID like "Resolved" if you have one)
//         //         assigned_to_type: assignedToType,
//         //         assignee: assigneeEmails,
//         //         assigned_group: assignedGroupIds,
//         //         resolved_status: "yes" // optional
//         //     };

//         //     const result = await updateTicket(ticketNoStr, payload);
//         //     if (!result.success) throw new Error(result.error || "Failed");

//         //     toast.success("Solution resolved! Ticket status changed to New.");

//         //     // Move ticket from solved → new_assigned (or wherever "New" tickets appear)
//         //     setTickets(prev => {
//         //         const ticket = prev.solved.find(t => t.ticket_no == currentChatTicket.id);
//         //         if (!ticket) return prev;

//         //         // Update status display locally
//         //         ticket.status_detail = { field_values: "New" };

//         //         return {
//         //             ...prev,
//         //             solved: prev.solved.filter(t => t.ticket_no != currentChatTicket.id),
//         //             new_assigned: [ticket, ...prev.new_assigned]
//         //         };
//         //     });

//         //     setIsResolved(true);
//         //     setShowFollowUpChat(false);
//         //     setSelectedType("new_assigned"); // or "solved" if you keep it there

//         //     await sendFollowUpMessageHandler("I have resolved the solution. Ticket reopened as New if further action needed.");

//         // } catch (err) {
//         //     console.error(err);
//         //     toast.error("Failed to resolve solution");
//         // }
//         try {
//             const ticketNoStr = String(currentChatTicket.id);

//             const assignedUsers =
//                 currentTicketData.assignees_detail ||
//                 currentTicketData.assigned_users ||
//                 [];

//             const assignedGroups =
//                 currentTicketData.assigned_groups_detail ||
//                 currentTicketData.assigned_groups ||
//                 [];

//             const formData = new FormData();

//             // BASIC FIELDS
//             formData.append("title", currentTicketData.title || "");
//             formData.append("description", currentTicketData.description || "");
//             formData.append("category", currentTicketData.category || currentTicketData.category_detail?.id || "");

//             // STATUS (New)
//             formData.append("status", "41"); // New
//             formData.append("resolved_status", "yes");

//             //ASSIGNED USERS
    
//             let assignedTypeIndex = 0;

//             assignedUsers.forEach((user, index) => {
//                 if (user?.email) {
//                 formData.append(`assignee[${index}]`, user.email);
//                 }
//             });

//             if (assignedUsers.length > 0) {
//                 formData.append(`assigned_to_type[${assignedTypeIndex}]`, "user");
//                 assignedTypeIndex++;
//             }

//             //ASSIGNED GROUPS
    
//             assignedGroups.forEach((group, index) => {
//                 if (group?.id) {
//                 formData.append(`assigned_group[${index}]`, group.id);
//                 }
//             });

//             if (assignedGroups.length > 0) {
//                 formData.append(`assigned_to_type[${assignedTypeIndex}]`, "group");
//             }

//             const result = await updateTicket(ticketNoStr, formData);
//             if (!result.success) throw new Error(result.error || "Failed");

//             toast.success("Solution resolved! Ticket status changed to New.");

//             // Update UI
//             setTickets(prev => {
//                 const ticket = prev.solved.find(
//                 t => t.ticket_no == currentChatTicket.id
//                 );
//                 if (!ticket) return prev;

//                 ticket.status_detail = { field_values: "New" };

//                 return {
//                 ...prev,
//                 solved: prev.solved.filter(
//                     t => t.ticket_no != currentChatTicket.id
//                 ),
//                 new_assigned: [ticket, ...prev.new_assigned]
//                 };
//             });

//             setIsResolved(true);
//             setShowFollowUpChat(false);
//             setSelectedType("new_assigned");

//             await sendFollowUpMessageHandler(
//                 "I have resolved the solution. Ticket reopened as New if further action needed."
//             );

//         } catch (err) {
//         console.error(err);
//         toast.error("Failed to resolve solution");
//         }
//     };
//     // const handleApproveSolution = () => {
//     //     // TODO: Call API to approve solution
//     //     setIsApproved(true);
//     //     toast.success("Solution approved!");
//     // };
//    const handleApproveSolution = async () => {
//         if (!currentChatTicket?.id) {
//             toast.error("No ticket selected");
//             return;
//         }

//         // Get fresh ticket details to preserve current data
//         let currentTicketData = {};
//         try {
//             const ticketDetails = await getTicketDetails(currentChatTicket.id);
//             currentTicketData = ticketDetails.ticket || ticketDetails;
//         } catch (err) {
//             console.error("Failed to fetch latest ticket details:", err);
//             toast.error("Could not fetch ticket details");
//             return;
//         }

//         try {
//             const ticketNoStr = String(currentChatTicket.id);
//             console.log("Updating ticket to Closed:", ticketNoStr);

//             const assignedUsers =
//                 currentTicketData.assignees_detail ||
//                 currentTicketData.assigned_users ||
//                 [];

//             const assignedGroups =
//                 currentTicketData.assigned_groups_detail ||
//                 currentTicketData.assigned_groups ||
//                 [];

//             const formData = new FormData();

//             // BASIC FIELDS
//             formData.append("title", currentTicketData.title || "");
//             formData.append("description", currentTicketData.description || "");
//             formData.append("category", currentTicketData.category || currentTicketData.category_detail?.id || "");

//             // CLOSED STATUS
//             formData.append("status", "46"); // Closed

//             //ASSIGNEES
//             let assignedTypeIndex = 0;

//             assignedUsers.forEach((user, index) => {
//                 if (user?.email) {
//                 formData.append(`assignee[${index}]`, user.email);
//                 }
//             });

//             if (assignedUsers.length > 0) {
//                 formData.append(`assigned_to_type[${assignedTypeIndex}]`, "user");
//                 assignedTypeIndex++;
//             }

//             //  GROUPS
//             assignedGroups.forEach((group, index) => {
//                 if (group?.id) {
//                 formData.append(`assigned_group[${index}]`, group.id);
//                 }
//             });

//             if (assignedGroups.length > 0) {
//                 formData.append(`assigned_to_type[${assignedTypeIndex}]`, "group");
//             }

//             console.log("Approve Solution → Closing ticket (FormData):", [
//                 ...formData.entries(),
//             ]);

//             const result = await updateTicket(ticketNoStr, formData);
//             // if (!result.success) {
//             //     throw new Error(result.error || "Failed to close ticket");
//             // }

//             toast.success("Solution approved and ticket closed successfully!");

//             // UI updates
//             setIsApproved(true);
//             setShowFollowUpChat(false);
//             loadData();
//             setSelectedType("closed");
//         } catch (err) {
//         console.error("Error closing ticket on approve:", err);
//         // toast.error("Failed to close ticket");
//         }
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

//     const handleSendClarification = async () => {
//         if (!clarificationText.trim()) return;

//         setSendingClarification(true);
//         try {
//             await sendMessage({
//                 receiver: currentUserId === assignee?.id ? currentChatTicket?.requested_by : assignee?.id, // Send to requester if assignee is sending
//                 ticket_no: currentChatTicket.id,
//                 message: `[CLARIFICATION REQUEST]\n\n${clarificationText.trim()}`,
//                 protected: false, // or true if you want it private
//             });

//             // Optional: Add to chat as a visible message
//             await sendFollowUpMessageHandler(`[CLARIFICATION REQUEST] ${clarificationText.trim()}`);

//             setClarificationText("");
//             setClarificationSent(true);
//             toast.success("Clarification request sent!");

//             // Auto switch back to Follow-up tab
//             setChatTab(0);

//             // Reset alert after 5 seconds
//             setTimeout(() => setClarificationSent(false), 5000);
//         } catch (err) {
//             toast.error("Failed to send clarification");
//         } finally {
//             setSendingClarification(false);
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
//         setClarificationText("");
//         setClarificationSent(false);
//     };

//     // const filteredRows = useMemo(() => {
//     //     return selectedTickets.filter((row) => {
//     //         const matchesSearch =
//     //             Object.values(row)
//     //                 .join(" ")
//     //                 .toLowerCase()
//     //                 .includes(search.toLowerCase());
//     //         const matchesDept = department ? row.department_detail?.field_name === department : true;
//     //         return matchesSearch && matchesDept;
//     //     });
//     // }, [selectedTickets, search, department]);
// //     const filteredRows = useMemo(() => {
// //     const searchLower = search.toLowerCase().trim();

// //     return selectedTickets.filter((row) => {
// //         const matchesDept = department 
// //             ? row.department_detail?.field_name === department 
// //             : true;

// //         if (!searchLower) return matchesDept;

// //         const ticketNoStr = String(row.ticket_no || "").toLowerCase();
// //         if (ticketNoStr.includes(searchLower)) return true;

// //         if (row.title?.toLowerCase().includes(searchLower)) return true;
// //         if (row.description?.toLowerCase().includes(searchLower)) return true;

// //         return false;
// //     }).filter(row => {
// //         return department ? row.department_detail?.field_name === department : true;
// //     });
// // }, [selectedTickets, search, department]);

// const filteredRows = useMemo(() => {
//     const searchLower = search.toLowerCase().trim();
 
//     if (!searchLower && !department) {
//         return selectedTickets;
//     }
 
//     return selectedTickets.filter((row) => {
//         // Department filter (separate dropdown)
//         const matchesDept = department
//             ? row.department_detail?.field_name === department
//             : true;
 
//         if (!searchLower) return matchesDept;
 
//         // 1. Ticket Number
//         if (String(row.ticket_no || "").toLowerCase().includes(searchLower)) return true;
 
//         // 2. Title
//         if (row.title?.toLowerCase().includes(searchLower)) return true;
 
//         // 3. Description
//         if (row.description?.toLowerCase().includes(searchLower)) return true;
 
//         // 4. Status
//         if (row.status_detail?.field_values?.toLowerCase().includes(searchLower)) return true;
 
//         // 5. Priority
//         if (row.priority_detail?.field_values?.toLowerCase().includes(searchLower)) return true;
 
//         // 6. Category
//         if (row.category_detail?.category_name?.toLowerCase().includes(searchLower)) return true;
 
//         // 7. Subcategory
//         if (row.subcategory_detail?.subcategory_name?.toLowerCase().includes(searchLower)) return true;
 
//         // 8. Department
//         if (row.department_detail?.field_name?.toLowerCase().includes(searchLower)) return true;
 
//         // 9. Location
//         if (row.location_detail?.field_name?.toLowerCase().includes(searchLower)) return true;
 
//         // 10. Requested By (email or name)
//         if (row.requested_detail?.email?.toLowerCase().includes(searchLower)) return true;
//         if (row.requested_detail?.name?.toLowerCase().includes(searchLower)) return true;
 
//         // 11. Dates (Open Date / Last Update) - match formatted or raw
//         const openDate = new Date(row.created_date).toLocaleDateString().toLowerCase();
//         const updateDate = new Date(row.updated_date).toLocaleDateString().toLowerCase();
//         if (openDate.includes(searchLower) || updateDate.includes(searchLower)) return true;
 
//         return false;
//     }).filter((row) => {
//         // Apply department filter at the end (in case user uses both search + department dropdown)
//         return department ? row.department_detail?.field_name === department : true;
//     });
// }, [selectedTickets, search, department]);

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
//         <Box sx={{ width: "100%", mb:2 }}>
//             <Grid container spacing={1} sx={{ mb: 4 }}>
//                 {statusCards.map((item) => (
//                     <Grid size={{ xs: 12, sm: 6, md: 4, lg: 1.7 }} key={item.id}>
//                         <Card
//                             onClick={() => handleCardClick(item.id)}
//                             sx={{
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
//                         >
//                             <CardContent sx={{ display: "flex", gap: 2, alignItems: "center", "&: last-child" : {pt:1},}}>
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
//                                     mb: 1,
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
//                                                         {/* Header */}
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
//                                                         <Typography fontWeight={600} mt={1} color="#2D3748">
//                                                             {t.title}
//                                                         </Typography>
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
//                                                                                 maxWidth:200,
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
//                                                                                 maxWidth: 200,
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
                                                                                    
// </Box>
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
//                     <Box sx={{ p: 2, bgcolor: "primary.main", color: "white", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//                         <Box>
//                             <Typography variant="body2">Ticket #{currentChatTicket?.id}</Typography>
//                             <Typography variant="body2">{currentChatTicket?.title}</Typography>
//                             <Typography variant="caption" sx={{ color: "white" }}>{currentChatTicket?.description}</Typography>
//                         </Box>
//                         <IconButton onClick={() => setShowFollowUpChat(false)} sx={{ color: "white" }}>
//                             <CloseIcon />
//                         </IconButton>
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
//                             <Tab label="Clarification Supplied" icon={<HelpOutlineIcon />} /> 
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
//                                                     const isMe = Number(msg.sender) === Number(currentUserId);
//                                                     const isProtected = msg.protected === true;
//                                                     const messageId = msg.id;
//                                                     const isRevealed = revealedMessages.has(messageId);
//                                                     const canViewDecrypted = Number(msg.sender) === Number(currentUserId) || Number(msg.receiver) === Number(currentUserId);

//                                                     const toggleReveal = () => {
//                                                         if (!canViewDecrypted) return;
//                                                         setRevealedMessages(prev => {
//                                                             const newSet = new Set(prev);
//                                                             if (newSet.has(messageId)) {
//                                                                 newSet.delete(messageId);
//                                                             } else {
//                                                                 newSet.add(messageId);
//                                                             }
//                                                             return newSet;
//                                                         });
//                                                     };

//                                                     return (
//                                                         <Box
//                                                             key={msg.id || index}
//                                                             sx={{
//                                                                 display: "flex",
//                                                                 justifyContent: isMe ? "flex-end" : "flex-start",
//                                                                 mb: 2
//                                                             }}
//                                                         >
//                                                             {!isMe ? (
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
//                                                                             position: "relative",
//                                                                         }}
//                                                                     >
//                                                                         {isProtected && (
//                                                                             <SecurityIcon
//                                                                                 sx={{
//                                                                                     position: "absolute",
//                                                                                     top: -10,
//                                                                                     right: -10,
//                                                                                     fontSize: 20,
//                                                                                     bgcolor: "#4CAF50",
//                                                                                     color: "white",
//                                                                                     borderRadius: "50%",
//                                                                                     p: 0.5,
//                                                                                     boxShadow: 2,
//                                                                                 }}
//                                                                             />
//                                                                         )}
//                                                                         <Typography variant="body1" sx={{ wordBreak: "break-word" }}>
//                                                                             {(() => {
//                                                                                 if (!msg.protected) {
//                                                                                     return msg.message; // Normal message
//                                                                                 }

//                                                                                 const isSender = Number(msg.sender) === Number(currentUserId);
//                                                                                 const isReceiver = Number(msg.receiver) === Number(currentUserId);
//                                                                                 const canDecrypt = isSender || isReceiver;

//                                                                                 if (!canDecrypt) {
//                                                                                     return "*** PROTECTED MESSAGE - VISIBLE ONLY TO RECEIVER ***";
//                                                                                 }

//                                                                                 // Show real text if revealed AND we have it (from local or server)
//                                                                                 const realText = isSender 
//                                                                                     ? myProtectedMessages[msg.id] 
//                                                                                     : msg.decrypted_message; // Receiver relies on backend

//                                                                                 if (isRevealed && realText) {
//                                                                                     return realText;
//                                                                                 }

//                                                                                 // Default: show masked
//                                                                                 return msg.message || "*** PROTECTED MESSAGE - VISIBLE ONLY TO RECEIVER ***";
//                                                                             })()}
//                                                                         </Typography>
//                                                                         {/* Eye Toggle - Only for protected messages and authorized users */}
//                                                                         {msg.protected && (Number(msg.sender) === Number(currentUserId) || Number(msg.receiver) === Number(currentUserId)) && (
//                                                                             <IconButton
//                                                                                 size="small"
//                                                                                 onClick={toggleReveal}
//                                                                                 sx={{
//                                                                                     position: "absolute",
//                                                                                     bottom: 6,
//                                                                                     right: 8,
//                                                                                     color: isMe ? "white" : "inherit",
//                                                                                     opacity: 0.8,
//                                                                                     bgcolor: isMe ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)",
//                                                                                     '&:hover': {
//                                                                                         bgcolor: isMe ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.2)"
//                                                                                     }
//                                                                                 }}
//                                                                             >
//                                                                                 {isRevealed ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
//                                                                             </IconButton>
//                                                                         )}

//                                                                         <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1 }}>
//                                                                             <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "0.7rem" }}>
//                                                                                 {new Date(msg.createdon).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
//                                                                             </Typography>
//                                                                             <Typography variant="caption" sx={{ ml: 1, color: "text.primary", fontSize: "0.75rem", fontWeight: "bold" }}>
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
//                                                                             position: "relative",
//                                                                         }}
//                                                                     >
//                                                                         <Typography variant="body1" sx={{ wordBreak: "break-word" }}>
//                                                                             {isProtected && canViewDecrypted && isRevealed && msg.decrypted_message
//                                                                                 ? msg.decrypted_message
//                                                                                 : msg.message
//                                                                             }
//                                                                         </Typography>

//                                                                         {/* Eye Toggle for Sender */}
//                                                                         {isProtected && canViewDecrypted && (
//                                                                             <IconButton
//                                                                                 size="small"
//                                                                                 onClick={toggleReveal}
//                                                                                 sx={{
//                                                                                     position: "absolute",
//                                                                                     bottom: 6,
//                                                                                     right: 8,
//                                                                                     color: "white",
//                                                                                     opacity: 0.8,
//                                                                                     bgcolor: "rgba(255,255,255,0.2)",
//                                                                                     '&:hover': { bgcolor: "rgba(255,255,255,0.3)" }
//                                                                                 }}
//                                                                             >
//                                                                                 {isRevealed ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
//                                                                             </IconButton>
//                                                                         )}

//                                                                         <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1 }}>
//                                                                             <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.8)", fontSize: "0.7rem" }}>
//                                                                                 {new Date(msg.createdon).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
//                                                                             </Typography>
//                                                                             <Typography variant="caption" sx={{ mr: 1, color: "white", fontSize: "0.75rem", fontWeight: "bold" }}>
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
//                                             size="small"
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
//                                         <Tooltip title={isProtected ? "Protected mode ON" : "Send protected message"}>
//                                             <IconButton
//                                                 onClick={() => setIsProtected(true)}
//                                                 sx={{
//                                                     color: isProtected ? "white" : "success.main",
//                                                     bgcolor: isProtected ? "success.main" : "transparent",
//                                                     border: "1px solid",
//                                                     "&:hover": {
//                                                         bgcolor: isProtected ? "success.dark" : "success.light",
//                                                     },
//                                                 }}
//                                             >
//                                                 <SecurityIcon />
//                                             </IconButton>
//                                         </Tooltip>
//                                         {/* <Tooltip title={isProtected ? "Protected mode ON" : "Send protected message"}>
//                                             <IconButton
//                                                 onClick={() => setIsProtected(!isProtected)}
//                                                 sx={{
//                                                     color: isProtected ? "white" : "success.main",
//                                                     bgcolor: isProtected ? "success.main" : "transparent",
//                                                     border: "1px solid",
//                                                     "&:hover": {
//                                                         bgcolor: isProtected ? "success.dark" : "success.light",
//                                                     },
//                                                 }}
//                                             >
//                                                 <SecurityIcon />
//                                             </IconButton>
//                                         </Tooltip> */}
//                                         <IconButton
//                                             onClick={() => sendFollowUpMessageHandler(newFollowUpMessage)}
//                                             disabled={!newFollowUpMessage.trim() || sendingFollowUpMessage || !assignee}
//                                             color="primary"
//                                             sx={{ alignSelf: "flex-end",  }}
//                                         >
//                                             {sendingFollowUpMessage ? <CircularProgress size={20} /> : <SendIcon />}
//                                         </IconButton>
                                        
//                                     </Box>
//                                     {isProtected && (
//                                         <Typography variant="caption" color="success.main" sx={{ mt: 1, display: "block", textAlign: "center" }}>
//                                             <SecurityIcon fontSize="small" sx={{ verticalAlign: "middle", mr: 0.5 }} />
//                                             This message will be sent as protected
//                                         </Typography>
//                                     )}
//                                 </Box>
//                             </Box>
//                         )}
//                         {isSolvedTicket ? (
//                             (chatTab === 1 && (
//                                 // Solution Tab: Approve/Resolve Solution
//                                 <Box 
//                                     sx={{
//                                         display: "flex",
//                                         flexDirection: "column",
//                                         justifyContent: "center",
//                                         alignItems: "center",
//                                         height: "100%",
//                                         p: 4,
//                                         gap: 2,
//                                         textAlign: "center"
//                                     }}
//                                 >
//                                     <DoneAllIcon sx={{ fontSize: 64, color: "success.main" }} />
//                                     <Typography variant="h6" fontWeight={600} color="text.primary">
//                                         Solution Provided
//                                     </Typography>           
//                                     <Typography variant="body1" sx={{ mb: 3, wordBreak: "break-word", color: "text.primary" }}>
//                                         {solutionText}
//                                     </Typography>
//                                     <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
//                                         <Button
//                                             variant={isResolved ? "contained" : "outlined"}
//                                             color="success"
//                                             onClick={handleResolveSolution}
//                                             disabled={isResolved}
//                                             size="small"
//                                         >
//                                             {isResolved ? "Resolved" : "Resolve Solution"}
//                                         </Button>
//                                         <Button
//                                             variant={isApproved ? "contained" : "outlined"}
//                                             color="primary"
//                                             onClick={handleApproveSolution}
//                                             disabled={isApproved}
//                                             size="small"
//                                         >
//                                             {isApproved ? "Approved" : "Approve Solution"}
//                                         </Button>
//                                     </Box>
//                                     <Button
//                                         variant="outlined"
//                                         onClick={() => setChatTab(0)}
//                                         sx={{ mt: 1 }}
//                                     >
//                                         Back to Follow-up
//                                     </Button>
//                                 </Box>
//                             ))
//                         ) : (
//                             (chatTab === 2 && (
//                                 <Box sx={{ display: "flex", flexDirection: "column", height: "100%", p: 3 }}>
//                                     {isTicketClarificationRequired() ? (
//                                         <Box sx={{ textAlign: "center", flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
//                                             <HelpOutlineIcon sx={{ fontSize: 80, color: "warning.main", mb: 2 }} />
//                                             <Typography variant="h6" fontWeight={600}>Clarification Request Already Sent</Typography>
//                                             <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>
//                                                 Waiting for requester to respond.
//                                             </Typography>
//                                             <Button variant="outlined" onClick={() => setChatTab(0)}>
//                                                 Back to Follow-up
//                                             </Button>
//                                         </Box>
//                                     ) : isTicketSolved() ? (
//                                         <Box sx={{ textAlign: "center", flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
//                                             <DoneAllIcon sx={{ fontSize: 80, color: "success.main", mb: 2 }} />
//                                             <Typography variant="h6" fontWeight={600}>Ticket Already Solved</Typography>
//                                             <Typography color="text.secondary" sx={{ mt: 1 }}>
//                                                 Cannot request clarification on solved tickets.
//                                              </Typography>
//                                         </Box>
//                                     ) : (
//                                         <>
//                                         <Box sx={{ textAlign: "center", mb: 3 }}>
//                                             <HelpOutlineIcon sx={{ fontSize: 60, color: "warning.main", mb: 2 }} />
//                                             <Typography variant="h6" fontWeight={600}>Request Clarification</Typography>
//                                             <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
//                                                 Ask for more details if something is unclear.
//                                             </Typography>
//                                         </Box>
//                                         <TextField
//                                             multiline
//                                             rows={6}
//                                             placeholder="Please clarify the following..."
//                                             value={clarificationText}
//                                             onChange={(e) => setClarificationText(e.target.value)}
//                                             variant="outlined"
//                                             fullWidth
//                                             sx={{ mb: 3 }}
//                                             disabled={sendingClarification}
//                                         />
//                                         <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
//                                             <Button
//                                                 variant="contained"
//                                                 color="warning"
//                                                 size="large"
//                                                 startIcon={<QuestionAnswerIcon />}
//                                                 onClick={handleSendClarification}
//                                                 disabled={!clarificationText.trim() || sendingClarification}
//                                             >
//                                                 {sendingClarification ? <CircularProgress size={20} /> : "Send Request"}
//                                             </Button>
//                                             <Button variant="outlined" onClick={() => { setClarificationText(""); setChatTab(0); }} disabled={sendingClarification}>
//                                                 Cancel
//                                             </Button>
//                                         </Box>
//                                         </>
//                                     )}
//                                 </Box>
//                             ))
//                             )}
//                         {/* {chatTab === 1 && isSolvedTicket && (
                            
//                         )}
//                         {isSolvedTicket ? chatTab === 2 : chatTab === 1 && (
                            
//                         )} */}
//                     </Box>
//                 </Box>
//             </Drawer>
//         </Box >
//     );
// };
// export default RequestTabs;

// import { useState, useEffect, useMemo } from "react";
// import { useTheme } from "@mui/material/styles";
// import { Box, Card, CardContent, Typography, Grid, TextField, Button, Table, TableHead, TableRow, TableCell, TableBody, TableContainer, useMediaQuery, Autocomplete, Stack, Pagination, Tooltip, IconButton, Icon, Drawer, CircularProgress, Divider, Chip, Avatar, Tabs, Tab } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import VisibilityIcon from '@mui/icons-material/Visibility';
// import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
// import CloseIcon from '@mui/icons-material/Close';
// import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
// import SecurityIcon from '@mui/icons-material/Security';
// import NewReleasesIcon from '@mui/icons-material/NewReleases';
// import DoneAllIcon from '@mui/icons-material/DoneAll';
// import CancelIcon from '@mui/icons-material/Cancel';
// //import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
// //import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
// import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
// import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
// import LockIcon from '@mui/icons-material/Lock';
// import { Chat as ChatIcon, Send as SendIcon, } from "@mui/icons-material";
// import { toast } from "react-toastify";
// import { fetchMessages, sendMessage, getTicketDetails, updateTicket} from "../../Api";

// const RequestTabs = ({ userStatus }) => {

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
//         Cancelled: [],
//         clarification_applied: [],
//         clarification_required: [],
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
//     const [chatTab, setChatTab] = useState(0); 
//     console.log("chat", chatTab);
    
//     // 0: Follow-up (Chat), 1: Solution
//     // Solved ticket solution states
//     const [isSolvedTicket, setIsSolvedTicket] = useState(false);
//     const [solutionText, setSolutionText] = useState("");
//     const [isResolved, setIsResolved] = useState(false);
//     const [isApproved, setIsApproved] = useState(false);
//     const [clarificationRequested, setClarificationRequested] = useState(false);

//     const [isProtected, setIsProtected] = useState(false);
//     console.log("protected???", isProtected);
    
//     const [revealedMessages, setRevealedMessages] = useState(new Set());
//     const [myProtectedMessages, setMyProtectedMessages] = useState({});
//     const [clarificationText, setClarificationText] = useState("");
//     const [clarificationSent, setClarificationSent] = useState(false);
//     const [sendingClarification, setSendingClarification] = useState(false);
//     const [isConfidentialTicket, setIsConfidentialTicket] = useState(false);
    
//     // useEffect(() => {
//     //     if (userStatus) {
//     //         setTickets({
//     //             new_assigned: Array.isArray(userStatus.new_assigned_tickets) ? userStatus.new_assigned_tickets : [],
//     //             solved: Array.isArray(userStatus.solved_tickets) ? userStatus.solved_tickets : [],
//     //             closed: Array.isArray(userStatus.closed_tickets) ? userStatus.closed_tickets : [],
//     //             Cancelled: Array.isArray(userStatus.cancelled_tickets) ? userStatus.cancelled_tickets : [],
//     //             clarification_required: Array.isArray(userStatus.clarification_required) ? userStatus.clarification_required : [],
//     //             clarification_applied: Array.isArray(userStatus.clarification_applied) ? userStatus.clarification_applied : [],
//     //         });
//     //     }
//     // }, [userStatus]);
//     useEffect(() => {
//     if (userStatus) {
//         setTickets({
//             new_assigned: Array.isArray(userStatus.new_assigned_tickets) ? userStatus.new_assigned_tickets : [],
//             solved: Array.isArray(userStatus.solved_tickets) ? userStatus.solved_tickets : [],
//             closed: Array.isArray(userStatus.closed_tickets) ? userStatus.closed_tickets : [],
//             Cancelled: Array.isArray(userStatus.cancelled_tickets) ? userStatus.cancelled_tickets : [],
//             clarification_required: Array.isArray(userStatus.clarification_required_tickets) 
//                 ? userStatus.clarification_required_tickets 
//                 : [],
//             clarification_applied: Array.isArray(userStatus.clarification_applied_tickets) 
//                 ? userStatus.clarification_applied_tickets 
//                 : [],
//         });
//     }
// }, [userStatus]);
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
//             label: "New",
//             color: "warning",
//             icon: <NewReleasesIcon />,
//             count: userStatus?.new_assigned || 0,
//             description: "Tickets recently assigned to you"
//         },
//         // {
//         //     id: "pending",
//         //     label: "InProcess",
//         //     color: "warning",
//         //     icon: <AccessTimeFilledIcon />,
//         //     //count: userStatus?.new_assigned || 0,
//         //     count: 0,
//         //     description: "Tickets recently assigned to you"
//         // },
//         {
//             id: "solved",
//             label: "Resolved",
//             color: "success",
//             icon: <DoneAllIcon />,
//             count: userStatus?.solved || 0,
//             description: "Tickets you have resolved"
//         },
//         {
//             id: "Cancelled",  // ← Change from "cancel" to "Cancelled"
//             label: "Cancelled",
//             color: "error",
//             icon: <CancelIcon />,
//             count: userStatus?.cancelled || 0,
//             description: "Tickets recently assigned to you"
//         },
//         {
//             id: "closed",
//             label: "Closed",
//             color: "info",
//             icon: <LockIcon />,
//             count: userStatus?.closed || 0,
//             description: "Tickets that are completed"
//         },
//         { 
//             id: "clarification_applied",
//             label: "Clar. Supplied", 
//             color: "primary", 
//             icon: <QuestionAnswerIcon sx={{ fontSize: { xs: 25, sm: 18, md: 25 } }} />, 
//             count: userStatus?.clarification_applied || 0,
//         },
//         { 
//             id: "clarification_required", 
//             label: "Clar. Required", 
//             color: "error", 
//             icon: <HelpOutlineIcon sx={{ fontSize: { xs: 25, sm: 18, md: 25 } }} />, 
//             count: userStatus?.clarification_required || 0,
//         },
//     ];

//     // const selectedTickets = tickets[selectedType] || [];
//     // const departmentList = useMemo(
//     //     () => [...new Set(selectedTickets.map((row) => row.department_detail?.field_name).filter(Boolean))],
//     //     [selectedTickets]
//     // );

//     const selectedTickets = useMemo(() => {
//         const ticketsForType = tickets[selectedType];
//         return Array.isArray(ticketsForType) ? ticketsForType : [];
//     }, [tickets, selectedType]);

//     const departmentList = useMemo(() => {
//         if (!Array.isArray(selectedTickets)) return [];
//         const departments = selectedTickets
//             .map((row) => row?.department_detail?.field_name)
//             .filter(Boolean);
//         return [...new Set(departments)];
//     }, [selectedTickets]);

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
//         new_assigned: "New Assigned Tickets",
//         pending: "Pending Tickets",
//         solved: "Resolved Tickets",
//         cancel: "Cancelled Tickets",
//         closed: "Closed Tickets",
//         clarification_applied : "Clarification Supplied Ticket",
//         clarification_required : "Clarification Required Ticket"
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

//     // const sendFollowUpMessageHandler = async (messageText) => {
//     //     if (!messageText.trim()) {
//     //         toast.error("Message cannot be empty");
//     //         return;
//     //     }

//     //     if (!currentChatTicket?.id) {
//     //         toast.error("No ticket selected");
//     //         return;
//     //     }
//     //     if (!assignee?.id) {
//     //         toast.error("Assignee not loaded");
//     //         return;
//     //     }
//     //     if (!currentUserId) {
//     //         toast.error("User not authenticated");
//     //         return;
//     //     }
//     //     const receiverId = assignee.id;
//     //     setSendingFollowUpMessage(true);
//     //     try {
//     //         const payload = {
//     //             sender: currentUserId, // Explicitly include sender (logged-in user - ticket creator)
//     //             receiver: receiverId,
//     //             ticket_no: currentChatTicket.id,
//     //             message: messageText.trim(),
//     //             protected: isProtected,
//     //         };
//     //         const resData = await sendMessage(payload);
//     //         const newMessage = {
//     //             ...resData,
//     //             sender: currentUserId,
//     //             createdon: new Date().toISOString(),
//     //         };

//     //         const message = await fetchMessages();
//     //         const ticketMsgs = message.filter(msg => msg.ticket_no == currentChatTicket.id);
//     //         setFollowUpChats(ticketMsgs.sort((a,b) => new Date(a.createdon) - new Date(b.createdon)));

//     //         setNewFollowUpMessage("");
//     //         setIsProtected(false);
//     //         toast.success(isProtected ? "Protected message sent!" : "Message sent successfully!");
//     //     } catch (err) {
//     //         toast.error("Failed to send message");
//     //         console.error("Error sending message:", err);
//     //     } finally {
//     //         setSendingFollowUpMessage(false);
//     //     }
//     // };

//     // const handleResolveSolution = () => {
//     //     // TODO: Call API to resolve solution
//     //     setIsResolved(true);
//     //     toast.success("Solution resolved!");
//     // };

//     // const sendFollowUpMessageHandler = async (text) => {
//     //     if (!text.trim() || !chatRecipient?.id || !currentChatTicket?.id) {
//     //         toast.error("Cannot send message: missing details");
//     //         return;
//     //     }
 
//     //     const receiverId = chatRecipient.id;
 
//     //     setSendingFollowUpMessage(true);
//     //     try {
//     //         await sendMessage({
//     //             receiver: receiverId,
//     //             ticket_no: currentChatTicket.id,
//     //             message: text.trim(),
//     //             protected: isProtected,
//     //         });
 
//     //         // Refetch messages to show the new one
//     //         const messages = await fetchMessages();
//     //         const ticketMsgs = messages.filter(m => m.ticket_no == currentChatTicket.id);
//     //         setFollowUpChats(ticketMsgs.sort((a, b) => new Date(a.createdon) - new Date(b.createdon)));
 
//     //         setNewFollowUpMessage("");
//     //         setIsProtected(false); // Reset shield toggle
//     //         toast.success(isProtected ? "🔒 Protected message sent!" : "Message sent!");
//     //     } catch (err) {
//     //         console.error("Send error:", err);
//     //         toast.error("Failed to send message");
//     //     } finally {
//     //         setSendingFollowUpMessage(false);
//     //     }
//     // };

//     const sendFollowUpMessageHandler = async (text) => {
//     if (!text.trim()) {
//       toast.error("Message cannot be empty");
//       return;
//     }
//     if (!assignee?.id || !currentChatTicket?.id || !currentUserId) {
//       toast.error("Cannot send message: missing details");
//       return;
//     }

//     const receiverId = assignee.id;
//     const shouldProtect = isConfidentialTicket || isProtected;

//     setSendingFollowUpMessage(true);
//     try {
//       await sendMessage({
//         receiver: receiverId,
//         ticket_no: currentChatTicket.id,
//         message: text.trim(),
//         protected: shouldProtect,
//       });

//       const messages = await fetchMessages();
//       const ticketMsgs = messages.filter(m =>
//         m.ticket_no == currentChatTicket.id &&
//         ((m.sender === currentUserId && m.receiver === receiverId) ||
//          (m.sender === receiverId && m.receiver === currentUserId))
//       );

//       setFollowUpChats(ticketMsgs.sort((a, b) => new Date(a.createdon) - new Date(b.createdon)));
//       setNewFollowUpMessage("");

//       // Only reset manual toggle if not forced by confidential ticket
//       if (!isConfidentialTicket) {
//         setIsProtected(false);
//       }

//       toast.success(shouldProtect ? "Protected message sent!" : "Message sent!");
//     } catch (err) {
//       console.error("Send error:", err);
//       toast.error("Failed to send message");
//     } finally {
//       setSendingFollowUpMessage(false);
//     }
//   };

//     const handleResolveSolution = async () => {
//         if (!currentChatTicket?.id) {
//             toast.error("No ticket selected");
//             return;
//         }

//         let currentTicketData = {};
//         try {
//             const ticketDetails = await getTicketDetails(currentChatTicket.id);
//             currentTicketData = ticketDetails.ticket || ticketDetails;
//         } catch (err) {
//             toast.error("Could not fetch ticket details");
//             return;
//         }

//         // try {
//         //     const ticketNoStr = String(currentChatTicket.id);

//         //     const assigneesDetail = currentTicketData.assignees_detail || [];
//         //     const assignedGroupsDetail = currentTicketData.assigned_groups_detail || [];

//         //     const assigneeEmails = assigneesDetail.map(u => u.email).filter(Boolean);
//         //     const assignedGroupIds = assignedGroupsDetail.map(g => g.id).filter(Boolean);

//         //     const assignedToType = [];
//         //     if (assigneeEmails.length > 0) assignedToType.push('user');
//         //     if (assignedGroupIds.length > 0) assignedToType.push('group');

//         //     const categoryId = currentTicketData.category || currentTicketData.category_detail?.id;

//         //     const payload = {
//         //         title: currentTicketData.title || "",
//         //         description: currentTicketData.description || "",
//         //         category: categoryId,
//         //         status: "41", // ← NEW (or use another ID like "Resolved" if you have one)
//         //         assigned_to_type: assignedToType,
//         //         assignee: assigneeEmails,
//         //         assigned_group: assignedGroupIds,
//         //         resolved_status: "yes" // optional
//         //     };

//         //     const result = await updateTicket(ticketNoStr, payload);
//         //     if (!result.success) throw new Error(result.error || "Failed");

//         //     toast.success("Solution resolved! Ticket status changed to New.");

//         //     // Move ticket from solved → new_assigned (or wherever "New" tickets appear)
//         //     setTickets(prev => {
//         //         const ticket = prev.solved.find(t => t.ticket_no == currentChatTicket.id);
//         //         if (!ticket) return prev;

//         //         // Update status display locally
//         //         ticket.status_detail = { field_values: "New" };

//         //         return {
//         //             ...prev,
//         //             solved: prev.solved.filter(t => t.ticket_no != currentChatTicket.id),
//         //             new_assigned: [ticket, ...prev.new_assigned]
//         //         };
//         //     });

//         //     setIsResolved(true);
//         //     setShowFollowUpChat(false);
//         //     setSelectedType("new_assigned"); // or "solved" if you keep it there

//         //     await sendFollowUpMessageHandler("I have resolved the solution. Ticket reopened as New if further action needed.");

//         // } catch (err) {
//         //     console.error(err);
//         //     toast.error("Failed to resolve solution");
//         // }
//         try {
//             const ticketNoStr = String(currentChatTicket.id);

//             const assignedUsers =
//                 currentTicketData.assignees_detail ||
//                 currentTicketData.assigned_users ||
//                 [];

//             const assignedGroups =
//                 currentTicketData.assigned_groups_detail ||
//                 currentTicketData.assigned_groups ||
//                 [];

//             const formData = new FormData();

//             // BASIC FIELDS
//             formData.append("title", currentTicketData.title || "");
//             formData.append("description", currentTicketData.description || "");
//             formData.append("category", currentTicketData.category || currentTicketData.category_detail?.id || "");

//             // STATUS (New)
//             formData.append("status", "41"); // New
//             formData.append("resolved_status", "yes");

//             //ASSIGNED USERS
    
//             let assignedTypeIndex = 0;

//             assignedUsers.forEach((user, index) => {
//                 if (user?.email) {
//                 formData.append(`assignee[${index}]`, user.email);
//                 }
//             });

//             if (assignedUsers.length > 0) {
//                 formData.append(`assigned_to_type[${assignedTypeIndex}]`, "user");
//                 assignedTypeIndex++;
//             }

//             //ASSIGNED GROUPS
    
//             assignedGroups.forEach((group, index) => {
//                 if (group?.id) {
//                 formData.append(`assigned_group[${index}]`, group.id);
//                 }
//             });

//             if (assignedGroups.length > 0) {
//                 formData.append(`assigned_to_type[${assignedTypeIndex}]`, "group");
//             }

//             const result = await updateTicket(ticketNoStr, formData);
//             if (!result.success) throw new Error(result.error || "Failed");

//             toast.success("Solution resolved! Ticket status changed to New.");

//             // Update UI
//             setTickets(prev => {
//                 const ticket = prev.solved.find(
//                 t => t.ticket_no == currentChatTicket.id
//                 );
//                 if (!ticket) return prev;

//                 ticket.status_detail = { field_values: "New" };

//                 return {
//                 ...prev,
//                 solved: prev.solved.filter(
//                     t => t.ticket_no != currentChatTicket.id
//                 ),
//                 new_assigned: [ticket, ...prev.new_assigned]
//                 };
//             });

//             setIsResolved(true);
//             setShowFollowUpChat(false);
//             setSelectedType("new_assigned");

//             await sendFollowUpMessageHandler(
//                 "I have resolved the solution. Ticket reopened as New if further action needed."
//             );

//         } catch (err) {
//         console.error(err);
//         toast.error("Failed to resolve solution");
//         }
//     };
//     // const handleApproveSolution = () => {
//     //     // TODO: Call API to approve solution
//     //     setIsApproved(true);
//     //     toast.success("Solution approved!");
//     // };
//    const handleApproveSolution = async () => {
//         if (!currentChatTicket?.id) {
//             toast.error("No ticket selected");
//             return;
//         }

//         // Get fresh ticket details to preserve current data
//         let currentTicketData = {};
//         try {
//             const ticketDetails = await getTicketDetails(currentChatTicket.id);
//             currentTicketData = ticketDetails.ticket || ticketDetails;
//         } catch (err) {
//             console.error("Failed to fetch latest ticket details:", err);
//             toast.error("Could not fetch ticket details");
//             return;
//         }

//         try {
//             const ticketNoStr = String(currentChatTicket.id);
//             console.log("Updating ticket to Closed:", ticketNoStr);

//             const assignedUsers =
//                 currentTicketData.assignees_detail ||
//                 currentTicketData.assigned_users ||
//                 [];

//             const assignedGroups =
//                 currentTicketData.assigned_groups_detail ||
//                 currentTicketData.assigned_groups ||
//                 [];

//             const formData = new FormData();

//             // BASIC FIELDS
//             formData.append("title", currentTicketData.title || "");
//             formData.append("description", currentTicketData.description || "");
//             formData.append("category", currentTicketData.category || currentTicketData.category_detail?.id || "");

//             // CLOSED STATUS
//             formData.append("status", "46"); // Closed

//             //ASSIGNEES
//             let assignedTypeIndex = 0;

//             assignedUsers.forEach((user, index) => {
//                 if (user?.email) {
//                 formData.append(`assignee[${index}]`, user.email);
//                 }
//             });

//             if (assignedUsers.length > 0) {
//                 formData.append(`assigned_to_type[${assignedTypeIndex}]`, "user");
//                 assignedTypeIndex++;
//             }

//             //  GROUPS
//             assignedGroups.forEach((group, index) => {
//                 if (group?.id) {
//                 formData.append(`assigned_group[${index}]`, group.id);
//                 }
//             });

//             if (assignedGroups.length > 0) {
//                 formData.append(`assigned_to_type[${assignedTypeIndex}]`, "group");
//             }

//             console.log("Approve Solution → Closing ticket (FormData):", [
//                 ...formData.entries(),
//             ]);

//             const result = await updateTicket(ticketNoStr, formData);
//             if (!result.success) {
//                 throw new Error(result.error || "Failed to close ticket");
//             }

//             toast.success("Solution approved and ticket closed successfully!");

//             // UI updates
//             setIsApproved(true);
//             setShowFollowUpChat(false);
//             loadData();
//             setSelectedType("closed");
//         } catch (err) {
//         console.error("Error closing ticket on approve:", err);
//         //toast.error("Failed to close ticket");
//         }
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
//             setClarificationRequested(ticketData.status === "156" || ticketData.clarification_requested);
//             // Set ticket details
//             setCurrentChatTicket({
//                 id: ticketNo,
//                 title: ticketData.title || ticket.title || "",
//                 description: ticketData.description || ticket.description || "",

//             });
//             // CONFIDENTIAL LOGIC
//             const confidential = ticketData.confidential === true || ticketData.confidential === "true";
//             setIsConfidentialTicket(confidential);
//             setIsProtected(confidential); // Force on if confidential

//             // Check if this is a SOLVED ticket
//             const isCurrentlySolved = selectedType === "solved" || ticketData.status_detail?.field_values === "Solved" || ticketData.status === "Solved";

//             if (isCurrentlySolved) {
//                 setIsSolvedTicket(true);
//                 setSolutionText(ticketData.solution_text || ticketData.resolution_text || "No solution details provided.");
//                 // Automatically switch to Solution tab
//                 setChatTab(2); // 0 = Follow-up, 1 = Clarification, 2 = Solution
//             }

//             // Force protected mode if ticket is confidential
//             if (ticketData.confidential === true || ticketData.confidential === "true") {
//                 setIsProtected(true);
//             } else {
//                 setIsProtected(false); // or keep current value, or reset to false
//             }

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

//     const handleSendClarification = async () => {
//         if (!clarificationText.trim()) return;

//         setSendingClarification(true);
//         try {
//             await sendMessage({
//                 receiver: currentUserId === assignee?.id ? currentChatTicket?.requested_by : assignee?.id, // Send to requester if assignee is sending
//                 ticket_no: currentChatTicket.id,
//                 message: `[Clarification Required]\n\n${clarificationText.trim()}`,
//                 protected: false, // or true if you want it private
//             });

//             // Optional: Add to chat as a visible message
//             await sendFollowUpMessageHandler(`[Clarification Required] ${clarificationText.trim()}`);

//             setClarificationText("");
//             setClarificationSent(true);
//             toast.success("Clarification required sent!");

//             // Auto switch back to Follow-up tab
//             setChatTab(0);

//             // Reset alert after 5 seconds
//             setTimeout(() => setClarificationSent(false), 5000);
//         } catch (err) {
//             toast.error("Failed to send clarification");
//         } finally {
//             setSendingClarification(false);
//         }
//     };

//     const handleRequestClarification = async () => {
//         if (!clarificationText.trim()) {
//             toast.error("Please enter clarification details");
//             return;
//         }
//         if (!currentChatTicket?.id) {
//             toast.error("No ticket selected");
//             return;
//         }

//         setSendingClarification(true);
//         try {
//             // Step 1: Update ticket status to Clarification Required (157)
//             let currentTicketData = {};
//             try {
//                 const ticketDetails = await getTicketDetails(currentChatTicket.id);
//                 currentTicketData = ticketDetails.ticket || ticketDetails;
//             } catch (err) {
//                 toast.error("Could not fetch ticket details");
//                 return;
//             }

//             const ticketNoStr = String(currentChatTicket.id);
//             const assignedUsers = currentTicketData.assignees_detail || currentTicketData.assigned_users || [];
//             const assignedGroups = currentTicketData.assigned_groups_detail || currentTicketData.assigned_groups || [];

//             const formData = new FormData();
//             formData.append("title", currentTicketData.title || "");
//             formData.append("description", currentTicketData.description || "");
//             formData.append("category", currentTicketData.category || currentTicketData.category_detail?.id || "");
//             formData.append("status", "157"); // Clarification Required

//             let assignedTypeIndex = 0;
//             assignedUsers.forEach((user, index) => {
//                 if (user?.email) formData.append(`assignee[${index}]`, user.email);
//             });
//             if (assignedUsers.length > 0) formData.append(`assigned_to_type[${assignedTypeIndex++}]`, "user");

//             assignedGroups.forEach((group, index) => {
//                 if (group?.id) formData.append(`assigned_group[${index}]`, group.id);
//             });
//             if (assignedGroups.length > 0) formData.append(`assigned_to_type[${assignedTypeIndex}]`, "group");

//             const result = await updateTicket(ticketNoStr, formData);
//             if (!result.success) throw new Error(result.error || "Failed to update ticket status");

//             // Step 2: Send ONE clarification message (only once)
//             const clarificationMessage = `[Clarification Supplied]\n\n${clarificationText.trim()}`;
//             await sendMessage({
//                 receiver: assignee?.id,
//                 ticket_no: currentChatTicket.id,
//                 message: clarificationMessage,
//                 protected: false,
//             });

//             // Refetch messages to show the new one (no duplicate call to sendFollowUpMessageHandler)
//             const messages = await fetchMessages();
//             const ticketMsgs = messages.filter(m =>
//                 m.ticket_no == currentChatTicket.id &&
//                 ((m.sender === currentUserId && m.receiver === assignee?.id) ||
//                 (m.sender === assignee?.id && m.receiver === currentUserId))
//             );
//             setFollowUpChats(ticketMsgs.sort((a, b) => new Date(a.createdon) - new Date(b.createdon)));

//             toast.success("Clarification Supplied sent and ticket status updated!");

//             setClarificationText("");
//             setChatTab(0);

//             // Optional: Force parent to refresh counts (if you pass a callback)
//             // if (props.onRefresh) props.onRefresh();

//             // Quick fix: Reload page to update counts
//             window.location.reload();

//         } catch (err) {
//             console.error("Error requesting clarification:", err);
//             toast.error("Failed to send clarification request");
//         } finally {
//         setSendingClarification(false);
//         }
//     };

// //     const handleRequestClarification = async () => {
// //         if (!clarificationText.trim()) {
// //             toast.error("Please enter clarification details");
// //             return;
// //         }
// //         if (!currentChatTicket?.id) {
// //             toast.error("No ticket selected");
// //             return;
// //         }

// //         setSendingClarification(true);
// //         try {
// //             // Step 1: Update ticket status to "57" - Clarification Required
// //             let currentTicketData = {};
// //             try {
// //                 const ticketDetails = await getTicketDetails(currentChatTicket.id);
// //                 currentTicketData = ticketDetails.ticket || ticketDetails;
// //             } catch (err) {
// //                 toast.error("Could not fetch ticket details");
// //                 return;
// //             }

// //         const ticketNoStr = String(currentChatTicket.id);
// //         const assignedUsers = currentTicketData.assignees_detail || currentTicketData.assigned_users || [];
// //         const assignedGroups = currentTicketData.assigned_groups_detail || currentTicketData.assigned_groups || [];

// //         const formData = new FormData();
// //         formData.append("title", currentTicketData.title || "");
// //         formData.append("description", currentTicketData.description || "");
// //         formData.append("category", currentTicketData.category || currentTicketData.category_detail?.id || "");
// //         formData.append("status", "157"); // ← Clarification Required

// //         let assignedTypeIndex = 0;
// //         assignedUsers.forEach((user, index) => {
// //             if (user?.email) {
// //                 formData.append(`assignee[${index}]`, user.email);
// //             }
// //         });
// //         if (assignedUsers.length > 0) {
// //             formData.append(`assigned_to_type[${assignedTypeIndex}]`, "user");
// //             assignedTypeIndex++;
// //         }

// //         assignedGroups.forEach((group, index) => {
// //             if (group?.id) {
// //                 formData.append(`assigned_group[${index}]`, group.id);
// //             }
// //         });
// //         if (assignedGroups.length > 0) {
// //             formData.append(`assigned_to_type[${assignedTypeIndex}]`, "group");
// //         }

// //         const result = await updateTicket(ticketNoStr, formData);
// //         if (!result.success) {
// //             throw new Error(result.error || "Failed to update ticket status");
// //         }

// //         // Step 2: Send clarification message in chat
// //         const clarificationMessage = `[Clarification Supplied]\n\n${clarificationText.trim()}`;
// //         await sendMessage({
// //             receiver: assignee?.id,
// //             ticket_no: currentChatTicket.id,
// //             message: clarificationMessage,
// //             protected: false,
// //         });

// //         // Optional: Also add to visible chat
// //         await sendFollowUpMessageHandler(clarificationMessage);

// //         toast.success("Clarification Supplied sent and ticket status updated!");
// //         setClarificationText("");
// //         setChatTab(0); // Switch back to chat

// //         // Update local tickets list: move to clarification_required
// //         setTickets(prev => {
// //             const ticket = prev[selectedType]?.find(t => t.ticket_no == currentChatTicket.id);
// //             if (ticket) {
// //                 ticket.status_detail = { field_values: "Clarification Required" };
// //                 return {
// //                     ...prev,
// //                     [selectedType]: prev[selectedType].filter(t => t.ticket_no != currentChatTicket.id),
// //                     clarification_required: [ticket, ...(prev.clarification_required || [])]
// //                 };
// //             }
// //             return prev;
// //         });

// //         setSelectedType("clarification_required");
// //     } catch (err) {
// //         console.error("Error requesting clarification:", err);
// //         toast.error("Failed to send clarification request");
// //     } finally {
// //         setSendingClarification(false);
// //     }
// // };

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
//         setClarificationText("");
//         setClarificationSent(false);
//     };

//     // const filteredRows = useMemo(() => {
//     //     return selectedTickets.filter((row) => {
//     //         const matchesSearch =
//     //             Object.values(row)
//     //                 .join(" ")
//     //                 .toLowerCase()
//     //                 .includes(search.toLowerCase());
//     //         const matchesDept = department ? row.department_detail?.field_name === department : true;
//     //         return matchesSearch && matchesDept;
//     //     });
//     // }, [selectedTickets, search, department]);
// //     const filteredRows = useMemo(() => {
// //     const searchLower = search.toLowerCase().trim();

// //     return selectedTickets.filter((row) => {
// //         const matchesDept = department 
// //             ? row.department_detail?.field_name === department 
// //             : true;

// //         if (!searchLower) return matchesDept;

// //         const ticketNoStr = String(row.ticket_no || "").toLowerCase();
// //         if (ticketNoStr.includes(searchLower)) return true;

// //         if (row.title?.toLowerCase().includes(searchLower)) return true;
// //         if (row.description?.toLowerCase().includes(searchLower)) return true;

// //         return false;
// //     }).filter(row => {
// //         return department ? row.department_detail?.field_name === department : true;
// //     });
// // }, [selectedTickets, search, department]);

// const filteredRows = useMemo(() => {
//     const searchLower = search.toLowerCase().trim();
 
//     if (!searchLower && !department) {
//         return selectedTickets;
//     }
 
//     return selectedTickets.filter((row) => {
//         // Department filter (separate dropdown)
//         const matchesDept = department
//             ? row.department_detail?.field_name === department
//             : true;
 
//         if (!searchLower) return matchesDept;
 
//         // 1. Ticket Number
//         if (String(row.ticket_no || "").toLowerCase().includes(searchLower)) return true;
 
//         // 2. Title
//         if (row.title?.toLowerCase().includes(searchLower)) return true;
 
//         // 3. Description
//         if (row.description?.toLowerCase().includes(searchLower)) return true;
 
//         // 4. Status
//         if (row.status_detail?.field_values?.toLowerCase().includes(searchLower)) return true;
 
//         // 5. Priority
//         if (row.priority_detail?.field_values?.toLowerCase().includes(searchLower)) return true;
 
//         // 6. Category
//         if (row.category_detail?.category_name?.toLowerCase().includes(searchLower)) return true;
 
//         // 7. Subcategory
//         if (row.subcategory_detail?.subcategory_name?.toLowerCase().includes(searchLower)) return true;
 
//         // 8. Department
//         if (row.department_detail?.field_name?.toLowerCase().includes(searchLower)) return true;
 
//         // 9. Location
//         if (row.location_detail?.field_name?.toLowerCase().includes(searchLower)) return true;
 
//         // 10. Requested By (email or name)
//         if (row.requested_detail?.email?.toLowerCase().includes(searchLower)) return true;
//         if (row.requested_detail?.name?.toLowerCase().includes(searchLower)) return true;
 
//         // 11. Dates (Open Date / Last Update) - match formatted or raw
//         const openDate = new Date(row.created_date).toLocaleDateString().toLowerCase();
//         const updateDate = new Date(row.updated_date).toLocaleDateString().toLowerCase();
//         if (openDate.includes(searchLower) || updateDate.includes(searchLower)) return true;
 
//         return false;
//     }).filter((row) => {
//         // Apply department filter at the end (in case user uses both search + department dropdown)
//         return department ? row.department_detail?.field_name === department : true;
//     });
// }, [selectedTickets, search, department]);

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
//         <Box sx={{ width: "100%", mb:2 }}>
//             <Grid container spacing={1} sx={{ mb: 2 }}>
//                 {statusCards.map((item) => (
//                     <Grid size={{ xs: 6, sm: 6, md: 4, lg: 2 }} key={item.id}>
//                         <Card
//                             onClick={() => handleCardClick(item.id)}
//                             sx={{
//                                 transition: "0.3s ease",
//                                 maxWidth: isMobile ? 500 : 300,
//                                 maxHeight: 110,
//                                 minHeight: 100,
//                                 borderRadius: 5,
//                                 "&:hover": {
//                                     background: "linear-gradient(135deg, #667eea, #764ba2)",
//                                     color: "#fff",
//                                     transform: "scale(1.03)",
//                                 }
//                             }}
//                         >
//                             <CardContent 
//                                 sx={{
//                                     "&:last-child": { pt: 1 },
//                                     display: "flex",
//                                     gap: 2,
//                                     alignItems: "center"
//                                 }}
//                             >
//                                 <Box
//                                     sx={{
//                                         width: { xs: 40, sm: 40, md: 40 },
//                                         height: { xs: 40, sm: 40, md: 40 },
//                                         minWidth: 40,
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
//                                     mb: 1,
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
//                                                         {/* Header */}
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
//                                                                 py: 2,
//                                                                 lineHeight: 1.2,
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
//                                                                                 maxWidth:200,
//                                                                                 whiteSpace: "nowrap",
//                                                                                 overflow: "hidden",
//                                                                                 textOverflow: "ellipsis",
//                                                                                 cursor: "pointer",
                                                                               
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
//                                                                                 maxWidth: 200,
//                                                                                 whiteSpace: "nowrap",
//                                                                                 overflow: "hidden",
//                                                                                 textOverflow: "ellipsis",
//                                                                                 cursor: "pointer",
//                                                                             }}
//                                                                         >
//                                                                             {t.description || "-"}
//                                                                         </Typography>
//                                                                     </Tooltip>
//                                                                 </TableCell>
//                                                                 <TableCell>
//                                                                     <Typography  fontSize="0.85rem">
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
//                                                                             <Typography fontSize="0.85rem">
//                                                                                 {t.category_detail?.category_name || "-"}
//                                                                             </Typography>
//                                                                             <Typography fontSize="0.85rem">
//                                                                                 {t.subcategory_detail?.subcategory_name || "-"}
//                                                                             </Typography>
//                                                                         </Box>
//                                                                     </Tooltip>
//                                                                 </TableCell>
//                                                                 <TableCell>
//                                                                     <Typography fontSize="0.85rem">
//                                                                         {t.department_detail?.field_name}
//                                                                     </Typography>
//                                                                     <Typography fontSize="0.85rem">
//                                                                         {t.location_detail?.field_name}
//                                                                     </Typography>
//                                                                 </TableCell>
//                                                                 <TableCell>
//                                                                     <Typography fontSize="0.85rem">
//                                                                         {t.requested_detail?.email}
//                                                                     </Typography>
//                                                                 </TableCell>
//                                                                 <TableCell>
//                                                                     <Typography fontSize="0.85rem">
//                                                                         {new Date(t.created_date).toLocaleDateString()}
//                                                                     </Typography>
//                                                                     <Typography fontSize="0.85rem">
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
//                     <Box sx={{ p: 2, bgcolor: "primary.main", color: "white", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//                         <Box>
//                             <Typography variant="body2">Ticket #{currentChatTicket?.id}</Typography>
//                             <Typography variant="body2">{currentChatTicket?.title}</Typography>
//                             <Typography variant="caption" sx={{ color: "white" }}>{currentChatTicket?.description}</Typography>
//                         </Box>
//                         <IconButton onClick={() => setShowFollowUpChat(false)} sx={{ color: "white" }}>
//                             <CloseIcon />
//                         </IconButton>
//                     </Box>
//                     {/* Tab Buttons */}
//                     <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
//                         <Tabs value={chatTab} onChange={(e, v) => setChatTab(v)} centered>
//                             <Tab label="Follow-up" icon={<ChatIcon />} />
//                             <Tab
//                                 label="Clarification Supplied"
//                                 icon={<QuestionAnswerIcon />}
//                                 disabled={
//                                     isSolvedTicket || // Can't request on solved
//                                     selectedType === "closed" ||
//                                     selectedType === "Cancelled" ||
//                                     selectedType === "clarification_applied" // Already supplied → disable re-supply
//                                 }
//                             />
//                             <Tab
//                                 label="Solution"
//                                 icon={<DoneAllIcon />}
//                                 disabled={
//                                     !isSolvedTicket || // Only show on solved tickets
//                                     selectedType === "closed" ||
//                                     selectedType === "Cancelled" ||
//                                     selectedType === "clarification_applied" ||
//                                     selectedType === "clarification_required"
//                                 }
//                             />
//                             {/* <Tab label="Solution" icon={<DoneAllIcon />} disabled={!isSolvedTicket} /> */}
//                             {/* <Tab label="Clarification Supplied" icon={<HelpOutlineIcon />} disabled={isSolvedTicket} /> */}
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
//                                         groupedChats.map((group) => (
//                                             <Box key={group.date} sx={{ mb: 3 }}>
//                                                 <Divider sx={{ my: 2, width: "100%" }}>
//                                                     <Chip
//                                                         label={group.date}
//                                                         size="small"
//                                                         sx={{ bgcolor: "grey.200" }}
//                                                     />
//                                                 </Divider>
//                                                 {group.messages.map((msg, index) => {
//                                                     const msgId = msg.id || `msg-${index}`;
//                                                     const isMe = Number(msg.sender) === Number(currentUserId);
//                                                     const isProtectedMsg = msg.protected === true;
//                                                     const isRevealed = revealedMessages.has(msgId);
//                                                     const canReveal = Number(msg.sender) === Number(currentUserId) || Number(msg.receiver) === Number(currentUserId);

//                                                     const toggleReveal = () => {
//                                                         if (!canReveal) return;
//                                                         setRevealedMessages(prev => {
//                                                         const newSet = new Set(prev);
//                                                         newSet.has(msgId) ? newSet.delete(msgId) : newSet.add(msgId);
//                                                         return newSet;
//                                                         });
//                                                     };

//                                                     const getText = () => {
//                                                         if (!isProtectedMsg) return msg.message || "";
//                                                         if (!canReveal) return "*** PROTECTED MESSAGE - VISIBLE ONLY TO PARTICIPANTS ***";
//                                                         const real = msg.decrypted_message || msg.message;
//                                                         return isRevealed ? real : "Protected Message (click eye to reveal)";
//                                                     };

//                                                     return (
//                             <Box key={msgId} sx={{ display: "flex", justifyContent: isMe ? "flex-end" : "flex-start", mb: 2 }}>
//                               {!isMe ? (
//                                 <Box sx={{ display: "flex", alignItems: "flex-end", gap: 1, maxWidth: "80%" }}>
//                                   <Avatar sx={{ width: 40, height: 40, bgcolor: "grey.300" }}>
//                                     {getInitials(assignee?.name)}
//                                   </Avatar>
//                                   <Box sx={{ position: "relative", bgcolor: "grey.100", p: 2, borderRadius: 2, boxShadow: 1 }}>
//                                     {isProtectedMsg && (
//                                       <SecurityIcon sx={{ position: "absolute", top: -10, right: -10, fontSize: 20, bgcolor: "#4CAF50", color: "white", borderRadius: "50%", p: 0.5 }} />
//                                     )}
//                                     <Typography variant="body1" sx={{ wordBreak: "break-word" }}>
//                                       {getText()}
//                                     </Typography>
//                                     {isProtectedMsg && canReveal && (
//                                       <IconButton size="small" onClick={toggleReveal} sx={{ position: "absolute", bottom: 6, right: 8 }}>
//                                         {isRevealed ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
//                                       </IconButton>
//                                     )}
//                                     <Typography variant="caption" sx={{ display: "block", mt: 1, color: "text.secondary" }}>
//                                       {new Date(msg.createdon).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {assignee?.name || "Assignee"}
//                                     </Typography>
//                                   </Box>
//                                 </Box>
//                               ) : (
//                                 <Box sx={{ display: "flex", alignItems: "flex-end", gap: 1, flexDirection: "row-reverse", maxWidth: "80%" }}>
//                                   <Avatar sx={{ width: 40, height: 40, bgcolor: "primary.main", color: "white" }}>
//                                     {getInitials(currentUserName)}
//                                   </Avatar>
//                                   <Box sx={{ position: "relative", bgcolor: "primary.main", color: "white", p: 2, borderRadius: 2, boxShadow: 1 }}>
//                                     {isProtectedMsg && (
//                                       <SecurityIcon sx={{ position: "absolute", top: -10, left: -10, fontSize: 20, bgcolor: "#4CAF50", color: "white", borderRadius: "50%", p: 0.5 }} />
//                                     )}
//                                     <Typography variant="body1" sx={{ wordBreak: "break-word" }}>
//                                       {getText()}
//                                     </Typography>
//                                     {isProtectedMsg && canReveal && (
//                                       <IconButton size="small" onClick={toggleReveal} sx={{ position: "absolute", bottom: 6, right: 8, color: "white", bgcolor: "rgba(255,255,255,0.2)" }}>
//                                         {isRevealed ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
//                                       </IconButton>
//                                     )}
//                                     <Typography variant="caption" sx={{ display: "block", mt: 1, opacity: 0.8 }}>
//                                       {new Date(msg.createdon).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • You
//                                     </Typography>
//                                   </Box>
//                                 </Box>
//                               )}
//                             </Box>
//                           );
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
//                                             size="small"
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
//                                         <Tooltip 
//                                             title={
//                                                 isConfidentialTicket 
//                                                     ? "All messages are protected (Confidential Ticket)" 
//                                                     : isProtected 
//                                                         ? "Protected mode ON" 
//                                                         : "Click to send this message protected"
//                                             }
//                                         >
//                                             <span> {/* Wrap in span to allow tooltip on disabled button */}
//                                                 <IconButton
//                                                     onClick={() => {
//                                                         if (!isConfidentialTicket) {
//                                                             setIsProtected(!isProtected);
//                                                         }
//                                                     }}
//                                                     disabled={isConfidentialTicket} // Can't turn off if ticket is confidential
//                                                     sx={{
//                                                         color: isProtected || isConfidentialTicket ? "white" : "success.main",
//                                                         bgcolor: isProtected || isConfidentialTicket ? "success.main" : "transparent",
//                                                         border: "1px solid",
//                                                         "&:hover": {
//                                                             bgcolor: isProtected || isConfidentialTicket ? "success.dark" : "success.light",
//                                                         },
//                                                     }}
//                                                 >
//                                                     <SecurityIcon />
//                                                 </IconButton>
//                                             </span>
//                                         </Tooltip>
//                                         {/* <Tooltip title={isProtected ? "Protected mode ON" : "Send protected message"}>
//                                             <IconButton
//                                                 onClick={() => setIsProtected(true)}
//                                                 sx={{
//                                                     color: isProtected ? "white" : "success.main",
//                                                     bgcolor: isProtected ? "success.main" : "transparent",
//                                                     border: "1px solid",
//                                                     "&:hover": {
//                                                         bgcolor: isProtected ? "success.dark" : "success.light",
//                                                     },
//                                                 }}
//                                             >
//                                                 <SecurityIcon />
//                                             </IconButton>
//                                         </Tooltip> */}
//                                         {/* <Tooltip title={isProtected ? "Protected mode ON" : "Send protected message"}>
//                                             <IconButton
//                                                 onClick={() => setIsProtected(!isProtected)}
//                                                 sx={{
//                                                     color: isProtected ? "white" : "success.main",
//                                                     bgcolor: isProtected ? "success.main" : "transparent",
//                                                     border: "1px solid",
//                                                     "&:hover": {
//                                                         bgcolor: isProtected ? "success.dark" : "success.light",
//                                                     },
//                                                 }}
//                                             >
//                                                 <SecurityIcon />
//                                             </IconButton>
//                                         </Tooltip> */}
//                                         <IconButton
//                                             onClick={() => sendFollowUpMessageHandler(newFollowUpMessage)}
//                                             disabled={!newFollowUpMessage.trim() || sendingFollowUpMessage || !assignee}
//                                             color="primary"
//                                             sx={{ alignSelf: "flex-end",  }}
//                                         >
//                                             {sendingFollowUpMessage ? <CircularProgress size={20} /> : <SendIcon />}
//                                         </IconButton>
                                        
//                                     </Box>
//                                     {(isProtected || isConfidentialTicket) && (
//                                         <Typography variant="caption" color="success.main" sx={{ mt: 1, display: "block", textAlign: "center" }}>
//                                             <SecurityIcon fontSize="small" sx={{ verticalAlign: "middle", mr: 0.5 }} />
//                                             {isConfidentialTicket 
//                                                 ? "All messages are protected (Confidential Ticket)" 
//                                                 : "This message will be sent as protected"
//                                             }
//                                         </Typography>
//                                     )}
//                                 </Box>
//                             </Box>
//                         )}
//                         {chatTab === 1 && (
//                             <Box sx={{ display: "flex", flexDirection: "column", p: 3 }}>
//                                 {clarificationRequested ? (
//                                     // Already requested clarification
//                                     <Box sx={{ textAlign: "center", flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
//                                         <HelpOutlineIcon sx={{ fontSize: 80, color: "warning.main", mb: 2 }} />
//                                         <Typography variant="h6" fontWeight={600}>Clarification Request Already Sent</Typography>
//                                         <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>
//                                             Waiting for the assignee to respond.
//                                         </Typography>
//                                         <Button variant="outlined" onClick={() => setChatTab(0)}>
//                                             Back to Follow-up
//                                         </Button>
//                                     </Box>
//                                 ) : isSolvedTicket ? (
//                                     // Ticket is solved — cannot request clarification
//                                     <Box sx={{ textAlign: "center", flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
//                                         <DoneAllIcon sx={{ fontSize: 80, color: "success.main", mb: 2 }} />
//                                         <Typography variant="h6" fontWeight={600}>Ticket Already Solved</Typography>
//                                         <Typography color="text.secondary" sx={{ mt: 1 }}>
//                                             Cannot request clarification on solved tickets.
//                                         </Typography>
//                                         <Button variant="outlined" onClick={() => setChatTab(0)}>
//                                             Back to Follow-up
//                                         </Button>
//                                     </Box>
//                                 ) : (
//                                     // Show the form to request clarification
//                                     <>
//                                         <Box sx={{ textAlign: "center", mb: 3 }}>
//                                             <QuestionAnswerIcon sx={{ fontSize: 60, color: "primary.main", mb: 2 }} />
//                                             <Typography variant="h6" fontWeight={600}>Clarification Supplied</Typography>
                                            
//                                         </Box>

//                                         <TextField
//                                             multiline
//                                             rows={6}
//                                             placeholder="Please clarify the following..."
//                                             value={clarificationText}
//                                             onChange={(e) => setClarificationText(e.target.value)}
//                                             variant="outlined"
//                                             fullWidth
//                                             sx={{ mb: 3 }}
//                                             disabled={sendingClarification}
//                                         />

//                                         <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
//                                             <Button
//                                                 variant="contained"
//                                                 color="warning"
//                                                 size="large"
//                                                 startIcon={sendingClarification ? <CircularProgress size={20} /> : <QuestionAnswerIcon />}
//                                                 onClick={handleRequestClarification}
//                                                 disabled={!clarificationText.trim() || sendingClarification}
//                                             >
//                                                 Send Request
//                                             </Button>
//                                             <Button
//                                                 variant="outlined"
//                                                 onClick={() => {
//                                                     setClarificationText("");
//                                                     setChatTab(0);
//                                                 }}
//                                                 disabled={sendingClarification}
//                                             >
//                                                 Cancel
//                                             </Button>
//                                         </Box>
//                                     </>
//                                 )}
//                             </Box>
//                         )}
//                         {chatTab === 2 && isSolvedTicket && (
//                             <Box 
//                                 sx={{
//                                     display: "flex",
//                                     flexDirection: "column",
//                                     justifyContent: "center",
//                                     alignItems: "center",
//                                     p: 4,
//                                     gap: 2,
//                                     textAlign: "center"
//                                 }}
//                             >
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
//                                         color="error"
//                                         onClick={handleResolveSolution}
//                                         disabled={isResolved}
//                                         size="small"
//                                     >
//                                         {isResolved ? "Rejected" : "Rejected"}
//                                     </Button>
//                                     <Button
//                                         variant={isApproved ? "contained" : "outlined"}
//                                         color="success"
//                                         onClick={handleApproveSolution}
//                                         disabled={isApproved}
//                                         size="small"
//                                     >
//                                         {isApproved ? "Accepted" : "Accepted"}
//                                     </Button>
//                                 </Box>
//                                 <Button
//                                     variant="outlined"
//                                     onClick={() => setChatTab(0)}
//                                     sx={{ mt: 1 }}
//                                 >
//                                     Back
//                                 </Button>
//                             </Box>
//                         )}
//                         {/* {chatTab === 2 && !isSolvedTicket && (
//                             <Box sx={{ display: "flex", flexDirection: "column", height: "100%", p: 3 }}>
//                                 {isTicketClarificationRequired() ? (
//                                     <Box sx={{ textAlign: "center", flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
//                                         <HelpOutlineIcon sx={{ fontSize: 80, color: "warning.main", mb: 2 }} />
//                                         <Typography variant="h6" fontWeight={600}>Clarification Request Already Sent</Typography>
//                                         <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>
//                                             Waiting for requester to respond.
//                                         </Typography>
//                                         <Button variant="outlined" onClick={() => setChatTab(0)}>
//                                             Back to Follow-up
//                                         </Button>
//                                         </Box>
//                                 ) : isTicketSolved() ? (
//                                     <Box sx={{ textAlign: "center", flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
//                                         <DoneAllIcon sx={{ fontSize: 80, color: "success.main", mb: 2 }} />
//                                         <Typography variant="h6" fontWeight={600}>Ticket Already Solved</Typography>
//                                         <Typography color="text.secondary" sx={{ mt: 1 }}>
//                                             Cannot request clarification on solved tickets.
//                                         </Typography>
//                                     </Box>
//                                 ) : (
//                                         <>
//                                             <Box sx={{ textAlign: "center", mb: 3 }}>
//                                                 <HelpOutlineIcon sx={{ fontSize: 60, color: "warning.main", mb: 2 }} />
//                                                 <Typography variant="h6" fontWeight={600}>Request Clarification</Typography>
//                                                 <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
//                                                     Ask for more details if something is unclear.
//                                                 </Typography>
//                                             </Box>
//                                             <TextField
//                                                 multiline
//                                                 rows={6}
//                                                 placeholder="Please clarify the following..."
//                                                 value={clarificationText}
//                                                 onChange={(e) => setClarificationText(e.target.value)}
//                                                 variant="outlined"
//                                                 fullWidth
//                                                 sx={{ mb: 3 }}
//                                                 disabled={sendingClarification}
//                                             />
//                                             <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
//                                                 <Button
//                                                     variant="contained"
//                                                     color="warning"
//                                                     size="large"
//                                                     startIcon={<QuestionAnswerIcon />}
//                                                     onClick={handleRequestClarification}
//                                                     disabled={!clarificationText.trim() || sendingClarification}
//                                                 >
//                                                     {sendingClarification ? <CircularProgress size={20} /> : "Send Request"}
//                                                 </Button>
//                                                 <Button variant="outlined" onClick={() => { setClarificationText(""); setChatTab(0); }} disabled={sendingClarification}>
//                                                     Cancel
//                                                 </Button>
//                                             </Box>
//                                         </>
//                                     )}
//                             </Box>
//                         )} */}
                        
                        
//                     </Box>
//                 </Box>
//             </Drawer>
//         </Box >
//     );
// };
// export default RequestTabs;
import { useState, useEffect, useMemo } from "react";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  useMediaQuery,
  Autocomplete,
  Stack,
  Pagination,
  Tooltip,
  IconButton,
  Icon,
  Drawer,
  CircularProgress,
  Divider,
  Chip,
  Avatar,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemButton,
  Checkbox,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Badge,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CloseIcon from "@mui/icons-material/Close";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import SecurityIcon from "@mui/icons-material/Security";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import CancelIcon from "@mui/icons-material/Cancel";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import LockIcon from "@mui/icons-material/Lock";
import PeopleIcon from "@mui/icons-material/People";
import GroupIcon from "@mui/icons-material/Group";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import {
  Chat as ChatIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import {
  fetchMessages,
  sendMessage,
  getTicketDetails,
  updateTicket,
  fetchConfigurations, // Add this import
} from "../../Api";

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
    Cancelled: [],
    clarification_applied: [],
    clarification_required: [],
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
  const [chatTab, setChatTab] = useState(0);
  
  // Solved ticket solution states
  const [isSolvedTicket, setIsSolvedTicket] = useState(false);
  const [solutionText, setSolutionText] = useState("");
  const [isResolved, setIsResolved] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [clarificationRequested, setClarificationRequested] = useState(false);
  const [isProtected, setIsProtected] = useState(false);
  
  const [revealedMessages, setRevealedMessages] = useState(new Set());
  const [myProtectedMessages, setMyProtectedMessages] = useState({});
  const [clarificationText, setClarificationText] = useState("");
  const [clarificationSent, setClarificationSent] = useState(false);
  const [sendingClarification, setSendingClarification] = useState(false);
  const [isConfidentialTicket, setIsConfidentialTicket] = useState(false);
  
  // Group and user assignment states
  const [groups, setGroups] = useState([]);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [showGroupDialog, setShowGroupDialog] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groupUsers, setGroupUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedUserEmails, setSelectedUserEmails] = useState([]);
  const [assignmentMode, setAssignmentMode] = useState("single");
  const [currentTicketForAssignment, setCurrentTicketForAssignment] = useState(null);
  const [ticketGroups, setTicketGroups] = useState([]);

  // Status configurations state
  const [statusConfigs, setStatusConfigs] = useState([]);
  const [isConfigsLoading, setIsConfigsLoading] = useState(true);

  useEffect(() => {
    if (userStatus) {
      setTickets({
        new_assigned: Array.isArray(userStatus.new_assigned_tickets)
          ? userStatus.new_assigned_tickets
          : [],
        solved: Array.isArray(userStatus.solved_tickets)
          ? userStatus.solved_tickets
          : [],
        closed: Array.isArray(userStatus.closed_tickets)
          ? userStatus.closed_tickets
          : [],
        Cancelled: Array.isArray(userStatus.cancelled_tickets)
          ? userStatus.cancelled_tickets
          : [],
        clarification_required: Array.isArray(
          userStatus.clarification_required_tickets
        )
          ? userStatus.clarification_required_tickets
          : [],
        clarification_applied: Array.isArray(
          userStatus.clarification_applied_tickets
        )
          ? userStatus.clarification_applied_tickets
          : [],
      });
    }
  }, [userStatus]);

  // Get current user ID and name on component mount
  useEffect(() => {
    const userDataString = localStorage.getItem("user");
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      setCurrentUserId(userData?.id || null);
      setCurrentUserName(userData?.name || userData?.username || "You");
    } else {
      const userId = localStorage.getItem("current_user_id") || "11";
      setCurrentUserId(parseInt(userId));
      setCurrentUserName("You");
    }
  }, []);

  // Fetch status configurations
  useEffect(() => {
    const loadStatusConfigurations = async () => {
      setIsConfigsLoading(true);
      try {
        const response = await fetchConfigurations();
        const data = response?.data || response || [];
        
        if (Array.isArray(data)) {
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
        console.error("Failed to fetch status configurations:", err);
        toast.error("Failed to load status configurations");
      } finally {
        setIsConfigsLoading(false);
      }
    };
    
    loadStatusConfigurations();
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
    
    return status ? String(status.id) : null;
  };

  // Helper function to get status by ID
  const getStatusById = (statusId) => {
    if (!statusId || !statusConfigs.length) return null;
    return statusConfigs.find(config => config.id === statusId);
  };

  // Load groups from the specific ticket when dialog opens
  useEffect(() => {
    const loadTicketGroups = async () => {
      if (!showGroupDialog || !currentTicketForAssignment) return;
      
      setLoadingGroups(true);
      setSelectedGroup(null);
      setGroupUsers([]);
      setSelectedUsers([]);
      setSelectedUserEmails([]);
      
      try {
        // Get fresh ticket details to get the groups
        const ticketDetails = await getTicketDetails(currentTicketForAssignment.ticket_no);
        const ticketData = ticketDetails.ticket || ticketDetails;
        
        // Extract groups from this specific ticket
        const ticketGroupsData = ticketData.assigned_groups_detail || [];
        setTicketGroups(ticketGroupsData);
        
        // Set groups for display
        const formattedGroups = ticketGroupsData.map(group => ({
          id: group.id,
          name: group.name,
          members_count: group.members_count || 0,
          members: group.members || []
        }));
        
        setGroups(formattedGroups);
        
        console.log("Ticket groups loaded:", formattedGroups);
        
        // If there's only one group, auto-select it
        if (formattedGroups.length === 1) {
          handleGroupSelect(formattedGroups[0]);
        }
        
      } catch (error) {
        console.error("Failed to load ticket groups:", error);
        toast.error("Failed to load ticket groups");
      } finally {
        setLoadingGroups(false);
      }
    };
    
    loadTicketGroups();
  }, [showGroupDialog, currentTicketForAssignment]);

  // Only show New Assigned, Solved, and Closed cards
  const statusCards = [
    {
      id: "new_assigned",
      label: "New",
      color: "warning",
      icon: <NewReleasesIcon />,
      count: userStatus?.new_assigned || 0,
      description: "Tickets recently assigned to you",
    },
    {
      id: "solved",
      label: "Resolved",
      color: "success",
      icon: <DoneAllIcon />,
      count: userStatus?.solved || 0,
      description: "Tickets you have resolved",
    },
    {
      id: "Cancelled",
      label: "Cancelled",
      color: "error",
      icon: <CancelIcon />,
      count: userStatus?.cancelled || 0,
      description: "Cancelled tickets",
    },
    {
      id: "closed",
      label: "Closed",
      color: "info",
      icon: <LockIcon />,
      count: userStatus?.closed || 0,
      description: "Tickets that are completed",
    },
    {
      id: "clarification_applied",
      label: "Clar. Supplied",
      color: "primary",
      icon: <QuestionAnswerIcon sx={{ fontSize: { xs: 25, sm: 18, md: 25 } }} />,
      count: userStatus?.clarification_applied || 0,
    },
    {
      id: "clarification_required",
      label: "Clar. Required",
      color: "error",
      icon: <HelpOutlineIcon sx={{ fontSize: { xs: 25, sm: 18, md: 25 } }} />,
      count: userStatus?.clarification_required || 0,
    },
  ];

  const selectedTickets = useMemo(() => {
    const ticketsForType = tickets[selectedType];
    return Array.isArray(ticketsForType) ? ticketsForType : [];
  }, [tickets, selectedType]);

  const departmentList = useMemo(() => {
    if (!Array.isArray(selectedTickets)) return [];
    const departments = selectedTickets
      .map((row) => row?.department_detail?.field_name)
      .filter(Boolean);
    return [...new Set(departments)];
  }, [selectedTickets]);

  // Get initials for avatar
  const getInitials = (name) => {
    if (!name || name === "You") return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Group chats by date
  const groupedChats = useMemo(() => {
    const groups = {};
    followUpChats.forEach((msg) => {
      const date = new Date(msg.createdon).toLocaleDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(msg);
    });
    return Object.entries(groups)
      .map(([date, messages]) => ({
        date,
        messages: messages.sort(
          (a, b) => new Date(a.createdon) - new Date(b.createdon)
        ),
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [followUpChats]);

  // Headings for New Assigned, Solved, Closed
  const headingMap = {
    new_assigned: "New Assigned Tickets",
    pending: "Pending Tickets",
    solved: "Resolved Tickets",
    cancel: "Cancelled Tickets",
    closed: "Closed Tickets",
    clarification_applied: "Clarification Supplied Ticket",
    clarification_required: "Clarification Required Ticket",
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
    localStorage.setItem("selectedTicketId", ticketNo);
    navigate("/Approval");
  };

  // Fetch all messages and filter by ticket_no and between current user and receiver
  const fetchTicketMessages = async (ticketNo, currentUserId, receiverId) => {
    try {
      const allMessages = await fetchMessages();
      const filteredMessages = allMessages.filter(
        (msg) =>
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

  const sendFollowUpMessageHandler = async (text) => {
    if (!text.trim()) {
      toast.error("Message cannot be empty");
      return;
    }
    if (!assignee?.id || !currentChatTicket?.id || !currentUserId) {
      toast.error("Cannot send message: missing details");
      return;
    }

    const receiverId = assignee.id;
    const shouldProtect = isConfidentialTicket || isProtected;

    setSendingFollowUpMessage(true);
    try {
      await sendMessage({
        receiver: receiverId,
        ticket_no: currentChatTicket.id,
        message: text.trim(),
        protected: shouldProtect,
      });

      const messages = await fetchMessages();
      const ticketMsgs = messages.filter(
        (m) =>
          m.ticket_no == currentChatTicket.id &&
          ((m.sender === currentUserId && m.receiver === receiverId) ||
            (m.sender === receiverId && m.receiver === currentUserId))
      );

      setFollowUpChats(
        ticketMsgs.sort((a, b) => new Date(a.createdon) - new Date(b.createdon))
      );
      setNewFollowUpMessage("");

      if (!isConfidentialTicket) {
        setIsProtected(false);
      }

      toast.success(shouldProtect ? "Protected message sent!" : "Message sent!");
    } catch (err) {
      console.error("Send error:", err);
      toast.error("Failed to send message");
    } finally {
      setSendingFollowUpMessage(false);
    }
  };

  const handleResolveSolution = async () => {
    if (!currentChatTicket?.id) {
      toast.error("No ticket selected");
      return;
    }

    let currentTicketData = {};
    try {
      const ticketDetails = await getTicketDetails(currentChatTicket.id);
      currentTicketData = ticketDetails.ticket || ticketDetails;
    } catch (err) {
      toast.error("Could not fetch ticket details");
      return;
    }

    // Get New status ID dynamically
    const newStatusId = getStatusId("New");
    if (!newStatusId) {
      toast.error("New status not found in configurations");
      return;
    }

    try {
      const ticketNoStr = String(currentChatTicket.id);
      const assignedUsers =
        currentTicketData.assignees_detail ||
        currentTicketData.assigned_users ||
        [];
      const assignedGroups =
        currentTicketData.assigned_groups_detail ||
        currentTicketData.assigned_groups ||
        [];

      const formData = new FormData();
      formData.append("title", currentTicketData.title || "");
      formData.append("description", currentTicketData.description || "");
      formData.append(
        "category",
        currentTicketData.category || currentTicketData.category_detail?.id || ""
      );
      formData.append("status", newStatusId); // Use dynamic ID for New
      formData.append("resolved_status", "yes");

      let assignedTypeIndex = 0;
      assignedUsers.forEach((user, index) => {
        if (user?.email) {
          formData.append(`assignee[${index}]`, user.email);
        }
      });

      if (assignedUsers.length > 0) {
        formData.append(`assigned_to_type[${assignedTypeIndex}]`, "user");
        assignedTypeIndex++;
      }

      assignedGroups.forEach((group, index) => {
        if (group?.id) {
          formData.append(`assigned_group[${index}]`, group.id);
        }
      });

      if (assignedGroups.length > 0) {
        formData.append(`assigned_to_type[${assignedTypeIndex}]`, "group");
      }

      const result = await updateTicket(ticketNoStr, formData);
      if (!result.success) throw new Error(result.error || "Failed");

      toast.success("Solution resolved! Ticket status changed to New.");

      setTickets((prev) => {
        const ticket = prev.solved.find(
          (t) => t.ticket_no == currentChatTicket.id
        );
        if (!ticket) return prev;

        ticket.status_detail = { field_values: "New" };

        return {
          ...prev,
          solved: prev.solved.filter(
            (t) => t.ticket_no != currentChatTicket.id
          ),
          new_assigned: [ticket, ...prev.new_assigned],
        };
      });

      setIsResolved(true);
      setShowFollowUpChat(false);
      setSelectedType("new_assigned");

      await sendFollowUpMessageHandler(
        "I have resolved the solution. Ticket reopened as New if further action needed."
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to resolve solution");
    }
  };

  const handleApproveSolution = async () => {
    if (!currentChatTicket?.id) {
      toast.error("No ticket selected");
      return;
    }

    let currentTicketData = {};
    try {
      const ticketDetails = await getTicketDetails(currentChatTicket.id);
      currentTicketData = ticketDetails.ticket || ticketDetails;
    } catch (err) {
      console.error("Failed to fetch latest ticket details:", err);
      toast.error("Could not fetch ticket details");
      return;
    }

    // Get Closed status ID dynamically
    const closedStatusId = getStatusId("Closed");
    if (!closedStatusId) {
      toast.error("Closed status not found in configurations");
      return;
    }

    try {
      const ticketNoStr = String(currentChatTicket.id);
      const assignedUsers =
        currentTicketData.assignees_detail ||
        currentTicketData.assigned_users ||
        [];
      const assignedGroups =
        currentTicketData.assigned_groups_detail ||
        currentTicketData.assigned_groups ||
        [];

      const formData = new FormData();
      formData.append("title", currentTicketData.title || "");
      formData.append("description", currentTicketData.description || "");
      formData.append(
        "category",
        currentTicketData.category || currentTicketData.category_detail?.id || ""
      );
      formData.append("status", closedStatusId); // Use dynamic ID for Closed

      let assignedTypeIndex = 0;
      assignedUsers.forEach((user, index) => {
        if (user?.email) {
          formData.append(`assignee[${index}]`, user.email);
        }
      });

      if (assignedUsers.length > 0) {
        formData.append(`assigned_to_type[${assignedTypeIndex}]`, "user");
        assignedTypeIndex++;
      }

      assignedGroups.forEach((group, index) => {
        if (group?.id) {
          formData.append(`assigned_group[${index}]`, group.id);
        }
      });

      if (assignedGroups.length > 0) {
        formData.append(`assigned_to_type[${assignedTypeIndex}]`, "group");
      }

      const result = await updateTicket(ticketNoStr, formData);
      if (!result.success) {
        throw new Error(result.error || "Failed to close ticket");
      }

      toast.success("Solution approved and ticket closed successfully!");

      setIsApproved(true);
      setShowFollowUpChat(false);
      setSelectedType("closed");
    } catch (err) {
      console.error("Error closing ticket on approve:", err);
    }
  };

  const handleChatDrawerOpen = async (ticketNo) => {
    if (!ticketNo || !currentUserId) {
      toast.error("No ticket or user ID provided");
      return;
    }
    const ticket = selectedTickets.find((t) => t.ticket_no == ticketNo);
    if (!ticket) {
      toast.error("Ticket not found in current list");
      return;
    }
    setChatTab(0);
    setLoadingFollowUpChats(true);
    setShowFollowUpChat(true);
    setFollowUpChats([]);
    setIsSolvedTicket(false);
    setSolutionText("");
    setIsResolved(false);
    setIsApproved(false);
    try {
      const ticketDetails = await getTicketDetails(ticketNo);
      const ticketData = ticketDetails.ticket || ticketDetails;
      const assigneesDetails = ticketData.assignees_detail;
      if (!assigneesDetails || assigneesDetails.length === 0) {
        throw new Error("Assignee details not found");
      }
      const assigneeDetail = assigneesDetails[0];
      if (!assigneeDetail.id) {
        throw new Error("Assignee ID not found");
      }
      setAssignee(assigneeDetail);
      
      // Check if clarification is required using status configurations
      const clarificationRequiredId = getStatusId("Clarification Required");
      const clarificationRequired = ticketData.status === clarificationRequiredId || 
                                   ticketData.status_detail?.field_values === "Clarification Required";
      setClarificationRequested(clarificationRequired);

      setCurrentChatTicket({
        id: ticketNo,
        title: ticketData.title || ticket.title || "",
        description: ticketData.description || ticket.description || "",
      });

      const confidential =
        ticketData.confidential === true ||
        ticketData.confidential === "true";
      setIsConfidentialTicket(confidential);
      setIsProtected(confidential);

      const isCurrentlySolved =
        selectedType === "solved" ||
        ticketData.status_detail?.field_values === "Solved" ||
        ticketData.status === "Solved";

      if (isCurrentlySolved) {
        setIsSolvedTicket(true);
        setSolutionText(
          ticketData.solution_text ||
            ticketData.resolution_text ||
            "No solution details provided."
        );
        setChatTab(2);
      }

      if (selectedType === "solved") {
        setIsSolvedTicket(true);
        setSolutionText(
          ticketData.solution_text || ticketData.resolution_text || ""
        );
        setIsResolved(
          ticketData.resolved_status === "yes" ||
            ticketData.is_resolved ||
            false
        );
        setIsApproved(
          ticketData.approved_status === "yes" ||
            ticketData.is_approved ||
            false
        );
      }
      const receiverId = assigneeDetail.id;
      const ticketMessages = await fetchTicketMessages(
        ticketNo,
        currentUserId,
        receiverId
      );

      const sortedTicketMessages = ticketMessages.sort(
        (a, b) => new Date(a.createdon) - new Date(b.createdon)
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

  const handleSendClarification = async () => {
    if (!clarificationText.trim()) return;

    setSendingClarification(true);
    try {
      await sendMessage({
        receiver:
          currentUserId === assignee?.id
            ? currentChatTicket?.requested_by
            : assignee?.id,
        ticket_no: currentChatTicket.id,
        message: `[Clarification Required]\n\n${clarificationText.trim()}`,
        protected: false,
      });

      await sendFollowUpMessageHandler(
        `[Clarification Required] ${clarificationText.trim()}`
      );

      setClarificationText("");
      setClarificationSent(true);
      toast.success("Clarification required sent!");

      setChatTab(0);
      setTimeout(() => setClarificationSent(false), 5000);
    } catch (err) {
      toast.error("Failed to send clarification");
    } finally {
      setSendingClarification(false);
    }
  };

  const handleRequestClarification = async () => {
    if (!clarificationText.trim()) {
      toast.error("Please enter clarification details");
      return;
    }
    if (!currentChatTicket?.id) {
      toast.error("No ticket selected");
      return;
    }

    setSendingClarification(true);
    try {
      let currentTicketData = {};
      try {
        const ticketDetails = await getTicketDetails(currentChatTicket.id);
        currentTicketData = ticketDetails.ticket || ticketDetails;
      } catch (err) {
        toast.error("Could not fetch ticket details");
        return;
      }

      // Get Clarification Supplied status ID dynamically
      const clarificationSuppliedId = getStatusId("Clarification Supplied");
      if (!clarificationSuppliedId) {
        toast.error("Clarification Supplied status not found in configurations");
        return;
      }

      const ticketNoStr = String(currentChatTicket.id);
      const assignedUsers =
        currentTicketData.assignees_detail ||
        currentTicketData.assigned_users ||
        [];
      const assignedGroups =
        currentTicketData.assigned_groups_detail ||
        currentTicketData.assigned_groups ||
        [];

      const formData = new FormData();
      formData.append("title", currentTicketData.title || "");
      formData.append("description", currentTicketData.description || "");
      formData.append(
        "category",
        currentTicketData.category || currentTicketData.category_detail?.id || ""
      );
      formData.append("status", clarificationSuppliedId); // Use dynamic ID

      let assignedTypeIndex = 0;
      assignedUsers.forEach((user, index) => {
        if (user?.email) formData.append(`assignee[${index}]`, user.email);
      });
      if (assignedUsers.length > 0)
        formData.append(`assigned_to_type[${assignedTypeIndex++}]`, "user");

      assignedGroups.forEach((group, index) => {
        if (group?.id) formData.append(`assigned_group[${index}]`, group.id);
      });
      if (assignedGroups.length > 0)
        formData.append(`assigned_to_type[${assignedTypeIndex}]`, "group");

      const result = await updateTicket(ticketNoStr, formData);
      if (!result.success)
        throw new Error(result.error || "Failed to update ticket status");

      const clarificationMessage = `[Clarification Supplied]\n\n${clarificationText.trim()}`;
      await sendMessage({
        receiver: assignee?.id,
        ticket_no: currentChatTicket.id,
        message: clarificationMessage,
        protected: false,
      });

      const messages = await fetchMessages();
      const ticketMsgs = messages.filter(
        (m) =>
          m.ticket_no == currentChatTicket.id &&
          ((m.sender === currentUserId && m.receiver === assignee?.id) ||
            (m.sender === assignee?.id && m.receiver === currentUserId))
      );
      setFollowUpChats(
        ticketMsgs.sort((a, b) => new Date(a.createdon) - new Date(b.createdon))
      );

      toast.success("Clarification Supplied sent and ticket status updated!");

      setClarificationText("");
      setChatTab(0);
      window.location.reload();
    } catch (err) {
      console.error("Error requesting clarification:", err);
      toast.error("Failed to send clarification request");
    } finally {
      setSendingClarification(false);
    }
  };

  const handleChatDrawerClose = () => {
    setShowFollowUpChat(false);
    setCurrentChatTicket(null);
    setAssignee(null);
    setFollowUpChats([]);
    setLoadingFollowUpChats(false);
    setChatTab(0);
    setIsSolvedTicket(false);
    setSolutionText("");
    setIsResolved(false);
    setIsApproved(false);
    setClarificationText("");
    setClarificationSent(false);
  };

  // Group Assignment Functions
  const handleOpenGroupAssignment = (ticket) => {
    setCurrentTicketForAssignment(ticket);
    setSelectedGroup(null);
    setGroupUsers([]);
    setSelectedUsers([]);
    setSelectedUserEmails([]);
    setAssignmentMode("single");
    setShowGroupDialog(true);
  };

  const handleCloseGroupDialog = () => {
    setShowGroupDialog(false);
    setSelectedGroup(null);
    setGroupUsers([]);
    setSelectedUsers([]);
    setSelectedUserEmails([]);
    setCurrentTicketForAssignment(null);
    setTicketGroups([]);
  };

  const handleGroupSelect = async (group) => {
    setSelectedGroup(group);
    setSelectedUsers([]);
    setSelectedUserEmails([]);
    
    // Use members from group data if available
    if (group.members && group.members.length > 0) {
      setGroupUsers(group.members);
    } else {
      // If no members in group data, show empty state
      setGroupUsers([]);
      toast.info("No members found in this group");
    }
  };

  const handleUserToggle = (user) => {
    const userId = user.id;
    const userEmail = user.email;
    
    if (assignmentMode === "single") {
      setSelectedUsers([userId]);
      setSelectedUserEmails([userEmail]);
    } else {
      setSelectedUsers((prev) => {
        if (prev.includes(userId)) {
          // Remove user
          setSelectedUserEmails(prevEmails => prevEmails.filter(email => email !== userEmail));
          return prev.filter((id) => id !== userId);
        } else {
          // Add user
          setSelectedUserEmails(prevEmails => [...prevEmails, userEmail]);
          return [...prev, userId];
        }
      });
    }
  };

  const handleAssignUsers = async () => {
    if (!currentTicketForAssignment || selectedUsers.length === 0) {
      toast.error("Please select at least one user to assign");
      return;
    }

    try {
      const ticketNoStr = String(currentTicketForAssignment.ticket_no);
      
      // Get current ticket details
      let currentTicketData = {};
      try {
        const ticketDetails = await getTicketDetails(ticketNoStr);
        currentTicketData = ticketDetails.ticket || ticketDetails;
      } catch (err) {
        toast.error("Could not fetch ticket details");
        return;
      }

      // Get current status ID
      const currentStatusId = currentTicketData.status || "41";
      
      // Prepare form data for updating ticket
      const formData = new FormData();
      formData.append("title", currentTicketData.title || "");
      formData.append("description", currentTicketData.description || "");
      formData.append(
        "category",
        currentTicketData.category || currentTicketData.category_detail?.id || ""
      );
      
      // Keep current status
      formData.append("status", currentStatusId);
      
      // Add selected user emails as assignees
      selectedUserEmails.forEach((email, index) => {
        formData.append(`assignee[${index}]`, email);
      });

      // Keep existing assigned groups from this ticket
      ticketGroups.forEach((group, index) => {
        if (group?.id) {
          formData.append(`assigned_group[${index}]`, group.id);
        }
      });

      // Set assigned_to_type
      let assignedTypeIndex = 0;
      if (selectedUserEmails.length > 0) {
        formData.append(`assigned_to_type[${assignedTypeIndex}]`, "user");
        assignedTypeIndex++;
      }
      if (ticketGroups.length > 0) {
        formData.append(`assigned_to_type[${assignedTypeIndex}]`, "group");
      }

      console.log("Assigning users to ticket:", selectedUserEmails);
      console.log("Ticket groups:", ticketGroups);
      console.log("FormData entries:", [...formData.entries()]);

      const result = await updateTicket(ticketNoStr, formData);
      if (!result.success) {
        throw new Error(result.error || "Failed to assign users");
      }

      toast.success(
        `Successfully assigned ${selectedUsers.length} user(s) to ticket #${currentTicketForAssignment.ticket_no}`
      );

      // Update the specific ticket in state
      if (result.ticket || result.updatedTicket) {
        const updatedTicket = result.ticket || result.updatedTicket;
        setTickets((prev) => ({
          ...prev,
          [selectedType]: prev[selectedType].map((t) =>
            t.ticket_no === currentTicketForAssignment.ticket_no
              ? { ...t, assignees_detail: updatedTicket.assignees_detail || [] }
              : t
          ),
        }));
      }

      handleCloseGroupDialog();
      
      // Refresh the ticket list
      if (userStatus) {
        // Trigger a refresh of user status data
        window.location.reload();
      }
    } catch (error) {
      console.error("Assignment error:", error);
      toast.error("Failed to assign users: " + (error.message || "Unknown error"));
    }
  };

  const filteredRows = useMemo(() => {
    const searchLower = search.toLowerCase().trim();

    if (!searchLower && !department) {
      return selectedTickets;
    }

    return selectedTickets
      .filter((row) => {
        const matchesDept = department
          ? row.department_detail?.field_name === department
          : true;

        if (!searchLower) return matchesDept;

        if (String(row.ticket_no || "").toLowerCase().includes(searchLower))
          return true;
        if (row.title?.toLowerCase().includes(searchLower)) return true;
        if (row.description?.toLowerCase().includes(searchLower)) return true;
        if (
          row.status_detail?.field_values
            ?.toLowerCase()
            .includes(searchLower)
        )
          return true;
        if (
          row.priority_detail?.field_values
            ?.toLowerCase()
            .includes(searchLower)
        )
          return true;
        if (
          row.category_detail?.category_name
            ?.toLowerCase()
            .includes(searchLower)
        )
          return true;
        if (
          row.subcategory_detail?.subcategory_name
            ?.toLowerCase()
            .includes(searchLower)
        )
          return true;
        if (
          row.department_detail?.field_name
            ?.toLowerCase()
            .includes(searchLower)
        )
          return true;
        if (
          row.location_detail?.field_name
            ?.toLowerCase()
            .includes(searchLower)
        )
          return true;
        if (
          row.requested_detail?.email?.toLowerCase().includes(searchLower)
        )
          return true;
        if (
          row.requested_detail?.name?.toLowerCase().includes(searchLower)
        )
          return true;

        const openDate = new Date(row.created_date)
          .toLocaleDateString()
          .toLowerCase();
        const updateDate = new Date(row.updated_date)
          .toLocaleDateString()
          .toLowerCase();
        if (openDate.includes(searchLower) || updateDate.includes(searchLower))
          return true;

        return false;
      })
      .filter((row) => {
        return department
          ? row.department_detail?.field_name === department
          : true;
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
    Critical: "#D32F2F",
    "Very High": "#b43d3bff",
    High: "#FB8C00",
    Medium: "#FDD835",
    Low: "#43A047",
    "Very Low": "#1E88E5",
  };

  const statusColors = {
    Pending: "#EF6C00",
    Approved: "#2E7D32",
    "On Hold": "#1565C0",
    Rejected: "#C62828",
    "SLA Breached": "#F9A825",
    Solved: "#2E7D32",
    Closed: "#757575",
    Cancelled: "#9E9E9E",
    "Clarification Required": "#FB8C00",
    "Clarification Supplied": "#2196F3",
    New: "#EF6C00",
  };

  // Loading configurations check
  if (isConfigsLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading status configurations...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", mb: 2 }}>
      <Grid container spacing={1} sx={{ mb: 2 }}>
        {statusCards.map((item) => (
          <Grid size={{ xs: 6, sm: 6, md: 4, lg: 2 }} key={item.id}>
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
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    width: { xs: 40, sm: 40, md: 40 },
                    height: { xs: 40, sm: 40, md: 40 },
                    minWidth: 40,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 2,
                    bgcolor: `${item.color}.main`,
                    color: "#fff",
                  }}
                >
                  <Icon sx={{ fontSize: { xs: 25, sm: 18, md: 25 } }}>
                    {item.icon}
                  </Icon>
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
                  justifyContent:
                    !isMobile || !isTablet ? "space-between" : undefined,
                  alignItems: isMobile ? "flex-start" : "center",
                  mb: 1,
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
                    mt: isTablet ? 1.5 : 0,
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
                      },
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Department"
                        size="small"
                        variant="outlined"
                      />
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
                      },
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
                        backgroundColor: "#667eea10",
                      },
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
                        <Card sx={{ mb: 2, borderRadius: 2 }} key={t.id}>
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
                            <Tooltip title={t.title} arrow placement="top">
                              <Typography
                                sx={{
                                  maxWidth: 200,
                                  color: "text.secondary",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  cursor: "pointer",
                                  mt: 0.5,
                                }}
                              >
                                {t.title}
                              </Typography>
                            </Tooltip>
                            <Tooltip title={t.description || "No description"} arrow placement="top">
                              <Typography
                                sx={{
                                  maxWidth: 200,
                                  color: "text.secondary",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  cursor: "pointer",
                                  mt: 0.5,
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
                              <Tooltip title="Assign from Groups">
                                <IconButton
                                  onClick={() => handleOpenGroupAssignment(t)}
                                  size="small"
                                  sx={{ color: "#4CAF50" }}
                                >
                                  <GroupIcon />
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
                            .map((t) => (
                              <TableRow
                                key={t.id}
                                hover
                                sx={{
                                  "&:hover": { backgroundColor: "#F7FAFC" },
                                  "&:last-child td": { borderBottom: 0 },
                                }}
                              >
                                <TableCell sx={{ color: "#667eea", fontWeight: 600 }}>
                                  #{t.ticket_no}
                                </TableCell>
                                <TableCell>
                                  <Tooltip title={t.title} arrow placement="top">
                                    <Typography
                                      sx={{
                                        maxWidth: 200,
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
                                    {t.status_detail?.field_values}
                                  </Typography>
                                  <Typography fontSize="0.85rem">
                                    {t.priority_detail?.field_values}
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
                                    {t.department_detail?.field_name}
                                  </Typography>
                                  <Typography fontSize="0.85rem">
                                    {t.location_detail?.field_name}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography fontSize="0.85rem">
                                    {t.requested_detail?.email}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography fontSize="0.85rem">
                                    {new Date(t.created_date).toLocaleDateString()}
                                  </Typography>
                                  <Typography fontSize="0.85rem">
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
                                    <Tooltip title="Assign from Groups">
                                      <IconButton
                                        onClick={() => handleOpenGroupAssignment(t)}
                                        size="small"
                                        sx={{ color: "#4CAF50" }}
                                      >
                                        <GroupIcon />
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

      {/* Group Assignment Dialog - FIXED LAYOUT */}
      <Dialog
        open={showGroupDialog}
        onClose={handleCloseGroupDialog}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            maxHeight: '80vh',
            display: 'flex',
            flexDirection: 'column'
          }
        }}
      >
        <DialogTitle sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'primary.main', color: 'white' }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <GroupIcon sx={{ color: 'white' }} />
            <Box>
              <Typography variant="h6" component="div">
                Assign Users from Groups
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                <Typography variant="body2">
                  Ticket #{currentTicketForAssignment?.ticket_no}
                </Typography>
                <Typography variant="caption">
                  • {currentTicketForAssignment?.title}
                </Typography>
              </Box>
            </Box>
          </Box>
        </DialogTitle>

        <DialogContent dividers sx={{ flex: 1, overflow: 'hidden', p: 0 }}>
          {loadingGroups ? (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: '100%' }}>
              <CircularProgress />
              <Typography sx={{ ml: 2 }}>Loading groups for this ticket...</Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
              {/* Left Panel: Groups List */}
              <Paper 
                elevation={0} 
                sx={{ 
                  width: '35%', 
                  borderRight: '1px solid', 
                  borderColor: 'divider',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden'
                }}
              >
                <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'grey.50' }}>
                  <Typography variant="h6" sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                    <PeopleIcon color="primary" /> Groups in Ticket
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Select a group to view members
                    </Typography>
                    <Chip 
                      label={`${groups.length} group(s)`} 
                      size="small" 
                      color="primary" 
                      variant="outlined" 
                    />
                  </Box>
                </Box>

                <Box sx={{ flex: 1, overflow: 'auto', p: 1 }}>
                  {groups.length > 0 ? (
                    <List sx={{ p: 0 }}>
                      {groups.map((group) => (
                        <ListItemButton
                          key={group.id}
                          selected={selectedGroup?.id === group.id}
                          onClick={() => handleGroupSelect(group)}
                          sx={{
                            borderRadius: 1,
                            mb: 1,
                            p: 1.5,
                            "&.Mui-selected": {
                              backgroundColor: 'primary.light',
                              color: 'primary.contrastText',
                              "&:hover": {
                                backgroundColor: 'primary.light',
                              },
                              "& .MuiListItemText-primary": {
                                color: 'primary.contrastText',
                                fontWeight: 'bold'
                              },
                              "& .MuiListItemText-secondary": {
                                color: 'primary.contrastText',
                                opacity: 0.9
                              },
                              "& .MuiAvatar-root": {
                                backgroundColor: 'white',
                                color: 'primary.main'
                              }
                            },
                          }}
                        >
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: selectedGroup?.id === group.id ? 'white' : 'primary.main' }}>
                              {group.name.charAt(0).toUpperCase()}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Typography variant="body1" fontWeight="medium">
                                {group.name}
                              </Typography>
                            }
                            secondary={`${group.members_count || 0} members`}
                          />
                          <Badge 
                            badgeContent={group.members_count || 0} 
                            color="primary" 
                            sx={{ 
                              '& .MuiBadge-badge': {
                                backgroundColor: selectedGroup?.id === group.id ? 'white' : 'primary.main',
                                color: selectedGroup?.id === group.id ? 'primary.main' : 'white'
                              }
                            }}
                          />
                        </ListItemButton>
                      ))}
                    </List>
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 6 }}>
                      <GroupIcon sx={{ fontSize: 60, color: 'grey.400', mb: 2 }} />
                      <Typography color="text.secondary" gutterBottom>
                        No groups assigned to this ticket
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        This ticket doesn't have any groups assigned yet.
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Paper>

              {/* Right Panel: Users in Selected Group */}
              <Paper 
                elevation={0} 
                sx={{ 
                  width: '65%', 
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden'
                }}
              >
                {selectedGroup ? (
                  <>
                    <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'grey.50' }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Box>
                          <Typography variant="h6">
                            Users in {selectedGroup.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Select users to assign to this ticket
                          </Typography>
                        </Box>

                        <FormControl component="fieldset" size="small">
                          <FormLabel component="legend" sx={{ mb: 1, fontSize: '0.875rem', color: 'text.primary' }}>
                            Assignment Mode
                          </FormLabel>
                          <RadioGroup
                            row
                            value={assignmentMode}
                            onChange={(e) => {
                              setAssignmentMode(e.target.value);
                              if (e.target.value === "single" && selectedUsers.length > 1) {
                                const firstUser = groupUsers.find(u => u.id === selectedUsers[0]);
                                setSelectedUsers(selectedUsers.slice(0, 1));
                                setSelectedUserEmails(firstUser?.email ? [firstUser.email] : []);
                              }
                            }}
                          >
                            <FormControlLabel 
                              value="single" 
                              control={<Radio size="small" />} 
                              label="Single User" 
                            />
                            <FormControlLabel 
                              value="multiple" 
                              control={<Radio size="small" />} 
                              label="Multiple Users" 
                            />
                          </RadioGroup>
                        </FormControl>
                      </Box>
                    </Box>

                    {groupUsers.length > 0 ? (
                      <>
                        <Box sx={{ flex: 1, overflow: 'auto', p: 1 }}>
                          <List sx={{ p: 0 }}>
                            {groupUsers.map((user) => (
                              <ListItem
                                key={user.id}
                                secondaryAction={
                                  <Checkbox
                                    edge="end"
                                    checked={selectedUsers.includes(user.id)}
                                    onChange={() => handleUserToggle(user)}
                                    disabled={
                                      assignmentMode === "single" &&
                                      selectedUsers[0] !== user.id &&
                                      selectedUsers.length > 0
                                    }
                                    color="primary"
                                  />
                                }
                                sx={{ 
                                  px: 2,
                                  py: 1.5,
                                  mb: 1,
                                  borderRadius: 1,
                                  border: '1px solid',
                                  borderColor: 'divider',
                                  bgcolor: selectedUsers.includes(user.id) ? 'primary.light' : 'transparent',
                                  '&:hover': {
                                    bgcolor: selectedUsers.includes(user.id) ? 'primary.light' : 'action.hover',
                                  }
                                }}
                              >
                                <ListItemAvatar>
                                  <Avatar sx={{ bgcolor: "secondary.main" }}>
                                    {getInitials(user.name || user.email)}
                                  </Avatar>
                                </ListItemAvatar>
                                <ListItemText 
                                  primary={
                                    <Typography variant="body1" fontWeight="medium">
                                      {user.name || user.email}
                                    </Typography>
                                  } 
                                  secondary={
                                    <Box>
                                      <Typography variant="body2" color="text.secondary">
                                        {user.email}
                                      </Typography>
                                      {user.name && user.name !== user.email && (
                                        <Typography variant="caption" color="text.secondary">
                                          ID: {user.id}
                                        </Typography>
                                      )}
                                    </Box>
                                  } 
                                />
                              </ListItem>
                            ))}
                          </List>
                        </Box>

                        <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'grey.50' }}>
                          <Typography variant="body2" color="text.secondary">
                            <strong>Selected:</strong> {selectedUsers.length} user(s)
                            {selectedUsers.length > 0 && (
                              <Box sx={{ mt: 1 }}>
                                <Typography variant="caption" component="div" color="primary">
                                  {assignmentMode === "multiple" 
                                    ? "Multiple users will be assigned to this ticket"
                                    : "Single user assignment mode"}
                                </Typography>
                                <Typography variant="caption" component="div" color="text.primary" sx={{ mt: 0.5 }}>
                                  <strong>Selected emails:</strong> {selectedUserEmails.join(', ')}
                                </Typography>
                              </Box>
                            )}
                          </Typography>
                        </Box>
                      </>
                    ) : (
                      <Box sx={{ textAlign: 'center', py: 6, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <PersonAddIcon sx={{ fontSize: 60, color: 'grey.400', mb: 2 }} />
                        <Typography color="text.secondary" gutterBottom>
                          No users found in this group
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          The group "{selectedGroup.name}" doesn't have any members or member data is not available.
                        </Typography>
                      </Box>
                    )}
                  </>
                ) : groups.length > 0 ? (
                  <Box sx={{ textAlign: 'center', py: 6, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <GroupIcon sx={{ fontSize: 60, color: 'grey.400', mb: 2 }} />
                    <Typography color="text.secondary" gutterBottom>
                      Select a group to view its members
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Click on a group from the left panel to see its members and assign them to this ticket.
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 6, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <GroupIcon sx={{ fontSize: 60, color: 'grey.400', mb: 2 }} />
                    <Typography color="text.secondary" gutterBottom>
                      No groups available
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      This ticket doesn't have any groups assigned. Groups must be assigned to the ticket first.
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ borderTop: 1, borderColor: 'divider', p: 2 }}>
          <Button onClick={handleCloseGroupDialog} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleAssignUsers}
            variant="contained"
            disabled={selectedUsers.length === 0 || loadingGroups}
            startIcon={<PersonAddIcon />}
            sx={{ minWidth: 120 }}
          >
            {loadingGroups ? (
              <CircularProgress size={20} />
            ) : (
              `Assign ${selectedUsers.length > 0 ? `(${selectedUsers.length})` : ''}`
            )}
          </Button>
        </DialogActions>
      </Dialog>

      <Drawer
        anchor="right"
        open={showFollowUpChat}
        onClose={handleChatDrawerClose}
        PaperProps={{ sx: { width: { xs: "100%", sm: 500 } } }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            bgcolor: "background.paper",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              p: 2,
              bgcolor: "primary.main",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <Typography variant="body2">Ticket #{currentChatTicket?.id}</Typography>
              <Typography variant="body2">{currentChatTicket?.title}</Typography>
              <Typography variant="caption" sx={{ color: "white" }}>
                {currentChatTicket?.description}
              </Typography>
            </Box>
            <IconButton onClick={() => setShowFollowUpChat(false)} sx={{ color: "white" }}>
              <CloseIcon />
            </IconButton>
          </Box>
          
          {/* Tab Buttons */}
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs value={chatTab} onChange={(e, v) => setChatTab(v)} centered>
              <Tab label="Follow-up" icon={<ChatIcon />} />
              <Tab
                label="Clarification Supplied"
                icon={<QuestionAnswerIcon />}
                disabled={
                  isSolvedTicket ||
                  selectedType === "closed" ||
                  selectedType === "Cancelled" ||
                  selectedType === "clarification_applied"
                }
              />
              <Tab
                label="Solution"
                icon={<DoneAllIcon />}
                disabled={
                  !isSolvedTicket ||
                  selectedType === "closed" ||
                  selectedType === "Cancelled" ||
                  selectedType === "clarification_applied" ||
                  selectedType === "clarification_required"
                }
              />
            </Tabs>
          </Box>
          
          {/* Tab Content */}
          <Box sx={{ flex: 1 }}>
            {chatTab === 0 && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                {/* Messages Area */}
                <Box
                  sx={{
                    flex: 1,
                    overflowY: "auto",
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  {loadingFollowUpChats ? (
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                      <CircularProgress />
                    </Box>
                  ) : groupedChats.length === 0 ? (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                        color: "text.secondary",
                      }}
                    >
                      <ChatIcon sx={{ fontSize: 60, mb: 2, opacity: 0.5 }} />
                      <Typography>No messages yet. Start the conversation!</Typography>
                    </Box>
                  ) : (
                    groupedChats.map((group) => (
                      <Box key={group.date} sx={{ mb: 3 }}>
                        <Divider sx={{ my: 2, width: "100%" }}>
                          <Chip label={group.date} size="small" sx={{ bgcolor: "grey.200" }} />
                        </Divider>
                        {group.messages.map((msg, index) => {
                          const msgId = msg.id || `msg-${index}`;
                          const isMe = Number(msg.sender) === Number(currentUserId);
                          const isProtectedMsg = msg.protected === true;
                          const isRevealed = revealedMessages.has(msgId);
                          const canReveal =
                            Number(msg.sender) === Number(currentUserId) ||
                            Number(msg.receiver) === Number(currentUserId);

                          const toggleReveal = () => {
                            if (!canReveal) return;
                            setRevealedMessages((prev) => {
                              const newSet = new Set(prev);
                              newSet.has(msgId) ? newSet.delete(msgId) : newSet.add(msgId);
                              return newSet;
                            });
                          };

                          const getText = () => {
                            if (!isProtectedMsg) return msg.message || "";
                            if (!canReveal)
                              return "*** PROTECTED MESSAGE - VISIBLE ONLY TO PARTICIPANTS ***";
                            const real = msg.decrypted_message || msg.message;
                            return isRevealed ? real : "Protected Message (click eye to reveal)";
                          };

                          return (
                            <Box key={msgId} sx={{ display: "flex", justifyContent: isMe ? "flex-end" : "flex-start", mb: 2 }}>
                              {!isMe ? (
                                <Box sx={{ display: "flex", alignItems: "flex-end", gap: 1, maxWidth: "80%" }}>
                                  <Avatar sx={{ width: 40, height: 40, bgcolor: "grey.300" }}>
                                    {getInitials(assignee?.name)}
                                  </Avatar>
                                  <Box sx={{ position: "relative", bgcolor: "grey.100", p: 2, borderRadius: 2, boxShadow: 1 }}>
                                    {isProtectedMsg && (
                                      <SecurityIcon
                                        sx={{
                                          position: "absolute",
                                          top: -10,
                                          right: -10,
                                          fontSize: 20,
                                          bgcolor: "#4CAF50",
                                          color: "white",
                                          borderRadius: "50%",
                                          p: 0.5,
                                        }}
                                      />
                                    )}
                                    <Typography variant="body1" sx={{ wordBreak: "break-word" }}>
                                      {getText()}
                                    </Typography>
                                    {isProtectedMsg && canReveal && (
                                      <IconButton size="small" onClick={toggleReveal} sx={{ position: "absolute", bottom: 6, right: 8 }}>
                                        {isRevealed ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                                      </IconButton>
                                    )}
                                    <Typography variant="caption" sx={{ display: "block", mt: 1, color: "text.secondary" }}>
                                      {new Date(msg.createdon).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} •{" "}
                                      {assignee?.name || "Assignee"}
                                    </Typography>
                                  </Box>
                                </Box>
                              ) : (
                                <Box sx={{ display: "flex", alignItems: "flex-end", gap: 1, flexDirection: "row-reverse", maxWidth: "80%" }}>
                                  <Avatar sx={{ width: 40, height: 40, bgcolor: "primary.main", color: "white" }}>
                                    {getInitials(currentUserName)}
                                  </Avatar>
                                  <Box sx={{ position: "relative", bgcolor: "primary.main", color: "white", p: 2, borderRadius: 2, boxShadow: 1 }}>
                                    {isProtectedMsg && (
                                      <SecurityIcon
                                        sx={{
                                          position: "absolute",
                                          top: -10,
                                          left: -10,
                                          fontSize: 20,
                                          bgcolor: "#4CAF50",
                                          color: "white",
                                          borderRadius: "50%",
                                          p: 0.5,
                                        }}
                                      />
                                    )}
                                    <Typography variant="body1" sx={{ wordBreak: "break-word" }}>
                                      {getText()}
                                    </Typography>
                                    {isProtectedMsg && canReveal && (
                                      <IconButton
                                        size="small"
                                        onClick={toggleReveal}
                                        sx={{ position: "absolute", bottom: 6, right: 8, color: "white", bgcolor: "rgba(255,255,255,0.2)" }}
                                      >
                                        {isRevealed ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                                      </IconButton>
                                    )}
                                    <Typography variant="caption" sx={{ display: "block", mt: 1, opacity: 0.8 }}>
                                      {new Date(msg.createdon).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} • You
                                    </Typography>
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
                
                {/* Message Input */}
                <Box
                  sx={{
                    p: 2,
                    borderTop: 1,
                    borderColor: "divider",
                    bgcolor: "background.default",
                  }}
                >
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Type your message..."
                      value={newFollowUpMessage}
                      onChange={(e) => setNewFollowUpMessage(e.target.value)}
                      disabled={sendingFollowUpMessage || !assignee}
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          sendFollowUpMessageHandler(newFollowUpMessage);
                        }
                      }}
                      multiline
                      maxRows={4}
                    />
                    <Tooltip
                      title={
                        isConfidentialTicket
                          ? "All messages are protected (Confidential Ticket)"
                          : isProtected
                          ? "Protected mode ON"
                          : "Click to send this message protected"
                      }
                    >
                      <span>
                        <IconButton
                          onClick={() => {
                            if (!isConfidentialTicket) {
                              setIsProtected(!isProtected);
                            }
                          }}
                          disabled={isConfidentialTicket}
                          sx={{
                            color: isProtected || isConfidentialTicket ? "white" : "success.main",
                            bgcolor: isProtected || isConfidentialTicket ? "success.main" : "transparent",
                            border: "1px solid",
                            "&:hover": {
                              bgcolor: isProtected || isConfidentialTicket ? "success.dark" : "success.light",
                            },
                          }}
                        >
                          <SecurityIcon />
                        </IconButton>
                      </span>
                    </Tooltip>
                    <IconButton
                      onClick={() => sendFollowUpMessageHandler(newFollowUpMessage)}
                      disabled={!newFollowUpMessage.trim() || sendingFollowUpMessage || !assignee}
                      color="primary"
                      sx={{ alignSelf: "flex-end" }}
                    >
                      {sendingFollowUpMessage ? <CircularProgress size={20} /> : <SendIcon />}
                    </IconButton>
                  </Box>
                  {(isProtected || isConfidentialTicket) && (
                    <Typography variant="caption" color="success.main" sx={{ mt: 1, display: "block", textAlign: "center" }}>
                      <SecurityIcon fontSize="small" sx={{ verticalAlign: "middle", mr: 0.5 }} />
                      {isConfidentialTicket
                        ? "All messages are protected (Confidential Ticket)"
                        : "This message will be sent as protected"}
                    </Typography>
                  )}
                </Box>
              </Box>
            )}
            {chatTab === 1 && (
              <Box sx={{ display: "flex", flexDirection: "column", p: 3 }}>
                {clarificationRequested ? (
                  <Box sx={{ textAlign: "center", flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <HelpOutlineIcon sx={{ fontSize: 80, color: "warning.main", mb: 2 }} />
                    <Typography variant="h6" fontWeight={600}>
                      Clarification Request Already Sent
                    </Typography>
                    <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>
                      Waiting for the assignee to respond.
                    </Typography>
                    <Button variant="outlined" onClick={() => setChatTab(0)}>
                      Back to Follow-up
                    </Button>
                  </Box>
                ) : isSolvedTicket ? (
                  <Box sx={{ textAlign: "center", flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <DoneAllIcon sx={{ fontSize: 80, color: "success.main", mb: 2 }} />
                    <Typography variant="h6" fontWeight={600}>
                      Ticket Already Solved
                    </Typography>
                    <Typography color="text.secondary" sx={{ mt: 1 }}>
                      Cannot request clarification on solved tickets.
                    </Typography>
                    <Button variant="outlined" onClick={() => setChatTab(0)}>
                      Back to Follow-up
                    </Button>
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
                      <QuestionAnswerIcon sx={{ fontSize: 60, color: "primary.main", mb: 2 }} />
                      <Typography variant="h6" fontWeight={600}>
                        Clarification Supplied
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
                        startIcon={sendingClarification ? <CircularProgress size={20} /> : <QuestionAnswerIcon />}
                        onClick={handleRequestClarification}
                        disabled={!clarificationText.trim() || sendingClarification || isConfigsLoading}
                      >
                        Send Request
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => {
                          setClarificationText("");
                          setChatTab(0);
                        }}
                        disabled={sendingClarification}
                      >
                        Cancel
                      </Button>
                    </Box>
                  </>
                )}
              </Box>
            )}
            {chatTab === 2 && isSolvedTicket && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  p: 4,
                  gap: 2,
                  textAlign: "center",
                }}
              >
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
                    color="error"
                    onClick={handleResolveSolution}
                    disabled={isResolved || isConfigsLoading}
                    size="small"
                  >
                    {isResolved ? "Rejected" : "Rejected"}
                  </Button>
                  <Button
                    variant={isApproved ? "contained" : "outlined"}
                    color="success"
                    onClick={handleApproveSolution}
                    disabled={isApproved || isConfigsLoading}
                    size="small"
                  >
                    {isApproved ? "Accepted" : "Accepted"}
                  </Button>
                </Box>
                <Button variant="outlined" onClick={() => setChatTab(0)} sx={{ mt: 1 }}>
                  Back
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export default RequestTabs;

// import { useState, useEffect, useMemo } from "react";
// import { useTheme } from "@mui/material/styles";
// import {
//   Box,
//   Card,
//   CardContent,
//   Typography,
//   Grid,
//   TextField,
//   Button,
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
//   TableContainer,
//   useMediaQuery,
//   Autocomplete,
//   Stack,
//   Pagination,
//   Tooltip,
//   IconButton,
//   Icon,
//   Drawer,
//   CircularProgress,
//   Divider,
//   Chip,
//   Avatar,
//   Tabs,
//   Tab,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   List,
//   ListItem,
//   ListItemAvatar,
//   ListItemText,
//   ListItemButton,
//   Checkbox,
//   Radio,
//   RadioGroup,
//   FormControlLabel,
//   FormControl,
//   FormLabel,
//   Badge,
//   Paper,
// } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
// import CloseIcon from "@mui/icons-material/Close";
// import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
// import SecurityIcon from "@mui/icons-material/Security";
// import NewReleasesIcon from "@mui/icons-material/NewReleases";
// import DoneAllIcon from "@mui/icons-material/DoneAll";
// import CancelIcon from "@mui/icons-material/Cancel";
// import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
// import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
// import LockIcon from "@mui/icons-material/Lock";
// import PeopleIcon from "@mui/icons-material/People";
// import GroupIcon from "@mui/icons-material/Group";
// import PersonAddIcon from "@mui/icons-material/PersonAdd";
// import {
//   Chat as ChatIcon,
//   Send as SendIcon,
// } from "@mui/icons-material";
// import { toast } from "react-toastify";
// import {
//   fetchMessages,
//   sendMessage,
//   getTicketDetails,
//   updateTicket,
// } from "../../Api";

// const RequestTabs = ({ userStatus }) => {
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
//     Cancelled: [],
//     clarification_applied: [],
//     clarification_required: [],
//   });
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);
  
//   // Chat/follow-up states
//   const [showFollowUpChat, setShowFollowUpChat] = useState(false);
//   const [followUpChats, setFollowUpChats] = useState([]);
//   const [loadingFollowUpChats, setLoadingFollowUpChats] = useState(false);
//   const [newFollowUpMessage, setNewFollowUpMessage] = useState("");
//   const [sendingFollowUpMessage, setSendingFollowUpMessage] = useState(false);
//   const [currentChatTicket, setCurrentChatTicket] = useState(null);
//   const [assignee, setAssignee] = useState(null);
//   const [currentUserId, setCurrentUserId] = useState(null);
//   const [currentUserName, setCurrentUserName] = useState("You");
  
//   // Tab state for chat drawer
//   const [chatTab, setChatTab] = useState(0);
  
//   // Solved ticket solution states
//   const [isSolvedTicket, setIsSolvedTicket] = useState(false);
//   const [solutionText, setSolutionText] = useState("");
//   const [isResolved, setIsResolved] = useState(false);
//   const [isApproved, setIsApproved] = useState(false);
//   const [clarificationRequested, setClarificationRequested] = useState(false);
//   const [isProtected, setIsProtected] = useState(false);
  
//   const [revealedMessages, setRevealedMessages] = useState(new Set());
//   const [myProtectedMessages, setMyProtectedMessages] = useState({});
//   const [clarificationText, setClarificationText] = useState("");
//   const [clarificationSent, setClarificationSent] = useState(false);
//   const [sendingClarification, setSendingClarification] = useState(false);
//   const [isConfidentialTicket, setIsConfidentialTicket] = useState(false);
  
//   // Group and user assignment states
//   const [groups, setGroups] = useState([]);
//   const [loadingGroups, setLoadingGroups] = useState(false);
//   const [showGroupDialog, setShowGroupDialog] = useState(false);
//   const [selectedGroup, setSelectedGroup] = useState(null);
//   const [groupUsers, setGroupUsers] = useState([]);
//   const [selectedUsers, setSelectedUsers] = useState([]);
//   const [selectedUserEmails, setSelectedUserEmails] = useState([]);
//   const [assignmentMode, setAssignmentMode] = useState("single");
//   const [currentTicketForAssignment, setCurrentTicketForAssignment] = useState(null);
//   const [ticketGroups, setTicketGroups] = useState([]);

//   useEffect(() => {
//     if (userStatus) {
//       setTickets({
//         new_assigned: Array.isArray(userStatus.new_assigned_tickets)
//           ? userStatus.new_assigned_tickets
//           : [],
//         solved: Array.isArray(userStatus.solved_tickets)
//           ? userStatus.solved_tickets
//           : [],
//         closed: Array.isArray(userStatus.closed_tickets)
//           ? userStatus.closed_tickets
//           : [],
//         Cancelled: Array.isArray(userStatus.cancelled_tickets)
//           ? userStatus.cancelled_tickets
//           : [],
//         clarification_required: Array.isArray(
//           userStatus.clarification_required_tickets
//         )
//           ? userStatus.clarification_required_tickets
//           : [],
//         clarification_applied: Array.isArray(
//           userStatus.clarification_applied_tickets
//         )
//           ? userStatus.clarification_applied_tickets
//           : [],
//       });
//     }
//   }, [userStatus]);

//   // Get current user ID and name on component mount
//   useEffect(() => {
//     const userDataString = localStorage.getItem("user");
//     if (userDataString) {
//       const userData = JSON.parse(userDataString);
//       setCurrentUserId(userData?.id || null);
//       setCurrentUserName(userData?.name || userData?.username || "You");
//     } else {
//       const userId = localStorage.getItem("current_user_id") || "11";
//       setCurrentUserId(parseInt(userId));
//       setCurrentUserName("You");
//     }
//   }, []);

//   // Load groups from the specific ticket when dialog opens
//   useEffect(() => {
//     const loadTicketGroups = async () => {
//       if (!showGroupDialog || !currentTicketForAssignment) return;
      
//       setLoadingGroups(true);
//       setSelectedGroup(null);
//       setGroupUsers([]);
//       setSelectedUsers([]);
//       setSelectedUserEmails([]);
      
//       try {
//         // Get fresh ticket details to get the groups
//         const ticketDetails = await getTicketDetails(currentTicketForAssignment.ticket_no);
//         const ticketData = ticketDetails.ticket || ticketDetails;
        
//         // Extract groups from this specific ticket
//         const ticketGroupsData = ticketData.assigned_groups_detail || [];
//         setTicketGroups(ticketGroupsData);
        
//         // Set groups for display
//         const formattedGroups = ticketGroupsData.map(group => ({
//           id: group.id,
//           name: group.name,
//           members_count: group.members_count || 0,
//           members: group.members || []
//         }));
        
//         setGroups(formattedGroups);
        
//         console.log("Ticket groups loaded:", formattedGroups);
        
//         // If there's only one group, auto-select it
//         if (formattedGroups.length === 1) {
//           handleGroupSelect(formattedGroups[0]);
//         }
        
//       } catch (error) {
//         console.error("Failed to load ticket groups:", error);
//         toast.error("Failed to load ticket groups");
//       } finally {
//         setLoadingGroups(false);
//       }
//     };
    
//     loadTicketGroups();
//   }, [showGroupDialog, currentTicketForAssignment]);

//   // Only show New Assigned, Solved, and Closed cards
//   const statusCards = [
//     {
//       id: "new_assigned",
//       label: "New",
//       color: "warning",
//       icon: <NewReleasesIcon />,
//       count: userStatus?.new_assigned || 0,
//       description: "Tickets recently assigned to you",
//     },
//     {
//       id: "solved",
//       label: "Resolved",
//       color: "success",
//       icon: <DoneAllIcon />,
//       count: userStatus?.solved || 0,
//       description: "Tickets you have resolved",
//     },
//     {
//       id: "Cancelled",
//       label: "Cancelled",
//       color: "error",
//       icon: <CancelIcon />,
//       count: userStatus?.cancelled || 0,
//       description: "Cancelled tickets",
//     },
//     {
//       id: "closed",
//       label: "Closed",
//       color: "info",
//       icon: <LockIcon />,
//       count: userStatus?.closed || 0,
//       description: "Tickets that are completed",
//     },
//     {
//       id: "clarification_applied",
//       label: "Clar. Supplied",
//       color: "primary",
//       icon: <QuestionAnswerIcon sx={{ fontSize: { xs: 25, sm: 18, md: 25 } }} />,
//       count: userStatus?.clarification_applied || 0,
//     },
//     {
//       id: "clarification_required",
//       label: "Clar. Required",
//       color: "error",
//       icon: <HelpOutlineIcon sx={{ fontSize: { xs: 25, sm: 18, md: 25 } }} />,
//       count: userStatus?.clarification_required || 0,
//     },
//   ];

//   const selectedTickets = useMemo(() => {
//     const ticketsForType = tickets[selectedType];
//     return Array.isArray(ticketsForType) ? ticketsForType : [];
//   }, [tickets, selectedType]);

//   const departmentList = useMemo(() => {
//     if (!Array.isArray(selectedTickets)) return [];
//     const departments = selectedTickets
//       .map((row) => row?.department_detail?.field_name)
//       .filter(Boolean);
//     return [...new Set(departments)];
//   }, [selectedTickets]);

//   // Get initials for avatar
//   const getInitials = (name) => {
//     if (!name || name === "You") return "U";
//     return name
//       .split(" ")
//       .map((n) => n[0])
//       .join("")
//       .toUpperCase()
//       .substring(0, 2);
//   };

//   // Group chats by date
//   const groupedChats = useMemo(() => {
//     const groups = {};
//     followUpChats.forEach((msg) => {
//       const date = new Date(msg.createdon).toLocaleDateString();
//       if (!groups[date]) {
//         groups[date] = [];
//       }
//       groups[date].push(msg);
//     });
//     return Object.entries(groups)
//       .map(([date, messages]) => ({
//         date,
//         messages: messages.sort(
//           (a, b) => new Date(a.createdon) - new Date(b.createdon)
//         ),
//       }))
//       .sort((a, b) => new Date(a.date) - new Date(b.date));
//   }, [followUpChats]);

//   // Headings for New Assigned, Solved, Closed
//   const headingMap = {
//     new_assigned: "New Assigned Tickets",
//     pending: "Pending Tickets",
//     solved: "Resolved Tickets",
//     cancel: "Cancelled Tickets",
//     closed: "Closed Tickets",
//     clarification_applied: "Clarification Supplied Ticket",
//     clarification_required: "Clarification Required Ticket",
//   };

//   const RequestTabelCol = [
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

//   const navigate = useNavigate();
//   const handleTicketClick = (ticketNo) => {
//     localStorage.setItem("selectedTicketId", ticketNo);
//     navigate("/Approval");
//   };

//   // Fetch all messages and filter by ticket_no and between current user and receiver
//   const fetchTicketMessages = async (ticketNo, currentUserId, receiverId) => {
//     try {
//       const allMessages = await fetchMessages();
//       const filteredMessages = allMessages.filter(
//         (msg) =>
//           msg.ticket_no == ticketNo &&
//           ((msg.sender === currentUserId && msg.receiver === receiverId) ||
//             (msg.sender === receiverId && msg.receiver === currentUserId))
//       );
//       return filteredMessages || [];
//     } catch (err) {
//       console.error("Error loading ticket messages:", err);
//       toast.error("Failed to load messages");
//       return [];
//     }
//   };

//   const sendFollowUpMessageHandler = async (text) => {
//     if (!text.trim()) {
//       toast.error("Message cannot be empty");
//       return;
//     }
//     if (!assignee?.id || !currentChatTicket?.id || !currentUserId) {
//       toast.error("Cannot send message: missing details");
//       return;
//     }

//     const receiverId = assignee.id;
//     const shouldProtect = isConfidentialTicket || isProtected;

//     setSendingFollowUpMessage(true);
//     try {
//       await sendMessage({
//         receiver: receiverId,
//         ticket_no: currentChatTicket.id,
//         message: text.trim(),
//         protected: shouldProtect,
//       });

//       const messages = await fetchMessages();
//       const ticketMsgs = messages.filter(
//         (m) =>
//           m.ticket_no == currentChatTicket.id &&
//           ((m.sender === currentUserId && m.receiver === receiverId) ||
//             (m.sender === receiverId && m.receiver === currentUserId))
//       );

//       setFollowUpChats(
//         ticketMsgs.sort((a, b) => new Date(a.createdon) - new Date(b.createdon))
//       );
//       setNewFollowUpMessage("");

//       if (!isConfidentialTicket) {
//         setIsProtected(false);
//       }

//       toast.success(shouldProtect ? "Protected message sent!" : "Message sent!");
//     } catch (err) {
//       console.error("Send error:", err);
//       toast.error("Failed to send message");
//     } finally {
//       setSendingFollowUpMessage(false);
//     }
//   };

//   const handleResolveSolution = async () => {
//     if (!currentChatTicket?.id) {
//       toast.error("No ticket selected");
//       return;
//     }

//     let currentTicketData = {};
//     try {
//       const ticketDetails = await getTicketDetails(currentChatTicket.id);
//       currentTicketData = ticketDetails.ticket || ticketDetails;
//     } catch (err) {
//       toast.error("Could not fetch ticket details");
//       return;
//     }

//     try {
//       const ticketNoStr = String(currentChatTicket.id);
//       const assignedUsers =
//         currentTicketData.assignees_detail ||
//         currentTicketData.assigned_users ||
//         [];
//       const assignedGroups =
//         currentTicketData.assigned_groups_detail ||
//         currentTicketData.assigned_groups ||
//         [];

//       const formData = new FormData();
//       formData.append("title", currentTicketData.title || "");
//       formData.append("description", currentTicketData.description || "");
//       formData.append(
//         "category",
//         currentTicketData.category || currentTicketData.category_detail?.id || ""
//       );
//       formData.append("status", "41");
//       formData.append("resolved_status", "yes");

//       let assignedTypeIndex = 0;
//       assignedUsers.forEach((user, index) => {
//         if (user?.email) {
//           formData.append(`assignee[${index}]`, user.email);
//         }
//       });

//       if (assignedUsers.length > 0) {
//         formData.append(`assigned_to_type[${assignedTypeIndex}]`, "user");
//         assignedTypeIndex++;
//       }

//       assignedGroups.forEach((group, index) => {
//         if (group?.id) {
//           formData.append(`assigned_group[${index}]`, group.id);
//         }
//       });

//       if (assignedGroups.length > 0) {
//         formData.append(`assigned_to_type[${assignedTypeIndex}]`, "group");
//       }

//       const result = await updateTicket(ticketNoStr, formData);
//       if (!result.success) throw new Error(result.error || "Failed");

//       toast.success("Solution resolved! Ticket status changed to New.");

//       setTickets((prev) => {
//         const ticket = prev.solved.find(
//           (t) => t.ticket_no == currentChatTicket.id
//         );
//         if (!ticket) return prev;

//         ticket.status_detail = { field_values: "New" };

//         return {
//           ...prev,
//           solved: prev.solved.filter(
//             (t) => t.ticket_no != currentChatTicket.id
//           ),
//           new_assigned: [ticket, ...prev.new_assigned],
//         };
//       });

//       setIsResolved(true);
//       setShowFollowUpChat(false);
//       setSelectedType("new_assigned");

//       await sendFollowUpMessageHandler(
//         "I have resolved the solution. Ticket reopened as New if further action needed."
//       );
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to resolve solution");
//     }
//   };

//   const handleApproveSolution = async () => {
//     if (!currentChatTicket?.id) {
//       toast.error("No ticket selected");
//       return;
//     }

//     let currentTicketData = {};
//     try {
//       const ticketDetails = await getTicketDetails(currentChatTicket.id);
//       currentTicketData = ticketDetails.ticket || ticketDetails;
//     } catch (err) {
//       console.error("Failed to fetch latest ticket details:", err);
//       toast.error("Could not fetch ticket details");
//       return;
//     }

//     try {
//       const ticketNoStr = String(currentChatTicket.id);
//       const assignedUsers =
//         currentTicketData.assignees_detail ||
//         currentTicketData.assigned_users ||
//         [];
//       const assignedGroups =
//         currentTicketData.assigned_groups_detail ||
//         currentTicketData.assigned_groups ||
//         [];

//       const formData = new FormData();
//       formData.append("title", currentTicketData.title || "");
//       formData.append("description", currentTicketData.description || "");
//       formData.append(
//         "category",
//         currentTicketData.category || currentTicketData.category_detail?.id || ""
//       );
//       formData.append("status", "46");

//       let assignedTypeIndex = 0;
//       assignedUsers.forEach((user, index) => {
//         if (user?.email) {
//           formData.append(`assignee[${index}]`, user.email);
//         }
//       });

//       if (assignedUsers.length > 0) {
//         formData.append(`assigned_to_type[${assignedTypeIndex}]`, "user");
//         assignedTypeIndex++;
//       }

//       assignedGroups.forEach((group, index) => {
//         if (group?.id) {
//           formData.append(`assigned_group[${index}]`, group.id);
//         }
//       });

//       if (assignedGroups.length > 0) {
//         formData.append(`assigned_to_type[${assignedTypeIndex}]`, "group");
//       }

//       const result = await updateTicket(ticketNoStr, formData);
//       if (!result.success) {
//         throw new Error(result.error || "Failed to close ticket");
//       }

//       toast.success("Solution approved and ticket closed successfully!");

//       setIsApproved(true);
//       setShowFollowUpChat(false);
//       setSelectedType("closed");
//     } catch (err) {
//       console.error("Error closing ticket on approve:", err);
//     }
//   };

//   const handleChatDrawerOpen = async (ticketNo) => {
//     if (!ticketNo || !currentUserId) {
//       toast.error("No ticket or user ID provided");
//       return;
//     }
//     const ticket = selectedTickets.find((t) => t.ticket_no == ticketNo);
//     if (!ticket) {
//       toast.error("Ticket not found in current list");
//       return;
//     }
//     setChatTab(0);
//     setLoadingFollowUpChats(true);
//     setShowFollowUpChat(true);
//     setFollowUpChats([]);
//     setIsSolvedTicket(false);
//     setSolutionText("");
//     setIsResolved(false);
//     setIsApproved(false);
//     try {
//       const ticketDetails = await getTicketDetails(ticketNo);
//       const ticketData = ticketDetails.ticket || ticketDetails;
//       const assigneesDetails = ticketData.assignees_detail;
//       if (!assigneesDetails || assigneesDetails.length === 0) {
//         throw new Error("Assignee details not found");
//       }
//       const assigneeDetail = assigneesDetails[0];
//       if (!assigneeDetail.id) {
//         throw new Error("Assignee ID not found");
//       }
//       setAssignee(assigneeDetail);
//       setClarificationRequested(
//         ticketData.status === "156" || ticketData.clarification_requested
//       );

//       setCurrentChatTicket({
//         id: ticketNo,
//         title: ticketData.title || ticket.title || "",
//         description: ticketData.description || ticket.description || "",
//       });

//       const confidential =
//         ticketData.confidential === true ||
//         ticketData.confidential === "true";
//       setIsConfidentialTicket(confidential);
//       setIsProtected(confidential);

//       const isCurrentlySolved =
//         selectedType === "solved" ||
//         ticketData.status_detail?.field_values === "Solved" ||
//         ticketData.status === "Solved";

//       if (isCurrentlySolved) {
//         setIsSolvedTicket(true);
//         setSolutionText(
//           ticketData.solution_text ||
//             ticketData.resolution_text ||
//             "No solution details provided."
//         );
//         setChatTab(2);
//       }

//       if (selectedType === "solved") {
//         setIsSolvedTicket(true);
//         setSolutionText(
//           ticketData.solution_text || ticketData.resolution_text || ""
//         );
//         setIsResolved(
//           ticketData.resolved_status === "yes" ||
//             ticketData.is_resolved ||
//             false
//         );
//         setIsApproved(
//           ticketData.approved_status === "yes" ||
//             ticketData.is_approved ||
//             false
//         );
//       }
//       const receiverId = assigneeDetail.id;
//       const ticketMessages = await fetchTicketMessages(
//         ticketNo,
//         currentUserId,
//         receiverId
//       );

//       const sortedTicketMessages = ticketMessages.sort(
//         (a, b) => new Date(a.createdon) - new Date(b.createdon)
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

//   const handleSendClarification = async () => {
//     if (!clarificationText.trim()) return;

//     setSendingClarification(true);
//     try {
//       await sendMessage({
//         receiver:
//           currentUserId === assignee?.id
//             ? currentChatTicket?.requested_by
//             : assignee?.id,
//         ticket_no: currentChatTicket.id,
//         message: `[Clarification Required]\n\n${clarificationText.trim()}`,
//         protected: false,
//       });

//       await sendFollowUpMessageHandler(
//         `[Clarification Required] ${clarificationText.trim()}`
//       );

//       setClarificationText("");
//       setClarificationSent(true);
//       toast.success("Clarification required sent!");

//       setChatTab(0);
//       setTimeout(() => setClarificationSent(false), 5000);
//     } catch (err) {
//       toast.error("Failed to send clarification");
//     } finally {
//       setSendingClarification(false);
//     }
//   };

//   const handleRequestClarification = async () => {
//     if (!clarificationText.trim()) {
//       toast.error("Please enter clarification details");
//       return;
//     }
//     if (!currentChatTicket?.id) {
//       toast.error("No ticket selected");
//       return;
//     }

//     setSendingClarification(true);
//     try {
//       let currentTicketData = {};
//       try {
//         const ticketDetails = await getTicketDetails(currentChatTicket.id);
//         currentTicketData = ticketDetails.ticket || ticketDetails;
//       } catch (err) {
//         toast.error("Could not fetch ticket details");
//         return;
//       }

//       const ticketNoStr = String(currentChatTicket.id);
//       const assignedUsers =
//         currentTicketData.assignees_detail ||
//         currentTicketData.assigned_users ||
//         [];
//       const assignedGroups =
//         currentTicketData.assigned_groups_detail ||
//         currentTicketData.assigned_groups ||
//         [];

//       const formData = new FormData();
//       formData.append("title", currentTicketData.title || "");
//       formData.append("description", currentTicketData.description || "");
//       formData.append(
//         "category",
//         currentTicketData.category || currentTicketData.category_detail?.id || ""
//       );
//       formData.append("status", "157");

//       let assignedTypeIndex = 0;
//       assignedUsers.forEach((user, index) => {
//         if (user?.email) formData.append(`assignee[${index}]`, user.email);
//       });
//       if (assignedUsers.length > 0)
//         formData.append(`assigned_to_type[${assignedTypeIndex++}]`, "user");

//       assignedGroups.forEach((group, index) => {
//         if (group?.id) formData.append(`assigned_group[${index}]`, group.id);
//       });
//       if (assignedGroups.length > 0)
//         formData.append(`assigned_to_type[${assignedTypeIndex}]`, "group");

//       const result = await updateTicket(ticketNoStr, formData);
//       if (!result.success)
//         throw new Error(result.error || "Failed to update ticket status");

//       const clarificationMessage = `[Clarification Supplied]\n\n${clarificationText.trim()}`;
//       await sendMessage({
//         receiver: assignee?.id,
//         ticket_no: currentChatTicket.id,
//         message: clarificationMessage,
//         protected: false,
//       });

//       const messages = await fetchMessages();
//       const ticketMsgs = messages.filter(
//         (m) =>
//           m.ticket_no == currentChatTicket.id &&
//           ((m.sender === currentUserId && m.receiver === assignee?.id) ||
//             (m.sender === assignee?.id && m.receiver === currentUserId))
//       );
//       setFollowUpChats(
//         ticketMsgs.sort((a, b) => new Date(a.createdon) - new Date(b.createdon))
//       );

//       toast.success("Clarification Supplied sent and ticket status updated!");

//       setClarificationText("");
//       setChatTab(0);
//       window.location.reload();
//     } catch (err) {
//       console.error("Error requesting clarification:", err);
//       toast.error("Failed to send clarification request");
//     } finally {
//       setSendingClarification(false);
//     }
//   };

//   const handleChatDrawerClose = () => {
//     setShowFollowUpChat(false);
//     setCurrentChatTicket(null);
//     setAssignee(null);
//     setFollowUpChats([]);
//     setLoadingFollowUpChats(false);
//     setChatTab(0);
//     setIsSolvedTicket(false);
//     setSolutionText("");
//     setIsResolved(false);
//     setIsApproved(false);
//     setClarificationText("");
//     setClarificationSent(false);
//   };

//   // Group Assignment Functions
//   const handleOpenGroupAssignment = (ticket) => {
//     setCurrentTicketForAssignment(ticket);
//     setSelectedGroup(null);
//     setGroupUsers([]);
//     setSelectedUsers([]);
//     setSelectedUserEmails([]);
//     setAssignmentMode("single");
//     setShowGroupDialog(true);
//   };

//   const handleCloseGroupDialog = () => {
//     setShowGroupDialog(false);
//     setSelectedGroup(null);
//     setGroupUsers([]);
//     setSelectedUsers([]);
//     setSelectedUserEmails([]);
//     setCurrentTicketForAssignment(null);
//     setTicketGroups([]);
//   };

//   const handleGroupSelect = async (group) => {
//     setSelectedGroup(group);
//     setSelectedUsers([]);
//     setSelectedUserEmails([]);
    
//     // Use members from group data if available
//     if (group.members && group.members.length > 0) {
//       setGroupUsers(group.members);
//     } else {
//       // If no members in group data, show empty state
//       setGroupUsers([]);
//       toast.info("No members found in this group");
//     }
//   };

//   const handleUserToggle = (user) => {
//     const userId = user.id;
//     const userEmail = user.email;
    
//     if (assignmentMode === "single") {
//       setSelectedUsers([userId]);
//       setSelectedUserEmails([userEmail]);
//     } else {
//       setSelectedUsers((prev) => {
//         if (prev.includes(userId)) {
//           // Remove user
//           setSelectedUserEmails(prevEmails => prevEmails.filter(email => email !== userEmail));
//           return prev.filter((id) => id !== userId);
//         } else {
//           // Add user
//           setSelectedUserEmails(prevEmails => [...prevEmails, userEmail]);
//           return [...prev, userId];
//         }
//       });
//     }
//   };

//   const handleAssignUsers = async () => {
//     if (!currentTicketForAssignment || selectedUsers.length === 0) {
//       toast.error("Please select at least one user to assign");
//       return;
//     }

//     try {
//       const ticketNoStr = String(currentTicketForAssignment.ticket_no);
      
//       // Get current ticket details
//       let currentTicketData = {};
//       try {
//         const ticketDetails = await getTicketDetails(ticketNoStr);
//         currentTicketData = ticketDetails.ticket || ticketDetails;
//       } catch (err) {
//         toast.error("Could not fetch ticket details");
//         return;
//       }

//       // Prepare form data for updating ticket
//       const formData = new FormData();
//       formData.append("title", currentTicketData.title || "");
//       formData.append("description", currentTicketData.description || "");
//       formData.append(
//         "category",
//         currentTicketData.category || currentTicketData.category_detail?.id || ""
//       );
      
//       // Keep current status
//       formData.append("status", currentTicketData.status || "41");
      
//       // Add selected user emails as assignees
//       selectedUserEmails.forEach((email, index) => {
//         formData.append(`assignee[${index}]`, email);
//       });

//       // Keep existing assigned groups from this ticket
//       ticketGroups.forEach((group, index) => {
//         if (group?.id) {
//           formData.append(`assigned_group[${index}]`, group.id);
//         }
//       });

//       // Set assigned_to_type
//       let assignedTypeIndex = 0;
//       if (selectedUserEmails.length > 0) {
//         formData.append(`assigned_to_type[${assignedTypeIndex}]`, "user");
//         assignedTypeIndex++;
//       }
//       if (ticketGroups.length > 0) {
//         formData.append(`assigned_to_type[${assignedTypeIndex}]`, "group");
//       }

//       console.log("Assigning users to ticket:", selectedUserEmails);
//       console.log("Ticket groups:", ticketGroups);
//       console.log("FormData entries:", [...formData.entries()]);

//       const result = await updateTicket(ticketNoStr, formData);
//       if (!result.success) {
//         throw new Error(result.error || "Failed to assign users");
//       }

//       toast.success(
//         `Successfully assigned ${selectedUsers.length} user(s) to ticket #${currentTicketForAssignment.ticket_no}`
//       );

//       // Update the specific ticket in state
//       if (result.ticket || result.updatedTicket) {
//         const updatedTicket = result.ticket || result.updatedTicket;
//         setTickets((prev) => ({
//           ...prev,
//           [selectedType]: prev[selectedType].map((t) =>
//             t.ticket_no === currentTicketForAssignment.ticket_no
//               ? { ...t, assignees_detail: updatedTicket.assignees_detail || [] }
//               : t
//           ),
//         }));
//       }

//       handleCloseGroupDialog();
      
//       // Refresh the ticket list
//       if (userStatus) {
//         // Trigger a refresh of user status data
//         window.location.reload();
//       }
//     } catch (error) {
//       console.error("Assignment error:", error);
//       toast.error("Failed to assign users: " + (error.message || "Unknown error"));
//     }
//   };

//   const filteredRows = useMemo(() => {
//     const searchLower = search.toLowerCase().trim();

//     if (!searchLower && !department) {
//       return selectedTickets;
//     }

//     return selectedTickets
//       .filter((row) => {
//         const matchesDept = department
//           ? row.department_detail?.field_name === department
//           : true;

//         if (!searchLower) return matchesDept;

//         if (String(row.ticket_no || "").toLowerCase().includes(searchLower))
//           return true;
//         if (row.title?.toLowerCase().includes(searchLower)) return true;
//         if (row.description?.toLowerCase().includes(searchLower)) return true;
//         if (
//           row.status_detail?.field_values
//             ?.toLowerCase()
//             .includes(searchLower)
//         )
//           return true;
//         if (
//           row.priority_detail?.field_values
//             ?.toLowerCase()
//             .includes(searchLower)
//         )
//           return true;
//         if (
//           row.category_detail?.category_name
//             ?.toLowerCase()
//             .includes(searchLower)
//         )
//           return true;
//         if (
//           row.subcategory_detail?.subcategory_name
//             ?.toLowerCase()
//             .includes(searchLower)
//         )
//           return true;
//         if (
//           row.department_detail?.field_name
//             ?.toLowerCase()
//             .includes(searchLower)
//         )
//           return true;
//         if (
//           row.location_detail?.field_name
//             ?.toLowerCase()
//             .includes(searchLower)
//         )
//           return true;
//         if (
//           row.requested_detail?.email?.toLowerCase().includes(searchLower)
//         )
//           return true;
//         if (
//           row.requested_detail?.name?.toLowerCase().includes(searchLower)
//         )
//           return true;

//         const openDate = new Date(row.created_date)
//           .toLocaleDateString()
//           .toLowerCase();
//         const updateDate = new Date(row.updated_date)
//           .toLocaleDateString()
//           .toLowerCase();
//         if (openDate.includes(searchLower) || updateDate.includes(searchLower))
//           return true;

//         return false;
//       })
//       .filter((row) => {
//         return department
//           ? row.department_detail?.field_name === department
//           : true;
//       });
//   }, [selectedTickets, search, department]);

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

//   const priorityColors = {
//     Critical: "#D32F2F",
//     "Very High": "#b43d3bff",
//     High: "#FB8C00",
//     Medium: "#FDD835",
//     Low: "#43A047",
//     "Very Low": "#1E88E5",
//   };

//   const statusColors = {
//     Pending: "#EF6C00",
//     Approved: "#2E7D32",
//     "On Hold": "#1565C0",
//     Rejected: "#C62828",
//     "SLA Breached": "#F9A825",
//   };

//   return (
//     <Box sx={{ width: "100%", mb: 2 }}>
//       <Grid container spacing={1} sx={{ mb: 2 }}>
//         {statusCards.map((item) => (
//           <Grid size={{ xs: 6, sm: 6, md: 4, lg: 2 }} key={item.id}>
//             <Card
//               onClick={() => handleCardClick(item.id)}
//               sx={{
//                 transition: "0.3s ease",
//                 maxWidth: isMobile ? 500 : 300,
//                 maxHeight: 110,
//                 minHeight: 100,
//                 borderRadius: 5,
//                 "&:hover": {
//                   background: "linear-gradient(135deg, #667eea, #764ba2)",
//                   color: "#fff",
//                   transform: "scale(1.03)",
//                 },
//               }}
//             >
//               <CardContent
//                 sx={{
//                   "&:last-child": { pt: 1 },
//                   display: "flex",
//                   gap: 2,
//                   alignItems: "center",
//                 }}
//               >
//                 <Box
//                   sx={{
//                     width: { xs: 40, sm: 40, md: 40 },
//                     height: { xs: 40, sm: 40, md: 40 },
//                     minWidth: 40,
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     borderRadius: 2,
//                     bgcolor: `${item.color}.main`,
//                     color: "#fff",
//                   }}
//                 >
//                   <Icon sx={{ fontSize: { xs: 25, sm: 18, md: 25 } }}>
//                     {item.icon}
//                   </Icon>
//                 </Box>
//                 <Box>
//                   <Typography fontSize={{ xs: 25, sm: 20, md: 25 }} fontWeight={600}>
//                     {item.count}
//                   </Typography>
//                   <Typography fontSize={{ xs: 20, sm: 14, md: 20 }} fontWeight={550}>
//                     {item.label}
//                   </Typography>
//                 </Box>
//               </CardContent>
//             </Card>
//           </Grid>
//         ))}
//       </Grid>

//       <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
//         <CardContent>
//           {selectedType && (
//             <Box>
//               <Box
//                 sx={{
//                   display: "flex",
//                   flexDirection: isMobile || isTablet ? "column" : "row",
//                   justifyContent:
//                     !isMobile || !isTablet ? "space-between" : undefined,
//                   alignItems: isMobile ? "flex-start" : "center",
//                   mb: 1,
//                   gap: isMobile ? 2 : 0,
//                 }}
//               >
//                 <Typography
//                   variant="h5"
//                   fontWeight={700}
//                   sx={{
//                     color: "#2D3748",
//                     width: isMobile || isTablet ? "100%" : "auto",
//                   }}
//                 >
//                   {headingMap[selectedType] || "Tickets"}
//                 </Typography>

//                 <Box
//                   sx={{
//                     display: "flex",
//                     flexDirection: isMobile ? "column" : "row",
//                     flexWrap: isTablet ? "wrap" : "nowrap",
//                     gap: 2,
//                     width: isMobile || isTablet ? "100%" : "auto",
//                     justifyContent: isTablet ? "flex-start" : "flex-end",
//                     mt: isTablet ? 1.5 : 0,
//                   }}
//                 >
//                   <Autocomplete
//                     options={departmentList}
//                     value={department}
//                     onChange={(e, newValue) => setDepartment(newValue)}
//                     sx={{
//                       width: { xs: "100%", sm: 300, md: 200 },
//                       "& .MuiOutlinedInput-root": {
//                         borderRadius: 2,
//                       },
//                     }}
//                     renderInput={(params) => (
//                       <TextField
//                         {...params}
//                         label="Department"
//                         size="small"
//                         variant="outlined"
//                       />
//                     )}
//                   />
//                   <TextField
//                     size="small"
//                     label="Search"
//                     value={search}
//                     onChange={(e) => setSearch(e.target.value)}
//                     variant="outlined"
//                     sx={{
//                       width: { xs: "100%", sm: 300, md: 200 },
//                       "& .MuiOutlinedInput-root": {
//                         borderRadius: 2,
//                       },
//                     }}
//                   />
//                   {/* <Button
//                     variant="contained"
//                     onClick={() => setShowGroupDialog(true)}
//                     startIcon={<GroupIcon />}
//                     sx={{
//                       borderRadius: 2,
//                       backgroundColor: "#4CAF50",
//                       "&:hover": {
//                         backgroundColor: "#388E3C",
//                       },
//                     }}
//                   >
//                     Assign from Groups
//                   </Button> */}
//                   <Button
//                     variant="outlined"
//                     fullWidth={isMobile}
//                     onClick={clearFilters}
//                     sx={{
//                       borderRadius: 2,
//                       color: "info",
//                       "&:hover": {
//                         borderColor: "#667eea",
//                         backgroundColor: "#667eea10",
//                       },
//                     }}
//                   >
//                     Clear
//                   </Button>
//                 </Box>
//               </Box>

//               {isMobile ? (
//                 <Box>
//                   {filteredRows.length > 0 ? (
//                     filteredRows
//                       .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//                       .map((t) => (
//                         <Card sx={{ mb: 2, borderRadius: 2 }} key={t.id}>
//                           <CardContent>
//                             <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                               <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
//                                 <Typography fontWeight={700} color="#667eea">
//                                   #{t.ticket_no} -
//                                 </Typography>
//                                 <Chip
//                                   label={t.priority_detail?.field_values || "-"}
//                                   size="small"
//                                   sx={{
//                                     fontWeight: 800,
//                                     borderRadius: 50,
//                                     background: priorityColors[t.priority_detail?.field_values] || "#666",
//                                     color: "white",
//                                     animation: t.priority_detail?.field_values === "Critical" ? "pulse 2s infinite" : "none",
//                                   }}
//                                 />
//                               </Box>
//                               <Chip
//                                 label={t.status_detail?.field_values}
//                                 size="small"
//                                 sx={{
//                                   fontWeight: 700,
//                                   background: statusColors[t.status_detail?.field_values] || "#666",
//                                   color: "white",
//                                   borderRadius: 50,
//                                   py: 0.5,
//                                   px: 1,
//                                 }}
//                               />
//                             </Box>
//                             <Tooltip title={t.title} arrow placement="top">
//                               <Typography
//                                 sx={{
//                                   maxWidth: 200,
//                                   color: "text.secondary",
//                                   whiteSpace: "nowrap",
//                                   overflow: "hidden",
//                                   textOverflow: "ellipsis",
//                                   cursor: "pointer",
//                                   mt: 0.5,
//                                 }}
//                               >
//                                 {t.title}
//                               </Typography>
//                             </Tooltip>
//                             <Tooltip title={t.description || "No description"} arrow placement="top">
//                               <Typography
//                                 sx={{
//                                   maxWidth: 200,
//                                   color: "text.secondary",
//                                   whiteSpace: "nowrap",
//                                   overflow: "hidden",
//                                   textOverflow: "ellipsis",
//                                   cursor: "pointer",
//                                   mt: 0.5,
//                                 }}
//                               >
//                                 {t.description || "-"}
//                               </Typography>
//                             </Tooltip>
//                             <Typography fontSize={13} mt={1.5}>
//                               <strong style={{ color: "#4A5568" }}>Category:</strong>{" "}
//                               <span style={{ color: "#2D3748" }}>
//                                 {t.category_detail?.category_name || "-"} /{" "}
//                                 {t.subcategory_detail?.subcategory_name || "-"}
//                               </span>
//                             </Typography>
//                             <Typography fontSize={13} mt={1}>
//                               <strong style={{ color: "#4A5568" }}>Dept | Loc:</strong>{" "}
//                               <span style={{ color: "#2D3748" }}>
//                                 {t.department_detail?.field_name || "-"} |{" "}
//                                 {t.location_detail?.field_name || "-"}
//                               </span>
//                             </Typography>
//                             <Typography fontSize={12} color="#718096" mt={1.5}>
//                               Open: {new Date(t.created_date).toLocaleDateString()} <br />
//                               Update: {new Date(t.updated_date).toLocaleDateString()}
//                             </Typography>
//                             <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2, gap: 1 }}>
//                               <Tooltip title="Follow-up Chat">
//                                 <IconButton
//                                   onClick={() => handleChatDrawerOpen(t.ticket_no)}
//                                   size="small"
//                                   sx={{ color: "#667eea" }}
//                                 >
//                                   <ChatIcon />
//                                 </IconButton>
//                               </Tooltip>
//                               <Tooltip title="Assign from Groups">
//                                 <IconButton
//                                   onClick={() => handleOpenGroupAssignment(t)}
//                                   size="small"
//                                   sx={{ color: "#4CAF50" }}
//                                 >
//                                   <GroupIcon />
//                                 </IconButton>
//                               </Tooltip>
//                               <Tooltip title="View Details">
//                                 <IconButton
//                                   onClick={() => handleTicketClick(t.ticket_no)}
//                                   sx={{ color: "#667eea" }}
//                                   size="small"
//                                 >
//                                   <VisibilityIcon />
//                                 </IconButton>
//                               </Tooltip>
//                             </Box>
//                           </CardContent>
//                         </Card>
//                       ))
//                   ) : (
//                     <Typography align="center" py={4} color="#718096">
//                       No tickets found.
//                     </Typography>
//                   )}
//                 </Box>
//               ) : (
//                 <Card sx={{ borderRadius: 3, boxShadow: 2, overflow: "hidden" }}>
//                   <TableContainer>
//                     <Table stickyHeader>
//                       <TableHead>
//                         <TableRow sx={{ backgroundColor: "#F7FAFC" }}>
//                           {RequestTabelCol.map((col) => (
//                             <TableCell
//                               key={col.id}
//                               sx={{
//                                 fontWeight: 700,
//                                 whiteSpace: "nowrap",
//                                 color: "#2D3748",
//                                 borderBottom: "2px solid #E2E8F0",
//                                 py: 2,
//                                 lineHeight: 1.2,
//                               }}
//                             >
//                               {col.title}
//                             </TableCell>
//                           ))}
//                         </TableRow>
//                       </TableHead>
//                       <TableBody>
//                         {filteredRows.length > 0 ? (
//                           filteredRows
//                             .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//                             .map((t) => (
//                               <TableRow
//                                 key={t.id}
//                                 hover
//                                 sx={{
//                                   "&:hover": { backgroundColor: "#F7FAFC" },
//                                   "&:last-child td": { borderBottom: 0 },
//                                 }}
//                               >
//                                 <TableCell sx={{ color: "#667eea", fontWeight: 600 }}>
//                                   #{t.ticket_no}
//                                 </TableCell>
//                                 <TableCell>
//                                   <Tooltip title={t.title} arrow placement="top">
//                                     <Typography
//                                       sx={{
//                                         maxWidth: 200,
//                                         whiteSpace: "nowrap",
//                                         overflow: "hidden",
//                                         textOverflow: "ellipsis",
//                                         cursor: "pointer",
//                                       }}
//                                     >
//                                       {t.title}
//                                     </Typography>
//                                   </Tooltip>
//                                 </TableCell>
//                                 <TableCell>
//                                   <Tooltip title={t.description || "No description"} arrow placement="top">
//                                     <Typography
//                                       sx={{
//                                         maxWidth: 200,
//                                         whiteSpace: "nowrap",
//                                         overflow: "hidden",
//                                         textOverflow: "ellipsis",
//                                         cursor: "pointer",
//                                       }}
//                                     >
//                                       {t.description || "-"}
//                                     </Typography>
//                                   </Tooltip>
//                                 </TableCell>
//                                 <TableCell>
//                                   <Typography fontSize="0.85rem">
//                                     {t.status_detail?.field_values}
//                                   </Typography>
//                                   <Typography fontSize="0.85rem">
//                                     {t.priority_detail?.field_values}
//                                   </Typography>
//                                 </TableCell>
//                                 <TableCell>
//                                   <Tooltip
//                                     arrow
//                                     placement="top"
//                                     title={
//                                       <Box>
//                                         <div>
//                                           <strong>Category:</strong> {t.category_detail?.category_name || "-"}
//                                         </div>
//                                         <div>
//                                           <strong>Subcategory:</strong> {t.subcategory_detail?.subcategory_name || "-"}
//                                         </div>
//                                       </Box>
//                                     }
//                                   >
//                                     <Box sx={{ cursor: "pointer" }}>
//                                       <Typography fontSize="0.85rem">
//                                         {t.category_detail?.category_name || "-"}
//                                       </Typography>
//                                       <Typography fontSize="0.85rem">
//                                         {t.subcategory_detail?.subcategory_name || "-"}
//                                       </Typography>
//                                     </Box>
//                                   </Tooltip>
//                                 </TableCell>
//                                 <TableCell>
//                                   <Typography fontSize="0.85rem">
//                                     {t.department_detail?.field_name}
//                                   </Typography>
//                                   <Typography fontSize="0.85rem">
//                                     {t.location_detail?.field_name}
//                                   </Typography>
//                                 </TableCell>
//                                 <TableCell>
//                                   <Typography fontSize="0.85rem">
//                                     {t.requested_detail?.email}
//                                   </Typography>
//                                 </TableCell>
//                                 <TableCell>
//                                   <Typography fontSize="0.85rem">
//                                     {new Date(t.created_date).toLocaleDateString()}
//                                   </Typography>
//                                   <Typography fontSize="0.85rem">
//                                     {new Date(t.updated_date).toLocaleDateString()}
//                                   </Typography>
//                                 </TableCell>
//                                 <TableCell>
//                                   <Box sx={{ display: "flex", gap: 1 }}>
//                                     <Tooltip title="Follow-up Chat">
//                                       <IconButton
//                                         onClick={() => handleChatDrawerOpen(t.ticket_no)}
//                                         size="small"
//                                         sx={{ color: "#667eea" }}
//                                       >
//                                         <ChatIcon />
//                                       </IconButton>
//                                     </Tooltip>
//                                     <Tooltip title="Assign from Groups">
//                                       <IconButton
//                                         onClick={() => handleOpenGroupAssignment(t)}
//                                         size="small"
//                                         sx={{ color: "#4CAF50" }}
//                                       >
//                                         <GroupIcon />
//                                       </IconButton>
//                                     </Tooltip>
//                                     <Tooltip>
//                                       <IconButton
//                                         onClick={() => handleTicketClick(t.ticket_no)}
//                                         size="small"
//                                         sx={{ color: "#667eea" }}
//                                       >
//                                         <VisibilityIcon />
//                                       </IconButton>
//                                     </Tooltip>
//                                   </Box>
//                                 </TableCell>
//                               </TableRow>
//                             ))
//                         ) : (
//                           <TableRow>
//                             <TableCell colSpan={9} align="center" sx={{ py: 4, color: "#718096" }}>
//                               No tickets found.
//                             </TableCell>
//                           </TableRow>
//                         )}
//                       </TableBody>
//                     </Table>
//                   </TableContainer>
//                 </Card>
//               )}
//               {filteredRows.length > 0 && (
//                 <Stack
//                   direction={isMobile ? "column" : "row"}
//                   justifyContent="space-between"
//                   alignItems="center"
//                   spacing={isMobile ? 1.5 : 0}
//                   sx={{
//                     py: 2,
//                     px: { xs: 0, sm: 3 },
//                     borderTop: "1px solid #E2E8F0",
//                     textAlign: isMobile ? "center" : "left",
//                   }}
//                 >
//                   <Typography
//                     variant="body2"
//                     color="#718096"
//                     sx={{ fontSize: { xs: "13px", sm: "14px" } }}
//                   >
//                     Showing {page * rowsPerPage + 1} to{" "}
//                     {Math.min((page + 1) * rowsPerPage, filteredRows.length)} of{" "}
//                     {filteredRows.length} tickets
//                   </Typography>
//                   <Pagination
//                     count={Math.ceil(filteredRows.length / rowsPerPage)}
//                     page={page + 1}
//                     onChange={(e, value) => setPage(value - 1)}
//                     variant="outlined"
//                     shape="rounded"
//                     showFirstButton
//                     showLastButton
//                     siblingCount={1}
//                     boundaryCount={1}
//                     size={isMobile ? "small" : "medium"}
//                     sx={{
//                       "& .MuiPaginationItem-root": {
//                         borderRadius: "8px",
//                         borderColor: "#CBD5E0",
//                         color: "#4A5568",
//                         fontSize: { xs: "12px", sm: "14px" },
//                         minWidth: { xs: 32, sm: 36 },
//                         "&.Mui-selected": {
//                           backgroundColor: "#667eea",
//                           color: "#fff",
//                           borderColor: "#667eea",
//                           "&:hover": {
//                             backgroundColor: "#556cd6",
//                           },
//                         },
//                         "&:hover": {
//                           backgroundColor: "#F7FAFC",
//                         },
//                       },
//                     }}
//                   />
//                 </Stack>
//               )}
//             </Box>
//           )}
//         </CardContent>
//       </Card>

//       {/* Group Assignment Dialog - FIXED LAYOUT */}
//       <Dialog
//         open={showGroupDialog}
//         onClose={handleCloseGroupDialog}
//         maxWidth="lg"
//         fullWidth
//         PaperProps={{
//           sx: {
//             maxHeight: '80vh',
//             display: 'flex',
//             flexDirection: 'column'
//           }
//         }}
//       >
//         <DialogTitle sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'primary.main', color: 'white' }}>
//           <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//             <GroupIcon sx={{ color: 'white' }} />
//             <Box>
//               <Typography variant="h6" component="div">
//                 Assign Users from Groups
//               </Typography>
//               <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
//                 <Typography variant="body2">
//                   Ticket #{currentTicketForAssignment?.ticket_no}
//                 </Typography>
//                 <Typography variant="caption">
//                   • {currentTicketForAssignment?.title}
//                 </Typography>
//               </Box>
//             </Box>
//           </Box>
//         </DialogTitle>

//         <DialogContent dividers sx={{ flex: 1, overflow: 'hidden', p: 0 }}>
//           {loadingGroups ? (
//             <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: '100%' }}>
//               <CircularProgress />
//               <Typography sx={{ ml: 2 }}>Loading groups for this ticket...</Typography>
//             </Box>
//           ) : (
//             <Box sx={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
//               {/* Left Panel: Groups List */}
//               <Paper 
//                 elevation={0} 
//                 sx={{ 
//                   width: '35%', 
//                   borderRight: '1px solid', 
//                   borderColor: 'divider',
//                   display: 'flex',
//                   flexDirection: 'column',
//                   overflow: 'hidden'
//                 }}
//               >
//                 <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'grey.50' }}>
//                   <Typography variant="h6" sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
//                     <PeopleIcon color="primary" /> Groups in Ticket
//                   </Typography>
//                   <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//                     <Typography variant="body2" color="text.secondary">
//                       Select a group to view members
//                     </Typography>
//                     <Chip 
//                       label={`${groups.length} group(s)`} 
//                       size="small" 
//                       color="primary" 
//                       variant="outlined" 
//                     />
//                   </Box>
//                 </Box>

//                 <Box sx={{ flex: 1, overflow: 'auto', p: 1 }}>
//                   {groups.length > 0 ? (
//                     <List sx={{ p: 0 }}>
//                       {groups.map((group) => (
//                         <ListItemButton
//                           key={group.id}
//                           selected={selectedGroup?.id === group.id}
//                           onClick={() => handleGroupSelect(group)}
//                           sx={{
//                             borderRadius: 1,
//                             mb: 1,
//                             p: 1.5,
//                             "&.Mui-selected": {
//                               backgroundColor: 'primary.light',
//                               color: 'primary.contrastText',
//                               "&:hover": {
//                                 backgroundColor: 'primary.light',
//                               },
//                               "& .MuiListItemText-primary": {
//                                 color: 'primary.contrastText',
//                                 fontWeight: 'bold'
//                               },
//                               "& .MuiListItemText-secondary": {
//                                 color: 'primary.contrastText',
//                                 opacity: 0.9
//                               },
//                               "& .MuiAvatar-root": {
//                                 backgroundColor: 'white',
//                                 color: 'primary.main'
//                               }
//                             },
//                           }}
//                         >
//                           <ListItemAvatar>
//                             <Avatar sx={{ bgcolor: selectedGroup?.id === group.id ? 'white' : 'primary.main' }}>
//                               {group.name.charAt(0).toUpperCase()}
//                             </Avatar>
//                           </ListItemAvatar>
//                           <ListItemText
//                             primary={
//                               <Typography variant="body1" fontWeight="medium">
//                                 {group.name}
//                               </Typography>
//                             }
//                             secondary={`${group.members_count || 0} members`}
//                           />
//                           <Badge 
//                             badgeContent={group.members_count || 0} 
//                             color="primary" 
//                             sx={{ 
//                               '& .MuiBadge-badge': {
//                                 backgroundColor: selectedGroup?.id === group.id ? 'white' : 'primary.main',
//                                 color: selectedGroup?.id === group.id ? 'primary.main' : 'white'
//                               }
//                             }}
//                           />
//                         </ListItemButton>
//                       ))}
//                     </List>
//                   ) : (
//                     <Box sx={{ textAlign: 'center', py: 6 }}>
//                       <GroupIcon sx={{ fontSize: 60, color: 'grey.400', mb: 2 }} />
//                       <Typography color="text.secondary" gutterBottom>
//                         No groups assigned to this ticket
//                       </Typography>
//                       <Typography variant="body2" color="text.secondary">
//                         This ticket doesn't have any groups assigned yet.
//                       </Typography>
//                     </Box>
//                   )}
//                 </Box>
//               </Paper>

//               {/* Right Panel: Users in Selected Group */}
//               <Paper 
//                 elevation={0} 
//                 sx={{ 
//                   width: '65%', 
//                   display: 'flex',
//                   flexDirection: 'column',
//                   overflow: 'hidden'
//                 }}
//               >
//                 {selectedGroup ? (
//                   <>
//                     <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'grey.50' }}>
//                       <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                         <Box>
//                           <Typography variant="h6">
//                             Users in {selectedGroup.name}
//                           </Typography>
//                           <Typography variant="body2" color="text.secondary">
//                             Select users to assign to this ticket
//                           </Typography>
//                         </Box>

//                         <FormControl component="fieldset" size="small">
//                           <FormLabel component="legend" sx={{ mb: 1, fontSize: '0.875rem', color: 'text.primary' }}>
//                             Assignment Mode
//                           </FormLabel>
//                           <RadioGroup
//                             row
//                             value={assignmentMode}
//                             onChange={(e) => {
//                               setAssignmentMode(e.target.value);
//                               if (e.target.value === "single" && selectedUsers.length > 1) {
//                                 const firstUser = groupUsers.find(u => u.id === selectedUsers[0]);
//                                 setSelectedUsers(selectedUsers.slice(0, 1));
//                                 setSelectedUserEmails(firstUser?.email ? [firstUser.email] : []);
//                               }
//                             }}
//                           >
//                             <FormControlLabel 
//                               value="single" 
//                               control={<Radio size="small" />} 
//                               label="Single User" 
//                             />
//                             <FormControlLabel 
//                               value="multiple" 
//                               control={<Radio size="small" />} 
//                               label="Multiple Users" 
//                             />
//                           </RadioGroup>
//                         </FormControl>
//                       </Box>
//                     </Box>

//                     {groupUsers.length > 0 ? (
//                       <>
//                         <Box sx={{ flex: 1, overflow: 'auto', p: 1 }}>
//                           <List sx={{ p: 0 }}>
//                             {groupUsers.map((user) => (
//                               <ListItem
//                                 key={user.id}
//                                 secondaryAction={
//                                   <Checkbox
//                                     edge="end"
//                                     checked={selectedUsers.includes(user.id)}
//                                     onChange={() => handleUserToggle(user)}
//                                     disabled={
//                                       assignmentMode === "single" &&
//                                       selectedUsers[0] !== user.id &&
//                                       selectedUsers.length > 0
//                                     }
//                                     color="primary"
//                                   />
//                                 }
//                                 sx={{ 
//                                   px: 2,
//                                   py: 1.5,
//                                   mb: 1,
//                                   borderRadius: 1,
//                                   border: '1px solid',
//                                   borderColor: 'divider',
//                                   bgcolor: selectedUsers.includes(user.id) ? 'primary.light' : 'transparent',
//                                   '&:hover': {
//                                     bgcolor: selectedUsers.includes(user.id) ? 'primary.light' : 'action.hover',
//                                   }
//                                 }}
//                               >
//                                 <ListItemAvatar>
//                                   <Avatar sx={{ bgcolor: "secondary.main" }}>
//                                     {getInitials(user.name || user.email)}
//                                   </Avatar>
//                                 </ListItemAvatar>
//                                 <ListItemText 
//                                   primary={
//                                     <Typography variant="body1" fontWeight="medium">
//                                       {user.name || user.email}
//                                     </Typography>
//                                   } 
//                                   secondary={
//                                     <Box>
//                                       <Typography variant="body2" color="text.secondary">
//                                         {user.email}
//                                       </Typography>
//                                       {user.name && user.name !== user.email && (
//                                         <Typography variant="caption" color="text.secondary">
//                                           ID: {user.id}
//                                         </Typography>
//                                       )}
//                                     </Box>
//                                   } 
//                                 />
//                               </ListItem>
//                             ))}
//                           </List>
//                         </Box>

//                         <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'grey.50' }}>
//                           <Typography variant="body2" color="text.secondary">
//                             <strong>Selected:</strong> {selectedUsers.length} user(s)
//                             {selectedUsers.length > 0 && (
//                               <Box sx={{ mt: 1 }}>
//                                 <Typography variant="caption" component="div" color="primary">
//                                   {assignmentMode === "multiple" 
//                                     ? "Multiple users will be assigned to this ticket"
//                                     : "Single user assignment mode"}
//                                 </Typography>
//                                 <Typography variant="caption" component="div" color="text.primary" sx={{ mt: 0.5 }}>
//                                   <strong>Selected emails:</strong> {selectedUserEmails.join(', ')}
//                                 </Typography>
//                               </Box>
//                             )}
//                           </Typography>
//                         </Box>
//                       </>
//                     ) : (
//                       <Box sx={{ textAlign: 'center', py: 6, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
//                         <PersonAddIcon sx={{ fontSize: 60, color: 'grey.400', mb: 2 }} />
//                         <Typography color="text.secondary" gutterBottom>
//                           No users found in this group
//                         </Typography>
//                         <Typography variant="body2" color="text.secondary">
//                           The group "{selectedGroup.name}" doesn't have any members or member data is not available.
//                         </Typography>
//                       </Box>
//                     )}
//                   </>
//                 ) : groups.length > 0 ? (
//                   <Box sx={{ textAlign: 'center', py: 6, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
//                     <GroupIcon sx={{ fontSize: 60, color: 'grey.400', mb: 2 }} />
//                     <Typography color="text.secondary" gutterBottom>
//                       Select a group to view its members
//                     </Typography>
//                     <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
//                       Click on a group from the left panel to see its members and assign them to this ticket.
//                     </Typography>
//                   </Box>
//                 ) : (
//                   <Box sx={{ textAlign: 'center', py: 6, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
//                     <GroupIcon sx={{ fontSize: 60, color: 'grey.400', mb: 2 }} />
//                     <Typography color="text.secondary" gutterBottom>
//                       No groups available
//                     </Typography>
//                     <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
//                       This ticket doesn't have any groups assigned. Groups must be assigned to the ticket first.
//                     </Typography>
//                   </Box>
//                 )}
//               </Paper>
//             </Box>
//           )}
//         </DialogContent>

//         <DialogActions sx={{ borderTop: 1, borderColor: 'divider', p: 2 }}>
//           <Button onClick={handleCloseGroupDialog} color="inherit">
//             Cancel
//           </Button>
//           <Button
//             onClick={handleAssignUsers}
//             variant="contained"
//             disabled={selectedUsers.length === 0 || loadingGroups}
//             startIcon={<PersonAddIcon />}
//             sx={{ minWidth: 120 }}
//           >
//             {loadingGroups ? (
//               <CircularProgress size={20} />
//             ) : (
//               `Assign ${selectedUsers.length > 0 ? `(${selectedUsers.length})` : ''}`
//             )}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <Drawer
//         anchor="right"
//         open={showFollowUpChat}
//         onClose={handleChatDrawerClose}
//         PaperProps={{ sx: { width: { xs: "100%", sm: 500 } } }}
//       >
//         <Box
//           sx={{
//             display: "flex",
//             flexDirection: "column",
//             height: "100%",
//             bgcolor: "background.paper",
//           }}
//         >
//           {/* Header */}
//           <Box
//             sx={{
//               p: 2,
//               bgcolor: "primary.main",
//               color: "white",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "space-between",
//             }}
//           >
//             <Box>
//               <Typography variant="body2">Ticket #{currentChatTicket?.id}</Typography>
//               <Typography variant="body2">{currentChatTicket?.title}</Typography>
//               <Typography variant="caption" sx={{ color: "white" }}>
//                 {currentChatTicket?.description}
//               </Typography>
//             </Box>
//             <IconButton onClick={() => setShowFollowUpChat(false)} sx={{ color: "white" }}>
//               <CloseIcon />
//             </IconButton>
//           </Box>
          
//           {/* Tab Buttons */}
//           <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
//             <Tabs value={chatTab} onChange={(e, v) => setChatTab(v)} centered>
//               <Tab label="Follow-up" icon={<ChatIcon />} />
//               <Tab
//                 label="Clarification Supplied"
//                 icon={<QuestionAnswerIcon />}
//                 disabled={
//                   isSolvedTicket ||
//                   selectedType === "closed" ||
//                   selectedType === "Cancelled" ||
//                   selectedType === "clarification_applied"
//                 }
//               />
//               <Tab
//                 label="Solution"
//                 icon={<DoneAllIcon />}
//                 disabled={
//                   !isSolvedTicket ||
//                   selectedType === "closed" ||
//                   selectedType === "Cancelled" ||
//                   selectedType === "clarification_applied" ||
//                   selectedType === "clarification_required"
//                 }
//               />
//             </Tabs>
//           </Box>
          
//           {/* Tab Content */}
//           <Box sx={{ flex: 1 }}>
//             {chatTab === 0 && (
//               <Box
//                 sx={{
//                   display: "flex",
//                   flexDirection: "column",
//                   height: "100%",
//                 }}
//               >
//                 {/* Messages Area */}
//                 <Box
//                   sx={{
//                     flex: 1,
//                     overflowY: "auto",
//                     p: 2,
//                     display: "flex",
//                     flexDirection: "column",
//                     gap: 2,
//                   }}
//                 >
//                   {loadingFollowUpChats ? (
//                     <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
//                       <CircularProgress />
//                     </Box>
//                   ) : groupedChats.length === 0 ? (
//                     <Box
//                       sx={{
//                         display: "flex",
//                         flexDirection: "column",
//                         justifyContent: "center",
//                         alignItems: "center",
//                         height: "100%",
//                         color: "text.secondary",
//                       }}
//                     >
//                       <ChatIcon sx={{ fontSize: 60, mb: 2, opacity: 0.5 }} />
//                       <Typography>No messages yet. Start the conversation!</Typography>
//                     </Box>
//                   ) : (
//                     groupedChats.map((group) => (
//                       <Box key={group.date} sx={{ mb: 3 }}>
//                         <Divider sx={{ my: 2, width: "100%" }}>
//                           <Chip label={group.date} size="small" sx={{ bgcolor: "grey.200" }} />
//                         </Divider>
//                         {group.messages.map((msg, index) => {
//                           const msgId = msg.id || `msg-${index}`;
//                           const isMe = Number(msg.sender) === Number(currentUserId);
//                           const isProtectedMsg = msg.protected === true;
//                           const isRevealed = revealedMessages.has(msgId);
//                           const canReveal =
//                             Number(msg.sender) === Number(currentUserId) ||
//                             Number(msg.receiver) === Number(currentUserId);

//                           const toggleReveal = () => {
//                             if (!canReveal) return;
//                             setRevealedMessages((prev) => {
//                               const newSet = new Set(prev);
//                               newSet.has(msgId) ? newSet.delete(msgId) : newSet.add(msgId);
//                               return newSet;
//                             });
//                           };

//                           const getText = () => {
//                             if (!isProtectedMsg) return msg.message || "";
//                             if (!canReveal)
//                               return "*** PROTECTED MESSAGE - VISIBLE ONLY TO PARTICIPANTS ***";
//                             const real = msg.decrypted_message || msg.message;
//                             return isRevealed ? real : "Protected Message (click eye to reveal)";
//                           };

//                           return (
//                             <Box key={msgId} sx={{ display: "flex", justifyContent: isMe ? "flex-end" : "flex-start", mb: 2 }}>
//                               {!isMe ? (
//                                 <Box sx={{ display: "flex", alignItems: "flex-end", gap: 1, maxWidth: "80%" }}>
//                                   <Avatar sx={{ width: 40, height: 40, bgcolor: "grey.300" }}>
//                                     {getInitials(assignee?.name)}
//                                   </Avatar>
//                                   <Box sx={{ position: "relative", bgcolor: "grey.100", p: 2, borderRadius: 2, boxShadow: 1 }}>
//                                     {isProtectedMsg && (
//                                       <SecurityIcon
//                                         sx={{
//                                           position: "absolute",
//                                           top: -10,
//                                           right: -10,
//                                           fontSize: 20,
//                                           bgcolor: "#4CAF50",
//                                           color: "white",
//                                           borderRadius: "50%",
//                                           p: 0.5,
//                                         }}
//                                       />
//                                     )}
//                                     <Typography variant="body1" sx={{ wordBreak: "break-word" }}>
//                                       {getText()}
//                                     </Typography>
//                                     {isProtectedMsg && canReveal && (
//                                       <IconButton size="small" onClick={toggleReveal} sx={{ position: "absolute", bottom: 6, right: 8 }}>
//                                         {isRevealed ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
//                                       </IconButton>
//                                     )}
//                                     <Typography variant="caption" sx={{ display: "block", mt: 1, color: "text.secondary" }}>
//                                       {new Date(msg.createdon).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} •{" "}
//                                       {assignee?.name || "Assignee"}
//                                     </Typography>
//                                   </Box>
//                                 </Box>
//                               ) : (
//                                 <Box sx={{ display: "flex", alignItems: "flex-end", gap: 1, flexDirection: "row-reverse", maxWidth: "80%" }}>
//                                   <Avatar sx={{ width: 40, height: 40, bgcolor: "primary.main", color: "white" }}>
//                                     {getInitials(currentUserName)}
//                                   </Avatar>
//                                   <Box sx={{ position: "relative", bgcolor: "primary.main", color: "white", p: 2, borderRadius: 2, boxShadow: 1 }}>
//                                     {isProtectedMsg && (
//                                       <SecurityIcon
//                                         sx={{
//                                           position: "absolute",
//                                           top: -10,
//                                           left: -10,
//                                           fontSize: 20,
//                                           bgcolor: "#4CAF50",
//                                           color: "white",
//                                           borderRadius: "50%",
//                                           p: 0.5,
//                                         }}
//                                       />
//                                     )}
//                                     <Typography variant="body1" sx={{ wordBreak: "break-word" }}>
//                                       {getText()}
//                                     </Typography>
//                                     {isProtectedMsg && canReveal && (
//                                       <IconButton
//                                         size="small"
//                                         onClick={toggleReveal}
//                                         sx={{ position: "absolute", bottom: 6, right: 8, color: "white", bgcolor: "rgba(255,255,255,0.2)" }}
//                                       >
//                                         {isRevealed ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
//                                       </IconButton>
//                                     )}
//                                     <Typography variant="caption" sx={{ display: "block", mt: 1, opacity: 0.8 }}>
//                                       {new Date(msg.createdon).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} • You
//                                     </Typography>
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
                
//                 {/* Message Input */}
//                 <Box
//                   sx={{
//                     p: 2,
//                     borderTop: 1,
//                     borderColor: "divider",
//                     bgcolor: "background.default",
//                   }}
//                 >
//                   <Box sx={{ display: "flex", gap: 1 }}>
//                     <TextField
//                       fullWidth
//                       size="small"
//                       placeholder="Type your message..."
//                       value={newFollowUpMessage}
//                       onChange={(e) => setNewFollowUpMessage(e.target.value)}
//                       disabled={sendingFollowUpMessage || !assignee}
//                       onKeyPress={(e) => {
//                         if (e.key === "Enter" && !e.shiftKey) {
//                           e.preventDefault();
//                           sendFollowUpMessageHandler(newFollowUpMessage);
//                         }
//                       }}
//                       multiline
//                       maxRows={4}
//                     />
//                     <Tooltip
//                       title={
//                         isConfidentialTicket
//                           ? "All messages are protected (Confidential Ticket)"
//                           : isProtected
//                           ? "Protected mode ON"
//                           : "Click to send this message protected"
//                       }
//                     >
//                       <span>
//                         <IconButton
//                           onClick={() => {
//                             if (!isConfidentialTicket) {
//                               setIsProtected(!isProtected);
//                             }
//                           }}
//                           disabled={isConfidentialTicket}
//                           sx={{
//                             color: isProtected || isConfidentialTicket ? "white" : "success.main",
//                             bgcolor: isProtected || isConfidentialTicket ? "success.main" : "transparent",
//                             border: "1px solid",
//                             "&:hover": {
//                               bgcolor: isProtected || isConfidentialTicket ? "success.dark" : "success.light",
//                             },
//                           }}
//                         >
//                           <SecurityIcon />
//                         </IconButton>
//                       </span>
//                     </Tooltip>
//                     <IconButton
//                       onClick={() => sendFollowUpMessageHandler(newFollowUpMessage)}
//                       disabled={!newFollowUpMessage.trim() || sendingFollowUpMessage || !assignee}
//                       color="primary"
//                       sx={{ alignSelf: "flex-end" }}
//                     >
//                       {sendingFollowUpMessage ? <CircularProgress size={20} /> : <SendIcon />}
//                     </IconButton>
//                   </Box>
//                   {(isProtected || isConfidentialTicket) && (
//                     <Typography variant="caption" color="success.main" sx={{ mt: 1, display: "block", textAlign: "center" }}>
//                       <SecurityIcon fontSize="small" sx={{ verticalAlign: "middle", mr: 0.5 }} />
//                       {isConfidentialTicket
//                         ? "All messages are protected (Confidential Ticket)"
//                         : "This message will be sent as protected"}
//                     </Typography>
//                   )}
//                 </Box>
//               </Box>
//             )}
//             {chatTab === 1 && (
//               <Box sx={{ display: "flex", flexDirection: "column", p: 3 }}>
//                 {clarificationRequested ? (
//                   <Box sx={{ textAlign: "center", flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
//                     <HelpOutlineIcon sx={{ fontSize: 80, color: "warning.main", mb: 2 }} />
//                     <Typography variant="h6" fontWeight={600}>
//                       Clarification Request Already Sent
//                     </Typography>
//                     <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>
//                       Waiting for the assignee to respond.
//                     </Typography>
//                     <Button variant="outlined" onClick={() => setChatTab(0)}>
//                       Back to Follow-up
//                     </Button>
//                   </Box>
//                 ) : isSolvedTicket ? (
//                   <Box sx={{ textAlign: "center", flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
//                     <DoneAllIcon sx={{ fontSize: 80, color: "success.main", mb: 2 }} />
//                     <Typography variant="h6" fontWeight={600}>
//                       Ticket Already Solved
//                     </Typography>
//                     <Typography color="text.secondary" sx={{ mt: 1 }}>
//                       Cannot request clarification on solved tickets.
//                     </Typography>
//                     <Button variant="outlined" onClick={() => setChatTab(0)}>
//                       Back to Follow-up
//                     </Button>
//                   </Box>
//                 ) : (
//                   <>
//                     <Box sx={{ textAlign: "center", mb: 3 }}>
//                       <QuestionAnswerIcon sx={{ fontSize: 60, color: "primary.main", mb: 2 }} />
//                       <Typography variant="h6" fontWeight={600}>
//                         Clarification Supplied
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
//                         startIcon={sendingClarification ? <CircularProgress size={20} /> : <QuestionAnswerIcon />}
//                         onClick={handleRequestClarification}
//                         disabled={!clarificationText.trim() || sendingClarification}
//                       >
//                         Send Request
//                       </Button>
//                       <Button
//                         variant="outlined"
//                         onClick={() => {
//                           setClarificationText("");
//                           setChatTab(0);
//                         }}
//                         disabled={sendingClarification}
//                       >
//                         Cancel
//                       </Button>
//                     </Box>
//                   </>
//                 )}
//               </Box>
//             )}
//             {chatTab === 2 && isSolvedTicket && (
//               <Box
//                 sx={{
//                   display: "flex",
//                   flexDirection: "column",
//                   justifyContent: "center",
//                   alignItems: "center",
//                   p: 4,
//                   gap: 2,
//                   textAlign: "center",
//                 }}
//               >
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
//                     color="error"
//                     onClick={handleResolveSolution}
//                     disabled={isResolved}
//                     size="small"
//                   >
//                     {isResolved ? "Rejected" : "Rejected"}
//                   </Button>
//                   <Button
//                     variant={isApproved ? "contained" : "outlined"}
//                     color="success"
//                     onClick={handleApproveSolution}
//                     disabled={isApproved}
//                     size="small"
//                   >
//                     {isApproved ? "Accepted" : "Accepted"}
//                   </Button>
//                 </Box>
//                 <Button variant="outlined" onClick={() => setChatTab(0)} sx={{ mt: 1 }}>
//                   Back
//                 </Button>
//               </Box>
//             )}
//           </Box>
//         </Box>
//       </Drawer>
//     </Box>
//   );
// };

// export default RequestTabs;
