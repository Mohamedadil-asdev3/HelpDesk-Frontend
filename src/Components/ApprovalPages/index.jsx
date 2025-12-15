
import {
  Box, Grid, Card, CardContent, Typography, TextField, Button, Divider,
  Chip, Stack, CircularProgress, Dialog, DialogTitle, DialogContent,
  DialogActions, IconButton, Avatar, Autocomplete
} from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AutorenewIcon from '@mui/icons-material/Autorenew';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import HistoryIcon from '@mui/icons-material/History';
import {
  getTicketDetails, performTicketAction,
  fetchTicketSLAByEntityAndCategory, fetchUsersAPI
} from '../../Api';
import { toast } from 'react-toastify';

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
  const [updating, setUpdating] = useState(false);
  const [slaLoading, setSlaLoading] = useState(true);

  // Form & Data
  const [approvalComment, setApprovalComment] = useState('');
  const [commentError, setCommentError] = useState('');
  const [approvalStatus, setApprovalStatus] = useState('');
  const [approvalLogs, setApprovalLogs] = useState([]);
  const [currentApprovers, setCurrentApprovers] = useState([]);
  const [allApprovers, setAllApprovers] = useState([]);
  const [selectedReassignUser, setSelectedReassignUser] = useState(null);
  const [isReassignPopupOpen, setIsReassignPopupOpen] = useState(false);
  const [isApproverPopupOpen, setIsApproverPopupOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  // const [followUpText, setFollowUpText] = useState('');
  

  // Get current logged-in user
  const currentUserId = localStorage.getItem('userId') ||
    localStorage.getItem('id') ||
    localStorage.getItem('user_id');

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

      const mappedTicket = {
        id: ticketData.ticket_no || '',
        type: ticketData.type_detail?.field_name || ticketData.type_detail?.field_values || '',
        department: ticketData.department_detail?.field_name || ticketData.department_detail?.field_values || '',
        location: ticketData.location_detail?.field_name || '',
        category: ticketData.category_detail?.category_name?.trim() || '',
        subcategory: ticketData.subcategory_detail?.subcategory_name || '',
        priority: ticketData.priority_detail?.field_name || ticketData.priority_detail?.field_values || '',
        title: ticketData.title || '',
        description: ticketData.description || '',
        files: ticketData.documents || [],
        entity_id: ticketData.category_detail?.entity_id || ticketData.subcategory_detail?.entity_id || null,
        category_id: ticketData.category_detail?.id,
        subcategory_id: ticketData.subcategory_detail?.id,
        approvalStatus: currentStatus,
      };

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

  // Check if current user already acted
  // const hasUserAlreadyActed = approvalLogs.some(log => {
  //   const actorId = log.created_by || log.created_by_id || log.user_id;
  //   return String(actorId) === String(currentUserId);
  // });

  // const isFinalized = ['Approved', 'Rejected'].includes(approvalStatus);
  // const isOnHold = approvalStatus === 'On Hold';
const currentPendingLog = approvalLogs
  .filter(log => log.is_current_level)
  .slice(-1)[0];

const currentLogStatus = currentPendingLog 
  ? String(currentPendingLog.approval_status || currentPendingLog.status || '').trim()
  : '';

// This detects On Hold EVEN if is_current_level is still true
const isOnHold = approvalLogs.some(log => 
  ['On Hold', 'On-Hold', 'onhold', 'OnHold'].includes(
    String(log.approval_status || log.status || '').trim()
  )
);

  const currentAssignedUserId = currentPendingLog
    ? (currentPendingLog.created_by || currentPendingLog.created_by_id)
    : null;

  const isCurrentUserAssigned = String(currentAssignedUserId) === String(currentUserId);

  const isFinalized = ['Approved', 'Rejected'].includes(approvalStatus);
  // const isOnHold = approvalStatus === 'On Hold';

  // User can act if:
  // - They are the currently assigned approver (even if others acted before)
  // - OR the ticket is On Hold (only then allow Un Hold, even if not assigned)
  const canUserAct = !isFinalized && (isCurrentUserAssigned || isOnHold);
  // Can current user take action?
  // const canTakeAction = ticket?.type === "Request" &&
  //   !isFinalized &&
  //   (isOnHold || !hasUserAlreadyActed);
  const canTakeAction = ticket?.type === "Request" && !isFinalized && (isCurrentUserAssigned || isOnHold);

  // Approval level
  const approvalLevel = approvalLogs.filter(log => {
    const status = (log.approval_status || log.status || '').toLowerCase();
    return status && !['pending', 'follow-up'].includes(status);
  }).length + 1;

  // Handle Actions
  const handleApprovalAction = async (action) => {
    if (!canTakeAction && action !== "Un Hold") {
      toast.error("You have already taken action on this ticket.");
      return;
    }

    if (!approvalComment.trim() && !["Un Hold", "On Hold"].includes(action)) {
      setCommentError("Comment is required.");
      return;
    }
    setCommentError("");

    if (action === "Reassign") {
      setIsReassignPopupOpen(true);
      return;
    }

    setUpdating(true);
    const payload = {
      action: ACTION_MAP[action]?.backend || 'pending',
      comments: approvalComment || (action === "Un Hold" ? "Ticket resumed" : "No comment provided"),
    };

    try {
      const result = await performTicketAction(ticket.id, payload);
      if (result?.detail?.includes("applied") || result?.success) {
        toast.success(`${action} successful!`);
        setApprovalComment("");
        await loadTicket();
      } else {
        toast.error("Action failed. Please try again.");
      }
    } catch (err) {
      toast.error("Network error. Try again.");
    } finally {
      setUpdating(false);
    }
  };

  const handleReassignConfirm = async () => {
    if (!selectedReassignUser) {
      toast.error("Please select a user.");
      return;
    }

    setUpdating(true);
    const payload = {
      action: "reassign",
      comments: approvalComment || `Reassigned to ${selectedReassignUser.name || selectedReassignUser.username}`,
      reassign_to: selectedReassignUser.id,
    };

    try {
      const result = await performTicketAction(ticket.id, payload);
      if (result?.detail?.includes("applied")) {
        toast.success("Reassigned successfully!");
        setApprovalComment("");
        setSelectedReassignUser(null);
        setIsReassignPopupOpen(false);
        await loadTicket();
      }
    } catch (err) {
      toast.error("Reassign failed.");
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = () => {
    localStorage.removeItem('selectedTicketId');
    navigate('/tickethistory');
  };

  // const handleSendFollowUp = async () => {
  //   if (!followUpText.trim()) return toast.error("Type a message first.");
  //   try {
  //     const result = await performTicketAction(ticket.id, { action: 'followup', comments: followUpText });
  //     if (result?.detail?.includes("applied")) {
  //       toast.success("Follow-up sent!");
  //       setFollowUpText("");
  //       await loadTicket();
  //     }
  //   } catch (err) {
  //     toast.error("Failed to send.");
  //   }
  // };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>;
  if (error || !ticket) return <Box sx={{ p: 3 }}><Typography color="error">{error || "Ticket not found"}</Typography></Box>;

  const priorityColors = {
    "Critical": "#D32F2F", "Very High": "#E53935", "High": "#FB8C00",
    "Medium": "#FDD835", "Low": "#43A047", "Very Low": "#1E88E5"
  };

  return (
    <Box sx={{ p: 3, background: "#f5f6fa" }}>
      <Card sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: 3 }}>
          {/* Header */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="h3" fontWeight={600}>Ticket #{ticket.id}</Typography>
            <Chip label={ticket.priority} sx={{
              fontWeight: 800, fontSize: "1rem", py: 2.5, px: 3,
              background: priorityColors[ticket.priority] || "#666", color: "white",
            }} />
          </Box>
          <Divider sx={{ my: 2 }} />

{/* <Box>
  
</Box>
          <Typography variant="h5" fontWeight={700} gutterBottom>Title:{ticket.title}</Typography>
          <Typography variant="body1" color="text.secondary" paragraph>Description:{ticket.description}</Typography> */}
          <Box sx={{ my: 2 }}>
            <Typography variant="overline" sx={{ color: "#667eea", fontWeight: 700, letterSpacing: 2, mb: 2, }}>
              Title
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: "#1a1a1a" }}>
              {ticket.title}
            </Typography>
 
            <Typography variant="overline" sx={{ color: "#667eea", fontWeight: 700, letterSpacing: 2, mt: 1, mb: 2 }}>
              Description
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.8 }}>
              {ticket.description}
            </Typography>
          </Box>

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

          {/* Details */}
          <Grid container spacing={3} sx={{ my: 2 }}>
            {["Type", "Department", "Location", "Priority", "Category", "Subcategory"].map(field => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={field}>
                <Typography variant="caption" sx={{ textTransform: "uppercase", fontWeight: 600, color: "text.secondary" }}>
                  {field}
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {ticket[field.toLowerCase()] || "-"}
                </Typography>
              </Grid>
            ))}
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Typography variant="caption" sx={{ textTransform: "uppercase", fontWeight: 600, color: "text.secondary" }}>
                Approvers (SLA)
              </Typography>
              <Box sx={{ mt: 1, display: "flex", gap: 1, flexWrap: "wrap", alignItems: "center" }}>
                {slaLoading ? "Loading..." : currentApprovers.length > 0 ? (
                  currentApprovers.map((a, i) => <Chip key={i} label={a.user} size="small" />)
                ) : "None"}
                {ticket.type === "Request" && (
                  <IconButton size="small" onClick={() => setIsApproverPopupOpen(true)}>
                    <InfoOutlinedIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
            </Grid>
          </Grid>

          {/* Approval Section - MAIN FIX HERE */}
          {ticket.type === "Request" && (
            <Box sx={{ mt: 4, p: 4, border: "2px dashed #ccc", borderRadius: 3, backgroundColor: "#fafafa" }}>
    
    {/* Header Message */}
    <Typography variant="h5" fontWeight={700} gutterBottom
      color={isFinalized ? "success.main" : isOnHold ? "warning.main" : "primary"}>
      {isFinalized
        ? (approvalStatus === "Approved" ? "Ticket Fully Approved" : "Ticket Rejected")
        : isOnHold
          ? "Ticket is On Hold — Resume to Continue Approval"
          : "Your Approval Required"
      }
    </Typography>

    {/* ADD THIS BLOCK HERE — ON HOLD VISUAL INDICATOR */}
    {isOnHold && !isFinalized && (
      <Box sx={{ 
        mb: 3, 
        p: 3, 
        bgcolor: "#fff3e0", 
        borderRadius: 2, 
        border: "1px solid #ffb74d", 
        borderLeft: "5px solid #ff9800",
        display: "flex",
        alignItems: "center",
        gap: 2
      }}>
        <AccessTimeIcon sx={{ color: "#ff9800", fontSize: 32 }} />
        <Box>
          <Typography variant="h6" color="#e65100" fontWeight={600}>
            This ticket is currently On Hold
          </Typography>
          <Typography variant="body2" color="text.secondary">
            The approval process is paused. Click "Resume Approval" to continue.
          </Typography>
        </Box>
      </Box>
    )}
    {/* END OF NEW BLOCK */}

    {/* Comment Box in this it shows the comment box for the approve reject reassign onhold and also for resume*/}
    {/* <TextField
      fullWidth
      multiline
      rows={4}
      placeholder={
        isFinalized
          ? "This ticket is closed."
          : isOnHold
            ? "Optional: Add comment before resuming approval..."
            : "Enter your comments (required for Approve/Reject)"
      }
      value={approvalComment}
      onChange={(e) => setApprovalComment(e.target.value)}
      disabled={isFinalized || (!isOnHold && !isCurrentUserAssigned)}
      error={!!commentError}
      helperText={commentError}
      sx={{ mb: 3 }}
    /> */}
{/* COMMENT BOX — ONLY WHEN TICKET IS ACTIVE (NOT ON HOLD) */}
{!isFinalized && !isOnHold && isCurrentUserAssigned && (
  <TextField
    fullWidth
    multiline
    rows={4}
    placeholder="Enter your comments (required for Approve/Reject/Reassign)"
    value={approvalComment}
    onChange={(e) => setApprovalComment(e.target.value)}
    disabled={updating}
    error={!!commentError}
    helperText={commentError || "Comment is required"}
    sx={{ mb: 3 }}
  />
)}
              {/* Action Buttons - SMART CONDITIONAL RENDERING */}
              {/* Action Buttons */}
<Stack direction="row" spacing={2} justifyContent="flex-end" flexWrap="wrap" sx={{ mt: 2 }}>

  {/* FINALIZED STATE */}
  {isFinalized && (
    <Typography variant="h6" color={approvalStatus === "Approved" ? "success.main" : "error.main"} fontWeight={700}>
      {approvalStatus === "Approved" ? "Approved Successfully" : "Rejected"}
    </Typography>
  )}

  {/* ON HOLD STATE → ONLY Resume button */}
  {isOnHold && !isFinalized && (
    <Button
      variant="contained"
      size="large"
      startIcon={<AutorenewIcon />}
      onClick={() => handleApprovalAction("Un Hold")}
      disabled={updating}
      sx={{ bgcolor: "#4caf50", minWidth: 240, fontSize: "1.1rem", py: 1.5, "&:hover": { bgcolor: "#388e3c" } }}
    >
      {updating ? "Resuming..." : "Resume Approval"}
    </Button>
  )}

  {/* NORMAL PENDING STATE → Full buttons (ONLY when NOT On Hold and NOT Finalized) */}
  {!isFinalized && !isOnHold && isCurrentUserAssigned && (
    <>
      <Button variant="contained" startIcon={<CheckCircleIcon />} onClick={() => handleApprovalAction("Approve")} disabled={updating} sx={{ bgcolor: "#4caf50", "&:hover": { bgcolor: "#388e3c" } }}>
        Approve
      </Button>
      <Button variant="contained" startIcon={<CancelIcon />} onClick={() => handleApprovalAction("Reject")} disabled={updating} sx={{ bgcolor: "#f44336", "&:hover": { bgcolor: "#d32f2f" } }}>
        Reject
      </Button>
      <Button variant="contained" startIcon={<AutorenewIcon />} onClick={() => handleApprovalAction("Reassign")} disabled={updating} sx={{ bgcolor: "#2196f3", "&:hover": { bgcolor: "#1976d2" } }}>
        Reassign
      </Button>
      <Button variant="contained" startIcon={<AccessTimeIcon />} onClick={() => handleApprovalAction("On Hold")} disabled={updating} sx={{ bgcolor: "#ff9800", "&:hover": { bgcolor: "#f57c00" } }}>
        On Hold
      </Button>
    </>
  )}

  {/* NOT YOUR TURN */}
  {!isFinalized && !isOnHold && !isCurrentUserAssigned && (
    <Typography color="text.secondary" fontWeight={600} sx={{ fontStyle: "italic" }}>
      Waiting for <strong>
        {currentPendingLog?.created_by_name || currentPendingLog?.created_by?.name || "next approver"}
      </strong> to take action...
    </Typography>
  )}

</Stack>
            </Box>
          )}

          {/* Follow-up Section */}
          {/* {(isOnHold || approvalStatus === "Rejected") && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" fontWeight={600}>Follow-Up Message</Typography>
              <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  placeholder="Type your message to the requester..."
                  value={followUpText}
                  onChange={(e) => setFollowUpText(e.target.value)}
                />
                <Button
                  variant="contained"
                  onClick={handleSendFollowUp}
                  disabled={!followUpText.trim() || updating}
                  sx={{ alignSelf: "flex-start" }}
                >
                  Send
                </Button>
              </Box>
            </Box>
          )} */}

          <Box sx={{ mt: 4, textAlign: "right" }}>
            <Button variant="contained" onClick={handleCancel} sx={{ bgcolor: "#555" }}>Back to Tickets</Button>
          </Box>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <Dialog open={isReassignPopupOpen} onClose={() => setIsReassignPopupOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Reassign Ticket</DialogTitle>
        <DialogContent>
          <Autocomplete
            options={allApprovers}
            getOptionLabel={opt => opt.name || opt.username || ""}
            value={selectedReassignUser}
            onChange={(_, v) => setSelectedReassignUser(v)}
            renderInput={params => <TextField {...params} label="Select User" />}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setIsReassignPopupOpen(false); setSelectedReassignUser(null); }}>Cancel</Button>
          <Button onClick={handleReassignConfirm} variant="contained" disabled={!selectedReassignUser || updating}>Reassign</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isApproverPopupOpen} onClose={() => setIsApproverPopupOpen(false)}>
        <DialogTitle>Approval Hierarchy</DialogTitle>
        <DialogContent>
          {currentApprovers.map((a, i) => (
            <Typography key={i}>Level {i + 1}: {a.user} {a.time ? `(${a.time})` : ""}</Typography>
          ))}
        </DialogContent>
        <DialogActions><Button onClick={() => setIsApproverPopupOpen(false)}>Close</Button></DialogActions>
      </Dialog>
    </Box>
  );
};

export default ApprovalPage;

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