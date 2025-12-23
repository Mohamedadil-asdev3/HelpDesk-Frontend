// import { useEffect, useState } from "react";
// import { Autocomplete, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, TextField, Typography, MenuItem, RadioGroup, FormControlLabel, Radio } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
// import { toast } from "react-toastify";
// import { fetchEntitiesAPI, fetchDepartmentsAPI, fetchLocationsAPI, fetchCategoriesAPI, fetchSubcategoriesAPI, fetchSLAAPI, saveCategoryAPI, fetchUsersAPI, fetchTicketCategories, } from "../../../Api";
// import CommonTables from "../../commonTabel";

// const Category = () => {

//     const CategoryColumns = [
//         { id: "sNo", label: "S.No" },
//         { id: "entity", label: "Entity" },
//         { id: "category", label: "Category" },
//         { id: "subcategories", label: "Subcategories" },
//         { id: "status", label: "Status" },
//     ];

//     const [categories, setCategories] = useState([]);
//     const [entities, setEntities] = useState([]);
//     const [departments, setDepartments] = useState([]);
//     // const [locations, setLocations] = useState([]);
//     const [categoriesList, setCategoriesList] = useState([]);
//     const [subCategories, setSubCategories] = useState([]);
//     const [users, setUsers] = useState([]);
//     const [open, setOpen] = useState(false);
//     const [deleteOpen, setDeleteOpen] = useState(false);
//     const [editMode, setEditMode] = useState(false);
//     const [selectedRow, setSelectedRow] = useState(null);
//     const [viewOpen, setViewOpen] = useState(false);
//     const [viewCategory, setViewCategory] = useState(null);
//     const [isNewCategory, setIsNewCategory] = useState(false);
//     const [isNewSubCategory, setIsNewSubCategory] = useState(false);
//     const [isActive, setIsActive] = useState("Y");

//     const [formData, setFormData] = useState({
//         entity: "",
//         department: "",
//         location: "",
//         category: "",
//         subCategory: "",
//         assignTechnician: "",
//         level1: "",
//         sla1: "",
//         level2: "",
//         sla2: "",
//         level3: "",
//         sla3: "",
//         level4: "",
//         sla4: "",
//         level5: "",
//         sla5: "",
//     });

//     const initialForm = {
//         entity: "",
//         department: "",
//         location: "",
//         category: "",
//         subCategory: "",
//         assignTechnician: "",
//         level1: "",
//         sla1: "",
//         level2: "",
//         sla2: "",
//         level3: "",
//         sla3: "",
//         level4: "",
//         sla4: "",
//         level5: "",
//         sla5: "",
//     };

//     // Load initial data
//     useEffect(() => {
//         loadData();
//     }, []);

//     const loadData = async () => {
//         try {
//             const [ticketCats, ents, usersData] = await Promise.all([
//                 fetchTicketCategories(),
//                 fetchEntitiesAPI(),
//                 fetchUsersAPI(),
//             ]);
//             setCategories(Array.isArray(ticketCats) ? ticketCats : []);
//             setEntities(ents);
//             setUsers(usersData);
//         } catch (err) {
//             toast.error("Error loading data");
//             console.error(err);
//         }
//     };

//     const loadDepartments = async (entityId) => {
//         if (!entityId) {
//             setDepartments([]);
//             return;
//         }
//         try {
//             const data = await fetchDepartmentsAPI(entityId);
//             setDepartments(data.filter((d) => d.is_active === "Y"));
//         } catch (err) {
//             console.error(err);
//             setDepartments([]);
//         }
//     };

//     const loadLocations = async (entityId, deptId) => {
//         if (!entityId || !deptId) {
//             setLocations([]);
//             return;
//         }
//         try {
//             const data = await fetchLocationsAPI(entityId, deptId);
//             setLocations(data);
//         } catch (err) {
//             console.error(err);
//             setLocations([]);
//         }
//     };

//     const loadCategoriesList = async (entityId) => {
//         if (!entityId) {
//             setCategoriesList([]);
//             return;
//         }
//         try {
//             const data = await fetchCategoriesAPI(entityId);
//             setCategoriesList(data.filter((c) => c.is_active === "Y"));
//         } catch (err) {
//             console.error(err);
//             setCategoriesList([]);
//         }
//     };

//     const loadSubCategories = async (catId) => {
//         if (!catId || isNewCategory) {
//             setSubCategories([]);
//             return;
//         }
//         try {
//             const data = await fetchSubcategoriesAPI(catId);
//             setSubCategories(data.filter((s) => s.is_active === "Y"));
//         } catch (err) {
//             console.error(err);
//             setSubCategories([]);
//         }
//     };

//     const loadSLAData = async () => {
//     // If creating NEW category or NEW subcategory → do NOT load old SLA
//     if (isNewCategory || isNewSubCategory) {
//         setFormData(prev => ({
//             ...prev,
//             level1: "", sla1: "", level2: "", sla2: "",
//             level3: "", sla3: "", level4: "", sla4: "",
//             level5: "", sla5: "", assignTechnician: ""
//         }));
//         return;
//     }

//     // If editing existing → need entity + category
//     if (!formData.entity || !formData.category) {
//         return;
//     }

//     try {
//         const sla = await fetchSLAAPI(
//         Number(formData.entity),
//         Number(formData.category),
//         formData.subCategory ? Number(formData.subCategory) : null  // null = no subcategory
//     );

//     if (sla && Object.keys(sla).length > 0) {
//         setFormData(prev => ({
//             ...prev,
//             level1: sla.Approver_level1_user_id || sla.level1 || "",
//             sla1: sla.Approver_level1_time || sla.sla1 || "",
//             level2: sla.Approver_level2_user_id || sla.level2 || "",
//             sla2: sla.Approver_level2_time || sla.sla2 || "",
//             level3: sla.Approver_level3_user_id || sla.level3 || "",
//             sla3: sla.Approver_level3_time || sla.sla3 || "",
//             level4: sla.Approver_level4_user_id || sla.level4 || "",
//             sla4: sla.Approver_level4_time || sla.sla4 || "",
//             level5: sla.Approver_level5_user_id || sla.level5 || "",
//             sla5: sla.Approver_level5_time || sla.sla5 || "",
//             assignTechnician: sla.Assign_to_id || sla.Assign_to || sla.assignTechnician || "",
//         }));
//     } else {
//         // No SLA found → clear fields (clean slate)
//         setFormData(prev => ({
//             ...prev,
//             level1: "", sla1: "", level2: "", sla2: "",
//             level3: "", sla3: "", level4: "", sla4: "",
//             level5: "", sla5: "", assignTechnician: ""
//         }));
//     }
//     } catch (err) {
//         console.error("Failed to load SLA:", err);
//     }
// };
//     // Effects for cascading
//     useEffect(() => {
//         loadDepartments(formData.entity);
//         loadCategoriesList(formData.entity);
//         setFormData((prev) => ({ ...prev, department: "", location: "", category: "", subCategory: "" }));
//     }, [formData.entity]);

//     useEffect(() => {
//         loadLocations(formData.entity, formData.department);
//         setFormData((prev) => ({ ...prev, location: "", category: "", subCategory: "" }));
//     }, [formData.department, formData.entity]);

//     // useEffect(() => {
//     //     loadSubCategories(formData.category);
//     //     setFormData((prev) => ({ ...prev, subCategory: "" }));
//     //     loadSLAData();
//     // }, [formData.category, formData.subCategory, isNewCategory, isNewSubCategory]);
//     useEffect(() => {
//     loadSubCategories(formData.category);
//     setFormData(prev => ({ ...prev, subCategory: "" }));
//     loadSLAData(); // ← triggers when category selected
// }, [formData.category, isNewCategory]);
// useEffect(() => {
//     if (!isNewCategory && !isNewSubCategory) {
//         loadSLAData(); // ← only load if using existing ones
//     }
// }, [formData.subCategory]);
//     useEffect(() => {
//         loadSLAData();
//     }, [formData.entity, formData.category, formData.subCategory, isNewCategory, isNewSubCategory]);

//     const currentRows = categories.map((cat, index) => ({
//         id: cat.id,
//         sNo: index + 1,
//         entity: cat.entity_name || cat.entity || "N/A",
//         category: cat.category_name || cat.name || "N/A",
//         subcategories:
//             cat.subcategories && cat.subcategories.length > 0
//                 ? cat.subcategories.map((sub) => sub.subcategory_name).join(", ")
//                 : "N/A",
//         status: cat.is_active === "Y",
//         original: cat,
//     }));

//     const handleOpenAdd = () => {
//         setEditMode(false);
//         setIsNewCategory(false);
//         setIsNewSubCategory(false);
//         setIsActive("Y");
//         setFormData(initialForm);
//         setOpen(true);
//     };

//     const handleEdit = async (row) => {
//     const cat = row.original;
//     setEditMode(true);
//     setIsNewCategory(false);
//     setIsNewSubCategory(false);
//     setIsActive(cat.is_active || "Y");

//     // Clear SLA first
//     setFormData({
//         entity: cat.entity_id || "",
//         department: cat.department_id || "",
//         // location: cat.location_id || "",
//         category: cat.category_id || "",
//         subCategory: cat.subcategory_id || "",
//         assignTechnician: "",
//         level1: "", sla1: "", level2: "", sla2: "",
//         level3: "", sla3: "", level4: "", sla4: "",
//         level5: "", sla5: "",
//     });

//     setSelectedRow(row);

//     // Load dependent data
//     await loadDepartments(cat.entity_id);
//     // await loadLocations(cat.entity_id, cat.department_id);

//     // Load SLA after data is ready
//     setTimeout(() => loadSLAData(), 500);

//     setOpen(true);
// };

//     const handleDelete = (row) => {
//         setSelectedRow(row);
//         setDeleteOpen(true);
//     };

//     const confirmDelete = async () => {
//         if (!selectedRow) return;
//         try {
//             await deleteCategoryAPI(selectedRow.id);
//             toast.success("Category deleted successfully");
//             loadData();
//         } catch (err) {
//             toast.error("Error deleting category");
//             console.error(err);
//         }
//         setDeleteOpen(false);
//         setSelectedRow(null);
//     };

//     const handleClose = () => {
//         setOpen(false);
//         setIsNewCategory(false);
//         setIsNewSubCategory(false);
//         setFormData(initialForm);
//         setEditMode(false);
//     };

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData((prev) => ({ ...prev, [name]: value }));
//     };

//     const handleCategoryModeChange = (e) => {
//         setIsNewCategory(e.target.value === "new");
//         setFormData((prev) => ({ ...prev, category: "", subCategory: "" }));
//         setIsNewSubCategory(false);
//     };

//     const handleSubCategoryModeChange = (e) => {
//         setIsNewSubCategory(e.target.value === "new");
//         setFormData((prev) => ({ ...prev, subCategory: "" }));
//     };

//     const handleUserSelect = (level) => (e, value) => {
//         setFormData((prev) => ({ ...prev, [`level${level}`]: value ? value.id : "" }));
//     };

//    const handleSubmit = async () => {
//     // Basic validation
//     if (!formData.entity) return toast.error("Please select Entity");
//     if (!formData.department) return toast.error("Please select Department");
//     // if (!formData.location) return toast.error("Please select Location");
//     if (isNewCategory && !formData.category.trim()) return toast.error("Please enter category name");
//     if (!isNewCategory && !formData.category) return toast.error("Please select a category");

//     const payload = {
//         entity_id: Number(formData.entity),
//         department_id: Number(formData.department),
//         // ...(formData.location ? { location_id: Number(formData.location) } : {}),
//         // location_id: Number(formData.location),
//         is_active: isActive,

//         // SLA fields — these keys must match Django exactly
//         level1: formData.level1 ? Number(formData.level1) : null,
//         sla1: formData.sla1 || null,
//         level2: formData.level2 ? Number(formData.level2) : null,
//         sla2: formData.sla2 || null,
//         level3: formData.level3 ? Number(formData.level3) : null,
//         sla3: formData.sla3 || null,
//         level4: formData.level4 ? Number(formData.level4) : null,
//         sla4: formData.sla4 || null,
//         level5: formData.level5 ? Number(formData.level5) : null,
//         sla5: formData.sla5 || null,

//         // THIS WAS THE BUG — YOU HAD "assign_technician"
//         assignTechnician: formData.assignTechnician ? Number(formData.assignTechnician) : null,

//         // Category
//         ...(isNewCategory
//             ? { category_name: formData.category.trim() }
//             : { category_id: Number(formData.category) }
//         ),

//         // Subcategory — only send if exists
//         ...(formData.subCategory || isNewSubCategory
//             ? isNewSubCategory
//                 ? { subcategory_name: formData.subCategory.trim() }
//                 : { subcategory_id: Number(formData.subCategory) }
//             : {}
//         ),
//     };

//     try {
//         await saveCategoryAPI(payload, editMode ? selectedRow?.id : null);
//         toast.success(editMode ? "Updated successfully!" : "Created successfully!");
//         handleClose();
//         loadData();
//     } catch (err) {
//         console.error("Save error:", err);
//         toast.error("Failed to save category");
//     }
// };

//     const handleView = (row) => {
//         setViewCategory(row.original);
//         setViewOpen(true);
//     };

//     const handleViewClose = () => {
//         setViewOpen(false);
//         setViewCategory(null);
//     };

//     return (
//         <>
//             <Box sx={{ my: 2 }}>
//                 <Grid container spacing={2}>
//                     <Grid size={12}>
//                         <CommonTables
//                             title={"Ticket Categories Management"}
//                             btnName={"Add Category"}
//                             addButton={handleOpenAdd}
//                             rows={currentRows}
//                             columns={CategoryColumns}
//                             onView={handleView}
//                             onEdit={handleEdit}
//                             onDelete={handleDelete}
//                         />
//                     </Grid>
//                 </Grid>

//                 {/* Add/Edit Dialog */}
//                 <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
//                     <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                         <Typography fontSize={20} fontWeight={550}>
//                             {editMode ? "Edit Category" : "Add Category"}
//                         </Typography>
//                         <IconButton onClick={handleClose} color="error">
//                             <CloseIcon />
//                         </IconButton>
//                     </DialogTitle>
//                     <DialogContent dividers>
//                         <Grid container spacing={2}>
//                             <Grid size={6}>
//                                 <Typography variant="h6" gutterBottom>
//                                     Basic Information
//                                 </Typography>
//                                 <Autocomplete
//                                     options={entities}
//                                     getOptionLabel={(option) => option.name || option.field_name}
//                                     value={entities.find((e) => e.id == formData.entity) || null}
//                                     onChange={(e, value) =>
//                                         setFormData((prev) => ({ ...prev, entity: value ? value.id : "" }))
//                                     }
//                                     renderInput={(params) => (
//                                         <TextField {...params} label="Entity *" required fullWidth />
//                                     )}
//                                 />
//                                 <Autocomplete
//                                     options={departments}
//                                     getOptionLabel={(option) => option.field_name}
//                                     value={departments.find((d) => d.id == formData.department) || null}
//                                     onChange={(e, value) =>
//                                         setFormData((prev) => ({ ...prev, department: value ? value.id : "" }))
//                                     }
//                                     renderInput={(params) => (
//                                         <TextField {...params} label="Department *" required fullWidth />
//                                     )}
//                                 />
//                                 {/* <Autocomplete
//                                     options={locations}
//                                     getOptionLabel={(option) => option.field_name}
//                                     value={locations.find((l) => l.id == formData.location) || null}
//                                     onChange={(e, value) =>
//                                         setFormData((prev) => ({ ...prev, location: value ? value.id : "" }))
//                                     }
//                                     renderInput={(params) => (
//                                         <TextField {...params} label="Location *" required fullWidth />
//                                     )}
//                                 /> */}
//                                 <RadioGroup value={isNewCategory ? "new" : "existing"} onChange={handleCategoryModeChange} row>
//                                     <FormControlLabel value="existing" control={<Radio />} label="Existing Category" />
//                                     <FormControlLabel value="new" control={<Radio />} label="New Category" />
//                                 </RadioGroup>
//                                 {!isNewCategory ? (
//                                     <Autocomplete
//                                         options={categoriesList}
//                                         getOptionLabel={(option) => option.category_name}
//                                         value={categoriesList.find((c) => c.id == formData.category) || null}
//                                         onChange={(e, value) =>
//                                             setFormData((prev) => ({ ...prev, category: value ? value.id : "" }))
//                                         }
//                                         renderInput={(params) => (
//                                             <TextField {...params} label="Category *" required fullWidth />
//                                         )}
//                                     />
//                                 ) : (
//                                     <TextField
//                                         label="New Category *"
//                                         value={formData.category}
//                                         onChange={handleChange}
//                                         name="category"
//                                         required
//                                         fullWidth
//                                     />
//                                 )}
//                                 <RadioGroup value={isNewSubCategory ? "new" : "existing"} onChange={handleSubCategoryModeChange} row>
//                                     <FormControlLabel value="existing" control={<Radio />} label="Existing Subcategory" />
//                                     <FormControlLabel value="new" control={<Radio />} label="New Subcategory" />
//                                 </RadioGroup>
//                                 {!isNewSubCategory ? (
//                                     <Autocomplete
//                                         options={subCategories}
//                                         getOptionLabel={(option) => option.subcategory_name}
//                                         value={subCategories.find((s) => s.id == formData.subCategory) || null}
//                                         onChange={(e, value) =>
//                                             setFormData((prev) => ({ ...prev, subCategory: value ? value.id : "" }))
//                                         }
//                                         renderInput={(params) => (
//                                             <TextField {...params} label="Subcategory" fullWidth />
//                                         )}
//                                     />
//                                 ) : (
//                                     <TextField
//                                         label="New Subcategory"
//                                         value={formData.subCategory}
//                                         onChange={handleChange}
//                                         name="subCategory"
//                                         fullWidth
//                                     />
//                                 )}
//                                 {editMode && (
//                                     <TextField
//                                         select
//                                         label="Active Status"
//                                         value={isActive}
//                                         onChange={(e) => setIsActive(e.target.value)}
//                                         fullWidth
//                                     >
//                                         <MenuItem value="Y">Yes (Active)</MenuItem>
//                                         <MenuItem value="N">No (Inactive)</MenuItem>
//                                     </TextField>
//                                 )}
//                             </Grid>
//                             {/* Right Panel: SLA Configuration */}
//                             <Grid size={6}>
//                                 <Typography variant="h6" gutterBottom>
//                                     SLA Configuration
//                                 </Typography>
//                                 {[1, 2, 3, 4, 5].map((level) => (
//                                     <Grid container spacing={2} key={level} sx={{ mb: 2 }}>
//                                         <Grid size={6}>
//                                             <Autocomplete
//                                                 options={users}
//                                                 getOptionLabel={(option) => option.realname || option.firstname || option.name}
//                                                 value={users.find((u) => u.id == formData[`level${level}`]) || null}
//                                                 onChange={handleUserSelect(level)}
//                                                 renderInput={(params) => (
//                                                     <TextField
//                                                         {...params}
//                                                         label={`Level ${level} Approver`}
//                                                         fullWidth
//                                                     />
//                                                 )}
//                                             />
//                                         </Grid>
//                                         <Grid size={6}>
//                                             <TextField
//                                                 label={`SLA ${level}`}
//                                                 name={`sla${level}`}
//                                                 value={formData[`sla${level}`]}
//                                                 onChange={handleChange}
//                                                 fullWidth
//                                             />
//                                         </Grid>
//                                     </Grid>
//                                 ))}
//                                 <Autocomplete
//                                     options={users}
//                                     getOptionLabel={(option) => option.realname || option.firstname || option.name}
//                                     value={users.find((u) => u.id == formData.assignTechnician) || null}
//                                     onChange={(e, value) =>
//                                         setFormData((prev) => ({ ...prev, assignTechnician: value ? value.id : "" }))
//                                     }
//                                     renderInput={(params) => (
//                                         <TextField {...params} label="Assign Technician" fullWidth />
//                                     )}
//                                 />
//                             </Grid>
//                         </Grid>
//                     </DialogContent>
//                     <DialogActions>
//                         <Button onClick={handleClose} color="inherit" variant="outlined" size="small">
//                             Cancel
//                         </Button>
//                         <Button variant="contained" onClick={handleSubmit} color="success" size="small">
//                             {editMode ? "Update" : "Save"}
//                         </Button>
//                     </DialogActions>
//                 </Dialog>

//                 {/* View Dialog */}
//                 <Dialog open={viewOpen} onClose={handleViewClose} fullWidth maxWidth="md">
//                     <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                         <Typography fontSize={20} fontWeight={550}>
//                             Category Details
//                         </Typography>
//                         <IconButton onClick={handleViewClose} color="error">
//                             <CloseIcon />
//                         </IconButton>
//                     </DialogTitle>
//                     <DialogContent dividers>
//                         {viewCategory && (
//                             <>
//                                 <Typography><strong>Entity:</strong> {viewCategory.entity_name || viewCategory.entity || "N/A"}</Typography>
//                                 <Typography><strong>Department:</strong> {viewCategory.department_name || "N/A"}</Typography>
//                                 <Typography><strong>Location:</strong> {viewCategory.location_name || "N/A"}</Typography>
//                                 <Typography><strong>Category:</strong> {viewCategory.category_name || viewCategory.name || "N/A"}</Typography>
//                                 <Typography>
//                                     <strong>Subcategories:</strong>{" "}
//                                     {viewCategory.subcategories && viewCategory.subcategories.length > 0
//                                         ? viewCategory.subcategories.map((sub) => sub.subcategory_name).join(", ")
//                                         : "N/A"}
//                                 </Typography>
//                                 <Typography><strong>Status:</strong> {viewCategory.is_active === "Y" ? "Active" : "Inactive"}</Typography>
//                                 <Typography><strong>Assign Technician:</strong> {viewCategory.assign_technician || "N/A"}</Typography>
//                                 {[1, 2, 3, 4, 5].map((level) => (
//                                     <>
//                                         <Typography key={`level${level}`}><strong>Level {level} Approver:</strong> {viewCategory[`Approver_level${level}_user_id`] || viewCategory[`level${level}`] || "N/A"}</Typography>
//                                         <Typography key={`sla${level}`}><strong>SLA {level}:</strong> {viewCategory[`Approver_level${level}_time`] || viewCategory[`sla${level}`] || "N/A"}</Typography>
//                                     </>
//                                 ))}
//                             </>
//                         )}
//                     </DialogContent>
//                 </Dialog>

//                 {/* Delete Dialog */}
//                 <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)} fullWidth maxWidth="xs">
//                     <DialogTitle>Delete Category</DialogTitle>
//                     <DialogContent dividers>
//                         <Typography>
//                             Are you sure you want to delete this category?
//                         </Typography>
//                     </DialogContent>
//                     <DialogActions>
//                         <Button onClick={() => setDeleteOpen(false)} color="inherit" variant="outlined" size="small">
//                             Cancel
//                         </Button>
//                         <Button onClick={confirmDelete} color="error" variant="contained" size="small">
//                             Delete
//                         </Button>
//                     </DialogActions>
//                 </Dialog>
//             </Box>
//         </>
//     );
// };

// export default Category;
import { useEffect, useState } from "react";
import { Autocomplete, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, TextField, Typography, MenuItem, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";
import { fetchEntitiesAPI, fetchDepartmentsAPI, fetchCategoriesAPI, fetchSubcategoriesAPI, saveCategoryAPI, fetchUsersAPI, fetchWatcherGroups, fetchTicketCategories } from "../../../Api";
import CommonTables from "../../commonTabel";
 
const Category = () => {
 
    const CategoryColumns = [
        { id: "sNo", label: "S.No" },
        { id: "entity", label: "Entity" },
        { id: "category", label: "Category" },
        { id: "subcategories", label: "Subcategories" },
        { id: "assigned_to", label: "Assigned To" },
        { id: "confidential", label: "Confidential" },
        { id: "status", label: "Status" },
    ];
 
    const [categories, setCategories] = useState([]);
    const [entities, setEntities] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [categoriesList, setCategoriesList] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [users, setUsers] = useState([]);
    const [groups, setGroups] = useState([]);
    const [open, setOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [viewOpen, setViewOpen] = useState(false);
    const [viewCategory, setViewCategory] = useState(null);
    const [isNewCategory, setIsNewCategory] = useState(false);
    const [isNewSubCategory, setIsNewSubCategory] = useState(false);
    const [isActive, setIsActive] = useState("Y");
 
    const [formData, setFormData] = useState({
        entity: [],
        department: "",
        category: "",
        subCategory: [],
        assignmentType: "",
        assignedId: "",
        confidential: "N",
    });
 
    const initialForm = {
        entity: [],
        department: "",
        category: "",
        subCategory: [],
        assignmentType: "",
        assignedId: "",
        confidential: "N",
    };
 
    // Load initial data
    useEffect(() => {
        loadData();
    }, []);
 
    const loadData = async () => {
        try {
            const [ticketCats, ents, usersData, groupsData] = await Promise.all([
                fetchTicketCategories(),
                fetchEntitiesAPI(),
                fetchUsersAPI(),
                fetchWatcherGroups(),
            ]);
            setCategories(Array.isArray(ticketCats) ? ticketCats : []);
            setEntities(ents);
            setUsers(usersData);
            setGroups(groupsData);
        } catch (err) {
            toast.error("Error loading data");
            console.error(err);
        }
    };
 
    const loadDepartments = async (entityIds = []) => {
        if (entityIds.length === 0) {
            setDepartments([]);
            return;
        }
        try {
            const promises = entityIds.map(id => fetchDepartmentsAPI(id));
            const results = await Promise.all(promises);
            let commonDepts = [];
            if (entityIds.length === 1) {
                commonDepts = results[0] || [];
            } else {
                const deptCounts = new Map();
                results.forEach(deptList => {
                    (deptList || []).forEach(dept => {
                        const key = dept.id;
                        deptCounts.set(key, (deptCounts.get(key) || 0) + 1);
                    });
                });
                const allLists = entityIds.length;
                const commonIds = Array.from(deptCounts.entries())
                    .filter(([id, count]) => count === allLists)
                    .map(([id]) => id);
                // Pick full objects from the first result that has them
                commonDepts = (results[0] || []).filter(dept => commonIds.includes(dept.id));
            }
            commonDepts = commonDepts.filter((d) => d.is_active === "Y");
            const uniqueMap = new Map();
            commonDepts.forEach((d) => uniqueMap.set(d.id, d));
            setDepartments(Array.from(uniqueMap.values()));
        } catch (err) {
            console.error(err);
            setDepartments([]);
        }
    };
 
    const loadCategoriesList = async (entityIds = []) => {
        if (entityIds.length === 0) {
            setCategoriesList([]);
            return;
        }
        try {
            const promises = entityIds.map(id => fetchCategoriesAPI(id));
            const results = await Promise.all(promises);
            let commonCats = [];
            if (entityIds.length === 1) {
                commonCats = results[0] || [];
            } else {
                const catCounts = new Map();
                results.forEach(catList => {
                    (catList || []).forEach(cat => {
                        const key = cat.id;
                        catCounts.set(key, (catCounts.get(key) || 0) + 1);
                    });
                });
                const allLists = entityIds.length;
                const commonIds = Array.from(catCounts.entries())
                    .filter(([id, count]) => count === allLists)
                    .map(([id]) => id);
                // Pick full objects from the first result that has them
                commonCats = (results[0] || []).filter(cat => commonIds.includes(cat.id));
            }
            commonCats = commonCats.filter((c) => c.is_active === "Y");
            const uniqueMap = new Map();
            commonCats.forEach((c) => uniqueMap.set(c.id, c));
            setCategoriesList(Array.from(uniqueMap.values()));
        } catch (err) {
            console.error(err);
            setCategoriesList([]);
        }
    };
 
    const loadSubCategories = async (catId) => {
        if (!catId || isNewCategory) {
            setSubCategories([]);
            return;
        }
        try {
            const data = await fetchSubcategoriesAPI(catId);
            setSubCategories(data.filter((s) => s.is_active === "Y"));
        } catch (err) {
            console.error(err);
            setSubCategories([]);
        }
    };
 
    // Effects for cascading
    useEffect(() => {
        loadDepartments(formData.entity);
        loadCategoriesList(formData.entity);
        setFormData((prev) => ({ ...prev, department: "", category: "", subCategory: isNewSubCategory ? "" : [] }));
    }, [formData.entity]);
 
    useEffect(() => {
        if (formData.category && !isNewCategory) {
            loadSubCategories(formData.category);
        } else {
            setSubCategories([]);
        }
    }, [formData.category, isNewCategory]);
 
    // Auto-select all subcategories when selecting an existing category (only if not new sub mode)
    useEffect(() => {
        if (formData.category && !isNewCategory && !isNewSubCategory && subCategories.length > 0 && (!Array.isArray(formData.subCategory) || formData.subCategory.length === 0)) {
            setFormData((prev) => ({
                ...prev,
                subCategory: subCategories.map((s) => s.id),
            }));
        }
    }, [subCategories, formData.category, isNewCategory, isNewSubCategory]);
 
    const currentRows = categories.map((cat, index) => ({
        id: cat.id,
        sNo: index + 1,
        entity: Array.isArray(cat.entity_names)
            ? cat.entity_names.join(", ")
            : (cat.entity_name || cat.entity || "N/A"),
        category: cat.category_name || cat.name || "N/A",
        subcategories:
            cat.subcategories && cat.subcategories.length > 0
                ? cat.subcategories.map((sub) => sub.subcategory_name).join(", ")
                : "N/A",
        assigned_to: (() => {
            const sla = cat.sla;
            if (sla?.assigned_user_id) {
                const user = users.find(u => u.id === sla.assigned_user_id);
                return `User: ${user ? (user.realname || user.firstname || user.name) : 'N/A'}`;
            } else if (sla?.assigned_group_id) {
                const group = groups.find(g => g.id === sla.assigned_group_id);
                return `Group: ${group ? (group.name || group.group_name) : 'N/A'}`;
            }
            return 'N/A';
        })(),
        confidential: cat.confidential || "N",
        status: cat.is_active === "Y" ? "Active" : "Inactive",
        original: cat,
    }));
 
    const handleOpenAdd = () => {
        setEditMode(false);
        setIsNewCategory(false);
        setIsNewSubCategory(false);
        setIsActive("Y");
        setFormData(initialForm);
        setOpen(true);
    };
 
    const handleEdit = async (row) => {
        const cat = row.original;
        setEditMode(true);
        setIsNewCategory(false);
        setIsNewSubCategory(false);
        setIsActive(cat.is_active || "Y");
 
        const entityIds = Array.isArray(cat.entity_ids)
            ? cat.entity_ids
            : (cat.entity_id ? [cat.entity_id] : []);
 
        let assignmentType = '';
        let assignedId = '';
        const sla = cat.sla;
        if (sla?.assigned_user_id) {
            assignmentType = 'user';
            assignedId = sla.assigned_user_id;
        } else if (sla?.assigned_group_id) {
            assignmentType = 'group';
            assignedId = sla.assigned_group_id;
        }
 
        const departmentId = cat.department_id || "";
        const categoryId = cat.id || "";  // Use cat.id since editing the category
        const subCategoryIds = cat.subcategories ? cat.subcategories.map((s) => s.id) : [];
 
        // Load dependent data first
        await loadDepartments(entityIds);
        await loadCategoriesList(entityIds);
 
        // Load subcategories to ensure options are available
        if (categoryId) {
            await loadSubCategories(categoryId);
        }
 
        // Set formData after loads
        setFormData({
            entity: entityIds,
            department: departmentId,
            category: categoryId,
            subCategory: subCategoryIds,
            assignmentType,
            assignedId,
            confidential: cat.confidential || "N",
        });
 
        setSelectedRow(row);
        setOpen(true);
    };
 
    const handleDelete = (row) => {
        setSelectedRow(row);
        setDeleteOpen(true);
    };
 
    const confirmDelete = async () => {
        if (!selectedRow) return;
        try {
            await deleteCategoryAPI(selectedRow.id);
            toast.success("Category deleted successfully");
            loadData();
        } catch (err) {
            toast.error("Error deleting category");
            console.error(err);
        }
        setDeleteOpen(false);
        setSelectedRow(null);
    };
 
    const handleClose = () => {
        setOpen(false);
        setIsNewCategory(false);
        setIsNewSubCategory(false);
        setFormData(initialForm);
        setEditMode(false);
    };
 
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
 
    const handleCategoryModeChange = (e) => {
        setIsNewCategory(e.target.value === "new");
        setFormData((prev) => ({ ...prev, category: "", subCategory: isNewSubCategory ? "" : [] }));
        setIsNewSubCategory(false);
    };
 
    const handleSubCategoryModeChange = (e) => {
        const isNew = e.target.value === "new";
        setIsNewSubCategory(isNew);
        setFormData((prev) => ({ ...prev, subCategory: isNew ? "" : [] }));
    };
 
    const handleAssignmentTypeChange = (e) => {
        const type = e.target.value;
        setFormData((prev) => ({ ...prev, assignmentType: type, assignedId: "" }));
    };
 
    const handleAssignedChange = (e, value) => {
        setFormData((prev) => ({ ...prev, assignedId: value ? value.id : "" }));
    };
 
    const handleSubmit = async () => {
        // Basic validation
        if (!formData.entity || formData.entity.length === 0) return toast.error("Please select Entity");
        if (!formData.department) return toast.error("Please select Department");
        if (isNewCategory && !formData.category.trim()) return toast.error("Please enter category name");
        if (!isNewCategory && !formData.category) return toast.error("Please select a category");
        if (isNewSubCategory && !formData.subCategory.trim()) return toast.error("Please enter subcategory name");
 
        const payload = {
            entity_ids: formData.entity.map((e) => Number(e)),
            department_id: Number(formData.department),
            is_active: isActive,
            confidential: formData.confidential,
 
            // Category
            ...(isNewCategory
                ? { category_name: formData.category.trim() }
                : { category_id: Number(formData.category) }
            ),
 
            // Subcategory
            ...(isNewSubCategory
                ? { subcategory_name: formData.subCategory.trim() }
                : (Array.isArray(formData.subCategory) && formData.subCategory.length > 0
                    ? { subcategory_ids: formData.subCategory.map((id) => Number(id)) }
                    : {}
                )
            ),
 
            // Assigned
            ...(formData.assignmentType === 'user' ? { assigned_user_id: Number(formData.assignedId) } : {}),
            ...(formData.assignmentType === 'group' ? { assigned_group_id: Number(formData.assignedId) } : {}),
        };
 
        console.log("Submitting payload:", payload); // Debug log
 
        try {
            const response = await saveCategoryAPI(payload, editMode ? selectedRow?.id : null);
            console.log("API Response:", response); // Debug log for response
 
            toast.success(editMode ? "Updated successfully!" : "Created successfully!");
            handleClose();
            loadData();
        } catch (err) {
            console.error("Save error:", err);
            toast.error("Failed to save category");
        }
    };
 
    const handleView = (row) => {
        setViewCategory(row.original);
        setViewOpen(true);
    };
 
    const handleViewClose = () => {
        setViewOpen(false);
        setViewCategory(null);
    };
 
    return (
        <>
            <Box sx={{ my: 2 }}>
                <Grid container spacing={2}>
                    <Grid size={12}>
                        <CommonTables
                            title={"Ticket Categories Management"}
                            btnName={"Add Category"}
                            addButton={handleOpenAdd}
                            rows={currentRows}
                            columns={CategoryColumns}
                            onView={handleView}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    </Grid>
                </Grid>
 
                {/* Add/Edit Dialog */}
                <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
                    <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography fontSize={20} fontWeight={550}>
                            {editMode ? "Edit Category" : "Add Category"}
                        </Typography>
                        <IconButton onClick={handleClose} color="error">
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent dividers>
                        <Grid container spacing={2}>
                            {/* Left Panel: Basic Information */}
                            <Grid size={6}>
                                <Typography variant="h6" gutterBottom>
                                    Basic Information
                                </Typography>
                                <Autocomplete
                                    multiple
                                    options={entities}
                                    getOptionLabel={(option) => option.name || option.field_name}
                                    value={entities.filter((e) => formData.entity.includes(e.id)) || []}
                                    onChange={(e, value) =>
                                        setFormData((prev) => ({ ...prev, entity: value ? value.map((v) => v.id) : [] }))
                                    }
                                    renderInput={(params) => (
                                        <TextField {...params} label="Entity *" required fullWidth sx={{ mt: 1 }} />
                                    )}
                                />
                                <Autocomplete
                                    options={departments}
                                    getOptionLabel={(option) => option.field_name}
                                    value={departments.find((d) => d.id == formData.department) || null}
                                    onChange={(e, value) =>
                                        setFormData((prev) => ({ ...prev, department: value ? value.id : "" }))
                                    }
                                    renderInput={(params) => (
                                        <TextField {...params} label="Department *" required fullWidth sx={{ mt: 1 }} />
                                    )}
                                />
                                <RadioGroup value={isNewCategory ? "new" : "existing"} onChange={handleCategoryModeChange} row>
                                    <FormControlLabel value="existing" control={<Radio />} label="Existing Category" />
                                    <FormControlLabel value="new" control={<Radio />} label="New Category" />
                                </RadioGroup>
                                {!isNewCategory ? (
                                    <Autocomplete
                                        options={categoriesList}
                                        getOptionLabel={(option) => option.category_name}
                                        value={categoriesList.find((c) => c.id == formData.category) || null}
                                        onChange={(e, value) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                category: value ? value.id : "",
                                                subCategory: isNewSubCategory ? "" : []
                                            }))
                                        }
                                        renderInput={(params) => (
                                            <TextField {...params} label="Category *" required fullWidth sx={{ mt: 1 }} />
                                        )}
                                    />
                                ) : (
                                    <TextField
                                        label="New Category *"
                                        value={formData.category}
                                        onChange={handleChange}
                                        name="category"
                                        required
                                        fullWidth
                                    />
                                )}
                                <RadioGroup value={isNewSubCategory ? "new" : "existing"} onChange={handleSubCategoryModeChange} row sx={{ mt: 1 }}>
                                    <FormControlLabel value="existing" control={<Radio />} label="Existing Subcategory" />
                                    <FormControlLabel value="new" control={<Radio />} label="New Subcategory" />
                                </RadioGroup>
                                {!isNewSubCategory ? (
                                    <Autocomplete
                                        multiple
                                        options={subCategories}
                                        getOptionLabel={(option) => option.subcategory_name}
                                        value={Array.isArray(formData.subCategory) ? subCategories.filter((s) => formData.subCategory.includes(s.id)) : []}
                                        onChange={(e, value) =>
                                            setFormData((prev) => ({ ...prev, subCategory: value ? value.map((v) => v.id) : [] }))
                                        }
                                        renderInput={(params) => (
                                            <TextField {...params} label="Subcategories" fullWidth sx={{ mt: 1 }} />
                                        )}
                                    />
                                ) : (
                                    <TextField
                                        label="New Subcategory"
                                        value={formData.subCategory || ""}
                                        onChange={handleChange}
                                        name="subCategory"
                                        fullWidth
                                        sx={{ mt: 1 }}
                                    />
                                )}
                            </Grid>
                            {/* Right Panel: Assigned Resources */}
                            <Grid size={6}>
                                <Typography variant="h6" gutterBottom>
                                    Assigned Resources
                                </Typography>
                                <RadioGroup value={formData.assignmentType} onChange={handleAssignmentTypeChange} row>
                                    <FormControlLabel value="" control={<Radio />} label="None" />
                                    <FormControlLabel value="user" control={<Radio />} label="User" />
                                    <FormControlLabel value="group" control={<Radio />} label="Group" />
                                </RadioGroup>
                                {formData.assignmentType && (
                                    <Autocomplete
                                        options={formData.assignmentType === "user" ? users : groups}
                                        getOptionLabel={(option) =>
                                            formData.assignmentType === "user"
                                                ? (option.realname || option.firstname || option.name)
                                                : (option.name || option.group_name)
                                        }
                                        value={
                                            (formData.assignmentType === "user" ? users : groups)
                                                .find((o) => o.id == formData.assignedId) || null
                                        }
                                        onChange={handleAssignedChange}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label={formData.assignmentType === "user" ? "Select User" : "Select Group"}
                                                fullWidth
                                            />
                                        )}
                                    />
                                )}
                                <TextField
                                    select
                                    label="Confidential"
                                    value={formData.confidential}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, confidential: e.target.value }))}
                                    fullWidth
                                    sx={{ mt: 2 }}
                                >
                                    <MenuItem value="Y">Yes</MenuItem>
                                    <MenuItem value="N">No</MenuItem>
                                </TextField>
                                {editMode && (
                                    <TextField
                                        select
                                        label="Active Status"
                                        value={isActive}
                                        onChange={(e) => setIsActive(e.target.value)}
                                        fullWidth
                                        sx={{ mt: 2 }}
                                    >
                                        <MenuItem value="Y">Yes (Active)</MenuItem>
                                        <MenuItem value="N">No (Inactive)</MenuItem>
                                    </TextField>
                                )}
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
                    <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography fontSize={20} fontWeight={550}>
                            Category Details
                        </Typography>
                        <IconButton onClick={handleViewClose} color="error">
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent dividers>
                        {viewCategory && (
                            <>
                                <Typography>
                                    <strong>Entity:</strong> {Array.isArray(viewCategory.entity_names)
                                        ? viewCategory.entity_names.join(", ")
                                        : (viewCategory.entity_name || viewCategory.entity || "N/A")}
                                </Typography>
                                <Typography><strong>Department:</strong> {viewCategory.department_name || "N/A"}</Typography>
                                <Typography><strong>Category:</strong> {viewCategory.category_name || viewCategory.name || "N/A"}</Typography>
                                <Typography>
                                    <strong>Subcategories:</strong>{" "}
                                    {viewCategory.subcategories && viewCategory.subcategories.length > 0
                                        ? viewCategory.subcategories.map((sub) => sub.subcategory_name).join(", ")
                                        : "N/A"}
                                </Typography>
                                <Typography>
                                    <strong>Assigned To:</strong> {(() => {
                                        const sla = viewCategory.sla;
                                        if (sla?.assigned_user_id) {
                                            const user = users.find(u => u.id === sla.assigned_user_id);
                                            return `User: ${user ? (user.realname || user.firstname || user.name) : 'Unknown'}`;
                                        } else if (sla?.assigned_group_id) {
                                            const group = groups.find(g => g.id === sla.assigned_group_id);
                                            return `Group: ${group ? (group.name || group.group_name) : 'Unknown'}`;
                                        }
                                        return 'None';
                                    })()}
                                </Typography>
                                <Typography><strong>Confidential:</strong> {viewCategory.confidential || "N"}</Typography>
                                <Typography><strong>Status:</strong> {viewCategory.is_active === "Y" ? "Active" : "Inactive"}</Typography>
                            </>
                        )}
                    </DialogContent>
                </Dialog>
 
                {/* Delete Dialog */}
                <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)} fullWidth maxWidth="xs">
                    <DialogTitle>Delete Category</DialogTitle>
                    <DialogContent dividers>
                        <Typography>
                            Are you sure you want to delete this category?
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
 
export default Category;
 