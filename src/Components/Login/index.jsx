import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import bgImage from "../../assets/loginPageBg.png";
import { Box, Card, CardContent, TextField, Button, Typography, Stack, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem, InputAdornment, IconButton, Link, } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { loginAPI, forgotPasswordAPI, changePasswordAPI, fetchEntitiesAPI } from "../../Api";
import { toast } from "react-toastify";

const Login = () => {

    const navigate = useNavigate();

    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState({ message: "", username: "", password: "" });
    const [loading, setLoading] = useState(false);

    // role selection modal
    const [modalOpen, setModalOpen] = useState(false);
    const [roleMappings, setRoleMappings] = useState([]);
    const [selectedEntity, setSelectedEntity] = useState("");
    const [selectedRole, setSelectedRole] = useState("");
    const [entities, setEntities] = useState([]);
    const [loadingEntities, setLoadingEntities] = useState(false);
    const [isEntityOnlyModal, setIsEntityOnlyModal] = useState(false);

    // No access error modal
    const [noAccessError, setNoAccessError] = useState(false);

    // Forgot password modal
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [forgotEmail, setForgotEmail] = useState("");
    const [forgotError, setForgotError] = useState("");

    // Change password modal
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [changeForm, setChangeForm] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
    const [changeErrors, setChangeErrors] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
    const [changeLoading, setChangeLoading] = useState(false);
    const [accessToken, setAccessToken] = useState(""); // Store token for change password API

    const normalizeId = (value) => {
        if (!value) return null;
        if (typeof value === "number") return value;
        if (typeof value === "object" && value.id) return value.id;
        return null;
    }

    const validateInput = (name, value) => {
        if (name === "username") {
            if (!value) return "Username is required";
            if (value.includes(" ")) return "Username cannot contain spaces";
        }
        if (name === "password") {
            if (!value) return "Password is required";
            if (value.includes(" ")) return "Password cannot contain spaces";
            if (value.length < 3) return "Password must be at least 3 characters long";
        }
        return "";
    };

    const validateChangeInput = (name, value, confirmValue = "") => {
        if (name === "oldPassword") {
            if (!value) return "Old password is required";
        }
        if (name === "newPassword") {
            if (!value) return "New password is required";
            if (value.includes(" ")) return "Password cannot contain spaces";
            if (value.length < 3) return "Password must be at least 3 characters long";
        }
        if (name === "confirmPassword") {
            if (!value) return "Confirmation is required";
            if (value !== confirmValue) return "Passwords do not match";
        }
        return "";
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === "username") {
            setUserName(value.trim());
            setError((prev) => ({ ...prev, username: "" }));
        } else if (name === "password") {
            setPassword(value);
            setError((prev) => ({ ...prev, password: "" }));
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        const usernameError = validateInput("username", userName);
        const passwordError = validateInput("password", password);

        if (usernameError || passwordError) {
            setError({ message: "", username: usernameError, password: passwordError });
            return;
        }

        setLoading(true);
        setError({ message: "", username: "", password: "" });

        try {
            const data = await loginAPI({ username: userName, password });

            localStorage.setItem("access_token", data.access);
            localStorage.setItem("refresh_token", data.refresh);

            setAccessToken(data.access);

            const normalizedUser = {
                ...data.user,

                // 🔥 Ensure consistent keys everywhere
                department_id: normalizeId(
                    data.user.department_id || data.user.department_detail
                ),

                location_id: normalizeId(data.user.location_id
                ),
            };

            localStorage.setItem("user_data", JSON.stringify(normalizedUser));

            // Store full user data for role fallback
            //localStorage.setItem("user_data", JSON.stringify(data.user));
            // Check if superadmin to decide userEntity
            const hasSuperAdmin = data.user.roles?.some(role => role.name.toLowerCase() === 'superadmin' || role.name.toLowerCase() === 'super admin');

            // Store user entity if available and not superadmin (from user table entities_ids, first one)
            const userEntity = hasSuperAdmin ? null : (data.user?.entity_data ? {
                ...data.user.entity_data,
                display_name: data.user.entity_data.name
            } : null);

            localStorage.setItem("userEntity", JSON.stringify(userEntity));

            // Check if force password change is required
            if (data.force_change) {
                setShowChangePassword(true);
                localStorage.setItem("temp_role_data", JSON.stringify(data.user));
                toast.info("Please change your password to continue.");

            } else {
                // Handle role mappings or superadmin bypass
                await handleRoleSelection(data.user);
                toast.success("Login successful! Welcome back.");
            }
        } catch (err) {
            setError({ message: err?.response?.data?.message || "Invalid username or password", username: "", password: "" });
            toast.error(msg);
        }
        setLoading(false);
    };

    const fetchEntitiesForModal = async () => {
        setLoadingEntities(true);
        try {
            const data = await fetchEntitiesAPI();
            setEntities(data);
        } catch (error) {
            console.error("Failed to fetch entities:", error);
            setEntities([]);
        } finally {
            setLoadingEntities(false);
        }
    };

    const handleRoleSelection = async (userData) => {
        // Check if user has superadmin role
        const hasSuperAdmin = userData.roles?.some(role => role.name.toLowerCase() === 'superadmin' || role.name.toLowerCase() === 'super admin');
        if (hasSuperAdmin) {
            // For superadmin, always start without entity (even if entity_data exists)
            const superAdminMapping = { role_name: 'superadmin', all_access: true };
            localStorage.setItem("selected_role_mapping", JSON.stringify(superAdminMapping));
            localStorage.setItem("available_role_mappings", JSON.stringify([]));
            navigate("/UserDashboard");
            return;
        }
        let mappings = userData.role_mappings || [];
        if (!mappings || mappings.length === 0) {
            // Fallback to user table entities and roles
            const entitiesData = userData.entities || [];
            const roles = userData.roles || [];
            if (entitiesData.length > 0 && roles.length > 0) {
                // Construct cartesian product mappings
                mappings = entitiesData.flatMap(entity =>
                    roles.map(role => ({
                        entity_id: entity.id,
                        entity_name: entity.name,
                        role_id: role.id,
                        role_name: role.name,
                    }))
                );
            } else if (entitiesData.length > 0) {
                // Has entities but no roles: default 'user' role for each entity
                mappings = entitiesData.map(entity => ({
                    entity_id: entity.id,
                    entity_name: entity.name,
                    role_id: null,
                    role_name: 'user',
                }));
            } else {
                // No entities (regardless of roles): Show no access error and prevent login
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                localStorage.removeItem("user_data");
                localStorage.removeItem("userEntity");
                localStorage.removeItem("selected_role_mapping");
                localStorage.removeItem("available_role_mappings");
                setNoAccessError(true);
                return;
            }
        }
        // Store all available mappings for later use (e.g., in header for create ticket)
        localStorage.setItem("available_role_mappings", JSON.stringify(mappings));
        setRoleMappings(mappings);
        setIsEntityOnlyModal(false);
        if (mappings.length === 0) {
            // No mappings: Show no access error and prevent login
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            localStorage.removeItem("user_data");
            localStorage.removeItem("userEntity");
            localStorage.removeItem("selected_role_mapping");
            localStorage.removeItem("available_role_mappings");
            setNoAccessError(true);
        } else if (mappings.length === 1) {
            // Single mapping: auto-select and proceed
            handleAutoSelection(mappings[0]);
        } else {
            // Multiple: open modal to select
            setModalOpen(true);
        }
    };

    const handleAutoSelection = (singleMapping) => {
        localStorage.setItem("selected_role_mapping", JSON.stringify(singleMapping));
        setModalOpen(false);
        // Navigate based on role
        const roleName = singleMapping.role_name?.toLowerCase() || 'user';
        let dashboardPath = "/UserDashboard"; // Default
        switch (roleName) {
            case 'super admin':
            case 'superadmin':
                dashboardPath = "/UserDashboard"; // Full access starting point
                break;
            case 'admin':
                dashboardPath = "/UserDashboard";
                break;
            case 'ceo':
                dashboardPath = "/UserDashboard";
                break;
            case 'hod':
                dashboardPath = "/UserDashboard";
                break;
            case 'technician':
                dashboardPath = "/UserDashboard";
                break;
            case 'user':
                dashboardPath = "/UserDashboard";
                break;
            default:
                dashboardPath = "/UserDashboard";
        }
        navigate(dashboardPath);
    };

    const handleConfirmSelection = () => {
        const selected = roleMappings.find(
            (r) => r.entity_id === selectedEntity && r.role_id === selectedRole
        );
        if (!selected) return;
        localStorage.setItem("selected_role_mapping", JSON.stringify(selected));
        setModalOpen(false);
        const roleName = selected.role_name?.toLowerCase() || 'user';
        let dashboardPath = "/UserDashboard"; // Default
        switch (roleName) {
            case 'super admin':
            case 'superadmin':
                dashboardPath = "/UserDashboard"; // Full access starting point
                break;
            case 'admin':
                dashboardPath = "/UserDashboard";
                break;
            case 'ceo':
                dashboardPath = "/UserDashboard";
                break;
            case 'hod':
                dashboardPath = "/UserDashboard";
                break;
            case 'technician':
                dashboardPath = "/UserDashboard";
                break;
            case 'user':
                dashboardPath = "/UserDashboard";
                break;
            default:
                dashboardPath = "/UserDashboard";
        }
        navigate(dashboardPath);
    };

    // filter roles based on selected entity
    const rolesForSelectedEntity = roleMappings.filter(
        (r) => r.entity_id === selectedEntity
    );

    const handleChangeInput = (e) => {
        const { name, value } = e.target;
        setChangeForm((prev) => ({ ...prev, [name]: value }));
        setChangeErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleChangePassword = async () => {

        const oldError = validateChangeInput("oldPassword", changeForm.oldPassword);
        const newError = validateChangeInput("newPassword", changeForm.newPassword);
        const confirmError = validateChangeInput("confirmPassword", changeForm.confirmPassword, changeForm.newPassword);

        setChangeErrors({ oldPassword: oldError, newPassword: newError, confirmPassword: confirmError });
        if (oldError || newError || confirmError) return;

        setChangeLoading(true);

        try {
            // Use snake_case for API payload
            const payload = {
                old_password: changeForm.oldPassword,
                new_password: changeForm.newPassword,
                confirm_password: changeForm.confirmPassword,
            };
            await changePasswordAPI(payload, accessToken);

            // After success, retrieve temp role data and proceed
            const tempRoleData = JSON.parse(localStorage.getItem("temp_role_data") || "{}");
            localStorage.removeItem("temp_role_data");
            //localStorage.setItem("user_data", JSON.stringify(tempRoleData)); // Update user_data after password change

            const normalizedTempUser = {
                ...tempRoleData,
                department_id: normalizeId(
                    tempRoleData.department_id || tempRoleData.department_detail
                ),
                location_id: normalizeId(
                    tempRoleData.locations || tempRoleData.location_detail || tempRoleData.locations_id
                ),
            };

            localStorage.setItem("user_data", JSON.stringify(normalizedTempUser));

            setShowChangePassword(false);
            setChangeForm({ oldPassword: "", newPassword: "", confirmPassword: "" });

            toast.success("Password changed successfully!");

            await handleRoleSelection(tempRoleData);
        } catch (err) {
            const msg = err?.response?.data?.message || "Failed to change password. Try again.";
            setError({ message: msg, username: "", password: "" });
            toast.error(msg);
        } finally {
            setChangeLoading(false);
        }
    };

    const handleForgotPassword = async () => {
        if (!forgotEmail) {
            setForgotError("Email is required");
            return;
        }
        try {
            await forgotPasswordAPI({ email: forgotEmail });
            setForgotError("");
            setShowForgotPassword(false);
            setForgotEmail("");

            toast.success("Password reset link sent to your email!");
        } catch (err) {
            const msg = err?.response?.data?.message || "Failed to send reset email";
            setForgotError(msg);
            toast.error(msg);
        }
    };

    const handleNoAccessClose = () => {
        setNoAccessError(false);
        // Reset form
        setUserName("");
        setPassword("");
        setError({ message: "", username: "", password: "" });
    };

    // Close modals on escape
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === "Escape") {
                setShowForgotPassword(false);
                setShowChangePassword(false);
                setModalOpen(false);
                setNoAccessError(false);
            }
        };
        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, []);

    return (
        <Box sx={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", position: "relative", overflow: "hidden" }}>
            <Box
                sx={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: `url(${bgImage})`,
                    backgroundSize: { xs: "cover", sm: "cover", md: "cover" },
                    backgroundPosition: { xs: "center", sm: "top center", md: "center" },
                    backgroundRepeat: "no-repeat",
                    transform: "scale(1.08)",
                    height: "100%",
                    width: "100%",
                }}
            />
            <Card
                sx={{
                    width: 400,
                    p: 3,
                    backdropFilter: "blur(12px)",
                    backgroundColor: "rgba(255,255,255,0.15)",
                    borderRadius: 4,
                    boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                }}
            >
                <CardContent>
                    <Typography variant="h5" align="center" sx={{ fontWeight: 600, mb: 3 }}>
                        Login
                    </Typography>
                    <Stack spacing={2}>
                        <TextField
                            label="Username"
                            name="username"
                            size="small"
                            fullWidth
                            value={userName}
                            onChange={handleInputChange}
                            error={!!error.username}
                            helperText={error.username}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "12px",
                                    background: "rgba(255,255,255,0.4)",
                                }
                            }}
                        />
                        <TextField
                            label="Password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            size="small"
                            fullWidth
                            value={password}
                            onChange={handleInputChange}
                            error={!!error.password}
                            helperText={error.password}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "12px",
                                    background: "rgba(255,255,255,0.4)",
                                }
                            }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Button
                            variant="contained"
                            fullWidth
                            disabled={loading}
                            onClick={handleLogin}
                            sx={{ borderRadius: "12px" }}
                        >
                            {loading ? "Logging in..." : "Login"}
                        </Button>
                        <Typography variant="body2" align="center">
                            <Link
                                component="button"
                                variant="body2"
                                onClick={() => setShowForgotPassword(true)}
                                sx={{ textDecoration: 'none', p: 0, color: 'primary.main' }}
                            >
                                Forgot Password?
                            </Link>
                        </Typography>
                    </Stack>
                </CardContent>
            </Card>

            {/* Role Mapping Modal - Removed entity-only modal logic */}
            <Dialog open={modalOpen} fullWidth PaperProps={{ sx: { width: 400 } }}>
                <DialogTitle>Select Entity and Role</DialogTitle>
                <DialogContent sx={{ mt: 1 }}>
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
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "10px",
                                }
                            }}
                        >
                            {[...new Set(roleMappings.map((r) => r.entity_id))].map((entityId) => {
                                const entityName = roleMappings.find((r) => r.entity_id === entityId).entity_name;
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
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "10px",
                                }
                            }}
                        >
                            {rolesForSelectedEntity.map((r) => (
                                <MenuItem key={r.role_id} value={r.role_id}>
                                    {r.role_name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        disabled={!selectedEntity || !selectedRole}
                        onClick={handleConfirmSelection}
                    >
                        Continue
                    </Button>
                </DialogActions>
            </Dialog>

            {/* No Access Error Modal */}
            <Dialog open={noAccessError} onClose={handleNoAccessClose} maxWidth="sm" fullWidth>
                <DialogTitle>Access Denied</DialogTitle>
                <DialogContent>
                    <Typography>
                        You do not have any assigned entity or role. You will be contacted by the admin.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleNoAccessClose}>OK</Button>
                </DialogActions>
            </Dialog>

            {/* Forgot Password Modal */}
            <Dialog open={showForgotPassword} maxWidth="sm" fullWidth>
                <DialogTitle>Forgot Password</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Email"
                        type="email"
                        fullWidth
                        value={forgotEmail}
                        onChange={(e) => {
                            setForgotEmail(e.target.value);
                            setForgotError("");
                        }}
                        error={!!forgotError}
                        helperText={forgotError}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                borderRadius: "10px",
                                backgroundColor: "#fff",
                            },
                            mb: 2
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowForgotPassword(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleForgotPassword}>
                        Send Reset Link
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Change Password Modal */}
            <Dialog open={showChangePassword} maxWidth="sm" fullWidth>
                <DialogTitle>Change Password</DialogTitle>
                <DialogContent>
                    <Typography sx={{ mb: 2 }}>Please set a new password for security.</Typography>
                    <TextField
                        label="Old Password"
                        type="password"
                        name="oldPassword"
                        fullWidth
                        value={changeForm.oldPassword}
                        onChange={handleChangeInput}
                        error={!!changeErrors.oldPassword}
                        helperText={changeErrors.oldPassword}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                borderRadius: "10px",
                                backgroundColor: "#fff",
                            },
                            mb: 2
                        }}
                    />
                    <TextField
                        label="New Password"
                        type="password"
                        name="newPassword"
                        fullWidth
                        value={changeForm.newPassword}
                        onChange={handleChangeInput}
                        error={!!changeErrors.newPassword}
                        helperText={changeErrors.newPassword}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                borderRadius: "10px",
                                backgroundColor: "#fff",
                            },
                            mb: 2
                        }}
                    />
                    <TextField
                        label="Confirm New Password"
                        type="password"
                        name="confirmPassword"
                        fullWidth
                        value={changeForm.confirmPassword}
                        onChange={handleChangeInput}
                        error={!!changeErrors.confirmPassword}
                        helperText={changeErrors.confirmPassword}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                borderRadius: "10px",
                                backgroundColor: "#fff",
                            },
                            mb: 2
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowChangePassword(false)} disabled={changeLoading}>Cancel</Button>
                    <Button variant="contained" onClick={handleChangePassword} disabled={changeLoading}>
                        {changeLoading ? "Changing..." : "Change Password"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};
export default Login;