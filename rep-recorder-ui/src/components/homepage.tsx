import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import CreateRepSetSchemeForm from "./create-rep-set-scheme";
import RepReport from "./rep-report";
import RepCalendar from "./rep-calendar";
import RepSetSchemes from "./rep-set-scheme";
import GarySlogans from "./gary-slogans";
import FullData from "./full-data";
import useApi from "~/hooks/useApi";
import { useQuery } from "@tanstack/react-query";

function Homepage() {

  const { getRepSetSchemes } = useApi();

  // make Api calls, returning data and status
  const { data, status } = useQuery({
    queryKey: ["getRepSetSchemes", 0, 10000, "date", "asc"],
    queryFn: () => getRepSetSchemes(0, 10000, "date", "asc"),
  });

  const items = data?.items ?? [];

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 }, px: { xs: 2, md: 4 } }}>
      <Stack spacing={3}>
        <header className="site-header card">
          <div className="brand">
            <img
              className="logo"
              src={`${import.meta.env.BASE_URL}barbell.png`}
              alt="Rep Recorder Barbell"
            />
            <GarySlogans />
          </div>
          <div className="about">
            <h2>About this build</h2>
            <ul className="tech-list">
              <li>Git mono-repository stored on github: <a href="https://github.com/wizzard262/rep-recorder/" target="_blank" rel="noopener noreferrer">https://github.com/wizzard262/rep-recorder/</a> </li>
              <li>React 19.2.4 front-end with Mui, Recharts & ReactHotToast (build, Ste:todo:[run Jest/RTL tests], deploy from GitHub Actions)</li>
              <li>Front-end hosted on GitHubPages <a href="https://wizzard262.github.io/rep-recorder/">https://wizzard262.github.io/rep-recorder/</a></li>
              <li>GitHub Pages UI deploy done from GitHub Actions <a href="https://github.com/wizzard262/rep-recorder/actions/workflows/deploy-ui.yml" target="_blank" rel="noopener noreferrer">https://github.com/wizzard262/rep-recorder/actions/workflows/deploy-ui.yml</a>{" "}
                <i>(~\rep-recorder\.github\workflows\deploy-ui.yml)</i>
              </li>
              <li>C# backend deploy done from from GitHub Actions <a href="https://github.com/wizzard262/rep-recorder/actions/workflows/deploy-api.yml" target="_blank" rel="noopener noreferrer">https://github.com/wizzard262/rep-recorder/actions/workflows/deploy-api.yml</a>{" "}
                <i>(~\rep-recorder\.github\workflows\deploy-api.yml)</i>
              </li>
              <li>C# .Net 8 Minimal API (build, run unit tests, deploy from GitHub Actions using deploy-api.yml.)</li>
              <li>API Hosted on Azure, with Swagger: <a href="https://reprecorderapi-dfg9f8b8babha5ey.ukwest-01.azurewebsites.net/swagger/index.html" target="_blank" rel="noopener noreferrer">https://reprecorderapi-dfg9f8b8babha5ey.ukwest-01.azurewebsites.net/swagger/index.html</a></li>
              <li>Open API: <a href="https://reprecorderapi-dfg9f8b8babha5ey.ukwest-01.azurewebsites.net/openapi/v1.json" target="_blank" rel="noopener noreferrer">https://reprecorderapi-dfg9f8b8babha5ey.ukwest-01.azurewebsites.net/openapi/v1.json</a></li>
              <li>Local Development fake "in memory" repo</li>
              <li>Cosmos DB (hosted on Azure): <a href="https://azure-cosmos-db-account-steve-jones.documents.azure.com/" target="_blank" rel="noopener noreferrer">https://azure-cosmos-db-account-steve-jones.documents.azure.com/</a></li>
              <li>Application Insights and logging</li>
            </ul>
          </div>
        </header>

        {status === "error" && (
          <Alert severity="error">Error loading Rep Set Schemes.</Alert>
        )}

        <Box component="main" sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <section className="card">
            <RepCalendar data={items} />
          </section>

          <Box sx={{ display: "grid", gap: 3, gridTemplateColumns: { xs: "1fr", md: "320px 1fr" }, alignItems: "start" }}>
            <section className="card">
              <CreateRepSetSchemeForm />
            </section>
            <section className="card">
              <RepReport data={items} />
            </section>
          </Box>

          <section className="card">
            <RepSetSchemes />
          </section>

          <section className="card">
            <FullData data={items} />
          </section>
        </Box>
      </Stack>
    </Container>
  );
}

export default Homepage;
