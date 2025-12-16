"use client";
import ChatBox from "../../components/ChatBox";
import QuizButton from "../../components/QuizButton";
import QuizDisplay from "../../components/QuizDisplay";
import { useState } from "react";

export default function Page() {
  const [quiz, setQuiz] = useState(null);

  return (
    <section>
      <h1>Ask or Generate Quiz</h1>

      <ChatBox />

      <QuizButton onQuiz={setQuiz} />

      <QuizDisplay quiz={quiz} />
    </section>
  );
}
