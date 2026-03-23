import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { getInterviews } from "../services/interviewService";
import Loader from "../components/Loader";
import { NO_AVAILABLE_DETAILS_MESSAGE } from "../utils/messages";

const InterviewPage = ({ setToast }) => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await getInterviews();
        console.log("[InterviewPage] Interviews API response:", data);
        setInterviews(data);
        if (!data.length) {
          console.warn("[InterviewPage] No interviews returned from backend.");
        }
      } catch (error) {
        console.error("[InterviewPage] Failed to load interviews:", error);
        setToast?.({ type: "error", message: "Unable to load interviews." });
        setInterviews([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [setToast]);

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
                  <td>{item.company || NO_AVAILABLE_DETAILS_MESSAGE}</td>
                  <td>
                    {item.interviewDate
                      ? new Date(item.interviewDate).toLocaleDateString()
                      : NO_AVAILABLE_DETAILS_MESSAGE}
                  </td>
                  <td>{item.interviewTime || NO_AVAILABLE_DETAILS_MESSAGE}</td>
                  <td>
                    {item.meetingLink ? (
                      <a href={item.meetingLink} target="_blank" rel="noreferrer">
                        Join Meeting
                      </a>
                    ) : (
                      NO_AVAILABLE_DETAILS_MESSAGE
                    )}
                  </td>
                </tr>
              ))}
              {!interviews.length && (
                <tr>
                  <td colSpan={4}>{NO_AVAILABLE_DETAILS_MESSAGE}</td>
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
