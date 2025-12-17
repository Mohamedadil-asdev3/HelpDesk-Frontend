import { Box, Grid, Card, CardContent, Typography, TextField, Button, Divider, Chip, Stack, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Autocomplete } from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import EditIcon from "@mui/icons-material/Edit";
import { getTicketDetails, fetchUsersAPI, updateTicket } from '../../Api';
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
  //const isEditable = Boolean(ticket && ticket.status === "New");


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

      const mappedTicket = {
        id: ticketData.ticket_no || '',

        // Store both display name and ID
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

        entity_id: ticketData.category_detail?.entity_id || ticketData.subcategory_detail?.entity_id || null,

        assignedTo: ticketData.assignees_detail && ticketData.assignees_detail.length > 0
          ? ticketData.assignees_detail.map(u => u.name || u.username).join(', ')
          : ticketData.assigned_groups_detail && ticketData.assigned_groups_detail.length > 0
            ? `${ticketData.assigned_groups_detail[0].name} (Group${ticketData.assigned_groups_detail[0].members_count ? ` - ${ticketData.assigned_groups_detail[0].members_count} members` : ''})`
            : 'Unassigned',

        assignedToId: ticketData.assigned_to || null, // if individual assignment exists

        status: ticketData.status_detail?.field_name || "",
        status_id: ticketData.status_detail?.id,
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
  // useEffect(() => {
  //   if (!ticket?.entity_id || !ticket?.category_id || !ticket?.subcategory_id) {
  //     setCurrentApprovers([]);
  //     setSlaLoading(false);
  //     return;
  //   }

  //   const fetchApprovers = async () => {
  //     setSlaLoading(true);
  //     try {
  //       const slaResponse = await fetchTicketSLAByEntityAndCategory(
  //         ticket.entity_id, ticket.category_id, ticket.subcategory_id
  //       );
  //       const sla = Array.isArray(slaResponse) && slaResponse.length > 0 ? slaResponse[0] : slaResponse;

  //       if (sla) {
  //         const list = [
  //           { user: sla.Approver_level1_user, time: sla.Approver_level1_time },
  //           { user: sla.Approver_level2_user, time: sla.Approver_level2_time },
  //           { user: sla.Approver_level3_user, time: sla.Approver_level3_time },
  //           { user: sla.Approver_level4_user, time: sla.Approver_level4_time },
  //           { user: sla.Approver_level5_user, time: sla.Approver_level5_time },
  //         ].filter(a => a.user?.trim());
  //         setCurrentApprovers(list);
  //       }
  //     } catch (err) {
  //       console.error("SLA Error:", err);
  //     } finally {
  //       setSlaLoading(false);
  //     }
  //   };
  //   fetchApprovers();
  // }, [ticket?.entity_id, ticket?.category_id, ticket?.subcategory_id]);

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

      // New files
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
  const CANCELLED_STATUS_ID = 154;

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
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 4 }}>
            <Button variant="contained" color="info" sx={{ borderRadius: 3 }}>Follow up Info</Button>
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4, gap: 2 }}>
              {ticket?.status === "New" && isRequester && !isEditMode && (
                <Button color="error" variant="outlined" sx={{ borderRadius: 3 }} onClick={handleCancelTicket}>Cancel Ticket</Button>
              )}
              {/* {ticket.status === "New" && !isEditMode && (
                <Button color="error" variant="outlined" sx={{ borderRadius: 3 }} onClick={handleCancelTicket}>Cancel Ticket</Button>
              )} */}
              <Button variant="contained" onClick={handleBackTicket} color="info" sx={{ borderRadius: 3 }}>Back to Tickets</Button>
            </Box>
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