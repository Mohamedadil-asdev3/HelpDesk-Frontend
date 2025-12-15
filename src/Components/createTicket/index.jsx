import { useState, useEffect, useRef } from "react";
import {
  Box, Grid, Card, CardContent, TextField, Typography, MenuItem,
  Button, Autocomplete, Chip, Avatar, FormControl, Select, InputLabel,
} from "@mui/material";
import { toast } from "react-toastify";
import {
  fetchConfigurations, fetchTicketCategories, fetchSubcategories,
  createTicket, fetchPlatforms, updateTicket, getTicketDetails,fetchWatcherGroups
} from "../../Api";

const TicketForm = () => {
  const userEntity = JSON.parse(localStorage.getItem("userEntity"));

  const [categoryId, setCategoryId] = useState("");
  const [subcategoryId, setSubcategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("");
  const [files, setFiles] = useState([]);
  const [ticketType, setTicketType] = useState("Incident"); // Default to "Incident"
  const [loading, setLoading] = useState(false);

  const [ticketTypes, setTicketTypes] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [locations, setLocations] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [configs, setConfigs] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [watcherGroups, setWatcherGroups] = useState([]);

  const [platforms, setPlatforms] = useState([]);
  const [selectedPlatform, setSelectedPlatform] = useState(null);

  // Assignment state
  const [selectionTypes, setSelectionTypes] = useState([]); // array of 'user' or 'group'
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [selectedWatchers, setSelectedWatchers] = useState([]);

  const [editMode, setEditMode] = useState(false);
  const [editTicketId, setEditTicketId] = useState(null);

  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const editInitRef = useRef(false);

  // Check for edit mode
  useEffect(() => {
    const id = localStorage.getItem("editTicketId");
    if (id) {
      setEditMode(true);
      setEditTicketId(id);
    }
  }, []);

  // Load initial data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const configData = await fetchConfigurations();
        setConfigs(configData);
        setTicketTypes(configData.filter((c) => c.field_type === "TicketType"));
        setDepartments(configData.filter((c) => c.field_type === "Department"));
        setLocations(configData.filter((c) => c.field_type === "Location"));
        setPriorities(configData.filter((c) => c.field_type === "Priority"));

        const cats = await fetchTicketCategories();
        setCategories(cats);

        // Fetch all users for user assignment dropdown
        const token = localStorage.getItem("access_token");
        const usersRes = await fetch("http://localhost:8000/api/tickets/watcher-users/", {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (usersRes.ok) {
          const usersData = await usersRes.json();
          setAllUsers(Array.isArray(usersData) ? usersData : []);
        }

        // Fetch groups
        const groupsRes = await fetchWatcherGroups();
        if (Array.isArray(groupsRes)) setWatcherGroups(groupsRes);

        const platformRes = await fetchPlatforms();
         const platformList = platformRes?.data || platformRes || [];
         setPlatforms(Array.isArray(platformList) ? platformList : []);

      } catch (err) {
        console.error("Failed to load form data", err);
        toast.error("Failed to load form data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Load ticket for edit after data is loaded
  useEffect(() => {
    if (editMode && editTicketId && configs.length > 0 && departments.length > 0 && locations.length > 0 && platforms.length > 0 && allUsers.length > 0 && watcherGroups.length > 0) {
      loadTicketForEdit(editTicketId);
    }
  }, [configs, departments, locations, platforms, allUsers, watcherGroups, editMode, editTicketId]);

  // Load subcategories
  useEffect(() => {
    if (categoryId) {
      fetchSubcategories(categoryId)
        .then(res => {
          const subcats = res.success ? res.data : [];
          setSubcategories(subcats);
          // If subcategories is empty, hide the field
          if (subcats.length === 0) {
            setSubcategoryId("");
          }
        })
        .catch(() => {
          setSubcategories([]);
          setSubcategoryId("");
        });
    } else {
      setSubcategories([]);
      setSubcategoryId("");
    }
  }, [categoryId]);

  // Update watchers based on selected users/groups
  const updateWatchers = () => {
    const userIds = selectedUsers.map(u => u.id) || [];
    const groupMemberIds = selectedGroups.flatMap(g => g.users?.map(u => u.id) || []) || [];
    setSelectedWatchers([...new Set([...userIds, ...groupMemberIds])]);
  };

  // Handle types selection (multiple)
  const handleTypesSelection = (_, newValue) => {
    const types = newValue.map(v => v.type);
    setSelectionTypes(types);
    // If a type is deselected, clear its assignees
    if (!types.includes('user') && selectionTypes.includes('user')) {
      setSelectedUsers([]);
    }
    if (!types.includes('group') && selectionTypes.includes('group')) {
      setSelectedGroups([]);
    }
    setSelectedWatchers([]);
    updateWatchers();
  };

  // Handle users selection (multiple)
  const handleUsersSelection = (_, newValue) => {
    setSelectedUsers(newValue);
    updateWatchers();
    if (newValue.length > 0) {
      toast.success(`${newValue.length} user(s) selected`);
    }
  };

  // Handle groups selection (multiple)
  const handleGroupsSelection = (_, newValue) => {
    setSelectedGroups(newValue);
    updateWatchers();
    if (newValue.length > 0) {
      toast.success(`${newValue.length} group(s) selected`);
    }
  };

  // Handle file changes
  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files || []).filter(f =>
      ["application/pdf", "image/png", "image/jpeg", "image/jpg"].includes(f.type)
    );
    setFiles(prev => [...prev, ...newFiles.filter(f => 
      !prev.some(pf => pf.name === f.name && pf.size === f.size)
    )]);
  };

  const removeFile = (i) => setFiles(prev => prev.filter((_, idx) => idx !== i));

  // Load ticket for edit
  const loadTicketForEdit = async (ticketNo) => {
    try {
      setLoading(true);
      const response = await getTicketDetails(ticketNo);
      const ticketData = response?.data?.ticket || response?.ticket || response;
      if (!ticketData) throw new Error("No ticket data");
      
      // Set form fields
      setTicketType(configs.find(c => c.id === ticketData.type && c.field_type === "TicketType")?.field_name || "Incident");
      setSelectedDepartment(departments.find(d => d.id === ticketData.department) || null);
      setSelectedLocation(locations.find(l => l.id === ticketData.location) || null);
      setPriority(configs.find(c => c.id === ticketData.priority && c.field_type === "Priority")?.field_name || "");
      setSelectedPlatform(platforms.find(p => p.id === (ticketData.platform?.id || ticketData.platform)) || null);
      setCategoryId(ticketData.category || "");
      setSubcategoryId(ticketData.subcategory || "");
      setTitle(ticketData.title || "");
      setDescription(ticketData.description || "");

      // Parse assignment data from backend - handle multiple
      const selectionTypesLocal = [];
      const selectedUsersLocal = [];
      const selectedGroupsLocal = [];

      // Users
      if (ticketData.assignees_detail && ticketData.assignees_detail.length > 0) {
        selectionTypesLocal.push('user');
        selectedUsersLocal.push(...ticketData.assignees_detail.filter(u => allUsers.some(au => au.email === u.email)));
        // For users not in allUsers, add from detail
        const missingUsers = ticketData.assignees_detail.filter(u => !allUsers.some(au => au.email === u.email));
        selectedUsersLocal.push(...missingUsers.map(u => ({ id: u.id, name: u.name, email: u.email })));
      }

      // Groups
      if (ticketData.assigned_groups_detail && ticketData.assigned_groups_detail.length > 0) {
        selectionTypesLocal.push('group');
        selectedGroupsLocal.push(...ticketData.assigned_groups_detail.filter(g => watcherGroups.some(wg => wg.id === g.id)));
        // For groups not in watcherGroups, add from detail
        const missingGroups = ticketData.assigned_groups_detail.filter(g => !watcherGroups.some(wg => wg.id === g.id));
        selectedGroupsLocal.push(...missingGroups.map(g => ({ id: g.id, name: g.name, users: g.users || [] })));
      }

      setSelectionTypes(selectionTypesLocal);
      setSelectedUsers(selectedUsersLocal);
      setSelectedGroups(selectedGroupsLocal);

      // Update watchers
      updateWatchers();
      
      toast.success(`Editing Ticket #${ticketData.ticket_no}`);
    } catch (err) {
      toast.error("Failed to load ticket details");
    } finally {
      setLoading(false);
    }
  };

const handleCreateTicket = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    // Validation
    if (!ticketType) {
      toast.error("Type is required");
      setLoading(false);
      return;
    }
    if (!selectedDepartment) {
      toast.error("Department is required");
      setLoading(false);
      return;
    }
    if (!selectedLocation) {
      toast.error("Location is required");
      setLoading(false);
      return;
    }
    if (!selectedPlatform) {
      toast.error("Platform is required");
      setLoading(false);
      return;
    }
    if (!priority) {
      toast.error("Priority is required");
      setLoading(false);
      return;
    }
    if (!categoryId) {
      toast.error("Category is required");
      setLoading(false);
      return;
    }
    if (selectionTypes.length === 0) {
      toast.error("Assign To is required");
      setLoading(false);
      return;
    }
    if (selectionTypes.includes('user') && selectedUsers.length === 0) {
      toast.error("Select at least one user if User is selected");
      setLoading(false);
      return;
    }
    if (selectionTypes.includes('group') && selectedGroups.length === 0) {
      toast.error("Select at least one group if Group is selected");
      setLoading(false);
      return;
    }
    if (!title.trim()) {
      toast.error("Title is required");
      setLoading(false);
      return;
    }
    if (!description.trim()) {
      toast.error("Description is required");
      setLoading(false);
      return;
    }
    
    // Get IDs from configs
    const typeObj = ticketTypes.find(t => t.field_name === ticketType);
    const typeId = typeObj ? typeObj.id : null;
    
    const departmentId = selectedDepartment ? selectedDepartment.id : null;
    const locationId = selectedLocation ? selectedLocation.id : null;
    const platformId = selectedPlatform ? selectedPlatform.id : null;
    
    const priorityObj = priorities.find(p => p.field_name === priority);
    const priorityId = priorityObj ? priorityObj.id : null;

    // CRITICAL: Make sure all required IDs are available
    if (!typeId) {
      toast.error("Please select a valid ticket type");
      setLoading(false);
      return;
    }
    if (!departmentId) {
      toast.error("Please select a valid department");
      setLoading(false);
      return;
    }
    if (!locationId) {
      toast.error("Please select a valid location");
      setLoading(false);
      return;
    }
    if (!platformId) {
      toast.error("Please select a valid platform");
      setLoading(false);
      return;
    }
    if (!priorityId) {
      toast.error("Please select a valid priority");
      setLoading(false);
      return;
    }

    // Prepare data according to backend serializer structure
    const formData = new FormData();
    
    // Basic fields
    formData.append("type", typeId);
    formData.append("department", departmentId);
    formData.append("location", locationId);
    formData.append("platform", platformId);
    formData.append("priority", priorityId);
    formData.append("category", categoryId);  // REQUIRED - use 'category' not 'category_id'
    
    // Only append subcategory if it exists and is selected
    if (subcategoryId && subcategories.length > 0) {
      formData.append("subcategory", subcategoryId);  // 'subcategory' not 'subcategory_id'
    }
    
    formData.append("title", title.trim());
    formData.append("description", description);
    
    // Assignment fields (support multiple types and assignees)
    selectionTypes.forEach(type => {
      formData.append("assigned_to_type", type);
    });
    
    if (selectionTypes.includes('user') && selectedUsers.length > 0) {
      selectedUsers.forEach(user => {
        formData.append("assignee", user.email);
      });
    }
    if (selectionTypes.includes('group') && selectedGroups.length > 0) {
      selectedGroups.forEach(group => {
        formData.append("assigned_groups", group.id);
      });
    }
    
    // Watchers (CC)
    selectedWatchers.forEach(id => {
      formData.append("watchers", id);
    });
    
    // Files
    files.forEach(file => {
      if (file instanceof File) {
        formData.append("documents", file);
      }
    });

    // Create ticket
    const result = await createTicket(formData);
    
    if (result?.success || result?.ticket_no || result?.id) {
      const ticketNo = result.ticket_no || result.data?.ticket_no || result.id;
      toast.success(`Ticket #${ticketNo} created successfully!`);
      resetForm();
      
      // Optional: Clear edit mode if it was set
      if (editMode) {
        localStorage.removeItem("editTicketId");
        setEditMode(false);
        setEditTicketId(null);
      }
      
      // Redirect to ticket history
      setTimeout(() => {
        window.location.href = "/tickethistory";
      }, 1500);
    } else {
      // Handle different error response formats
      const errorMsg = result?.error || 
                      result?.message || 
                      result?.detail || 
                      "Failed to create ticket";
      throw new Error(errorMsg);
    }
  } catch (err) {
    console.error("Ticket creation error:", err);
    
    // More user-friendly error messages
    if (err.message.includes("category")) {
      toast.error("Category error: " + err.message);
    } else if (err.message.includes("required")) {
      toast.error("Missing required field: " + err.message);
    } else if (err.message.includes("IntegrityError") || err.message.includes("cannot be null")) {
      toast.error("Database error: Please check all required fields are filled correctly");
    } else {
      toast.error(err.message || "Failed to create ticket. Please try again.");
    }
  } finally {
    setLoading(false);
  }
};

const handleUpdateTicket = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    // Similar validation as create
    if (!ticketType) {
      toast.error("Type is required");
      setLoading(false);
      return;
    }
    if (!selectedDepartment) {
      toast.error("Department is required");
      setLoading(false);
      return;
    }
    if (!selectedLocation) {
      toast.error("Location is required");
      setLoading(false);
      return;
    }
    if (!selectedPlatform) {
      toast.error("Platform is required");
      setLoading(false);
      return;
    }
    if (!priority) {
      toast.error("Priority is required");
      setLoading(false);
      return;
    }
    if (!categoryId) {
      toast.error("Category is required");
      setLoading(false);
      return;
    }
    if (selectionTypes.length === 0) {
      toast.error("Assign To is required");
      setLoading(false);
      return;
    }
    if (selectionTypes.includes('user') && selectedUsers.length === 0) {
      toast.error("Select at least one user if User is selected");
      setLoading(false);
      return;
    }
    if (selectionTypes.includes('group') && selectedGroups.length === 0) {
      toast.error("Select at least one group if Group is selected");
      setLoading(false);
      return;
    }
    if (!title.trim()) {
      toast.error("Title is required");
      setLoading(false);
      return;
    }
    if (!description.trim()) {
      toast.error("Description is required");
      setLoading(false);
      return;
    }
    
    // Get IDs
    const typeObj = ticketTypes.find(t => t.field_name === ticketType);
    const typeId = typeObj ? typeObj.id : null;
    
    const departmentId = selectedDepartment ? selectedDepartment.id : null;
    const locationId = selectedLocation ? selectedLocation.id : null;
    const platformId = selectedPlatform?.id;
    
    const priorityObj = priorities.find(p => p.field_name === priority);
    const priorityId = priorityObj ? priorityObj.id : null;

    if (!typeId || !departmentId || !locationId || !platformId || !priorityId || !categoryId) {
      toast.error("Please fill all required fields");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("type", typeId);
    formData.append("department", departmentId);
    formData.append("location", locationId);
    formData.append("platform", platformId);
    formData.append("priority", priorityId);
    formData.append("category", categoryId);
    
    // Only append subcategory if it exists and is selected
    if (subcategoryId && subcategories.length > 0) {
      formData.append("subcategory", subcategoryId);
    }
    
    formData.append("title", title.trim());
    formData.append("description", description);
    
    // Assignment fields (support multiple types and assignees)
    selectionTypes.forEach(type => {
      formData.append("assigned_to_type", type);
    });
    
    if (selectionTypes.includes('user') && selectedUsers.length > 0) {
      selectedUsers.forEach(user => {
        formData.append("assignee", user.email);
      });
    }
    if (selectionTypes.includes('group') && selectedGroups.length > 0) {
      selectedGroups.forEach(group => {
        formData.append("assigned_groups", group.id);
      });
    }
    
    // Watchers
    selectedWatchers.forEach(id => {
      formData.append("watchers", id);
    });
    
    // Files
    files.forEach(file => {
      if (file instanceof File) {
        formData.append("documents", file);
      }
    });

    const result = await updateTicket(editTicketId, formData);
    
    if (result?.success || result?.message?.includes("success")) {
      toast.success("Ticket updated successfully!");
      
      // Clear edit mode
      localStorage.removeItem("editTicketId");
      setEditMode(false);
      setEditTicketId(null);
      
      // Redirect after a short delay
      setTimeout(() => {
        window.location.href = "/tickethistory";
      }, 1500);
    } else {
      throw new Error(result?.error || "Update failed");
    }
  } catch (err) {
    console.error("Ticket update error:", err);
    toast.error(err.message || "Failed to update ticket");
  } finally {
    setLoading(false);
  }
};

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setFiles([]);
    setTicketType("Incident"); // Reset to default "Incident"
    setPriority("");
    setCategoryId("");
    setSubcategoryId("");
    setSelectionTypes([]);
    setSelectedUsers([]);
    setSelectedGroups([]);
    setSelectedWatchers([]);
    setSelectedDepartment(null);
    setSelectedLocation(null);
    setSelectedPlatform(null);
  };

  const handleCancel = () => {
    resetForm();
    localStorage.removeItem("editTicketId");
    toast.info("Form cancelled.");
  };

  const handleDescriptionChange = (e) => {
    if (e.target.value.length <= 5000) setDescription(e.target.value);
  };

  // Check if subcategory should be shown
  const shouldShowSubcategory = subcategories.length > 0;

  // Filter ticketTypes to only "Incident"
  const incidentType = ticketTypes.find(t => t.field_name === "Incident");

  return (
    <Box sx={{ p: 3, display: "flex", justifyContent: "center" }}>
      <Card sx={{ width: "100%", maxWidth: "1200px", borderRadius: 4, p: 3, boxShadow: 3 }}>
        <CardContent>
          <Box sx={{ mb: 3 }}>
            <Typography fontSize={30} fontWeight={700}>
              {editMode ? `Edit Ticket #${editTicketId}` : "Create New Ticket"}
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {/* Ticket Type - Only show Incident */}
            <Grid size={{xs:12,sm:6,md:3}}>
              <Typography fontSize={15} fontWeight={600}>Type *</Typography>
              <TextField 
                select 
                fullWidth 
                size="small" 
                value={ticketType} 
                onChange={(e) => setTicketType(e.target.value)} 
                label="Select Type" 
                sx={{ mt: 1 }}
                disabled={editMode} // Disable in edit mode if needed
              >
                {incidentType && (
                  <MenuItem key={incidentType.id} value={incidentType.field_name}>{incidentType.field_name}</MenuItem>
                )}
              </TextField>
            </Grid>

            {/* Department */}
            <Grid size={{xs:12,sm:6,md:3}}>
              <Typography fontSize={15} fontWeight={600}>Department *</Typography>
              <Autocomplete
                value={selectedDepartment}
                onChange={(_, v) => setSelectedDepartment(v)}
                options={departments}
                getOptionLabel={(o) => o.field_name || ""}
                renderInput={(params) => (
                  <TextField {...params} label="Select Department" size="small" required sx={{ mt: 1 }} />
                )}
              />
            </Grid>

            {/* Location */}
            <Grid size={{xs:12,sm:6,md:3}}>
              <Typography fontSize={15} fontWeight={600}>Location *</Typography>
              <Autocomplete
                value={selectedLocation}
                onChange={(_, v) => setSelectedLocation(v)}
                options={locations}
                getOptionLabel={(o) => o.field_name || ""}
                renderInput={(params) => (
                  <TextField {...params} label="Select Location" size="small" required sx={{ mt: 1 }} />
                )}
              />
            </Grid>

            {/* Priority */}
            <Grid size={{xs:12,sm:6,md:3}}>
              <Typography fontWeight={600}>Priority *</Typography>
              <FormControl fullWidth size="small" sx={{ mt: 1 }}>
                <InputLabel>Select Priority</InputLabel>
                <Select value={priority} label="Priority" onChange={(e) => setPriority(e.target.value)}>
                  {priorities.map((p) => (
                    <MenuItem key={p.id} value={p.field_name}>{p.field_name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
               <Typography fontSize={15} fontWeight={600}>Platform *</Typography>
               <Autocomplete
                value={selectedPlatform}
                onChange={(_, v) => setSelectedPlatform(v)}
                options={platforms}
                getOptionLabel={(opt) => opt.field_name || opt.field_name || "Unknown"}
                loading={loading}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Platform"
                    size="small"
                    required
                    sx={{ mt: 1, "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                  />
                )}
              />
            </Grid>

            {/* Category */}
            <Grid size={{xs:12,sm:6,md:3}}>
              <Typography fontSize={15} fontWeight={600}>Category *</Typography>
              <Autocomplete
                options={categories}
                getOptionLabel={(o) => o.category_name || ""}
                value={categories.find((c) => c.id === parseInt(categoryId)) || null}
                onChange={(_, v) => {
                  setCategoryId(v ? v.id : "");
                  // Reset subcategory when category changes
                  setSubcategoryId("");
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Select Category" size="small" required sx={{ mt: 1 }} />
                )}
              />
            </Grid>

            {/* Subcategory - Only show if subcategories exist */}
            {shouldShowSubcategory && (
              <Grid size={{xs:12,sm:6,md:3}}>
                <Typography fontSize={15} fontWeight={600}>Subcategory</Typography>
                <Autocomplete
                  options={subcategories}
                  getOptionLabel={(o) => o.subcategory_name || ""}
                  value={subcategories.find((s) => s.id === parseInt(subcategoryId)) || null}
                  onChange={(_, v) => setSubcategoryId(v ? v.id : "")}
                  renderInput={(params) => (
                    <TextField {...params} label="Select Subcategory" size="small" sx={{ mt: 1 }} />
                  )}
                />
              </Grid>
            )}

            {/* Assignment Type (User/Group) - Multiple */}
            <Grid size={{xs:12,sm:6,md:3}}>
              <Typography fontSize={15} fontWeight={600}>Assign To *</Typography>
              <Autocomplete
                multiple
                options={[{ label: 'User', type: 'user' }, { label: 'Group', type: 'group' }]}
                getOptionLabel={(option) => option.label}
                value={selectionTypes.map(type => ({ label: type === 'user' ? 'User' : 'Group', type }))}
                onChange={handleTypesSelection}
                renderInput={(params) => (
                  <TextField {...params} placeholder="Select User and/or Group" size="small" required sx={{ mt: 1 }} />
                )}
              />
            </Grid>

            {/* Users Dropdown (shown when 'user' is selected) */}
            {selectionTypes.includes('user') && (
              <Grid size={{xs:12,sm:6,md:3}}>
                <Typography fontSize={15} fontWeight={600}>Select Users *</Typography>
                <Autocomplete
                  multiple
                  options={allUsers}
                  getOptionLabel={(user) => `${user.name || user.email} (${user.email})`}
                  value={selectedUsers}
                  onChange={handleUsersSelection}
                  renderInput={(params) => (
                    <TextField {...params} placeholder="Select Users" size="small" required sx={{ mt: 1 }} />
                  )}
                />
              </Grid>
            )}

            {/* Groups Dropdown (shown when 'group' is selected) */}
            {selectionTypes.includes('group') && (
              <Grid size={{xs:12,sm:6,md:3}}>
                <Typography fontSize={15} fontWeight={600}>Select Groups *</Typography>
                <Autocomplete
                  multiple
                  options={watcherGroups}
                  getOptionLabel={(group) => group.name || ""}
                  value={selectedGroups}
                  onChange={handleGroupsSelection}
                  renderInput={(params) => (
                    <TextField {...params} placeholder="Select Groups" size="small" required sx={{ mt: 1 }} />
                  )}
                />
              </Grid>
            )}
          </Grid>

          {/* Title */}
          <Grid size={12}>
            <Box sx={{ mt: 3 }}>
              <Typography fontSize={15} fontWeight={600}>Title *</Typography>
              <TextField 
                fullWidth 
                size="small" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder="Enter ticket title" 
                sx={{ mt: 1 }} 
              />
            </Box>
          </Grid>

          {/* Description */}
          <Grid size={12}>
            <Box sx={{ mt: 3 }}>
              <Typography fontSize={15} fontWeight={600}>Description *</Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                value={description}
                onChange={handleDescriptionChange}
                placeholder="Enter ticket description (max 5000 characters)"
                sx={{ mt: 1 }}
              />
              <Typography textAlign="right" sx={{ mt: 0.5 }} color="text.secondary">
                {description.length}/5000 characters
              </Typography>
            </Box>
          </Grid>

          {/* Files Upload */}
          <Grid size={12}>
            <Box sx={{ mt: 3 }}>
              <Typography fontSize={15} fontWeight={600}>Attachments</Typography>
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                accept=".pdf,.png,.jpg,.jpeg"
                style={{ marginTop: '8px' }}
              />
              {files.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  {files.map((file, index) => (
                    <Chip
                      key={index}
                      label={file.name}
                      onDelete={() => removeFile(index)}
                      sx={{ mr: 1, mb: 1 }}
                    />
                  ))}
                </Box>
              )}
            </Box>
          </Grid>

          {/* Action Buttons */}
          <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button 
              variant="contained" 
              onClick={handleCancel} 
              sx={{ px: 5, backgroundColor: "#6b7280", "&:hover": { backgroundColor: "#4b5563" } }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={editMode ? handleUpdateTicket : handleCreateTicket}
              disabled={loading}
              sx={{ px: 5, backgroundColor: "#22c55e", "&:hover": { backgroundColor: "#16a34a" } }}
            >
              {loading ? "Saving..." : editMode ? "Update Ticket" : "Create Ticket"}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default TicketForm;
// import { useState, useEffect, useRef } from "react";
// import {
//   Box, Grid, Card, CardContent, TextField, Typography, MenuItem,
//   Button, Autocomplete, Chip, Avatar, FormControl, Select, InputLabel,
// } from "@mui/material";
// import { toast } from "react-toastify";
// import {
//   fetchConfigurations, fetchTicketCategories, fetchSubcategories,
//   createTicket, fetchPlatforms, updateTicket, getTicketDetails,fetchWatcherGroups
// } from "../../Api";

// const TicketForm = () => {
//   const userEntity = JSON.parse(localStorage.getItem("userEntity"));

//   const [categoryId, setCategoryId] = useState("");
//   const [subcategoryId, setSubcategoryId] = useState("");
//   const [description, setDescription] = useState("");
//   const [title, setTitle] = useState("");
//   const [priority, setPriority] = useState("");
//   const [files, setFiles] = useState([]);
//   const [ticketType, setTicketType] = useState("");
//   const [loading, setLoading] = useState(false);

//   const [ticketTypes, setTicketTypes] = useState([]);
//   const [departments, setDepartments] = useState([]);
//   const [locations, setLocations] = useState([]);
//   const [priorities, setPriorities] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [subcategories, setSubcategories] = useState([]);
//   const [configs, setConfigs] = useState([]);
//   const [allUsers, setAllUsers] = useState([]);
//   const [watcherGroups, setWatcherGroups] = useState([]);

//   const [platforms, setPlatforms] = useState([]);
//   const [selectedPlatform, setSelectedPlatform] = useState(null);

//   // Assignment state
//   const [selectionTypes, setSelectionTypes] = useState([]); // array of 'user' or 'group'
//   const [selectedUsers, setSelectedUsers] = useState([]);
//   const [selectedGroups, setSelectedGroups] = useState([]);
//   const [selectedWatchers, setSelectedWatchers] = useState([]);

//   const [editMode, setEditMode] = useState(false);
//   const [editTicketId, setEditTicketId] = useState(null);

//   const [selectedDepartment, setSelectedDepartment] = useState(null);
//   const [selectedLocation, setSelectedLocation] = useState(null);

//   const editInitRef = useRef(false);

//   // Check for edit mode
//   useEffect(() => {
//     const id = localStorage.getItem("editTicketId");
//     if (id) {
//       setEditMode(true);
//       setEditTicketId(id);
//     }
//   }, []);

//   // Load initial data
//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         const configData = await fetchConfigurations();
//         setConfigs(configData);
//         setTicketTypes(configData.filter((c) => c.field_type === "TicketType"));
//         setDepartments(configData.filter((c) => c.field_type === "Department"));
//         setLocations(configData.filter((c) => c.field_type === "Location"));
//         setPriorities(configData.filter((c) => c.field_type === "Priority"));

//         const cats = await fetchTicketCategories();
//         setCategories(cats);

//         // Fetch all users for user assignment dropdown
//         const token = localStorage.getItem("access_token");
//         const usersRes = await fetch("http://localhost:8000/api/tickets/watcher-users/", {
//           headers: {
//             "Authorization": `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         });
//         if (usersRes.ok) {
//           const usersData = await usersRes.json();
//           setAllUsers(Array.isArray(usersData) ? usersData : []);
//         }

//         // Fetch groups
//         const groupsRes = await fetchWatcherGroups();
//         if (Array.isArray(groupsRes)) setWatcherGroups(groupsRes);

//         const platformRes = await fetchPlatforms();
//          const platformList = platformRes?.data || platformRes || [];
//          setPlatforms(Array.isArray(platformList) ? platformList : []);

//         // If in edit mode, load ticket details after data is fetched
//         if (editMode && editTicketId) {
//           loadTicketForEdit(editTicketId);
//         }
//       } catch (err) {
//         console.error("Failed to load form data", err);
//         toast.error("Failed to load form data");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   // Load subcategories
//   useEffect(() => {
//     if (categoryId) {
//       fetchSubcategories(categoryId)
//         .then(res => {
//           const subcats = res.success ? res.data : [];
//           setSubcategories(subcats);
//           // If subcategories is empty, hide the field
//           if (subcats.length === 0) {
//             setSubcategoryId("");
//           }
//         })
//         .catch(() => {
//           setSubcategories([]);
//           setSubcategoryId("");
//         });
//     } else {
//       setSubcategories([]);
//       setSubcategoryId("");
//     }
//   }, [categoryId]);

//   // Update watchers based on selected users/groups
//   const updateWatchers = () => {
//     const userIds = selectedUsers.map(u => u.id) || [];
//     const groupMemberIds = selectedGroups.flatMap(g => g.users?.map(u => u.id) || []) || [];
//     setSelectedWatchers([...new Set([...userIds, ...groupMemberIds])]);
//   };

//   // Handle types selection (multiple)
//   const handleTypesSelection = (_, newValue) => {
//     const types = newValue.map(v => v.type);
//     setSelectionTypes(types);
//     // If a type is deselected, clear its assignees
//     if (!types.includes('user') && selectionTypes.includes('user')) {
//       setSelectedUsers([]);
//     }
//     if (!types.includes('group') && selectionTypes.includes('group')) {
//       setSelectedGroups([]);
//     }
//     setSelectedWatchers([]);
//     updateWatchers();
//   };

//   // Handle users selection (multiple)
//   const handleUsersSelection = (_, newValue) => {
//     setSelectedUsers(newValue);
//     updateWatchers();
//     if (newValue.length > 0) {
//       toast.success(`${newValue.length} user(s) selected`);
//     }
//   };

//   // Handle groups selection (multiple)
//   const handleGroupsSelection = (_, newValue) => {
//     setSelectedGroups(newValue);
//     updateWatchers();
//     if (newValue.length > 0) {
//       toast.success(`${newValue.length} group(s) selected`);
//     }
//   };

//   // Handle file changes
//   const handleFileChange = (e) => {
//     const newFiles = Array.from(e.target.files || []).filter(f =>
//       ["application/pdf", "image/png", "image/jpeg", "image/jpg"].includes(f.type)
//     );
//     setFiles(prev => [...prev, ...newFiles.filter(f => 
//       !prev.some(pf => pf.name === f.name && pf.size === f.size)
//     )]);
//   };

//   const removeFile = (i) => setFiles(prev => prev.filter((_, idx) => idx !== i));

//   // Load ticket for edit
//   const loadTicketForEdit = async (ticketNo) => {
//     try {
//       setLoading(true);
//       const response = await getTicketDetails(ticketNo);
//       const ticketData = response?.data?.ticket || response?.ticket || response;
//       if (!ticketData) throw new Error("No ticket data");
      
//       // Set form fields
//       setTicketType(configs.find(c => c.id === ticketData.type && c.field_type === "TicketType")?.field_name || "");
//       setSelectedDepartment(departments.find(d => d.id === ticketData.department) || null);
//       setSelectedLocation(locations.find(l => l.id === ticketData.location) || null);
//       setPriority(configs.find(c => c.id === ticketData.priority && c.field_type === "Priority")?.field_name || "");
//       setSelectedPlatform(platforms.find(p => p.id === (ticketData.platform?.id || ticketData.platform)) || null);
//       setCategoryId(ticketData.category || "");
//       setSubcategoryId(ticketData.subcategory || "");
//       setTitle(ticketData.title || "");
//       setDescription(ticketData.description || "");

//       // Parse assignment data from backend (assuming single for now; extend for multiple if backend supports)
//       if (ticketData.assignee_detail) {
//         // If assigned to a user
//         const user = allUsers.find(u => u.email === ticketData.assignee_detail.email);
//         if (user) {
//           setSelectionTypes(['user']);
//           setSelectedUsers([user]);
//         }
//       } else if (ticketData.assigned_group_detail) {
//         // If assigned to a group
//         const group = watcherGroups.find(g => g.id === ticketData.assigned_group_detail.id);
//         if (group) {
//           setSelectionTypes(['group']);
//           setSelectedGroups([group]);
//         }
//       }

//       // Update watchers
//       updateWatchers();
      
//       toast.success(`Editing Ticket #${ticketData.ticket_no}`);
//     } catch (err) {
//       toast.error("Failed to load ticket details");
//     } finally {
//       setLoading(false);
//     }
//   };

// const handleCreateTicket = async (e) => {
//   e.preventDefault();
//   setLoading(true);

//   try {
//     // Validation
//     if (!ticketType) {
//       toast.error("Type is required");
//       setLoading(false);
//       return;
//     }
//     if (!selectedDepartment) {
//       toast.error("Department is required");
//       setLoading(false);
//       return;
//     }
//     if (!selectedLocation) {
//       toast.error("Location is required");
//       setLoading(false);
//       return;
//     }
//     if (!selectedPlatform) {
//       toast.error("Platform is required");
//       setLoading(false);
//       return;
//     }
//     if (!priority) {
//       toast.error("Priority is required");
//       setLoading(false);
//       return;
//     }
//     if (!categoryId) {
//       toast.error("Category is required");
//       setLoading(false);
//       return;
//     }
//     if (selectionTypes.length === 0) {
//       toast.error("Assign To is required");
//       setLoading(false);
//       return;
//     }
//     if (selectionTypes.includes('user') && selectedUsers.length === 0) {
//       toast.error("Select at least one user if User is selected");
//       setLoading(false);
//       return;
//     }
//     if (selectionTypes.includes('group') && selectedGroups.length === 0) {
//       toast.error("Select at least one group if Group is selected");
//       setLoading(false);
//       return;
//     }
//     if (!title.trim()) {
//       toast.error("Title is required");
//       setLoading(false);
//       return;
//     }
//     if (!description.trim()) {
//       toast.error("Description is required");
//       setLoading(false);
//       return;
//     }
    
//     // Get IDs from configs
//     const typeObj = ticketTypes.find(t => t.field_name === ticketType);
//     const typeId = typeObj ? typeObj.id : null;
    
//     const departmentId = selectedDepartment ? selectedDepartment.id : null;
//     const locationId = selectedLocation ? selectedLocation.id : null;
//     const platformId = selectedPlatform ? selectedPlatform.id : null;
    
//     const priorityObj = priorities.find(p => p.field_name === priority);
//     const priorityId = priorityObj ? priorityObj.id : null;

//     // CRITICAL: Make sure all required IDs are available
//     if (!typeId) {
//       toast.error("Please select a valid ticket type");
//       setLoading(false);
//       return;
//     }
//     if (!departmentId) {
//       toast.error("Please select a valid department");
//       setLoading(false);
//       return;
//     }
//     if (!locationId) {
//       toast.error("Please select a valid location");
//       setLoading(false);
//       return;
//     }
//     if (!platformId) {
//       toast.error("Please select a valid platform");
//       setLoading(false);
//       return;
//     }
//     if (!priorityId) {
//       toast.error("Please select a valid priority");
//       setLoading(false);
//       return;
//     }

//     // Prepare data according to backend serializer structure
//     const formData = new FormData();
    
//     // Basic fields
//     formData.append("type", typeId);
//     formData.append("department", departmentId);
//     formData.append("location", locationId);
//     formData.append("platform", platformId);
//     formData.append("priority", priorityId);
//     formData.append("category", categoryId);  // REQUIRED - use 'category' not 'category_id'
    
//     // Only append subcategory if it exists and is selected
//     if (subcategoryId && subcategories.length > 0) {
//       formData.append("subcategory", subcategoryId);  // 'subcategory' not 'subcategory_id'
//     }
    
//     formData.append("title", title.trim());
//     formData.append("description", description);
    
//     // Assignment fields (support multiple types and assignees)
//     selectionTypes.forEach(type => {
//       formData.append("assigned_to_type", type);
//     });
    
//     if (selectionTypes.includes('user') && selectedUsers.length > 0) {
//       selectedUsers.forEach(user => {
//         formData.append("assignee", user.email);
//       });
//     }
//     if (selectionTypes.includes('group') && selectedGroups.length > 0) {
//       selectedGroups.forEach(group => {
//         formData.append("assigned_group", group.id);
//       });
//     }
    
//     // Watchers (CC)
//     selectedWatchers.forEach(id => {
//       formData.append("watchers", id);
//     });
    
//     // Files
//     files.forEach(file => {
//       if (file instanceof File) {
//         formData.append("documents", file);
//       }
//     });

//     // Create ticket
//     const result = await createTicket(formData);
    
//     if (result?.success || result?.ticket_no || result?.id) {
//       const ticketNo = result.ticket_no || result.data?.ticket_no || result.id;
//       toast.success(`Ticket #${ticketNo} created successfully!`);
//       resetForm();
      
//       // Optional: Clear edit mode if it was set
//       if (editMode) {
//         localStorage.removeItem("editTicketId");
//         setEditMode(false);
//         setEditTicketId(null);
//       }
      
//       // Redirect to ticket history
//       setTimeout(() => {
//         window.location.href = "/tickethistory";
//       }, 1500);
//     } else {
//       // Handle different error response formats
//       const errorMsg = result?.error || 
//                       result?.message || 
//                       result?.detail || 
//                       "Failed to create ticket";
//       throw new Error(errorMsg);
//     }
//   } catch (err) {
//     console.error("Ticket creation error:", err);
    
//     // More user-friendly error messages
//     if (err.message.includes("category")) {
//       toast.error("Category error: " + err.message);
//     } else if (err.message.includes("required")) {
//       toast.error("Missing required field: " + err.message);
//     } else if (err.message.includes("IntegrityError") || err.message.includes("cannot be null")) {
//       toast.error("Database error: Please check all required fields are filled correctly");
//     } else {
//       toast.error(err.message || "Failed to create ticket. Please try again.");
//     }
//   } finally {
//     setLoading(false);
//   }
// };

// const handleUpdateTicket = async (e) => {
//   e.preventDefault();
//   setLoading(true);

//   try {
//     // Similar validation as create
//     if (!ticketType) {
//       toast.error("Type is required");
//       setLoading(false);
//       return;
//     }
//     if (!selectedDepartment) {
//       toast.error("Department is required");
//       setLoading(false);
//       return;
//     }
//     if (!selectedLocation) {
//       toast.error("Location is required");
//       setLoading(false);
//       return;
//     }
//     if (!selectedPlatform) {
//       toast.error("Platform is required");
//       setLoading(false);
//       return;
//     }
//     if (!priority) {
//       toast.error("Priority is required");
//       setLoading(false);
//       return;
//     }
//     if (!categoryId) {
//       toast.error("Category is required");
//       setLoading(false);
//       return;
//     }
//     if (selectionTypes.length === 0) {
//       toast.error("Assign To is required");
//       setLoading(false);
//       return;
//     }
//     if (selectionTypes.includes('user') && selectedUsers.length === 0) {
//       toast.error("Select at least one user if User is selected");
//       setLoading(false);
//       return;
//     }
//     if (selectionTypes.includes('group') && selectedGroups.length === 0) {
//       toast.error("Select at least one group if Group is selected");
//       setLoading(false);
//       return;
//     }
//     if (!title.trim()) {
//       toast.error("Title is required");
//       setLoading(false);
//       return;
//     }
//     if (!description.trim()) {
//       toast.error("Description is required");
//       setLoading(false);
//       return;
//     }
    
//     // Get IDs
//     const typeObj = ticketTypes.find(t => t.field_name === ticketType);
//     const typeId = typeObj ? typeObj.id : null;
    
//     const departmentId = selectedDepartment ? selectedDepartment.id : null;
//     const locationId = selectedLocation ? selectedLocation.id : null;
//     const platformId = selectedPlatform?.id;
    
//     const priorityObj = priorities.find(p => p.field_name === priority);
//     const priorityId = priorityObj ? priorityObj.id : null;

//     if (!typeId || !departmentId || !locationId || !platformId || !priorityId || !categoryId) {
//       toast.error("Please fill all required fields");
//       setLoading(false);
//       return;
//     }

//     const formData = new FormData();
//     formData.append("type", typeId);
//     formData.append("department", departmentId);
//     formData.append("location", locationId);
//     formData.append("platform", platformId);
//     formData.append("priority", priorityId);
//     formData.append("category", categoryId);
    
//     // Only append subcategory if it exists and is selected
//     if (subcategoryId && subcategories.length > 0) {
//       formData.append("subcategory", subcategoryId);
//     }
    
//     formData.append("title", title.trim());
//     formData.append("description", description);
    
//     // Assignment fields (support multiple types and assignees)
//     selectionTypes.forEach(type => {
//       formData.append("assigned_to_type", type);
//     });
    
//     if (selectionTypes.includes('user') && selectedUsers.length > 0) {
//       selectedUsers.forEach(user => {
//         formData.append("assignee", user.email);
//       });
//     }
//     if (selectionTypes.includes('group') && selectedGroups.length > 0) {
//       selectedGroups.forEach(group => {
//         formData.append("assigned_group", group.id);
//       });
//     }
    
//     // Watchers
//     selectedWatchers.forEach(id => {
//       formData.append("watchers", id);
//     });
    
//     // Files
//     files.forEach(file => {
//       if (file instanceof File) {
//         formData.append("documents", file);
//       }
//     });

//     const result = await updateTicket(editTicketId, formData);
    
//     if (result?.success || result?.message?.includes("success")) {
//       toast.success("Ticket updated successfully!");
      
//       // Clear edit mode
//       localStorage.removeItem("editTicketId");
//       setEditMode(false);
//       setEditTicketId(null);
      
//       // Redirect after a short delay
//       setTimeout(() => {
//         window.location.href = "/tickethistory";
//       }, 1500);
//     } else {
//       throw new Error(result?.error || "Update failed");
//     }
//   } catch (err) {
//     console.error("Ticket update error:", err);
//     toast.error(err.message || "Failed to update ticket");
//   } finally {
//     setLoading(false);
//   }
// };

//   const resetForm = () => {
//     setTitle("");
//     setDescription("");
//     setFiles([]);
//     setTicketType("");
//     setPriority("");
//     setCategoryId("");
//     setSubcategoryId("");
//     setSelectionTypes([]);
//     setSelectedUsers([]);
//     setSelectedGroups([]);
//     setSelectedWatchers([]);
//     setSelectedDepartment(null);
//     setSelectedLocation(null);
//     setSelectedPlatform(null);
//   };

//   const handleCancel = () => {
//     resetForm();
//     localStorage.removeItem("editTicketId");
//     toast.info("Form cancelled.");
//   };

//   const handleDescriptionChange = (e) => {
//     if (e.target.value.length <= 5000) setDescription(e.target.value);
//   };

//   // Check if subcategory should be shown
//   const shouldShowSubcategory = subcategories.length > 0;

//   return (
//     <Box sx={{ p: 3, display: "flex", justifyContent: "center" }}>
//       <Card sx={{ width: "100%", maxWidth: "1200px", borderRadius: 4, p: 3, boxShadow: 3 }}>
//         <CardContent>
//           <Box sx={{ mb: 3 }}>
//             <Typography fontSize={30} fontWeight={700}>
//               {editMode ? `Edit Ticket #${editTicketId}` : "Create New Ticket"}
//             </Typography>
//           </Box>

//           <Grid container spacing={3}>
//             {/* Ticket Type */}
//             <Grid size={{xs:12,sm:6,md:3}}>
//               <Typography fontSize={15} fontWeight={600}>Type *</Typography>
//               <TextField 
//                 select 
//                 fullWidth 
//                 size="small" 
//                 value={ticketType} 
//                 onChange={(e) => setTicketType(e.target.value)} 
//                 label="Select Type" 
//                 sx={{ mt: 1 }}
//               >
//                 {ticketTypes.map((t) => (
//                   <MenuItem key={t.id} value={t.field_name}>{t.field_name}</MenuItem>
//                 ))}
//               </TextField>
//             </Grid>

//             {/* Department */}
//             <Grid size={{xs:12,sm:6,md:3}}>
//               <Typography fontSize={15} fontWeight={600}>Department *</Typography>
//               <Autocomplete
//                 value={selectedDepartment}
//                 onChange={(_, v) => setSelectedDepartment(v)}
//                 options={departments}
//                 getOptionLabel={(o) => o.field_name || ""}
//                 renderInput={(params) => (
//                   <TextField {...params} label="Select Department" size="small" required sx={{ mt: 1 }} />
//                 )}
//               />
//             </Grid>

//             {/* Location */}
//             <Grid size={{xs:12,sm:6,md:3}}>
//               <Typography fontSize={15} fontWeight={600}>Location *</Typography>
//               <Autocomplete
//                 value={selectedLocation}
//                 onChange={(_, v) => setSelectedLocation(v)}
//                 options={locations}
//                 getOptionLabel={(o) => o.field_name || ""}
//                 renderInput={(params) => (
//                   <TextField {...params} label="Select Location" size="small" required sx={{ mt: 1 }} />
//                 )}
//               />
//             </Grid>

//             {/* Priority */}
//             <Grid size={{xs:12,sm:6,md:3}}>
//               <Typography fontWeight={600}>Priority *</Typography>
//               <FormControl fullWidth size="small" sx={{ mt: 1 }}>
//                 <InputLabel>Select Priority</InputLabel>
//                 <Select value={priority} label="Priority" onChange={(e) => setPriority(e.target.value)}>
//                   {priorities.map((p) => (
//                     <MenuItem key={p.id} value={p.field_name}>{p.field_name}</MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//             </Grid>

//             <Grid size={{ xs: 12, sm: 6, md: 3 }}>
//                <Typography fontSize={15} fontWeight={600}>Platform *</Typography>
//                <Autocomplete
//                 value={selectedPlatform}
//                 onChange={(_, v) => setSelectedPlatform(v)}
//                 options={platforms}
//                 getOptionLabel={(opt) => opt.field_name || opt.field_name || "Unknown"}
//                 loading={loading}
//                 renderInput={(params) => (
//                   <TextField
//                     {...params}
//                     label="Select Platform"
//                     size="small"
//                     required
//                     sx={{ mt: 1, "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
//                   />
//                 )}
//               />
//             </Grid>

//             {/* Category */}
//             <Grid size={{xs:12,sm:6,md:3}}>
//               <Typography fontSize={15} fontWeight={600}>Category *</Typography>
//               <Autocomplete
//                 options={categories}
//                 getOptionLabel={(o) => o.category_name || ""}
//                 value={categories.find((c) => c.id === parseInt(categoryId)) || null}
//                 onChange={(_, v) => {
//                   setCategoryId(v ? v.id : "");
//                   // Reset subcategory when category changes
//                   setSubcategoryId("");
//                 }}
//                 renderInput={(params) => (
//                   <TextField {...params} label="Select Category" size="small" required sx={{ mt: 1 }} />
//                 )}
//               />
//             </Grid>

//             {/* Subcategory - Only show if subcategories exist */}
//             {shouldShowSubcategory && (
//               <Grid size={{xs:12,sm:6,md:3}}>
//                 <Typography fontSize={15} fontWeight={600}>Subcategory</Typography>
//                 <Autocomplete
//                   options={subcategories}
//                   getOptionLabel={(o) => o.subcategory_name || ""}
//                   value={subcategories.find((s) => s.id === parseInt(subcategoryId)) || null}
//                   onChange={(_, v) => setSubcategoryId(v ? v.id : "")}
//                   renderInput={(params) => (
//                     <TextField {...params} label="Select Subcategory" size="small" sx={{ mt: 1 }} />
//                   )}
//                 />
//               </Grid>
//             )}

//             {/* Assignment Type (User/Group) - Multiple */}
//             <Grid size={{xs:12,sm:6,md:3}}>
//               <Typography fontSize={15} fontWeight={600}>Assign To *</Typography>
//               <Autocomplete
//                 multiple
//                 options={[{ label: 'User', type: 'user' }, { label: 'Group', type: 'group' }]}
//                 getOptionLabel={(option) => option.label}
//                 value={selectionTypes.map(type => ({ label: type === 'user' ? 'User' : 'Group', type }))}
//                 onChange={handleTypesSelection}
//                 renderInput={(params) => (
//                   <TextField {...params} placeholder="Select User and/or Group" size="small" required sx={{ mt: 1 }} />
//                 )}
//               />
//             </Grid>

//             {/* Users Dropdown (shown when 'user' is selected) */}
//             {selectionTypes.includes('user') && (
//               <Grid size={{xs:12,sm:6,md:3}}>
//                 <Typography fontSize={15} fontWeight={600}>Select Users *</Typography>
//                 <Autocomplete
//                   multiple
//                   options={allUsers}
//                   getOptionLabel={(user) => `${user.name || user.email} (${user.email})`}
//                   value={selectedUsers}
//                   onChange={handleUsersSelection}
//                   renderInput={(params) => (
//                     <TextField {...params} placeholder="Select Users" size="small" required sx={{ mt: 1 }} />
//                   )}
//                 />
//               </Grid>
//             )}

//             {/* Groups Dropdown (shown when 'group' is selected) */}
//             {selectionTypes.includes('group') && (
//               <Grid size={{xs:12,sm:6,md:3}}>
//                 <Typography fontSize={15} fontWeight={600}>Select Groups *</Typography>
//                 <Autocomplete
//                   multiple
//                   options={watcherGroups}
//                   getOptionLabel={(group) => group.name || ""}
//                   value={selectedGroups}
//                   onChange={handleGroupsSelection}
//                   renderInput={(params) => (
//                     <TextField {...params} placeholder="Select Groups" size="small" required sx={{ mt: 1 }} />
//                   )}
//                 />
//               </Grid>
//             )}
//           </Grid>

//           {/* Title */}
//           <Grid size={12}>
//             <Box sx={{ mt: 3 }}>
//               <Typography fontSize={15} fontWeight={600}>Title *</Typography>
//               <TextField 
//                 fullWidth 
//                 size="small" 
//                 value={title} 
//                 onChange={(e) => setTitle(e.target.value)} 
//                 placeholder="Enter ticket title" 
//                 sx={{ mt: 1 }} 
//               />
//             </Box>
//           </Grid>

//           {/* Description */}
//           <Grid size={12}>
//             <Box sx={{ mt: 3 }}>
//               <Typography fontSize={15} fontWeight={600}>Description *</Typography>
//               <TextField
//                 fullWidth
//                 multiline
//                 rows={4}
//                 value={description}
//                 onChange={handleDescriptionChange}
//                 placeholder="Enter ticket description (max 5000 characters)"
//                 sx={{ mt: 1 }}
//               />
//               <Typography textAlign="right" sx={{ mt: 0.5 }} color="text.secondary">
//                 {description.length}/5000 characters
//               </Typography>
//             </Box>
//           </Grid>

//           {/* Files Upload */}
//           <Grid size={12}>
//             <Box sx={{ mt: 3 }}>
//               <Typography fontSize={15} fontWeight={600}>Attachments</Typography>
//               <input
//                 type="file"
//                 multiple
//                 onChange={handleFileChange}
//                 accept=".pdf,.png,.jpg,.jpeg"
//                 style={{ marginTop: '8px' }}
//               />
//               {files.length > 0 && (
//                 <Box sx={{ mt: 2 }}>
//                   {files.map((file, index) => (
//                     <Chip
//                       key={index}
//                       label={file.name}
//                       onDelete={() => removeFile(index)}
//                       sx={{ mr: 1, mb: 1 }}
//                     />
//                   ))}
//                 </Box>
//               )}
//             </Box>
//           </Grid>

//           {/* Action Buttons */}
//           <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end", gap: 2 }}>
//             <Button 
//               variant="contained" 
//               onClick={handleCancel} 
//               sx={{ px: 5, backgroundColor: "#6b7280", "&:hover": { backgroundColor: "#4b5563" } }}
//             >
//               Cancel
//             </Button>
//             <Button
//               variant="contained"
//               onClick={editMode ? handleUpdateTicket : handleCreateTicket}
//               disabled={loading}
//               sx={{ px: 5, backgroundColor: "#22c55e", "&:hover": { backgroundColor: "#16a34a" } }}
//             >
//               {loading ? "Saving..." : editMode ? "Update Ticket" : "Create Ticket"}
//             </Button>
//           </Box>
//         </CardContent>
//       </Card>
//     </Box>
//   );
// };

// export default TicketForm;