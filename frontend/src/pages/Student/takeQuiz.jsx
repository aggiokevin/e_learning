import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { quizAPI } from '../../services/api';
import Button from '../../components/Common/Button';
import Card from '../../components/Common/Card';
import { Clock, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const TakeQuiz = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [attemptId, setAttemptId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    fetchQuiz();
    startAttempt();
  }, [quizId]);

  const fetchQuiz = async () => {
    try {
      setLoading(true);
      const response = await quizAPI.getById(quizId);
      setQuiz(response.data);
      
      // Initialiser les réponses
      const initialAnswers = {};
      response.data.questions.forEach((q, idx) => {
        initialAnswers[q.id] = null;
      });
      setAnswers(initialAnswers);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du chargement du quiz');
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  const startAttempt = async () => {
    try {
      const response = await quizAPI.startAttempt(quizId);
      setAttemptId(response.data.attemptId);
      setStartTime(new Date());
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du démarrage de la tentative');
    }
  };

  const handleAnswerChange = (questionId, optionId) => {
    setAnswers({
      ...answers,
      [questionId]: optionId
    });
  };

  const handleSubmit = async () => {
    // Vérifier que toutes les questions sont répondues
    const unanswered = quiz.questions.filter(q => !answers[q.id]);
    if (unanswered.length > 0) {
      toast.error(`Veuillez répondre à toutes les questions (${unanswered.length} manquantes)`);
      return;
    }

    setSubmitting(true);

    try {
      // Convertir les réponses au format attendu
      const formattedAnswers = quiz.questions.map(question => ({
        questionid: question.id,
        selectedoptionid: answers[question.id]
      }));

      const response = await quizAPI.submitAnswers(attemptId, formattedAnswers);
      
      toast.success('Quiz soumis avec succès !');
      
      // Rediriger vers les résultats
      navigate(`/student/quiz-results/${attemptId}`, {
        state: { score: response.data.score, quizTitle: quiz.title }
      });
    } catch (error) {
      console.error('Erreur:', error);
      toast.error(error.response?.data?.error || 'Erreur lors de la soumission du quiz');
    } finally {
      setSubmitting(false);
    }
  };

  const goToQuestion = (index) => {
    setCurrentQuestionIndex(index);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement du quiz...</p>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return null;
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const answeredCount = Object.values(answers).filter(a => a !== null).length;
  const totalQuestions = quiz.questions.length;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">{quiz.title}</h1>
          <p className="text-gray-600 mt-1">{quiz.description}</p>
        </div>

        {/* Progress Bar */}
        <Card className="mb-6 bg-white">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                Progression: {answeredCount}/{totalQuestions} réponses
              </span>
              <span className="text-sm font-medium text-gray-700">
                Question {currentQuestionIndex + 1}/{totalQuestions}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentQuestionIndex + 1) / totalQuestions * 100}%` }}
              />
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Panneau de navigation */}
          <div className="lg:col-span-1">
            <Card className="bg-white sticky top-8">
              <h3 className="font-bold text-gray-900 mb-4">Questions</h3>
              <div className="space-y-2">
                {quiz.questions.map((question, idx) => (
                  <button
                    key={question.id}
                    onClick={() => goToQuestion(idx)}
                    className={`w-full text-left px-4 py-2 rounded-lg font-medium transition ${
                      idx === currentQuestionIndex
                        ? 'bg-primary-600 text-white'
                        : answers[question.id]
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>Q{idx + 1}</span>
                      {answers[question.id] && (
                        <CheckCircle size={16} />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Contenu principal - Question */}
          <div className="lg:col-span-3">
            <Card className="bg-white">
              <div className="space-y-6">
                {/* Texte de la question */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Question {currentQuestionIndex + 1}
                  </h2>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    {currentQuestion.questiontext}
                  </p>
                </div>

                {/* Options */}
                <div className="space-y-3">
                  {currentQuestion.options.map(option => (
                    <label
                      key={option.id}
                      className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition ${
                        answers[currentQuestion.id] === option.id
                          ? 'border-primary-600 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${currentQuestion.id}`}
                        value={option.id}
                        checked={answers[currentQuestion.id] === option.id}
                        onChange={() => handleAnswerChange(currentQuestion.id, option.id)}
                        className="w-5 h-5 text-primary-600 cursor-pointer mt-0.5"
                      />
                      <span className="ml-4 text-gray-700 leading-relaxed">
                        {option.text}
                      </span>
                    </label>
                  ))}
                </div>

                {/* Boutons de navigation */}
                <div className="flex gap-4 pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => goToQuestion(currentQuestionIndex - 1)}
                    disabled={currentQuestionIndex === 0}
                  >
                    Précédent
                  </Button>

                  {currentQuestionIndex < totalQuestions - 1 ? (
                    <Button
                      type="button"
                      variant="primary"
                      onClick={() => goToQuestion(currentQuestionIndex + 1)}
                    >
                      Suivant
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="primary"
                      onClick={handleSubmit}
                      disabled={submitting || answeredCount < totalQuestions}
                      className="flex items-center gap-2"
                    >
                      {submitting ? 'Soumission...' : 'Soumettre le quiz'}
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TakeQuiz;
