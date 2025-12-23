

// // import { useState, useEffect } from 'react';
// // import { AppBar, Box, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemText, Menu, MenuItem, Toolbar, Typography, useMediaQuery, useTheme } from "@mui/material";
// // import AddIcon from '@mui/icons-material/Add';
// // import PersonIcon from '@mui/icons-material/Person';
// // import LogoutIcon from '@mui/icons-material/Logout';
// // import MenuIcon from '@mui/icons-material/Menu';
// // import CloseIcon from '@mui/icons-material/Close';
// // import { useNavigate } from 'react-router-dom';
// // import { Media_URL } from "../../Api";
// // import { logoutAPI } from "../../Api";
// // // import toast from "react-hot-toast"; // Uncomment after installing: npm install react-hot-toast

// // // Import logos from assets based on entity
// // import stemzLogo from "../../assets/download.png";
// // import ndLogo from "../../assets/ndLogo.jpeg";

// // const Header = () => {

// //     const [entity, setEntity] = useState(null);
// //     const [anchorEl, setAnchorEl] = useState(null);
// //     const [drawerOpen, setDrawerOpen] = useState(false);

// //     const theme = useTheme();
// //     const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
// //     const menuOpen = Boolean(anchorEl);
// //     const navigate = useNavigate();
// //     const media_url = Media_URL;

// //     // --- Auth & Role ---
// //     const getSelectedMapping = () => {
// //         const mapping = localStorage.getItem('selected_role_mapping');
// //         if (!mapping) return null;
// //         const parsed = JSON.parse(mapping);
// //         // If it's the full user object with role_mappings array, extract the first mapping
// //         // (assuming the selected one is the first; adjust if you store a selected index/ID)
// //         if (parsed.role_mappings && Array.isArray(parsed.role_mappings) && parsed.role_mappings.length > 0) {
// //             return parsed.role_mappings[0];
// //         }
// //         // Otherwise, assume it's already the direct mapping object
// //         return parsed;
// //     };

// //     const getUserRole = () => {
// //         const selectedMapping = getSelectedMapping();
// //         return selectedMapping?.role_name?.toLowerCase() || null;
// //     };

// //     const currentRole = getUserRole();
// //     const isAuthenticated = !!localStorage.getItem('access_token') && !!currentRole;

// //     // --- Access flags ---
// //     const canCreateTicket = ['user', 'technician', 'superadmin'].includes(currentRole);
// //     const canAccessAdmin = ['admin', 'superadmin'].includes(currentRole);
// //     const canAccessHOD = ['hod', 'superadmin'].includes(currentRole);
// //     const canAccessCEO = ['ceo', 'superadmin'].includes(currentRole);
// //     const canAccessTechnician = ['technician', 'superadmin'].includes(currentRole);

// //     // --- Handlers ---
// //     const handlePersonClick = (event) => !isMobile && setAnchorEl(event.currentTarget);
// //     const handleMenuClose = () => setAnchorEl(null);
// //     const handleMobileMenuClick = () => setDrawerOpen(true);
// //     const closeDrawer = () => setDrawerOpen(false);
// //     const handlePlusClick = () => navigate("/CreateTicket");
// //     const handleLogoClick = () => navigate('/UserDashboard');

// //     const handleLogoutClick = async () => {
// //         try {
// //             await logoutAPI(); // This records logout_time in user_login_history
// //             // toast.success("Logged out successfully"); // Uncomment after installing react-hot-toast
// //             console.log("Logged out successfully");
// //         } catch (err) {
// //             // toast.warn("Logged out locally"); // Uncomment after installing react-hot-toast
// //             console.warn("Logged out locally");
// //             console.warn("Logout API failed:", err);
// //         } finally {
// //             // Always clear frontend state
// //             localStorage.clear();
// //             navigate("/");
// //         }
// //     };

// //     // --- Load entity info ---
// //     useEffect(() => {
// //         const selectedMapping = getSelectedMapping();
// //         if (!selectedMapping) {
// //             setEntity({ display_name: "Ticket System" });
// //             return;
// //         }
// //         const entityName = selectedMapping.entity_name || "Ticket System";
// //         let logoSrc = null;
// //         const entityNameLower = entityName.toLowerCase().replace(/\s+/g, '');
// //         if (entityNameLower.includes('stemz')) {
// //             logoSrc = stemzLogo;
// //         } else if (entityNameLower.includes('nddiagnostics')) {
// //             logoSrc = ndLogo;
// //         }
// //         const entityData = { display_name: entityName };
// //         if (logoSrc) {
// //             entityData.logo = logoSrc;
// //         }
// //         setEntity(entityData);
// //     }, []);

// //     // --- Desktop Menu ---
// //     const renderDesktopMenu = () => (
// //         <Menu
// //             anchorEl={anchorEl}
// //             open={menuOpen}
// //             onClose={handleMenuClose}
// //             PaperProps={{ sx: { mt: 1, borderRadius: 2, minWidth: 220 } }}
// //         >
// //             {/* Always show User Dashboard as default */}
// //             <MenuItem onClick={() => { navigate("/UserDashboard"); handleMenuClose(); }}>User Dashboard</MenuItem>

// //             {/* Role-specific additional options */}
// //             {canAccessAdmin && (
// //                 <>
// //                     <MenuItem onClick={() => { navigate("/AdminDashboard"); handleMenuClose(); }}>Admin Dashboard</MenuItem>
// //                     <MenuItem onClick={() => { navigate("/admin/entity"); handleMenuClose(); }}>Admin Panel</MenuItem>
// //                 </>
// //             )}
// //             {canAccessHOD && <MenuItem onClick={() => { navigate("/HODdashboard"); handleMenuClose(); }}>HOD Dashboard</MenuItem>}
// //             {canAccessCEO && <MenuItem onClick={() => { navigate("/COEdashboard"); handleMenuClose(); }}>CEO Dashboard</MenuItem>}
// //             {canAccessTechnician && <MenuItem onClick={() => { navigate("/TechnicianDashboard"); handleMenuClose(); }}>Technician Dashboard</MenuItem>}
// //             {canCreateTicket && <MenuItem onClick={() => { navigate("/CreateTicket"); handleMenuClose(); }}>Create Ticket</MenuItem>}
// //             <Divider sx={{ my: 1 }} />
// //             <MenuItem onClick={() => { handleLogoutClick(); handleMenuClose(); }}>Log Out</MenuItem>
// //         </Menu>
// //     );

// //     // --- Mobile Drawer ---
// //     const renderMobileDrawer = () => (
// //         <Drawer anchor="right" open={drawerOpen} onClose={closeDrawer}>
// //             <Box sx={{ width: 220, p: 2 }} role="presentation">
// //                 <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
// //                     <IconButton onClick={closeDrawer}><CloseIcon sx={{ transform: "rotate(180deg)" }} /></IconButton>
// //                 </Box>

// //                 {/* User info */}
// //                 <Box sx={{ px: 2, py: 1 }}>
// //                     <Typography variant="body2" color="text.secondary">{currentRole}</Typography>
// //                 </Box>
// //                 <Divider sx={{ my: 1 }} />

// //                 <List>
// //                     {/* Always show User Dashboard as default */}
// //                     <ListItem disablePadding>
// //                         <ListItemButton onClick={() => { navigate("/UserDashboard"); closeDrawer(); }}>
// //                             <ListItemText primary="User Dashboard" />
// //                         </ListItemButton>
// //                     </ListItem>

// //                     {/* Role-specific additional options */}
// //                     {canAccessAdmin && (
// //                         <>
// //                             <ListItem disablePadding>
// //                                 <ListItemButton onClick={() => { navigate("/AdminDashboard"); closeDrawer(); }}>
// //                                     <ListItemText primary="Admin Dashboard" />
// //                                 </ListItemButton>
// //                             </ListItem>
// //                             <ListItem disablePadding>
// //                                 <ListItemButton onClick={() => { navigate("/admin/entity"); closeDrawer(); }}>
// //                                     <ListItemText primary="Admin Panel" />
// //                                 </ListItemButton>
// //                             </ListItem>
// //                         </>
// //                     )}
// //                     {canAccessHOD && (
// //                         <ListItem disablePadding>
// //                             <ListItemButton onClick={() => { navigate("/HODdashboard"); closeDrawer(); }}>
// //                                 <ListItemText primary="HOD Dashboard" />
// //                             </ListItemButton>
// //                         </ListItem>
// //                     )}
// //                     {canAccessCEO && (
// //                         <ListItem disablePadding>
// //                             <ListItemButton onClick={() => { navigate("/COEdashboard"); closeDrawer(); }}>
// //                                 <ListItemText primary="CEO Dashboard" />
// //                             </ListItemButton>
// //                         </ListItem>
// //                     )}
// //                     {canAccessTechnician && (
// //                         <ListItem disablePadding>
// //                             <ListItemButton onClick={() => { navigate("/TechnicianDashboard"); closeDrawer(); }}>
// //                                 <ListItemText primary="Technician Dashboard" />
// //                             </ListItemButton>
// //                         </ListItem>
// //                     )}
// //                     {canCreateTicket && (
// //                         <ListItem disablePadding>
// //                             <ListItemButton onClick={() => { navigate("/CreateTicket"); closeDrawer(); }}>
// //                                 <ListItemText primary="Create Ticket" />
// //                             </ListItemButton>
// //                         </ListItem>
// //                     )}
// //                     <ListItem disablePadding>
// //                         <ListItemButton onClick={() => { handleLogoutClick(); closeDrawer(); }}>
// //                             <ListItemText primary="Log Out" />
// //                         </ListItemButton>
// //                     </ListItem>
// //                 </List>
// //             </Box>
// //         </Drawer>
// //     );

// //     if (!isAuthenticated) return null;

// //     return (
// //         <AppBar position="static" color='transparent' elevation={1}>
// //             <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
// //                 <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
// //                     {/* Show logo based on entity */}
// //                     {entity?.logo && (
// //                         <img
// //                             src={entity.logo}
// //                             alt="Entity Logo"
// //                             className="entity-logo"
// //                             onClick={handleLogoClick}
// //                             style={{ width: '60px', height: 'auto', cursor: 'pointer' }} // Adjusted size; increase width as needed (e.g., 80px for larger)
// //                         />
// //                     )}
// //                     <Typography sx={{ fontSize: 22, fontWeight: 600 }}>{entity?.display_name} - Approval Matrix</Typography>
// //                 </Box>

// //                 {!isMobile ? (
// //                     <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
// //                         {canCreateTicket && <IconButton onClick={handlePlusClick}><AddIcon sx={{ fontSize: 30, color: '#0d0d0d' }} /></IconButton>}

// //                         {/* Person icon + user name/role next to it */}
// //                         <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={handlePersonClick}>
// //                             <PersonIcon sx={{ fontSize: 30, color: '#0d0d0d', mr: 1 }} />
// //                             <Box>
// //                                 <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{currentRole}</Typography>
// //                             </Box>
// //                         </Box>

// //                         <IconButton onClick={handleLogoutClick}><LogoutIcon sx={{ fontSize: 30, color: '#0d0d0d' }} /></IconButton>
// //                     </Box>
// //                 ) : (
// //                     <IconButton onClick={handleMobileMenuClick}><MenuIcon sx={{ fontSize: 30, color: '#0d0d0d' }} /></IconButton>
// //                 )}

// //                 {renderDesktopMenu()}
// //                 {renderMobileDrawer()}
// //             </Toolbar>
// //         </AppBar>
// //     );
// // };

// // export default Header;

// import { useState, useEffect, useMemo } from 'react';
// import {
//     AppBar,
//     Avatar,
//     Box,
//     Divider,
//     Drawer,
//     IconButton,
//     List,
//     ListItem,
//     ListItemButton,
//     ListItemText,
//     Toolbar,
//     Typography,
//     useMediaQuery,
//     useTheme,
//     Paper,
//     Tooltip,
//     Dialog,
//     DialogTitle,
//     DialogContent,
//     DialogActions,
//     ListItemIcon,
//     CircularProgress,
//     FormControl,
//     InputLabel,
//     Select,
//     MenuItem,
//     Button,
// } from "@mui/material";
// import AddIcon from '@mui/icons-material/Add';
// import LogoutIcon from '@mui/icons-material/Logout';
// import { LuTicketPlus } from "react-icons/lu";
// import MenuIcon from '@mui/icons-material/Menu';
// import CloseIcon from '@mui/icons-material/Close';
// import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
// import SwapHorizontalCircleIcon from '@mui/icons-material/SwapHorizontalCircle';
// import BusinessIcon from '@mui/icons-material/Business';
// import { useNavigate } from 'react-router-dom';
// import { Media_URL, fetchEntitiesAPI } from "../../Api";
// import { logoutAPI } from "../../Api";
// import stemzLogo from "../../assets/download.png";
// import ndLogo from "../../assets/ndLogo.jpeg";
// const Header = () => {
//     const [drawerOpen, setDrawerOpen] = useState(false);
//     const [profileOpen, setProfileOpen] = useState(false);
//     const [entityDialogOpen, setEntityDialogOpen] = useState(false);
//     const [roleSwitchDialogOpen, setRoleSwitchDialogOpen] = useState(false);
//     const [currentSelected, setCurrentSelected] = useState(null);
//     const [availableMappings, setAvailableMappings] = useState([]);
//     const [entities, setEntities] = useState([]);
//     const [selectedEntity, setSelectedEntity] = useState("");
//     const [selectedRole, setSelectedRole] = useState("");
//     const [loadingMappings, setLoadingMappings] = useState(false);
//     const [loadingEntities, setLoadingEntities] = useState(false);
//     const [shouldNavigateAfterSelect, setShouldNavigateAfterSelect] = useState(false);
//     const theme = useTheme();
//     const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
//     const navigate = useNavigate();
//     const media_url = Media_URL;
//     const getSelectedMapping = () => {
//         const mappingStr = localStorage.getItem('selected_role_mapping');
//         if (!mappingStr) return null;
//         const parsed = JSON.parse(mappingStr);
//         if (parsed.role_mappings?.length > 0) return parsed.role_mappings[0];
//         return parsed;
//     };
//     const getUserEntityFallback = () => {
//         const entityStr = localStorage.getItem('userEntity');
//         if (!entityStr) return null;
//         return JSON.parse(entityStr);
//     };
//     const getUserData = () => {
//         return JSON.parse(localStorage.getItem("user_data") || "{}");
//     };
//     const getUserRole = () => {
//         const selectedMapping = getSelectedMapping();
//         if (selectedMapping?.role_name) {
//             return selectedMapping.role_name.toLowerCase();
//         }
//         // Fallback to user_data.roles if available
//         const userData = getUserData();
//         const primaryRole = userData.roles?.[0]?.name || 'user';
//         return primaryRole.toLowerCase();
//     };
//     const hasValidMapping = () => {
//         const selectedMapping = getSelectedMapping();
//         const currentRoleLocal = getUserRole();
//         if (currentRoleLocal === 'superadmin') {
//             return !!selectedMapping; // Valid as long as mapping exists
//         }
//         const hasMappingEntity = !!selectedMapping?.entity_id;
//         const userEntity = getUserEntityFallback();
//         const hasFallbackEntity = !!userEntity?.id;
//         return hasMappingEntity || hasFallbackEntity;
//     };
//     const currentRole = getUserRole();
//     const isAuthenticated = !!localStorage.getItem('access_token') && !!currentRole;
//     const canCreateTicket = ['user', 'technician', 'superadmin'].includes(currentRole);
//     const canAccessAdmin = ['admin', 'superadmin'].includes(currentRole);
//     const canAccessHOD = ['hod'].includes(currentRole);
//     const canAccessCEO = ['ceo'].includes(currentRole);
//     const canAccessTechnician = ['technician'].includes(currentRole);
//     const selectedMapping = getSelectedMapping();
//     const userEntity = getUserEntityFallback();
//     const computedEntity = useMemo(() => {
//         let entityName = "Ticket System";
//         let logoSrc = null;
//         if (selectedMapping?.entity_id) {
//             entityName = selectedMapping.entity_name || "Ticket System";
//         } else if (userEntity?.id) {
//             entityName = userEntity.display_name || userEntity.name || "Ticket System";
//         }
//         const lowerName = entityName.toLowerCase().replace(/\s+/g, "");
//         if (lowerName.includes("stemz")) logoSrc = stemzLogo;
//         else if (lowerName.includes("nddiagnostics")) logoSrc = ndLogo;
//         return { display_name: entityName, logo: logoSrc };
//     }, [selectedMapping, userEntity]);
//     const canSwitchRole = useMemo(() => {
//         if (currentRole === 'superadmin') {
//             return entities.length > 1;
//         } else {
//             return availableMappings.length > 1;
//         }
//     }, [currentRole, entities.length, availableMappings.length]);
//     const handleLogout = async () => {
//         try {
//             await logoutAPI();
//         } catch (e) { }
//         localStorage.clear();
//         navigate("/");
//     };
//     const fetchEntities = async () => {
//         setLoadingEntities(true);
//         try {
//             const data = await fetchEntitiesAPI();
//             // For superadmin, limit to first 3 entities
//             const limitedEntities = currentRole === 'superadmin' ? data.slice(0, 3) : data;
//             setEntities(limitedEntities);
//         } catch (error) {
//             console.error("Failed to fetch entities:", error);
//             setEntities([]);
//         } finally {
//             setLoadingEntities(false);
//         }
//     };
//     const handleEntitySelect = (entity) => {
//         const userData = getUserData();
//         let defaultRoleName = getUserRole();
//         let roleId = null;
//         if (defaultRoleName !== 'superadmin') {
//             const roleObj = userData.roles?.find(r => r.name.toLowerCase() === defaultRoleName);
//             roleId = roleObj?.id;
//         }
//         const defaultMapping = {
//             entity_id: entity.id,
//             entity_name: entity.name,
//             role_id: roleId,
//             role_name: defaultRoleName,
//             ...(defaultRoleName === 'superadmin' && { all_access: true })
//         };
//         localStorage.setItem("selected_role_mapping", JSON.stringify(defaultMapping));
//         setEntityDialogOpen(false);
//         if (shouldNavigateAfterSelect) {
//             navigate("/CreateTicket");
//         }
//         setShouldNavigateAfterSelect(false);
//     };
//     const loadAvailableMappings = async () => {
//         setLoadingMappings(true);
//         try {
//             const mappings = JSON.parse(localStorage.getItem("available_role_mappings") || "[]");
//             setAvailableMappings(mappings);
//             if (mappings.length === 0) {
//                 await fetchEntities();
//             }
//         } catch (error) {
//             console.error("Failed to load available mappings:", error);
//             setAvailableMappings([]);
//             await fetchEntities();
//         } finally {
//             setLoadingMappings(false);
//         }
//     };
//     const handleCreateTicketClick = async () => {
//         if (hasValidMapping()) {
//             const selected = getSelectedMapping();
//             if (currentRole === 'superadmin' && !selected?.entity_id) {
//                 await fetchEntities();
//                 setEntityDialogOpen(true);
//                 return;
//             }
//             navigate("/CreateTicket");
//             return;
//         }
//         await loadAvailableMappings();
//         setEntityDialogOpen(true);
//     };
//     const handleConfirmSelection = () => {
//         const selected = availableMappings.find(
//             (r) => r.entity_id === selectedEntity && r.role_id === selectedRole
//         );
//         if (!selected) return;
//         localStorage.setItem("selected_role_mapping", JSON.stringify(selected));
//         setEntityDialogOpen(false);
//         setSelectedEntity("");
//         setSelectedRole("");
//         // Navigate to CreateTicket
//         navigate("/CreateTicket");
//     };
//     const handleSwitchRoleClick = async () => {
//         if (!canSwitchRole) return;
//         await loadAvailableMappings();
//         setCurrentSelected(getSelectedMapping());
//         setSelectedEntity("");
//         setSelectedRole("");
//         setRoleSwitchDialogOpen(true);
//     };
//     const handleSwitchConfirm = () => {
//         let newMapping;
//         if (currentRole === 'superadmin') {
//             // For superadmin, select from entities list
//             const selectedEnt = entities.find(ent => ent.id.toString() === selectedEntity);
//             if (!selectedEnt) return;
//             newMapping = {
//                 entity_id: selectedEnt.id,
//                 entity_name: selectedEnt.name,
//                 role_id: null,
//                 role_name: 'superadmin',
//                 all_access: true
//             };
//         } else {
//             // For others, from mappings
//             newMapping = availableMappings.find(
//                 (r) => r.entity_id.toString() === selectedEntity && r.role_id.toString() === selectedRole
//             );
//             if (!newMapping) return;
//         }
//         localStorage.setItem("selected_role_mapping", JSON.stringify(newMapping));
//         setRoleSwitchDialogOpen(false);
//         setSelectedEntity("");
//         setSelectedRole("");
//     };
//     // filter roles based on selected entity
//     const rolesForSelectedEntity = availableMappings.filter(
//         (r) => r.entity_id.toString() === selectedEntity
//     );
//     const handleProfileClick = () => {
//         navigate("/profile");
//     };
//     useEffect(() => {
//         loadAvailableMappings();
//     }, []);
//     const userData = getUserData();
//     const profileImage = userData?.profile_image
//         ? `${media_url}${userData.profile_image}`
//         : null;
//     const fallbackImage =
//         "https://ui-avatars.com/api/?rounded=false&name=" +
//         (userData?.name || "User");
//     if (!isAuthenticated) return null;
//     return (
//         <AppBar position="static" color="transparent" elevation={1}
//             sx={{
//                 background: "rgba(255,255,255,0.9)",
//                 backdropFilter: "blur(10px)"
//             }}
//         >
//             <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                 {/* Left Header */}
//                 <Box sx={{ display: "flex", gap: 2, alignItems: "center", cursor: "pointer" }}
//                     onClick={() => navigate("/UserDashboard")}
//                 >
//                     {computedEntity.logo && (
//                         <img
//                             src={computedEntity.logo}
//                             alt="Entity Logo"
//                             style={{
//                                 width: 60,
//                                 height: 60,
//                                 borderRadius: "50%",
//                                 objectFit: "contain",
//                                 border: "2px solid #e0e0e0",
//                             }}
//                         />
//                     )}
//                     <Box>
//                         <Typography variant="h6" fontWeight={700}>
//                             {computedEntity.display_name}
//                         </Typography>
//                         <Typography variant="caption" sx={{ color: "#667eea" }}>
//                             Approval Portal
//                         </Typography>
//                     </Box>
//                 </Box>
//                 {/* Right Side */}
//                 {!isMobile ? (
//                     <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//                         {/* Create Ticket BTN */}
//                         {canCreateTicket && (
//                             <Tooltip title={!hasValidMapping() ? "First select entity" : ""} arrow placement="bottom">
//                                 <span>
//                                     <IconButton
//                                         sx={{
//                                             background: "linear-gradient(135deg,#667eea,#764ba2)",
//                                             color: "white",
//                                             "&:hover": { opacity: 0.8 },
//                                             ...((!hasValidMapping() && currentRole !== 'superadmin') && { opacity: 0.6, cursor: "not-allowed" })
//                                         }}
//                                         onClick={handleCreateTicketClick}
//                                     >
//                                         <LuTicketPlus />
//                                     </IconButton>
//                                 </span>
//                             </Tooltip>
//                         )}
//                         {/* Rectangle Profile Icon */}
//                         <Box
//                             sx={{
//                                 display: "flex",
//                                 alignItems: "center",
//                                 gap: 1.5,
//                                 p: 1,
//                                 backgroundColor: "#f0f0f0",
//                                 borderRadius: "10px",
//                             }}
//                             onClick={() => setProfileOpen(!profileOpen)}
//                         >
//                             <Avatar
//                                 src={profileImage ? `${profileImage}` : null}
//                                 alt="Profile"
//                                 variant="square"
//                                 sx={{
//                                     width: 55,
//                                     height: 55,
//                                     borderRadius: "10px",
//                                     border: "2px solid #e0e0e0",
//                                     backgroundColor: "#e0e0e0",
//                                     display: "flex",
//                                     alignItems: "center",
//                                     justifyContent: "center",
//                                     fontSize: 30,
//                                     color: "#555"
//                                 }}
//                             />
//                             {/* Name + Role */}
//                             <Box sx={{ cursor: 'pointer' }} onClick={handleProfileClick}>
//                                 <Typography variant="subtitle2" fontWeight={700}>
//                                     {userData?.name || "User"}
//                                 </Typography>
//                                 <Typography variant="caption" sx={{ color: "#666" }}>
//                                     {currentRole?.toUpperCase()}
//                                 </Typography>
//                             </Box>
//                         </Box>
//                         {/* Custom Profile Panel */}
//                         {profileOpen && (
//                             <Paper
//                                 elevation={5}
//                                 sx={{
//                                     position: "absolute",
//                                     top: 70,
//                                     right: 20,
//                                     width: 150,
//                                     borderRadius: 3,
//                                     p: 1.5,
//                                     animation: "fadeIn 0.2s ease"
//                                 }}
//                             >
//                                 {/* Profile Button */}
//                                 <ListItemButton onClick={() => navigate("/profile")}>
//                                     <PersonOutlineIcon sx={{ mr: 1 }} /> Profile
//                                 </ListItemButton>
//                                 <ListItemButton onClick={() => navigate("/UserDashboard")}>
//                                     <ListItemText primary="User Dashboard" />
//                                 </ListItemButton>
//                                 {canAccessAdmin && (
//                                     <>
//                                         <ListItemButton onClick={() => navigate("/AdminDashboard")}>
//                                             <ListItemText primary="Admin Dashboard" />
//                                         </ListItemButton>
//                                         <ListItemButton onClick={() => navigate("/admin/entity")}>
//                                             <ListItemText primary="Admin Panel" />
//                                         </ListItemButton>
//                                     </>
//                                 )}
//                                 {canAccessHOD &&
//                                     <ListItemButton onClick={() => navigate("/HODdashboard")}>
//                                         <ListItemText primary="HOD Dashboard" />
//                                     </ListItemButton>
//                                 }
//                                 {canAccessCEO &&
//                                     <ListItemButton onClick={() => navigate("/COEdashboard")}>
//                                         <ListItemText primary="CEO Dashboard" />
//                                     </ListItemButton>
//                                 }
//                                 {canAccessTechnician &&
//                                     <ListItemButton onClick={() => navigate("/TechnicianDashboard")}>
//                                         <ListItemText primary="Technician Dashboard" />
//                                     </ListItemButton>
//                                 }
//                                 {/* Switch Role Button */}
//                                 <ListItemButton onClick={handleSwitchRoleClick} disabled={!canSwitchRole}>
//                                     <SwapHorizontalCircleIcon sx={{ mr: 1 }} /> Switch Entity
//                                 </ListItemButton>
//                                 {/* Logout Button */}
//                                 <ListItemButton onClick={handleLogout}>
//                                     <LogoutIcon sx={{ mr: 1 }} /> Logout
//                                 </ListItemButton>
//                             </Paper>
//                         )}
//                     </Box>
//                 ) : (
//                     <Box onClick={() => setDrawerOpen(true)}>
//                         <Avatar
//                             src={profileImage ? `${profileImage}` : null}
//                             alt="Profile"
//                             variant="square"
//                             sx={{
//                                 width: 55,
//                                 height: 55,
//                                 borderRadius: "10px",
//                                 //border: "2px solid #667eea",
//                                 backgroundColor: "#e0e0e0",
//                                 display: "flex",
//                                 alignItems: "center",
//                                 justifyContent: "center",
//                                 fontSize: 30,
//                                 color: "#555"
//                             }}
//                         />
//                     </Box>
//                 )}
//                 {/* Drawer (Mobile Menu) */}
//                 <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
//                     <Box sx={{ width: 240, p: 2 }}>
//                         <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
//                             <IconButton onClick={() => setDrawerOpen(false)}>
//                                 <CloseIcon />
//                             </IconButton>
//                         </Box>
//                         {/* Menu Items */}
//                         <List>
//                             <ListItemButton onClick={() => navigate("/UserDashboard")}>
//                                 <ListItemText primary="User Dashboard" />
//                             </ListItemButton>
//                             {canAccessAdmin && (
//                                 <>
//                                     <ListItemButton onClick={() => navigate("/AdminDashboard")}>
//                                         <ListItemText primary="Admin Dashboard" />
//                                     </ListItemButton>
//                                     <ListItemButton onClick={() => navigate("/admin/entity")}>
//                                         <ListItemText primary="Admin Panel" />
//                                     </ListItemButton>
//                                 </>
//                             )}
//                             {canAccessHOD &&
//                                 <ListItemButton onClick={() => navigate("/HODdashboard")}>
//                                     <ListItemText primary="HOD Dashboard" />
//                                 </ListItemButton>
//                             }
//                             {canAccessCEO &&
//                                 <ListItemButton onClick={() => navigate("/COEdashboard")}>
//                                     <ListItemText primary="CEO Dashboard" />
//                                 </ListItemButton>
//                             }
//                             {canAccessTechnician &&
//                                 <ListItemButton onClick={() => navigate("/TechnicianDashboard")}>
//                                     <ListItemText primary="Technician Dashboard" />
//                                 </ListItemButton>
//                             }
//                             {canCreateTicket && (
//                                 <ListItemButton
//                                     onClick={handleCreateTicketClick}
//                                     disabled={!hasValidMapping() && currentRole !== 'superadmin'}
//                                 >
//                                     <ListItemText primary="Create Ticket" />
//                                 </ListItemButton>
//                             )}
//                             <ListItemButton onClick={handleLogout}>
//                                 <LogoutIcon sx={{ mr: 1 }} /> Logout
//                             </ListItemButton>
//                         </List>
//                     </Box>
//                 </Drawer>
//                 {/* Entity/Role Selection Dialog */}
//                 <Dialog open={entityDialogOpen} onClose={() => setEntityDialogOpen(false)} maxWidth="sm" fullWidth>
//                     <DialogTitle>Select Entity to Create Ticket</DialogTitle>
//                     <DialogContent>
//                         {loadingMappings || loadingEntities ? (
//                             <Box display="flex" justifyContent="center" p={2}>
//                                 <CircularProgress />
//                             </Box>
//                         ) : availableMappings.length > 0 ? (
//                             <>
//                                 <FormControl fullWidth sx={{ my: 2 }}>
//                                     <InputLabel id="entity-select-label">Entity</InputLabel>
//                                     <Select
//                                         labelId="entity-select-label"
//                                         value={selectedEntity}
//                                         label="Entity"
//                                         onChange={(e) => {
//                                             setSelectedEntity(e.target.value);
//                                             setSelectedRole(""); // reset role selection
//                                         }}
//                                     >
//                                         {[...new Set(availableMappings.map((r) => r.entity_id))].map((entityId) => {
//                                             const entityName = availableMappings.find((r) => r.entity_id === entityId).entity_name;
//                                             return (
//                                                 <MenuItem key={entityId} value={entityId}>
//                                                     {entityName}
//                                                 </MenuItem>
//                                             );
//                                         })}
//                                     </Select>
//                                 </FormControl>
//                                 <FormControl fullWidth>
//                                     <InputLabel id="role-select-label">Role</InputLabel>
//                                     <Select
//                                         labelId="role-select-label"
//                                         value={selectedRole}
//                                         label="Role"
//                                         onChange={(e) => setSelectedRole(e.target.value)}
//                                         disabled={!selectedEntity}
//                                     >
//                                         {rolesForSelectedEntity.map((r) => (
//                                             <MenuItem key={r.role_id} value={r.role_id}>
//                                                 {r.role_name}
//                                             </MenuItem>
//                                         ))}
//                                     </Select>
//                                 </FormControl>
//                             </>
//                         ) : (
//                             <List>
//                                 {entities.map((ent) => (
//                                     <ListItemButton
//                                         key={ent.id}
//                                         onClick={() => handleEntitySelect(ent)}
//                                         sx={{ py: 1 }}
//                                     >
//                                         <ListItemIcon>
//                                             <BusinessIcon />
//                                         </ListItemIcon>
//                                         <ListItemText primary={ent.name} secondary={ent.description || ""} />
//                                     </ListItemButton>
//                                 ))}
//                             </List>
//                         )}
//                     </DialogContent>
//                     {availableMappings.length > 0 && (
//                         <DialogActions>
//                             <Button
//                                 variant="contained"
//                                 disabled={!selectedEntity || !selectedRole}
//                                 onClick={handleConfirmSelection}
//                             >
//                                 Continue
//                             </Button>
//                         </DialogActions>
//                     )}
//                 </Dialog>
//                 {/* Role Switch Dialog */}
//                 <Dialog open={roleSwitchDialogOpen} onClose={() => setRoleSwitchDialogOpen(false)} maxWidth="sm" fullWidth>
//                     <DialogTitle>Switch Role</DialogTitle>
//                     <DialogContent>
//                         {loadingMappings || loadingEntities ? (
//                             <Box display="flex" justifyContent="center" p={2}>
//                                 <CircularProgress />
//                             </Box>
//                         ) : currentRole === 'superadmin' ? (
//                             <List>
//                                 {entities.filter(ent => ent.id !== (currentSelected?.entity_id || 0)).map((ent) => (
//                                     <ListItemButton
//                                         key={ent.id}
//                                         onClick={() => setSelectedEntity(ent.id.toString())}
//                                         selected={selectedEntity === ent.id.toString()}
//                                         sx={{ py: 1 }}
//                                     >
//                                         <ListItemIcon>
//                                             <BusinessIcon />
//                                         </ListItemIcon>
//                                         <ListItemText primary={ent.name} secondary={ent.description || ""} />
//                                     </ListItemButton>
//                                 ))}
//                             </List>
//                         ) : availableMappings.length > 0 ? (
//                             <>
//                                 <FormControl fullWidth sx={{ my: 2 }}>
//                                     <InputLabel id="entity-select-label">Entity</InputLabel>
//                                     <Select
//                                         labelId="entity-select-label"
//                                         value={selectedEntity}
//                                         label="Entity"
//                                         onChange={(e) => {
//                                             setSelectedEntity(e.target.value);
//                                             setSelectedRole(""); // reset role selection
//                                         }}
//                                     >
//                                         {[...new Set(availableMappings.map((r) => r.entity_id))].filter(entityId => entityId !== (currentSelected?.entity_id || 0)).map((entityId) => {
//                                             const entityName = availableMappings.find((r) => r.entity_id === entityId).entity_name;
//                                             return (
//                                                 <MenuItem key={entityId} value={entityId}>
//                                                     {entityName}
//                                                 </MenuItem>
//                                             );
//                                         })}
//                                     </Select>
//                                 </FormControl>
//                                 <FormControl fullWidth>
//                                     <InputLabel id="role-select-label">Role</InputLabel>
//                                     <Select
//                                         labelId="role-select-label"
//                                         value={selectedRole}
//                                         label="Role"
//                                         onChange={(e) => setSelectedRole(e.target.value)}
//                                         disabled={!selectedEntity}
//                                     >
//                                         {rolesForSelectedEntity.filter(r => r.role_id !== (currentSelected?.role_id || 0)).map((r) => (
//                                             <MenuItem key={r.role_id} value={r.role_id}>
//                                                 {r.role_name}
//                                             </MenuItem>
//                                         ))}
//                                     </Select>
//                                 </FormControl>
//                             </>
//                         ) : (
//                             <Typography>No available roles to switch.</Typography>
//                         )}
//                     </DialogContent>
//                     <DialogActions>
//                         <Button onClick={() => setRoleSwitchDialogOpen(false)}>Cancel</Button>
//                         <Button
//                             variant="contained"
//                             disabled={!selectedEntity || (currentRole !== 'superadmin' && !selectedRole)}
//                             onClick={handleSwitchConfirm}
//                         >
//                             Switch
//                         </Button>
//                     </DialogActions>
//                 </Dialog>
//             </Toolbar>
//         </AppBar>
//     );
// };
// export default Header;


import { useState, useEffect, useMemo } from 'react';
import {
    AppBar,
    Avatar,
    Box,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Toolbar,
    Typography,
    useMediaQuery,
    useTheme,
    Paper,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    ListItemIcon,
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import LogoutIcon from '@mui/icons-material/Logout';
import { LuTicketPlus } from "react-icons/lu";
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import SwapHorizontalCircleIcon from '@mui/icons-material/SwapHorizontalCircle';
import BusinessIcon from '@mui/icons-material/Business';
import { useNavigate } from 'react-router-dom';
import { Media_URL, fetchEntitiesAPI } from "../../Api";
import { logoutAPI } from "../../Api";
import stemzLogo from "../../assets/download.png";
import ndLogo from "../../assets/ndLogo.jpeg";
const Header = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [entityDialogOpen, setEntityDialogOpen] = useState(false);
    const [roleSwitchDialogOpen, setRoleSwitchDialogOpen] = useState(false);
    const [currentSelected, setCurrentSelected] = useState(null);
    const [availableMappings, setAvailableMappings] = useState([]);
    const [entities, setEntities] = useState([]);
    const [selectedEntity, setSelectedEntity] = useState("");
    const [selectedRole, setSelectedRole] = useState("");
    const [loadingMappings, setLoadingMappings] = useState(false);
    const [loadingEntities, setLoadingEntities] = useState(false);
    const [shouldNavigateAfterSelect, setShouldNavigateAfterSelect] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const navigate = useNavigate();
    const media_url = Media_URL;
    const getSelectedMapping = () => {
        const mappingStr = localStorage.getItem('selected_role_mapping');
        if (!mappingStr) return null;
        const parsed = JSON.parse(mappingStr);
        if (parsed.role_mappings?.length > 0) return parsed.role_mappings[0];
        return parsed;
    };
    const getUserEntityFallback = () => {
        const entityStr = localStorage.getItem('userEntity');
        if (!entityStr) return null;
        return JSON.parse(entityStr);
    };
    const getUserData = () => {
        return JSON.parse(localStorage.getItem("user_data") || "{}");
    };
    const getUserRole = () => {
        const selectedMapping = getSelectedMapping();
        if (selectedMapping?.role_name) {
            return selectedMapping.role_name.toLowerCase();
        }
        // Fallback to user_data.roles if available
        const userData = getUserData();
        const primaryRole = userData.roles?.[0]?.name || 'user';
        return primaryRole.toLowerCase();
    };
    const hasValidMapping = () => {
        const selectedMapping = getSelectedMapping();
        const currentRoleLocal = getUserRole();
        if (currentRoleLocal === 'superadmin') {
            return !!selectedMapping; // Valid as long as mapping exists
        }
        const hasMappingEntity = !!selectedMapping?.entity_id;
        const userEntity = getUserEntityFallback();
        const hasFallbackEntity = !!userEntity?.id;
        return hasMappingEntity || hasFallbackEntity;
    };
    const currentRole = getUserRole();
    const isAuthenticated = !!localStorage.getItem('access_token') && !!currentRole;
    const canCreateTicket = ['user', 'technician', 'superadmin'].includes(currentRole);
    const canAccessAdmin = ['admin', 'superadmin'].includes(currentRole);
    const canAccessHOD = ['hod'].includes(currentRole);
    const canAccessCEO = ['ceo'].includes(currentRole);
    const canAccessTechnician = ['technician'].includes(currentRole);
    const selectedMapping = getSelectedMapping();
    const userEntity = getUserEntityFallback();
    const computedEntity = useMemo(() => {
        let entityName = "Ticket System";
        let logoSrc = null;
        if (selectedMapping?.entity_id) {
            entityName = selectedMapping.entity_name || "Ticket System";
        } else if (userEntity?.id) {
            entityName = userEntity.display_name || userEntity.name || "Ticket System";
        }
        const lowerName = entityName.toLowerCase().replace(/\s+/g, "");
        if (lowerName.includes("stemz")) logoSrc = stemzLogo;
        else if (lowerName.includes("nddiagnostics")) logoSrc = ndLogo;
        return { display_name: entityName, logo: logoSrc };
    }, [selectedMapping, userEntity]);
    const canSwitchRole = useMemo(() => {
        if (currentRole === 'superadmin') {
            return entities.length > 1;
        } else {
            return availableMappings.length > 1;
        }
    }, [currentRole, entities.length, availableMappings.length]);
    const isGlobalEntity = (entity) => {
    // Match by name (case-insensitive) or by id if it's '0' or 0
    return (
        entity.name?.toLowerCase() === 'global' ||
        entity.id === '0' || 
        entity.id === 0
    );
};
    const handleLogout = async () => {
        try {
            await logoutAPI();
        } catch (e) { }
        localStorage.clear();
        navigate("/");
    };
    const fetchEntities = async () => {
    setLoadingEntities(true);
    try {
        const data = await fetchEntitiesAPI();
        // Exclude Global entity
        const filtered = data.filter(ent => !isGlobalEntity(ent));

        // For superadmin, limit to first 3 (after filtering)
        const limitedEntities = currentRole === 'superadmin' 
            ? filtered.slice(0, 3) 
            : filtered;

        setEntities(limitedEntities);
    } catch (error) {
        console.error("Failed to fetch entities:", error);
        setEntities([]);
    } finally {
        setLoadingEntities(false);
    }
};
    // const fetchEntities = async () => {
    //     setLoadingEntities(true);
    //     try {
    //         const data = await fetchEntitiesAPI();
    //         // For superadmin, limit to first 3 entities
    //         const limitedEntities = currentRole === 'superadmin' ? data.slice(0, 3) : data;
    //         setEntities(limitedEntities);
    //     } catch (error) {
    //         console.error("Failed to fetch entities:", error);
    //         setEntities([]);
    //     } finally {
    //         setLoadingEntities(false);
    //     }
    // };
    const handleEntitySelect = (entity) => {
        const userData = getUserData();
        let defaultRoleName = getUserRole();
        let roleId = null;
        if (defaultRoleName !== 'superadmin') {
            const roleObj = userData.roles?.find(r => r.name.toLowerCase() === defaultRoleName);
            roleId = roleObj?.id;
        }
        const defaultMapping = {
            entity_id: entity.id,
            entity_name: entity.name,
            role_id: roleId,
            role_name: defaultRoleName,
            ...(defaultRoleName === 'superadmin' && { all_access: true })
        };
        localStorage.setItem("selected_role_mapping", JSON.stringify(defaultMapping));
        localStorage.setItem("userEntity", JSON.stringify({
        id: entity.id,
        name: entity.name,
        display_name: entity.display_name || entity.name,
        logo: entity.logo
    }));
        setEntityDialogOpen(false);
        if (shouldNavigateAfterSelect) {
            navigate("/CreateTicket");
        }
        setShouldNavigateAfterSelect(false);
    };
    const loadAvailableMappings = async () => {
    setLoadingMappings(true);
    try {
        let mappings = JSON.parse(localStorage.getItem("available_role_mappings") || "[]");
        
        // Remove any mappings linked to Global entity
        mappings = mappings.filter(m => !isGlobalEntity(m));

        setAvailableMappings(mappings);

        if (mappings.length === 0) {
            await fetchEntities();
        }
    } catch (error) {
        console.error("Failed to load available mappings:", error);
        setAvailableMappings([]);
        await fetchEntities();
    } finally {
        setLoadingMappings(false);
    }
};
    // const loadAvailableMappings = async () => {
    //     setLoadingMappings(true);
    //     try {
    //         const mappings = JSON.parse(localStorage.getItem("available_role_mappings") || "[]");
    //         setAvailableMappings(mappings);
    //         if (mappings.length === 0) {
    //             await fetchEntities();
    //         }
    //     } catch (error) {
    //         console.error("Failed to load available mappings:", error);
    //         setAvailableMappings([]);
    //         await fetchEntities();
    //     } finally {
    //         setLoadingMappings(false);
    //     }
    // };
    const handleCreateTicketClick = async () => {
        if (hasValidMapping()) {
            const selected = getSelectedMapping();
            if (currentRole === 'superadmin' && !selected?.entity_id) {
                await fetchEntities();
                setEntityDialogOpen(true);
                return;
            }
            navigate("/CreateTicket");
            return;
        }
        await loadAvailableMappings();
        setEntityDialogOpen(true);
    };
    const handleConfirmSelection = () => {
        const selected = availableMappings.find(
            (r) => r.entity_id === selectedEntity && r.role_id === selectedRole
        );
        if (!selected) return;
        localStorage.setItem("selected_role_mapping", JSON.stringify(selected));
        setEntityDialogOpen(false);
        setSelectedEntity("");
        setSelectedRole("");
        // Navigate to CreateTicket
        navigate("/CreateTicket");
    };
    const handleSwitchRoleClick = async () => {
        if (!canSwitchRole) return;
        await loadAvailableMappings();
        setCurrentSelected(getSelectedMapping());
        setSelectedEntity("");
        setSelectedRole("");
        setRoleSwitchDialogOpen(true);
    };
    const handleSwitchConfirm = () => {
        let newMapping;
        if (currentRole === 'superadmin') {
            // For superadmin, select from entities list
            const selectedEnt = entities.find(ent => ent.id.toString() === selectedEntity);
            if (!selectedEnt) return;
            newMapping = {
                entity_id: selectedEnt.id,
                entity_name: selectedEnt.name,
                role_id: null,
                role_name: 'superadmin',
                all_access: true
            };
        } else {
            // For others, from mappings
            newMapping = availableMappings.find(
                (r) => r.entity_id.toString() === selectedEntity && r.role_id.toString() === selectedRole
            );
            if (!newMapping) return;
        }
        localStorage.setItem("selected_role_mapping", JSON.stringify(newMapping));
        // This ensures userEntity is always valid
        localStorage.setItem("userEntity", JSON.stringify({
            id: newMapping.entity_id,
            name: newMapping.entity_name,
            display_name: newMapping.display_name || newMapping.entity_name,
            logo: newMapping.logo || null
        }));
        setRoleSwitchDialogOpen(false);
        setSelectedEntity("");
        setSelectedRole("");
    };
    // filter roles based on selected entity
    const rolesForSelectedEntity = availableMappings.filter(
        (r) => r.entity_id.toString() === selectedEntity
    );
    const handleProfileClick = () => {
        navigate("/profile");
    };
    useEffect(() => {
        loadAvailableMappings();
    }, []);
    const userData = getUserData();
    const profileImage = userData?.profile_image
        ? `${media_url}${userData.profile_image}`
        : null;
    const fallbackImage =
        "https://ui-avatars.com/api/?rounded=false&name=" +
        (userData?.name || "User");
    if (!isAuthenticated) return null;
    return (
        <AppBar position="static" color="transparent" elevation={1}
            sx={{
                background: "rgba(255,255,255,0.9)",
                backdropFilter: "blur(10px)"
            }}
        >
            <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                {/* Left Header */}
                <Box sx={{ display: "flex", gap: 2, alignItems: "center", cursor: "pointer" }}
                    onClick={() => navigate("/UserDashboard")}
                >
                    {computedEntity.logo && (
                        <img
                            src={computedEntity.logo}
                            alt="Entity Logo"
                            style={{
                                width: 60,
                                height: 60,
                                borderRadius: "50%",
                                objectFit: "contain",
                                border: "2px solid #e0e0e0",
                            }}
                        />
                    )}
                    <Box>
                        <Typography variant="h6" fontWeight={700}>
                            {computedEntity.display_name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#667eea" }}>
                            Helpdesk 
                        </Typography>
                    </Box>
                </Box>
                {/* Right Side */}
                {!isMobile ? (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        {/* Create Ticket BTN */}
                        {canCreateTicket && (
                            <Tooltip title={!hasValidMapping() ? "First select entity" : ""} arrow placement="bottom">
                                <span>
                                    <IconButton
                                        sx={{
                                            background: "linear-gradient(135deg,#667eea,#764ba2)",
                                            color: "white",
                                            "&:hover": { opacity: 0.8 },
                                            ...((!hasValidMapping() && currentRole !== 'superadmin') && { opacity: 0.6, cursor: "not-allowed" })
                                        }}
                                        onClick={handleCreateTicketClick}
                                    >
                                        <LuTicketPlus />
                                    </IconButton>
                                </span>
                            </Tooltip>
                        )}
                        {/* Rectangle Profile Icon */}
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1.5,
                                p: 1,
                                backgroundColor: "#f0f0f0",
                                borderRadius: "10px",
                            }}
                            onClick={() => setProfileOpen(!profileOpen)}
                        >
                            <Avatar
                                src={profileImage ? `${profileImage}` : null}
                                alt="Profile"
                                variant="square"
                                sx={{
                                    width: 55,
                                    height: 55,
                                    borderRadius: "10px",
                                    border: "2px solid #e0e0e0",
                                    backgroundColor: "#e0e0e0",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 30,
                                    color: "#555"
                                }}
                            />
                            {/* Name + Role */}
                            <Box sx={{ cursor: 'pointer' }} onClick={handleProfileClick}>
                                <Typography variant="subtitle2" fontWeight={700}>
                                    {userData?.name || "User"}
                                </Typography>
                                <Typography variant="caption" sx={{ color: "#666" }}>
                                    {currentRole?.toUpperCase()}
                                </Typography>
                            </Box>
                        </Box>
                        {/* Custom Profile Panel */}
                        {profileOpen && (
                            <Paper
                                elevation={5}
                                sx={{
                                    position: "absolute",
                                    top: 70,
                                    right: 20,
                                    width: 150,
                                    borderRadius: 3,
                                    p: 1.5,
                                    animation: "fadeIn 0.2s ease"
                                }}
                            >
                                {/* Profile Button */}
                                <ListItemButton onClick={() => navigate("/profile")}>
                                    <PersonOutlineIcon sx={{ mr: 1 }} /> Profile
                                </ListItemButton>
                                <ListItemButton onClick={() => navigate("/UserDashboard")}>
                                    <ListItemText primary="User Dashboard" />
                                </ListItemButton>
                                {canAccessAdmin && (
                                    <>
                                        <ListItemButton onClick={() => navigate("/AdminDashboard")}>
                                            <ListItemText primary="Admin Dashboard" />
                                        </ListItemButton>
                                        <ListItemButton onClick={() => navigate("/admin/entity")}>
                                            <ListItemText primary="Admin Panel" />
                                        </ListItemButton>
                                    </>
                                )}
                                {canAccessHOD &&
                                    <ListItemButton onClick={() => navigate("/HODdashboard")}>
                                        <ListItemText primary="HOD Dashboard" />
                                    </ListItemButton>
                                }
                                {canAccessCEO &&
                                    <ListItemButton onClick={() => navigate("/COEdashboard")}>
                                        <ListItemText primary="CEO Dashboard" />
                                    </ListItemButton>
                                }
                                {canAccessTechnician &&
                                    <ListItemButton onClick={() => navigate("/TechnicianDashboard")}>
                                        <ListItemText primary="Technician Dashboard" />
                                    </ListItemButton>
                                }
                                {/* Switch Role Button */}
                                <ListItemButton onClick={handleSwitchRoleClick} disabled={!canSwitchRole}>
                                    <SwapHorizontalCircleIcon sx={{ mr: 1 }} /> Switch Entity
                                </ListItemButton>
                                {/* Logout Button */}
                                <ListItemButton onClick={handleLogout}>
                                    <LogoutIcon sx={{ mr: 1 }} /> Logout
                                </ListItemButton>
                            </Paper>
                        )}
                    </Box>
                ) : (
                    <Box onClick={() => setDrawerOpen(true)}>
                        <Avatar
                            src={profileImage ? `${profileImage}` : null}
                            alt="Profile"
                            variant="square"
                            sx={{
                                width: 55,
                                height: 55,
                                borderRadius: "10px",
                                //border: "2px solid #667eea",
                                backgroundColor: "#e0e0e0",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 30,
                                color: "#555"
                            }}
                        />
                    </Box>
                )}
                {/* Drawer (Mobile Menu) */}
                <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
                    <Box sx={{ width: 240, p: 2 }}>
                        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                            <IconButton onClick={() => setDrawerOpen(false)}>
                                <CloseIcon />
                            </IconButton>
                        </Box>
                        {/* Menu Items */}
                        <List>
                            <ListItemButton onClick={() => navigate("/UserDashboard")}>
                                <ListItemText primary="User Dashboard" />
                            </ListItemButton>
                            {canAccessAdmin && (
                                <>
                                    <ListItemButton onClick={() => navigate("/AdminDashboard")}>
                                        <ListItemText primary="Admin Dashboard" />
                                    </ListItemButton>
                                    <ListItemButton onClick={() => navigate("/admin/entity")}>
                                        <ListItemText primary="Admin Panel" />
                                    </ListItemButton>
                                </>
                            )}
                            {canAccessHOD &&
                                <ListItemButton onClick={() => navigate("/HODdashboard")}>
                                    <ListItemText primary="HOD Dashboard" />
                                </ListItemButton>
                            }
                            {canAccessCEO &&
                                <ListItemButton onClick={() => navigate("/COEdashboard")}>
                                    <ListItemText primary="CEO Dashboard" />
                                </ListItemButton>
                            }
                            {canAccessTechnician &&
                                <ListItemButton onClick={() => navigate("/TechnicianDashboard")}>
                                    <ListItemText primary="Technician Dashboard" />
                                </ListItemButton>
                            }
                            {canCreateTicket && (
                                <ListItemButton
                                    onClick={handleCreateTicketClick}
                                    disabled={!hasValidMapping() && currentRole !== 'superadmin'}
                                >
                                    <ListItemText primary="Create Ticket" />
                                </ListItemButton>
                            )}
                            <ListItemButton onClick={handleLogout}>
                                <LogoutIcon sx={{ mr: 1 }} /> Logout
                            </ListItemButton>
                        </List>
                    </Box>
                </Drawer>
                {/* Entity/Role Selection Dialog */}
                <Dialog open={entityDialogOpen} onClose={() => setEntityDialogOpen(false)} maxWidth="sm" fullWidth>
                    <DialogTitle>Select Entity to Create Ticket</DialogTitle>
                    <DialogContent>
                        {loadingMappings || loadingEntities ? (
                            <Box display="flex" justifyContent="center" p={2}>
                                <CircularProgress />
                            </Box>
                        ) : availableMappings.length > 0 ? (
                            <>
                                <FormControl fullWidth sx={{ my: 2 }}>
                                    <InputLabel id="entity-select-label">Entity</InputLabel>
                                    <Select
                                        labelId="entity-select-label"
                                        value={selectedEntity}
                                        label="Entity"
                                        onChange={(e) => {
                                            setSelectedEntity(e.target.value);
                                            setSelectedRole(""); // reset role selection
                                        }}
                                    >
                                        {[...new Set(availableMappings.map((r) => r.entity_id))].map((entityId) => {
                                            const entityName = availableMappings.find((r) => r.entity_id === entityId).entity_name;
                                            return (
                                                <MenuItem key={entityId} value={entityId}>
                                                    {entityName}
                                                </MenuItem>
                                            );
                                        })}
                                    </Select>
                                </FormControl>
                                <FormControl fullWidth>
                                    <InputLabel id="role-select-label">Role</InputLabel>
                                    <Select
                                        labelId="role-select-label"
                                        value={selectedRole}
                                        label="Role"
                                        onChange={(e) => setSelectedRole(e.target.value)}
                                        disabled={!selectedEntity}
                                    >
                                        {rolesForSelectedEntity.map((r) => (
                                            <MenuItem key={r.role_id} value={r.role_id}>
                                                {r.role_name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </>
                        ) : (
                            <List>
                                {entities.map((ent) => (
                                    <ListItemButton
                                        key={ent.id}
                                        onClick={() => handleEntitySelect(ent)}
                                        sx={{ py: 1 }}
                                    >
                                        <ListItemIcon>
                                            <BusinessIcon />
                                        </ListItemIcon>
                                        <ListItemText primary={ent.name} secondary={ent.description || ""} />
                                    </ListItemButton>
                                ))}
                            </List>
                        )}
                    </DialogContent>
                    {availableMappings.length > 0 && (
                        <DialogActions>
                            <Button
                                variant="contained"
                                disabled={!selectedEntity || !selectedRole}
                                onClick={handleConfirmSelection}
                            >
                                Continue
                            </Button>
                        </DialogActions>
                    )}
                </Dialog>
                {/* Role Switch Dialog */}
                <Dialog open={roleSwitchDialogOpen} onClose={() => setRoleSwitchDialogOpen(false)} maxWidth="sm" fullWidth>
                    <DialogTitle>Switch Role</DialogTitle>
                    <DialogContent>
                        {loadingMappings || loadingEntities ? (
                            <Box display="flex" justifyContent="center" p={2}>
                                <CircularProgress />
                            </Box>
                        ) : currentRole === 'superadmin' ? (
                            <List>
                                {entities.filter(ent => ent.id !== (currentSelected?.entity_id || 0)).map((ent) => (
                                    <ListItemButton
                                        key={ent.id}
                                        onClick={() => setSelectedEntity(ent.id.toString())}
                                        selected={selectedEntity === ent.id.toString()}
                                        sx={{ py: 1 }}
                                    >
                                        <ListItemIcon>
                                            <BusinessIcon />
                                        </ListItemIcon>
                                        <ListItemText primary={ent.name} secondary={ent.description || ""} />
                                    </ListItemButton>
                                ))}
                            </List>
                        ) : availableMappings.length > 0 ? (
                            <>
                                <FormControl fullWidth sx={{ my: 2 }}>
                                    <InputLabel id="entity-select-label">Entity</InputLabel>
                                    <Select
                                        labelId="entity-select-label"
                                        value={selectedEntity}
                                        label="Entity"
                                        onChange={(e) => {
                                            setSelectedEntity(e.target.value);
                                            setSelectedRole(""); // reset role selection
                                        }}
                                    >
                                        {[...new Set(availableMappings.map((r) => r.entity_id))].filter(entityId => entityId !== (currentSelected?.entity_id || 0)).map((entityId) => {
                                            const entityName = availableMappings.find((r) => r.entity_id === entityId).entity_name;
                                            return (
                                                <MenuItem key={entityId} value={entityId}>
                                                    {entityName}
                                                </MenuItem>
                                            );
                                        })}
                                    </Select>
                                </FormControl>
                                <FormControl fullWidth>
                                    <InputLabel id="role-select-label">Role</InputLabel>
                                    <Select
                                        labelId="role-select-label"
                                        value={selectedRole}
                                        label="Role"
                                        onChange={(e) => setSelectedRole(e.target.value)}
                                        disabled={!selectedEntity}
                                    >
                                        {rolesForSelectedEntity.filter(r => r.role_id !== (currentSelected?.role_id || 0)).map((r) => (
                                            <MenuItem key={r.role_id} value={r.role_id}>
                                                {r.role_name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </>
                        ) : (
                            <Typography>No available roles to switch.</Typography>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setRoleSwitchDialogOpen(false)}>Cancel</Button>
                        <Button
                            variant="contained"
                            disabled={!selectedEntity || (currentRole !== 'superadmin' && !selectedRole)}
                            onClick={handleSwitchConfirm}
                        >
                            Switch
                        </Button>
                    </DialogActions>
                </Dialog>
            </Toolbar>
        </AppBar>
    );
};
export default Header;
 