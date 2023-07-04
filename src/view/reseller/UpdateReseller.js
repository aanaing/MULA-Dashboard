import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import {
  CardActionArea,
  CardContent,
  FormControl,
  InputLabel,
  Card,
  Breadcrumbs,
  Typography,
  Button,
  CardActions,
  Select,
  Box,
  MenuItem,
  useScrollTrigger,
} from "@mui/material";
import { useDebugValue, useEffect, useState } from "react";
import {
  ADD_RESELLER,
  ALL_RESELLER,
  RESELLER_ID,
  UPDATE_RESELLER,
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

const UpdateReseller = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [values, setValues] = useState({});
  const [textValue, setTextValue] = useState(RichTextEditor.createEmptyValue());
  const [textValueMM, setTextValueMM] = useState(
    RichTextEditor.createEmptyValue()
  );

  const { data: userData } = useQuery(USERID);

  const [loadReseller, resultReseller] = useLazyQuery(RESELLER_ID);

  useEffect(() => {
    loadReseller({ variables: { id: id } });
  }, [loadReseller]);

  useEffect(() => {
    if (resultReseller.data) {
      setValues({
        id: resultReseller.data.reseller_by_pk.id,
        fk_user_id: resultReseller.data.reseller_by_pk.fk_user_id,
        biography: resultReseller.data.reseller_by_pk.biography,
        biography_mm: resultReseller.data.reseller_by_pk.biography_mm,
      });
      setTextValue(
        RichTextEditor.createValueFromString(
          resultReseller.data.reseller_by_pk.biography,
          "html"
        )
      );
      setTextValueMM(
        RichTextEditor.createValueFromString(
          resultReseller.data.reseller_by_pk.biography_mm,
          "html"
        )
      );
    }
  }, [resultReseller]);

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
  const [updateReseller] = useMutation(UPDATE_RESELLER, {
    onError: (err) => {
      alert("Error on Server");
      console.log("update Error", err);
    },
    onCompleted: (result) => {
      setValues({});
      setTextValue(RichTextEditor.createEmptyValue());
      alert("Reseller has been updated");
      navigate("/reseller");
    },
    refetchQueries: [ALL_RESELLER, USERID],
  });

  const handleUpdate = async (e) => {
    e.preventDefault();
    await updateReseller({ variables: { ...values } });
  };

  if (!userData) {
    return;
  }
  console.log("values", values);
  return (
    <>
      {/* <Box
        role="presentation"
        sx={{ display: "flex", justifyContent: "space-between", p: 2 }}
      >
        <Typography fontWeight="bold" variant="h6">
          Update Reseller
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
          {/* user id */}
          <Box
            sx={{
              display: "grid",
              gap: "2rem",
            }}
          >
            {values.fk_user_id && (
              <FormControl>
                <InputLabel id="fk_user_id">User Name</InputLabel>
                <Select
                  labelId="fk_user_id"
                  label="User Name"
                  variant="filled"
                  defaultValue=""
                  value={values.fk_user_id}
                  onChange={handleChange("fk_user_id")}
                >
                  <MenuItem value="" disabled>
                    Value
                  </MenuItem>
                  {Array.isArray(userData.users)
                    ? userData.users.map((user) => (
                        <MenuItem key={user.id} value={user.id}>
                          {user.fullname}
                        </MenuItem>
                      ))
                    : null}
                </Select>

                {/* {error.fk_medium_type_id && (
              <FormHelperText error>{error.fk_medium_type_id}</FormHelperText>
            )} */}
              </FormControl>
            )}

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
              </Box>
            </Box>
          </Box>

          <Box display="flex" justifyContent="end" my="2rem">
            <LoadingButton variant="contained" onClick={handleUpdate}>
              Update
            </LoadingButton>
          </Box>
        </CardContent>
      </Card>
    </>
  );
};
export default UpdateReseller;
