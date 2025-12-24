import React, { useState } from 'react';
import Button from '../Common/Button';

const QuizQuestion = ({ question, onAnswer, questionNumber, totalQuestions }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [textAnswer, setTextAnswer] = useState('');

  const handleOptionSelect = (optionId) => {
    if (question.type === 'single_choice') {
      setSelectedOptions([optionId]);
    } else if (question.type === 'multiple_choice') {
      setSelectedOptions(prev =>
        prev.includes(optionId)
          ? prev.filter(id => id !== optionId)
          : [...prev, optionId]
      );
    }
  };

  const handleSubmit = () => {
    if (question.type === 'short_text') {
      onAnswer({ question_id: question.id, answer_text: textAnswer });
    } else {
      selectedOptions.forEach(optionId => {
        onAnswer({ question_id: question.id, selected_option_id: optionId });
      });
    }
  };

  const canSubmit = question.type === 'short_text' 
    ? textAnswer.trim().length > 0 
    : selectedOptions.length > 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-4">
        <span className="text-sm text-gray-500">
          Question {questionNumber} / {totalQuestions}
        </span>
      </div>

      <h3 className="text-xl font-semibold text-gray-900 mb-6">
        {question.question_text}
      </h3>

      {question.type === 'short_text' ? (
        <textarea
          value={textAnswer}
          onChange={(e) => setTextAnswer(e.target.value)}
          className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          rows="4"
          placeholder="Votre réponse..."
        />
      ) : (
        <div className="space-y-3">
          {question.options?.map((option) => (
            <button
              key={option.id}
              onClick={() => handleOptionSelect(option.id)}
              className={`w-full text-left p-4 border-2 rounded-lg transition-colors ${
                selectedOptions.includes(option.id)
                  ? 'border-primary-600 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                  selectedOptions.includes(option.id)
                    ? 'border-primary-600 bg-primary-600'
                    : 'border-gray-300'
                }`}>
                  {selectedOptions.includes(option.id) && (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  )}
                </div>
                <span className="text-gray-700">{option.option_text}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      <div className="mt-6">
        <Button
          onClick={handleSubmit}
          disabled={!canSubmit}
          variant="primary"
          className="w-full"
        >
          Valider la réponse
        </Button>
      </div>
    </div>
  );
};

export default QuizQuestion;
