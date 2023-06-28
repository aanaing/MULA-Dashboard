import {
  Button,
  Typography,
  Box,
  CardContent,
  CardMedia,
  Card,
  FormControl,
  TextField,
  Checkbox,
  FormControlLabel,
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
import { DELETE_IMAGE, IMAGE_UPLOAD } from "../../gql/image";
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
  ADD_ART_SERIES,
  ART_SERIES_BY_ARTWORK_ID,
  DELETE_ART_SERIES,
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
  const [open, setOpen] = useState(true);

  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState("");
  const [imageFileUrl, setImageFileUrl] = useState("");
  const [isImageChange, setImageChange] = useState(false);
  const [oldImageName, setOldImageName] = useState();

  const [height, setheight] = useState();
  const [width, setWidth] = useState();
  const [unit, setUnit] = useState();

  const [artistNameId, setArtistNameId] = useState();

  const [textValue, setTextValue] = useState(RichTextEditor.createEmptyValue());
  const [textValueMM, setTextValueMM] = useState(
    RichTextEditor.createEmptyValue()
  );
  const [checkedItems, setCheckedItems] = useState([]);
  const [isChecked, setIsChecked] = useState(false);

  const { data: dimensionData } = useQuery(DIMENSIONS);
  const { data: typeData } = useQuery(ARTWORK_TYPE);
  const { data: ownershipData } = useQuery(OWNERSHIP);
  const { data: nameData } = useQuery(ARTIST_NAME);
  const [loadArtwork, resultArtwork] = useLazyQuery(ARTWORK_ID);

  const { data: seriesData } = useQuery(ART_SERIES, {
    variables: { fk_artist_id: artistNameId },
  });

  const [seriesByArtworkItems, setSeriesByArtworkItems] = useState();
  const [loadSeriesDataByArtwork, resultSeriesDataByArtwork] = useLazyQuery(
    ART_SERIES_BY_ARTWORK_ID
  );

  const [valueChange, setValueChange] = useState();

  // const [seriesItems, setSeriesItems] = useState();
  // const [loadSeriesData, resultSeriesData] = useLazyQuery(ART_SERIES);

  useEffect(() => {
    loadArtwork({ variables: { id: id } });
  }, [loadArtwork]);

  useEffect(() => {
    if (resultArtwork.data) {
      console.log("result artwork", resultArtwork);
      setValues({
        id: resultArtwork.data.traditional_art_work_by_pk.id ?? "",
        artwork_image_url:
          resultArtwork.data.traditional_art_work_by_pk.artwork_image_url ?? "",
        artwork_name:
          resultArtwork.data.traditional_art_work_by_pk.artwork_name ?? "",
        artwork_name_mm:
          resultArtwork.data.traditional_art_work_by_pk.artwork_name_mm ?? "",
        description:
          resultArtwork.data.traditional_art_work_by_pk.description ?? "",
        description_mm:
          resultArtwork.data.traditional_art_work_by_pk.description_mm ?? "",
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
        pending: true,
        update_price:
          resultArtwork.data.traditional_art_work_by_pk.update_price ?? "",
        width: resultArtwork.data.traditional_art_work_by_pk.width ?? "",
        fk_dimension:
          resultArtwork.data.traditional_art_work_by_pk.fk_dimension ?? "",
      });
      // setArtistNameId(
      //   resultArtwork.data.traditional_art_work_by_pk
      //     .traditional_art_work_artist.id
      // );
      setheight(resultArtwork.data.traditional_art_work_by_pk.height ?? "");
      setWidth(resultArtwork.data.traditional_art_work_by_pk.width ?? "");
      setImagePreview(
        resultArtwork.data.traditional_art_work_by_pk.artwork_image_url
      );
      setTextValue(
        RichTextEditor.createValueFromString(
          resultArtwork.data.traditional_art_work_by_pk.description,
          "html"
        )
      );
      setTextValueMM(
        RichTextEditor.createValueFromString(
          resultArtwork.data.traditional_art_work_by_pk.description_mm,
          "html"
        )
      );
      let image =
        resultArtwork.data.traditional_art_work_by_pk.artwork_image_url;
      setOldImageName(
        image.substring(image.lastIndexOf("/") + 1, image.lenght)
      );
    }
  }, [resultArtwork]);

  useEffect(() => {
    // if (resultArtwork.data) {
    //   loadSeriesData({
    //     variables: {
    //       fk_artist_id:
    //         resultArtwork.data.traditional_art_work_by_pk
    //           .traditional_art_work_artist.id,
    //     },
    //   });
    // }

    if (resultArtwork.data) {
      loadSeriesDataByArtwork({
        variables: {
          fk_traditional_art_work_id:
            resultArtwork?.data.traditional_art_work_by_pk.id,
        },
      });
    }
  }, [loadSeriesDataByArtwork, resultArtwork]);

  useEffect(() => {
    // if (resultSeriesData.data) {
    //   setSeriesItems(resultSeriesData.data.art_series);
    // }
    if (resultSeriesDataByArtwork.data) {
      setSeriesByArtworkItems(resultSeriesDataByArtwork.data.artist_art_series);
      setIsChecked(true);
    }
  }, [resultSeriesDataByArtwork]);

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  //for image upload
  const [getImageUrl] = useMutation(IMAGE_UPLOAD, {
    onError: (error) => {
      alert("Error on Server");
    },
    onCompleted: (result) => {
      setImageFileUrl(result.getImageUploadUrl.imageUploadUrl);
      setImageChange(true);
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

  const [add_art_series] = useMutation(ADD_ART_SERIES, {
    onError: (err) => {
      setLoading(false);
      console.log("art series error ");
      alert("Error on Server");
    },
  });

  const [delete_art_series] = useMutation(DELETE_ART_SERIES, {
    onError: (err) => {
      console.log("Delete Error ", err);
      setLoading(false);
    },
  });
  console.log("checked item", checkedItems);

  const [update_artwork] = useMutation(UPDATE_ARTWORK, {
    onError: (err) => {
      alert("Error on server");
      setLoading(false);
      console.log("update artwork error", err);
    },
    onCompleted: (result) => {
      checkedItems.map((checkedItem) => {
        add_art_series({
          variables: {
            fk_art_series_id: checkedItem,
            fk_traditional_art_work_id:
              result.update_traditional_art_work_by_pk.id,
          },
        });

        if (resultArtwork.data) {
          delete_art_series({
            variables: {
              fk_traditional_art_work_id:
                resultArtwork?.data.traditional_art_work_by_pk.id,
            },
          });
        }
      });
      console.log("object", resultArtwork?.data.traditional_art_work_by_pk.id);
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
  const onChangeMM = (value) => {
    setTextValueMM(value);
    setValues({ ...values, description_mm: value.toString("html") });
  };

  const [delete_image] = useMutation(DELETE_IMAGE, {
    onError: (err) => {
      alert("Error on Server");
      setLoading(false);
    },
  });

  const handleUpdate = async () => {
    setLoading(true);
    try {
      if (isImageChange) {
        await imageService.uploadImage(imageFileUrl, imageFile);
        await delete_image({ variables: { image_name: oldImageName } });
      }

      await update_artwork({
        variables: {
          ...values,
          pending: false,
          height: height,
          width: width,
          fk_dimension: values.fk_dimension,
          disabled: false,
          dimensions: "",
        },
      });
    } catch (error) {
      console.log("catch error");
      console.log("Error ", error);
    }
  };

  const handleCheckboxChange = (id) => {
    const currentIndex = checkedItems.indexOf(id);
    const newCheckedItems = [...checkedItems];

    if (currentIndex === -1) {
      newCheckedItems.push(id);
    } else {
      newCheckedItems.splice(currentIndex, 1);
    }
    setCheckedItems(newCheckedItems);
  };

  const changeArtistName = (e) => {
    e.preventDefault();
    setArtistNameId(e.target.value);
    setSeriesByArtworkItems("");
    setValueChange(artistNameId);
  };

  if (
    !typeData ||
    !dimensionData ||
    !ownershipData ||
    !nameData ||
    !resultArtwork ||
    !resultSeriesDataByArtwork
  ) {
    return "no data";
  }
  console.log("values ", values);

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
                // error={error.artwork_name ? true : false}
                // helperText={error.artwork_name}
              />
            </FormControl>

            {/* Artwork Name */}
            <FormControl>
              <TextField
                variant="filled"
                id="artwork_name_mm"
                label="Artwork Name MM"
                value={values.artwork_name_mm}
                onChange={handleChange("artwork_name_mm")}
                // error={error.artwork_name_mm ? true : false}
                // helperText={error.artwork_name_mm}
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
                // error={error.artwork_year ? true : false}
                // helperText={error.artwork_year}
              />
            </FormControl>
            {/* current_price */}
            <FormControl>
              <TextField
                type="number"
                variant="outlined"
                id="current_price"
                label="current_price"
                value={values.current_price}
                onChange={handleChange("current_price")}
                // error={error.current_price ? true : false}
                // helperText={error.current_price}
              />
            </FormControl>
            {/* update_price */}
            <FormControl>
              <TextField
                type="number"
                variant="outlined"
                id="update_price"
                label="update_price"
                value={values.update_price}
                onChange={handleChange("update_price")}
                // error={error.update_price ? true : false}
                // helperText={error.update_price}
              />
            </FormControl>
            {/* artwork_type */}
            {values.fk_medium_type_id && (
              <FormControl>
                <InputLabel id="sub_type">Artwork_type</InputLabel>
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

                {/* {error.fk_medium_type_id && (
               <FormHelperText error>{error.fk_medium_type_id}</FormHelperText>
             )} */}
              </FormControl>
            )}

            {/* artist */}
            <FormControl>
              <InputLabel id="sub_type">Artist Name</InputLabel>
              <Select
                labelId="artist"
                label="artist"
                variant="filled"
                defaultValue=""
                // value={values.fk_artist_id}
                value={
                  resultArtwork?.data?.traditional_art_work_by_pk
                    .traditional_art_work_artist.id
                    ? values.fk_artist_id ?? values.fk_artist_id
                    : valueChange
                }
                onChange={changeArtistName}
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
            </FormControl>

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
                {/* {error.fk_ownership_id && (
            <FormHelperText error>{error.fk_ownership_id}</FormHelperText>
          )} */}
              </FormControl>
            )}

            {/* dimensions */}
            {values.fk_dimension && (
              <FormControl sx={{ width: "100%" }}>
                <div className="grid_3_cols">
                  <TextField
                    id="sub_type"
                    type="number"
                    variant="filled"
                    placeholder="height"
                    value={height}
                    onChange={(e) => setheight(e.target.value)}
                    // error={error.height ? true : false}
                    // helperText={error.height}
                  />
                  <TextField
                    id="sub_type"
                    type="number"
                    variant="filled"
                    placeholder="Width"
                    value={width}
                    onChange={(e) => setWidth(e.target.value)}
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
          </Box>

          {/* art_series */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr",
              my: "2rem",
              px: "1rem",
              flexWrap: "wrap",
            }}
          >
            {resultArtwork?.data?.traditional_art_work_by_pk
              .traditional_art_work_artist.id &&
              Array.isArray(seriesByArtworkItems) &&
              seriesByArtworkItems.map((series) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      name={series.artist_art_series_art_sery.series_name}
                    />
                  }
                  checked={isChecked}
                  open={open}
                  label={series.artist_art_series_art_sery.series_name}
                  onChange={() =>
                    handleCheckboxChange(series.artist_art_series_art_sery.id)
                  }
                />
              ))}
            {/* {Array.isArray(seriesItems) &&
              seriesItems.map((series) => (
                <FormControlLabel
                  control={<Checkbox name={series.series_name} />}
                  label={series.series_name}
                  onChange={() => handleCheckboxChange(series.id)}
                />
              ))} */}
            {seriesData &&
              seriesData.art_series.map((series, index) => (
                <FormControlLabel
                  control={<Checkbox name={series.series_name} />}
                  label={series.series_name}
                  onChange={() => handleCheckboxChange(series.id)}
                />
              ))}
          </Box>

          <Box display="flex" justifyContent="space-between" px="0.5rem">
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
              {/* {error.description && (
                <FormHelperText error> {error.description}</FormHelperText>
              )} */}
            </Box>

            {/* description_mm */}
            <Box className="description">
              <InputLabel style={{ marginBottom: 10, fontWeight: "bold" }}>
                Description MM
              </InputLabel>
              <RichTextEditor
                className="description-text"
                onChange={onChangeMM}
                value={textValueMM}
                toolbarConfig={toolbarConfig}
              />
              {/* {error.description_mm && (
                <FormHelperText error> {error.description_mm}</FormHelperText>
              )} */}
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

export default UpdateArtWork;
