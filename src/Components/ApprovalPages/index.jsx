import { Box, Grid, Card, CardContent, Typography, TextField, Button, Divider, Chip, Stack, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Autocomplete, Drawer, Tabs, Tab, Avatar } from "@mui/material";
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from 'react-router-dom';
import EditIcon from "@mui/icons-material/Edit";
import SendIcon from '@mui/icons-material/Send';
import { getTicketDetails, performTicketAction, fetchTicketSLAByEntityAndCategory, fetchUsersAPI, updateTicket ,fetchMessages} from '../../Api';
import { toast } from 'react-toastify';
import ChatIcon from '@mui/icons-material/Chat';
 
const ACTION_MAP = {
  Approve: { backend: 'approve', label: 'Approved' },
  Reject: { backend: 'reject', label: 'Rejected' },
  'On Hold': { backend: 'onhold', label: 'On Hold' },
  Reassign: { backend: 'reassign', label: 'Pending' },
  'Un Hold': { backend: 'unhold', label: 'Un Hold' },
};
 
const ApprovalPage = () => {
 
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newFiles, setNewFiles] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
   const [chatTab, setChatTab] = useState(0);
 
  const currentUserStr = localStorage.getItem("user");
  const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;
  const currentUserId = currentUser?.id;

  const isRequester = currentUserId && ticket?.requester_id === currentUserId;
  const isEditable = ticket && ticket.status === "New" && isRequester;
  // const isEditable = Boolean(ticket && ticket.status === "New");
 
  const [openConfirm, setOpenConfirm] = useState(false);
  const [saving, setSaving] = useState(false);

  const [isSolvedTicket, setIsSolvedTicket] = useState(false);
  const [solutionText, setSolutionText] = useState("");
  const [isResolved, setIsResolved] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
 
  const isImage = (name = "") => /\.(jpg|jpeg|png|gif|webp)$/i.test(name);
  const isPdf = (name = "") => /\.pdf$/i.test(name);
 
  const [updating, setUpdating] = useState(false);
  const [slaLoading, setSlaLoading] = useState(true);
 
  const [approvalStatus, setApprovalStatus] = useState('');
  const [approvalLogs, setApprovalLogs] = useState([]);
  const [currentApprovers, setCurrentApprovers] = useState([]);
  const [allApprovers, setAllApprovers] = useState([]);
  const [assignee, setAssignee] = useState(null);
  const [currentChatTicket, setCurrentChatTicket] = useState(null);
  const [showFollowUpChat, setShowFollowUpChat] = useState(false);
  const [followUpChats, setFollowUpChats] = useState([]);
  const [loadingFollowUpChats, setLoadingFollowUpChats] = useState(false);
  const [newFollowUpMessage, setNewFollowUpMessage] = useState("");
  const [sendingFollowUpMessage, setSendingFollowUpMessage] = useState(false);
  
  // Load users
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const res = await fetchUsersAPI();
        setAllApprovers(Array.isArray(res) ? res : res.results || []);
      } catch (err) {
        console.error("Failed to load users", err);
      }
    };
    loadUsers();
  }, []);
 
  // Load ticket
  const loadTicket = async () => {
    const ticketId = localStorage.getItem('selectedTicketId');
    if (!ticketId) {
      setError('No ticket ID found.');
      setLoading(false);
      return;
    }
 
    setLoading(true);
    try {
      const { ticket: ticketData, approvalLogs = [] } = await getTicketDetails(ticketId);
      setApprovalLogs(approvalLogs);
 
      const currentStatus = ticketData.status_detail?.referrence_to || 'Pending';
 
      // const mappedTicket = {
      //   id: ticketData.ticket_no || '',
      //   requester_id: ticketData.requested_detail?.id || null,
      //   requester_email: ticketData.requested_detail?.email || null,
 
      //   // Store both display name and ID
      //   type: ticketData.type_detail?.field_name || '',
      //   type_id: ticketData.type_detail?.id || null,
 
      //   department: ticketData.department_detail?.field_name || '',
      //   department_id: ticketData.department_detail?.id || null,
 
      //   location: ticketData.location_detail?.field_name || '',
      //   location_id: ticketData.location_detail?.id || null,
 
      //   platform: ticketData.platform_detail?.field_name || '',
      //   platform_id: ticketData.platform_detail?.id || null,
 
      //   priority: ticketData.priority_detail?.field_name || '',
      //   priority_id: ticketData.priority_detail?.id || null,
 
      //   category: ticketData.category_detail?.category_name?.trim() || '',
      //   category_id: ticketData.category_detail?.id || null,
 
      //   subcategory: ticketData.subcategory_detail?.subcategory_name || '',
      //   subcategory_id: ticketData.subcategory_detail?.id || null,
 
      //   title: ticketData.title || '',
      //   description: ticketData.description || '',
      //   files: ticketData.documents || [],
 
      //   entity_id: ticketData.category_detail?.entity_id || ticketData.subcategory_detail?.entity_id || null,
 
      //   assignedTo: ticketData.assignees_detail && ticketData.assignees_detail.length > 0
      //     ? ticketData.assignees_detail.map(u => u.name || u.username).join(', ')
      //     : ticketData.assigned_groups_detail && ticketData.assigned_groups_detail.length > 0
      //       ? `${ticketData.assigned_groups_detail[0].name} (Group${ticketData.assigned_groups_detail[0].members_count ? ` - ${ticketData.assigned_groups_detail[0].members_count} members` : ''})`
      //       : 'Unassigned',
 
      //   assignedToId: ticketData.assigned_to || null, // if individual assignment exists
 
      //   status: ticketData.status_detail?.field_name || "",
      //   status_id: ticketData.status_detail?.id,
      // };

      const mappedTicket = {
        id: ticketData.ticket_no || '',
        requester_id: ticketData.requested_detail?.id || null,
        requester_email: ticketData.requested_detail?.email || null,

        // IDs
        type_id: ticketData.type_detail?.id || null,
        department_id: ticketData.department_detail?.id || null,
        location_id: ticketData.location_detail?.id || null,
        platform_id: ticketData.platform_detail?.id || null,
        priority_id: ticketData.priority_detail?.id || null,
        category_id: ticketData.category_detail?.id || null,
        subcategory_id: ticketData.subcategory_detail?.id || null,

        // Display names
        type: ticketData.type_detail?.field_name || '',
        department: ticketData.department_detail?.field_name || '',
        location: ticketData.location_detail?.field_name || '',
        platform: ticketData.platform_detail?.field_name || '',
        priority: ticketData.priority_detail?.field_name || '',
        category: ticketData.category_detail?.category_name?.trim() || '',
        subcategory: ticketData.subcategory_detail?.subcategory_name || '',

        title: ticketData.title || '',
        description: ticketData.description || '',
        files: ticketData.documents || [],
        

        entity_id: ticketData.category_detail?.entity_id || ticketData.subcategory_detail?.entity_id || null,

        status: ticketData.status_detail?.field_name || "",
        status_id: ticketData.status_detail?.id,

        // CRITICAL: Preserve full assignee/group objects
        assignees_detail: ticketData.assignees_detail || [],
        assigned_groups_detail: ticketData.assigned_groups_detail || [],

        // Keep display string for UI
        assignedTo: (ticketData.assignees_detail && ticketData.assignees_detail.length > 0)
          ? ticketData.assignees_detail.map(u => u.name || u.username || u.email).join(', ')
          : (ticketData.assigned_groups_detail && ticketData.assigned_groups_detail.length > 0)
            ? ticketData.assigned_groups_detail.map(g => `${g.name} (Group)`).join(', ')
            : 'Unassigned',
      };
 
      // const mappedTicket = {
      //   id: ticketData.ticket_no || '',
      //   type: ticketData.type_detail?.field_name || ticketData.type_detail?.field_values || '',
      //   department: ticketData.department_detail?.field_name || ticketData.department_detail?.field_values || '',
      //   location: ticketData.location_detail?.field_name || '',
      //   platform: ticketData.platform_detail?.field_name || ticketData.platform_detail?.field_values || '', // ← Fixed
      //   category: ticketData.category_detail?.category_name?.trim() || '',
      //   subcategory: ticketData.subcategory_detail?.subcategory_name || '',
      //   priority: ticketData.priority_detail?.field_name || ticketData.priority_detail?.field_values || '',
      //   title: ticketData.title || '',
      //   description: ticketData.description || '',
      //   files: ticketData.documents || [],
      //   entity_id: ticketData.category_detail?.entity_id || ticketData.subcategory_detail?.entity_id || null,
      //   category_id: ticketData.category_detail?.id,
      //   subcategory_id: ticketData.subcategory_detail?.id,
      //   approvalStatus: currentStatus,
      //   assignedTo: ticketData.assignees_detail && ticketData.assignees_detail.length > 0
      //     ? ticketData.assignees_detail.map(u => u.name || u.username).join(', ')
      //     : ticketData.assigned_groups_detail && ticketData.assigned_groups_detail.length > 0
      //       ? `${ticketData.assigned_groups_detail[0].name} (Group${ticketData.assigned_groups_detail[0].members_count ? ` - ${ticketData.assigned_groups_detail[0].members_count} members` : ''})`
      //       : 'Unassigned',
      //   assignedToId: ticketData.assigned_to || null,
      //   status: ticketData.status_detail?.field_name || "",
      //   status_id: ticketData.status_detail?.id,
      // };
      console.log("Ticket files loaded:", mappedTicket.files);
      setTicket(mappedTicket);
      setApprovalStatus(currentStatus);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch ticket.');
      toast.error(err.message || 'Failed to load ticket.');
    } finally {
      setLoading(false);
    }
  };
 
  useEffect(() => { loadTicket(); }, []);

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
 
  // Fetch SLA Approvers
  useEffect(() => {
    if (!ticket?.entity_id || !ticket?.category_id || !ticket?.subcategory_id) {
      setCurrentApprovers([]);
      setSlaLoading(false);
      return;
    }
 
    const fetchApprovers = async () => {
      setSlaLoading(true);
      try {
        const slaResponse = await fetchTicketSLAByEntityAndCategory(
          ticket.entity_id, ticket.category_id, ticket.subcategory_id
        );
        const sla = Array.isArray(slaResponse) && slaResponse.length > 0 ? slaResponse[0] : slaResponse;
 
        if (sla) {
          const list = [
            { user: sla.Approver_level1_user, time: sla.Approver_level1_time },
            { user: sla.Approver_level2_user, time: sla.Approver_level2_time },
            { user: sla.Approver_level3_user, time: sla.Approver_level3_time },
            { user: sla.Approver_level4_user, time: sla.Approver_level4_time },
            { user: sla.Approver_level5_user, time: sla.Approver_level5_time },
          ].filter(a => a.user?.trim());
          setCurrentApprovers(list);
        }
      } catch (err) {
        console.error("SLA Error:", err);
      } finally {
        setSlaLoading(false);
      }
    };
    fetchApprovers();
  }, [ticket?.entity_id, ticket?.category_id, ticket?.subcategory_id]);
 
  const handleDeleteAttachment = async (documentId) => {
  if (!window.confirm("Are you sure you want to delete this attachment permanently?")) {
    return;
  }

  try {
    setUpdating(true);

    const token = localStorage.getItem("access_token");
    //const response = await fetch(`http://192.168.60.149:8000/api/tickets/tickets/documents/${documentId}/`, {
    const response = await fetch(`http://172.22.32.1:8000/api/tickets/tickets/documents/${documentId}/`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (response.ok || response.status === 204) {
      toast.success("Attachment deleted successfully");
      await loadTicket(); // Refresh the ticket to update the list
    } else {
      throw new Error("Failed to delete attachment");
    }
  } catch (err) {
    console.error("Delete error:", err);
    toast.error("Failed to delete attachment. Please try again.");
  } finally {
    setUpdating(false);
  }
};

  const handleSaveChanges = async () => {
    setSaving(true);
 
    try {
      const formData = new FormData();
 
      // SEND IDs, NOT NAMES
      formData.append("type", ticket.type_id);
      formData.append("department", ticket.department_id);
      formData.append("location", ticket.location_id);
      formData.append("platform", ticket.platform_id);
      formData.append("priority", ticket.priority_id);
      formData.append("category", ticket.category_id);
      formData.append("subcategory", ticket.subcategory_id);
 
      // These might also need IDs — check your API
      formData.append("entity", ticket.entity_id || "");
 
      // Editable fields (strings are fine)
      formData.append("title", ticket.title);
      formData.append("description", ticket.description);


    const assignedUsers =ticket.assignees_detail || ticket.assigned_users || [];
    const assignedGroups =ticket.assigned_groups_detail || ticket.assigned_groups || [];

// assigned_to_type (LIST)
assignedUsers.forEach((user, index) => {
  if (user?.email) {
    formData.append(`assignee[${index}]`, user.email);
  }
});

if (assignedUsers.length > 0) {
  formData.append("assigned_to_type[0]", "user");
}

assignedGroups.forEach((group, index) => {
  if (group?.id) {
    formData.append(`assigned_group[${index}]`, group.id);
  }
});
      // newFiles.forEach((file) => {
      //   formData.append("documents", file);
      // });
  newFiles.forEach(file => {
        if (file instanceof File) {
          formData.append("documents", file);
        }
      });

      await updateTicket(ticket.id, formData);
 
      toast.success("Ticket updated successfully");
      setIsEditMode(false);
      setNewFiles([]);
      setOpenConfirm(false);
      await loadTicket();
    } catch (err) {
      console.error(err.response?.data || err);
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


    const assignedUsers =ticket.assignees_detail || ticket.assigned_users || [];
    const assignedGroups =ticket.assigned_groups_detail || ticket.assigned_groups || [];

      // assigned_to_type (LIST)
      assignedUsers.forEach((user, index) => {
        if (user?.email) {
          formData.append(`assignee[${index}]`, user.email);
        }
      });

      if (assignedUsers.length > 0) {
        formData.append("assigned_to_type[0]", "user");
      }

      assignedGroups.forEach((group, index) => {
        if (group?.id) {
          formData.append(`assigned_group[${index}]`, group.id);
        }
      });
 
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
  // const handleCancelTicket = async () => {
  //   try {
  //     await performTicketAction(ticket.id, {
  //       action: "cancel",
  //       comments: "Ticket cancelled by user",
  //     });
 
  //     toast.success("Ticket cancelled");
  //     await loadTicket();
  //   } catch {
  //     toast.error("Failed to cancel ticket");
  //   }
  // };
  const CANCELLED_STATUS_ID = 155;
 
  // const handleCancelTicket = async () => {
  //   setSaving(true);
 
  //   try {
  //     const formData = new FormData();
 
  //     formData.append("type", ticket.type);
  //     formData.append("department", ticket.department);
  //     formData.append("location", ticket.location);
  //     formData.append("platform", ticket.platform);
 
  //     formData.append("category", ticket.category);
  //     formData.append("subcategory", ticket.subcategory);
  //     formData.append("priority", ticket.priority);
 
  //     formData.append("assigned_to", ticket.assignedToId);
  //     formData.append("entity", ticket.entity_id);
 
  //     formData.append("title", ticket.title);
  //     formData.append("description", ticket.description);
 
  //     newFiles.forEach((file) => {
  //       formData.append("documents", file);
  //     });
 
  //     formData.append("status", CANCELLED_STATUS_ID);
 
  //     await updateTicket(ticket.id, formData);
 
  //     toast.success("Ticket cancelled successfully");
  //     await loadTicket();
 
  //   } catch (err) {
  //     console.error(err.response?.data || err);
  //     toast.error("Failed to cancel ticket");
  //   } finally {
  //     setSaving(false);
  //   }
  // };
 
  const handleBackTicket = () => {
    localStorage.removeItem('selectedTicketId');
    navigate('/tickethistory');
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
  const handleChatDrawerOpen = async () => {
    if (!ticket?.id || !currentUserId) {
      toast.error("User or ticket not loaded");
      return;
    }

    const assignees = ticket.assignees_detail;
    if (!assignees || assignees.length === 0) {
      toast.warn("No assignee found for this ticket");
      return;
    }

    const assigneeDetail = assignees[0];
    setAssignee(assigneeDetail);

    setCurrentChatTicket({
      id: ticket.id,
      title: ticket.title,
      description: ticket.description,
    });

    setShowFollowUpChat(true);
    setLoadingFollowUpChats(true);
    setFollowUpChats([]);

    try {
      // API already returns only messages for current user
      const messages = await fetchMessages();

      // Optional: filter by current ticket (safe fallback)
      const ticketMessages = messages.filter(msg => msg.ticket_no == ticket.id);

      // Sort by date
      const sorted = ticketMessages.sort((a, b) => new Date(a.createdon) - new Date(b.createdon));

      setFollowUpChats(sorted);
    } catch (err) {
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
  };
  return (
    <Box sx={{ p: 3, background: "#f5f6fa" }}>
      <Card sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="h3" fontWeight={600}>Ticket #{ticket.id}</Typography>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              {/* {ticket.status === "New" && !isEditMode && (
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
              )} */}
              {ticket?.status === "New" && isRequester && !isEditMode && (
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
              { label: "Assign To", value: ticket.assignedTo }
            ].map((item) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={item.label}>
                <Typography fontWeight={600} sx={{ mb: 1 }}>
                  {item.label}
                </Typography>
                <TextField fullWidth size="small" value={item.value || "-"} disabled sx={disabledFieldSx} />
              </Grid>
            ))}
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
              disabled={!isEditMode}
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
              disabled={!isEditMode}
              onChange={(e) =>
                setTicket((prev) => ({ ...prev, description: e.target.value }))
              }
              sx={disabledFieldSx}
            />
 
          </Box>
 
          {isEditMode && (
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
 
          {newFiles.length > 0 && isEditMode && (
  <Box sx={{ my: 4 }}>
    <Typography variant="h6" fontWeight={700} color="secondary" gutterBottom>
      New Attachments ({newFiles.length})
    </Typography>

    <Grid container spacing={3}>
      {newFiles.map((file, i) => {
        const fileName = file.name;
        const isImg = isImage(fileName);

        return (
          <Grid size={{xs:12,sm:6,md:4,lg:3}} key={i}>
            <Box
              sx={{
                border: "1px dashed #aaa",
                borderRadius: 2,
                overflow: "hidden",
                boxShadow: 1,
                bgcolor: "background.paper",
                textAlign: "center",
                position: "relative",
              }}
            >
              <IconButton
                size="small"
                onClick={() => setNewFiles(prev => prev.filter((_, idx) => idx !== i))}
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  zIndex: 1,
                  bgcolor: "rgba(255,255,255,0.8)",
                  "&:hover": { bgcolor: "error.main", color: "#fff" },
                }}
              >
                X
              </IconButton>

              {isImg ? (
                <Box
                  component="img"
                  src={URL.createObjectURL(file)}
                  alt={fileName}
                  sx={{
                    width: "100%",
                    height: 180,
                    objectFit: "cover",
                  }}
                />
              ) : (
                <Box
                  sx={{
                    height: 180,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "#f0f0f0",
                    flexDirection: "column",
                  }}
                >
                  <Typography variant="h4" color="text.secondary">
                    {isPdf(fileName) ? "PDF" : "FILE"}
                  </Typography>
                </Box>
              )}

              <Box sx={{ p: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {fileName}
                </Typography>
              </Box>
            </Box>
          </Grid>
        );
      })}
    </Grid>
  </Box>
)}
 
          {/* Existing Saved Attachments */}
{/* {ticket.files?.length > 0 && (
  <Box sx={{ my: 4 }}>
    <Typography variant="h6" fontWeight={700} color="primary" gutterBottom>
      Attachments ({ticket.files.length})
    </Typography>

    <Grid container spacing={3}>
      {ticket.files.map((f, i) => {
        const baseUrl = "http://192.168.60.149:8000";  // Your Django backend
        const fileUrl = f.file ? `${baseUrl}${f.file}` : null;
        const fileName = f.original_name || (f.file ? f.file.split("/").pop() : `File ${i + 1}`);
        const isImg = isImage(fileName);

        if (!fileUrl) return null;

        return (
          <Grid size={{xs:12,sm:6,md:4,lg:3}} key={f.id || i}>
            <Box
              sx={{
                border: "1px solid #e0e0e0",
                borderRadius: 2,
                overflow: "hidden",
                boxShadow: 2,
                bgcolor: "background.paper",
                textAlign: "center",
                position: "relative",
              }}
            >
              <IconButton
                size="small"
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  zIndex: 1,
                  bgcolor: "rgba(255,255,255,0.8)",
                  color: "error.main",
                  "&:hover": { bgcolor: "error.main", color: "#fff" },
                }}
              >
                X
              </IconButton>
              {isImg ? (
                <Box
                  component="img"
                  src={fileUrl}
                  alt={fileName}
                  sx={{
                    width: "100%",
                    height: 180,
                    objectFit: "cover",
                  }}
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/300x180?text=Image+Not+Found";
                  }}
                />
              ) : (
                <Box
                  sx={{
                    height: 180,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "#f9f9f9",
                    flexDirection: "column",
                  }}
                >
                  <Typography variant="h4" color="text.secondary">
                    {isPdf(fileName) ? "PDF" : "FILE"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    No preview
                  </Typography>
                </Box>
              )}

              <Box sx={{ p: 2 }}>
                <Typography
                  variant="body2"
                  sx={{
                    mb: 1,
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {fileName}
                </Typography>

                <Button
                  href={fileUrl}
                  target="_blank"
                  rel="noopener"
                  variant="contained"
                  size="small"
                  fullWidth
                  sx={{ mt: 1 }}
                >
                  Open File
                </Button>
              </Box>
            </Box>
          </Grid>
        );
      })}
    </Grid>
  </Box>
)} */}

{/* Existing Saved Attachments */}
{ticket.files?.length > 0 && (
  <Box sx={{ my: 5 }}>
    <Typography variant="h6" fontWeight={700} color="primary" gutterBottom>
      Attachments ({ticket.files.length})
    </Typography>

    <Grid container spacing={3}>
      {ticket.files.map((f) => {
        //const baseUrl = "http://192.168.60.149:8000";
        const baseUrl = "http://172.22.32.1:8000";
        const fileUrl = f.file ? `${baseUrl}${f.file}` : null;
        const fileName = f.original_name || (f.file ? f.file.split("/").pop() : "Unknown File");
        const isImg = isImage(fileName);

        if (!fileUrl) return null;

        return (
          <Grid item xs={12} sm={6} md={4} lg={3} key={f.id}>
            <Box
              sx={{
                border: "1px solid #e0e0e0",
                borderRadius: 2,
                overflow: "hidden",
                boxShadow: 2,
                bgcolor: "background.paper",
                textAlign: "center",
                position: "relative",
                transition: "transform 0.2s",
                "&:hover": { transform: "scale(1.02)" },
              }}
            >
              {/* Delete Button - Only visible in Edit Mode */}
              {isEditMode && (
                <IconButton
                  size="small"
                  onClick={() => handleDeleteAttachment(f.id)}
                  disabled={updating}
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    zIndex: 1,
                    bgcolor: "rgba(255,255,255,0.9)",
                    color: "error.main",
                    "&:hover": { bgcolor: "error.main", color: "#fff" },
                  }}
                >
                  ✕
                </IconButton>
              )}

              {isImg ? (
                <Box
                  component="img"
                  src={fileUrl}
                  alt={fileName}
                  sx={{
                    width: "100%",
                    height: 180,
                    objectFit: "cover",
                  }}
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/300x180?text=Image+Not+Found";
                  }}
                />
              ) : (
                <Box
                  sx={{
                    height: 180,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "#f9f9f9",
                    flexDirection: "column",
                  }}
                >
                  <Typography variant="h4" color="text.secondary">
                    {isPdf(fileName) ? "PDF" : "FILE"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Click to open
                  </Typography>
                </Box>
              )}

              <Box sx={{ p: 2 }}>
                <Typography
                  variant="body2"
                  sx={{
                    mb: 1,
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    fontSize: "0.85rem",
                  }}
                >
                  {fileName}
                </Typography>

                <Button
                  href={fileUrl}
                  target="_blank"
                  rel="noopener"
                  variant="contained"
                  size="small"
                  fullWidth
                  sx={{ mt: 1 }}
                >
                  Open File
                </Button>
              </Box>
            </Box>
          </Grid>
        );
      })}
    </Grid>
  </Box>
)}


 
          {/* {ticket.files?.length > 0 && (
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
          )} */}
 
          {isEditMode && (
            <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end", gap: 2 }}>
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
                Cancel Edit
              </Button>
 
              <Button
                variant="contained"
                color="primary"
                sx={{ borderRadius: 3 }}
                onClick={() => setOpenConfirm(true)}
              >
                Save Changes
              </Button>
            </Box>
          )}
 
 
          {/* <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4, gap: 2 }}>
          
            {ticket?.status === "New" && isRequester && !isEditMode && (
  <Button 
    color="error" 
    variant="outlined" 
    sx={{ borderRadius: 3 }} 
    onClick={handleCancelTicket}
  >
    Cancel Ticket
  </Button>
)}
            <Button variant="contained" onClick={handleBackTicket} color="info" sx={{ borderRadius: 3 }}>Back to Tickets</Button>
          </Box> */}
           <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 4 }}>
            <Button variant="contained" color="info" sx={{ borderRadius: 3 }} onClick={handleChatDrawerOpen}>Follow up Info</Button>
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
              {ticket?.status === "New" && isRequester && !isEditMode && (
                <Button color="error" variant="outlined" sx={{ borderRadius: 3 }} onClick={handleCancelTicket}>Cancel Ticket</Button>
              )}
              <Button variant="contained" onClick={handleBackTicket} color="info" sx={{ borderRadius: 3 }}>Back to Tickets</Button>
            </Box>
          </Box>
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

          <Box sx={{
            display: "flex",
            flexDirection: "column",
            p: 2,
            borderBottom: 1,
            borderColor: "divider",
            bgcolor: "primary.main",
            color: "white"
          }}>
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
                          const isFromCurrentUser = msg.sender == currentUserId;

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
 
    </Box>
  );
};
 
export default ApprovalPage;


// import { Box, Grid, Card, CardContent, Typography, TextField, Button, Divider, Chip, Stack, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Drawer, Tabs, Tab, Avatar, Autocomplete } from "@mui/material";
// import { useState, useEffect, useMemo } from "react";
// import { useNavigate } from 'react-router-dom';
// import EditIcon from "@mui/icons-material/Edit";
// import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
// import ChatIcon from '@mui/icons-material/Chat';
// import SendIcon from '@mui/icons-material/Send';
// import CloseIcon from '@mui/icons-material/Close';
// import DoneAllIcon from '@mui/icons-material/DoneAll';
// import { getTicketDetails, fetchMessages, sendMessage, updateTicket, fetchUsersAPI, fetchWatcherGroups } from '../../Api';
// import { toast } from 'react-toastify';


// const ApprovalPage = () => {

//   const navigate = useNavigate();
//   const [ticket, setTicket] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [newFiles, setNewFiles] = useState([]);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [chatTab, setChatTab] = useState(0);

//   const currentUserStr = localStorage.getItem("user");
//   const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;
//   const currentUserId = currentUser?.id;
//   const currentUserName = currentUser?.name || currentUser?.username || "You";

//   // Check if user is Admin
//   // const isAdmin = useMemo(() => {
//   //   if (!currentUser || !currentUser.roles) return false;
//   //   return currentUser.roles.some(role => role.name === "Admin" || role.name.toLowerCase() === "admin");
//   // }, [currentUser]);
//   const isAdmin = currentUser?.roles?.some(role =>
//     role.name === "Admin" || role.name.toLowerCase() === "admin"
//   ) || false;

//   const isRequester = currentUserId && ticket?.requester_id === currentUserId;
//   //const isEditable = ticket && ticket.status === "New" && (isRequester || isAdmin);
//   //const isEditable = Boolean(ticket && ticket.status === "New");
//   const canEnterEditMode = ticket && ticket.status === "New" && (isRequester || isAdmin);

//   const [openConfirm, setOpenConfirm] = useState(false);
//   const [saving, setSaving] = useState(false);

//   const [isSolvedTicket, setIsSolvedTicket] = useState(false);
//   const [solutionText, setSolutionText] = useState("");
//   const [isResolved, setIsResolved] = useState(false);
//   const [isApproved, setIsApproved] = useState(false);

//   const isImage = (name = "") => /\.(jpg|jpeg|png|gif|webp)$/i.test(name);

//   // Follow-up chat states
//   const [showFollowUpChat, setShowFollowUpChat] = useState(false);
//   const [followUpChats, setFollowUpChats] = useState([]);
//   const [loadingFollowUpChats, setLoadingFollowUpChats] = useState(false);
//   const [newFollowUpMessage, setNewFollowUpMessage] = useState("");
//   const [sendingFollowUpMessage, setSendingFollowUpMessage] = useState(false);
//   const [currentChatTicket, setCurrentChatTicket] = useState(null);
//   const [assignee, setAssignee] = useState(null);

//   // Assignment editing (for Admin)
//   const [allUsers, setAllUsers] = useState([]);
//   const [watcherGroups, setWatcherGroups] = useState([]);
//   const [selectionTypes, setSelectionTypes] = useState([]);
//   const [selectedUsers, setSelectedUsers] = useState([]);
//   const [selectedGroups, setSelectedGroups] = useState([]);

//   const loadTicket = async () => {
//     const ticketId = localStorage.getItem('selectedTicketId');
//     if (!ticketId) {
//       setError('No ticket ID found.');
//       setLoading(false);
//       return;
//     }

//     setLoading(true);
//     try {
//       const { ticket: ticketData } = await getTicketDetails(ticketId);

//       const mappedTicket = {
//         id: ticketData.ticket_no || '',
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
//         assignees_detail: ticketData.assignees_detail || [],
//         assigned_groups_detail: ticketData.assigned_groups_detail || [],
//         status: ticketData.status_detail?.field_name || "",
//         requester_id: ticketData.requested || ticketData.requested_detail?.id,
//       };

//       setTicket(mappedTicket);

//       // Pre-fill assignment for editing (Admin only)
//       if (isAdmin) {
//         const types = [];
//         const users = [];
//         const groups = [];

//         if (ticketData.assignees_detail && ticketData.assignees_detail.length > 0) {
//           types.push('user');
//           users.push(...ticketData.assignees_detail);
//         }
//         if (ticketData.assigned_groups_detail && ticketData.assigned_groups_detail.length > 0) {
//           types.push('group');
//           groups.push(...ticketData.assigned_groups_detail);
//         }

//         setSelectionTypes(types);
//         setSelectedUsers(users);
//         setSelectedGroups(groups);
//       }
//     } catch (err) {
//       setError('Failed to load ticket.');
//       toast.error('Failed to load ticket.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadTicket();
//   }, []);

//   // Load users and groups for Admin assignment dropdown
//   useEffect(() => {
//     if (isAdmin && isEditMode) {
//       const loadOptions = async () => {
//         try {
//           const users = await fetchUsersAPI();
//           setAllUsers(Array.isArray(users) ? users : []);
//           const groups = await fetchWatcherGroups();
//           setWatcherGroups(Array.isArray(groups) ? groups : []);
//         } catch (err) {
//           console.error("Failed to load assignment options", err);
//         }
//       };
//       loadOptions();
//     }
//   }, [isAdmin, isEditMode]);

//   // Open Follow-up Chat
//   const handleChatDrawerOpen = async () => {

//     if (!ticket?.id || !currentUserId) {
//       toast.error("User or ticket not loaded");
//       return;
//     }

//     const assignees = ticket.assignees_detail;
//     if (!assignees || assignees.length === 0) {
//       toast.warn("No assignee found for this ticket");
//       return;
//     }

//     const assigneeDetail = assignees[0];
//     setAssignee(assignees[0]);
//     setCurrentChatTicket({
//       id: ticket.id,
//       title: ticket.title,
//       description: ticket.description,
//     });
//     setShowFollowUpChat(true);
//     setLoadingFollowUpChats(true);
//     setFollowUpChats([]);

//     try {
//       const messages = await fetchMessages();
//       const ticketMsgs = messages.filter(m => m.ticket_no == ticket.id);
//       setFollowUpChats(ticketMsgs.sort((a, b) => new Date(a.createdon) - new Date(b.createdon)));
//     } catch {
//       toast.error("Failed to load messages");
//     } finally {
//       setLoadingFollowUpChats(false);
//     }
//   };

//   const handleChatDrawerClose = () => {
//     setShowFollowUpChat(false);
//     setCurrentChatTicket(null);
//     setAssignee(null);
//     setFollowUpChats([]);
//     setNewFollowUpMessage("");
//   };

//   const sendFollowUpMessageHandler = async (text) => {
//     if (!text.trim()) {
//       toast.error("Message cannot be empty");
//       return;
//     }

//     if (!assignee?.id || !currentChatTicket?.id) {
//       toast.error("Cannot send message: missing assignee or ticket");
//       return;
//     }

//     setSendingFollowUpMessage(true);
//     try {
//       await sendMessage({
//         receiver: assignee.id,
//         ticket_no: currentChatTicket.id,
//         message: text.trim(),
//       });

//       // Refetch messages to get the latest (including the one just sent)
//       const updatedMessages = await fetchMessages();
//       const ticketMessages = updatedMessages.filter(msg => msg.ticket_no == currentChatTicket.id);
//       const sorted = ticketMessages.sort((a, b) => new Date(a.createdon) - new Date(b.createdon));
//       setFollowUpChats(sorted);

//       setNewFollowUpMessage("");
//       toast.success("Message sent!");
//     } catch (err) {
//       toast.error("Failed to send message");
//     } finally {
//       setSendingFollowUpMessage(false);
//     }
//   };

//   const groupedChats = useMemo(() => {
//     const groups = {};
//     followUpChats.forEach(msg => {
//       const date = new Date(msg.createdon).toLocaleDateString();
//       if (!groups[date]) groups[date] = [];
//       groups[date].push(msg);
//     });

//     return Object.entries(groups)
//       .map(([date, msgs]) => ({
//         date,
//         messages: msgs.sort((a, b) => new Date(a.createdon) - new Date(b.createdon))
//       }))
//       .sort((a, b) => new Date(a.date) - new Date(b.date));
//   }, [followUpChats]);

//   const getInitials = (name) => {
//     if (!name) return "U";
//     return name.split(' ').map(n => n[0]?.toUpperCase() || '').join('').substring(0, 2);
//   };

//   const handleBackTicket = () => {
//     localStorage.removeItem('selectedTicketId');
//     navigate('/tickethistory');
//   };

//   const handleSaveChanges = async () => {
//     setSaving(true);
//     try {
//       const formData = new FormData();

//       // Only send fields that are allowed to change
//       if (isRequester) {
//         // Requester can update these
//         formData.append("title", ticket.title);
//         formData.append("description", ticket.description);
//         newFiles.forEach(file => formData.append("documents", file));
//       }

//       if (isAdmin) {
//         // Admin can only update assignment
//         selectionTypes.forEach(type => formData.append("assigned_to_type", type));
//         selectedUsers.forEach(user => formData.append("assignee", user.email || user.id));
//         selectedGroups.forEach(group => formData.append("assigned_groups", group.id));
//       }

//       // Common fields (IDs - not editable in UI)
//       formData.append("type", ticket.type_id);
//       formData.append("department", ticket.department_id);
//       formData.append("location", ticket.location_id);
//       formData.append("platform", ticket.platform_id);
//       formData.append("priority", ticket.priority_id);
//       formData.append("category", ticket.category_id);
//       formData.append("subcategory", ticket.subcategory_id || "");
//       formData.append("entity", ticket.entity_id || "");

//       await updateTicket(ticket.id, formData);

//       toast.success("Ticket updated successfully");
//       setIsEditMode(false);
//       setNewFiles([]);
//       setOpenConfirm(false);
//       await loadTicket();
//     } catch (err) {
//       toast.error(err.response?.data?.detail || "Failed to update ticket");
//     } finally {
//       setSaving(false);
//     }
//   };

//   // const handleSaveChanges = async () => {
//   //   setSaving(true);
//   //   try {
//   //     const formData = new FormData();
//   //     formData.append("type", ticket.type_id);
//   //     formData.append("department", ticket.department_id);
//   //     formData.append("location", ticket.location_id);
//   //     formData.append("platform", ticket.platform_id);
//   //     formData.append("priority", ticket.priority_id);
//   //     formData.append("category", ticket.category_id);
//   //     formData.append("subcategory", ticket.subcategory_id || "");
//   //     formData.append("entity", ticket.entity_id || "");
//   //     formData.append("title", ticket.title);
//   //     formData.append("description", ticket.description);

//   //     // Only admin can change assignment
//   //     if (isAdmin) {
//   //       selectionTypes.forEach(type => formData.append("assigned_to_type", type));
//   //       selectedUsers.forEach(user => formData.append("assignee", user.email || user.id));
//   //       selectedGroups.forEach(group => formData.append("assigned_groups", group.id));
//   //     }

//   //     newFiles.forEach(file => formData.append("documents", file));

//   //     await updateTicket(ticket.id, formData);

//   //     toast.success("Ticket updated successfully");
//   //     setIsEditMode(false);
//   //     setNewFiles([]);
//   //     setOpenConfirm(false);
//   //     await loadTicket();
//   //   } catch (err) {
//   //     toast.error(err.response?.data?.detail || "Failed to update ticket");
//   //   } finally {
//   //     setSaving(false);
//   //   }
//   // };

//   // const handleSaveChanges = async () => {

//   //   setSaving(true);
//   //   try {
//   //     const formData = new FormData();
//   //     formData.append("type", ticket.type_id);
//   //     formData.append("department", ticket.department_id);
//   //     formData.append("location", ticket.location_id);
//   //     formData.append("platform", ticket.platform_id);
//   //     formData.append("priority", ticket.priority_id);
//   //     formData.append("category", ticket.category_id);
//   //     formData.append("subcategory", ticket.subcategory_id || "");
//   //     formData.append("entity", ticket.entity_id || "");
//   //     formData.append("title", ticket.title);
//   //     formData.append("description", ticket.description);
//   //     formData.append("assigned_to", ticket.assigned_to || "");

//   //     newFiles.forEach(file => formData.append("documents", file));

//   //     await updateTicket(ticket.id, formData);

//   //     toast.success("Ticket updated successfully");
//   //     setIsEditMode(false);
//   //     setNewFiles([]);
//   //     setOpenConfirm(false);
//   //     await loadTicket();
//   //   } catch (err) {
//   //     toast.error(err.response?.data?.detail || "Failed to update ticket");
//   //   } finally {
//   //     setSaving(false);
//   //   }
//   // };

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

//   const fetchTicketMessages = async (ticketNo, senderId, receiverId) => {
//     try {
//       const allMessages = await fetchMessages();

//       const filtered = allMessages.filter((msg) =>
//         Number(msg.ticket_no) === Number(ticketNo) &&
//         (
//           (Number(msg.sender) === Number(senderId) && Number(msg.receiver) === Number(receiverId)) ||
//           (Number(msg.sender) === Number(receiverId) && Number(msg.receiver) === Number(senderId))
//         )
//       );

//       console.log("Filtered messages for ticket", ticketNo, ":", filtered); // Debug

//       return filtered || [];
//     } catch (err) {
//       console.error("Error loading ticket messages:", err);
//       toast.error("Failed to load messages");
//       return [];
//     }
//   };

//   // const fetchTicketMessages = async (ticketNo, senderId, receiverId) => {
//   //   try {
//   //     const allMessages = await fetchMessages();

//   //     return allMessages.filter(msg =>
//   //       msg.ticket_no == ticketNo &&
//   //       (
//   //         (msg.sender == senderId && msg.receiver == receiverId) ||
//   //         (msg.sender == receiverId && msg.receiver == senderId)
//   //       )
//   //     );
//   //   } catch (err) {
//   //     console.error("Error fetching messages:", err);
//   //     toast.error("Failed to load messages");
//   //     return [];
//   //   }
//   // };

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
//               {/* {ticket?.status === "New" && isRequester && !isEditMode && (
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
//               {canEnterEditMode && !isEditMode && (
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
//             ].map((item, index) => (
//               <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
//                 <Typography fontWeight={600} sx={{ mb: 1 }}>{item.label}</Typography>
//                 <TextField fullWidth size="small" value={item.value || "-"} disabled sx={disabledFieldSx} />
//               </Grid>
//             ))}
//             {/* Assign To Field */}
//             <Grid size={{ xs: 12, sm: 6, md: 3 }}>
//               <Typography fontWeight={600} sx={{ mb: 1 }}>Assign To</Typography>
//               {isEditMode && isAdmin ? (
//                 <>
//                   <Autocomplete
//                     multiple
//                     options={[{ label: 'User', type: 'user' }, { label: 'Group', type: 'group' }]}
//                     getOptionLabel={(option) => option.label}
//                     value={selectionTypes.map(type => ({ label: type === 'user' ? 'User' : 'Group', type }))}
//                     onChange={(_, newValue) => {
//                       const types = newValue.map(v => v.type);
//                       setSelectionTypes(types);
//                       if (!types.includes('user')) setSelectedUsers([]);
//                       if (!types.includes('group')) setSelectedGroups([]);
//                     }}
//                     renderInput={(params) => (
//                       <TextField {...params} placeholder="Select User/Group" size="small" sx={{ mb: 1, "& .MuiOutlinedInput-root": { borderRadius: 3 }, }} />
//                     )}
//                   />
//                   {selectionTypes.includes('user') && (
//                     <Autocomplete
//                       multiple
//                       options={allUsers}
//                       getOptionLabel={(u) => `${u.name || u.email} (${u.email})`}
//                       value={selectedUsers}
//                       onChange={(_, v) => setSelectedUsers(v)}
//                       renderInput={(params) => (
//                         <TextField {...params} placeholder="Select Users" size="small" sx={{ mb: 1, "& .MuiOutlinedInput-root": { borderRadius: 3 }, }} />
//                       )}
//                     />
//                   )}
//                   {selectionTypes.includes('group') && (
//                     <Autocomplete
//                       multiple
//                       options={watcherGroups}
//                       getOptionLabel={(g) => g.name}
//                       value={selectedGroups}
//                       onChange={(_, v) => setSelectedGroups(v)}
//                       renderInput={(params) => (
//                         <TextField {...params} placeholder="Select Groups" size="small" sx={{ mb: 1, "& .MuiOutlinedInput-root": { borderRadius: 3 }, }} />
//                       )}
//                     />
//                   )}
//                 </>
//               ) : (
//                 <TextField
//                   fullWidth
//                   size="small"
//                   value={
//                     ticket.assignees_detail?.length > 0
//                       ? ticket.assignees_detail.map(u => u.name || u.email).join(', ')
//                       : ticket.assigned_groups_detail?.length > 0
//                         ? ticket.assigned_groups_detail.map(g => g.name).join(', ')
//                         : 'Unassigned'
//                   }
//                   disabled
//                   sx={disabledFieldSx}
//                 />
//               )}
//               {/* Show who assigned (Admin name) */}
//               <Typography variant="caption" sx={{ mt: 1, display: "block", color: "text.secondary" }}>
//                 Assigned by: <strong>{currentUserName}</strong>
//               </Typography>
//             </Grid>
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
//               disabled={!isEditMode || !isRequester}
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
//               disabled={!isEditMode || !isRequester}
//               onChange={(e) =>
//                 setTicket((prev) => ({ ...prev, description: e.target.value }))
//               }
//               sx={disabledFieldSx}
//             />
//           </Box>

//           {isEditMode && isRequester && (
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

//           {newFiles.length > 0 && isEditMode && isRequester && (
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
//             <Button variant="contained" color="info" sx={{ borderRadius: 3 }} onClick={handleChatDrawerOpen}>Follow up Info</Button>
//             <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
//               {ticket?.status === "New" && isRequester && !isEditMode && (
//                 <Button color="error" variant="outlined" sx={{ borderRadius: 3 }} onClick={handleCancelTicket}>Cancel Ticket</Button>
//               )}
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

//       {/* <Drawer
//         anchor="right"
//         open={showFollowUpChat}
//         onClose={handleChatDrawerClose}
//         PaperProps={{ sx: { width: { xs: "100%", sm: 500 } } }}
//       > */}
//         <Box sx={{ p: 2, bgcolor: "primary.main", color: "white", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//           <Box>
//             <Typography variant="body2">Ticket #{currentChatTicket?.id}</Typography>
//             <Typography variant="body2">{currentChatTicket?.title}</Typography>
//             <Typography variant="caption" sx={{ color: "white" }}>{currentChatTicket?.description}</Typography>
//           </Box>
//           <IconButton onClick={() => setShowFollowUpChat(false)} sx={{ color: "white" }}>
//             <CloseIcon />
//           </IconButton>
//         </Box>
//         <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
//           <Tabs
//             value={chatTab}
//             onChange={(e, newValue) => setChatTab(newValue)}
//             centered
//           >
//             <Tab label="Follow-up" icon={<ChatIcon />} />
//             {isSolvedTicket && <Tab label="Solution" icon={<DoneAllIcon />} />}
//             <Tab label="Clarification" icon={<HelpOutlineIcon />} /> 
//           </Tabs>
//         </Box>
//         <Box sx={{ flex: 1 }}>
//           {chatTab === 0 && (
//             // Follow-up Tab: Chat Messages
//             <Box 
//               sx={{
//                 display: "flex",
//                 flexDirection: "column",
//                 height: "100%"
//               }}
//             >
//               <Box 
//                 sx={{
//                   flex: 1,
//                   overflowY: "auto",
//                   p: 2,
//                   display: "flex",
//                   flexDirection: "column",
//                   gap: 2
//                 }}
//               >
//                 {loadingFollowUpChats ? (
//                     <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
//                       <CircularProgress />
//                     </Box>
//                 ) : groupedChats.length === 0 ? (
//                     <Box 
//                       sx={{
//                         display: "flex",
//                         flexDirection: "column",
//                         justifyContent: "center",
//                         alignItems: "center",
//                         height: "100%",
//                         color: "text.secondary"
//                       }}
//                     >
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
//                           const isFromCurrentUser = msg.sender == PresentUserId;

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
//                       {sendingFollowUpMessage ? <CircularProgress size={20} /> : <SendIcon />}
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
//       // </Drawer>

//   //   </Box >
//   );
// };

// export default ApprovalPage;
 
// import { Box, Grid, Card, CardContent, Typography, TextField, Button, Divider, Chip, Stack, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Avatar, Autocomplete } from "@mui/material";
// import { useState, useEffect } from "react";
// import { useNavigate } from 'react-router-dom';
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import CancelIcon from "@mui/icons-material/Cancel";
// import AccessTimeIcon from "@mui/icons-material/AccessTime";
// import AutorenewIcon from '@mui/icons-material/Autorenew';
// import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
// import HistoryIcon from '@mui/icons-material/History';
// import { getTicketDetails, performTicketAction, fetchTicketSLAByEntityAndCategory, fetchUsersAPI } from '../../Api';
// import { toast } from 'react-toastify';
 
// const ACTION_MAP = {
//   Approve: { backend: 'approve', label: 'Approved' },
//   Reject: { backend: 'reject', label: 'Rejected' },
//   'On Hold': { backend: 'onhold', label: 'On Hold' },
//   Reassign: { backend: 'reassign', label: 'Pending' },
//   'Un Hold': { backend: 'unhold', label: 'Un Hold' },
// };
 
// const ApprovalPage = () => {
 
//   const navigate = useNavigate();
//   const [ticket, setTicket] = useState(null);
//   console.log("ticket", ticket);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [updating, setUpdating] = useState(false);
//   const [slaLoading, setSlaLoading] = useState(true);
 
//   // Form & Data
//   const [approvalComment, setApprovalComment] = useState('');
//   const [commentError, setCommentError] = useState('');
//   const [approvalStatus, setApprovalStatus] = useState('');
//   const [approvalLogs, setApprovalLogs] = useState([]);
//   const [currentApprovers, setCurrentApprovers] = useState([]);
//   const [allApprovers, setAllApprovers] = useState([]);
//   const [selectedReassignUser, setSelectedReassignUser] = useState(null);
//   const [isReassignPopupOpen, setIsReassignPopupOpen] = useState(false);
//   const [isApproverPopupOpen, setIsApproverPopupOpen] = useState(false);
//   const [isHistoryOpen, setIsHistoryOpen] = useState(false);
//   // const [followUpText, setFollowUpText] = useState('');
 
 
//   // Get current logged-in user
//   const currentUserId = localStorage.getItem('userId') ||
//     localStorage.getItem('id') ||
//     localStorage.getItem('user_id');
 
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
//         type: ticketData.type_detail?.field_name || ticketData.type_detail?.field_values || '',
//         department: ticketData.department_detail?.field_name || ticketData.department_detail?.field_values || '',
//         location: ticketData.location_detail?.field_name || '',
//         platform: ticketData.platform_detail?.field_name || ticketData.platform_detail?.field_values || '', // ← Fixed
//         category: ticketData.category_detail?.category_name?.trim() || '',
//         subcategory: ticketData.subcategory_detail?.subcategory_name || '',
//         priority: ticketData.priority_detail?.field_name || ticketData.priority_detail?.field_values || '',
//         title: ticketData.title || '',
//         description: ticketData.description || '',
//         files: ticketData.documents || [],
//         entity_id: ticketData.category_detail?.entity_id || ticketData.subcategory_detail?.entity_id || null,
//         category_id: ticketData.category_detail?.id,
//         subcategory_id: ticketData.subcategory_detail?.id,
//         approvalStatus: currentStatus,
//         assignedTo: ticketData.assignees_detail && ticketData.assignees_detail.length > 0
//           ? ticketData.assignees_detail.map(u => u.name || u.username).join(', ')
//           : ticketData.assigned_groups_detail && ticketData.assigned_groups_detail.length > 0
//             ? `${ticketData.assigned_groups_detail[0].name} (Group${ticketData.assigned_groups_detail[0].members_count ? ` - ${ticketData.assigned_groups_detail[0].members_count} members` : ''})`
//             : 'Unassigned',
//         assignedToId: ticketData.assigned_to || null,
//       };
 
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
//   useEffect(() => {
//     if (!ticket?.entity_id || !ticket?.category_id || !ticket?.subcategory_id) {
//       setCurrentApprovers([]);
//       setSlaLoading(false);
//       return;
//     }
 
//     const fetchApprovers = async () => {
//       setSlaLoading(true);
//       try {
//         const slaResponse = await fetchTicketSLAByEntityAndCategory(
//           ticket.entity_id, ticket.category_id, ticket.subcategory_id
//         );
//         const sla = Array.isArray(slaResponse) && slaResponse.length > 0 ? slaResponse[0] : slaResponse;
 
//         if (sla) {
//           const list = [
//             { user: sla.Approver_level1_user, time: sla.Approver_level1_time },
//             { user: sla.Approver_level2_user, time: sla.Approver_level2_time },
//             { user: sla.Approver_level3_user, time: sla.Approver_level3_time },
//             { user: sla.Approver_level4_user, time: sla.Approver_level4_time },
//             { user: sla.Approver_level5_user, time: sla.Approver_level5_time },
//           ].filter(a => a.user?.trim());
//           setCurrentApprovers(list);
//         }
//       } catch (err) {
//         console.error("SLA Error:", err);
//       } finally {
//         setSlaLoading(false);
//       }
//     };
//     fetchApprovers();
//   }, [ticket?.entity_id, ticket?.category_id, ticket?.subcategory_id]);
 
//   // Check if current user already acted
//   // const hasUserAlreadyActed = approvalLogs.some(log => {
//   //   const actorId = log.created_by || log.created_by_id || log.user_id;
//   //   return String(actorId) === String(currentUserId);
//   // });
 
//   // const isFinalized = ['Approved', 'Rejected'].includes(approvalStatus);
//   // const isOnHold = approvalStatus === 'On Hold';
//   const currentPendingLog = approvalLogs
//     .filter(log => log.is_current_level)
//     .slice(-1)[0];
 
//   const currentLogStatus = currentPendingLog
//     ? String(currentPendingLog.approval_status || currentPendingLog.status || '').trim()
//     : '';
 
//   // This detects On Hold EVEN if is_current_level is still true
//   const isOnHold = approvalLogs.some(log =>
//     ['On Hold', 'On-Hold', 'onhold', 'OnHold'].includes(
//       String(log.approval_status || log.status || '').trim()
//     )
//   );
 
//   const currentAssignedUserId = currentPendingLog
//     ? (currentPendingLog.created_by || currentPendingLog.created_by_id)
//     : null;
 
//   const isCurrentUserAssigned = String(currentAssignedUserId) === String(currentUserId);
 
//   const isFinalized = ['Approved', 'Rejected'].includes(approvalStatus);
//   // const isOnHold = approvalStatus === 'On Hold';
 
//   // User can act if:
//   // - They are the currently assigned approver (even if others acted before)
//   // - OR the ticket is On Hold (only then allow Un Hold, even if not assigned)
//   const canUserAct = !isFinalized && (isCurrentUserAssigned || isOnHold);
//   // Can current user take action?
//   // const canTakeAction = ticket?.type === "Request" &&
//   //   !isFinalized &&
//   //   (isOnHold || !hasUserAlreadyActed);
//   const canTakeAction = ticket?.type === "Request" && !isFinalized && (isCurrentUserAssigned || isOnHold);
 
//   // Approval level
//   const approvalLevel = approvalLogs.filter(log => {
//     const status = (log.approval_status || log.status || '').toLowerCase();
//     return status && !['pending', 'follow-up'].includes(status);
//   }).length + 1;
 
//   // Handle Actions
//   const handleApprovalAction = async (action) => {
//     if (!canTakeAction && action !== "Un Hold") {
//       toast.error("You have already taken action on this ticket.");
//       return;
//     }
 
//     if (!approvalComment.trim() && !["Un Hold", "On Hold"].includes(action)) {
//       setCommentError("Comment is required.");
//       return;
//     }
//     setCommentError("");
 
//     if (action === "Reassign") {
//       setIsReassignPopupOpen(true);
//       return;
//     }
 
//     setUpdating(true);
//     const payload = {
//       action: ACTION_MAP[action]?.backend || 'pending',
//       comments: approvalComment || (action === "Un Hold" ? "Ticket resumed" : "No comment provided"),
//     };
 
//     try {
//       const result = await performTicketAction(ticket.id, payload);
//       if (result?.detail?.includes("applied") || result?.success) {
//         toast.success(`${action} successful!`);
//         setApprovalComment("");
//         await loadTicket();
//       } else {
//         toast.error("Action failed. Please try again.");
//       }
//     } catch (err) {
//       toast.error("Network error. Try again.");
//     } finally {
//       setUpdating(false);
//     }
//   };
 
//   const handleReassignConfirm = async () => {
//     if (!selectedReassignUser) {
//       toast.error("Please select a user.");
//       return;
//     }
 
//     setUpdating(true);
//     const payload = {
//       action: "reassign",
//       comments: approvalComment || `Reassigned to ${selectedReassignUser.name || selectedReassignUser.username}`,
//       reassign_to: selectedReassignUser.id,
//     };
 
//     try {
//       const result = await performTicketAction(ticket.id, payload);
//       if (result?.detail?.includes("applied")) {
//         toast.success("Reassigned successfully!");
//         setApprovalComment("");
//         setSelectedReassignUser(null);
//         setIsReassignPopupOpen(false);
//         await loadTicket();
//       }
//     } catch (err) {
//       toast.error("Reassign failed.");
//     } finally {
//       setUpdating(false);
//     }
//   };
 
//   const handleCancel = () => {
//     localStorage.removeItem('selectedTicketId');
//     navigate('/tickethistory');
//   };
 
//   // const handleSendFollowUp = async () => {
//   //   if (!followUpText.trim()) return toast.error("Type a message first.");
//   //   try {
//   //     const result = await performTicketAction(ticket.id, { action: 'followup', comments: followUpText });
//   //     if (result?.detail?.includes("applied")) {
//   //       toast.success("Follow-up sent!");
//   //       setFollowUpText("");
//   //       await loadTicket();
//   //     }
//   //   } catch (err) {
//   //     toast.error("Failed to send.");
//   //   }
//   // };
 
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
//   };
 
//   return (
//     <Box sx={{ p: 3, background: "#f5f6fa" }}>
//       <Card sx={{ borderRadius: 3 }}>
//         <CardContent sx={{ p: 3 }}>
//           {/* Header */}
//           <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
//             <Typography variant="h3" fontWeight={600}>Ticket #{ticket.id}</Typography>
//             <Chip label={ticket.priority} sx={{
//               fontWeight: 800, fontSize: "1rem", py: 2.5, px: 3,
//               background: priorityColors[ticket.priority] || "#666", color: "white",
//             }} />
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
//               { label: "Assign To", value: ticket.assignedTo }
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
//             <TextField fullWidth size="small" value={ticket.title} disabled sx={disabledFieldSx} />
//           </Box>
//           <Box sx={{ mt: 3 }}>
//             <Typography fontWeight={600} sx={{ mb: 1 }}>Description</Typography>
//             <TextField multiline rows={4} fullWidth value={ticket.description} disabled sx={disabledFieldSx} />
//           </Box>
 
 
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
 
 
//           {/* Approval Section - MAIN FIX HERE */}
//           {ticket.type === "Request" && (
//             <Box sx={{ mt: 4, p: 4, border: "2px dashed #ccc", borderRadius: 3, backgroundColor: "#fafafa" }}>
 
//               {/* Header Message */}
//               {/* <Typography variant="h5" fontWeight={700} gutterBottom
//                 color={isFinalized ? "success.main" : isOnHold ? "warning.main" : "primary"}>
//                 {isFinalized
//                   ? (approvalStatus === "Approved" ? "Ticket Fully Approved" : "Ticket Rejected")
//                   : isOnHold
//                     ? "Ticket is On Hold — Resume to Continue Approval"
//                     : "Your Approval Required"
//                 }
//               </Typography> */}
 
//               {/* ADD THIS BLOCK HERE — ON HOLD VISUAL INDICATOR */}
//               {/* {isOnHold && !isFinalized && (
//                 <Box sx={{
//                   mb: 3,
//                   p: 3,
//                   bgcolor: "#fff3e0",
//                   borderRadius: 2,
//                   border: "1px solid #ffb74d",
//                   borderLeft: "5px solid #ff9800",
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 2
//                 }}>
//                   <AccessTimeIcon sx={{ color: "#ff9800", fontSize: 32 }} />
//                   <Box>
//                     <Typography variant="h6" color="#e65100" fontWeight={600}>
//                       This ticket is currently On Hold
//                     </Typography>
//                     <Typography variant="body2" color="text.secondary">
//                       The approval process is paused. Click "Resume Approval" to continue.
//                     </Typography>
//                   </Box>
//                 </Box>
//               )} */}
//               {/* END OF NEW BLOCK */}
 
//               {/* Comment Box in this it shows the comment box for the approve reject reassign onhold and also for resume*/}
//               {/* <TextField
//                     fullWidth
//                     multiline
//                     rows={4}
//                     placeholder={
//                       isFinalized
//                       ? "This ticket is closed."
//                       : isOnHold
//                       ? "Optional: Add comment before resuming approval..."
//                       : "Enter your comments (required for Approve/Reject)"
//                     }
//                     value={approvalComment}
//                     onChange={(e) => setApprovalComment(e.target.value)}
//                     disabled={isFinalized || (!isOnHold && !isCurrentUserAssigned)}
//                     error={!!commentError}
//                     helperText={commentError}
//                     sx={{ mb: 3 }}
//                   /> */}
//               {/* COMMENT BOX — ONLY WHEN TICKET IS ACTIVE (NOT ON HOLD) */}
//               {/* {!isFinalized && !isOnHold && isCurrentUserAssigned && (
//                 <TextField
//                   fullWidth
//                   multiline
//                   rows={4}
//                   placeholder="Enter your comments (required for Approve/Reject/Reassign)"
//                   value={approvalComment}
//                   onChange={(e) => setApprovalComment(e.target.value)}
//                   disabled={updating}
//                   error={!!commentError}
//                   helperText={commentError || "Comment is required"}
//                   sx={{ mb: 3 }}
//                 />
//               )} */}
//               {/* Action Buttons - SMART CONDITIONAL RENDERING */}
//               {/* Action Buttons */}
//               {/* <Stack direction="row" spacing={2} justifyContent="flex-end" flexWrap="wrap" sx={{ mt: 2 }}> */}
 
//                 {/* FINALIZED STATE */}
//                 {/* {isFinalized && (
//                   <Typography variant="h6" color={approvalStatus === "Approved" ? "success.main" : "error.main"} fontWeight={700}>
//                     {approvalStatus === "Approved" ? "Approved Successfully" : "Rejected"}
//                   </Typography>
//                 )} */}
 
//                 {/* ON HOLD STATE → ONLY Resume button */}
//                 {/* {isOnHold && !isFinalized && (
//                   <Button
//                     variant="contained"
//                     size="large"
//                     startIcon={<AutorenewIcon />}
//                     onClick={() => handleApprovalAction("Un Hold")}
//                     disabled={updating}
//                     sx={{ bgcolor: "#4caf50", minWidth: 240, fontSize: "1.1rem", py: 1.5, "&:hover": { bgcolor: "#388e3c" } }}
//                   >
//                     {updating ? "Resuming..." : "Resume Approval"}
//                   </Button>
//                 )} */}
 
//                 {/* NORMAL PENDING STATE → Full buttons (ONLY when NOT On Hold and NOT Finalized) */}
//                 {/* {!isFinalized && !isOnHold && isCurrentUserAssigned && (
//                   <>
//                     <Button variant="contained" startIcon={<CheckCircleIcon />} onClick={() => handleApprovalAction("Approve")} disabled={updating} sx={{ bgcolor: "#4caf50", "&:hover": { bgcolor: "#388e3c" } }}>
//                       Approve
//                     </Button>
//                     <Button variant="contained" startIcon={<CancelIcon />} onClick={() => handleApprovalAction("Reject")} disabled={updating} sx={{ bgcolor: "#f44336", "&:hover": { bgcolor: "#d32f2f" } }}>
//                       Reject
//                     </Button>
//                     <Button variant="contained" startIcon={<AutorenewIcon />} onClick={() => handleApprovalAction("Reassign")} disabled={updating} sx={{ bgcolor: "#2196f3", "&:hover": { bgcolor: "#1976d2" } }}>
//                       Reassign
//                     </Button>
//                     <Button variant="contained" startIcon={<AccessTimeIcon />} onClick={() => handleApprovalAction("On Hold")} disabled={updating} sx={{ bgcolor: "#ff9800", "&:hover": { bgcolor: "#f57c00" } }}>
//                       On Hold
//                     </Button>
//                   </>
//                 )} */}
 
//                 {/* NOT YOUR TURN */}
//                 {/* {!isFinalized && !isOnHold && !isCurrentUserAssigned && (
//                   <Typography color="text.secondary" fontWeight={600} sx={{ fontStyle: "italic" }}>
//                     Waiting for <strong>
//                       {currentPendingLog?.created_by_name || currentPendingLog?.created_by?.name || "next approver"}
//                     </strong> to take action...
//                   </Typography>
//                 )} */}
 
//               {/* </Stack> */}
//             </Box>
//           )}
 
//           {/* Follow-up Section */}
//           {/* {(isOnHold || approvalStatus === "Rejected") && (
//             <Box sx={{ mt: 4 }}>
//               <Typography variant="h6" fontWeight={600}>Follow-Up Message</Typography>
//               <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
//                 <TextField
//                   fullWidth
//                   multiline
//                   rows={2}
//                   placeholder="Type your message to the requester..."
//                   value={followUpText}
//                   onChange={(e) => setFollowUpText(e.target.value)}
//                 />
//                 <Button
//                   variant="contained"
//                   onClick={handleSendFollowUp}
//                   disabled={!followUpText.trim() || updating}
//                   sx={{ alignSelf: "flex-start" }}
//                 >
//                   Send
//                 </Button>
//               </Box>
//             </Box>
//           )} */}
 
//           <Box sx={{ mt: 4, textAlign: "right" }}>
//             <Button variant="contained" onClick={handleCancel} sx={{ bgcolor: "#555" }}>Back to Tickets</Button>
//           </Box>
//         </CardContent>
//       </Card>
 
//       {/* Dialogs */}
//       {/* <Dialog open={isReassignPopupOpen} onClose={() => setIsReassignPopupOpen(false)} fullWidth maxWidth="sm">
//         <DialogTitle>Reassign Ticket</DialogTitle>
//         <DialogContent>
//           <Autocomplete
//             options={allApprovers}
//             getOptionLabel={opt => opt.name || opt.username || ""}
//             value={selectedReassignUser}
//             onChange={(_, v) => setSelectedReassignUser(v)}
//             renderInput={params => <TextField {...params} label="Select User" />}
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => { setIsReassignPopupOpen(false); setSelectedReassignUser(null); }}>Cancel</Button>
//           <Button onClick={handleReassignConfirm} variant="contained" disabled={!selectedReassignUser || updating}>Reassign</Button>
//         </DialogActions>
//       </Dialog> */}
 
//       {/* <Dialog open={isApproverPopupOpen} onClose={() => setIsApproverPopupOpen(false)}>
//         <DialogTitle>Approval Hierarchy</DialogTitle>
//         <DialogContent>
//           {currentApprovers.map((a, i) => (
//             <Typography key={i}>Level {i + 1}: {a.user} {a.time ? `(${a.time})` : ""}</Typography>
//           ))}
//         </DialogContent>
//         <DialogActions><Button onClick={() => setIsApproverPopupOpen(false)}>Close</Button></DialogActions>
//       </Dialog> */}
//     </Box>
//   );
// };
 
// export default ApprovalPage;
 

// import {
//   Box, Grid, Card, CardContent, Typography, TextField, Button, Divider,
//   Chip, Stack, CircularProgress, Dialog, DialogTitle, DialogContent,
//   DialogActions, IconButton, Avatar, Autocomplete
// } from "@mui/material";
// import { useState, useEffect } from "react";
// import { useNavigate } from 'react-router-dom';
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import CancelIcon from "@mui/icons-material/Cancel";
// import AccessTimeIcon from "@mui/icons-material/AccessTime";
// import AutorenewIcon from '@mui/icons-material/Autorenew';
// import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
// import HistoryIcon from '@mui/icons-material/History';
// import {
//   getTicketDetails, performTicketAction,
//   fetchTicketSLAByEntityAndCategory, fetchUsersAPI
// } from '../../Api';
// import { toast } from 'react-toastify';

// const ACTION_MAP = {
//   Approve: { backend: 'approve', label: 'Approved' },
//   Reject: { backend: 'reject', label: 'Rejected' },
//   'On Hold': { backend: 'onhold', label: 'On Hold' },
//   Reassign: { backend: 'reassign', label: 'Pending' },
//   'Un Hold': { backend: 'unhold', label: 'Un Hold' },
// };

// const ApprovalPage = () => {
//   const navigate = useNavigate();
//   const [ticket, setTicket] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [updating, setUpdating] = useState(false);
//   const [slaLoading, setSlaLoading] = useState(true);

//   // Form & Data
//   const [approvalComment, setApprovalComment] = useState('');
//   const [commentError, setCommentError] = useState('');
//   const [approvalStatus, setApprovalStatus] = useState('');
//   const [approvalLogs, setApprovalLogs] = useState([]);
//   const [currentApprovers, setCurrentApprovers] = useState([]);
//   const [allApprovers, setAllApprovers] = useState([]);
//   const [selectedReassignUser, setSelectedReassignUser] = useState(null);
//   const [isReassignPopupOpen, setIsReassignPopupOpen] = useState(false);
//   const [isApproverPopupOpen, setIsApproverPopupOpen] = useState(false);
//   const [isHistoryOpen, setIsHistoryOpen] = useState(false);
//   // const [followUpText, setFollowUpText] = useState('');
  

//   // Get current logged-in user
//   const currentUserId = localStorage.getItem('userId') ||
//     localStorage.getItem('id') ||
//     localStorage.getItem('user_id');

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
//         type: ticketData.type_detail?.field_name || ticketData.type_detail?.field_values || '',
//         department: ticketData.department_detail?.field_name || ticketData.department_detail?.field_values || '',
//         location: ticketData.location_detail?.field_name || '',
//         category: ticketData.category_detail?.category_name?.trim() || '',
//         subcategory: ticketData.subcategory_detail?.subcategory_name || '',
//         priority: ticketData.priority_detail?.field_name || ticketData.priority_detail?.field_values || '',
//         title: ticketData.title || '',
//         description: ticketData.description || '',
//         files: ticketData.documents || [],
//         entity_id: ticketData.category_detail?.entity_id || ticketData.subcategory_detail?.entity_id || null,
//         category_id: ticketData.category_detail?.id,
//         subcategory_id: ticketData.subcategory_detail?.id,
//         approvalStatus: currentStatus,
//       };

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
//   useEffect(() => {
//     if (!ticket?.entity_id || !ticket?.category_id || !ticket?.subcategory_id) {
//       setCurrentApprovers([]);
//       setSlaLoading(false);
//       return;
//     }

//     const fetchApprovers = async () => {
//       setSlaLoading(true);
//       try {
//         const slaResponse = await fetchTicketSLAByEntityAndCategory(
//           ticket.entity_id, ticket.category_id, ticket.subcategory_id
//         );
//         const sla = Array.isArray(slaResponse) && slaResponse.length > 0 ? slaResponse[0] : slaResponse;

//         if (sla) {
//           const list = [
//             { user: sla.Approver_level1_user, time: sla.Approver_level1_time },
//             { user: sla.Approver_level2_user, time: sla.Approver_level2_time },
//             { user: sla.Approver_level3_user, time: sla.Approver_level3_time },
//             { user: sla.Approver_level4_user, time: sla.Approver_level4_time },
//             { user: sla.Approver_level5_user, time: sla.Approver_level5_time },
//           ].filter(a => a.user?.trim());
//           setCurrentApprovers(list);
//         }
//       } catch (err) {
//         console.error("SLA Error:", err);
//       } finally {
//         setSlaLoading(false);
//       }
//     };
//     fetchApprovers();
//   }, [ticket?.entity_id, ticket?.category_id, ticket?.subcategory_id]);

//   // Check if current user already acted
//   // const hasUserAlreadyActed = approvalLogs.some(log => {
//   //   const actorId = log.created_by || log.created_by_id || log.user_id;
//   //   return String(actorId) === String(currentUserId);
//   // });

//   // const isFinalized = ['Approved', 'Rejected'].includes(approvalStatus);
//   // const isOnHold = approvalStatus === 'On Hold';
// const currentPendingLog = approvalLogs
//   .filter(log => log.is_current_level)
//   .slice(-1)[0];

// const currentLogStatus = currentPendingLog 
//   ? String(currentPendingLog.approval_status || currentPendingLog.status || '').trim()
//   : '';

// // This detects On Hold EVEN if is_current_level is still true
// const isOnHold = approvalLogs.some(log => 
//   ['On Hold', 'On-Hold', 'onhold', 'OnHold'].includes(
//     String(log.approval_status || log.status || '').trim()
//   )
// );

//   const currentAssignedUserId = currentPendingLog
//     ? (currentPendingLog.created_by || currentPendingLog.created_by_id)
//     : null;

//   const isCurrentUserAssigned = String(currentAssignedUserId) === String(currentUserId);

//   const isFinalized = ['Approved', 'Rejected'].includes(approvalStatus);
//   // const isOnHold = approvalStatus === 'On Hold';

//   // User can act if:
//   // - They are the currently assigned approver (even if others acted before)
//   // - OR the ticket is On Hold (only then allow Un Hold, even if not assigned)
//   const canUserAct = !isFinalized && (isCurrentUserAssigned || isOnHold);
//   // Can current user take action?
//   // const canTakeAction = ticket?.type === "Request" &&
//   //   !isFinalized &&
//   //   (isOnHold || !hasUserAlreadyActed);
//   const canTakeAction = ticket?.type === "Request" && !isFinalized && (isCurrentUserAssigned || isOnHold);

//   // Approval level
//   const approvalLevel = approvalLogs.filter(log => {
//     const status = (log.approval_status || log.status || '').toLowerCase();
//     return status && !['pending', 'follow-up'].includes(status);
//   }).length + 1;

//   // Handle Actions
//   const handleApprovalAction = async (action) => {
//     if (!canTakeAction && action !== "Un Hold") {
//       toast.error("You have already taken action on this ticket.");
//       return;
//     }

//     if (!approvalComment.trim() && !["Un Hold", "On Hold"].includes(action)) {
//       setCommentError("Comment is required.");
//       return;
//     }
//     setCommentError("");

//     if (action === "Reassign") {
//       setIsReassignPopupOpen(true);
//       return;
//     }

//     setUpdating(true);
//     const payload = {
//       action: ACTION_MAP[action]?.backend || 'pending',
//       comments: approvalComment || (action === "Un Hold" ? "Ticket resumed" : "No comment provided"),
//     };

//     try {
//       const result = await performTicketAction(ticket.id, payload);
//       if (result?.detail?.includes("applied") || result?.success) {
//         toast.success(`${action} successful!`);
//         setApprovalComment("");
//         await loadTicket();
//       } else {
//         toast.error("Action failed. Please try again.");
//       }
//     } catch (err) {
//       toast.error("Network error. Try again.");
//     } finally {
//       setUpdating(false);
//     }
//   };

//   const handleReassignConfirm = async () => {
//     if (!selectedReassignUser) {
//       toast.error("Please select a user.");
//       return;
//     }

//     setUpdating(true);
//     const payload = {
//       action: "reassign",
//       comments: approvalComment || `Reassigned to ${selectedReassignUser.name || selectedReassignUser.username}`,
//       reassign_to: selectedReassignUser.id,
//     };

//     try {
//       const result = await performTicketAction(ticket.id, payload);
//       if (result?.detail?.includes("applied")) {
//         toast.success("Reassigned successfully!");
//         setApprovalComment("");
//         setSelectedReassignUser(null);
//         setIsReassignPopupOpen(false);
//         await loadTicket();
//       }
//     } catch (err) {
//       toast.error("Reassign failed.");
//     } finally {
//       setUpdating(false);
//     }
//   };

//   const handleCancel = () => {
//     localStorage.removeItem('selectedTicketId');
//     navigate('/tickethistory');
//   };

//   // const handleSendFollowUp = async () => {
//   //   if (!followUpText.trim()) return toast.error("Type a message first.");
//   //   try {
//   //     const result = await performTicketAction(ticket.id, { action: 'followup', comments: followUpText });
//   //     if (result?.detail?.includes("applied")) {
//   //       toast.success("Follow-up sent!");
//   //       setFollowUpText("");
//   //       await loadTicket();
//   //     }
//   //   } catch (err) {
//   //     toast.error("Failed to send.");
//   //   }
//   // };

//   if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>;
//   if (error || !ticket) return <Box sx={{ p: 3 }}><Typography color="error">{error || "Ticket not found"}</Typography></Box>;

//   const priorityColors = {
//     "Critical": "#D32F2F", "Very High": "#E53935", "High": "#FB8C00",
//     "Medium": "#FDD835", "Low": "#43A047", "Very Low": "#1E88E5"
//   };

//   return (
//     <Box sx={{ p: 3, background: "#f5f6fa" }}>
//       <Card sx={{ borderRadius: 3 }}>
//         <CardContent sx={{ p: 3 }}>
//           {/* Header */}
//           <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
//             <Typography variant="h3" fontWeight={600}>Ticket #{ticket.id}</Typography>
//             <Chip label={ticket.priority} sx={{
//               fontWeight: 800, fontSize: "1rem", py: 2.5, px: 3,
//               background: priorityColors[ticket.priority] || "#666", color: "white",
//             }} />
//           </Box>
//           <Divider sx={{ my: 2 }} />

// {/* <Box>
  
// </Box>
//           <Typography variant="h5" fontWeight={700} gutterBottom>Title:{ticket.title}</Typography>
//           <Typography variant="body1" color="text.secondary" paragraph>Description:{ticket.description}</Typography> */}
//           <Box sx={{ my: 2 }}>
//             <Typography variant="overline" sx={{ color: "#667eea", fontWeight: 700, letterSpacing: 2, mb: 2, }}>
//               Title
//             </Typography>
//             <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: "#1a1a1a" }}>
//               {ticket.title}
//             </Typography>
 
//             <Typography variant="overline" sx={{ color: "#667eea", fontWeight: 700, letterSpacing: 2, mt: 1, mb: 2 }}>
//               Description
//             </Typography>
//             <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.8 }}>
//               {ticket.description}
//             </Typography>
//           </Box>

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

//           {/* Details */}
//           <Grid container spacing={3} sx={{ my: 2 }}>
//             {["Type", "Department", "Location", "Priority", "Category", "Subcategory"].map(field => (
//               <Grid size={{ xs: 12, sm: 6, md: 4 }} key={field}>
//                 <Typography variant="caption" sx={{ textTransform: "uppercase", fontWeight: 600, color: "text.secondary" }}>
//                   {field}
//                 </Typography>
//                 <Typography variant="body1" fontWeight={500}>
//                   {ticket[field.toLowerCase()] || "-"}
//                 </Typography>
//               </Grid>
//             ))}
//             <Grid size={{ xs: 12, sm: 6, md: 4 }}>
//               <Typography variant="caption" sx={{ textTransform: "uppercase", fontWeight: 600, color: "text.secondary" }}>
//                 Approvers (SLA)
//               </Typography>
//               <Box sx={{ mt: 1, display: "flex", gap: 1, flexWrap: "wrap", alignItems: "center" }}>
//                 {slaLoading ? "Loading..." : currentApprovers.length > 0 ? (
//                   currentApprovers.map((a, i) => <Chip key={i} label={a.user} size="small" />)
//                 ) : "None"}
//                 {ticket.type === "Request" && (
//                   <IconButton size="small" onClick={() => setIsApproverPopupOpen(true)}>
//                     <InfoOutlinedIcon fontSize="small" />
//                   </IconButton>
//                 )}
//               </Box>
//             </Grid>
//           </Grid>

//           {/* Approval Section - MAIN FIX HERE */}
//           {ticket.type === "Request" && (
//             <Box sx={{ mt: 4, p: 4, border: "2px dashed #ccc", borderRadius: 3, backgroundColor: "#fafafa" }}>
    
//     {/* Header Message */}
//     <Typography variant="h5" fontWeight={700} gutterBottom
//       color={isFinalized ? "success.main" : isOnHold ? "warning.main" : "primary"}>
//       {isFinalized
//         ? (approvalStatus === "Approved" ? "Ticket Fully Approved" : "Ticket Rejected")
//         : isOnHold
//           ? "Ticket is On Hold — Resume to Continue Approval"
//           : "Your Approval Required"
//       }
//     </Typography>

//     {/* ADD THIS BLOCK HERE — ON HOLD VISUAL INDICATOR */}
//     {isOnHold && !isFinalized && (
//       <Box sx={{ 
//         mb: 3, 
//         p: 3, 
//         bgcolor: "#fff3e0", 
//         borderRadius: 2, 
//         border: "1px solid #ffb74d", 
//         borderLeft: "5px solid #ff9800",
//         display: "flex",
//         alignItems: "center",
//         gap: 2
//       }}>
//         <AccessTimeIcon sx={{ color: "#ff9800", fontSize: 32 }} />
//         <Box>
//           <Typography variant="h6" color="#e65100" fontWeight={600}>
//             This ticket is currently On Hold
//           </Typography>
//           <Typography variant="body2" color="text.secondary">
//             The approval process is paused. Click "Resume Approval" to continue.
//           </Typography>
//         </Box>
//       </Box>
//     )}
//     {/* END OF NEW BLOCK */}

//     {/* Comment Box in this it shows the comment box for the approve reject reassign onhold and also for resume*/}
//     {/* <TextField
//       fullWidth
//       multiline
//       rows={4}
//       placeholder={
//         isFinalized
//           ? "This ticket is closed."
//           : isOnHold
//             ? "Optional: Add comment before resuming approval..."
//             : "Enter your comments (required for Approve/Reject)"
//       }
//       value={approvalComment}
//       onChange={(e) => setApprovalComment(e.target.value)}
//       disabled={isFinalized || (!isOnHold && !isCurrentUserAssigned)}
//       error={!!commentError}
//       helperText={commentError}
//       sx={{ mb: 3 }}
//     /> */}
// {/* COMMENT BOX — ONLY WHEN TICKET IS ACTIVE (NOT ON HOLD) */}
// {!isFinalized && !isOnHold && isCurrentUserAssigned && (
//   <TextField
//     fullWidth
//     multiline
//     rows={4}
//     placeholder="Enter your comments (required for Approve/Reject/Reassign)"
//     value={approvalComment}
//     onChange={(e) => setApprovalComment(e.target.value)}
//     disabled={updating}
//     error={!!commentError}
//     helperText={commentError || "Comment is required"}
//     sx={{ mb: 3 }}
//   />
// )}
//               {/* Action Buttons - SMART CONDITIONAL RENDERING */}
//               {/* Action Buttons */}
// <Stack direction="row" spacing={2} justifyContent="flex-end" flexWrap="wrap" sx={{ mt: 2 }}>

//   {/* FINALIZED STATE */}
//   {isFinalized && (
//     <Typography variant="h6" color={approvalStatus === "Approved" ? "success.main" : "error.main"} fontWeight={700}>
//       {approvalStatus === "Approved" ? "Approved Successfully" : "Rejected"}
//     </Typography>
//   )}

//   {/* ON HOLD STATE → ONLY Resume button */}
//   {isOnHold && !isFinalized && (
//     <Button
//       variant="contained"
//       size="large"
//       startIcon={<AutorenewIcon />}
//       onClick={() => handleApprovalAction("Un Hold")}
//       disabled={updating}
//       sx={{ bgcolor: "#4caf50", minWidth: 240, fontSize: "1.1rem", py: 1.5, "&:hover": { bgcolor: "#388e3c" } }}
//     >
//       {updating ? "Resuming..." : "Resume Approval"}
//     </Button>
//   )}

//   {/* NORMAL PENDING STATE → Full buttons (ONLY when NOT On Hold and NOT Finalized) */}
//   {!isFinalized && !isOnHold && isCurrentUserAssigned && (
//     <>
//       <Button variant="contained" startIcon={<CheckCircleIcon />} onClick={() => handleApprovalAction("Approve")} disabled={updating} sx={{ bgcolor: "#4caf50", "&:hover": { bgcolor: "#388e3c" } }}>
//         Approve
//       </Button>
//       <Button variant="contained" startIcon={<CancelIcon />} onClick={() => handleApprovalAction("Reject")} disabled={updating} sx={{ bgcolor: "#f44336", "&:hover": { bgcolor: "#d32f2f" } }}>
//         Reject
//       </Button>
//       <Button variant="contained" startIcon={<AutorenewIcon />} onClick={() => handleApprovalAction("Reassign")} disabled={updating} sx={{ bgcolor: "#2196f3", "&:hover": { bgcolor: "#1976d2" } }}>
//         Reassign
//       </Button>
//       <Button variant="contained" startIcon={<AccessTimeIcon />} onClick={() => handleApprovalAction("On Hold")} disabled={updating} sx={{ bgcolor: "#ff9800", "&:hover": { bgcolor: "#f57c00" } }}>
//         On Hold
//       </Button>
//     </>
//   )}

//   {/* NOT YOUR TURN */}
//   {!isFinalized && !isOnHold && !isCurrentUserAssigned && (
//     <Typography color="text.secondary" fontWeight={600} sx={{ fontStyle: "italic" }}>
//       Waiting for <strong>
//         {currentPendingLog?.created_by_name || currentPendingLog?.created_by?.name || "next approver"}
//       </strong> to take action...
//     </Typography>
//   )}

// </Stack>
//             </Box>
//           )}

//           {/* Follow-up Section */}
//           {/* {(isOnHold || approvalStatus === "Rejected") && (
//             <Box sx={{ mt: 4 }}>
//               <Typography variant="h6" fontWeight={600}>Follow-Up Message</Typography>
//               <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
//                 <TextField
//                   fullWidth
//                   multiline
//                   rows={2}
//                   placeholder="Type your message to the requester..."
//                   value={followUpText}
//                   onChange={(e) => setFollowUpText(e.target.value)}
//                 />
//                 <Button
//                   variant="contained"
//                   onClick={handleSendFollowUp}
//                   disabled={!followUpText.trim() || updating}
//                   sx={{ alignSelf: "flex-start" }}
//                 >
//                   Send
//                 </Button>
//               </Box>
//             </Box>
//           )} */}

//           <Box sx={{ mt: 4, textAlign: "right" }}>
//             <Button variant="contained" onClick={handleCancel} sx={{ bgcolor: "#555" }}>Back to Tickets</Button>
//           </Box>
//         </CardContent>
//       </Card>

//       {/* Dialogs */}
//       <Dialog open={isReassignPopupOpen} onClose={() => setIsReassignPopupOpen(false)} fullWidth maxWidth="sm">
//         <DialogTitle>Reassign Ticket</DialogTitle>
//         <DialogContent>
//           <Autocomplete
//             options={allApprovers}
//             getOptionLabel={opt => opt.name || opt.username || ""}
//             value={selectedReassignUser}
//             onChange={(_, v) => setSelectedReassignUser(v)}
//             renderInput={params => <TextField {...params} label="Select User" />}
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => { setIsReassignPopupOpen(false); setSelectedReassignUser(null); }}>Cancel</Button>
//           <Button onClick={handleReassignConfirm} variant="contained" disabled={!selectedReassignUser || updating}>Reassign</Button>
//         </DialogActions>
//       </Dialog>

//       <Dialog open={isApproverPopupOpen} onClose={() => setIsApproverPopupOpen(false)}>
//         <DialogTitle>Approval Hierarchy</DialogTitle>
//         <DialogContent>
//           {currentApprovers.map((a, i) => (
//             <Typography key={i}>Level {i + 1}: {a.user} {a.time ? `(${a.time})` : ""}</Typography>
//           ))}
//         </DialogContent>
//         <DialogActions><Button onClick={() => setIsApproverPopupOpen(false)}>Close</Button></DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default ApprovalPage;

// import {
//   Box, Grid, Card, CardContent, Typography, TextField, Button, Divider,
//   Chip, Stack, CircularProgress, Dialog, DialogTitle, DialogContent,
//   DialogActions, IconButton, Autocomplete
// } from "@mui/material";
// import { useState, useEffect } from "react";
// import { useNavigate } from 'react-router-dom';
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import CancelIcon from "@mui/icons-material/Cancel";
// import AccessTimeIcon from "@mui/icons-material/AccessTime";
// import AutorenewIcon from '@mui/icons-material/Autorenew';
// import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
// import {
//   getTicketDetails, performTicketAction,
//   fetchTicketSLAByEntityAndCategory, fetchUsersAPI
// } from '../../Api';
// import { toast } from 'react-toastify';

// const ACTION_MAP = {
//   Approve: { backend: 'approve', label: 'Approved' },
//   Reject: { backend: 'reject', label: 'Rejected' },
//   'On Hold': { backend: 'onhold', label: 'On Hold' },
//   Reassign: { backend: 'reassign', label: 'Pending' },
//   'Un Hold': { backend: 'unhold', label: 'Un Hold' },
// };

// const ApprovalPage = () => {
//   const navigate = useNavigate();
//   const [ticket, setTicket] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [updating, setUpdating] = useState(false);
//   const [slaLoading, setSlaLoading] = useState(true);

//   const [approvalComment, setApprovalComment] = useState('');
//   const [commentError, setCommentError] = useState('');
//   const [approvalStatus, setApprovalStatus] = useState('');
//   const [approvalLogs, setApprovalLogs] = useState([]);
//   const [currentApprovers, setCurrentApprovers] = useState([]);
//   const [allApprovers, setAllApprovers] = useState([]);
//   const [selectedReassignUser, setSelectedReassignUser] = useState(null);
//   const [isReassignPopupOpen, setIsReassignPopupOpen] = useState(false);
//   const [isApproverPopupOpen, setIsApproverPopupOpen] = useState(false);
//   const [followUpText, setFollowUpText] = useState('');

//   // Current User
//   const currentUserId = localStorage.getItem('userId') || localStorage.getItem('id') || localStorage.getItem('user_id');

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

//   // Load Ticket
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
//         type: ticketData.type_detail?.field_name || ticketData.type_detail?.field_values || '',
//         department: ticketData.department_detail?.field_name || ticketData.department_detail?.field_values || '',
//         location: ticketData.location_detail?.field_name || '',
//         category: ticketData.category_detail?.category_name?.trim() || '',
//         subcategory: ticketData.subcategory_detail?.subcategory_name || '',
//         priority: ticketData.priority_detail?.field_name || ticketData.priority_detail?.field_values || '',
//         title: ticketData.title || '',
//         description: ticketData.description || '',
//         files: ticketData.documents || [],
//         entity_id: ticketData.category_detail?.entity_id || ticketData.subcategory_detail?.entity_id || null,
//         category_id: ticketData.category_detail?.id,
//         subcategory_id: ticketData.subcategory_detail?.id,
//         approvalStatus: currentStatus,
//       };

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

//   // SLA Approvers
//   useEffect(() => {
//     if (!ticket?.entity_id || !ticket?.category_id || !ticket?.subcategory_id) {
//       setCurrentApprovers([]);
//       setSlaLoading(false);
//       return;
//     }

//     const fetchApprovers = async () => {
//       setSlaLoading(true);
//       try {
//         const slaResponse = await fetchTicketSLAByEntityAndCategory(
//           ticket.entity_id, ticket.category_id, ticket.subcategory_id
//         );
//         const sla = Array.isArray(slaResponse) && slaResponse.length > 0 ? slaResponse[0] : slaResponse;

//         if (sla) {
//           const list = [
//             { user: sla.Approver_level1_user, time: sla.Approver_level1_time },
//             { user: sla.Approver_level2_user, time: sla.Approver_level2_time },
//             { user: sla.Approver_level3_user, time: sla.Approver_level3_time },
//             { user: sla.Approver_level4_user, time: sla.Approver_level4_time },
//             { user: sla.Approver_level5_user, time: sla.Approver_level5_time },
//           ].filter(a => a.user?.trim());
//           setCurrentApprovers(list);
//         }
//       } catch (err) {
//         console.error("SLA Error:", err);
//       } finally {
//         setSlaLoading(false);
//       }
//     };
//     fetchApprovers();
//   }, [ticket?.entity_id, ticket?.category_id, ticket?.subcategory_id]);

//   // Key Logic
//   const hasUserAlreadyActed = approvalLogs.some(log => {
//     const actorId = log.created_by || log.created_by_id || log.user_id || log.assigned_by;
//     const action = (log.approval_status || log.status || '').trim();
//     return (
//       String(actorId) === String(currentUserId) &&
//       ['Approved', 'Rejected', 'On Hold', 'On-Hold', 'onhold', 'Reassign', 'Un Hold'].some(
//         status => action.includes(status)
//       )
//     );
//   });

//   const isOnHold = approvalLogs.some(log =>
//     ['On Hold', 'On-Hold', 'onhold', 'OnHold', 'on_hold'].includes(
//       String(log.approval_status || log.status || '').trim()
//     )
//   );

//   const currentPendingLog = approvalLogs.filter(log => log.is_current_level).slice(-1)[0];
//   const currentAssignedUserId = currentPendingLog
//     ? (currentPendingLog.created_by || currentPendingLog.created_by_id || currentPendingLog.assigned_to)
//     : null;
//   const isCurrentUserAssigned = currentAssignedUserId ? String(currentAssignedUserId) === String(currentUserId) : false;

//   const isFinalized = ['Approved', 'Rejected'].includes(approvalStatus);

//   // Actions
//   const handleApprovalAction = async (action) => {
//     if (!isFinalized && hasUserAlreadyActed) {
//       toast.error("You have already taken action on this ticket.");
//       return;
//     }
//     if (!isFinalized && !isCurrentUserAssigned && !isOnHold) {
//       toast.error("It's not your turn to act.");
//       return;
//     }

//     if (!approvalComment.trim() && !["Un Hold"].includes(action)) {
//       setCommentError("Comment is required.");
//       return;
//     }
//     setCommentError("");

//     if (action === "Reassign") {
//       setIsReassignPopupOpen(true);
//       return;
//     }

//     setUpdating(true);
//     const payload = {
//       action: ACTION_MAP[action]?.backend || 'pending',
//       comments: approvalComment || (action === "Un Hold" ? "Ticket resumed" : "No comment provided"),
//     };

//     try {
//       const result = await performTicketAction(ticket.id, payload);
//       if (result?.detail?.includes("applied") || result?.success) {
//         toast.success(`${action} successful!`);
//         setApprovalComment("");
//         await loadTicket();
//       } else {
//         toast.error("Action failed.");
//       }
//     } catch (err) {
//       toast.error("Network error.");
//     } finally {
//       setUpdating(false);
//     }
//   };

//   const handleReassignConfirm = async () => {
//     if (!selectedReassignUser) return toast.error("Please select a user.");
//     setUpdating(true);
//     const payload = {
//       action: "reassign",
//       comments: approvalComment || `Reassigned to ${selectedReassignUser.name || selectedReassignUser.username}`,
//       reassign_to: selectedReassignUser.id,
//     };
//     try {
//       const result = await performTicketAction(ticket.id, payload);
//       if (result?.detail?.includes("applied")) {
//         toast.success("Reassigned successfully!");
//         setApprovalComment("");
//         setSelectedReassignUser(null);
//         setIsReassignPopupOpen(false);
//         await loadTicket();
//       }
//     } catch (err) {
//       toast.error("Reassign failed.");
//     } finally {
//       setUpdating(false);
//     }
//   };

//   const handleCancel = () => {
//     localStorage.removeItem('selectedTicketId');
//     navigate('/tickethistory');
//   };

//   const handleSendFollowUp = async () => {
//     if (!followUpText.trim()) return toast.error("Type a message first.");
//     try {
//       const result = await performTicketAction(ticket.id, { action: 'followup', comments: followUpText });
//       if (result?.detail?.includes("applied")) {
//         toast.success("Follow-up sent!");
//         setFollowUpText("");
//         await loadTicket();
//       }
//     } catch (err) {
//       toast.error("Failed to send.");
//     }
//   };

//   if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>;
//   if (error || !ticket) return <Box sx={{ p: 3 }}><Typography color="error">{error || "Ticket not found"}</Typography></Box>;

//   const priorityColors = {
//     "Critical": "#D32F2F", "Very High": "#E53935", "High": "#FB8C00",
//     "Medium": "#FDD835", "Low": "#43A047", "Very Low": "#1E88E5"
//   };

//   return (
//     <Box sx={{ p: 3, background: "#f5f6fa" }}>
//       <Card sx={{ borderRadius: 3 }}>
//         <CardContent sx={{ p: 3 }}>
//           {/* Header */}
//           <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
//             <Typography variant="h3" fontWeight={600}>Ticket #{ticket.id}</Typography>
//             <Chip label={ticket.priority} sx={{
//               fontWeight: 800, fontSize: "1rem", py: 2.5, px: 3,
//               background: priorityColors[ticket.priority] || "#666", color: "white",
//             }} />
//           </Box>
//           <Divider sx={{ my: 2 }} />

//           {/* Title & Description */}
//           <Box sx={{ my: 2 }}>
//             <Typography variant="overline" sx={{ color: "#667eea", fontWeight: 700, letterSpacing: 2 }}>Title</Typography>
//             <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: "#1a1a1a" }}>{ticket.title}</Typography>
//             <Typography variant="overline" sx={{ color: "#667eea", fontWeight: 700, letterSpacing: 2, mt: 3 }}>Description</Typography>
//             <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.8 }}>{ticket.description}</Typography>
//           </Box>

//           {/* Attachments */}
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

//           {/* Details Grid */}
//           <Grid container spacing={3} sx={{ my: 2 }}>
//             {["Type", "Department", "Location", "Priority", "Category", "Subcategory"].map(field => (
//               <Grid size={{ xs: 12, sm: 6, md: 4 }} key={field}>
//                 <Typography variant="caption" sx={{ textTransform: "uppercase", fontWeight: 600, color: "text.secondary" }}>{field}</Typography>
//                 <Typography variant="body1" fontWeight={500}>{ticket[field.toLowerCase()] || "-"}</Typography>
//               </Grid>
//             ))}
//             <Grid size={{ xs: 12, sm: 6, md: 4 }}>
//               <Typography variant="caption" sx={{ textTransform: "uppercase", fontWeight: 600, color: "text.secondary" }}>Approvers (SLA)</Typography>
//               <Box sx={{ mt: 1, display: "flex", gap: 1, flexWrap: "wrap", alignItems: "center" }}>
//                 {slaLoading ? "Loading..." : currentApprovers.length > 0 ? currentApprovers.map((a, i) => <Chip key={i} label={a.user} size="small" />) : "None"}
//                 {ticket.type === "Request" && <IconButton size="small" onClick={() => setIsApproverPopupOpen(true)}><InfoOutlinedIcon fontSize="small" /></IconButton>}
//               </Box>
//             </Grid>
//           </Grid>

//           {/* APPROVAL ACTION SECTION - FINAL PERFECT LOGIC */}
//           {ticket.type === "Request" && (
//             <Box sx={{ mt: 4, p: 4, border: "2px dashed #ccc", borderRadius: 3, backgroundColor: "#fafafa" }}>
//               <Typography variant="h5" fontWeight={700} gutterBottom
//                 color={isFinalized ? "success.main" : isOnHold ? "warning.main" : "primary"}>
//                 {isFinalized ? (approvalStatus === "Approved" ? "Ticket Fully Approved" : "Ticket Rejected")
//                   : isOnHold ? "Ticket is On Hold" : "Your Approval Required"}
//               </Typography>

//               {/* Comment Box */}
//               <TextField
//                 fullWidth multiline rows={4}
//                 placeholder={isFinalized || hasUserAlreadyActed ? "Action already taken" : "Enter your comments (required for Approve/Reject)"}
//                 value={approvalComment}
//                 onChange={(e) => setApprovalComment(e.target.value)}
//                 disabled={isFinalized || hasUserAlreadyActed}
//                 error={!!commentError}
//                 helperText={commentError}
//                 sx={{ mb: 3 }}
//               />

//               {/* FINAL ACTION BUTTONS & MESSAGES */}
//               <Stack direction="row" spacing={2} justifyContent="flex-end" flexWrap="wrap" sx={{ mt: 2 }}>

//                 {/* 1. Finalized */}
//                 {isFinalized && (
//                   <Typography variant="h6" color={approvalStatus === "Approved" ? "success.main" : "error.main"} fontWeight={700}>
//                     {approvalStatus === "Approved" ? "Fully Approved" : "Rejected"}
//                   </Typography>
//                 )}

//                 {/* 2. On Hold + Never Acted → Resume */}
//                 {isOnHold && !isFinalized && !hasUserAlreadyActed && (
//                   <Button variant="contained" size="large" startIcon={<AutorenewIcon />}
//                     onClick={() => handleApprovalAction("Un Hold")} disabled={updating}
//                     sx={{ bgcolor: "#4caf50", minWidth: 280, py: 1.8, fontSize: "1.1rem", "&:hover": { bgcolor: "#388e3c" } }}>
//                     {updating ? "Resuming..." : "Resume Approval"}
//                   </Button>
//                 )}

//                 {/* 3. On Hold + User Acted (they put it on hold) */}
//                 {isOnHold && !isFinalized && hasUserAlreadyActed && (
//                   <Typography variant="h6" color="warning.main" fontWeight={700} sx={{ width: "100%", textAlign: "right" }}>
//                     You have put this ticket On Hold
//                   </Typography>
//                 )}

//                 {/* 4. Normal: User's Turn + Never Acted */}
//                 {!isFinalized && !isOnHold && !hasUserAlreadyActed && isCurrentUserAssigned && (
//                   <>
//                     <Button variant="contained" startIcon={<CheckCircleIcon />} onClick={() => handleApprovalAction("Approve")} disabled={updating} sx={{ bgcolor: "#4caf50", "&:hover": { bgcolor: "#388e3c" } }}>Approve</Button>
//                     <Button variant="contained" startIcon={<CancelIcon />} onClick={() => handleApprovalAction("Reject")} disabled={updating} sx={{ bgcolor: "#f44336", "&:hover": { bgcolor: "#d32f2f" } }}>Reject</Button>
//                     <Button variant="contained" startIcon={<AutorenewIcon />} onClick={() => handleApprovalAction("Reassign")} disabled={updating} sx={{ bgcolor: "#2196f3", "&:hover": { bgcolor: "#1976d2" } }}>Reassign</Button>
//                     <Button variant="contained" startIcon={<AccessTimeIcon />} onClick={() => handleApprovalAction("On Hold")} disabled={updating} sx={{ bgcolor: "#ff9800", "&:hover": { bgcolor: "#f57c00" } }}>Put On Hold</Button>
//                   </>
//                 )}

//                 {/* 5. Waiting for Next Approver (Same for everyone who already acted or not their turn) */}
//                 {!isFinalized && !isOnHold && (
//                   <Typography color="text.secondary" fontWeight={600} sx={{ fontStyle: "italic", width: "100%", textAlign: "right", fontSize: "1.1rem" }}>
//                     Waiting for next approver to take action...
//                   </Typography>
//                 )}

//               </Stack>
//             </Box>
//           )}

//           {/* Follow-up */}
//           {(isOnHold || approvalStatus === "Rejected") && (
//             <Box sx={{ mt: 4 }}>
//               <Typography variant="h6" fontWeight={600}>Follow-Up Message</Typography>
//               <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
//                 <TextField fullWidth multiline rows={2} placeholder="Type your message..." value={followUpText} onChange={(e) => setFollowUpText(e.target.value)} />
//                 <Button variant="contained" onClick={handleSendFollowUp} disabled={!followUpText.trim() || updating}>Send</Button>
//               </Box>
//             </Box>
//           )}

//           <Box sx={{ mt: 4, textAlign: "right" }}>
//             <Button variant="contained" onClick={handleCancel} sx={{ bgcolor: "#555" }}>Back to Tickets</Button>
//           </Box>
//         </CardContent>
//       </Card>

//       {/* Dialogs */}
//       <Dialog open={isReassignPopupOpen} onClose={() => setIsReassignPopupOpen(false)} fullWidth maxWidth="sm">
//         <DialogTitle>Reassign Ticket</DialogTitle>
//         <DialogContent>
//           <Autocomplete options={allApprovers} getOptionLabel={opt => opt.name || opt.username || ""} value={selectedReassignUser} onChange={(_, v) => setSelectedReassignUser(v)} renderInput={params => <TextField {...params} label="Select User" />} />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => { setIsReassignPopupOpen(false); setSelectedReassignUser(null); }}>Cancel</Button>
//           <Button onClick={handleReassignConfirm} variant="contained" disabled={!selectedReassignUser || updating}>Reassign</Button>
//         </DialogActions>
//       </Dialog>

//       <Dialog open={isApproverPopupOpen} onClose={() => setIsApproverPopupOpen(false)}>
//         <DialogTitle>Approval Hierarchy</DialogTitle>
//         <DialogContent>
//           {currentApprovers.length > 0 ? currentApprovers.map((a, i) => (
//             <Typography key={i}>Level {i + 1}: {a.user} {a.time ? `(${a.time})` : ""}</Typography>
//           )) : <Typography>No approvers defined</Typography>}
//         </DialogContent>
//         <DialogActions><Button onClick={() => setIsApproverPopupOpen(false)}>Close</Button></DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default ApprovalPage;