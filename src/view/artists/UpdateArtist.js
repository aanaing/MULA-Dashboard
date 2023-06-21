import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import {
  USER_ID,
  UPDATE_ARTIST,
  ARTIST_ID,
  USER,
  ARTIST,
} from "../../gql/artist";
import { IMAGE_UPLOAD } from "../../gql/image";
import imageService from "../../services/image";
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
  InputLabel,
  FormHelperText,
  Select,
  MenuItem,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

const UpdateArtist = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [values, setValues] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [imageFile, setImageFile] = useState("");
  const [imageFileUrl, setImageFileUrl] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  const [textValue, setTextValue] = useState(RichTextEditor.createEmptyValue());

  const { data } = useQuery(USER);

  const [loadArtistId, getArtistData] = useLazyQuery(ARTIST_ID);
  console.log("artist data", getArtistData);
  useEffect(() => {
    loadArtistId({ variables: { id: id } });
  }, [loadArtistId]);

  useEffect(() => {
    if (getArtistData.data) {
      setImagePreview(
        getArtistData.data.artist_by_pk.artist_profile_image_url ?? ""
      );
      setValues({
        id: getArtistData.data.artist_by_pk.id,
        artist_profile_image_url:
          getArtistData.data.artist_by_pk.artist_profile_image_url ?? "",
        artist_name: getArtistData.data.artist_by_pk.artist_name ?? "",

        year_born: getArtistData.data.artist_by_pk.year_born ?? "",
        year_died: getArtistData.data.artist_by_pk.year_died ?? "",
        fk_user_id: getArtistData.data.artist_by_pk.fk_user_id ?? "",
      });
      setTextValue(
        RichTextEditor.createValueFromString(
          getArtistData.data.artist_by_pk.biography,
          "html"
        )
      );
    }
  }, [getArtistData]);

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

  const onChange = (value) => {
    setTextValue(value);
    setValues({ ...values, biography: value.toString("html") });
  };

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

      setImageFile(image);
      setImagePreview(URL.createObjectURL(image));
      getImageUrl({ variables: { contentType: "image/*" } });
    }
  };

  const [update_artist] = useMutation(UPDATE_ARTIST, {
    onError: (err) => {
      alert("Error on Server");
    },
    onCompleted: (data) => {
      setLoading(false);
      console.log("data is ", data);
      setValues({ ...values });
      alert("Artist had been updated");
      navigate(`/artist`);
    },
    refetchQueries: [ARTIST],
  });

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };
  const handleUpdate = async () => {
    setLoading(true);
    setError({});
    try {
      await imageService.uploadImage(imageFileUrl, imageFile);
      await update_artist({ variables: { ...values } });
    } catch (error) {
      console.log("Error ", error);
    }
  };

  if (!data) {
    return;
  }
  if (!getArtistData) {
    return;
  }
  return (
    <>
      <Box
        role="presentation"
        sx={{ display: "flex", justifyContent: "space-between", p: 2 }}
      >
        <Typography fontWeight="bold" variant="h6">
          Update Artist
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
              gap: 3,
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

            {values.fk_user_id && (
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
                    ? data.users.map((user) => (
                        <MenuItem key={user.id} value={user.id}>
                          {user.phone}
                        </MenuItem>
                      ))
                    : null}
                </Select>
                {error.fk_user_id && (
                  <FormHelperText error>{error.fk_user_id}</FormHelperText>
                )}
              </FormControl>
            )}

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
              onClick={handleUpdate}
              loading={loading}
            >
              Update
            </LoadingButton>
          </Box>
        </CardContent>
      </Card>
    </>
  );
};
export default UpdateArtist;
