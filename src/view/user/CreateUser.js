import { useMutation } from "@apollo/client";
import { LoadingButton } from "@mui/lab";
import {
  Button,
  Card,
  CardContent,
  Box,
  FormControl,
  FormLabel,
  TextField,
  Breadcrumbs,
  Typography,
  Paper,
} from "@mui/material";
import { CREATE_USER } from "../../gql/user";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateUser = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [fullname, setFullname] = useState("");
  const [loading, setLoading] = useState(false);

  console.log("fullname", fullname);
  const [create_user] = useMutation(CREATE_USER, {
    onError: (err) => {
      setLoading(false);
      alert("Error on Server");
      console.log("error or server", err);
    },
    onCompleted: (result) => {
      setPhone("");
      setFullname("");
      setPassword("");
      alert("New User has been added");
    },
  });

  const handleCreate = async () => {
    let isError = false;
    const errorObject = {};
    if (!fullname) {
      isError = true;
      errorObject.fullname = "Fullname is required";
    }
    if (!password) {
      isError = true;
      errorObject.password = "Password is required";
    }
    if (!phone) {
      isError = true;
      errorObject.phone = "Phone is required";
    }
    if (isError) {
      setErrors(errorObject);
      console.log("error ", errorObject);
      setLoading(false);
      return;
    }

    await create_user({
      variables: {
        fullname,
        password,
        phone,
      },
    });
    navigate(-1);
  };
  return (
    <>
      <Card>
        <div
          style={{
            // display: "flex",
            // justifyContent: "space-between",
            padding: "1rem",
          }}
        >
          {/* dashboard */}
          <div>
            <Breadcrumbs aria-label="breadcrumb">
              {/* <Link to="/" className="dashboard"> */}
              <Typography variant="h5">Mula Dashboard (User)</Typography>

              {/* </Link> */}
              {/* <span>ArtWork</span> */}
            </Breadcrumbs>
            <Typography>Main / User</Typography>
          </div>
        </div>
        <Paper
          sx={{
            display: "grid",
            gap: "2rem",
            p: "2rem",
            maxWidth: "30%",
            margin: "auto",
          }}
        >
          {/* fullname */}
          <FormControl>
            <FormLabel style={{ fontWeight: "bold" }}>Fullname</FormLabel>
            <TextField
              InputProps={{ sx: { height: 50 } }}
              variant="outlined"
              id="fullname"
              placeholder="Enter Fullname"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              error={errors.fullname ? true : false}
              helperText={errors.fullname}
            />
          </FormControl>
          {/* phone */}
          <FormControl>
            <FormLabel style={{ fontWeight: "bold" }}>Phone</FormLabel>
            <TextField
              variant="outlined"
              InputProps={{ sx: { height: 50 } }}
              id="phone"
              placeholder="Enter Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              error={errors.phone ? true : false}
              helperText={errors.phone}
            />
          </FormControl>
          {/* password */}
          <FormControl>
            <FormLabel style={{ fontWeight: "bold" }}>Password</FormLabel>
            <TextField
              variant="outlined"
              InputProps={{ sx: { height: 50 } }}
              id="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password ? true : false}
              helperText={errors.password}
            />
          </FormControl>
        </Paper>
        <Box sx={{ display: "flex", justifyContent: "center", py: "2rem" }}>
          <LoadingButton
            variant="contained"
            loading={loading}
            onClick={handleCreate}
          >
            Create
          </LoadingButton>
        </Box>
      </Card>
    </>
  );
};
export default CreateUser;
