import React, { useState } from "react";
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, IconButton, Box, Toolbar, Typography, Tooltip } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import CategoryIcon from "@mui/icons-material/Category";
import GroupIcon from "@mui/icons-material/Group";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ApartmentIcon from "@mui/icons-material/Apartment";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import MailIcon from "@mui/icons-material/Mail";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate, useLocation, NavLink } from "react-router-dom";

const drawerWidth = 240;
const collapsedWidth = 70;

const SIDEBAR_WIDTH = 240;
const COLLAPSE_WIDTH = 70;

const Sidebar = ({ open, toggleSidebar }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { name: "Entity", icon: <ApartmentIcon />, path: "/admin/entity" },
        { name: "Location", icon: <LocationOnIcon />, path: "/admin/location" },
        { name: "Users", icon: <GroupIcon />, path: "/admin/user" },
        { name: "Categories", icon: <CategoryIcon />, path: "/admin/category" },
        { name: "Watcher Group", icon: <GroupIcon />, path: "/admin/watcher" },
        { name: "Department", icon: <ApartmentIcon />, path: "/admin/department" },
        { name: "Role", icon: <AdminPanelSettingsIcon />, path: "/admin/role" },
        { name: "Holiday Calendar", icon: <CalendarMonthIcon />, path: "/admin/calender" },
        { name: "Email Template", icon: <MailIcon />, path: "/admin/template" },
    ];

    return (
        <>
            <Drawer
                variant="permanent"
                PaperProps={{
                    sx: {
                        width: open ? SIDEBAR_WIDTH : COLLAPSE_WIDTH,
                        transition: "0.3s",
                        overflowX: "hidden",
                        height: 665,
                        my: 9.2

                    },
                }}
            >
                {/* Top Header */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: open ? "space-between" : "center",
                        alignItems: "center",
                        p: 2,
                    }}
                >
                    {open ? (
                        <Box sx={{ fontSize: 18, fontWeight: "bold" }}>Admin Panel</Box>
                    ) : null}

                    <IconButton onClick={toggleSidebar} >
                        {open ? <CloseIcon /> : <MenuIcon />}
                    </IconButton>
                </Box>

                {/* Menu List */}
                <List>
                    {menuItems.map((item, index) => (
                        <NavLink
                            to={item.path}
                            key={index}
                            style={{ textDecoration: "none" }}
                        >
                            {({ isActive }) => (
                                <Tooltip title={!open ? item.name : ""} placement="right">
                                    <ListItemButton
                                        sx={{
                                            py: 2,
                                            px: 3,
                                            justifyContent: open ? "flex-start" : "center",
                                            bgcolor: isActive ? "#1976d2" : "transparent",
                                            color: isActive ? "#fff" : "#000",
                                            borderRadius: 1,
                                            "&:hover": {
                                                bgcolor: isActive ? "#1565c0" : "#f0f0f0"
                                            }
                                        }}
                                    >
                                        <ListItemIcon
                                            sx={{
                                                minWidth: 0,
                                                mr: open ? 2 : "auto",
                                                justifyContent: "center",
                                                color: isActive ? "#fff" : "#000"
                                            }}
                                        >
                                            {item.icon}
                                        </ListItemIcon>

                                        {open && (
                                            <ListItemText
                                                primary={item.name}
                                                sx={{
                                                    color: isActive ? "#fff" : "#000"         // WHITE TEXT
                                                }}
                                            />
                                        )}
                                    </ListItemButton>
                                </Tooltip>
                            )}
                        </NavLink>
                    ))}
                </List>
            </Drawer>
        </>
    );
};

export default Sidebar;

