import { Card, CardContent, Grid, Typography } from "@mui/material";
import Chart from "react-apexcharts";

const GraphData = ({ data }) => {
    if (!data) return null;

    // All approvers: HOD + department users
    const allUsers = [data, ...(data.department_users || [])];

    // Helper to extract name
    const getUserName = (user) => {
        const fullName = user.firstname || user.name || 'Unknown';
        return fullName.split('/')[0].trim();
    };

    // --- Department Breakdown (HOD aggregates) ---
    const departmentData = Object.entries(data.department_breakdown || {}).map(([dept, stats]) => ({
        dept,
        values: [
            stats.pending ?? 0,
            stats.approved ?? 0,
            stats.rejected ?? 0
        ],
    }));

    // --- Priority Breakdown (HOD aggregates) ---
    const priorityData = Object.entries(data.priority_breakdown || {}).map(([priority, stats]) => ({
        priority,
        values: [
            stats.pending ?? 0,
            stats.approved ?? 0,
            stats.rejected ?? 0
        ],
    }));

    // --- SLA Breached Data (all users) ---
    const slaBreachedData = allUsers.map(user => ({
        name: getUserName(user),
        value: user.sla_breached_count ?? 0
    }));

    // --- Response Time Data (all users) ---
    const responseTimeData = allUsers.map(user => ({
        name: getUserName(user),
        time: user.average_response_time ?? 0
    }));

    // --- CHARTS ---
    const DepartmentChart = () => {
        const categories = departmentData.length ? departmentData.map(d => d.dept) : ["N/A"];
        const series = [
            { name: "Pending", data: departmentData.length ? departmentData.map(d => d.values[0] ?? 0) : [0] },
            { name: "Approved", data: departmentData.length ? departmentData.map(d => d.values[1] ?? 0) : [0] },
            { name: "Rejected", data: departmentData.length ? departmentData.map(d => d.values[2] ?? 0) : [0] }
        ];

        return (
            <Chart
                type="bar"
                height={350}
                series={series}
                options={{
                    chart: { stacked: true },
                    plotOptions: { bar: { horizontal: false, borderRadius: 4 } },
                    colors: ['#ffd966', '#90EE90', '#fd7e14'],
                    xaxis: {
                        categories,
                        title: { text: "Departments" }
                    },
                    yaxis: {
                        title: { text: "Ticket Counts" }
                    },
                    title: { text: "Tickets by Department", align: "center" },
                    dataLabels: { enabled: true },
                }}
            />
        );
    };

    const PriorityChart = () => {
        const categories = priorityData.length ? priorityData.map(d => d.priority) : ["N/A"];
        const series = [
            { name: "Pending", data: priorityData.length ? priorityData.map(d => d.values[0] ?? 0) : [0] },
            { name: "Approved", data: priorityData.length ? priorityData.map(d => d.values[1] ?? 0) : [0] },
            { name: "Rejected", data: priorityData.length ? priorityData.map(d => d.values[2] ?? 0) : [0] }
        ];

        return (
            <Chart
                type="bar"
                height={350}
                series={series}
                options={{
                    chart: { stacked: true },
                    plotOptions: { bar: { horizontal: false, borderRadius: 4 } },
                    colors: ['#ffd966', '#90EE90', '#fd7e14'],
                    xaxis: {
                        categories,
                        title: { text: "Priorities" }
                    },
                    yaxis: {
                        title: { text: "Ticket Counts" }
                    },
                    title: { text: "Tickets by Priority", align: "center" },
                    dataLabels: { enabled: true },
                }}
            />
        );
    };

    const SLABreachedChart = () => {
        const names = slaBreachedData.map(d => d.name);
        const values = slaBreachedData.map(d => d.value);

        return (
            <Chart
                type="bar"
                height={350}
                series={[{ name: "SLA Breached Count", data: values }]}
                options={{
                    plotOptions: { bar: { horizontal: true, borderRadius: 4 } },
                    xaxis: {
                        categories: names,
                        title: { text: "Approvers" }
                    },
                    yaxis: {
                        title: { text: "Overdue Count" }
                    },
                    colors: ["#ff5733"],
                    title: { text: "Overdue Approvers", align: "center" },
                    dataLabels: { enabled: true },
                }}
            />
        );
    };

    const ResponseTimeChart = () => {
        const names = responseTimeData.map(d => d.name);
        const values = responseTimeData.map(d => d.time);

        return (
            <Chart
                type="bar"
                height={350}
                series={[{ name: "Response Time (hrs)", data: values }]}
                options={{
                    plotOptions: { bar: { horizontal: true, borderRadius: 4 } },
                    xaxis: {
                        categories: names,
                        title: { text: "Approvers" }
                    },
                    yaxis: {
                        title: { text: "Response Time (hrs)" }
                    },
                    colors: ["#0088FE"],
                    title: { text: "Approver Response Time", align: "center" },
                    dataLabels: { enabled: true },
                }}
            />
        );
    };

    return (
        <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
                <Card>
                    <CardContent>
                        <DepartmentChart />
                    </CardContent>
                </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
                <Card>
                    <CardContent>
                        <PriorityChart />
                    </CardContent>
                </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
                <Card>
                    <CardContent>
                        <SLABreachedChart />
                    </CardContent>
                </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
                <Card>
                    <CardContent>
                        <ResponseTimeChart />
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default GraphData;