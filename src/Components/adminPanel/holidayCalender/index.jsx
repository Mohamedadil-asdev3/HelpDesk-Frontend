

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
//     CircularProgress
// } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
// import { toast } from "react-toastify";
// import {
//     fetchEntitiesAPI,
//     fetchDepartmentsAPI,
//     fetchLocationsAPI,
//     createHolidayAPI,
//     fetchHolidaysAPI,
//     updateHolidayAPI,
//     deleteHolidayAPI,
// } from "../../../Api";
// import CommonTable from "../../commonTabel";

// const HolidayCalender = () => {
//     const [holidays, setHolidays] = useState([]);
//     const [entities, setEntities] = useState([]);
//     const [departments, setDepartments] = useState([]);
//     const [locations, setLocations] = useState([]);
//     const [loading, setLoading] = useState(true);

//     const [openAddEdit, setOpenAddEdit] = useState(false);
//     const [openDelete, setOpenDelete] = useState(false);
//     const [openView, setOpenView] = useState(false);
//     const [selectedRow, setSelectedRow] = useState(null);
//     const [selectedHoliday, setSelectedHoliday] = useState(null);
//     const [editId, setEditId] = useState(null);

//     const [formData, setFormData] = useState({
//         name: "",
//         date: "",
//         description: "",
//         entity: null,
//         department: null,
//         location: null,
//         status: 1,
//     });

//     const HolidayCalenderColumns = [
//         { id: "serialNo", label: "S.no" },
//         { id: "name", label: "Name" },
//         { id: "date", label: "Date" },
//         { id: "entity", label: "Entity" },
//         { id: "location", label: "Location" },
//         { id: "department", label: "Department" },
//     ];

//     // Load initial data
//     useEffect(() => {
//         loadInitialData();
//     }, []);

//     const loadInitialData = async () => {
//         try {
//             setLoading(true);
//             const [entityRes, locRes, holidayRes] = await Promise.all([
//                 fetchEntitiesAPI(),
//                 fetchLocationsAPI(),
//                 fetchHolidaysAPI(),
//             ]);
//             setEntities(entityRes);
//             setLocations(locRes);
//             setHolidays(holidayRes);
//         } catch (error) {
//             toast.error("Failed to load data");
//             console.error(error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Load departments dynamically when entity changes
//     useEffect(() => {
//         if (formData.entity?.id) {
//             loadDepartments(formData.entity.id);
//         } else {
//             setDepartments([]);
//         }
//     }, [formData.entity]);

//     const loadDepartments = async (entityId) => {
//         try {
//             const res = await fetchDepartmentsAPI(entityId);
//             setDepartments(res);
//         } catch (error) {
//             console.error(error);
//             setDepartments([]);
//         }
//     };

//     const departmentOptions = [
//         { id: null, name: "All Departments" },
//         ...departments.map((d) => ({ id: d.id, name: d.field_name || d.name })),
//     ];

//     const tableRows = holidays.map((holiday, index) => ({
//         id: holiday.id,
//         serialNo: index + 1,
//         name: holiday.name,
//         date: holiday.date,
//         entity: holiday.entity_name || "—",
//         location: holiday.location_name || "—",
//         department: holiday.department_name || "All Departments",
//         originalHoliday: holiday,
//     }));

//     const handleAdd = () => {
//         setEditId(null);
//         setFormData({
//             name: "",
//             date: "",
//             description: "",
//             entity: null,
//             department: null,
//             location: null,
//             status: 1,
//         });
//         setOpenAddEdit(true);
//     };

//     const handleEdit = async (row) => {
//         const holiday = row.originalHoliday;
//         const entityObj = entities.find((e) => e.id === holiday.entity);
//         const locObj = locations.find((l) => l.id === holiday.location);
//         await loadDepartments(holiday.entity);
//         const deptObj =
//             holiday.department
//                 ? departments.find((d) => d.id === holiday.department)
//                 : { id: null, name: "All Departments" };
//         setEditId(holiday.id);
//         setFormData({
//             name: holiday.name || "",
//             date: holiday.date || "",
//             description: holiday.description || "",
//             entity: entityObj,
//             department: deptObj,
//             location: locObj,
//             status: holiday.status || 1,
//         });
//         setOpenAddEdit(true);
//     };

//     const handleView = (row) => {
//         setSelectedHoliday(row.originalHoliday);
//         setOpenView(true);
//     };

//     const handleDelete = (row) => {
//         setSelectedRow(row.originalHoliday);
//         setOpenDelete(true);
//     };

//     const handleSave = async () => {
//         if (!formData.name || !formData.date || !formData.entity || !formData.location) {
//             toast.error("Holiday Name, Date, Entity, and Location are required");
//             return;
//         }

//         // Duplicate check
//         const isDuplicate = holidays.some(
//             (h) =>
//                 h.date === formData.date &&
//                 h.entity === formData.entity.id &&
//                 h.location === formData.location.id &&
//                 (h.department === formData.department?.id || (!h.department && !formData.department?.id)) &&
//                 (!editId || h.id !== editId)
//         );

//         if (isDuplicate) {
//             toast.error(
//                 "A holiday already exists for this entity, location, and department on this date!"
//             );
//             return;
//         }

//         const payload = {
//             name: formData.name,
//             date: formData.date,
//             description: formData.description,
//             entity: formData.entity.id,
//             department: formData.department?.id || null,
//             location: formData.location.id,
//             status: formData.status,
//         };

//         try {
//             if (editId) {
//                 await updateHolidayAPI(editId, payload);
//                 toast.success("Holiday updated successfully");
//             } else {
//                 await createHolidayAPI(payload);
//                 toast.success("Holiday created successfully");
//             }
//             setOpenAddEdit(false);
//             loadInitialData();
//         } catch (error) {
//             if (error.response?.data?.error) {
//                 toast.error(error.response.data.error);
//             } else {
//                 toast.error("Error saving holiday");
//             }
//             console.error(error);
//         }
//     };

//     const confirmDelete = async () => {
//         if (!selectedRow) return;
//         try {
//             await deleteHolidayAPI(selectedRow.id);
//             toast.success("Holiday deleted successfully");
//             setOpenDelete(false);
//             loadData(); // Reload
//         } catch (error) {
//             toast.error("Error deleting holiday");
//             console.error(error);
//         }
//     };

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setFormData((prev) => ({ ...prev, [name]: value }));
//     };

//     const handleStatusChange = (e, checked) => {
//         setFormData((prev) => ({ ...prev, status: checked ? 1 : 0 }));
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
//                             title={"Holiday Management"}
//                             btnName={"Add Holiday"}
//                             addButton={handleAdd}
//                             rows={tableRows}
//                             columns={HolidayCalenderColumns}
//                             onView={handleView}
//                             onEdit={handleEdit}
//                             onDelete={handleDelete}
//                         />
//                     </Grid>
//                 </Grid>
//             </Box>

//             {/* ADD/EDIT DIALOG */}
//             <Dialog open={openAddEdit} onClose={() => setOpenAddEdit(false)} maxWidth="sm" fullWidth>
//                 <DialogTitle sx={{ fontWeight: 600 }}>
//                     {editId ? "Edit Holiday" : "Add Holiday"}
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
//                             <Typography sx={{ mb: 0.5, fontWeight: 500 }}>Holiday Name</Typography>
//                             <TextField
//                                 fullWidth
//                                 required
//                                 placeholder="Enter Holiday Name"
//                                 name="name"
//                                 value={formData.name}
//                                 onChange={handleInputChange}
//                                 sx={{
//                                     "& .MuiOutlinedInput-root": {
//                                         borderRadius: 3,
//                                     }
//                                 }}
//                             />
//                         </Grid>
//                         <Grid size={12}>
//                             <Typography sx={{ mb: 0.5, fontWeight: 500 }}>Date</Typography>
//                             <TextField
//                                 fullWidth
//                                 required
//                                 type="date"
//                                 name="date"
//                                 value={formData.date}
//                                 onChange={handleInputChange}
//                                 sx={{
//                                     "& .MuiOutlinedInput-root": {
//                                         borderRadius: 3,
//                                     }
//                                 }}
//                             />
//                         </Grid>
//                         <Grid size={12}>
//                             <Typography sx={{ mb: 0.5, fontWeight: 500 }}>Entity</Typography>
//                             <Autocomplete
//                                 options={entities}
//                                 getOptionLabel={(option) => option.name || option.field_name || ""}
//                                 value={formData.entity}
//                                 onChange={(e, newValue) => setFormData({ ...formData, entity: newValue })}
//                                 renderInput={(params) => (
//                                     <TextField
//                                         {...params}
//                                         required
//                                         placeholder="Select Entity"
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
//                             <Typography sx={{ mb: 0.5, fontWeight: 500 }}>Location</Typography>
//                             <Autocomplete
//                                 options={locations}
//                                 getOptionLabel={(option) => option.name || option.field_name || ""}
//                                 value={formData.location}
//                                 onChange={(e, newValue) => setFormData({ ...formData, location: newValue })}
//                                 renderInput={(params) => (
//                                     <TextField
//                                         {...params}
//                                         required
//                                         placeholder="Select Location"
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
//                             <Typography sx={{ mb: 0.5, fontWeight: 500 }}>Department</Typography>
//                             <Autocomplete
//                                 options={departmentOptions}
//                                 getOptionLabel={(option) => option.name}
//                                 value={formData.department}
//                                 onChange={(e, newValue) => setFormData({ ...formData, department: newValue })}
//                                 renderInput={(params) => (
//                                     <TextField
//                                         {...params}
//                                         placeholder="Select Department"
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
//                             <Typography sx={{ mb: 0.5, fontWeight: 500 }}>Description</Typography>
//                             <TextField
//                                 multiline
//                                 rows={3}
//                                 fullWidth
//                                 placeholder="Enter Description"
//                                 name="description"
//                                 value={formData.description}
//                                 onChange={handleInputChange}
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
//                                         checked={formData.status === 1}
//                                         onChange={handleStatusChange}
//                                     />
//                                 }
//                                 label="Active"
//                             />
//                         </Grid>
//                     </Grid>
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={() => setOpenAddEdit(false)} color="error" variant="outlined" size="small">
//                         Cancel
//                     </Button>
//                     <Button variant="contained" onClick={handleSave} color="success" size="small">
//                         {editId ? "Update" : "Add"}
//                     </Button>
//                 </DialogActions>
//             </Dialog>

//             {/* DELETE DIALOG */}
//             <Dialog open={openDelete} onClose={() => setOpenDelete(false)} maxWidth="xs" fullWidth>
//                 <DialogTitle sx={{ fontWeight: 600 }}>Delete Holiday</DialogTitle>
//                 <DialogContent dividers>
//                     <Typography>
//                         Are you sure you want to delete holiday{" "}
//                         <b>{selectedRow?.name}</b>?
//                     </Typography>
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={() => setOpenDelete(false)}>Cancel</Button>
//                     <Button variant="contained" color="error" onClick={confirmDelete}>
//                         Delete
//                     </Button>
//                 </DialogActions>
//             </Dialog>

//             {/* VIEW DIALOG */}
//             <Dialog open={openView} onClose={() => setOpenView(false)} maxWidth="sm" fullWidth>
//                 <DialogTitle sx={{ fontWeight: 600 }}>
//                     Holiday Details
//                     <IconButton
//                         onClick={() => setOpenView(false)}
//                         sx={{ position: "absolute", right: 10, top: 10 }}
//                     >
//                         <CloseIcon />
//                     </IconButton>
//                 </DialogTitle>
//                 <DialogContent dividers>
//                     <Grid container spacing={2}>
//                         <Grid size={12}>
//                             <Typography><strong>Name:</strong> {selectedHoliday?.name || "—"}</Typography>
//                         </Grid>
//                         <Grid size={12}>
//                             <Typography><strong>Date:</strong> {selectedHoliday?.date || "—"}</Typography>
//                         </Grid>
//                         <Grid size={12}>
//                             <Typography><strong>Entity:</strong> {selectedHoliday?.entity_name || "—"}</Typography>
//                         </Grid>
//                         <Grid size={12}>
//                             <Typography><strong>Location:</strong> {selectedHoliday?.location_name || "—"}</Typography>
//                         </Grid>
//                         <Grid size={12}>
//                             <Typography><strong>Department:</strong> {selectedHoliday?.department_name || "All Departments"}</Typography>
//                         </Grid>
//                         <Grid size={12}>
//                             <Typography><strong>Description:</strong> {selectedHoliday?.description || "—"}</Typography>
//                         </Grid>
//                         <Grid size={12}>
//                             <Typography><strong>Status:</strong> {selectedHoliday?.status === 1 ? "Active" : "Inactive"}</Typography>
//                         </Grid>
//                     </Grid>
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={() => setOpenView(false)} variant="contained">
//                         Close
//                     </Button>
//                 </DialogActions>
//             </Dialog>
//         </>
//     );
// };

// export default HolidayCalender;



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
    Chip
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";
import {
    fetchEntitiesAPI,
    fetchDepartmentsAPI,
    fetchLocationsAPI,
    createHolidayAPI,
    fetchHolidaysAPI,
    updateHolidayAPI,
    deleteHolidayAPI,
} from "../../../Api";
import CommonTable from "../../commonTabel";

const HolidayCalender = () => {
    const [holidays, setHolidays] = useState([]);
    const [entities, setEntities] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);

    const [openAddEdit, setOpenAddEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [openView, setOpenView] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [selectedHoliday, setSelectedHoliday] = useState(null);
    const [editId, setEditId] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        date: "",
        description: "",
        entity: [], // ✅ Changed to array for multi-select
        department: null,
        location: null,
        status: 1,
    });

    const HolidayCalenderColumns = [
        { id: "serialNo", label: "S.no" },
        { id: "name", label: "Name" },
        { id: "date", label: "Date" },
        { id: "entity", label: "Entity" },
        { id: "location", label: "Location" },
        { id: "department", label: "Department" },
    ];

    // Load initial data
    useEffect(() => {
        loadInitialData();
    }, []);

    const loadInitialData = async () => {
        try {
            setLoading(true);
            const [entityRes, deptRes, locRes, holidayRes] = await Promise.all([
                fetchEntitiesAPI(),
                fetchDepartmentsAPI(), // ✅ Load all departments
                fetchLocationsAPI(), // ✅ Load all locations
                fetchHolidaysAPI(),
            ]);
            setEntities(entityRes);
            setDepartments(deptRes);
            setLocations(locRes);
            setHolidays(holidayRes);
        } catch (error) {
            toast.error("Failed to load data");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const departmentOptions = [
        { id: null, name: "" },
        ...departments.map((d) => ({ id: d.id, name: d.field_name || d.name })),
    ];

    const locationOptions = locations.map((l) => ({ id: l.id, name: l.field_name || l.name }));

    const tableRows = holidays.map((holiday, index) => ({
        id: holiday.id,
        serialNo: index + 1,
        name: holiday.name,
        date: holiday.date,
        entity: (holiday.entity_names || []).join(', ') || "—", // ✅ Handle multiple entities
        location: holiday.location_name || "—",
        department: holiday.department_name || "All Departments",
        originalHoliday: holiday,
    }));

    const handleAdd = () => {
        setEditId(null);
        setFormData({
            name: "",
            date: "",
            description: "",
            entity: [], // ✅ Empty array
            department: null,
            location: null,
            status: 1,
        });
        setOpenAddEdit(true);
    };

    const handleEdit = async (row) => {
        const holiday = row.originalHoliday;
        // ✅ Set multiple entities
        const selectedEntities = entities.filter((e) => holiday.entity_ids?.includes(e.id)) || [];
        const locObj = locations.find((l) => l.id === holiday.location) || null;
        const deptObj = holiday.department
            ? departments.find((d) => d.id === holiday.department)
            : { id: null, name: "All Departments" };
        setEditId(holiday.id);
        setFormData({
            name: holiday.name || "",
            date: holiday.date || "",
            description: holiday.description || "",
            entity: selectedEntities,
            department: deptObj,
            location: locObj,
            status: holiday.status || 1,
        });
        setOpenAddEdit(true);
    };

    const handleView = (row) => {
        setSelectedHoliday(row.originalHoliday);
        setOpenView(true);
    };

    const handleDelete = (row) => {
        setSelectedRow(row.originalHoliday);
        setOpenDelete(true);
    };

    const handleSave = async () => {
        if (!formData.name || !formData.date || !formData.entity.length || !formData.location) {
            toast.error("Holiday Name, Date, at least one Entity, and Location are required");
            return;
        }

        // ✅ Duplicate check with overlap for multiple entities
        const selectedEntityIds = formData.entity.map(e => e.id);
        const isDuplicate = holidays.some(
            (h) =>
                h.date === formData.date &&
                h.location === formData.location?.id &&
                (h.department === formData.department?.id || (!h.department && !formData.department?.id)) &&
                selectedEntityIds.some(id => h.entity_ids?.includes(id)) && // Overlap check
                (!editId || h.id !== editId)
        );

        if (isDuplicate) {
            toast.error(
                "A holiday already exists for one or more selected entities, location, and department on this date!"
            );
            return;
        }

        const payload = {
            name: formData.name,
            date: formData.date,
            description: formData.description,
            entity_ids: selectedEntityIds, // ✅ Send as array
            department: formData.department?.id || null,
            location: formData.location.id,
            status: formData.status,
        };

        try {
            if (editId) {
                await updateHolidayAPI(editId, payload);
                toast.success("Holiday updated successfully");
            } else {
                await createHolidayAPI(payload);
                toast.success("Holiday created successfully");
            }
            setOpenAddEdit(false);
            loadInitialData();
        } catch (error) {
            if (error.response?.data?.error) {
                toast.error(error.response.data.error);
            } else {
                toast.error("Error saving holiday");
            }
            console.error(error);
        }
    };

    const confirmDelete = async () => {
        if (!selectedRow) return;
        try {
            await deleteHolidayAPI(selectedRow.id);
            toast.success("Holiday deleted successfully");
            setOpenDelete(false);
            loadInitialData(); // Reload
        } catch (error) {
            toast.error("Error deleting holiday");
            console.error(error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleEntityChange = (e, newValue) => {
        setFormData((prev) => ({ ...prev, entity: newValue })); // ✅ Handles array
    };

    const handleStatusChange = (e, checked) => {
        setFormData((prev) => ({ ...prev, status: checked ? 1 : 2 })); // ✅ Fixed to 2 for Inactive
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
                            title={"Holiday Management"}
                            btnName={"Add Holiday"}
                            addButton={handleAdd}
                            rows={tableRows}
                            columns={HolidayCalenderColumns}
                            onView={handleView}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    </Grid>
                </Grid>
            </Box>

            {/* ADD/EDIT DIALOG */}
            <Dialog open={openAddEdit} onClose={() => setOpenAddEdit(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 600 }}>
                    {editId ? "Edit Holiday" : "Add Holiday"}
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
                            <Typography sx={{ mb: 0.5, fontWeight: 500 }}>Holiday Name</Typography>
                            <TextField
                                fullWidth
                                required
                                placeholder="Enter Holiday Name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: 3,
                                    }
                                }}
                            />
                        </Grid>
                        <Grid size={12}>
                            <Typography sx={{ mb: 0.5, fontWeight: 500 }}>Date</Typography>
                            <TextField
                                fullWidth
                                required
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleInputChange}
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: 3,
                                    }
                                }}
                            />
                        </Grid>
                        <Grid size={12}>
                            <Typography sx={{ mb: 0.5, fontWeight: 500 }}>Entity</Typography>
                            <Autocomplete
                                multiple // ✅ Enable multi-select
                                options={entities}
                                getOptionLabel={(option) => option.name || option.field_name || ""}
                                value={formData.entity}
                                onChange={handleEntityChange}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        required
                                        placeholder="Select Entities (multiple)"
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
                            <Typography sx={{ mb: 0.5, fontWeight: 500 }}>Location</Typography>
                            <Autocomplete
                                options={locationOptions} // ✅ Show all locations
                                getOptionLabel={(option) => option.name}
                                value={formData.location}
                                onChange={(e, newValue) => setFormData({ ...formData, location: newValue })}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        required
                                        placeholder="Select Location"
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
                            <Typography sx={{ mb: 0.5, fontWeight: 500 }}>Department</Typography>
                            <Autocomplete
                                options={departmentOptions} // ✅ Show all departments
                                getOptionLabel={(option) => option.name}
                                value={formData.department}
                                onChange={(e, newValue) => setFormData({ ...formData, department: newValue })}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        placeholder="Select Department"
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
                            <Typography sx={{ mb: 0.5, fontWeight: 500 }}>Description</Typography>
                            <TextField
                                multiline
                                rows={3}
                                fullWidth
                                placeholder="Enter Description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
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
                                        checked={formData.status === 1}
                                        onChange={handleStatusChange}
                                    />
                                }
                                label="Active"
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenAddEdit(false)} color="error" variant="outlined" size="small">
                        Cancel
                    </Button>
                    <Button variant="contained" onClick={handleSave} color="success" size="small">
                        {editId ? "Update" : "Add"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* DELETE DIALOG */}
            <Dialog open={openDelete} onClose={() => setOpenDelete(false)} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ fontWeight: 600 }}>Delete Holiday</DialogTitle>
                <DialogContent dividers>
                    <Typography>
                        Are you sure you want to delete holiday{" "}
                        <b>{selectedRow?.name}</b>?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDelete(false)}>Cancel</Button>
                    <Button variant="contained" color="error" onClick={confirmDelete}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            {/* VIEW DIALOG */}
            <Dialog open={openView} onClose={() => setOpenView(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 600 }}>
                    Holiday Details
                    <IconButton
                        onClick={() => setOpenView(false)}
                        sx={{ position: "absolute", right: 10, top: 10 }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <Grid container spacing={2}>
                        <Grid size={12}>
                            <Typography><strong>Name:</strong> {selectedHoliday?.name || "—"}</Typography>
                        </Grid>
                        <Grid size={12}>
                            <Typography><strong>Date:</strong> {selectedHoliday?.date || "—"}</Typography>
                        </Grid>
                        <Grid size={12}>
                            <Typography><strong>Entities:</strong></Typography> {/* ✅ Plural */}
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 1 }}>
                                {(selectedHoliday?.entity_names || []).map((entityName, idx) => (
                                    <Chip
                                        key={idx}
                                        label={entityName}
                                        size="small"
                                        variant="outlined"
                                        color="primary"
                                    />
                                ))}
                                {selectedHoliday?.entity_names?.length === 0 && <Typography variant="body2" color="text.secondary">—</Typography>}
                            </Box>
                        </Grid>
                        <Grid size={12}>
                            <Typography><strong>Location:</strong> {selectedHoliday?.location_name || "—"}</Typography>
                        </Grid>
                        <Grid size={12}>
                            <Typography><strong>Department:</strong> {selectedHoliday?.department_name || "All Departments"}</Typography>
                        </Grid>
                        <Grid size={12}>
                            <Typography><strong>Description:</strong> {selectedHoliday?.description || "—"}</Typography>
                        </Grid>
                        <Grid size={12}>
                            <Typography><strong>Status:</strong> {selectedHoliday?.status === 1 ? "Active" : "Inactive"}</Typography>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenView(false)} variant="contained">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default HolidayCalender;