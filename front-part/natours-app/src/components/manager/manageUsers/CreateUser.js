import { useState } from 'react';
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  InputAdornment,
  IconButton,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Alert from '../../utils/alert';
import { fetchWrapper } from '../../utils/fetchWrapper';

export const CreateUser = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showPass1, setShowPass1] = useState(false);
  const [showPass2, setShowPass2] = useState(false);
  const [alertInfo, setAlertInfo] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [showErrro, setShowErrro] = useState(false);
  const [ErrMess, setErrMess] = useState('');

  const handleNameChange = (event) => {
    setName(event.target.value);
  };
  const handleToggleShowPass2 = () => {
    setShowPass2(!showPass2);
  };
  const handleToggleShowPass1 = () => {
    setShowPass1(!showPass1);
  };
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { message, data, status, loading } = await fetchWrapper(
        `/users`,
        'POST',
        JSON.stringify({
          email,
          name,
          role,
          password,
          passwordConfirm,
        }),
        { 'Content-Type': 'application/json' }
      );
      if (status === 'success') {
        setAlertInfo({
          severity: 'success',
          title: 'Message',
          message: 'User Created successfully',
        });
        setShowAlert(true);
      } else {
        setAlertInfo({
          severity: 'error',
          title: 'Message',
          message,
        });
        setShowErrro(true);
        setErrMess(message);
      }
    } catch (error) {
      console.error(error);
    }
  };
  if (showAlert || showErrro) {
    setTimeout(() => {
      setShowAlert(false);
      setShowErrro(false);
    }, 3000);
  }

  return (
    <div style={{ position: 'relative' }}>
      <form
        onSubmit={handleSubmit}
        style={{ width: '500px', margin: 'auto', textAlign: 'center' }}
      >
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
          Create User
        </Typography>
        <TextField
          label="Name"
          value={name}
          onChange={handleNameChange}
          required
          fullWidth
          margin="normal"
        />
        <TextField
          label="Email"
          value={email}
          onChange={handleEmailChange}
          required
          fullWidth
          margin="normal"
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type={showPass1 ? 'text' : 'password'}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleToggleShowPass1}
                  edge="end"
                  style={{ width: '50px' }}
                >
                  {showPass1 ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          id="password"
          autoComplete="current-password"
        />
        <TextField
          required
          fullWidth
          name="passwordConfirm"
          label="Confirm Your Password"
          onChange={(e) => setPasswordConfirm(e.target.value)}
          type={showPass2 ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleToggleShowPass2}
                  edge="end"
                  style={{ width: '50px' }}
                >
                  {showPass2 ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          id="password"
          autoComplete="new-password"
        />
        <FormControl required fullWidth margin="normal">
          <InputLabel>Role</InputLabel>
          <Select
            id="demo-simple-select"
            labelId="demo-simple-select-label"
            label="Role"
            value={role}
            onChange={handleRoleChange}
          >
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="guide">Guide</MenuItem>
            <MenuItem value="lead-guide">Lead-Guide</MenuItem>
            <MenuItem value="user">User</MenuItem>
          </Select>
        </FormControl>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          style={{
            marginTop: 30,
            marginBottom: 60,
            backgroundImage:
              'linear-gradient(to right bottom, #7dd56f, #28b487)',
          }}
        >
          Add User
        </Button>
      </form>

      {showAlert && (
        <Typography
          component="h6"
          style={{
            textAlign: 'center',
            marginBottom: 60,
          }}
          gutterBottom
          color='success'
        >
          User Added Successfully
        </Typography>
      )}
      {showErrro && (
        <Typography
          color="error"
          component="h6"
          style={{
            textAlign: 'center',
            marginBottom: 60,
          }}
          gutterBottom
        >
          {ErrMess}
        </Typography>
      )}
    </div>
  );
};
