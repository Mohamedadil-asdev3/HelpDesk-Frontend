// import { useState, useEffect, useRef } from "react";
// import { Autocomplete, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, TextField, Typography, Select, MenuItem, FormControl, InputLabel, Chip, CircularProgress } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
// import WarningAmberIcon from "@mui/icons-material/WarningAmber";
// import CommonTable from "../../commonTabel";
// import { fetchEntitiesAPI, fetchHodsAPI, fetchLocationsAPI, fetchRolesAPI, saveEntityAPI } from "../../../Api";

// const Entity = () => {

//     const [entities, setEntities] = useState([]);
//     const [hods, setHods] = useState([]);
//     const [roles, setRoles] = useState([]);
//     const [locations, setLocations] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [rows, setRows] = useState([]);
//     const [open, setOpen] = useState(false);
//     const [deleteOpen, setDeleteOpen] = useState(false);
//     const [editMode, setEditMode] = useState(false);
//     const [selectedRow, setSelectedRow] = useState(null);
//     const [viewOpen, setViewOpen] = useState(false);
//     const [form, setForm] = useState({
//         name: "",
//         display_name: "",
//         description: "",
//         address: "",
//         contact_email: "",
//         location: "",
//         entity_head: "",
//         role_ids: [],
//         logo: null
//     });

//     const entityColumns = [
//         { id: "id", label: "S.no" },
//         { id: "name", label: "Name" },
//         { id: "display_name", label: "Display Name" },
//         { id: "description", label: "Description" },
//         { id: "location", label: "Location" },
//     ];

//     useEffect(() => {
//         loadEntities();
//         loadHods();
//         loadLocations();
//         loadRoles();
//     }, []);

//     const loadEntities = async () => {
//         setLoading(true);
//         try {
//             const data = await fetchEntitiesAPI();

//             // Map roles per entity using field_type === "Role"
//             const mappedEntities = data.map(entity => {
//                 const entityRoles = data.filter(r => r.entity_id === entity.id && r.field_type === "Role");
//                 return {
//                     ...entity,
//                     roles: entityRoles.map(r => ({
//                         id: r.id,
//                         rolename: r.field_name,
//                     })),
//                 };
//             });

//             setEntities(mappedEntities);

//             // Transform for table rows
//             const tableRows = mappedEntities.map((entity, index) => ({
//                 id: entity.id,
//                 serial: index + 1,
//                 name: entity.name,
//                 display_name: entity.display_name,
//                 description: entity.description || "-",
//                 location: entity.location?.field_name || "—",
//                 roles: entity.roles || [],
//                 entity_head: entity.entity_head,
//                 address: entity.address,
//                 contact_email: entity.contact_email,
//                 logo: entity.logo,
//                 created_date: entity.created_date
//             }));

//             setRows(tableRows);
//         } catch (err) {
//             console.error("Error loading entities:", err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const loadHods = async () => {
//         try {
//             const data = await fetchHodsAPI();
//             setHods(data);
//         } catch (err) {
//             console.error("Error loading HODs:", err);
//         }
//     };

//     const loadLocations = async () => {
//         try {
//             const data = await fetchLocationsAPI();
//             setLocations(data);
//         } catch (err) {
//             console.error("Error loading locations:", err);
//         }
//     };

//     const loadRoles = async () => {
//         try {
//             const data = await fetchRolesAPI();
//             setRoles(data);
//         } catch (err) {
//             console.error("Error loading roles:", err);
//         }
//     };

//     const handleOpenAdd = () => {
//         setEditMode(false);
//         setForm({
//             name: "",
//             display_name: "",
//             description: "",
//             address: "",
//             contact_email: "",
//             location: "",
//             entity_head: "",
//             role_ids: [],
//             logo: null
//         });
//         setOpen(true);
//     };

//     const handleView = (row) => {
//         setSelectedRow(row);
//         setViewOpen(true);
//     };

//     const handleViewClose = () => {
//         setViewOpen(false);
//         setSelectedRow(null);
//     };

//     const handleEdit = (row) => {
//         setEditMode(true);
//         setSelectedRow(row);

//         setForm({
//             name: row.name,
//             display_name: row.display_name,
//             description: row.description,
//             address: row.address || "",
//             contact_email: row.contact_email || "",
//             location: row.location || "",
//             entity_head: row.entity_head?.id || "",
//             role_ids: row.roles?.map(role => role.id.toString()) || [],
//             logo: null,
//             logo_url: row.logo ? row.logo : null
//         });

//         setOpen(true);
//     };

//     const handleDelete = (row) => {
//         setSelectedRow(row);
//         setDeleteOpen(true);
//     };

//     const confirmDelete = async () => {
//         try {
//             setRows(rows.filter((item) => item.id !== selectedRow.id));
//             setEntities(entities.filter((item) => item.id !== selectedRow.id));
//             setDeleteOpen(false);
//             alert("Entity deleted successfully!");
//         } catch (err) {
//             console.error("Error deleting entity:", err);
//             alert("Error deleting entity");
//         }
//     };

//     const handleClose = () => setOpen(false);

//     const handleChange = (e) => {
//         const { name, value, files } = e.target;

//         if (name === "logo") {
//             const file = files[0];

//             setForm(prev => ({
//                 ...prev,
//                 logo: file,
//                 logoPreview: URL.createObjectURL(file)
//             }));
//         } else {
//             setForm(prev => ({
//                 ...prev,
//                 [name]: value
//             }));
//         }
//     };

//     const handleRoleChange = (event) => {
//         const { value } = event.target;
//         setForm(prev => ({
//             ...prev,
//             role_ids: typeof value === 'string' ? value.split(',') : value
//         }));
//     };

//     const handleSubmit = async () => {
//         if (!form.name || !form.display_name) {
//             alert("Name and Display Name are required");
//             return;
//         }

//         try {
//             await saveEntityAPI(form, editMode ? selectedRow.id : null);
//             alert(editMode ? "Entity updated successfully!" : "Entity created successfully!");
//             handleClose();
//             loadEntities(); // Reload entities to get updated data
//         } catch (err) {
//             console.error("Error saving entity:", err);
//             alert("Error saving entity");
//         }
//     };

//     const locationOptions = locations.map(loc => ({
//         label: loc.field_name || loc.display_name || loc.location_name,
//         value: loc.id
//     }));

//     const hodOptions = hods.map(hod => ({
//         label: hod.realname || hod.firstname,
//         value: hod.id
//     }));

//     const roleOptions = roles.map(role => ({
//         label: role.field_name,
//         value: role.id.toString()
//     }));

//     const fileInputRef = useRef(null);

//     return (
//         <>
//             <Box sx={{ my: 2 }}>
//                 <Grid container spacing={2}>
//                     <Grid size={12}>
//                         <CommonTable
//                             title={"Entity Management"}
//                             btnName={"Add Entity"}
//                             addButton={handleOpenAdd}
//                             rows={rows}
//                             columns={entityColumns}
//                             onView={handleView}
//                             onEdit={handleEdit}
//                             onDelete={handleDelete}
//                             loading={loading}
//                         />
//                     </Grid>
//                 </Grid>

//                 {/* ADD / EDIT ENTITY DIALOG */}
//                 <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
//                     <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                         <Typography fontSize={20} fontWeight={550}>
//                             {editMode ? "Edit Entity" : "Add Entity"}
//                         </Typography>
//                         <IconButton onClick={handleClose} color="error">
//                             <CloseIcon />
//                         </IconButton>
//                     </DialogTitle>

//                     <DialogContent dividers>
//                         <Grid container spacing={2}>
//                             <Grid size={{ xs: 12, sm: 6 }}>
//                                 <TextField
//                                     label="Name"
//                                     name="name"
//                                     size="small"
//                                     value={form.name}
//                                     onChange={handleChange}
//                                     fullWidth
//                                     required
//                                     sx={{
//                                         "& .MuiOutlinedInput-root": {
//                                             borderRadius: 3,
//                                         }
//                                     }}
//                                 />
//                             </Grid>
//                             <Grid size={{ xs: 12, sm: 6 }}>
//                                 <TextField
//                                     label="Display Name"
//                                     name="display_name"
//                                     size="small"
//                                     value={form.display_name}
//                                     onChange={handleChange}
//                                     fullWidth
//                                     required
//                                     sx={{
//                                         "& .MuiOutlinedInput-root": {
//                                             borderRadius: 3,
//                                         }
//                                     }}
//                                 />
//                             </Grid>
//                             <Grid size={{ xs: 12, sm: 6 }}>
//                                 <TextField
//                                     label="Contact Email"
//                                     name="contact_email"
//                                     size="small"
//                                     type="email"
//                                     value={form.contact_email}
//                                     onChange={handleChange}
//                                     fullWidth
//                                     sx={{
//                                         "& .MuiOutlinedInput-root": {
//                                             borderRadius: 3,
//                                         }
//                                     }}
//                                 />
//                             </Grid>
//                             <Grid size={{ xs: 12, sm: 6 }}>
//                                 <Autocomplete
//                                     options={locationOptions}
//                                     value={locationOptions.find(opt => opt.value === form.location) || null}
//                                     onChange={(e, value) => setForm({ ...form, location: value?.value || "" })}
//                                     getOptionLabel={(option) => option.label}
//                                     renderInput={(params) => (
//                                         <TextField
//                                             {...params}
//                                             label="Location"
//                                             size="small"
//                                             required
//                                             sx={{
//                                                 "& .MuiOutlinedInput-root": {
//                                                     borderRadius: 3,
//                                                 }
//                                             }}
//                                         />
//                                     )}
//                                 />
//                             </Grid>
//                             <Grid size={{ xs: 12, sm: 6 }}>
//                                 <Autocomplete
//                                     options={hodOptions}
//                                     value={hodOptions.find(opt => opt.value === form.entity_head) || null}
//                                     onChange={(e, value) => setForm({ ...form, entity_head: value?.value || "" })}
//                                     getOptionLabel={(option) => option.label}
//                                     renderInput={(params) => (
//                                         <TextField
//                                             {...params}
//                                             label="Entity Head"
//                                             size="small"
//                                             sx={{
//                                                 "& .MuiOutlinedInput-root": {
//                                                     borderRadius: 3,
//                                                 }
//                                             }}
//                                         />
//                                     )}
//                                 />
//                             </Grid>
//                             <Grid size={{ xs: 12, sm: 6 }}>
//                                 <Autocomplete
//                                     multiple
//                                     options={roleOptions}
//                                     value={roleOptions.filter((opt) =>
//                                         form.role_ids.includes(opt.value)
//                                     )}
//                                     onChange={(event, newValue) => {
//                                         setForm(prev => ({
//                                             ...prev,
//                                             role_ids: newValue.map(item => item.value)
//                                         }));
//                                     }}
//                                     getOptionLabel={(option) => option.label}
//                                     renderTags={(selected, getTagProps) =>
//                                         selected.map((option, index) => (
//                                             <Chip
//                                                 {...getTagProps({ index })}
//                                                 label={option.label}
//                                                 size="small"
//                                             />
//                                         ))
//                                     }
//                                     renderInput={(params) => (
//                                         <TextField
//                                             {...params}
//                                             label="Roles"
//                                             placeholder="Select roles"
//                                             size="small"
//                                             sx={{
//                                                 "& .MuiOutlinedInput-root": {
//                                                     borderRadius: 3,
//                                                 }
//                                             }}
//                                         />
//                                     )}
//                                 />
//                             </Grid>
//                             <Grid size={12}>
//                                 <TextField
//                                     label="Description"
//                                     name="description"
//                                     size="small"
//                                     value={form.description}
//                                     onChange={handleChange}
//                                     fullWidth
//                                     multiline
//                                     minRows={2}
//                                     sx={{
//                                         "& .MuiOutlinedInput-root": {
//                                             borderRadius: 3,
//                                         }
//                                     }}
//                                 />
//                             </Grid>
//                             <Grid size={12}>
//                                 <TextField
//                                     label="Address"
//                                     name="address"
//                                     size="small"
//                                     value={form.address}
//                                     onChange={handleChange}
//                                     fullWidth
//                                     multiline
//                                     minRows={2}
//                                     sx={{
//                                         "& .MuiOutlinedInput-root": {
//                                             borderRadius: 3,
//                                         }
//                                     }}
//                                 />
//                             </Grid>
//                             <Grid size={{ xs: 12, sm: 3 }}>
//                                 <Button
//                                     variant="contained"
//                                     size="small"
//                                     component="label"
//                                     fullWidth
//                                     sx={{ borderRadius: 3, py: 1.5 }}
//                                 >
//                                     Upload Logo
//                                     <input
//                                         type="file"
//                                         name="logo"
//                                         hidden
//                                         ref={fileInputRef}     // ✅ ADDED
//                                         onChange={handleChange}
//                                         accept="image/*"
//                                     />
//                                 </Button>

//                                 {(form.logoPreview || form.logo_url) && (
//                                     <Box sx={{ mt: 2, position: "relative", display: "inline-block" }}>
//                                         <Typography variant="body2" sx={{ mb: 1 }}>
//                                             Preview:
//                                         </Typography>

//                                         <IconButton
//                                             size="small"
//                                             color="error"
//                                             onClick={() => {
//                                                 setForm(prev => ({
//                                                     ...prev,
//                                                     logo: null,
//                                                     logoPreview: null,
//                                                     logo_url: null
//                                                 }));

//                                                 // ✅ FIX: reset file input so we can re-upload image
//                                                 if (fileInputRef.current) {
//                                                     fileInputRef.current.value = "";
//                                                 }
//                                             }}
//                                             sx={{
//                                                 position: "absolute",
//                                                 top: -10,
//                                                 right: -10,
//                                                 background: "#fff",
//                                                 boxShadow: 1,
//                                                 "&:hover": { background: "#ffe6e6" }
//                                             }}
//                                         >
//                                             <CloseIcon fontSize="small" />
//                                         </IconButton>

//                                         <img
//                                             src={form.logoPreview || form.logo_url}
//                                             alt="Logo Preview"
//                                             style={{
//                                                 width: 100,
//                                                 height: 100,
//                                                 objectFit: "contain",
//                                                 borderRadius: 10,
//                                                 border: "1px solid #ccc",
//                                                 padding: 5,
//                                                 background: "#fff"
//                                             }}
//                                         />
//                                     </Box>
//                                 )}
//                             </Grid>
//                         </Grid>
//                     </DialogContent>
//                     <DialogActions>
//                         <Button onClick={handleClose} color="error" variant="outlined" size="small">
//                             Cancel
//                         </Button>
//                         <Button
//                             variant="contained"
//                             onClick={handleSubmit}
//                             color="success"
//                             size="small"
//                             disabled={loading}
//                         >
//                             {loading ? <CircularProgress size={20} /> : (editMode ? "Update" : "Save")}
//                         </Button>
//                     </DialogActions>
//                 </Dialog>

//                 {/* DELETE CONFIRMATION DIALOG */}
//                 <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
//                     <DialogTitle>Confirm Inactive</DialogTitle>
//                     <DialogContent dividers>
//                         <Box
//                             sx={{
//                                 textAlign: "center",
//                                 display: "flex",
//                                 flexDirection: "column",
//                                 alignItems: "center",
//                                 p: 2
//                             }}
//                         >
//                             <WarningAmberIcon sx={{ fontSize: 60, color: "error.main", mb: 2 }} />
//                             <Typography variant="h6" fontWeight={600}>
//                                 Are you sure?
//                             </Typography>
//                             <Typography sx={{ mt: 1 }}>
//                                 You want to Inactive <b>{selectedRow?.name}</b> Entity
//                             </Typography>
//                         </Box>
//                     </DialogContent>
//                     <DialogActions>
//                         <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
//                         <Button color="error" variant="contained" onClick={confirmDelete}>InActive</Button>
//                     </DialogActions>
//                 </Dialog>


//                 {/* VIEW ENTITY DIALOG */}
//                 <Dialog open={viewOpen} onClose={handleViewClose} fullWidth maxWidth="md">
//                     <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                         <Typography fontSize={22} fontWeight={600}>
//                             Entity Details
//                         </Typography>
//                         <IconButton onClick={handleViewClose} color="error">
//                             <CloseIcon />
//                         </IconButton>
//                     </DialogTitle>
//                     <DialogContent dividers>
//                         {selectedRow && (
//                             <Grid container spacing={3}>
//                                 {/* Logo + Name */}
//                                 <Grid item xs={12} md={4} sx={{ textAlign: { xs: "center", md: "left" } }}>
//                                     {selectedRow.logo ? (
//                                         <img
//                                             src={selectedRow.logo}
//                                             alt={selectedRow.name}
//                                             style={{
//                                                 width: 140,
//                                                 height: 140,
//                                                 objectFit: "contain",
//                                                 borderRadius: 12,
//                                                 border: "2px solid #e0e0e0",
//                                                 padding: 8,
//                                                 background: "#fafafa",
//                                             }}
//                                         />
//                                     ) : (
//                                         <Box
//                                             sx={{
//                                                 width: 140,
//                                                 height: 140,
//                                                 borderRadius: 12,
//                                                 background: "#f5f5f5",
//                                                 display: "flex",
//                                                 alignItems: "center",
//                                                 justifyContent: "center",
//                                                 border: "2px dashed #ccc",
//                                                 color: "#999",
//                                                 fontSize: 14,
//                                             }}
//                                         >
//                                             No Logo
//                                         </Box>
//                                     )}
//                                     <Typography variant="h6" sx={{ mt: 2, fontWeight: 600 }}>
//                                         {selectedRow.display_name || selectedRow.name}
//                                     </Typography>
//                                     <Typography variant="body2" color="text.secondary">
//                                         {selectedRow.name}
//                                     </Typography>
//                                 </Grid>

//                                 {/* Details */}
//                                 <Grid item xs={12} md={8}>
//                                     <Box sx={{ display: "grid", gap: 2.5 }}>
//                                         <Box>
//                                             <Typography variant="body2" color="text.secondary" gutterBottom>
//                                                 Description
//                                             </Typography>
//                                             <Typography variant="body1" fontWeight={500}>
//                                                 {selectedRow.description || "—"}
//                                             </Typography>
//                                         </Box>

//                                         <Box>
//                                             <Typography variant="body2" color="text.secondary" gutterBottom>
//                                                 Address
//                                             </Typography>
//                                             <Typography variant="body1" fontWeight={500}>
//                                                 {selectedRow.address || "—"}
//                                             </Typography>
//                                         </Box>

//                                         <Box>
//                                             <Typography variant="body2" color="text.secondary" gutterBottom>
//                                                 Contact Email
//                                             </Typography>
//                                             <Typography variant="body1" fontWeight={500}>
//                                                 {selectedRow.contact_email ? (
//                                                     <a href={`mailto:${selectedRow.contact_email}`} style={{ color: "#1976d2" }}>
//                                                         {selectedRow.contact_email}
//                                                     </a>
//                                                 ) : (
//                                                     "—"
//                                                 )}
//                                             </Typography>
//                                         </Box>

//                                         <Box>
//                                             <Typography variant="body2" color="text.secondary" gutterBottom>
//                                                 Location
//                                             </Typography>
//                                             <Typography variant="body1" fontWeight={500}>
//                                                 {selectedRow.location || "—"}
//                                             </Typography>
//                                         </Box>

//                                         <Box>
//                                             <Typography variant="body2" color="text.secondary" gutterBottom>
//                                                 Entity Head
//                                             </Typography>
//                                             <Typography variant="body1" fontWeight={500}>
//                                                 {selectedRow.entity_head?.realname ||
//                                                     selectedRow.entity_head?.firstname ||
//                                                     selectedRow.entity_head ||
//                                                     "—"}
//                                             </Typography>
//                                         </Box>

//                                         <Box>
//                                             <Typography variant="body2" color="text.secondary" gutterBottom>
//                                                 Assigned Roles
//                                             </Typography>
//                                             {selectedRow.roles && selectedRow.roles.length > 0 ? (
//                                                 <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
//                                                     {selectedRow.roles.map((role) => (
//                                                         <Chip
//                                                             key={role.id}
//                                                             label={role.rolename || role.field_name}
//                                                             size="small"
//                                                             color="primary"
//                                                             variant="outlined"
//                                                         />
//                                                     ))}
//                                                 </Box>
//                                             ) : (
//                                                 <Typography variant="body2" color="text.secondary">
//                                                     No roles assigned
//                                                 </Typography>
//                                             )}
//                                         </Box>

//                                         <Box>
//                                             <Typography variant="body2" color="text.secondary" gutterBottom>
//                                                 Created On
//                                             </Typography>
//                                             <Typography variant="body1" fontWeight={500}>
//                                                 {selectedRow.created_date
//                                                     ? new Date(selectedRow.created_date).toLocaleDateString("en-US", {
//                                                         year: "numeric",
//                                                         month: "long",
//                                                         day: "numeric",
//                                                     })
//                                                     : "—"}
//                                             </Typography>
//                                         </Box>
//                                     </Box>
//                                 </Grid>
//                             </Grid>
//                         )}
//                     </DialogContent>
//                 </Dialog>
//             </Box>
//         </>
//     );
// };

// export default Entity;



import { useState, useEffect, useRef } from "react";
import { Autocomplete, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, TextField, Typography, Select, MenuItem, FormControl, InputLabel, Chip, CircularProgress } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CommonTable from "../../commonTabel";
import { fetchEntitiesAPI, fetchHodsAPI, fetchLocationsAPI, fetchRolesAPI, saveEntityAPI, Media_URL  } from "../../../Api";

const Entity = () => {

    const [entities, setEntities] = useState([]);
    const [hods, setHods] = useState([]);
    const [roles, setRoles] = useState([]);
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [rows, setRows] = useState([]);
    const [open, setOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [viewOpen, setViewOpen] = useState(false);
    const [form, setForm] = useState({
        name: "",
        display_name: "",
        description: "",
        address: "",
        contact_email: "",
        location: "",
        entity_head: "",
        role_ids: [],
        logo: null
    });

    const media_url = Media_URL; // Assuming Media_URL is imported or defined globally (e.g., via window.Media_URL or prop)

    const entityColumns = [
        { id: "id", label: "S.no" },
        { id: "name", label: "Name" },
        { id: "display_name", label: "Display Name" },
        { id: "description", label: "Description" },
        { id: "location", label: "Location" },
    ];

    useEffect(() => {
        loadEntities();
        loadHods();
        loadLocations();
        loadRoles();
    }, []);

    const loadEntities = async () => {
        setLoading(true);
        try {
            const data = await fetchEntitiesAPI();

            // Map roles per entity using field_type === "Role"
            const mappedEntities = data.map(entity => {
                const entityRoles = data.filter(r => r.entity_id === entity.id && r.field_type === "Role");
                return {
                    ...entity,
                    roles: entityRoles.map(r => ({
                        id: r.id,
                        rolename: r.field_name,
                    })),
                };
            });

            setEntities(mappedEntities);

            // Transform for table rows
            const tableRows = mappedEntities.map((entity, index) => ({
                id: entity.id,
                serial: index + 1,
                name: entity.name,
                display_name: entity.display_name,
                description: entity.description || "-",
                location: entity.location?.field_name || "—",
                roles: entity.roles || [],
                entity_head: entity.entity_head,
                address: entity.address,
                contact_email: entity.contact_email,
                logo: entity.logo,
                created_date: entity.created_date
            }));

            setRows(tableRows);
        } catch (err) {
            console.error("Error loading entities:", err);
        } finally {
            setLoading(false);
        }
    };

    const loadHods = async () => {
        try {
            const data = await fetchHodsAPI();
            setHods(data);
        } catch (err) {
            console.error("Error loading HODs:", err);
        }
    };

    const loadLocations = async () => {
        try {
            const data = await fetchLocationsAPI();
            setLocations(data);
        } catch (err) {
            console.error("Error loading locations:", err);
        }
    };

    const loadRoles = async () => {
        try {
            const data = await fetchRolesAPI();
            setRoles(data);
        } catch (err) {
            console.error("Error loading roles:", err);
        }
    };

    const handleOpenAdd = () => {
        setEditMode(false);
        setForm({
            name: "",
            display_name: "",
            description: "",
            address: "",
            contact_email: "",
            location: "",
            entity_head: "",
            role_ids: [],
            logo: null
        });
        setOpen(true);
    };

    const handleView = (row) => {
        setSelectedRow(row);
        setViewOpen(true);
    };

    const handleViewClose = () => {
        setViewOpen(false);
        setSelectedRow(null);
    };

    const handleEdit = (row) => {
        setEditMode(true);
        setSelectedRow(row);

        setForm({
            name: row.name,
            display_name: row.display_name,
            description: row.description,
            address: row.address || "",
            contact_email: row.contact_email || "",
            location: row.location || "",
            entity_head: row.entity_head?.id || "",
            role_ids: row.roles?.map(role => role.id.toString()) || [],
            logo: null,
            logo_url: row.logo ? row.logo : null
        });

        setOpen(true);
    };

    const handleDelete = (row) => {
        setSelectedRow(row);
        setDeleteOpen(true);
    };

    const confirmDelete = async () => {
        try {
            setRows(rows.filter((item) => item.id !== selectedRow.id));
            setEntities(entities.filter((item) => item.id !== selectedRow.id));
            setDeleteOpen(false);
            alert("Entity deleted successfully!");
        } catch (err) {
            console.error("Error deleting entity:", err);
            alert("Error deleting entity");
        }
    };

    const handleClose = () => setOpen(false);

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === "logo") {
            const file = files[0];

            setForm(prev => ({
                ...prev,
                logo: file,
                logoPreview: URL.createObjectURL(file)
            }));
        } else {
            setForm(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleRoleChange = (event) => {
        const { value } = event.target;
        setForm(prev => ({
            ...prev,
            role_ids: typeof value === 'string' ? value.split(',') : value
        }));
    };

    const handleSubmit = async () => {
        if (!form.name || !form.display_name) {
            alert("Name and Display Name are required");
            return;
        }

        try {
            await saveEntityAPI(form, editMode ? selectedRow.id : null);
            alert(editMode ? "Entity updated successfully!" : "Entity created successfully!");
            handleClose();
            loadEntities(); // Reload entities to get updated data
        } catch (err) {
            console.error("Error saving entity:", err);
            alert("Error saving entity");
        }
    };

    const locationOptions = locations.map(loc => ({
        label: loc.field_name || loc.display_name || loc.location_name,
        value: loc.id
    }));

    const hodOptions = hods.map(hod => ({
        label: hod.realname || hod.firstname,
        value: hod.id
    }));

    const roleOptions = roles.map(role => ({
        label: role.field_name,
        value: role.id.toString()
    }));

    const fileInputRef = useRef(null);

    return (
        <>
            <Box sx={{ my: 2 }}>
                <Grid container spacing={2}>
                    <Grid size={12}>
                        <CommonTable
                            title={"Entity Management"}
                            btnName={"Add Entity"}
                            addButton={handleOpenAdd}
                            rows={rows}
                            columns={entityColumns}
                            onView={handleView}
                            onEdit={handleEdit}
                            //onDelete={handleDelete}
                            loading={loading}
                        />
                    </Grid>
                </Grid>

                {/* ADD / EDIT ENTITY DIALOG */}
                <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
                    <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography fontSize={20} fontWeight={550}>
                            {editMode ? "Edit Entity" : "Add Entity"}
                        </Typography>
                        <IconButton onClick={handleClose} color="error">
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>

                    <DialogContent dividers>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    label="Name"
                                    name="name"
                                    size="small"
                                    value={form.name}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: 3,
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    label="Display Name"
                                    name="display_name"
                                    size="small"
                                    value={form.display_name}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: 3,
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    label="Contact Email"
                                    name="contact_email"
                                    size="small"
                                    type="email"
                                    value={form.contact_email}
                                    onChange={handleChange}
                                    fullWidth
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: 3,
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Autocomplete
                                    options={locationOptions}
                                    value={locationOptions.find(opt => opt.value === form.location) || null}
                                    onChange={(e, value) => setForm({ ...form, location: value?.value || "" })}
                                    getOptionLabel={(option) => option.label}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Location"
                                            size="small"
                                            required
                                            sx={{
                                                "& .MuiOutlinedInput-root": {
                                                    borderRadius: 3,
                                                }
                                            }}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Autocomplete
                                    options={hodOptions}
                                    value={hodOptions.find(opt => opt.value === form.entity_head) || null}
                                    onChange={(e, value) => setForm({ ...form, entity_head: value?.value || "" })}
                                    getOptionLabel={(option) => option.label}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Entity Head"
                                            size="small"
                                            sx={{
                                                "& .MuiOutlinedInput-root": {
                                                    borderRadius: 3,
                                                }
                                            }}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Autocomplete
                                    multiple
                                    options={roleOptions}
                                    value={roleOptions.filter((opt) =>
                                        form.role_ids.includes(opt.value)
                                    )}
                                    onChange={(event, newValue) => {
                                        setForm(prev => ({
                                            ...prev,
                                            role_ids: newValue.map(item => item.value)
                                        }));
                                    }}
                                    getOptionLabel={(option) => option.label}
                                    renderTags={(selected, getTagProps) =>
                                        selected.map((option, index) => (
                                            <Chip
                                                {...getTagProps({ index })}
                                                label={option.label}
                                                size="small"
                                            />
                                        ))
                                    }
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Roles"
                                            placeholder="Select roles"
                                            size="small"
                                            sx={{
                                                "& .MuiOutlinedInput-root": {
                                                    borderRadius: 3,
                                                }
                                            }}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid size={12}>
                                <TextField
                                    label="Description"
                                    name="description"
                                    size="small"
                                    value={form.description}
                                    onChange={handleChange}
                                    fullWidth
                                    multiline
                                    minRows={2}
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: 3,
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid size={12}>
                                <TextField
                                    label="Address"
                                    name="address"
                                    size="small"
                                    value={form.address}
                                    onChange={handleChange}
                                    fullWidth
                                    multiline
                                    minRows={2}
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: 3,
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 3 }}>
                                <Button
                                    variant="contained"
                                    size="small"
                                    component="label"
                                    fullWidth
                                    sx={{ borderRadius: 3, py: 1.5 }}
                                >
                                    Upload Logo
                                    <input
                                        type="file"
                                        name="logo"
                                        hidden
                                        ref={fileInputRef}     // ✅ ADDED
                                        onChange={handleChange}
                                        accept="image/*"
                                    />
                                </Button>

                                {(form.logoPreview || form.logo_url) && (
                                    <Box sx={{ mt: 2, position: "relative", display: "inline-block" }}>
                                        <Typography variant="body2" sx={{ mb: 1 }}>
                                            Preview:
                                        </Typography>

                                        {/* ✅ REMOVED: Delete IconButton */}

                                        <img
                                            src={form.logoPreview || (form.logo_url ? `${media_url}${form.logo_url}` : '')}
                                            alt="Logo Preview"
                                            style={{
                                                width: 100,
                                                height: 100,
                                                objectFit: "contain",
                                                borderRadius: 10,
                                                border: "1px solid #ccc",
                                                padding: 5,
                                                background: "#fff"
                                            }}
                                        />
                                    </Box>
                                )}
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="error" variant="outlined" size="small">
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleSubmit}
                            color="success"
                            size="small"
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={20} /> : (editMode ? "Update" : "Save")}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* DELETE CONFIRMATION DIALOG */}
                <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
                    <DialogTitle>Confirm Inactive</DialogTitle>
                    <DialogContent dividers>
                        <Box
                            sx={{
                                textAlign: "center",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                p: 2
                            }}
                        >
                            <WarningAmberIcon sx={{ fontSize: 60, color: "error.main", mb: 2 }} />
                            <Typography variant="h6" fontWeight={600}>
                                Are you sure?
                            </Typography>
                            <Typography sx={{ mt: 1 }}>
                                You want to Inactive <b>{selectedRow?.name}</b> Entity
                            </Typography>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
                        <Button color="error" variant="contained" onClick={confirmDelete}>InActive</Button>
                    </DialogActions>
                </Dialog>


                {/* VIEW ENTITY DIALOG */}
                <Dialog open={viewOpen} onClose={handleViewClose} fullWidth maxWidth="md">
                    <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography fontSize={22} fontWeight={600}>
                            Entity Details
                        </Typography>
                        <IconButton onClick={handleViewClose} color="error">
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent dividers>
                        {selectedRow && (
                            <Grid container spacing={3}>
                                {/* Logo + Name */}
                                <Grid item xs={12} md={4} sx={{ textAlign: { xs: "center", md: "left" } }}>
                                    {selectedRow.logo ? (
                                        <img
                                            src={`${media_url}${selectedRow.logo}`}
                                            alt={selectedRow.name}
                                            style={{
                                                width: 140,
                                                height: 140,
                                                objectFit: "contain",
                                                borderRadius: 12,
                                                border: "2px solid #e0e0e0",
                                                padding: 8,
                                                background: "#fafafa",
                                            }}
                                        />
                                    ) : (
                                        <Box
                                            sx={{
                                                width: 140,
                                                height: 140,
                                                borderRadius: 12,
                                                background: "#f5f5f5",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                border: "2px dashed #ccc",
                                                color: "#999",
                                                fontSize: 14,
                                            }}
                                        >
                                            No Logo
                                        </Box>
                                    )}
                                    <Typography variant="h6" sx={{ mt: 2, fontWeight: 600 }}>
                                        {selectedRow.display_name || selectedRow.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {selectedRow.name}
                                    </Typography>
                                </Grid>

                                {/* Details */}
                                <Grid item xs={12} md={8}>
                                    <Box sx={{ display: "grid", gap: 2.5 }}>
                                        <Box>
                                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                                Description
                                            </Typography>
                                            <Typography variant="body1" fontWeight={500}>
                                                {selectedRow.description || "—"}
                                            </Typography>
                                        </Box>

                                        <Box>
                                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                                Address
                                            </Typography>
                                            <Typography variant="body1" fontWeight={500}>
                                                {selectedRow.address || "—"}
                                            </Typography>
                                        </Box>

                                        <Box>
                                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                                Contact Email
                                            </Typography>
                                            <Typography variant="body1" fontWeight={500}>
                                                {selectedRow.contact_email ? (
                                                    <a href={`mailto:${selectedRow.contact_email}`} style={{ color: "#1976d2" }}>
                                                        {selectedRow.contact_email}
                                                    </a>
                                                ) : (
                                                    "—"
                                                )}
                                            </Typography>
                                        </Box>

                                        <Box>
                                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                                Location
                                            </Typography>
                                            <Typography variant="body1" fontWeight={500}>
                                                {selectedRow.location || "—"}
                                            </Typography>
                                        </Box>

                                        <Box>
                                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                                Entity Head
                                            </Typography>
                                            <Typography variant="body1" fontWeight={500}>
                                                {selectedRow.entity_head?.realname ||
                                                    selectedRow.entity_head?.firstname ||
                                                    selectedRow.entity_head ||
                                                    "—"}
                                            </Typography>
                                        </Box>

                                        <Box>
                                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                                Assigned Roles
                                            </Typography>
                                            {selectedRow.roles && selectedRow.roles.length > 0 ? (
                                                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                                                    {selectedRow.roles.map((role) => (
                                                        <Chip
                                                            key={role.id}
                                                            label={role.rolename || role.field_name}
                                                            size="small"
                                                            color="primary"
                                                            variant="outlined"
                                                        />
                                                    ))}
                                                </Box>
                                            ) : (
                                                <Typography variant="body2" color="text.secondary">
                                                    No roles assigned
                                                </Typography>
                                            )}
                                        </Box>

                                        <Box>
                                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                                Created On
                                            </Typography>
                                            <Typography variant="body1" fontWeight={500}>
                                                {selectedRow.created_date
                                                    ? new Date(selectedRow.created_date).toLocaleDateString("en-US", {
                                                        year: "numeric",
                                                        month: "long",
                                                        day: "numeric",
                                                    })
                                                    : "—"}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                            </Grid>
                        )}
                    </DialogContent>
                </Dialog>
            </Box>
        </>
    );
};

export default Entity;