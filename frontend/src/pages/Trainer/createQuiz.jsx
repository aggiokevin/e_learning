import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { quizAPI, coursesAPI } from '../../services/api';
import Button from '../../components/Common/Button';
import Card from '../../components/Common/Card';
import { Plus, Trash2, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const CreateQuiz = () => {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [module, setModule] = useState(null);
  const [quizData, setQuizData] = useState({
    title: '',
    description: '',
    questions: [
      {
        id: 1,
        text: '',
        type: 'singlechoice',
        options: [
          { id: 1, text: '', isCorrect: false },
          { id: 2, text: '', isCorrect: true }
        ]
      }
    ]
  });

  const questionTypes = [
    { value: 'singlechoice', label: 'Choix unique' },
    { value: 'multiplechoice', label: 'Choix multiples' },
    { value: 'shorttext', label: 'Réponse courte' }
  ];

  const handleQuizChange = (e) => {
    setQuizData({
      ...quizData,
      [e.target.name]: e.target.value
    });
  };

  const handleQuestionChange = (questionIndex, field, value) => {
    const newQuestions = [...quizData.questions];
    newQuestions[questionIndex][field] = value;
    setQuizData({ ...quizData, questions: newQuestions });
  };

  const handleOptionChange = (questionIndex, optionIndex, field, value) => {
    const newQuestions = [...quizData.questions];
    if (field === 'isCorrect') {
      // Pour choix unique, une seule option correcte
      if (quizData.questions[questionIndex].type === 'singlechoice') {
        newQuestions[questionIndex].options.forEach((opt, idx) => {
          opt.isCorrect = idx === optionIndex;
        });
      } else {
        newQuestions[questionIndex].options[optionIndex][field] = value;
      }
    } else {
      newQuestions[questionIndex].options[optionIndex][field] = value;
    }
    setQuizData({ ...quizData, questions: newQuestions });
  };

  const addQuestion = () => {
    const newQuestion = {
      id: Math.max(...quizData.questions.map(q => q.id)) + 1,
      text: '',
      type: 'singlechoice',
      options: [
        { id: 1, text: '', isCorrect: false },
        { id: 2, text: '', isCorrect: true }
      ]
    };
    setQuizData({
      ...quizData,
      questions: [...quizData.questions, newQuestion]
    });
  };

  const removeQuestion = (questionIndex) => {
    setQuizData({
      ...quizData,
      questions: quizData.questions.filter((_, idx) => idx !== questionIndex)
    });
  };

  const addOption = (questionIndex) => {
    const newQuestions = [...quizData.questions];
    const maxId = Math.max(...newQuestions[questionIndex].options.map(o => o.id));
    newQuestions[questionIndex].options.push({
      id: maxId + 1,
      text: '',
      isCorrect: false
    });
    setQuizData({ ...quizData, questions: newQuestions });
  };

  const removeOption = (questionIndex, optionIndex) => {
    const newQuestions = [...quizData.questions];
    newQuestions[questionIndex].options = newQuestions[questionIndex].options.filter(
      (_, idx) => idx !== optionIndex
    );
    setQuizData({ ...quizData, questions: newQuestions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!quizData.title.trim()) {
      toast.error('Le titre du quiz est requis');
      return;
    }

    if (quizData.questions.length === 0) {
      toast.error('Ajoutez au moins une question');
      return;
    }

    // Valider chaque question
    for (let i = 0; i < quizData.questions.length; i++) {
      const q = quizData.questions[i];
      if (!q.text.trim()) {
        toast.error(`La question ${i + 1} est vide`);
        return;
      }
      if (q.options.length < 2) {
        toast.error(`La question ${i + 1} doit avoir au moins 2 options`);
        return;
      }
      if (!q.options.some(opt => opt.isCorrect)) {
        toast.error(`La question ${i + 1} doit avoir au moins une réponse correcte`);
        return;
      }
      for (let j = 0; j < q.options.length; j++) {
        if (!q.options[j].text.trim()) {
          toast.error(`L'option ${j + 1} de la question ${i + 1} est vide`);
          return;
        }
      }
    }

    setLoading(true);

    try {
      const payload = {
        moduleid: parseInt(moduleId),
        title: quizData.title,
        description: quizData.description,
        questions: quizData.questions.map(q => ({
          text: q.text,
          type: q.type,
          options: q.options.map(opt => ({
            text: opt.text,
            isCorrect: opt.isCorrect
          }))
        }))
      };

      await quizAPI.create(payload);
      toast.success('Quiz créé avec succès !');
      navigate(`/trainer/modules/${moduleId}`);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error(error.response?.data?.error || 'Erreur lors de la création du quiz');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Créer un quiz</h1>
          <p className="text-gray-600 mt-1">Créez un quiz pour tester vos étudiants</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informations du quiz */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Informations du quiz</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titre du quiz
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={quizData.title}
                    onChange={handleQuizChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="Ex: Quiz sur les bases de React"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (optionnel)
                  </label>
                  <textarea
                    name="description"
                    value={quizData.description}
                    onChange={handleQuizChange}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="Décrivez votre quiz..."
                  />
                </div>
              </div>
            </div>

            {/* Questions */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Questions</h2>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={addQuestion}
                  className="flex items-center gap-2"
                >
                  <Plus size={20} />
                  Ajouter une question
                </Button>
              </div>

              <div className="space-y-6">
                {quizData.questions.map((question, qIndex) => (
                  <Card key={question.id} className="bg-gray-50 border border-gray-200">
                    <div className="space-y-4">
                      {/* Texte de la question */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Question {qIndex + 1}
                          </label>
                          {quizData.questions.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeQuestion(qIndex)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                        </div>
                        <textarea
                          value={question.text}
                          onChange={(e) => handleQuestionChange(qIndex, 'text', e.target.value)}
                          rows="2"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                          placeholder="Posez votre question..."
                          required
                        />
                      </div>

                      {/* Type de question */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Type
                          </label>
                          <select
                            value={question.type}
                            onChange={(e) => handleQuestionChange(qIndex, 'type', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                          >
                            {questionTypes.map(type => (
                              <option key={type.value} value={type.value}>
                                {type.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Options */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <label className="block text-sm font-medium text-gray-700">
                            Options
                          </label>
                          <button
                            type="button"
                            onClick={() => addOption(qIndex)}
                            className="text-primary-600 hover:text-primary-700 flex items-center gap-1"
                          >
                            <Plus size={16} />
                            <span className="text-sm">Ajouter une option</span>
                          </button>
                        </div>

                        <div className="space-y-3">
                          {question.options.map((option, oIndex) => (
                            <div key={option.id} className="flex items-center gap-3">
                              <input
                                type={question.type === 'singlechoice' ? 'radio' : 'checkbox'}
                                checked={option.isCorrect}
                                onChange={(e) =>
                                  handleOptionChange(qIndex, oIndex, 'isCorrect', e.target.checked)
                                }
                                className="w-4 h-4 text-primary-600 cursor-pointer"
                              />
                                                            <input
                                type="text"
                                value={option.text}
                                onChange={(e) =>
                                  handleOptionChange(qIndex, oIndex, 'text', e.target.value)
                                }
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                placeholder="Entrez une option..."
                                required
                              />
                              {question.options.length > 2 && (
                                <button
                                  type="button"
                                  onClick={() => removeOption(qIndex, oIndex)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 size={18} />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex gap-4 border-t pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={loading}
                className="flex items-center gap-2"
              >
                <Save size={20} />
                {loading ? 'Création...' : 'Créer le quiz'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default CreateQuiz;

