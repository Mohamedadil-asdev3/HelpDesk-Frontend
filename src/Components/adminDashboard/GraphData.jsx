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

// import { Grid, Card, CardContent, Typography } from "@mui/material";
// import Chart from "react-apexcharts";

// const AdminGraphData = ({ graphData }) => {
//     // Fallback to hardcoded if no data passed (updated to align with provided code structure)
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
//              <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
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
//         </Grid>
        
//     );
// };

// export default AdminGraphData;
// GraphData.jsx
import React from 'react';
import { Grid, Paper, Modal, Typography, IconButton, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { FaExpand, FaEllipsisV, FaTimes } from 'react-icons/fa';
import Chart from 'react-apexcharts';

const AdminGraphData = ({ 
  dashboard_analytics, 
  handleChartClick, 
  openModal, 
  selectedChart, 
  handleCloseModal, 
  openTicketModal, 
  selectedTicketType, 
  handleCloseTicketModal, 
  ticketTypes 
}) => {
  // Helper to render chart with icons
  const renderChartWithIcons = (chartData, height = 300) => {
    // Safeguard for empty data
    if (!chartData || !chartData.series || chartData.series.length === 0) {
      return (
        <Paper elevation={3} sx={{ p: 2, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography>No data available for this chart.</Typography>
        </Paper>
      );
    }
    return (
      <Paper elevation={3} sx={{ 
        p: 2, 
        cursor: 'pointer', 
        position: 'relative', 
        minHeight: height + 32,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%'
      }}>
        <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1, display: 'flex', gap: 1 }}>
          <IconButton 
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              console.log('Menu clicked for', chartData.options?.title?.text || 'Unknown Chart');
            }}
            title="Menu Options"
          >
            <FaEllipsisV size={16} color="#666" />
          </IconButton>
          <IconButton 
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleChartClick({ ...chartData, title: `${chartData.options?.title?.text || 'Chart'} Full View` });
            }}
            title="Expand Full View"
          >
            <FaExpand size={16} color="#1976d2" />
          </IconButton>
        </Box>
        <Box sx={{ 
          flexGrow: 1, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          gap: 5
        }}>
          <Chart 
            options={{ ...chartData.options, chart: { ...chartData.options.chart, width: '100%' } }} 
            series={chartData.series} 
            type={chartData.options.chart.type} 
            height={height} 
            width="100%"
          />
        </Box>
      </Paper>
    );
  };

  // Render ticket list table
  const renderTicketList = () => {
    if (!selectedTicketType) return null;
    const tickets = ticketTypes[selectedTicketType.type]?.tickets || [];
    if (tickets.length === 0) {
      return <Typography>No tickets available.</Typography>;
    }
    return (
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Ticket No</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Created Date</TableCell>
              <TableCell>Assignee</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tickets.slice(0, 20).map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell>{ticket.id}</TableCell>
                <TableCell>{ticket.ticket_no}</TableCell>
                <TableCell>{ticket.title}</TableCell>
                <TableCell>{ticket.status}</TableCell>
                <TableCell>{ticket.priority}</TableCell>
                <TableCell>{ticket.category}</TableCell>
                <TableCell>{new Date(ticket.created_date).toLocaleDateString()}</TableCell>
                <TableCell>{ticket.assignees?.[0]?.name || 'Unassigned'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  // Prepare chart data from API with safeguards
  const getMonthLabel = (monthName) => monthName.split(' ')[0]; // Fixed to properly extract month

  const evolutionData = {
    series: [
      { name: 'Opened', data: dashboard_analytics.ticket_creation_trend?.map(t => t.total_tickets) || [] },
      { name: 'Solved', data: dashboard_analytics.tickets_by_status_monthly?.map(m => m.statuses?.Solved || 0) || [] },
      { name: 'Closed', data: dashboard_analytics.tickets_by_status_monthly?.map(m => m.statuses?.Closed || 0) || [] },
    ],
    options: {
      chart: { type: 'line', height: 350, width: '100%' },
      stroke: { curve: 'smooth' },
      xaxis: { 
        categories: dashboard_analytics.ticket_creation_trend?.map(t => getMonthLabel(t.month_name)) || []
      },
      title: { text: 'Evolution of Tickets in the Past Year' },
    },
  };

  const categoriesData = {
    series: [{ name: 'Tickets', data: dashboard_analytics.top_categories?.map(c => c.count) || [] }],
    options: {
      chart: { type: 'bar', height: 350, width: '100%' },
      plotOptions: { bar: { horizontal: true } },
      dataLabels: { enabled: true },
      xaxis: { 
        categories: dashboard_analytics.top_categories?.map(c => c.name) || [] 
      },
      title: { text: 'Top Ticket Categories' },
    },
  };

  const lastStatuses = dashboard_analytics.tickets_by_status_monthly?.[dashboard_analytics.tickets_by_status_monthly.length - 1]?.statuses || {};
  const statusByMonthData = {
    series: Object.keys(lastStatuses).map(status => ({
      name: status,
      data: dashboard_analytics.tickets_by_status_monthly?.map(m => m.statuses?.[status] || 0) || []
    })),
    options: {
      chart: { type: 'bar', height: 350, width: '100%', stacked: true },
      xaxis: { 
        categories: dashboard_analytics.tickets_by_status_monthly?.map(m => getMonthLabel(m.month_name)) || []
      },
      title: { text: 'Tickets Status by Month' },
      colors: ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0'],
    },
  };

  const topAssigneesData = {
    series: dashboard_analytics.top_assignees?.map(a => a.count) || [],
    options: {
      chart: { type: 'pie', height: 250, width: '100%' },
      labels: dashboard_analytics.top_assignees?.map(a => a.name) || [],
      dataLabels: { enabled: true },
      legend: { position: 'bottom' },
      title: { text: 'Top Ticket Assignees' },
    },
  };

  const topLocationsData = {
    series: dashboard_analytics.top_locations?.map(l => l.count) || [],
    options: {
      chart: { type: 'pie', height: 250, width: '100%' },
      labels: dashboard_analytics.top_locations?.map(l => l.name) || [],
      dataLabels: { enabled: true },
      legend: { position: 'bottom' },
      title: { text: 'Top Ticket Locations' },
    },
  };

  const topRequestersData = {
    series: dashboard_analytics.top_requesters?.map(r => r.count) || [],
    options: {
      chart: { type: 'pie', height: 250, width: '100%' },
      labels: dashboard_analytics.top_requesters?.map(r => r.name) || [],
      dataLabels: { enabled: true },
      legend: { position: 'bottom' },
      title: { text: 'Top Ticket Requesters' },
    },
  };

  return (
    <>
      {/* Full-Screen Responsive Layout: Charts Below */}
      <Grid container spacing={3}>
        <Grid size={12} sx={{ height: 'auto', flexGrow: 1 }}>
          {/* First Row: Three Charts */}
          <Grid container spacing={2} mb={3} sx={{ alignItems: 'stretch' }}>
            <Grid size={{xs:12,sm:6,md:4}}>
              {renderChartWithIcons(evolutionData, 250)}
            </Grid>
            <Grid size={{xs:12,sm:6,md:4}}>
              {renderChartWithIcons(categoriesData, 250)}
            </Grid>
            <Grid size={{xs:12,sm:6,md:4}}>
              {renderChartWithIcons(statusByMonthData, 250)}
            </Grid>
          </Grid>

          {/* Second Row: Three Charts */}
          <Grid container spacing={2} sx={{ alignItems: 'stretch' }}>
            <Grid size={{xs:12,sm:6,md:4}}>
              {renderChartWithIcons(topAssigneesData, 250)}
            </Grid>
            <Grid size={{xs:12,sm:6,md:4}}>
              {renderChartWithIcons(topLocationsData, 250)}
            </Grid>
            <Grid size={{xs:12,sm:6,md:4}}>
              {renderChartWithIcons(topRequestersData, 250)}
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Full Page Preview Modal */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '90%', maxWidth: 1200, maxHeight: '90vh', overflow: 'auto', bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 2 }}>
          {selectedChart && (
            <>
              <Typography variant="h5" gutterBottom align="center">{selectedChart.title}</Typography>
              <Chart options={selectedChart.options} series={selectedChart.series} type={selectedChart.options.chart.type} height={600} width="100%" />
            </>
          )}
        </Box>
      </Modal>

      {/* Ticket List Modal */}
      <Modal open={openTicketModal} onClose={handleCloseTicketModal}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '90%', maxWidth: 1200, maxHeight: '90vh', overflow: 'auto', bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 2 }}>
          {selectedTicketType && (
            <>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5" fontWeight="600">
                  {selectedTicketType.cardName} ({(selectedTicketType.count || 0).toLocaleString()})
                </Typography>
                <IconButton onClick={handleCloseTicketModal} size="large">
                  <FaTimes size={24} />
                </IconButton>
              </Box>
              {renderTicketList()}
            </>
          )}
        </Box>
      </Modal>
    </>
  );
};

export default AdminGraphData;