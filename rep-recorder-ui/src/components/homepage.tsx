import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import CreateRepSetSchemeForm from "./create-rep-set-scheme";
import RepReport from "./rep-report";
import RepSetSchemes from "./rep-set-scheme";
import { Box } from "@mui/material";

function Homepage() {
  return (
<Container maxWidth={false} sx={{ padding: 4 }}>
  <header style={{ textAlign: "left" }}>
    <img
      src="src/assets/barbell.png"
      alt="Rep Recorder Barbell"
      style={{ width: "800px" }}
    />
  </header>

  <Stack component="main" spacing={4} width="100%">
    <RepSetSchemes /> 
    <Box sx={{ display: "flex", gap: 4 }}>
      <Box sx={{ width: 300 }}>
        <CreateRepSetSchemeForm />
      </Box>

      <Box sx={{ flex: 1 }}>
        <RepReport />
      </Box>
    </Box>
  </Stack>
</Container>

  );
}

export default Homepage;
