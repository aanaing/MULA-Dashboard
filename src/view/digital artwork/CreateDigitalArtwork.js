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
import { IMAGE_UPLOAD } from "../../gql/image";
import RichTextEditor from "react-rte";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { Link } from "react-router-dom";
import {
  ARTIST_NAME,
  DIMENSIONS,
  ARTWORK_TYPE,
  OWNERSHIP,
  ART_SERIES,
  ADD_ARTWORK,
  ARTWORKS,
  ADD_ART_SERIES,
} from "../../gql/artwork";
import { useLazyQuery, useQuery, useMutation } from "@apollo/client";
import imageService from "../../services/image";
import {
  ADD_DIGITAL_ARTWORK,
  All_DIGITAL_ARTWORKS,
} from "../../gql/digitalArtwork";

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

const CreateDigitalArtwork = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [values, setValues] = useState({});

  const [artistNameId, setArtistNameId] = useState();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});

  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState("");
  const [imageFileUrl, setImageFileUrl] = useState("");

  // const [textValue, setTextValue] = useState(RichTextEditor.createEmptyValue());
  // const [textValueMM, setTextValueMM] = useState(
  //   RichTextEditor.createEmptyValue()
  // );
  // const [checkedItems, setCheckedItems] = useState([]);

  // const { data: dimensionData } = useQuery(DIMENSIONS);
  // const { data: typeData } = useQuery(ARTWORK_TYPE);
  // const { data: ownershipData } = useQuery(OWNERSHIP);
  // const { data: seriesData } = useQuery(ART_SERIES, {
  //   variables: { fk_artist_id: artistNameId },
  // });

  const { data: nameData } = useQuery(ARTIST_NAME);

  // const handleCheckboxChange = (id) => {
  //   const currentIndex = checkedItems.indexOf(id);
  //   const newCheckedItems = [...checkedItems];

  //   if (currentIndex === -1) {
  //     newCheckedItems.push(id);
  //   } else {
  //     newCheckedItems.splice(currentIndex, 1);
  //   }

  //   setCheckedItems(newCheckedItems);
  // };

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  //for image upload
  const [getImageUrl] = useMutation(IMAGE_UPLOAD, {
    onError: (error) => {
      alert("Error on Server");
      console.log("error ", error);
    },
    onCompleted: (result) => {
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

  const [add_artwork] = useMutation(ADD_DIGITAL_ARTWORK, {
    onError: (err) => {
      alert("Error on server");
      setLoading(false);
    },

    onCompleted: (result) => {
      //   checkedItems.map((checkedItem, index) => {
      //     add_art_series({
      //       variables: {
      //         fk_art_series_id: checkedItem,
      //         fk_traditional_art_work_id:
      //           result.insert_traditional_art_work_one.id,
      //       },
      //     });
      //   });
      setLoading(false);
      //   setTextValue(RichTextEditor.createEmptyValue());
      setValues({});
      alert("New Artwork has been added");
      navigate(-1);
    },

    refetchQueries: [All_DIGITAL_ARTWORKS],
  });

  const [add_art_series] = useMutation(ADD_ART_SERIES, {
    onError: (err) => {
      setLoading(false);
      console.log("Error ", err);
      alert("Error on Server");
    },
  });

  //   const onChange = (value) => {
  //     setTextValue(value);
  //     setValues({ ...values, description: value.toString("html") });
  //   };
  //   const onChangeMM = (value) => {
  //     setTextValueMM(value);
  //     setValues({ ...values, description_mm: value.toString("html") });
  //   };

  const handleCreate = async () => {
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
    // if (!values.description) {
    //   isErrorExit = true;
    //   errorObject.description = "description  is required";
    // }

    if (!values.artwork_year) {
      isErrorExit = true;
      errorObject.artwork_year = "artwork_year is required";
    }
    // if (!values.fk_medium_type_id) {
    //   isErrorExit = true;
    //   errorObject.fk_medium_type_id = "artwork_type is required";
    // }
    // if (!values.fk_ownership_id) {
    //   isErrorExit = true;
    //   errorObject.fk_ownership_id = "ownership is required";
    // }
    if (!artistNameId) {
      isErrorExit = true;
      errorObject.artistNameId = "artist name  is required";
    }
    // if (!height) {
    //   isErrorExit = true;
    //   errorObject.height = "height is required";
    // }
    // if (!width) {
    //   isErrorExit = true;
    //   errorObject.width = "width is required";
    // }

    if (isErrorExit) {
      console.log("err obj", errorObject);
      setError(errorObject);
      setLoading(false);
      return;
    }

    if (!artistNameId) {
      return;
    }

    try {
      await imageService.uploadImage(imageFileUrl, imageFile);
      await add_artwork({
        variables: {
          ...values,
          pending: false,
          current_price: Number(values.current_price),
          update_price: Number(values.update_price),
          disabled: false,
          fk_artist_id: artistNameId,
        },
      });
    } catch (error) {
      console.log("Error ", error);
    }
  };

  if (!nameData) {
    return "no data";
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
              <Typography variant="h6">Mula Dashboard (Artwork)</Typography>

              {/* </Link> */}
              {/* <span>ArtWork</span> */}
            </Breadcrumbs>
            <Typography>Main / Artwork</Typography>
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
                  error={error["artwork_image_url"]}
                />
              </Button>
              <FormHelperText error>
                {error["artwork_image_url"]}
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
            }}
          >
            {/* Artwork Name Eng */}
            <FormControl>
              <FormLabel sx={{ fontWeight: "bold" }}>
                Artwork Name Eng
              </FormLabel>
              <TextField
                InputProps={{ sx: { height: 50 } }}
                variant="outlined"
                id="artwork_name"
                placeholder="Enter Artwork Name (Eng)"
                value={values.artwork_name}
                onChange={handleChange("artwork_name")}
                error={error.artwork_name ? true : false}
                helperText={error.artwork_name}
              />
            </FormControl>

            <Box display="grid" gridTemplateColumns="60% 1fr" columnGap="3rem">
              {/* artist */}
              <FormControl>
                <FormLabel style={{ fontWeight: "bold" }}>
                  Artist Name
                </FormLabel>
                {/* <InputLabel placeholder="Enter Value">Enter Value</InputLabel> */}
                <Select
                  style={{ height: "50px" }}
                  displayEmpty
                  inputProps={{ "aria-label": "Without label" }}
                  variant="outlined"
                  defaultValue=""
                  value={artistNameId}
                  onChange={(e) => setArtistNameId(e.target.value)}
                >
                  <MenuItem value="" disabled={true}>
                    Enter Artist Name
                  </MenuItem>
                  {Array.isArray(nameData.artist)
                    ? nameData.artist.map((ast) => (
                        <MenuItem key={ast.id} value={ast.id}>
                          {ast.artist_name}
                        </MenuItem>
                      ))
                    : null}
                </Select>
                {error.fk_artist_id && (
                  <FormHelperText error>{error.fk_artist_id}</FormHelperText>
                )}
              </FormControl>

              {/* artwork_year */}
              <FormControl>
                <FormLabel style={{ fontWeight: "bold" }}>
                  Artwork Year
                </FormLabel>
                <TextField
                  InputProps={{ sx: { height: 50 } }}
                  type="number"
                  variant="outlined"
                  id="artwork_year"
                  placeholder="Enter Artwork Year"
                  value={values.artwork_year}
                  onChange={handleChange("artwork_year")}
                  error={error.artwork_year ? true : false}
                  helperText={error.artwork_year}
                />
              </FormControl>
            </Box>
            {/* Artwork Name MM */}
            <FormControl>
              <FormLabel style={{ fontWeight: "bold" }}>
                Artwork Name (MM)
              </FormLabel>
              <TextField
                InputProps={{ sx: { height: 50 } }}
                variant="outlined"
                id="artwork_name_mm"
                placeholder="Enter Artwork Name (MM)"
                value={values.artwork_name_mm}
                onChange={handleChange("artwork_name_mm")}
                error={error.artwork_name_mm ? true : false}
                helperText={error.artwork_name_mm}
              />
            </FormControl>
            <Box
              display="grid"
              gridTemplateColumns="1fr 1fr"
              columnGap="3.5rem"
            >
              {/* current_price */}
              <FormControl>
                <FormLabel style={{ fontWeight: "bold" }}>
                  Current Price
                </FormLabel>
                <TextField
                  InputProps={{ sx: { height: 50 } }}
                  type="number"
                  variant="outlined"
                  id="current_price"
                  placeholder="Enter Current Price"
                  value={values.current_price}
                  onChange={handleChange("current_price")}
                  error={error.current_price ? true : false}
                  helperText={error.current_price}
                />
              </FormControl>
              {/* update_price */}
              <FormControl>
                <FormLabel style={{ fontWeight: "bold" }}>
                  Update Price
                </FormLabel>
                <TextField
                  InputProps={{ sx: { height: 50 } }}
                  type="number"
                  variant="outlined"
                  id="update_price"
                  placeholder="Enter Update Price"
                  value={values.update_price}
                  onChange={handleChange("update_price")}
                  error={error.update_price ? true : false}
                  helperText={error.update_price}
                />
              </FormControl>
            </Box>
            {/* artwork_type */}
            {/* <FormControl>
              <FormLabel style={{ fontWeight: "bold" }}>Artwork Type</FormLabel>

              <Select
                style={{ height: "50px" }}
                labelId="fk_medium_type_id"
                displayEmpty
                inputProps={{ "aria-label": "Without label" }}
                variant="outlined"
                defaultValue=""
                value={values.fk_medium_type_id}
                onChange={handleChange("fk_medium_type_id")}
              >
                <MenuItem value="" disabled={true}>
                  Enter Value
                </MenuItem>
                {Array.isArray(typeData.artwork_medium_type)
                  ? typeData.artwork_medium_type.map((type) => (
                      <MenuItem key={type.id} value={type.id}>
                        {type.medium_name}
                      </MenuItem>
                    ))
                  : null}
              </Select>

              {error.fk_medium_type_id && (
                <FormHelperText error>{error.fk_medium_type_id}</FormHelperText>
              )}
            </FormControl> */}
            {/* dimensions */}
            {/* <div className="grid_3_cols">
              <FormControl>
                <FormLabel style={{ fontWeight: "bold" }}>Width</FormLabel>
                <TextField
                  InputProps={{ sx: { height: 50 } }}
                  id="sub_type"
                  variant="outlined"
                  // placeholder="Width"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  error={error.width ? true : false}
                  helperText={error.width}
                />
              </FormControl>

              <FormControl>
                <FormLabel style={{ fontWeight: "bold" }}>Height</FormLabel>
                <TextField
                  InputProps={{ sx: { height: 50 } }}
                  id="sub_type"
                  variant="outlined"
                  // placeholder="height"
                  value={height}
                  onChange={(e) => setheight(e.target.value)}
                  error={error.height ? true : false}
                  helperText={error.height}
                />
              </FormControl>
              <FormControl>
                <FormLabel style={{ fontWeight: "bold" }}>Unit</FormLabel>
                {/* <InputLabel>Unit</InputLabel> */}
            {/* <Select
                  style={{ height: "50px" }}
                  labelId="width"
                  // placeholder="Unit"
                  variant="outlined"
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
              </FormControl> */}
            {/* </Box> </div>  */}

            {/* ownership */}
            {/* <FormControl>
              <FormLabel style={{ fontWeight: "bold" }}>Ownership</FormLabel>
              {/* <InputLabel id="sub_type">Ownership</InputLabel> */}
            {/* <Select
              style={{ height: "50px" }}
              variant="outlined"
              defaultValue=""
              value={values.fk_ownership_id}
              onChange={handleChange("fk_ownership_id")}
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
            >
              <MenuItem value="" disabled={true} hidden>
                Enter Value
              </MenuItem>

              {Array.isArray(ownershipData.users)
                ? ownershipData.users.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.fullname}
                    </MenuItem>
                  ))
                : null}
            </Select>
            {error.fk_ownership_id && (
              <FormHelperText error>{error.fk_ownership_id}</FormHelperText>
            )} */}
            {/* </FormControl>  */}
            {/* art_series */}
            {/* <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr",
                px: "1rem",
                flexWrap: "wrap",
              }}
            >
              {seriesData &&
                seriesData.art_series.map((series, index) => (
                  <FormControlLabel
                    control={<Checkbox name={series.series_name} />}
                    label={series.series_name}
                    onChange={() => handleCheckboxChange(series.id)}
                  />
                ))}
            </Box> */}
          </Box>

          {/* <Box
            display="grid"
            gridTemplateColumns="1fr 1fr"
            rowGap="1rem"
            columnGap="5rem"
            px="0.5rem"
            py="2rem"
          >
            description Eng
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
              {error.description && (
                <FormHelperText error> {error.description}</FormHelperText>
              )}
            </Box>

            description_mm
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
              {error.description_mm && (
                <FormHelperText error> {error.description_mm}</FormHelperText>
              )}
            </Box>
          </Box> */}

          <Box sx={{ display: "flex", justifyContent: "end", m: "1rem" }}>
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

export default CreateDigitalArtwork;
