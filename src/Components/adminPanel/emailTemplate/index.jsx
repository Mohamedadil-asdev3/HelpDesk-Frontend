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

import { useState } from "react";
import { Box, Grid, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, IconButton, Typography, Select, MenuItem, } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CommonTable from "../../commonTabel";

const EmailTemplate = () => {

    const [openForm, setOpenForm] = useState(false);
    const [openInactive, setOpenInactive] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);

    const handleAdd = () => {
        setSelectedRow(null);
        setOpenForm(true);
    };

    const handleEdit = (row) => {
        setSelectedRow(row);
        setOpenForm(true);
    };

    const handleCloseForm = () => setOpenForm(false);

    const handleInactive = (row) => {
        setSelectedRow(row);
        setOpenInactive(true);
    };

    const handleCloseInactive = () => setOpenInactive(false);

    const EmailTemplateColumns = [
        { id: "id", label: "S.no" },
        { id: "Event", label: "Event" },
        { id: "Status", label: "Status" },
    ];

    const EmailTemplateRow = [
        { id: 1, Event: "User Registration", Status: "Active" },
        { id: 2, Event: "Password Reset", Status: "Active" },
        { id: 3, Event: "Ticket Created", Status: "Inactive" },
        { id: 4, Event: "Ticket Updated", Status: "Active" },
        { id: 5, Event: "Ticket Closed", Status: "Inactive" },
    ];

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
                                defaultValue={selectedRow?.Event || ""}
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
                                defaultValue={selectedRow?.Template || ""}
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
                                defaultValue={selectedRow?.Status || "Active"}
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
                    <Button onClick={handleCloseForm} variant="outlined" color="error" size="small">Cancel</Button>
                    {selectedRow ? (
                        <Button variant="contained" color="success" size="small">
                            Save Changes
                        </Button>
                    ) : (
                        <Button variant="contained" color="success" size="small">
                            Add Template
                        </Button>
                    )}
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
                        Are you sure you want to mark "<b>{selectedRow?.Event}</b>" as{" "}
                        {selectedRow?.Status === "Active" ? "Inactive?" : "Active?"}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseInactive}>Cancel</Button>
                    <Button variant="contained" color="error">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default EmailTemplate;