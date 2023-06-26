import { useMutation, useQuery } from "@apollo/client";
import {
  CardActionArea,
  CardContent,
  FormControl,
  InputLabel,
  Typography,
  Button,
  Card,
  CardActions,
  FormHelperText,
  TextField,
  Select,
  Box,
  MenuItem,
  useScrollTrigger,
} from "@mui/material";
import { useDebugValue, useState } from "react";
import {
  ADD_RESELLER,
  ALL_RESELLER,
  USERBYPK,
  USERID,
} from "../../gql/reseller";
import RichTextEditor from "react-rte";
import { LoadingButton } from "@mui/lab";
import { useNavigate, useParams } from "react-router-dom";

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

const DirectCreateReseller = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [textValue, setTextValue] = useState(RichTextEditor.createEmptyValue());
  const [textValueMM, setTextValueMM] = useState(
    RichTextEditor.createEmptyValue()
  );
  const { data: userData } = useQuery(USERID);

  const { data: userDataPK } = useQuery(USERBYPK, { variables: { id: id } });

  // const handleChange = (prop) => (event) => {
  //   setValues({ ...values, [prop]: event.target.value });
  // };

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
      setLoading(false);
    },
    onCompleted: (result) => {
      setLoading(true);
      console.log("result ", result);
      setValues({});
      setTextValue(RichTextEditor.createEmptyValue());
      alert("New Reseller has been added");
      navigate("/reseller");
    },
    refetchQueries: [ALL_RESELLER],
  });

  const handleCreate = async (e) => {
    console.log("hiiiiii");
    let isErrorExit = false;
    let errorObject = {};

    if (!values.biography) {
      isErrorExit = true;
      errorObject.biography = "Biography is required";
    }

    if (isErrorExit) {
      setErrors(errorObject);
      console.log("errorObj", errorObject);
      return;
    }
    try {
      await addReseller({
        variables: { ...values, fk_user_id: userDataPK.users_by_pk.id },
      });
    } catch (error) {
      console.log("Error on Server ", error);
    }
  };

  if (!userData) {
    return;
  }
  if (!userDataPK) {
    return;
  }
  return (
    <>
      <Box
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
      </Box>
      <Card>
        <CardContent sx={{ p: "2rem" }}>
          {/* user id */}
          <Box
            sx={{
              display: "grid",
              gap: "2rem",
            }}
          >
            <FormControl>
              <TextField
                variant="filled"
                id="fk_user_id"
                label="Reseller User"
                value={userDataPK.users_by_pk.fullname}
              />
            </FormControl>

            <Box display="grid" gridTemplateColumns="1fr 1fr" columnGap="2rem">
              {/* biography */}
              <Box>
                <InputLabel style={{ marginBottom: 10, fontWeight: "bold" }}>
                  biography
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
export default DirectCreateReseller;
