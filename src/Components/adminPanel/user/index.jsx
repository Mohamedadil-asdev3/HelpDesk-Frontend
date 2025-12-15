import { useState, useEffect } from "react";
import { Autocomplete, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, TextField, Typography, MenuItem, Chip, } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";
import { fetchUsersAPI, fetchEntitiesAPI, fetchDepartmentsAPI, fetchLocationsAPI, fetchSupervisorsAPI, fetchRolesAPI, saveUserAPI, } from "../../../Api";
import CommonTable from "../../commonTabel";

const Users = () => {

    const UserColumns = [
        { id: "sNo", label: "S.No" },
        { id: "userName", label: "Username" },
        { id: "email", label: "Email" },
        { id: "entity", label: "Entity" },
    ];

    const [users, setUsers] = useState([]);
    const [entities, setEntities] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [locations, setLocations] = useState([]);
    const [supervisors, setSupervisors] = useState([]);
    const [roles, setRoles] = useState([]);
    const [selectedEntities, setSelectedEntities] = useState([]);
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [editId, setEditId] = useState(null);
    const [viewOpen, setViewOpen] = useState(false);
    const [viewUser, setViewUser] = useState(null);
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        firstname: "",
        realname: "",
        email: "",
        password: "",
        locations_id: "",
        users_id_supervisor: "",
        department_id: "",
        entities_ids: [],
        roles_ids: [],
        is_hod: "N",
        is_active: "Y",
    });

    const initialForm = {
        name: "",
        firstname: "",
        realname: "",
        email: "",
        password: "",
        locations_id: "",
        users_id_supervisor: "",
        department_id: "",
        entities_ids: [],
        roles_ids: [],
        is_hod: "N",
        is_active: "Y",
    };

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [usersData, entitiesData, locationsData] = await Promise.all([
                fetchUsersAPI(),
                fetchEntitiesAPI(),
                fetchLocationsAPI(),
            ]);
            setUsers(usersData);
            setEntities(entitiesData);
            setLocations(locationsData);

            try {
                const supData = await fetchSupervisorsAPI();
                setSupervisors(supData);
            } catch {
                setSupervisors([]);
            }
        } catch (err) {
            toast.error("Error loading data");
            console.error(err);
        }
    };

    const loadDepartments = async (entityIds) => {
        if (!entityIds || entityIds.length === 0) {
            setDepartments([]);
            return;
        }
        const firstEntityId = Array.isArray(entityIds) ? entityIds[0] : entityIds;
        if (!firstEntityId) {
            setDepartments([]);
            return;
        }
        try {
            const data = await fetchDepartmentsAPI(firstEntityId);
            setDepartments(data);
        } catch (err) {
            console.error(err);
            setDepartments([]);
        }
    };

    const loadRoles = async (entityIds) => {
        if (!entityIds || entityIds.length === 0) {
            setRoles([]);
            return;
        }
        const firstEntityId = Array.isArray(entityIds) ? entityIds[0] : entityIds;
        if (!firstEntityId) {
            setRoles([]);
            return;
        }
        try {
            const data = await fetchRolesAPI(firstEntityId);
            setRoles(data);
        } catch (err) {
            console.error(err);
            setRoles([]);
        }
    };

    useEffect(() => {
        const entityIds = formData.entities_ids;
        if (entityIds && entityIds.length > 0) {
            loadDepartments(entityIds);
            loadRoles(entityIds);
        } else {
            setDepartments([]);
            setRoles([]);
        }
    }, [formData.entities_ids]);

    const currentRows = users.map((user, index) => ({
        id: user.id,
        sNo: index + 1,
        userName: user.name,
        email: user.email,
        entity: user.entities_names ? user.entities_names.join(", ") : (user.entities_ids ? user.entities_ids.join(", ") : "—"),
        original: user,
    }));

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleEntityChange = (e, selectedOptions) => {
        const entityIds = selectedOptions ? selectedOptions.map((opt) => opt.id) : [];
        setSelectedEntities(selectedOptions || []);
        setFormData((prev) => ({
            ...prev,
            entities_ids: entityIds,
        }));
    };

    const handleRoleChange = (e, selectedOptions) => {
        const roleIds = selectedOptions ? selectedOptions.map((opt) => opt.id) : [];
        setSelectedRoles(selectedOptions || []);
        setFormData((prev) => ({
            ...prev,
            roles_ids: roleIds,
        }));
    };

    const handleSubmit = async () => {
        if (
            !formData.name ||
            !formData.firstname ||
            !formData.email ||
            formData.entities_ids.length === 0 ||
            (!editId && !formData.password)
        ) {
            toast.error("Username, Firstname, Email, Entities, and Password (for new users) are required");
            return;
        }

        try {
            await saveUserAPI(formData, editId);
            toast.success(editId ? "User updated successfully" : "User created successfully");
            setFormData(initialForm);
            setSelectedEntities([]);
            setSelectedRoles([]);
            setEditId(null);
            setEditMode(false);
            setOpen(false);
            loadData();
        } catch (err) {
            toast.error("Error saving user");
            console.error(err);
        }
    };

    const handleOpenAdd = () => {
        setEditMode(false);
        setEditId(null);
        setSelectedEntities([]);
        setSelectedRoles([]);
        setFormData(initialForm);
        setOpen(true);
    };

    const handleEdit = (row) => {
        const user = row.original;
        const entitiesIds = user.entities_ids || [];
        const rolesIds = user.roles_ids || [];
        const selectedEntOpts = entities.filter((opt) => entitiesIds.includes(opt.id));
        const selectedRoleOpts = roles.filter((opt) => rolesIds.includes(opt.id));
        setSelectedEntities(selectedEntOpts);
        setSelectedRoles(selectedRoleOpts);
        setFormData({
            name: user.name || "",
            firstname: user.firstname || "",
            realname: user.realname || "",
            email: user.email || "",
            password: "",
            locations_id: user.locations_id || "",
            users_id_supervisor: user.users_id_supervisor || "",
            department_id: String(user.department_id || ""),
            entities_ids: entitiesIds,
            roles_ids: rolesIds,
            is_hod: user.is_hod ? "Y" : "N",
            is_active: user.is_active ? "Y" : "N",
        });
        setEditId(user.id);
        setEditMode(true);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedEntities([]);
        setSelectedRoles([]);
        setFormData(initialForm);
        setEditId(null);
        setEditMode(false);
    };

    const handleDelete = (row) => {
        setSelectedRow(row);
        setDeleteOpen(true);
    };

    const confirmDelete = async () => {
        if (!selectedRow) return;
        try {
            await deleteUserAPI(selectedRow.id);
            toast.success("User deleted successfully");
            loadData();
        } catch (err) {
            toast.error("Error deleting user");
            console.error(err);
        }
        setDeleteOpen(false);
        setSelectedRow(null);
    };

    const handleView = (row) => {
        setViewUser(row.original);
        setViewOpen(true);
    };

    const handleViewClose = () => {
        setViewOpen(false);
        setViewUser(null);
    };

    const roleOptions = roles.filter((role) => role.field_type === "Role");

    return (
        <>
            <Box sx={{ my: 2 }}>
                <Grid container spacing={2}>
                    <Grid size={12}>
                        <CommonTable
                            title={"User Management"}
                            btnName={"Add User"}
                            addButton={handleOpenAdd}
                            rows={currentRows}
                            columns={UserColumns}
                            onView={handleView}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    </Grid>
                </Grid>

                {/* Add/Edit Dialog */}
                <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
                    <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography fontSize={20} fontWeight={550}>
                            {editMode ? "Edit User" : "Add User"}
                        </Typography>
                        <IconButton onClick={handleClose} color="error">
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent dividers>
                        <Grid container spacing={2}>
                            <Grid size={6}>
                                <TextField
                                    label="Username"
                                    name="name"
                                    size="small"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    fullWidth
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: 3,
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid size={6}>
                                <TextField
                                    label="First Name"
                                    name="firstname"
                                    size="small"
                                    value={formData.firstname}
                                    onChange={handleChange}
                                    required
                                    fullWidth
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: 3,
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid size={6}>
                                <TextField
                                    label="Last Name"
                                    name="realname"
                                    size="small"
                                    value={formData.realname}
                                    onChange={handleChange}
                                    fullWidth
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: 3,
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid size={6}>
                                <TextField
                                    label="Email"
                                    name="email"
                                    size="small"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    fullWidth
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: 3,
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid size={12}>
                                <TextField
                                    label="Password"
                                    name="password"
                                    size="small"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required={!editId}
                                    fullWidth
                                    helperText={editId ? "(Leave blank to keep current)" : ""}
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: 3,
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid size={12}>
                                <Autocomplete
                                    multiple
                                    options={entities}
                                    getOptionLabel={(option) => option.name || option.field_name}
                                    value={selectedEntities}
                                    onChange={handleEntityChange}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Entities"
                                            required
                                            size="small"
                                            sx={{
                                                "& .MuiOutlinedInput-root": {
                                                    borderRadius: 3,
                                                },
                                            }}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid size={12}>
                                <Autocomplete
                                    multiple
                                    options={roleOptions}
                                    getOptionLabel={(option) => option.field_name}
                                    value={selectedRoles}
                                    onChange={handleRoleChange}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Roles"
                                            size="small"
                                            sx={{
                                                "& .MuiOutlinedInput-root": {
                                                    borderRadius: 3,
                                                },
                                            }}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid size={6}>
                                <TextField
                                    select
                                    label="Department"
                                    size="small"
                                    name="department_id"
                                    value={formData.department_id}
                                    onChange={handleChange}
                                    fullWidth
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: 3,
                                        },
                                    }}
                                >
                                    <MenuItem value="">Select Department</MenuItem>
                                    {departments.map((d) => (
                                        <MenuItem key={d.id} value={d.id}>
                                            {d.field_name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid size={6}>
                                <TextField
                                    select
                                    label="Location"
                                    size="small"
                                    name="locations_id"
                                    value={formData.locations_id}
                                    onChange={handleChange}
                                    fullWidth
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: 3,
                                        },
                                    }}
                                >
                                    <MenuItem value="">Select Location</MenuItem>
                                    {locations.map((l) => (
                                        <MenuItem key={l.id} value={l.id}>
                                            {l.field_name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            {supervisors.length > 0 && (
                                <Grid size={6}>
                                    <TextField
                                        select
                                        label="Supervisor"
                                        size="small"
                                        name="users_id_supervisor"
                                        value={formData.users_id_supervisor}
                                        onChange={handleChange}
                                        fullWidth
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                borderRadius: 3,
                                            },
                                        }}
                                    >
                                        <MenuItem value="">Select Supervisor</MenuItem>
                                        {supervisors.map((s) => (
                                            <MenuItem key={s.id} value={s.id}>
                                                {s.firstname} ({s.name})
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                            )}
                            <Grid size={6}>
                                <TextField
                                    select
                                    label="Is HOD"
                                    size="small"
                                    name="is_hod"
                                    value={formData.is_hod}
                                    onChange={handleChange}
                                    fullWidth
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: 3,
                                        },
                                    }}
                                >
                                    <MenuItem value="Y">Yes</MenuItem>
                                    <MenuItem value="N">No</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid size={6}>
                                <TextField
                                    select
                                    label="Active (Y/N)"
                                    name="is_active"
                                    size="small"
                                    value={formData.is_active}
                                    onChange={handleChange}
                                    fullWidth
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: 3,
                                        },
                                    }}
                                >
                                    <MenuItem value="Y">Yes</MenuItem>
                                    <MenuItem value="N">No</MenuItem>
                                </TextField>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="inherit" variant="outlined" size="small">
                            Cancel
                        </Button>
                        <Button variant="contained" onClick={handleSubmit} color="success" size="small">
                            {editMode ? "Update" : "Save"}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* View Dialog */}
                <Dialog open={viewOpen} onClose={handleViewClose} fullWidth maxWidth="md">
                    <DialogTitle sx={{ py: 2 }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Typography variant="h6" fontWeight={600}>
                                User Details
                            </Typography>
                            <IconButton onClick={handleViewClose} size="small">
                                <CloseIcon />
                            </IconButton>
                        </Box>
                    </DialogTitle>
                    <DialogContent dividers sx={{ bgcolor: "#fafafa", py: 3 }}>
                        {viewUser && (
                            <Grid container spacing={2}>
                                <Grid size={6} sx={{ textAlign: "center" }}>
                                    <Box
                                        sx={{
                                            width: 140,
                                            height: 140,
                                            borderRadius: "50%",
                                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            margin: "0 auto",
                                            color: "white",
                                            fontSize: 48,
                                            fontWeight: "bold",
                                            boxShadow: 4,
                                        }}
                                    >
                                        {viewUser.firstname?.[0]?.toUpperCase() || viewUser.name?.[0]?.toUpperCase() || "U"}
                                    </Box>

                                    <Typography variant="h5" fontWeight={700} sx={{ mt: 2, color: "primary.main" }}>
                                        {viewUser.realname || `${viewUser.firstname || ""} ${viewUser.realname || ""}`.trim() || "—"}
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary">
                                        @{viewUser.name}
                                    </Typography>
                                </Grid>
                                <Grid size={6}>
                                    <Box sx={{ display: "grid", gap: 3, }}>
                                        <Box>
                                            <Typography variant="body2" color="text.secondary" gutterBottom fontWeight={500}>
                                                Email Address
                                            </Typography>
                                            <Typography variant="body1" fontWeight={500}>
                                                {viewUser.email ? (
                                                    <a href={`mailto:${viewUser.email}`} style={{ color: "#1976d2", textDecoration: "none" }}>
                                                        {viewUser.email}
                                                    </a>
                                                ) : "—"}
                                            </Typography>
                                        </Box>
                                        <Box>
                                            <Typography variant="body2" color="text.secondary" gutterBottom fontWeight={500}>
                                                Assigned Entities
                                            </Typography>
                                            {viewUser.entities_names && viewUser.entities_names.length > 0 ? (
                                                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                                                    {viewUser.entities_names.map((entity, i) => (
                                                        <Chip key={i} label={entity} color="primary" variant="outlined" size="small" />
                                                    ))}
                                                </Box>
                                            ) : (
                                                <Typography variant="body2" color="text.secondary">No entities assigned</Typography>
                                            )}
                                        </Box>
                                        <Box>
                                            <Typography variant="body2" color="text.secondary" gutterBottom fontWeight={500}>
                                                Roles
                                            </Typography>
                                            {viewUser.role_names && viewUser.role_names.length > 0 ? (
                                                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                                                    {viewUser.role_names.map((role, i) => (
                                                        <Chip key={i} label={role} color="secondary" size="small" />
                                                    ))}
                                                </Box>
                                            ) : (
                                                <Typography variant="body2" color="text.secondary">No roles assigned</Typography>
                                            )}
                                        </Box>
                                        <Box>
                                            <Typography variant="body2" color="text.secondary" gutterBottom fontWeight={500}>
                                                Department
                                            </Typography>
                                            {viewUser.department_name ? (
                                                <Typography variant="body1" fontWeight={500}>
                                                    {viewUser.department_name}
                                                </Typography>
                                            ) : (
                                                <Typography variant="body2" color="text.secondary">No Department assigned</Typography>
                                            )}
                                        </Box>
                                        <Box>
                                            <Typography variant="body2" color="text.secondary" gutterBottom fontWeight={500}>
                                                Location
                                            </Typography>
                                            {viewUser.location_name ? (
                                                <Typography variant="body1" fontWeight={500}>
                                                    {viewUser.location_name}
                                                </Typography>
                                            ) : (
                                                <Typography variant="body2" color="text.secondary">No Location assigned</Typography>
                                            )}
                                        </Box>
                                        <Box>
                                            <Typography variant="body2" color="text.secondary" gutterBottom fontWeight={500}>
                                                Reports To (Supervisor)
                                            </Typography>
                                            {viewUser.supervisor_name ? (
                                                <Typography variant="body1" fontWeight={500}>
                                                    {viewUser.supervisor_name} (@{viewUser.supervisor_username || "—"})
                                                </Typography>
                                            ) : (
                                                <Typography variant="body2" color="text.secondary">No Supervisor assigned</Typography>
                                            )}
                                        </Box>
                                        {viewUser.created_at && (
                                            <Box>
                                                <Typography variant="body2" color="text.secondary" gutterBottom fontWeight={500}>
                                                    Account Created
                                                </Typography>
                                                <Typography variant="body1" fontWeight={500}>
                                                    {new Date(viewUser.created_at).toLocaleDateString("en-US", {
                                                        year: "numeric",
                                                        month: "long",
                                                        day: "numeric",
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </Typography>
                                            </Box>
                                        )}
                                    </Box>
                                </Grid>
                            </Grid>
                        )}
                    </DialogContent>
                </Dialog>

                {/* Delete Dialog */}
                <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)} fullWidth maxWidth="xs">
                    <DialogTitle>Delete User</DialogTitle>
                    <DialogContent dividers>
                        <Typography>
                            Are you sure you want to delete user <strong>{selectedRow?.userName}</strong>?
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDeleteOpen(false)} color="inherit" variant="outlined" size="small">
                            Cancel
                        </Button>
                        <Button onClick={confirmDelete} color="error" variant="contained" size="small">
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </>
    );
};

export default Users;