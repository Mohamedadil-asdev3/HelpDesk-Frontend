// import { Grid, Card, CardContent, Typography } from "@mui/material";
// import Chart from "react-apexcharts";

// const AdminGraphData = ({ graphData }) => {

//     const defaultTicketsEvolution = {
//         series: [
//             {
//                 name: "Tickets",
//                 data: [30, 45, 40, 60, 50, 80, 90, 80, 40, 50, 20, 70],
//             },
//         ],
//         options: {
//             chart: { type: "line", toolbar: { show: false } },
//             xaxis: {
//                 categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
//             },
//             stroke: { curve: "smooth" },
//             colors: ["#4F46E5"],
//         },
//     };

//     const defaultOpenedTicketsStatus = {
//         series: [0, 0, 0, 0],
//         options: {
//             labels: ["Pending", "Approved", "Rejected", "On Hold"],
//             chart: { type: "pie" },
//             colors: ["#2196F3", "#4CAF50", "#f44336", "#FFC107"],
//             legend: { position: "bottom" },
//         },
//     };

//     const defaultSolvingPeriod = {
//         series: [5, 10, 20, 8, 11],
//         options: {
//             labels: ["<1 day", "1-2 days", "3-5 days", "6-10 days", ">10 days"],
//             chart: { type: "donut" },
//             colors: ["#4CAF50", "#FFEB3B", "#FF9800", "#F44336", "#9C27B0"],
//             legend: { position: "bottom" },
//         },
//     };

//     const defaultLast7days = {
//         series: [
//             {
//                 name: "Tickets",
//                 data: [12, 18, 25, 15, 20, 30, 28],
//             },
//         ],
//         options: {
//             chart: { type: "bar", toolbar: { show: false } },
//             xaxis: {
//                 categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
//             },
//             plotOptions: { bar: { borderRadius: 5 } },
//             colors: ["#6366F1"],
//         },
//     };

//     const defaultOpenTicketsAge = {
//         series: [
//             {
//                 name: "Request",
//                 data: [6, 5, 4, 3, 4, 3, 2, 1],
//             },
//             {
//                 name: "Incident",
//                 data: [0, 0, 0, 0, 0, 0, 0, 0],
//             },
//         ],
//         options: {
//             chart: { type: "bar", toolbar: { show: false } },
//             xaxis: {
//                 categories: ["<1 day", "1 day", "2 days", "3 days", "4 days", "5 days", "6 days", "7+ days"],
//             },
//             plotOptions: { bar: { borderRadius: 5, horizontal: true } },
//             colors: ["#2196F3", "#000000"],
//         },
//     };

//     const ticketsEvolution = graphData?.ticketsEvolution || defaultTicketsEvolution;
//     const openedTicketsStatus = graphData?.openedTicketsStatus || defaultOpenedTicketsStatus;
//     const solvingPeriod = graphData?.solvingPeriod || defaultSolvingPeriod;
//     const last7days = graphData?.last7days || defaultLast7days;
//     const openTicketsAge = graphData?.openTicketsAge || defaultOpenTicketsAge;

//     return (
//         <Grid container spacing={2}>
//             <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
//                 <Card>
//                     <CardContent>
//                         <Typography variant="h6" mb={2}>Tickets Evolution</Typography>
//                         <Chart
//                             options={ticketsEvolution.options}
//                             series={ticketsEvolution.series}
//                             type="line"
//                             height={400}
//                         />
//                     </CardContent>
//                 </Card>
//             </Grid>
//             <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6 }}>
//                 <Card>
//                     <CardContent>
//                         <Typography variant="h6" mb={2}>Opened Tickets by Status</Typography>
//                         <Chart
//                             options={openedTicketsStatus.options}
//                             series={openedTicketsStatus.series}
//                             type="pie"
//                             height={400}
//                         />
//                     </CardContent>
//                 </Card>
//             </Grid>
//             <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6 }}>
//                 <Card>
//                     <CardContent>
//                         <Typography variant="h6" mb={2}>Ticket Solving Period</Typography>
//                         <Chart
//                             options={solvingPeriod.options}
//                             series={solvingPeriod.series}
//                             type="donut"
//                             height={400}
//                         />
//                     </CardContent>
//                 </Card>
//             </Grid>
//             <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6 }}>
//                 <Card>
//                     <CardContent>
//                         <Typography variant="h6" mb={2}>Tickets - Last 7 Days</Typography>
//                         <Chart
//                             options={last7days.options}
//                             series={last7days.series}
//                             type="bar"
//                             height={400}
//                         />
//                     </CardContent>
//                 </Card>
//             </Grid>
//             <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6 }}>
//                 <Card>
//                     <CardContent>
//                         <Typography variant="h6" mb={2}>Open Tickets Age</Typography>
//                         <Chart
//                             options={openTicketsAge.options}
//                             series={openTicketsAge.series}
//                             type="bar"
//                             height={400}
//                         />
//                     </CardContent>
//                 </Card>
//             </Grid>
//         </Grid>
//     );
// };

// export default AdminGraphData;

import { Grid, Card, CardContent, Typography } from "@mui/material";
import Chart from "react-apexcharts";

const AdminGraphData = ({ graphData }) => {
    // Fallback to hardcoded if no data passed (updated to align with provided code structure)
    const defaultTicketsEvolution = {
        series: [
            {
                name: "Tickets",
                data: [30, 45, 40, 60, 50, 80, 90, 80, 40, 50, 20, 70],
            },
        ],
        options: {
            chart: { type: "line", toolbar: { show: false } },
            xaxis: {
                categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            },
            stroke: { curve: "smooth" },
            colors: ["#4F46E5"],
        },
    };

    const defaultOpenedTicketsStatus = {
        series: [0, 0, 0, 0],
        options: {
            labels: ["Pending", "Approved", "Rejected", "On Hold"],
            chart: { type: "pie" },
            colors: ["#2196F3", "#4CAF50", "#f44336", "#FFC107"],
            legend: { position: "bottom" },
        },
    };

    const defaultSolvingPeriod = {
        series: [5, 10, 20, 8, 11],
        options: {
            labels: ["<1 day", "1-2 days", "3-5 days", "6-10 days", ">10 days"],
            chart: { type: "donut" },
            colors: ["#4CAF50", "#FFEB3B", "#FF9800", "#F44336", "#9C27B0"],
            legend: { position: "bottom" },
        },
    };

    const defaultLast7days = {
        series: [
            {
                name: "Tickets",
                data: [12, 18, 25, 15, 20, 30, 28],
            },
        ],
        options: {
            chart: { type: "bar", toolbar: { show: false } },
            xaxis: {
                categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            },
            plotOptions: { bar: { borderRadius: 5 } },
            colors: ["#6366F1"],
        },
    };

    const defaultOpenTicketsAge = {
        series: [
            {
                name: "Request",
                data: [6, 5, 4, 3, 4, 3, 2, 1],
            },
            {
                name: "Incident",
                data: [0, 0, 0, 0, 0, 0, 0, 0],
            },
        ],
        options: {
            chart: { type: "bar", toolbar: { show: false } },
            xaxis: {
                categories: ["<1 day", "1 day", "2 days", "3 days", "4 days", "5 days", "6 days", "7+ days"],
            },
            plotOptions: { bar: { borderRadius: 5, horizontal: true } },
            colors: ["#2196F3", "#000000"],
        },
    };

    const ticketsEvolution = graphData?.ticketsEvolution || defaultTicketsEvolution;
    const openedTicketsStatus = graphData?.openedTicketsStatus || defaultOpenedTicketsStatus;
    const solvingPeriod = graphData?.solvingPeriod || defaultSolvingPeriod;
    const last7days = graphData?.last7days || defaultLast7days;
    const openTicketsAge = graphData?.openTicketsAge || defaultOpenTicketsAge;

    return (
        <Grid container spacing={2}>
           
            <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6 }}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" mb={2}>Opened Tickets by Status</Typography>
                        <Chart
                            options={openedTicketsStatus.options}
                            series={openedTicketsStatus.series}
                            type="pie"
                            height={400}
                        />
                    </CardContent>
                </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6 }}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" mb={2}>Ticket Solving Period</Typography>
                        <Chart
                            options={solvingPeriod.options}
                            series={solvingPeriod.series}
                            type="donut"
                            height={400}
                        />
                    </CardContent>
                </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6 }}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" mb={2}>Tickets - Last 7 Days</Typography>
                        <Chart
                            options={last7days.options}
                            series={last7days.series}
                            type="bar"
                            height={400}
                        />
                    </CardContent>
                </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6 }}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" mb={2}>Open Tickets Age</Typography>
                        <Chart
                            options={openTicketsAge.options}
                            series={openTicketsAge.series}
                            type="bar"
                            height={400}
                        />
                    </CardContent>
                </Card>
            </Grid>
             <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" mb={2}>Tickets Evolution</Typography>
                        <Chart
                            options={ticketsEvolution.options}
                            series={ticketsEvolution.series}
                            type="line"
                            height={400}
                        />
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
        
    );
};

export default AdminGraphData;