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

import { useState, useEffect, useMemo } from "react";
import { useTheme } from "@mui/material/styles";
import { Box, Card, CardContent, Typography, Grid, TextField, Button, Table, TableHead, TableRow, TableCell, TableBody, TableContainer, useMediaQuery, Autocomplete, Stack, Pagination, Tooltip, IconButton, Icon, Drawer, CircularProgress, Divider, Chip, Avatar, Tabs, Tab } from "@mui/material";
import { useNavigate } from "react-router-dom";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CloseIcon from '@mui/icons-material/Close';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import SecurityIcon from '@mui/icons-material/Security';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import CancelIcon from '@mui/icons-material/Cancel';
//import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
//import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import LockIcon from '@mui/icons-material/Lock';
import { Chat as ChatIcon, Send as SendIcon, } from "@mui/icons-material";
import { toast } from "react-toastify";
import { fetchMessages, sendMessage, getTicketDetails, updateTicket} from "../../Api";

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
    console.log("chat", chatTab);
    
    // 0: Follow-up (Chat), 1: Solution
    // Solved ticket solution states
    const [isSolvedTicket, setIsSolvedTicket] = useState(false);
    const [solutionText, setSolutionText] = useState("");
    const [isResolved, setIsResolved] = useState(false);
    const [isApproved, setIsApproved] = useState(false);
    const [clarificationRequested, setClarificationRequested] = useState(false);

    const [isProtected, setIsProtected] = useState(false);
    console.log("protected???", isProtected);
    
    const [revealedMessages, setRevealedMessages] = useState(new Set());
    const [myProtectedMessages, setMyProtectedMessages] = useState({});
    const [clarificationText, setClarificationText] = useState("");
    const [clarificationSent, setClarificationSent] = useState(false);
    const [sendingClarification, setSendingClarification] = useState(false);
    
    // useEffect(() => {
    //     if (userStatus) {
    //         setTickets({
    //             new_assigned: Array.isArray(userStatus.new_assigned_tickets) ? userStatus.new_assigned_tickets : [],
    //             solved: Array.isArray(userStatus.solved_tickets) ? userStatus.solved_tickets : [],
    //             closed: Array.isArray(userStatus.closed_tickets) ? userStatus.closed_tickets : [],
    //             Cancelled: Array.isArray(userStatus.cancelled_tickets) ? userStatus.cancelled_tickets : [],
    //             clarification_required: Array.isArray(userStatus.clarification_required) ? userStatus.clarification_required : [],
    //             clarification_applied: Array.isArray(userStatus.clarification_applied) ? userStatus.clarification_applied : [],
    //         });
    //     }
    // }, [userStatus]);
    useEffect(() => {
    if (userStatus) {
        setTickets({
            new_assigned: Array.isArray(userStatus.new_assigned_tickets) ? userStatus.new_assigned_tickets : [],
            solved: Array.isArray(userStatus.solved_tickets) ? userStatus.solved_tickets : [],
            closed: Array.isArray(userStatus.closed_tickets) ? userStatus.closed_tickets : [],
            Cancelled: Array.isArray(userStatus.cancelled_tickets) ? userStatus.cancelled_tickets : [],
            clarification_required: Array.isArray(userStatus.clarification_required_tickets) 
                ? userStatus.clarification_required_tickets 
                : [],
            clarification_applied: Array.isArray(userStatus.clarification_applied_tickets) 
                ? userStatus.clarification_applied_tickets 
                : [],
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
            label: "New",
            color: "warning",
            icon: <NewReleasesIcon />,
            count: userStatus?.new_assigned || 0,
            description: "Tickets recently assigned to you"
        },
        // {
        //     id: "pending",
        //     label: "InProcess",
        //     color: "warning",
        //     icon: <AccessTimeFilledIcon />,
        //     //count: userStatus?.new_assigned || 0,
        //     count: 0,
        //     description: "Tickets recently assigned to you"
        // },
        {
            id: "solved",
            label: "Resolved",
            color: "success",
            icon: <DoneAllIcon />,
            count: userStatus?.solved || 0,
            description: "Tickets you have resolved"
        },
        {
            id: "Cancelled",  // ← Change from "cancel" to "Cancelled"
            label: "Cancelled",
            color: "error",
            icon: <CancelIcon />,
            count: userStatus?.cancelled || 0,
            description: "Tickets recently assigned to you"
        },
        {
            id: "closed",
            label: "Closed",
            color: "info",
            icon: <LockIcon />,
            count: userStatus?.closed || 0,
            description: "Tickets that are completed"
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

    // const selectedTickets = tickets[selectedType] || [];
    // const departmentList = useMemo(
    //     () => [...new Set(selectedTickets.map((row) => row.department_detail?.field_name).filter(Boolean))],
    //     [selectedTickets]
    // );

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
        new_assigned: "NEW ASSIGNED TICKETS",
        pending: "PENDING TICKETS",
        solved: "SOLVED TICKETS",
        cancel: "CANCELLED TICKETS",
        closed: "CLOSED TICKETS",
        clarification_applied : "Clarification Supplied Ticket",
        clarification_required : "Clarification Required Ticket"
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

    // const sendFollowUpMessageHandler = async (messageText) => {
    //     if (!messageText.trim()) {
    //         toast.error("Message cannot be empty");
    //         return;
    //     }

    //     if (!currentChatTicket?.id) {
    //         toast.error("No ticket selected");
    //         return;
    //     }
    //     if (!assignee?.id) {
    //         toast.error("Assignee not loaded");
    //         return;
    //     }
    //     if (!currentUserId) {
    //         toast.error("User not authenticated");
    //         return;
    //     }
    //     const receiverId = assignee.id;
    //     setSendingFollowUpMessage(true);
    //     try {
    //         const payload = {
    //             sender: currentUserId, // Explicitly include sender (logged-in user - ticket creator)
    //             receiver: receiverId,
    //             ticket_no: currentChatTicket.id,
    //             message: messageText.trim(),
    //             protected: isProtected,
    //         };
    //         const resData = await sendMessage(payload);
    //         const newMessage = {
    //             ...resData,
    //             sender: currentUserId,
    //             createdon: new Date().toISOString(),
    //         };

    //         const message = await fetchMessages();
    //         const ticketMsgs = message.filter(msg => msg.ticket_no == currentChatTicket.id);
    //         setFollowUpChats(ticketMsgs.sort((a,b) => new Date(a.createdon) - new Date(b.createdon)));

    //         setNewFollowUpMessage("");
    //         setIsProtected(false);
    //         toast.success(isProtected ? "Protected message sent!" : "Message sent successfully!");
    //     } catch (err) {
    //         toast.error("Failed to send message");
    //         console.error("Error sending message:", err);
    //     } finally {
    //         setSendingFollowUpMessage(false);
    //     }
    // };

    // const handleResolveSolution = () => {
    //     // TODO: Call API to resolve solution
    //     setIsResolved(true);
    //     toast.success("Solution resolved!");
    // };

    // const sendFollowUpMessageHandler = async (text) => {
    //     if (!text.trim() || !chatRecipient?.id || !currentChatTicket?.id) {
    //         toast.error("Cannot send message: missing details");
    //         return;
    //     }
 
    //     const receiverId = chatRecipient.id;
 
    //     setSendingFollowUpMessage(true);
    //     try {
    //         await sendMessage({
    //             receiver: receiverId,
    //             ticket_no: currentChatTicket.id,
    //             message: text.trim(),
    //             protected: isProtected,
    //         });
 
    //         // Refetch messages to show the new one
    //         const messages = await fetchMessages();
    //         const ticketMsgs = messages.filter(m => m.ticket_no == currentChatTicket.id);
    //         setFollowUpChats(ticketMsgs.sort((a, b) => new Date(a.createdon) - new Date(b.createdon)));
 
    //         setNewFollowUpMessage("");
    //         setIsProtected(false); // Reset shield toggle
    //         toast.success(isProtected ? "🔒 Protected message sent!" : "Message sent!");
    //     } catch (err) {
    //         console.error("Send error:", err);
    //         toast.error("Failed to send message");
    //     } finally {
    //         setSendingFollowUpMessage(false);
    //     }
    // };


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
        
        setSendingFollowUpMessage(true);

        try {
            await sendMessage({
                receiver: receiverId,
                ticket_no: currentChatTicket.id,
                message: text.trim(),
                protected: isProtected,
            });
            
            
            const message = await fetchMessages();
            const ticketMsgs = message.filter(
                m =>
                    m.ticket_no == currentChatTicket.id &&
                    ((m.sender === currentUserId && m.receiver === receiverId) ||
                    (m.sender === receiverId && m.receiver === currentUserId))
            );
            setFollowUpChats(ticketMsgs.sort((a, b) => new Date(a.createdon) - new Date(b.createdon)));

            setNewFollowUpMessage("");
            toast.success(isProtected ? "Protected message sent!" : "Message sent!");
        } catch (err) {
            console.error("Send error:", err);
            toast.error("Failed to send message");

            if (newMessageId) {
                setFollowUpChats(prev => prev.filter(m => m.id !== newMessageId));
                setMyProtectedMessages(prev => {
                    const copy = { ...prev };
                    delete copy[newMessageId];
                    return copy;
                });
            }
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

        // try {
        //     const ticketNoStr = String(currentChatTicket.id);

        //     const assigneesDetail = currentTicketData.assignees_detail || [];
        //     const assignedGroupsDetail = currentTicketData.assigned_groups_detail || [];

        //     const assigneeEmails = assigneesDetail.map(u => u.email).filter(Boolean);
        //     const assignedGroupIds = assignedGroupsDetail.map(g => g.id).filter(Boolean);

        //     const assignedToType = [];
        //     if (assigneeEmails.length > 0) assignedToType.push('user');
        //     if (assignedGroupIds.length > 0) assignedToType.push('group');

        //     const categoryId = currentTicketData.category || currentTicketData.category_detail?.id;

        //     const payload = {
        //         title: currentTicketData.title || "",
        //         description: currentTicketData.description || "",
        //         category: categoryId,
        //         status: "41", // ← NEW (or use another ID like "Resolved" if you have one)
        //         assigned_to_type: assignedToType,
        //         assignee: assigneeEmails,
        //         assigned_group: assignedGroupIds,
        //         resolved_status: "yes" // optional
        //     };

        //     const result = await updateTicket(ticketNoStr, payload);
        //     if (!result.success) throw new Error(result.error || "Failed");

        //     toast.success("Solution resolved! Ticket status changed to New.");

        //     // Move ticket from solved → new_assigned (or wherever "New" tickets appear)
        //     setTickets(prev => {
        //         const ticket = prev.solved.find(t => t.ticket_no == currentChatTicket.id);
        //         if (!ticket) return prev;

        //         // Update status display locally
        //         ticket.status_detail = { field_values: "New" };

        //         return {
        //             ...prev,
        //             solved: prev.solved.filter(t => t.ticket_no != currentChatTicket.id),
        //             new_assigned: [ticket, ...prev.new_assigned]
        //         };
        //     });

        //     setIsResolved(true);
        //     setShowFollowUpChat(false);
        //     setSelectedType("new_assigned"); // or "solved" if you keep it there

        //     await sendFollowUpMessageHandler("I have resolved the solution. Ticket reopened as New if further action needed.");

        // } catch (err) {
        //     console.error(err);
        //     toast.error("Failed to resolve solution");
        // }
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

            // BASIC FIELDS
            formData.append("title", currentTicketData.title || "");
            formData.append("description", currentTicketData.description || "");
            formData.append("category", currentTicketData.category || currentTicketData.category_detail?.id || "");

            // STATUS (New)
            formData.append("status", "41"); // New
            formData.append("resolved_status", "yes");

            //ASSIGNED USERS
    
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

            //ASSIGNED GROUPS
    
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

            // Update UI
            setTickets(prev => {
                const ticket = prev.solved.find(
                t => t.ticket_no == currentChatTicket.id
                );
                if (!ticket) return prev;

                ticket.status_detail = { field_values: "New" };

                return {
                ...prev,
                solved: prev.solved.filter(
                    t => t.ticket_no != currentChatTicket.id
                ),
                new_assigned: [ticket, ...prev.new_assigned]
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
    // const handleApproveSolution = () => {
    //     // TODO: Call API to approve solution
    //     setIsApproved(true);
    //     toast.success("Solution approved!");
    // };
   const handleApproveSolution = async () => {
        if (!currentChatTicket?.id) {
            toast.error("No ticket selected");
            return;
        }

        // Get fresh ticket details to preserve current data
        let currentTicketData = {};
        try {
            const ticketDetails = await getTicketDetails(currentChatTicket.id);
            currentTicketData = ticketDetails.ticket || ticketDetails;
        } catch (err) {
            console.error("Failed to fetch latest ticket details:", err);
            toast.error("Could not fetch ticket details");
            return;
        }

        try {
            const ticketNoStr = String(currentChatTicket.id);
            console.log("Updating ticket to Closed:", ticketNoStr);

            const assignedUsers =
                currentTicketData.assignees_detail ||
                currentTicketData.assigned_users ||
                [];

            const assignedGroups =
                currentTicketData.assigned_groups_detail ||
                currentTicketData.assigned_groups ||
                [];

            const formData = new FormData();

            // BASIC FIELDS
            formData.append("title", currentTicketData.title || "");
            formData.append("description", currentTicketData.description || "");
            formData.append("category", currentTicketData.category || currentTicketData.category_detail?.id || "");

            // CLOSED STATUS
            formData.append("status", "46"); // Closed

            //ASSIGNEES
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

            //  GROUPS
            assignedGroups.forEach((group, index) => {
                if (group?.id) {
                formData.append(`assigned_group[${index}]`, group.id);
                }
            });

            if (assignedGroups.length > 0) {
                formData.append(`assigned_to_type[${assignedTypeIndex}]`, "group");
            }

            console.log("Approve Solution → Closing ticket (FormData):", [
                ...formData.entries(),
            ]);

            const result = await updateTicket(ticketNoStr, formData);
            if (!result.success) {
                throw new Error(result.error || "Failed to close ticket");
            }

            toast.success("Solution approved and ticket closed successfully!");

            // UI updates
            setIsApproved(true);
            setShowFollowUpChat(false);
            loadData();
            setSelectedType("closed");
        } catch (err) {
        console.error("Error closing ticket on approve:", err);
        //toast.error("Failed to close ticket");
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
            setClarificationRequested(ticketData.status === "156" || ticketData.clarification_requested);
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

    const handleSendClarification = async () => {
        if (!clarificationText.trim()) return;

        setSendingClarification(true);
        try {
            await sendMessage({
                receiver: currentUserId === assignee?.id ? currentChatTicket?.requested_by : assignee?.id, // Send to requester if assignee is sending
                ticket_no: currentChatTicket.id,
                message: `[Clarification Required]\n\n${clarificationText.trim()}`,
                protected: false, // or true if you want it private
            });

            // Optional: Add to chat as a visible message
            await sendFollowUpMessageHandler(`[Clarification Required] ${clarificationText.trim()}`);

            setClarificationText("");
            setClarificationSent(true);
            toast.success("Clarification required sent!");

            // Auto switch back to Follow-up tab
            setChatTab(0);

            // Reset alert after 5 seconds
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
            // Step 1: Update ticket status to "57" - Clarification Required
            let currentTicketData = {};
            try {
                const ticketDetails = await getTicketDetails(currentChatTicket.id);
                currentTicketData = ticketDetails.ticket || ticketDetails;
            } catch (err) {
                toast.error("Could not fetch ticket details");
                return;
            }

        const ticketNoStr = String(currentChatTicket.id);
        const assignedUsers = currentTicketData.assignees_detail || currentTicketData.assigned_users || [];
        const assignedGroups = currentTicketData.assigned_groups_detail || currentTicketData.assigned_groups || [];

        const formData = new FormData();
        formData.append("title", currentTicketData.title || "");
        formData.append("description", currentTicketData.description || "");
        formData.append("category", currentTicketData.category || currentTicketData.category_detail?.id || "");
        formData.append("status", "157"); // ← Clarification Required

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
            throw new Error(result.error || "Failed to update ticket status");
        }

        // Step 2: Send clarification message in chat
        const clarificationMessage = `[Clarification Supplied]\n\n${clarificationText.trim()}`;
        await sendMessage({
            receiver: assignee?.id,
            ticket_no: currentChatTicket.id,
            message: clarificationMessage,
            protected: false,
        });

        // Optional: Also add to visible chat
        await sendFollowUpMessageHandler(clarificationMessage);

        toast.success("Clarification Supplied sent and ticket status updated!");
        setClarificationText("");
        setChatTab(0); // Switch back to chat

        // Update local tickets list: move to clarification_required
        setTickets(prev => {
            const ticket = prev[selectedType]?.find(t => t.ticket_no == currentChatTicket.id);
            if (ticket) {
                ticket.status_detail = { field_values: "Clarification Required" };
                return {
                    ...prev,
                    [selectedType]: prev[selectedType].filter(t => t.ticket_no != currentChatTicket.id),
                    clarification_required: [ticket, ...(prev.clarification_required || [])]
                };
            }
            return prev;
        });

        setSelectedType("clarification_required");
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
        // Reset solved states
        setIsSolvedTicket(false);
        setSolutionText("");
        setIsResolved(false);
        setIsApproved(false);
        setClarificationText("");
        setClarificationSent(false);
    };

    // const filteredRows = useMemo(() => {
    //     return selectedTickets.filter((row) => {
    //         const matchesSearch =
    //             Object.values(row)
    //                 .join(" ")
    //                 .toLowerCase()
    //                 .includes(search.toLowerCase());
    //         const matchesDept = department ? row.department_detail?.field_name === department : true;
    //         return matchesSearch && matchesDept;
    //     });
    // }, [selectedTickets, search, department]);
//     const filteredRows = useMemo(() => {
//     const searchLower = search.toLowerCase().trim();

//     return selectedTickets.filter((row) => {
//         const matchesDept = department 
//             ? row.department_detail?.field_name === department 
//             : true;

//         if (!searchLower) return matchesDept;

//         const ticketNoStr = String(row.ticket_no || "").toLowerCase();
//         if (ticketNoStr.includes(searchLower)) return true;

//         if (row.title?.toLowerCase().includes(searchLower)) return true;
//         if (row.description?.toLowerCase().includes(searchLower)) return true;

//         return false;
//     }).filter(row => {
//         return department ? row.department_detail?.field_name === department : true;
//     });
// }, [selectedTickets, search, department]);

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
        const openDate = new Date(row.created_date).toLocaleDateString().toLowerCase();
        const updateDate = new Date(row.updated_date).toLocaleDateString().toLowerCase();
        if (openDate.includes(searchLower) || updateDate.includes(searchLower)) return true;
 
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
        <Box sx={{ width: "100%", mb:2 }}>
            <Grid container spacing={1} sx={{ mb: 4 }}>
                {statusCards.map((item) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }} key={item.id}>
                        <Card
                            onClick={() => handleCardClick(item.id)}
                            sx={{
                                transition: "0.3s ease",
                                maxWidth: 300,
                                maxHeight: 110,
                                minHeight: 100,
                                borderRadius: 5,
                                "&:hover": {
                                    background: "linear-gradient(135deg, #667eea, #764ba2)",
                                    color: "#fff",
                                    transform: "scale(1.03)",
                                }
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
                                        minWidth: 40,
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
                                                        {/* Header */}
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
                                                        <Typography fontWeight={600} mt={1} color="#2D3748">
                                                            {t.title}
                                                        </Typography>
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
                                                                                maxWidth:200,
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
                                                                                maxWidth: 200,
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
                    <Box sx={{ p: 2, bgcolor: "primary.main", color: "white", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <Box>
                            <Typography variant="body2">Ticket #{currentChatTicket?.id}</Typography>
                            <Typography variant="body2">{currentChatTicket?.title}</Typography>
                            <Typography variant="caption" sx={{ color: "white" }}>{currentChatTicket?.description}</Typography>
                        </Box>
                        <IconButton onClick={() => setShowFollowUpChat(false)} sx={{ color: "white" }}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    {/* Tab Buttons */}
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={chatTab} onChange={(e, v) => setChatTab(v)} centered>
                            <Tab label="Follow-up" icon={<ChatIcon />} />
                            <Tab label="Solution" icon={<DoneAllIcon />} disabled={!isSolvedTicket} />
                            <Tab label="Clarification Supplied" icon={<HelpOutlineIcon />} disabled={isSolvedTicket} />
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
                                        groupedChats.map((group) => (
                                            <Box key={group.date} sx={{ mb: 3 }}>
                                                <Divider sx={{ my: 2, width: "100%" }}>
                                                    <Chip
                                                        label={group.date}
                                                        size="small"
                                                        sx={{ bgcolor: "grey.200" }}
                                                    />
                                                </Divider>
                                                {group.messages.map((msg, index) => {
                                                    const isMe = Number(msg.sender) === Number(currentUserId);
                                                    const isProtected = msg.protected === true;
                                                    const messageId = msg.id;
                                                    const isRevealed = revealedMessages.has(messageId);
                                                    const canViewDecrypted = Number(msg.sender) === Number(currentUserId) || Number(msg.receiver) === Number(currentUserId);

                                                    const toggleReveal = () => {
                                                        if (!canViewDecrypted) return;
                                                        setRevealedMessages(prev => {
                                                            const newSet = new Set(prev);
                                                            if (newSet.has(messageId)) {
                                                                newSet.delete(messageId);
                                                            } else {
                                                                newSet.add(messageId);
                                                            }
                                                            return newSet;
                                                        });
                                                    };

                                                    return (
                                                        <Box
                                                            key={msg.id || index}
                                                            sx={{
                                                                display: "flex",
                                                                justifyContent: isMe ? "flex-end" : "flex-start",
                                                                mb: 2
                                                            }}
                                                        >
                                                            {!isMe ? (
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
                                                                            position: "relative",
                                                                        }}
                                                                    >
                                                                        {isProtected && (
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
                                                                                    boxShadow: 2,
                                                                                }}
                                                                            />
                                                                        )}
                                                                        <Typography variant="body1" sx={{ wordBreak: "break-word" }}>
                                                                            {(() => {
                                                                                if (!msg.protected) {
                                                                                    return msg.message; // Normal message
                                                                                }

                                                                                const isSender = Number(msg.sender) === Number(currentUserId);
                                                                                const isReceiver = Number(msg.receiver) === Number(currentUserId);
                                                                                const canDecrypt = isSender || isReceiver;

                                                                                if (!canDecrypt) {
                                                                                    return "*** PROTECTED MESSAGE - VISIBLE ONLY TO RECEIVER ***";
                                                                                }

                                                                                // Show real text if revealed AND we have it (from local or server)
                                                                                const realText = isSender 
                                                                                    ? myProtectedMessages[msg.id] 
                                                                                    : msg.decrypted_message; // Receiver relies on backend

                                                                                if (isRevealed && realText) {
                                                                                    return realText;
                                                                                }

                                                                                // Default: show masked
                                                                                return msg.message || "*** PROTECTED MESSAGE - VISIBLE ONLY TO RECEIVER ***";
                                                                            })()}
                                                                        </Typography>
                                                                        {/* Eye Toggle - Only for protected messages and authorized users */}
                                                                        {msg.protected && (Number(msg.sender) === Number(currentUserId) || Number(msg.receiver) === Number(currentUserId)) && (
                                                                            <IconButton
                                                                                size="small"
                                                                                onClick={toggleReveal}
                                                                                sx={{
                                                                                    position: "absolute",
                                                                                    bottom: 6,
                                                                                    right: 8,
                                                                                    color: isMe ? "white" : "inherit",
                                                                                    opacity: 0.8,
                                                                                    bgcolor: isMe ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)",
                                                                                    '&:hover': {
                                                                                        bgcolor: isMe ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.2)"
                                                                                    }
                                                                                }}
                                                                            >
                                                                                {isRevealed ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                                                                            </IconButton>
                                                                        )}

                                                                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1 }}>
                                                                            <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "0.7rem" }}>
                                                                                {new Date(msg.createdon).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                                                                            </Typography>
                                                                            <Typography variant="caption" sx={{ ml: 1, color: "text.primary", fontSize: "0.75rem", fontWeight: "bold" }}>
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
                                                                            position: "relative",
                                                                        }}
                                                                    >
                                                                        <Typography variant="body1" sx={{ wordBreak: "break-word" }}>
                                                                            {isProtected && canViewDecrypted && isRevealed && msg.decrypted_message
                                                                                ? msg.decrypted_message
                                                                                : msg.message
                                                                            }
                                                                        </Typography>

                                                                        {/* Eye Toggle for Sender */}
                                                                        {isProtected && canViewDecrypted && (
                                                                            <IconButton
                                                                                size="small"
                                                                                onClick={toggleReveal}
                                                                                sx={{
                                                                                    position: "absolute",
                                                                                    bottom: 6,
                                                                                    right: 8,
                                                                                    color: "white",
                                                                                    opacity: 0.8,
                                                                                    bgcolor: "rgba(255,255,255,0.2)",
                                                                                    '&:hover': { bgcolor: "rgba(255,255,255,0.3)" }
                                                                                }}
                                                                            >
                                                                                {isRevealed ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                                                                            </IconButton>
                                                                        )}

                                                                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1 }}>
                                                                            <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.8)", fontSize: "0.7rem" }}>
                                                                                {new Date(msg.createdon).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                                                                            </Typography>
                                                                            <Typography variant="caption" sx={{ mr: 1, color: "white", fontSize: "0.75rem", fontWeight: "bold" }}>
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
                                        <Tooltip title={isProtected ? "Protected mode ON" : "Send protected message"}>
                                            <IconButton
                                                onClick={() => setIsProtected(true)}
                                                sx={{
                                                    color: isProtected ? "white" : "success.main",
                                                    bgcolor: isProtected ? "success.main" : "transparent",
                                                    border: "1px solid",
                                                    "&:hover": {
                                                        bgcolor: isProtected ? "success.dark" : "success.light",
                                                    },
                                                }}
                                            >
                                                <SecurityIcon />
                                            </IconButton>
                                        </Tooltip>
                                        {/* <Tooltip title={isProtected ? "Protected mode ON" : "Send protected message"}>
                                            <IconButton
                                                onClick={() => setIsProtected(!isProtected)}
                                                sx={{
                                                    color: isProtected ? "white" : "success.main",
                                                    bgcolor: isProtected ? "success.main" : "transparent",
                                                    border: "1px solid",
                                                    "&:hover": {
                                                        bgcolor: isProtected ? "success.dark" : "success.light",
                                                    },
                                                }}
                                            >
                                                <SecurityIcon />
                                            </IconButton>
                                        </Tooltip> */}
                                        <IconButton
                                            onClick={() => sendFollowUpMessageHandler(newFollowUpMessage)}
                                            disabled={!newFollowUpMessage.trim() || sendingFollowUpMessage || !assignee}
                                            color="primary"
                                            sx={{ alignSelf: "flex-end",  }}
                                        >
                                            {sendingFollowUpMessage ? <CircularProgress size={20} /> : <SendIcon />}
                                        </IconButton>
                                        
                                    </Box>
                                    {isProtected && (
                                        <Typography variant="caption" color="success.main" sx={{ mt: 1, display: "block", textAlign: "center" }}>
                                            <SecurityIcon fontSize="small" sx={{ verticalAlign: "middle", mr: 0.5 }} />
                                            This message will be sent as protected
                                        </Typography>
                                    )}
                                </Box>
                            </Box>
                        )}
                        {chatTab === 1 && isSolvedTicket && (
                            <Box 
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    height: "100%",
                                    p: 4,
                                    gap: 2,
                                    textAlign: "center"
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
                                        disabled={isResolved}
                                        size="small"
                                    >
                                        {isResolved ? "Resolved" : "Resolve Solution"}
                                    </Button>
                                    <Button
                                        variant={isApproved ? "contained" : "outlined"}
                                        color="success"
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
                        {/* {chatTab === 2 && !isSolvedTicket && (
                            <Box sx={{ display: "flex", flexDirection: "column", height: "100%", p: 3 }}>
                                {isTicketClarificationRequired() ? (
                                    <Box sx={{ textAlign: "center", flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                                        <HelpOutlineIcon sx={{ fontSize: 80, color: "warning.main", mb: 2 }} />
                                        <Typography variant="h6" fontWeight={600}>Clarification Request Already Sent</Typography>
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
                                ) : (
                                        <>
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
                                                    onClick={handleRequestClarification}
                                                    disabled={!clarificationText.trim() || sendingClarification}
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
                        )} */}
                        {chatTab === 2 && (
                            <Box sx={{ display: "flex", flexDirection: "column", height: "100%", p: 3 }}>
                                {clarificationRequested ? (
                                    // Already requested clarification
                                    <Box sx={{ textAlign: "center", flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                                        <HelpOutlineIcon sx={{ fontSize: 80, color: "warning.main", mb: 2 }} />
                                        <Typography variant="h6" fontWeight={600}>Clarification Request Already Sent</Typography>
                                        <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>
                                            Waiting for the assignee to respond.
                                        </Typography>
                                        <Button variant="outlined" onClick={() => setChatTab(0)}>
                                            Back to Follow-up
                                        </Button>
                                    </Box>
                                ) : isSolvedTicket ? (
                                    // Ticket is solved — cannot request clarification
                                    <Box sx={{ textAlign: "center", flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                                        <DoneAllIcon sx={{ fontSize: 80, color: "success.main", mb: 2 }} />
                                        <Typography variant="h6" fontWeight={600}>Ticket Already Solved</Typography>
                                        <Typography color="text.secondary" sx={{ mt: 1 }}>
                                            Cannot request clarification on solved tickets.
                                        </Typography>
                                        <Button variant="outlined" onClick={() => setChatTab(0)}>
                                            Back to Follow-up
                                        </Button>
                                    </Box>
                                ) : (
                                    // Show the form to request clarification
                                    <>
                                        <Box sx={{ textAlign: "center", mb: 3 }}>
                                            <QuestionAnswerIcon sx={{ fontSize: 60, color: "primary.main", mb: 2 }} />
                                            <Typography variant="h6" fontWeight={600}>Clarification Supplied</Typography>
                                            
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
                                                disabled={!clarificationText.trim() || sendingClarification}
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
                        
                    </Box>
                </Box>
            </Drawer>
        </Box >
    );
};
export default RequestTabs;



// import { useState, useEffect, useMemo } from "react";
// import { useTheme } from "@mui/material/styles";
// import { Box, Card, CardContent, Typography, Grid, TextField, Button, Table, TableHead, TableRow, TableCell, TableBody, TableContainer, useMediaQuery, Autocomplete, Stack, Pagination, Tooltip, IconButton, Icon, Drawer, CircularProgress, Divider, Chip, Avatar, Tabs, Tab, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import NewReleasesIcon from '@mui/icons-material/NewReleases'; // For New Assigned
// import DoneAllIcon from '@mui/icons-material/DoneAll'; // For Solved
// import LockIcon from '@mui/icons-material/Lock'; // For Closed
// import {
//     Chat as ChatIcon,
//     Send as SendIcon,
// } from "@mui/icons-material";
// import { toast } from "react-toastify";
// import {
//     fetchMessages,
//     sendMessage,
//     getTicketDetails,
//     updateTicket, // Import the updateTicket API function
// } from "../../Api"; // Assuming the API path is correct; adjust if needed
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
//         closed: []
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
//     const [currentTicketData, setCurrentTicketData] = useState(null); // New state for full ticket data
//     const [assignee, setAssignee] = useState(null);
//     const [assignedGroup, setAssignedGroup] = useState(null); // New state for group if no individual assignee
//     const [currentUserId, setCurrentUserId] = useState(null);
//     const [currentUserName, setCurrentUserName] = useState("You");
//     const [followUpAllowed, setFollowUpAllowed] = useState(false); // New state for follow-up allowance
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
//                 closed: userStatus.closed_tickets || []
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
//         if (!currentUserId) {
//             toast.error("User not authenticated");
//             return;
//         }
//         let receiverId;
//         if (assignee?.id) {
//             receiverId = assignee.id;
//         } else if (followUpAllowed) {
//             // For solved tickets with follow-up allowed but no individual assignee, use a default receiver (e.g., support or solver)
//             // Adjust this based on your API structure; assuming a solver_id or support_id field exists
//             receiverId = currentTicketData?.solver_id || currentTicketData?.support_receiver_id || currentUserId; // Fallback to current user if not set
//         } else {
//             toast.error("Assignee not loaded and follow-up not allowed");
//             return;
//         }
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
//     const updateLocalTicketState = (ticketId, newStatus, newStatusLabel) => {
//         console.log("Updating local state for ticket:", ticketId); // Added logging
//         if (selectedType === "solved" && currentTicketData) {
//             const ticketIndex = tickets.solved.findIndex(t => t.ticket_no === ticketId);
//             if (ticketIndex !== -1) {
//                 const originalTicket = tickets.solved[ticketIndex];
//                 const updatedTicket = {
//                     ...originalTicket,
//                     status_id: newStatus,
//                     status_detail: { ...originalTicket.status_detail, field_values: newStatusLabel },
//                     updated_date: new Date().toISOString(),
//                     followup_option_allowed: true, // Enable follow-up for solved tickets
//                 };
//                 setTickets(prev => ({
//                     ...prev,
//                     solved: prev.solved.filter((_, i) => i !== ticketIndex),
//                     closed: [...prev.closed, updatedTicket]
//                 }));
//                 // Switch to closed tab to show the updated ticket
//                 setSelectedType("closed");
//                 return true;
//             }
//         }
//         return false;
//     };
//     const handleResolveSolution = async () => {
//         try {
//             if (!currentTicketData?.id) {
//                 toast.error("No ticket selected");
//                 return;
//             }
//             const categoryId = currentTicketData.category_id || currentTicketData.category_detail?.id || "";
//             const subcategoryId = currentTicketData.subcategory_id || currentTicketData.subcategory_detail?.id || "";
//             const assigneeEmails = currentTicketData.assignees_detail ? currentTicketData.assignees_detail.map(u => u.email) : [];
//             const assignedGroupIds = currentTicketData.assigned_groups_detail ? currentTicketData.assigned_groups_detail.map(g => g.id) : [];
//             const assignedToType = [];
//             if (assigneeEmails.length > 0) assignedToType.push('user');
//             if (assignedGroupIds.length > 0) assignedToType.push('group');
//             // LOGGING: Inspect the payload
//             const payload = {
//                 title: currentTicketData.title || "",
//                 description: currentTicketData.description || "",
//                 category: categoryId,
//                 subcategory: subcategoryId,
//                 assigned_to_type: assignedToType,
//                 assignee: assigneeEmails,
//                 assigned_group: assignedGroupIds,
//                 status: 41,
//                 resolved_status: "yes",
//                 followup_option_allowed: true, // Allow follow-up messaging for solved tickets
//                 // Include other fields if required by API, e.g.:
//                 // assigned_to_type: currentTicketData.assigned_to_type || [],
//                 // assigned_group: currentTicketData.assigned_group_ids || []
//             };
//             console.log("Sending payload to API:", payload); // Added logging
//             console.log("Ticket ID:", currentTicketData.id); // Added logging
//             // If categoryId is empty, fallback to a default or error out
//             if (!categoryId) {
//                 console.error("Category ID is missing! Cannot update.");
//                 toast.error("Missing category ID – check ticket data.");
//                 return;
//             }
//             const response = await updateTicket(currentTicketData.id, payload); // Capture response
//             console.log("API Response:", response); // Added logging
//             setIsResolved(true);
//             setFollowUpAllowed(true); // Update local state to allow follow-up
//             // Update local state
//             const updated = updateLocalTicketState(currentTicketData.id, 41, "Resolved");
//             toast.success(updated ? "Solution resolved and ticket moved to closed!" : "Solution resolved!");
//             // Send automatic message
//             const assigneeName = assignee?.firstname || assignee?.name || "Team";
//             await sendFollowUpMessageHandler(`Hi ${assigneeName}, the solution has been resolved.`);
//             setChatTab(0); // Switch to chat tab to show the message
//             // Force re-render to sync local state (temporary; better to refetch)
//             setTickets(prev => ({ ...prev }));
//         } catch (err) {
//             console.error("Full error object:", err); // Enhanced logging
//             console.error("Error response (if any):", err.response?.data); // If using Axios/Fetch
//             toast.error(`Failed to resolve solution: ${err.message || "Unknown error"}`);
//         }
//     };
//     const handleApproveSolution = async () => {
//         try {
//             if (!currentTicketData?.id) {
//                 toast.error("No ticket selected");
//                 return;
//             }
//             const categoryId = currentTicketData.category_id || currentTicketData.category_detail?.id || "";
//             const subcategoryId = currentTicketData.subcategory_id || currentTicketData.subcategory_detail?.id || "";
//             const assigneeEmails = currentTicketData.assignees_detail ? currentTicketData.assignees_detail.map(u => u.email) : [];
//             const assignedGroupIds = currentTicketData.assigned_groups_detail ? currentTicketData.assigned_groups_detail.map(g => g.id) : [];
//             const assignedToType = [];
//             if (assigneeEmails.length > 0) assignedToType.push('user');
//             if (assignedGroupIds.length > 0) assignedToType.push('group');
//             // LOGGING: Inspect the payload
//             const payload = {
//                 title: currentTicketData.title || "",
//                 description: currentTicketData.description || "",
//                 category: categoryId,
//                 subcategory: subcategoryId,
//                 assigned_to_type: assignedToType,
//                 assignee: assigneeEmails,
//                 assigned_group: assignedGroupIds,
//                 status: 46,
//                 approved_status: "yes",
//                 followup_option_allowed: true, // Allow follow-up messaging for solved tickets
//                 // Include other fields if required by API, e.g.:
//                 // assigned_to_type: currentTicketData.assigned_to_type || [],
//                 // assigned_group: currentTicketData.assigned_group_ids || []
//             };
//             console.log("Sending payload to API:", payload); // Added logging
//             console.log("Ticket ID:", currentTicketData.id); // Added logging
//             // If categoryId is empty, fallback to a default or error out
//             if (!categoryId) {
//                 console.error("Category ID is missing! Cannot update.");
//                 toast.error("Missing category ID – check ticket data.");
//                 return;
//             }
//             const response = await updateTicket(currentTicketData.id, payload); // Capture response
//             console.log("API Response:", response); // Added logging
//             setIsApproved(true);
//             setFollowUpAllowed(true); // Update local state to allow follow-up
//             // Update local state
//             const updated = updateLocalTicketState(currentTicketData.id, 46, "Approved");
//             toast.success(updated ? "Solution approved and ticket moved to closed!" : "Solution approved!");
//             // Send automatic message
//             const assigneeName = assignee?.firstname || assignee?.name || "Team";
//             await sendFollowUpMessageHandler(`Hi ${assigneeName}, this has been approved to you.`);
//             setChatTab(0); // Switch to chat tab to show the message
//             // Force re-render to sync local state (temporary; better to refetch)
//             setTickets(prev => ({ ...prev }));
//         } catch (err) {
//             console.error("Full error object:", err); // Enhanced logging
//             console.error("Error response (if any):", err.response?.data); // If using Axios/Fetch
//             toast.error(`Failed to approve solution: ${err.message || "Unknown error"}`);
//         }
//     };
//     // New handler for selecting a group member to assign
//     const handleSelectMember = async (member) => {
//         if (!currentTicketData?.id || !member.id || !member.email) {
//             toast.error("Invalid member data");
//             return;
//         }
//         setLoadingFollowUpChats(true);
//         try {
//             const categoryId = currentTicketData.category_id || currentTicketData.category_detail?.id || "";
//             const subcategoryId = currentTicketData.subcategory_id || currentTicketData.subcategory_detail?.id || "";
//             if (!categoryId) {
//                 console.error("Category ID is missing! Cannot update.");
//                 toast.error("Missing category ID – check ticket data.");
//                 return;
//             }
//             const payload = {
//                 title: currentTicketData.title || "",
//                 description: currentTicketData.description || "",
//                 category: categoryId,
//                 subcategory: subcategoryId,
//                 assigned_to_type: ['user'],
//                 assignee: [member.email],
//                 assigned_group: [], // Remove group assignment
//                 status: currentTicketData.status, // Keep current status
//                 followup_option_allowed: true, // Enable follow-up
//             };
//             console.log("Sending payload to assign member:", payload);
//             console.log("Ticket ID:", currentTicketData.id);
//             const response = await updateTicket(currentTicketData.id, payload);
//             console.log("API Response:", response);
//             // Assume API adds to approval_logs automatically
//             toast.success(`Ticket assigned to ${member.name || member.firstname || member.email} for follow-up.`);
//             // Update local states
//             setAssignee(member);
//             setAssignedGroup(null);
//             setFollowUpAllowed(true);
//             // Fetch messages for the new assignee
//             const ticketMessages = await fetchTicketMessages(currentChatTicket.id, currentUserId, member.id);
//             const sortedTicketMessages = ticketMessages.sort((a, b) =>
//                 new Date(a.createdon) - new Date(b.createdon)
//             );
//             setFollowUpChats(sortedTicketMessages);
//             // Optionally refetch ticket details to update currentTicketData
//             const updatedTicketDetails = await getTicketDetails(currentChatTicket.id);
//             setCurrentTicketData(updatedTicketDetails.ticket || updatedTicketDetails);
//         } catch (err) {
//             console.error("Error assigning member:", err);
//             console.error("Error response (if any):", err.response?.data);
//             toast.error(`Failed to assign ${member.name || member.email}: ${err.message || "Unknown error"}`);
//         } finally {
//             setLoadingFollowUpChats(false);
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
//         setAssignee(null);
//         setAssignedGroup(null);
//         // Reset solved states
//         setIsSolvedTicket(false);
//         setSolutionText("");
//         setIsResolved(false);
//         setIsApproved(false);
//         setFollowUpAllowed(false);
//         let ticketData = ticket; // Fallback to local ticket data
//         try {
//             // Fetch ticket details to get assignee_detail
//             const ticketDetails = await getTicketDetails(ticketNo);
//             ticketData = ticketDetails.ticket || ticketDetails;
//             // If requester details not found, use local or fallback
//             if (!ticketData.requested_detail && ticket.requested_detail) {
//                 ticketData.requested_detail = ticket.requested_detail;
//             }
//         } catch (err) {
//             console.error("Error fetching ticket details:", err);
//             if (err.message === "Requester details not found") {
//                 // Use local ticket data as fallback
//                 ticketData = { ...ticket };
//                 toast.warning("Ticket details partially loaded. Proceeding with available data.");
//             } else {
//                 toast.error("Failed to fetch full ticket details");
//             }
//             // Still proceed to open the drawer
//         }
//         try {
//             let assigneeDetail = null;
//             const assigneesDetails = ticketData.assignees_detail; // It's an array
//             if (assigneesDetails && assigneesDetails.length > 0) {
//                 assigneeDetail = assigneesDetails[0]; // Take the first assignee
//             } else {
//                 // Fallback to assigned_groups_detail if no individual assignees
//                 const assignedGroups = ticketData.assigned_groups_detail || [];
//                 if (assignedGroups.length > 0) {
//                     const firstGroup = assignedGroups[0];
//                     const members = firstGroup.members || [];
//                     if (members.length > 0) {
//                         // Do not auto-assign; set group and let user select
//                         setAssignedGroup(firstGroup);
//                     } else {
//                         // Show group details if no members
//                         setAssignedGroup(firstGroup);
//                     }
//                 }
//                 // For solved tickets, try to set assignee to solver if available
//                 if (selectedType === "solved" && ticketData.solver_id) {
//                     assigneeDetail = { id: ticketData.solver_id, firstname: ticketData.solver_name || "Solver" };
//                 }
//             }
//             setAssignee(assigneeDetail);
//             // Set full ticket details
//             setCurrentTicketData(ticketData);
//             setFollowUpAllowed(ticketData.followup_option_allowed === true || ticketData.followup_option_allowed === "yes" || (selectedType === "solved"));
//             setCurrentChatTicket({
//                 id: ticketNo,
//                 title: ticketData.title || ticket.title || "",
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
//             // Only fetch messages if individual assignee is available
//             if (assigneeDetail && assigneeDetail.id) {
//                 const receiverId = assigneeDetail.id;
//                 // Fetch messages based on ticket_no and between current user (ticket creator) and assignee
//                 const ticketMessages = await fetchTicketMessages(ticketNo, currentUserId, receiverId);
//                 const messagesCount = ticketMessages.length;
//                 console.log('Fetched messages count:', messagesCount);
//                 // Sort messages by timestamp
//                 const sortedTicketMessages = ticketMessages.sort((a, b) =>
//                     new Date(a.createdon) - new Date(b.createdon)
//                 );
//                 setFollowUpChats(sortedTicketMessages);
//             } else {
//                 console.warn("No individual assignee found; using group or no messages");
//                 setFollowUpChats([]);
//             }
//         } catch (chatErr) {
//             console.error("Error processing chat data:", chatErr);
//             // Still show the drawer with basic info
//             setCurrentTicketData(ticketData);
//             setCurrentChatTicket({
//                 id: ticketNo,
//                 title: ticketData.title || ticket.title || "",
//             });
//             setFollowUpChats([]);
//         } finally {
//             setLoadingFollowUpChats(false);
//         }
//     };
//     const handleChatDrawerClose = () => {
//         setShowFollowUpChat(false);
//         setCurrentChatTicket(null);
//         setCurrentTicketData(null); // Reset full ticket data
//         setAssignee(null);
//         setAssignedGroup(null);
//         setFollowUpAllowed(false);
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
//                     {/* Grid with only 3 cards */}
//                     <Grid container spacing={3} sx={{ mb: 4 }}>
//                         {statusCards.map((item) => (
//                             <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.id}>
//                                 {isMobile ? (
//                                     <Card
//                                         onClick={() => handleCardClick(item.id)}
//                                         sx={{
//                                             p: 1,
//                                             m: 1,
//                                             transition: "0.3s ease",
//                                             maxWidth: "600px",
//                                             borderRadius: 5,
//                                             "&:hover": {
//                                                 background: "linear-gradient(135deg, #667eea, #764ba2)",
//                                                 color: "#fff",
//                                                 transform: "scale(1.03)",
//                                             }
//                                         }}
//                                     >
//                                         <CardContent sx={{ display: "flex", gap: 2, alignItems: "center" }}>
//                                             <Box
//                                                 sx={{
//                                                     width: { xs: 50, sm: 40, md: 50 },
//                                                     height: { xs: 50, sm: 40, md: 50 },
//                                                     display: "flex",
//                                                     alignItems: "center",
//                                                     justifyContent: "center",
//                                                     borderRadius: 2,
//                                                     bgcolor: `${item.color}.main`,
//                                                     color: "#fff",
//                                                 }}
//                                             >
//                                                 <Icon sx={{ fontSize: { xs: 25, sm: 18, md: 25 } }}>{item.icon}</Icon>
//                                             </Box>
//                                             <Box>
//                                                 <Typography fontSize={{ xs: 25, sm: 20, md: 25 }} fontWeight={600}>
//                                                     {item.count}
//                                                 </Typography>
//                                                 <Typography fontSize={{ xs: 20, sm: 14, md: 20 }} fontWeight={550}>
//                                                     {item.label}
//                                                 </Typography>
//                                             </Box>
//                                         </CardContent>
//                                     </Card>
//                                 ) : (
//                                     <Card
//                                         onClick={() => handleCardClick(item.id)}
//                                         sx={{
//                                             p: 1,
//                                             m: 1,
//                                             transition: "0.3s ease",
//                                             maxWidth: "600px",
//                                             borderRadius: 5,
//                                             "&:hover": {
//                                                 background: "linear-gradient(135deg, #667eea, #764ba2)",
//                                                 color: "#fff",
//                                                 transform: "scale(1.03)",
//                                             }
//                                         }}
//                                     >
//                                         <CardContent
//                                             sx={{
//                                                 height: "100%",
//                                                 display: "flex",
//                                                 gap: 2,
//                                                 //justifyContent: "space-between",
//                                                 p: 3,
//                                                 alignItems: "center",
//                                             }}>
//                                             <Box
//                                                 sx={{
//                                                     width: { xs: 50, sm: 40, md: 50 },
//                                                     height: { xs: 50, sm: 40, md: 50 },
//                                                     display: "flex",
//                                                     alignItems: "center",
//                                                     justifyContent: "center",
//                                                     borderRadius: 2,
//                                                     bgcolor: `${item.color}.main`,
//                                                     color: "#fff",
//                                                 }}
//                                             >
//                                                 <Icon sx={{ fontSize: { xs: 25, sm: 18, md: 25 } }}>{item.icon}</Icon>
//                                             </Box>
//                                             <Typography fontSize={{ xs: 25, sm: 20, md: 25 }} fontWeight={600}>
//                                                 {item.count}
//                                             </Typography>
//                                             <Typography fontSize={{ xs: 20, sm: 14, md: 20 }} fontWeight={550}>
//                                                 {item.label}
//                                             </Typography>
//                                         </CardContent>
//                                     </Card>
//                                 )}
//                             </Grid>
//                         ))}
//                     </Grid>
//                     {selectedType && (
//                         <Box>
//                             <Box sx={{
//                                 display: "flex",
//                                 flexDirection: isMobile || isTablet ? "column" : "row",
//                                 justifyContent: !isMobile || !isTablet ? "space-between" : undefined,
//                                 alignItems: isMobile ? "flex-start" : "center",
//                                 mb: 4,
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
//                                                             <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2, gap: 1 }}>
//                                                                 <Tooltip title="Follow-up Chat">
//                                                                     <IconButton
//                                                                         onClick={() => handleChatDrawerOpen(t.ticket_no)}
//                                                                         size="small"
//                                                                         sx={{ color: "#667eea" }}
//                                                                     >
//                                                                         <ChatIcon />
//                                                                     </IconButton>
//                                                                 </Tooltip>
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
//                                                                 <TableCell sx={{ color: "#2D3748", fontWeight: 500 }}>
//                                                                     <Tooltip
//                                                                         title={t.title || "No Title"}
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
//                                                                             {t.title || "-"}
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
//                                                                     {t.requested_detail?.email || "Unknown"}
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
//                                                                         <Button
//                                                                             variant="outlined"
//                                                                             onClick={() => handleTicketClick(t.ticket_no)}
//                                                                             sx={{
//                                                                                 borderColor: "#667eea",
//                                                                                 color: "#667eea",
//                                                                                 borderRadius: 2,
//                                                                                 textTransform: "none",
//                                                                                 fontSize: "0.85rem",
//                                                                                 px: 2,
//                                                                                 "&:hover": {
//                                                                                     backgroundColor: "#667eea10",
//                                                                                     borderColor: "#556cd6",
//                                                                                 }
//                                                                             }}
//                                                                         >
//                                                                             View
//                                                                         </Button>
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
//             {/* Chat Drawer */}
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
//                         p: 2,
//                         borderBottom: 1,
//                         borderColor: "divider",
//                         bgcolor: "primary.main",
//                         color: "white"
//                     }}>
//                         <Typography variant="h6">
//                             <ChatIcon sx={{ mr: 1, verticalAlign: "middle" }} />
//                             {assignee ? `Chat with ${assignee.firstname || assignee.name || "Assignee"}` : assignedGroup ? `Follow-up with ${assignedGroup.name || "Support Team"}` : "Follow-up"}
//                         </Typography>
//                         <Typography variant="caption" sx={{ color: "white" }}>
//                             Ticket #{currentChatTicket?.id}
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
//                                     ) : !assignee && !assignedGroup ? (
//                                         <Box sx={{
//                                             display: "flex",
//                                             flexDirection: "column",
//                                             justifyContent: "center",
//                                             alignItems: "center",
//                                             height: "100%",
//                                             color: "text.secondary",
//                                             textAlign: "center",
//                                             p: 4
//                                         }}>
//                                             <ChatIcon sx={{ fontSize: 60, mb: 2, opacity: 0.5 }} />
//                                             <Typography variant="h6" mb={2}>No Assignee Available</Typography>
//                                             <Typography>This ticket has no assigned group or individual for direct chat.</Typography>
//                                             <Typography variant="body2" sx={{ mt: 1, fontStyle: "italic" }}>Please use the View Details button to follow up.</Typography>
//                                         </Box>
//                                     ) : !assignee && assignedGroup && assignedGroup.members && assignedGroup.members.length > 0 ? (
//                                         // New: Show list of group members for selection
//                                         <Box sx={{
//                                             display: "flex",
//                                             flexDirection: "column",
//                                             justifyContent: "center",
//                                             alignItems: "center",
//                                             height: "100%",
//                                             p: 2,
//                                             textAlign: "center"
//                                         }}>
//                                             <Avatar sx={{ width: 80, height: 80, bgcolor: "primary.main", mb: 2 }}>
//                                                 <ChatIcon sx={{ fontSize: 40 }} />
//                                             </Avatar>
//                                             <Typography variant="h6" mb={2} sx={{ fontWeight: 500 }}>
//                                                 {assignedGroup.name} ({assignedGroup.members.length} members)
//                                             </Typography>
//                                             <Typography mb={3}>Select a team member to assign and start follow-up chat:</Typography>
//                                             <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
//                                                 {assignedGroup.members.map((member) => (
//                                                     <ListItem key={member.id} disablePadding>
//                                                         <ListItemButton onClick={() => handleSelectMember(member)}>
//                                                             <Avatar sx={{ mr: 2 }}>
//                                                                 {getInitials(member.firstname || member.name || member.email)}
//                                                             </Avatar>
//                                                             <ListItemText
//                                                                 primary={member.name || member.firstname || member.email}
//                                                                 secondary={member.email}
//                                                             />
//                                                         </ListItemButton>
//                                                     </ListItem>
//                                                 ))}
//                                             </List>
//                                         </Box>
//                                     ) : !assignee && assignedGroup ? (
//                                         <Box sx={{
//                                             display: "flex",
//                                             flexDirection: "column",
//                                             justifyContent: "center",
//                                             alignItems: "center",
//                                             height: "100%",
//                                             color: "text.secondary",
//                                             textAlign: "center",
//                                             p: 4
//                                         }}>
//                                             <Avatar sx={{ width: 80, height: 80, bgcolor: "primary.main", mb: 2 }}>
//                                                 <ChatIcon sx={{ fontSize: 40 }} />
//                                             </Avatar>
//                                             <Typography variant="h6" mb={1}>Group Assignment</Typography>
//                                             <Typography variant="body1" mb={2} sx={{ fontWeight: 500 }}>
//                                                 {assignedGroup.name} ({assignedGroup.members_count || 0} members)
//                                             </Typography>
//                                             <Typography mb={2}>Direct messaging is not available for group assignments. Please use the View Details button to follow up with the team.</Typography>
//                                             <Chip label={`Members: ${assignedGroup.members_count || 0}`} color="primary" variant="outlined" />
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
//                                                                         {getInitials(assignee?.firstname || assignee?.name || "Support")}
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
//                                                                                 {assignee?.firstname || assignee?.name || "Support"}
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
//                                 {/* Message Input - Show if individual assignee or follow-up allowed for solved */}
//                                 {(assignee || followUpAllowed) && (
//                                     <Box sx={{
//                                         p: 2,
//                                         borderTop: 1,
//                                         borderColor: "divider",
//                                         bgcolor: "background.default"
//                                     }}>
//                                         <Box sx={{ display: "flex", gap: 1 }}>
//                                             <TextField
//                                                 fullWidth
//                                                 size="medium"
//                                                 placeholder="Type your message..."
//                                                 value={newFollowUpMessage}
//                                                 onChange={e => setNewFollowUpMessage(e.target.value)}
//                                                 disabled={sendingFollowUpMessage}
//                                                 onKeyPress={(e) => {
//                                                     if (e.key === 'Enter' && !e.shiftKey) {
//                                                         e.preventDefault();
//                                                         sendFollowUpMessageHandler(newFollowUpMessage);
//                                                     }
//                                                 }}
//                                                 multiline
//                                                 maxRows={4}
//                                             />
//                                             <IconButton
//                                                 onClick={() => sendFollowUpMessageHandler(newFollowUpMessage)}
//                                                 disabled={!newFollowUpMessage.trim() || sendingFollowUpMessage}
//                                                 color="primary"
//                                                 sx={{ alignSelf: "flex-end", height: 40, width: 40 }}
//                                             >
//                                                 {sendingFollowUpMessage ? <CircularProgress size={20} /> : <SendIcon />}
//                                             </IconButton>
//                                         </Box>
//                                     </Box>
//                                 )}
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
//         </Box>
//     );
// };
// export default RequestTabs;
