import { Button, Divider } from "@mui/material";
import "./index.sass";
import "./media.sass";

import robert from "./robert.jpg";

export default function Join() {
  return (
    <main id="Join">
      <h1>Become a Mentor</h1>

      <div id="Join__grid" className="Join__mx">
        <div id="Join__info">
          <h2>Hey You! &#x1FAF5;</h2>
          Are you a student at Culver City High School looking to create
          meaningful change in your community? Apply to become a mentor today!
        </div>
      </div>

      <Divider style={{ margin: "1rem 0" }}>
        <span id="Join__sounds-cool">Sounds cool!</span>
        What do I need to know?
      </Divider>

      <div id="Join__overview" className="Join__mx">
        <div>
          <h2>What is Mentoring?</h2>

          <div>
            Our program's foundation is our mentors; they are the ones creating
            the real change for CCUSD. Mentors are expected to meet every week
            for 30 to 60 minutes with their student, spend time preparing for
            their sessions, practice consistent communication with their
            student's parent and their club leadership, and attend two club
            meetings a month (one general meeting, one guest speaker). Mentoring
            is a great way to create significant change in the community (and
            get service hours!) at the time that is convenient for you; mentors
            can choose to schedule their sessions at whatever time works best
            for them.
          </div>
        </div>
        <div>
          <h2>How to Apply</h2>

          <div>
            CCHS students can apply to mentor for One Step Ahead by filling out
            the form linked below. Applications are reviewed on a rolling basis;
            applicants should hear back within two weeks whether or not they
            will advance to the last stage of the application process, a casual
            interview with program leadership. We take great pride in having a
            team of high-achieving leaders dedicated to making the world a
            better place. We hold our mentors to a high standard &mdash; we are
            looking for committed, responsible, creative, and resilient
            applicants.
            <Button
              id="Join__btn"
              variant="contained"
              href="https://bit.ly/osatutorapp"
              target="_blank"
            >
              bit.ly/osatutorapp
            </Button>
            .
          </div>
        </div>
      </div>

      <Divider style={{ margin: "1rem 0" }} />

      <div id="Join__bottom-img">
        <img alt="Robert tutoring a student" src={robert}></img>
      </div>
    </main>
  );
}
