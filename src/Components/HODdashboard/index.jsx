import { useState, useEffect } from "react";
import { Box, Grid } from "@mui/material"
import GraphData from "./GraphData"
import HODCardData from "./CardData";
import { fetchHodsusers } from "../../Api";
import HodHeader from "./HodHeader";

const HODDashboard = () => {
    const [hodData, setHodData] = useState(null);

    const getHodData = async () => {
        try {
            const data = await fetchHodsusers();
            setHodData(data[0]);
        } catch (error) {
            console.error("Error fetching HOD data:", error);
        }
    };

    useEffect(() => {
        getHodData();
    }, []);

    return (
        <Box sx={{ mb: 2 }}>
            <Grid container spacing={3}>
                <Grid size={12}>
                    <HodHeader />
                </Grid>
                <Grid size={12}>
                    <HODCardData data={hodData} />
                </Grid>
                <Grid size={12}>
                    <GraphData data={hodData} />
                </Grid>
            </Grid>
        </Box>
    )
}

export default HODDashboard;