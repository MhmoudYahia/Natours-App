import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Autocomplete,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  FormControlLabel,
} from '@mui/material';

import { useFetch } from '../../utils/useFetch';
import ErrorPage from '../../error/ErrorPage';
import ReactLoading from 'react-loading';
import { fetchWrapper } from '../../utils/fetchWrapper';
import Alert from '../../utils/alert';

export const ManageALlUsers = () => {
  const [users, setUsers] = useState([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editRole, setEditRole] = useState('');
  const [alertInfo, setAlertInfo] = useState({});
  const [showAlert, setShowAlert] = useState(false);

  const { data, status, loading, message } = useFetch(
    `http://localhost:1444/api/v1/users`
  );

  useEffect(() => {
    setUsers(data.docs);
  }, [data]);

  const handleEditUserClick = (user) => {
    setSelectedUser(user);
    setEditName(user.name);
    setEditEmail(user.email);
    setEditRole(user.role);
    setEditDialogOpen(true);
  };

  const handleEditUserSave = async () => {
    try {
      const { message, data, status, loading } = await fetchWrapper(
        `/users/${selectedUser._id}`,
        'PATCH',
        JSON.stringify({
          email: editEmail,
          name: editName,
          role: editRole,
        }),
        { 'Content-Type': 'application/json' }
      );
      if (status === 'success') {
        setAlertInfo({
          severity: 'success',
          title: 'Message',
          message: 'Review Edited successfully',
        });
        setShowAlert(true);
        setUsers(
          users.map((user) => (user._id === data.doc._id ? data.doc : user))
        );
        setEditDialogOpen(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteUserClick = (user) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteUserConfirm = async () => {
    try {
      const { message, data, status, loading } = await fetchWrapper(
        `/users/${selectedUser._id}`,
        'DELETE'
      );
      if (status === 'success') {
        setShowAlert(true);
        setAlertInfo({
          severity: 'success',
          title: 'Message',
          message: 'User deleted successfully',
        });
        setUsers(users.filter((user) => user._id !== selectedUser._id));
        setDeleteDialogOpen(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <ReactLoading
        type="spinningBubbles"
        color="#0000FF"
        height={100}
        width={50}
        style={{
          height: '50vh',
          width: '100px',
          margin: 'auto',
          /* margin-top: 69px; */
          display: 'flex',
        }}
      />
    );
  }

  if (status !== 'success') {
    return <ErrorPage errorMessage={message} />;
  }
  if (showAlert) {
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  }

  return (
    <>
      {showAlert && (
        <Alert
          severity={alertInfo.severity}
          title={alertInfo.title}
          message={alertInfo.message}
        />
      )}
      <Typography
        variant="h4"
        component="h1"
        // className="my-bookings-h1"
        style={{
          textAlign: 'center',
          margin: '10px 25px 50px',
          textTransform: 'uppercase',
          textDecoration: 'underline',
        }}
        gutterBottom
      >
        Users
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users &&
            users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell style={{ textTransform: 'uppercase' }}>
                  {user.role}
                </TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleEditUserClick(user)}
                    variant="contained"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDeleteUserClick(user)}
                    variant="contained"
                    color="error"
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <TextField
            style={{ margin: '20px 0' }}
            label="Name"
            value={editName}
            onChange={(event) => setEditName(event.target.value)}
            fullWidth
          />
          <TextField
            style={{ margin: '20px 0' }}
            label="Email"
            value={editEmail}
            onChange={(event) => setEditEmail(event.target.value)}
            fullWidth
          />
          <FormControl required fullWidth margin="normal">
            <InputLabel>Role</InputLabel>
            <Select
              id="demo-simple-select"
              labelId="demo-simple-select-label"
              label="Role"
              value={editRole}
              onChange={(e) => setEditRole(e.target.value)}
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="guide">Guide</MenuItem>
              <MenuItem value="lead-guide">Lead-Guide</MenuItem>
              <MenuItem value="user">User</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)} color="error">
            Cancel
          </Button>
          <Button
            onClick={handleEditUserSave}
            color="success"
            variant="contained"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete {selectedUser && selectedUser.name}?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="error">
            Cancel
          </Button>
          <Button onClick={handleDeleteUserConfirm} variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
