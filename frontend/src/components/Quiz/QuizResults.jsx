import React from 'react';
import { CheckCircle, XCircle, Award, RotateCcw } from 'lucide-react';
import Button from '../Common/Button';
import Card from '../Common/Card';

const QuizResults = ({ score, correctCount, total, onRetry, onContinue }) => {
  const percentage = Math.round(score);
  const passed = percentage >= 70;

  return (
    <Card className="text-center">
      <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-6 ${
        passed ? 'bg-green-100' : 'bg-red-100'
      }`}>
        {passed ? (
          <Award size={48} className="text-green-600" />
        ) : (
          <XCircle size={48} className="text-red-600" />
        )}
      </div>

      <h2 className="text-3xl font-bold text-gray-900 mb-2">
        {passed ? 'Félicitations !' : 'Vous pouvez mieux faire'}
      </h2>
      
      <p className="text-gray-600 mb-8">
        {passed 
          ? 'Vous avez réussi le quiz avec succès !'
          : 'Continuez vos efforts, vous y arriverez !'}
      </p>

      <div className="bg-gray-50 rounded-lg p-8 mb-8">
        <div className="text-6xl font-bold text-primary-600 mb-2">
          {percentage}%
        </div>
        <div className="text-gray-600">
          {correctCount} sur {total} réponses correctes
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-green-600">{correctCount}</div>
          <div className="text-sm text-gray-600">Correctes</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-red-600">{total - correctCount}</div>
          <div className="text-sm text-gray-600">Incorrectes</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-primary-600">{total}</div>
          <div className="text-sm text-gray-600">Total</div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        {onRetry && (
          <Button
            onClick={onRetry}
            variant="outline"
            className="flex items-center justify-center"
          >
            <RotateCcw size={20} className="mr-2" />
            Réessayer
          </Button>
        )}
        {onContinue && (
          <Button
            onClick={onContinue}
            variant={passed ? 'primary' : 'coral'}
          >
            Continuer le cours
          </Button>
        )}
      </div>
    </Card>
  );
};

export default QuizResults;
