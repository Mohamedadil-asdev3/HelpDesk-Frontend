// import { useState, useEffect } from "react";
// import { Box, Grid, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, IconButton, Autocomplete, Typography, Switch, FormControlLabel, CircularProgress, Chip } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
// import { toast } from "react-toastify";
// import { fetchDepartmentsAPI, fetchEntitiesAPI, saveDepartmentAPI, deleteDepartmentAPI, } from "../../../Api";
// import CommonTable from "../../commonTabel";

// const Department = () => {

//     const [departments, setDepartments] = useState([]);
//     const [entities, setEntities] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [currentPage, setCurrentPage] = useState(1);
//     const itemsPerPage = 7;
//     const [openAddEdit, setOpenAddEdit] = useState(false);
//     const [openInactive, setOpenInactive] = useState(false);
//     const [viewDept, setViewDept] = useState(null);
//     const [editingId, setEditingId] = useState(null);
//     const [formData, setFormData] = useState({
//         entity: null,
//         field_name: "",
//         is_active: "Y",
//     });

//     const DepartmentColumns = [
//         { id: "serialNo", label: "S.no" },
//         { id: "entity", label: "Entity" },
//         { id: "department", label: "Department" },
//         { id: "active", label: "Active" },
//     ];

//     // Load data
//     useEffect(() => {
//         loadData();
//     }, []);

//     const loadData = async () => {
//         try {
//             setLoading(true);
//             const [depsData, entsData] = await Promise.all([
//                 fetchDepartmentsAPI(),
//                 fetchEntitiesAPI()
//             ]);
//             setDepartments(depsData);
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
//     const currentDepartments = departments.slice(indexOfFirstItem, indexOfLastItem);
//     const totalPages = Math.ceil(departments.length / itemsPerPage);

//     const tableRows = currentDepartments.map((dept, index) => {
//         const globalIndex = (currentPage - 1) * itemsPerPage + index + 1;
//         const entityName = entities.find((ent) => ent.id === dept.entity_id)?.name || "—";
//         return {
//             id: dept.id,
//             serialNo: globalIndex,
//             entity: entityName,
//             department: dept.field_name,
//             active: dept.is_active === "Y" ? "Yes" : "No",
//             originalDept: dept
//         };
//     });

//     const handleAddDepartment = () => {
//         setEditingId(null);
//         setFormData({
//             entity: null,
//             field_name: "",
//             is_active: "Y",
//         });
//         setOpenAddEdit(true);
//     };

//     const handleEditDepartment = (row) => {
//         const dept = row.originalDept;
//         setEditingId(dept.id);
//         setFormData({
//             entity: entities.find((ent) => ent.id === dept.entity_id) || null,
//             field_name: dept.field_name || "",
//             is_active: dept.is_active || "Y",
//         });
//         setOpenAddEdit(true);
//     };

//     const handleViewDepartment = (row) => {
//         setViewDept(row.originalDept);
//     };

//     const handleInactive = (row) => {
//         setSelectedRow(row.originalDept);
//         setOpenInactive(true);
//     };

//     const [selectedRow, setSelectedRow] = useState(null);

//     const handleSave = async () => {
//         if (!formData.entity || !formData.field_name) {
//             toast.error("Please fill all required fields");
//             return;
//         }

//         const payload = {
//             entity_id: parseInt(formData.entity.id),
//             field_type: "Department",
//             field_name: formData.field_name,
//             is_active: formData.is_active,
//         };

//         try {
//             await saveDepartmentAPI(payload, editingId);
//             toast.success(editingId ? "Department updated" : "Department created");
//             setOpenAddEdit(false);
//             setFormData({
//                 entity: null,
//                 field_name: "",
//                 is_active: "Y",
//             });
//             setEditingId(null);
//             loadData();
//         } catch (error) {
//             toast.error(error.message || "Error saving department");
//         }
//     };

//     const confirmInactive = async () => {
//         if (!selectedRow) return;
//         try {
//             await deleteDepartmentAPI(selectedRow.id);
//             toast.success("Department deactivated");
//             setOpenInactive(false);
//             loadData();
//         } catch (error) {
//             toast.error(error.message || "Failed to deactivate department");
//         }
//     };

//     const handleChange = (e) => {
//         const { name, value, checked } = e.target;
//         if (name === "is_active") {
//             setFormData((prev) => ({ ...prev, is_active: checked ? "Y" : "N" }));
//         } else {
//             setFormData((prev) => ({ ...prev, [name]: value }));
//         }
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
//                             title={"Department Management"}
//                             btnName={"Add Department"}
//                             addButton={handleAddDepartment}
//                             rows={tableRows}
//                             columns={DepartmentColumns}
//                             onView={handleViewDepartment}
//                             onEdit={handleEditDepartment}
//                             onDelete={handleInactive}
//                         />
//                     </Grid>
//                 </Grid>
//             </Box>

//             <Dialog open={openAddEdit} onClose={() => setOpenAddEdit(false)} maxWidth="sm" fullWidth>
//                 <DialogTitle sx={{ fontWeight: 600 }}>
//                     {editingId ? "Edit Department" : "Add Department"}
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
//                                 onChange={(e, newValue) =>
//                                     setFormData({ ...formData, entity: newValue })
//                                 }
//                                 renderInput={(params) => (
//                                     <TextField
//                                         {...params}
//                                         placeholder="Select Entity"
//                                         required
//                                         size="small"
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
//                             <Typography sx={{ fontWeight: 500, mb: 0.5 }}>Department</Typography>
//                             <TextField
//                                 fullWidth
//                                 label="Department Name"
//                                 value={formData.field_name}
//                                 size="small"
//                                 onChange={(e) => setFormData({ ...formData, field_name: e.target.value })}
//                                 placeholder="Enter department name"
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
//                                         onChange={handleChange}
//                                         name="is_active"
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

//             <Dialog open={openInactive} onClose={() => setOpenInactive(false)} maxWidth="xs" fullWidth>
//                 <DialogTitle sx={{ fontWeight: 600 }}>
//                     Inactivate Department
//                 </DialogTitle>
//                 <DialogContent dividers>
//                     <Typography>
//                         Are you sure you want to mark{" "}
//                         <b>{selectedRow?.field_name}</b> as Inactive?
//                     </Typography>
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={() => setOpenInactive(false)}>Cancel</Button>
//                     <Button variant="contained" color="error" onClick={confirmInactive}>
//                         Inactivate
//                     </Button>
//                 </DialogActions>
//             </Dialog>
            
//             {viewDept && (
//                 <Dialog open={true} onClose={() => setViewDept(null)} fullWidth maxWidth="sm">
//                     <DialogTitle sx={{ py: 2 }}>
//                         <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                             <Typography variant="h6" fontWeight={600}>
//                                 Department Details
//                             </Typography>
//                             <IconButton onClick={() => setViewDept(null)} size="small">
//                                 <CloseIcon />
//                             </IconButton>
//                         </Box>
//                     </DialogTitle>
//                     <DialogContent dividers sx={{ bgcolor: "#fafafa", py: 4 }}>
//                         <Grid container spacing={5}>
//                             <Grid size={4} sx={{ textAlign: "center" }}>
//                                 <Box
//                                     sx={{
//                                         width: 130,
//                                         height: 130,
//                                         borderRadius: "50%",
//                                         background: "linear-gradient(135deg, #42a5f5 0%, #1976d2 100%)",
//                                         display: "flex",
//                                         alignItems: "center",
//                                         justifyContent: "center",
//                                         margin: "0 auto",
//                                         color: "white",
//                                         fontSize: 56,
//                                         fontWeight: "bold",
//                                         boxShadow: 8,
//                                         mb: 3,
//                                     }}
//                                 >
//                                     {viewDept.field_name?.[0]?.toUpperCase() || "D"}
//                                 </Box>
//                                 <Typography variant="h5" fontWeight={700} color="primary.main" gutterBottom>
//                                     {viewDept.field_name || "—"}
//                                 </Typography>
//                                 <Chip
//                                     label={viewDept.is_active === "Y" ? "Active" : "Inactive"}
//                                     color={viewDept.is_active === "Y" ? "success" : "error"}
//                                     size="medium"
//                                     sx={{ fontWeight: 600, px: 2, height: 36, mt: 2 }}
//                                 />
//                             </Grid>
//                             <Grid size={8}>
//                                 <Box sx={{ display: "grid", gap: 3.5, }}>
//                                     <Box>
//                                         <Typography variant="body2" color="text.secondary" gutterBottom fontWeight={500}>
//                                             Entity
//                                         </Typography>
//                                         <Typography variant="body1" fontWeight={600} color="primary">
//                                             {entities.find((ent) => ent.id === viewDept.entity_id)?.name || "—"}
//                                         </Typography>
//                                     </Box>
//                                     <Box>
//                                         <Typography variant="body2" color="text.secondary" gutterBottom fontWeight={500}>
//                                             Field Type
//                                         </Typography>
//                                         <Typography variant="body1" fontWeight={600}>
//                                             {viewDept.field_type || "—"}
//                                         </Typography>
//                                     </Box>
//                                     <Box>
//                                         <Typography variant="body2" color="text.secondary" gutterBottom fontWeight={500}>
//                                             Field Value
//                                         </Typography>
//                                         <Typography variant="body1" fontWeight={600}>
//                                             {viewDept.field_values || "—"}
//                                         </Typography>
//                                     </Box>
//                                     {viewDept.created_date && (
//                                         <Box>
//                                             <Typography variant="body2" color="text.secondary" gutterBottom fontWeight={500}>
//                                                 Created On
//                                             </Typography>
//                                             <Typography variant="body1" fontWeight={500}>
//                                                 {new Date(viewDept.created_date).toLocaleDateString("en-US", {
//                                                     year: "numeric",
//                                                     month: "long",
//                                                     day: "numeric",
//                                                     hour: "2-digit",
//                                                     minute: "2-digit",
//                                                 })}
//                                             </Typography>
//                                         </Box>
//                                     )}
//                                 </Box>
//                             </Grid>
//                         </Grid>
//                     </DialogContent>
//                 </Dialog>
//             )}
//         </>
//     );
// };

// export default Department;

// import { useState, useEffect } from "react";
// import { Box, Grid, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, IconButton, Autocomplete, Typography, Switch, FormControlLabel, CircularProgress, Chip } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
// import { toast } from "react-toastify";
// import { fetchDepartmentsAPI, fetchEntitiesAPI, saveDepartmentAPI, deleteDepartmentAPI, } from "../../../Api";
// import CommonTable from "../../commonTabel";

// const Department = () => {

//     const [departments, setDepartments] = useState([]);
//     const [entities, setEntities] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [currentPage, setCurrentPage] = useState(1);
//     const itemsPerPage = 7;
//     const [openAddEdit, setOpenAddEdit] = useState(false);
//     const [openInactive, setOpenInactive] = useState(false);
//     const [viewOpen, setViewOpen] = useState(false); // ✅ Added state for view dialog
//     const [viewDept, setViewDept] = useState(null);
//     const [editingId, setEditingId] = useState(null);
//     const [saving, setSaving] = useState(false); // ✅ Added loading for save/edit
//     const [formData, setFormData] = useState({
//         entity: null,
//         field_name: "",
//         is_active: "Y",
//     });

//     const DepartmentColumns = [
//         { id: "serialNo", label: "S.no" },
//         { id: "entity", label: "Entity" },
//         { id: "department", label: "Department" },
//         { id: "active", label: "Active" },
//     ];

//     // Load data
//     useEffect(() => {
//         loadData();
//     }, []);

//     const loadData = async () => {
//         try {
//             setLoading(true);
//             const [depsData, entsData] = await Promise.all([
//                 fetchDepartmentsAPI(),
//                 fetchEntitiesAPI()
//             ]);
//             setDepartments(depsData);
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
//     const currentDepartments = departments.slice(indexOfFirstItem, indexOfLastItem);
//     const totalPages = Math.ceil(departments.length / itemsPerPage);

//     const tableRows = currentDepartments.map((dept, index) => {
//         const globalIndex = (currentPage - 1) * itemsPerPage + index + 1;
//         const entityName = entities.find((ent) => ent.id === dept.entity_id)?.name || "—";
//         return {
//             id: dept.id,
//             serialNo: globalIndex,
//             entity: entityName,
//             department: dept.field_name,
//             active: dept.is_active === "Y" ? "Yes" : "No",
//             originalDept: dept
//         };
//     });

//     const handleAddDepartment = () => {
//         setEditingId(null);
//         setFormData({
//             entity: null,
//             field_name: "",
//             is_active: "Y",
//         });
//         setOpenAddEdit(true);
//     };

//     const handleEditDepartment = (row) => {
//         const dept = row.originalDept;
//         setEditingId(dept.id);
//         setFormData({
//             entity: entities.find((ent) => ent.id === dept.entity_id) || null,
//             field_name: dept.field_name || "",
//             is_active: dept.is_active || "Y",
//         });
//         setOpenAddEdit(true);
//     };

//     const handleViewDepartment = (row) => {
//         setViewDept(row.originalDept);
//         setViewOpen(true); // ✅ Set open state
//     };

//     const handleInactive = (row) => {
//         setSelectedRow(row.originalDept);
//         setOpenInactive(true);
//     };

//     const [selectedRow, setSelectedRow] = useState(null);

//     const handleSave = async () => {
//         if (!formData.entity || !formData.field_name) {
//             toast.error("Please fill all required fields");
//             return;
//         }

//         const payload = {
//             entity_id: parseInt(formData.entity.id),
//             field_type: "Department",
//             field_name: formData.field_name,
//             is_active: formData.is_active,
//         };

//         // ✅ For update, include ID in payload (common API pattern if second param not handled)
//         if (editingId) {
//             payload.id = editingId;
//         }

//         setSaving(true); // ✅ Start loading
//         try {
//             console.log("Saving payload:", payload, "ID:", editingId); // ✅ Debug log
//             await saveDepartmentAPI(payload, editingId);
//             toast.success(editingId ? "Department updated" : "Department created");
//             setOpenAddEdit(false);
//             setFormData({
//                 entity: null,
//                 field_name: "",
//                 is_active: "Y",
//             });
//             setEditingId(null);
//             loadData();
//         } catch (error) {
//             console.error("Save error:", error); // ✅ Debug log
//             toast.error(error.message || "Error saving department");
//         } finally {
//             setSaving(false); // ✅ Stop loading
//         }
//     };

//     const confirmInactive = async () => {
//         if (!selectedRow) return;
//         try {
//             await deleteDepartmentAPI(selectedRow.id);
//             toast.success("Department deactivated");
//             setOpenInactive(false);
//             loadData();
//         } catch (error) {
//             toast.error(error.message || "Failed to deactivate department");
//         }
//     };

//     const handleChange = (e) => {
//         const { name, value, checked } = e.target;
//         if (name === "is_active") {
//             setFormData((prev) => ({ ...prev, is_active: checked ? "Y" : "N" }));
//         } else {
//             setFormData((prev) => ({ ...prev, [name]: value }));
//         }
//     };

//     const handleEntityChange = (e, newValue) => {
//         setFormData((prev) => ({ ...prev, entity: newValue }));
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
//                             title={"Department Management"}
//                             btnName={"Add Department"}
//                             addButton={handleAddDepartment}
//                             rows={tableRows}
//                             columns={DepartmentColumns}
//                             onView={handleViewDepartment}
//                             onEdit={handleEditDepartment}
//                             onDelete={handleInactive}
//                         />
//                     </Grid>
//                 </Grid>
//             </Box>

//             <Dialog open={openAddEdit} onClose={() => setOpenAddEdit(false)} maxWidth="sm" fullWidth>
//                 <DialogTitle sx={{ fontWeight: 600 }}>
//                     {editingId ? "Edit Department" : "Add Department"}
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
//                                 onChange={handleEntityChange} // ✅ Dedicated handler
//                                 renderInput={(params) => (
//                                     <TextField
//                                         {...params}
//                                         placeholder="Select Entity"
//                                         required
//                                         size="small"
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
//                             <Typography sx={{ fontWeight: 500, mb: 0.5 }}>Department</Typography>
//                             <TextField
//                                 fullWidth
//                                 label="Department Name"
//                                 value={formData.field_name}
//                                 size="small"
//                                 onChange={(e) => setFormData({ ...formData, field_name: e.target.value })}
//                                 placeholder="Enter department name"
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
//                                         onChange={handleChange}
//                                         name="is_active"
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
//                     <Button 
//                         variant="contained" 
//                         onClick={handleSave} 
//                         color="success" 
//                         size="small"
//                         disabled={saving} // ✅ Disable during save
//                     >
//                         {saving ? <CircularProgress size={20} color="inherit" /> : (editingId ? "Update" : "Add")}
//                     </Button>
//                 </DialogActions>
//             </Dialog>

//             <Dialog open={openInactive} onClose={() => setOpenInactive(false)} maxWidth="xs" fullWidth>
//                 <DialogTitle sx={{ fontWeight: 600 }}>
//                     Inactivate Department
//                 </DialogTitle>
//                 <DialogContent dividers>
//                     <Typography>
//                         Are you sure you want to mark{" "}
//                         <b>{selectedRow?.field_name}</b> as Inactive?
//                     </Typography>
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={() => setOpenInactive(false)}>Cancel</Button>
//                     <Button variant="contained" color="error" onClick={confirmInactive}>
//                         Inactivate
//                     </Button>
//                 </DialogActions>
//             </Dialog>
            
//             {/* ✅ Fixed view dialog with proper open state */}
//             {viewDept && (
//                 <Dialog open={viewOpen} onClose={() => { setViewOpen(false); setViewDept(null); }} fullWidth maxWidth="sm">
//                     <DialogTitle sx={{ py: 2 }}>
//                         <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                             <Typography variant="h6" fontWeight={600}>
//                                 Department Details
//                             </Typography>
//                             <IconButton onClick={() => { setViewOpen(false); setViewDept(null); }} size="small">
//                                 <CloseIcon />
//                             </IconButton>
//                         </Box>
//                     </DialogTitle>
//                     <DialogContent dividers sx={{ bgcolor: "#fafafa", py: 4 }}>
//                         <Grid container spacing={5}>
//                             <Grid size={4} sx={{ textAlign: "center" }}>
//                                 <Box
//                                     sx={{
//                                         width: 130,
//                                         height: 130,
//                                         borderRadius: "50%",
//                                         background: "linear-gradient(135deg, #42a5f5 0%, #1976d2 100%)",
//                                         display: "flex",
//                                         alignItems: "center",
//                                         justifyContent: "center",
//                                         margin: "0 auto",
//                                         color: "white",
//                                         fontSize: 56,
//                                         fontWeight: "bold",
//                                         boxShadow: 8,
//                                         mb: 3,
//                                     }}
//                                 >
//                                     {viewDept.field_name?.[0]?.toUpperCase() || "D"}
//                                 </Box>
//                                 <Typography variant="h5" fontWeight={700} color="primary.main" gutterBottom>
//                                     {viewDept.field_name || "—"}
//                                 </Typography>
//                                 <Chip
//                                     label={viewDept.is_active === "Y" ? "Active" : "Inactive"}
//                                     color={viewDept.is_active === "Y" ? "success" : "error"}
//                                     size="medium"
//                                     sx={{ fontWeight: 600, px: 2, height: 36, mt: 2 }}
//                                 />
//                             </Grid>
//                             <Grid size={8}>
//                                 <Box sx={{ display: "grid", gap: 3.5, }}>
//                                     <Box>
//                                         <Typography variant="body2" color="text.secondary" gutterBottom fontWeight={500}>
//                                             Entity
//                                         </Typography>
//                                         <Typography variant="body1" fontWeight={600} color="primary">
//                                             {entities.find((ent) => ent.id === viewDept.entity_id)?.name || "—"}
//                                         </Typography>
//                                     </Box>
//                                     <Box>
//                                         <Typography variant="body2" color="text.secondary" gutterBottom fontWeight={500}>
//                                             Field Type
//                                         </Typography>
//                                         <Typography variant="body1" fontWeight={600}>
//                                             {viewDept.field_type || "—"}
//                                         </Typography>
//                                     </Box>
//                                     <Box>
//                                         <Typography variant="body2" color="text.secondary" gutterBottom fontWeight={500}>
//                                             Field Value
//                                         </Typography>
//                                         <Typography variant="body1" fontWeight={600}>
//                                             {viewDept.field_values || "—"}
//                                         </Typography>
//                                     </Box>
//                                     {viewDept.created_date && (
//                                         <Box>
//                                             <Typography variant="body2" color="text.secondary" gutterBottom fontWeight={500}>
//                                                 Created On
//                                             </Typography>
//                                             <Typography variant="body1" fontWeight={500}>
//                                                 {new Date(viewDept.created_date).toLocaleDateString("en-US", {
//                                                     year: "numeric",
//                                                     month: "long",
//                                                     day: "numeric",
//                                                     hour: "2-digit",
//                                                     minute: "2-digit",
//                                                 })}
//                                             </Typography>
//                                         </Box>
//                                     )}
//                                 </Box>
//                             </Grid>
//                         </Grid>
//                     </DialogContent>
//                 </Dialog>
//             )}
//         </>
//     );
// };

// export default Department;

import { useState, useEffect } from "react";
import { Box, Grid, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, IconButton, Autocomplete, Typography, Switch, FormControlLabel, CircularProgress, Chip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";
import { fetchDepartmentsAPI, fetchEntitiesAPI, saveDepartmentAPI, deleteDepartmentAPI, } from "../../../Api";
import CommonTable from "../../commonTabel";

const Department = () => {

    const [departments, setDepartments] = useState([]);
    const [entities, setEntities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 7;
    const [openAddEdit, setOpenAddEdit] = useState(false);
    const [openInactive, setOpenInactive] = useState(false);
    const [viewOpen, setViewOpen] = useState(false); // ✅ Added state for view dialog
    const [viewDept, setViewDept] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [saving, setSaving] = useState(false); // ✅ Added loading for save/edit
    const [formData, setFormData] = useState({
        entity: [], // ✅ Changed to array for multi-select
        field_name: "",
        is_active: "Y",
    });

    const DepartmentColumns = [
        { id: "serialNo", label: "S.no" },
        { id: "entity", label: "Entity" },
        { id: "department", label: "Department" },
        { id: "active", label: "Active" },
    ];

    // Load data
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [depsData, entsData] = await Promise.all([
                fetchDepartmentsAPI(),
                fetchEntitiesAPI()
            ]);
            setDepartments(depsData);
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
    const currentDepartments = departments.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(departments.length / itemsPerPage);

    const tableRows = currentDepartments.map((dept, index) => {
        const globalIndex = (currentPage - 1) * itemsPerPage + index + 1;
        // ✅ Handle multiple entities: join names or render chips
        const entityNames = dept.entity_names || []; // Assuming API returns entity_names as array
        const entityDisplay = entityNames.length > 0 ? entityNames.join(', ') : "—";
        return {
            id: dept.id,
            serialNo: globalIndex,
            entity: entityDisplay, // ✅ Updated for multi-entity
            department: dept.field_name,
            active: dept.is_active === "Y" ? "Yes" : "No",
            originalDept: dept
        };
    });

    const handleAddDepartment = () => {
        setEditingId(null);
        setFormData({
            entity: [], // ✅ Empty array
            field_name: "",
            is_active: "Y",
        });
        setOpenAddEdit(true);
    };

    const handleEditDepartment = (row) => {
        const dept = row.originalDept;
        // ✅ Set multiple entities: filter entities by dept.entity_ids
        const selectedEntities = entities.filter((ent) => dept.entity_ids?.includes(ent.id)) || [];
        setEditingId(dept.id);
        setFormData({
            entity: selectedEntities,
            field_name: dept.field_name || "",
            is_active: dept.is_active || "Y",
        });
        setOpenAddEdit(true);
    };

    const handleViewDepartment = (row) => {
        setViewDept(row.originalDept);
        setViewOpen(true); // ✅ Set open state
    };

    const handleInactive = (row) => {
        setSelectedRow(row.originalDept);
        setOpenInactive(true);
    };

    const [selectedRow, setSelectedRow] = useState(null);

    const handleSave = async () => {
        if (!formData.entity.length || !formData.field_name) {
            toast.error("Please fill all required fields");
            return;
        }

        const payload = {
            entity_ids: formData.entity.map(ent => parseInt(ent.id)), // ✅ Changed to entity_ids array
            field_type: "Department",
            field_name: formData.field_name,
            is_active: formData.is_active,
        };

        // ✅ For update, include ID in payload (common API pattern if second param not handled)
        if (editingId) {
            payload.id = editingId;
        }

        setSaving(true); // ✅ Start loading
        try {
            console.log("Saving payload:", payload, "ID:", editingId); // ✅ Debug log
            await saveDepartmentAPI(payload, editingId);
            toast.success(editingId ? "Department updated" : "Department created");
            setOpenAddEdit(false);
            setFormData({
                entity: [], // ✅ Reset to empty array
                field_name: "",
                is_active: "Y",
            });
            setEditingId(null);
            loadData();
        } catch (error) {
            console.error("Save error:", error); // ✅ Debug log
            toast.error(error.message || "Error saving department");
        } finally {
            setSaving(false); // ✅ Stop loading
        }
    };

    const confirmInactive = async () => {
        if (!selectedRow) return;
        try {
            await deleteDepartmentAPI(selectedRow.id);
            toast.success("Department deactivated");
            setOpenInactive(false);
            loadData();
        } catch (error) {
            toast.error(error.message || "Failed to deactivate department");
        }
    };

    const handleChange = (e) => {
        const { name, value, checked } = e.target;
        if (name === "is_active") {
            setFormData((prev) => ({ ...prev, is_active: checked ? "Y" : "N" }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleEntityChange = (e, newValue) => {
        setFormData((prev) => ({ ...prev, entity: newValue })); // ✅ Handles array for multi-select
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
                            title={"Department Management"}
                            btnName={"Add Department"}
                            addButton={handleAddDepartment}
                            rows={tableRows}
                            columns={DepartmentColumns}
                            onView={handleViewDepartment}
                            onEdit={handleEditDepartment}
                            onDelete={handleInactive}
                        />
                    </Grid>
                </Grid>
            </Box>

            <Dialog open={openAddEdit} onClose={() => setOpenAddEdit(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 600 }}>
                    {editingId ? "Edit Department" : "Add Department"}
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
                                onChange={handleEntityChange} // ✅ Dedicated handler
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        placeholder="Select Entities (multiple)"
                                        required
                                        size="small"
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
                            <Typography sx={{ fontWeight: 500, mb: 0.5 }}>Department</Typography>
                            <TextField
                                fullWidth
                                label="Department Name"
                                value={formData.field_name}
                                size="small"
                                onChange={(e) => setFormData({ ...formData, field_name: e.target.value })}
                                placeholder="Enter department name"
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
                                        onChange={handleChange}
                                        name="is_active"
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

            <Dialog open={openInactive} onClose={() => setOpenInactive(false)} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ fontWeight: 600 }}>
                    Inactivate Department
                </DialogTitle>
                <DialogContent dividers>
                    <Typography>
                        Are you sure you want to mark{" "}
                        <b>{selectedRow?.field_name}</b> as Inactive?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenInactive(false)}>Cancel</Button>
                    <Button variant="contained" color="error" onClick={confirmInactive}>
                        Inactivate
                    </Button>
                </DialogActions>
            </Dialog>
            
            {/* ✅ Fixed view dialog with proper open state */}
            {viewDept && (
                <Dialog open={viewOpen} onClose={() => { setViewOpen(false); setViewDept(null); }} fullWidth maxWidth="sm">
                    <DialogTitle sx={{ py: 2 }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Typography variant="h6" fontWeight={600}>
                                Department Details
                            </Typography>
                            <IconButton onClick={() => { setViewOpen(false); setViewDept(null); }} size="small">
                                <CloseIcon />
                            </IconButton>
                        </Box>
                    </DialogTitle>
                    <DialogContent dividers sx={{ bgcolor: "#fafafa", py: 4 }}>
                        <Grid container spacing={5}>
                            <Grid size={4} sx={{ textAlign: "center" }}>
                                <Box
                                    sx={{
                                        width: 130,
                                        height: 130,
                                        borderRadius: "50%",
                                        background: "linear-gradient(135deg, #42a5f5 0%, #1976d2 100%)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        margin: "0 auto",
                                        color: "white",
                                        fontSize: 56,
                                        fontWeight: "bold",
                                        boxShadow: 8,
                                        mb: 3,
                                    }}
                                >
                                    {viewDept.field_name?.[0]?.toUpperCase() || "D"}
                                </Box>
                                <Typography variant="h5" fontWeight={700} color="primary.main" gutterBottom>
                                    {viewDept.field_name || "—"}
                                </Typography>
                                <Chip
                                    label={viewDept.is_active === "Y" ? "Active" : "Inactive"}
                                    color={viewDept.is_active === "Y" ? "success" : "error"}
                                    size="medium"
                                    sx={{ fontWeight: 600, px: 2, height: 36, mt: 2 }}
                                />
                            </Grid>
                            <Grid size={8}>
                                <Box sx={{ display: "grid", gap: 3.5, }}>
                                    <Box>
                                        <Typography variant="body2" color="text.secondary" gutterBottom fontWeight={500}>
                                            Entities {/* ✅ Changed label to plural */}
                                        </Typography>
                                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                            {(viewDept.entity_names || []).map((entityName, idx) => (
                                                <Chip
                                                    key={idx}
                                                    label={entityName}
                                                    size="small"
                                                    variant="outlined"
                                                    color="primary"
                                                />
                                            ))}
                                            {viewDept.entity_names?.length === 0 && <Typography variant="body2" color="text.secondary">—</Typography>}
                                        </Box>
                                    </Box>
                                    <Box>
                                        <Typography variant="body2" color="text.secondary" gutterBottom fontWeight={500}>
                                            Field Type
                                        </Typography>
                                        <Typography variant="body1" fontWeight={600}>
                                            {viewDept.field_type || "—"}
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="body2" color="text.secondary" gutterBottom fontWeight={500}>
                                            Field Value
                                        </Typography>
                                        <Typography variant="body1" fontWeight={600}>
                                            {viewDept.field_values || "—"}
                                        </Typography>
                                    </Box>
                                    {viewDept.created_date && (
                                        <Box>
                                            <Typography variant="body2" color="text.secondary" gutterBottom fontWeight={500}>
                                                Created On
                                            </Typography>
                                            <Typography variant="body1" fontWeight={500}>
                                                {new Date(viewDept.created_date).toLocaleDateString("en-US", {
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
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
};

export default Department;
