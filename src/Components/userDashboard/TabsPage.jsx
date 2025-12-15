import { Box, Tab, useMediaQuery, useTheme } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { useState } from "react";
import RequestTabs from "./RequestTabs";
import NotifiedTabs from "./NotifiedTabs";
import ApproverTabs from "./ApproverTabs";

const TabsPage = ({ DashboardData }) => {
    console.log("data", DashboardData)

    const userStatus = DashboardData?.user_stats || '';
    console.log("user", userStatus);
    const approverStatus = DashboardData?.approver_stats || '';
    console.log("approver", approverStatus)
    const watcherStatus = DashboardData?.watcher_stats || '';
    console.log('watcher', watcherStatus);

    const [value, setValue] = useState("1");

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const handleChange = (_, newValue) => {
        setValue(newValue);
    };

    const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));


    return (
        <Box sx={{ width: "100%" }}>
            <TabContext value={value}>
                <Box >
                    <TabList
                        onChange={handleChange}
                        variant={isMobile || isTablet ? "scrollable" : "standard"}
                        scrollButtons={isMobile || isTablet ? "auto" : false}
                        allowScrollButtonsMobile
                        centered={!isMobile && !isTablet}
                        sx={{
                            "& .MuiTabs-flexContainer": {
                                gap: isMobile ? 1 : 4,
                            },
                            "& .MuiTab-root": {
                                fontSize: isMobile ? 12 : 16,
                                fontWeight: 600,
                                textTransform: "none",
                                paddingX: isMobile ? 1 : 4,
                                borderRadius: 3,
                                whiteSpace: "nowrap",
                            },
                            "& .Mui-selected": {
                                background: "linear-gradient(135deg, #667eea, #764ba2)",
                                color: "#fff !important",
                                boxShadow: "0px 3px 12px rgba(0,0,0,0.2)",
                            },
                        }}
                    >
                        <Tab label="MY REQUEST DASHBOARD" value="1" />
                        <Tab label="MONITORED / NOTIFIED REQUESTS" value="2" />
                        <Tab label="APPROVER ACTION CENTER" value="3" />
                    </TabList>
                </Box>
                <TabPanel value="1">
                    <RequestTabs userStatus={userStatus} />
                </TabPanel>
                <TabPanel value="2">
                    <NotifiedTabs watcherStatus={watcherStatus} />
                </TabPanel>
                <TabPanel value="3">
                    <ApproverTabs approverStatus={approverStatus} />
                </TabPanel>
            </TabContext>
        </Box>
    );
};

export default TabsPage;