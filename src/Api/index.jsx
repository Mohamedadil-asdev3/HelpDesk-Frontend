// src/api/api.jsx
import axios from "axios";
export const Media_URL = "http://localhost:8000";

//  const API_BASE_URL = "http://localhost:8000/api/";
//const API_BASE_URL = "http://192.168.60.149:8000/api/";
const API_BASE_URL = "http://172.22.32.1:8000/api/";
// const API_BASE_URL = "http://192.168.0.242:8000/api/";


const api = axios.create({
  baseURL: API_BASE_URL,
  // timeout: 10000,
    timeout: 30000, // 30 seconds

  headers: {
    "Content-Type": "application/json",
  },
//   withCredentials: true,
});

// --- List Configurations
export const fetchConfigurations = async (params = {}) => {
  try {
    const response = await api.get("tickets/configurations/", { params });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch configurations:", error.response?.data || error.message);
    throw error;
  }
};

export default {
  fetchConfigurations,
};

// ---------------------Login---------------------//

// export const loginAPI = async (credentials) => {
//   const res = await api.post("login/", credentials); // Adjust endpoint if needed
//   if (!res.data || !res.data.access) {
//     throw new Error(res.data?.error || "Login failed");
//   }
//   return res.data;
// };

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem("refresh_token");
 
      // Only attempt logout if we still have refresh token
      if (refreshToken) {
        try {
          // Call logout with refresh token BEFORE clearing anything
          await axios.post(`${API_BASE_URL}logout/`, { refresh: refreshToken });
          console.log("Logout time recorded on session expiry");
        } catch (logoutErr) {
          console.warn("Failed to record logout time on 401:", logoutErr);
          // Don't block the user — proceed with local logout
        }
      }
 
      // NOW safely clear storage and redirect
      localStorage.clear();
      delete api.defaults.headers.common["Authorization"];
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
 
 
 
export const loginAPI = async (credentials) => {
  try {
    const res = await api.post("login/", credentials);
 
    const { access, refresh, user, message, force_change } = res.data;
 
    // Store tokens
    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("userEntity", JSON.stringify(user.entity_data || {}));
 
    // CRITICAL: Return access and refresh so Login.jsx can use them
    return { access, refresh, user, message, force_change };
 
  } catch (error) {
    const msg = error.response?.data?.error || error.message || "Login failed";
    throw new Error(msg);
  }
};
 
export const logoutAPI = async () => {
  const refresh = localStorage.getItem("refresh_token");
 
  if (!refresh) {
    console.warn("No refresh token found for logout");
    localStorage.clear();
    delete api.defaults.headers.common["Authorization"];
    return;
  }
 
  try {
    // Use raw axios to avoid interceptor loops or auth issues
    await axios.post(`${API_BASE_URL}logout/`, { refresh });
    console.log("Logout recorded successfully");
  } catch (error) {
    console.warn("Logout API failed (proceeding locally):", error.response?.data || error.message);
  } finally {
    // Always clear local state
    localStorage.clear();
    delete api.defaults.headers.common["Authorization"];
  }
};
 
export const forgotPasswordAPI = async (emailData) => {
  const res = await api.post("forgot-password/", emailData);
  if (!res.data) {
    throw new Error(res.data?.error || "Failed to reset password");
  }
  return res.data;
};

export const changePasswordAPI = async (passwordData, token) => {
  const res = await api.post("change-password/", passwordData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.data) {
    throw new Error(res.data?.error || "Failed to change password");
  }
  return res.data;
};

// -----------------Role-------------------//

export const fetchRolesAPI = async (entityId = null) => {
  try {
    const token = localStorage.getItem("access_token");
    let url = "tickets/roles/";
    if (entityId) {
      url += `?entity_id=${entityId}`;
    }
    const res = await api.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    console.error("Failed to fetch roles:", err.response?.data || err.message);
    throw err;
  }
};

export const saveRoleAPI = async (data, id = null) => {
  const token = localStorage.getItem("access_token");
  if (id) {
    const res = await api.put(`tickets/roles/${id}/`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } else {
    const res = await api.post("tickets/roles/", data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  }
};

export const deleteRoleAPI = async (id) => {
  const token = localStorage.getItem("access_token");
  const res = await api.delete(`tickets/roles/${id}/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;  // Or return res.status if no data expected (e.g., 204)
};

// const getToken = () => localStorage.getItem("access_token");
//---------Category-------------------//


export const fetchTicketCategories = async (params = {}) => {
  try {
    const response = await api.get("tickets/ticket-categories/", { params });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch ticket categories:", error.response?.data || error.message);
    throw error;
  }
};


export const fetchTicketCategoryById = async (id, params = {}) => {
  try {
    if (!id) throw new Error("fetchTicketCategoryById: id is required");
    const response = await api.get(`tickets/ticket-categories/${id}/`, { params });
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch ticket category ${id}:`, error.response?.data || error.message);
    throw error;
  }
};

export const createTicketCategory = async (payload) => {
  try {
    const response = await api.post("tickets/ticket-categories/", payload);
    return response.data;
  } catch (error) {
    console.error("Failed to create ticket category:", error.response?.data || error.message);
    throw error;
  }
};

// --- Update Ticket Category 
export const updateTicketCategory = async (id, payload) => {
  try {
    if (!id) throw new Error("updateTicketCategory: id is required");
    const response = await api.put(`tickets/ticket-categories/${id}/`, payload);
    return response.data;
  } catch (error) {
    console.error(`Failed to update ticket category ${id}:`, error.response?.data || error.message);
    throw error;
  }
};


//-----------------SUbcategory----------------------//

export const fetchSubcategories = async (categoryId = null) => {
    try {
        const url = categoryId ? `tickets/subcategories/?category_id=${categoryId}` : 'tickets/subcategories/';
        const response = await api.get(url);
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Failed to fetch subcategories:", error.response?.data || error.message);
        return { success: false, error: error.response?.data?.detail || error.message };
    }
};
// ---- POST (create) or PUT (update) subcategory
export const saveSubcategory = async (data, id = null) => {
  try {
    const url = id ? `tickets/subcategories/${id}/` : "tickets/subcategories/";
    const response = id ? await api.put(url, data)   : await api.post(url, data); 
    return response.data;
  } catch (error) {
    console.error("Failed to save subcategory:",error.response?.data || error.message);
    throw error;
  }
};


//--------------------Create Category API ---------------------//


// export const createTicket = async (data) => {
//   try {
//     const response = await api.post("tickets/tickets/", data);
//     return { success: true, data: response.data };
//   } catch (error) {
//     console.error("Error creating ticket:", error.response?.data || error.message);
//     return { success: false, error: error.response?.data || error.message };
//   }
// };
export const createTicket = async (data) => {
  try {
    const token = localStorage.getItem("access_token"); 
    console.log("tokkeeen",token)
    const response = await api.post(
      "tickets/tickets/",
      data,
      {
        headers: {
          "Authorization": `Bearer ${token}`, 
          'Content-Type': 'multipart/form-data',
          // "Content-Type": "application/json",

        },
      }
    );

    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error creating ticket:", error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
};

export const fetchHomeScreenSLA = async (categoryId, subcategoryId) => {
  try {
    // Constructing the query params
    const params = {
      category_id: categoryId,
      subcategory_id: subcategoryId || null,
    };
    const response = await api.get("tickets/slas/home/", { params });
    return response.data; // Return the data received from the API
  } catch (error) {
    console.error("Error fetching SLA for home screen:", error.response?.data || error.message);
    throw error;
  }
};

// Create or Update SLA for Home Screen (POST)
export const saveHomeScreenSLA = async (categoryId, subcategoryId, data) => {
  try {
    const params = {
      category_id: categoryId,
      subcategory_id: subcategoryId,
    };

    const response = await api.post("tickets/slas/home/", data, { params });
    return response.data; // Return the created/updated SLA data
  } catch (error) {
    console.error("Error saving SLA for home screen:", error.response?.data || error.message);
    throw error;
  }
};

export const fetchSLAById = async (slaId) => {
  try {
    const response = await api.get(`tickets/slas/${slaId}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching SLA by ID:", error.response?.data || error.message);
    throw error;
  }
};


// === Get All Tickets ===
// export const fetchTickets = async (params = {}) => {
//   try {
//     const response = await api.get("tickets/tickets/", { params });
//     return { success: true, data: response.data };
//   } catch (error) {
//     console.error("Error fetching tickets:", error.response?.data || error.message);
//     return { success: false, error: error.response?.data || error.message };
//   }
// };

// // === Get Ticket by ID ===
// export const fetchTicketById = async (id) => {
//   try {
//     const response = await api.get(`tickets/tickets/${id}/`);
//     return { success: true, data: response.data };
//   } catch (error) {
//     console.error(`Error fetching ticket ${id}:`, error.response?.data || error.message);
//     return { success: false, error: error.response?.data || error.message };
//   }
// };


export const fetchTickets = async (params = {}) => {
  try {
    const token = localStorage.getItem("access_token"); // ✅ Same as createTicket
    console.log("Fetching Tickets with Token:", token);

    const response = await api.get("tickets/tickets/", {
      params,
      headers: {
        Authorization: `Bearer ${token}`, // ✅ Pass token
      },
    });

    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error fetching tickets:", error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
};

//----------------PUT to update---------------------//

// export const updateTicket = async (id, data) => {
//   try {
//     // const response = await api.put(`tickets/tickets/${id}/`, data);
//     const response = await api.get("tickets/tickets/${id}/",data, {
       
//       headers: {
//         Authorization: `Bearer ${token}`, // ✅ Pass token
//       },
//     });

//     return { success: true, data: response.data };
//   } catch (error) {
//     console.error("Error updating ticket (PUT):", error.response?.data || error.message);
//     return { success: false, error: error.response?.data || error.message };
//   }
// };
// Api.js - Corrected updateTicket function
// Assumes 'api' is axios instance, 'token' from localStorage
export const updateTicket = async (ticketNo, data) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("No authentication token found. Please login again.");
    }

    // Fixed: Use PUT for update, correct URL (no duplicate "tickets/"), template literal for id
    const response = await api.put(`tickets/tickets/${ticketNo}/`, data, {
      headers: {
        Authorization: `Bearer ${token}`, // Pass token
        // "Content-Type": "application/json", // Ensure JSON
        "Content-Type": "multipart/form-data",
      },
    });

    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error updating ticket (PUT):", error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
};
// In Admik ticket counts
 
export const fetchAdminTickets = async (params = {}) => {
  const token = localStorage.getItem("access_token");
  const userData = JSON.parse(localStorage.getItem("user"));
  const user = userData?.id;
  const response = await api.get(`tickets/admin/count/?user=${user}`, {
    headers: { Authorization: `Bearer ${token}` },
   
  });
 console.log("response :",response);
 
  if (response.status != 200) throw new Error("Failed to fetch approver tickets");
  return response.data;
};
 
 
//------------------- Get All SLAs -----------------
export const fetchTicketSLAs = async (params = {}) => {
  try {
    const response = await api.get("tickets/ticket-slas/", { params });
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error fetching Ticket SLAs:", error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
};

//----------------Get SLA by ID--------------
export const fetchTicketSLAById = async (id) => {
  try {
    const response = await api.get(`tickets/ticket-slas/${id}/`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error(`Error fetching SLA ${id}:`, error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
};

// export const fetchTicketSLAById = async (entityId, categoryId, subcategoryId) => {
//   try {
//     const token = localStorage.getItem("access_token");
//     const response = await api.get("tickets/ticket-slas/", {
//       params: {
//         entity_id: entityId,
//         category_id: categoryId,
//         subcategory_id: subcategoryId,
//       },
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     return response.data && response.data.length > 0 ? response.data[0] : {};
//   } catch (err) {
//     console.error("Failed to fetch SLA by IDs:", err.response?.data || err.message);
//     return {};
//   }
// };

export const fetchTicketSLAByEntityAndCategory = async (entityId, categoryId, subcategoryId) => {
  const response = await api.get(
    `tickets/ticket-slas/?entity_id=${entityId}&category_id=${categoryId}&subcategory_id=${subcategoryId}`
  );
  return response.data;
};
// ✅ Fetch watcher users (with optional search)
export const fetchWatcherUsers = async (search = "") => {
  try {
    const token = localStorage.getItem("access_token");
    const response = await api.get("tickets/watcher-users/", {
      params: { search },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching watcher users:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ Fetch all watcher groups
export const fetchWatcherGroups = async () => {
  try {
    const token = localStorage.getItem("access_token");
    const response = await api.get("tickets/watcher-groups/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching watcher groups:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ Create new watcher group
export const createWatcherGroup = async (data) => {
  try {
    const token = localStorage.getItem("access_token");
    const response = await api.post("tickets/watcher-groups/", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating watcher group:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ Update watcher group
export const updateWatcherGroup = async (id, data) => {
  try {
    const token = localStorage.getItem("access_token");
    const response = await api.put(`tickets/watcher-groups/${id}/`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating watcher group:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ Delete watcher group
export const deleteWatcherGroup = async (id) => {
  try {
    const token = localStorage.getItem("access_token");
    await api.delete(`tickets/watcher-groups/${id}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Error deleting watcher group:", error.response?.data || error.message);
    throw error;
  }
};


export const assignUsersToGroup = async (groupId, payload) => {
  try {
    const token = localStorage.getItem("access_token");

    const response = await api.put(
      `tickets/watcher-groups/${groupId}/`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error assigning users to watcher group:", error.response?.data || error.message);
    throw error;
  }
};

//-----------Create a new SLA---------------
export const createTicketSLA = async (data) => {
  try {
    const response = await api.post("tickets/ticket-slas/", data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error creating Ticket SLA:", error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
};

//--------------Action Approve Reject and OnHold---------------------//

// export const performTicketAction = async (ticketId, payload) => {
//   try {
//     const response = await api.post(`tickets/tickets/${ticketId}/action/`, payload);
//     return response.data;
//   } catch (error) {
//     console.error(`Failed to perform action on ticket ${ticketId}:`, error.response?.data || error.message);
//     throw error;
//   }
// };

export const performTicketAction = async (ticketId, payload) => {
  try {
    const token = localStorage.getItem("access_token");

    if (!token) {
      throw new Error("No access token found. Please log in again.");
    }

    const response = await api.post(
      `tickets/tickets/${ticketId}/action/`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      `Failed to perform action on ticket ${ticketId}:`,
      error.response?.data || error.message
    );
    throw error;
  }
};



export const getTicketDetails = async (ticketNo) => {
  try {
    const token = localStorage.getItem("access_token");

    if (!token) {
      throw new Error("No access token found. Please log in again.");
    }

    const response = await api.get(`tickets/tickets/${ticketNo}/action/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      ticket: response.data.ticket,
      approvalLogs: response.data.approval_logs,
    };
  } catch (error) {
    console.error(
      `Failed to fetch details for ticket ${ticketNo}:`,
      error.response?.data || error.message
    );
    throw error;
  }
};


// Fetch entity details based on logged-in user
export const fetchEntityByUser = async () => {
  try {
    const token = localStorage.getItem("access_token");
    const response = await api.get("tickets/entities/", { // Replace with actual entity API endpoint
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error fetching entity:", error.response?.data || error.message);
    return { success: false, error: error.response?.data?.detail || error.message };
  }
};

export const fetchEntitiesAPI = async () => {
  try {
    const token = localStorage.getItem("access_token");
    const response = await api.get("tickets/entities/", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching entities:", error.response?.data || error.message);
    throw error;
  }
};

// Fetch HOD users
export const fetchHodsAPI = async () => {
  try {
    const token = localStorage.getItem("access_token");
    const response = await api.get("tickets/hod-users/", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching HODs:", error.response?.data || error.message);
    throw error;
  }
};

// Create or update entity
// export const saveEntityAPI = async (data, id = null) => {
//   try {
//     const token = localStorage.getItem("access_token");
//     const formData = new FormData();
//     Object.keys(data).forEach((key) => {
//       if (data[key] !== null) formData.append(key, data[key]);
//     });

//     const url = id ? `tickets/entities/${id}/` : "tickets/entities/";
//     const method = id ? api.put : api.post;

//     const response = await method(url, formData, {
//       headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
//     });

//     return response.data;
//   } catch (error) {
//     console.error("Error saving entity:", error.response?.data || error.message);
//     throw error;
//   }
// };
export const saveEntityAPI = async (data, id = null) => {
  try {
    const token = localStorage.getItem("access_token");
    const formData = new FormData();

    // Append all fields except `location`
    Object.keys(data).forEach((key) => {
      if (data[key] !== null && key !== "location") {
        formData.append(key, data[key]);
      }
    });

    // ✅ Important: map `location` → `location_id`
    if (data.location) {
      formData.append("location_id", data.location);
    }

    const url = id ? `tickets/entities/${id}/` : "tickets/entities/";
    const method = id ? api.put : api.post;

    const response = await method(url, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error saving entity:", error.response?.data || error.message);
    throw error;
  }
};

// --- Locations ---
export const fetchLocationsAPI = async (entityId = null, departmentId = null) => {
  const token = localStorage.getItem("access_token");
  let url = "tickets/locations/";
  const params = {};
  // if (entityId) params.entity_id = entityId;
  if (departmentId) params.department_id = departmentId;
  
  const res = await api.get(url, { 
    headers: { Authorization: `Bearer ${token}` }, 
    params 
  });
  return res.data;
};

// export const fetchLocationsAPI = async (entityId = null) => {
//   const token = localStorage.getItem("access_token");
//   const url = entityId ? `tickets/locations/?entity_id=${entityId}` : "tickets/locations/";
//   const res = await api.get(url, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
//   return res.data;
// };
export const saveConfigurations = async (payload) => {
  const response = await api.post('tickets/configurations/', payload);
  return response.data;
};
export const saveLocationAPI = async (data, id = null) => {
  const token = localStorage.getItem("access_token");
  if (id) {
    const res = await api.put(`tickets/locations/${id}/`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } else {
    const res = await api.post("tickets/locations/", data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  }
};

export const deleteLocationAPI = async (id) => {
  const token = localStorage.getItem("access_token");
  const res = await api.delete(`tickets/locations/${id}/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};


// --- Ticket Categories ---
export const fetchCategoriesAPI = async (entityId) => {
  try {
    const token = localStorage.getItem("access_token");
    const response = await api.get(`tickets/ticket-categories/?entity_id=${entityId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (err) {
    console.error("Failed to fetch categories:", err.response?.data || err.message);
    throw err;
  }
};


// --- Subcategories ---
export const fetchSubcategoriesAPI = async (categoryId) => {
  try {
    const token = localStorage.getItem("access_token");
    const response = await api.get(`tickets/subcategories/?category_id=${categoryId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (err) {
    console.error("Failed to fetch subcategories:", err.response?.data || err.message);
    throw err;
  }
};

// --- SLA by entity/category/subcategory ---
export const fetchSLAAPI = async (entityId, categoryId, subcategoryId) => {
  try {
    const token = localStorage.getItem("access_token");
    console.log("🔍 Fetching SLA for:", { entityId, categoryId, subcategoryId });

    const response = await api.get("tickets/ticket-slas/", {
      params: {
        entity_id: entityId,
        category_id: categoryId,
        subcategory_id: subcategoryId || "", // allow empty subcategory
      },
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("✅ Raw SLA Response from API:", response.data);

    // ✅ Handle both object and array responses
    const data = response.data;
    if (!data) return {};

    if (Array.isArray(data)) {
      return data.length > 0 ? data[0] : {};
    }

    if (typeof data === "object" && Object.keys(data).length > 0) {
      return data; // directly return the object
    }

    return {};
  } catch (err) {
    console.error("❌ Failed to fetch SLA:", err.response?.data || err.message);
    return {};
  }
};

// --- SLA by entity/category/subcategory ---
// export const fetchSLAAPI = async (entityId, categoryId, subcategoryId) => {
//   try {
//     const token = localStorage.getItem("access_token");
//     const response = await api.get("tickets/ticket-slas/", {
//       params: {
//         entity_id: entityId,
//         category_id: categoryId,
//         subcategory_id: subcategoryId,
//       },
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     console.log("summaaaaaa",response.data)
//     // return first SLA object if array exists, otherwise empty object
//     return response.data && response.data.length > 0 ? response.data[0] : {};
//   } catch (err) {
//     console.error("Failed to fetch SLA:", err.response?.data || err.message);
//     return {};
//   }
// };


// export const fetchSLAAPI = async (entityId, categoryId, subcategoryId) => {
//   try {
//     const token = localStorage.getItem("access_token");
//     const response = await api.get(
//       `tickets/sla/?entity_id=${entityId}&category_id=${categoryId}&subcategory_id=${subcategoryId}`,
//       { headers: { Authorization: `Bearer ${token}` } }
//     );
//     return response.data;
//   } catch (err) {
//     console.error("Failed to fetch SLA:", err.response?.data || err.message);
//     throw err;
//   }
// };

// --- Create or Update Category ---
export const saveCategoryAPI = async (data, id = null) => {
  try {
    const token = localStorage.getItem("access_token");
    const url = id ? `tickets/ticket-categories/${id}/` : "tickets/ticket-categories/";
    const method = id ? api.put : api.post;

    const response = await method(url, data, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (err) {
    console.error("Failed to save category:", err.response?.data || err.message);
    throw err;
  }
};


// Departments
export const fetchDepartmentsAPI = async (entityId = null) => {
  try {
    const token = localStorage.getItem("access_token");
    const url = entityId ? `tickets/departments/?entity_id=${entityId}` : "tickets/departments/";
    const res = await api.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    console.error("Failed to fetch departments:", err.response?.data || err.message);
    throw err;
  }
};

// export const fetchDepartmentsAPI = async () => {
//   const token = localStorage.getItem("access_token");
//   const res = await api.get("tickets/departments/", {
//     headers: { Authorization: `Bearer ${token}` },
//   });
//   return res.data;
// };

export const saveDepartmentAPI = async (data, id = null) => {
  const token = localStorage.getItem("access_token");
  if (id) {
    const res = await api.put(`tickets/departments/${id}/`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } else {
    const res = await api.post("tickets/departments/", data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  }
};

export const deleteDepartmentAPI = async (id) => {
  const token = localStorage.getItem("access_token");
  const res = await api.delete(`tickets/departments/${id}/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

const getToken = () => localStorage.getItem("access_token");
// Users
export const fetchUsersAPI = async () => {
  const token = getToken();
  const res = await api.get("tickets/users/", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const saveUserAPI = async (data, id = null) => {
  const token = getToken();
  if (id) {
    const res = await api.put(`tickets/users/${id}/`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } else {
    const res = await api.post("tickets/users/", data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  }
};


// Supervisors / HODs
export const fetchSupervisorsAPI = async () => {
  const token = getToken();
  const res = await api.get("tickets/hod-users/", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};


// --- Email Templates ---
export const fetchEmailTemplatesAPI = async () => {
  try {
    const token = localStorage.getItem("access_token");
    const res = await api.get("tickets/ticket-email-templates/", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    console.error("Failed to fetch email templates:", err.response?.data || err.message);
    throw err;
  }
};

export const saveEmailTemplateAPI = async (data, id = null) => {
  try {
    const token = localStorage.getItem("access_token");
    const url = id
      ? `tickets/ticket-email-templates/${id}/`
      : "tickets/ticket-email-templates/";
    const method = id ? api.put : api.post;

    const res = await method(url, data, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.data;
  } catch (err) {
    console.error("Failed to save email template:", err.response?.data || err.message);
    throw err;
  }
};

export const deleteEmailTemplateAPI = async (id) => {
  try {
    const token = localStorage.getItem("access_token");
    const res = await api.delete(`tickets/ticket-email-templates/${id}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    console.error("Failed to delete email template:", err.response?.data || err.message);
    throw err;
  }
};

// Get all holidays
export const fetchHolidaysAPI = async ({ entityId = null, departmentId = null, locationId = null } = {}) => {
  try {
    const token = localStorage.getItem("access_token");
    const params = {};
    if (entityId) params.entity_id = entityId;
    if (departmentId) params.department_id = departmentId;
    if (locationId) params.location_id = locationId;

    const response = await api.get("tickets/holidays/", {
      headers: { Authorization: `Bearer ${token}` },
      params,
    });

    return response.data; // ✅ return only the array
  } catch (error) {
    console.error("Error fetching holidays:", error.response?.data || error.message);
    throw error; // so component can catch and show toast
  }
};
// Create new holiday
export const createHolidayAPI = async (holidayData) => {
  try {
    const token = localStorage.getItem("access_token");
    const response = await api.post("tickets/holidays/", holidayData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error creating holiday:", error.response?.data || error.message);
    return { success: false, error: error.response?.data?.detail || error.message };
  }
};

// Update holiday
export const updateHolidayAPI = async (id, holidayData) => {
  try {
    const token = localStorage.getItem("access_token");
    const response = await api.put(`tickets/holidays/${id}/`, holidayData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error updating holiday:", error.response?.data || error.message);
    return { success: false, error: error.response?.data?.detail || error.message };
  }
};

// Delete holiday
export const deleteHolidayAPI = async (id) => {
  try {
    const token = localStorage.getItem("access_token");
    const response = await api.delete(`tickets/holidays/${id}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error deleting holiday:", error.response?.data || error.message);
    return { success: false, error: error.response?.data?.detail || error.message };
  }
};


// Updated service function to accept and pass filter params as query parameters
export const ticketcounts = async (params = {}) => {
  try {
    const token = localStorage.getItem("access_token");
    const response = await api.get(`tickets/ticket/count/`, {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        start_date: params.start_date,
        end_date: params.end_date,
        search: params.search || '',
      },
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error fetching ticket counts:", error.response?.data || error.message);
    return { success: false, error: error.response?.data?.detail || error.message };
  }
};
// service/service.jsx - Add these new functions (or update if existing)
// Assuming 'api' is your Axios instance imported/configured here

export const fetchUserStatus = async (params = {}) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("No access token found");
    }

    const response = await api.get(`tickets/user-status/`, {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        start_date: params.start_date || '',
        end_date: params.end_date || '',
        search: params.search || '',
        priority: params.priority || '',
      },
      timeout: 30000, // 30s timeout
    });

    return { success: true, data: response.data };
  } catch (error) {
    let errorMessage = error.response?.data?.detail || error.message;
    
    if (error.code === 'ECONNABORTED') {
      errorMessage = 'Request timed out after 30 seconds. Please check your connection or try again later.';
    } else if (error.response?.status === 401) {
      errorMessage = 'Unauthorized. Please log in again.';
      // Optional: localStorage.removeItem("access_token");
    }

    console.error("Error fetching user status:", {
      message: errorMessage,
      params,
      status: error.response?.status,
      fullError: error,
    });

    return { success: false, error: errorMessage };
  }
};

export const fetchWatcherStatus = async (params = {}) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("No access token found");
    }

    const response = await api.get(`tickets/watcher-status/`, {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        start_date: params.start_date || '',
        end_date: params.end_date || '',
        search: params.search || '',
        priority: params.priority || '',
      },
      timeout: 30000, // 30s timeout
    });

    return { success: true, data: response.data };
  } catch (error) {
    let errorMessage = error.response?.data?.detail || error.message;
    
    if (error.code === 'ECONNABORTED') {
      errorMessage = 'Request timed out after 30 seconds. Please check your connection or try again later.';
    } else if (error.response?.status === 401) {
      errorMessage = 'Unauthorized. Please log in again.';
      // Optional: localStorage.removeItem("access_token");
    }

    console.error("Error fetching watcher status:", {
      message: errorMessage,
      params,
      status: error.response?.status,
      fullError: error,
    });

    return { success: false, error: errorMessage };
  }
};

export const fetchOverallStatus = async (params = {}) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("No access token found");
    }

    const response = await api.get(`tickets/overall-status/`, {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        start_date: params.start_date || '',
        end_date: params.end_date || '',
        search: params.search || '',
        priority: params.priority || '',
      },
      timeout: 30000, // 30s timeout
    });

    return { success: true, data: response.data };
  } catch (error) {
    let errorMessage = error.response?.data?.detail || error.message;
    
    if (error.code === 'ECONNABORTED') {
      errorMessage = 'Request timed out after 30 seconds. Please check your connection or try again later.';
    } else if (error.response?.status === 401) {
      errorMessage = 'Unauthorized. Please log in again.';
      // Optional: localStorage.removeItem("access_token");
    }

    console.error("Error fetching overall status:", {
      message: errorMessage,
      params,
      status: error.response?.status,
      fullError: error,
    });

    return { success: false, error: errorMessage };
  }
};

export const fetchHodsusers = async () => {
  try {
    const token = localStorage.getItem("access_token");
    const res = await api.get("tickets/hod-users/", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    console.error("Failed to fetch email templates:", err.response?.data || err.message);
    throw err;
  }
};

export const fetchCeodashboard = async () => {
    try {
        const token = localStorage.getItem("access_token");
        const res = await api.get("tickets/ceo-dashboard/", {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    } catch (err) {
        console.error("Failed to fetch CEO dashboard data:", err.response?.data || err.message);
        throw err;
    }
};

// get platform
export const fetchPlatforms = async (entityId = null) => {
  try {
    const token = localStorage.getItem("access_token");

    const url = entityId 
      ? `tickets/platform/?entity_id=${entityId}` 
      : "tickets/platform/";

    const response = await api.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Failed to fetch platforms:", error.response?.data || error.message);
    toast.error("Failed to load platforms");
    throw error;
  }
};
export const fetchMessages = async () => { 
    try {
        const token = localStorage.getItem("access_token");
         const userData = JSON.parse(localStorage.getItem("user")); // get logged-in user
    const user = userData?.id;
        const res = await api.get(`tickets/users/${user}/messages/`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    } catch (err) {
        console.error("Failed to fetch messages:", err.response?.data || err.message);
        throw err;
    }
};
// export const fetchAdminMessages = async (ticketId) => { 
//     try {
//         const token = localStorage.getItem("access_token");
//         const userData = JSON.parse(localStorage.getItem("user"));
//         const userId = userData?.id;

//         if (!userId) {
//             throw new Error("User not found in localStorage");
//         }

//         if (!ticketId) {
//             throw new Error("ticketId is required");
//         }

//         const res = await api.get(`tickets/users/${userId}/messages/${ticketId}/`, {
//             headers: { 
//                 Authorization: `Bearer ${token}` 
//             },
//         });

//         return res.data;
//     } catch (err) {
//         console.error("Failed to fetch messages:", err.response?.data || err.message);
//         throw err;
//     }
// };
export const fetchAdminMessages = async (ticketId) => { 
    try {
        const token = localStorage.getItem("access_token");

        if (!token) {
            throw new Error("No access token found");
        }
 
        if (!ticketId) {
            throw new Error("ticketId is required");
        }

        // Correct admin endpoint using integer PK
        const res = await api.get(`tickets/admin/ticket-messages/${ticketId}/`, {
            headers: { 
                Authorization: `Bearer ${token}` 
            },
        });

        // The view returns { messages: [...] }
        return res.data.messages || res.data;
    } catch (err) {
        console.error("Failed to fetch admin messages:", err.response?.data || err.message);
        throw err;
    }
};

// export const fetchAdminMessages = async (ticket_no, user) => {
//     try {
//         const response = await fetch(`tickets/${user}/ticket/${ticket_no}/`);
//         const data = await response.json();
//         return data; // Already filtered by ticket_no and user involvement
//     } catch (err) {
//         console.error(err);
//         return [];
//     }
// };
export const sendMessage = async ({ receiver, ticket_no, message, protected: isProtected = false }) => {
  try {
    const token = localStorage.getItem("access_token");
    const userData = JSON.parse(localStorage.getItem("user")); // get logged-in user
    const sender = userData?.id;

    if (!sender) throw new Error("Sender not found. User not logged in.");

    const res = await api.post(
      `tickets/users/${sender}/messages/`, // API endpoint expects sender ID
      {
        sender,
        receiver,
        ticket_no,
        message,
        protected: Boolean(isProtected),
      },
      {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res.data;
  } catch (err) {
    console.error("Failed to send message:", err.response?.data || err.message);
    throw err;
  }
};

// In approverticketApi.js
export const fetchApproverTickets = async (params = {}) => {
  const token = localStorage.getItem("access_token");
  const userData = JSON.parse(localStorage.getItem("user"));
  const user = userData?.id;
  const response = await api.get(`tickets/approver/count/`, {
    headers: { Authorization: `Bearer ${token}` },
    params: {
        start_date: params.start_date,
        end_date: params.end_date,
        search: params.search || '',
      },
  });
 console.log("response :",response);
 
  if (response.status != 200) throw new Error("Failed to fetch approver tickets");
  return response.data;
};


export const fetchCategorySLA = async (entityId = null) => {
  const token = localStorage.getItem("access_token");
 
  // If entityId is not provided, default to the current selected entity from localStorage
  if (entityId === null) {
    try {
      const userData = JSON.parse(localStorage.getItem("user_data") || "{}");
      const selectedRoleMapping = JSON.parse(localStorage.getItem("selected_role_mapping") || "{}");
     
      // Prefer selected_role_mapping.entity_id if available, fallback to user_data.entity_data.id
      entityId = selectedRoleMapping.entity_id || (userData.entity_data ? userData.entity_data.id : null);
     
      if (entityId === null) {
        throw new Error("No entity ID found in localStorage");
      }
    } catch (error) {
      console.error("Error parsing localStorage for entity ID:", error);
      throw new Error("Failed to determine current entity ID");
    }
  }
 
  let url = 'tickets/categories-full/';
  url += `?entity_id=${entityId}`;
 
  const response = await api.get(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
 
  console.log("response :", response);
 
  if (response.status !== 200) throw new Error("Failed to fetch category sla");
 
  return response.data;
}

// IN AdminDashboardApi helpdesk count

export const fetchAdminDashboardCount = async (params = {}) => {
  try {
    const token = localStorage.getItem('access_token'); // Retrieve token from localStorage
    if (!token) {
      throw new Error('Authentication token not found. Please log in again.');
    }

    const response = await api.get(`tickets/admindashboard/count/`, {
      params,
      headers: { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch admin dashboard count:`, error.response?.data || error.message);
    throw error;
  }
};

export const fetchFixTypes = async (params = {}) => {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error('Authentication token not found. Please log in again.');
    }

    const response = await api.get(`tickets/fix-types/`, {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error(`Failed to fetch fix types:`, error.response?.data || error.message);
    throw error;
  }
};


// export const fetchAdminTickets = async (params = {}) => {
//   const token = localStorage.getItem("access_token");
//   const userData = JSON.parse(localStorage.getItem("user"));
//   const user = userData?.id;
//   const response = await api.get(`tickets/admin/count/?user=${user}`, {
//     headers: { Authorization: `Bearer ${token}` },
    
//   });
//  console.log("response :",response);
 
//   if (response.status != 200) throw new Error("Failed to fetch approver tickets");
//   return response.data;
// };
// export const fetchRolePermissions = async () => {
//   try {
//     const response = await fetch('/api/role-permissions/'); // Adjust URL
//     if (!response.ok) throw new Error('Failed to fetch permissions');
//     return await response.json();
//   } catch (error) {
//     console.error('Error fetching role permissions:', error);
//     throw error;
//   }
// };

// // Save/update role permission (POST for grant, PUT/DELETE for revoke)
// export const saveRolePermission = async (payload) => {
//   try {
//     const url = payload.is_active 
//       ? '/api/role-permissions/'  // POST for new/grant
//       : `/api/role-permissions/${payload.id || ''}`; // PUT or DELETE; assume id from response if needed
//     const method = payload.is_active ? 'POST' : (payload.id ? 'PUT' : 'DELETE');
    
//     const response = await fetch(url, {
//       method,
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(payload)
//     });
//     if (!response.ok) throw new Error('Failed to save permission');
//     return response.json();
//   } catch (error) {
//     console.error('Error saving role permission:', error);
//     throw error;
//   }
// };


// Keep existing fetchTickets if it handles listing based on section/status/params
// (Assuming it does; adjust endpoint if needed, e.g., api.get(`tickets/list/`, { params: { section, status, ... } }))
// -----------------------------
// 🎯 Holiday API Services
// -----------------------------

// // Get all holidays
// export const fetchHolidaysAPI = async () => {
//   try {
//     const response = await api.get("tickets/holidays/");
//     return { success: true, data: response.data };
//   } catch (error) {
//     console.error("Error fetching holidays:", error.response?.data || error.message);
//     return { success: false, error: error.response?.data?.detail || error.message };
//   }
// };

// // Create a new holiday
// export const createHolidayAPI = async (holidayData) => {
//   try {
//     const response = await api.post("tickets/holidays/", holidayData);
//     return { success: true, data: response.data };
//   } catch (error) {
//     console.error("Error creating holiday:", error.response?.data || error.message);
//     return { success: false, error: error.response?.data?.detail || error.message };
//   }
// };

// // Update a holiday
// export const updateHolidayAPI = async (id, holidayData) => {
//   try {
//     const response = await api.put(`tickets/holidays/${id}/`, holidayData);
//     return { success: true, data: response.data };
//   } catch (error) {
//     console.error("Error updating holiday:", error.response?.data || error.message);
//     return { success: false, error: error.response?.data?.detail || error.message };
//   }
// };

// // Delete a holiday
// export const deleteHolidayAPI = async (id) => {
//   try {
//     const response = await api.delete(`tickets/holidays/${id}/`);
//     return { success: true, data: response.data };
//   } catch (error) {
//     console.error("Error deleting holiday:", error.response?.data || error.message);
//     return { success: false, error: error.response?.data?.detail || error.message };
//   }
// };
