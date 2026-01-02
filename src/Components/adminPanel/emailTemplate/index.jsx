// import { Box, Grid } from "@mui/material";
// import CommonTable from "../../commonTabel";

// const EmailTemplate = () => {

//     const EmailTemplateColumns = [
//         { id: "id", label: "S.no" },
//         { id: "Event", label: "Event" },
//         { id: "Status", label: "Status" },
//     ];

//     const EmailTemplateRow = [
//         {
//             id: 1,
//             Event: "User Registration",
//             Status: "Active"
//         },
//         {
//             id: 2,
//             Event: "Password Reset",
//             Status: "Active"
//         },
//         {
//             id: 3,
//             Event: "Ticket Created",
//             Status: "Inactive"
//         },
//         {
//             id: 4,
//             Event: "Ticket Updated",
//             Status: "Active"
//         },
//         {
//             id: 5,
//             Event: "Ticket Closed",
//             Status: "Inactive"
//         }
//     ];


//     return (
//         <>
//             <Box sx={{ my: 2 }}>
//                 <Grid container spacing={2}>
//                     <Grid size={12}>
//                         <CommonTable
//                             title={"Email Management"}
//                             btnName={"Add Template"}
//                             rows={EmailTemplateRow}
//                             columns={EmailTemplateColumns}
//                             onView={(row) => console.log("view", row)}
//                             onEdit={(row) => console.log("Edit", row)}
//                         />
//                     </Grid>
//                 </Grid>
//             </Box>
//         </>
//     )
// };

// export default EmailTemplate;
import { useState, useEffect } from "react";
import { Box, Grid, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, IconButton, Typography, Select, MenuItem, CircularProgress } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";
import CommonTable from "../../commonTabel";
import { fetchEmailTemplatesAPI, saveEmailTemplateAPI } from "../../../Api";

const EmailTemplate = () => {
    const [openForm, setOpenForm] = useState(false);
    const [openInactive, setOpenInactive] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [emailTemplates, setEmailTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Form states
    const [formEvent, setFormEvent] = useState("");
    const [formTemplate, setFormTemplate] = useState("");
    const [formStatus, setFormStatus] = useState("Active");

    const handleAdd = () => {
        setSelectedRow(null);
        setFormEvent("");
        setFormTemplate("");
        setFormStatus("Active");
        setOpenForm(true);
    };

    const handleEdit = (row) => {
        setSelectedRow(row);
        setFormEvent(row.email_event || "");
        setFormTemplate(row.email_template || "");
        setFormStatus(row.is_active === "Y" ? "Active" : "Inactive");
        setOpenForm(true);
    };

    const handleCloseForm = () => {
        setOpenForm(false);
        setFormEvent("");
        setFormTemplate("");
        setFormStatus("Active");
        setSelectedRow(null);
    };

    const handleSave = async () => {
        if (!formEvent.trim() || !formTemplate.trim()) {
            toast.error("Event and Template are required");
            return;
        }

        setSaving(true);
        try {
            const payload = {
                email_event: formEvent.trim(),
                email_template: formTemplate.trim(),
                is_active: formStatus === "Active" ? "Y" : "N",
            };

            if (selectedRow) {
                payload.id = selectedRow.id;
            }

            const response = await saveEmailTemplateAPI(payload);
            if (response.success) {
                toast.success(selectedRow ? "Template updated successfully" : "Template added successfully");
                fetchTemplates(); // Refresh list
                handleCloseForm();
            } else {
                toast.error(response.error || "Failed to save template");
            }
        } catch (error) {
            console.error("Save error:", error);
            toast.error("Failed to save template");
        } finally {
            setSaving(false);
        }
    };

    const handleInactive = (row) => {
        setSelectedRow(row);
        setOpenInactive(true);
    };

    const handleCloseInactive = () => setOpenInactive(false);

    const handleConfirmStatusChange = async () => {
        if (!selectedRow) return;

        setSaving(true);
        try {
            const newStatus = selectedRow.is_active === "Y" ? "N" : "Y";
            const payload = {
                id: selectedRow.id,
                is_active: newStatus,
            };

            const response = await saveEmailTemplateAPI(payload);
            if (response.success) {
                toast.success(`Template status changed to ${newStatus === "Y" ? "Active" : "Inactive"}`);
                fetchTemplates(); // Refresh list
                handleCloseInactive();
            } else {
                toast.error(response.error || "Failed to update status");
            }
        } catch (error) {
            console.error("Status change error:", error);
            toast.error("Failed to update status");
        } finally {
            setSaving(false);
        }
    };

    const fetchTemplates = async () => {
        try {
            setLoading(true);
            const response = await fetchEmailTemplatesAPI();
            if (Array.isArray(response)) {
                setEmailTemplates(response);
            } else {
                toast.error("Invalid response format from API");
                setEmailTemplates([]);
            }
        } catch (error) {
            console.error("Fetch error:", error);
            toast.error("Failed to fetch templates");
            setEmailTemplates([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTemplates();
    }, []);

    const EmailTemplateColumns = [
        { id: "id", label: "S.no" },
        { id: "Event", label: "Event" },
        { id: "Status", label: "Status" },
    ];

    const EmailTemplateRow = emailTemplates.map((template, index) => ({
        id: index + 1,
        Event: template.email_event,
        Status: template.is_active === "Y" ? "Active" : "Inactive",
        ...template, // Spread original for editing
    }));

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 400 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <>
            <Box sx={{ my: 2 }}>
                <Grid container spacing={2}>
                    <Grid size={12}>
                        <CommonTable
                            title="Email Management"
                            btnName="Add Template"
                            addButton={handleAdd}
                            rows={EmailTemplateRow}
                            columns={EmailTemplateColumns}
                            onView={(row) => console.log("view", row)}
                            onEdit={handleEdit}
                            onDelete={handleInactive}
                        />
                    </Grid>
                </Grid>
            </Box>

            <Dialog open={openForm} onClose={handleCloseForm} fullWidth maxWidth="sm">
                <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
                    {selectedRow ? "Edit Email Template" : "Add Email Template"}
                    <IconButton onClick={handleCloseForm}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <Grid container spacing={2}>
                        <Grid size={12}>
                            <TextField
                                label="Email Event"
                                fullWidth
                                value={formEvent}
                                onChange={(e) => setFormEvent(e.target.value)}
                                required
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: 3,
                                    }
                                }}
                            />
                        </Grid>
                        <Grid size={12}>
                            <TextField
                                label="Template"
                                fullWidth
                                multiline
                                rows={4}
                                value={formTemplate}
                                onChange={(e) => setFormTemplate(e.target.value)}
                                required
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: 3,
                                    }
                                }}
                            />
                        </Grid>
                        <Grid size={12}>
                            <Select
                                fullWidth
                                value={formStatus}
                                onChange={(e) => setFormStatus(e.target.value)}
                                sx={{
                                    "& .MuiOutlinedInput-notchedOutline": {
                                        borderRadius: "13px",
                                    }
                                }}
                            >
                                <MenuItem value="Active">Active</MenuItem>
                                <MenuItem value="Inactive">Inactive</MenuItem>
                            </Select>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseForm} variant="outlined" color="error" size="small" disabled={saving}>
                        Cancel
                    </Button>
                    <Button 
                        variant="contained" 
                        color="success" 
                        size="small"
                        onClick={handleSave}
                        disabled={saving}
                    >
                        {saving ? <CircularProgress size={20} /> : (selectedRow ? "Save Changes" : "Add Template")}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={openInactive}
                onClose={handleCloseInactive}
                fullWidth
                maxWidth="xs"
            >
                <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
                    Change Status
                    <IconButton onClick={handleCloseInactive}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <Typography>
                        Are you sure you want to mark "<b>{selectedRow?.email_event}</b>" as{" "}
                        {selectedRow?.is_active === "Y" ? "Inactive?" : "Active?"}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseInactive} disabled={saving}>Cancel</Button>
                    <Button 
                        variant="contained" 
                        color="error"
                        onClick={handleConfirmStatusChange}
                        disabled={saving}
                    >
                        {saving ? <CircularProgress size={20} /> : "Confirm"}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default EmailTemplate;
// import { useState } from "react";
// import { Box, Grid, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, IconButton, Typography, Select, MenuItem, } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
// import CommonTable from "../../commonTabel";

// const EmailTemplate = () => {

//     const [openForm, setOpenForm] = useState(false);
//     const [openInactive, setOpenInactive] = useState(false);
//     const [selectedRow, setSelectedRow] = useState(null);

//     const handleAdd = () => {
//         setSelectedRow(null);
//         setOpenForm(true);
//     };

//     const handleEdit = (row) => {
//         setSelectedRow(row);
//         setOpenForm(true);
//     };

//     const handleCloseForm = () => setOpenForm(false);

//     const handleInactive = (row) => {
//         setSelectedRow(row);
//         setOpenInactive(true);
//     };

//     const handleCloseInactive = () => setOpenInactive(false);

//     const EmailTemplateColumns = [
//         { id: "id", label: "S.no" },
//         { id: "Event", label: "Event" },
//         { id: "Status", label: "Status" },
//     ];

//     const EmailTemplateRow = [
//         { id: 1, Event: "User Registration", Status: "Active" },
//         { id: 2, Event: "Password Reset", Status: "Active" },
//         { id: 3, Event: "Ticket Created", Status: "Inactive" },
//         { id: 4, Event: "Ticket Updated", Status: "Active" },
//         { id: 5, Event: "Ticket Closed", Status: "Inactive" },
//     ];

//     return (
//         <>
//             <Box sx={{ my: 2 }}>
//                 <Grid container spacing={2}>
//                     <Grid size={12}>
//                         <CommonTable
//                             title="Email Management"
//                             btnName="Add Template"
//                             addButton={handleAdd}
//                             rows={EmailTemplateRow}
//                             columns={EmailTemplateColumns}
//                             onView={(row) => console.log("view", row)}
//                             onEdit={handleEdit}
//                             onDelete={handleInactive}
//                         />
//                     </Grid>
//                 </Grid>
//             </Box>

//             <Dialog open={openForm} onClose={handleCloseForm} fullWidth maxWidth="sm">
//                 <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
//                     {selectedRow ? "Edit Email Template" : "Add Email Template"}
//                     <IconButton onClick={handleCloseForm}>
//                         <CloseIcon />
//                     </IconButton>
//                 </DialogTitle>
//                 <DialogContent dividers>
//                     <Grid container spacing={2}>
//                         <Grid size={12}>
//                             <TextField
//                                 label="Email Event"
//                                 fullWidth
//                                 defaultValue={selectedRow?.Event || ""}
//                                 sx={{
//                                     "& .MuiOutlinedInput-root": {
//                                         borderRadius: 3,
//                                     }
//                                 }}
//                             />
//                         </Grid>
//                         <Grid size={12}>
//                             <TextField
//                                 label="Template"
//                                 fullWidth
//                                 multiline
//                                 rows={4}
//                                 defaultValue={selectedRow?.Template || ""}
//                                 sx={{
//                                     "& .MuiOutlinedInput-root": {
//                                         borderRadius: 3,
//                                     }
//                                 }}
//                             />
//                         </Grid>
//                         <Grid size={12}>
//                             <Select
//                                 fullWidth
//                                 defaultValue={selectedRow?.Status || "Active"}
//                                 sx={{
//                                     "& .MuiOutlinedInput-notchedOutline": {
//                                         borderRadius: "13px",
//                                     }
//                                 }}
//                             >
//                                 <MenuItem value="Active">Active</MenuItem>
//                                 <MenuItem value="Inactive">Inactive</MenuItem>
//                             </Select>
//                         </Grid>
//                     </Grid>
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={handleCloseForm} variant="outlined" color="error" size="small">Cancel</Button>
//                     {selectedRow ? (
//                         <Button variant="contained" color="success" size="small">
//                             Save Changes
//                         </Button>
//                     ) : (
//                         <Button variant="contained" color="success" size="small">
//                             Add Template
//                         </Button>
//                     )}
//                 </DialogActions>
//             </Dialog>

//             <Dialog
//                 open={openInactive}
//                 onClose={handleCloseInactive}
//                 fullWidth
//                 maxWidth="xs"
//             >
//                 <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
//                     Change Status
//                     <IconButton onClick={handleCloseInactive}>
//                         <CloseIcon />
//                     </IconButton>
//                 </DialogTitle>
//                 <DialogContent dividers>
//                     <Typography>
//                         Are you sure you want to mark "<b>{selectedRow?.Event}</b>" as{" "}
//                         {selectedRow?.Status === "Active" ? "Inactive?" : "Active?"}
//                     </Typography>
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={handleCloseInactive}>Cancel</Button>
//                     <Button variant="contained" color="error">
//                         Confirm
//                     </Button>
//                 </DialogActions>
//             </Dialog>
//         </>
//     );
// };

// export default EmailTemplate;