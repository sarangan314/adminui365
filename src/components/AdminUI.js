import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Pagination,
  Box,
  Checkbox,
  TextField,
} from "@mui/material";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditIcon from "./EditIcon";
import PaginationItem from "@mui/material/PaginationItem";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import axios from "axios";
import EditBox from "./EditBox";
import { useState, useEffect } from "react";
import "./AdminUI.css";
import { createTheme } from '@mui/material/styles';
import { purple } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    primary: {
      // Purple and green play nicely together.
      main: purple[500],
      background: "yellow",
    },
    secondary: {
      main: '#2196f3',
    },
    
  },
});

const AdminUI = () => {
  const [data, setData] = useState([]);
  const [activePage, setactivePage] = useState(1);
  const [loadingStatus, setloadingStatus] = useState(true);
  // useState variable for number of table in a page
  // eslint-disable-next-line
  const [numberOfMemberPerPage, setnumberOfMemberPerPage] = useState(10);
  const [activeRole, setactiveRole] = useState([]);
  // to set edit tab to open and close
  const [open, setOpen] = useState(false);
  // to select the member wit there id in table
  const [selectedMemberId, setselectedMemberId] = useState(null);
  // to mark the selected member 1 TO 10 which is selected 
  const [markedMemberId, setmarkedMemberId] = useState([]);
  // to mark all member
  const [allMemberMarked, setallMemberMarked] = useState(false);
  // to find user by name role email
  const [searchMemberData, setsearchMemberData] = useState("");
  // to search from all page if not present in current page
  const [searchAllMemberData, setsearchAllMemberData] = useState([]);
  const indexOfLastPageView = activePage * numberOfMemberPerPage;
  const indexOfFirstPageView = indexOfLastPageView - numberOfMemberPerPage;
  //console.log(markedMemberId);
// This is the initial fetch of data from given URL
  async function fetchData() {
    try {
      const res = await axios.get(
        "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
      );
      setData(res.data);
    } catch (error) {
      alert("something went wrong please reload page");
      console.log(error);
    }
  }

  // to change the page which was selected

  function onPageChange(event, value) {
    setactivePage(value);
  }

  // for checkbox to select the member
  function selectCheck(e) {
    const index = markedMemberId.indexOf(e.target.value);
    if (index === -1) {
      setmarkedMemberId([...markedMemberId, e.target.value]);
    } else {
      setmarkedMemberId(markedMemberId.filter((id) => id !== e.target.value));
    }
  }

  // The top select checkbox to select the member within the page

  function selectAll() {
    setallMemberMarked(!allMemberMarked);
    if (allMemberMarked) {
      setmarkedMemberId([]);
    } else {
      if (searchMemberData.length < 1) {
        setmarkedMemberId(activeRole.map((el) => el.id));
      } else {
        setmarkedMemberId(searchAllMemberData.map((el) => el.id));
      }
    }
  }

  // to by pressind delete outlined icon

  function deleteInfo(id) {
    const updatedData = data.filter((item) => item.id !== id);
    setsearchAllMemberData(updatedData);
    setData(updatedData);
  }

  // to delete the selected Member

  function deleteSelected() {
    const newData = data.filter((item) => !markedMemberId.includes(item.id));
    setData(newData);
    setsearchAllMemberData(newData);
    setallMemberMarked(false);
  }

  // to edit the name email and role

  function editData(id) {
    setOpen(true);
    setselectedMemberId(id);
  }

  // to search the member from data

  function searchItem(e) {
    setsearchMemberData(e.target.value);
    if (e.target.value !== "") {
      const newPosts = data.filter((item) => {
        return Object.values(item)
          .join(" ")
          .toLowerCase()
          .includes(e.target.value.toLowerCase());
      });
      setsearchAllMemberData(newPosts);
    } else {
      setsearchAllMemberData(data);
    }
  }

  // to auto call the fetch data while page is loading
  useEffect(() => {
    fetchData();
    console.log(activePage);
  }, []);

  // to set the no of page

  useEffect(() => {
    // eslint-disable-next-line
    setactiveRole(data.slice(indexOfFirstPageView, indexOfLastPageView));
    setloadingStatus(false);
  }, [data, activePage]);

  return (
    <>
      {loadingStatus ? (
        <>
          <Box
            sx={{
              height: "100vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <h1>...Loading</h1>
          </Box>
        </>
      ) : (
        <>
          <Box
            display="flex"
            sx={{
              height: "100vh",
              flexDirection: "column",
            }}
          >
            <br/>
            <TextField
              id="fullWidth"
              sx={{ width: "99%", alignSelf: "center" }}
              placeholder="Search by name, email or role"
              value={searchMemberData}
              onChange={searchItem}
            />
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Checkbox checked={allMemberMarked} onChange={selectAll} />
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Role</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }} align="center">
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(searchMemberData.length < 1 ? activeRole : searchAllMemberData).map(
                    (item) => {
                      return (
                        <TableRow
                          key={item.id}
                          sx={{
                            backgroundColor: markedMemberId.includes(item.id)
                              ? "#c3c3c3"
                              : "",
                          }}
                        >
                          <TableCell>
                            <Checkbox
                              value={item.id}
                              checked={markedMemberId.includes(item.id)}
                              onChange={selectCheck}
                            />
                          </TableCell>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.email}</TableCell>
                          <TableCell>{item.role}</TableCell>
                          <TableCell align="center">
                            <Button
                              size="small"
                              onClick={() => editData(item.id)}
                            >
                              <EditIcon fontSize="small" />
                            </Button>
                            <Button
                              size="small"
                              onClick={() => deleteInfo(item.id)}
                            >
                              <DeleteOutlineOutlinedIcon
                                fontSize="small"
                                color="error"
                              />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    }
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <Box display="flex" sx={{ padding: "10px", marginTop: "auto" }}>
              <Button
                variant="contained"
                color="error"
                onClick={deleteSelected}
              >
                Delete Selected
              </Button>
              <Pagination
                className={theme.secondary}
                count={Math.ceil(data.length / 10)}
                defaultPage={activePage}
                variant="outlined"
                color="primary"
                showFirstButton={true}
                showLastButton={true}
                sx={{ margin: "auto" }}
                onChange={onPageChange}
                renderItem={(item) => (
                  <PaginationItem
                 sx={{mx:3,backgroundColor:"#2196f3",color:"#ffffff",}}
                    showFirstButton={true}
                    showLastButton={true}
                    onChange={onPageChange}
                    components={{
                      last: KeyboardDoubleArrowRightIcon,
                      first: KeyboardDoubleArrowLeftIcon,
                    }}
                    {...item}
                  />
                )}
              />
            </Box>
          </Box>
          {selectedMemberId && (
            <>
              <EditBox
                setOpen={setOpen}
                open={open}
                activeRole={searchMemberData.length < 1 ? activeRole : searchAllMemberData}
                selectedMemberId={selectedMemberId}
                data={data}
                setData={setData}
                setsearchAllMemberData={setsearchAllMemberData}
              />
            </>
          )}
        </>
      )}
    </>
  );
};

export default AdminUI;
