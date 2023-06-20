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
  TextareaAutosize,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import { IMAGE_UPLOAD } from "../../gql/image";
import RichTextEditor from "react-rte";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import {
  ARTIST_NAME,
  DIMENSIONS,
  ARTWORK_TYPE,
  OWNERSHIP,
  ART_SERIES,
  ADD_ARTWORK,
  UPDATE_ARTWORK,
  ARTWORKS,
} from "../../gql/artwork";
import { useLazyQuery, useQuery, useMutation } from "@apollo/client";
import imageService from "../../services/image";
import { ARTWORK_ID } from "../../gql/artwork";

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

const UpdateArtWork = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState("");
  const [imageFileUrl, setImageFileUrl] = useState("");

  const [height, setheight] = useState();
  const [width, setWidth] = useState();
  const [unit, setUnit] = useState();

  const [textValue, setTextValue] = useState(RichTextEditor.createEmptyValue());

  const { data: dimensionData } = useQuery(DIMENSIONS);
  const { data: typeData } = useQuery(ARTWORK_TYPE);
  const { data: ownershipData } = useQuery(OWNERSHIP);
  const { data: seriesData } = useQuery(ART_SERIES);
  const { data: nameData } = useQuery(ARTIST_NAME);

  const [loadArtwork, resultArtwork] = useLazyQuery(ARTWORK_ID);
  console.log("resultartwork", resultArtwork);

  useEffect(() => {
    loadArtwork({ variables: { id: id } });
  }, [loadArtwork]);

  useEffect(() => {
    if (resultArtwork.data) {
      setValues({
        id: resultArtwork.data.traditional_art_work_by_pk.id ?? "",
        artwork_image_url:
          resultArtwork.data.traditional_art_work_by_pk.artwork_image_url ?? "",
        artwork_name:
          resultArtwork.data.traditional_art_work_by_pk.artwork_name ?? "",
        artwork_year:
          resultArtwork.data.traditional_art_work_by_pk.artwork_year ?? "",
        current_price:
          resultArtwork.data.traditional_art_work_by_pk.current_price ?? "",
        disabled: false,
        fk_artist_id:
          resultArtwork.data.traditional_art_work_by_pk.fk_artist_id ?? "",
        fk_medium_type_id:
          resultArtwork.data.traditional_art_work_by_pk.fk_medium_type_id ?? "",
        fk_ownership_id:
          resultArtwork.data.traditional_art_work_by_pk.fk_ownership_id ?? "",
        height: resultArtwork.data.traditional_art_work_by_pk.height ?? "",
        pending: true,
        update_price:
          resultArtwork.data.traditional_art_work_by_pk.update_price ?? "",
        width: resultArtwork.data.traditional_art_work_by_pk.width ?? "",
        fk_dimension:
          resultArtwork.data.traditional_art_work_by_pk.fk_dimension ?? "",
      });
      setImagePreview(
        resultArtwork.data.traditional_art_work_by_pk.artwork_image_url
      );
      setTextValue(
        RichTextEditor.createValueFromString(
          resultArtwork.data.traditional_art_work_by_pk.description,
          "html"
        )
      );
    }
  }, [resultArtwork]);

  console.log("values ", values);

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

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
        artwork_image_url: `https://axra.sgp1.digitaloceanspaces.com/Mula/${result.getImageUploadUrl.imageName}`,
      });
    },
  });

  const chooseImage = async (e) => {
    if (e.target.files && e.target.files[0]) {
      let image = e.target.files[0];
      if (!imageType.includes(image.type)) {
        // setErrors({
        //   ...error,
        //   artist_profile_image_url: "Please Select image (png,jpeg)",
        // });
        return;
      }
      if (image.size > 10485760) {
        // setErrors({
        //   ...error,
        //   artist_profile_image_url: "Image size must be smaller than 10MB",
        // });
        return;
      }

      setImageFile(image);
      setImagePreview(URL.createObjectURL(image));
      getImageUrl({ variables: { contentType: "image/*" } });
    }
  };

  const [update_artwork] = useMutation(UPDATE_ARTWORK, {
    onError: (err) => {
      alert("Error on server");
    },
    onCompleted: (result) => {
      setLoading(false);
      setTextValue(RichTextEditor.createEmptyValue());
      setValues({});
      alert("New Artwork has been updated");
      navigate("/art_work");
    },
    refetchQueries: [ARTWORKS],
  });

  const onChange = (value) => {
    setTextValue(value);
    setValues({ ...values, description: value.toString("html") });
  };

  const handleUpdate = async () => {
    setLoading(true);
    let isErrorExit = false;
    let errorObject = {};
    if (!values.artwork_name) {
      isErrorExit = true;
      errorObject.artwork_name = "artwork name is required";
    }
    if (!values.artwork_image_url) {
      isErrorExit = true;
      errorObject.artwork_image_url = "artwork_image_url is required";
    }
    if (!values.current_price) {
      isErrorExit = true;
      errorObject.current_price = "current_price is required";
    }
    if (!values.update_price) {
      isErrorExit = true;
      errorObject.update_price = "update_price is required";
    }
    if (!values.description) {
      isErrorExit = true;
      errorObject.description = "description  is required";
    }

    if (!values.artwork_year) {
      isErrorExit = true;
      errorObject.artwork_year = "artwork_year is required";
    }
    if (!values.fk_medium_type_id) {
      isErrorExit = true;
      errorObject.fk_medium_type_id = "artwork_type is required";
    }
    if (!values.fk_ownership_id) {
      isErrorExit = true;
      errorObject.fk_ownership_id = "ownership is required";
    }
    if (!values.fk_artist_id) {
      isErrorExit = true;
      errorObject.fk_artist_id = "artist name  is required";
    }
    // if (!values.height) {
    //   isErrorExit = true;
    //   errorObject.height = "height is required";
    // }
    // if (!values.width) {
    //   isErrorExit = true;
    //   errorObject.width = "width is required";
    // }

    if (isErrorExit) {
      setErrors(errorObject);
      setLoading(false);
      return;
    }

    try {
      await imageService.uploadImage(imageFileUrl, imageFile);
      await update_artwork({
        variables: {
          ...values,
          pending: false,
          height: values.height,
          width: values.width,
          fk_dimension: values.fk_dimension,
          disabled: false,
          dimensions: "",
        },
      });
    } catch (error) {
      console.log("Error ", error);
    }
  };

  if (
    !typeData ||
    !seriesData ||
    !dimensionData ||
    !ownershipData ||
    !nameData
  ) {
    return "no data";
  }

  if (!resultArtwork) {
    return "no data";
  }
  console.log("values.description", values.fk_dimension);
  return (
    <>
      <Box
        role="presentation"
        sx={{ display: "flex", justifyContent: "space-between", p: 2 }}
      >
        <Typography fontWeight="bold" variant="h6">
          Update Artwork
        </Typography>
        <Button
          color="warning"
          variant="contained"
          onClick={() => navigate("/art_work")}
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
                error={errors["artwork_image_url"]}
                FormHelperText={errors["artwork_image_url"]}
              />
            </Button>
            <FormHelperText error>{errors["artwork_image_url"]}</FormHelperText>
          </FormControl>
          {values && (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr 1fr",
                columnGap: "2rem",
                rowGap: "3rem",
                px: "0.5rem",
              }}
            >
              {/* Artwork Name */}
              <FormControl>
                <TextField
                  variant="filled"
                  id="artwork_name"
                  label="Artwork Name"
                  value={values.artwork_name}
                  onChange={handleChange("artwork_name")}
                  error={errors.artwork_name ? true : false}
                  helperText={errors.artwork_name}
                />
              </FormControl>
              {/* artwork_year */}
              <FormControl>
                <TextField
                  type="number"
                  variant="filled"
                  id="artwork_year"
                  label="artwork_year"
                  value={values.artwork_year}
                  onChange={handleChange("artwork_year")}
                  error={errors.artwork_year ? true : false}
                  helperText={errors.artwork_year}
                />
              </FormControl>
              {/* current_price */}
              <FormControl>
                <TextField
                  type="number"
                  variant="filled"
                  id="current_price"
                  label="current_price"
                  value={values.current_price}
                  onChange={handleChange("current_price")}
                  error={errors.current_price ? true : false}
                  helperText={errors.current_price}
                />
              </FormControl>

              {/* update_price */}
              <FormControl>
                <TextField
                  type="number"
                  variant="filled"
                  id="update_price"
                  label="update_price"
                  value={values.update_price}
                  onChange={handleChange("update_price")}
                  error={errors.update_price ? true : false}
                  helperText={errors.update_price}
                />
              </FormControl>

              {/* artwork_type */}
              {values.fk_medium_type_id && (
                <FormControl>
                  <InputLabel id="sub_type">artwork_type</InputLabel>
                  <Select
                    labelId="fk_medium_type_id"
                    label="artwork_type"
                    variant="filled"
                    defaultValue=""
                    value={values.fk_medium_type_id}
                    onChange={handleChange("fk_medium_type_id")}
                  >
                    <MenuItem value="" disabled>
                      Value
                    </MenuItem>
                    {Array.isArray(typeData.artwork_medium_type)
                      ? typeData.artwork_medium_type.map((type) => (
                          <MenuItem key={type.id} value={type.id}>
                            {type.medium_name}
                          </MenuItem>
                        ))
                      : null}
                  </Select>

                  {errors.fk_medium_type_id && (
                    <FormHelperText error>
                      {errors.fk_medium_type_id}
                    </FormHelperText>
                  )}
                </FormControl>
              )}

              {/* artist */}
              {values.fk_artist_id && (
                <FormControl>
                  <InputLabel id="sub_type">Artist Name</InputLabel>
                  <Select
                    labelId="artist"
                    label="artist"
                    variant="filled"
                    defaultValue=""
                    value={values.fk_artist_id}
                    onChange={handleChange("fk_artist_id")}
                  >
                    <MenuItem value="" disabled>
                      Value
                    </MenuItem>
                    {Array.isArray(nameData.artist)
                      ? nameData.artist.map((ast) => (
                          <MenuItem key={ast.id} value={ast.id}>
                            {ast.artist_name}
                          </MenuItem>
                        ))
                      : null}
                  </Select>
                  {errors.fk_artist_id && (
                    <FormHelperText error>{errors.fk_artist_id}</FormHelperText>
                  )}
                </FormControl>
              )}
              {/* ownership */}
              {values.fk_ownership_id && (
                <FormControl>
                  <InputLabel id="sub_type">Ownership</InputLabel>
                  <Select
                    labelId="fk_ownership_id"
                    label="artist"
                    variant="filled"
                    defaultValue=""
                    value={values.fk_ownership_id}
                    onChange={handleChange("fk_ownership_id")}
                  >
                    <MenuItem value="" disabled>
                      Value
                    </MenuItem>

                    {Array.isArray(ownershipData.users)
                      ? ownershipData.users.map((user) => (
                          <MenuItem key={user.id} value={user.id}>
                            {user.fullname}
                          </MenuItem>
                        ))
                      : null}
                  </Select>
                  {errors.fk_ownership_id && (
                    <FormHelperText error>
                      {errors.fk_ownership_id}
                    </FormHelperText>
                  )}
                </FormControl>
              )}
              {/* dimensions */}

              {values.height && (
                <FormControl>
                  <div className="grid_3_cols">
                    <TextField
                      id="sub_type"
                      variant="filled"
                      placeholder="height"
                      value={values.height}
                      onChange={(e) => setheight(e.target.value)}
                      error={errors.height ? true : false}
                      helperText={errors.height}
                    />
                    <TextField
                      id="sub_type"
                      variant="filled"
                      placeholder="Width"
                      value={values.width}
                      onChange={(e) => setWidth(e.target.value)}
                      error={errors.width ? true : false}
                      helperText={errors.width}
                    />
                    <Select
                      labelId="width"
                      label="Width"
                      variant="filled"
                      value={values.fk_dimension}
                      defaultValue=""
                      onChange={(e) => setUnit(e.target.value)}
                    >
                      <MenuItem value="" disabled>
                        Value
                      </MenuItem>
                      {Array.isArray(dimensionData.artwork_dimensions)
                        ? dimensionData.artwork_dimensions.map((dimension) => (
                            <MenuItem key={dimension.id} value={dimension.id}>
                              {dimension.dimension_name}
                            </MenuItem>
                          ))
                        : null}
                    </Select>
                  </div>
                </FormControl>
              )}

              {/* art_series */}
              <FormControl>
                <InputLabel id="sub_type">art_series</InputLabel>
                <Select
                  labelId="artist"
                  label="artist"
                  variant="filled"
                  defaultValue=""
                >
                  <MenuItem value="" disabled>
                    Value
                  </MenuItem>
                  {Array.isArray(seriesData.art_series)
                    ? seriesData.art_series.map((series) => (
                        <MenuItem key={series.id} value={series.id}>
                          {series.series_name}
                        </MenuItem>
                      ))
                    : null}
                </Select>
                {/* {errors.data.users.username && (
                  <FormHelperText error>{errors.user}</FormHelperText>
                )} */}
              </FormControl>
              {/* description */}
              <Box className="description">
                <InputLabel style={{ marginBottom: 10, fontWeight: "bold" }}>
                  Description
                </InputLabel>
                <RichTextEditor
                  className="description-text"
                  onChange={onChange}
                  value={textValue}
                  toolbarConfig={toolbarConfig}
                />
                {errors.description && (
                  <FormHelperText error> {errors.description}</FormHelperText>
                )}
              </Box>
            </Box>
          )}

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

export default UpdateArtWork;