const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');

const app = new Koa();

app.use(cors());
app.use(bodyParser());

// Define quiz questions and answers
const quiz = [
  {
    question: "What is the capital of France?",
    options: ["Paris", "Berlin", "Madrid", "Rome"],
    correctAnswer: "Paris",
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Earth", "Mars", "Jupiter", "Venus"],
    correctAnswer: "Mars",
  },
  {
    question: "What is the largest ocean on Earth?",
    options: ["Atlantic", "Indian", "Arctic", "Pacific"],
    correctAnswer: "Pacific",
  },
];

// Route to get quiz questions and choices
app.use(async (ctx, next) => {
  if (ctx.method === 'GET' && ctx.url === '/api/quiz') {
    const quizQuestions = quiz.map(({ question, options }) => ({ question, options }));
    ctx.body = { quiz: quizQuestions };
    return;
  }
  
  await next();
});

// Route to check quiz answers
app.use(async (ctx) => {
  if (ctx.method === 'POST' && ctx.url === '/api/quiz') {
    const userAnswers = ctx.request.body.answers;

    if (!Array.isArray(userAnswers) || userAnswers.length !== quiz.length) {
      ctx.status = 400;
      ctx.body = { error: "Invalid quiz submission" };
      return;
    }

    // Check answers
    const results = quiz.map((question, index) => {
      return {
        question: question.question,
        correct: question.correctAnswer === userAnswers[index],
        correctAnswer: question.correctAnswer,
      };
    });

    ctx.body = { results };
  } else {
    ctx.status = 404;
    ctx.body = { error: "Not Found" };
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});