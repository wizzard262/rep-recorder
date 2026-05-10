import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import useApi from "~/hooks/useApi";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import TableHead from "@mui/material/TableHead";
import Skeleton from "@mui/material/Skeleton";
import { categoryColours, movementColours } from "~/utils/tableCellColours";
import { Button } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export default function ListRetSetScheme() {

  // #region consts

  // useState must mean if the user changes page, pageSize, etc the var is updated
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("asc");
  const { getRepSetSchemes: getRepSetSchemes } = useApi();
  const { deleteRow: deleteRow } = useApi();
  const queryClient = useQueryClient();

  const { data, status } = useQuery({
    queryKey: ["getRepSetSchemes", page, pageSize, sortBy, sortOrder],
    queryFn: () => getRepSetSchemes(page, pageSize, sortBy, sortOrder),
  });

  // #endregion

  // #region Handlers

  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  const handleSort = (column: string) => {
    setPage(0);
    setPageSize(pageSize);
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setPage(1);
    setPageSize(parseInt(event.target.value, 10));
    setSortBy("date");
    setSortOrder("asc");
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
    setPage(0);
  };

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteRow(id),
    onSuccess: () => {
      toast.success("Deleted", {
        duration: 5000,
        style: {
          fontSize: "1.2rem",
          padding: "16px 20px",
        },
      });

      queryClient.invalidateQueries({
        predicate: (q) => q.queryKey[0] === "getRepSetSchemes"
      });
    },
    onError: () => {
      toast.success("Delete failed", {
        duration: 5000,
        style: {
          fontSize: "1.2rem",
          padding: "16px 20px",
        },
      });
    }
  });

  // #endregion

  return (
    <section id="list-firms">
      <h2 style={{ textAlign: "left" }}>Rep Set Schemes</h2>
      {status === "error" && <p>Error loading Rep Set Schemes.</p>}
      {status !== "error" && (
        <TableContainer component={Paper}>
          <Table
            style={{ border: "2px solid #ccc" }}
            sx={{ minWidth: 500 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell
                  align="right"
                  scope="row"
                  className={sortBy === "date" ? "selected-sort" : "unselected-sort"}
                  onClick={() => handleSort("date")}>
                  Date {sortBy === "date"
                    ? (sortOrder === "asc" ? "▲▽" : "△▼")
                    : "△▽"}
                </TableCell>
                <TableCell
                  align="right"
                  scope="row"
                  className={sortBy === "movement" ? "selected-sort" : "unselected-sort"}
                  onClick={() => handleSort("movement")}>
                  Movement {sortBy === "movement"
                    ? (sortOrder === "asc" ? "▲▽" : "△▼")
                    : "△▽"}
                </TableCell>
                <TableCell
                  align="right"
                  scope="row"
                  className={sortBy === "category" ? "selected-sort" : "unselected-sort"}
                  onClick={() => handleSort("category")}>
                  Category {sortBy === "category"
                    ? (sortOrder === "asc" ? "▲▽" : "△▼")
                    : "△▽"}
                </TableCell>
                <TableCell
                  align="right"
                  scope="row"
                  className={sortBy === "compound" ? "selected-sort" : "unselected-sort"}
                  onClick={() => handleSort("compound")}>
                  Compound {sortBy === "compound"
                    ? (sortOrder === "asc" ? "▲▽" : "△▼")
                    : "△▽"}
                </TableCell>
                <TableCell
                  align="right"
                  scope="row"
                  className={sortBy === "mass" ? "selected-sort" : "unselected-sort"}
                  onClick={() => handleSort("mass")}>
                  Mass(Kg) {sortBy === "mass"
                    ? (sortOrder === "asc" ? "▲▽" : "△▼")
                    : "△▽"}
                </TableCell>
                <TableCell
                  align="right"
                  scope="row"
                  className={sortBy === "reps" ? "selected-sort" : "unselected-sort"}
                  onClick={() => handleSort("reps")}>
                  Reps {sortBy === "reps"
                    ? (sortOrder === "asc" ? "▲▽" : "△▼")
                    : "△▽"}
                </TableCell>
                <TableCell
                  align="right"
                  scope="row"
                  className={sortBy === "volume" ? "selected-sort" : "unselected-sort"}
                  onClick={() => handleSort("volume")}>
                  Volume {sortBy === "volume"
                    ? (sortOrder === "asc" ? "▲▽" : "△▼")
                    : "△▽"}
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {status === "pending" &&
                // render rows of skeletons to avoid layout shift when data loads
                [...Array(pageSize)].map((_, index) => (
                  <TableRow key={index}>
                    <TableCell colSpan={7} align="center">
                      <Skeleton />
                    </TableCell>
                  </TableRow>
                ))}
              {status === "success" &&
                data.items.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>
                      {new Date(row.date).toISOString().slice(0, 10)}
                    </TableCell>
                    <TableCell sx={{ backgroundColor: movementColours[row.exerciseMovement.name as keyof typeof movementColours] || "#fff" }}>
                      {row.exerciseMovement.name}
                    </TableCell>
                    <TableCell sx={{ backgroundColor: categoryColours[row.exerciseMovement.type as keyof typeof categoryColours] || "#fff" }}>
                      {row.exerciseMovement.type}
                    </TableCell>
                    <TableCell>
                      {row.exerciseMovement.isCompound ? "YES" : "NO"}</TableCell>
                    <TableCell>{row.kilogramMass}</TableCell>
                    <TableCell>{row.repetitions}</TableCell>
                    <TableCell>{row.kilogramMass * row.repetitions}</TableCell>
                    <TableCell>
                      <Button variant="contained" color="primary" size="small" onClick={() => handleDelete(row.id)}>
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 20]}
                  count={data?.totalCount ?? 0}
                  rowsPerPage={pageSize}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      )}
    </section>
  );
}