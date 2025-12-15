

// import { useState, useEffect } from "react";
// import {
//     Box,
//     Grid,
//     Dialog,
//     DialogTitle,
//     DialogContent,
//     DialogActions,
//     TextField,
//     Button,
//     IconButton,
//     Autocomplete,
//     Typography,
//     Switch,
//     FormControlLabel,
//     CircularProgress,
//     Pagination
// } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
// import { toast } from "react-toastify";
// import {
//     fetchRolesAPI,
//     fetchEntitiesAPI,
//     saveRoleAPI,
//     deleteRoleAPI,
// } from "../../../Api";
// import CommonTable from "../../commonTabel";

// const Role = () => {
//     const [roles, setRoles] = useState([]);
//     const [entities, setEntities] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [currentPage, setCurrentPage] = useState(1);
//     const itemsPerPage = 7;

//     const [openAddEdit, setOpenAddEdit] = useState(false);
//     const [openInactive, setOpenInactive] = useState(false);
//     const [viewRole, setViewRole] = useState(null);

//     const [editingId, setEditingId] = useState(null);
//     const [formData, setFormData] = useState({
//         entity: null,
//         field_name: "",
//         is_active: "Y",
//     });

//     const [selectedRow, setSelectedRow] = useState(null);

//     const RoleColumns = [
//         { id: "serialNo", label: "S.no" },
//         { id: "entity", label: "Entity" },
//         { id: "role", label: "Role" },
//         { id: "active", label: "Active" },
//     ];

//     // Load data
//     useEffect(() => {
//         loadData();
//     }, []);

//     const loadData = async () => {
//         try {
//             setLoading(true);
//             const [rolesData, entsData] = await Promise.all([
//                 fetchRolesAPI(),
//                 fetchEntitiesAPI()
//             ]);
//             setRoles(rolesData);
//             setEntities(entsData);
//         } catch (error) {
//             toast.error("Failed to load data");
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Pagination
//     const indexOfLastItem = currentPage * itemsPerPage;
//     const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//     const currentRoles = roles.slice(indexOfFirstItem, indexOfLastItem);
//     const totalPages = Math.ceil(roles.length / itemsPerPage);

//     const tableRows = currentRoles.map((role, index) => {
//         const globalIndex = (currentPage - 1) * itemsPerPage + index + 1;
//         const entityName = entities.find((ent) => ent.id === role.entity_id)?.name || "—";
//         return {
//             id: role.id,
//             serialNo: globalIndex,
//             entity: entityName,
//             role: role.field_name,
//             active: role.is_active === "Y" ? "Yes" : "No",
//             originalRole: role
//         };
//     });

//     const handleAdd = () => {
//         setEditingId(null);
//         setFormData({
//             entity: null,
//             field_name: "",
//             is_active: "Y",
//         });
//         setOpenAddEdit(true);
//     };

//     const handleEdit = (row) => {
//         const roleData = row.originalRole;
//         setEditingId(roleData.id);
//         setFormData({
//             entity: entities.find((ent) => ent.id === roleData.entity_id) || null,
//             field_name: roleData.field_name || "",
//             is_active: roleData.is_active || "Y",
//         });
//         setOpenAddEdit(true);
//     };

//     const handleView = (row) => {
//         setViewRole(row.originalRole);
//     };

//     const handleInactive = (row) => {
//         setSelectedRow(row.originalRole);
//         setOpenInactive(true);
//     };

//     const handleSave = async () => {
//         if (!formData.entity || !formData.field_name) {
//             toast.error("Please fill all required fields");
//             return;
//         }

//         const payload = {
//             entity_id: parseInt(formData.entity.id),
//             field_type: "Role",
//             field_name: formData.field_name,
//             is_active: formData.is_active,
//         };

//         try {
//             await saveRoleAPI(payload, editingId);
//             toast.success(editingId ? "Role updated" : "Role created");
//             setOpenAddEdit(false);
//             setFormData({
//                 entity: null,
//                 field_name: "",
//                 is_active: "Y",
//             });
//             setEditingId(null);
//             loadData();
//         } catch (error) {
//             toast.error(error.message || "Error saving role");
//         }
//     };

//     const confirmInactive = async () => {
//         if (!selectedRow) return;
//         try {
//             await deleteRoleAPI(selectedRow.id);
//             toast.success("Role deactivated");
//             setOpenInactive(false);
//             loadData();
//         } catch (error) {
//             toast.error(error.message || "Failed to deactivate role");
//         }
//     };

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         if (name === "is_active") {
//             setFormData((prev) => ({ ...prev, is_active: value }));
//         } else {
//             setFormData((prev) => ({ ...prev, [name]: value }));
//         }
//     };

//     const handleEntityChange = (e, newValue) => {
//         setFormData((prev) => ({ ...prev, entity: newValue }));
//     };

//     const handleActiveChange = (e, checked) => {
//         setFormData((prev) => ({ ...prev, is_active: checked ? "Y" : "N" }));
//     };

//     if (loading) {
//         return (
//             <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
//                 <CircularProgress />
//             </Box>
//         );
//     }

//     return (
//         <>
//             <Box sx={{ my: 2 }}>
//                 <Grid container spacing={2}>
//                     <Grid size={12}>
//                         <CommonTable
//                             title={"Role Management"}
//                             btnName={"Add Role"}
//                             addButton={handleAdd}
//                             rows={tableRows}
//                             columns={RoleColumns}
//                             onView={handleView}
//                             onEdit={handleEdit}
//                             onDelete={handleInactive}
//                         />
//                     </Grid>
//                 </Grid>
//                 {totalPages > 1 && (
//                     <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
//                         <Pagination
//                             count={totalPages}
//                             page={currentPage}
//                             onChange={(event, value) => setCurrentPage(value)}
//                             color="primary"
//                         />
//                     </Box>
//                 )}
//             </Box>

//             {/* ADD/EDIT DIALOG */}
//             <Dialog open={openAddEdit} onClose={() => setOpenAddEdit(false)} maxWidth="sm" fullWidth>
//                 <DialogTitle sx={{ fontWeight: 600 }}>
//                     {editingId ? "Edit Role" : "Add Role"}
//                     <IconButton
//                         onClick={() => setOpenAddEdit(false)}
//                         sx={{ position: "absolute", right: 10, top: 10 }}
//                     >
//                         <CloseIcon />
//                     </IconButton>
//                 </DialogTitle>
//                 <DialogContent dividers>
//                     <Grid container spacing={2}>
//                         <Grid size={12}>
//                             <Typography sx={{ fontWeight: 500, mb: 0.5 }}>Entity</Typography>
//                             <Autocomplete
//                                 options={entities}
//                                 getOptionLabel={(option) => option.name || option.field_name || ""}
//                                 value={formData.entity}
//                                 onChange={handleEntityChange}
//                                 renderInput={(params) => (
//                                     <TextField
//                                         {...params}
//                                         placeholder="Select Entity"
//                                         required
//                                         sx={{
//                                             "& .MuiOutlinedInput-root": {
//                                                 borderRadius: 3,
//                                             }
//                                         }}
//                                     />
//                                 )}
//                             />
//                         </Grid>
//                         <Grid size={12}>
//                             <Typography sx={{ fontWeight: 500, mb: 0.5 }}>Role</Typography>
//                             <TextField
//                                 fullWidth
//                                 label="Role Name"
//                                 value={formData.field_name}
//                                 onChange={(e) => setFormData({ ...formData, field_name: e.target.value })}
//                                 placeholder="Enter role name"
//                                 required
//                                 sx={{
//                                     "& .MuiOutlinedInput-root": {
//                                         borderRadius: 3,
//                                     }
//                                 }}
//                             />
//                         </Grid>
//                         <Grid size={12}>
//                             <FormControlLabel
//                                 control={
//                                     <Switch
//                                         checked={formData.is_active === "Y"}
//                                         onChange={handleActiveChange}
//                                     />
//                                 }
//                                 label="Active"
//                             />
//                         </Grid>
//                     </Grid>
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={() => setOpenAddEdit(false)} variant="outlined" color="error" size="small">
//                         Cancel
//                     </Button>
//                     <Button variant="contained" onClick={handleSave} color="success" size="small">
//                         {editingId ? "Update" : "Add"}
//                     </Button>
//                 </DialogActions>
//             </Dialog>

//             {/* INACTIVE DIALOG */}
//             <Dialog open={openInactive} onClose={() => setOpenInactive(false)} maxWidth="xs" fullWidth>
//                 <DialogTitle sx={{ fontWeight: 600 }}>
//                     Inactivate Role
//                 </DialogTitle>
//                 <DialogContent dividers>
//                     <Typography>
//                         Are you sure you want to mark the role{" "}
//                         <b>{selectedRow?.field_name}</b> as inactive?
//                     </Typography>
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={() => setOpenInactive(false)} size="small">Cancel</Button>
//                     <Button variant="contained" color="error" size="small" onClick={confirmInactive}>
//                         Inactivate
//                     </Button>
//                 </DialogActions>
//             </Dialog>

//             {/* VIEW DIALOG */}
//             {viewRole && (
//                 <Dialog open={true} onClose={() => setViewRole(null)} maxWidth="sm" fullWidth>
//                     <DialogTitle sx={{ fontWeight: 600 }}>
//                         Role Details
//                         <IconButton
//                             onClick={() => setViewRole(null)}
//                             sx={{ position: "absolute", right: 10, top: 10 }}
//                         >
//                             <CloseIcon />
//                         </IconButton>
//                     </DialogTitle>
//                     <DialogContent dividers>
//                         <Grid container spacing={2}>
//                             <Grid size={12}>
//                                 <Typography><strong>Entity:</strong> {entities.find((ent) => ent.id === viewRole.entity_id)?.name || "—"}</Typography>
//                             </Grid>
//                             <Grid size={12}>
//                                 <Typography><strong>Role:</strong> {viewRole.field_name || "—"}</Typography>
//                             </Grid>
//                             <Grid size={12}>
//                                 <Typography><strong>Active:</strong> {viewRole.is_active === "Y" ? "Yes" : "No"}</Typography>
//                             </Grid>
//                             <Grid size={12}>
//                                 <Typography><strong>Field Type:</strong> {viewRole.field_type || "—"}</Typography>
//                             </Grid>
//                             <Grid size={12}>
//                                 <Typography><strong>Field Value:</strong> {viewRole.field_values || "—"}</Typography>
//                             </Grid>
//                         </Grid>
//                     </DialogContent>
//                     <DialogActions>
//                         <Button onClick={() => setViewRole(null)} variant="contained">
//                             Close
//                         </Button>
//                     </DialogActions>
//                 </Dialog>
//             )}
//         </>
//     );
// };

// export default Role;
import { useState, useEffect } from "react";
import {
    Box,
    Grid,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    IconButton,
    Autocomplete,
    Typography,
    Switch,
    FormControlLabel,
    CircularProgress,
    Pagination,
    Chip
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";
import {
    fetchRolesAPI,
    fetchEntitiesAPI,
    saveRoleAPI,
    deleteRoleAPI,
} from "../../../Api";
import CommonTable from "../../commonTabel";

const Role = () => {
    const [roles, setRoles] = useState([]);
    const [entities, setEntities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 7;

    const [openAddEdit, setOpenAddEdit] = useState(false);
    const [openInactive, setOpenInactive] = useState(false);
    const [viewOpen, setViewOpen] = useState(false); // ✅ Added state for view dialog
    const [viewRole, setViewRole] = useState(null);

    const [editingId, setEditingId] = useState(null);
    const [saving, setSaving] = useState(false); // ✅ Added saving state
    const [formData, setFormData] = useState({
        entity: [], // ✅ Changed to array for multi-select
        field_name: "",
        is_active: "Y",
    });

    const [selectedRow, setSelectedRow] = useState(null);

    const RoleColumns = [
        { id: "serialNo", label: "S.no" },
        { id: "entity", label: "Entity" },
        { id: "role", label: "Role" },
        { id: "active", label: "Active" },
    ];

    // Load data
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [rolesData, entsData] = await Promise.all([
                fetchRolesAPI(),
                fetchEntitiesAPI()
            ]);
            setRoles(rolesData);
            setEntities(entsData);
        } catch (error) {
            toast.error("Failed to load data");
        } finally {
            setLoading(false);
        }
    };

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentRoles = roles.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(roles.length / itemsPerPage);

    const tableRows = currentRoles.map((role, index) => {
        const globalIndex = (currentPage - 1) * itemsPerPage + index + 1;
        // ✅ Handle multiple entities: join names
        const entityNames = role.entity_names || []; // Assuming API returns entity_names as array
        const entityDisplay = entityNames.length > 0 ? entityNames.join(', ') : "—";
        return {
            id: role.id,
            serialNo: globalIndex,
            entity: entityDisplay, // ✅ Updated for multi-entity
            role: role.field_name,
            active: role.is_active === "Y" ? "Yes" : "No",
            originalRole: role
        };
    });

    const handleAdd = () => {
        setEditingId(null);
        setFormData({
            entity: [], // ✅ Empty array
            field_name: "",
            is_active: "Y",
        });
        setOpenAddEdit(true);
    };

    const handleEdit = (row) => {
        const roleData = row.originalRole;
        // ✅ Set multiple entities: filter by role.entity_ids
        const selectedEntities = entities.filter((ent) => roleData.entity_ids?.includes(ent.id)) || [];
        setEditingId(roleData.id);
        setFormData({
            entity: selectedEntities,
            field_name: roleData.field_name || "",
            is_active: roleData.is_active || "Y",
        });
        setOpenAddEdit(true);
    };

    const handleView = (row) => {
        setViewRole(row.originalRole);
        setViewOpen(true); // ✅ Set open state
    };

    const handleInactive = (row) => {
        setSelectedRow(row.originalRole);
        setOpenInactive(true);
    };

    const handleSave = async () => {
        if (!formData.entity.length || !formData.field_name) {
            toast.error("Please fill all required fields");
            return;
        }

        const payload = {
            entity_ids: formData.entity.map(ent => parseInt(ent.id)), // ✅ Changed to entity_ids array
            field_type: "Role",
            field_name: formData.field_name,
            is_active: formData.is_active,
        };

        // ✅ For update, include ID in payload
        if (editingId) {
            payload.id = editingId;
        }

        setSaving(true); // ✅ Start saving
        try {
            await saveRoleAPI(payload, editingId);
            toast.success(editingId ? "Role updated" : "Role created");
            setOpenAddEdit(false);
            setFormData({
                entity: [], // ✅ Reset to empty array
                field_name: "",
                is_active: "Y",
            });
            setEditingId(null);
            loadData();
        } catch (error) {
            toast.error(error.message || "Error saving role");
        } finally {
            setSaving(false); // ✅ Stop saving
        }
    };

    const confirmInactive = async () => {
        if (!selectedRow) return;
        try {
            await deleteRoleAPI(selectedRow.id);
            toast.success("Role deactivated");
            setOpenInactive(false);
            loadData();
        } catch (error) {
            toast.error(error.message || "Failed to deactivate role");
        }
    };

    const handleEntityChange = (e, newValue) => {
        setFormData((prev) => ({ ...prev, entity: newValue })); // ✅ Handles array
    };

    const handleActiveChange = (e, checked) => {
        setFormData((prev) => ({ ...prev, is_active: checked ? "Y" : "N" }));
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
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
                            title={"Role Management"}
                            btnName={"Add Role"}
                            addButton={handleAdd}
                            rows={tableRows}
                            columns={RoleColumns}
                            onView={handleView}
                            onEdit={handleEdit}
                            onDelete={handleInactive}
                        />
                    </Grid>
                </Grid>
                {totalPages > 1 && (
                    <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                        <Pagination
                            count={totalPages}
                            page={currentPage}
                            onChange={(event, value) => setCurrentPage(value)}
                            color="primary"
                        />
                    </Box>
                )}
            </Box>

            {/* ADD/EDIT DIALOG */}
            <Dialog open={openAddEdit} onClose={() => setOpenAddEdit(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 600 }}>
                    {editingId ? "Edit Role" : "Add Role"}
                    <IconButton
                        onClick={() => setOpenAddEdit(false)}
                        sx={{ position: "absolute", right: 10, top: 10 }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <Grid container spacing={2}>
                        <Grid size={12}>
                            <Typography sx={{ fontWeight: 500, mb: 0.5 }}>Entity</Typography>
                            <Autocomplete
                                multiple // ✅ Enable multi-select
                                options={entities}
                                getOptionLabel={(option) => option.name || option.field_name || ""}
                                value={formData.entity}
                                onChange={handleEntityChange}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        placeholder="Select Entities (multiple)"
                                        required
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                borderRadius: 3,
                                            }
                                        }}
                                    />
                                )}
                                renderTags={(value, getTagProps) =>
                                    value.map((option, index) => (
                                        <Chip
                                            variant="outlined"
                                            label={option.name || option.field_name || ""}
                                            size="small"
                                            {...getTagProps({ index })}
                                        />
                                    ))
                                }
                            />
                        </Grid>
                        <Grid size={12}>
                            <Typography sx={{ fontWeight: 500, mb: 0.5 }}>Role</Typography>
                            <TextField
                                fullWidth
                                label="Role Name"
                                value={formData.field_name}
                                onChange={(e) => setFormData({ ...formData, field_name: e.target.value })}
                                placeholder="Enter role name"
                                required
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: 3,
                                    }
                                }}
                            />
                        </Grid>
                        <Grid size={12}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={formData.is_active === "Y"}
                                        onChange={handleActiveChange}
                                    />
                                }
                                label="Active"
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenAddEdit(false)} variant="outlined" color="error" size="small">
                        Cancel
                    </Button>
                    <Button 
                        variant="contained" 
                        onClick={handleSave} 
                        color="success" 
                        size="small"
                        disabled={saving} // ✅ Disable during save
                    >
                        {saving ? <CircularProgress size={20} color="inherit" /> : (editingId ? "Update" : "Add")}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* INACTIVE DIALOG */}
            <Dialog open={openInactive} onClose={() => setOpenInactive(false)} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ fontWeight: 600 }}>
                    Inactivate Role
                </DialogTitle>
                <DialogContent dividers>
                    <Typography>
                        Are you sure you want to mark the role{" "}
                        <b>{selectedRow?.field_name}</b> as inactive?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenInactive(false)} size="small">Cancel</Button>
                    <Button variant="contained" color="error" size="small" onClick={confirmInactive}>
                        Inactivate
                    </Button>
                </DialogActions>
            </Dialog>

            {/* VIEW DIALOG */}
            {viewRole && (
                <Dialog open={viewOpen} onClose={() => { setViewOpen(false); setViewRole(null); }} maxWidth="sm" fullWidth>
                    <DialogTitle sx={{ fontWeight: 600 }}>
                        Role Details
                        <IconButton
                            onClick={() => { setViewOpen(false); setViewRole(null); }}
                            sx={{ position: "absolute", right: 10, top: 10 }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent dividers>
                        <Grid container spacing={2}>
                            <Grid size={12}>
                                <Typography><strong>Entities:</strong></Typography> {/* ✅ Plural */}
                                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 1 }}>
                                    {(viewRole.entity_names || []).map((entityName, idx) => (
                                        <Chip
                                            key={idx}
                                            label={entityName}
                                            size="small"
                                            variant="outlined"
                                            color="primary"
                                        />
                                    ))}
                                    {viewRole.entity_names?.length === 0 && <Typography variant="body2" color="text.secondary">—</Typography>}
                                </Box>
                            </Grid>
                            <Grid size={12}>
                                <Typography><strong>Role:</strong> {viewRole.field_name || "—"}</Typography>
                            </Grid>
                            <Grid size={12}>
                                <Typography><strong>Active:</strong> {viewRole.is_active === "Y" ? "Yes" : "No"}</Typography>
                            </Grid>
                            <Grid size={12}>
                                <Typography><strong>Field Type:</strong> {viewRole.field_type || "—"}</Typography>
                            </Grid>
                            <Grid size={12}>
                                <Typography><strong>Field Value:</strong> {viewRole.field_values || "—"}</Typography>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => { setViewOpen(false); setViewRole(null); }} variant="contained">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </>
    );
};

export default Role;