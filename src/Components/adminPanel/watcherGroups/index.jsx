import { useState, useEffect } from "react";
import { Box,Button,Dialog,DialogActions,DialogContent,DialogTitle,Grid,IconButton,TextField,Typography,
    Chip,
    CircularProgress,
    Checkbox
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";
import {
    fetchWatcherGroups,
    fetchWatcherUsers,
    createWatcherGroup,
    updateWatcherGroup,
    deleteWatcherGroup,
} from "../../../Api";
import CommonTable from "../../commonTabel";

const Watcher = () => {
    const [rows, setRows] = useState([]);
    const [allUsers, setAllUsers] = useState([]); // For user selection
    const [loading, setLoading] = useState(true);

    const [open, setOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [manageUsersOpen, setManageUsersOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);

    const [form, setForm] = useState({
        groupName: "",
        comment: ""
    });

    const [selectedUserIds, setSelectedUserIds] = useState([]);
    const [userSearch, setUserSearch] = useState("");

    // Load initial data
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [groupsData, usersData] = await Promise.all([
                fetchWatcherGroups(),
                fetchWatcherUsers("")
            ]);
            setRows(groupsData);
            setAllUsers(usersData);
        } catch (error) {
            toast.error("Failed to load data");
        } finally {
            setLoading(false);
        }
    };

    const WatcherColumns = [
        { id: "serialNo", label: "S.no" },
        { id: "groupName", label: "Group Name" },
        { id: "users", label: "Users" },
        { id: "comment", label: "Comment" },
    ];

    const tableRows = rows.map((r, i) => {
        const userNames = r.users?.map(u => u.name || u.realname).join(", ") || "-";
        const displayUsers = userNames.length > 30 ? `${userNames.substring(0, 30)}...` : userNames;
        return {
            ...r,
            serialNo: i + 1,
            groupName: r.name || "",
            users: displayUsers,
            originalUsers: r.users
        };
    });

    const handleOpenAdd = () => {
        setEditMode(false);
        setForm({ groupName: "", comment: "" });
        setOpen(true);
    };

    const handleEdit = (row) => {
        setEditMode(true);
        setSelectedRow(row);
        setForm({
            groupName: row.groupName || "",
            comment: row.comment || ""
        });
        setOpen(true);
    };

    const handleManageUsers = (row) => {
        setSelectedRow(row);
        setSelectedUserIds(row.originalUsers?.map(u => u.id) || []);
        setManageUsersOpen(true);
        // Ensure all users are loaded
        if (allUsers.length === 0) {
            fetchWatcherUsers("").then(setAllUsers).catch(() => toast.error("Failed to load users"));
        }
    };

    const handleDelete = (row) => {
        setSelectedRow(row);
        setDeleteOpen(true);
    };

    const confirmDelete = async () => {
        try {
            await deleteWatcherGroup(selectedRow.id);
            toast.success("Watcher group deleted!");
            loadData(); // Reload data
        } catch (error) {
            toast.error("Failed to delete group");
        }
        setDeleteOpen(false);
    };

    const handleSubmit = async () => {
        try {
            const payload = {
                name: form.groupName,
                comment: form.comment
            };
            if (editMode) {
                await updateWatcherGroup(selectedRow.id, payload);
                toast.success("Watcher group updated!");
            } else {
                await createWatcherGroup(payload);
                toast.success("Watcher group created!");
            }
            setOpen(false);
            loadData(); // Reload data
        } catch (error) {
            toast.error("Error saving watcher group");
        }
    };

    const handleSaveUsers = async () => {
        try {
            await updateWatcherGroup(selectedRow.id, { user_ids: selectedUserIds });
            toast.success("Users updated for group!");
            setManageUsersOpen(false);
            loadData(); // Reload to update users in table
        } catch (error) {
            toast.error("Failed to update users for group");
        }
    };

    const filteredUsers = allUsers.filter(user => {
        const name = (user.name || user.realname || "").toLowerCase();
        const email = (user.email || "").toLowerCase();
        return name.includes(userSearch.toLowerCase()) || email.includes(userSearch.toLowerCase());
    });

    const toggleUserSelection = (userId) => {
        setSelectedUserIds(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
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
                            title={"Watcher Management"}
                            btnName={"Add Group"}
                            addButton={handleOpenAdd}
                            rows={tableRows}
                            columns={WatcherColumns}
                            onView={(row) => console.log("View", row)} 
                            onEdit={handleEdit}
                            onGroup={handleManageUsers}
                            onDelete={handleDelete}
                        />
                    </Grid>
                </Grid>

                {/* ADD + EDIT DIALOG */}
                <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
                    <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography fontSize={20} fontWeight={550}>
                            {editMode ? "Edit Watcher Group" : "Add Watcher Group"}
                        </Typography>
                        <IconButton onClick={() => setOpen(false)} color="error">
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>

                    <DialogContent dividers>
                        <Grid container spacing={2}>
                            <Grid size={12}>
                                <TextField
                                    label="Group Name"
                                    fullWidth
                                    required
                                    size="small"
                                    value={form.groupName}
                                    onChange={(e) => setForm({ ...form, groupName: e.target.value })}
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: 3,
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid size={12}>
                                <TextField
                                    label="Comment"
                                    multiline
                                    size="small"
                                    rows={3}
                                    fullWidth
                                    value={form.comment}
                                    onChange={(e) => setForm({ ...form, comment: e.target.value })}
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: 3,
                                        }
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={() => setOpen(false)} variant="outlined" color="inherit" size="small">
                            Cancel
                        </Button>
                        <Button variant="contained" color="success" size="small" onClick={handleSubmit}>
                            {editMode ? "Update" : "Save"}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* MANAGE USERS DIALOG */}
                <Dialog open={manageUsersOpen} onClose={() => setManageUsersOpen(false)} fullWidth maxWidth="md">
                    <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography fontSize={20} fontWeight={550}>
                            Manage Users for: {selectedRow?.groupName}
                        </Typography>
                        <IconButton onClick={() => setManageUsersOpen(false)} color="error">
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>

                    <DialogContent dividers>
                        <Grid container spacing={2}>
                            <Grid size={12}>
                                <TextField
                                    label="Search Users"
                                    fullWidth
                                    size="small"
                                    value={userSearch}
                                    onChange={(e) => setUserSearch(e.target.value)}
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: 3,
                                            mb: 2
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid size={12}>
                                <Typography variant="subtitle1" gutterBottom>
                                    Selected: {selectedUserIds.length} users
                                </Typography>
                                <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                                    {filteredUsers.length === 0 ? (
                                        <Typography>No users found.</Typography>
                                    ) : (
                                        filteredUsers.map((user) => (
                                            <Box key={user.id} sx={{ display: 'flex', alignItems: 'center', p: 1, borderBottom: '1px solid #eee' }}>
                                                <Checkbox
                                                    checked={selectedUserIds.includes(user.id)}
                                                    onChange={() => toggleUserSelection(user.id)}
                                                />
                                                <Box sx={{ ml: 1, flex: 1 }}>
                                                    <Typography variant="body1">{user.name || user.realname}</Typography>
                                                    <Typography variant="body2" color="textSecondary">{user.email}</Typography>
                                                </Box>
                                            </Box>
                                        ))
                                    )}
                                </Box>
                            </Grid>
                        </Grid>
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={() => setManageUsersOpen(false)} variant="outlined" color="inherit" size="small">
                            Cancel
                        </Button>
                        <Button variant="contained" color="success" size="small" onClick={handleSaveUsers}>
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* DELETE DIALOG */}
                <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
                    <DialogTitle>Delete Watcher Group</DialogTitle>
                    <DialogContent>
                        <Typography>
                            Are you sure you want to delete "{selectedRow?.groupName}"? This action cannot be undone.
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
                        <Button color="error" variant="contained" onClick={confirmDelete}>Delete</Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </>
    );
};

export default Watcher;