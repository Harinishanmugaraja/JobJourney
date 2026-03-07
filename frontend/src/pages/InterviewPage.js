import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { getInterviews } from "../services/interviewService";
import Loader from "../components/Loader";

const InterviewPage = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await getInterviews();
        setInterviews(data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <DashboardLayout title="Interview Schedule Page">
      {loading ? (
        <Loader />
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Company</th>
                <th>Interview Date</th>
                <th>Interview Time</th>
                <th>Meeting Link</th>
              </tr>
            </thead>
            <tbody>
              {interviews.map((item) => (
                <tr key={item.id}>
                  <td>{item.company}</td>
                  <td>{new Date(item.interviewDate).toLocaleDateString()}</td>
                  <td>{item.interviewTime}</td>
                  <td>
                    <a href={item.meetingLink} target="_blank" rel="noreferrer">
                      Join Meeting
                    </a>
                  </td>
                </tr>
              ))}
              {!interviews.length && (
                <tr>
                  <td colSpan={4}>No interviews scheduled.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
};

export default InterviewPage;
