import { Grid, Card, CardContent, Typography, Box } from "@mui/material";
import Chart from "react-apexcharts";

const CEOGraphData = ({ departmentData, priorityData, overallData }) => {

    const calculateResponseTimes = () => {
        if (!overallData?.approved_tickets) return [];

        const responseTimes = {};

        // Calculate response time for approved tickets
        overallData.approved_tickets.forEach(ticket => {
            const approver = ticket.requested_detail?.name || 'Unknown Approver';
            const createdDate = new Date(ticket.created_date);
            const updatedDate = new Date(ticket.updated_date);

            // Calculate time difference in hours
            const timeDiffHours = (updatedDate - createdDate) / (1000 * 60 * 60);

            if (!responseTimes[approver]) {
                responseTimes[approver] = {
                    totalTime: 0,
                    count: 0
                };
            }

            responseTimes[approver].totalTime += timeDiffHours;
            responseTimes[approver].count += 1;
        });

        // Calculate average time per approver
        const avgResponseTimes = Object.entries(responseTimes).map(([approver, data]) => ({
            approver: approver.split('@')[0], // Remove email domain for display
            time: Math.round((data.totalTime / data.count) * 10) / 10 // Round to 1 decimal
        }));

        // Sort by response time and limit to top 10
        return avgResponseTimes
            .sort((a, b) => a.time - b.time)
            .slice(0, 10);
    };

    const ApprovalWorkflowFunnel = () => {
        // Use actual data from API
        const workflowData = overallData ? [
            { stage: 'Total Tickets', count: overallData.total_tickets || 0 },
            { stage: 'Pending', count: overallData.pending || 0 },
            { stage: 'Approved', count: overallData.approved || 0 },
            { stage: 'Rejected', count: overallData.rejected || 0 },
        ] : [];

        const sorted = [...workflowData].sort((a, b) => b.count - a.count);

        const series = [{
            name: "Count",
            data: sorted.map(item => item.count),
        }];

        const options = {
            chart: {
                type: "bar",
                toolbar: { show: false }
            },
            plotOptions: {
                bar: {
                    horizontal: true,
                    isFunnel: true,
                    distributed: true,
                    barHeight: "65%",
                    borderRadius: 8
                }
            },
            dataLabels: {
                enabled: true,
                formatter: (_, opt) => sorted[opt.dataPointIndex]?.stage || ''
            },
            xaxis: {
                categories: sorted.map(item => item.stage),
                labels: { show: false }
            },
            colors: ["#3B82F6", "#F59E0B", "#10B981", "#EF4444"],
        };

        return <Chart options={options} series={series} type="bar" height={400} />;
    };

    const DepartmentStatusStacked = () => {
        // Transform department data from API
        const transformedDepartmentData = departmentData?.map(dept => ({
            department: dept.department,
            approved: dept.approved || 0,
            pending: dept.pending || 0,
            rejected: dept.rejected || 0,
            onHold: dept.on_hold || 0,
            slaBreached: dept.sla_breached_count || 0
        })) || [];

        const options = {
            chart: {
                type: "bar",
                stacked: true,
                toolbar: { show: false }
            },
            xaxis: {
                categories: transformedDepartmentData.map(d => d.department),
                labels: {
                    rotate: -45,
                    style: {
                        fontSize: '10px'
                    }
                }
            },
            colors: ["#22c55e", "#3b82f6", "#ef4444", "#f59e0b", "#6b7280"],
            legend: { position: "bottom" },
            plotOptions: { bar: { borderRadius: 6 } }
        };

        const series = [
            { name: "Approved", data: transformedDepartmentData.map(d => d.approved) },
            { name: "Pending", data: transformedDepartmentData.map(d => d.pending) },
            { name: "Rejected", data: transformedDepartmentData.map(d => d.rejected) },
            { name: "On Hold", data: transformedDepartmentData.map(d => d.onHold) },
            { name: "SLA Breached", data: transformedDepartmentData.map(d => d.slaBreached) }
        ];

        return <Chart options={options} series={series} type="bar" height={400} />;
    };

    const AvgTimeResponseLine = () => {
        // Calculate actual response times from API data
        const responseTimeData = calculateResponseTimes();

        // If no data, show empty state
        if (responseTimeData.length === 0) {
            return (
                <Box
                    sx={{
                        height: 400,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column'
                    }}
                >
                    <Typography variant="body1" color="textSecondary">
                        No response time data available
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        Approved tickets will appear here
                    </Typography>
                </Box>
            );
        }

        const options = {
            chart: {
                type: "line",
                toolbar: { show: false }
            },
            stroke: { curve: "smooth", width: 3 },
            markers: { size: 5 },
            xaxis: {
                categories: responseTimeData.map(d => d.approver),
                labels: {
                    rotate: -45,
                    style: {
                        fontSize: '10px'
                    }
                }
            },
            yaxis: {
                title: {
                    text: "Hours"
                }
            },
            colors: ["#8b5cf6"],
            tooltip: {
                y: {
                    formatter: function (value) {
                        return value + " hours";
                    }
                }
            }
        };

        const series = [{
            name: "Avg Response Time",
            data: responseTimeData.map(d => d.time)
        }];

        return <Chart options={options} series={series} type="line" height={400} />;
    };

    const OverdueApprovalBar = () => {
        // Calculate overdue from SLA breached tickets
        const overdueData = overallData?.sla_breached_tickets?.reduce((acc, ticket) => {
            const department = ticket.department_detail?.field_name || 'Unknown';
            acc[department] = (acc[department] || 0) + 1;
            return acc;
        }, {}) || {};

        const chartData = Object.entries(overdueData).map(([department, count]) => ({
            department,
            count
        })).slice(0, 10); // Limit to top 10

        const options = {
            chart: {
                type: "bar",
                toolbar: { show: false }
            },
            xaxis: {
                categories: chartData.map(d => d.department),
                labels: {
                    rotate: -45,
                    style: {
                        fontSize: '10px'
                    }
                }
            },
            colors: ["#ef4444"],
            plotOptions: { bar: { borderRadius: 6 } },
        };

        const series = [{
            name: "Overdue Tickets",
            data: chartData.map(d => d.count)
        }];

        return <Chart options={options} series={series} type="bar" height={400} />;
    };

    // const PriorityBarChart = () => {
    //     // Transform priority data from API
    //     const transformedPriorityData = priorityData?.map(priority => ({
    //         priority: priority.priority,
    //         approved: priority.approved || 0,
    //         pending: priority.pending || 0,
    //         rejected: priority.rejected || 0,
    //         onHold: priority.on_hold || 0,
    //         slaBreached: priority.sla_breached_count || 0
    //     })) || [];

    //     const options = {
    //         chart: {
    //             type: "bar",
    //             toolbar: { show: false }
    //         },
    //         xaxis: {
    //             categories: transformedPriorityData.map(p => p.priority),
    //             labels: {
    //                 rotate: -45,
    //                 style: {
    //                     fontSize: '10px'
    //                 }
    //             }
    //         },
    //         colors: ["#22c55e", "#3b82f6", "#ef4444", "#f59e0b", "#6b7280"],
    //         plotOptions: { bar: { borderRadius: 6 } },
    //         legend: { position: "bottom" },
    //     };

    //     const series = [
    //         { name: "Approved", data: transformedPriorityData.map(p => p.approved) },
    //         { name: "Pending", data: transformedPriorityData.map(p => p.pending) },
    //         { name: "Rejected", data: transformedPriorityData.map(p => p.rejected) },
    //         { name: "On Hold", data: transformedPriorityData.map(p => p.onHold) },
    //         { name: "SLA Breached", data: transformedPriorityData.map(p => p.slaBreached) },
    //     ];

    //     return <Chart options={options} series={series} type="bar" height={400} />;
    // };

    const PriorityBarChart = () => {
        // Transform priority data from API
        const transformedPriorityData = priorityData?.map(priority => ({
            priority: priority.priority,
            approved: priority.approved || 0,
            pending: priority.pending || 0,
            rejected: priority.rejected || 0,
            onHold: priority.on_hold || 0,
            slaBreached: priority.sla_breached_count || 0
        })) || [];

        const options = {
            chart: {
                type: "bar",
                stacked: true,
                toolbar: { show: false }
            },
            plotOptions: {
                bar: {
                    horizontal: true,
                    borderRadius: 6
                }
            },
            xaxis: {
                categories: transformedPriorityData.map(p => p.priority)
            },
            yaxis: {
                labels: {
                    style: {
                        fontSize: '10px'
                    }
                }
            },
            colors: ["#22c55e", "#3b82f6", "#ef4444", "#f59e0b", "#6b7280"],
            legend: { position: "bottom" },
        };

        const series = [
            { name: "Approved", data: transformedPriorityData.map(p => p.approved) },
            { name: "Pending", data: transformedPriorityData.map(p => p.pending) },
            { name: "Rejected", data: transformedPriorityData.map(p => p.rejected) },
            { name: "On Hold", data: transformedPriorityData.map(p => p.onHold) },
            { name: "SLA Breached", data: transformedPriorityData.map(p => p.slaBreached) },
        ];

        return <Chart options={options} series={series} type="bar" height={400} />;
    };

    return (
        <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
                <Card sx={{ width: "100%" }}>
                    <CardContent>
                        <Typography variant="h6" fontWeight={700} mb={2}>
                            Approval Workflow Funnel
                        </Typography>
                        <ApprovalWorkflowFunnel />
                    </CardContent>
                </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
                <Card sx={{ width: "100%" }}>
                    <CardContent>
                        <Typography variant="h6" fontWeight={700} mb={2}>
                            Tickets Status Breakdown by Departments
                        </Typography>
                        <DepartmentStatusStacked />
                    </CardContent>
                </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
                <Card sx={{ width: "100%" }}>
                    <CardContent>
                        <Typography variant="h6" fontWeight={700} mb={2}>
                            Overdue Tickets by Department
                        </Typography>
                        <OverdueApprovalBar />
                    </CardContent>
                </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
                <Card sx={{ width: "100%" }}>
                    <CardContent>
                        <Typography variant="h6" fontWeight={700} mb={2}>
                            Ticket Status by Priority
                        </Typography>
                        <PriorityBarChart />
                    </CardContent>
                </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 12 }}>
                <Card sx={{ width: "100%" }}>
                    <CardContent>
                        <Typography variant="h6" fontWeight={700} mb={2}>
                            Average Response Time by Approver
                        </Typography>
                        <AvgTimeResponseLine />
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default CEOGraphData;