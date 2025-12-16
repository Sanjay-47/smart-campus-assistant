export default function QuizDisplay({ quiz }) {
  if (!quiz) return null;

  return (
    <div style={{ marginTop: 20 }}>
      <h2>Generated Quiz</h2>

      {quiz.mcqs && (
        <div>
          <h3>MCQs</h3>
          {quiz.mcqs.map((q, i) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <strong>{i + 1}. {q.question}</strong>
              <ul>
                {q.options.map((op, idx) => <li key={idx}>{op}</li>)}
              </ul>
              <em>Answer: {q.answer}</em>
            </div>
          ))}
        </div>
      )}

      {quiz.short && (
        <div style={{ marginTop: 20 }}>
          <h3>Short Questions</h3>
          {quiz.short.map((q, i) => (
            <p key={i}>
              <strong>{i + 1}. {q.question}</strong><br />
              <em>Answer: {q.answer}</em>
            </p>
          ))}
        </div>
      )}

      {quiz.raw && (
        <pre style={{ background: "#eee", padding: 10 }}>{quiz.raw}</pre>
      )}
    </div>
  );
}
