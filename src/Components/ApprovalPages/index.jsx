import { Box, Grid, Card, CardContent, Typography, TextField, Button, Divider, Chip, Stack, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Autocomplete } from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import EditIcon from "@mui/icons-material/Edit";
import { getTicketDetails, performTicketAction, fetchTicketSLAByEntityAndCategory, fetchUsersAPI, updateTicket } from '../../Api';
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
  const [newFiles, setNewFiles] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
 
  const currentUserStr = localStorage.getItem("user");
  const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;
  const currentUserId = currentUser?.id;

  const isRequester = currentUserId && ticket?.requester_id === currentUserId;
  const isEditable = ticket && ticket.status === "New" && isRequester;
  // const isEditable = Boolean(ticket && ticket.status === "New");
 
  const [openConfirm, setOpenConfirm] = useState(false);
  const [saving, setSaving] = useState(false);
 
  const isImage = (name = "") => /\.(jpg|jpeg|png|gif|webp)$/i.test(name);
  const isPdf = (name = "") => /\.pdf$/i.test(name);
 
  const [updating, setUpdating] = useState(false);
  const [slaLoading, setSlaLoading] = useState(true);
 
  const [approvalStatus, setApprovalStatus] = useState('');
  const [approvalLogs, setApprovalLogs] = useState([]);
  const [currentApprovers, setCurrentApprovers] = useState([]);
  const [allApprovers, setAllApprovers] = useState([]);

  
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
      newFiles.forEach((file) => {
        formData.append("documents", file);
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
 
 
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4, gap: 2 }}>
            {/* {ticket.status === "New" && !isEditMode && (
              <Button color="error" variant="outlined" sx={{ borderRadius: 3 }} onClick={handleCancelTicket}>Cancel Ticket</Button>
            )} */}
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
 
    </Box>
  );
};
 
export default ApprovalPage;
 
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