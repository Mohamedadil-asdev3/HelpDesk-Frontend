import { useState } from "react";
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Paper, TextField, IconButton, Tooltip, Card, CardContent, Typography, Button, } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import GroupsIcon from "@mui/icons-material/Group";

const CommonTables = ({ title, btnName, addButton, columns = [], rows = [], onEdit, onDelete, onView, onGroup }) => {

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [search, setSearch] = useState("");

    // search
    const filteredRows = rows.filter((row) =>
        Object.values(row).join(" ").toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Card sx={{ p: 2, borderRadius: 3 }}>
            <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, }}>
                    <Typography sx={{ fontSize: 25, fontWeight: 600 }}>
                        {title}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Button startIcon={<AddIcon />} variant="contained" size="small" sx={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }} onClick={addButton}>{btnName}</Button>
                        <TextField
                            size="small"
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 3,
                                }
                            }}
                        />
                    </Box>
                </Box>

                <TableContainer sx={{ overflowX: "auto" }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {columns.map((col) => (
                                    <TableCell key={col.id} sx={{ fontWeight: 600 }}>
                                        {col.label}
                                    </TableCell>
                                ))}

                                {(onEdit || onDelete || onView || onGroup) && (
                                    <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                                )}
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {filteredRows.length > 0 ? (
                                filteredRows
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row, index) => (
                                        <TableRow key={index} hover>
                                            {columns.map((col) => (
                                                <TableCell key={col.id}>{row[col.id]}</TableCell>
                                            ))}


                                            {(onEdit || onDelete || onView || onGroup) && (
                                                <TableCell >
                                                      <Box sx={{ display: "flex", gap: 1 }}>                                                   {onView && (
                                                        <Tooltip title="View">
                                                            <IconButton onClick={() => onView(row)}>
                                                                <VisibilityIcon color="primary" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    )}

                                                    {onEdit && (
                                                        <Tooltip title="Edit">
                                                            <IconButton onClick={() => onEdit(row)}>
                                                                <EditIcon color="success" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    )}

                                                    {onDelete && (
                                                        <Tooltip title="Delete">
                                                            <IconButton onClick={() => onDelete(row)}>
                                                                <DeleteIcon color="error" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    )}

                                                    {onGroup && (
                                                        <Tooltip title="Group">
                                                            <IconButton onClick={() => onGroup(row)}>
                                                                <GroupsIcon color="secondary" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    )}

                                                     </Box>
                                                    
                                                </TableCell>
                                                
                                            )}
                                        </TableRow>
                                    ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length + 1} align="center">
                                        No Records Found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>

                    <TablePagination
                        component="div"
                        count={filteredRows.length}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        onPageChange={(e, newPage) => setPage(newPage)}
                        onRowsPerPageChange={(e) => {
                            setRowsPerPage(parseInt(e.target.value));
                            setPage(0);
                        }}
                    />
                </TableContainer>
            </CardContent>
        </Card>
    );
};

export default CommonTables;