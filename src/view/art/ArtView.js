import {
    Breadcrumbs, Button,
    Paper
} from "@mui/material";
import {Link} from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import Divider from "@mui/material/Divider";
import DirectionsIcon from "@mui/icons-material/Directions";
import InputBase from "@mui/material/InputBase";
import ArtData from "../../component/art/ArtData";
import {useState} from "react";
import CreateArt from "../../component/art/CreateArt";

const ArtView = () => {
    const [showCreate, setShowCreate] = useState(false);

    // Start Function
    // => For Create Handle
    const createHandle = () => {
        setShowCreate(!showCreate);
    }

    // End Function

    return(
        <div>
            {/*Start Nav*/}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem"}}>
                <Breadcrumbs aria-labl="breadcrumb" fontWeight="bold" fontSize="1.2rem">
                    <Link to="/" className="dashboard">Dashboard</Link>
                    <span style={{ color: "blue"}}>Art</span>
                </Breadcrumbs>

                {/*Start Search*/}
                <div style={{ display: "flex" }}>
                    <Button variant="contained" sx={{ width: 90, height: 60, p: 1, mr: 2, fontWeight: "bold"}} color="secondary" onClick={createHandle}>Add</Button>

                    <Paper component="form" sx={{ p: "2px 4px", display: "flex", alignItems: "center", width: 350}}>
                        <InputBase id="search-by-artid" sx={{ ml: 1, flex: 1 }} placeholder="Search By Art Id" type="search" />
                        <IconButton type="button" sx={{ p: "10px" }} aria-label="search"><SearchIcon/></IconButton>
                        <Divider sx={{height: 28, m: 0.5 }} orientation="vertical"/>
                        <IconButton sx={{ p: "10px" }} aria-label="directions"><DirectionsIcon/></IconButton>
                    </Paper>
                </div>
                {/*End Search*/}
            </div>
            {/*End Nav*/}

            {/*Start Art Data*/}
            <ArtData/>
            {/*End Art Data*/}

            {
                showCreate && <CreateArt showCreate={showCreate} createHandle={createHandle}/>
            }

        </div>
    );
};

export default ArtView;