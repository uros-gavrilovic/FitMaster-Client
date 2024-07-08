import { Fragment, useEffect } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useDispatch, useSelector } from "react-redux";
import * as statisticsActions from "../../../../actions/statistics";
import { useTheme } from "@emotion/react";

export default function TotalMembersCard(props) {
  const dispatch = useDispatch();
  const { stats } = useSelector((state) => state.statisticsReducer);

  const theme = useTheme();

  useEffect(() => {
    dispatch(statisticsActions.fetchMembersActivity());
  }, [dispatch]);

  return (
    <Box sx={{ width: "fit-content" }}>
      <Card
        variant="outlined"
        sx={{ borderRadius: "15px", bgcolor: theme.palette.menu.dark }}
      >
        <Fragment>
          <CardContent>
            <Typography variant="h5" component="div">
              Members Activity:
            </Typography>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
              <Typography
                sx={{
                  mb: 1.5,
                  color: "text.secondary",
                  fontSize: "1rem",
                  fontWeight: "bold",
                }}
              >
                ACTIVE
                <br />
                <a style={{ fontSize: "2rem", fontWeight: "bold" }}>
                  {stats?.activeCount}
                </a>
              </Typography>

              <Typography
                sx={{
                  color: "text.secondary",
                  fontSize: "1rem",
                  fontWeight: "bold",
                }}
              >
                INACTIVE
                <br />
                <a style={{ fontSize: "2rem", fontWeight: "bold" }}>
                  {stats?.inactiveCount}
                </a>
              </Typography>
            </div>
          </CardContent>
          <CardActions>
            <Button size="small">Learn More</Button>
          </CardActions>
        </Fragment>
      </Card>
    </Box>
  );
}
