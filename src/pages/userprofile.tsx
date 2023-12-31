// User profile page where the user can see his/her posts.
// User can logout of the account from this page.

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import Post_card from "../components/Post_card";
import api from "../api";

interface User {
  _id: string;
  username: string;
}

interface Question {
  _id: string;
  title: string;
  description: string;
  author: string;
  userId: string;
  createdDate: string;
}

function UserProfile() {
  let { userId } = useParams();
  console.log("userId", userId);

  const [user, setUser] = useState<User | null>(null);
  const [userQuestions, setUserQuestions] = useState<Question[]>([]);

  const history = useNavigate();
  const userName = localStorage.getItem("userName");
  const handleLogout = () => {
    localStorage.clear();
    // Redirect to the login page
    history("/login");
  };

  // Fetch the post of the relevant user from the server
  useEffect(() => {
    api.get("/auth/all").then((response) => {
      setUser(
        response.data.find((user: { _id: string }) => user._id === userId) ||
          null
      );
    });
    api.get("/question/adminApproved").then((response) => {
      setUserQuestions(
        response.data.filter(
          (question: { authorId: string }) => question.authorId === userId
        )
      );
    });
  }, [userId]);

  if (!user) {
    return <div>User not found.</div>;
  }

  return (
    <>
      <Navbar />
      <div className="p-4">
        <div className="p-4 text-center">
          <h2 className="text-2xl font-bold mb-4">
            User Profile: {userName ? userName.toUpperCase() : "ANOYMOUS"}
          </h2>
          <h3 className="text-xl font-bold mb-2">
            Total Number of Posts: {userQuestions.length}
          </h3>
          <div className="flex flex-col mx-auto max-w-xl">
            {userQuestions.length === 0 ? (
              <p>No questions available.</p>
            ) : (
              <div className="">
                {userQuestions.map((question) => (
                  <Post_card
                    key={question._id}
                    postDetails={question}
                    userProf={true}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
        {/* <div className="text-center mt-4"> */}
        <div className="fixed bottom-5 end-5">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-md"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
}

export default UserProfile;
