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
  Select,
  MenuItem,
  FormHelperText,
  InputLabel,
  Breadcrumbs,
  Paper,
  TextareaAutosize,
  FormControlLabel,
  Checkbox,
  FormLabel,
} from "@mui/material";
import CloudUploadSharpIcon from "@mui/icons-material/CloudUploadSharp";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import { IMAGE_UPLOAD, DELETE_IMAGE } from "../../gql/image";
import RichTextEditor from "react-rte";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { Link } from "react-router-dom";
import {
  ADMIN_ID,
  ALL_EVENTS,
  CREATE_EVENT,
  ONE_EVENT,
  UPDATE_EVENT,
} from "../../gql/event";
import { useLazyQuery, useQuery, useMutation } from "@apollo/client";
import imageService from "../../services/image";

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

const UpdateEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [values, setValues] = useState({});
  const [dates, setDates] = useState();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});

  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState("");
  const [imageFileUrl, setImageFileUrl] = useState("");
  const [isImageChange, setIsImageChange] = useState(false);
  const [oldImageName, setOldImageName] = useState("");

  const [textValue, setTextValue] = useState(RichTextEditor.createEmptyValue());
  const [textValueMM, setTextValueMM] = useState(
    RichTextEditor.createEmptyValue()
  );

  const { data } = useQuery(ADMIN_ID);

  const [loadEvent, resultEvent] = useLazyQuery(ONE_EVENT);

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  useEffect(() => {
    loadEvent({ variables: { id: id } });
  }, [loadEvent]);
  useEffect(() => {
    if (resultEvent.data) {
      console.log("result event", resultEvent);
      setValues({
        id: resultEvent?.data.event_by_pk.id,
        event_name: resultEvent?.data.event_by_pk.event_name,
        event_name_mm: resultEvent?.data.event_by_pk.event_name_mm,
        event_date_time: resultEvent?.data.event_by_pk.event_date_time,
        event_location: resultEvent?.data.event_by_pk.event_location,
        event_location_mm: resultEvent?.data.event_by_pk.event_location_mm,
        event_description: resultEvent?.data.event_by_pk.event_description,
        event_description_mm:
          resultEvent?.data.event_by_pk.event_description_mm,
        fk_admin_id: resultEvent?.data.event_by_pk.fk_admin_id,
        event_thumbnail_url: resultEvent?.data.event_by_pk.event_thumbnail_url,
      });

      setTextValue(
        RichTextEditor.createValueFromString(
          resultEvent.data.event_by_pk.event_description,
          "html"
        )
      );
      setTextValueMM(
        RichTextEditor.createValueFromString(
          resultEvent.data.event_by_pk.event_description_mm,
          "html"
        )
      );
      setImagePreview(resultEvent?.data.event_by_pk.event_thumbnail_url);
      let image = resultEvent.data.event_by_pk.event_thumbnail_url;
      setOldImageName(
        image.substring(image.lastIndexOf("/") + 1, image.lenght)
      );
    }
  }, [resultEvent]);

  //for image upload
  const [getImageUrl] = useMutation(IMAGE_UPLOAD, {
    onError: (error) => {
      // alert("Error on Server");
      console.log("error ", error);
    },
    onCompleted: (result) => {
      setImageFileUrl(result.getImageUploadUrl.imageUploadUrl);
      setIsImageChange(true);
      setValues({
        ...values,
        event_thumbnail_url: `https://axra.sgp1.digitaloceanspaces.com/Mula/${result.getImageUploadUrl.imageName}`,
      });
    },
  });

  const chooseImage = async (e) => {
    if (e.target.files && e.target.files[0]) {
      let image = e.target.files[0];
      if (!imageType.includes(image.type)) {
        setError({
          ...error,
          event_thumbnail_url: "Please Select image (png,jpeg)",
        });
        return;
      }
      if (image.size > 10485760) {
        setError({
          ...error,
          event_thumbnail_url: "Image size must be smaller than 10MB",
        });
        return;
      }
      setImageFile(image);
      setImagePreview(URL.createObjectURL(image));
      getImageUrl({ variables: { contentType: "image/*" } });
    }
  };

  const [delete_image] = useMutation(DELETE_IMAGE, {
    onError: (err) => {
      // alert("Error on Server");
      setLoading(false);
    },
  });

  const [update_event] = useMutation(UPDATE_EVENT, {
    onError: (err) => {
      alert("Error on server");
      setLoading(false);
    },

    onCompleted: (result) => {
      setLoading(false);
      setTextValue(RichTextEditor.createEmptyValue());
      setValues({});
      alert("New Event has been Updated");
      navigate(-1);
    },

    refetchQueries: [ALL_EVENTS],
  });

  const onChange = (value) => {
    setTextValue(value);
    setValues({ ...values, event_description: value.toString("html") });
  };
  const onChangeMM = (value) => {
    setTextValueMM(value);
    setValues({ ...values, event_description_mm: value.toString("html") });
  };

  const handleUpdate = async () => {
    setLoading(true);
    let isErrorExit = false;
    let errorObject = {};
    if (!values.event_name) {
      isErrorExit = true;
      errorObject.event_name = "Event name is required";
    }
    if (!values.event_thumbnail_url) {
      isErrorExit = true;
      errorObject.event_thumbnail_url = "Image url is required";
    }
    if (!values.event_name_mm) {
      isErrorExit = true;
      errorObject.event_name_mm = "event_name_mm is required";
    }
    if (!values.event_date_time) {
      isErrorExit = true;
      errorObject.event_date_time = "event_date_time is required";
    }
    if (!values.fk_admin_id) {
      isErrorExit = true;
      errorObject.fk_admin_id = "Admin ID is required";
    }
    if (!values.event_location) {
      isErrorExit = true;
      errorObject.event_location = "event_location  is required";
    }

    if (!values.event_location_mm) {
      isErrorExit = true;
      errorObject.event_location_mm = "event_location_mm is required";
    }
    if (!values.event_description) {
      isErrorExit = true;
      errorObject.event_description = "event_description is required";
    }
    if (!values.event_description_mm) {
      isErrorExit = true;
      errorObject.event_description_mm = "event_description_mm is required";
    }

    if (isErrorExit) {
      console.log("err obj", errorObject);
      setError(errorObject);
      setLoading(false);
      return;
    }

    try {
      if (isImageChange) {
        await imageService.uploadImage(imageFileUrl, imageFile);
        await delete_image({ variables: { image_name: oldImageName } });
      }
      await update_event({
        variables: {
          ...values,
        },
      });
    } catch (error) {
      console.log("Error ", error);
    }
  };

  if (!data) {
    return;
  }

  return (
    <>
      {/* <Box
          role="presentation"
          sx={{ display: "flex", justifyContent: "space-between", p: 2 }}
        >
          <Typography fontWeight="bold" variant="h6">
            Create Artwork
          </Typography>
          <Button
            color="warning"
            variant="contained"
            onClick={() => navigate("/art_work")}
          >
            Close
          </Button>
        </Box> */}

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
              <Typography variant="h6">Mula Dashboard (Event)</Typography>

              {/* </Link> */}
              {/* <span>ArtWork</span> */}
            </Breadcrumbs>
            <Typography>Main / Event</Typography>
          </div>
        </div>
        <CardContent sx={{ p: 3 }} elevation={4}>
          <Box className="image">
            <CardMedia
              component="img"
              height="200px"
              image={imagePreview}
              // sx={{ my: 2 }}
            />
          </Box>
          <Box display="flex" justifyContent="center" mb="1rem">
            {/* image */}
            <FormControl
              sx={{
                maxWidth: "20%",
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
                Rendered size must be 1920 * 1080 px and Aspect ratio must be
                16:9Cli
              </Typography>
              <Button
                variant="contained"
                component="label"
                size="large"
                // sx={{ py: "0.5rem" }}
              >
                {/* <PhotoCamera /> */}
                <CloudUploadSharpIcon />
                <Typography sx={{ ml: 1 }}>Upload Image</Typography>
                <input
                  hidden
                  onChange={chooseImage}
                  accept="image/png, image/jpeg, image/jpg, image/gif, image/svg+xml"
                  type="file"
                  error={error["event_thumbnail_url"]}
                />
              </Button>
              <FormHelperText error>
                {error["event_thumbnail_url"]}
              </FormHelperText>
            </FormControl>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              px: "0.5rem",
              rowGap: "1rem",
              columnGap: "5rem",
              mb: "2rem",
            }}
          >
            {/* Artwork Name Eng */}
            <FormControl>
              <FormLabel sx={{ fontWeight: "bold" }}>Event Name Eng</FormLabel>
              <TextField
                variant="outlined"
                size="small"
                id="event_name"
                placeholder="Enter Value"
                value={values.event_name}
                onChange={handleChange("event_name")}
                error={error.event_name ? true : false}
                helperText={error.event_name}
              />
            </FormControl>

            {/* event Name MM */}
            <FormControl>
              <FormLabel style={{ fontWeight: "bold" }}>
                Event Name (MM)
              </FormLabel>
              <TextField
                size="small"
                variant="outlined"
                id="event_name_mm"
                placeholder="Enter Value"
                value={values.event_name_mm}
                onChange={handleChange("event_name_mm")}
                error={error.event_name_mm ? true : false}
                helperText={error.event_name_mm}
              />
            </FormControl>
            {/* Event Date time */}

            {values.event_date_time && (
              <FormControl>
                <FormLabel sx={{ fontWeight: "bold" }}>
                  Event Date Time
                </FormLabel>
                <TextField
                  variant="outlined"
                  size="small"
                  type="date"
                  id="event_date_time"
                  placeholder="Enter Value"
                  value={values.event_date_time}
                  onChange={handleChange("event_date_time")}
                  error={error.event_date_time ? true : false}
                  helperText={error.event_date_time}
                />
              </FormControl>
            )}

            {/* Admin ID */}
            {values.fk_admin_id && (
              <FormControl size="small">
                <FormLabel style={{ fontWeight: "bold" }}>Admin ID</FormLabel>
                {/* <InputLabel placeholder="Enter Value">Enter Value</InputLabel> */}
                <Select
                  displayEmpty
                  inputProps={{ "aria-label": "Without label" }}
                  variant="outlined"
                  defaultValue=""
                  value={values.fk_admin_id}
                  onChange={handleChange("fk_admin_id")}
                >
                  <MenuItem value="" disabled={true}>
                    Enter Value
                  </MenuItem>

                  {data.admin && Array.isArray(data.admin)
                    ? data.admin.map((row) => (
                        <MenuItem key={row.id} value={row.id}>
                          {row.id}
                        </MenuItem>
                      ))
                    : null}
                </Select>
                {error.fk_admin_id && (
                  <FormHelperText error>{error.fk_admin_id}</FormHelperText>
                )}
              </FormControl>
            )}

            {/* event_location eng */}
            <FormControl>
              <FormLabel style={{ fontWeight: "bold" }}>
                Event Location (Eng)
              </FormLabel>
              <TextField
                size="small"
                variant="outlined"
                id="event_location"
                placeholder="Enter Value"
                value={values.event_location}
                onChange={handleChange("event_location")}
                error={error.event_location ? true : false}
                helperText={error.event_location}
              />
            </FormControl>

            {/* event_location MM */}
            <FormControl>
              <FormLabel style={{ fontWeight: "bold" }}>
                Event Location (MM)
              </FormLabel>
              <TextField
                size="small"
                variant="outlined"
                id="event_location_mm"
                placeholder="Enter Value"
                value={values.event_location_mm}
                onChange={handleChange("event_location_mm")}
                error={error.event_location_mm ? true : false}
                helperText={error.event_location_mm}
              />
            </FormControl>
          </Box>

          <Box
            display="grid"
            gridTemplateColumns="1fr 1fr"
            rowGap="1rem"
            columnGap="5rem"
            px="0.5rem"
          >
            {/* description Eng */}
            <Box>
              <InputLabel style={{ marginBottom: 10, fontWeight: "bold" }}>
                Description (Eng)
              </InputLabel>
              <RichTextEditor
                className="description-text"
                onChange={onChange}
                value={textValue}
                toolbarConfig={toolbarConfig}
              />
              {error.event_description && (
                <FormHelperText error>
                  {" "}
                  {error.event_description}
                </FormHelperText>
              )}
            </Box>

            {/* description_mm */}
            <Box>
              <InputLabel style={{ marginBottom: 10, fontWeight: "bold" }}>
                Description (MM)
              </InputLabel>
              <RichTextEditor
                className="description-text"
                onChange={onChangeMM}
                value={textValueMM}
                toolbarConfig={toolbarConfig}
              />
              {error.event_description_mm && (
                <FormHelperText error>
                  {" "}
                  {error.event_description_mm}
                </FormHelperText>
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

export default UpdateEvent;
