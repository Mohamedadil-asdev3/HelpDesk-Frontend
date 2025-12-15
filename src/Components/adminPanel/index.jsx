import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import { useState } from "react";
import Sidebar from "../Sidebar";
import Header from "../Header";
import Footer from "../Footer";

const HEADER_HEIGHT = 64;
const FOOTER_HEIGHT = 55;
const SIDEBAR_WIDTH = 240;
const SIDEBAR_COLLAPSED = 70;

const AdminPanel = () => {
    const [open, setOpen] = useState(true);
    const toggleSidebar = () => setOpen(!open);

    return (
        <Box>
            <Box sx={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: HEADER_HEIGHT,
                zIndex: 1200,
                bgcolor: "#fff",
            }}>
                <Header />
            </Box>
            <Box
                sx={{
                    position: "fixed",
                    top: HEADER_HEIGHT,
                    left: 0,
                    height: `calc(100vh - ${HEADER_HEIGHT + FOOTER_HEIGHT}px)`,
                    width: open ? SIDEBAR_WIDTH : SIDEBAR_COLLAPSED,
                    transition: "0.3s",
                    bgcolor: "#fff",
                    zIndex: 1100,
                    borderRight: "1px solid #e0e0e0",
                }}
            >
                <Sidebar open={open} toggleSidebar={toggleSidebar} />
            </Box>
            {/* <Box
                sx={{
                    ml: open ? "240px" : "70px",
                    mt: 9,
                    p: 1,
                    transition: "0.3s",
                }}
            >
                <Outlet />
            </Box> */}
            <Box
                sx={{
                    ml: open ? "240px" : "70px",
                    mt: `${HEADER_HEIGHT}px`,
                    height: `calc(100vh - ${HEADER_HEIGHT + FOOTER_HEIGHT}px)`,
                    overflowY: "auto",
                    p: 2,
                    transition: "0.3s",
                    backgroundColor: "#f9f9f9",

                    /* Smooth Scroll */
                    scrollBehavior: "smooth",

                    /* Hide Scrollbar (Chrome, Safari, Edge) */
                    "&::-webkit-scrollbar": {
                        width: "0px",
                        height: "0px",
                    },

                    /* Hide Scrollbar (Firefox) */
                    scrollbarWidth: "none",

                    /* Hide Scrollbar (IE, old Edge) */
                    msOverflowStyle: "none",
                }}
            >
                <Outlet />
            </Box>
            <Box sx={{
                position: "fixed",
                bottom: -12,
                left: 0,
                width: "100%",
                height: FOOTER_HEIGHT,
                zIndex: 1100,
                bgcolor: "#fff",
                boxShadow: 3,
            }}>
                <Footer />
            </Box>
        </Box>
    );
};

export default AdminPanel;