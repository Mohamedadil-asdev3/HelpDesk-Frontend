import { useState, useEffect } from "react";
import { Autocomplete, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, TextField, Typography, MenuItem, Chip, } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { toast } from "react-toastify";
import { fetchLocationsAPI, fetchEntitiesAPI, fetchConfigurations, saveConfigurations, saveLocationAPI, deleteLocationAPI, } from "../../../Api";
import CommonTable from "../../commonTabel";

const Location = () => {

    const LocationColumns = [
        { id: "sNo", label: "S.No" },
        { id: "entityName", label: "Entity" },
        { id: "country", label: "Country" },
        { id: "locationName", label: "Location" },
    ];

    const [locations, setLocations] = useState([]);
    const [entities, setEntities] = useState([]);
    const [countries, setCountries] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const [form, setForm] = useState({
        entity_id: "",
        country_name: "",
        field_type: "Location",
        field_name: "",
        is_active: "Y",
    });
    const [newCountryName, setNewCountryName] = useState("");
    const [showNewCountryInput, setShowNewCountryInput] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [viewOpen, setViewOpen] = useState(false);
    const [viewLoc, setViewLoc] = useState(null);

    // Dialog Controls
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);

    const initialForm = {
        entity_id: "",
        country_name: "",
        field_type: "Location",
        field_name: "",
        is_active: "Y",
    };

    // Load data
    useEffect(() => {
        loadLocations();
        loadEntities();
        loadCountries();
    }, []);

    const loadLocations = async () => {
        try {
            const data = await fetchLocationsAPI();
            setLocations(data);
            setCurrentPage(1);
        } catch (err) {
            toast.error(err.message);
        }
    };

    const loadEntities = async () => {
        try {
            const data = await fetchEntitiesAPI();
            setEntities(data);
        } catch (err) {
            toast.error(err.message);
        }
    };

    const loadCountries = async () => {
        try {
            const allData = await fetchConfigurations();
            const filteredCountries = allData.filter((item) => item.field_type === "Country");
            setCountries(filteredCountries);
        } catch (err) {
            toast.error("Failed to load countries: " + err.message);
        }
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentLocations = locations.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(locations.length / itemsPerPage);

    const currentRows = currentLocations.map((loc, index) => ({
        sNo: indexOfFirstItem + index + 1,
        entityName: loc.entity_name || loc.entity_id,
        country: loc.referrence_to || "N/A",
        locationName: loc.field_name,
        original: loc,
    }));

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const entityValue = entities.find((e) => e.id == form.entity_id) || null;

    const countryOptions = [...countries, { id: "create_new", field_name: "+ Add New Country" }];
    const countryValue = form.country_name
        ? countries.find((c) => c.field_name === form.country_name) || null
        : null;

    const handleCountryChange = (e, value) => {
        if (value && value.id === "create_new") {
            setShowNewCountryInput(true);
            setForm((prev) => ({ ...prev, country_name: "" }));
        } else {
            setShowNewCountryInput(false);
            setForm((prev) => ({ ...prev, country_name: value ? value.field_name : "" }));
        }
    };

    const createNewCountry = async () => {
        if (!newCountryName.trim()) {
            toast.error("Country name is required");
            return null;
        }

        try {
            const payload = {
                field_type: "Country",
                field_name: newCountryName.trim(),
                field_values: newCountryName.trim(),
                is_mandatory: "N",
                is_active: "Y",
                entity_id: parseInt(form.entity_id) || 2,
            };
            const response = await saveConfigurations(payload);
            const newCountry = response.data || { id: Date.now(), ...payload };
            setCountries((prev) => [...prev, newCountry]);
            toast.success("New country created");
            setForm((prev) => ({ ...prev, country_name: newCountryName.trim() }));
            setNewCountryName("");
            setShowNewCountryInput(false);
            return newCountryName.trim();
        } catch (err) {
            toast.error("Failed to create new country: " + err.message);
            return null;
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        if (!form.entity_id || !form.field_name || !form.country_name) {
            toast.error("Please fill all required fields");
            return;
        }

        let countryName = form.country_name;
        if (showNewCountryInput) {
            countryName = await createNewCountry();
            if (!countryName) return;
        }

        const payload = {
            ...form,
            entity_id: parseInt(form.entity_id),
            referrence_to: countryName,
        };

        try {
            await saveLocationAPI(payload, editingId);
            toast.success(editingId ? "Location updated" : "Location created");
            setForm(initialForm);
            setEditingId(null);
            setOpen(false);
            loadLocations();
        } catch (err) {
            toast.error(err.message);
        }
    };

    const handleOpenAdd = () => {
        setEditMode(false);
        setEditingId(null);
        setForm(initialForm);
        setNewCountryName("");
        setShowNewCountryInput(false);
        setOpen(true);
    };

    const handleEdit = (row) => {
        const loc = row.original;
        setEditMode(true);
        setEditingId(loc.id);
        setForm({
            entity_id: loc.entity_id,
            country_name: loc.referrence_to || "",
            field_type: loc.field_type || "Location",
            field_name: loc.field_name || "",
            is_active: loc.is_active || "Y",
        });
        setShowNewCountryInput(false);
        setNewCountryName("");
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setShowNewCountryInput(false);
        setNewCountryName("");
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to deactivate this location?")) return;
        try {
            await deleteLocationAPI(id);
            toast.info("Location deactivated");
            loadLocations();
        } catch (err) {
            toast.error(err.message);
        }
    };

    const handleView = (loc) => {
        setViewLoc(loc);
        setViewOpen(true);
    };

    const handleViewClose = () => {
        setViewOpen(false);
        setViewLoc(null);
    };

    return (
        <>
            <Box sx={{ my: 2 }}>
                <Grid container spacing={2}>
                    <Grid size={12}>
                        <CommonTable
                            title={"Location Management"}
                            btnName={"Add Location"}
                            addButton={handleOpenAdd}
                            rows={currentRows}
                            columns={LocationColumns}
                            onView={handleView}
                            onEdit={handleEdit}
                            onDelete={(row) => handleDelete(row.original.id)}
                        />
                    </Grid>
                </Grid>

                {/* Add/Edit Dialog */}
                <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                    <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography fontSize={20} fontWeight={550}>
                            {editMode ? "Edit Location" : "Add Location"}
                        </Typography>
                        <IconButton onClick={handleClose} color="error">
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent dividers>
                        <Grid container spacing={2}>
                            <Grid size={12}>
                                <Autocomplete
                                    options={entities}
                                    getOptionLabel={(option) => option.name || option.field_name}
                                    value={entityValue}
                                    onChange={(e, value) =>
                                        setForm((prev) => ({ ...prev, entity_id: value ? value.id : "" }))
                                    }
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Entity"
                                            size="small"
                                            required
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
                                    options={countryOptions}
                                    getOptionLabel={(option) => option.field_name}
                                    value={countryValue}
                                    onChange={handleCountryChange}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Country"
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
                            {showNewCountryInput && (
                                <Grid size={12}>
                                    <TextField
                                        label="New Country Name"
                                        value={newCountryName}
                                        size="small"
                                        onChange={(e) => setNewCountryName(e.target.value)}
                                        fullWidth
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                borderRadius: 3,
                                            },
                                        }}
                                    />
                                </Grid>
                            )}
                            <Grid size={12}>
                                <TextField
                                    label="Location"
                                    name="field_name"
                                    size="small"
                                    value={form.field_name}
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
                                    select
                                    label="Active (Y/N)"
                                    name="is_active"
                                    value={form.is_active}
                                    size="small"
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
                <Dialog open={viewOpen} onClose={handleViewClose} fullWidth maxWidth="sm">
                    <DialogTitle sx={{ py: 2 }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Typography variant="h6" fontWeight={600}>
                                Location Details
                            </Typography>
                            <IconButton onClick={handleViewClose} size="small">
                                <CloseIcon />
                            </IconButton>
                        </Box>
                    </DialogTitle>
                    <DialogContent dividers sx={{ bgcolor: "#fafafa" }}>
                        {viewLoc && (
                            <Box sx={{ py: 2 }}>
                                <Box sx={{ mb: 4,  }}>
                                    <Typography variant="h5" fontWeight={700} color="primary" gutterBottom>
                                        {viewLoc.original?.field_name || viewLoc.locationName}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Location ID: {viewLoc.original?.id || "—"}
                                    </Typography>
                                </Box>
                                <Grid container spacing={3}>
                                    <Grid size={12}>
                                        <Box>
                                            <Typography variant="body2" color="text.secondary" gutterBottom fontWeight={500}>
                                                Entity
                                            </Typography>
                                            <Typography variant="body1" fontWeight={600}>
                                                {viewLoc.original?.entity_name ||
                                                    entities.find(e => e.id === viewLoc.original?.entity_id)?.name ||
                                                    viewLoc.entityName || "—"}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid size={12}>
                                        <Box>
                                            <Typography variant="body2" color="text.secondary" gutterBottom fontWeight={500}>
                                                Country
                                            </Typography>
                                            <Typography variant="body1" fontWeight={600}>
                                                {viewLoc.original?.referrence_to || viewLoc.country || "—"}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid size={12}>
                                        <Box>
                                            <Typography variant="body2" color="text.secondary" gutterBottom fontWeight={500}>
                                                Location Name
                                            </Typography>
                                            <Typography variant="body1" fontWeight={600}>
                                                {viewLoc.original?.field_name || viewLoc.locationName}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid size={12}>
                                        <Box>
                                            <Typography variant="body2" color="text.secondary" gutterBottom fontWeight={500}>
                                                Status
                                            </Typography>
                                            <Chip
                                                label={viewLoc.original?.is_active === "Y" ? "Active" : "Inactive"}
                                                color={viewLoc.original?.is_active === "Y" ? "success" : "error"}
                                                size="small"
                                                sx={{ fontWeight: 600 }}
                                            />
                                        </Box>
                                    </Grid>
                                    {viewLoc.original?.created_date && (
                                        <Grid size={12}>
                                            <Box>
                                                <Typography variant="body2" color="text.secondary" gutterBottom fontWeight={500}>
                                                    Created On
                                                </Typography>
                                                <Typography variant="body1" fontWeight={500}>
                                                    {new Date(viewLoc.original.created_date).toLocaleDateString("en-US", {
                                                        year: "numeric",
                                                        month: "long",
                                                        day: "numeric",
                                                    })}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    )}
                                </Grid>
                                {viewLoc.original && Object.keys(viewLoc.original).length > 8 && (
                                    <Box sx={{ mt: 4, pt: 3, borderTop: "1px dashed #ddd" }}>
                                        <Typography variant="subtitle2" gutterBottom color="text-secondary">
                                            Additional Information
                                        </Typography>
                                        {Object.entries(viewLoc.original)
                                            .filter(([key]) => !["id", "entity_id", "entity_name", "field_name", "referrence_to", "is_active", "created_date", "field_type"].includes(key))
                                            .map(([key, value]) => (
                                                <Box key={key} sx={{ mb: 1.5 }}>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {key.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                                                    </Typography>
                                                    <Typography variant="body1" fontWeight={500}>
                                                        {String(value || "—")}
                                                    </Typography>
                                                </Box>
                                            ))}
                                    </Box>
                                )}
                            </Box>
                        )}
                    </DialogContent>
                </Dialog>
            </Box>
        </>
    );
};

export default Location;