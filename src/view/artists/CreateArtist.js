import {
  Button,
  Typography,
  Box,
  CardContent,
  CardMedia,
  Card,
  FormControl,
  TextField,
  Modal,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateArtist = () => {
  const navigate = useNavigate();

  return (
    <>
      <Box
        role="presentation"
        sx={{ display: "flex", justifyContent: "start", p: 2 }}
      >
        <Typography fontWeight="bold" variant="h6">
          Create Artist
        </Typography>
      </Box>

      <Card>
        <CardContent sx={{ p: 3 }} elevation={4}>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <CardMedia component="img" height="100"></CardMedia>
            <CardMedia component="img" height="100"></CardMedia>
          </Box>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "300px 300px 300px",
              gap: 2,
            }}
          >
            {/* Artist Name */}
            <FormControl sx={{ mx: 3, my: 1, minWidth: "300px" }}>
              <TextField
                variant="filled"
                id="artist_name"
                label="Artist Name"
              />
            </FormControl>
            {/* Profile Image URL */}
            <FormControl sx={{ mx: 3, my: 1, minWidth: "300px" }}>
              <TextField
                variant="filled"
                id="profile_image_url"
                label="Profile Image"
                type="file"
                InputLabelProps={{ shrink: true }}
              />
            </FormControl>
            {/* Profile background Image URL */}
            <FormControl sx={{ mx: 3, my: 1, minWidth: "300px" }}>
              <TextField
                variant="filled"
                id="profile_background_image_url"
                label="Profile Background  Image"
                type="file"
                InputLabelProps={{ shrink: true }}
              />
            </FormControl>

            {/* Biography */}
            <FormControl sx={{ mx: 3, my: 1, minWidth: "300px" }}>
              <TextField variant="filled" id="biography" label="Biography" />
            </FormControl>
            {/* Year_born */}
            <FormControl sx={{ mx: 3, my: 1, minWidth: "300px" }}>
              <TextField variant="filled" id="year_born" label="Year Born" />
            </FormControl>
            {/* Year_died */}
            <FormControl sx={{ mx: 3, my: 1, minWidth: "300px" }}>
              <TextField variant="filled" id="year_died" label="Year Died" />
            </FormControl>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            {/* Year_died */}
            <FormControl sx={{ mx: 3, my: 1, minWidth: "300px" }}>
              <TextField variant="filled" id="year_died" label="Year Died" />
            </FormControl>
            <Box sx={{ mx: 4, mt: 3 }}>
              <Button
                variant="contained"
                color="warning"
                onClick={() => navigate("/artist")}
              >
                Close
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </>
  );
};

export default CreateArtist;
