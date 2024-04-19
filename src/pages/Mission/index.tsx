import { Divider } from "@mui/material";

import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

import "./index.sass";
import "./media.sass";
import sofia_k_KPI_graphic from "./sofia_k_KPI_graphic.jpg";

export default function Mission() {
  return (
    <main id="Mission">
      <h1>Our Mission</h1>

      <div id="Mission__grid">
        <div id="Mission__info">
          <h2>Our Purpose</h2>

          <p>
            One Step Ahead Culver City was founded in 2023 by Culver City High
            School students to address the socioeconomic achievement gap in the
            Culver City Unified School District. Statistically, students who are
            socioeconomically disadvantaged in our district are more likely to
            have lower test scores, fall behind in school, and potentially fail
            or drop out.
          </p>

          <Zoom wrapElement="span">
            <img
              alt="District KPI statistics"
              width="80%"
              src={sofia_k_KPI_graphic}
            />
          </Zoom>

          <p>
            A student's success should not be determined by factors outside of
            their control. Our organization is working to change this narrative,
            by helping students who are struggling in school but do not have the
            resources to seek outside help. The focus is on early intervention,
            helping elementary students catch up before they lose their learning
            motivation or are tracked on paths toward lower academic success.
            Through one-on-one remote peer mentoring, we aim to provide our
            students with role models that will help them stay one step ahead in
            their education.
          </p>

          <Divider style={{ margin: "1rem 0" }} />

          <h2>What We Do</h2>

          <p>
            One Step Ahead Culver City works with 2nd-5th grade students from
            all five CCUSD elementary schools, who are recommended by their
            teacher or their school's MTSS (Multi-Tiered System of Supports)
            specialist. Depending on their needs, students are then paired with
            a reading or math mentor from Culver City High School and meet every
            week (primarily on Zoom). Each student's individual needs are met
            through One Step Ahead's unique curriculum and resources developed
            by our team, with the help of educational professionals. Usual
            activities range from math and vocabulary games to plot discussion,
            sentence structure breakdown, and word problem strategies.
          </p>

          <Divider style={{ margin: "1rem 0" }} />

          <h2>Sources</h2>
          <blockquote>
            “English Language Arts/Literacy and Mathematics Smarter Balanced
            Summative Assessments.” 2022–23 Smarter Balanced ELA and Mathematics
            Test Results at a Glance - CAASPP Reporting (CA Dept of Education),
            Califronia Assessment of Student Performance and Progress,
            caaspp-elpac.ets.org/caaspp/DashViewReportSB?ps=true&lstTestYear=2023&lstTestType=B&lstGroup=1&lstSubGroup=1&lstGrade=13&lstSchoolType=A&lstCounty=19&lstDistrict=64444-000&lstSchool=0000000&lstFocus=a.
            Accessed 16 Feb. 2024.
          </blockquote>
        </div>

        <div id="Mission__img-wrapper">
          {/* <img alt="logo" src={contactimg} /> */}
        </div>
      </div>
    </main>
  );
}
