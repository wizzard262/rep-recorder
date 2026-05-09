import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import CreateRepSetSchemeForm from "./create-rep-set-scheme";
import RepReport from "./rep-report";
import RepSetSchemes from "./rep-set-scheme";
import { Box } from "@mui/material";

function Homepage() {
  return (
<Container maxWidth={false} sx={{ padding: 4 }}>
  <header style={{ display: "flex", alignItems: "center", gap: "20px" }}>
    <img
      src="src/assets/barbell.png"
      alt="Rep Recorder Barbell"
      style={{ width: "800px" }}
    />
    <ul style={{ textAlign: "left" }}>
      <li>Git Monorepo stored on github</li>
      <li>React 19.2.4 front-end (ste:todo: hosted on GitHubPages, build & deploy from GitHub Actions, ste:todo: add Jest & React Testing Library (RTL) tests)</li>
      <li>C# .Net 10 API (hosted on Azure, build & deploy from GitHub Actions, running Unit Tests using deploy-api.yml)</li>
      <li>Cosmos DB (hosted on Azure)</li>
    </ul>
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
