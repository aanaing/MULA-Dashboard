import { useMutation, useQuery } from "@apollo/client";
import {
  CardActionArea,
  CardContent,
  FormControl,
  InputLabel,
  Typography,
  Button,
  Card,
  Breadcrumbs,
  CardActions,
  FormHelperText,
  Select,
  Box,
  MenuItem,
  useScrollTrigger,
  FormLabel,
} from "@mui/material";
import { useDebugValue, useState } from "react";
import { ADD_RESELLER, ALL_RESELLER, USERID } from "../../gql/reseller";
import RichTextEditor from "react-rte";
import { LoadingButton } from "@mui/lab";
import { useNavigate } from "react-router-dom";

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

const CreateReseller = () => {
  const navigate = useNavigate();

  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [textValue, setTextValue] = useState(RichTextEditor.createEmptyValue());
  const [textValueMM, setTextValueMM] = useState(
    RichTextEditor.createEmptyValue()
  );
  const { data: userData } = useQuery(USERID);

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const onChange = (value) => {
    setTextValue(value);
    setValues({ ...values, biography: value.toString("html") });
  };
  const onChangeMM = (value) => {
    setTextValueMM(value);
    setValues({ ...values, biography_mm: value.toString("html") });
  };
  const [addReseller] = useMutation(ADD_RESELLER, {
    onError: (err) => {
      alert("Error on Server");
    },
    onCompleted: (result) => {
      setValues({});
      setTextValue(RichTextEditor.createEmptyValue());
      alert("New Reseller has been added");
      navigate("/reseller");
    },
    refetchQueries: [ALL_RESELLER],
  });

  const handleCreate = (e) => {
    let isErrorExit = false;
    let errorObject = {};

    if (!values.fk_user_id) {
      isErrorExit = true;
      errorObject.fk_user_id = "Reseller User is required";
    }

    if (!values.biography) {
      isErrorExit = true;
      errorObject.biography = "Biography is required";
    }

    if (isErrorExit) {
      setErrors(errorObject);

      return;
    }
    try {
    } catch (error) {
      console.log("Error ", error);
    }
    addReseller({ variables: { ...values } });
  };
  console.log("vlaues data is ", values);

  if (!userData) {
    return;
  }
  return (
    <>
      {/* <Box
        role="presentation"
        sx={{ display: "flex", justifyContent: "space-between", p: 2 }}
      >
        <Typography fontWeight="bold" variant="h6">
          Create Reseller
        </Typography>
        <Button
          color="warning"
          variant="contained"
          onClick={() => navigate("/reseller")}
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
              <Typography variant="h6">Mula Dashboard (Reseller)</Typography>

              {/* </Link> */}
              {/* <span>ArtWork</span> */}
            </Breadcrumbs>
            <Typography>Main / Reseller</Typography>
          </div>
        </div>
        <CardContent sx={{ p: "2rem" }}>
          <Box
            sx={{
              display: "grid",
              rowGap: "2rem",
            }}
          >
            {/* Reseller User  */}
            <FormControl>
              <FormLabel style={{ fontWeight: "bold" }}>
                Reseller User
              </FormLabel>
              <Select
                style={{ height: "50px" }}
                labelId="fk_user_id"
                displayEmpty
                inputProps={{ "aria-label": "Without label" }}
                variant="outlined"
                defaultValue=""
                //value={values.fk_medium_type_id}
                onChange={handleChange("fk_user_id")}
              >
                <MenuItem value="" disabled>
                  Enter Value
                </MenuItem>
                {Array.isArray(userData.users)
                  ? userData.users
                      .filter((users) => users.users_resellers?.length === 0)
                      .map((user) => (
                        <MenuItem key={user.id} value={user.id}>
                          {user.fullname}
                        </MenuItem>
                      ))
                  : null}
              </Select>

              {errors.fk_user_id && (
                <FormHelperText error>{errors.fk_user_id}</FormHelperText>
              )}
            </FormControl>

            <Box display="grid" gridTemplateColumns="1fr 1fr" columnGap="2rem">
              {/* biography */}
              <Box>
                <InputLabel style={{ marginBottom: 10, fontWeight: "bold" }}>
                  Biography
                </InputLabel>
                <RichTextEditor
                  className="description-text"
                  onChange={onChange}
                  value={textValue}
                  toolbarConfig={toolbarConfig}
                />
                {errors.biography && (
                  <FormHelperText error> {errors.biography}</FormHelperText>
                )}
              </Box>
              {/* biography MM */}
              <Box>
                <InputLabel style={{ marginBottom: 10, fontWeight: "bold" }}>
                  Biography MM
                </InputLabel>
                <RichTextEditor
                  className="description-text"
                  onChange={onChangeMM}
                  value={textValueMM}
                  toolbarConfig={toolbarConfig}
                />
                {errors.biography_mm && (
                  <FormHelperText error> {errors.biography_mm}</FormHelperText>
                )}
              </Box>
            </Box>
          </Box>
          <Box display="flex" justifyContent="flex-end" my="2rem">
            <LoadingButton variant="contained" onClick={handleCreate}>
              Create
            </LoadingButton>
          </Box>
        </CardContent>
      </Card>
    </>
  );
};
export default CreateReseller;
