import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import CreateRepSetSchemeForm from "./create-rep-set-scheme";
import RepReport from "./rep-report";
import RepCalendar from "./rep-calendar";
import RepSetSchemes from "./rep-set-scheme";
import { Box } from "@mui/material";
import useApi from "~/hooks/useApi";
import { useQuery } from "@tanstack/react-query";

function Homepage() {

  const { getRepSetSchemes } = useApi();

  // make Api calls, returning data and status
  const { data, status } = useQuery({
    queryKey: ["getRepSetSchemes", 0, 10000, "date", "asc"],
    queryFn: () => getRepSetSchemes(0, 10000, "date", "asc"),
  });

  return (
    <Container maxWidth={false} sx={{ padding: 4 }}>
      <header style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <img
          src="/rep-recorder/barbell.png"
          alt="Rep Recorder Barbell"
          style={{ width: "800px" }}
        />
        <ul style={{ textAlign: "left", fontSize: "12px" }}>
          <li>Git mono-repository stored on github: <a href="https://github.com/wizzard262/rep-recorder/" target="_blank" rel="noopener noreferrer">https://github.com/wizzard262/rep-recorder/</a> </li>
          <li>React 19.2.4 front-end with Mui, Recharts & ReactHotToast (build, Ste:todo:[run Jest/RTL tests], deploy from GitHub Actions)</li>
          <li>Front-end hosted on GitHubPages <a href="https://wizzard262.github.io/rep-recorder/">https://wizzard262.github.io/rep-recorder/</a></li>
          <li>GitHub Pages UI deploy done from GitHub Actions <a href="https://github.com/wizzard262/rep-recorder/actions/workflows/deploy-ui.yml" target="_blank" rel="noopener noreferrer">https://github.com/wizzard262/rep-recorder/actions/workflows/deploy-ui.yml</a><br />
            <i>(~\rep-recorder\.github\workflows\deploy-ui.yml)</i>
          </li>
          <li>C# backend deploy done from from GitHub Actions <a href="https://github.com/wizzard262/rep-recorder/actions/workflows/deploy-api.yml" target="_blank" rel="noopener noreferrer">https://github.com/wizzard262/rep-recorder/actions/workflows/deploy-api.yml</a><br />
            <i>(~\rep-recorder\.github\workflows\deploy-api.yml)</i>
          </li>
          <li>C# .Net 8 Minimal API (build, run unit tests, deploy from GitHub Actions using deploy-api.yml.)</li>
          <li>API Hosted on Azure, with Swagger: <a href="https://reprecorderapi-dfg9f8b8babha5ey.ukwest-01.azurewebsites.net/swagger/index.html" target="_blank" rel="noopener noreferrer">https://reprecorderapi-dfg9f8b8babha5ey.ukwest-01.azurewebsites.net/swagger/index.html</a></li>
          <li>Open API: <a href="https://reprecorderapi-dfg9f8b8babha5ey.ukwest-01.azurewebsites.net/openapi/v1.json" target="_blank" rel="noopener noreferrer">https://reprecorderapi-dfg9f8b8babha5ey.ukwest-01.azurewebsites.net/openapi/v1.json</a></li>
          <li>Local Development fake "in memory" repo</li>
          <li>Cosmos DB (hosted on Azure): <a href="https://azure-cosmos-db-account-steve-jones.documents.azure.com/" target="_blank" rel="noopener noreferrer">https://azure-cosmos-db-account-steve-jones.documents.azure.com/</a></li>
          <li>Application Insights and logging</li>
        </ul>
      </header>

      <Stack component="main" spacing={4} width="100%">
        <RepSetSchemes />
        <Box sx={{ display: "flex", gap: 4 }}>
          <Box sx={{ width: 300 }}>
            <CreateRepSetSchemeForm />
          </Box>
          <Box sx={{ width: 250, textAlign: "left" }}>
            <RepCalendar data={data?.items ?? []} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <RepReport data={data?.items ?? []} />
          </Box>
        </Box>
      </Stack>

      {status === "error" && (
        <p><b>Error loading Rep Set Schemes.</b></p>
      )}

      {status === "success" && (<div></div>)}
    </Container>
  );
}

export default Homepage;
