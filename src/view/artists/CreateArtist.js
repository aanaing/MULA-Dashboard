import { useMutation, useQuery } from "@apollo/client";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
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
  TextareaAutosize,
  InputLabel,
  FormHelperText,
  Select,
  MenuItem,
} from "@mui/material";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ADD_ARTIST,
  ARTIST,
  ARTIST_ID,
  USER,
  // USERS,
  USER_ID,
} from "../../gql/artist";
import { IMAGE_UPLOAD } from "../../gql/image";
import imageService from "../../services/image";
import LoadingButton from "@mui/lab/LoadingButton";
import RichTextEditor from "react-rte";

const imageType = ["image/jpeg", "image/png"];
const toolbarConfig = {
  // Optionally specify the groups to display (displayed in the order listed).
  display: [
    "INLINE_STYLE_BUTTONS",
    "BLOCK_TYPE_BUTTONS",
    "LINK_BUTTONS",
    "BLOCK_TYPE_DROPDOWN",
    "HISTORY_BUTTONS",
  ],
  INLINE_STYLE_BUTTONS: [
    { label: "Bold", style: "BOLD", className: "custom-css-class" },
    { label: "Italic", style: "ITALIC" },
    { label: "Underline", style: "UNDERLINE" },
  ],
  BLOCK_TYPE_DROPDOWN: [
    { label: "Normal", style: "unstyled" },
    { label: "Heading Large", style: "header-one" },
    { label: "Heading Medium", style: "header-two" },
    { label: "Heading Small", style: "header-three" },
  ],
  BLOCK_TYPE_BUTTONS: [
    { label: "UL", style: "unordered-list-item" },
    { label: "OL", style: "ordered-list-item" },
  ],
};

const CreateArtistByPhone = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [values, setValues] = useState({
    artist_name: "",
    year_born: "",
    year_died: "",
    biography: "",
    fk_user_id: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [imageFileUrl, setImageFileUrl] = useState("");
  const [imageFile, setImageFile] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  const { data } = useQuery(USER);

  const [textValue, setTextValue] = useState(RichTextEditor.createEmptyValue());

  const onChange = (value) => {
    setTextValue(value);
    setValues({ ...values, biography: value.toString("html") });
  };

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
    // delete error[prop];
  };

  const [add_artist] = useMutation(ADD_ARTIST, {
    onError: (err) => {
      alert("Error on Server");
    },
    onCompleted: (result) => {
      setLoading(false);
      console.log("result data is ", result);
      setValues({});
      alert("New Artists had been added");
      navigate("/artist");
    },
    refetchQueries: [ARTIST],
  });

  //for image upload
  const [getImageUrl] = useMutation(IMAGE_UPLOAD, {
    onError: (error) => {
      alert("Error on Server");
    },
    onCompleted: (result) => {
      console.log("result", result);
      setImageFileUrl(result.getImageUploadUrl.imageUploadUrl);
      setValues({
        ...values,
        artist_profile_image_url: `https://axra.sgp1.digitaloceanspaces.com/Mula/${result.getImageUploadUrl.imageName}`,
      });
    },
  });

  const chooseImage = async (e) => {
    if (e.target.files && e.target.files[0]) {
      let image = e.target.files[0];
      if (!imageType.includes(image.type)) {
        setError({
          ...error,
          artist_profile_image_url: "Please Select image (png,jpeg)",
        });
        return;
      }
      if (image.size > 10485760) {
        setError({
          ...error,
          artist_profile_image_url: "Image size must be smaller than 10MB",
        });
        return;
      }
      console.log("image ", image);
      setImageFile(image);
      setImagePreview(URL.createObjectURL(image));
      getImageUrl({ variables: { contentType: "image/*" } });
    }
  };

  const handleCreate = async () => {
    setLoading(true);
    let isErrorExit = false;
    let errorObject = {};
    if (!values.artist_name) {
      isErrorExit = true;
      errorObject.artist_name = "Artist name is required";
    }
    if (!values.year_born) {
      isErrorExit = true;
      errorObject.year_born = "Year born is required";
    }

    // if (!values.phone) {
    //   isErrorExit = true;
    //   errorObject.phone = "Phone is required";
    // }
    if (!values.artist_profile_image_url) {
      isErrorExit = true;
      errorObject.artist_profile_image_url =
        "Artist Profile image  is required";
    }

    if (!values.biography) {
      isErrorExit = true;
      errorObject.biography = "Biography is required";
    }
    if (isErrorExit) {
      setError(errorObject);
      setLoading(false);
      return;
    }

    try {
      await imageService.uploadImage(imageFileUrl, imageFile);
      await add_artist({
        variables: { ...values },
      });
    } catch (error) {
      console.log("Error ", error);
    }
  };
  // console.log("user data ", data.users);

  if (!data) {
    return;
  }

  return (
    <>
      <Box
        role="presentation"
        sx={{ display: "flex", justifyContent: "space-between", p: 2 }}
      >
        <Typography fontWeight="bold" variant="h6">
          Create Artist
        </Typography>
        <Button
          color="warning"
          variant="contained"
          onClick={() => navigate("/artist")}
        >
          Close
        </Button>
      </Box>

      <Card>
        <CardContent sx={{ p: 3 }} elevation={4}>
          <Box
            sx={{
              maxWidth: "40%",
              display: "grid",
              justifyContent: "center",
              margin: "auto",
              borderRadius: 2,
              boxShadow: 2,
            }}
          >
            <CardMedia
              component="img"
              height="320"
              image={imagePreview}
              sx={{ my: 2 }}
            />
          </Box>
          {/* image */}
          <FormControl
            sx={{
              maxWidth: "30%",
              display: "flex",
              margin: "auto",
              mb: "2rem",
              mt: "1rem",
            }}
            className="photoCamera"
          >
            <Typography
              sx={{
                mb: 1,
                fontSize: "12px",
                textAlign: "center",
              }}
            >
              Rendered size must be 1920 * 1080 px and Aspect ratio must be 16:9
            </Typography>
            <Button
              variant="contained"
              component="label"
              size="large"
              sx={{ py: "0.5rem" }}
            >
              <PhotoCamera />
              <Typography sx={{ ml: 1 }}>Upload Image</Typography>
              <input
                hidden
                onChange={chooseImage}
                accept="image/png, image/jpeg, image/jpg, image/gif, image/svg+xml"
                type="file"
                error={error["artist_profile_image_url"]}
                FormHelperText={error["artist_profile_image_url"]}
              />
            </Button>
            <FormHelperText error>
              {error["artist_profile_image_url"]}
            </FormHelperText>
          </FormControl>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr 1fr",
              gap: "3rem",

              px: "1rem",
            }}
          >
            {/* Artist Name */}
            <FormControl>
              <TextField
                variant="filled"
                id="artist_name"
                label="Artist Name"
                value={values.artist_name}
                onChange={handleChange("artist_name")}
                error={error.artist_name ? true : false}
                helperText={error.artist_name}
              />
            </FormControl>

            {/* Year_born */}
            <FormControl>
              <TextField
                type="number"
                variant="filled"
                id="year_born"
                label="Year Born"
                value={values.year_born}
                onChange={handleChange("year_born")}
                error={error.year_born ? true : false}
                helperText={error.year_born}
              />
            </FormControl>

            {/* Year_died */}
            <FormControl>
              <TextField
                type="number"
                variant="filled"
                id="year_died"
                label="Year Died"
                value={values.year_died}
                onChange={handleChange("year_died")}
                error={error.year_died ? true : false}
                helperText={error.year_died}
              />
            </FormControl>

            {/* User phone */}
            {console.log("user data", data)}
            <FormControl>
              <InputLabel id="sub_type">Phone</InputLabel>
              <Select
                labelId="Phone"
                label="Phone"
                variant="filled"
                defaultValue=""
                value={values.fk_user_id}
                onChange={handleChange("fk_user_id")}
              >
                <MenuItem value="" disabled>
                  Value
                </MenuItem>
                {Array.isArray(data.users)
                  ? data.users
                      .filter((users) => users.users_artist.length === 0)
                      .map((user) => (
                        <MenuItem key={user.id} value={user.id}>
                          {user.phone}
                        </MenuItem>
                      ))
                  : null}
              </Select>
              {error.phone && (
                <FormHelperText error>{error.phone}</FormHelperText>
              )}
            </FormControl>
            {/* Biography */}
            <Box className="description">
              <InputLabel style={{ marginBottom: 10, fontWeight: "bold" }}>
                Biography
              </InputLabel>
              <RichTextEditor
                className="description-text"
                onChange={onChange}
                value={textValue}
                toolbarConfig={toolbarConfig}
              />
              {error.biography && (
                <FormHelperText error> {error.biography}</FormHelperText>
              )}
            </Box>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "end", m: "2rem" }}>
            <LoadingButton
              variant="contained"
              onClick={handleCreate}
              loading={loading}
            >
              Create
            </LoadingButton>
          </Box>
        </CardContent>
      </Card>
    </>
  );
};

export default CreateArtistByPhone;
